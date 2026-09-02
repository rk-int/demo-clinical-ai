import React, { ReactNode } from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface AdminGovernanceLayoutProps {
  children: ReactNode;
  currentUser: UserProfile;
}

export const AdminGovernanceLayout: React.FC<AdminGovernanceLayoutProps> = ({ children, currentUser }) => {
  const { isDark } = useTheme();
  const isAdmin = ['ADMINISTRATOR', 'PORTAL_ADMIN', 'AUDITOR'].includes(currentUser.role);

  if (!isAdmin) {
    return (
      <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <Lock className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-200 mb-1">Restricted Administrative Area</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Role <strong>{currentUser.role}</strong> does not possess required governance privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        isDark ? 'bg-purple-950/20 border-purple-800/40 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Enterprise AI Governance & Evaluation Mode</span>
        </div>
        <span className="text-xs font-mono font-bold bg-purple-500/20 px-2 py-0.5 rounded text-purple-300">
          Strict Enforced
        </span>
      </div>
      {children}
    </div>
  );
};
