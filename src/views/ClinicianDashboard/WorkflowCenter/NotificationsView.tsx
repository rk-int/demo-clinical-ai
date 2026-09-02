import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const NotificationsView: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-slate-200">Clinical Alerts & Notifications</h3>
      </div>
      <div className="space-y-2.5">
        <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
          isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Biomarker alert: Eleanor Vance potassium 5.8 mEq/L exceeds high threshold.</span>
        </div>
      </div>
    </div>
  );
};
