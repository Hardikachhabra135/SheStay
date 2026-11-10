const propertyService = require('../services/propertyService');

function getAllProperties(req, res, next) {
  try {
    // If query params are provided (city, college, radius, etc.), apply search filters
    if (Object.keys(req.query).length > 0) {
      const result = propertyService.searchAndFilterProperties(req.query);
      return res.json({
        success: true,
        count: result.data.length,
        total: result.total,
        page: result.page,
        targetInstitution: result.targetInstitution,
        data: result.data
      });
    }

    const properties = propertyService.getAllProperties();
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (err) {
    next(err);
  }
}

function getPropertyById(req, res, next) {
  try {
    const { id } = req.params;
    const property = propertyService.getPropertyById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: `Property with ID '${id}' not found.`
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (err) {
    next(err);
  }
}

function searchProperties(req, res, next) {
  try {
    const criteria = {
      q: req.query.q,
      city: req.query.city,
      state: req.query.state,
      college: req.query.college,
      institutionId: req.query.institutionId,
      area: req.query.area,
      locality: req.query.locality,
      type: req.query.type,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      minScore: req.query.minScore,
      meals: req.query.meals,
      tiffinNearby: req.query.tiffinNearby,
      radius: req.query.radius,
      nearKm: req.query.nearKm,
      sortBy: req.query.sortBy,
      page: req.query.page,
      limit: req.query.limit
    };

    const result = propertyService.searchAndFilterProperties(criteria);

    res.json({
      success: true,
      count: result.data.length,
      total: result.total,
      page: result.page,
      criteria,
      targetInstitution: result.targetInstitution,
      data: result.data
    });
  } catch (err) {
    next(err);
  }
}

function getRecommendedProperties(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 3;
    const city = req.query.city || null;
    const recommendations = propertyService.getRecommendedProperties(limit, city);

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProperties,
  getPropertyById,
  searchProperties,
  getRecommendedProperties
};
