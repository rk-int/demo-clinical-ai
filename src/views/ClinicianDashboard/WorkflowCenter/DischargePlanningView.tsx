import React from 'react';
import { FileCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { SyntheticPatient } from '../../../types';

export const DischargePlanningView: React.FC<{ patient?: SyntheticPatient }> = ({ patient }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <FileCheck className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-slate-200">Discharge Planning & Care Transition Protocol</h3>
      </div>
      <p className="text-xs text-slate-400 mb-3">
        Comprehensive post-discharge medication reconciliation, home health coordinator handoff, and follow-up appointment verification.
      </p>
    </div>
  );
};
