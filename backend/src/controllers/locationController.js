const locationService = require('../services/locationService');

function getStates(req, res, next) {
  try {
    const states = locationService.getAllStates();
    res.json({
      success: true,
      count: states.length,
      data: states
    });
  } catch (err) {
    next(err);
  }
}

function getCities(req, res, next) {
  try {
    const { state } = req.query;
    const cities = locationService.getAllCities(state);
    res.json({
      success: true,
      count: cities.length,
      stateFilter: state || null,
      data: cities
    });
  } catch (err) {
    next(err);
  }
}

function searchLocations(req, res, next) {
  try {
    const { q } = req.query;
    const results = locationService.searchLocations(q);
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

module.exports = {
  getStates,
  getCities,
  searchLocations
};

