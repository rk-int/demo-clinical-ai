import React, { useState } from 'react';
import { Send, Sparkles, ShieldCheck } from 'lucide-react';
import { executeClinicalGeminiQuery } from '../../../lib/geminiClient';
import { ClinicalMarkdownRenderer } from '../../../components/common/ClinicalMarkdownRenderer';
import { useTheme } from '../../../context/ThemeContext';

export const ClinicalQnASection: React.FC<{ defaultPrompt?: string }> = ({ defaultPrompt = '' }) => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState(defaultPrompt);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const res = await executeClinicalGeminiQuery({ query });
      setAnswer(res.answer);
    } catch {
      setAnswer('Failed to retrieve clinical assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-200">Clinical Guideline & Protocol Q&A</h3>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about NICE, ACC/AHA, KDIGO protocols..."
          className={`flex-1 px-4 py-2.5 rounded-xl border text-xs ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
          }`}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? 'Evaluating...' : <><Send className="w-3.5 h-3.5" /> Query</>}
        </button>
      </form>
      {answer && (
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <ClinicalMarkdownRenderer content={answer} />
        </div>
      )}
    </div>
  );
};
