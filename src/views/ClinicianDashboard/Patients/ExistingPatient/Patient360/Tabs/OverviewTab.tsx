import React from 'react';
import { SyntheticPatient, UserProfile } from '../../../../../../types';
import { HeartPulse, Pill, Activity, ShieldCheck, FileCheck, Sparkles, Building, Calendar, Stethoscope } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';

interface OverviewTabProps {
  patient: SyntheticPatient;
  currentUser: UserProfile;
  onOpenKnowledgeQA: (query?: string) => void;
  onOpenWorkflow: (type: 'CLINICAL_NOTE' | 'DISCHARGE_SUMMARY' | 'SPECIALIST_REFERRAL') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  patient,
  currentUser,
  onOpenKnowledgeQA,
  onOpenWorkflow,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      {/* Top Clinical Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Conditions */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Conditions</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {patient.conditions.length}
            </span>
          </div>
          <div className="space-y-2">
            {patient.conditions.map((c) => (
              <div key={c.id} className={`p-2.5 rounded-xl border text-xs flex items-start justify-between ${
                isDark ? 'bg-slate-800/40 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-[11px] text-slate-400">Onset: {c.onsetDate} • Code: {c.code}</div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {c.clinicalStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Pill className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Medications</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {patient.medications.length}
            </span>
          </div>
          <div className="space-y-2">
            {patient.medications.map((m) => (
              <div key={m.id} className={`p-2.5 rounded-xl border text-xs flex items-start justify-between ${
                isDark ? 'bg-slate-800/40 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div>
                  <div className="font-semibold text-blue-400">{m.name}</div>
                  <div className="text-[11px] text-slate-400">{m.dosage} • {m.frequency}</div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Lab Trends */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Lab Biomarkers</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {patient.observations.length}
            </span>
          </div>
          <div className="space-y-2">
            {patient.observations.slice(0, 3).map((o) => (
              <div key={o.id} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                isDark ? 'bg-slate-800/40 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div>
                  <div className="font-semibold">{o.name}</div>
                  <div className="text-[11px] text-slate-400">Ref: {o.referenceRange} {o.unit}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-cyan-400">{o.value} <span className="text-xs font-normal text-slate-400">{o.unit}</span></div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    o.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                    o.status === 'ABNORMAL_HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Quick Actions Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDark ? 'bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border-blue-800/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-blue-400">Clinical AI Copilot Available</h4>
            <p className="text-xs text-slate-400">Generate grounded differential assessment or synthetic clinical SOAP progress notes.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenKnowledgeQA(`Generate clinical differential summary and guideline checklist for ${patient.fullName}`)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
          >
            Ask AI Assistant
          </button>
          <button
            onClick={() => onOpenWorkflow('CLINICAL_NOTE')}
            className="px-3 py-1.5 rounded-xl border border-blue-500/30 hover:bg-blue-600/10 text-blue-300 font-bold text-xs transition-all"
          >
            Draft SOAP Note
          </button>
        </div>
      </div>
    </div>
  );
};
