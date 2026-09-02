# Threat Model & Security Architecture (HIPAA / GDPR Alignment)

## 1. Overview & Threat Vectors
This threat model evaluates security and privacy risks specific to generative AI in clinical environments according to OWASP Top 10 for LLMs and NIST AI Risk Management Framework (AI RMF 1.0).

| Threat Vector ID | Threat Description | Attack Vector / Scenario | Architectural Mitigation | Status |
|---|---|---|---|---|
| **TH-01** | Direct Prompt Injection | User submits adversarial jailbreak instructions to override clinical guardrails. | Input sanitization regex, dual-layer NeMo guardrails, strict system prompt isolation. | Mitigated |
| **TH-02** | Indirect Prompt Injection | Malicious payload embedded in external/retrieved medical policy or text note. | Document parser sanitization, treating retrieved text strictly as passive data chunks. | Mitigated |
| **TH-03** | Unauthorized PHI Access (IDOR) | Clinician requests medical records for unassigned patient without treatment rationale. | ABAC patient-level assignment check + active consent verification before data fetch. | Mitigated |
| **TH-04** | PHI Leakage in Telemetry | Raw patient names or identifiers displayed in operations dashboards or logs. | Automatic token masking & de-identification regex layer on all telemetry pipelines. | Mitigated |
| **TH-05** | Hallucinated Citations | AI invents non-existent guidelines or falsifies page/section citations. | Mandatory claim-to-chunk span verification; answers with unverified citations are rejected. | Mitigated |
| **TH-06** | Unauthorized Clinical State Mutation | Agent writes prescriptions or schedule modifications without physician sign-off. | Hard human-in-the-loop approval gate with cryptographic confirmation token. | Mitigated |
| **TH-07** | Stale / Unapproved Policy Ingestion | Assistant provides advice based on deprecated or draft clinical protocols. | Rigorous metadata filtering (`approval_status == 'APPROVED'`, `expiry_date > NOW`). | Mitigated |
| **TH-08** | Self-Modification Runaway | Self-improving agent alters system prompts or model weights without governance. | Read-only observational sandbox; proposals routed to human administrator queue. | Mitigated |

---

## 2. Regulatory Compliance Mappings

### HIPAA Security Rule (45 CFR Part 164)
- **§ 164.312(a)(1) Access Control**: Enforced via RBAC/ABAC and Purpose-of-Use validation.
- **§ 164.312(b) Audit Controls**: Full event logging of all patient data queries and AI inferences.
- **§ 164.312(c)(1) Integrity**: Cryptographic checksums on clinical note drafts and audit entries.
- **§ 164.312(e)(1) Transmission Security**: TLS 1.3 enforced for all client-gateway-agent communications.

### EU GDPR (Regulation EU 2016/679)
- **Article 5(1)(c) Data Minimization**: Patient Data Agent extracts only scoped attributes requested for the clinical task.
- **Article 9 Processing of Special Categories of Data**: Explicit consent validation required for all patient data access.
- **Article 22 Automated Individual Decision-Making**: No automated diagnostic or treatment decisions; system restricted to decision-support.
