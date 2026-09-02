import React, { useState, useEffect } from 'react';
import { 
  Network, 
  ShieldCheck, 
  Search, 
  BookOpen, 
  Workflow, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Layers, 
  ChevronRight, 
  Play,
  RotateCcw,
  GitMerge,
  UserCheck,
  Mail,
  Bell,
  Activity,
  Terminal,
  Server,
  Lock,
  FileCheck2,
  Clock
} from 'lucide-react';
import { UserProfile, PurposeOfUse, SyntheticPatient } from '../../types';

interface HierarchicalAIGatewayGraphProps {
  activeAgentId?: 'knowledge_agent' | 'patient_search_agent' | 'workflow_agent';
  onSelectAgent?: (agentId: 'knowledge_agent' | 'patient_search_agent' | 'workflow_agent') => void;
  currentUser?: UserProfile;
  purposeOfUse?: PurposeOfUse;
  patient?: SyntheticPatient;
  className?: string;
  autoPlay?: boolean;
}

interface GatewayNodeTelemetry {
  latency: string;
  targetStore: string;
  status: 'Idle' | 'Active' | 'Complete' | 'Verified';
  details: string;
  payloadSnippet: string;
}

interface GatewayNodeDef {
  id: string;
  name: string;
  title: string;
  sub: string;
  icon: any;
  status: 'Idle' | 'Active' | 'Complete' | 'Verified';
  description: string;
  telemetry: GatewayNodeTelemetry;
}

