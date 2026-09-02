# Enterprise AI Clinical Assistant

A production-scale, HIPAA & GDPR compliant Enterprise AI Clinical Assistant with Governed Multi-Agent Architecture, Human-in-the-Loop Clinical Verification, Multimodal RAG Ingestion, and Real-Time Agent Operations Telemetry.

---

## Key Clinical Modules & Features

1. **Clinician Portal**:
   - **Targeted Patient Search**: Zero-Trust protected directory showing records only upon explicit query search, with quick suggestion pills and a dedicated option to view all cohort records.
   - **Sample Profile Portait Photos**: High-resolution demographic portrait photos for each patient record and clinical profile.
   - **Live Patient Data Agent Flow (Vertical Mode)**: Live multi-stage agentic workflow visualization in vertical mode showing Ingress, Intent Classification, Patient Data Specialist Agent retrieval, Provenance Checksum verification, and EHR Workspace Sync.
   - **Replay Flow (Demo)**: Safe visual simulation button that replays the vertical agent execution sequence without re-ingesting or duplicating patient records.
   - **New Patient Registration Pop-up**: Modal for registering patients with an optional **"Add patient historical records if exists?"** radio button (Yes / No) and multi-modality upload support (Text/PDF, OCR, Chest X-Ray, Lab reports, MRI scans, other documents).
2. **AI Gateway Orchestrator**:
   - Live animated multi-agent hierarchy graph with real-time dotted stream trajectories and specialist agent routing (`knowledge_agent`, `patient_search_agent`, `workflow_agent`).
3. **Patient 360 Workspace**:
   - Comprehensive longitudinal chart, vital trends, medication lists, allergy matrices, and audit records.
4. **Clinical Knowledge Q&A**:
   - Governed hybrid RAG with dual dense/sparse BM25 retrieval and clinical source grounding.

---

## Security Architecture & Threat Model

- **Input Surfaces**: Parameterized validation, DLP PHI masking, and multimodal format verification.
- **Planning & Reasoning**: Deterministic intent classification with system boundaries preventing prompt injection.
- **Tool Execution**: Attending Physician Human-in-the-Loop (`hitl_physician_gate`) requiring explicit approval before EHR commits.
- **Memory & State**: Row-level tenant binding (`patientId`), cryptographic state hashing (`sha256`), and session isolation.
- **Inter-System Communication**: TLS 1.3 encrypted internal bus with zero client-side credential exposure.

---

## Deployment & Configuration Guide

### 1. Enable Required Google Cloud APIs

```bash
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  cloudbuild.googleapis.com
```

### 2. Secret Management Setup (Zero Hardcoding)

```bash
# Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant Cloud Run runtime service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Firestore Security Rules

Deploy the following owner-bound rules in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /patients/{patientId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'PHYSICIAN';
    }
  }
}
```

### 4. Deploy to Google Cloud Run

```bash
# Build and deploy container to Cloud Run
gcloud run deploy enterprise-ai-clinical-assistant \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --update-labels=dev-tutorial=cloud-run-ai-challenge
```

### 5. Automated Challenge Verification Label

```bash
gcloud run services update enterprise-ai-clinical-assistant \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start full-stack development server on port 3000
npm run dev
```
