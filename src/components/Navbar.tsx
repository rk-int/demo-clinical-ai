import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  UserCheck, 
  Sparkles, 
  LayoutDashboard, 
  Stethoscope, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Lock,
  ChevronDown,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Building2,
  BadgeCheck,
  User,
  Download
} from 'lucide-react';
import { UserProfile, UserRole, PurposeOfUse } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getUserAvatarUrl } from '../utils/patientAvatar';
import { ExportZipModal } from './ExportZipModal';


interface NavbarProps {
  currentTab: 'LANDING' | 'CLINICIAN' | 'OPERATIONS';
  setCurrentTab: (tab: 'LANDING' | 'CLINICIAN' | 'OPERATIONS') => void;
  clinicianSubView: 'SEARCH' | 'PATIENT_360' | 'KNOWLEDGE_QA' | 'WORKFLOW' | 'SAFETY_AUDIT';
  setClinicianSubView: (view: 'SEARCH' | 'PATIENT_360' | 'KNOWLEDGE_QA' | 'WORKFLOW' | 'SAFETY_AUDIT') => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  purposeOfUse: PurposeOfUse;
  setPurposeOfUse: (purpose: PurposeOfUse) => void;
  activePatientName?: string;
  onSignInClick?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  clinicianSubView,
  setClinicianSubView,
  currentUser,
  setCurrentUser,
  purposeOfUse,
  setPurposeOfUse,
  activePatientName,
  onSignInClick,
  onSignOut,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [purposeDropdownOpen, setPurposeDropdownOpen] = React.useState(false);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const { theme, toggleTheme, isDark } = useTheme();


  const roles: { role: UserRole; label: string }[] = [
    { role: 'CLINICIAN', label: 'Attending Physician (MD)' },
    { role: 'SPECIALIST', label: 'Surgeon / Specialist (MD)' },
    { role: 'NURSE', label: 'Clinical Staff Nurse (RN)' },
    { role: 'CARE_COORDINATOR', label: 'Care Coordinator (MSW)' },
    { role: 'PORTAL_ADMIN', label: 'Portal Admin & Super User' },
    { role: 'AUDITOR', label: 'HIPAA & Compliance Auditor' },
  ];

