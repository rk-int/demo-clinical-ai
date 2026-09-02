import React from 'react';
import { Share2, Stethoscope, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { SyntheticPatient } from '../../../types';

export const ReferralsView: React.FC<{ patients: SyntheticPatient[] }> = ({ patients }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-slate-200">Specialist Clinical Referrals</h3>
      </div>

      <div className="space-y-3">
        {patients.slice(0, 3).map((p, idx) => (
          <div key={p.id} className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${
            isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-200">{p.fullName}</div>
                <div className="text-[11px] text-slate-400">
                  Referral to {idx === 0 ? 'Cardiology' : idx === 1 ? 'Endocrinology' : 'Pulmonology'} • Status: Pending Specialist Review
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ROUTED
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
