import React from 'react';
import { SyntheticPatient } from '../../../../../../types';
import { Camera, ZoomIn, Eye, ShieldCheck, Calendar } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';

interface ImagingXRayTabProps {
  patient: SyntheticPatient;
}

export const ImagingXRayTab: React.FC<ImagingXRayTabProps> = ({ patient }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">Diagnostic Imaging & Radiology Series</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
            <div className="aspect-video bg-slate-950 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-800 mb-3">
              <div className="text-center p-4">
                <Camera className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
                <div className="text-xs text-slate-400 font-mono">DICOM PA Chest X-Ray</div>
                <div className="text-[10px] text-slate-500">1024x1024 • 16-bit Grayscale</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-200">PA Chest Radiograph</div>
                <div className="text-[11px] text-slate-400">Radiologist: Dr. E. Hayes • Verified Normal</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CLEAR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
