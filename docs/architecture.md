# Scheme-Saathi: Technical Architecture & System Design

**Scheme-Saathi** (ಸ್ಕೀಮ್ ಸಾಥಿ / स्कीम साथी) is an open-source, privacy-preserving, real-time civic-technology platform designed to help Indian citizens discover, understand, and apply for verified government welfare entitlements they qualify for.

---

## 1. System Architecture Diagram

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (React 18 + Vite + Tailwind + Framer Motion)"]
        UI_Feed["Pinterest-Style Masonry Feed & Category Chips"]
        UI_Voice["Voice-First Interface (Web Speech API)"]
        UI_OCR["Document Readiness & In-Memory Scanner"]
        UI_Calc["Family Calculator & Life Events Explorer"]
        UI_Tracker["Multi-Tab Kanban Tracker"]
        UI_Shield["Deterministic Scam Shield"]
        UI_Admin["Admin Desk & Side-by-Side Verification Queue"]
        ZustandStore["Browser Storage (localStorage - No Citizen Accounts)"]
    end

    subgraph APILayer ["Backend Gateway (Node.js 20 + Express + Socket.IO)"]
        Security["Helmet + Strict CORS + Mongo-Sanitize + Rate-Limiters"]
        ZodValidator["Zod Schema Validation Pipeline"]
        Router_Public["Public APIs (/schemes, /extract, /match, /ocr, /centres, /tracker, /scam)"]
        Router_Admin["Protected Admin APIs (/api/admin, /api/auth) - JWT in httpOnly Cookie"]
    end

    subgraph CoreEngines ["Core Processing Engines"]
        RuleEngine["Deterministic Tri-State Rule Engine (Pure Functions)"]
        GeminiAdapter["Gemini AI Service / Offline Mock Adapter"]
        ScamMatcher["Deterministic Regex & Keyword Heuristic Risk Scorer"]
        GeoService["Nominatim Geocoder (1 req/s) & $geoNear Aggregator"]
        PDFGen["PDFKit Generator (Checklist with Civic Notice)"]
    end

    subgraph DataPersistence ["MongoDB 8.0+ Database"]
        DB_Schemes[("Schemes Collection (Text Index)")]
        DB_Centres[("Centres Collection (2dsphere Index)")]
        DB_Scams[("ScamPatterns Collection")]
        DB_Trackers[("Applications & Reminders")]
        DB_Audit[("AuditLogs Collection")]
        DB_Analytics[("AnalyticsEvents (k-anonymity >= 5)")]
    end

    ClientLayer <-->|REST API + Multipart| Security
    ClientLayer <-->|WebSocket Realtime Events| APILayer
    Security --> ZodValidator
    ZodValidator --> Router_Public
    ZodValidator --> Router_Admin
    Router_Public --> RuleEngine
    Router_Public --> GeminiAdapter
    Router_Public --> ScamMatcher
    Router_Public --> GeoService
    Router_Public --> PDFGen
    Router_Public <--> DataPersistence
    Router_Admin <--> DataPersistence
```

---

## 2. Non-Negotiable Rules & Compliance Matrix

| Rule | Implementation Mechanism | Verification Point |
|---|---|---|
| **1. Never Invent Facts** | Every seeded and ingested scheme stores `sourceUrl` and `lastVerified`. | Schema validator (`npm run validate`) fails if `sourceUrl` is missing or invalid. |
| **2. Verification Gate** | All new ingestions default to `verificationStatus: 'needs_review'`. Only `verified` records appear publicly unless `SHOW_UNVERIFIED=true`. | Enforced in `Scheme` Mongoose model default and query filters. |
| **3. Polite Web Crawling** | Robots.txt checked with `robots-parser`; rate-limited to 1 request per 2000ms with respectful `User-Agent`. | Fallback to admin "paste text" flow when fetching is blocked. |
| **4. Deterministic Decisions** | Eligibility qualification is calculated exclusively by the pure-function Rule Engine. Zero LLM hallucinations. | Rule engine unit tests (22/22 passed). LLM is used strictly for speech parsing, OCR, and drafting. |
| **5. Secret Management** | Environment secrets live in `.env`. No credentials or keys bundled to client. | Protected via Vite `VITE_` prefix isolation. |
| **6. Privacy & Zero Accounts** | No citizen passwords or accounts. Profiles persist only in the user's browser `localStorage`. Uploaded documents processed in memory (RAM) and never stored on disk. | Multer memoryStorage; Aadhaar numbers masked (`XXXX-XXXX-1234`). |
| **7. Distinct Editorial Brand** | Warm editorial aesthetic (`#FBF8F3`, `#1C1B19`, `#1F6F5B`, `#E8590C`), Fraunces display typography, organic procedural SVGs. | Custom `tokens.css` with zero template or generic purple gradients. |
| **8. Mandatory Civic Disclaimer** | "Guidance only. Final eligibility is decided by the issuing department." | Rendered across all scheme views, modal footer, and exported PDF headers. |
| **9. Offline-Safe Demo Mode** | `USE_MOCK_AI=true` provides instantaneous deterministic fixtures for all features. | 100% demoable offline without API keys. |

---

## 3. Deterministic Tri-State Rule Engine

### Tri-State Truth Table
The rule engine evaluates leaves to `true` (satisfied), `false` (violated), or `null` (unknown profile field).

- **Combinator `all`**:
  - `false` if any child is `false`.
  - `null` if no child is `false`, but one or more are `null`.
  - `true` only if all children are `true`.
- **Combinator `any`**:
  - `true` if any child is `true`.
  - `false` only if all children are `false`.
  - `null` if none are `true`, and one or more are `null`.
- **Combinator `not`**:
  - Inverts `true` to `false` and `false` to `true`. Returns `null` if child is `null`.

### Status Resolution:
- **`eligible`**: The scheme condition tree evaluates completely to `true`.
- **`maybe`**: No hard disqualification (`false`), but missing unknown profile fields require follow-up.
- **`not_eligible`**: One or more non-fixable rules evaluated to `false`. Fixable rules (e.g. renewal of income certificate, age threshold within months) generate **Near-Miss** opportunity hints.
