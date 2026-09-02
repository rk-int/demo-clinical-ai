import React, { useState } from 'react';
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
  Info,
  Stethoscope,
  HeartPulse,
  Sparkles,
  Users,
  Shield
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
  demoUsername: string;
  colorTheme: {
    iconColor: string;
    iconColorDark: string;
    borderSelected: string;
    borderSelectedDark: string;
    bgSelected: string;
    bgSelectedDark: string;
    checkBg: string;
  };
  demoUser: UserProfile;
  targetPortal: 'CLINICIAN' | 'OPERATIONS';
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  currentUser,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const roleOptions: RoleOption[] = [
    {
      id: 'DOCTOR',
      label: 'Doctor',
      demoUsername: 'doctor.demo',
      colorTheme: {
        iconColor: 'text-blue-600',
        iconColorDark: 'text-blue-400',
        borderSelected: 'border-blue-600 ring-2 ring-blue-500/30',
        borderSelectedDark: 'border-blue-400 ring-2 ring-blue-400/30',
        bgSelected: 'bg-blue-50/70',
        bgSelectedDark: 'bg-blue-500/10',
        checkBg: 'bg-blue-600',
      },
      demoUser: DEMO_USERS.find(u => u.role === 'DOCTOR') || DEMO_USERS[0],
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'NURSE',
      label: 'Nurse',
      demoUsername: 'nurse.demo',
      colorTheme: {
        iconColor: 'text-purple-600',
        iconColorDark: 'text-purple-400',
        borderSelected: 'border-purple-600 ring-2 ring-purple-500/30',
        borderSelectedDark: 'border-purple-400 ring-2 ring-purple-400/30',
        bgSelected: 'bg-purple-50/70',
        bgSelectedDark: 'bg-purple-500/10',
        checkBg: 'bg-purple-600',
      },
      demoUser: DEMO_USERS.find(u => u.role === 'NURSE') || DEMO_USERS[3],
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'SPECIALIST',
      label: 'Specialist',
      demoUsername: 'specialist.demo',
      colorTheme: {
        iconColor: 'text-emerald-600',
        iconColorDark: 'text-emerald-400',
        borderSelected: 'border-emerald-600 ring-2 ring-emerald-500/30',
        borderSelectedDark: 'border-emerald-400 ring-2 ring-emerald-400/30',
        bgSelected: 'bg-emerald-50/70',
        bgSelectedDark: 'bg-emerald-500/10',
        checkBg: 'bg-emerald-600',
      },
      demoUser: DEMO_USERS.find(u => u.role === 'SPECIALIST') || DEMO_USERS[1],
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'COORDINATOR',
      label: 'Care Coordinator',
      demoUsername: 'coord.demo',
      colorTheme: {
        iconColor: 'text-amber-600',
        iconColorDark: 'text-amber-400',
        borderSelected: 'border-amber-600 ring-2 ring-amber-500/30',
        borderSelectedDark: 'border-amber-400 ring-2 ring-amber-400/30',
        bgSelected: 'bg-amber-50/70',
        bgSelectedDark: 'bg-amber-500/10',
        checkBg: 'bg-amber-600',
      },
      demoUser: DEMO_USERS.find(u => u.role === 'CARE_COORDINATOR') || DEMO_USERS[2],
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'CLINICIAN',
      label: 'Clinician',
      demoUsername: 'clinician.demo',
      colorTheme: {
        iconColor: 'text-rose-600',
        iconColorDark: 'text-rose-400',
        borderSelected: 'border-rose-600 ring-2 ring-rose-500/30',
        borderSelectedDark: 'border-rose-400 ring-2 ring-rose-400/30',
        bgSelected: 'bg-rose-50/70',
        bgSelectedDark: 'bg-rose-500/10',
        checkBg: 'bg-rose-600',
      },
      demoUser: DEMO_USERS.find(u => u.role === 'CLINICIAN') || DEMO_USERS[4],
      targetPortal: 'CLINICIAN',
    },
    {
      id: 'PORTAL_ADMIN',
      label: 'Portal Admin',
      demoUsername: 'portal.admin',
      colorTheme: {
        iconColor: 'text-indigo-600',
        iconColorDark: 'text-indigo-400',
        borderSelected: 'border-indigo-600 ring-2 ring-indigo-500/30',
        borderSelectedDark: 'border-indigo-400 ring-2 ring-indigo-400/30',
        bgSelected: 'bg-indigo-50/70',
        bgSelectedDark: 'bg-indigo-500/10',
        checkBg: 'bg-indigo-600',
      },
      demoUser: DEMO_USERS.find(u => u.role === 'PORTAL_ADMIN') || DEMO_USERS[5],
      targetPortal: 'OPERATIONS',
    },
  ];

  const [selectedRole, setSelectedRole] = useState<RoleType>('DOCTOR');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  if (!isOpen) return null;

  const currentRoleOpt = roleOptions.find(r => r.id === selectedRole) || roleOptions[0];

  const handleSelectRole = (roleId: RoleType) => {
    setSelectedRole(roleId);
    const match = roleOptions.find(r => r.id === roleId);
    if (match) {
      setUsername(match.demoUsername);
      setPassword('••••••••••••');
    }
  };

  const handleSelectDemoAccount = (roleId: RoleType) => {
    setSelectedRole(roleId);
    const match = roleOptions.find(r => r.id === roleId);
    if (match) {
      setUsername(match.demoUsername);
      setPassword('••••••••••••');
      handlePerformLogin(match.demoUser, match.targetPortal);
    }
  };

  const handlePerformLogin = (userToLogin?: UserProfile, target?: 'CLINICIAN' | 'OPERATIONS') => {
    // If username is provided, match by username or email
    let user = userToLogin;
    let portal = target;

    if (!user && username.trim()) {
      const lower = username.trim().toLowerCase();
      if (lower.includes('nurse') || lower.includes('jennifer') || lower.includes('walsh')) {
        user = DEMO_USERS.find(u => u.role === 'NURSE') || DEMO_USERS[3];
        portal = 'CLINICIAN';
      } else if (lower.includes('portal') || lower.includes('rostova')) {
        user = DEMO_USERS.find(u => u.role === 'PORTAL_ADMIN') || DEMO_USERS[5];
        portal = 'OPERATIONS';
      } else if (lower.includes('specialist') || lower.includes('emily') || lower.includes('vance')) {
        user = DEMO_USERS.find(u => u.role === 'SPECIALIST') || DEMO_USERS[1];
        portal = 'CLINICIAN';
      } else if (lower.includes('coord') || lower.includes('carlos') || lower.includes('mendez')) {
        user = DEMO_USERS.find(u => u.role === 'CARE_COORDINATOR') || DEMO_USERS[2];
        portal = 'CLINICIAN';
      } else if (lower.includes('clinician') || lower.includes('rebecca') || lower.includes('thorne')) {
        user = DEMO_USERS.find(u => u.role === 'CLINICIAN') || DEMO_USERS[4];
        portal = 'CLINICIAN';
      } else if (lower.includes('auditor') || lower.includes('arthur') || lower.includes('sterling')) {
        user = DEMO_USERS.find(u => u.role === 'AUDITOR') || DEMO_USERS[6];
        portal = 'OPERATIONS';
      } else if (lower.includes('doc') || lower.includes('sarah') || lower.includes('chen')) {
        user = DEMO_USERS.find(u => u.role === 'DOCTOR') || DEMO_USERS[0];
        portal = 'CLINICIAN';
      }
    }

    if (!user) {
      user = currentRoleOpt.demoUser;
    }
    if (!portal) {
      portal = currentRoleOpt.targetPortal;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onSuccessLogin(user!, portal);
      onClose();
    }, 450);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handlePerformLogin();
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
        {/* Top Header Controls: Theme Mode Pill & Close Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle Pill (Matching Screenshot) */}
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

        {/* Modal Title & Subtitle */}
        <div className="mb-6">
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Sign in to your account
          </h2>
          <p className={`text-xs sm:text-sm mt-1 font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Access your clinical workspace
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {/* Username or Email */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-950/80 border-white/10 text-white placeholder-slate-500 focus:border-blue-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600'
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={() => setShowForgotNotice(!showForgotNotice)}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {showForgotNotice && (
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
              <span>For demo environments, click any of the <strong>Demo Accounts</strong> below for instant single-click access.</span>
            </div>
          )}

          {/* Select Role (5 Role Cards from Screenshot) */}
          <div className="space-y-2 pt-1">
            <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Role
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {roleOptions.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role.id)}
                    className={`relative p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                      isSelected 
                        ? isDark
                          ? `${role.colorTheme.borderSelectedDark} ${role.colorTheme.bgSelectedDark}`
                          : `${role.colorTheme.borderSelected} ${role.colorTheme.bgSelected}`
                        : isDark
                          ? 'border-white/10 bg-slate-950/40 hover:bg-white/5 hover:border-white/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {/* Selected Badge Checkmark */}
                    {isSelected && (
                      <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full ${role.colorTheme.checkBg} text-white flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-900`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Role Icon */}
                    <div className={`p-1 rounded-lg ${isDark ? role.colorTheme.iconColorDark : role.colorTheme.iconColor}`}>
                      <User className="w-5 h-5" />
                    </div>

                    {/* Role Label */}
                    <span className={`text-[11px] font-semibold leading-tight ${
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

          {/* Remember me row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Remember me
              </span>
            </label>
          </div>

          {/* Primary Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuthenticating ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>



          {/* Security and Terms Footer */}
          <div className="pt-2 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3 h-3" />
              <span>All access is monitored and audited. Your data is protected.</span>
            </div>
            <div className="text-[10px] text-slate-400">
              By signing in, you agree to our <a href="#" className="underline hover:text-slate-300">Privacy Policy</a> and <a href="#" className="underline hover:text-slate-300">Terms of Use</a>.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
