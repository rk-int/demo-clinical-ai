import React from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

interface DocumentUploadSectionProps {
  onFileSelect: (file: File) => void;
  selectedFileName?: string;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ onFileSelect, selectedFileName }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 border-2 border-dashed rounded-2xl text-center transition-colors ${
      isDark ? 'border-slate-800 hover:border-blue-500/50 bg-slate-900/30' : 'border-slate-300 hover:border-blue-400 bg-slate-50'
    }`}>
      <input
        type="file"
        id="ehr-doc-upload"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />
      <label htmlFor="ehr-doc-upload" className="cursor-pointer flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="font-bold text-sm text-slate-200 mb-1">
          {selectedFileName ? selectedFileName : 'Drag & drop EHR documents or click to browse'}
        </div>
        <p className="text-xs text-slate-400">Supports PDF, CCDA XML, HL7, DICOM metadata and scanned clinical summaries</p>
      </label>
    </div>
  );
};
