import React from 'react';
import { Database, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { KpiMetrics } from '../../../types';

export const RAGMetricsPanel: React.FC<{ kpis: KpiMetrics }> = ({ kpis }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-slate-200">Grounded RAG Quality & Triad Scores</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Groundedness</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">{kpis.groundednessScore}%</div>
        </div>
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Citation Validity</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">{kpis.citationValidityScore}%</div>
        </div>
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Context Relevance</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5">{kpis.contextRelevanceScore}%</div>
        </div>
      </div>
    </div>
  );
};