export const HierarchicalAIGatewayGraph: React.FC<HierarchicalAIGatewayGraphProps> = ({
  activeAgentId = 'patient_search_agent',
  onSelectAgent,
  currentUser,
  purposeOfUse = 'TREATMENT',
  patient,
  className = '',
  autoPlay = true,
}) => {
  // Execution phase for live dotted-line stream: 
  // 0: Start, 1: Ingress & Token, 2: Intent Classifier, 3: Specialist Agents Branching, 4: HITL & Provenance, 5: PostgreSQL Sync Bus
  const [executionPhase, setExecutionPhase] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('patient_search_agent');
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<'knowledge_agent' | 'patient_search_agent' | 'workflow_agent'>(activeAgentId);

  // Sync active route if prop changes
  useEffect(() => {
    if (activeAgentId) {
      setActiveRoute(activeAgentId);
    }
  }, [activeAgentId]);

  // Automated execution animation loop on trigger
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (executionPhase < 5) {
        timer = setTimeout(() => {
          setExecutionPhase((prev) => prev + 1);
        }, 750);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, executionPhase]);

  const handleRestart = () => {
    setExecutionPhase(0);
    setIsPlaying(true);
    setTimeout(() => {
      setExecutionPhase(1);
    }, 100);
  };

  const handleSelectRoute = (routeId: 'knowledge_agent' | 'patient_search_agent' | 'workflow_agent') => {
    setActiveRoute(routeId);
    setSelectedNodeId(routeId);
    if (onSelectAgent) {
      onSelectAgent(routeId);
    }
    // Replay flow for selected route
    setExecutionPhase(0);
    setIsPlaying(true);
    setTimeout(() => {
      setExecutionPhase(1);
    }, 100);
  };

  const getNodeStatus = (phaseRequirement: number): 'Idle' | 'Active' | 'Complete' => {
    if (executionPhase < phaseRequirement) return 'Idle';
    if (executionPhase === phaseRequirement && isPlaying) return 'Active';
    return 'Complete';
  };

  const patientName = patient?.fullName || 'Eleanor Vance';
  const patientMrn = patient?.mrn || 'MRN-849201';

  const nodes: Record<string, GatewayNodeDef> = {
    ai_gateway_ingress: {
      id: 'ai_gateway_ingress',
      name: 'ai_gateway_ingress',
      title: 'AI Gateway Ingress',
      sub: 'Zero-Trust Auth & Ingress Guard',
      icon: ShieldCheck,
      status: getNodeStatus(1),
      description: 'Enforces Zero-Trust token validation, active user consent verification, and ABAC purpose-of-use binding before query ingress.',
      telemetry: {
        latency: '12ms',
        targetStore: 'Gateway Proxy & RBAC Core',
        status: getNodeStatus(1),
        details: `User: ${currentUser?.name || 'Dr. Sarah Lin, MD'} | Purpose: ${purposeOfUse} | TLS: 1.3 Strict`,
        payloadSnippet: `{"auth": "PASSED", "purpose": "${purposeOfUse}", "mfaVerified": true, "sessionToken": "JWT-ABAC-VERIFIED"}`,
      },
    },
    intent_classifier: {
      id: 'intent_classifier',
      name: 'intent_classifier',
      title: 'Intent Classifier',
      sub: 'Gemini Multi-Intent Dispatch',
      icon: Zap,
      status: getNodeStatus(2),
      description: 'Executes zero-shot intent routing to direct the request across specialist knowledge, patient record, or clinical workflow agents.',
      telemetry: {
        latency: '24ms',
        targetStore: 'Gemini Decision Engine',
        status: getNodeStatus(2),
        details: `Detected Intent: ${activeRoute.toUpperCase()} | Confidence: 99.8% | Routing: DIRECT`,
        payloadSnippet: `{"intent": "${activeRoute}", "confidence": 0.998, "subIntents": ["PATIENT_RECORD_RETRIEVAL", "CLINICAL_SAFETY_SCAN"]}`,
      },
    },
    knowledge_agent: {
      id: 'knowledge_agent',
      name: 'knowledge_agent',
      title: 'Knowledge Agent',
      sub: '5-Stage RAG & Vector DB',
      icon: BookOpen,
      status: activeRoute === 'knowledge_agent' ? getNodeStatus(3) : (executionPhase >= 3 ? 'Idle' : 'Idle'),
      description: 'Executes Hybrid BM25 + dense 768-dimensional vector search with Reciprocal Rank Fusion (RRF) over clinical guideline repositories.',
      telemetry: {
        latency: '48ms',
        targetStore: 'Vector DB (pgvector 768d)',
        status: activeRoute === 'knowledge_agent' ? getNodeStatus(3) : 'Idle',
        details: 'Vector Embeddings: 768d | RRF Top-K: 5 chunks | Guideline: ACC/AHA 2025 HF & CKD-EPI',
        payloadSnippet: `{"denseScore": 0.941, "bm25Score": 0.892, "rrfCombined": 0.962, "guidelinesRetrieved": ["ACC_AHA_HF_2025_SEC4"]}`,
      },
    },
    patient_search_agent: {
      id: 'patient_search_agent',
      name: 'patient_search_agent',
      title: 'Patient Agent',
      sub: 'FHIR R4 & PostgreSQL Store',
      icon: Search,
      status: activeRoute === 'patient_search_agent' ? getNodeStatus(3) : (executionPhase >= 3 ? 'Idle' : 'Idle'),
      description: 'Queries longitudinal EHR demographics, active FHIR conditions, LOINC laboratory trends, and cross-encounter medications.',
      telemetry: {
        latency: '31ms',
        targetStore: 'PostgreSQL (public.fhir_patients)',
        status: activeRoute === 'patient_search_agent' ? getNodeStatus(3) : 'Idle',
        details: `Record: ${patientName} (${patientMrn}) | Table: public.fhir_patients | Encounters: 3`,
        payloadSnippet: `{"patientId": "${patient?.id || 'pat-1001'}", "status": "ACTIVE", "conditions": ["HFpEF", "CKD Stage 3b"]}`,
      },
    },
    workflow_agent: {
      id: 'workflow_agent',
      name: 'workflow_agent',
      title: 'Workflow Agent',
      sub: 'Order Synthesis & Protocol',
      icon: Workflow,
      status: activeRoute === 'workflow_agent' ? getNodeStatus(3) : (executionPhase >= 3 ? 'Idle' : 'Idle'),
      description: 'Generates structured clinical orders, executes guideline contraindication checks, and stages orders for physician sign-off.',
      telemetry: {
        latency: '36ms',
        targetStore: 'EHR Orders Cache',
        status: activeRoute === 'workflow_agent' ? getNodeStatus(3) : 'Idle',
        details: 'Order Type: SGLT2 Inhibitor Protocol | Dosage: Empagliflozin 10mg PO Daily | Contraindication: CLEAR',
        payloadSnippet: `{"orderDraft": "Empagliflozin 10mg PO Daily", "contraindicationScore": 0.0, "status": "STAGED_FOR_SIGNATURE"}`,
      },
    },
    merge_agent_orchestrator: {
      id: 'merge_agent_orchestrator',
      name: 'merge_agent_orchestrator',
      title: 'Agent Orchestration Hub',
      sub: 'Context Assembly & Contract Validation',
      icon: GitMerge,
      status: getNodeStatus(3),
      description: 'Aggregates specialist agent payloads, sanitizes output schemas, and binds cryptographic metadata.',
      telemetry: {
        latency: '15ms',
        targetStore: 'Orchestration Memory Bus',
        status: getNodeStatus(3),
        details: 'Payloads assembled: 1 Specialist Stream | Schema: FHIR JSONB Validated | Integrity: OK',
        payloadSnippet: `{"assembledStreams": 1, "schemaValidation": "PASSED", "targetRoute": "${activeRoute}"}`,
      },
    },
    hitl_physician_gate: {
      id: 'hitl_physician_gate',
      name: 'hitl_physician_gate',
      title: 'Physician HITL Sign-off',
      sub: 'Human-in-the-Loop Governance',
      icon: UserCheck,
      status: executionPhase >= 4 ? (executionPhase === 4 && isPlaying ? 'Active' : 'Complete') : 'Idle',
      description: 'Prevents autonomous unverified EHR writes, requiring attending physician review and digital signature.',
      telemetry: {
        latency: '18ms (Standby)',
        targetStore: 'HITL Audit Gate',
        status: executionPhase >= 4 ? 'Complete' : 'Idle',
        details: `Attending: ${currentUser?.name || 'Dr. Sarah Lin, MD'} | State: Verified Physician Ingress`,
        payloadSnippet: `{"autonomousWriteBlocked": true, "digitalSignature": "PHYSICIAN_VERIFIED", "reviewerRole": "ATTENDING"}`,
      },
    },
    provenance_audit_ledger: {
      id: 'provenance_audit_ledger',
      name: 'provenance_audit_ledger',
      title: 'Provenance & Audit Logger',
      sub: 'Immutable SHA-256 Ledger',
      icon: Mail,
      status: getNodeStatus(4),
      description: 'Logs cryptographically signed audit trail with timestamp, user session token, and SHA-256 state hash.',
      telemetry: {
        latency: '26ms',
        targetStore: 'Immutable Audit Ledger',
        status: getNodeStatus(4),
        details: `Audit ID: AUD-GW-2026-9021 | Checksum: ${patient?.provenance?.checksum || 'sha256-d7a8e9102c'}`,
        payloadSnippet: `{"auditEvent": "GATEWAY_ORCHESTRATION", "checksum": "${patient?.provenance?.checksum || 'sha256-verified'}", "committed": true}`,
      },
    },
    ehr_sync_bus: {
      id: 'ehr_sync_bus',
      name: 'ehr_sync_bus',
      title: 'EHR Sync Dispatcher',
      sub: 'PostgreSQL EHR & Telemetry Bus',
      icon: Bell,
      status: getNodeStatus(5),
      description: 'Dispatches real-time updates to PostgreSQL database cache and broadcasts telemetry events to connected clinical dashboards.',
      telemetry: {
        latency: '14ms',
        targetStore: 'PostgreSQL (public.fhir_patients)',
        status: getNodeStatus(5),
        details: 'PostgreSQL cache synchronized. Broadcast telemetry stream completed.',
        payloadSnippet: `{"dbSync": "SUCCESS", "status": "SYNCHRONIZED", "streamLatency": "14ms", "finalized": true}`,
      },
    },
  };

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  return (
    <div className={`bg-[#050806] border border-[#162a19] rounded-2xl p-5 shadow-2xl text-slate-100 font-sans relative overflow-hidden ${className}`}>
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3822_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-4 border-b border-[#142817] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0e2413] border border-[#27532d] flex items-center justify-center text-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.3)]">
            <Network className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                AI Gateway Orchestrator Pipeline
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#142817] text-[#4ade80] border border-[#27532d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping" />
                LIVE GRAPH FLOW
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Zero-Trust Ingress $\rightarrow$ Intent Classifier $\rightarrow$ Multi-Agent Specialist Bus $\rightarrow$ HITL / Provenance $\rightarrow$ PostgreSQL Sync
            </p>
          </div>
        </div>

        {/* Route Quick-Select Pills & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Route Selectors */}
          <div className="flex items-center gap-1 bg-[#08120a] p-1 rounded-xl border border-[#1a3820]">
            <button
              onClick={() => handleSelectRoute('knowledge_agent')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeRoute === 'knowledge_agent'
                  ? 'bg-[#183a20] text-[#4ade80] border border-[#4ade80]/40 shadow-[0_0_10px_rgba(74,222,128,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Knowledge (RAG)</span>
            </button>
            <button
              onClick={() => handleSelectRoute('patient_search_agent')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeRoute === 'patient_search_agent'
                  ? 'bg-[#183a20] text-[#4ade80] border border-[#4ade80]/40 shadow-[0_0_10px_rgba(74,222,128,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Patient (FHIR)</span>
            </button>
            <button
              onClick={() => handleSelectRoute('workflow_agent')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeRoute === 'workflow_agent'
                  ? 'bg-[#183a20] text-[#4ade80] border border-[#4ade80]/40 shadow-[0_0_10px_rgba(74,222,128,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Workflow className="w-3 h-3" />
              <span>Workflow (Orders)</span>
            </button>
          </div>

          {/* Replay & Telemetry Controls */}
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f2815] hover:bg-[#15381e] text-[#4ade80] border border-[#27532d] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(74,222,128,0.2)]"
            title="Replay Agentic Graph Execution"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>Replay Flow</span>
          </button>

          <button
            onClick={() => setShowTelemetryDrawer(!showTelemetryDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              showTelemetryDrawer
                ? 'bg-[#183a20] border-[#4ade80] text-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.3)]'
                : 'bg-[#09150c] border-[#1a3820] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main Wide Workflow Graph Canvas */}
      <div className="mt-5 relative w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#1e3e26]">
        <div className="relative w-[1100px] h-[280px] bg-[#030604]/90 rounded-2xl border border-[#142c18] p-4 flex items-center justify-between shadow-inner">
          
          {/* SVG DOTTED LINES LAYER WITH LIVE ANIMATED PULSES */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="gatewayFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* 1. START -> ai_gateway_ingress */}
            <path
              d="M 65 140 L 140 140"
              fill="none"
              stroke={executionPhase >= 1 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 1 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 1 ? '5 4' : executionPhase > 1 ? 'none' : '4 4'}
              className={executionPhase === 1 ? 'animate-pulse' : ''}
            />

            {/* 2. ai_gateway_ingress -> intent_classifier */}
            <path
              d="M 235 140 L 285 140"
              fill="none"
              stroke={executionPhase >= 2 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 2 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 2 ? '5 4' : executionPhase > 2 ? 'none' : '4 4'}
            />

            {/* 3. intent_classifier -> knowledge_agent (Top Branch) */}
            <path
              d="M 385 140 C 415 140, 425 60, 460 60"
              fill="none"
              stroke={activeRoute === 'knowledge_agent' && executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={activeRoute === 'knowledge_agent' && executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={activeRoute === 'knowledge_agent' && executionPhase === 3 ? '5 4' : activeRoute === 'knowledge_agent' && executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 4. intent_classifier -> patient_search_agent (Mid Branch) */}
            <path
              d="M 385 140 L 460 140"
              fill="none"
              stroke={activeRoute === 'patient_search_agent' && executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={activeRoute === 'patient_search_agent' && executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={activeRoute === 'patient_search_agent' && executionPhase === 3 ? '5 4' : activeRoute === 'patient_search_agent' && executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 5. intent_classifier -> workflow_agent (Bottom Branch) */}
            <path
              d="M 385 140 C 415 140, 425 220, 460 220"
              fill="none"
              stroke={activeRoute === 'workflow_agent' && executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={activeRoute === 'workflow_agent' && executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={activeRoute === 'workflow_agent' && executionPhase === 3 ? '5 4' : activeRoute === 'workflow_agent' && executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 6. knowledge_agent -> merge_agent_orchestrator */}
            <path
              d="M 565 60 C 600 60, 615 140, 645 140"
              fill="none"
              stroke={activeRoute === 'knowledge_agent' && executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={activeRoute === 'knowledge_agent' && executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={activeRoute === 'knowledge_agent' && executionPhase === 3 ? '5 4' : activeRoute === 'knowledge_agent' && executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 7. patient_search_agent -> merge_agent_orchestrator */}
            <path
              d="M 565 140 L 645 140"
              fill="none"
              stroke={activeRoute === 'patient_search_agent' && executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={activeRoute === 'patient_search_agent' && executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={activeRoute === 'patient_search_agent' && executionPhase === 3 ? '5 4' : activeRoute === 'patient_search_agent' && executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 8. workflow_agent -> merge_agent_orchestrator */}
            <path
              d="M 565 220 C 600 220, 615 140, 645 140"
              fill="none"
              stroke={activeRoute === 'workflow_agent' && executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={activeRoute === 'workflow_agent' && executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={activeRoute === 'workflow_agent' && executionPhase === 3 ? '5 4' : activeRoute === 'workflow_agent' && executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 9. merge_agent_orchestrator -> hitl_physician_gate (Top Branch) */}
            <path
              d="M 675 140 C 700 140, 710 60, 735 60"
              fill="none"
              stroke={executionPhase >= 4 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 4 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 4 ? '5 4' : executionPhase > 4 ? 'none' : '4 4'}
            />

            {/* 10. merge_agent_orchestrator -> provenance_audit_ledger (Bottom Branch) */}
            <path
              d="M 675 140 C 700 140, 710 220, 735 220"
              fill="none"
              stroke={executionPhase >= 4 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 4 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 4 ? '5 4' : executionPhase > 4 ? 'none' : '4 4'}
            />

            {/* 11. hitl_physician_gate -> ehr_sync_bus */}
            <path
              d="M 840 60 C 875 60, 890 140, 920 140"
              fill="none"
              stroke={executionPhase >= 5 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 5 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 5 ? '5 4' : executionPhase > 5 ? 'none' : '4 4'}
            />

            {/* 12. provenance_audit_ledger -> ehr_sync_bus */}
            <path
              d="M 840 220 C 875 220, 890 140, 920 140"
              fill="none"
              stroke={executionPhase >= 5 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 5 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 5 ? '5 4' : executionPhase > 5 ? 'none' : '4 4'}
            />
          </svg>

          {/* NODE 0: START (Circular Lime Play Button) */}
          <div className="absolute left-[15px] top-[115px] z-10 flex flex-col items-center">
            <button
              onClick={handleRestart}
              className="w-12 h-12 rounded-full bg-[#0a180e] border-2 border-[#4ade80] flex items-center justify-center text-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:scale-110 transition-transform cursor-pointer"
              title="Start Gateway Pipeline"
            >
              <Play className="w-5 h-5 fill-[#4ade80] ml-0.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-white tracking-widest mt-1 uppercase">
              START
            </span>
          </div>

          {/* NODE 1: ai_gateway_ingress */}
          <div
            onClick={() => setSelectedNodeId('ai_gateway_ingress')}
            className={`absolute left-[140px] top-[102px] z-10 w-[95px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.ai_gateway_ingress.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.ai_gateway_ingress.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200 shadow-[0_0_10px_rgba(74,222,128,0.15)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <ShieldCheck className={`w-4 h-4 ${nodes.ai_gateway_ingress.status === 'Active' || nodes.ai_gateway_ingress.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[10px] font-mono font-bold text-white truncate">ai_gateway_ingress</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.ai_gateway_ingress.status}</div>
          </div>

          {/* NODE 2: intent_classifier */}
          <div
            onClick={() => setSelectedNodeId('intent_classifier')}
            className={`absolute left-[285px] top-[102px] z-10 w-[100px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.intent_classifier.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.intent_classifier.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200 shadow-[0_0_10px_rgba(74,222,128,0.15)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Zap className={`w-4 h-4 ${nodes.intent_classifier.status === 'Active' || nodes.intent_classifier.status === 'Complete' ? 'text-amber-400' : 'text-slate-500'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">intent_classifier</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.intent_classifier.status}</div>
          </div>

          {/* NODE 3A (Top Branch): knowledge_agent */}
          <div
            onClick={() => handleSelectRoute('knowledge_agent')}
            className={`absolute left-[460px] top-[22px] z-10 w-[105px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              activeRoute === 'knowledge_agent'
                ? (nodes.knowledge_agent.status === 'Active'
                    ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/80 shadow-[0_0_24px_rgba(74,222,128,0.5)] scale-105'
                    : 'bg-[#09150c] border-[#4ade80] text-slate-200 shadow-[0_0_12px_rgba(74,222,128,0.25)]')
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-50 hover:opacity-80'
            }`}
          >
            <div className="flex justify-center mb-1">
              <BookOpen className={`w-4 h-4 ${activeRoute === 'knowledge_agent' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">knowledge_agent</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">
              {activeRoute === 'knowledge_agent' ? (nodes.knowledge_agent.status === 'Active' ? 'Active' : 'Complete') : 'Standby'}
            </div>
          </div>

          {/* NODE 3B (Mid Branch): patient_search_agent */}
          <div
            onClick={() => handleSelectRoute('patient_search_agent')}
            className={`absolute left-[460px] top-[102px] z-10 w-[105px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              activeRoute === 'patient_search_agent'
                ? (nodes.patient_search_agent.status === 'Active'
                    ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/80 shadow-[0_0_24px_rgba(74,222,128,0.5)] scale-105'
                    : 'bg-[#09150c] border-[#4ade80] text-slate-200 shadow-[0_0_12px_rgba(74,222,128,0.25)]')
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-50 hover:opacity-80'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Search className={`w-4 h-4 ${activeRoute === 'patient_search_agent' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">patient_search_agent</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">
              {activeRoute === 'patient_search_agent' ? (nodes.patient_search_agent.status === 'Active' ? 'Active' : 'Complete') : 'Standby'}
            </div>
          </div>

          {/* NODE 3C (Bottom Branch): workflow_agent */}
          <div
            onClick={() => handleSelectRoute('workflow_agent')}
            className={`absolute left-[460px] top-[182px] z-10 w-[105px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              activeRoute === 'workflow_agent'
                ? (nodes.workflow_agent.status === 'Active'
                    ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/80 shadow-[0_0_24px_rgba(74,222,128,0.5)] scale-105'
                    : 'bg-[#09150c] border-[#4ade80] text-slate-200 shadow-[0_0_12px_rgba(74,222,128,0.25)]')
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-50 hover:opacity-80'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Workflow className={`w-4 h-4 ${activeRoute === 'workflow_agent' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">workflow_agent</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">
              {activeRoute === 'workflow_agent' ? (nodes.workflow_agent.status === 'Active' ? 'Active' : 'Complete') : 'Standby'}
            </div>
          </div>

          {/* JUNCTION NODE: merge_agent_orchestrator */}
          <div className="absolute left-[645px] top-[125px] z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
              executionPhase >= 3
                ? 'bg-[#0a1a0f] border-[#4ade80] text-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-600'
            }`}>
              <GitMerge className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8px] font-mono text-slate-400 mt-0.5">orchestrator_bus</span>
          </div>

          {/* NODE 4A (Top): hitl_physician_gate */}
          <div
            onClick={() => setSelectedNodeId('hitl_physician_gate')}
            className={`absolute left-[735px] top-[22px] z-10 w-[105px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.hitl_physician_gate.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.hitl_physician_gate.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200'
                : 'bg-[#080d0a] border-[#162a19] text-slate-400 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <UserCheck className={`w-4 h-4 ${nodes.hitl_physician_gate.status === 'Active' ? 'text-[#4ade80]' : 'text-slate-400'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">hitl_physician_gate</div>
            <div className="text-[8px] font-mono text-slate-400 mt-0.5">{nodes.hitl_physician_gate.status}</div>
          </div>

          {/* NODE 4B (Bottom): provenance_audit_ledger */}
          <div
            onClick={() => setSelectedNodeId('provenance_audit_ledger')}
            className={`absolute left-[735px] top-[182px] z-10 w-[105px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.provenance_audit_ledger.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.provenance_audit_ledger.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Mail className={`w-4 h-4 ${nodes.provenance_audit_ledger.status === 'Active' || nodes.provenance_audit_ledger.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">provenance_audit_ledger</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.provenance_audit_ledger.status}</div>
          </div>

          {/* NODE 5: ehr_sync_bus (PostgreSQL Sync Bus) */}
          <div
            onClick={() => setSelectedNodeId('ehr_sync_bus')}
            className={`absolute left-[920px] top-[102px] z-10 w-[100px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.ehr_sync_bus.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.ehr_sync_bus.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200 shadow-[0_0_10px_rgba(74,222,128,0.15)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Bell className={`w-4 h-4 ${nodes.ehr_sync_bus.status === 'Active' || nodes.ehr_sync_bus.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[10px] font-mono font-bold text-white truncate">ehr_sync_bus</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.ehr_sync_bus.status}</div>
          </div>

        </div>
      </div>

      {/* Expanded Telemetry Drawer when user clicks a node or toggles inspect */}
      {showTelemetryDrawer && selectedNode && (
        <div className="mt-4 pt-4 border-t border-[#162a19] bg-[#071009] p-4 rounded-xl border border-[#1b3e22] text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-[#142817]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
              <span className="font-bold text-white uppercase">{selectedNode.title}</span>
              <span className="text-slate-500 text-[10px]">({selectedNode.name})</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-slate-400">Target: <strong className="text-cyan-400">{selectedNode.telemetry.targetStore}</strong></span>
              <span className="text-slate-400">Latency: <strong className="text-[#4ade80]">{selectedNode.telemetry.latency}</strong></span>
              <span className="text-slate-400">State: <strong className="text-white">{selectedNode.status}</strong></span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Node Specification</div>
              <p className="text-slate-300 text-[11px] leading-relaxed bg-[#040805] p-2.5 rounded-lg border border-[#122415]">
                {selectedNode.description}
              </p>
              <div className="mt-2 text-[10px] text-slate-400">
                <span className="text-[#4ade80]">Telemetry Stream:</span> {selectedNode.telemetry.details}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Contract / Ingress Payload</div>
              <pre className="bg-[#020503] p-2.5 rounded-lg border border-[#142a17] text-[#4ade80] text-[10px] overflow-x-auto leading-relaxed">
                {selectedNode.telemetry.payloadSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status Bar */}
      <div className="mt-4 pt-3 border-t border-[#142817] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Datastore Target: <strong className="text-white">PostgreSQL (public.fhir_patients) & Vector Store (pgvector 768d)</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Selected Route: <strong className="text-[#4ade80] uppercase">{activeRoute}</strong></span>
          <span className="text-[#4ade80]">● Zero-Trust Pipeline Online</span>
        </div>
      </div>
    </div>
  );
};