  const purposes: { purpose: PurposeOfUse; label: string; desc: string }[] = [
    { purpose: 'TREATMENT', label: 'Direct Treatment', desc: 'Active direct inpatient/outpatient medical care' },
    { purpose: 'CARE_COORDINATION', label: 'Care Coordination', desc: 'Discharge planning & multi-disciplinary navigation' },
    { purpose: 'CLINICAL_AUDIT', label: 'Clinical Audit & Quality', desc: 'Quality assurance & safety governance reviews' },
    { purpose: 'EMERGENCY_OVERRIDE', label: 'Emergency Override', desc: 'Emergency life-safety break-glass protocol' },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors shadow-2xl ${
      isDark 
        ? 'bg-slate-900/80 border-white/10 text-white' 
        : 'bg-white/85 border-slate-200/80 text-slate-900 shadow-slate-200/50'
    }`}>
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('LANDING')}
              className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    CLINIC<span className="text-blue-500">AI</span>
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                    isDark 
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    Enterprise
                  </span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clinical Decision Support & Multi-Agent Network</p>
              </div>
            </button>
          </div>

          {/* Primary View Switcher (Only visible after user is logged in) */}
          {currentUser && (
            <nav className={`flex items-center gap-1.5 p-1 rounded-xl border backdrop-blur-xl ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-slate-100/80 border-slate-200'
            }`}>
              <button
                onClick={() => setCurrentTab('LANDING')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'LANDING'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : isDark 
                      ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Hospital world
              </button>

              <button
                onClick={() => setCurrentTab('CLINICIAN')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'CLINICIAN'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : isDark 
                      ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Clinician Workspace
              </button>

              {/* Agent Operations & Traces (Restricted to Portal Admin super user only) */}
              {(currentUser.role === 'PORTAL_ADMIN') && (
                <button
                  onClick={() => setCurrentTab('OPERATIONS')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'OPERATIONS'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : isDark 
                        ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Agent Operations & Traces
                </button>
              )}
            </nav>
          )}

          {/* User Profile, Theme Toggle, Export ZIP & Purpose-of-Use Controls */}
          <div className="flex items-center gap-2">
            {/* Direct Export Source ZIP Button (Portal Admin Only) */}
            {currentUser?.role === 'PORTAL_ADMIN' && (
              <button
                onClick={() => setExportModalOpen(true)}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border backdrop-blur-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 font-medium text-xs ${
                  isDark 
                    ? 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-300 hover:text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                    : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800'
                }`}
                title="Download full project source code as a ZIP archive (27.0 MB)"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline font-semibold">Export ZIP (27MB)</span>
              </button>
            )}


            {/* Theme Toggle Button (Light / Dark Mode) */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border backdrop-blur-xl transition-all cursor-pointer shadow-sm flex items-center justify-center ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300 hover:text-amber-200' 
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle light and dark mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300 animate-in spin-in-90 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-90 duration-200" />
              )}
            </button>

            {/* User Profile or Sign In Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setPurposeDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2.5 border backdrop-blur-xl px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:border-cyan-500/40' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                  }`}
                  title="View logged-in user credentials and session profile"
                >
                  <img
                    src={getUserAvatarUrl(currentUser)}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm shrink-0"
                  />
                  <div className="text-left hidden sm:block">
                    <div className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-semibold border ${
                        currentUser.role === 'DOCTOR' || currentUser.role === 'PHYSICIAN'
                          ? isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
                          : currentUser.role === 'NURSE'
                          ? isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : currentUser.role === 'CARE_COORDINATOR'
                          ? isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200'
                          : currentUser.role === 'ADMINISTRATOR'
                          ? isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
                          : currentUser.role === 'AUDITOR'
                          ? isDark ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
                          : isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                      }`}>
                        {currentUser.role.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] truncate max-w-[110px] hidden md:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {currentUser.hospitalSite.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Popover showing ONLY the logged in user's profile and credentials */}
                {userDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-84 backdrop-blur-2xl border rounded-2xl shadow-2xl p-4 z-50 transition-all ${
                    isDark 
                      ? 'bg-slate-900/95 border-white/10 text-slate-100' 
                      : 'bg-white/98 border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-blue-400/30 shrink-0">
                        {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm truncate">{currentUser.name}</span>
                          <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                        </div>
                        <div className="text-xs text-slate-400 font-medium truncate mt-0.5">{currentUser.department}</div>
                        <div className="inline-block mt-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-400">
                          {currentUser.role.replace('_', ' ')} • ACTIVE SESSION
                        </div>
                      </div>
                    </div>

                    <div className="py-3 space-y-2 text-xs border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" /> Facility:
                        </span>
                        <span className="font-medium text-right truncate max-w-[180px]">{currentUser.hospitalSite}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-500" /> License ID:
                        </span>
                        <span className="font-mono font-medium">{currentUser.licenseNumber || 'Enterprise IAM'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-500" /> Scope:
                        </span>
                        <span className="font-medium">
                          {currentUser.assignedPatientIds && currentUser.assignedPatientIds.length > 0 
                            ? `${currentUser.assignedPatientIds.length} Assigned Patients`
                            : 'Full Network Governance Scope'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" /> Security:
                        </span>
                        <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          MFA Verified & RBAC Enforced
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onSignInClick) {
                            onSignInClick();
                          }
                        }}
                        className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-blue-400" />
                        <span>Switch User</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onSignOut) {
                            onSignOut();
                          } else {
                            setCurrentUser(null);
                            setCurrentTab('LANDING');
                          }
                        }}
                        className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Global Sign In Button when not logged in */
              <button
                onClick={() => {
                  if (onSignInClick) {
                    onSignInClick();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                title="Sign In with Credentials or Demo Role"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Bar when Clinician Workspace is Active (5 Core Pages) */}
      {currentTab === 'CLINICIAN' && (
        <div className={`border-t px-4 sm:px-6 lg:px-8 transition-colors ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-slate-50/90 border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center gap-2 py-2 overflow-x-auto no-scrollbar">
            <span className={`text-[11px] font-semibold uppercase tracking-wider mr-2 hidden sm:inline ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Clinician Views:
            </span>

            <button
              onClick={() => setClinicianSubView('SEARCH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                clinicianSubView === 'SEARCH'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              1. Patient Search & Directory
            </button>

            <button
              onClick={() => setClinicianSubView('PATIENT_360')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                clinicianSubView === 'PATIENT_360'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              2. Patient 360 & Timeline
            </button>

            <button
              onClick={() => setClinicianSubView('KNOWLEDGE_QA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                clinicianSubView === 'KNOWLEDGE_QA'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
              3. Clinical Knowledge Q&A
            </button>

            <button
              onClick={() => setClinicianSubView('WORKFLOW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                clinicianSubView === 'WORKFLOW'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              4. Workflow & Note Workspace
            </button>

            <button
              onClick={() => setClinicianSubView('SAFETY_AUDIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                clinicianSubView === 'SAFETY_AUDIT'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              5. Safety, Evidence & Audit
            </button>
          </div>
        </div>
      )}
      {/* Full Project Export ZIP Modal */}
      <ExportZipModal 
        isOpen={exportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
      />
    </header>
  );
};


