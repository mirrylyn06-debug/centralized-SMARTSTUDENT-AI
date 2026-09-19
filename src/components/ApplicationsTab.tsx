import React, { useState } from 'react';
import { 
  FolderKanban, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  FileText, 
  ExternalLink, 
  Edit3, 
  Save, 
  X,
  ChevronRight,
  Filter,
  Database,
  Sparkles
} from 'lucide-react';
import { Application, ApplicationStatus, Opportunity } from '../types';

interface ApplicationsTabProps {
  applications: Application[];
  onUpdateStatus: (applicationId: string, status: ApplicationStatus, notes?: string, interviewDate?: string) => Promise<void>;
  onNavigateToOpp: (opp: Opportunity) => void;
}

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  applications,
  onUpdateStatus,
  onNavigateToOpp,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('applied');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editInterviewDate, setEditInterviewDate] = useState<string>('');

  const statusColors: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
    saved: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    under_review: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    shortlisted: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    interview_scheduled: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  };

  const statusLabels: Record<ApplicationStatus, string> = {
    saved: 'Saved / Bookmark',
    applied: 'Applied',
    under_review: 'Under Review',
    shortlisted: 'Shortlisted',
    interview_scheduled: 'Interview Scheduled',
    accepted: 'Offer Accepted / Approved',
    rejected: 'Declined / Archived',
  };

  const safeApplications = Array.isArray(applications) ? applications : [];

  const filteredApps = safeApplications.filter(app => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return app.status !== 'saved' && app.status !== 'rejected';
    return app.status === selectedFilter;
  });

  const handleStartEdit = (app: Application) => {
    setEditingAppId(app.id);
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
    setEditInterviewDate(app.interviewDate || '');
  };

  const handleSaveEdit = async () => {
    if (!editingAppId) return;
    await onUpdateStatus(editingAppId, editStatus, editNotes, editInterviewDate);
    setEditingAppId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            <span>Applications Tracker & Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor your submissions, update recruitment milestones, and schedule interviews.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setSelectedFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'active' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active Pipeline
          </button>
          <button
            onClick={() => setSelectedFilter('interview_scheduled')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'interview_scheduled' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Interviews
          </button>
        </div>
      </div>

      {/* Active Database Application Pipeline Banner */}
      {applications.some(a => a.id === 'app-database' || a.opportunityId === 'opp-database' || a.opportunity?.title?.includes('Database')) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5 sm:mt-0">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Database Application Active
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Cloud Database Administrator & Distributed SQL Systems
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Application synced in local persistent storage (<code className="font-mono text-white text-[11px]">data/database.json</code>). Status: Interview Scheduled for Sep 28, 2026.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              Paid (KES 75,000 / mo)
            </span>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
            <FolderKanban className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No applications in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore the Opportunities tab to find internships, attachments, and jobs matching your student profile!
            </p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const opp = app.opportunity;
            const style = statusColors[app.status] || statusColors.applied;
            const isEditing = editingAppId === app.id;
            const isDatabaseApp = app.id === 'app-database' || app.opportunityId === 'opp-database' || opp?.title?.includes('Database');

            return (
              <div
                key={app.id}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 ${
                  isDatabaseApp 
                    ? 'border-indigo-300 ring-2 ring-indigo-500/10 shadow-sm' 
                    : 'border-slate-200/80 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {opp?.orgLogo ? (
                      <img
                        src={opp.orgLogo}
                        alt={opp.organization}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isDatabaseApp && (
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1 shadow-2xs">
                            <Database className="w-3 h-3 text-indigo-600" />
                            Database Application
                          </span>
                        )}
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                          {statusLabels[app.status]}
                        </span>
                        <span className="text-xs text-slate-400">
                          Applied: {app.appliedDate}
                        </span>
                        <span className="text-xs text-slate-400">
                          • Updated: {app.lastUpdated}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                        {opp?.title || 'Opportunity Application'}
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold">
                        {opp?.organization || 'Organization'} • <span className="text-slate-500 font-normal">{opp?.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {opp && (
                      <button
                        onClick={() => onNavigateToOpp(opp)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>View Opportunity</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(app)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Stage</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit Drawer inside card */}
                {isEditing ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Update Application Status & Milestones
                      </h4>
                      <button
                        onClick={() => setEditingAppId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Recruitment Stage</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        >
                          <option value="saved">Saved / Bookmark</option>
                          <option value="applied">Applied</option>
                          <option value="under_review">Under Review</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview_scheduled">Interview Scheduled</option>
                          <option value="accepted">Accepted / Approved</option>
                          <option value="rejected">Declined / Closed</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Interview Date (if scheduled)</label>
                        <input
                          type="date"
                          value={editInterviewDate}
                          onChange={(e) => setEditInterviewDate(e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Private Notes / Interview Prep</label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="e.g. Technical interview with Lead Engineer on Zoom; prepare SQL & React questions"
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingAppId(null)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Status</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                    {app.notes && (
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-medium">Notes:</span>
                        <p className="text-slate-700 italic">"{app.notes}"</p>
                      </div>
                    )}
                    {app.interviewDate && (
                      <div className="space-y-0.5">
                        <span className="text-indigo-600 font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Scheduled Interview:
                        </span>
                        <p className="text-slate-900 font-semibold">{app.interviewDate}</p>
                      </div>
                    )}
                    {app.resumeAttached && (
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-medium">Attached Document:</span>
                        <p className="text-slate-700 font-medium flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          {app.resumeAttached}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
