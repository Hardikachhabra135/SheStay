const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SheStay API Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiEngine: config.geminiApiKey ? 'Google Gemini API' : 'SheStay Heuristic Safety Engine (No API key set)',
    geminiModel: config.geminiModel,
    environment: config.nodeEnv
  });
});

module.exports = router;

