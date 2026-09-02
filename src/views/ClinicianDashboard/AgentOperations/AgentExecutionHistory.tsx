import React from 'react';
import { AgentContract } from '../../../types';
import { History, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const AgentExecutionHistory: React.FC<{ executionHistory: AgentContract[] }> = ({ executionHistory }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-200">Agent Contract Execution Log</h3>
      </div>
      <div className="space-y-2">
        {executionHistory.map((c) => (
          <div key={c.requestId} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="font-bold text-slate-200">{c.agentName} v{c.agentVersion}</div>
              <div className="text-[11px] text-slate-400 font-mono">Trace: {c.traceId} • Latency: {c.latencyMs}ms</div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              c.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
