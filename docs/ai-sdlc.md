# AI SDLC Specification: Enterprise AI Clinical Assistant

## 1. Executive Summary & Governance Charter
The **Enterprise AI Clinical Assistant** is an enterprise-grade, clinical decision-support and workflow assistance platform built under strict adherence to **HIPAA Security & Privacy Rules (45 CFR § 164.308/312)** and **EU GDPR (Regulation EU 2016/679)**.

Under no circumstances is this AI system designed or authorized to operate as an autonomous diagnostic authority, autonomous prescriber, or unmonitored treatment directive generator. All clinical outputs are labeled decision-support artifacts that require qualified human clinical judgment.

---

## 2. The 7-Stage AI Software Development Life Cycle (AI SDLC)

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌────────────┐
│  1. PLAN │ ──> │2. DESIGN │ ──> │3. DEVELOP │ ──> │4. EVALUATE │
└──────────┘     └──────────┘     └───────────┘     └────────────┘
                                                           │
┌────────────┐     ┌───────────┐     ┌───────────┐         │
│ 7. IMPROVE │ <── │6. MONITOR │ <── │ 5. DEPLOY │ <───────┘
└────────────┘     └───────────┘     └───────────┘
```

### Stage 1: PLAN
- **Clinical Safety Goals**: Zero ungrounded diagnostic claims, zero unmasked PHI leaks in telemetry, zero unapproved clinical workflow writes.
- **Target Personas**:
  - *Attending Physicians / Clinicians*: Rapid patient longitudinal synthesis & evidence-grounded guideline Q&A.
  - *Nurses & Care Coordinators*: Care plan verification, referral drafts, appointment coordination.
  - *Hospital Administrators & Compliance Officers*: Traceability, RBAC/ABAC verification, audit log validation.
- **Strict Out-of-Scope Constraints**: No real PHI processing in demo mode, no direct EHR write-backs without explicit human clinician cryptographic approval.

### Stage 2: DESIGN
- **Architectural Topology**: Multi-agent layered hierarchy (Gateway Orchestrator -> Knowledge Agent, Patient Data Agent, Workflow Agent, Self-Improving Agent) + Context Fusion & AI Decision Engine.
- **Trust Boundaries**:
  - Boundary A (User/Client to Gateway): Mutual TLS, OAuth2/JWT session authorization, role & purpose-of-use checks.
  - Boundary B (Gateway to Agents): Typed contracts (`agent_name`, `trace_id`, `actor`, `purpose_of_use`, `patient_scope`).
  - Boundary C (Agents to Models/Foundation): Pre-call PHI redaction, prompt injection sanitization, post-generation groundedness & citation verification.
  - Boundary D (Workflow Execution): Preview -> Validate -> Human Approval Gate -> Simulated Execution -> Rollback.

### Stage 3: DEVELOP
- **Core Technology Stack**:
  - Frontend: React 19 + TypeScript + Vite + Motion + Tailwind CSS.
  - Backend: Node.js/Express + TypeScript + Server-Side Gemini API adapter + Deterministic Mock Provider.
  - Knowledge Base: Multi-Stage Hybrid RAG (Lexical BM25 + Dense Semantic Vector retrieval, metadata filtering, cross-encoder reranking).
  - Synthetic Healthcare Model: FHIR R4 Compliant Resources (Patient, Encounter, Condition, Observation, MedicationRequest, AllergyIntolerance, CarePlan, Consent).

### Stage 4: EVALUATE
- **RAG & Groundedness Benchmarks**:
  - Context Relevance >= 92%
  - Faithfulness / Groundedness Score >= 95%
  - Citation Validity & Existence = 100%
  - Abstention Correctness on out-of-scope/unapproved queries = 100%
- **Adversarial "Break-It" Test Suite**:
  - 15 automated stress vectors (Prompt injection, Jailbreak attempts, Expired consent, Unauthorized patient access, Stale guideline ingestion, Hallucinated citations, Duplicate action execution).

### Stage 5: DEPLOY
- **Local & Containerized Zero-Friction Execution**:
  - Instant one-click local orchestration (`npm run dev` binding to `0.0.0.0:3000`).
  - Clear architectural translation to Cloud Native AWS Infrastructure (ECS/EKS, OpenSearch Serverless, Bedrock, AWS HealthLake).

### Stage 6: MONITOR
- **Agent Operations Telemetry**:
  - Real-time node graph execution tracking.
  - P50/P95 latency measurement, token consumption monitoring, guardrail violation counters.
  - Masked trace inspection preventing PHI entry into log streams.

### Stage 7: IMPROVE
- **Self-Improving Agent Loop**:
  - Continuous anomaly detection on telemetry (low-confidence clusters, citation misses, retry spikes).
  - Proposal generation with risk assessment, expected delta, and rollback procedures.
  - **Mandatory Human-in-the-Loop Approval Gate**: Self-improving agent NEVER modifies production prompts or indexes autonomously.

---

## 3. Definition of Done (DoD)
1. Complete implementation of 4 specialized agent domains matching reference architecture.
2. 5 dedicated clinician workspace views + separate live Agent Operations Dashboard.
3. 15 executable Break-It adversarial test scenarios with visible trace inspection.
4. Comprehensive synthetic FHIR cohort (12+ multi-demographic patients) and approved guideline corpus (10+ clinical policies).
5. 100% passing automated verification and compilation.
