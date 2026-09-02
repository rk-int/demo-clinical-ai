import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  HardDrive, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Search, 
  BookOpen, 
  Workflow, 
  FileCode, 
  Terminal, 
  Activity, 
  Sparkles, 
  Filter, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Pause, 
  Zap, 
  Sliders, 
  GitBranch, 
  FileCheck, 
  Eye, 
  Shield, 
  Clock, 
  ChevronRight,
  Code,
  Copy,
  Check,
  CheckCheck,
  User,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { SyntheticPatient, UserProfile, PurposeOfUse } from '../../types';

export type FlowMode = 'PATIENT_SEARCH' | 'NEW_PATIENT' | 'CLINICAL_QA' | 'WORKFLOW_CENTER';

interface LiveAgenticWorkflowGraphProps {
  mode: FlowMode;
  patient?: SyntheticPatient;
  query?: string;
  currentUser?: UserProfile;
  purposeOfUse?: PurposeOfUse;
  isCompact?: boolean;
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  subLabel: string;
  category: 'INGRESS' | 'GATEWAY' | 'AGENT' | 'DATABASE' | 'RAG_STAGE' | 'GUARDRAIL' | 'LLM' | 'OUTPUT';
  icon: React.ComponentType<{ className?: string }>;
  status: 'COMPLETED' | 'PROCESSING' | 'READY' | 'STANDBY';
  latencyMs: number;
  details: {
    sourceSystem?: string;
    dbTable?: string;
    sqlQuery?: string;
    description: string;
    metadata?: Record<string, string | number | boolean>;
  };
}

