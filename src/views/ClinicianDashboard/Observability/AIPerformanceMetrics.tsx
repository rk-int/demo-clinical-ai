import React from 'react';
import { Activity, Zap, Clock, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { KpiMetrics } from '../../../types';

export const AIPerformanceMetrics: React.FC<{ kpis: KpiMetrics }> = ({ kpis }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-200">AI Latency & Performance SLA</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">P50 Latency</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">{kpis.p50LatencyMs} ms</div>
        </div>
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">P95 Latency</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5">{kpis.p95LatencyMs} ms</div>
        </div>
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Safe Fallback</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">{kpis.safeFallbackRate}%</div>
        </div>
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Total Volume</div>
          <div className="text-lg font-bold text-purple-400 mt-0.5">{kpis.totalRequests} req</div>
        </div>
      </div>
    </div>
  );
};
