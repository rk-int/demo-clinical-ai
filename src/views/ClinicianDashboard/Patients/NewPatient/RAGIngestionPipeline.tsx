import React from 'react';
import { Database, ShieldCheck, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

interface RAGIngestionPipelineProps {
  currentStage: number; // 1 to 5
}

export const RAGIngestionPipeline: React.FC<RAGIngestionPipelineProps> = ({ currentStage }) => {
  const { isDark } = useTheme();

  const stages = [
    { num: 1, label: 'OCR & Classify' },
    { num: 2, label: 'Schema Chunking' },
    { num: 3, label: 'Dense Embeddings' },
    { num: 4, label: 'Hybrid Index' },
    { num: 5, label: 'PHI Grounding' },
  ];

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="grid grid-cols-5 gap-2 text-center">
        {stages.map((st) => {
          const isDone = st.num < currentStage;
          const isCurrent = st.num === currentStage;
          return (
            <div key={st.num} className={`p-2.5 rounded-lg border text-xs ${
              isDone ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              isCurrent ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 ring-1 ring-blue-500' :
              'bg-slate-900/20 border-slate-800 text-slate-500'
            }`}>
              <div className="font-bold mb-1 flex items-center justify-center gap-1">
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : `0${st.num}`}
              </div>
              <div className="text-[10px] truncate">{st.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
