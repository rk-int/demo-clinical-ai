import React from 'react';
import { Terminal, ShieldCheck, CheckCircle2, History } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const PromptManagementView: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-200">System Prompt Versioning & AB Testing</h3>
      </div>
      <div className="space-y-3">
        <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="font-bold text-xs text-slate-200">SystemPrompt: ClinicalDifferentialEngine v2.4</div>
            <div className="text-[11px] text-slate-400">Target Model: gemini-3.7-flash • Enforced Zero-Tolerance Grounding</div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            PROD ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
