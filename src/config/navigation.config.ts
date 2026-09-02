import { UserRole } from '../types';

export interface NavItemConfig {
  id: string;
  label: string;
  shortLabel?: string;
  description?: string;
  allowedRoles?: UserRole[];
  badge?: string;
}

export const WORKSPACE_TABS_CONFIG: NavItemConfig[] = [
  { id: 'HOME', label: 'Home Dashboard', shortLabel: 'Home', description: 'Real-time patient census, clinical KPIs and priority tasks' },
  { id: 'PATIENTS', label: 'Patient 360 & Registry', shortLabel: 'Patients', description: 'Search, review full longitudinal medical records, and register new patients' },
  { id: 'KNOWLEDGE_QA', label: 'AI Clinical Assistant', shortLabel: 'AI Assistant', description: 'Grounded guideline RAG, differential diagnosis, and patient summarizer' },
  { id: 'WORKFLOW', label: 'Workflow & Document Center', shortLabel: 'Workflow', description: 'Clinical notes, discharge plans, referrals, and orders' },
  { id: 'REPORTS', label: 'Clinical Reports Center', shortLabel: 'Reports', description: 'Longitudinal reports, PDF exports, and multi-disciplinary case summaries' },
  { id: 'OPERATIONS', label: 'Agent Operations & Graph', shortLabel: 'Agent Ops', description: 'Live multi-agent graph, tool orchestration, and gateway routing' },
  { id: 'SAFETY_AUDIT', label: 'Observability & Safety Audit', shortLabel: 'Observability', description: 'Responsible AI guardrails, latency telemetry, token cost & audit logs' },
  { id: 'AI_JUDGE', label: 'AI Judge & Evaluation Lifecycle', shortLabel: 'AI Judge', allowedRoles: ['ADMINISTRATOR', 'PORTAL_ADMIN', 'AUDITOR', 'DOCTOR'], description: '14-stage automated evaluation pipeline and self-improving prompt proposals' },
  { id: 'DATA_ARCHITECTURE', label: 'PostgreSQL Cloud Architecture', shortLabel: 'Database', allowedRoles: ['ADMINISTRATOR', 'PORTAL_ADMIN', 'AUDITOR'], description: 'Schema visualizer, relational indexing, and FHIR table telemetry' },
];

export const PATIENT_360_TABS_CONFIG = [
  { id: 'OVERVIEW', label: 'Overview' },
  { id: 'HISTORY', label: 'Medical History' },
  { id: 'MEDICATIONS', label: 'Medications' },
  { id: 'LABS', label: 'Lab Results' },
  { id: 'REPORTS', label: 'Clinical Reports' },
  { id: 'IMAGING', label: 'Imaging & X-Ray' },
  { id: 'DOCUMENTS', label: 'Documents' },
  { id: 'AI_SUMMARY', label: 'AI Synthesis' },
  { id: 'AI_QNA', label: 'Clinical Q&A' },
];
