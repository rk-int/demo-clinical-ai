import React from 'react';
import { SyntheticPatient } from '../../../../../../types';
import { FileText, Download, Eye, Calendar, UserCheck } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';

interface ReportsTabProps {
  patient: SyntheticPatient;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ patient }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200">Clinical Reports & Consultations</h3>
          </div>
        </div>

        <div className="space-y-3">
          {patient.encounters.map((enc) => (
            <div key={enc.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
              isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-200 truncate">{enc.type} Encounter Report — {enc.department}</div>
                  <div className="text-[11px] text-slate-400 truncate">Attending: {enc.attendingPhysician} • Date: {enc.admissionDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
