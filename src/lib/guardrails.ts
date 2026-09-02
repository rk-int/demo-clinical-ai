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

export function validateInputGuardrails(prompt: string, context?: { actor?: UserProfile; purposeOfUse?: PurposeOfUse }): GuardrailCheckResult {
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
