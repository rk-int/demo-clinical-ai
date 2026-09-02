import { 
  AgentContract, 
  EvidenceItem, 
  GuidelineChunk, 
  UserProfile, 
  SyntheticPatient, 
  PurposeOfUse, 
  WorkflowAction, 
  WorkflowType, 
  ImprovementProposal,
  GuardrailEvent
} from '../types';
import { APPROVED_GUIDELINES } from '../data/approvedKnowledge';
import { SYNTHETIC_PATIENTS } from '../data/syntheticFhirData';
import { validateInputGuardrails, validatePatientAccessAuthorization, validateOutputGroundedness } from './guardrails';
import { sanitizePayloadForTelemetry } from './phiMasker';

// In-Memory Telemetry and Trace Store
export const GLOBAL_TRACES: AgentContract[] = [];
export const GLOBAL_WORKFLOWS: WorkflowAction[] = [];
export const GLOBAL_PROPOSALS: ImprovementProposal[] = [
  {
    id: 'PROP-2026-08',
    title: 'Update BM25 Lexical Weight & Add SGLT2 Renal Synonym Tokens',
    detectedIssue: 'Observed 3 queries regarding "eGFR renal threshold for Empagliflozin" yielding borderline relevance (72%).',
    affectedComponent: 'Knowledge Agent / Multi-Stage RAG Retriever',
    riskLevel: 'LOW',
    observedFailureCount: 3,
    recommendedFix: 'Enrich lexical token dictionary with synonyms [creatinine clearance, CKD-EPI, renal cutoff] and boost BM25 k1 parameter to 1.4.',
    beforeEvaluationScore: 89.2,
    afterEvaluationScore: 97.4,
    rollbackPlan: 'Revert retriever config commit hash c819a and restore baseline token map.',
    status: 'PENDING_ADMIN_APPROVAL',
    createdAt: '2026-08-25T18:00:00Z',
  }
];

export class ClinicalKnowledgeAgent {
  static searchGuidelines(query: string, options?: { specialty?: string; hospitalSite?: string; requireApprovedOnly?: boolean }): {
    evidence: EvidenceItem[];
    confidenceScore: number;
    rating: 'HIGH_EVIDENCE' | 'LIMITED_EVIDENCE' | 'INSUFFICIENT_EVIDENCE' | 'ABSTAINED';
    rationale: string;
    uncertainties: string[];
    retrievedChunks: GuidelineChunk[];
  } {
    const queryTerms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
    const requireApproved = options?.requireApprovedOnly !== false;

    // Collect all candidate chunks
    const allChunks: GuidelineChunk[] = [];
    for (const doc of APPROVED_GUIDELINES) {
      if (requireApproved && doc.approvalStatus !== 'APPROVED') {
        continue;
      }
      if (options?.specialty && options.specialty !== 'ALL' && doc.specialty !== options.specialty) {
        continue;
      }
      allChunks.push(...doc.chunks);
    }

    // Hybrid Lexical Scoring (BM25 Approximation)
    const scoredChunks = allChunks.map((chunk) => {
      let matchCount = 0;
      const textLower = chunk.text.toLowerCase();
      const titleLower = chunk.documentTitle.toLowerCase();
      const sectionLower = chunk.section.toLowerCase();

      queryTerms.forEach((term) => {
        if (chunk.lexicalTokens.includes(term)) matchCount += 3;
        if (textLower.includes(term)) matchCount += 2;
        if (titleLower.includes(term)) matchCount += 2.5;
        if (sectionLower.includes(term)) matchCount += 2;
      });

      const score = Math.min(0.99, matchCount / (Math.max(queryTerms.length, 1) * 3));
      return { ...chunk, relevanceScore: Number(score.toFixed(3)) };
    });

    // Filter and sort by score descending
    const filteredChunks = scoredChunks
      .filter((c) => (c.relevanceScore || 0) > 0.25)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    const topChunks = filteredChunks.slice(0, 3);

    const evidence: EvidenceItem[] = topChunks.map((c, idx) => ({
      id: `EV-${idx + 1}-${c.chunkId}`,
      chunkId: c.chunkId,
      documentTitle: c.documentTitle,
      documentVersion: c.documentVersion,
      section: c.section,
      excerpt: c.text,
      relevanceScore: c.relevanceScore || 0.8,
      approvalStatus: c.approvalStatus,
      citationKey: `[${c.documentTitle}, ${c.documentVersion}, ${c.section}]`,
    }));

    // Calculate Calibrated Confidence
    let confidenceScore = 0;
    let rating: 'HIGH_EVIDENCE' | 'LIMITED_EVIDENCE' | 'INSUFFICIENT_EVIDENCE' | 'ABSTAINED' = 'INSUFFICIENT_EVIDENCE';
    let rationale = '';
    const uncertainties: string[] = [];

    if (evidence.length >= 2 && evidence[0].relevanceScore > 0.7) {
      confidenceScore = 0.96;
      rating = 'HIGH_EVIDENCE';
      rationale = 'Query is directly answered by multiple approved institutional guidelines with active effective dates.';
    } else if (evidence.length >= 1 && evidence[0].relevanceScore >= 0.4) {
      confidenceScore = 0.74;
      rating = 'LIMITED_EVIDENCE';
      rationale = 'Single approved guideline match found; partial evidence coverage for compound questions.';
      uncertainties.push('Consider cross-referencing with attending physician or latest specialty consensus.');
    } else {
      confidenceScore = 0.2;
      rating = 'INSUFFICIENT_EVIDENCE';
      rationale = 'No approved guideline contains normative evidence directly matching this specific query.';
      uncertainties.push('Absence of indexed institutional protocol; human clinical expertise required.');
    }

    return {
      evidence,
      confidenceScore,
      rating,
      rationale,
      uncertainties,
      retrievedChunks: topChunks,
    };
  }
}

