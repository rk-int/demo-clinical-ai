import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  FileText, 
  AlertTriangle, 
  GitMerge, 
  Calculator, 
  UserCheck, 
  Mail, 
  Bell, 
  CheckCircle2, 
  Database,
  Search,
  Sparkles,
  Info,
  Clock,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { SyntheticPatient, UserProfile, PurposeOfUse } from '../../types';

export interface WideWorkflowNode {
  id: string;
  name: string;
  categoryName: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'Complete' | 'Active' | 'Idle' | 'Verified';
  description: string;
  telemetry: {
    latency: string;
    details: string;
    payloadSnippet: string;
  };
}

interface WideAgenticWorkflowCanvasProps {
  patient?: SyntheticPatient;
  currentUser?: UserProfile;
  purposeOfUse?: PurposeOfUse;
  autoPlayOnce?: boolean;
  title?: string;
  onExecutionComplete?: () => void;
  className?: string;
}

export const WideAgenticWorkflowCanvas: React.FC<WideAgenticWorkflowCanvasProps> = ({
  patient,
  currentUser,
  purposeOfUse = 'TREATMENT',
  autoPlayOnce = true,
  title,
  onExecutionComplete,
  className = '',
}) => {
  // 5 execution phases: 0 (Start) -> 1 (Gatekeeper) -> 2 (Parallel Ingestion & Safety) -> 3 (Merge & Scoring) -> 4 (HITL & Provenance Audit) -> 5 (EMR Sync Notifier - Done)
  const [executionPhase, setExecutionPhase] = useState<number>(5); // Default to completed once rendered if not auto-playing
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasRunOnce, setHasRunOnce] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('risk_scoring_node');
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState<boolean>(false);

  const patientName = patient?.fullName || 'Elena Rostova';
  const patientMrn = patient?.mrn || 'MRN-884920';
  const patientCondition = patient?.conditions?.[0]?.name || 'Heart Failure with Preserved Ejection Fraction (HFpEF)';
  const eGfrValue = patient?.observations?.find(o => o.name.toLowerCase().includes('egfr') || o.code === 'egfr')?.value || 38;

  // Run only once when mounted if autoPlayOnce is true
  useEffect(() => {
    if (autoPlayOnce && !hasRunOnce) {
      setHasRunOnce(true);
      setExecutionPhase(0);
      setIsPlaying(true);

      const timer1 = setTimeout(() => setExecutionPhase(1), 400);
      const timer2 = setTimeout(() => setExecutionPhase(2), 1000);
      const timer3 = setTimeout(() => setExecutionPhase(3), 1800);
      const timer4 = setTimeout(() => setExecutionPhase(4), 2600);
      const timer5 = setTimeout(() => {
        setExecutionPhase(5);
        setIsPlaying(false);
        if (onExecutionComplete) onExecutionComplete();
      }, 3400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [autoPlayOnce, hasRunOnce]);

  const handleRestart = () => {
    setExecutionPhase(0);
    setIsPlaying(true);

    setTimeout(() => setExecutionPhase(1), 400);
    setTimeout(() => setExecutionPhase(2), 1000);
    setTimeout(() => setExecutionPhase(3), 1800);
    setTimeout(() => setExecutionPhase(4), 2600);
    setTimeout(() => {
      setExecutionPhase(5);
      setIsPlaying(false);
      if (onExecutionComplete) onExecutionComplete();
    }, 3400);
  };

  // Node status calculations based on executionPhase
  const getNodeStatus = (nodeStage: number): 'Complete' | 'Active' | 'Idle' | 'Verified' => {
    if (executionPhase > nodeStage) return 'Complete';
    if (executionPhase === nodeStage) return isPlaying ? 'Active' : 'Complete';
    return 'Idle';
  };

  const nodes: Record<string, WideWorkflowNode> = {
    gatekeeper_node: {
      id: 'gatekeeper_node',
      name: 'gatekeeper_node',
      categoryName: 'ABAC Context & Consent Verifier',
      icon: ShieldCheck,
      status: getNodeStatus(1),
      description: 'Enforces Zero-Trust token authentication, active consent check, and ABAC purpose-of-use binding before record ingress.',
      telemetry: {
        latency: '14ms',
        details: `User: ${currentUser?.name || 'Dr. Sarah Lin, MD'} | Purpose: ${purposeOfUse} | Consent: ACTIVE_CONSENT`,
        payloadSnippet: `{"auth": "PASSED", "purpose": "${purposeOfUse}", "mfaVerified": true, "sessionToken": "JWT-ABAC-VERIFIED"}`,
      },
    },
    clinical_history_extractor: {
      id: 'clinical_history_extractor',
      name: 'clinical_history_extractor',
      categoryName: 'Clinical History & FHIR Extraction',
      icon: Activity,
      status: getNodeStatus(2),
      description: 'Extracts longitudinal FHIR conditions, active prescriptions, LOINC laboratory values, and cross-hospital transfers.',
      telemetry: {
        latency: '28ms',
        details: `Target: ${patientName} (${patientMrn}) | Conditions: 1 Active | Meds: ${patient?.medications?.length || 1}`,
        payloadSnippet: `{"patientId": "${patient?.id || 'pat-1001'}", "conditions": ["${patientCondition}"], "extractedLabs": ["eGFR: ${eGfrValue}"]}`,
      },
    },
    contraindication_safety_node: {
      id: 'contraindication_safety_node',
      name: 'contraindication_safety_node',
      categoryName: 'Contraindication & Allergy Guard',
      icon: AlertTriangle,
      status: getNodeStatus(2),
      description: 'Scans for severe drug-drug interactions, known allergies (e.g. Lisinopril Angioedema), and clinical guideline safety bounds.',
      telemetry: {
        latency: '22ms',
        details: 'Allergy screening: Lisinopril (Angioedema) flagged. SGLT2 Renal boundary check: eGFR > 20 mL/min pass.',
        payloadSnippet: `{"allergiesFlagged": ["Lisinopril"], "safetyCheck": "PASSED_WITH_FLAGS", "blackBoxWarning": false}`,
      },
    },
    risk_scoring_node: {
      id: 'risk_scoring_node',
      name: 'risk_scoring_node',
      categoryName: 'Renal & Guideline Scoring Engine',
      icon: Calculator,
      status: getNodeStatus(3),
      description: 'Executes multivariate clinical risk stratification, CKD-EPI eGFR decline slope analysis, and ACC/AHA guideline recommendation alignment.',
      telemetry: {
        latency: '45ms',
        details: `Score: Renal CKD Stage 3b (eGFR: ${eGfrValue} mL/min) | RRF Grounding: 0.962 | SGLT2 Fit: High Benefit`,
        payloadSnippet: `{"ckdStage": "3b", "sglt2Indication": "CLASS_1A", "guidelineSource": "ACC/AHA 2025 Heart Failure", "eGFR": ${eGfrValue}}`,
      },
    },
    physician_hitl_node: {
      id: 'physician_hitl_node',
      name: 'physician_hitl_node',
      categoryName: 'Attending Physician HITL Sign-off',
      icon: UserCheck,
      status: executionPhase >= 4 ? (executionPhase === 4 && isPlaying ? 'Active' : 'Idle') : 'Idle',
      description: 'Human-in-the-Loop governance gate: Blocks autonomous unsigned EHR writes, preparing draft order for physician signature.',
      telemetry: {
        latency: '18ms (Gate Standby)',
        details: `Reviewer: ${currentUser?.name || 'Dr. Sarah Lin, MD'} | State: Draft Order Staged for Digital Signing`,
        payloadSnippet: `{"autonomousWriteBlocked": true, "digitalSignature": "PENDING_PHYSICIAN_APPROVAL", "reviewerRole": "ATTENDING"}`,
      },
    },
    provenance_audit_node: {
      id: 'provenance_audit_node',
      name: 'provenance_audit_node',
      categoryName: 'Provenance & Audit Trail Logger',
      icon: Mail,
      status: getNodeStatus(4),
      description: 'Generates immutable cryptographic SHA-256 audit ledger entry and clinician explanation summary.',
      telemetry: {
        latency: '31ms',
        details: `Provenance Hash: ${patient?.provenance?.checksum || 'sha256-verified-patient-001'} | Audit ID: AUD-2026-SEARCH-8910`,
        payloadSnippet: `{"provenanceVerified": true, "checksum": "${patient?.provenance?.checksum || 'sha256-78921a'}", "auditStatus": "COMMITTED"}`,
      },
    },
    ehr_sync_notifier: {
      id: 'ehr_sync_notifier',
      name: 'ehr_sync_notifier',
      categoryName: 'EHR Stream & Notification Dispatch',
      icon: Bell,
      status: getNodeStatus(5),
      description: 'Publishes synchronized clinical state to PostgreSQL EHR cache and broadcasts real-time telemetry to clinical dashboard.',
      telemetry: {
        latency: '16ms',
        details: 'PostgreSQL record synchronized. Telemetry stream finalized.',
        payloadSnippet: `{"dbSync": "SUCCESS", "recordsUpdated": 1, "table": "public.fhir_patients", "status": "FINALIZED"}`,
      },
    },
  };

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : nodes['risk_scoring_node'];

  return (
    <div className={`bg-[#050806] border border-[#162a19] rounded-2xl p-4 md:p-6 shadow-2xl text-slate-100 relative overflow-hidden font-sans ${className}`}>
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3822_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Header Bar with Live Execution Indicators & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#142817] relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isPlaying ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ade80]"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
              )}
            </span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {title || `Live Agentic Workflow Pipeline: ${patientName}`}
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#142817] text-[#4ade80] border border-[#27532d] font-semibold">
            {executionPhase === 5 && !isPlaying ? '⚡ RUN COMPLETED (SYNCED)' : `EXECUTING PHASE ${executionPhase}/5`}
          </span>
        </div>

        {/* Patient Details & Control Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono bg-[#09140c] px-2.5 py-1 rounded-lg border border-[#1a3820] text-slate-300">
            <span className="text-slate-500">MRN:</span>
            <span className="text-cyan-300 font-bold">{patientMrn}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">eGFR:</span>
            <span className="text-[#4ade80] font-bold">{eGfrValue} mL/min</span>
          </div>

          <button
            onClick={handleRestart}
            className="px-2.5 py-1 rounded-lg bg-[#142817] hover:bg-[#1f3f24] border border-[#27532d] text-xs font-mono text-[#4ade80] flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(74,222,128,0.15)]"
            title="Re-run Live Workflow Stream"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Flow</span>
          </button>

          <button
            onClick={() => setShowTelemetryDrawer(!showTelemetryDrawer)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>{showTelemetryDrawer ? 'Hide Telemetry' : 'Inspect Node'}</span>
            {showTelemetryDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Wide Canvas Diagram Area */}
      <div className="relative w-full overflow-x-auto py-6 min-h-[340px] flex items-center justify-center">
        <div className="min-w-[960px] w-full max-w-[1100px] relative h-[280px] flex items-center justify-between px-2">
          
          {/* SVG Canvas for Smooth Bezier Connectors matching the uploaded design */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 280" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wideActiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* 1. START -> gatekeeper_node */}
            <path
              d="M 65 140 C 90 140, 110 140, 140 140"
              fill="none"
              stroke={executionPhase >= 1 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 1 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 1 ? '5 4' : executionPhase > 1 ? 'none' : '4 4'}
              className={executionPhase === 1 ? 'animate-pulse' : ''}
            />

            {/* 2. gatekeeper_node -> clinical_history_extractor (Top Branch) */}
            <path
              d="M 235 140 C 265 140, 275 60, 310 60"
              fill="none"
              stroke={executionPhase >= 2 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 2 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 2 ? '5 4' : executionPhase > 2 ? 'none' : '4 4'}
            />

            {/* 3. gatekeeper_node -> contraindication_safety_node (Bottom Branch) */}
            <path
              d="M 235 140 C 265 140, 275 220, 310 220"
              fill="none"
              stroke={executionPhase >= 2 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 2 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 2 ? '5 4' : executionPhase > 2 ? 'none' : '4 4'}
            />

            {/* 4. clinical_history_extractor -> merge_clinical_stream */}
            <path
              d="M 410 60 C 445 60, 455 140, 480 140"
              fill="none"
              stroke={executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 3 ? '5 4' : executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 5. contraindication_safety_node -> merge_clinical_stream */}
            <path
              d="M 410 220 C 445 220, 455 140, 480 140"
              fill="none"
              stroke={executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 3 ? '5 4' : executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 6. merge_clinical_stream -> risk_scoring_node */}
            <path
              d="M 505 140 L 545 140"
              fill="none"
              stroke={executionPhase >= 3 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 3 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 3 ? '5 4' : executionPhase > 3 ? 'none' : '4 4'}
            />

            {/* 7. risk_scoring_node -> physician_hitl_node (Top Branch) */}
            <path
              d="M 645 140 C 675 140, 685 60, 715 60"
              fill="none"
              stroke={executionPhase >= 4 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 4 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 4 ? '5 4' : executionPhase > 4 ? 'none' : '4 4'}
            />

            {/* 8. risk_scoring_node -> provenance_audit_node (Bottom Branch) */}
            <path
              d="M 645 140 C 675 140, 685 220, 715 220"
              fill="none"
              stroke={executionPhase >= 4 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 4 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 4 ? '5 4' : executionPhase > 4 ? 'none' : '4 4'}
            />

            {/* 9. physician_hitl_node -> ehr_sync_notifier */}
            <path
              d="M 815 60 C 850 60, 860 140, 890 140"
              fill="none"
              stroke={executionPhase >= 5 ? '#4ade80' : '#1b3820'}
              strokeWidth={executionPhase >= 5 ? 2.5 : 1.5}
              strokeDasharray={executionPhase === 5 ? '5 4' : executionPhase > 5 ? 'none' : '4 4'}
            />

            {/* 10. provenance_audit_node -> ehr_sync_notifier */}
            <path
              d="M 815 220 C 850 220, 860 140, 890 140"
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
              title="Start Pipeline"
            >
              <Play className="w-5 h-5 fill-[#4ade80] ml-0.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-white tracking-widest mt-1 uppercase">
              START
            </span>
          </div>

          {/* NODE 1: gatekeeper_node */}
          <div
            onClick={() => setSelectedNodeId('gatekeeper_node')}
            className={`absolute left-[140px] top-[102px] z-10 w-[95px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.gatekeeper_node.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.gatekeeper_node.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200 shadow-[0_0_10px_rgba(74,222,128,0.15)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <ShieldCheck className={`w-4 h-4 ${nodes.gatekeeper_node.status === 'Active' || nodes.gatekeeper_node.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[10px] font-mono font-bold text-white truncate">gatekeeper_node</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.gatekeeper_node.status}</div>
          </div>

          {/* NODE 2 (Top): clinical_history_extractor */}
          <div
            onClick={() => setSelectedNodeId('clinical_history_extractor')}
            className={`absolute left-[310px] top-[22px] z-10 w-[100px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.clinical_history_extractor.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.clinical_history_extractor.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200 shadow-[0_0_10px_rgba(74,222,128,0.15)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Activity className={`w-4 h-4 ${nodes.clinical_history_extractor.status === 'Active' || nodes.clinical_history_extractor.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">clinical_history_extractor</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.clinical_history_extractor.status}</div>
          </div>

          {/* NODE 3 (Bottom): contraindication_safety_node */}
          <div
            onClick={() => setSelectedNodeId('contraindication_safety_node')}
            className={`absolute left-[310px] top-[182px] z-10 w-[100px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.contraindication_safety_node.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.contraindication_safety_node.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200 shadow-[0_0_10px_rgba(74,222,128,0.15)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <AlertTriangle className={`w-4 h-4 ${nodes.contraindication_safety_node.status === 'Active' || nodes.contraindication_safety_node.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">contraindication_safety_node</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.contraindication_safety_node.status}</div>
          </div>

          {/* JUNCTION NODE: merge_clinical_stream (Circular connector) */}
          <div className="absolute left-[475px] top-[125px] z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
              executionPhase >= 3
                ? 'bg-[#0a1a0f] border-[#4ade80] text-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-600'
            }`}>
              <GitMerge className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8px] font-mono text-slate-400 mt-0.5">merge_clinical_stream</span>
          </div>

          {/* NODE 4: risk_scoring_node (Prominent Highlighted Box with Neon Green Glow) */}
          <div
            onClick={() => setSelectedNodeId('risk_scoring_node')}
            className={`absolute left-[545px] top-[95px] z-10 w-[105px] p-2.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.risk_scoring_node.status === 'Active' || nodes.risk_scoring_node.status === 'Complete'
                ? 'bg-[#0d2613] border-[#4ade80] ring-2 ring-[#4ade80]/80 shadow-[0_0_28px_rgba(74,222,128,0.5)] scale-105'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Calculator className={`w-4 h-4 ${nodes.risk_scoring_node.status === 'Active' || nodes.risk_scoring_node.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[10px] font-mono font-bold text-white truncate">risk_scoring_node</div>
            <div className="text-[8px] font-mono font-bold text-[#4ade80] mt-0.5">
              {nodes.risk_scoring_node.status === 'Active' ? 'Active' : 'Complete'}
            </div>
          </div>

          {/* NODE 5 (Top): physician_hitl_node */}
          <div
            onClick={() => setSelectedNodeId('physician_hitl_node')}
            className={`absolute left-[715px] top-[22px] z-10 w-[100px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.physician_hitl_node.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.physician_hitl_node.status === 'Complete' || nodes.physician_hitl_node.status === 'Verified'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200'
                : 'bg-[#080d0a] border-[#162a19] text-slate-400'
            }`}
          >
            <div className="flex justify-center mb-1">
              <UserCheck className={`w-4 h-4 ${nodes.physician_hitl_node.status === 'Active' ? 'text-[#4ade80]' : 'text-slate-400'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">physician_hitl_node</div>
            <div className="text-[8px] font-mono text-slate-400 mt-0.5">{nodes.physician_hitl_node.status}</div>
          </div>

          {/* NODE 6 (Bottom): provenance_audit_node */}
          <div
            onClick={() => setSelectedNodeId('provenance_audit_node')}
            className={`absolute left-[715px] top-[182px] z-10 w-[100px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.provenance_audit_node.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.provenance_audit_node.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Mail className={`w-4 h-4 ${nodes.provenance_audit_node.status === 'Active' || nodes.provenance_audit_node.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[9px] font-mono font-bold text-white truncate">provenance_audit_node</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.provenance_audit_node.status}</div>
          </div>

          {/* NODE 7: ehr_sync_notifier */}
          <div
            onClick={() => setSelectedNodeId('ehr_sync_notifier')}
            className={`absolute left-[890px] top-[102px] z-10 w-[95px] p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              nodes.ehr_sync_notifier.status === 'Active'
                ? 'bg-[#0f2815] border-[#4ade80] ring-2 ring-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.4)] scale-105'
                : nodes.ehr_sync_notifier.status === 'Complete'
                ? 'bg-[#09150c] border-[#2f663a] text-slate-200 shadow-[0_0_10px_rgba(74,222,128,0.15)]'
                : 'bg-[#080d0a] border-[#162a19] text-slate-500 opacity-60'
            }`}
          >
            <div className="flex justify-center mb-1">
              <Bell className={`w-4 h-4 ${nodes.ehr_sync_notifier.status === 'Active' || nodes.ehr_sync_notifier.status === 'Complete' ? 'text-[#4ade80]' : 'text-slate-500'}`} />
            </div>
            <div className="text-[10px] font-mono font-bold text-white truncate">ehr_sync_notifier</div>
            <div className="text-[8px] font-mono text-[#4ade80] mt-0.5">{nodes.ehr_sync_notifier.status}</div>
          </div>

        </div>
      </div>

      {/* Expanded Telemetry Drawer when user clicks a node or toggles inspect */}
      {showTelemetryDrawer && selectedNode && (
        <div className="mt-4 pt-4 border-t border-[#162a19] bg-[#071009] p-4 rounded-xl border border-[#1b3e22] text-xs font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[#142817]">
            <div className="flex items-center gap-2">
              <selectedNode.icon className="w-4 h-4 text-[#4ade80]" />
              <span className="font-bold text-white text-sm">Node: <code className="text-[#4ade80]">{selectedNode.name}</code></span>
              <span className="text-[10px] text-slate-400">({selectedNode.categoryName})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Execution Latency:</span>
              <span className="text-cyan-300 font-bold">{selectedNode.telemetry.latency}</span>
            </div>
          </div>

          <p className="text-slate-300 mt-2 text-[11px] leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="mt-2.5 p-2.5 rounded-lg bg-[#030604] border border-[#122816] text-[#4ade80] text-[10px] overflow-x-auto">
            <span className="text-slate-500">// Node Execution Output Payload:</span>
            <pre className="mt-1">{selectedNode.telemetry.payloadSnippet}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
