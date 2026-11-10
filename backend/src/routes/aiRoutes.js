const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { aiLimiter } = require('../middleware/rateLimiter');
const { validateAiAssessPayload } = require('../middleware/validator');

// POST /api/ai/assess-property - trigger AI safety evaluation
router.post('/assess-property', aiLimiter, validateAiAssessPayload, aiController.assessProperty);

module.exports = router;

