const institutionService = require('../services/institutionService');

function getAllInstitutions(req, res, next) {
  try {
    const { q } = req.query;
    if (q) {
      const results = institutionService.searchInstitutions(q);
      return res.json({
        success: true,
        query: q,
        count: results.length,
        data: results
      });
    }

    const institutions = institutionService.getAllInstitutions();
    res.json({
      success: true,
      count: institutions.length,
      data: institutions
    });
  } catch (err) {
    next(err);
  }
}

function searchInstitutions(req, res, next) {
  try {
    const { q } = req.query;
    const results = institutionService.searchInstitutions(q);
    res.json({
      success: true,
      query: q || '',
      count: results.length,
      data: results
    });
  } catch (err) {
    next(err);
  }
}

function getInstitutionById(req, res, next) {
  try {
    const { id } = req.params;
    const institution = institutionService.getInstitutionById(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        error: `Institution with ID '${id}' not found.`
      });
    }

    res.json({
      success: true,
      data: institution
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllInstitutions,
  searchInstitutions,
  getInstitutionById
};

