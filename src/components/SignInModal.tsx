import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Check, 
  ChevronDown,
  BadgeCheck,
  Users,
  Stethoscope,
  HeartPulse,
  Award,
  UserCheck
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/syntheticFhirData';
import { useTheme } from '../context/ThemeContext';
import { getUserAvatarUrl } from '../utils/patientAvatar';

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: UserProfile, targetPortal?: 'CLINICIAN' | 'OPERATIONS') => void;
  currentUser?: UserProfile | null;
}

type RoleType = 'DOCTOR' | 'NURSE' | 'SPECIALIST' | 'COORDINATOR' | 'CLINICIAN' | 'PORTAL_ADMIN';

interface RoleOption {
  id: RoleType;
  label: string;
  icon: React.ElementType;
  mappedRoles: UserRole[];
  colorTheme: {
    iconColor: string;
    iconColorDark: string;
    borderSelected: string;
    borderSelectedDark: string;
    bgSelected: string;
    bgSelectedDark: string;
    checkBg: string;
  };
  targetPortal: 'CLINICIAN' | 'OPERATIONS';
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  currentUser,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const [selectedRole, setSelectedRole] = useState<RoleType>('DOCTOR');
  const [selectedUserId, setSelectedUserId] = useState<string>('USR-1001');
  const [password, setPassword] = useState('demo2026Pass!');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const roleOptions: RoleOption[] = [
    {
      id: 'DOCTOR',
      label: 'Doctor',
      icon: Stethoscope,
      mappedRoles: ['DOCTOR', 'PHYSICIAN'],
      colorTheme: {
        iconColor: 'text-blue-600',
        iconColorDark: 'text-blue-400',
        borderSelected: 'border-blue-600 ring-2 ring-blue-500/30',
        borderSelectedDark: 'border-blue-400 ring-2 ring-blue-400/30',
        bgSelected: 'bg-blue-50/70',
        bgSelectedDark: 'bg-blue-500/10',
        checkBg: 'bg-blue-600',
      },
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'NURSE',
      label: 'Nurse',
      icon: HeartPulse,
      mappedRoles: ['NURSE'],
      colorTheme: {
        iconColor: 'text-purple-600',
        iconColorDark: 'text-purple-400',
        borderSelected: 'border-purple-600 ring-2 ring-purple-500/30',
        borderSelectedDark: 'border-purple-400 ring-2 ring-purple-400/30',
        bgSelected: 'bg-purple-50/70',
        bgSelectedDark: 'bg-purple-500/10',
        checkBg: 'bg-purple-600',
      },
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'SPECIALIST',
      label: 'Specialist',
      icon: Award,
      mappedRoles: ['SPECIALIST'],
      colorTheme: {
        iconColor: 'text-emerald-600',
        iconColorDark: 'text-emerald-400',
        borderSelected: 'border-emerald-600 ring-2 ring-emerald-500/30',
        borderSelectedDark: 'border-emerald-400 ring-2 ring-emerald-400/30',
        bgSelected: 'bg-emerald-50/70',
        bgSelectedDark: 'bg-emerald-500/10',
        checkBg: 'bg-emerald-600',
      },
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'COORDINATOR',
      label: 'Care Coordinator',
      icon: Users,
      mappedRoles: ['CARE_COORDINATOR'],
      colorTheme: {
        iconColor: 'text-amber-600',
        iconColorDark: 'text-amber-400',
        borderSelected: 'border-amber-600 ring-2 ring-amber-500/30',
        borderSelectedDark: 'border-amber-400 ring-2 ring-amber-400/30',
        bgSelected: 'bg-amber-50/70',
        bgSelectedDark: 'bg-amber-500/10',
        checkBg: 'bg-amber-600',
      },
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'CLINICIAN',
      label: 'Clinician',
      icon: UserCheck,
      mappedRoles: ['CLINICIAN'],
      colorTheme: {
        iconColor: 'text-rose-600',
        iconColorDark: 'text-rose-400',
        borderSelected: 'border-rose-600 ring-2 ring-rose-500/30',
        borderSelectedDark: 'border-rose-400 ring-2 ring-rose-400/30',
        bgSelected: 'bg-rose-50/70',
        bgSelectedDark: 'bg-rose-500/10',
        checkBg: 'bg-rose-600',
      },
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'PORTAL_ADMIN',
      label: 'Portal Admin',
      icon: ShieldCheck,
      mappedRoles: ['PORTAL_ADMIN', 'ADMINISTRATOR', 'AUDITOR'],
      colorTheme: {
        iconColor: 'text-indigo-600',
        iconColorDark: 'text-indigo-400',
        borderSelected: 'border-indigo-600 ring-2 ring-indigo-500/30',
        borderSelectedDark: 'border-indigo-400 ring-2 ring-indigo-400/30',
        bgSelected: 'bg-indigo-50/70',
        bgSelectedDark: 'bg-indigo-500/10',
        checkBg: 'bg-indigo-600',
      },
      targetPortal: 'OPERATIONS',
    },
  ];

  const currentRoleOpt = roleOptions.find((r) => r.id === selectedRole) || roleOptions[0];

  const availableUsers = DEMO_USERS.filter((u) => {
    return currentRoleOpt.mappedRoles.includes(u.role);
  });

  // Sync selected user when modal opens or currentUser changes
  useEffect(() => {
    if (isOpen && currentUser) {
      const matchingRoleOpt = roleOptions.find(r => r.mappedRoles.includes(currentUser.role));
      if (matchingRoleOpt) {
        setSelectedRole(matchingRoleOpt.id);
      }
      setSelectedUserId(currentUser.id);
    }
  }, [isOpen, currentUser]);

