# Reference Architecture: Enterprise AI Clinical Assistant

## Architectural Overview

The architecture implements a multi-tier, defense-in-depth enterprise clinical platform designed according to the supplied reference architecture specification.

```
+-----------------------------------------------------------------------------------+
|                   EXPERIENCE LAYER (Web Portal / Landing Page)                    |
|   3D Interactive Landing Page  |  5-Page Clinician Portal  |  Agent Operations    |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                             AI GATEWAY & ORCHESTRATOR                             |
|  Request Validation  | Intent Detection | Session/Context Manager | Prompt Templates |
+-----------------------------------------------------------------------------------+
             │                              │                            │
             ▼                              ▼                            ▼
+──────────────────────────+  +──────────────────────────+  +──────────────────────────+
|   1. KNOWLEDGE AGENT     |  |  2. PATIENT DATA AGENT   |  |    3. WORKFLOW AGENT     |
| • Hybrid Search (BM25)   |  | • FHIR R4 Patient 360    |  | • Note & Summary Drafts  |
| • Vector Embeddings      |  | • Longitudinal Timeline  |  | • Referral Generation    |
| • Re-ranking & Scoring   |  | • Labs, Meds, Allergies  |  | • Human Approval Gate    |
| • Citation Verification  |  | • Data Completeness Alert|  | • Simulated Execution    |
+──────────────────────────+  +──────────────────────────+  +──────────────────────────+
             │                              │                            │
             └──────────────────────┬───────────────────────────────────┘
                                    ▼
+-----------------------------------------------------------------------------------+
|                       4. SELF-IMPROVING GOVERNANCE AGENT                          |
| • Telemetry Anomaly Detection | Failure Clustering | Sandboxed Evals | Proposal Queue |
+-----------------------------------------------------------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------------------+
|                        CONTEXT FUSION & AI DECISION ENGINE                        |
|   Knowledge Context + Patient Context + Prompt Assembly + Safety Guardrails       |
|   Foundation Models (Gemini 3.7 Flash / Pro + Deterministic Mock Provider)       |
|   Response Validation & Claim-to-Evidence Grounding Check                         |
+-----------------------------------------------------------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------------------+
|                             VALIDATED CLINICAL RESPONSE                           |
|       Evidence-based  |  Safe & Calibrated  |  Explainable  |  Actionable          |
+-----------------------------------------------------------------------------------+
```

---

## Component Layers

### 1. Cross-Cutting Trust & Governance
- **Authentication**: Single Sign-On (SSO) with Multi-Factor Authentication (MFA) concept, supporting active demo roles: `Clinician (MD)`, `Nurse (RN)`, `Specialist (MD)`, `Care Coordinator`, `Hospital Administrator`, `Compliance Auditor`.
- **Authorization**: RBAC + Attribute-Based Access Control (ABAC), enforcing patient-level assignments, purpose-of-use (`TREATMENT`, `CARE_COORDINATION`, `AUDIT`, `EMERGENCY_OVERRIDE`), and consent status.
- **Privacy & PHI Protection**: Automated DLP regex + entity redaction masking identifiers (names, SSN, MRN, phone, address) before telemetry and log emission.
- **AI Safety & Guardrails**: NeMo-style dual-stage input/output validation, prompt-injection defense, citation validation, hallucination suppression, and calibrated confidence scoring.
- **Audit Logging**: Structured immutable audit trail capturing actor, timestamp, patient ID, purpose of use, action, decision outcome, and cryptographic checksum.

### 2. Multi-Stage Governed RAG Pipeline
1. **Offline Ingestion**: Ingestion of verified hospital clinical guidelines and policies, stripping non-patient PII, generating semantic chunks with metadata enrichment (specialty, site, version, effective date, approval status).
2. **Hybrid Retrieval**: Parallel lexical BM25 token matching + semantic cosine similarity search.
3. **Metadata Filtering**: Scoped by hospital site, clinical specialty, approved status, and valid effective date.
4. **Cross-Scoring & Reranking**: Normalizes relevance scores, filters stale or draft policies, and flags contradictions.
5. **Context Enrichment & Citation Spans**: Maps generated claims directly to source chunk IDs with source title, section, page, and publication version.

### 3. Patient Data Agent & FHIR Store
- Ingests and serves synthetic FHIR R4 resources:
  - `Patient`, `Encounter`, `Condition`, `Observation` (vital signs & lab trends), `MedicationRequest`, `AllergyIntolerance`, `Procedure`, `DiagnosticReport`, `CarePlan`, `Consent`, `Provenance`.
- Assembles chronological longitudinal timelines, flags missing data / stale labs, and surfaces allergy-medication safety alerts.

### 4. Workflow Agent & Action Execution Engine
- Prepares structured drafts: Clinical SOAP Notes, Discharge Summaries, Specialist Referrals, Diagnostic Follow-Up Orders, Patient Follow-Up SMS/Email Notifications.
- State-machine lifecycle: `DRAFT` -> `VALIDATED` -> `PENDING_HUMAN_APPROVAL` -> `EXECUTED_SIMULATION` -> `COMPLETED` (or `ROLLED_BACK`).

### 5. Agent Operations & Real-Time Telemetry
- Interactive execution DAG visualization showing node activation, tool execution, payload exchange, latency breakdowns, token/cost estimation, and safety event triggers.
- Live event stream with replay capability for reproducible clinical demonstrations.
