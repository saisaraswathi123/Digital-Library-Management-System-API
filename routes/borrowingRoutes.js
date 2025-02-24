const express = require('express');
const { getBorrowings, createBorrowing, returnBook, getOverdueBorrowings, getMemberBorrowings } = require('../controllers/borrowingController');
const auth = require('../middlewares/auth'); // Import authentication middleware

const router = express.Router();

router.get('/', auth, getBorrowings); // Protected: Requires JWT
router.post('/', auth, createBorrowing); // Protected: Requires JWT
router.put('/:id/return', auth, returnBook); // Protected: Requires JWT
router.get('/overdue', auth, getOverdueBorrowings); // Protected: Requires JWT
router.get('/member/:memberId', auth, getMemberBorrowings); // Protected: Requires JWT

module.exports = router;
