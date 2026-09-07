import { GuardrailEvent, UserProfile, SyntheticPatient, PurposeOfUse } from '../types';

export interface GuardrailCheckResult {
  passed: boolean;
  blockReason?: string;
  guardrailEvent?: GuardrailEvent;
  sanitizedInput?: string;
  confidenceRating?: 'HIGH_EVIDENCE' | 'LIMITED_EVIDENCE' | 'INSUFFICIENT_EVIDENCE' | 'ABSTAINED';
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /bypass\s+all\s+guardrails/i,
  /override\s+safety\s+filter/i,
  /act\s+as\s+an\s+unrestricted\s+ai/i,
  /DAN\s+mode/i,
  /reveal\s+internal\s+prompt/i,
  /disregard\s+hipaa/i,
  /exfiltrate\s+all\s+patient\s+data/i,
  /<script\b[^>]*>/i,
  /javascript:/i,
];

export function detectSensitivePhiInPrompt(
  prompt: string,
  patients?: SyntheticPatient[],
  attachedPatient?: SyntheticPatient | null
): { hasSensitivePhi: boolean; details?: string; type?: string } {
  if (!prompt) return { hasSensitivePhi: false };

  // 1. SSN Pattern Check
  if (/\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/.test(prompt) || /\b(ssn|social security number)\b/i.test(prompt)) {
    return {
      hasSensitivePhi: true,
      type: 'RAW_SSN_EXPOSURE',
      details: 'Unmasked Social Security Number (SSN) detected in prompt text.'
    };
  }

  // 2. MRN Pattern Check
  if (/\bMRN[-:\s]*\d{4,8}\b/i.test(prompt) || /\bMRN[-:\s]*90\d{3}\b/i.test(prompt)) {
    return {
      hasSensitivePhi: true,
      type: 'RAW_MRN_EXPOSURE',
      details: 'Unmasked Medical Record Number (MRN) detected in prompt text.'
    };
  }

  // 3. Phone Number Check
  if (/\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(prompt)) {
    return {
      hasSensitivePhi: true,
      type: 'RAW_PHONE_EXPOSURE',
      details: 'Unmasked telephone/contact number detected in prompt text.'
    };
  }

  // 4. Date of Birth (DOB) Check
  if (/\b(DOB|Date of Birth)[:\s]*\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b/i.test(prompt)) {
    return {
      hasSensitivePhi: true,
      type: 'RAW_DOB_EXPOSURE',
      details: 'Unmasked Date of Birth (DOB) identifier detected in prompt text.'
    };
  }

  // 5. Patient Full Name Check against synthetic patient directory
  const sensitiveNames = [
    'Rajesh Sharma', 'Ananya Sen', 'Sunita Reddy', 'Madhavan Venkatesh', 
    'Jayesh Trivedi', 'Varun Deshmukh', 'Priyanka Chopra', 'Manish Changrani', 
    'Meera Patel', 'Siddharth Malhotra', 'Nisha Kapoor', 'Vikram Joshi', 
    'Anita Desai', 'Rahul Bose', 'Tanvi Shah', 'Arjun Kapoor'
  ];

  if (patients && patients.length > 0) {
    for (const p of patients) {
      if (p.fullName && !sensitiveNames.includes(p.fullName)) {
        sensitiveNames.push(p.fullName);
      }
    }
  }

  for (const name of sensitiveNames) {
    if (name && name.length > 3) {
      // If name matches the attached patient's full name, allow referencing attached patient
      if (attachedPatient && attachedPatient.fullName && name.toLowerCase() === attachedPatient.fullName.toLowerCase()) {
        continue;
      }

      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(prompt)) {
        return {
          hasSensitivePhi: true,
          type: 'UNMASKED_PATIENT_NAME_EXPOSURE',
          details: `Unmasked sensitive patient full name ("${name}") detected in prompt text.`
        };
      }
    }
  }

  // 6. Explicit Patient PHI phrases
  if (/\bpatient\s+(ssn|mrn|phone|address|dob)[:\s]+/i.test(prompt)) {
    return {
      hasSensitivePhi: true,
      type: 'RAW_PHI_PHRASE_EXPOSURE',
      details: 'Explicit patient PHI/PII descriptor phrase detected in prompt text.'
    };
  }

  return { hasSensitivePhi: false };
}

