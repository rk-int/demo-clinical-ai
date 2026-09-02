import React from 'react';
import { SyntheticPatient } from '../../../../../../types';
import { Activity, ArrowUpRight, ArrowDownRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';

interface LabResultsTabProps {
  patient: SyntheticPatient;
}

export const LabResultsTab: React.FC<LabResultsTabProps> = ({ patient }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">Biochemical Panel & Lab Observations</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Total Observations: {patient.observations.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="pb-3 font-bold">Biomarker / Test</th>
                <th className="pb-3 font-bold">Current Value</th>
                <th className="pb-3 font-bold">Ref. Range</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Timestamp</th>
                <th className="pb-3 font-bold">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {patient.observations.map((obs) => (
                <tr key={obs.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">
                    {obs.name}
                    <div className="text-[10px] text-slate-400 font-mono">{obs.code}</div>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-cyan-400 text-sm">{obs.value}</span>
                    <span className="text-[11px] text-slate-400 ml-1">{obs.unit}</span>
                  </td>
                  <td className="py-3 text-slate-400">{obs.referenceRange} {obs.unit}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      obs.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                      obs.status === 'ABNORMAL_HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      obs.status === 'ABNORMAL_LOW' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {obs.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{obs.effectiveDateTime}</td>
                  <td className="py-3 text-slate-400 font-mono text-[10px]">{obs.provenance.sourceSystem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
