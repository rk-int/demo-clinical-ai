import React from 'react';
import { Cpu, Zap, Activity } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const LLMMetricsPanel: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold text-slate-200">LLM Inference & Model Health</h3>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Primary Model</span>
          <span className="font-semibold text-cyan-400 font-mono">gemini-3.7-flash</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">High-Availability Fallback</span>
          <span className="font-semibold text-blue-400 font-mono">gemini-3.1-flash-lite</span>
        </div>
      </div>
    </div>
  );
};
