import { UserRole, PurposeOfUse, UserProfile } from './auth.types';

export interface ProvenanceRecord {
  sourceSystem: string;
  ingestionTimestamp: string;
  recordedBy: string;
  verificationStatus: 'VERIFIED' | 'PRELIMINARY' | 'AMENDED';
  checksum: string;
}

export interface GuidelineChunk {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  documentVersion: string;
  approvalStatus: 'APPROVED' | 'DRAFT' | 'DEPRECATED' | 'UNDER_REVIEW';
  specialty: string;
  hospitalSite: string;
  effectiveDate: string;
  section: string;
  text: string;
  lexicalTokens: string[];
  relevanceScore?: number;
}

export interface GuidelineDocument {
  id: string;
  title: string;
  version: string;
  specialty: string;
  hospitalSite: string;
  approvalStatus: 'APPROVED' | 'DRAFT' | 'DEPRECATED' | 'UNDER_REVIEW';
  publishedDate: string;
  effectiveDate: string;
  summary: string;
  chunks: GuidelineChunk[];
}

export interface EvidenceItem {
  id: string;
  chunkId: string;
  documentTitle: string;
  documentVersion: string;
  section: string;
  excerpt: string;
  relevanceScore: number;
  approvalStatus: 'APPROVED' | 'DRAFT' | 'DEPRECATED' | 'UNDER_REVIEW';
  citationKey: string;
}

export type ConfidenceRating = 'HIGH_EVIDENCE' | 'LIMITED_EVIDENCE' | 'INSUFFICIENT_EVIDENCE' | 'ABSTAINED';

export interface GuardrailEvent {
  id: string;
  timestamp: string;
  type: 'PROMPT_INJECTION' | 'UNAUTHORIZED_ACCESS' | 'OUT_OF_SCOPE' | 'HALLUCINATED_CITATION' | 'PHI_MASKED' | 'EXPIRED_CONSENT' | 'UNAPPROVED_GUIDELINE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  actionTaken: 'BLOCKED' | 'FLAGGED' | 'SANITIZED' | 'ABSTAINED';
  details: Record<string, any>;
}

export interface AgentContract {
  agentName: 'KnowledgeAgent' | 'PatientDataAgent' | 'WorkflowAgent' | 'SelfImprovingAgent' | 'GatewayOrchestrator';
  agentVersion: string;
  traceId: string;
  requestId: string;
  actor: {
    userId: string;
    userName: string;
    role: UserRole;
  };
  purposeOfUse: PurposeOfUse;
  patientScope?: string;
  inputSchema: Record<string, any>;
  authorizationDecision: {
    allowed: boolean;
    reason: string;
    ruleMatched: string;
  };
  toolsInvoked: string[];
  evidenceItems: EvidenceItem[];
  outputSchema: Record<string, any>;
  confidence: {
    score: number;
    rating: ConfidenceRating;
    rationale: string;
  };
  uncertainties: string[];
  guardrailEvents: GuardrailEvent[];
  humanApprovalRequired: boolean;
  latencyMs: number;
  status: 'SUCCESS' | 'BLOCKED' | 'ABSTAINED' | 'FALLBACK_TRIGGERED' | 'ERROR';
  errorCode?: string;
}

export interface BreakItScenario {
  id: string;
  title: string;
  category: 'SECURITY' | 'PRIVACY' | 'CLINICAL_SAFETY' | 'DATA_QUALITY' | 'RESILIENCE';
  description: string;
  promptPayload: string;
  targetPatientId?: string;
  expectedBehavior: string;
  expectedStatus: 'BLOCKED' | 'ABSTAINED' | 'FLAGGED' | 'SANITIZED';
  guardrailTypeTriggered: string;
  auditExplanation: string;
}

export interface ImprovementProposal {
  id: string;
  title: string;
  detectedIssue: string;
  affectedComponent: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  observedFailureCount: number;
  recommendedFix: string;
  beforeEvaluationScore: number;
  afterEvaluationScore: number;
  rollbackPlan: string;
  status: 'PENDING_ADMIN_APPROVAL' | 'APPROVED_AND_DEPLOYED' | 'REJECTED';
  createdAt: string;
  approvedBy?: string;
}

export interface KpiMetrics {
  totalRequests: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  groundednessScore: number;
  citationValidityScore: number;
  contextRelevanceScore: number;
  unauthorizedAccessBlocks: number;
  promptInjectionBlocks: number;
  phiMaskingPassRate: number;
  workflowApprovalGateCompliance: number;
  safeFallbackRate: number;
}

export type EvaluationStageId = 
  | 'REQUEST_VALIDATION'
  | 'AUTH_ABAC'
  | 'DATA_QUALITY'
  | 'RAG_EVALUATION'
  | 'GROUNDING'
  | 'AGENT_EVALUATION'
  | 'LLM_VALIDATION'
  | 'RESPONSIBLE_AI_GUARDRAILS'
  | 'HUMAN_REVIEW'
  | 'BUSINESS_OUTCOME'
  | 'AI_JUDGE'
  | 'SELF_IMPROVEMENT'
  | 'HUMAN_APPROVAL'
  | 'CONTINUOUS_IMPROVEMENT';

export interface EvaluationStageExecution {
  stageId: EvaluationStageId;
  stageNumber: number;
  name: string;
  category: 'SECURITY' | 'RAG' | 'AGENT' | 'MODEL' | 'GOVERNANCE' | 'HUMAN_LOOP';
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'WARNING' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  score?: number;
  metricLabel?: string;
  details: string;
  outputPayload?: Record<string, any>;
}

export interface FullLifecycleTrace {
  traceId: string;
  requestId: string;
  timestamp: string;
  user: UserProfile;
  purpose: PurposeOfUse;
  query: string;
  patientId?: string;
  overallStatus: 'PASSED' | 'GUARDRAIL_BLOCKED' | 'PENDING_APPROVAL' | 'ABSTAINED';
  stages: EvaluationStageExecution[];
  finalAnswer?: string;
  aiJudgeVerdict?: {
    faithfulness: number;
    groundedness: number;
    contextRelevance: number;
    safetyCompliance: number;
    clinicalProtocolAdherence: number;
    verdict: 'APPROVED' | 'REQUIRES_REFINEMENT' | 'REJECTED';
    reasoning: string;
  };
}

export interface AIJudgeConfig {
  minimumGroundednessThreshold: number;
  minimumFaithfulnessThreshold: number;
  hallucinationTolerance: 'ZERO_TOLERANCE' | 'RESTRICTED' | 'PERMISSIVE';
  autoProposeSelfImprovement: boolean;
  requiredJudgeModel: string;
  governanceMode: 'ENFORCE_STRICT' | 'AUDIT_ONLY';
}

export interface PostgresTableMeta {
  tableName: string;
  category: 'CLINICAL' | 'KNOWLEDGE' | 'GOVERNANCE' | 'TELEMETRY';
  rowCount: number;
  sizeKb: number;
  description: string;
  columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean; nullable: boolean }[];
}
