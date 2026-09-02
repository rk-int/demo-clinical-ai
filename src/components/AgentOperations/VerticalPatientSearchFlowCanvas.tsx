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
  FileCode
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
  
  // Pipeline animation step:
  // 1: AI Gateway
  // 2: Intent Detection
  // 3: Agent Orchestration Layer
  // 4: Branching to Active Agent
  // 5: RAG Stage 1 (Ingestion / Extraction)
  // 6: RAG Stage 2 (Chunking & Entity Extraction)
  // 7: RAG Stage 3 (Dual Dense/Sparse Embedding)
  // 8: RAG Stage 4 (Hybrid RRF Retrieval & Rerank)
  // 9: RAG Stage 5 (Clinical Grounding & Factuality Verification)
  // 10: Shared Services & EHR Dispatch (Complete)
  const [currentExecutionStep, setCurrentExecutionStep] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [expandedRagStage, setExpandedRagStage] = useState<number | null>(null);
  const [showFullTelemetry, setShowFullTelemetry] = useState<boolean>(false);

  // Replay Flow for Demo (Visual only - does not re-ingest patient data)
  const handleRerunDemoFlow = () => {
    setIsPlaying(true);
    setCurrentExecutionStep(1);

    const timeouts = [
      setTimeout(() => setCurrentExecutionStep(2), 350),  // Intent Detection
      setTimeout(() => setCurrentExecutionStep(3), 700),  // Orchestrator
      setTimeout(() => setCurrentExecutionStep(4), 1050), // Active Agent Selection
      setTimeout(() => setCurrentExecutionStep(5), 1400), // RAG Stage 1
      setTimeout(() => setCurrentExecutionStep(6), 1750), // RAG Stage 2
      setTimeout(() => setCurrentExecutionStep(7), 2100), // RAG Stage 3
      setTimeout(() => setCurrentExecutionStep(8), 2450), // RAG Stage 4
      setTimeout(() => setCurrentExecutionStep(9), 2800), // RAG Stage 5
      setTimeout(() => {
        setCurrentExecutionStep(10);                      // Shared Services Done
        setIsPlaying(false);
      }, 3200)
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  useEffect(() => {
    if (autoPlayOnce) {
      handleRerunDemoFlow();
    }
  }, [patient?.id, defaultActiveAgent]);

  // Dynamic RAG Stages Data depending on active agent (Patient vs Knowledge vs Workflow)
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

  return (
    <div className="bg-[#050b07] border border-[#1b3e22] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 text-white overflow-hidden">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b3e22]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-amber-400 opacity-75' : 'bg-emerald-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <h3 className="text-sm font-bold font-mono text-emerald-300 uppercase tracking-wider">
              Agent Architecture & Live Execution Flow
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40 font-bold">
              AGENTIC ROUTING PIPELINE
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {activeAgentKey === 'KNOWLEDGE' ? (
              <>
                Dynamic agent routing & 5-Stage RAG execution for <strong className="text-white">Clinical Knowledge & Guidelines</strong> {patient ? `(Context: ${patient.fullName} • ${patient.mrn})` : ''}
              </>
            ) : (
              <>
                Dynamic agent routing & 5-Stage RAG execution for <strong className="text-white">{patient?.fullName || 'Selected Patient'}</strong> ({patient?.mrn || '1000123'} • {patient?.uprId || 'UPR-VERIFIED'})
              </>
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Replay Flow for Demo (Visual only - does not re-ingest) */}
          <button
            onClick={handleRerunDemoFlow}
            disabled={isPlaying}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              isPlaying
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-[#142817] hover:bg-[#1f3f24] text-[#4ade80] border border-[#4ade80]/40 shadow-[#4ade80]/15 hover:scale-105'
            }`}
            title="Replay the live agent execution flow for demo without modifying data"
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
                Active Request: <strong className="text-white">Clinical Q&A & Evidence Grounding</strong> → Routed to <strong className="text-[#38bdf8]">KNOWLEDGE AGENT</strong>
              </>
            ) : activeAgentKey === 'WORKFLOW' ? (
              <>
                Active Request: <strong className="text-white">Clinical Order & Workflow Task</strong> → Routed to <strong className="text-[#fb923c]">WORKFLOW AGENT</strong>
              </>
            ) : (
              <>
                Active Request: <strong className="text-white">Patient Search & EHR Record Retrieval</strong> → Routed to <strong className="text-[#4ade80]">PATIENT AGENT</strong>
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

      {/* ========================================================================= */}
      {/* 1, 2, 3) HIERARCHICAL AGENT ARCHITECTURE & ROUTING WITH DOTTED LIVE FLOW  */}
      {/* ========================================================================= */}
      <div className="relative space-y-6 pt-2 pb-2">

        {/* STEP 1: AI GATEWAY CARD */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
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

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                AUTH OK (12ms)
              </span>
            </div>
          </div>

          {/* Dotted Connecting Arrow: AI Gateway -> Intent Detection */}
          <div className="flex flex-col items-center py-2 relative">
            <svg width="24" height="32" viewBox="0 0 24 32" className="overflow-visible">
              <line 
                x1="12" y1="0" x2="12" y2="24" 
                stroke={currentExecutionStep >= 2 ? '#4ade80' : '#27532d'} 
                strokeWidth="2.5" 
                strokeDasharray="4 3" 
                className={currentExecutionStep >= 2 ? 'animate-pulse' : ''}
              />
              <polygon 
                points="8,22 12,30 16,22" 
                fill={currentExecutionStep >= 2 ? '#4ade80' : '#27532d'} 
              />
              {isPlaying && currentExecutionStep === 2 && (
                <circle cx="12" cy="14" r="3.5" fill="#4ade80" className="animate-ping" />
              )}
            </svg>
          </div>
        </div>

        {/* STEP 2: INTENT DETECTION CARD */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full max-w-xl rounded-2xl border transition-all duration-300 p-4 shadow-lg ${
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
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      INTENT DETECTION ENGINE
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Gemini Router
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Classified as <strong className="text-emerald-300 font-mono">{activeAgentKey === 'KNOWLEDGE' ? 'CLINICAL_KNOWLEDGE_QA' : activeAgentKey === 'WORKFLOW' ? 'WORKFLOW_TASK_ORDER' : 'PATIENT_SEARCH_INTENT'}</strong> with 99.8% confidence
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                ROUTED (18ms)
              </span>
            </div>
          </div>

          {/* Dotted Connecting Arrow: Intent Detection -> Agent Orchestration */}
          <div className="flex flex-col items-center py-2 relative">
            <svg width="24" height="32" viewBox="0 0 24 32" className="overflow-visible">
              <line 
                x1="12" y1="0" x2="12" y2="24" 
                stroke={currentExecutionStep >= 3 ? '#4ade80' : '#27532d'} 
                strokeWidth="2.5" 
                strokeDasharray="4 3" 
                className={currentExecutionStep >= 3 ? 'animate-pulse' : ''}
              />
              <polygon 
                points="8,22 12,30 16,22" 
                fill={currentExecutionStep >= 3 ? '#4ade80' : '#27532d'} 
              />
              {isPlaying && currentExecutionStep === 3 && (
                <circle cx="12" cy="14" r="3.5" fill="#4ade80" className="animate-ping" />
              )}
            </svg>
          </div>
        </div>

        {/* STEP 3: AGENT ORCHESTRATION LAYER (Top Orchestrator Box) */}
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
                    <span className="text-[10px] font-mono uppercase text-purple-300 font-bold tracking-wider">
                      AGENT ORCHESTRATION LAYER
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      Multi-Agent Dispatcher
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

            {/* Orchestrator Capabilities Pills (Matching image reference layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-3 text-[11px] text-slate-300 font-mono">
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1.5 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Task decomposition</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1.5 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Tool & specialization selection</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1.5 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Workflow coordination</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1.5 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Context & state management</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1.5 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Error handling & fallback</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-950/40 px-2.5 py-1.5 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">•</span>
                <span>Escalation routing</span>
              </div>
            </div>
          </div>

          {/* 3-Way Branching SVG Dotted Connectors */}
          <div className="w-full max-w-4xl py-3 relative hidden md:block">
            <svg width="100%" height="45" viewBox="0 0 600 45" className="overflow-visible" preserveAspectRatio="none">
              {/* Central vertical stem down from Orchestrator */}
              <line x1="300" y1="0" x2="300" y2="18" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="4 3" />
              
              {/* Horizontal distributing bar */}
              <line x1="100" y1="18" x2="500" y2="18" stroke="#27532d" strokeWidth="2" strokeDasharray="4 3" />
              
              {/* Active branch highlight to Center (Patient Agent) */}
              <line 
                x1="300" y1="18" x2="300" y2="38" 
                stroke={activeAgentKey === 'PATIENT' ? '#4ade80' : '#27532d'} 
                strokeWidth={activeAgentKey === 'PATIENT' ? '3' : '1.5'} 
                strokeDasharray="4 3" 
                className={activeAgentKey === 'PATIENT' ? 'animate-pulse' : ''}
              />
              <polygon 
                points="296,36 300,43 304,36" 
                fill={activeAgentKey === 'PATIENT' ? '#4ade80' : '#27532d'} 
              />

              {/* Branch to Left (Knowledge Agent) */}
              <line 
                x1="100" y1="18" x2="100" y2="38" 
                stroke={activeAgentKey === 'KNOWLEDGE' ? '#38bdf8' : '#233227'} 
                strokeWidth={activeAgentKey === 'KNOWLEDGE' ? '3' : '1.5'} 
                strokeDasharray="4 3" 
                className={activeAgentKey === 'KNOWLEDGE' ? 'animate-pulse' : ''}
              />
              <polygon 
                points="96,36 100,43 104,36" 
                fill={activeAgentKey === 'KNOWLEDGE' ? '#38bdf8' : '#233227'} 
              />

              {/* Branch to Right (Workflow Agent) */}
              <line 
                x1="500" y1="18" x2="500" y2="38" 
                stroke={activeAgentKey === 'WORKFLOW' ? '#fb923c' : '#233227'} 
                strokeWidth={activeAgentKey === 'WORKFLOW' ? '3' : '1.5'} 
                strokeDasharray="4 3" 
                className={activeAgentKey === 'WORKFLOW' ? 'animate-pulse' : ''}
              />
              <polygon 
                points="496,36 500,43 504,36" 
                fill={activeAgentKey === 'WORKFLOW' ? '#fb923c' : '#233227'} 
              />

              {/* Animated glowing pulse traveling to active Agent */}
              {isPlaying && currentExecutionStep >= 4 && (
                <circle 
                  cx={activeAgentKey === 'KNOWLEDGE' ? '100' : activeAgentKey === 'WORKFLOW' ? '500' : '300'} 
                  cy="28" 
                  r="4" 
                  fill={activeAgentKey === 'KNOWLEDGE' ? '#38bdf8' : activeAgentKey === 'WORKFLOW' ? '#fb923c' : '#4ade80'} 
                  className="animate-ping" 
                />
              )}
            </svg>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3-WAY SPECIALIST AGENT TIER                                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* 1) KNOWLEDGE AGENT */}
          <div 
            onClick={() => setActiveAgentKey('KNOWLEDGE')}
            className={`rounded-2xl border transition-all duration-300 p-5 cursor-pointer relative ${
              activeAgentKey === 'KNOWLEDGE'
                ? 'bg-gradient-to-b from-[#0c2236] to-[#07131e] border-blue-400 shadow-[0_0_35px_rgba(56,189,248,0.35)] ring-2 ring-blue-400/50 md:-translate-y-2'
                : 'bg-[#0a0f0c] border-white/5 opacity-40 hover:opacity-75 grayscale hover:grayscale-0'
            }`}
          >
            {/* Active Highlight Badge when Knowledge Agent is Triggered */}
            {activeAgentKey === 'KNOWLEDGE' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-400 text-slate-950 text-[10px] font-mono font-extrabold px-3 py-0.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>TRIGGERED AGENT</span>
              </div>
            )}

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeAgentKey === 'KNOWLEDGE'
                    ? 'bg-blue-900/60 border-blue-400 text-blue-300 shadow-[0_0_15px_#38bdf8]'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    CLINICAL / KNOWLEDGE AGENT
                  </h4>
                  <span className={`text-[10px] font-mono font-bold ${activeAgentKey === 'KNOWLEDGE' ? 'text-blue-300' : 'text-slate-400'}`}>
                    {activeAgentKey === 'KNOWLEDGE' ? '● ACTIVE SPECIALIST (TRIGGERED)' : '○ STANDBY (GREY)'}
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeAgentKey === 'KNOWLEDGE'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}>
                {activeAgentKey === 'KNOWLEDGE' ? 'RAG Active' : 'Standby'}
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs font-mono text-slate-200">
              <div className="flex items-center gap-2">
                <FileText className={`w-3.5 h-3.5 ${activeAgentKey === 'KNOWLEDGE' ? 'text-blue-300' : 'text-slate-400'}`} />
                <span>Clinical Summary synthesis</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className={`w-3.5 h-3.5 ${activeAgentKey === 'KNOWLEDGE' ? 'text-blue-300' : 'text-slate-400'}`} />
                <span>Guidelines (KDIGO, GOLD, AHA)</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className={`w-3.5 h-3.5 ${activeAgentKey === 'KNOWLEDGE' ? 'text-blue-300' : 'text-slate-400'}`} />
                <span>Differential Diagnosis search</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className={`w-3.5 h-3.5 ${activeAgentKey === 'KNOWLEDGE' ? 'text-blue-300' : 'text-slate-400'}`} />
                <span>PubMed & Literature grounding</span>
              </div>
            </div>

            {activeAgentKey === 'KNOWLEDGE' && (
              <div className="mt-3.5 p-2 rounded-xl bg-[#031322] border border-blue-500/30 text-[11px] font-mono flex items-center justify-between">
                <span className="text-slate-400">Institutional Corpus:</span>
                <span className="text-blue-300 font-bold">10 Active Guidelines</span>
              </div>
            )}

            {activeAgentKey !== 'KNOWLEDGE' && (
              <div className="mt-4 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-500 text-center">
                Click to switch active route
              </div>
            )}
          </div>

          {/* 2) PATIENT AGENT */}
          <div 
            onClick={() => setActiveAgentKey('PATIENT')}
            className={`rounded-2xl border transition-all duration-300 p-5 cursor-pointer relative ${
              activeAgentKey === 'PATIENT'
                ? 'bg-gradient-to-b from-[#0a2313] via-[#091e10] to-[#051109] border-[#4ade80] shadow-[0_0_35px_rgba(74,222,128,0.35)] ring-2 ring-[#4ade80]/50 md:-translate-y-2'
                : 'bg-[#0a0f0c] border-white/5 opacity-40 hover:opacity-75 grayscale hover:grayscale-0'
            }`}
          >
            {/* Active Highlight Badge */}
            {activeAgentKey === 'PATIENT' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4ade80] text-slate-950 text-[10px] font-mono font-extrabold px-3 py-0.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>TRIGGERED AGENT</span>
              </div>
            )}

            <div className="flex items-center justify-between pb-3 border-b border-[#1b3e22]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeAgentKey === 'PATIENT'
                    ? 'bg-[#14351c] border-[#4ade80] text-[#4ade80] shadow-[0_0_15px_#4ade80]'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    PATIENT DATA AGENT
                  </h4>
                  <span className={`text-[10px] font-mono font-bold ${activeAgentKey === 'PATIENT' ? 'text-[#4ade80]' : 'text-slate-400'}`}>
                    {activeAgentKey === 'PATIENT' ? '● ACTIVE SPECIALIST (TRIGGERED)' : '○ STANDBY (GREY)'}
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeAgentKey === 'PATIENT'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}>
                PostgreSQL & FHIR R4
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs font-mono text-slate-200">
              <div className="flex items-center gap-2">
                <User className={`w-3.5 h-3.5 ${activeAgentKey === 'PATIENT' ? 'text-[#4ade80]' : 'text-slate-400'}`} />
                <span>Demographics & UPR Federated ID</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className={`w-3.5 h-3.5 ${activeAgentKey === 'PATIENT' ? 'text-[#4ade80]' : 'text-slate-400'}`} />
                <span>Conditions ({patient?.conditions.length || 2}) & Medications ({patient?.medications.length || 3})</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className={`w-3.5 h-3.5 ${activeAgentKey === 'PATIENT' ? 'text-[#4ade80]' : 'text-slate-400'}`} />
                <span>LOINC Labs ({patient?.observations.length || 4}) & Feeds</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-3.5 h-3.5 ${activeAgentKey === 'PATIENT' ? 'text-[#4ade80]' : 'text-slate-400'}`} />
                <span>Consent & Provenance Checksum</span>
              </div>
            </div>

            {/* Target Patient Identifier Ribbon */}
            <div className="mt-3.5 p-2 rounded-xl bg-[#040c06] border border-[#1b3e22] text-[11px] font-mono flex items-center justify-between">
              <span className="text-slate-400">Target Record:</span>
              <span className="text-emerald-300 font-bold truncate max-w-[140px]">{patient?.fullName || 'Active Patient'}</span>
            </div>

            {activeAgentKey !== 'PATIENT' && (
              <div className="mt-4 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-500 text-center">
                Click to switch active route
              </div>
            )}
          </div>

          {/* 3) WORKFLOW AGENT */}
          <div 
            onClick={() => setActiveAgentKey('WORKFLOW')}
            className={`rounded-2xl border transition-all duration-300 p-5 cursor-pointer relative ${
              activeAgentKey === 'WORKFLOW'
                ? 'bg-gradient-to-b from-[#2a1708] to-[#160c04] border-amber-400 shadow-[0_0_35px_rgba(251,146,60,0.35)] ring-2 ring-amber-400/50 md:-translate-y-2'
                : 'bg-[#0a0f0c] border-white/5 opacity-40 hover:opacity-75 grayscale hover:grayscale-0'
            }`}
          >
            {/* Active Highlight Badge when Workflow Agent is Triggered */}
            {activeAgentKey === 'WORKFLOW' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-mono font-extrabold px-3 py-0.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>TRIGGERED AGENT</span>
              </div>
            )}

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  activeAgentKey === 'WORKFLOW'
                    ? 'bg-amber-900/60 border-amber-400 text-amber-300 shadow-[0_0_15px_#fb923c]'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    WORKFLOW / ORDER AGENT
                  </h4>
                  <span className={`text-[10px] font-mono font-bold ${activeAgentKey === 'WORKFLOW' ? 'text-amber-300' : 'text-slate-400'}`}>
                    {activeAgentKey === 'WORKFLOW' ? '● ACTIVE SPECIALIST (TRIGGERED)' : '○ STANDBY (GREY)'}
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeAgentKey === 'WORKFLOW'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}>
                {activeAgentKey === 'WORKFLOW' ? 'Orders Active' : 'Standby'}
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs font-mono text-slate-200">
              <div className="flex items-center gap-2">
                <FileText className={`w-3.5 h-3.5 ${activeAgentKey === 'WORKFLOW' ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>Clinical Document generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className={`w-3.5 h-3.5 ${activeAgentKey === 'WORKFLOW' ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>Discharge Summary & Transfer</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className={`w-3.5 h-3.5 ${activeAgentKey === 'WORKFLOW' ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>Specialist Referral drafting</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className={`w-3.5 h-3.5 ${activeAgentKey === 'WORKFLOW' ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>Encounter & Follow-up scheduling</span>
              </div>
            </div>

            {activeAgentKey !== 'WORKFLOW' && (
              <div className="mt-4 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-500 text-center">
                Click to switch active route
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4) CHILD STEPS OF RAG (Stage 1 to Stage 5) EXECUTED IN REAL-TIME          */}
        {/* ========================================================================= */}
        <div className="bg-[#040a06] border border-[#1b3e22] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1b3e22]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                RAG
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  REAL-TIME 5-STAGE RAG CHILD EXECUTION PIPELINE
                </h4>
                <p className="text-[11px] text-slate-300">
                  Sub-stages executed by <strong className="text-[#4ade80]">{activeAgentKey} AGENT</strong> for record retrieval and grounding
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40 font-bold self-start sm:self-auto">
              5 / 5 STAGES EXECUTED
            </span>
          </div>

          {/* 5-Stage Step Flow Cards */}
          <div className="space-y-2.5">
            {ragStagesData.map((stage) => {
              const stepIndex = 4 + stage.stageNumber; // 5, 6, 7, 8, 9
              const isStageActive = isPlaying && currentExecutionStep === stepIndex;
              const isStageComplete = currentExecutionStep >= stepIndex;
              const isExpanded = expandedRagStage === stage.stageNumber;
              const StageIcon = stage.icon;

              return (
                <div 
                  key={stage.stageNumber}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isStageActive
                      ? 'bg-[#0e2c17] border-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.3)] scale-[1.01]'
                      : isStageComplete
                      ? 'bg-[#07140b] border-[#1b3e22] hover:border-[#27532d]'
                      : 'bg-[#030604] border-white/5 opacity-40'
                  }`}
                >
                  <div className="p-3.5 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Stage Number Icon */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border font-mono text-xs font-bold transition-all shrink-0 mt-0.5 ${
                          isStageActive
                            ? 'bg-[#14351c] border-[#4ade80] text-[#4ade80] shadow-[0_0_12px_#4ade80]'
                            : isStageComplete
                            ? 'bg-[#0c1f10] border-[#27532d] text-emerald-400'
                            : 'bg-slate-900 border-white/10 text-slate-500'
                        }`}>
                          <StageIcon className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-xs font-bold text-white font-mono">
                              {stage.name}
                            </h5>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {stage.badge}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Latency: {stage.latency}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 mt-1 font-sans">
                            {stage.summary}
                          </p>
                        </div>
                      </div>

                      {/* Status & Inspector Button */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          isStageActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : isStageComplete
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-white/5 text-slate-500 border border-white/10'
                        }`}>
                          {isStageActive ? 'Running...' : isStageComplete ? 'Done' : 'Waiting'}
                        </span>

                        <button
                          onClick={() => setExpandedRagStage(isExpanded ? null : stage.stageNumber)}
                          className="text-[10px] font-mono text-slate-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer mt-1"
                        >
                          <span>{isExpanded ? 'Less' : 'Inspect'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Detailed Inspector Drawer */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#1b3e22] text-[11px] font-mono space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#020503] p-3 rounded-xl border border-[#142817]">
                          {Object.entries(stage.details).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-[10px] text-slate-500 uppercase block">{k}:</span>
                              <span className="text-emerald-300 font-bold text-xs truncate block">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dotted Connecting Arrow: Agents & RAG -> Shared Services */}
        <div className="flex flex-col items-center py-2 relative">
          <svg width="24" height="32" viewBox="0 0 24 32" className="overflow-visible">
            <line 
              x1="12" y1="0" x2="12" y2="24" 
              stroke={currentExecutionStep >= 10 ? '#4ade80' : '#27532d'} 
              strokeWidth="2.5" 
              strokeDasharray="4 3" 
              className={currentExecutionStep >= 10 ? 'animate-pulse' : ''}
            />
            <polygon 
              points="8,22 12,30 16,22" 
              fill={currentExecutionStep >= 10 ? '#4ade80' : '#27532d'} 
            />
          </svg>
        </div>

        {/* STEP 5: SHARED SERVICES & EHR DISPATCH (Matching Bottom Tier of Reference Image) */}
        <div 
          className={`w-full rounded-2xl border transition-all duration-300 p-4 sm:p-5 shadow-xl ${
            currentExecutionStep >= 10
              ? 'bg-gradient-to-r from-[#07140b] via-[#0b1f11] to-[#07140b] border-[#1b3e22] shadow-[0_0_25px_rgba(74,222,128,0.15)]'
              : 'bg-[#08120b] border-white/10 opacity-50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1b3e22]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  SHARED SERVICES & EHR STORAGE LAYER
                </h4>
                <p className="text-[11px] text-slate-300">
                  Synchronized with PostgreSQL, FHIR Datastores, Audit Trail, and Security Policies
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0">
              EHR SYNCHRONIZED
            </span>
          </div>

          {/* 6 Shared Services Pillars (Matching Image Reference) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-3 text-[11px] text-slate-300 font-mono">
            <div className="bg-[#040805] p-2.5 rounded-xl border border-white/5 flex flex-col items-center text-center gap-1.5 hover:border-emerald-500/30 transition-colors">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white text-[10px]">Knowledge Base</span>
            </div>

            <div className="bg-[#040805] p-2.5 rounded-xl border border-white/5 flex flex-col items-center text-center gap-1.5 hover:border-emerald-500/30 transition-colors">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-white text-[10px]">User & RBAC</span>
            </div>

            <div className="bg-[#040805] p-2.5 rounded-xl border border-white/5 flex flex-col items-center text-center gap-1.5 hover:border-emerald-500/30 transition-colors">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white text-[10px]">Alerts & Notice</span>
            </div>

            <div className="bg-[#040805] p-2.5 rounded-xl border border-white/5 flex flex-col items-center text-center gap-1.5 hover:border-emerald-500/30 transition-colors">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white text-[10px]">Audit & Logging</span>
            </div>

            <div className="bg-[#040805] p-2.5 rounded-xl border border-white/5 flex flex-col items-center text-center gap-1.5 hover:border-emerald-500/30 transition-colors">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-white text-[10px]">Security / PHI</span>
            </div>

            <div className="bg-[#040805] p-2.5 rounded-xl border border-white/5 flex flex-col items-center text-center gap-1.5 hover:border-emerald-500/30 transition-colors">
              <Share2 className="w-4 h-4 text-teal-400" />
              <span className="font-semibold text-white text-[10px]">Integration APIs</span>
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
              Audit SHA-256: {patient.provenance.checksum}
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
              <span className="text-[#4ade80] font-bold">99.4% (Zero Hallucination)</span>
              <span className="text-slate-400 block text-[10px] mt-1">Cross-Encoder Verification</span>
            </div>
            <div className="bg-[#07130a] p-3 rounded-xl border border-[#1b3e22]">
              <span className="text-slate-400 block text-[10px]">EXECUTION DURATION:</span>
              <span className="text-cyan-300 font-bold">93 ms End-to-End</span>
              <span className="text-slate-400 block text-[10px] mt-1">Status: COMPLETED_SUCCESS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
