import React, { useState } from 'react';
import { SyntheticPatient, UserProfile, PurposeOfUse } from '../../../../../../types';
import { Sparkles, Send, ShieldCheck, HelpCircle } from 'lucide-react';
import { useTheme } from '../../../../../../context/ThemeContext';
import { executeClinicalGeminiQuery } from '../../../../../../lib/geminiClient';
import { ClinicalMarkdownRenderer } from '../../../../../../components/common/ClinicalMarkdownRenderer';

interface AIQnATabProps {
  patient: SyntheticPatient;
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
}

export const AIQnATab: React.FC<AIQnATabProps> = ({ patient, currentUser, purposeOfUse }) => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const res = await executeClinicalGeminiQuery({
        query,
        patientId: patient.id,
        userRole: currentUser.role,
        purposeOfUse,
      });
      setAnswer(res.answer);
    } catch (err) {
      setAnswer('Error generating grounded clinical response. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">Patient-Grounded Clinical Q&A</h3>
        </div>

        <form onSubmit={handleAsk} className="space-y-3 mb-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Ask anything about ${patient.fullName}'s clinical trajectory...`}
              className={`w-full px-4 py-3 rounded-xl border text-xs pr-24 ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50 flex items-center gap-1.5 transition-all"
            >
              {loading ? 'Analyzing...' : <><Send className="w-3 h-3" /> Ask</>}
            </button>
          </div>
        </form>

        {answer && (
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <ClinicalMarkdownRenderer content={answer} />
          </div>
        )}
      </div>
    </div>
  );
};
