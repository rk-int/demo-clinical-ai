import React from 'react';
import { SyntheticPatient } from '../../../types';
import { FileText, Sparkles, UserCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const PatientSummarySection: React.FC<{ patient?: SyntheticPatient }> = ({ patient }) => {
  const { isDark } = useTheme();

  if (!patient) return null;

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-blue-400" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Selected Patient Scope</h4>
      </div>
      <div className="text-xs text-slate-200 font-semibold">{patient.fullName} (MRN: {patient.mrn})</div>
      <div className="text-[11px] text-slate-400">
        {patient.conditions.map(c => c.name).join(', ')} • {patient.medications.length} Active Meds
      </div>
    </div>
  );
};
