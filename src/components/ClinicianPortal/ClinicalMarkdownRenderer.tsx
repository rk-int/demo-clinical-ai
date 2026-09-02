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
  // If content is empty or pure whitespace
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
          strong: ({ children }) => (
            <strong className="font-bold text-white tracking-tight">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-cyan-200/90 italic font-medium">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1.5 pl-0.5 list-none">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1.5 pl-4 list-decimal text-xs text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
              <div className="flex-1 min-w-0">{children}</div>
            </li>
          ),
          hr: () => (
            <div className="my-3.5 border-t border-white/10" />
          ),
          blockquote: ({ children }) => (
            <div className="my-2.5 p-3 rounded-xl bg-cyan-950/25 border-l-2 border-cyan-400 text-slate-300 text-xs italic">
              {children}
            </div>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded-md bg-slate-950/80 border border-white/15 text-cyan-300 font-mono text-[11px]">
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
