import React from 'react';
import { FileText, Edit3, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { SyntheticPatient } from '../../../types';

export const DocumentationView: React.FC<{ patients: SyntheticPatient[] }> = ({ patients }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-slate-200">Clinical Documentation Queue</h3>
      </div>
      <p className="text-xs text-slate-400 mb-3">AI-drafted SOAP progress notes and multidisciplinary nursing assessments ready for provider co-signature.</p>
    </div>
  );
};
