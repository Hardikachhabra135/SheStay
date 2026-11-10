# SheStay — AI-Powered Women's Accommodation Safety & Verification Platform

SheStay empowers women relocating for studies or jobs by providing verified safety intelligence and scoring for hostels, PGs, and apartments.

---

## 🏗️ Architecture

* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), CSS Custom Properties, Multi-page architecture. No build step required.
  * Located in `/frontend`
  * Deployable on **Vercel**
* **Backend**: Node.js, Express.js, Google Gemini API, Local JSON dataset.
  * Located in `/backend`
  * Deployable on **Render**

---

## ⚡ Quick Start

### 1. Run the Backend Server
```bash
cd backend
npm install
npm start
```
The API starts at `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`).

### 2. Launch the Frontend
Open `frontend/index.html` in any modern web browser or run a lightweight local static server:
```bash
# Optional local web server:
npx serve frontend
```

### 3. Run Backend Automated Tests
```bash
cd backend
npm test
```
All 12 automated test suites test health checks, search/filtering, safety scoring, reviews, and Gemini AI assessments.
