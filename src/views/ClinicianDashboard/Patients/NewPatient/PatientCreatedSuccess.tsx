import React from 'react';
import { CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import { SyntheticPatient } from '../../../../types';
import { useTheme } from '../../../../context/ThemeContext';

interface PatientCreatedSuccessProps {
  patient: SyntheticPatient;
  onViewRecord: () => void;
}

export const PatientCreatedSuccess: React.FC<PatientCreatedSuccessProps> = ({ patient, onViewRecord }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 rounded-2xl border text-center ${
      isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
    }`}>
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-emerald-300 mb-1">New Patient Record Created Successfully</h3>
      <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
        Longitudinal record, multimodal embeddings, and FHIR schema for <strong>{patient.fullName}</strong> (MRN: {patient.mrn}) have been verified and indexed.
      </p>
      <button
        onClick={onViewRecord}
        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition-all active:scale-95"
      >
        <span>Open Patient 360 Record</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
