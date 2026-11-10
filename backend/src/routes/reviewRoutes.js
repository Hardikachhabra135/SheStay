const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { validatePropertyId } = require('../middleware/validator');

// GET /api/reviews/:propertyId - get reviews for a property
router.get('/:propertyId', (req, res, next) => {
  req.params.id = req.params.propertyId;
  next();
}, validatePropertyId, reviewController.getReviewsByPropertyId);

module.exports = router;

