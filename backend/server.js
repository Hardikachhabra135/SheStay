const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./src/config');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./src/middleware/errorHandler');

const healthRoutes = require('./src/routes/healthRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const institutionRoutes = require('./src/routes/institutionRoutes');

const app = express();

// Security & Cross-Origin Resource Sharing
app.use(cors({
  origin: '*', // Allow frontend requests from local files, localhost, or deployment domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request Body Parsing with size safety
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/institutions', institutionRoutes);

// API Info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the SheStay Pan-India Accommodation Safety & Verification API',
    endpoints: {
      health: 'GET /api/health',
      states: 'GET /api/locations/states',
      cities: 'GET /api/locations/cities',
      locationsSearch: 'GET /api/locations/search?q=',
      institutions: 'GET /api/institutions',
      institutionsSearch: 'GET /api/institutions/search?q=',
      properties: 'GET /api/properties?city=&college=&radius=',
      propertyById: 'GET /api/properties/:id',
      search: 'GET /api/properties/search?q=',
      recommended: 'GET /api/properties/recommended',
      reviews: 'GET /api/reviews/:propertyId',
      aiAssessment: 'POST /api/ai/assess-property'
    },
    documentation: 'See README.md for full details.'
  });
});

// Serve frontend static assets (HTML, CSS, JS) directly from Express
const frontendDir = path.join(__dirname, '../frontend');
app.use(express.static(frontendDir));

// Root fallback to frontend index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// 404 and Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` SheStay Backend running on port ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(` AI Engine: ${config.geminiApiKey ? 'Google Gemini API' : 'SheStay Heuristic Safety Engine'}`);
  console.log(`=======================================================`);
});

module.exports = { app, server };