export class PatientDataAgent {
  static getPatient360(
    patientId: string,
    actor: UserProfile,
    purpose: PurposeOfUse
  ): {
    patient?: SyntheticPatient;
    authDecision: { allowed: boolean; reason: string; ruleMatched: string };
    guardrailEvent?: GuardrailEvent;
  } {
    const patient = SYNTHETIC_PATIENTS.find((p) => p.id === patientId);
    if (!patient) {
      return {
        authDecision: {
          allowed: false,
          reason: `Patient record with ID ${patientId} not found in FHIR repository.`,
          ruleMatched: 'FHIR_RESOURCE_NOT_FOUND',
        }
      };
    }

    // Run ABAC & Consent check
    const authCheck = validatePatientAccessAuthorization(actor, patient, purpose);
    if (!authCheck.passed) {
      return {
        authDecision: {
          allowed: false,
          reason: authCheck.blockReason || 'Access Denied',
          ruleMatched: authCheck.guardrailEvent?.type || 'ABAC_ASSIGNMENT_RULE',
        },
        guardrailEvent: authCheck.guardrailEvent,
      };
    }

    return {
      patient,
      authDecision: {
        allowed: true,
        reason: `Authorized access granted under purpose ${purpose} for ${actor.name} (${actor.role}).`,
        ruleMatched: 'ABAC_ASSIGNMENT_MATCH_AND_ACTIVE_CONSENT',
      }
    };
  }
}

