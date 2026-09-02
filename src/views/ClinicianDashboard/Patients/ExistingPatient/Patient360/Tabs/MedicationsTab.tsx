import React from 'react';
import { SyntheticPatient } from '../../../../../../types';
import { Pill, AlertTriangle, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';

interface MedicationsTabProps {
  patient: SyntheticPatient;
}

export const MedicationsTab: React.FC<MedicationsTabProps> = ({ patient }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      {/* Allergies Warning Banner if present */}
      {patient.allergies.length > 0 && (
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Documented Allergies & Sensitivities</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((a) => (
              <span key={a.id} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                {a.substance} ({a.severity} — {a.reaction})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200">Active Prescriptions & Dosages</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Total: {patient.medications.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patient.medications.map((m) => (
            <div key={m.id} className={`p-3.5 rounded-xl border ${
              isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="font-bold text-xs text-blue-400">{m.name}</div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {m.status}
                </span>
              </div>
              <div className="text-xs text-slate-300 mb-1">
                <span className="font-semibold">Dosage:</span> {m.dosage} • <span className="font-semibold">Route:</span> {m.route} • <span className="font-semibold">Frequency:</span> {m.frequency}
              </div>
              <div className="text-[11px] text-slate-400">
                Prescribed by: {m.prescribingProvider} ({m.prescribedDate})
              </div>
              {m.indications && (
                <div className="mt-2 text-[11px] text-slate-300 bg-slate-900/40 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400">Indication:</span> {m.indications}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