export const LiveAgenticWorkflowGraph: React.FC<LiveAgenticWorkflowGraphProps> = ({
  mode,
  patient,
  query,
  currentUser = {
    id: 'DOC-401',
    name: 'Dr. Sarah Lin, MD',
    role: 'ATTENDING_PHYSICIAN',
    department: 'Cardiology',
    hospitalSite: 'St. Jude Heart Center',
  },
  purposeOfUse = 'TREATMENT',
  isCompact = false,
  onNodeClick,
  className = '',
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  const patientName = patient?.fullName || 'Elena Rostova';
  const patientMrn = patient?.mrn || 'MRN-884920';
  const patientId = patient?.id || 'pat-1001';
  const currentQuery = query || 'What is the minimum eGFR threshold to initiate Empagliflozin in patients with HFpEF?';

  // Construct Nodes based on scenario
  const getGraphPipeline = (): { title: string; subtitle: string; dbInfo: string; nodes: GraphNode[] } => {
    switch (mode) {
      case 'PATIENT_SEARCH':
        return {
          title: 'Patient Search & Database Retrieval Pipeline',
          subtitle: 'Zero-Trust ABAC Authenticated Query over PostgreSQL FHIR R4 Repository',
          dbInfo: 'PostgreSQL 16 Relational Store (Table: fhir_patients, Table: lab_observations)',
          nodes: [
            {
              id: 'node-ingress',
              label: 'Doctor Search Request',
              subLabel: `${currentUser.name} (${purposeOfUse})`,
              category: 'INGRESS',
              icon: UserCheck,
              status: 'COMPLETED',
              latencyMs: 12,
              details: {
                description: 'Clinical user initiated search query for patient identifier / MRN with verified ABAC context.',
                metadata: {
                  physicianId: currentUser.id,
                  purposeOfUse: purposeOfUse,
                  clientIp: '10.240.12.84 (Internal Clinical LAN)',
                  tlsVersion: 'TLS 1.3 / mTLS Client Cert Verified',
                },
              },
            },
            {
              id: 'node-gateway',
              label: 'AI Gateway Orchestrator',
              subLabel: 'Auth & Intent Dispatcher',
              category: 'GATEWAY',
              icon: ShieldCheck,
              status: 'COMPLETED',
              latencyMs: 18,
              details: {
                description: 'Gateway checks RBAC permissions, decrypts session token, determines intent (FHIR_SEARCH_INTENT), and routes to Patient Search Agent.',
                metadata: {
                  intentScore: '0.998 (HIGH_CONFIDENCE)',
                  targetRoute: 'patient_search_agent',
                  zeroTrustPass: true,
                  auditEventId: 'AUD-2026-SEARCH-8910',
                },
              },
            },
            {
              id: 'node-agent',
              label: 'Patient Search Agent',
              subLabel: 'FHIR Model & Provenance Verifier',
              category: 'AGENT',
              icon: Search,
              status: 'COMPLETED',
              latencyMs: 34,
              details: {
                description: 'Executes parameterized SQL query to load longitudinal patient demographics, active conditions, medications, LOINC labs, and calculates allergy contraindications.',
                metadata: {
                  targetMrn: patientMrn,
                  fhirResource: 'Patient / Observation / Condition / MedicationStatement',
                  allergyCheck: 'Active (Flagged Lisinopril Angioedema)',
                  ckdStageCalculation: 'CKD Stage 3b (eGFR 38 mL/min)',
                },
              },
            },
            {
              id: 'node-db',
              label: 'PostgreSQL FHIR Database',
              subLabel: 'Relational Store (Tables: fhir_patients, lab_obs)',
              category: 'DATABASE',
              icon: Database,
              status: 'COMPLETED',
              latencyMs: 22,
              details: {
                sourceSystem: 'PostgreSQL 16 Cloud SQL / Epic Systems HL7 Ingress',
                dbTable: 'public.fhir_patients JOIN public.lab_observations',
                sqlQuery: `SELECT p.id, p.mrn, p.full_name, p.age, p.conditions, p.medications, p.allergies,
       json_agg(l.*) AS lab_observations
FROM public.fhir_patients p
LEFT JOIN public.lab_observations l ON l.patient_id = p.id
WHERE p.mrn = '${patientMrn}' OR p.id = '${patientId}'
GROUP BY p.id;`,
                description: 'Retrieved verified normalized JSONB patient record with SHA-256 cryptographic provenance hash.',
                metadata: {
                  recordsFound: 1,
                  totalLabsAggregated: patient?.observations?.length || 8,
                  checksum: 'sha256:4f8e9102ca8b47e1',
                  readThroughput: '14.2 MB/s',
                },
              },
            },
            {
              id: 'node-output',
              label: 'Patient 360 Assembled',
              subLabel: `${patientName} (${patientMrn})`,
              category: 'OUTPUT',
              icon: CheckCheck,
              status: 'COMPLETED',
              latencyMs: 8,
              details: {
                description: 'Sanitized clinical record assembled, enriched with LOINC trends and ready for attending review.',
                metadata: {
                  patientName,
                  mrn: patientMrn,
                  eGfrStatus: '38 mL/min (Critical Attention)',
                  activeMedsCount: patient?.medications?.length || 3,
                },
              },
            },
          ],
        };

      case 'NEW_PATIENT':
        return {
          title: 'New Patient Registration & Database Ingestion Pipeline',
          subtitle: 'Multimodal Parsing, Deterministic UPR Allocation & PostgreSQL Commit',
          dbInfo: 'PostgreSQL 16 (INSERT INTO fhir_patients, INSERT INTO audit_events)',
          nodes: [
            {
              id: 'node-ingress',
              label: 'Intake Payload Ingress',
              subLabel: 'PDF / HL7 / FHIR Shell',
              category: 'INGRESS',
              icon: FileCode,
              status: 'COMPLETED',
              latencyMs: 25,
              details: {
                description: 'Received synthetic intake bundle or cross-facility transfer document from clinician portal.',
                metadata: {
                  sourceFacility: 'North River Community Hospital (Cross-Facility Transfer)',
                  documentType: 'Clinical Discharge Summary & Transfer Record (PDF)',
                  fileSize: '412 KB',
                },
              },
            },
            {
              id: 'node-gateway',
              label: 'AI Gateway Ingestion Gate',
              subLabel: 'Schema Sanitization & OCR',
              category: 'GATEWAY',
              icon: ShieldCheck,
              status: 'COMPLETED',
              latencyMs: 38,
              details: {
                description: 'Gateway runs input schema validation, scans for malformed payloads, and dispatches to Patient Ingestion Pipeline.',
                metadata: {
                  payloadVerified: true,
                  malwareScan: 'CLEAN',
                  phiMaskingEngine: 'Active (DLP Tokens Bound)',
                },
              },
            },
            {
              id: 'node-agent',
              label: 'Patient Ingestion Agent',
              subLabel: 'Universal Patient Registry (UPR)',
              category: 'AGENT',
              icon: User,
              status: 'COMPLETED',
              latencyMs: 65,
              details: {
                description: 'Generates collision-resistant deterministic UPR hash, standardizes ICD-10/SNOMED coding, and constructs verified FHIR R4 Patient resource.',
                metadata: {
                  assignedUpr: 'UPR-2026-NRH-992014',
                  icd10Code: 'J47.9 (Bronchiectasis)',
                  consentStatus: 'ACTIVE_CONSENT',
                },
              },
            },
            {
              id: 'node-db',
              label: 'PostgreSQL Database Commit',
              subLabel: 'ACID Transaction (Table: fhir_patients)',
              category: 'DATABASE',
              icon: Database,
              status: 'COMPLETED',
              latencyMs: 32,
              details: {
                sourceSystem: 'PostgreSQL 16 Cloud SQL Instance',
                dbTable: 'public.fhir_patients & public.clinical_encounters',
                sqlQuery: `BEGIN TRANSACTION;
INSERT INTO public.fhir_patients (id, upr_id, mrn, full_name, age, gender, hospital_site, consent_status, conditions, medications, provenance_checksum)
VALUES ('${patientId}', 'UPR-2026-NRH-992014', '${patientMrn}', '${patientName}', 62, 'FEMALE', 'North River Community Hospital', 'ACTIVE_CONSENT', '["J47.9"]'::jsonb, '["Levofloxacin"]'::jsonb, 'sha256-verified-commit-991');
COMMIT;`,
                description: 'Successfully committed normalized patient record with atomic ACID isolation and synchronous audit event log write.',
                metadata: {
                  transactionStatus: 'COMMITTED',
                  rowsAffected: 1,
                  walSyncLatency: '1.2 ms',
                },
              },
            },
            {
              id: 'node-output',
              label: 'Patient Record Live',
              subLabel: 'Available in Patient 360',
              category: 'OUTPUT',
              icon: CheckCircle2,
              status: 'COMPLETED',
              latencyMs: 5,
              details: {
                description: 'New synthetic patient record is indexed, available for queries, and visible across all hospital departments.',
                metadata: {
                  status: 'READY_FOR_CLINICAL_REVIEW',
                  uprId: 'UPR-2026-NRH-992014',
                },
              },
            },
          ],
        };

      case 'CLINICAL_QA':
        return {
          title: 'Enterprise Multistage RAG & Governed Agentic Flow',
          subtitle: 'Hybrid Dense+BM25 Search, Reciprocal Rank Fusion, Guardrails & Decision Engine',
          dbInfo: 'Vector DB (768-dim Cloud pgvector) + BM25 Sparse Index + Approved Guidelines Store',
          nodes: [
            {
              id: 'node-query',
              label: 'Doctor Clinical Query',
              subLabel: 'Evidence Inquiry Ingress',
              category: 'INGRESS',
              icon: Search,
              status: 'COMPLETED',
              latencyMs: 15,
              details: {
                description: `Clinician submitted evidence inquiry regarding guideline recommendations and contraindications: "${currentQuery}"`,
                metadata: {
                  doctor: currentUser.name,
                  department: currentUser.department || 'Cardiology',
                  specialtyScope: 'CARDIOLOGY / HFpEF',
                },
              },
            },
            {
              id: 'node-gateway',
              label: 'AI Gateway & Intent Router',
              subLabel: 'Zero-Trust Policy Check',
              category: 'GATEWAY',
              icon: ShieldCheck,
              status: 'COMPLETED',
              latencyMs: 22,
              details: {
                description: 'Analyzes prompt tokens, strips potential prompt injections (OWASP LLM01), verifies purpose-of-use, and dispatches to 5-Stage Multimodal Knowledge Engine.',
                metadata: {
                  intent: 'CLINICAL_GUIDELINE_RAG_INTENT',
                  classificationConfidence: '0.996',
                  securityCheck: 'PASSED (0 injection vectors)',
                },
              },
            },
            {
              id: 'node-vectordb',
              label: 'Vector Database & BM25 Store',
              subLabel: 'pgvector (768d) + Inverted Index',
              category: 'DATABASE',
              icon: Database,
              status: 'COMPLETED',
              latencyMs: 48,
              details: {
                sourceSystem: 'PostgreSQL 16 pgvector + BM25 Sparse Full-Text Inverted Index',
                dbTable: 'public.approved_guideline_chunks',
                sqlQuery: `SELECT chunk_id, document_title, section, chunk_text,
       1 - (embedding <=> $query_embedding_768d) AS vector_similarity,
       ts_rank_cd(text_search_vector, plainto_tsquery('english', '${currentQuery.replace(/'/g, '')}')) AS bm25_score
FROM public.approved_guideline_chunks
WHERE is_approved = true AND validity_year >= 2025
ORDER BY (0.5 * (1 - (embedding <=> $query_embedding_768d)) + 0.5 * ts_rank_cd(text_search_vector, plainto_tsquery('english', '...'))) DESC
LIMIT 15;`,
                description: 'Dual retrieval pipeline: dense cosine vector similarity (768 dimensions) executed alongside BM25 sparse lexical tokens over verified ACC/AHA & GOLD guidelines.',
                metadata: {
                  denseChunksFound: 8,
                  sparseBm25Matches: 6,
                  totalGuidelineCorpus: '10 Approved Guidelines (480 Chunks)',
                },
              },
            },
            {
              id: 'node-hybrid',
              label: 'Hybrid Search & Metadata Filter',
              subLabel: 'Reciprocal Rank Fusion (RRF)',
              category: 'RAG_STAGE',
              icon: Filter,
              status: 'COMPLETED',
              latencyMs: 19,
              details: {
                description: 'Applies deterministic clinical metadata constraints (Cardiology Specialty, Year >= 2025, Non-expired guidelines) and merges rankings using RRF algorithm: RRF_score = sum(1 / (60 + rank_i)).',
                metadata: {
                  rrfConstant: 60,
                  filteredOutdatedChunks: 4,
                  candidateChunksRemaining: 5,
                },
              },
            },
            {
              id: 'node-rerank',
              label: 'Cross-Encoder Reranking',
              subLabel: 'Semantic Relevance Scoring',
              category: 'RAG_STAGE',
              icon: Sliders,
              status: 'COMPLETED',
              latencyMs: 35,
              details: {
                description: 'Computes deep semantic cross-attention between user query and retrieved guideline passages to calculate high-fidelity relevance scores and eliminate false positives.',
                metadata: {
                  topChunkScore: '0.984 (ACC/AHA HFpEF Guideline Sec 4.2)',
                  secondaryChunkScore: '0.941 (Renal SGLT2 Safety Protocol)',
                  hallucinationPreventionFilter: 'PASSED',
                },
              },
            },
            {
              id: 'node-guardrails',
              label: 'AI Decision Engine & Guardrails',
              subLabel: 'OWASP LLM01, DLP & Toxic Filter',
              category: 'GUARDRAIL',
              icon: Shield,
              status: 'COMPLETED',
              latencyMs: 28,
              details: {
                description: 'Enforces strict medical grounding boundaries: ensures no out-of-guideline extrapolation, masks any accidental PII/PHI, and injects mandatory uncertainty disclaimers for borderline indications.',
                metadata: {
                  dlpMaskingActive: true,
                  outOfDomainShield: 'SECURE',
                  mandatoryCitationGate: 'ENFORCED (Zero Speculation)',
                },
              },
            },
            {
              id: 'node-llm',
              label: 'LLM Reasoning Engine',
              subLabel: 'Gemini 3.7 Flash + Fallback Ladder',
              category: 'LLM',
              icon: Sparkles,
              status: 'COMPLETED',
              latencyMs: 140,
              details: {
                description: 'Synthesizes grounded clinical decision summary strictly referencing retrieved chunk IDs and provides structured claim-to-citation mappings.',
                metadata: {
                  primaryModel: 'gemini-3.7-flash',
                  fallbackLadder: 'gemini-3.6-flash -> gemini-3.1-flash-lite -> gemini-flash-latest',
                  temperature: '0.0 (Deterministic Clinical Mode)',
                  generatedTokens: 384,
                },
              },
            },
            {
              id: 'node-output',
              label: 'Grounded Evidence Output',
              subLabel: 'Verifiable Claim-to-Chunk Citations',
              category: 'OUTPUT',
              icon: CheckCircle2,
              status: 'COMPLETED',
              latencyMs: 10,
              details: {
                description: 'Final grounded clinical answer returned with explicit confidence calibration rating (HIGH_EVIDENCE, 96%) and clickable verified guideline sources.',
                metadata: {
                  confidenceScore: '96%',
                  citedDocuments: 'ACC/AHA 2025 HFpEF Guideline (Sec 4.2, Chunk #104)',
                },
              },
            },
          ],
        };

      case 'WORKFLOW_CENTER':
        return {
          title: 'Clinical Workflow Synthesis & Order Generation Pipeline',
          subtitle: 'Schema-Constrained Draft Generation with Mandatory Attending Physician Gate',
          dbInfo: 'PostgreSQL 16 (Table: workflow_actions, Table: fhir_medication_requests)',
          nodes: [
            {
              id: 'node-ingress',
              label: 'Clinician Intent Ingress',
              subLabel: 'Order / Note Synthesis Trigger',
              category: 'INGRESS',
              icon: Workflow,
              status: 'COMPLETED',
              latencyMs: 14,
              details: {
                description: `Clinician triggered automated draft order synthesis for patient ${patientName}.`,
                metadata: {
                  physician: currentUser.name,
                  workflowType: 'MEDICATION_ORDER & LAB_MONITORING_PROTOCOL',
                },
              },
            },
            {
              id: 'node-gateway',
              label: 'AI Gateway HITL Orchestrator',
              subLabel: 'Deterministic Schema Guard',
              category: 'GATEWAY',
              icon: ShieldCheck,
              status: 'COMPLETED',
              latencyMs: 26,
              details: {
                description: 'Enforces strictly governed action schemas. Blocks any autonomous database mutations without explicit electronic signature.',
                metadata: {
                  autonomousWriteBlocked: true,
                  hitlEnforced: true,
                },
              },
            },
            {
              id: 'node-agent',
              label: 'Workflow Agent',
              subLabel: 'MedicationRequest Synthesizer',
              category: 'AGENT',
              icon: Cpu,
              status: 'COMPLETED',
              latencyMs: 58,
              details: {
                description: 'Generates structured FHIR MedicationRequest draft (Empagliflozin 10mg PO Daily) and pairs companion monitoring order (BMP at 14 days).',
                metadata: {
                  medication: 'Empagliflozin 10mg Oral Tablet',
                  dosage: '10mg PO Daily QAM',
                  companionLab: 'Basic Metabolic Panel (BMP) at 2 weeks',
                },
              },
            },
            {
              id: 'node-db',
              label: 'PostgreSQL Staging DB',
              subLabel: 'Draft Record (Table: workflow_actions)',
              category: 'DATABASE',
              icon: Database,
              status: 'COMPLETED',
              latencyMs: 24,
              details: {
                sourceSystem: 'PostgreSQL 16 Database',
                dbTable: 'public.workflow_actions',
                sqlQuery: `INSERT INTO public.workflow_actions (id, patient_id, created_by, status, draft_payload, hitl_required)
VALUES ('wf-act-8820', '${patientId}', '${currentUser.id}', 'PENDING_PHYSICIAN_APPROVAL', '{"medication": "Empagliflozin 10mg", "monitoring": "BMP 14d"}'::jsonb, true);`,
                description: 'Saved idempotent workflow draft in pending state. Direct EHR commit is locked pending digital sign-off.',
                metadata: {
                  approvalState: 'AWAITING_ATTENDING_SIGNATURE',
                  tableState: 'DRAFT_STAGING',
                },
              },
            },
            {
              id: 'node-hitl',
              label: 'Attending Physician Sign-Off Gate',
              subLabel: 'Mandatory Human-in-the-Loop',
              category: 'GUARDRAIL',
              icon: Lock,
              status: 'READY',
              latencyMs: 0,
              details: {
                description: 'Requires attending physician single-click or MFA token sign-off before committing to institutional pharmacy dispensing systems.',
                metadata: {
                  gateStatus: 'BLOCKED_UNTIL_MANUAL_APPROVE',
                  approvingPhysicianRole: 'ATTENDING_PHYSICIAN',
                },
              },
            },
          ],
        };
    }
  };

  const graphData = getGraphPipeline();
  const nodes = graphData.nodes;

  // Auto step ticker for live graph visualization
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (nodes.length + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying, nodes.length]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[Math.min(activeStep, nodes.length - 1)];

  const handleCopyQuery = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className={`rounded-2xl bg-[#060a08] border border-[#162e1c] p-4 text-white shadow-2xl backdrop-blur-2xl transition-all ${className}`}>
      {/* 1. Header Bar with Scenario Title & Live Stream Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#162e1c]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#142817] border border-[#27532d] text-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.2)]">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold font-mono text-white tracking-wide">
                {graphData.title}
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 font-bold">
                LIVE ORCHESTRATION
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              {graphData.subtitle}
            </p>
          </div>
        </div>

        {/* Action & Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded-lg bg-[#142817] hover:bg-[#1f3f24] border border-[#27532d] text-[#4ade80] text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause Flow</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-[#4ade80]" />
                <span>Play Flow</span>
              </>
            )}
          </button>
          <button
            onClick={() => setActiveStep(0)}
            className="p-1 rounded-lg bg-[#142817] hover:bg-[#1f3f24] border border-[#27532d] text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Reset Pipeline Step"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Flow Graph Nodes (Horizontal Stepper / Graph with Dynamic Conduit Lines) */}
      <div className="my-4 overflow-x-auto pb-2">
        <div className="flex items-center min-w-max gap-2 sm:gap-3 px-1">
          {nodes.map((node, index) => {
            const IconComp = node.icon;
            const isCurrentActive = isPlaying ? activeStep === index : selectedNodeId === node.id;
            const isPast = isPlaying ? activeStep > index : true;
            const isSelected = selectedNodeId === node.id;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    onNodeClick?.(node.id);
                  }}
                  className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer min-w-[170px] max-w-[210px] ${
                    isSelected
                      ? 'bg-[#15341c] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                      : isCurrentActive
                      ? 'bg-[#0d2414] border-[#4ade80]/80 shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                      : isPast
                      ? 'bg-[#0a150d] border-[#1f4224] text-slate-300'
                      : 'bg-[#060b08] border-[#142417] opacity-60'
                  }`}
                >
                  {/* Top Badge & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        node.category === 'DATABASE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : node.category === 'GATEWAY'
                          ? 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40'
                          : node.category === 'AGENT'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : node.category === 'GUARDRAIL'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : node.category === 'LLM'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1">
                      {isCurrentActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping" />
                      )}
                      <span className="text-[9px] font-mono text-slate-400">
                        {node.latencyMs > 0 ? `${node.latencyMs}ms` : 'Gate'}
                      </span>
                    </div>
                  </div>

                  {/* Label & Details */}
                  <div>
                    <div className="text-xs font-bold font-mono text-white line-clamp-1">
                      {node.label}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5 line-clamp-1">
                      {node.subLabel}
                    </div>
                  </div>

                  {/* Database Identifier Highlight if category is DATABASE */}
                  {node.category === 'DATABASE' && (
                    <div className="mt-2 pt-1.5 border-t border-amber-500/20 flex items-center gap-1 text-[9px] font-mono text-amber-300">
                      <Database className="w-3 h-3" />
                      <span>PostgreSQL Store</span>
                    </div>
                  )}
                </div>

                {/* Arrow Connector between nodes */}
                {index < nodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-1">
                    <div className={`w-6 h-[2px] rounded transition-all duration-300 ${
                      isPast ? 'bg-[#4ade80] shadow-[0_0_8px_#4ade80]' : 'bg-[#1b3320]'
                    }`} />
                    <ArrowRight className={`w-3.5 h-3.5 -ml-1 transition-all ${
                      isPast ? 'text-[#4ade80]' : 'text-[#1b3320]'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Telemetry & Database Execution Inspector */}
      {selectedNode && (
        <div className="mt-3 pt-3 border-t border-[#162e1c] bg-[#08120a] rounded-xl p-3 border border-[#1d3d22] space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-[#4ade80]/15 text-[#4ade80]">
                {React.createElement(selectedNode.icon, { className: 'w-3.5 h-3.5' })}
              </div>
              <span className="text-xs font-mono font-bold text-white">
                Node Telemetry: {selectedNode.label} ({selectedNode.category})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                Latency: {selectedNode.latencyMs}ms
              </span>
            </div>

            {selectedNode.details.sqlQuery && (
              <button
                onClick={() => handleCopyQuery(selectedNode.details.sqlQuery!)}
                className="text-[10px] font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 cursor-pointer self-start sm:self-auto"
              >
                {copiedQuery ? <Check className="w-3 h-3 text-[#4ade80]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedQuery ? 'Copied SQL' : 'Copy Query'}</span>
              </button>
            )}
          </div>

          <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
            {selectedNode.details.description}
          </p>

          {/* Database SQL Query Code Box if present */}
          {selectedNode.details.sqlQuery && (
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1 font-semibold">
                <Database className="w-3 h-3" />
                <span>Executing Parameterized PostgreSQL Query:</span>
              </div>
              <pre className="p-2.5 rounded-lg bg-[#040805] border border-[#18361f] text-[10px] font-mono text-[#4ade80] overflow-x-auto max-h-32">
                {selectedNode.details.sqlQuery}
              </pre>
            </div>
          )}

          {/* Metadata Parameters Grid */}
          {selectedNode.details.metadata && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {Object.entries(selectedNode.details.metadata).map(([key, value]) => (
                <div key={key} className="p-2 rounded-lg bg-[#050b07] border border-[#162e1c] text-[10px] font-mono">
                  <div className="text-slate-400 text-[9px] truncate">{key}</div>
                  <div className="text-white font-semibold truncate mt-0.5">
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
