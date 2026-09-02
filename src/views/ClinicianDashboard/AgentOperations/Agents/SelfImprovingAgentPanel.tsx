import React from 'react';
import { Scale, Sparkles, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export const SelfImprovingAgentPanel: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Scale className="w-4 h-4 text-purple-400" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Self-Improving Agent</h4>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Analyzes edge cases and safety audit exceptions to generate version-controlled prompt and routing improvement proposals for administrator approval.
      </p>
    </div>
  );
};
