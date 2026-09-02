import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { 
  Network, 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  UserPlus, 
  MessageSquare, 
  Workflow, 
  ShieldCheck, 
  BookOpen, 
  User, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  Database, 
  Code, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  HeartPulse,
  FileCheck,
  AlertCircle,
  Stethoscope,
  Terminal,
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';
import { UserProfile, PurposeOfUse, SyntheticPatient } from '../../types';
import { HierarchicalAIGatewayGraph } from './HierarchicalAIGatewayGraph';
import { WideAgenticWorkflowCanvas } from './WideAgenticWorkflowCanvas';

// Error boundary to protect the UI tree
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AIGatewayErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AIGatewayView ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/30 text-white space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-sm font-bold font-mono">AI Gateway Router Recovery Mode</h3>
          </div>
          <p className="text-xs text-slate-300">
            An unexpected error occurred while rendering the live telemetry. Click below to reload the router.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Reset Router Pipeline
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface AIGatewayViewProps {
  currentUser?: UserProfile;
  purposeOfUse?: PurposeOfUse;
  patients?: SyntheticPatient[];
  selectedPatient?: SyntheticPatient;
  onNavigateToPatient360?: (patientId: string) => void;
  onNavigateToKnowledgeQA?: (query: string) => void;
  onNavigateToWorkflow?: () => void;
}

export type TriggerMode = 'PATIENT_SEARCH' | 'NEW_PATIENT' | 'CLINICAL_QA' | 'WORKFLOW_CENTER';
export type AgentId = 'patient_search_agent' | 'knowledge_agent' | 'workflow_agent';

const AIGatewayContent: React.FC<AIGatewayViewProps> = ({
  currentUser = {
    id: 'DOC-401',
    name: 'Dr. Sarah Lin, MD',
    role: 'PHYSICIAN',
    department: 'Cardiology',
    hospitalSite: 'St. Jude Heart Center',
    licenseNumber: 'MD-994821-CA',
    assignedPatientIds: ['pat-1001', 'pat-1002', 'pat-1003'],
    mfaVerified: true,
  },
  purposeOfUse = 'TREATMENT',
  patients = [],
  selectedPatient,
  onNavigateToPatient360,
  onNavigateToKnowledgeQA,
  onNavigateToWorkflow,
}) => {
  const [activeTrigger, setActiveTrigger] = useState<TriggerMode>('PATIENT_SEARCH');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [packetTick, setPacketTick] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(false);
  const [selectedAgentDetail, setSelectedAgentDetail] = useState<AgentId | null>(null);
  const [graphViewMode, setGraphViewMode] = useState<'MOVING_BUS' | 'WIDE_GRAPH' | 'HIERARCHICAL'>('MOVING_BUS');

  // Safe fallback patient record
  const safePatient: SyntheticPatient = (selectedPatient && selectedPatient.id) ? selectedPatient : ((patients && patients.length > 0) ? patients[0] : {
    id: 'pat-1001',
    mrn: 'MRN-884920',
    fullName: 'Elena Rostova',
    age: 68,
    birthDate: '1958-03-14',
    gender: 'FEMALE',
    assignedPhysicianId: currentUser?.id || 'DOC-401',
    hospitalSite: currentUser?.hospitalSite || 'St. Jude Heart Center',
    consentStatus: 'ACTIVE_CONSENT',
    conditions: [{ 
      id: 'cond-1', 
      code: 'I50.9', 
      name: 'Heart Failure with Preserved Ejection Fraction (HFpEF)', 
      category: 'CHRONIC', 
      onsetDate: '2022-04-10', 
      clinicalStatus: 'ACTIVE', 
      severity: 'MODERATE' 
    }],
    medications: [{ 
      id: 'med-1', 
      code: 'rx-01', 
      name: 'Metoprolol Succinate 50mg PO Daily', 
      dosage: '50mg', 
      route: 'Oral',
      frequency: 'Daily', 
      status: 'ACTIVE', 
      prescribedDate: '2023-01-15',
      prescribingProvider: currentUser?.name || 'Dr. Sarah Lin, MD',
      indications: 'Rate control & heart failure management'
    }],
    allergies: [{ 
      id: 'all-1', 
      substance: 'Lisinopril', 
      reaction: 'Severe Angioedema', 
      category: 'MEDICATION',
      severity: 'SEVERE', 
      status: 'ACTIVE',
      recordedDate: '2021-08-20' 
    }],
    observations: [{ 
      id: 'obs-1', 
      code: 'egfr', 
      name: 'eGFR', 
      value: 38, 
      unit: 'mL/min/1.73m²', 
      referenceRange: '> 60', 
      status: 'CRITICAL', 
      effectiveDateTime: new Date().toISOString(), 
      trend: [42, 38],
      provenance: {
        sourceSystem: 'Quest Diagnostics Core Lab Interface',
        ingestionTimestamp: new Date().toISOString(),
        recordedBy: 'Automated HL7 Lab Gateway',
        verificationStatus: 'VERIFIED',
        checksum: 'sha256-lab-obs-001'
      }
    }],
    encounters: [],
    completenessAlerts: [],
    provenance: {
      sourceSystem: 'Epic Systems EHR / FHIR Bridge R4',
      ingestionTimestamp: new Date().toISOString(),
      recordedBy: currentUser?.name || 'Dr. Sarah Lin, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-verified-patient-001',
    },
  });

  // Data packet pulse ticker for smooth continuous moving animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPacketTick((t) => (t + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Route calculation based strictly on user triggers:
  // - Patient Search -> Patient Search Agent
  // - New Patient -> Patient Search Agent
  // - Clinical Q & A -> Knowledge Agent
  // - Workflow Center -> Workflow Agent
  const getActiveAgentId = (trigger: TriggerMode): AgentId => {
    switch (trigger) {
      case 'PATIENT_SEARCH':
      case 'NEW_PATIENT':
        return 'patient_search_agent';
      case 'CLINICAL_QA':
        return 'knowledge_agent';
      case 'WORKFLOW_CENTER':
        return 'workflow_agent';
      default:
        return 'patient_search_agent';
    }
  };

  const activeAgentId = getActiveAgentId(activeTrigger);

  // Trigger Metadata Configuration
  const patientName = safePatient?.fullName || 'Elena Rostova';
  const patientMrn = safePatient?.mrn || 'MRN-884920';
  const patientId = safePatient?.id || 'pat-1001';

  const TRIGGER_CONFIGS: Record<TriggerMode, {
    label: string;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
    targetAgent: AgentId;
    targetAgentName: string;
    samplePrompt: string;
    intentConfidence: string;
    routingReason: string;
    dataPacket: string;
    actionLabel: string;
    onAction?: () => void;
  }> = {
    PATIENT_SEARCH: {
      label: 'Patient Search',
      sub: 'Queries FHIR repository & longitudinal labs',
      icon: Search,
      targetAgent: 'patient_search_agent',
      targetAgentName: 'Patient Search Agent',
      samplePrompt: `Search Patient: ${patientName} (${patientMrn}) — Fetch eGFR, Creatinine, Active Meds & Contraindications`,
      intentConfidence: '99.8% Match (FHIR_SEARCH_INTENT)',
      routingReason: 'Intent classification identified patient identity retrieval. Gateway routes request exclusively to Patient Search Agent to pull sanitized longitudinal EHR records.',
      dataPacket: `GET /fhir/r4/Patient?identifier=${patientMrn}`,
      actionLabel: 'View Patient 360',
      onAction: () => onNavigateToPatient360?.(patientId),
    },
    NEW_PATIENT: {
      label: 'New Patient',
      sub: 'Registers patient, assigns UPR & initializes chart',
      icon: UserPlus,
      targetAgent: 'patient_search_agent',
      targetAgentName: 'Patient Search Agent',
      samplePrompt: 'Intake Registration: Generate synthetic UPR, create baseline FHIR shell, and verify consent status',
      intentConfidence: '99.4% Match (PATIENT_REGISTRATION_INTENT)',
      routingReason: 'Intent classification identified demographic intake. Gateway invokes Patient Search Agent in Intake Mode to generate deterministic UPR and initialize FHIR record.',
      dataPacket: 'POST /fhir/r4/Patient (Demographics + UPR-2026-X89)',
      actionLabel: 'Open Patient 360',
      onAction: () => onNavigateToPatient360?.(patientId),
    },
    CLINICAL_QA: {
      label: 'Clinical Q & A',
      sub: '5-Stage RAG search over ACC/AHA protocols',
      icon: MessageSquare,
      targetAgent: 'knowledge_agent',
      targetAgentName: 'Knowledge Agent',
      samplePrompt: `Is Empagliflozin 10mg daily indicated for HFpEF patient with eGFR 38? Reference 2025 Guidelines.`,
      intentConfidence: '99.6% Match (CLINICAL_GUIDELINE_RAG_INTENT)',
      routingReason: 'Intent classification detected medical inquiry requiring evidence synthesis. Gateway routes exclusively to Knowledge Agent for 5-stage multimodal hybrid RAG.',
      dataPacket: 'VECTOR_SEARCH (768d + BM25 RRF -> ACC/AHA 2025 Chunks)',
      actionLabel: 'Open Knowledge Q&A',
      onAction: () => onNavigateToKnowledgeQA?.(`Is Empagliflozin 10mg safe for ${patientName}?`),
    },
    WORKFLOW_CENTER: {
      label: 'Workflow Center',
      sub: 'Generates idempotent clinical orders & tasks',
      icon: Workflow,
      targetAgent: 'workflow_agent',
      targetAgentName: 'Workflow Agent',
      samplePrompt: `Synthesize draft medication request: Empagliflozin 10mg PO Daily + 2-week BMP monitoring protocol for ${patientName}`,
      intentConfidence: '99.1% Match (ORDER_SYNTHESIS_INTENT)',
      routingReason: 'Intent classification detected order generation. Gateway routes exclusively to Workflow Agent to construct schema-validated drafts with mandatory Human-in-the-Loop gates.',
      dataPacket: 'POST /fhir/r4/MedicationRequest (Draft State + HITL Gate)',
      actionLabel: 'Open Workflow Center',
      onAction: () => onNavigateToWorkflow?.(),
    },
  };

  const currentTrigger = TRIGGER_CONFIGS[activeTrigger] || TRIGGER_CONFIGS.PATIENT_SEARCH;

  // Agent Specifications
  const AGENTS: {
    id: AgentId;
    name: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    description: string;
    generatedData: {
      title: string;
      items: { label: string; value: string; status?: 'success' | 'warning' | 'info' }[];
    };
    outputPayload: Record<string, any>;
  }[] = [
    {
      id: 'patient_search_agent',
      name: 'Patient Search Agent',
      subtitle: 'FHIR 360 & Longitudinal Records',
      icon: User,
      accentColor: '#38bdf8', // Cyan / Sky
      description: 'Pulls clinical history, LOINC lab trends (eGFR, Creatinine, Potassium), vital sign trends, active medication schedules, and contraindication allergy warnings.',
      generatedData: {
        title: activeTrigger === 'NEW_PATIENT' ? 'Ingestion & Demographics Generated' : 'Patient 360 Record Generated',
        items: activeTrigger === 'NEW_PATIENT' ? [
          { label: 'Registration Mode', value: 'Active Intake', status: 'info' },
          { label: 'Assigned UPR', value: 'UPR-2026-INTAKE-09', status: 'success' },
          { label: 'Consent Verification', value: 'Opted-In (Treatment)', status: 'success' },
          { label: 'FHIR Shell', value: 'Initialized (SHA-256 Verified)', status: 'success' },
        ] : [
          { label: 'Matched Patient', value: `${patientName} (${patientMrn})`, status: 'success' },
          { label: 'eGFR (Renal)', value: '38 mL/min (CKD 3b Alert)', status: 'warning' },
          { label: 'Active Condition', value: safePatient?.conditions?.[0]?.name || 'Heart Failure (HFpEF)', status: 'info' },
          { label: 'Contraindication Flag', value: `${safePatient?.allergies?.[0]?.substance || 'Lisinopril'} (Severe Angioedema)`, status: 'warning' },
        ],
      },
      outputPayload: {
        agent: 'patient_search_agent',
        status: 'FETCH_COMPLETE',
        queryType: activeTrigger === 'NEW_PATIENT' ? 'INTAKE_REGISTRATION' : 'FHIR_LONGITUDINAL_QUERY',
        patientId: patientId,
        mrn: patientMrn,
        demographics: {
          name: patientName,
          age: safePatient?.age || 68,
          gender: safePatient?.gender || 'FEMALE',
          consent: safePatient?.consentStatus || 'ACTIVE_CONSENT',
        },
        labTrends: {
          egfr: 38,
          creatinine: 1.62,
          potassium: 4.6,
        },
        activeMedications: (safePatient?.medications || []).map((m) => m?.name || 'Metoprolol Succinate 50mg'),
        allergies: (safePatient?.allergies || []).map((a) => a?.substance || 'Lisinopril'),
        provenanceVerified: true,
      },
    },
    {
      id: 'knowledge_agent',
      name: 'Knowledge Agent',
      subtitle: '5-Stage Multimodal RAG Engine',
      icon: BookOpen,
      accentColor: '#4ade80', // Emerald / Green
      description: 'Executes dense 768-dim embeddings search + BM25 sparse keyword index combined via Reciprocal Rank Fusion (RRF) over ACC/AHA 2025 guidelines and clinical literature.',
      generatedData: {
        title: 'Clinical Evidence Generated',
        items: [
          { label: 'Guideline Source', value: 'ACC/AHA 2025 Heart Failure', status: 'success' },
          { label: 'Guideline Class', value: 'Class 1a (Strong Benefit in HFpEF)', status: 'success' },
          { label: 'Renal Cutoff Protocol', value: 'eGFR >= 20 mL/min (Patient Eligible: eGFR 38)', status: 'success' },
          { label: 'RRF Grounding Score', value: '0.962 (Hallucination Risk: 0.0%)', status: 'success' },
        ],
      },
      outputPayload: {
        agent: 'knowledge_agent',
        status: 'RAG_EVIDENCE_RETRIEVED',
        guideline: 'ACC/AHA 2025 Guideline for Management of Heart Failure',
        indication: 'SGLT2 Inhibitors for HFpEF with eGFR >= 20 mL/min',
        retrievedChunks: [
          { id: 'chunk-hf-sglt2-01', text: 'SGLT2 inhibitors (Empagliflozin 10mg) reduce cardiovascular mortality and heart failure hospitalizations in HFpEF.', score: 0.981 },
          { id: 'chunk-hf-renal-04', text: 'Renal safety boundary: Initiation recommended down to eGFR 20 mL/min/1.73m2.', score: 0.943 },
        ],
        groundingScore: 0.994,
        hallucinationCheck: 'PASSED',
      },
    },
    {
      id: 'workflow_agent',
      name: 'Workflow Agent',
      subtitle: 'Clinical Order Synthesis & HITL',
      icon: Workflow,
      accentColor: '#a855f7', // Purple
      description: 'Synthesizes draft clinical orders, dosage calculators, laboratory monitoring protocols, and routes draft proposals to attending physicians for mandatory digital sign-off.',
      generatedData: {
        title: 'Draft Order & Protocol Generated',
        items: [
          { label: 'Synthesized Order', value: 'Empagliflozin 10mg PO Daily', status: 'info' },
          { label: 'Monitoring Order', value: 'BMP + Renal Panel at 2 Weeks', status: 'info' },
          { label: 'Autonomous Write Gate', value: 'Blocked (Zero Unsigned Writes)', status: 'success' },
          { label: 'Physician Gate', value: 'Awaiting Attending Signature', status: 'warning' },
        ],
      },
      outputPayload: {
        agent: 'workflow_agent',
        status: 'ORDER_SYNTHESIS_DRAFT',
        orderType: 'MedicationRequest',
        medication: 'Empagliflozin 10mg Oral Tablet',
        instructions: 'Take 1 tablet by mouth daily in the morning',
        quantity: '90 Tablets (3 Refills)',
        companionMonitoring: {
          labOrder: 'Basic Metabolic Panel (BMP)',
          timing: '14 days post-initiation',
        },
        hitlVerificationRequired: true,
        digitalSignatureState: 'PENDING_PHYSICIAN_APPROVAL',
      },
    },
  ];

  const currentActiveAgent = AGENTS.find((a) => a.id === activeAgentId) || AGENTS[0];
  const displayedDetailAgent = selectedAgentDetail ? (AGENTS.find((a) => a.id === selectedAgentDetail) || currentActiveAgent) : currentActiveAgent;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(displayedDetailAgent.outputPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Live Mode Selector */}
      <div className="bg-[#0b120e] border border-[#1e3822] rounded-2xl p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Title & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#142817] border border-[#27532d] text-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.25)]">
              <Network className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide font-mono">
                  AI Gateway Live Agent Router
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 font-mono font-bold">
                  ORCHESTRATION ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Select any trigger below to observe live animated data flows routing to the designated specialist agent.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-[#183a20] hover:bg-[#22532d] border border-[#4ade80]/40 text-[#4ade80] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)] cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-[#4ade80]" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setPacketTick(0);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-lg bg-[#142817] hover:bg-[#1f3f24] border border-[#27532d] text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Restart Packet Stream"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Trigger Buttons */}
        <div className="mt-4 pt-3 border-t border-[#1a2f1e]">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2 flex items-center justify-between">
            <span>Select Scenario Trigger:</span>
            <span className="text-[#4ade80] normal-case">
              Routes exclusively to: <strong className="uppercase">{currentTrigger.targetAgentName}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {(Object.keys(TRIGGER_CONFIGS) as TriggerMode[]).map((key) => {
              const cfg = TRIGGER_CONFIGS[key];
              const IconComp = cfg.icon;
              const isSelected = activeTrigger === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTrigger(key);
                    setSelectedAgentDetail(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#15341c] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.25)] text-white'
                      : 'bg-[#080b09] border-[#1a2f1e] hover:bg-[#122316] text-slate-300 hover:border-[#27532d]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-[#142817] text-slate-400'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30 font-bold animate-pulse">
                        ACTIVE ROUTE
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-white">{cfg.label}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{cfg.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Live Agentic Flow Canvas with Dynamic Moving Arrows */}
      <div className="bg-[#050806] border border-[#162a19] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        {/* Sub-Header: Routing Justification & Intent */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#162a19] relative z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]"></span>
            </span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Live Agentic Graph Flow
            </span>
          </div>

          {/* Graph View Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#09150c] p-1 rounded-xl border border-[#1a3820]">
            <button
              onClick={() => setGraphViewMode('MOVING_BUS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                graphViewMode === 'MOVING_BUS'
                  ? 'bg-[#183a20] text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Bus
            </button>
            <button
              onClick={() => setGraphViewMode('WIDE_GRAPH')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                graphViewMode === 'WIDE_GRAPH'
                  ? 'bg-[#183a20] text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wide 5-Phase Flow
            </button>
            <button
              onClick={() => setGraphViewMode('HIERARCHICAL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                graphViewMode === 'HIERARCHICAL'
                  ? 'bg-[#183a20] text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hierarchical Gateway
            </button>
          </div>

          <div className="text-xs font-mono text-slate-300 flex items-center gap-2 bg-[#0d1c10] px-3 py-1 rounded-lg border border-[#1a3820]">
            <span className="text-slate-500">Classification:</span>
            <span className="text-[#4ade80] font-semibold">{currentTrigger.intentConfidence}</span>
          </div>
        </div>

        {graphViewMode === 'WIDE_GRAPH' ? (
          <WideAgenticWorkflowCanvas
            patient={safePatient}
            currentUser={currentUser}
            purposeOfUse={purposeOfUse}
            autoPlayOnce={false}
            title={`Orchestrated Agentic Workflow (${currentTrigger.label})`}
          />
        ) : graphViewMode === 'HIERARCHICAL' ? (
          <HierarchicalAIGatewayGraph
            activeAgentId={activeAgentId}
            onSelectAgent={(agentId) => {
              if (agentId === 'patient_search_agent') setActiveTrigger('PATIENT_SEARCH');
              else if (agentId === 'knowledge_agent') setActiveTrigger('CLINICAL_QA');
              else if (agentId === 'workflow_agent') setActiveTrigger('WORKFLOW_CENTER');
            }}
            currentUser={currentUser}
            purposeOfUse={purposeOfUse}
            patient={safePatient}
          />
        ) : (
          /* 3-Part Flow: AI Gateway Ingress -> Moving Arrow Stream -> 3 Specialist Agents */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative min-h-[380px]">
          
          {/* COLUMN 1 (Cols 1-4): AI Gateway Ingress & Intent Router */}
          <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl bg-[#0a120b] border border-[#1a2f1e] shadow-xl relative z-10">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#162a19]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white">AI Gateway Router</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Zero-Trust Intent Ingress</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 font-bold">
                  AUTH VERIFIED
                </span>
              </div>

              {/* Live Request Payload */}
              <div className="mt-3 space-y-2.5">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                    Incoming Request:
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#050806] border border-[#162a19] text-[11px] font-mono text-slate-200 leading-relaxed">
                    "{currentTrigger.samplePrompt}"
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#07140a] border border-[#1b3d1f] text-[10px] font-mono text-slate-300 space-y-1.5">
                  <div className="text-slate-400 font-semibold uppercase text-[9px]">Routing Basis:</div>
                  <p className="text-slate-300 leading-normal">
                    {currentTrigger.routingReason}
                  </p>
                </div>

                <div className="space-y-1 text-[10px] font-mono pt-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Clinical User:</span>
                    <span className="text-white font-semibold">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Purpose of Use:</span>
                    <span className="text-[#4ade80] font-semibold">{purposeOfUse}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Outgoing Dispatch Port */}
            <div className="mt-4 pt-3 border-t border-[#162a19] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#4ade80] flex items-center gap-1">
                <Zap className="w-3 h-3 animate-bounce" /> Dynamic Dispatch:
              </span>
              <span className="text-xs font-mono font-bold text-white bg-[#142817] px-2.5 py-1 rounded border border-[#27532d]">
                {currentTrigger.targetAgentName}
              </span>
            </div>
          </div>

          {/* COLUMN 2 (Cols 5-7): Live Animated Stream Conduit with Moving Directional Arrows */}
          <div className="lg:col-span-3 flex flex-col items-center justify-around py-4 relative min-h-[300px]">
            
            {/* SVG Connecting Flow Lines with Directional Arrow Markers & Animated Flow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Arrow markers */}
                <marker id="activeArrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#4ade80" />
                </marker>
                <marker id="idleArrowGray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#1b3320" />
                </marker>
                <linearGradient id="streamActiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Stream 1: To Patient Search Agent (Top Node) */}
              <path
                d="M 10 190 C 80 190, 80 65, 175 65"
                fill="none"
                stroke={activeAgentId === 'patient_search_agent' ? 'url(#streamActiveGradient)' : '#162819'}
                strokeWidth={activeAgentId === 'patient_search_agent' ? 3 : 1.5}
                strokeDasharray={activeAgentId === 'patient_search_agent' ? '8 6' : '4 4'}
                className={activeAgentId === 'patient_search_agent' ? 'animate-arrow-flow' : ''}
                markerEnd={activeAgentId === 'patient_search_agent' ? 'url(#activeArrowGreen)' : 'url(#idleArrowGray)'}
              />

              {/* Stream 2: To Knowledge Agent (Middle Node) */}
              <path
                d="M 10 190 L 175 190"
                fill="none"
                stroke={activeAgentId === 'knowledge_agent' ? 'url(#streamActiveGradient)' : '#162819'}
                strokeWidth={activeAgentId === 'knowledge_agent' ? 3 : 1.5}
                strokeDasharray={activeAgentId === 'knowledge_agent' ? '8 6' : '4 4'}
                className={activeAgentId === 'knowledge_agent' ? 'animate-arrow-flow' : ''}
                markerEnd={activeAgentId === 'knowledge_agent' ? 'url(#activeArrowGreen)' : 'url(#idleArrowGray)'}
              />

              {/* Stream 3: To Workflow Agent (Bottom Node) */}
              <path
                d="M 10 190 C 80 190, 80 315, 175 315"
                fill="none"
                stroke={activeAgentId === 'workflow_agent' ? 'url(#streamActiveGradient)' : '#162819'}
                strokeWidth={activeAgentId === 'workflow_agent' ? 3 : 1.5}
                strokeDasharray={activeAgentId === 'workflow_agent' ? '8 6' : '4 4'}
                className={activeAgentId === 'workflow_agent' ? 'animate-arrow-flow' : ''}
                markerEnd={activeAgentId === 'workflow_agent' ? 'url(#activeArrowGreen)' : 'url(#idleArrowGray)'}
              />
            </svg>

            {/* Visual Stream Badges Indicating Real-Time Data Flowing */}
            <div className="z-10 w-full flex flex-col items-center justify-between h-full py-4 pointer-events-none">
              {/* Top Badge: Patient Search Stream */}
              <div className={`px-2.5 py-1 rounded-full text-[9px] font-mono transition-all duration-300 ${
                activeAgentId === 'patient_search_agent'
                  ? 'bg-[#4ade80] text-black font-bold shadow-[0_0_15px_#4ade80] scale-105'
                  : 'bg-[#0a120b] text-slate-600 border border-[#162819]'
              }`}>
                {activeAgentId === 'patient_search_agent' ? '>>> STREAMING FHIR DEMOGRAPHICS >>>' : 'standby'}
              </div>

              {/* Middle Badge: Knowledge Agent Stream */}
              <div className={`px-2.5 py-1 rounded-full text-[9px] font-mono transition-all duration-300 ${
                activeAgentId === 'knowledge_agent'
                  ? 'bg-[#4ade80] text-black font-bold shadow-[0_0_15px_#4ade80] scale-105'
                  : 'bg-[#0a120b] text-slate-600 border border-[#162819]'
              }`}>
                {activeAgentId === 'knowledge_agent' ? '>>> STREAMING RAG TOKENS >>>' : 'standby'}
              </div>

              {/* Bottom Badge: Workflow Agent Stream */}
              <div className={`px-2.5 py-1 rounded-full text-[9px] font-mono transition-all duration-300 ${
                activeAgentId === 'workflow_agent'
                  ? 'bg-[#4ade80] text-black font-bold shadow-[0_0_15px_#4ade80] scale-105'
                  : 'bg-[#0a120b] text-slate-600 border border-[#162819]'
              }`}>
                {activeAgentId === 'workflow_agent' ? '>>> STREAMING ORDER PROTOCOL >>>' : 'standby'}
              </div>
            </div>
          </div>

          {/* COLUMN 3 (Cols 8-12): The 3 Specialist Agents */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 z-10">
            {AGENTS.map((agent) => {
              const isActive = agent.id === activeAgentId;
              const IconComp = agent.icon;

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentDetail(agent.id)}
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#0d2212] border-[#4ade80] ring-2 ring-[#4ade80]/70 shadow-[0_0_25px_rgba(74,222,128,0.25)]'
                      : 'bg-[#070c08] border-[#162819] opacity-50 hover:opacity-80'
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-lg ${
                            isActive
                              ? 'bg-[#4ade80]/20 text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.3)]'
                              : 'bg-[#142817] text-slate-500'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                            {agent.name}
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping" />
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{agent.subtitle}</div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          isActive
                            ? 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40'
                            : 'bg-[#121c13] text-slate-600'
                        }`}
                      >
                        {isActive ? 'PROCESSING LIVE' : 'STANDBY'}
                      </span>
                    </div>

                    {/* Brief description */}
                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-1">
                      {agent.description}
                    </p>
                  </div>

                  {/* Generated Data preview when active */}
                  {isActive && (
                    <div className="mt-2.5 pt-2 border-t border-[#1a3820]">
                      <div className="text-[9px] font-mono text-slate-400 uppercase font-semibold mb-1">
                        {agent.generatedData.title}:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {agent.generatedData.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 rounded bg-[#071309] border border-[#1d4222] text-[10px] font-mono flex flex-col"
                          >
                            <span className="text-slate-400 text-[9px]">{item.label}</span>
                            <span className={`font-semibold truncate ${
                              item.status === 'warning' ? 'text-amber-300' :
                              item.status === 'info' ? 'text-sky-300' : 'text-[#4ade80]'
                            }`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
        )}
      </div>

      {/* 3. Generated Agent Data Detail & Direct Action Bar */}
      <div className="bg-[#0b120e] border border-[#1e3822] rounded-2xl p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Active Agent Data Summary */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                {displayedDetailAgent.name} — Data Stream Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Click "Inspect JSON" to see the full structured output payload generated by this agent.
            </p>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-xs font-mono text-[#4ade80] hover:text-[#6ee7b7] flex items-center gap-1.5 bg-[#142817] px-3 py-1.5 rounded-lg border border-[#27532d] cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJson ? 'Hide JSON' : 'Inspect JSON'}</span>
            </button>

            {showJson && (
              <button
                onClick={handleCopyPayload}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}

            {currentTrigger.onAction && (
              <button
                onClick={currentTrigger.onAction}
                className="text-xs font-mono font-bold text-black bg-[#4ade80] hover:bg-[#6ee7b7] px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(74,222,128,0.3)] cursor-pointer"
              >
                <span>{currentTrigger.actionLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* JSON telemetry payload drawer */}
        {showJson && (
          <div className="mt-3 pt-3 border-t border-[#1a2f1e]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-slate-400">
                Generated Payload from {displayedDetailAgent.name}:
              </span>
            </div>
            <pre className="p-3 rounded-xl bg-[#050806] border border-[#162a19] text-[11px] text-[#4ade80] font-mono overflow-x-auto max-h-48">
              {JSON.stringify(displayedDetailAgent.outputPayload, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Embedded CSS for smooth directional flow animation */}
      <style>{`
        @keyframes arrowFlow {
          from {
            stroke-dashoffset: 28;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-arrow-flow {
          animation: arrowFlow 0.7s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Export AIGatewayView wrapped with ErrorBoundary
export const AIGatewayView: React.FC<AIGatewayViewProps> = (props) => (
  <AIGatewayErrorBoundary>
    <AIGatewayContent {...props} />
  </AIGatewayErrorBoundary>
);
