const express = require('express');
const { getMembers, getMemberById, addMember, updateMember, getMemberHistory, login } = require('../controllers/memberController');
const auth = require('../middlewares/auth'); // Import authentication middleware

const router = express.Router();

router.post('/login', login); // Public Route
router.get('/', auth, getMembers); // Protected: Requires JWT
router.get('/:id', auth, getMemberById); // Protected: Requires JWT
router.post('/', addMember); // Public: Member registration
router.put('/:id', auth, updateMember); // Protected: Requires JWT
router.get('/:id/history', auth, getMemberHistory); // Protected: Requires JWT

module.exports = router;
