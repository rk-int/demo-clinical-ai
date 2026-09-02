import React, { ReactNode } from 'react';
import { UserProfile, PurposeOfUse } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface DashboardLayoutProps {
  children: ReactNode;
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentUser, purposeOfUse }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};
