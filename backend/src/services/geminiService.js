const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

/**
 * Deterministic transparent safety assessment calculation (used as fallback or baseline)
 */
function evaluateHeuristicSafety(property) {
  const securityFeatures = property.securityFeatures || [];
  const facilities = property.facilities || [];
  const flags = property.flags || [];
  const reviews = property.reviews || [];
  const verifiedReviews = reviews.filter(r => r.isVerified);

  // 1. Physical Security (30%)
  let physScore = 50; // baseline
  const secJoined = [...securityFeatures, ...facilities].join(' ').toLowerCase();

  if (secJoined.includes('cctv') || secJoined.includes('camera')) physScore += 15;
  if (secJoined.includes('biometric') || secJoined.includes('digital') || secJoined.includes('turnstile')) physScore += 12;
  if (secJoined.includes('warden') || secJoined.includes('female warden')) physScore += 12;
  if (secJoined.includes('guard') || secJoined.includes('night guard')) physScore += 12;
  if (secJoined.includes('fire') || secJoined.includes('extinguisher') || secJoined.includes('alarm')) physScore += 8;
  if (secJoined.includes('no dedicated guard') || secJoined.includes('padlock')) physScore -= 25;
  physScore = Math.max(15, Math.min(98, physScore));

  // 2. Location Safety (25%)
  let locScore = 70; // baseline
  if (property.distanceKm && property.distanceKm <= 1.5) locScore += 10;
  if (flags.some(f => f.text.toLowerCase().includes('unlit') || f.text.toLowerCase().includes('dark') || f.title?.toLowerCase().includes('unlit'))) {
    locScore -= 28;
  }
  if (flags.some(f => f.level === 'risk' && f.text.toLowerCase().includes('lane'))) locScore -= 10;
  locScore = Math.max(20, Math.min(95, locScore));

  // 3. Management Behaviour (20%)
  let mgmtScore = 75;
  if (flags.some(f => f.text.toLowerCase().includes('deposit') || f.text.toLowerCase().includes('refund'))) mgmtScore -= 20;
  if (flags.some(f => f.text.toLowerCase().includes('inspection') || f.text.toLowerCase().includes('short notice'))) mgmtScore -= 15;
  if (flags.some(f => f.text.toLowerCase().includes('warden changed') || f.text.toLowerCase().includes('management change'))) mgmtScore -= 10;
  mgmtScore = Math.max(20, Math.min(95, mgmtScore));

  // 4. Review Trust (15%)
  let trustScore = 65;
  if (verifiedReviews.length >= 25) trustScore += 20;
  else if (verifiedReviews.length >= 10) trustScore += 10;
  const flaggedReviews = reviews.filter(r => r.aiCheck?.status?.includes('promotional') || r.isVerified === false);
  if (flaggedReviews.length > 0) trustScore -= 8;
  trustScore = Math.max(25, Math.min(98, trustScore));

  // 5. Complaint History (10%)
  let complaintScore = 80;
  const riskFlags = flags.filter(f => f.level === 'risk');
  const warnFlags = flags.filter(f => f.level === 'warn');
  complaintScore -= (riskFlags.length * 25 + warnFlags.length * 10);
  complaintScore = Math.max(15, Math.min(95, complaintScore));

  // Overall Weighted Score
  const overall = Math.round(
    (physScore * 0.30) +
    (locScore * 0.25) +
    (mgmtScore * 0.20) +
    (trustScore * 0.15) +
    (complaintScore * 0.10)
  );

  let verdict = 'Use caution';
  if (overall >= 75) verdict = 'Safe';
  else if (overall < 50) verdict = 'High risk';

  const potentialRiskIndicators = [];
  const positiveSafetyIndicators = [];
  const missingInformation = [];

  // Identify risk indicators
  flags.forEach(f => {
    potentialRiskIndicators.push(f.details || f.text);
  });
  if (physScore < 60) potentialRiskIndicators.push('Physical security features do not meet recommended baseline (guard or CCTV gaps).');
  if (locScore < 60) potentialRiskIndicators.push('Access route lighting or nighttime transit connectivity requires caution.');

  // Positive indicators
  if (secJoined.includes('cctv')) positiveSafetyIndicators.push('CCTV monitoring present at entry/corridors.');
  if (secJoined.includes('warden')) positiveSafetyIndicators.push('Dedicated resident female warden reported on duty.');
  if (secJoined.includes('biometric') || secJoined.includes('smart')) positiveSafetyIndicators.push('Biometric or digital access control installed.');
  if (property.womenOnly) positiveSafetyIndicators.push('Exclusively women-only residents with visitor restrictions.');

  // Missing info check
  if (!secJoined.includes('fire')) missingInformation.push('No certified fire safety NOC or extinguisher records specified.');
  if (!property.contact?.verifiedContact) missingInformation.push('Owner contact details have not completed physical verification.');
  if (verifiedReviews.length < 5) missingInformation.push('Insufficient verified resident reviews for statistical certainty.');

  // Recommendations
  const recommendations = [];
  if (locScore < 65) recommendations.push('If returning after sunset, arrange for transport to gate or ask staff for lit-route guidance.');
  if (mgmtScore < 70) recommendations.push('Obtain written and signed refund policy terms before transferring any deposit or token amount.');
  recommendations.push('Verify fire safety equipment and corridor emergency exits during an in-person or video walkthrough.');

  return {
    overallScore: overall,
    verdict,
    infrastructureScore: physScore,
    reviewSentiment: overall >= 75 ? 'Positive and reassuring' : overall >= 50 ? 'Mixed; good internal security with external/administrative caveats' : 'Critical of basic safety deficiencies',
    potentialRiskIndicators,
    positiveSafetyIndicators,
    missingInformation,
    aiExplanation: `SheStay analyzed ${property.name || 'this property'} across 5 safety pillars. Physical security is scored at ${physScore}/100, location safety at ${locScore}/100, management responsiveness at ${mgmtScore}/100, review credibility at ${trustScore}/100, and complaint records at ${complaintScore}/100. Overall safety index is ${overall}/100 (${verdict}).`,
    recommendations,
    scoreBreakdown: {
      physicalSecurity: { score: physScore, weight: 30, label: physScore >= 75 ? 'Safe' : physScore >= 50 ? 'Use caution' : 'High risk' },
      locationSafety: { score: locScore, weight: 25, label: locScore >= 75 ? 'Safe' : locScore >= 50 ? 'Use caution' : 'High risk' },
      managementBehaviour: { score: mgmtScore, weight: 20, label: mgmtScore >= 75 ? 'Safe' : mgmtScore >= 50 ? 'Use caution' : 'High risk' },
      reviewTrust: { score: trustScore, weight: 15, label: trustScore >= 75 ? 'Safe' : trustScore >= 50 ? 'Use caution' : 'High risk' },
      complaintHistory: { score: complaintScore, weight: 10, label: complaintScore >= 75 ? 'Safe' : complaintScore >= 50 ? 'Use caution' : 'High risk' }
    },
    assessmentTimestamp: new Date().toISOString(),
    caveat: 'Sample demonstration analysis based on available submitted data. Not a replacement for physical inspection or official law enforcement advice.',
    isAiGenerated: false
  };
}

