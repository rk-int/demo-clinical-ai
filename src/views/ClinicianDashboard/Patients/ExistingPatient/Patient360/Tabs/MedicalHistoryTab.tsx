import React from 'react';
import { SyntheticPatient } from '../../../../../../types';
import { History, Calendar, CheckCircle2, AlertCircle, Building, Stethoscope } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';

interface MedicalHistoryTabProps {
  patient: SyntheticPatient;
}

export const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({ patient }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-200">Longitudinal Encounters & Clinical History</h3>
        </div>

        <div className="relative pl-6 space-y-6 border-l-2 border-blue-500/20 ml-2">
          {patient.encounters.map((enc) => (
            <div key={enc.id} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-900 shadow-sm" />
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {enc.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">{enc.department}</span>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {enc.admissionDate} {enc.dischargeDate ? `— ${enc.dischargeDate}` : '(Ongoing)'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 mb-1">Chief Complaint: {enc.chiefComplaint}</div>
                <div className="text-xs text-slate-400 mb-2">Attending: {enc.attendingPhysician}</div>
                {enc.dischargeSummaryNote && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
                    isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <span className="font-semibold text-blue-400">Discharge Synthesis: </span>
                    {enc.dischargeSummaryNote}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
