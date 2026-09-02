import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Database, 
  Sparkles, 
  FileCheck, 
  Cpu, 
  Lock, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Loader2, 
  Check, 
  ArrowRight, 
  ArrowDown,
  Eye, 
  FileText,
  Activity,
  Layers,
  HeartPulse,
  BrainCircuit,
  MessageSquare,
  GitFork,
  XCircle,
  CornerDownRight,
  Server,
  User,
  Sliders,
  CheckSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { UserProfile, PurposeOfUse } from '../../types';

interface EvaluationLifecycleVisualizerProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
}

export type DAGNodeId = 
  | 'USER'
  | 'REQUEST_VALIDATION'
  | 'AUTHENTICATION_RBAC'
  | 'AI_GATEWAY'
  | 'INTENT_DETECTION'
  | 'AGENT_ORCHESTRATION'
  | 'KNOWLEDGE_AGENT'
  | 'PATIENT_AGENT'
  | 'WORKFLOW_AGENT'
  | 'CONTEXT_FUSION'
  | 'PROMPT_ASSEMBLY'
  | 'PRE_GUARDRAIL'
  | 'LLM'
  | 'POST_GUARDRAIL'
  | 'RESPONSE_VALIDATION'
  | 'AI_JUDGE'
  | 'HUMAN_REVIEW'
  | 'APPROVE'
  | 'REJECT'
  | 'SAVE'
  | 'SEND_BACK'
  | 'POSTGRESQL'
  | 'OBSERVABILITY'
  | 'EVALUATION'
  | 'SELF_IMPROVEMENT'
  | 'HUMAN_APPROVAL';

interface DAGNodeMeta {
  id: DAGNodeId;
  label: string;
  category: 'ENTRY' | 'SECURITY' | 'GATEWAY' | 'AGENT' | 'SYNTHESIS' | 'MODEL' | 'GUARDRAIL' | 'EVAL' | 'HITL' | 'STORAGE' | 'GOVERNANCE';
  description: string;
  metricLabel: string;
  metricValue: string;
  telemetryLog: string;
}

