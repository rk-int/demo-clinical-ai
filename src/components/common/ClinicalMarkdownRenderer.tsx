import React from 'react';
import Markdown from 'react-markdown';
import { 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface ClinicalMarkdownRendererProps {
  content: string;
}

export const ClinicalMarkdownRenderer: React.FC<ClinicalMarkdownRendererProps> = ({ content }) => {
  if (!content || !content.trim()) {
    return null;
  }

  return (
    <div className="clinical-markdown-body space-y-3 text-xs text-slate-200 font-sans leading-relaxed">
      <Markdown
        components={{
          h1: ({ children }) => (
            <div className="pt-2 pb-1 border-b border-white/10 mb-2.5">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 tracking-tight">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{children}</span>
              </h3>
            </div>
          ),
          h2: ({ children }) => (
            <div className="pt-2 pb-1 border-b border-white/10 mb-2">
              <h4 className="text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{children}</span>
              </h4>
            </div>
          ),
          h3: ({ children }) => (
            <div className="pt-1.5 pb-0.5 mb-1.5">
              <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-2 tracking-tight">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{children}</span>
              </h5>
            </div>
          ),
          h4: ({ children }) => (
            <h6 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider mt-2 mb-1">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-xs text-slate-200 leading-relaxed my-1.5">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2 pl-1 list-none">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1">{children}</div>
            </li>
          ),
          strong: ({ children }) => (
            <span className="font-bold text-cyan-100 bg-cyan-950/40 px-1 py-0.5 rounded border border-cyan-800/40">
              {children}
            </span>
          ),
          blockquote: ({ children }) => (
            <div className="my-2.5 p-3 rounded-xl bg-slate-900/80 border-l-2 border-emerald-400 border border-slate-700/60 text-xs text-emerald-200/90 shadow-sm flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 italic">{children}</div>
            </div>
          ),
          code: ({ children }) => (
            <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
