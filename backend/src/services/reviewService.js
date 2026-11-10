const propertyService = require('./propertyService');

function getReviewsForProperty(propertyId) {
  const property = propertyService.getPropertyById(propertyId);
  if (!property) return null;

  return {
    propertyId: property.id,
    propertyName: property.name,
    totalReviews: property.totalReviews || (property.reviews ? property.reviews.length : 0),
    verifiedReviews: property.verifiedReviews || 0,
    reviews: property.reviews || []
  };
}

module.exports = {
  getReviewsForProperty
};

