import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  action,
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-8 text-center rounded-2xl border flex flex-col items-center justify-center ${
      isDark ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
        isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{title}</h4>
      <p className={`text-xs max-w-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
