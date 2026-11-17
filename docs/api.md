# Scheme-Saathi: REST API & Real-Time Socket Specification

Base URL: `http://localhost:5000/api`  
WebSocket URL: `ws://localhost:5000`

---

## 1. Public Endpoints

### `GET /health`
Returns system operational status, uptime, environment, and version.

### `GET /api/schemes`
Returns all verified schemes (or unverified when `SHOW_UNVERIFIED=true`).
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., `farmers`, `women`, `students`).
  - `level` (optional): `central` | `state`.
  - `search` (optional): Full-text keyword search across scheme titles and summaries.
  - `limit` (optional): Maximum records returned (default 100).
- **Response**: `{ count: number, schemes: Scheme[] }`

### `GET /api/schemes/:id`
Fetch single scheme by MongoDB `_id` or unique `slug`.

### `GET /api/schemes/:id/pdf?lang=en|kn|hi`
Generates and downloads an official printable PDF checklist for the scheme with required documents checkboxes and step-by-step application instructions.

### `POST /api/extract`
Extracts a structured citizen eligibility profile from speech transcript or typed text.
- **Headers**: `Content-Type: application/json`
- **Body**: `{ "text": string, "language": "en" | "kn" | "hi" }`
- **Response**:
  ```json
  {
    "partialProfile": {
      "age": 66,
      "maritalStatus": "widowed",
      "hasBplCard": true
    },
    "confidence": 0.95,
    "blockingUnknowns": [
      { "field": "annualIncome", "count": 14 }
    ]
  }
  ```

### `POST /api/match`
Deterministic rule engine matching across all welfare schemes.
- **Headers**: `Content-Type: application/json`
- **Body**: `{ "profile": { ...profileFields } }`
- **Response**:
  ```json
  {
    "totalEvaluated": 96,
    "eligibleCount": 4,
    "maybeCount": 8,
    "results": [
      {
        "scheme": { ...schemeObject },
        "evaluation": {
          "status": "eligible",
          "passed": [...],
          "failed": [],
          "unknownFields": [],
          "nearMiss": []
        }
      }
    ]
  }
  ```

### `POST /api/ocr`
In-memory OCR extraction of citizen certificates with automatic Aadhaar number masking.
- **Headers**: `multipart/form-data`
- **Body**: `document` (Image or PDF file, max 10MB)
- **Response**:
  ```json
  {
    "documentType": "Income Certificate",
    "annualIncome": 48000,
    "socialCategory": "OBC",
    "maskedAadhaar": "XXXX-XXXX-4892",
    "isValid": true
  }
  ```

### `GET /api/centres/nearby`
Finds nearest Seva Kendras, Grama One, and CSC centres via MongoDB `$geoNear`.
- **Query Parameters**:
  - `lat`: float (default 13.3409 for Tumakuru)
  - `lng`: float (default 77.1011 for Tumakuru)
  - `radius`: float (radius in kilometers, default 50)
- **Response**: `{ count: number, centres: Centre[] }`

### `POST /api/scam/analyze`
Scores suspicious SMS, WhatsApp message, or URL against deterministic weighted scam heuristics.
- **Headers**: `Content-Type: application/json`
- **Body**: `{ "message": string }`
- **Response**:
  ```json
  {
    "riskScore": 75,
    "riskLevel": "danger",
    "reasons": [
      "Demands an upfront fee or money deposit.",
      "Demands secret OTP or bank credentials."
    ],
    "advice": "DO NOT CLICK ANY LINKS OR SEND MONEY.",
    "disclaimer": "Guidance only. This analysis is deterministic and advisory."
  }
  ```

### `GET /api/tracker/:sessionId` & `POST /api/tracker`
Fetch or update application progress on Kanban boards (synced across browser tabs).

---

## 2. Protected Admin Endpoints
Protected via JWT token in `httpOnly` cookie or `Authorization: Bearer <token>`.

### `POST /api/auth/login`
- **Body**: `{ "email": string, "password": string }`
- **Response**: `{ "success": true, "token": string, "admin": { ... } }`

### `GET /api/admin/stats`
Returns live dashboard counts: verified schemes, pending review, stale (>90d), pending feedback reports, active users.

### `PUT /api/admin/schemes/:id/verify`
Approves a drafted scheme and marks it `verified`. Recorded in `AuditLog`.

### `POST /api/admin/ingest`
Submits an official portal URL or pasted gazette text to the polite ingestion queue.

### `POST /api/admin/broadcast`
Broadcasts a live notification banner pushed to all online citizens via Socket.IO.

---

## 3. Real-Time Socket.IO Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `scheme:created` | Server -> Client | `Scheme` | Pushed when an ingested scheme candidate is created. |
| `scheme:verified` | Server -> Client | `Scheme` | Pushed when a scheme is published. Public feed displays a live toast. |
| `announcement:new` | Server -> Client | `{ title, body, severity }` | Pushed to all clients when an admin dispatches an announcement. |
| `application:statusChanged`| Client <-> Server | `{ schemeId, status }` | Scoped to `session:<id>` room for multi-device sync. |
| `presence:count` | Server -> Client | `{ onlineUsers: number }` | Real-time active connection counter. |
| `ingestion:progress` | Server -> Client | `{ step, percent, log }` | Scoped to `admin:room`. |
