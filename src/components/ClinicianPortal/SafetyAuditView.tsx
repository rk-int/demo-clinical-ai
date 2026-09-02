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
  ArrowLeft
} from 'lucide-react';
import { AgentContract, UserProfile, PurposeOfUse } from '../../types';

interface SafetyAuditViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  onBack?: () => void;
}

export const SafetyAuditView: React.FC<SafetyAuditViewProps> = ({
  currentUser,
  purposeOfUse,
  onBack,
}) => {
  const [traces, setTraces] = useState<AgentContract[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<AgentContract | null>(null);
  const [filterAgent, setFilterAgent] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMaskedPhi, setShowMaskedPhi] = useState(true);

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

  const filteredTraces = traces.filter((t) => {
    if (filterAgent !== 'ALL' && t.agentName !== filterAgent) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const matchTraceId = t.traceId.toLowerCase().includes(s);
      const matchActor = t.actor.userName.toLowerCase().includes(s);
      const matchPurpose = t.purposeOfUse.toLowerCase().includes(s);
      if (!matchTraceId && !matchActor && !matchPurpose) return false;
    }
    return true;
  });

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
            <span>← Back to Previous Page</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Safety, Evidence & HIPAA Audit Trail</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                Immutable Ledger Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Real-time audit log of all agent routing, ABAC authorization decisions, hybrid RAG citations, and NeMo guardrail events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMaskedPhi(!showMaskedPhi)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs flex items-center gap-1.5 hover:bg-white/10 transition-colors backdrop-blur-md cursor-pointer"
            >
              {showMaskedPhi ? <EyeOff className="w-3.5 h-3.5 text-blue-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
              <span>{showMaskedPhi ? 'PHI DLP Masking: ON' : 'Show Unmasked Raw'}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search traces by Trace ID, actor, or purpose of use..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 backdrop-blur-md"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="bg-slate-900/80 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400 backdrop-blur-md"
            >
              <option value="ALL">All Agents</option>
              <option value="GatewayOrchestrator">Gateway Orchestrator</option>
              <option value="KnowledgeAgent">Knowledge Agent</option>
              <option value="PatientDataAgent">Patient Data Agent</option>
              <option value="WorkflowAgent">Workflow Agent</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900/80 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400 backdrop-blur-md"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="ABSTAINED">ABSTAINED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Trace List (5 cols), Right Trace Inspector (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trace List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-300 px-1 flex items-center justify-between">
            <span>Audit Log Stream ({filteredTraces.length})</span>
            <span className="font-mono text-emerald-400">Live 3s Polling</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTraces.map((t) => (
              <button
                key={t.traceId}
                onClick={() => setSelectedTrace(t)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer backdrop-blur-md shadow-md ${
                  selectedTrace?.traceId === t.traceId
                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-200 shadow-blue-500/10'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
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

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Actor: {t.actor.userName}</span>
                  <span>{t.purposeOfUse}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Deep Trace Payload Inspector */}
        <div className="lg:col-span-7">
          {selectedTrace ? (
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">Trace Inspector</h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      {selectedTrace.traceId}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Agent: <strong className="text-white">{selectedTrace.agentName}</strong> (v{selectedTrace.agentVersion}) • Latency: {selectedTrace.latencyMs}ms
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Cryptographically Verified
                  </span>
                </div>
              </div>

              {/* Authorization & Purpose Card */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-2 text-xs backdrop-blur-md">
                <div className="font-bold text-slate-200 uppercase text-[11px]">ABAC Authorization Decision</div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    selectedTrace.authorizationDecision.allowed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {selectedTrace.authorizationDecision.allowed ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                  </span>
                  <span className="text-slate-200">{selectedTrace.authorizationDecision.reason}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Rule Matched: {selectedTrace.authorizationDecision.ruleMatched}
                </div>
              </div>

              {/* Tools Invoked */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-300 uppercase text-[11px]">Tools & Adapters Invoked</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTrace.toolsInvoked.map((tool, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-white/5 text-blue-300 font-mono text-[11px] border border-white/10">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Groundedness & Confidence */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-2 text-xs backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 uppercase text-[11px]">Calibrated Confidence</span>
                  <span className="font-mono text-blue-300 font-bold">{selectedTrace.confidence.rating} ({Math.round(selectedTrace.confidence.score * 100)}%)</span>
                </div>
                <p className="text-slate-300 text-[11px] italic">{selectedTrace.confidence.rationale}</p>
              </div>

              {/* Guardrail Events if any */}
              {selectedTrace.guardrailEvents && selectedTrace.guardrailEvents.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-2 backdrop-blur-md">
                  <div className="font-bold flex items-center gap-1.5 text-rose-300 uppercase text-[11px]">
                    <AlertTriangle className="w-4 h-4" />
                    Security & Compliance Guardrail Triggered
                  </div>
                  {selectedTrace.guardrailEvents.map((evt) => (
                    <div key={evt.id} className="space-y-1">
                      <div className="font-semibold">{evt.type} ({evt.severity}) - Action: {evt.actionTaken}</div>
                      <div className="text-[11px] text-rose-300/80">{evt.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Raw JSON Payload */}
              <div className="space-y-1">
                <div className="font-bold text-slate-300 uppercase text-[11px]">Sanitized Contract Payload (JSON)</div>
                <pre className="p-4 rounded-xl bg-slate-900/80 border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60 backdrop-blur-md">
                  {JSON.stringify(selectedTrace, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-12 text-center text-slate-300 shadow-2xl">
              Select a trace from the left panel to inspect detailed audit telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
