import React from 'react';
import { BookOpen, ShieldCheck, Cpu } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export const KnowledgeAgentPanel: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-cyan-400" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Knowledge Guideline Agent</h4>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Executes grounded retrieval across verified institutional clinical protocols, peer-reviewed clinical guidelines, and NICE/ACC algorithms.
      </p>
    </div>
  );
};
