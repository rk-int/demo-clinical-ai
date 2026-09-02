import React from 'react';
import { UserRole, UserProfile } from '../../types';
import { DEMO_USERS } from '../../data/syntheticFhirData';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RoleSelectionProps {
  onSelectRole: (user: UserProfile) => void;
  activeRole?: UserRole;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole, activeRole }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-2">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select User Role</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DEMO_USERS.map((user) => {
          const isSelected = activeRole === user.role;
          return (
            <button
              key={user.id}
              onClick={() => onSelectRole(user)}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                  : isDark
                  ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${
                isSelected ? 'bg-blue-500 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {isSelected ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs truncate">{user.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user.role} • {user.department}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
