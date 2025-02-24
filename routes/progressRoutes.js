const express = require('express');
const { getReadingProgress, updateReadingProgress, getReadingAnalytics } = require('../controllers/progressController');
const auth = require('../middlewares/auth'); // Import authentication middleware

const router = express.Router();

router.get('/:borrowingId', auth, getReadingProgress); // Protected
router.post('/', auth, updateReadingProgress); // Protected
router.get('/analytics/member/:memberId', auth, getReadingAnalytics); // Protected

module.exports = router;
