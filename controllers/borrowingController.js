const { Borrowing, Book, Member } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

// 📌 Joi Schema for Borrowing Validation
const borrowingSchema = Joi.object({
    bookId: Joi.string().required(),
    memberId: Joi.string().required(),
    borrowDate: Joi.date().required(),
    dueDate: Joi.date().min(Joi.ref('borrowDate')).required(),
});

// 📌 List all borrowings with pagination
exports.getBorrowings = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const borrowings = await Borrowing.findAndCountAll({
            limit: parseInt(limit) || 10,
            offset: ((parseInt(page) || 1) - 1) * (parseInt(limit) || 10),
            include: [Book, Member],
            order: [['borrowDate', 'DESC']]
        });

        res.json({
            total: borrowings.count,
            totalPages: Math.ceil(borrowings.count / limit),
            currentPage: parseInt(page) || 1,
            borrowings: borrowings.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Create new borrowing with validation
exports.createBorrowing = async (req, res) => {
    try {
        // Validate request body
        const { error } = borrowingSchema.validate(req.body);
        if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

        const { bookId, memberId, borrowDate, dueDate } = req.body;

        const book = await Book.findByPk(bookId);
        if (!book || book.availableCopies < 1) {
            return res.status(400).json({ message: "Book not available" });
        }

        const borrowing = await Borrowing.create({ bookId, memberId, borrowDate, dueDate, status: "active" });

        // Reduce available copies
        await book.update({ availableCopies: book.availableCopies - 1 });

        res.status(201).json({ message: "Borrowing recorded successfully", borrowing });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Process return of a book
exports.returnBook = async (req, res) => {
    try {
        const borrowing = await Borrowing.findByPk(req.params.id);
        if (!borrowing || borrowing.status !== "active") {
            return res.status(400).json({ message: "Invalid borrowing record or book already returned" });
        }

        borrowing.status = "returned";
        borrowing.returnDate = new Date();
        await borrowing.save();

        // Increase available copies
        const book = await Book.findByPk(borrowing.bookId);
        await book.update({ availableCopies: book.availableCopies + 1 });

        res.json({ message: "Book returned successfully", borrowing });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Get overdue borrowings
exports.getOverdueBorrowings = async (req, res) => {
    try {
        const today = new Date();
        const overdueBorrowings = await Borrowing.findAll({
            where: {
                dueDate: { [Op.lt]: today },
                status: "active"
            },
            include: [Book, Member]
        });

        if (!overdueBorrowings.length) {
            return res.status(404).json({ message: "No overdue borrowings found" });
        }

        res.json(overdueBorrowings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Get borrowings by member ID
exports.getMemberBorrowings = async (req, res) => {
    try {
        const borrowings = await Borrowing.findAll({
            where: { memberId: req.params.memberId },
            include: [Book]
        });

        if (!borrowings.length) {
            return res.status(404).json({ message: "No borrowings found for this member" });
        }

        res.json(borrowings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
