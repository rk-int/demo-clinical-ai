import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { SignInModal } from './components/SignInModal';
import { HealthNetWorkspace } from './components/HealthNetWorkspace';
import { PatientSearchView } from './components/ClinicianPortal/PatientSearchView';
import { Patient360View } from './components/ClinicianPortal/Patient360View';
import { KnowledgeQAView } from './components/ClinicianPortal/KnowledgeQAView';
import { WorkflowWorkspaceView } from './components/ClinicianPortal/WorkflowWorkspaceView';
import { SafetyAuditView } from './components/ClinicianPortal/SafetyAuditView';
import { AgentOperationsDashboard } from './components/AgentOperations/AgentOperationsDashboard';
import { UserProfile, PurposeOfUse, SyntheticPatient } from './types';
import { DEMO_USERS, SYNTHETIC_PATIENTS } from './data/syntheticFhirData';
import { useTheme } from './context/ThemeContext';

export function App() {
  const [currentTab, setCurrentTab] = useState<'LANDING' | 'WORKSPACE' | 'CLINICIAN' | 'OPERATIONS'>('LANDING');
  const [clinicianSubView, setClinicianSubView] = useState<'SEARCH' | 'PATIENT_360' | 'KNOWLEDGE_QA' | 'WORKFLOW' | 'SAFETY_AUDIT'>('SEARCH');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [purposeOfUse, setPurposeOfUse] = useState<PurposeOfUse>('TREATMENT');
  const [patients, setPatients] = useState<SyntheticPatient[]>(SYNTHETIC_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PT-1000');
  const [qaPrefilledQuery, setQaPrefilledQuery] = useState<string>('');
  const { isDark } = useTheme();

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const activeUser = currentUser || DEMO_USERS[0];

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleRegisterNewPatient = (newPatient: SyntheticPatient) => {
    setPatients((prev) => [newPatient, ...prev.filter((p) => p.id !== newPatient.id)]);
    setSelectedPatientId(newPatient.id);

    // Automatically ensure the newly added patient is in the assigned cohort for the active clinician
    setCurrentUser((prev) => {
      if (!prev) return prev;
      if (prev.assignedPatientIds.includes(newPatient.id)) return prev;
      return {
        ...prev,
        assignedPatientIds: [newPatient.id, ...prev.assignedPatientIds],
      };
    });

    // Sync with backend API
    fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatient),
    }).catch((err) => console.warn('Failed to sync new patient with server:', err));
  };

  const handleOpenKnowledgeQA = (prefilledQuery?: string) => {
    if (prefilledQuery) setQaPrefilledQuery(prefilledQuery);
    setClinicianSubView('KNOWLEDGE_QA');
    setCurrentTab('WORKSPACE');
  };

  const handleOpenWorkflow = (workflowType: 'CLINICAL_NOTE' | 'DISCHARGE_SUMMARY' | 'SPECIALIST_REFERRAL') => {
    setClinicianSubView('WORKFLOW');
    setCurrentTab('WORKSPACE');
  };

  const handleTriggerBreakItFromLanding = () => {
    const adminUser = DEMO_USERS.find(u => u.role === 'ADMINISTRATOR') || DEMO_USERS[5];
    setCurrentUser(adminUser);
    setPurposeOfUse('CLINICAL_AUDIT');
    setCurrentTab('WORKSPACE');
  };

  const handleEnterClinicianWithUser = (user?: UserProfile) => {
    const userToUse = user || currentUser || DEMO_USERS[0];
    setCurrentUser(userToUse);
    if (userToUse.role === 'CARE_COORDINATOR') {
      setPurposeOfUse('CARE_COORDINATION');
    } else if (userToUse.role === 'AUDITOR') {
      setPurposeOfUse('CLINICAL_AUDIT');
    } else {
      setPurposeOfUse('TREATMENT');
    }
    setCurrentTab('WORKSPACE');
  };

  const handleEnterOperationsWithUser = (user?: UserProfile) => {
    const userToUse = user || currentUser || DEMO_USERS.find(u => u.role === 'ADMINISTRATOR') || DEMO_USERS[5];
    setCurrentUser(userToUse);
    if (userToUse.role === 'AUDITOR') {
      setPurposeOfUse('CLINICAL_AUDIT');
    }
    setCurrentTab('WORKSPACE');
  };

  const handleSuccessfulModalLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'CARE_COORDINATOR') {
      setPurposeOfUse('CARE_COORDINATION');
    } else if (user.role === 'AUDITOR') {
      setPurposeOfUse('CLINICAL_AUDIT');
    } else {
      setPurposeOfUse('TREATMENT');
    }
    setCurrentTab('WORKSPACE');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentTab('LANDING');
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Pop-up Sign In Window (Matching Light/Dark Mode and Screen2.png) */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccessLogin={handleSuccessfulModalLogin}
        currentUser={currentUser}
      />

      {/* Main Content Router */}
      {currentTab === 'LANDING' ? (
        <>
          {/* Universal Enterprise Navbar on Landing Page */}
          <Navbar
            currentTab={currentTab}
            setCurrentTab={(tab) => setCurrentTab(tab as any)}
            clinicianSubView={clinicianSubView}
            setClinicianSubView={setClinicianSubView}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            purposeOfUse={purposeOfUse}
            setPurposeOfUse={setPurposeOfUse}
            activePatientName={undefined}
            onSignInClick={() => setIsSignInModalOpen(true)}
            onSignOut={handleSignOut}
          />

          <main className="flex-1 relative z-10">
            <LandingPage
              onEnterClinicianPortal={handleEnterClinicianWithUser}
              onEnterOperations={handleEnterOperationsWithUser}
              onTriggerBreakIt={handleTriggerBreakItFromLanding}
              currentUser={currentUser}
              onSelectUser={setCurrentUser}
              onOpenSignInModal={() => setIsSignInModalOpen(true)}
            />
          </main>
        </>
      ) : (
        /* Authenticated HealthNet AI Workspace (Matching Screen 3) */
        <HealthNetWorkspace
          currentUser={currentUser || activeUser}
          purposeOfUse={purposeOfUse}
          setPurposeOfUse={setPurposeOfUse}
          patients={patients}
          selectedPatient={selectedPatient}
          onSelectPatient={handleSelectPatient}
          onRegisterNewPatient={handleRegisterNewPatient}
          onSignOut={handleSignOut}
          onSwitchUser={() => setIsSignInModalOpen(true)}
        />
      )}
    </div>
  );
}

export default App;

