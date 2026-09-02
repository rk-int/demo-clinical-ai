import React from 'react';
import { DollarSign, TrendingDown, Layers } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const CostTrackingPanel: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-slate-200">Token Cost & Efficiency Telemetry</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Cost/Query</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">$0.00042</div>
        </div>
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] text-slate-400 font-bold uppercase">Cache Hit Rate</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5">82.4%</div>
        </div>
      </div>
    </div>
  );
};
