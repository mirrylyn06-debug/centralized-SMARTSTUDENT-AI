import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Loader2, 
  AlertCircle,
  FileCheck,
  Award,
  BookOpen
} from 'lucide-react';
import { DocumentItem, StudentProfile } from '../types';

interface DocumentsTabProps {
  documents: DocumentItem[];
  profile: StudentProfile;
  onUploadDocument: (name: string, type: 'cv' | 'certificate' | 'transcript' | 'portfolio', size: string) => Promise<void>;
  onDeleteDocument: (id: string) => Promise<void>;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  profile,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const [docName, setDocName] = useState<string>('');
  const [docType, setDocType] = useState<'cv' | 'certificate' | 'transcript' | 'portfolio'>('cv');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const safeDocuments = Array.isArray(documents) ? documents : [];

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    setIsUploading(true);
    try {
      const extension = docType === 'portfolio' ? 'link' : 'pdf';
      const cleanName = docName.endsWith(`.${extension}`) ? docName : `${docName}.${extension}`;
      await onUploadDocument(cleanName, docType, '1.4 MB');
      setDocName('');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunDocAnalysis = async (doc: DocumentItem) => {
    setAnalyzingDocId(doc.id);
    try {
      const res = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: doc.name,
          documentType: doc.type,
        })
      });
      const data = await res.json();
      setAnalysisResult({ ...data, docName: doc.name });
    } catch (err) {
      console.error('Document analysis error:', err);
    } finally {
      setAnalyzingDocId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Student Document & Portfolio Vault</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Store and verify your CVs, academic transcripts, and certifications for one-click application submission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Upload Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Upload New Document</span>
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800"
                >
                  <option value="cv">Curriculum Vitae (CV / Resume)</option>
                  <option value="transcript">Official Academic Transcript</option>
                  <option value="certificate">Certification / Training Credential</option>
                  <option value="portfolio">Portfolio Document / Link</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Document Name / Title
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Amina_Kimani_CV_Updated"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                  required
                />
              </div>

              {/* Drag & Drop Visual Zone */}
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-2 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  PDF, DOCX, or Image (Max 15MB)
                </p>
                <p className="text-[11px] text-slate-400">
                  Verified automatically for ATS compliance
                </p>
              </div>

              <button
                type="submit"
                disabled={isUploading || !docName.trim()}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>Add to Vault</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Cols: Document List & AI ATS Review */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
              Verified Documents ({safeDocuments.length})
            </h3>

            <div className="space-y-3">
              {safeDocuments.map((doc) => {
                const isAnalyzing = analyzingDocId === doc.id;
                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                          {doc.type === 'cv' ? <FileText className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              {doc.name}
                            </h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {doc.type}
                            </span>
                            {doc.verified && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Uploaded {doc.uploadDate} • {doc.fileSize}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleRunDocAnalysis(doc)}
                          disabled={isAnalyzing}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                          )}
                          <span>AI ATS Review</span>
                        </button>

                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {doc.parsedSummary && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {doc.parsedSummary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI ATS Review Results Card */}
          {analysisResult && (
            <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-['Outfit']">
                    AI ATS Diagnostic: {analysisResult.docName}
                  </h3>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                  Readiness: {analysisResult.score}/100
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Strengths */}
                <div className="space-y-2 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ATS Strengths</span>
                  </h4>
                  <ul className="space-y-1.5 text-emerald-950">
                    {analysisResult.strengths?.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="space-y-2 p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                  <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Recommended Enhancements</span>
                  </h4>
                  <ul className="space-y-1.5 text-amber-950">
                    {analysisResult.improvements?.map((imp: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {analysisResult.suggestedSummary && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">AI-Optimized Bio / Headline Summary:</span>
                  <p className="italic leading-relaxed text-slate-800">
                    "{analysisResult.suggestedSummary}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
