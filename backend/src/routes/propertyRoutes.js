const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { validatePropertyId, validateSearchQuery } = require('../middleware/validator');

// GET /api/properties/search - search & filter
router.get('/search', validateSearchQuery, propertyController.searchProperties);

// GET /api/properties/recommended - get safety recommended properties
router.get('/recommended', propertyController.getRecommendedProperties);

// GET /api/properties - get all properties
router.get('/', propertyController.getAllProperties);

// GET /api/properties/:id - get property by ID
router.get('/:id', validatePropertyId, propertyController.getPropertyById);

module.exports = router;

