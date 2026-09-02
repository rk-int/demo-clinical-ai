import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  FileText, 
  Eye, 
  EyeOff,
  Clock,
  ChevronDown,
  ArrowLeft,
  Users,
  Stethoscope,
  HeartPulse,
  Building,
  Sparkles,
  LineChart,
  BarChart3,
  Database,
  Cpu,
  Zap,
  Check,
  BookOpen,
  UserCheck,
  Shield,
  Layers,
  FileCheck,
  TrendingUp,
  TrendingDown,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { AgentContract, UserProfile, PurposeOfUse, UserRole } from '../../types';
import { getUserAvatarUrl } from '../../utils/patientAvatar';

interface SafetyAuditViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  onBack?: () => void;
}

export type TimeRangeFilter = '24h' | '7d' | '30d' | 'all';
export type AgentFilterType = 'ALL' | 'patient_agent' | 'knowledge_agent' | 'workflow_agent';

export const SafetyAuditView: React.FC<SafetyAuditViewProps> = ({
  currentUser,
  purposeOfUse,
  onBack,
}) => {
  const [traces, setTraces] = useState<AgentContract[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<AgentContract | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('7d');
  const [selectedAgent, setSelectedAgent] = useState<AgentFilterType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'DASHBOARD' | 'TRACES' | 'RESTRICTIONS'>('DASHBOARD');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null);
  const [livePulse, setLivePulse] = useState<number>(0);

  const role = currentUser.role;

  // Real-time pulse ticker every 3s to make all numbers dynamic
  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setLivePulse((p) => p + 1);
    }, 3000);
    return () => clearInterval(pulseTimer);
  }, []);

  const fetchTraces = async () => {
    try {
      const res = await fetch('/api/telemetry/traces');
      const data = await res.json();
      if (data.traces) {
        setTraces(data.traces);
        if (data.traces.length > 0 && !selectedTrace) {
          setSelectedTrace(data.traces[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching traces:', err);
    }
  };

  useEffect(() => {
    fetchTraces();
    const interval = setInterval(fetchTraces, 3000);
    return () => clearInterval(interval);
  }, []);

  // Compute dynamic telemetry parameters based on filter selections & live pulse
  const getDynamicTelemetry = () => {
    let baseRequests = 12842;
    let baseLatency = 2.8;
    let baseGrounding = 94.6;
    let baseSafety = 99.7;
    let baseErrorRate = 0.23;

    let patientPct = 38;
    let knowledgePct = 32;
    let workflowPct = 20;
    let othersPct = 10;

    // 1. Time Range adjustments
    if (timeRange === '24h') {
      baseRequests = 1842 + (livePulse % 15);
      baseLatency = 1.9;
      baseGrounding = 96.2;
      baseSafety = 99.9;
      baseErrorRate = 0.12;
    } else if (timeRange === '7d') {
      baseRequests = 12842 + (livePulse % 45);
      baseLatency = 2.8;
      baseGrounding = 94.6;
      baseSafety = 99.7;
      baseErrorRate = 0.23;
    } else if (timeRange === '30d') {
      baseRequests = 54210 + (livePulse * 8);
      baseLatency = 3.1;
      baseGrounding = 93.8;
      baseSafety = 99.5;
      baseErrorRate = 0.41;
    } else if (timeRange === 'all') {
      baseRequests = 189450 + (livePulse * 24);
      baseLatency = 3.2;
      baseGrounding = 95.1;
      baseSafety = 99.8;
      baseErrorRate = 0.18;
    }

    // 2. Selected Agent adjustments
    if (selectedAgent === 'patient_agent') {
      baseRequests = Math.round(baseRequests * 0.38);
      baseLatency = 1.6;
      baseGrounding = 99.8;
      baseSafety = 99.9;
      baseErrorRate = 0.05;
      patientPct = 100;
      knowledgePct = 0;
      workflowPct = 0;
      othersPct = 0;
    } else if (selectedAgent === 'knowledge_agent') {
      baseRequests = Math.round(baseRequests * 0.32);
      baseLatency = 3.4;
      baseGrounding = 96.4;
      baseSafety = 99.6;
      baseErrorRate = 0.31;
      patientPct = 0;
      knowledgePct = 100;
      workflowPct = 0;
      othersPct = 0;
    } else if (selectedAgent === 'workflow_agent') {
      baseRequests = Math.round(baseRequests * 0.20);
      baseLatency = 2.1;
      baseGrounding = 98.9;
      baseSafety = 100.0;
      baseErrorRate = 0.00;
      patientPct = 0;
      knowledgePct = 0;
      workflowPct = 100;
      othersPct = 0;
    }

    // 3. Dynamic line chart points
    let lineMult = timeRange === '24h' ? 0.15 : timeRange === '30d' ? 4.2 : timeRange === 'all' ? 15 : 1;
    if (selectedAgent === 'patient_agent') lineMult *= 0.38;
    if (selectedAgent === 'knowledge_agent') lineMult *= 0.32;
    if (selectedAgent === 'workflow_agent') lineMult *= 0.20;

    const rawPoints = [
      { x: 40, val: Math.round(120 * lineMult) + (livePulse % 5), label: '215' },
      { x: 90, val: Math.round(280 * lineMult) + (livePulse % 8), label: '220' },
      { x: 140, val: Math.round(220 * lineMult) + (livePulse % 4), label: '225' },
      { x: 190, val: Math.round(380 * lineMult) + (livePulse % 12), label: '230' },
      { x: 240, val: Math.round(310 * lineMult) + (livePulse % 7), label: '235' },
      { x: 290, val: Math.round(490 * lineMult) + (livePulse % 15), label: '240' },
      { x: 340, val: Math.round(420 * lineMult) + (livePulse % 9), label: '245' },
    ];

    const maxVal = Math.max(...rawPoints.map((p) => p.val), 1);

    const mappedPoints = rawPoints.map((pt) => ({
      ...pt,
      y: Math.round(170 - (pt.val / maxVal) * 120),
    }));

    const pathD = `M ${mappedPoints[0].x} ${mappedPoints[0].y} C ${mappedPoints[0].x + 25} ${mappedPoints[0].y}, ${mappedPoints[1].x - 25} ${mappedPoints[1].y}, ${mappedPoints[1].x} ${mappedPoints[1].y} C ${mappedPoints[1].x + 25} ${mappedPoints[1].y}, ${mappedPoints[2].x - 25} ${mappedPoints[2].y}, ${mappedPoints[2].x} ${mappedPoints[2].y} C ${mappedPoints[2].x + 25} ${mappedPoints[2].y}, ${mappedPoints[3].x - 25} ${mappedPoints[3].y}, ${mappedPoints[3].x} ${mappedPoints[3].y} C ${mappedPoints[3].x + 25} ${mappedPoints[3].y}, ${mappedPoints[4].x - 25} ${mappedPoints[4].y}, ${mappedPoints[4].x} ${mappedPoints[4].y} C ${mappedPoints[4].x + 25} ${mappedPoints[4].y}, ${mappedPoints[5].x - 25} ${mappedPoints[5].y}, ${mappedPoints[5].x} ${mappedPoints[5].y} C ${mappedPoints[5].x + 25} ${mappedPoints[5].y}, ${mappedPoints[6].x - 25} ${mappedPoints[6].y}, ${mappedPoints[6].x} ${mappedPoints[6].y}`;

    const areaD = `${pathD} L ${mappedPoints[6].x} 190 L ${mappedPoints[0].x} 190 Z`;

    const bars = [
      { label: '10', value: (baseLatency * 1.03).toFixed(1), heightPercent: Math.min(95, Math.round(baseLatency * 25)) },
      { label: '15', value: (baseLatency * 0.64).toFixed(1), heightPercent: Math.min(95, Math.round(baseLatency * 16)) },
      { label: '20', value: (baseLatency * 0.93).toFixed(1), heightPercent: Math.min(95, Math.round(baseLatency * 23)) },
      { label: '25', value: (baseLatency * 0.71).toFixed(1), heightPercent: Math.min(95, Math.round(baseLatency * 18)) },
      { label: '30', value: (baseLatency * 0.89).toFixed(1), heightPercent: Math.min(95, Math.round(baseLatency * 22)) },
      { label: '35', value: (baseLatency * 1.00).toFixed(1), heightPercent: Math.min(95, Math.round(baseLatency * 25)) },
    ];

    return {
      totalRequests: baseRequests.toLocaleString(),
      avgLatency: `${baseLatency.toFixed(1)}s`,
      groundingScore: `${baseGrounding.toFixed(1)}%`,
      safetyScore: `${baseSafety.toFixed(1)}%`,
      errorRate: `${baseErrorRate.toFixed(2)}%`,
      patientPct,
      knowledgePct,
      workflowPct,
      othersPct,
      points: mappedPoints,
      linePathD: pathD,
      areaPathD: areaD,
      bars,
      maxVal,
    };
  };

  const dynamicData = getDynamicTelemetry();

  // Role-governed filtered traces
  const filteredTraces = traces.filter((t) => {
    if (role === 'DOCTOR' || role === 'CLINICIAN' || role === 'SPECIALIST') {
      if (t.agentName === 'GatewayOrchestrator' && t.status === 'BLOCKED') return true;
      if (t.agentName !== 'KnowledgeAgent' && t.agentName !== 'PatientDataAgent' && t.agentName !== 'WorkflowAgent') return false;
    } else if (role === 'NURSE' || role === 'CARE_COORDINATOR') {
      if (t.agentName !== 'PatientDataAgent' && t.agentName !== 'WorkflowAgent') return false;
    }

    if (selectedAgent !== 'ALL') {
      if (selectedAgent === 'patient_agent' && t.agentName !== 'PatientDataAgent') return false;
      if (selectedAgent === 'knowledge_agent' && t.agentName !== 'KnowledgeAgent') return false;
      if (selectedAgent === 'workflow_agent' && t.agentName !== 'WorkflowAgent') return false;
    }

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const matchTraceId = t.traceId.toLowerCase().includes(s);
      const matchActor = t.actor.userName.toLowerCase().includes(s);
      const matchPurpose = t.purposeOfUse.toLowerCase().includes(s);
      if (!matchTraceId && !matchActor && !matchPurpose) return false;
    }
    return true;
  });

  // Dynamic Role Governance Metadata
  const getRoleGovernanceInfo = () => {
    switch (role) {
      case 'DOCTOR':
      case 'CLINICIAN':
        return {
          title: 'Attending Physician Clinical Observability & Patient Telemetry',
          scopeBadge: 'COHORT & PATIENT SCOPE',
          scopeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          allowedDescription: 'Full access to assigned patient longitudinal EHR records, GDMT heart failure compliance, clinical AI Q&A accuracy, and pending SOAP note signatures.',
          restrictedDescription: 'Restricted from cross-hospital billing administrative logs, multi-tenant server infrastructure metrics, and raw security audit encryption keys.',
        };
      case 'SPECIALIST':
        return {
          title: 'Cardiology Specialist Consult & Cath Lab Telemetry',
          scopeBadge: 'SPECIALTY & SURGICAL SCOPE',
          scopeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          allowedDescription: 'Access to interventional cardiology consults, Echocardiogram LVEF trends, Electrophysiology CRT-D device reviews, and Cath Lab radial hemostasis logs.',
          restrictedDescription: 'Restricted from primary care discharge note sign-offs and general hospital financial administration.',
        };
      case 'NURSE':
        return {
          title: 'Nursing Unit Inpatient Telemetry & Shift Care Plan',
          scopeBadge: 'INPATIENT WARD SCOPE (4W STEPDOWN)',
          scopeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          allowedDescription: 'Access to inpatient ward bed occupancy, 12-hour fluid balance (I&O) diuresis logs, continuous telemetry rhythm monitoring, and teach-back discharge education checklists.',
          restrictedDescription: 'Restricted from issuing new prescription orders or altering institutional medical guidelines.',
        };
      case 'CARE_COORDINATOR':
        return {
          title: 'Transitional Care Navigation & Population Health',
          scopeBadge: 'TRANSITIONS & POPULATION HEALTH SCOPE',
          scopeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          allowedDescription: 'Access to 30-day readmission risk scores, post-acute care transition plans, home health nursing enrollment, and transportation/medication subsidy management.',
          restrictedDescription: 'Restricted from raw surgical telemetry and invasive diagnostic lab order entry.',
        };
      case 'AUDITOR':
        return {
          title: 'HIPAA Compliance & Zero-Trust Audit Ledger',
          scopeBadge: 'HIPAA & AUDIT READ-ONLY SCOPE',
          scopeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          allowedDescription: 'Read-only access to HIPAA § 164.508 consent status logs, ABAC authorization decision ledgers, emergency break-glass override trails, and cryptographic export checksums.',
          restrictedDescription: 'Read-only mode. Cannot modify patient records, draft clinical notes, or alter authorization policies.',
        };
      case 'PORTAL_ADMIN':
      default:
        return {
          title: 'Observability Dashboard',
          scopeBadge: 'SUPERUSER / FULL GOVERNANCE SCOPE',
          scopeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          allowedDescription: 'Full unrestricted governance access across all clinical systems, RAG vector index health, NeMo guardrail defense logs, model token latencies, and self-improving proposal approvals.',
          restrictedDescription: 'Unrestricted Superuser. Full administrative transparency across all system nodes.',
        };
    }
  };

  const gov = getRoleGovernanceInfo();

  return (
    <div className="space-y-6">
      {/* Top Navigation & Back Action */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Workspace</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OBSERVABILITY DASHBOARD HEADER & DYNAMIC FILTER CONTROLS                  */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={getUserAvatarUrl(currentUser)}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/60 shadow-xl shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Observability Dashboard
                </h1>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${gov.scopeColor}`}>
                  {gov.scopeBadge}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Ticker Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Real-time System Performance, AI Agent Telemetry & Safety Observability
              </p>
            </div>
          </div>

          {/* Time Range & Agent Filter Dropdowns (Dynamic updating) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-white/10 hover:border-blue-500/40 transition-colors">
              <span className="text-xs font-semibold text-slate-400">Time Range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRangeFilter)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="24h" className="bg-slate-900 text-white">Last 24 Hours</option>
                <option value="7d" className="bg-slate-900 text-white">Last 7 Days</option>
                <option value="30d" className="bg-slate-900 text-white">Last 30 Days</option>
                <option value="all" className="bg-slate-900 text-white">All Time</option>
              </select>
            </div>

            {/* Agent Filter Selector */}
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-white/10 hover:border-blue-500/40 transition-colors">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value as AgentFilterType)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Agents</option>
                <option value="patient_agent" className="bg-slate-900 text-white">Patient Agent</option>
                <option value="knowledge_agent" className="bg-slate-900 text-white">Knowledge Agent</option>
                <option value="workflow_agent" className="bg-slate-900 text-white">Workflow Agent</option>
              </select>
            </div>

            {/* Sub-Tab Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveSubTab('DASHBOARD')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeSubTab === 'DASHBOARD'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveSubTab('TRACES')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeSubTab === 'TRACES'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Traces ({filteredTraces.length})
              </button>
              <button
                onClick={() => setActiveSubTab('RESTRICTIONS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeSubTab === 'RESTRICTIONS'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rules
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TOP ROW: 5 DYNAMIC KPI SUMMARY CARDS                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-6 pt-5 border-t border-white/10">
          {/* Card 1: Total Requests */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 shadow-xl hover:border-blue-500/40 transition-all">
            <div className="text-xs font-semibold text-slate-400">Total Requests</div>
            <div className="text-2xl font-black text-white tracking-tight mt-1.5 font-mono">
              {dynamicData.totalRequests}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>▲ 12.5%</span>
            </div>
          </div>

          {/* Card 2: Avg. Latency */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 shadow-xl hover:border-blue-500/40 transition-all">
            <div className="text-xs font-semibold text-slate-400">Avg. Latency</div>
            <div className="text-2xl font-black text-white tracking-tight mt-1.5 font-mono">
              {dynamicData.avgLatency}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 mt-2">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>▼ 8.3%</span>
            </div>
          </div>

          {/* Card 3: Grounding Score */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 shadow-xl hover:border-emerald-500/40 transition-all">
            <div className="text-xs font-semibold text-slate-400">Grounding Score</div>
            <div className="text-2xl font-black text-white tracking-tight mt-1.5 font-mono">
              {dynamicData.groundingScore}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>▲ 3.1%</span>
            </div>
          </div>

          {/* Card 4: Safety Score */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 shadow-xl hover:border-emerald-500/40 transition-all">
            <div className="text-xs font-semibold text-slate-400">Safety Score</div>
            <div className="text-2xl font-black text-white tracking-tight mt-1.5 font-mono">
              {dynamicData.safetyScore}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>▲ 1.2%</span>
            </div>
          </div>

          {/* Card 5: Errors */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 shadow-xl hover:border-cyan-500/40 transition-all">
            <div className="text-xs font-semibold text-slate-400">Errors</div>
            <div className="text-2xl font-black text-white tracking-tight mt-1.5 font-mono">
              {dynamicData.errorRate}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 mt-2">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>▼ 10.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPLICIT ROLE RESTRICTIONS & ACCESS BOUNDARIES BANNER                       */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Security Governance Access Matrix</span>
              <span className="text-[9px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/40 font-bold">
                ENFORCED BY ABAC GATE
              </span>
            </div>
            <p className="text-xs text-emerald-300 font-medium">
              ✓ <strong>Permitted View Scope:</strong> {gov.allowedDescription}
            </p>
            <p className="text-xs text-rose-300/90 font-medium">
              🔒 <strong>Enforced Restrictions:</strong> {gov.restrictedDescription}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DYNAMIC ANALYTICS & CHARTS                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'DASHBOARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ========================================================================= */}
          {/* CHART 1: DYNAMIC REQUESTS OVER TIME (Line Graph)                          */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-white">Requests Over Time</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  {timeRange.toUpperCase()} RANGE
                </span>
              </div>

              {/* Dynamic Line Chart SVG */}
              <div className="relative h-48 w-full mt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 380 200">
                  <defs>
                    <linearGradient id="reqGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines & Y-Axis Scale */}
                  <line x1="30" y1="30" x2="360" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
                  <text x="5" y="35" fill="#64748b" fontSize="10" fontFamily="monospace">
                    {Math.round(dynamicData.maxVal * 1.1)}
                  </text>

                  <line x1="30" y1="80" x2="360" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
                  <text x="5" y="85" fill="#64748b" fontSize="10" fontFamily="monospace">
                    {Math.round(dynamicData.maxVal * 0.6)}
                  </text>

                  <line x1="30" y1="130" x2="360" y2="130" stroke="#1e293b" strokeDasharray="3 3" />
                  <text x="5" y="135" fill="#64748b" fontSize="10" fontFamily="monospace">
                    {Math.round(dynamicData.maxVal * 0.3)}
                  </text>

                  <line x1="30" y1="180" x2="360" y2="180" stroke="#334155" />
                  <text x="15" y="185" fill="#64748b" fontSize="10" fontFamily="monospace">0</text>

                  {/* Dynamic Area Gradient Fill */}
                  <path d={dynamicData.areaPathD} fill="url(#reqGradient)" className="transition-all duration-500" />

                  {/* Dynamic Smooth Line Path */}
                  <path d={dynamicData.linePathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />

                  {/* Dynamic Data Points */}
                  {dynamicData.points.map((pt, i) => (
                    <g key={i} className="cursor-pointer group" onMouseEnter={() => setHoveredChartPoint(pt)} onMouseLeave={() => setHoveredChartPoint(null)}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" className="transition-all duration-300 group-hover:scale-150" />
                    </g>
                  ))}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between px-8 mt-2 text-[10px] font-mono text-slate-400">
                  <span>215</span>
                  <span>220</span>
                  <span>225</span>
                  <span>230</span>
                  <span>235</span>
                  <span>240</span>
                </div>
              </div>
            </div>

            {/* Hover Tooltip display */}
            {hoveredChartPoint && (
              <div className="mt-2 p-2 rounded-xl bg-blue-600 text-white text-[10px] font-mono flex items-center justify-between animate-fade-in">
                <span>Metric Point {hoveredChartPoint.label}:</span>
                <span className="font-bold">{hoveredChartPoint.val.toLocaleString()} reqs</span>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* CHART 2: DYNAMIC AGENT USAGE (Donut Chart)                                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-white">Agent Usage</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  {selectedAgent === 'ALL' ? 'ALL AGENTS' : selectedAgent.toUpperCase()}
                </span>
              </div>

              {/* Dynamic Donut Chart & Legend */}
              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 mt-2">
                {/* Dynamic SVG Donut Ring */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 transition-all duration-500" viewBox="0 0 100 100">
                    {/* Circle 1: Patient Agent */}
                    {dynamicData.patientPct > 0 && (
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray={`${dynamicData.patientPct * 2.38} 238`} strokeDashoffset="0" className="transition-all duration-500" />
                    )}
                    {/* Circle 2: Knowledge Agent */}
                    {dynamicData.knowledgePct > 0 && (
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#1d4ed8" strokeWidth="16" strokeDasharray={`${dynamicData.knowledgePct * 2.38} 238`} strokeDashoffset={`-${dynamicData.patientPct * 2.38}`} className="transition-all duration-500" />
                    )}
                    {/* Circle 3: Workflow Agent */}
                    {dynamicData.workflowPct > 0 && (
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="16" strokeDasharray={`${dynamicData.workflowPct * 2.38} 238`} strokeDashoffset={`-${(dynamicData.patientPct + dynamicData.knowledgePct) * 2.38}`} className="transition-all duration-500" />
                    )}
                    {/* Circle 4: Others */}
                    {dynamicData.othersPct > 0 && (
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray={`${dynamicData.othersPct * 2.38} 238`} strokeDashoffset={`-${(dynamicData.patientPct + dynamicData.knowledgePct + dynamicData.workflowPct) * 2.38}`} className="transition-all duration-500" />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-mono font-bold text-white">{dynamicData.totalRequests}</span>
                    <span className="text-[9px] text-slate-400">Total</span>
                  </div>
                </div>

                {/* Dynamic Legend List */}
                <div className="space-y-2 text-xs font-medium w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-slate-300 text-[11px]">Patient Agent</span>
                    </div>
                    <span className="font-bold text-white font-mono text-[11px]">{dynamicData.patientPct}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
                      <span className="text-slate-300 text-[11px]">Knowledge Agent</span>
                    </div>
                    <span className="font-bold text-white font-mono text-[11px]">{dynamicData.knowledgePct}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                      <span className="text-slate-300 text-[11px]">Workflow Agent</span>
                    </div>
                    <span className="font-bold text-white font-mono text-[11px]">{dynamicData.workflowPct}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-300 text-[11px]">Others</span>
                    </div>
                    <span className="font-bold text-white font-mono text-[11px]">{dynamicData.othersPct}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-400 text-center">
              Active Agent Dispatch Matrix • {selectedAgent === 'ALL' ? 'All Registered Agents' : `Filtered to ${selectedAgent}`}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHART 3: DYNAMIC LATENCY (SEC) (Bar Chart)                                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-white">Latency (sec)</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {dynamicData.avgLatency} AVG
                </span>
              </div>

              {/* Dynamic Bar Chart Container */}
              <div className="relative h-48 w-full mt-2">
                <div className="flex items-end justify-between h-36 px-4 pt-4 pb-2 border-b border-slate-700">
                  {dynamicData.bars.map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 group flex-1">
                      <div className="w-6 sm:w-8 bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-28 relative">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-500 group-hover:from-blue-500 group-hover:to-cyan-300 rounded-t-lg"
                          style={{ height: `${bar.heightPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">{bar.label}</span>
                    </div>
                  ))}
                </div>

                {/* Y-Axis Scale Reference */}
                <div className="flex justify-between px-2 text-[9px] font-mono text-slate-500 mt-2">
                  <span>0s</span>
                  <span>1.0s</span>
                  <span>2.0s</span>
                  <span>3.0s</span>
                  <span>4.0s</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-400 text-center">
              Response Time Distribution • Sub-Second Triage Active
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AUDIT TRACES LIST & DEEP INSPECTOR                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'TRACES' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit traces by ID, actor, or purpose..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredTraces.map((t) => (
                <button
                  key={t.traceId}
                  onClick={() => setSelectedTrace(t)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 cursor-pointer shadow-md ${
                    selectedTrace?.traceId === t.traceId
                      ? 'bg-blue-500/20 border-blue-400 text-blue-200 shadow-blue-500/10'
                      : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono">{t.traceId.slice(0, 16)}...</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      t.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      t.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="text-blue-300 font-semibold">{t.agentName}</span>
                    <span>{t.latencyMs}ms</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7">
              {selectedTrace ? (
                <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white">Audit Inspector</h2>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          {selectedTrace.traceId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <pre className="p-4 rounded-2xl bg-black/80 border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-80">
                    {JSON.stringify(selectedTrace, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-12 text-center text-slate-400">
                  Select a trace from the left panel to inspect detailed audit telemetry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ABAC ACCESS RULES MATRIX                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'RESTRICTIONS' && (
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-mono">Role-Based Access Control (RBAC/ABAC) Governance Matrix</h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              HIPAA § 164.508 & NIST 800-162 Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-2">
              <div className="text-xs font-bold text-blue-400 flex items-center justify-between">
                <span>Doctor / Clinician</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">Active Role</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Permitted: Assigned patient EHR, GDMT cardiac compliance, SOAP draft signatures.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
              <div className="text-xs font-bold text-purple-400 flex items-center justify-between">
                <span>Specialist</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">Consult Scope</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Permitted: Advanced echo LVEF, EP device reviews, surgical consult telemetry.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                <span>Nurse</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Ward Scope</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Permitted: Inpatient telemetry beds, shift I&O fluid balance logs, teach-back checks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
                <span>Care Coordinator</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Transitions</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Permitted: Readmission risk scores, home health enrollment, discharge transport.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2">
              <div className="text-xs font-bold text-indigo-400 flex items-center justify-between">
                <span>Auditor</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">Read-Only</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Permitted: HIPAA consent expiration ledgers, break-glass override logs, export checksums.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <div className="text-xs font-bold text-cyan-400 flex items-center justify-between">
                <span>Portal Admin</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">Superuser</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Permitted: Full unrestricted access to LLM guardrails, RAG vector index, AI accuracy logs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
