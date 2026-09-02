import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const SelfImprovementView: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold text-slate-200">Continuous AI Self-Improvement & Proposal Registry</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Systematically discovers low-grounding edge cases, synthesizes updated reasoning constraints, and benchmarks candidate prompts against the golden test suite.
      </p>
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-xs text-purple-400">PROP-2026-08: Acute Renal Dose Verification Constraint</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            PASSED 98.4%
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Refines prompt instruction to mandate eGFR verification prior to generating metformin or SGLT2i recommendations.
        </p>
      </div>
    </div>
  );
};