const DAG_NODES_DATA: Record<DAGNodeId, DAGNodeMeta> = {
  USER: {
    id: 'USER',
    label: 'USER',
    category: 'ENTRY',
    description: 'Practitioner, nurse, specialist, or clinical coordinator initiating a clinical query or order request.',
    metricLabel: 'Session State',
    metricValue: 'Authenticated (MFA Verified)',
    telemetryLog: 'User session active (Dr. Elena Rostova / Portal Admin); Client IP verified with institutional TLS v1.3.',
  },
  REQUEST_VALIDATION: {
    id: 'REQUEST_VALIDATION',
    label: 'REQUEST VALIDATION',
    category: 'SECURITY',
    description: 'Validates JSON request schema, enforces payload size bounds, and scrubs OWASP LLM01 prompt injection characters.',
    metricLabel: 'Schema Conformance',
    metricValue: '100% Adherent',
    telemetryLog: 'Sanitization rule matched 0 malicious escape sequences; Unicode UTF-8 normalization completed in 1.4ms.',
  },
  AUTHENTICATION_RBAC: {
    id: 'AUTHENTICATION_RBAC',
    label: 'AUTHENTICATION / RBAC',
    category: 'SECURITY',
    description: 'Enforces Attribute-Based Access Control (ABAC), verifying practitioner license, assigned patient scope, and active patient consent.',
    metricLabel: 'Consent & RBAC',
    metricValue: 'ACTIVE_CONSENT Validated',
    telemetryLog: 'Patient Elena Rostova (PT-1002) consent status is ACTIVE_CONSENT. Purpose of use: TREATMENT verified.',
  },
  AI_GATEWAY: {
    id: 'AI_GATEWAY',
    label: 'AI GATEWAY',
    category: 'GATEWAY',
    description: 'Central ingress gateway handling rate-limiting, semantic caching, token budgeting, and downstream agent routing.',
    metricLabel: 'Gateway Ingress Latency',
    metricValue: '3.2 ms',
    telemetryLog: 'Token quota allocated (max 4096 output tokens); semantic cache checked (cache miss, routing to orchestration).',
  },
  INTENT_DETECTION: {
    id: 'INTENT_DETECTION',
    label: 'INTENT DETECTION',
    category: 'GATEWAY',
    description: 'Zero-shot clinical classifier parsing prompt into primary intent: Protocol Ingestion, Patient Synthesis, or Clinical Order Draft.',
    metricLabel: 'Intent Confidence',
    metricValue: '99.4% Protocol + Patient Q&A',
    telemetryLog: 'Detected intent: CLINICAL_QUERY_WITH_FHIR_SYNTHESIS. Dispatched concurrent sub-tasks to multi-agent orchestrator.',
  },
  AGENT_ORCHESTRATION: {
    id: 'AGENT_ORCHESTRATION',
    label: 'AGENT ORCHESTRATION',
    category: 'AGENT',
    description: 'State machine supervisor dispatching concurrent sub-queries to Knowledge Agent, Patient Agent, and Workflow Agent.',
    metricLabel: 'Agent State Convergence',
    metricValue: '3/3 Sub-Agents Dispatched',
    telemetryLog: 'Parallel dispatch initiated with 18ms latency; barrier synchronization contract active.',
  },
  KNOWLEDGE_AGENT: {
    id: 'KNOWLEDGE_AGENT',
    label: 'KNOWLEDGE AGENT',
    category: 'AGENT',
    description: '5-Stage RAG retriever: Ingest & Classify → Schema Chunking → 768d Dense + Sparse BM25 Embedding → Hybrid RRF Retrieval → Citation Grounding.',
    metricLabel: 'RRF Retrieval Score',
    metricValue: '0.962 (Guideline 2025)',
    telemetryLog: 'Retrieved 3 authoritative chunks from Heart Failure Guideline 2025 on Empagliflozin eGFR threshold (>= 20 mL/min).',
  },
  PATIENT_AGENT: {
    id: 'PATIENT_AGENT',
    label: 'PATIENT AGENT',
    category: 'AGENT',
    description: 'FHIR Patient 360 data aggregator: queries longitudinal labs (eGFR, Cr, K+), active medications, allergies (Lisinopril), and problem list.',
    metricLabel: 'FHIR Data Completeness',
    metricValue: '98.5% (LOINC Verified)',
    telemetryLog: 'Parsed PT-1002 record: eGFR 38 mL/min/1.73m2, Serum Cr 1.62 mg/dL, Allergy: Lisinopril Angioedema (Severe).',
  },
  WORKFLOW_AGENT: {
    id: 'WORKFLOW_AGENT',
    label: 'WORKFLOW AGENT',
    category: 'AGENT',
    description: 'Synthesizes idempotent clinical order drafts, pre-authorizations, dosage checks, and structured transition notes.',
    metricLabel: 'Idempotency Validation',
    metricValue: 'UUIDv4 Key Generated',
    telemetryLog: 'Generated draft order for Empagliflozin 10mg PO Daily with required cardiorenal monitoring markers.',
  },
  CONTEXT_FUSION: {
    id: 'CONTEXT_FUSION',
    label: 'CONTEXT FUSION',
    category: 'SYNTHESIS',
    description: 'Deterministically merges multi-agent outputs, deduplicates overlapping entities, and aligns patient biomarkers with guideline thresholds.',
    metricLabel: 'Cross-Agent Coherence',
    metricValue: '99.1%',
    telemetryLog: 'Aligned patient eGFR 38 with guideline threshold (>=20); cross-referenced Lisinopril allergy against proposed SGLT2i formulation.',
  },
  PROMPT_ASSEMBLY: {
    id: 'PROMPT_ASSEMBLY',
    label: 'PROMPT ASSEMBLY',
    category: 'SYNTHESIS',
    description: 'Constructs structured few-shot system prompt with clinical schema constraints, citation formatting requirements, and zero-speculation rules.',
    metricLabel: 'Context Window Size',
    metricValue: '1,842 Tokens',
    telemetryLog: 'System instructions locked; structured JSON schema output contract enforced.',
  },
  PRE_GUARDRAIL: {
    id: 'PRE_GUARDRAIL',
    label: 'PRE-GUARDRAIL',
    category: 'GUARDRAIL',
    description: 'Pre-execution safety gate checking for off-label requests, banned phrases, and unsafe operational parameters.',
    metricLabel: 'Pre-Guardrail Scan',
    metricValue: 'PASSED (0 Intercepts)',
    telemetryLog: 'Input complies with clinical safety boundary; zero prompt injection anomalies.',
  },
  LLM: {
    id: 'LLM',
    label: 'LLM',
    category: 'MODEL',
    description: 'Google Gemini 3.7 / 3.6 Flash fallback ladder performing clinical reasoning, evidence synthesis, and citation mapping.',
    metricLabel: 'Model Adapter',
    metricValue: 'Gemini 3.7 Flash',
    telemetryLog: 'Executed primary generation with 410ms TTFT; 0 schema violations; zero hallucinations detected.',
  },
  POST_GUARDRAIL: {
    id: 'POST_GUARDRAIL',
    label: 'POST-GUARDRAIL',
    category: 'GUARDRAIL',
    description: 'Post-generation safety filter: scrubs residual PHI identifiers, verifies clinical disclaimer attachment, and checks allergy contraindications.',
    metricLabel: 'PHI DLP & Safety',
    metricValue: '100% Scrubbed & Safe',
    telemetryLog: 'Validated absence of Lisinopril cross-reactivity; mandatory physician review disclaimer verified.',
  },
  RESPONSE_VALIDATION: {
    id: 'RESPONSE_VALIDATION',
    label: 'RESPONSE VALIDATION',
    category: 'GUARDRAIL',
    description: 'Validates JSON output schema compliance, verifying citation references link to existing knowledge chunk IDs.',
    metricLabel: 'Citation Link Integrity',
    metricValue: '100% Validated (3/3 Chunks)',
    telemetryLog: 'All cited references map to chunk-hf-sglt2-01 and chunk-hf-sglt2-02 in knowledge store.',
  },
  AI_JUDGE: {
    id: 'AI_JUDGE',
    label: 'AI JUDGE',
    category: 'EVAL',
    description: 'Automated LLM-as-a-Judge evaluating Faithfulness (98.8%), Groundedness (99.4%), Context Relevance (97.5%), and Institutional Safety (100%).',
    metricLabel: 'Judge Consensus Score',
    metricValue: '98.9% (VERDICT: APPROVED)',
    telemetryLog: 'Automated judge evaluated response against ground truth guidelines; zero factual contradictions found.',
  },
  HUMAN_REVIEW: {
    id: 'HUMAN_REVIEW',
    label: 'HUMAN REVIEW',
    category: 'HITL',
    description: 'Mandatory Human-in-the-Loop (HITL) clinical review gate where the attending physician verifies recommendations and makes a decision.',
    metricLabel: 'Physician Review Gate',
    metricValue: 'HITL ACTIVE',
    telemetryLog: 'Clinical recommendation and draft order presented for attending physician verification.',
  },
  APPROVE: {
    id: 'APPROVE',
    label: 'APPROVE',
    category: 'HITL',
    description: 'Physician approves the clinical recommendation and digitally signs the clinical order.',
    metricLabel: 'Digital Signature',
    metricValue: 'SIGNED (Dr. Elena Rostova)',
    telemetryLog: 'Clinician provided digital signature (SHA-256 HMAC) authorizing order execution.',
  },
  REJECT: {
    id: 'REJECT',
    label: 'REJECT',
    category: 'HITL',
    description: 'Physician rejects the recommendation with clinical feedback.',
    metricLabel: 'Rejection Flag',
    metricValue: 'REJECTED WITH REASON',
    telemetryLog: 'Clinician rejected proposal citing clinical nuances; triggering SEND BACK loop.',
  },
  SAVE: {
    id: 'SAVE',
    label: 'SAVE',
    category: 'STORAGE',
    description: 'Prepares validated transaction payload, sanitizing undefined fields and asserting transaction integrity.',
    metricLabel: 'Transaction Sanity',
    metricValue: 'Zero-Crash Payload Ready',
    telemetryLog: 'Payload stripped of undefined attributes; ACID transaction context initialized.',
  },
  SEND_BACK: {
    id: 'SEND_BACK',
    label: 'SEND BACK',
    category: 'HITL',
    description: 'Sends clinician feedback and rejection notes back to prompt engineering and agent refinement for recalibration.',
    metricLabel: 'Refinement Loop',
    metricValue: 'FEEDBACK ROUTED',
    telemetryLog: 'Feedback logged to telemetry; refinement iteration dispatched back to clinical workflow queue.',
  },
  POSTGRESQL: {
    id: 'POSTGRESQL',
    label: 'POSTGRESQL',
    category: 'STORAGE',
    description: 'Durable relational database committing records to patients, clinical_conditions, workflow_actions, and agent_traces_and_evaluations.',
    metricLabel: 'PostgreSQL Commit',
    metricValue: 'Committed (pgvector Synced)',
    telemetryLog: 'INSERT into workflow_actions (state: APPROVED) and agent_traces_and_evaluations (trace_id: TR-99418).',
  },
  OBSERVABILITY: {
    id: 'OBSERVABILITY',
    label: 'OBSERVABILITY',
    category: 'GOVERNANCE',
    description: 'Real-time telemetry dashboards tracking p95 latency (420ms), token usage, guardrail intercepts, and operational health.',
    metricLabel: 'Telemetry Status',
    metricValue: 'Active (Prometheus / Grafana)',
    telemetryLog: 'Emitted span metrics: duration_ms=442, prompt_tokens=1842, completion_tokens=312, cost=$0.00041.',
  },
  EVALUATION: {
    id: 'EVALUATION',
    label: 'EVALUATION',
    category: 'EVAL',
    description: 'Continuous offline evaluation suite running synthetic benchmarks, measuring metric drift, and clustering low-confidence queries.',
    metricLabel: 'Benchmark Score',
    metricValue: '98.2% Aggregate Quality',
    telemetryLog: 'Evaluated 142 historical traces; identified 3 borderline queries in renal synonym retrieval.',
  },
  SELF_IMPROVEMENT: {
    id: 'SELF_IMPROVEMENT',
    label: 'SELF IMPROVEMENT',
    category: 'GOVERNANCE',
    description: 'Automated synthesis of improvement proposals: updates BM25 lexical weights, enriches synonym maps, and refines system prompts.',
    metricLabel: 'Synthesized Proposals',
    metricValue: 'PROP-2026-08-01 Ready',
    telemetryLog: 'Generated proposal to enrich SGLT2i synonym dictionary (+8.2% retrieval accuracy boost projected).',
  },
  HUMAN_APPROVAL: {
    id: 'HUMAN_APPROVAL',
    label: 'HUMAN APPROVAL',
    category: 'GOVERNANCE',
    description: 'Portal Admin governance sign-off gate before deploying self-improvement changes, vector index updates, or model configurations.',
    metricLabel: 'Portal Admin Gate',
    metricValue: 'PENDING / APPROVED',
    telemetryLog: 'Self-improvement proposal queued for Portal Admin review. Automated deployment safely blocked until sign-off.',
  },
};

