import React from 'react';
import { Eye, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

interface OCRParsingVisualizerProps {
  rawTextSnippet: string;
  extractedEntities: { type: string; text: string; confidence: number }[];
}

export const OCRParsingVisualizer: React.FC<OCRParsingVisualizerProps> = ({ rawTextSnippet, extractedEntities }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">OCR Entity Extraction Stream</h4>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {extractedEntities.map((e, idx) => (
          <span key={idx} className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            {e.type}: {e.text} ({(e.confidence * 100).toFixed(0)}%)
          </span>
        ))}
      </div>
      <div className="text-[11px] font-mono text-slate-400 p-2.5 rounded bg-slate-950/80 border border-slate-800/80 overflow-x-auto max-h-32">
        {rawTextSnippet}
      </div>
    </div>
  );
};