  // Keep selectedUserId if valid when selectedRole changes, otherwise select first matching user
  useEffect(() => {
    if (availableUsers.length > 0) {
      const isCurrentValid = availableUsers.some(u => u.id === selectedUserId);
      if (!isCurrentValid) {
        setSelectedUserId(availableUsers[0].id);
      }
      setPassword('demo2026Pass!');
      setIsUserMenuOpen(false);
    }
  }, [selectedRole]);

  if (!isOpen) return null;

  const selectedUser = DEMO_USERS.find(u => u.id === selectedUserId) || availableUsers[0] || DEMO_USERS[0];

  const handleRoleClick = (roleId: RoleType) => {
    setSelectedRole(roleId);
  };

  const handleUserDropdownChange = (userId: string) => {
    setSelectedUserId(userId);
    setPassword('demo2026Pass!');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const targetPortal = ['PORTAL_ADMIN', 'AUDITOR'].includes(selectedUser.role) ? 'OPERATIONS' : 'CLINICIAN';
      onSuccessLogin(selectedUser, targetPortal);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div 
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl transition-all z-10 my-auto border animate-in zoom-in-95 duration-200 ${
          isDark 
            ? 'bg-slate-900/98 text-slate-100 border-white/10 shadow-cyan-950/40' 
            : 'bg-white text-slate-900 border-slate-200/80 shadow-slate-300/60'
        }`}
      >
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HIPAA SSO Gateway</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Pill */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
                isDark 
                  ? 'bg-slate-800/90 border-white/10 text-slate-200 hover:bg-slate-700/80' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Sign in to your account
          </h2>
          <p className={`text-xs sm:text-sm mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Select role category and choose user account from dropdown
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="space-y-1.5 mb-4">
          <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            1. Select Role Category
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {roleOptions.map((role) => {
              const isSelected = selectedRole === role.id;
              const RoleIcon = role.icon;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleClick(role.id)}
                  className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    isSelected 
                      ? isDark
                        ? `${role.colorTheme.borderSelectedDark} ${role.colorTheme.bgSelectedDark}`
                        : `${role.colorTheme.borderSelected} ${role.colorTheme.bgSelected}`
                      : isDark
                        ? 'border-white/10 bg-slate-950/40 hover:bg-white/5 hover:border-white/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full ${role.colorTheme.checkBg} text-white flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-900 z-10`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  <RoleIcon className={`w-5 h-5 ${isDark ? role.colorTheme.iconColorDark : role.colorTheme.iconColor}`} />

                  <span className={`text-[10px] font-bold leading-tight truncate w-full ${
                    isSelected 
                      ? isDark ? 'text-white' : 'text-slate-900'
                      : isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {role.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {/* User Select Dropdown with Photo Avatars Next to Names */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              2. Select Account ({currentRoleOpt.label} — {availableUsers.length} Users)
            </label>
            
            <div className="relative">
              {/* Custom Dropdown Trigger Button */}
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer shadow-sm ${
                  isDark 
                    ? 'bg-slate-950 border-blue-500/40 text-white hover:border-blue-400' 
                    : 'bg-blue-50/40 border-blue-300 text-slate-900 hover:border-blue-500'
                }`}
              >
                {selectedUser ? (
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={selectedUser.avatarUrl || getUserAvatarUrl(selectedUser)}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-blue-500/50 shadow-md ring-2 ring-blue-500/30"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold truncate text-white dark:text-white">
                          {selectedUser.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                          {selectedUser.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {selectedUser.department} • {selectedUser.hospitalSite} {selectedUser.licenseNumber ? `• ${selectedUser.licenseNumber}` : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Select User Account...</span>
                )}
                
                <ChevronDown className={`w-4 h-4 text-blue-400 shrink-0 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Custom User Options Dropdown List (Each item displays photo next to name) */}
              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className={`absolute left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto rounded-2xl border p-1.5 space-y-1.5 z-50 shadow-2xl animate-fade-in ${
                    isDark ? 'bg-slate-950 border-blue-500/40 text-white' : 'bg-white border-blue-300 text-slate-900'
                  }`}>
                    {availableUsers.map((u) => {
                      const isSel = u.id === selectedUserId;
                      const avatar = u.avatarUrl || getUserAvatarUrl(u);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            handleUserDropdownChange(u.id);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-all cursor-pointer group ${
                            isSel 
                              ? 'bg-blue-600/25 border-blue-500 ring-1 ring-blue-500/40 text-white shadow-md'
                              : isDark 
                                ? 'bg-slate-900/60 border-white/5 hover:bg-white/10 text-slate-200' 
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={avatar}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover shrink-0 border border-blue-500/50 shadow-md ring-2 ring-blue-500/30 group-hover:scale-105 transition-transform"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-extrabold truncate text-white dark:text-white group-hover:text-cyan-300 transition-colors">
                                  {u.name}
                                </p>
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                  {u.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {u.department} • {u.hospitalSite}
                              </p>
                            </div>
                          </div>
                          {isSel && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              3. Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-950/80 border-white/10 text-white placeholder-slate-500 focus:border-blue-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Keep me signed in on this workstation
              </span>
            </label>
          </div>

          {/* Primary Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuthenticating ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Authenticating SSO Token...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Clinical Workspace</span>
                  <BadgeCheck className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Security & Audit Footer */}
          <div className="pt-2 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3 h-3" />
              <span>All authentication attempts logged to SHA-256 Audit Trail.</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
