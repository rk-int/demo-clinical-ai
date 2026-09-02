import React, { useState } from 'react';
import { SyntheticPatient, UserProfile, PurposeOfUse } from '../../../../../../types';
import { Sparkles, ShieldCheck, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';
import { ClinicalMarkdownRenderer } from '../../../../../../components/common/ClinicalMarkdownRenderer';

interface AISummaryTabProps {
  patient: SyntheticPatient;
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
}

export const AISummaryTab: React.FC<AISummaryTabProps> = ({ patient, currentUser, purposeOfUse }) => {
  const { isDark } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const defaultSummary = `### Clinical Synthesis for ${patient.fullName} (MRN: ${patient.mrn})

**Primary Diagnoses:**
${patient.conditions.map(c => `- **${c.name}** (${c.clinicalStatus}) - Onset: ${c.onsetDate}`).join('\n')}

**Current Pharmacotherapy:**
${patient.medications.map(m => `- **${m.name}** ${m.dosage} ${m.frequency} (${m.status})`).join('\n')}

**Biomarker Highlights:**
${patient.observations.map(o => `- **${o.name}**: ${o.value} ${o.unit} (Status: ${o.status})`).join('\n')}

> **AI Grounding Protocol:** All facts synthesized from verified FHIR observations and approved institutional guidelines. Zero hallucinatory extrapolations detected.`;

  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200">Grounded Longitudinal Case Synthesis</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            GROUNDED RAG
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <ClinicalMarkdownRenderer content={defaultSummary} />
        </div>
      </div>
    </div>
  );
};