export const EvaluationLifecycleVisualizer: React.FC<EvaluationLifecycleVisualizerProps> = ({
  currentUser,
  purposeOfUse,
}) => {
  const [activeNode, setActiveNode] = useState<DAGNodeId>('USER');
  const [selectedNode, setSelectedNode] = useState<DAGNodeMeta>(DAG_NODES_DATA.USER);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [humanDecision, setHumanDecision] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [passedNodes, setPassedNodes] = useState<Set<DAGNodeId>>(new Set(['USER']));
  const [testQuery, setTestQuery] = useState(
    'Can patient Elena Rostova (PT-1002) with HFpEF and eGFR 38 be safely initiated on Empagliflozin 10mg daily?'
  );

  // Sequential execution sequence before Human Review
  const preHumanSequence: DAGNodeId[] = [
    'USER',
    'REQUEST_VALIDATION',
    'AUTHENTICATION_RBAC',
    'AI_GATEWAY',
    'INTENT_DETECTION',
    'AGENT_ORCHESTRATION',
    'KNOWLEDGE_AGENT', // Parallel visual trigger
    'CONTEXT_FUSION',
    'PROMPT_ASSEMBLY',
    'PRE_GUARDRAIL',
    'LLM',
    'POST_GUARDRAIL',
    'RESPONSE_VALIDATION',
    'AI_JUDGE',
    'HUMAN_REVIEW'
  ];

  const handleStartLifecycle = () => {
    setIsRunning(true);
    setHumanDecision(null);
    setPassedNodes(new Set(['USER']));
    setActiveNode('USER');
    setSelectedNode(DAG_NODES_DATA.USER);

    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      if (idx < preHumanSequence.length) {
        const nextId = preHumanSequence[idx];
        setActiveNode(nextId);
        setSelectedNode(DAG_NODES_DATA[nextId]);
        setPassedNodes((prev) => {
          const next = new Set(prev);
          next.add(nextId);
          if (nextId === 'KNOWLEDGE_AGENT') {
            next.add('PATIENT_AGENT');
            next.add('WORKFLOW_AGENT');
          }
          return next;
        });
      } else {
        clearInterval(interval);
        setIsRunning(false);
        // Paused at HUMAN_REVIEW awaiting user decision
      }
    }, 350);
  };

  const handleHumanReviewDecision = (decision: 'APPROVE' | 'REJECT') => {
    setHumanDecision(decision);
    if (decision === 'REJECT') {
      setPassedNodes((prev) => new Set([...prev, 'REJECT', 'SEND_BACK']));
      setActiveNode('SEND_BACK');
      setSelectedNode(DAG_NODES_DATA.SEND_BACK);
    } else {
      // Step through Approve -> Save -> Postgres -> Observability + Evaluation -> Self Improvement -> Human Approval
      setPassedNodes((prev) => new Set([...prev, 'APPROVE', 'SAVE', 'POSTGRESQL', 'OBSERVABILITY', 'EVALUATION', 'SELF_IMPROVEMENT', 'HUMAN_APPROVAL']));
      setActiveNode('HUMAN_APPROVAL');
      setSelectedNode(DAG_NODES_DATA.HUMAN_APPROVAL);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setHumanDecision(null);
    setPassedNodes(new Set(['USER']));
    setActiveNode('USER');
    setSelectedNode(DAG_NODES_DATA.USER);
  };

  const getNodeStatus = (id: DAGNodeId) => {
    if (activeNode === id && isRunning) return 'RUNNING';
    if (passedNodes.has(id)) return 'PASSED';
    return 'IDLE';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Full Architecture Execution & Governance Flow</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono font-bold">
                Direct Architecture Specification
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              End-to-End Orchestrated Pipeline: Request Validation ➔ Auth/RBAC ➔ AI Gateway ➔ Intent Detection ➔ Agent Orchestration (Knowledge / Patient / Workflow) ➔ Context Fusion ➔ Prompt Assembly ➔ Pre-Guardrail ➔ LLM ➔ Post-Guardrail ➔ Response Validation ➔ AI Judge ➔ Human Review (Approve/Reject) ➔ PostgreSQL ➔ Observability & Evaluation ➔ Self Improvement ➔ Human Approval.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              onClick={handleStartLifecycle}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Executing Architecture Flow...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Run Live Pipeline Trace
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Query Bar */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Input Clinical Query:</span>
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            disabled={isRunning}
            className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Main Execution Viewport: Visual DAG Architecture Flow (Left 8 cols) + Node Inspector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Connected Architecture DAG */}
        <div className="lg:col-span-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center space-y-3">
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Architecture DAG Flow Graph</h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Passed
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" /> Active
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" /> Idle
              </span>
            </div>
          </div>

          {/* 1. USER */}
          <DAGNodeCard
            node={DAG_NODES_DATA.USER}
            status={getNodeStatus('USER')}
            isSelected={selectedNode.id === 'USER'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.USER)}
          />
          <ArrowDownConnector />

          {/* 2. REQUEST VALIDATION */}
          <DAGNodeCard
            node={DAG_NODES_DATA.REQUEST_VALIDATION}
            status={getNodeStatus('REQUEST_VALIDATION')}
            isSelected={selectedNode.id === 'REQUEST_VALIDATION'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.REQUEST_VALIDATION)}
          />
          <ArrowDownConnector />

          {/* 3. AUTHENTICATION / RBAC */}
          <DAGNodeCard
            node={DAG_NODES_DATA.AUTHENTICATION_RBAC}
            status={getNodeStatus('AUTHENTICATION_RBAC')}
            isSelected={selectedNode.id === 'AUTHENTICATION_RBAC'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.AUTHENTICATION_RBAC)}
          />
          <ArrowDownConnector />

          {/* 4. AI GATEWAY */}
          <DAGNodeCard
            node={DAG_NODES_DATA.AI_GATEWAY}
            status={getNodeStatus('AI_GATEWAY')}
            isSelected={selectedNode.id === 'AI_GATEWAY'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.AI_GATEWAY)}
          />
          <ArrowDownConnector />

          {/* 5. INTENT DETECTION */}
          <DAGNodeCard
            node={DAG_NODES_DATA.INTENT_DETECTION}
            status={getNodeStatus('INTENT_DETECTION')}
            isSelected={selectedNode.id === 'INTENT_DETECTION'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.INTENT_DETECTION)}
          />
          <ArrowDownConnector />

          {/* 6. AGENT ORCHESTRATION */}
          <DAGNodeCard
            node={DAG_NODES_DATA.AGENT_ORCHESTRATION}
            status={getNodeStatus('AGENT_ORCHESTRATION')}
            isSelected={selectedNode.id === 'AGENT_ORCHESTRATION'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.AGENT_ORCHESTRATION)}
          />
          
          {/* Branch to 3 Agents */}
          <div className="w-full flex items-center justify-center my-1">
            <div className="h-4 w-0.5 bg-blue-500/50" />
          </div>

          <div className="w-full grid grid-cols-3 gap-3 p-3 rounded-2xl bg-black/40 border border-blue-500/30">
            <DAGNodeCard
              node={DAG_NODES_DATA.KNOWLEDGE_AGENT}
              status={getNodeStatus('KNOWLEDGE_AGENT')}
              isSelected={selectedNode.id === 'KNOWLEDGE_AGENT'}
              onClick={() => setSelectedNode(DAG_NODES_DATA.KNOWLEDGE_AGENT)}
              compact
            />
            <DAGNodeCard
              node={DAG_NODES_DATA.PATIENT_AGENT}
              status={getNodeStatus('PATIENT_AGENT')}
              isSelected={selectedNode.id === 'PATIENT_AGENT'}
              onClick={() => setSelectedNode(DAG_NODES_DATA.PATIENT_AGENT)}
              compact
            />
            <DAGNodeCard
              node={DAG_NODES_DATA.WORKFLOW_AGENT}
              status={getNodeStatus('WORKFLOW_AGENT')}
              isSelected={selectedNode.id === 'WORKFLOW_AGENT'}
              onClick={() => setSelectedNode(DAG_NODES_DATA.WORKFLOW_AGENT)}
              compact
            />
          </div>

          <ArrowDownConnector />

          {/* 8. CONTEXT FUSION */}
          <DAGNodeCard
            node={DAG_NODES_DATA.CONTEXT_FUSION}
            status={getNodeStatus('CONTEXT_FUSION')}
            isSelected={selectedNode.id === 'CONTEXT_FUSION'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.CONTEXT_FUSION)}
          />
          <ArrowDownConnector />

          {/* 9. PROMPT ASSEMBLY */}
          <DAGNodeCard
            node={DAG_NODES_DATA.PROMPT_ASSEMBLY}
            status={getNodeStatus('PROMPT_ASSEMBLY')}
            isSelected={selectedNode.id === 'PROMPT_ASSEMBLY'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.PROMPT_ASSEMBLY)}
          />
          <ArrowDownConnector />

          {/* 10. PRE-GUARDRAIL */}
          <DAGNodeCard
            node={DAG_NODES_DATA.PRE_GUARDRAIL}
            status={getNodeStatus('PRE_GUARDRAIL')}
            isSelected={selectedNode.id === 'PRE_GUARDRAIL'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.PRE_GUARDRAIL)}
          />
          <ArrowDownConnector />

          {/* 11. LLM */}
          <DAGNodeCard
            node={DAG_NODES_DATA.LLM}
            status={getNodeStatus('LLM')}
            isSelected={selectedNode.id === 'LLM'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.LLM)}
            highlight
          />
          <ArrowDownConnector />

          {/* 12. POST-GUARDRAIL */}
          <DAGNodeCard
            node={DAG_NODES_DATA.POST_GUARDRAIL}
            status={getNodeStatus('POST_GUARDRAIL')}
            isSelected={selectedNode.id === 'POST_GUARDRAIL'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.POST_GUARDRAIL)}
          />
          <ArrowDownConnector />

          {/* 13. RESPONSE VALIDATION */}
          <DAGNodeCard
            node={DAG_NODES_DATA.RESPONSE_VALIDATION}
            status={getNodeStatus('RESPONSE_VALIDATION')}
            isSelected={selectedNode.id === 'RESPONSE_VALIDATION'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.RESPONSE_VALIDATION)}
          />
          <ArrowDownConnector />

          {/* 14. AI JUDGE */}
          <DAGNodeCard
            node={DAG_NODES_DATA.AI_JUDGE}
            status={getNodeStatus('AI_JUDGE')}
            isSelected={selectedNode.id === 'AI_JUDGE'}
            onClick={() => setSelectedNode(DAG_NODES_DATA.AI_JUDGE)}
          />
          <ArrowDownConnector />

          {/* 15. HUMAN REVIEW (HITL Decision Junction) */}
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-900/40 border-2 border-indigo-500/60 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-bold text-white font-mono uppercase">HUMAN REVIEW (Physician Gate)</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                passedNodes.has('HUMAN_REVIEW') ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50' : 'bg-white/10 text-slate-400'
              }`}>
                {humanDecision ? `DECISION: ${humanDecision}` : 'AWAITING PHYSICIAN SIGN-OFF'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Mandatory clinical verification gate. Review AI clinical synthesis and approve for EHR commit or reject for refinement.
            </p>

            {/* Decision Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleHumanReviewDecision('APPROVE')}
                disabled={!passedNodes.has('HUMAN_REVIEW') || isRunning}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  humanDecision === 'APPROVE'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-600/30'
                    : 'bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white'
                } disabled:opacity-30`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                APPROVE (Save & Commit)
              </button>

              <button
                onClick={() => handleHumanReviewDecision('REJECT')}
                disabled={!passedNodes.has('HUMAN_REVIEW') || isRunning}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  humanDecision === 'REJECT'
                    ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-lg shadow-rose-600/30'
                    : 'bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white'
                } disabled:opacity-30`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                REJECT (Send Back)
              </button>
            </div>
          </div>

          {/* Decision Branches */}
          <div className="w-full grid grid-cols-2 gap-4 mt-2">
            {/* Left Branch: APPROVE -> SAVE -> POSTGRESQL -> OBSERVABILITY + EVALUATION -> SELF IMPROVEMENT -> HUMAN APPROVAL */}
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex flex-col items-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                APPROVE BRANCH
              </span>
              
              <DAGNodeCard
                node={DAG_NODES_DATA.SAVE}
                status={getNodeStatus('SAVE')}
                isSelected={selectedNode.id === 'SAVE'}
                onClick={() => setSelectedNode(DAG_NODES_DATA.SAVE)}
                compact
              />
              <ArrowDownConnector />

              <DAGNodeCard
                node={DAG_NODES_DATA.POSTGRESQL}
                status={getNodeStatus('POSTGRESQL')}
                isSelected={selectedNode.id === 'POSTGRESQL'}
                onClick={() => setSelectedNode(DAG_NODES_DATA.POSTGRESQL)}
                compact
              />
              
              {/* Bifurcation to Observability and Evaluation */}
              <div className="w-full grid grid-cols-2 gap-2 my-1">
                <DAGNodeCard
                  node={DAG_NODES_DATA.OBSERVABILITY}
                  status={getNodeStatus('OBSERVABILITY')}
                  isSelected={selectedNode.id === 'OBSERVABILITY'}
                  onClick={() => setSelectedNode(DAG_NODES_DATA.OBSERVABILITY)}
                  compact
                />
                <DAGNodeCard
                  node={DAG_NODES_DATA.EVALUATION}
                  status={getNodeStatus('EVALUATION')}
                  isSelected={selectedNode.id === 'EVALUATION'}
                  onClick={() => setSelectedNode(DAG_NODES_DATA.EVALUATION)}
                  compact
                />
              </div>

              <ArrowDownConnector />

              <DAGNodeCard
                node={DAG_NODES_DATA.SELF_IMPROVEMENT}
                status={getNodeStatus('SELF_IMPROVEMENT')}
                isSelected={selectedNode.id === 'SELF_IMPROVEMENT'}
                onClick={() => setSelectedNode(DAG_NODES_DATA.SELF_IMPROVEMENT)}
                compact
              />
              <ArrowDownConnector />

              <DAGNodeCard
                node={DAG_NODES_DATA.HUMAN_APPROVAL}
                status={getNodeStatus('HUMAN_APPROVAL')}
                isSelected={selectedNode.id === 'HUMAN_APPROVAL'}
                onClick={() => setSelectedNode(DAG_NODES_DATA.HUMAN_APPROVAL)}
                compact
              />
            </div>

            {/* Right Branch: REJECT -> SEND BACK */}
            <div className="p-3 rounded-xl bg-black/40 border border-rose-500/30 flex flex-col items-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                REJECT BRANCH
              </span>

              <DAGNodeCard
                node={DAG_NODES_DATA.REJECT}
                status={getNodeStatus('REJECT')}
                isSelected={selectedNode.id === 'REJECT'}
                onClick={() => setSelectedNode(DAG_NODES_DATA.REJECT)}
                compact
              />
              <ArrowDownConnector />

              <DAGNodeCard
                node={DAG_NODES_DATA.SEND_BACK}
                status={getNodeStatus('SEND_BACK')}
                isSelected={selectedNode.id === 'SEND_BACK'}
                onClick={() => setSelectedNode(DAG_NODES_DATA.SEND_BACK)}
                compact
              />

              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono text-rose-300 mt-4 text-center">
                Refinement loop returns structured clinician critique to prompt assembly for recalibration.
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Deep-Dive Node Telemetry Inspector */}
        <div className="lg:col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Stage Inspector</h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                {selectedNode.category}
              </span>
            </div>

            <div>
              <div className="text-base font-bold font-mono text-white">{selectedNode.label}</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.description}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 font-mono text-xs">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Node Telemetry</div>
              <div>Metric: <strong className="text-cyan-300">{selectedNode.metricLabel}</strong></div>
              <div>State: <strong className="text-emerald-300">{selectedNode.metricValue}</strong></div>
              <div className="pt-2 border-t border-white/10 text-slate-300 text-[11px] leading-relaxed">
                {selectedNode.telemetryLog}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300 space-y-1">
              <div className="font-bold">Architectural Contract:</div>
              <div className="text-[11px] text-slate-300">
                Guarantees zero unauthorized writes to PostgreSQL without prior Human-in-the-Loop review and cryptographic provenance.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] font-mono text-slate-400">
              Click any node in the DAG to inspect execution contracts.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

interface DAGNodeCardProps {
  node: DAGNodeMeta;
  status: 'RUNNING' | 'PASSED' | 'IDLE';
  isSelected: boolean;
  onClick: () => void;
  compact?: boolean;
  highlight?: boolean;
}

const DAGNodeCard: React.FC<DAGNodeCardProps> = ({
  node,
  status,
  isSelected,
  onClick,
  compact = false,
  highlight = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all cursor-pointer rounded-xl border flex items-center justify-between ${
        compact ? 'p-2.5' : 'p-3.5'
      } ${
        isSelected
          ? 'ring-2 ring-blue-400 bg-blue-500/25 border-blue-400 shadow-lg shadow-blue-500/20'
          : status === 'RUNNING'
            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 animate-pulse'
            : status === 'PASSED'
              ? highlight
                ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400 text-white'
                : 'bg-emerald-500/10 border-emerald-500/40 text-white'
              : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full ${
          status === 'PASSED' ? 'bg-emerald-400' : status === 'RUNNING' ? 'bg-amber-400 animate-ping' : 'bg-slate-600'
        }`} />
        <div>
          <div className={`font-mono font-bold text-white ${compact ? 'text-[11px]' : 'text-xs'}`}>
            {node.label}
          </div>
          {!compact && (
            <div className="text-[10px] text-slate-400 font-mono truncate">{node.metricLabel}: {node.metricValue}</div>
          )}
        </div>
      </div>

      <div className="text-right">
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
          status === 'PASSED'
            ? 'bg-emerald-500/20 text-emerald-300'
            : status === 'RUNNING'
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-white/10 text-slate-400'
        }`}>
          {status}
        </span>
      </div>
    </button>
  );
};

const ArrowDownConnector: React.FC = () => (
  <div className="flex justify-center items-center h-3 w-full">
    <div className="w-0.5 h-full bg-blue-500/40" />
  </div>
);
