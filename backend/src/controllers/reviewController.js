const reviewService = require('../services/reviewService');

function getReviewsByPropertyId(req, res, next) {
  try {
    const { propertyId } = req.params;
    const reviewData = reviewService.getReviewsForProperty(propertyId);

    if (!reviewData) {
      return res.status(404).json({
        success: false,
        error: `Property with ID '${propertyId}' not found.`
      });
    }

    res.json({
      success: true,
      data: reviewData
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReviewsByPropertyId
};

