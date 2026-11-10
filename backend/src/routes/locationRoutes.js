const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// GET /api/locations/states
router.get('/states', locationController.getStates);

// GET /api/locations/cities
router.get('/cities', locationController.getCities);

// GET /api/locations/search?q=
router.get('/search', locationController.searchLocations);

module.exports = router;

