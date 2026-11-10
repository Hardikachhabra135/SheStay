const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institutionController');

// GET /api/institutions/search?q=
router.get('/search', institutionController.searchInstitutions);

// GET /api/institutions/:id
router.get('/:id', institutionController.getInstitutionById);

// GET /api/institutions
router.get('/', institutionController.getAllInstitutions);

module.exports = router;

