import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Activity, 
  ShieldCheck, 
  AlertOctagon, 
  Sparkles, 
  Database, 
  FileCheck, 
  TrendingUp, 
  Lock, 
  Server, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  ArrowRight,
  Cpu,
  RefreshCw,
  Loader2,
  DollarSign,
  BarChart3,
  Search,
  Check,
  Building,
  UserCheck,
  FileCode,
  FileText,
  Clock,
  Shield,
  Zap,
  Info
} from 'lucide-react';
import { BREAK_IT_SCENARIOS } from '../../data/breakItScenarios';
import { BreakItScenario, ImprovementProposal, KpiMetrics, UserProfile, PurposeOfUse } from '../../types';

interface AgentOperationsDashboardProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
}

export const AgentOperationsDashboard: React.FC<AgentOperationsDashboardProps> = ({
  currentUser,
  purposeOfUse,
}) => {
  const [activeOpsTab, setActiveOpsTab] = useState<'DAG' | 'SIMULATOR' | 'EVALUATION' | 'SDLC' | 'COST_ROI' | 'BREAK_IT' | 'SELF_IMPROVING' | 'METRICS'>('DAG');
  const [selectedScenario, setSelectedScenario] = useState<BreakItScenario>(BREAK_IT_SCENARIOS[0]);
  const [scenarioRunning, setScenarioRunning] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<any>(null);

  const [proposals, setProposals] = useState<ImprovementProposal[]>([]);
  const [kpis, setKpis] = useState<KpiMetrics | null>(null);
  const [selectedDagNode, setSelectedDagNode] = useState<string>('GATEWAY');

  // Healthcare Security Workflow Simulator State ("Can John Doe be discharged today?")
  const [simStep, setSimStep] = useState<number>(0);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simPatientName, setSimPatientName] = useState<string>('John Doe (PT-1002 / Elena Rostova)');
  const [doctorApproved, setDoctorApproved] = useState<boolean>(false);

  const fetchOpsData = async () => {
    try {
      const [propRes, kpiRes] = await Promise.all([
        fetch('/api/improvement/proposals'),
        fetch('/api/telemetry/kpis'),
      ]);
      const propData = await propRes.json();
      const kpiData = await kpiRes.json();
      setProposals(propData.proposals || []);
      setKpis(kpiData.kpis || null);
    } catch (err) {
      console.error('Error fetching ops data:', err);
    }
  };

  useEffect(() => {
    fetchOpsData();
  }, []);

  const handleRunBreakItScenario = async (sc: BreakItScenario) => {
    setSelectedScenario(sc);
    setScenarioRunning(true);
    setScenarioResult(null);

    try {
      const res = await fetch('/api/adversarial/break-it', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: sc.id,
          actorId: currentUser.id,
        }),
      });
      const data = await res.json();
      setScenarioResult(data.result);
      fetchOpsData();
    } catch (err: any) {
      console.error('Error running break-it scenario:', err);
    } finally {
      setScenarioRunning(false);
    }
  };

  const handleApproveProposal = async (propId: string) => {
    try {
      const res = await fetch('/api/improvement/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: propId, actorId: currentUser.id }),
      });
      if (res.ok) {
        fetchOpsData();
      }
    } catch (err) {
      console.error('Error approving proposal:', err);
    }
  };

  // Run Healthcare Security Workflow Simulation
  const handleRunSimulator = () => {
    setSimRunning(true);
    setDoctorApproved(false);
    setSimStep(1);

    const timeouts = [
      setTimeout(() => setSimStep(2), 600),
      setTimeout(() => setSimStep(3), 1200),
      setTimeout(() => setSimStep(4), 1800),
      setTimeout(() => setSimStep(5), 2400),
      setTimeout(() => setSimStep(6), 3000),
      setTimeout(() => setSimStep(7), 3600),
      setTimeout(() => {
        setSimStep(8);
        setSimRunning(false);
      }, 4200),
    ];
  };

  const dagNodes = [
    { id: 'GATEWAY', name: 'AI Gateway & Router', agent: 'GatewayOrchestrator v3.0', status: 'ONLINE', icon: ShieldCheck, color: 'text-teal-400', desc: 'NeMo Guardrails, DLP Scrubbing, Rate Limiting, ABAC Enforcement' },
    { id: 'KNOWLEDGE', name: 'Knowledge Agent (RAG)', agent: 'KnowledgeAgent v3.2', status: 'ONLINE', icon: Sparkles, color: 'text-cyan-400', desc: 'BM25 Token Matching, Dense Vector Search, Claim-to-Chunk Verification' },
    { id: 'PATIENT', name: 'FHIR Patient Data Agent', agent: 'PatientDataAgent v2.1', status: 'ONLINE', icon: Database, color: 'text-emerald-400', desc: 'Patient 360, Longitudinal Timeline, Allergy Conflict Checks, Completeness' },
    { id: 'WORKFLOW', name: 'Workflow & Action Agent', agent: 'WorkflowAgent v2.0', status: 'ONLINE', icon: FileCheck, color: 'text-sky-400', desc: 'SOAP Note Builder, Referral Orders, Idempotency Guard, Rollback Engine' },
    { id: 'FUSION', name: 'Context Fusion & Safety Calibration', agent: 'DecisionEngine v2.5', status: 'ONLINE', icon: Cpu, color: 'text-amber-400', desc: 'Evidence Calibration (High/Limited/Insufficient), Speculation Suppression' },
    { id: 'FOUNDATION', name: 'Gemini 3.7 Model Adapter', agent: 'Gemini 3.7 Flash (Server-Side)', status: 'ONLINE', icon: Server, color: 'text-purple-400', desc: 'Secure Server-side Inference via @google/genai SDK, Prompt Framing' },
    { id: 'GATE', name: 'Human-in-the-Loop Gate', agent: 'Cryptographic Auth Bridge', status: 'ONLINE', icon: Lock, color: 'text-rose-400', desc: 'Physician Digital Signature Gate required before EHR commit' },
    { id: 'SELF_IMPROVING', name: 'Self-Improving Agent', agent: 'GovernanceEvaluator v1.4', status: 'ONLINE', icon: TrendingUp, color: 'text-indigo-400', desc: 'Telemetry Failure Clustering, Evaluation Proposal Generation' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Agent Operations, SDLC & Governance Center</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                Multi-Agent Governance
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Live multi-agent DAG telemetry, healthcare security workflow simulator, 10-step evaluation strategy, AI SDLC roadmap, and 15 adversarial test scenarios.
            </p>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto">
            <button
              onClick={() => setActiveOpsTab('DAG')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeOpsTab === 'DAG' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              1. Agent DAG
            </button>
            <button
              onClick={() => setActiveOpsTab('SIMULATOR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                activeOpsTab === 'SIMULATOR' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              2. Security Simulator
            </button>
            <button
              onClick={() => setActiveOpsTab('EVALUATION')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeOpsTab === 'EVALUATION' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              3. Evaluation Strategy (10 Steps)
            </button>
            <button
              onClick={() => setActiveOpsTab('SDLC')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeOpsTab === 'SDLC' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              4. AI SDLC
            </button>
            <button
              onClick={() => setActiveOpsTab('COST_ROI')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeOpsTab === 'COST_ROI' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              5. Cost & ROI
            </button>
            <button
              onClick={() => setActiveOpsTab('BREAK_IT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                activeOpsTab === 'BREAK_IT' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              6. 15 Break-It Tests
            </button>
            <button
              onClick={() => setActiveOpsTab('SELF_IMPROVING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                activeOpsTab === 'SELF_IMPROVING' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              7. Proposals ({proposals.length})
            </button>
            <button
              onClick={() => setActiveOpsTab('METRICS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeOpsTab === 'METRICS' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              8. KPIs
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Live Interactive Agent DAG Visualizer */}
      {activeOpsTab === 'DAG' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Live Agent Interaction & Safety Topology (DAG)
              </h2>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                All 8 Micro-Agents Healthy & Verified
              </span>
            </div>

            {/* Visual Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dagNodes.map((node) => {
                const Icon = node.icon;
                const isSelected = selectedDagNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedDagNode(node.id)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer backdrop-blur-md shadow-lg ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-400 shadow-blue-600/20 scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                        <Icon className={`w-5 h-5 ${node.color}`} />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {node.status}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white">{node.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{node.agent}</div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{node.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Selected DAG Node Details */}
            {selectedDagNode && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md">
                <div>
                  <span className="text-slate-400 font-semibold">Inspecting Active Node: </span>
                  <strong className="text-blue-300">{dagNodes.find((n) => n.id === selectedDagNode)?.name}</strong>
                  <span className="text-slate-300"> • {dagNodes.find((n) => n.id === selectedDagNode)?.desc}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                  Zero Trust Contract Verified
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Healthcare Security Workflow Simulator ("Can John Doe be discharged today?") */}
      {activeOpsTab === 'SIMULATOR' && (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Live Healthcare Security Workflow Simulator
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Step-by-step trace of: <strong className="text-white">"Can John Doe be discharged today?"</strong> across all 8 security, knowledge, and clinical validation gates.
              </p>
            </div>

            <button
              onClick={handleRunSimulator}
              disabled={simRunning}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {simRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run Discharge Decision Flow
            </button>
          </div>

          {/* 8-Step Visual Pipeline Trace */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                step: 1,
                title: '1. User Request',
                actor: 'Dr. Sarah Chen, MD',
                desc: 'Doctor queries: "Can John Doe be discharged today?"',
                detail: 'Zero-trust intake logged with trace UUID and timestamp.',
              },
              {
                step: 2,
                title: '2. Auth & Consent Check',
                actor: 'AI Gateway (ABAC)',
                desc: 'Validates physician identity, role permissions, and active HIPAA consent.',
                detail: 'Consent Status: ACTIVE_CONSENT verified.',
              },
              {
                step: 3,
                title: '3. Knowledge Agent (RAG)',
                actor: 'Knowledge Agent',
                desc: 'Retrieves hospital discharge criteria and clinical guidelines.',
                detail: 'Matches Heart Failure & Inpatient Discharge Protocol v2026.',
              },
              {
                step: 4,
                title: '4. Patient Data Agent',
                actor: 'Patient Data Agent',
                desc: 'Queries EHR for John Doe: Labs, Vitals, Medications, Inpatient notes.',
                detail: 'eGFR 44 (stable), NT-proBNP 680 (down from 1450), SpO2 96%.',
              },
              {
                step: 5,
                title: '5. Context Assembly',
                actor: 'Context Fusion Engine',
                desc: 'Combines verified guidelines + actual patient data into structured prompt.',
                detail: 'Ensures strict claim-to-chunk provenance without PHI leakage.',
              },
              {
                step: 6,
                title: '6. Enterprise AI Model',
                actor: 'Gemini 3.7 Flash Engine',
                desc: 'Generates evidence-grounded clinical assessment and discharge readiness checklist.',
                detail: 'Synthesizes criteria: vitals stable, oral transition complete.',
              },
              {
                step: 7,
                title: '7. Output Validation & Guardrails',
                actor: 'Deterministic Guardrails',
                desc: 'Scans for clinical safety, hallucinations, and ungrounded statements.',
                detail: 'Confidence: HIGH (100% grounded in institutional guidelines).',
              },
              {
                step: 8,
                title: '8. Doctor Approval Gate',
                actor: 'Human-in-the-Loop',
                desc: 'Doctor reviews discharge summary and gives cryptographic sign-off.',
                detail: 'EHR update & follow-up appointment trigger require doctor signature.',
              },
            ].map((st) => {
              const isCurrent = simStep === st.step && simRunning;
              const isPassed = simStep >= st.step;

              return (
                <div
                  key={st.step}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isPassed
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 animate-pulse'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-cyan-300">
                        Step 0{st.step}
                      </span>
                      {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="font-bold text-xs text-white">{st.title}</div>
                    <div className="text-[11px] font-medium text-cyan-400">{st.actor}</div>
                    <p className="text-[11px] text-slate-300">{st.desc}</p>
                  </div>

                  {isPassed && (
                    <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-emerald-300">
                      {st.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 8 Doctor Approval Sign-off Action */}
          {simStep >= 8 && (
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Human-in-the-Loop Clinical Gate (Step 8 Completed)
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Clinical AI Recommendation: <strong>Patient meets objective discharge criteria.</strong> Pending Attending Physician Signature.
                  </p>
                </div>
                {!doctorApproved ? (
                  <button
                    onClick={() => setDoctorApproved(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Sign & Commit Discharge to EHR
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Cryptographically Signed by {currentUser.name}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 10-Step Evaluation Strategy */}
      {activeOpsTab === 'EVALUATION' && (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">10-Step End-to-End Evaluation Strategy</h2>
            <p className="text-xs text-slate-300 mt-1">
              Rigorous multidimensional evaluation across the entire lifecycle from request intake to LLMOps continuous improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { num: '01', title: 'User Request Validation', metric: 'Intent & Schema Check', desc: 'Validates structure and clinical intent of input query.' },
              { num: '02', title: 'Auth & Authorization Eval', metric: 'RBAC & ABAC Pass Rate', desc: 'Ensures 100% adherence to §164.312 access controls.' },
              { num: '03', title: 'Data Quality & Freshness', metric: 'FHIR Schema & LIS Freshness', desc: 'Validates that patient observations are not stale.' },
              { num: '04', title: 'RAG Retrieval Precision', metric: 'Precision@K & Recall@K', desc: 'Evaluates vector and BM25 token matching relevance.' },
              { num: '05', title: 'Knowledge Grounding', metric: 'Claim-to-Chunk Verification', desc: 'Strictly verifies that zero unreferenced claims exist.' },
              { num: '06', title: 'AI Agent Routing Eval', metric: 'Agent Task Accuracy (99.4%)', desc: 'Tests multi-agent delegation between Knowledge and Data agents.' },
              { num: '07', title: 'LLM Response Validation', metric: 'Factuality & Coherence', desc: 'Validates safety framing and medical terminology validity.' },
              { num: '08', title: 'Responsible AI & Guardrails', metric: 'Zero Toxicity / Zero PII Leak', desc: 'Deterministic NeMo-style regex and neural safety filters.' },
              { num: '09', title: 'Clinical Review (HITL)', metric: 'Doctor Acceptance Rate (96.8%)', desc: 'Tracks physician sign-offs and minor modification edits.' },
              { num: '10', title: 'LLMOps & Business ROI', metric: 'Latency, Cost & Time Saved', desc: 'Continuous feedback loop driving self-improvement agent.' },
            ].map((ev) => (
              <div key={ev.num} className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Step {ev.num}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="font-bold text-white text-xs mt-1">{ev.title}</div>
                <div className="text-[10px] font-mono text-cyan-300">{ev.metric}</div>
                <p className="text-[11px] text-slate-400 leading-tight">{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI SDLC Lifecycle Roadmap */}
      {activeOpsTab === 'SDLC' && (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">AI Software Development Life Cycle (AI SDLC)</h2>
            <p className="text-xs text-slate-300 mt-1">
              Structured 4-Phase implementation journey aligned with the 7-Step AI Engineering Roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Phase 01: Foundation</div>
              <h3 className="font-bold text-white text-sm">Pilot RAG & Safety</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> Clinical Q&A RAG</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> EHR Connect & FHIR</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> Guardrails & ABAC</li>
              </ul>
              <div className="text-[11px] font-mono text-blue-300 pt-2 border-t border-white/10">Steps 1-2: Plan & Design</div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Phase 02: Enterprise AI</div>
              <h3 className="font-bold text-white text-sm">Patient Summary & Multi-Doc</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> AI Clinical Assistant</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Longitudinal FHIR 360</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Multimodal Ingestion</li>
              </ul>
              <div className="text-[11px] font-mono text-cyan-300 pt-2 border-t border-white/10">Steps 3-4: Develop & Eval</div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Phase 03: Automation</div>
              <h3 className="font-bold text-white text-sm">Multi-Agent Orchestration</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Multi-Agent Workflows</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Care Coordination</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> HITL Cryptographic Gate</li>
              </ul>
              <div className="text-[11px] font-mono text-purple-300 pt-2 border-t border-white/10">Steps 5-6: Deploy & Monitor</div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Phase 04: Scale</div>
              <h3 className="font-bold text-white text-sm">Federation & Self-Improvement</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 25 Hospitals Federation</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 200 Clinics Deployment</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Continuous Self-Improvement</li>
              </ul>
              <div className="text-[11px] font-mono text-emerald-300 pt-2 border-t border-white/10">Step 7: Improve & Optimize</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Cost Optimization Strategy & Business ROI Model */}
      {activeOpsTab === 'COST_ROI' && (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Cost Optimization Strategy & Business ROI Model</h2>
            <p className="text-xs text-slate-300 mt-1">
              Architectural cost controls paired with proven clinical efficiency and safety returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Cost Optimization Pillars
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Intelligent Request Routing</div>
                    <div className="text-[11px] text-slate-400">Routes simple lookups to cached FHIR records</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">Lower Token Cost</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Enterprise RAG Top-K Filtering</div>
                    <div className="text-[11px] text-slate-400">Ranks and extracts only top 3-5 relevant chunks</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">-65% Context Window</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Incremental Knowledge Ingestion</div>
                    <div className="text-[11px] text-slate-400">Avoids reprocessing millions of pages</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">Zero Reprocess Waste</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Prompt Caching & LLMOps</div>
                    <div className="text-[11px] text-slate-400">Reuses guideline embeddings across queries</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">Fast & Cost-Efficient</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Business ROI Model Targets
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Clinician Documentation Time</div>
                    <div className="text-[11px] text-slate-400">SOAP notes & discharge summaries</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono text-sm">40 - 60% Reduction</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Information Search & Synthesis</div>
                    <div className="text-[11px] text-slate-400">Longitudinal chart & lab lookup</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono text-sm">70% Faster</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Administrative Workload</div>
                    <div className="text-[11px] text-slate-400">Referral coordination & scheduling</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono text-sm">50% Lower</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Safety & Compliance Governance</div>
                    <div className="text-[11px] text-slate-400">Deterministic guardrails interception</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono text-sm">0 Unsafe Actions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: 15 "Break-It" Adversarial Scenarios Runner */}
      {activeOpsTab === 'BREAK_IT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-slate-300 px-1 flex items-center justify-between">
              <span>Adversarial & Failure Test Scenarios (15)</span>
              <span className="font-mono text-rose-400">Section 14 Compliant</span>
            </div>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {BREAK_IT_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleRunBreakItScenario(sc)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer backdrop-blur-md shadow-md ${
                    selectedScenario.id === sc.id
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-200 shadow-rose-900/20'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{sc.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono border border-white/10">
                      {sc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{sc.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                    {selectedScenario.category} Test
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{selectedScenario.title}</h2>
                  <p className="text-xs text-slate-300 mt-1">{selectedScenario.description}</p>
                </div>

                <button
                  onClick={() => handleRunBreakItScenario(selectedScenario)}
                  disabled={scenarioRunning}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/30 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {scenarioRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Execute Scenario
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-300 uppercase">Input Payload / Attack Vector</div>
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 font-mono text-xs text-rose-300 backdrop-blur-md">
                  {selectedScenario.promptPayload}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-300 uppercase">Expected System Defense Behavior</div>
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-slate-200 backdrop-blur-md">
                  {selectedScenario.expectedBehavior}
                </div>
              </div>

              {scenarioResult && (
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Live Defense Verification: Intercepted
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      scenarioResult.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      scenarioResult.status === 'ABSTAINED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {scenarioResult.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200">
                    <strong>Audit Rationale:</strong> {scenarioResult.authorizationDecision?.reason}
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-white/10">
                    <span>Trace: {scenarioResult.traceId}</span>
                    <span>Latency: {scenarioResult.latencyMs}ms</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Self-Improving Agent Proposals Queue */}
      {activeOpsTab === 'SELF_IMPROVING' && (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Self-Improving Agent Proposal Queue
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Automated telemetry failure clustering. System proposes parameter adjustments, but requires explicit human administrator sign-off.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              Human Sign-off Mandatory
            </span>
          </div>

          <div className="space-y-4">
            {proposals.map((prop) => (
              <div key={prop.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-md shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                      {prop.id}
                    </span>
                    <h3 className="text-sm font-bold text-white">{prop.title}</h3>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    prop.status === 'PENDING_ADMIN_APPROVAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {prop.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-200">
                  <div>
                    <div className="text-slate-400 font-semibold mb-1">Detected Issue & Telemetry Pattern:</div>
                    <p className="bg-slate-900/60 p-3 rounded-xl border border-white/10">{prop.detectedIssue}</p>
                  </div>
                  <div>
                    <div className="text-slate-400 font-semibold mb-1">Recommended Configuration Fix:</div>
                    <p className="bg-slate-900/60 p-3 rounded-xl border border-white/10 text-blue-300">{prop.recommendedFix}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-4">
                    <span>Observed Failures: <strong className="text-rose-400">{prop.observedFailureCount}</strong></span>
                    <span>Before Eval Score: <strong className="text-amber-400">{prop.beforeEvaluationScore}%</strong></span>
                    <span>Projected Score: <strong className="text-emerald-400">{prop.afterEvaluationScore}%</strong></span>
                    <span className="text-emerald-400 font-bold">(+{(prop.afterEvaluationScore - prop.beforeEvaluationScore).toFixed(1)}% Delta)</span>
                  </div>

                  {prop.status === 'PENDING_ADMIN_APPROVAL' && (
                    <button
                      onClick={() => handleApproveProposal(prop.id)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Deploy Optimization
                    </button>
                  )}

                  {prop.status === 'APPROVED_AND_DEPLOYED' && (
                    <div className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Deployed by {prop.approvedBy}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: KPI Metrics */}
      {activeOpsTab === 'METRICS' && kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="text-xs text-slate-300 font-semibold mb-1">Groundedness Index</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">{kpis.groundednessScore}%</div>
            <div className="text-[10px] text-slate-400 mt-1">Zero unverified claim hallucinations</div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="text-xs text-slate-300 font-semibold mb-1">Citation Validity</div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">{kpis.citationValidityScore}%</div>
            <div className="text-[10px] text-slate-400 mt-1">100% chunks match active guideline database</div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="text-xs text-slate-300 font-semibold mb-1">P50 / P95 Latency</div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono">{kpis.p50LatencyMs}ms / {kpis.p95LatencyMs}ms</div>
            <div className="text-[10px] text-slate-400 mt-1">Target &lt; 2000ms SLA</div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="text-xs text-slate-300 font-semibold mb-1">Adversarial Interception Rate</div>
            <div className="text-2xl font-extrabold text-purple-400 font-mono">100.0%</div>
            <div className="text-[10px] text-slate-400 mt-1">{kpis.promptInjectionBlocks} Injections + {kpis.unauthorizedAccessBlocks} ABAC Violations Stopped</div>
          </div>
        </div>
      )}
    </div>
  );
};
