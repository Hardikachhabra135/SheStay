/**
 * Input sanitization and validation middleware
 */

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 500);
}

function validatePropertyId(req, res, next) {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or missing property ID.'
    });
  }
  req.params.id = id.trim().toLowerCase();
  next();
}

function validateSearchQuery(req, res, next) {
  const { city, college, minPrice, maxPrice, type, minScore } = req.query;

  if (minPrice && (isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
    return res.status(400).json({ success: false, error: 'minPrice must be a positive number.' });
  }

  if (maxPrice && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
    return res.status(400).json({ success: false, error: 'maxPrice must be a positive number.' });
  }

  if (minScore && (isNaN(Number(minScore)) || Number(minScore) < 0 || Number(minScore) > 100)) {
    return res.status(400).json({ success: false, error: 'minScore must be a number between 0 and 100.' });
  }

  req.sanitizedQuery = {
    city: sanitizeString(city),
    college: sanitizeString(college),
    type: sanitizeString(type),
    minPrice: minPrice ? Number(minPrice) : null,
    maxPrice: maxPrice ? Number(maxPrice) : null,
    minScore: minScore ? Number(minScore) : null
  };

  next();
}

function validateAiAssessPayload(req, res, next) {
  const { propertyId, propertyData } = req.body;

  if (!propertyId && !propertyData) {
    return res.status(400).json({
      success: false,
      error: 'Either propertyId or propertyData must be provided for AI safety assessment.'
    });
  }

  if (propertyData && typeof propertyData !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'propertyData must be a valid object describing the property.'
    });
  }

  next();
}

module.exports = {
  validatePropertyId,
  validateSearchQuery,
  validateAiAssessPayload
};

