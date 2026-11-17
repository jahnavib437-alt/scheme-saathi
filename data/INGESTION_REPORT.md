# Scheme-Saathi Ingestion & Verification Audit Report
Generated on: 2026-11-17T15:17:08.495Z

## Summary Statistics
- **Total Ingested Schemes:** 96
- **Flagship Verified Schemes:** 19
- **Pending Admin Review Queue (Needs Review):** 77
- **Sources Indexed:** 10 official portals (myScheme, Seva Sindhu, NSP, PM-KISAN, PM-JAY)
- **Centres Mapped (Tumakuru):** 12 CSC & Seva Kendras
- **Deterministic Scam Heuristic Rules:** 5 weighted regexes

## Verification Status Compliance (Non-Negotiable Rules)
1. **Source Verifiability:** 100% of records possess a verified `sourceUrl` and `lastVerified` ISO timestamp.
2. **Deterministic Rules:** All eligibility rules strictly use standardized profile field names with pure Boolean operators.
3. **Review Gate:** All new ingestions default to `needs_review` to guarantee human oversight before public exposure.
4. **Translation Status:** Central schemes possess English names and summaries; regional Kannada and Hindi localizations are generated with machine-translation flags ready for native reviewer sign-off.
