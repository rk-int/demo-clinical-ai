import React from 'react';
import { Calendar, Clock, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { SyntheticPatient } from '../../../types';

export const AppointmentsView: React.FC<{ patients: SyntheticPatient[] }> = ({ patients }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-200">Scheduled Clinical Appointments & Follow-ups</h3>
        </div>
      </div>

      <div className="space-y-3">
        {patients.slice(0, 4).map((p, idx) => (
          <div key={p.id} className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${
            isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-200">{p.fullName}</div>
                <div className="text-[11px] text-slate-400">
                  {idx === 0 ? 'Today 10:30 AM' : idx === 1 ? 'Today 02:00 PM' : 'Tomorrow 09:15 AM'} • Nephrology & Cardiology Follow-up
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              CONFIRMED
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
