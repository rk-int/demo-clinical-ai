# Live Demo Presenter Script & Walkthrough Guide

## Presentation Outline (15-Minute Management & Clinical Leadership Demo)

### 1. Introduction (2 mins): Landing Page & Trust Architecture
- **Objective**: Showcase clinical AI safety posture and futuristic 3D hospital environment.
- **Action**: Open Landing Page. Highlight the 3D animated hospital topology with walking clinicians, flowing data pathways, and interactive Trust Architecture sequence.
- **Talking Point**: *"Our Enterprise Clinical AI Assistant is engineered from the ground up on strict HIPAA & GDPR guardrails. It empowers clinicians without ever operating as an autonomous diagnostic authority."*

### 2. Role-Based Access & Patient 360 Summary (3 mins)
- **Objective**: Demonstrate ABAC, purpose-of-use compliance, and comprehensive longitudinal FHIR synthesis.
- **Action**: Log in as `Dr. Sarah Chen, MD (Cardiology)`. Search and select patient `PT-1002 (Elena Rostova - Heart Failure with Preserved Ejection Fraction)`.
- **Key Visuals**:
  - Longitudinal timeline (encounters, lab trends, medication adherence).
  - Data completeness alerts and active allergy warnings (e.g. ACE inhibitor allergy).
  - Provenance source indicators for every data item.

### 3. Governed Knowledge Q&A with Citation Validation (3 mins)
- **Objective**: Show hybrid RAG, approved hospital policy filtering, and calibrated evidence scoring.
- **Action**: Navigate to `Clinical Knowledge Q&A`. Query: *"What is the hospital protocol for initiating SGLT2 inhibitors in heart failure patients with eGFR < 30?"*
- **Key Visuals**:
  - High confidence badge (96% evidence coverage).
  - Side-by-side evidence pane highlighting exact guideline chunks (`HF-CLIN-2025-v3.2`).
  - Strict absence of hallucination: system clearly notes contraindication when eGFR is below threshold.

### 4. Human-in-the-Loop Clinical Workflow Workspace (3 mins)
- **Objective**: Demonstrate how draft notes, referrals, and discharge summaries require explicit physician approval before simulated execution.
- **Action**: Navigate to `Workflow Workspace`. Generate a Cardiology Referral Draft.
- **Key Visuals**:
  - Real-time extraction of facts from authorized context.
  - Review & edit modal with validation checks.
  - One-click Human Approval Gate -> Simulated Execution with Idempotency Key -> Instant rollback capability.

### 5. Live Agent Operations Dashboard & 15 "Break-It" Scenarios (4 mins)
- **Objective**: Provide technical proof of guardrail enforcement, latency tracking, and self-improving governance.
- **Action**: Open the `Agent Operations Dashboard`.
- **Key Visuals**:
  - Live animated node DAG (Gateway -> Agents -> Context Fusion -> Model -> Validation).
  - Run Break-It Scenarios:
    - *Scenario 6: Prompt Injection Attack* -> Show immediate NeMo Guardrail block!
    - *Scenario 8: Unauthorized Patient Access* -> Show ABAC access denial trace.
    - *Scenario 5: Unapproved Guideline Query* -> Show safe abstention.
  - Self-Improving Proposals queue: review pending retriever threshold proposal and click human approval!
