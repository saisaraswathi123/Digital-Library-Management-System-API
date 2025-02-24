const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Member, Borrowing } = require('../models');
const Joi = require('joi');

// 📌 Joi Schema for Member Validation
const memberSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    membershipType: Joi.string().valid('standard', 'premium').required(),
    joinDate: Joi.date().required(),
    status: Joi.string().valid('active', 'suspended').default('active'),
});

// 📌 Login Member and Generate JWT Token
exports.login = async (req, res) => {
    try {
        const { email } = req.body;
        const member = await Member.findOne({ where: { email } });

        if (!member) return res.status(404).json({ message: 'User not found' });

        // Hardcoded JWT secret key
        const secretKey = "dlb"; 

        // Generate token
        const token = jwt.sign({ id: member.id }, secretKey, { expiresIn: '1h' });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 List members with pagination
exports.getMembers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const members = await Member.findAndCountAll({
            limit: parseInt(limit) || 10,
            offset: ((parseInt(page) || 1) - 1) * (parseInt(limit) || 10),
            order: [['joinDate', 'DESC']]
        });

        res.json({
            total: members.count,
            totalPages: Math.ceil(members.count / limit),
            currentPage: parseInt(page) || 1,
            members: members.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Get member details with current borrowings
exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, { include: Borrowing });
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Register a new member with validation
exports.addMember = async (req, res) => {
    try {
        // Validate request body
        const { error } = memberSchema.validate(req.body);
        if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

        // Create a new member
        const newMember = await Member.create(req.body);

        // Use the same hardcoded secret key
        const secretKey = "dlb";  
        const token = jwt.sign({ id: newMember.id }, secretKey, { expiresIn: '1h' });

        res.status(201).json({
            message: "Member registered successfully",
            newMember,
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// 📌 Update member details with validation
exports.updateMember = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        // Validate request body
        const { error } = memberSchema.validate(req.body, { allowUnknown: true });
        if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

        await member.update(req.body);
        res.json({ message: 'Member updated successfully', member });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Get borrowing history
exports.getMemberHistory = async (req, res) => {
    try {
        const history = await Borrowing.findAll({ where: { memberId: req.params.id }, order: [['borrowDate', 'DESC']] });

        if (!history.length) return res.status(404).json({ message: "No borrowing history found for this member" });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
