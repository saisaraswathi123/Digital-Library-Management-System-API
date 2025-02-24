const { Book } = require('../models');
const Joi = require('joi');

// 📌 Joi Schema for Book Validation
const bookSchema = Joi.object({
    isbn: Joi.string().required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    publicationYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    totalCopies: Joi.number().integer().min(1).required(),
    availableCopies: Joi.number().integer().min(0).required(),
});

// 📌 List all books with pagination and filters
exports.getBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10, genre } = req.query;
        const options = {
            limit: parseInt(limit) || 10,
            offset: ((parseInt(page) || 1) - 1) * (parseInt(limit) || 10),
            where: genre ? { genre } : {},
            order: [['title', 'ASC']],
        };

        const books = await Book.findAndCountAll(options);
        res.json({
            total: books.count,
            totalPages: Math.ceil(books.count / options.limit),
            currentPage: parseInt(page) || 1,
            books: books.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Get book details with availability
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Add a new book with validation
exports.addBook = async (req, res) => {
    try {
        // Validate request body
        const { error } = bookSchema.validate(req.body);
        if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Update book details
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Validate request body
        const { error } = bookSchema.validate(req.body, { allowUnknown: true });
        if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

        await book.update(req.body);
        res.json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Get books by genre
exports.getBooksByGenre = async (req, res) => {
    try {
        const books = await Book.findAll({ where: { genre: req.params.genre } });
        if (!books.length) return res.status(404).json({ message: 'No books found for this genre' });

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
