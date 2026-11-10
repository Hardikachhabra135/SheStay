const propertyService = require('../services/propertyService');
const geminiService = require('../services/geminiService');

async function assessProperty(req, res, next) {
  try {
    const { propertyId, propertyData } = req.body;
    let targetProperty = propertyData;

    if (propertyId) {
      const found = propertyService.getPropertyById(propertyId);
      if (!found && !propertyData) {
        return res.status(404).json({
          success: false,
          error: `Property with ID '${propertyId}' not found.`
        });
      }
      targetProperty = found || propertyData;
    }

    if (!targetProperty || typeof targetProperty !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Valid property details are required for assessment.'
      });
    }

    const assessment = await geminiService.assessPropertyWithGemini(targetProperty);

    res.json({
      success: true,
      propertyId: targetProperty.id || 'custom',
      propertyName: targetProperty.name || 'Unnamed Property',
      data: assessment
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  assessProperty
};