export function validateInputGuardrails(
  prompt: string, 
  context?: { actor?: UserProfile; purposeOfUse?: PurposeOfUse; patients?: SyntheticPatient[]; attachedPatient?: SyntheticPatient | null }
): GuardrailCheckResult {
  if (!prompt || prompt.trim().length === 0) {
    return { passed: false, blockReason: 'Input prompt is empty.' };
  }

  // 1. Direct Prompt Injection Check
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      const event: GuardrailEvent = {
        id: `GR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        type: 'PROMPT_INJECTION',
        severity: 'CRITICAL',
        description: `Adversarial prompt injection pattern detected matching rule: ${pattern.toString()}`,
        actionTaken: 'BLOCKED',
        details: { rawPromptSample: prompt.substring(0, 80) + '...' }
      };
      return {
        passed: false,
        blockReason: 'Security Policy Violation: Prompt injection or system instruction bypass attempt detected and blocked.',
        guardrailEvent: event
      };
    }
  }

  // 2. Sensitive PHI / PII Exposure Check
  const phiCheck = detectSensitivePhiInPrompt(prompt, context?.patients, context?.attachedPatient);
  if (phiCheck.hasSensitivePhi) {
    const event: GuardrailEvent = {
      id: `GR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'CRITICAL',
      description: `Sensitive PHI/PII Leak Guardrail Violation: ${phiCheck.details}`,
      actionTaken: 'BLOCKED',
      details: { rawPromptSample: prompt.substring(0, 80) + '...', phiType: phiCheck.type }
    };
    return {
      passed: false,
      blockReason: `Clinical Governance & Security Guardrail Interception: Sensitive raw PHI/PII detected in prompt (${phiCheck.details}). Patient identifiers cannot be transmitted directly in prompt strings.`,
      guardrailEvent: event
    };
  }

  return { passed: true, sanitizedInput: prompt.trim() };
}

export function validatePatientAccessAuthorization(
  actor: UserProfile,
  patient: SyntheticPatient,
  purpose: PurposeOfUse
): GuardrailCheckResult {
  // Auditors, Administrators and Portal Admins have system-level governed oversight
  if (actor.role === 'AUDITOR' || actor.role === 'ADMINISTRATOR' || actor.role === 'PORTAL_ADMIN') {
    return { passed: true };
  }

  // Emergency override bypasses assignment with critical audit logging
  if (purpose === 'EMERGENCY_OVERRIDE') {
    return { passed: true };
  }

  // Check 1: Patient Consent Status
  if (patient.consentStatus === 'EXPIRED_CONSENT' || patient.consentStatus === 'REVOKED') {
    const event: GuardrailEvent = {
      id: `GR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type: 'EXPIRED_CONSENT',
      severity: 'HIGH',
      description: `Patient consent is ${patient.consentStatus}. Access to medical record blocked per HIPAA Privacy Rule § 164.508.`,
      actionTaken: 'BLOCKED',
      details: { patientId: patient.id, consentStatus: patient.consentStatus, actorId: actor.id }
    };
    return {
      passed: false,
      blockReason: `Consent Restriction: Patient ${patient.id} consent is ${patient.consentStatus}. Access blocked.`,
      guardrailEvent: event
    };
  }

  // Check 2: Patient-Level Assignment (ABAC)
  const isAssigned = actor.assignedPatientIds.includes(patient.id);
  if (!isAssigned) {
    const event: GuardrailEvent = {
      id: `GR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'CRITICAL',
      description: `User ${actor.name} (${actor.role}) attempted unauthorized access to unassigned patient ${patient.id} without Emergency Override.`,
      actionTaken: 'BLOCKED',
      details: { actorId: actor.id, role: actor.role, patientId: patient.id, purpose }
    };
    return {
      passed: false,
      blockReason: `Access Denied (ABAC): Patient ${patient.id} is not within active clinical assignment for ${actor.name}.`,
      guardrailEvent: event
    };
  }

  return { passed: true };
}

export function validateOutputGroundedness(
  responseContent: string,
  retrievedChunkIds: string[],
  citedChunkIds: string[]
): GuardrailCheckResult {
  // Check if citations actually exist in retrieved context
  const invalidCitations = citedChunkIds.filter((id) => !retrievedChunkIds.includes(id));
  if (invalidCitations.length > 0) {
    const event: GuardrailEvent = {
      id: `GR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type: 'HALLUCINATED_CITATION',
      severity: 'HIGH',
      description: `Model produced citations [${invalidCitations.join(', ')}] not found in authorized knowledge retrieval context.`,
      actionTaken: 'FLAGGED',
      details: { invalidCitations, retrievedChunkIds }
    };
    return {
      passed: false,
      blockReason: 'Citation Verification Failure: Output cited unverified clinical guideline chunks.',
      guardrailEvent: event
    };
  }

  return { passed: true };
}
