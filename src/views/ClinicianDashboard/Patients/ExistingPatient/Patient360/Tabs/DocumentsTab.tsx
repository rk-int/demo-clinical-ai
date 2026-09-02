import React from 'react';
import { SyntheticPatient } from '../../../../../../types';
import { FileUp, FileText, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';

interface DocumentsTabProps {
  patient: SyntheticPatient;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ patient }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200">Ingested Clinical Documents & OCR Source Files</h3>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
            isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-200">Initial Admission Clinical Assessment PDF</div>
                <div className="text-[11px] text-slate-400">OCR Parsed & Grounded • Verified SHA-256 Checksum</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              INDEXED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
