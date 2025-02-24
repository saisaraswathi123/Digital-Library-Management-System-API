const { ReadingProgress, Borrowing } = require('../models');
const Joi = require('joi');

// 📌 Joi Schema for Reading Progress Validation
const readingProgressSchema = Joi.object({
    borrowingId: Joi.string().required(),
    currentPage: Joi.number().integer().min(1).required(),
    readingTime: Joi.number().integer().min(0).required(),
    notes: Joi.string().allow('').optional(),
});

// 📌 Get reading progress
exports.getReadingProgress = async (req, res) => {
    try {
        const progress = await ReadingProgress.findAll({
            where: { borrowingId: req.params.borrowingId },
            order: [['lastReadDate', 'DESC']]
        });

        if (!progress.length) {
            return res.status(404).json({ message: "No reading progress found for this borrowing record" });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Update reading progress with validation
exports.updateReadingProgress = async (req, res) => {
    try {
        // Validate request body
        const { error } = readingProgressSchema.validate(req.body);
        if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

        const { borrowingId, currentPage, readingTime, notes } = req.body;

        const borrowing = await Borrowing.findByPk(borrowingId);
        if (!borrowing || borrowing.status !== "active") {
            return res.status(400).json({ message: "Invalid borrowing record" });
        }

        const progress = await ReadingProgress.create({
            borrowingId,
            currentPage,
            lastReadDate: new Date(),
            readingTime,
            notes
        });

        res.status(201).json({ message: "Reading progress updated successfully", progress });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Get member’s reading analytics
exports.getReadingAnalytics = async (req, res) => {
    try {
        const { memberId } = req.params;

        const analytics = await ReadingProgress.findAll({
            include: {
                model: Borrowing,
                where: { memberId }
            },
            order: [['lastReadDate', 'DESC']]
        });

        if (!analytics.length) {
            return res.status(404).json({ message: "No reading analytics found for this member" });
        }

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
