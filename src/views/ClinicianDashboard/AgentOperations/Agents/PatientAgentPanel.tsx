import React from 'react';
import { UserCheck, ShieldCheck, Database } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export const PatientAgentPanel: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="w-4 h-4 text-blue-400" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Patient Data Agent</h4>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Integrates with FHIR R4 stores, extracts longitudinal encounters, and monitors data completeness with automated checksum verification.
      </p>
    </div>
  );
};
