import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Brain, 
  Layers, 
  FileCheck, 
  Shield, 
  Zap, 
  Terminal,
  Activity,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  XCircle,
  X,
  ShieldAlert,
  AlertOctagon,
  Ban,
  FileText,
  UserX,
  FileQuestion,
  Gauge,
  Rocket
} from 'lucide-react';
import { UserProfile, PurposeOfUse } from '../../types';

interface LlmGatewayGuardrailsViewProps {
  currentUser: UserProfile;
  purposeOfUse?: PurposeOfUse;
  onBack?: () => void;
}

export type SelectedModelId = 
  | 'gemini_flash'
  | 'gemini_pro'
  | 'gpt4o_mini'
  | 'gpt4o'
  | 'claude_haiku'
  | 'claude_sonnet'
  | 'llama_edge'
  | 'llama_70b';

export type ScenarioType = 
  | 'NORMAL' 
  | 'INJECTION' 
  | 'PHI' 
  | 'GROUNDING' 
  | 'TOXICITY' 
  | 'UNAUTHORIZED_ROLE' 
  | 'HALLUCINATION' 
  | 'UNREGISTERED_CITATION';

interface ModelOption {
  id: SelectedModelId;
  name: string;
  displayTitle: string;
  exactModelVersion: string;
  tier: 'LIGHTWEIGHT (FAST)' | 'HIGH-PERFORMANCE (REASONING)';
  useCase: string;
  provider: string;
  badge: string;
  color: string;
  borderColor: string;
  bgActive: string;
  latencyMs: number;
  costPer1k: string;
  contextWindow: string;
  isCurrentAppDefault?: boolean;
}

