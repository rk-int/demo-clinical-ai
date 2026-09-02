import React from 'react';
import { GitBranch, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export const WorkflowAgentPanel: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Workflow & Order Agent</h4>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Orchestrates idempotent actions, validation checks, and enforces strict mandatory Human-in-the-Loop co-signatures before execution.
      </p>
    </div>
  );
};
