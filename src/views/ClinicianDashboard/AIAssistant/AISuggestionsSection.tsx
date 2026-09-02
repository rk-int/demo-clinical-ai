import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const AISuggestionsSection: React.FC<{ onSelectSuggestion: (prompt: string) => void }> = ({ onSelectSuggestion }) => {
  const { isDark } = useTheme();

  const suggestions = [
    'What is the recommended second-line agent for T2DM with eGFR 42 mL/min/1.73m²?',
    'Review anticoagulant dosing in non-valvular atrial fibrillation with moderate renal impairment',
    'Evaluate statin safety profile in elevated baseline transaminases',
    'Assess diagnostic criteria for acute heart failure decompensation vs COPD exacerbation',
  ];

  return (
    <div className="space-y-2">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved Guideline Prompts</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggestion(s)}
            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
              isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-blue-500/40 text-slate-300' : 'bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