/**
 * Generate safety assessment using Google Gemini API
 */
async function assessPropertyWithGemini(property) {
  if (!config.geminiApiKey) {
    console.log('[GeminiService] GEMINI_API_KEY not set in environment. Using transparent heuristic safety engine.');
    return evaluateHeuristicSafety(property);
  }

  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: config.geminiModel,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const prompt = `
You are SheStay's AI Safety Assessment Analyst for women's accommodation safety and verification.
Analyze the following accommodation listing strictly according to SheStay's transparent 5-pillar safety methodology:
1. Physical security (30% weight: CCTV coverage, gate locks, biometrics, security guards, female warden, fire extinguishers)
2. Location safety (25% weight: neighborhood street lighting, nighttime transit, distance, nearby emergency facilities)
3. Management behaviour (20% weight: owner response speed, respectful conduct, notice before room entry, refund timeliness)
4. Review trust (15% weight: ratio of verified female residents vs promotional/fake reviews)
5. Complaint history (10% weight: active complaints, unresolved deposits, past grievances)

CRITICAL RULES:
- Never invent safety information.
- Do not assume missing information means unsafe or safe.
- Distinguish verified information from owner-provided and user-submitted claims.
- Do not claim that a property is physically verified without actual verification.

Accommodation Data to Analyze:
${JSON.stringify(property, null, 2)}

Return a valid JSON object matching this schema:
{
  "overallScore": number (0 to 100),
  "verdict": "Safe" | "Use caution" | "High risk",
  "infrastructureScore": number (0 to 100),
  "reviewSentiment": string,
  "potentialRiskIndicators": string[],
  "positiveSafetyIndicators": string[],
  "missingInformation": string[],
  "aiExplanation": string,
  "recommendations": string[],
  "scoreBreakdown": {
    "physicalSecurity": { "score": number, "weight": 30, "label": string },
    "locationSafety": { "score": number, "weight": 25, "label": string },
    "managementBehaviour": { "score": number, "weight": 20, "label": string },
    "reviewTrust": { "score": number, "weight": 15, "label": string },
    "complaintHistory": { "score": number, "weight": 10, "label": string }
  },
  "caveat": "Demonstration AI safety evaluation. Physical inspection recommended before tenancy."
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return {
      ...parsed,
      assessmentTimestamp: new Date().toISOString(),
      isAiGenerated: true,
      modelUsed: config.geminiModel
    };
  } catch (error) {
    console.error('[GeminiService] Error calling Gemini API:', error.message);
    console.log('[GeminiService] Falling back to SheStay transparent heuristic safety engine.');
    const fallback = evaluateHeuristicSafety(property);
    fallback.note = `AI assessment fallback applied: ${error.message}`;
    return fallback;
  }
}

module.exports = {
  assessPropertyWithGemini,
  evaluateHeuristicSafety
};

