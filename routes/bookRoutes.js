const express = require('express');
const { getBooks, getBookById, addBook, updateBook, getBooksByGenre } = require('../controllers/bookController');
const auth = require('../middlewares/auth'); // Import authentication middleware

const router = express.Router();

router.get('/', getBooks); // Public: Anyone can view books
router.get('/:id', getBookById); // Public: Anyone can view books
router.post('/', auth, addBook); // Protected: Only logged-in users can add books
router.put('/:id', auth, updateBook); // Protected: Only logged-in users can update books
router.get('/genre/:genre', getBooksByGenre); // Public

module.exports = router;
