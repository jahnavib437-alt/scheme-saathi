# Scheme-Saathi (స్కీమ్ ಸಾಥಿ / स्कीम-साथी)

> **Civic Disclaimer**: Guidance only. Final eligibility is decided exclusively by the issuing government department.

Scheme-Saathi is a production-quality, real-time web application built to help Indian citizens discover verified central and state welfare benefits they qualify for without middlemen, complex jargon, or privacy risks.

---

## 🌟 Key Highlights

1. **Zero Citizen Accounts**: No registration or login required for citizens. Eligibility profiles live strictly in local browser storage.
2. **Deterministic Rules Engine**: Eligibility decisions are calculated strictly using mathematical/logical rule sets — never AI hallucination.
3. **100% Verified Citations**: Every listed scheme includes an auditable `sourceUrl` pointing to official portals (`myScheme.gov.in`, `sevasindhu.karnataka.gov.in`, etc.) and a `lastVerified` date.
4. **Multilingual & Voice-First**: Full interface and speech capabilities in **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिंदी)**.
5. **Private In-Memory OCR**: Uploaded document images are scanned in ephemeral server memory and discarded immediately. No citizen documents or Aadhaar IDs are ever saved to disk.
6. **Physical Centre Maps**: Interactive OpenStreetMap locator for local GramaOne, CSC, Seva Sindhu, and Post Office assistance centers.
7. **Offline Demo Resilience**: Complete system runs fully offline via `USE_MOCK_AI=true` without requiring external paid API keys.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 20.0.0
- MongoDB 7.0+ / 8.0+ running locally on port 27017 (or MongoDB Atlas connection URI)

### 2. Environment Setup
```bash
# Clone or navigate to the repository
cd C:\Users\jahna\.gemini\antigravity\scratch\scheme-saathi

# Copy configuration
cp .env.example .env
cp .env.example server/.env
cp .env.example client/.env
```

### 3. Seed Verified Data
```bash
# Validate database catalog schema
npm run validate

# Seed 96+ official schemes, 12 Tumakuru physical centers, and superadmin
npm run seed
```

### 4. Run Development Stack
```bash
# Starts both Express + Socket.IO server (Port 5000) and Vite React client (Port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Default Credentials & Demo Data

- **Admin Portal**: `http://localhost:5173/admin`
- **Superadmin Email**: `superadmin@schemesaathi.in`
- **Superadmin Password**: `AdminSecurePass#2026`

---

## 🧪 Testing

```bash
# Run all unit and integration tests (29 tests across ruleEngine and REST APIs)
npm test

# Run build test for production artifacts
npm run build
```

---

## 🏗️ Architecture

See [`docs/architecture.md`](./docs/architecture.md) for data flow diagrams and [`docs/api.md`](./docs/api.md) for full REST & WebSocket protocol specifications.
