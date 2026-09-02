import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Database, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Lock, 
  Zap, 
  Cpu, 
  ArrowDown, 
  Activity, 
  Server, 
  FileCheck, 
  User, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  FileText,
  AlertCircle,
  Share2,
  Layers,
  Stethoscope,
  ClipboardList,
  Scale,
  GitBranch,
  ArrowRight,
  BookOpen,
  Users,
  Bell,
  Shield,
  Clock,
  Terminal,
  FileCode,
  Check,
  Code
} from 'lucide-react';
import { SyntheticPatient, UserProfile, PurposeOfUse } from '../../types';

interface VerticalPatientSearchFlowCanvasProps {
  patient?: SyntheticPatient;
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  autoPlayOnce?: boolean;
  onSelectPatient?: (patientId: string) => void;
  defaultActiveAgent?: 'PATIENT' | 'KNOWLEDGE' | 'WORKFLOW';
  queryContext?: string;
}

export const VerticalPatientSearchFlowCanvas: React.FC<VerticalPatientSearchFlowCanvasProps> = ({
  patient,
  currentUser,
  purposeOfUse,
  autoPlayOnce = true,
  onSelectPatient,
  defaultActiveAgent = 'PATIENT',
  queryContext
}) => {
  // Selected agent to highlight ('PATIENT' or 'KNOWLEDGE' or 'WORKFLOW')
  const [activeAgentKey, setActiveAgentKey] = useState<'PATIENT' | 'KNOWLEDGE' | 'WORKFLOW'>(defaultActiveAgent);
  
  // Update activeAgentKey when defaultActiveAgent changes
  useEffect(() => {
    setActiveAgentKey(defaultActiveAgent);
  }, [defaultActiveAgent]);
  
  // Dynamic Integrated Pipeline Animation Step:
  // 1: AI Gateway
  // 2: Intent Detection
  // 3: Agent Orchestration Layer
  // 4: Triggered Specialist Agent (Knowledge / Patient / Workflow)
  // 5: Context Fusion
  // 6: Prompt Assembly
  // 7: Pre-Guardrail (DLP & HIPAA PHI Redaction)
  // 8: LLM Clinical Inference Engine (Gemini 1.5 Pro)
  // 9: Post-Guardrail (Zero-Hallucination & Provenance Verification)
  // 10: Response Validation (Citation & Code Validation - Final Step)
  const [currentExecutionStep, setCurrentExecutionStep] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showFullTelemetry, setShowFullTelemetry] = useState<boolean>(false);
  const [showAsciiGraph, setShowAsciiGraph] = useState<boolean>(false);

  // Dynamic Sequential Replay Flow
  const handleRerunDemoFlow = () => {
    setIsPlaying(true);
    setCurrentExecutionStep(1);

    const timeouts = [
      setTimeout(() => setCurrentExecutionStep(2), 280),   // Intent Detection
      setTimeout(() => setCurrentExecutionStep(3), 560),   // Orchestration
      setTimeout(() => setCurrentExecutionStep(4), 840),   // Active Agent Trigger
      setTimeout(() => setCurrentExecutionStep(5), 1120),  // Context Fusion
      setTimeout(() => setCurrentExecutionStep(6), 1400),  // Prompt Assembly
      setTimeout(() => setCurrentExecutionStep(7), 1680),  // Pre-Guardrail
      setTimeout(() => setCurrentExecutionStep(8), 1960),  // LLM Inference Engine
      setTimeout(() => setCurrentExecutionStep(9), 2240),  // Post-Guardrail
      setTimeout(() => {
        setCurrentExecutionStep(10);                       // Response Validation Done (Final Step)
        setIsPlaying(false);
      }, 2600)
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  useEffect(() => {
    if (autoPlayOnce) {
      handleRerunDemoFlow();
    }
  }, [patient?.id, defaultActiveAgent]);

  // Dynamic RAG Stages Data depending on active agent
  const patientRagStages = [
    {
      stageNumber: 1,
      name: 'Stage 1: Ingestion & FHIR Schema Extraction',
      badge: 'Multimodal / FHIR R4',
      latency: '14 ms',
      summary: `Parsed patient resource bundle from PostgreSQL (public.fhir_patients). Extracted ${patient?.conditions.length || 2} active conditions, ${patient?.medications.length || 3} active medications, and ${patient?.observations.length || 4} LOINC laboratory observations.`,
      icon: FileCode,
      details: {
        recordType: 'FHIR R4 Patient Bundle',
        patientMrn: patient?.mrn || '1000123',
        uprId: patient?.uprId || 'UPR-VERIFIED-FEDERATED',
        conditionsParsed: patient?.conditions.map(c => c.name).join(', ') || 'Coronary artery disease, Hypertension',
        medicationsParsed: patient?.medications.map(m => m.name).join(', ') || 'Atorvastatin, Metoprolol'
      }
    },
    {
      stageNumber: 2,
      name: 'Stage 2: Contextual Chunking & Boundary Tagging',
      badge: 'Clinical Chunking Engine',
      latency: '18 ms',
      summary: `Segmented longitudinal medical history into 6 semantic partitions with preserved ICD-10 diagnostic context and hospital encounter boundaries (${patient?.hospitalSite || 'City Hospital'}).`,
      icon: Layers,
      details: {
        totalChunksGenerated: 6,
        chunkingStrategy: 'Semantic Section & Paragraph Splitting',
        chunkOverlapTokens: 64,
        preservedHeaders: ['Demographics', 'Encounter History', 'Active Diagnoses', 'Vital & Lab Series']
      }
    },
    {
      stageNumber: 3,
      name: 'Stage 3: Dual Embedding & Vector Indexing',
      badge: 'pgvector 768-dim + BM25',
      latency: '24 ms',
      summary: `Embedded clinical concepts into PostgreSQL pgvector 768-dimensional space (text-embedding-004) paired with sparse BM25 inverted lexical indexing for high-precision retrieval.`,
      icon: Cpu,
      details: {
        denseEmbeddingModel: 'text-embedding-004 (768-dim)',
        sparseTokenizer: 'BM25 Clinical Medical Lexicon',
        vectorIndexType: 'HNSW (Hierarchical Navigable Small World)',
        indexedDimensions: 768
      }
    },
    {
      stageNumber: 4,
      name: 'Stage 4: Reciprocal Rank Fusion & Cross-Reranking',
      badge: 'RRF Reranker (Score: 0.96)',
      latency: '21 ms',
      summary: `Executed Reciprocal Rank Fusion (RRF) across vector similarities and exact match lexical hits. Cross-encoder reranked top-K candidate fragments for optimal clinician relevance.`,
      icon: Activity,
      details: {
        fusionAlgorithm: 'Reciprocal Rank Fusion (RRF, k=60)',
        topCandidateCount: 8,
        rerankConfidenceScore: '0.962',
        bestMatchedSnippet: `Patient ${patient?.fullName || 'Active Patient'} (${patient?.mrn || '1000123'}) admitted with ${patient?.conditions[0]?.name || 'inpatient care'} at ${patient?.hospitalSite || 'City Hospital'}.`
      }
    },
    {
      stageNumber: 5,
      name: 'Stage 5: Clinical Grounding & Safety Verification',
      badge: 'Zero Hallucination (99.4%)',
      latency: '16 ms',
      summary: `Verified source provenance (Checksum: ${patient?.provenance?.checksum || 'sha256-verified'}), performed automated DLP PHI validation, and confirmed Zero Hallucination compliance under Zero-Trust clinical policy.`,
      icon: ShieldCheck,
      details: {
        groundednessVerification: 'VERIFIED (99.4% Factuality Score)',
        phiMaskingStatus: 'COMPLIANT & LOGGED',
        immutableAuditChecksum: patient?.provenance?.checksum || 'sha256-verified-e104',
        clinicianApprovalGate: 'ATTENDING_PHYSICIAN_READY'
      }
    }
  ];

  const knowledgeRagStages = [
    {
      stageNumber: 1,
      name: 'Stage 1: Institutional Guidelines Ingestion & Governance Parser',
      badge: '10 Guidelines / RAG Ingestion',
      latency: '12 ms',
      summary: 'Ingested active institutional clinical guidelines (KDIGO CKD, GOLD COPD, AHA/ACC HFpEF, Surviving Sepsis, ADA Diabetes). Verified immutable approval signatures and institutional governance status.',
      icon: FileCode,
      details: {
        activeGuidelines: '10 Approved Institutional Guidelines (v2024.2)',
        primaryGuideline: 'AHA/ACC Heart Failure & KDIGO CKD Guidelines',
        clinicalDomain: 'Cardio-Renal Metabolic Clinical Protocol',
        governanceApproval: 'INSTITUTIONAL_APPROVED (SHA-256 Verified)'
      }
    },
    {
      stageNumber: 2,
      name: 'Stage 2: Contextual Chunking & Recommendation Boundary Tagging',
      badge: 'Semantic Section Parser',
      latency: '16 ms',
      summary: 'Partitioned guidelines into 256-token semantic chunks with preserved section headers (Indication, Contraindications, Renal Cutoffs, Dosing Algorithms) and recommendation classes (Class I/IIa).',
      icon: Layers,
      details: {
        totalChunksParsed: 42,
        chunkingStrategy: 'Semantic Section & Recommendation Boundary',
        overlapTokens: 64,
        preservedClasses: 'Class I (Strong), Class IIa (Moderate), LOE A/B'
      }
    },
    {
      stageNumber: 3,
      name: 'Stage 3: Dual Dense/Sparse Embedding & pgvector Indexing',
      badge: 'pgvector 768-dim + BM25',
      latency: '22 ms',
      summary: 'Embedded clinical guideline sections into PostgreSQL pgvector 768-dimensional space (text-embedding-004) paired with sparse BM25 inverted lexical indexing for high-precision retrieval.',
      icon: Cpu,
      details: {
        denseEmbeddingModel: 'text-embedding-004 (768-dim)',
        sparseTokenizer: 'BM25 Clinical Medical Lexicon',
        vectorStore: 'PostgreSQL pgvector (HNSW index)',
        similarityMetric: 'Cosine Distance (1 - dot_product)'
      }
    },
    {
      stageNumber: 4,
      name: 'Stage 4: Reciprocal Rank Fusion & Cross-Encoder Reranking',
      badge: 'RRF Reranker (Score: 0.98)',
      latency: '19 ms',
      summary: 'Executed Reciprocal Rank Fusion (RRF, k=60) combining vector semantic search with exact medical keyword matches. Cross-encoder reranked top-K candidate chunks for optimal clinical relevance.',
      icon: Activity,
      details: {
        fusionAlgorithm: 'Reciprocal Rank Fusion (RRF, k=60)',
        topCandidateCount: 6,
        rerankConfidenceScore: '0.984',
        topMatchedSnippet: 'Empagliflozin 10mg daily recommended in symptomatic HFpEF regardless of diabetes status down to eGFR 20 mL/min/1.73m2.'
      }
    },
    {
      stageNumber: 5,
      name: 'Stage 5: Zero-Hallucination Claim-to-Chunk Grounding & Verification',
      badge: '100% Grounded (Score: 99.8%)',
      latency: '15 ms',
      summary: 'Every generated assertion mapped directly to chunk ID with citation check. Calibrated zero-speculation uncertainty checker verified zero ungrounded claims.',
      icon: ShieldCheck,
      details: {
        groundednessVerification: 'VERIFIED (99.8% Factuality Score)',
        citationIntegrity: '100% Claim-to-Chunk Mapping',
        speculationRating: 'ZERO_SPECULATION_COMPLIANT',
        approvalGate: 'EVIDENCE_GRADE_HIGH'
      }
    }
  ];

  const ragStagesData = activeAgentKey === 'KNOWLEDGE' ? knowledgeRagStages : patientRagStages;

  // Render a vertical connecting arrow SVG with dynamic step pulse
  const renderConnectingArrow = (targetStepNumber: number) => {
    const isActive = isPlaying && currentExecutionStep === targetStepNumber;
    const isPassed = currentExecutionStep >= targetStepNumber;

    return (
      <div className="flex flex-col items-center py-2 relative">
        <svg width="24" height="32" viewBox="0 0 24 32" className="overflow-visible">
          <line 
            x1="12" y1="0" x2="12" y2="24" 
            stroke={isPassed ? '#4ade80' : '#27532d'} 
            strokeWidth="2.5" 
            strokeDasharray="4 3" 
            className={`animate-moving-arrow-dash ${isPassed ? 'animate-pulse' : ''}`}
          />
          <polygon 
            points="8,22 12,30 16,22" 
            fill={isPassed ? '#4ade80' : '#27532d'} 
          />
          {isActive && (
            <circle cx="12" cy="14" r="4" fill="#4ade80" className="animate-ping" />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-[#040906] border border-[#1b3e22] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 text-white overflow-hidden">
      {/* Moving Dash CSS Animation */}
      <style>{`
        @keyframes moving-arrow-dash {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-moving-arrow-dash {
          animation: moving-arrow-dash 0.5s linear infinite;
        }
      `}</style>
      
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b3e22]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-amber-400 opacity-75' : 'bg-emerald-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <h3 className="text-sm font-bold font-mono text-emerald-300 uppercase tracking-wider">
              Agent Architecture & Integrated Live Execution Flow
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40 font-bold">
              END-TO-END DYNAMIC PIPELINE
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Dynamic agent routing, multi-agent context fusion, zero-trust guardrails, Gemini LLM reasoning, & EHR synchronization
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ASCII Graph Inspector Toggle */}
          <button
            onClick={() => setShowAsciiGraph(!showAsciiGraph)}
            className="px-3 py-1.5 rounded-xl bg-[#091d12] hover:bg-[#122e1d] border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Toggle ASCII Topology Diagram view"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showAsciiGraph ? 'Hide Topology Map' : 'Topology Map'}</span>
          </button>

          {/* Replay Flow Button */}
          <button
            onClick={handleRerunDemoFlow}
            disabled={isPlaying}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              isPlaying
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-[#142817] hover:bg-[#1f3f24] text-[#4ade80] border border-[#4ade80]/40 shadow-[#4ade80]/15 hover:scale-105'
            }`}
            title="Replay the live agent execution flow dynamically"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{isPlaying ? 'Executing Flow...' : 'Rerun Flow (Demo)'}</span>
          </button>

          <button
            onClick={() => setShowFullTelemetry(!showFullTelemetry)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showFullTelemetry ? 'Hide Telemetry' : 'Telemetry Log'}</span>
          </button>
        </div>
      </div>

      {/* Target Routing Hint Banner */}
      <div className="bg-[#09150c] border border-[#1b3e22] rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            {activeAgentKey === 'KNOWLEDGE' ? (
              <>
                Active Request: <strong className="text-white">Clinical Q&A & Evidence Grounding</strong> → Triggered <strong className="text-[#38bdf8]">KNOWLEDGE AGENT</strong>
              </>
            ) : activeAgentKey === 'WORKFLOW' ? (
              <>
                Active Request: <strong className="text-white">Clinical Order & Workflow Task</strong> → Triggered <strong className="text-[#fb923c]">WORKFLOW AGENT</strong>
              </>
            ) : (
              <>
                Active Request: <strong className="text-white">Patient Search & EHR Record Retrieval</strong> → Triggered <strong className="text-[#4ade80]">PATIENT AGENT</strong>
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>Other agents in</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold border border-slate-700">STANDBY (GREY)</span>
          <span>mode</span>
        </div>
      </div>

      {/* Optional ASCII Topology Map Drawer */}
      {showAsciiGraph && (
        <div className="bg-[#02080e] p-4 rounded-2xl border border-cyan-500/30 overflow-x-auto shadow-inner">
          <div className="text-[10px] font-mono text-cyan-400 font-bold mb-2 flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-cyan-300" />
            <span>INTEGRATED SYSTEM TOPOLOGY GRAPH</span>
          </div>
          <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed font-bold">
{`       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
 KNOWLEDGE       PATIENT       WORKFLOW
   AGENT           AGENT         AGENT
       │             │             │
       └─────────────┼─────────────┘
                     ▼
             CONTEXT FUSION
                     │
              PROMPT ASSEMBLY
                     │
              PRE-GUARDRAIL
                     │
                     ▼
             LLM (Gemini Clinical Engine)
                     │
                     ▼
             POST-GUARDRAIL
                     │
             RESPONSE VALIDATION
                     │
                     ▼
      5-STAGE RAG RETRIEVAL & GROUNDING
                     │
                     ▼
       SHARED SERVICES & EHR STORAGE LAYER`}
          </pre>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTEGRATED DYNAMIC STEP-BY-STEP PROCESS FLOW CANVAS                       */}
      {/* ========================================================================= */}
      <div className="relative space-y-2 pt-1 pb-2">

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 1: AI GATEWAY (ZERO-TRUST INGRESS)                                   */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
              currentExecutionStep >= 1
                ? 'bg-gradient-to-r from-[#0a1f12] via-[#0e2a18] to-[#0a1f12] border-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/50 text-blue-400 flex items-center justify-center shadow-md">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      AI GATEWAY (ZERO-TRUST INGRESS)
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      TLS 1.3 Strict
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Verified session from <strong className="text-white">{currentUser.name}</strong> • Purpose: <span className="text-cyan-300 font-mono">[{purposeOfUse}]</span>
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                currentExecutionStep >= 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-slate-500'
              }`}>
                {currentExecutionStep >= 1 ? 'AUTH OK (12ms)' : 'Waiting'}
              </span>
            </div>
          </div>

          {renderConnectingArrow(2)}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 2: INTENT DETECTION ENGINE                                           */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
              currentExecutionStep >= 2
                ? 'bg-gradient-to-r from-[#0b2114] via-[#0f2e1b] to-[#0b2114] border-[#4ade80]/60 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-400 flex items-center justify-center shadow-md">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      INTENT DETECTION ENGINE
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Gemini Router
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Classified request as <strong className="text-emerald-300 font-mono">{activeAgentKey === 'KNOWLEDGE' ? 'CLINICAL_KNOWLEDGE_QA' : activeAgentKey === 'WORKFLOW' ? 'WORKFLOW_TASK_ORDER' : 'PATIENT_SEARCH_INTENT'}</strong> (99.8% Confidence)
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                currentExecutionStep >= 2 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-slate-500'
              }`}>
                {currentExecutionStep >= 2 ? 'ROUTED (18ms)' : 'Waiting'}
              </span>
            </div>
          </div>

          {renderConnectingArrow(3)}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 3: AGENT ORCHESTRATION LAYER                                         */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-2xl border transition-all duration-300 p-5 shadow-2xl ${
              currentExecutionStep >= 3
                ? 'bg-gradient-to-br from-[#120f2b] via-[#1a143f] to-[#100c27] border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/50 text-purple-300 flex items-center justify-center shadow-lg">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/40 text-purple-200 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
                    <span className="text-[10px] font-mono uppercase text-purple-300 font-bold tracking-wider">
                      AGENT ORCHESTRATION LAYER
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    ORCHESTRATOR AGENT
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-purple-200">
                <span className="px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40">
                  Target: <strong>{activeAgentKey === 'KNOWLEDGE' ? 'specialist_knowledge_agent' : activeAgentKey === 'WORKFLOW' ? 'specialist_workflow_agent' : 'specialist_patient_agent'}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-[11px] text-slate-300 font-mono">
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Task decomposition</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Tool specialization</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Workflow routing</span>
              </div>
            </div>
          </div>

          {/* Dynamic Single-Agent Branching SVG Connector: ONLY renders arrow for the active triggered agent */}
          <div className="w-full max-w-4xl py-3 relative hidden md:block">
            <svg width="100%" height="45" viewBox="0 0 600 45" className="overflow-visible" preserveAspectRatio="none">
              {/* Central vertical stem down from Orchestrator */}
              <line x1="300" y1="0" x2="300" y2="18" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
              
              {/* Active Agent 1: KNOWLEDGE AGENT (Left) */}
              {activeAgentKey === 'KNOWLEDGE' && (
                <>
                  <line x1="300" y1="18" x2="100" y2="18" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
                  <line x1="100" y1="18" x2="100" y2="38" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
                  <polygon points="96,36 100,43 104,36" fill="#38bdf8" />
                  {isPlaying && currentExecutionStep >= 4 && (
                    <circle cx="100" cy="28" r="4" fill="#38bdf8" className="animate-ping" />
                  )}
                </>
              )}

              {/* Active Agent 2: PATIENT AGENT (Center) */}
              {activeAgentKey === 'PATIENT' && (
                <>
                  <line x1="300" y1="18" x2="300" y2="38" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
                  <polygon points="296,36 300,43 304,36" fill="#4ade80" />
                  {isPlaying && currentExecutionStep >= 4 && (
                    <circle cx="300" cy="28" r="4" fill="#4ade80" className="animate-ping" />
                  )}
                </>
              )}

              {/* Active Agent 3: WORKFLOW AGENT (Right) */}
              {activeAgentKey === 'WORKFLOW' && (
                <>
                  <line x1="300" y1="18" x2="500" y2="18" stroke="#fb923c" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
                  <line x1="500" y1="18" x2="500" y2="38" stroke="#fb923c" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
                  <polygon points="496,36 500,43 504,36" fill="#fb923c" />
                  {isPlaying && currentExecutionStep >= 4 && (
                    <circle cx="500" cy="28" r="4" fill="#fb923c" className="animate-ping" />
                  )}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 4: 3 SPECIALIST AGENTS GRID (KNOWLEDGE / PATIENT / WORKFLOW)          */}
        {/* ------------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* 1) KNOWLEDGE AGENT */}
          <div 
            onClick={() => setActiveAgentKey('KNOWLEDGE')}
            className={`rounded-2xl border transition-all duration-300 p-5 cursor-pointer relative ${
              activeAgentKey === 'KNOWLEDGE'
                ? 'bg-gradient-to-b from-[#0c2236] to-[#07131e] border-blue-400 shadow-[0_0_35px_rgba(56,189,248,0.35)] ring-2 ring-blue-400/50 md:-translate-y-1'
                : 'bg-[#0a0f0c] border-white/5 opacity-40 hover:opacity-75 grayscale hover:grayscale-0'
            }`}
          >
            {activeAgentKey === 'KNOWLEDGE' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-400 text-slate-950 text-[10px] font-mono font-extrabold px-3 py-0.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>TRIGGERED AGENT</span>
              </div>
            )}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeAgentKey === 'KNOWLEDGE' ? 'bg-blue-900/60 border-blue-400 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    KNOWLEDGE AGENT
                  </h4>
                  <span className={`text-[10px] font-mono font-bold ${activeAgentKey === 'KNOWLEDGE' ? 'text-blue-300' : 'text-slate-400'}`}>
                    {activeAgentKey === 'KNOWLEDGE' ? '● ACTIVE SPECIALIST' : '○ STANDBY'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-3 text-xs font-mono text-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-300" />
                <span>Clinical Summary synthesis</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                <span>Guidelines (KDIGO, GOLD, AHA)</span>
              </div>
            </div>
          </div>

          {/* 2) PATIENT AGENT */}
          <div 
            onClick={() => setActiveAgentKey('PATIENT')}
            className={`rounded-2xl border transition-all duration-300 p-5 cursor-pointer relative ${
              activeAgentKey === 'PATIENT'
                ? 'bg-gradient-to-b from-[#0a2313] via-[#091e10] to-[#051109] border-[#4ade80] shadow-[0_0_35px_rgba(74,222,128,0.35)] ring-2 ring-[#4ade80]/50 md:-translate-y-1'
                : 'bg-[#0a0f0c] border-white/5 opacity-40 hover:opacity-75 grayscale hover:grayscale-0'
            }`}
          >
            {activeAgentKey === 'PATIENT' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4ade80] text-slate-950 text-[10px] font-mono font-extrabold px-3 py-0.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>TRIGGERED AGENT</span>
              </div>
            )}
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3e22]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeAgentKey === 'PATIENT' ? 'bg-[#14351c] border-[#4ade80] text-[#4ade80]' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    PATIENT AGENT
                  </h4>
                  <span className={`text-[10px] font-mono font-bold ${activeAgentKey === 'PATIENT' ? 'text-[#4ade80]' : 'text-slate-400'}`}>
                    {activeAgentKey === 'PATIENT' ? '● ACTIVE SPECIALIST' : '○ STANDBY'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-3 text-xs font-mono text-slate-200">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>EHR Record & Demographics</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>Conditions, Meds, & LOINC Labs</span>
              </div>
            </div>
          </div>

          {/* 3) WORKFLOW AGENT */}
          <div 
            onClick={() => setActiveAgentKey('WORKFLOW')}
            className={`rounded-2xl border transition-all duration-300 p-5 cursor-pointer relative ${
              activeAgentKey === 'WORKFLOW'
                ? 'bg-gradient-to-b from-[#2a1708] to-[#160c04] border-amber-400 shadow-[0_0_35px_rgba(251,146,60,0.35)] ring-2 ring-amber-400/50 md:-translate-y-1'
                : 'bg-[#0a0f0c] border-white/5 opacity-40 hover:opacity-75 grayscale hover:grayscale-0'
            }`}
          >
            {activeAgentKey === 'WORKFLOW' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-mono font-extrabold px-3 py-0.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>TRIGGERED AGENT</span>
              </div>
            )}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeAgentKey === 'WORKFLOW' ? 'bg-amber-900/60 border-amber-400 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    WORKFLOW AGENT
                  </h4>
                  <span className={`text-[10px] font-mono font-bold ${activeAgentKey === 'WORKFLOW' ? 'text-amber-300' : 'text-slate-400'}`}>
                    {activeAgentKey === 'WORKFLOW' ? '● ACTIVE SPECIALIST' : '○ STANDBY'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-3 text-xs font-mono text-slate-200">
              <div className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Orders & Discharge Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span>Specialist Referral drafting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Converging SVG Arrow: ONLY renders line & arrow from the active triggered agent to Context Fusion */}
        <div className="w-full max-w-4xl mx-auto py-2 relative hidden md:flex flex-col items-center">
          <svg width="100%" height="45" viewBox="0 0 600 45" className="overflow-visible" preserveAspectRatio="none">
            {/* Active Agent 1: KNOWLEDGE AGENT (Left) */}
            {activeAgentKey === 'KNOWLEDGE' && (
              <>
                <line x1="100" y1="0" x2="100" y2="20" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
                <line x1="100" y1="20" x2="300" y2="20" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
              </>
            )}

            {/* Active Agent 2: PATIENT AGENT (Center) */}
            {activeAgentKey === 'PATIENT' && (
              <line x1="300" y1="0" x2="300" y2="20" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
            )}

            {/* Active Agent 3: WORKFLOW AGENT (Right) */}
            {activeAgentKey === 'WORKFLOW' && (
              <>
                <line x1="500" y1="0" x2="500" y2="20" stroke="#fb923c" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
                <line x1="500" y1="20" x2="300" y2="20" stroke="#fb923c" strokeWidth="3" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
              </>
            )}

            {/* Central vertical stem down into Context Fusion */}
            <line x1="300" y1="20" x2="300" y2="40" stroke="#22d3ee" strokeWidth="3.5" strokeDasharray="4 3" className="animate-moving-arrow-dash animate-pulse" />
            <polygon points="294,36 300,44 306,36" fill="#22d3ee" />
          </svg>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 5: CONTEXT FUSION                                                    */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
              currentExecutionStep >= 5
                ? 'bg-gradient-to-r from-[#061e2b] via-[#092c3d] to-[#061e2b] border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 flex items-center justify-center shadow-md">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-200 flex items-center justify-center font-mono text-[10px] font-bold">5</span>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      CONTEXT FUSION
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Multi-Agent Synthesis
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Fuses Knowledge guidelines, Patient EHR data, and Workflow state into a unified multi-modal payload.
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                currentExecutionStep >= 5 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-slate-500'
              }`}>
                {currentExecutionStep >= 5 ? 'FUSED (14ms)' : 'Waiting'}
              </span>
            </div>
          </div>

          {renderConnectingArrow(6)}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 6: PROMPT ASSEMBLY                                                   */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
              currentExecutionStep >= 6
                ? 'bg-gradient-to-r from-[#061e2b] via-[#092c3d] to-[#061e2b] border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 flex items-center justify-center shadow-md">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-200 flex items-center justify-center font-mono text-[10px] font-bold">6</span>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      PROMPT ASSEMBLY
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Zero-Shot System
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Structures fused context with zero-shot clinical system instructions and anti-hallucination bounds.
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                currentExecutionStep >= 6 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-slate-500'
              }`}>
                {currentExecutionStep >= 6 ? 'ASSEMBLED (9ms)' : 'Waiting'}
              </span>
            </div>
          </div>

          {renderConnectingArrow(7)}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 7: PRE-GUARDRAIL                                                     */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
              currentExecutionStep >= 7
                ? 'bg-gradient-to-r from-[#091a30] via-[#0d2747] to-[#091a30] border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/50 text-blue-300 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-200 flex items-center justify-center font-mono text-[10px] font-bold">7</span>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      PRE-GUARDRAIL
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      DLP / HIPAA PHI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Scans outgoing prompt payload for PHI protection, prompt injection defense, and safety policy compliance.
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                currentExecutionStep >= 7 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-white/5 text-slate-500'
              }`}>
                {currentExecutionStep >= 7 ? 'PASSED 100% (11ms)' : 'Waiting'}
              </span>
            </div>
          </div>

          {renderConnectingArrow(8)}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 8: LLM (CLINICAL INFERENCE ENGINE) - GEMINI                          */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-3xl border transition-all duration-300 p-5 shadow-2xl ${
              currentExecutionStep >= 8
                ? 'bg-gradient-to-r from-[#180d33] via-[#24134a] to-[#180d33] border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.35)] ring-2 ring-purple-400/50'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-900/60 border border-purple-400/60 text-purple-300 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/40 text-purple-100 flex items-center justify-center font-mono text-[10px] font-bold">8</span>
                    <h4 className="text-sm font-mono font-extrabold text-white uppercase tracking-wider">
                      LLM (CLINICAL ENGINE)
                    </h4>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/50 font-bold">
                      Gemini 1.5 Pro Clinical
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 mt-1">
                    Executes high-precision clinical reasoning over prompt payload using fine-tuned medical weights & zero-speculation rules.
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase ${
                currentExecutionStep >= 8 ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50 shadow-md' : 'bg-white/5 text-slate-500'
              }`}>
                {currentExecutionStep >= 8 ? 'INFERENCE DONE (118ms)' : 'Waiting'}
              </span>
            </div>
          </div>

          {renderConnectingArrow(9)}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 9: POST-GUARDRAIL                                                    */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
              currentExecutionStep >= 9
                ? 'bg-gradient-to-r from-[#072412] via-[#0b381c] to-[#072412] border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-200 flex items-center justify-center font-mono text-[10px] font-bold">9</span>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      POST-GUARDRAIL
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Zero Hallucination
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Evaluates model response against input ground-truth tokens. Verifies zero ungrounded clinical claims or calculation errors.
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                currentExecutionStep >= 9 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-slate-500'
              }`}>
                {currentExecutionStep >= 9 ? 'VERIFIED (99.8%)' : 'Waiting'}
              </span>
            </div>
          </div>

          {renderConnectingArrow(10)}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* STEP 10: RESPONSE VALIDATION                                              */}
        {/* ------------------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-2xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
              currentExecutionStep >= 10
                ? 'bg-gradient-to-r from-[#072412] via-[#0b381c] to-[#072412] border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                : 'bg-[#08120b] border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-200 flex items-center justify-center font-mono text-[10px] font-bold">10</span>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      RESPONSE VALIDATION
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Clinician Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Validates medical citations, LOINC/ICD-10 code mappings, and renders clinician-ready output for attending review.
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                currentExecutionStep >= 10 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-slate-500'
              }`}>
                {currentExecutionStep >= 10 ? 'DELIVERED (15ms)' : 'Waiting'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Expandable Telemetry Drawer */}
      {showFullTelemetry && (
        <div className="bg-[#030604] border border-[#1b3e22] rounded-2xl p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-[#1b3e22] pb-2">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Real-Time Execution Telemetry Ledger
            </span>
            <span className="text-[10px] text-slate-400">
              Audit SHA-256: {patient?.provenance?.checksum || 'sha256-verified-e104'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="bg-[#07130a] p-3 rounded-xl border border-[#1b3e22]">
              <span className="text-slate-400 block text-[10px]">ACTIVE ROUTE:</span>
              <span className="text-white font-bold">{activeAgentKey} AGENT</span>
              <span className="text-emerald-300 block text-[10px] mt-1">PostgreSQL public.fhir_patients</span>
            </div>
            <div className="bg-[#07130a] p-3 rounded-xl border border-[#1b3e22]">
              <span className="text-slate-400 block text-[10px]">GROUNDEDNESS SCORE:</span>
              <span className="text-[#4ade80] font-bold">99.8% (Zero Hallucination)</span>
              <span className="text-slate-400 block text-[10px] mt-1">Cross-Encoder Verification</span>
            </div>
            <div className="bg-[#07130a] p-3 rounded-xl border border-[#1b3e22]">
              <span className="text-slate-400 block text-[10px]">EXECUTION DURATION:</span>
              <span className="text-cyan-300 font-bold">186 ms End-to-End</span>
              <span className="text-slate-400 block text-[10px] mt-1">Status: COMPLETED_SUCCESS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
