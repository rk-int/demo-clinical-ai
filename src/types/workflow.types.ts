import { UserRole } from './auth.types';

export type WorkflowType = 'CLINICAL_NOTE' | 'DISCHARGE_SUMMARY' | 'SPECIALIST_REFERRAL' | 'APPOINTMENT_SCHEDULE' | 'CARE_TASK_FOLLOWUP';
export type WorkflowState = 'DRAFT' | 'VALIDATED' | 'PENDING_HUMAN_APPROVAL' | 'EXECUTED_SIMULATION' | 'ROLLED_BACK' | 'REJECTED';

export interface WorkflowAction {
  id: string;
  idempotencyKey: string;
  workflowType: WorkflowType;
  patientId: string;
  patientName: string;
  createdBy: string;
  createdAt: string;
  title: string;
  state: WorkflowState;
  draftContent: Record<string, any>;
  validationChecks: {
    rule: string;
    passed: boolean;
    details: string;
  }[];
  approver?: {
    userId: string;
    name: string;
    approvedAt: string;
    signatureHash: string;
  };
  simulationExecutionLog?: {
    destinationService: string;
    executedAt: string;
    mockTransactionId: string;
    rollbackAvailable: boolean;
  };
  originalDraftContent?: Record<string, any>;
  isEdited?: boolean;
  editedAt?: string;
  editorName?: string;
  editorRole?: UserRole;
}

export interface ClinicalTeamNote {
  id: string;
  patientId: string;
  patientName: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorDepartment: string;
  noteType: 'DOCTOR_PROGRESS_NOTE' | 'NURSE_ASSESSMENT' | 'SPECIALIST_CONSULT' | 'CARE_COORDINATION' | 'ADMIN_REVIEW' | 'PORTAL_AUDIT' | 'DISCHARGE_PLAN';
  title: string;
  timestamp: string;
  status: 'SIGNED_FINAL' | 'PENDING_CO_SIGN' | 'AMENDED';
  content: {
    subjective?: string;
    objective?: string | { vitals?: string; physicalExam?: string; recentLabs?: string };
    assessment?: string;
    plan?: string;
    summary?: string;
    keyRecommendations?: string[];
  };
  originalAiDraft?: {
    subjective?: string;
    objective?: string | { vitals?: string; physicalExam?: string; recentLabs?: string };
    assessment?: string;
    plan?: string;
    summary?: string;
    keyRecommendations?: string[];
  };
  isEditedByClinician?: boolean;
  editorName?: string;
  editorRole?: UserRole;
  editedAt?: string;
  workflowActionId?: string;
  tags: string[];
  signatureHash: string;
}