export const LlmGatewayGuardrailsView: React.FC<LlmGatewayGuardrailsViewProps> = ({
  currentUser,
  purposeOfUse = 'TREATMENT',
  onBack
}) => {
  const [selectedModel, setSelectedModel] = useState<SelectedModelId>('gemini_flash');
  const [modelFilterTier, setModelFilterTier] = useState<'ALL' | 'LIGHTWEIGHT' | 'HIGH_PERFORMANCE'>('ALL');
  const [testScenario, setTestScenario] = useState<ScenarioType>('NORMAL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [flowStage, setFlowStage] = useState<number>(4); // 0: Idle, 1: Pre-Guardrails, 2: LLM, 3: Post-Guardrails, 4: Complete
  const [copiedJson, setCopiedJson] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  const models: ModelOption[] = [
    {
      id: 'gemini_flash',
      name: 'Gemini 2.5 Flash',
      displayTitle: 'Gemini 2.5 Flash',
      exactModelVersion: 'gemini-2.5-flash-latest',
      tier: 'LIGHTWEIGHT (FAST)',
      useCase: 'Sub-second Clinical Triage, Rapid EHR Extraction & Low-Cost Streaming',
      provider: 'Google GenAI SDK (google-genai v0.1.1)',
      badge: 'ACTIVE APP MODEL',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500',
      bgActive: 'bg-cyan-500/15',
      latencyMs: 140,
      costPer1k: '$0.000075',
      contextWindow: '1.0M Tokens',
      isCurrentAppDefault: true,
    },
    {
      id: 'gemini_pro',
      name: 'Gemini 1.5 Pro',
      displayTitle: 'Gemini 1.5 Pro',
      exactModelVersion: 'gemini-1.5-pro-002',
      tier: 'HIGH-PERFORMANCE (REASONING)',
      useCase: 'Complex Multi-Page Surgical Record Synthesis & Differential Diagnosis',
      provider: 'Google Vertex AI Enterprise',
      badge: 'FLAGSHIP MULTIMODAL',
      color: 'text-blue-400',
      borderColor: 'border-blue-500',
      bgActive: 'bg-blue-500/15',
      latencyMs: 320,
      costPer1k: '$0.001250',
      contextWindow: '2.0M Tokens',
    },
    {
      id: 'gpt4o_mini',
      name: 'GPT-4o Mini',
      displayTitle: 'GPT-4o Mini',
      exactModelVersion: 'gpt-4o-mini-2024-07-18',
      tier: 'LIGHTWEIGHT (FAST)',
      useCase: 'High-Volume Outpatient Patient Portal Q&A & Intake Form Validation',
      provider: 'Azure OpenAI Enterprise API',
      badge: 'LIGHTWEIGHT OPENAI',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500',
      bgActive: 'bg-emerald-500/15',
      latencyMs: 180,
      costPer1k: '$0.000150',
      contextWindow: '128K Tokens',
    },
    {
      id: 'gpt4o',
      name: 'GPT-4o Enterprise',
      displayTitle: 'GPT-4o Enterprise',
      exactModelVersion: 'gpt-4o-2024-08-06',
      tier: 'HIGH-PERFORMANCE (REASONING)',
      useCase: 'Multi-Specialty Interventional Cardiology & Cath Lab Decision Support',
      provider: 'Azure OpenAI Enterprise API',
      badge: 'FLAGSHIP OPENAI',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500',
      bgActive: 'bg-cyan-500/15',
      latencyMs: 480,
      costPer1k: '$0.002500',
      contextWindow: '128K Tokens',
    },
    {
      id: 'claude_haiku',
      name: 'Claude 3.5 Haiku',
      displayTitle: 'Claude 3.5 Haiku',
      exactModelVersion: 'claude-3-5-haiku-20241022',
      tier: 'LIGHTWEIGHT (FAST)',
      useCase: 'Sub-second Medical Vocabulary Normalization & Code Mapping',
      provider: 'AWS Bedrock API',
      badge: 'FAST ANTHROPIC',
      color: 'text-amber-300',
      borderColor: 'border-amber-500',
      bgActive: 'bg-amber-500/15',
      latencyMs: 160,
      costPer1k: '$0.000250',
      contextWindow: '200K Tokens',
    },
    {
      id: 'claude_sonnet',
      name: 'Claude 3.5 Sonnet',
      displayTitle: 'Claude 3.5 Sonnet',
      exactModelVersion: 'claude-3-5-sonnet-20241022',
      tier: 'HIGH-PERFORMANCE (REASONING)',
      useCase: 'In-Depth Guidelines Adherence Audit & Complex Medical Report Generation',
      provider: 'AWS Bedrock Endpoint',
      badge: 'DEEP REASONING',
      color: 'text-amber-400',
      borderColor: 'border-amber-500',
      bgActive: 'bg-amber-500/15',
      latencyMs: 410,
      costPer1k: '$0.003000',
      contextWindow: '200K Tokens',
    },
    {
      id: 'llama_edge',
      name: 'Llama 3.2 3B (Edge)',
      displayTitle: 'Llama 3.2 3B (Edge)',
      exactModelVersion: 'llama-3.2-3b-instruct',
      tier: 'LIGHTWEIGHT (FAST)',
      useCase: 'Offline Air-Gapped Bedside Telemetry & Local Device Processing',
      provider: 'On-Premises Edge Node',
      badge: 'EDGE / OFFLINE',
      color: 'text-purple-300',
      borderColor: 'border-purple-500',
      bgActive: 'bg-purple-500/15',
      latencyMs: 90,
      costPer1k: 'Self-Hosted ($0)',
      contextWindow: '128K Tokens',
    },
    {
      id: 'llama_70b',
      name: 'Llama 3.3 70B',
      displayTitle: 'Llama 3.3 70B',
      exactModelVersion: 'llama-3.3-70b-instruct',
      tier: 'HIGH-PERFORMANCE (REASONING)',
      useCase: 'Sovereign On-Premise Clinical Decision Support & Private Local RAG',
      provider: 'vLLM Self-Hosted GPU Cluster',
      badge: 'OPEN WEIGHTS 70B',
      color: 'text-purple-400',
      borderColor: 'border-purple-500',
      bgActive: 'bg-purple-500/15',
      latencyMs: 290,
      costPer1k: 'Self-Hosted',
      contextWindow: '128K Tokens',
    },
  ];

  const filteredModels = models.filter((m) => {
    if (modelFilterTier === 'LIGHTWEIGHT') return m.tier.includes('LIGHTWEIGHT');
    if (modelFilterTier === 'HIGH_PERFORMANCE') return m.tier.includes('HIGH-PERFORMANCE');
    return true;
  });

  const activeModelObj = models.find((m) => m.id === selectedModel) || models[0];

  const handleRunSimulation = (scenario: ScenarioType) => {
    setTestScenario(scenario);
    setIsSimulating(true);
    setFlowStage(1);

    const isPreBlock = scenario === 'INJECTION' || scenario === 'TOXICITY' || scenario === 'UNAUTHORIZED_ROLE';

    setTimeout(() => {
      if (isPreBlock) {
        setFlowStage(1);
        setIsSimulating(false);
        return;
      }
      setFlowStage(2);
    }, 700);

    setTimeout(() => {
      setFlowStage(3);
    }, 1400);

    setTimeout(() => {
      setFlowStage(4);
      setIsSimulating(false);
    }, 2100);
  };

  const isPreBlocked = testScenario === 'INJECTION' || testScenario === 'TOXICITY' || testScenario === 'UNAUTHORIZED_ROLE';
  const isPostBlocked = testScenario === 'HALLUCINATION' || testScenario === 'UNREGISTERED_CITATION';
  const isBlocked = isPreBlocked || isPostBlocked;

  const getPreGuardrailStatus = () => {
    if (flowStage === 0) return { label: 'Ready', color: 'bg-slate-700 text-slate-300' };
    if (flowStage === 1 && isSimulating) return { label: 'Evaluating...', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' };
    if (testScenario === 'INJECTION') return { label: 'BLOCKED ✕ (Adversarial Prompt Injection)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-black' };
    if (testScenario === 'TOXICITY') return { label: 'BLOCKED ✕ (High Toxicity 0.94)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-black' };
    if (testScenario === 'UNAUTHORIZED_ROLE') return { label: 'BLOCKED ✕ (ABAC Policy Denial)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-black' };
    return { label: 'Passed ✓', color: 'bg-emerald-600 text-white font-bold' };
  };

  const getPostGuardrailStatus = () => {
    if (isPreBlocked) return { label: 'Bypassed (Pre-Guardrail Blocked)', color: 'bg-slate-800 text-slate-500' };
    if (flowStage < 3) return { label: 'Pending LLM Execution', color: 'bg-slate-800 text-slate-400' };
    if (flowStage === 3 && isSimulating) return { label: 'Verifying...', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' };
    if (testScenario === 'HALLUCINATION') return { label: 'BLOCKED ✕ (Low Grounding Score 0.62)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-black' };
    if (testScenario === 'UNREGISTERED_CITATION') return { label: 'BLOCKED ✕ (Missing Chunk Citation)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-black' };
    return { label: 'Passed ✓', color: 'bg-emerald-600 text-white font-bold' };
  };

  const preStatus = getPreGuardrailStatus();
  const postStatus = getPostGuardrailStatus();

  // Telemetry JSON Payload for Portal Admin
  const telemetryPayload = {
    timestamp: new Date().toISOString(),
    gateVersion: 'v3.2.0-PROD-GUARD',
    portalAdminAccess: true,
    userRole: currentUser.role,
    activeModel: activeModelObj.displayTitle,
    exactModelVersion: activeModelObj.exactModelVersion,
    tier: activeModelObj.tier,
    useCase: activeModelObj.useCase,
    provider: activeModelObj.provider,
    testScenario,
    preGuardrails: {
      promptInjectionDefense: testScenario === 'INJECTION' ? 'ATTACK_NEUTRALIZED (BLOCKED ✕)' : 'PASSED ✓ (Zero Malicious Patterns)',
      toxicityFilter: testScenario === 'TOXICITY' ? 'TOXIC_CONTENT_BLOCKED ✕ (Score: 0.94)' : 'PASSED ✓ (0.00 Toxicity Score)',
      phiDetectionDlp: testScenario === 'PHI' ? 'PASSED ✓ (4 PHI Tokens Redacted)' : 'PASSED ✓ (De-identified)',
      policyCheck: testScenario === 'UNAUTHORIZED_ROLE' ? 'ABAC_POLICY_DENIED ✕ (Role Scope Violation)' : 'PASSED ✓ (PURPOSE_OF_USE: TREATMENT)',
      overallPreStatus: isPreBlocked ? 'BLOCKED ✕' : 'PASSED ✓',
    },
    llmExecution: {
      executed: !isPreBlocked,
      modelId: activeModelObj.id,
      modelName: activeModelObj.displayTitle,
      exactVersion: activeModelObj.exactModelVersion,
      tier: activeModelObj.tier,
      latencyMs: isPreBlocked ? 0 : activeModelObj.latencyMs,
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
    postGuardrails: {
      executed: !isPreBlocked,
      hallucinationCheck: testScenario === 'HALLUCINATION' ? 'HALLUCINATION_DETECTED ✕ (Factuality: 0.62 < 0.95)' : isPreBlocked ? 'NOT_RUN' : 'PASSED ✓ (RRF Score: 0.984)',
      groundingCheck: testScenario === 'HALLUCINATION' ? 'FAILED ✕' : isPreBlocked ? 'NOT_RUN' : 'PASSED ✓ (Threshold >= 0.95)',
      citationCheck: testScenario === 'UNREGISTERED_CITATION' ? 'CITATION_MISSING ✕ (No Chunk Reference)' : isPreBlocked ? 'NOT_RUN' : 'PASSED ✓ (All Claim Chunks Verified)',
      safetyCheck: isPreBlocked ? 'NOT_RUN' : 'PASSED ✓ (Non-Autonomous Disclaimer Appended)',
      overallPostStatus: isPostBlocked ? 'BLOCKED ✕' : isPreBlocked ? 'BYPASSED' : 'PASSED ✓',
    },
    finalResponse: {
      status: isBlocked ? 'REQUEST_BLOCKED_BY_GUARDRAIL' : 'VERIFIED_AND_ENFORCED',
      trustScore: isBlocked ? 0.0 : 0.986,
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(telemetryPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    LLM Gateway & Guardrails
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                    PORTAL ADMIN EXCLUSIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Real-time Pre & Post LLM Guardrail Orchestration, Model Router & Enterprise Safety Pipeline
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Guardrail Pipeline Active
            </span>
            <button
              onClick={() => setShowInspector(!showInspector)}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              {showInspector ? 'Hide Telemetry' : 'Inspect JSON Telemetry'}
            </button>
          </div>
        </div>

        {/* MODEL ROUTER SELECTOR TABS (Categorized into High & Light Tiers) */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Enterprise LLM Model Router Selection (High-Performance vs Lightweight Models):
            </label>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setModelFilterTier('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  modelFilterTier === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All 8 Models
              </button>
              <button
                onClick={() => setModelFilterTier('LIGHTWEIGHT')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                  modelFilterTier === 'LIGHTWEIGHT' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3 text-cyan-300" />
                <span>Lightweight (Fast)</span>
              </button>
              <button
                onClick={() => setModelFilterTier('HIGH_PERFORMANCE')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                  modelFilterTier === 'HIGH_PERFORMANCE' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Rocket className="w-3 h-3 text-purple-300" />
                <span>High-Performance</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredModels.map((mod) => {
              const isSelected = selectedModel === mod.id;
              const isLight = mod.tier.includes('LIGHTWEIGHT');
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModel(mod.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? `bg-slate-950 ${mod.borderColor} ring-2 ring-blue-500/50 shadow-xl text-white`
                      : 'bg-slate-950/40 border-white/10 hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black ${isSelected ? mod.color : 'text-slate-200'}`}>
                        {mod.name}
                      </span>
                      {mod.isCurrentAppDefault ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                          ACTIVE MODEL
                        </span>
                      ) : (
                        <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          isLight ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {isLight ? '⚡ LIGHT' : '🚀 REASONING'}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-cyan-300 font-bold mt-1 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      <span>{mod.exactModelVersion}</span>
                    </div>

                    <p className="text-[9px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      <strong>Use Case:</strong> {mod.useCase}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono pt-1.5 border-t border-white/5">
                    <span className="text-slate-400">Latency: <strong className="text-slate-200">{mod.latencyMs}ms</strong></span>
                    <span className="text-emerald-400 font-bold">{mod.contextWindow}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVE FLOW CANVAS WITH ANIMATED MOVING ARROWS OR BLOCKED RED 'X' MARK       */}
      {/* ========================================================================= */}
      <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Dynamic Model Header above flow */}
        <div className="text-center mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <h2 className={`text-xl sm:text-2xl font-black ${activeModelObj.color} tracking-tight drop-shadow-md`}>
              {activeModelObj.displayTitle}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              ID: {activeModelObj.exactModelVersion}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
              activeModelObj.tier.includes('LIGHTWEIGHT')
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            }`}>
              TIER: {activeModelObj.tier}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 font-mono max-w-2xl mx-auto">
            <strong>Target Use Case:</strong> {activeModelObj.useCase} • Provider: {activeModelObj.provider} • Latency {activeModelObj.latencyMs}ms
          </p>
        </div>

        {/* Presentation Scroll Control Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Guardrail Pipeline Canvas (Scroll Left/Right for Demo Presentation)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('guardrail-flow-canvas');
                if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>Scroll Left</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('guardrail-flow-canvas');
                if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow"
            >
              <span>Scroll Right</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with Min Width */}
        <div 
          id="guardrail-flow-canvas"
          className="overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-cyan-500/40 scrollbar-track-slate-950 rounded-2xl"
        >
          <div className="min-w-[1200px] flex flex-row items-center justify-between gap-3 relative">
          
          {/* ========================================================================= */}
          {/* BOX 1: PRE-GUARDRAILS (Crispy & Detailed Info)                            */}
          {/* ========================================================================= */}
          <div className={`w-full lg:w-1/4 bg-slate-900/90 border rounded-3xl p-5 shadow-xl flex flex-col justify-between relative z-10 transition-all min-h-[320px] ${
            isPreBlocked ? 'border-rose-500/80 shadow-rose-500/20' : 'border-slate-700/60 hover:border-blue-500/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Pre-Guardrails</span>
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  INPUT GATE
                </span>
              </div>

              {/* Crispy Detailed Guardrail Items */}
              <div className="space-y-2 text-xs">
                {/* 1. Prompt Injection */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">1. Prompt Injection</span>
                    {testScenario === 'INJECTION' ? (
                      <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/60 font-black text-[9px] flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-400 stroke-[3]" /> BLOCKED ✕
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> PASSED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {testScenario === 'INJECTION' ? 'Adversarial jailbreak payload neutralized' : '0 malicious injection patterns detected'}
                  </p>
                </div>

                {/* 2. Toxicity */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">2. Toxicity Filter</span>
                    {testScenario === 'TOXICITY' ? (
                      <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/60 font-black text-[9px] flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-400 stroke-[3]" /> BLOCKED ✕
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> PASSED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {testScenario === 'TOXICITY' ? 'Toxicity score 0.94 (Harmful advice detected)' : '0.00 toxicity score (Safe input)'}
                  </p>
                </div>

                {/* 3. PHI Detection */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">3. PHI Detection</span>
                    {testScenario === 'PHI' ? (
                      <span className="px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-purple-400" /> REDACTED ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> PASSED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {testScenario === 'PHI' ? '4 PHI tokens masked with cryptographic hashes' : 'HIPAA de-identification validated'}
                  </p>
                </div>

                {/* 4. Policy Check */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">4. Policy Check</span>
                    {testScenario === 'UNAUTHORIZED_ROLE' ? (
                      <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/60 font-black text-[9px] flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-400 stroke-[3]" /> DENIED ✕
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> PASSED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {testScenario === 'UNAUTHORIZED_ROLE' ? 'ABAC Policy Violation: Role lacks EHR scope' : 'PURPOSE_OF_USE = TREATMENT'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Status Button */}
            <div className="mt-4 pt-2 border-t border-white/5 flex justify-center">
              <button 
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${preStatus.color}`}
              >
                {isPreBlocked ? <XCircle className="w-4 h-4 text-rose-300" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{preStatus.label}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ANIMATED CONDUIT 1: Pre-Guardrails ➔ LLM                                  */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center justify-center py-2 lg:py-0 px-1 shrink-0 z-20">
            {isPreBlocked ? (
              // BLOCKED RED 'X' ANIMATION DISPLAY
              <div className="flex flex-col items-center animate-pulse">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/60 text-[10px] font-mono font-black shadow-lg shadow-rose-500/30 mb-2">
                  <Ban className="w-3.5 h-3.5 text-rose-400" />
                  <span>PRE-GUARD BLOCKED ✕</span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center shadow-2xl shadow-rose-500/50 relative animate-bounce">
                  <X className="w-8 h-8 stroke-[3.5] text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,1)]" />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
                </div>
                <span className="text-[9px] font-mono text-rose-400 font-bold mt-1">Stopped Before LLM</span>
              </div>
            ) : (
              // NORMAL ANIMATED STREAMING ARROW CONDUIT
              <>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold mb-1.5 shadow">
                  <span>PROMPT STREAM</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>

                <div className="hidden lg:flex items-center gap-0">
                  <div className="w-14 h-2.5 bg-slate-900 border border-cyan-500/40 rounded-full relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full shadow-lg shadow-cyan-400/80 animate-flow-stream" />
                  </div>
                  <div className="flex items-center -ml-2 text-cyan-400 animate-pulse">
                    <ChevronRight className="w-6 h-6 stroke-[3] drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                    <ChevronRight className="w-6 h-6 stroke-[3] -ml-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  </div>
                </div>

                <div className="flex lg:hidden flex-col items-center text-cyan-400 animate-pulse">
                  <ChevronDown className="w-6 h-6 stroke-[3]" />
                </div>
              </>
            )}
          </div>

          {/* ========================================================================= */}
          {/* BOX 2: LLM NODE                                                            */}
          {/* ========================================================================= */}
          <div className={`w-full lg:w-1/4 bg-slate-900/90 border rounded-3xl p-5 shadow-2xl flex flex-col items-center justify-between text-center relative z-10 transition-all min-h-[320px] ${
            isPreBlocked ? 'border-slate-800 opacity-60' : 'border-blue-500/50 ring-2 ring-blue-500/20 hover:border-blue-400'
          }`}>
            <div>
              <div className="text-xs font-extrabold text-blue-400 mb-1 uppercase tracking-wider font-mono">
                LLM NODE ({activeModelObj.tier.split(' ')[0]})
              </div>

              {/* Glowing Neural Brain Icon */}
              <div className={`w-20 h-20 mx-auto my-3 rounded-full border flex items-center justify-center shadow-lg relative group ${
                isPreBlocked ? 'bg-slate-950 border-slate-800 text-slate-600' : 'bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-indigo-500/30 border-blue-400/40 shadow-blue-500/20'
              }`}>
                <Brain className={`w-10 h-10 ${isPreBlocked ? 'text-slate-600' : 'text-cyan-300 animate-pulse'}`} />
                {!isPreBlocked && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />}
              </div>

              <div className="text-sm font-extrabold text-white font-mono mt-1">
                {activeModelObj.displayTitle}
              </div>
              <div className="text-[10px] font-mono text-cyan-300 font-bold">
                {activeModelObj.exactModelVersion}
              </div>
            </div>

            <div className="mt-4 text-[10px] font-mono text-slate-400 space-y-1 w-full bg-slate-950/60 p-2 rounded-xl border border-white/5">
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className="text-white">{activeModelObj.latencyMs}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={isPreBlocked ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {isPreBlocked ? 'Bypassed (0 Tokens)' : 'Executed'}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ANIMATED CONDUIT 2: LLM ➔ Post-Guardrails                                 */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center justify-center py-2 lg:py-0 px-1 shrink-0 z-20">
            {isPreBlocked ? (
              <div className="flex flex-col items-center opacity-40">
                <div className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-mono">
                  NOT REACHED
                </div>
              </div>
            ) : isPostBlocked ? (
              // BLOCKED RED 'X' MARK BETWEEN LLM AND POST-GUARDRAIL
              <div className="flex flex-col items-center animate-pulse">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/60 text-[10px] font-mono font-black shadow-lg shadow-rose-500/30 mb-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  <span>POST-GUARD BLOCKED ✕</span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center shadow-2xl shadow-rose-500/50 relative animate-bounce">
                  <X className="w-8 h-8 stroke-[3.5] text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,1)]" />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
                </div>
                <span className="text-[9px] font-mono text-rose-400 font-bold mt-1">Output Quarantined</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold mb-1.5 shadow">
                  <span>RAW RESPONSE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="hidden lg:flex items-center gap-0">
                  <div className="w-14 h-2.5 bg-slate-900 border border-emerald-500/40 rounded-full relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/80 animate-flow-stream" />
                  </div>
                  <div className="flex items-center -ml-2 text-emerald-400 animate-pulse">
                    <ChevronRight className="w-6 h-6 stroke-[3] drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    <ChevronRight className="w-6 h-6 stroke-[3] -ml-4 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
                  </div>
                </div>

                <div className="flex lg:hidden flex-col items-center text-emerald-400 animate-pulse">
                  <ChevronDown className="w-6 h-6 stroke-[3]" />
                </div>
              </>
            )}
          </div>

          {/* ========================================================================= */}
          {/* BOX 3: POST-GUARDRAILS (Crispy & Detailed Info)                           */}
          {/* ========================================================================= */}
          <div className={`w-full lg:w-1/4 bg-slate-900/90 border rounded-3xl p-5 shadow-xl flex flex-col justify-between relative z-10 transition-all min-h-[320px] ${
            isPostBlocked ? 'border-rose-500/80 shadow-rose-500/20' : isPreBlocked ? 'border-slate-800 opacity-60' : 'border-slate-700/60 hover:border-emerald-500/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Post-Guardrails</span>
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  OUTPUT GATE
                </span>
              </div>

              {/* Crispy Detailed Post-Guardrail Items */}
              <div className="space-y-2 text-xs">
                {/* 1. Hallucination Check */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">1. Hallucination Check</span>
                    {testScenario === 'HALLUCINATION' ? (
                      <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/60 font-black text-[9px] flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-400 stroke-[3]" /> BLOCKED ✕
                      </span>
                    ) : isPreBlocked ? (
                      <span className="text-[9px] font-mono text-slate-500">BYPASSED</span>
                    ) : (
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> PASSED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {testScenario === 'HALLUCINATION' ? 'Low factuality score: 0.62 < 0.95 Threshold' : isPreBlocked ? 'Not executed' : 'RRF Factuality Score 0.984 >= 0.95'}
                  </p>
                </div>

                {/* 2. Grounding Check */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">2. Grounding Check</span>
                    {testScenario === 'HALLUCINATION' ? (
                      <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/60 font-black text-[9px] flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-400 stroke-[3]" /> FAILED ✕
                      </span>
                    ) : isPreBlocked ? (
                      <span className="text-[9px] font-mono text-slate-500">BYPASSED</span>
                    ) : (
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> PASSED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {testScenario === 'HALLUCINATION' ? 'Ungrounded clinical claims detected' : isPreBlocked ? 'Not executed' : 'Citations matched to FHIR guideline chunks'}
                  </p>
                </div>

                {/* 3. Citation Check */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">3. Citation Check</span>
                    {testScenario === 'UNREGISTERED_CITATION' ? (
                      <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/60 font-black text-[9px] flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-400 stroke-[3]" /> MISSING ✕
                      </span>
                    ) : isPreBlocked ? (
                      <span className="text-[9px] font-mono text-slate-500">BYPASSED</span>
                    ) : (
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> PASSED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {testScenario === 'UNREGISTERED_CITATION' ? 'Missing mandatory FHIR chunk ID citation' : isPreBlocked ? 'Not executed' : 'Mandatory chunk ID references verified'}
                  </p>
                </div>

                {/* 4. Safety Check */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">4. Safety Check</span>
                    {isPreBlocked ? (
                      <span className="text-[9px] font-mono text-slate-500">BYPASSED</span>
                    ) : (
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> PASSED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isPreBlocked ? 'Not executed' : 'Non-autonomous disclaimer appended'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Status Button */}
            <div className="mt-4 pt-2 border-t border-white/5 flex justify-center">
              <button 
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${postStatus.color}`}
              >
                {isPostBlocked ? <XCircle className="w-4 h-4 text-rose-300" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{postStatus.label}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ANIMATED CONDUIT 3: Post-Guardrails ➔ Response                            */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center justify-center py-2 lg:py-0 px-1 shrink-0 z-20">
            {isBlocked ? (
              <div className="flex flex-col items-center opacity-40">
                <div className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-mono">
                  SUPPRESSED
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold mb-1.5 shadow">
                  <span>VERIFIED OUTPUT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>

                <div className="hidden lg:flex items-center gap-0">
                  <div className="w-14 h-2.5 bg-slate-900 border border-cyan-500/40 rounded-full relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-400/80 animate-flow-stream" />
                  </div>
                  <div className="flex items-center -ml-2 text-cyan-400 animate-pulse">
                    <ChevronRight className="w-6 h-6 stroke-[3] drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                    <ChevronRight className="w-6 h-6 stroke-[3] -ml-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
                  </div>
                </div>

                <div className="flex lg:hidden flex-col items-center text-cyan-400 animate-pulse">
                  <ChevronDown className="w-6 h-6 stroke-[3]" />
                </div>
              </>
            )}
          </div>

          {/* ========================================================================= */}
          {/* BOX 4: RESPONSE / OUTPUT CARD                                             */}
          {/* ========================================================================= */}
          <div className={`w-full lg:w-1/4 bg-slate-900/90 border rounded-3xl p-5 shadow-xl flex flex-col items-center justify-between text-center relative z-10 transition-all min-h-[320px] ${
            isBlocked ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-700/60 hover:border-cyan-500/50'
          }`}>
            <div>
              <h3 className="text-sm font-extrabold text-white mb-3">
                Response Output
              </h3>

              {/* Shield Icon */}
              <div className={`w-20 h-20 mx-auto my-2 rounded-2xl border flex items-center justify-center shadow-lg ${
                isBlocked
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-rose-500/30 animate-pulse'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/20'
              }`}>
                {isBlocked ? (
                  <ShieldAlert className="w-10 h-10 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                )}
              </div>

              <div className="text-xs font-bold text-white mt-2">
                {isBlocked ? 'Request Blocked & Quarantined ✕' : 'Verified Clinical Output'}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal px-2">
                {isPreBlocked 
                  ? 'Input violation detected at Pre-Guardrail gate. Request terminated before LLM execution.' 
                  : isPostBlocked
                  ? 'Output safety/grounding check failed at Post-Guardrail gate. Response suppressed.'
                  : 'Passed all safety checks with citation verification and HIPAA de-identification.'}
              </p>
            </div>

            <div className="w-full mt-3">
              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                isBlocked
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}>
                {isBlocked ? (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>
                      {isPreBlocked ? 'Blocked (403 Forbidden)' : 'Quarantined (422 Unprocessable)'}
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3] text-emerald-400" />
                    <span>Verified & Enforced</span>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE TEST SUITE FOR PORTAL ADMIN (8 Comprehensive Scenarios)        */}
        {/* ========================================================================= */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Portal Admin Guardrail Test Suite & Live Trigger Simulations (8 Scenarios):
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Click any scenario button to trigger live request flow and inspect guardrail block marks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Normal Clinical Query */}
            <button
              onClick={() => handleRunSimulation('NORMAL')}
              disabled={isSimulating}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                testScenario === 'NORMAL'
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg ring-2 ring-blue-500/40'
                  : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-blue-400 flex items-center justify-between">
                <span>1. Normal Clinical Query</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">PASS ALL</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Standard RAG query. All pre & post guardrails pass 100%.</div>
            </button>

            {/* 2. Prompt Injection Attack */}
            <button
              onClick={() => handleRunSimulation('INJECTION')}
              disabled={isSimulating}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                testScenario === 'INJECTION'
                  ? 'bg-rose-600/20 border-rose-500 text-white shadow-lg ring-2 ring-rose-500/40'
                  : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-rose-400 flex items-center justify-between">
                <span>2. Prompt Injection Attack</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-mono font-bold">PRE BLOCK</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Adversarial payload. Triggers glowing RED 'X' block mark at Pre-Guard.</div>
            </button>

            {/* 3. Toxicity Attack */}
            <button
              onClick={() => handleRunSimulation('TOXICITY')}
              disabled={isSimulating}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                testScenario === 'TOXICITY'
                  ? 'bg-rose-600/20 border-rose-500 text-white shadow-lg ring-2 ring-rose-500/40'
                  : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-rose-400 flex items-center justify-between">
                <span>3. Toxicity Attack</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-mono font-bold">PRE BLOCK</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Toxicity score 0.94. Neutralized before reaching LLM.</div>
            </button>

            {/* 4. Unauthorized ABAC Role */}
            <button
              onClick={() => handleRunSimulation('UNAUTHORIZED_ROLE')}
              disabled={isSimulating}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                testScenario === 'UNAUTHORIZED_ROLE'
                  ? 'bg-rose-600/20 border-rose-500 text-white shadow-lg ring-2 ring-rose-500/40'
                  : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-rose-400 flex items-center justify-between">
                <span>4. ABAC Policy Denial</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-mono font-bold">PRE BLOCK</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Non-clinical role scope access attempt denied at Policy check.</div>
            </button>

            {/* 5. PHI De-identification */}
            <button
              onClick={() => handleRunSimulation('PHI')}
              disabled={isSimulating}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                testScenario === 'PHI'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg ring-2 ring-purple-500/40'
                  : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-purple-400 flex items-center justify-between">
                <span>5. PHI De-identification</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 font-mono">DLP MASK</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Redacts patient SSN/MRN to cryptographic tokens before LLM.</div>
            </button>

            {/* 6. Grounding Check */}
            <button
              onClick={() => handleRunSimulation('GROUNDING')}
              disabled={isSimulating}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                testScenario === 'GROUNDING'
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/40'
                  : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                <span>6. Grounding Check</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-mono">RRF 0.98</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Verifies factuality score & citation chunk alignment.</div>
            </button>

            {/* 7. Hallucination Trigger */}
            <button
              onClick={() => handleRunSimulation('HALLUCINATION')}
              disabled={isSimulating}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                testScenario === 'HALLUCINATION'
                  ? 'bg-rose-600/20 border-rose-500 text-white shadow-lg ring-2 ring-rose-500/40'
                  : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-rose-400 flex items-center justify-between">
                <span>7. Hallucination Block</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-mono font-bold">POST BLOCK</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Low factuality score (0.62). Triggers RED 'X' at Post-Guard.</div>
            </button>

            {/* 8. Missing Citation Trigger */}
            <button
              onClick={() => handleRunSimulation('UNREGISTERED_CITATION')}
              disabled={isSimulating}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                testScenario === 'UNREGISTERED_CITATION'
                  ? 'bg-rose-600/20 border-rose-500 text-white shadow-lg ring-2 ring-rose-500/40'
                  : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-rose-400 flex items-center justify-between">
                <span>8. Missing Citation</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-mono font-bold">POST BLOCK</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Uncited claim. Quarantined at Post-Guard Citation Check.</div>
            </button>
          </div>
        </div>

      </div>

      {/* OPTIONAL TELEMETRY JSON INSPECTOR PANEL */}
      {showInspector && (
        <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 shadow-2xl font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <Terminal className="w-4 h-4" />
              <span>Live Guardrail Gateway Telemetry Payload (JSON)</span>
            </div>
            <button
              onClick={handleCopyJson}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedJson ? 'Copied!' : 'Copy Telemetry'}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-black/80 border border-white/5 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
            {JSON.stringify(telemetryPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
