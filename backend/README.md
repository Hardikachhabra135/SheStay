# SheStay — Backend & AI Safety Assessment Engine

Lightweight, production-ready REST API and AI Safety Assessment engine for **SheStay** (an AI-powered women's accommodation safety and verification platform).

Built with **Node.js**, **Express.js**, **Google Gemini AI**, and **Local JSON datasets**, completely database-free.

---

## 🚀 Key Features

* **AI-Powered Safety Assessment**: Integrates **Google Gemini API** (`gemini-1.5-flash`) with automated fallback to SheStay's transparent 5-pillar heuristic safety engine.
* **Accommodation Listings Engine**: REST endpoints to retrieve, search, filter, and sort student & working women accommodations without external DB dependencies.
* **Review Verification System**: Returns verified resident reviews, flags promotional reviews, and supports local prototype submissions.
* **Security & Hardening**:
  * Strict rate limiting with `express-rate-limit`.
  * CORS support for web clients and cross-domain deployments.
  * Input sanitization & schema validation.
  * Secure backend-only handling of Gemini API credentials.
* **Zero Database Overhead**: Self-contained sample JSON dataset in `src/data/properties.json`.

---

## 📁 Architecture & Folder Structure

```
SheStay-main/backend/
├── server.js               # Application entry point & Express bootstrap
├── package.json            # Node.js dependencies & test scripts
├── .env.example            # Sample environment variables
├── .env                    # Local environment config
├── src/
│   ├── config/             # Environment & configuration loader
│   │   └── index.js
│   ├── data/               # Accommodation JSON dataset
│   │   └── properties.json
│   ├── routes/             # REST route handlers
│   │   ├── healthRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── aiRoutes.js
│   ├── controllers/        # Request controllers
│   │   ├── propertyController.js
│   │   ├── reviewController.js
│   │   └── aiController.js
│   ├── services/           # Business logic & AI integration
│   │   ├── propertyService.js
│   │   ├── reviewService.js
│   │   └── geminiService.js
│   └── middleware/         # Security & error handling
│       ├── errorHandler.js
│       ├── rateLimiter.js
│       └── validator.js
└── tests/
    └── api.test.js         # Automated end-to-end API test suite
```

---

## 🛠️ Getting Started

### 1. Prerequisites
* **Node.js** v18+ (tested on Node v24)
* **npm** v9+

### 2. Installation
```bash
cd SheStay-main/backend
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to configure:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
CORS_ORIGIN=*
```
*(Note: If `GEMINI_API_KEY` is omitted, the backend automatically uses the built-in deterministic heuristic engine matching the exact transparent methodology).*

### 4. Running the Server
```bash
# Production start
npm start

# Development mode with file watch
npm run dev
```

### 5. Running the Test Suite
```bash
npm test
```

---

## 📡 REST API Reference

### Health & Status
* **`GET /api/health`**
  * Returns server health, timestamp, and active AI engine mode.

### Properties
* **`GET /api/properties`**
  * Returns all sample properties.
* **`GET /api/properties/:id`**
  * Returns single property details (e.g. `/api/properties/sunrise`).
* **`GET /api/properties/search`**
  * Query parameters:
    * `city`: City name (e.g. `New Delhi`)
    * `college`: College or landmark (e.g. `BVCOE`)
    * `type`: Property type (`Hostel`, `PG`, `Apartment`)
    * `minPrice`, `maxPrice`: Rent boundaries
    * `minScore`: Minimum safety score (e.g. `75`)
    * `meals`: `true` to filter for meals included
    * `tiffinNearby`: `true` to filter for nearby tiffins
    * `sortBy`: `score`, `price`, `distance`, `reviews`
* **`GET /api/properties/recommended?limit=3`**
  * Returns top-scoring verified properties.

### Reviews
* **`GET /api/reviews/:propertyId`**
  * Returns verified and prototype reviews for the specified property.

### AI Safety Assessment
* **`POST /api/ai/assess-property`**
  * Evaluates a property across the 5 SheStay safety pillars using Google Gemini API.
  * Request Body:
    ```json
    {
      "propertyId": "sunrise"
    }
    ```
    *or evaluate a custom/owner listing:*
    ```json
    {
      "propertyData": {
        "name": "Sample PG",
        "type": "PG",
        "city": "New Delhi",
        "securityFeatures": ["24/7 CCTV in Corridors & Entry", "Biometric Gate Access"],
        "womenOnly": true
      }
    }
    ```
  * Response:
    ```json
    {
      "success": true,
      "propertyId": "sunrise",
      "data": {
        "overallScore": 63,
        "verdict": "Use caution",
        "infrastructureScore": 78,
        "reviewSentiment": "Mixed with high internal safety but external transit concerns",
        "potentialRiskIndicators": [...],
        "positiveSafetyIndicators": [...],
        "missingInformation": [...],
        "aiExplanation": "...",
        "recommendations": [...],
        "scoreBreakdown": { ... },
        "assessmentTimestamp": "2026-11-10T10:30:00.000Z",
        "isAiGenerated": true
      }
    }
    ```

---

## 🛡️ SheStay 5-Pillar Safety Scoring Methodology

| Pillar | Weight | Factors Analyzed |
| :--- | :---: | :--- |
| **Physical Security** | **30%** | CCTV in entry/corridors, biometric/turnstile locks, dedicated night guards, female warden, fire extinguishers. |
| **Location Safety** | **25%** | Street lighting after dark, distance to public transit, proximity to police posts and 24/7 hospitals. |
| **Management Behaviour**| **20%** | Responsiveness to maintenance, respect for resident privacy, advance notice before room inspections, refund promptness. |
| **Review Trust** | **15%** | Proportion of verified stay agreements, exclusion of promotional/bot reviews via AI checks. |
| **Complaint History** | **10%** | Unresolved security deposit delays, harassment or hygiene reports. |

**Thresholds:**
* **`75 – 100`**: **Safe** (Green)
* **`50 – 74`**: **Use caution** (Yellow)
* **`0 – 49`**: **High risk** (Red)

---

## ☁️ Deployment Instructions

### Deploying the Backend to [Render](https://render.com)

1. Create a new repository on GitHub with this project.
2. Sign in to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the build and start settings:
   * **Root Directory**: `SheStay-main/backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   * `NODE_ENV` = `production`
   * `GEMINI_API_KEY` = *your Google Gemini API key*
   * `GEMINI_MODEL` = `gemini-1.5-flash`
   * `CORS_ORIGIN` = `*` (or your Vercel frontend URL)
6. Click **Create Web Service**.
7. Once deployed, note your Render URL (e.g. `https://shestay-backend.onrender.com`).

### Deploying the Frontend to [Vercel](https://vercel.com)

1. Sign in to [Vercel Dashboard](https://vercel.com) and click **Add New...** → **Project**.
2. Select your GitHub repository.
3. In **Root Directory**, choose `SheStay-main/frontend`.
4. (Optional) In `frontend/js/app.js`, set `window.SHESTAY_API_BASE = 'https://your-render-app.onrender.com/api'` or let it point to your Render backend.
5. Click **Deploy**. Since the frontend uses standard HTML5/CSS3/Vanilla JS, it deploys instantly with zero build step.