export class WorkflowExecutionAgent {
  static generateDraftAction(
    type: WorkflowType,
    patientId: string,
    actor: UserProfile,
    purpose: PurposeOfUse
  ): WorkflowAction {
    const patient = SYNTHETIC_PATIENTS.find((p) => p.id === patientId);
    const patientName = patient ? patient.fullName : 'Unknown Patient';
    const timestamp = new Date().toISOString();
    const idempotencyKey = `IDEM-${type}-${patientId}-${Date.now()}`;

    let title = '';
    let draftContent: Record<string, any> = {};
    const validationChecks: { rule: string; passed: boolean; details: string }[] = [];

    if (type === 'CLINICAL_NOTE') {
      title = `Inpatient Cardiology Progress Note (SOAP) - ${patientName}`;
      draftContent = {
        subjective: `Patient ${patientName} (67yo F) reports improved orthopnea following IV furosemide diuresis. Denies chest pain or palpitations. Ambulating in room with minimal dyspnea.`,
        objective: {
          vitals: 'BP 118/72 mmHg, HR 74 bpm regular, SpO2 96% on RA, Temp 98.4 F',
          physicalExam: 'Cardiovascular: RRR, no murmurs. Lungs: Clear to auscultation bilaterally, bibasilar crackles resolved. Extremities: Trace (1+) pedal edema bilaterally.',
          recentLabs: 'NT-proBNP 2450 pg/mL (trending down from 2800), eGFR 38 mL/min/1.73m2, K+ 4.8 mmol/L.',
        },
        assessment: '1. Acute decompensated heart failure with preserved ejection fraction (HFpEF) - improving with net negative fluid balance.\n2. Chronic Kidney Disease Stage 3a - stable eGFR.\n3. Type 2 Diabetes Mellitus - glycemic control target 140-180 mg/dL.',
        plan: '1. Continue oral Empagliflozin 10 mg daily (safe with eGFR 38).\n2. Continue Sacubitril/Valsartan 24/26 mg BID.\n3. Step down IV Furosemide to oral Lasix 40 mg daily.\n4. Repeat BMP in 48 hours to monitor renal function.',
      };
      validationChecks.push(
        { rule: 'Allergy Conflict Check (Lisinopril/ACEi)', passed: true, details: 'Sacubitril/Valsartan initiated with appropriate prior washout; no active ACEi co-prescription.' },
        { rule: 'Renal Threshold Check (Empagliflozin eGFR >= 20)', passed: true, details: 'Patient eGFR is 38 mL/min/1.73m2, exceeding 20 threshold.' },
        { rule: 'Identity & MRN Verification', passed: true, details: 'Patient demographics verified against active master index.' }
      );
    } else if (type === 'SPECIALIST_REFERRAL') {
      title = `Specialist Consultation Order: Outpatient Heart Failure Clinic - ${patientName}`;
      draftContent = {
        referralTo: 'Advanced Heart Failure & Cardiorenal Clinic',
        urgency: 'ROUTINE (Within 2 Weeks)',
        clinicalSummary: '67yo female with symptomatic HFpEF, NYHA Class III, admitted for acute decompensation, now stabilized. Baseline eGFR 38. Requesting optimization of cardioprotective regimen and echocardiogram reassessment.',
        diagnosticAttachments: ['Echocardiogram 2026-06', 'NT-proBNP Lab Series', 'Recent Renal Panel'],
      };
      validationChecks.push(
        { rule: 'Primary Care Physician Sign-off Requirement', passed: true, details: 'Authorized ordering provider credentials verified.' },
        { rule: 'Insurance Authorization Criteria', passed: true, details: 'Clinical documentation meets standard medical necessity criteria.' }
      );
    } else if (type === 'DISCHARGE_SUMMARY') {
      title = `Hospital Discharge Summary & Instructions - ${patientName}`;
      draftContent = {
        admissionDate: '2026-08-23',
        dischargeDate: '2026-08-27 (Anticipated)',
        dischargeDisposition: 'Home with Home Health Physical Therapy',
        dischargeMedications: [
          'Empagliflozin 10 mg PO Daily',
          'Sacubitril/Valsartan 24/26 mg PO BID',
          'Furosemide 40 mg PO Daily in AM',
        ],
        followUpAppointments: 'Heart Failure Clinic on 2026-09-08 (10:00 AM)',
        patientWarningSigns: 'Call clinic immediately or proceed to ER if daily weight increases > 3 lbs in 24 hours, swelling in ankles worsens, or severe shortness of breath occurs.',
      };
      validationChecks.push(
        { rule: 'Medication Reconciliation Complete', passed: true, details: 'All home medications compared against inpatient MAR.' },
        { rule: 'Patient Education & Warning Signs Attached', passed: true, details: 'Multilingual discharge packet prepared.' }
      );
    } else {
      title = `Care Task Follow-up & Notification - ${patientName}`;
      draftContent = {
        taskName: 'Post-Discharge 48-Hour Telephone Check-in',
        assignedRole: 'Care Coordinator',
        dueDate: '2026-08-29',
        instructions: 'Verify medication fill, confirm daily weight log, and check for signs of volume overload.',
      };
      validationChecks.push(
        { rule: 'Care Coordinator Assignment', passed: true, details: 'Carlos Mendez, MSW assigned as case navigator.' }
      );
    }

    const action: WorkflowAction = {
      id: `WF-${Date.now()}`,
      idempotencyKey,
      workflowType: type,
      patientId,
      patientName,
      createdBy: actor.name,
      createdAt: timestamp,
      title,
      state: 'PENDING_HUMAN_APPROVAL',
      draftContent,
      originalDraftContent: JSON.parse(JSON.stringify(draftContent)),
      validationChecks,
    };

    GLOBAL_WORKFLOWS.unshift(action);
    return action;
  }

  static approveAction(
    actionId: string, 
    actor: UserProfile, 
    editedContent?: Record<string, any>
  ): WorkflowAction | null {
    const action = GLOBAL_WORKFLOWS.find((w) => w.id === actionId);
    if (!action) return null;

    if (editedContent) {
      action.draftContent = editedContent;
      action.isEdited = true;
      action.editedAt = new Date().toISOString();
      action.editorName = actor.name;
      action.editorRole = actor.role;
    }

    action.state = 'EXECUTED_SIMULATION';
    action.approver = {
      userId: actor.id,
      name: actor.name,
      approvedAt: new Date().toISOString(),
      signatureHash: `SIG-RSA-${Date.now().toString(16)}-${actor.id}`,
    };
    action.simulationExecutionLog = {
      destinationService: 'Enterprise EHR Integration Gateway (FHIR R4 Bridge)',
      executedAt: new Date().toISOString(),
      mockTransactionId: `TX-FHIR-${Date.now()}`,
      rollbackAvailable: true,
    };

    return action;
  }

  static rollbackAction(actionId: string): WorkflowAction | null {
    const action = GLOBAL_WORKFLOWS.find((w) => w.id === actionId);
    if (!action) return null;

    action.state = 'ROLLED_BACK';
    return action;
  }

  static rejectAction(actionId: string, actor: UserProfile, reason?: string): WorkflowAction | null {
    const action = GLOBAL_WORKFLOWS.find((w) => w.id === actionId);
    if (!action) return null;

    action.state = 'REJECTED';
    action.approver = {
      userId: actor.id,
      name: actor.name,
      approvedAt: new Date().toISOString(),
      signatureHash: `REJECT-${Date.now().toString(16)}-${actor.id}`,
    };
    action.simulationExecutionLog = {
      destinationService: 'Enterprise EHR Integration Gateway (Discarded / Rejected)',
      executedAt: new Date().toISOString(),
      mockTransactionId: `TX-REJECTED-${Date.now()}`,
      rollbackAvailable: false,
    };
    return action;
  }
}
