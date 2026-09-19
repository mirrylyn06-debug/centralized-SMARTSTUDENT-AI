import React, { useState, useEffect } from 'react';
import { parseResponseSafely } from '../utils/api';
import { 
  KeyRound, 
  Copy, 
  Check, 
  Database, 
  ShieldCheck, 
  UserCheck, 
  X, 
  ExternalLink,
  Server, 
  HardDrive, 
  Briefcase, 
  Mail, 
  Lock, 
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminLogin: () => void;
  onOpenStudentLogin: () => void;
  onNavigateToApplications: () => void;
}

interface DatabaseStatusData {
  status: string;
  connected: boolean;
  storageEngine: string;
  filePath: string;
  sizeBytes: number;
  tables: {
    students: number;
    courses: number;
    opportunities: number;
    applications: number;
    documents: number;
    notifications: number;
  };
  hasDatabaseApplication: boolean;
  lastSynced: string;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminLogin,
  onOpenStudentLogin,
  onNavigateToApplications
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatusData | null>(null);
  const [loadingDb, setLoadingDb] = useState<boolean>(false);

  const fetchDbStatus = async () => {
    setLoadingDb(true);
    try {
      const res = await fetch('/api/database/status');
      if (res.ok) {
        const { data } = await parseResponseSafely<DatabaseStatusData>(res, null as any);
        if (data) setDbStatus(data);
      }
    } catch {
      // fallback
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close credentials dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-['Outfit'] flex items-center gap-2">
                <span>Account Credentials & Database Info</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Verified
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Quick reference for platform accounts and active persistent database status
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* User's Project Account */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                @
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Associated Project Owner Email
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  mirrylyn06@gmail.com
                </div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard('mirrylyn06@gmail.com', 'owner-email')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'owner-email' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Admin Credentials */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-50/70 to-white border border-indigo-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-indigo-950 text-sm">
                      Admin Portal Account
                    </h3>
                    <p className="text-[11px] text-indigo-700 font-semibold">
                      Full institutional administrative access
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Admin Email</div>
                    <div className="font-mono font-bold text-slate-800 text-xs truncate">
                      admin@smartstudent.ai
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('admin@smartstudent.ai', 'admin-email')}
                    className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-700 transition-colors shrink-0"
                    title="Copy Admin Email"
                  >
                    {copiedKey === 'admin-email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Admin Password</div>
                    <div className="font-mono font-bold text-indigo-700 text-xs">
                      Admin@2026!
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('Admin@2026!', 'admin-pw')}
                    className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-700 transition-colors shrink-0"
                    title="Copy Admin Password"
                  >
                    {copiedKey === 'admin-pw' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Log In to Admin Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Student Credentials */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-teal-50/70 to-white border border-teal-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-teal-950 text-sm">
                      Demo Student Account
                    </h3>
                    <p className="text-[11px] text-teal-700 font-semibold">
                      Amina Kimani (Computer Science, UoN)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-teal-100 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Student Email</div>
                    <div className="font-mono font-bold text-slate-800 text-xs truncate">
                      amina.kimani@student.uonbi.ac.ke
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('amina.kimani@student.uonbi.ac.ke', 'student-email')}
                    className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-500 hover:text-teal-700 transition-colors shrink-0"
                    title="Copy Student Email"
                  >
                    {copiedKey === 'student-email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-teal-100 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Student Password</div>
                    <div className="font-mono font-bold text-teal-700 text-xs">
                      Student@2026
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('Student@2026', 'student-pw')}
                    className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-500 hover:text-teal-700 transition-colors shrink-0"
                    title="Copy Student Password"
                  >
                    {copiedKey === 'student-pw' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenStudentLogin();
                }}
                className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Switch / Register Student</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Database & Application Status Card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">
                    Database Storage Engine & Active Application
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    File-backed persistent storage located at <code className="text-indigo-300 font-mono">data/database.json</code>
                  </p>
                </div>
              </div>
              <button
                onClick={fetchDbStatus}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Refresh database status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* New Database Application Highlight */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      New Database Application Added
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Interview Scheduled (Sep 28, 2026)
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-white mt-1">
                    Cloud Database Administrator & Distributed SQL Systems Intern
                  </h5>
                  <p className="text-[11px] text-slate-300">
                    Kenya Cloud Data Centre & Safaricom Data Infrastructure • Paid (KES 75,000/mo)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigateToApplications();
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors self-start sm:self-center"
              >
                <span>View in Pipeline</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Collections stats row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Database</div>
                <div className="font-extrabold text-emerald-400 mt-0.5 text-xs">Online</div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Applications</div>
                <div className="font-extrabold text-white mt-0.5 text-xs">
                  {dbStatus?.tables?.applications || 4}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Opportunities</div>
                <div className="font-extrabold text-white mt-0.5 text-xs">
                  {dbStatus?.tables?.opportunities || 7}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Courses</div>
                <div className="font-extrabold text-white mt-0.5 text-xs">
                  {dbStatus?.tables?.courses || 6}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Documents</div>
                <div className="font-extrabold text-white mt-0.5 text-xs">
                  {dbStatus?.tables?.documents || 4}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Notifications</div>
                <div className="font-extrabold text-white mt-0.5 text-xs">
                  {dbStatus?.tables?.notifications || 4}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            SMARTSTUDENT AI • Secure Authentication & Persistent Storage
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
