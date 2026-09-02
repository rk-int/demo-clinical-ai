import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { APPROVED_GUIDELINES } from '../../../data/approvedKnowledge';

export const KnowledgeSourcesView: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200">Institutional Clinical Knowledge Base & Guidelines</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">{APPROVED_GUIDELINES.length} Approved Sources</span>
      </div>

      <div className="space-y-3">
        {APPROVED_GUIDELINES.map((g) => (
          <div key={g.id} className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="font-bold text-xs text-slate-200">{g.title}</div>
                <div className="text-[11px] text-slate-400">
                  Version: {g.version} • Specialty: {g.specialty} • Site: {g.hospitalSite}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {g.approvalStatus}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">{g.summary}</p>
            <div className="text-[10px] text-slate-400 font-mono">
              Indexed Chunks: {g.chunks.length} • Effective Date: {g.effectiveDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
