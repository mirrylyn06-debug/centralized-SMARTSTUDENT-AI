import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Filter, 
  X, 
  Send,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Opportunity, OpportunityMatchReport, StudentProfile, Application, DocumentItem } from '../types';
import { calculateOpportunityMatch } from '../utils/matching';

interface OpportunitiesTabProps {
  opportunities: Opportunity[];
  matches: OpportunityMatchReport[];
  profile: StudentProfile;
  applications: Application[];
  documents: DocumentItem[];
  onApply: (opportunityId: string, notes?: string, coverLetter?: string, resumeAttached?: string) => Promise<void>;
  onSaveOpportunity: (opportunityId: string) => Promise<void>;
  initialSelectedOpp?: Opportunity | null;
}

export const OpportunitiesTab: React.FC<OpportunitiesTabProps> = ({
  opportunities,
  matches,
  profile,
  applications,
  documents,
  onApply,
  onSaveOpportunity,
  initialSelectedOpp,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('All');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailOpp, setDetailOpp] = useState<Opportunity | null>(initialSelectedOpp || null);

  // Application Modal state
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [applicationNotes, setApplicationNotes] = useState<string>('');
  const [selectedResume, setSelectedResume] = useState<string>(documents[0]?.name || 'Amina_Kimani_Resume_2026.pdf');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const safeMatches = Array.isArray(matches) ? matches : [];
  const safeApplications = Array.isArray(applications) ? applications : [];
  const safeDocuments = Array.isArray(documents) ? documents : [];

  const typeTabs = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'internship', label: 'Internships' },
    { id: 'industrial_attachment', label: 'Industrial Attachments' },
    { id: 'job', label: 'Jobs & Graduate Roles' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'hackathon', label: 'Competitions & Hackathons' },
    { id: 'fellowship', label: 'Fellowships' },
  ];

  const eligibilityOptions = ['All', 'University', 'College', 'TVET', 'Recent Graduate'];

  const filteredOpps = safeOpportunities.filter((opp) => {
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    const matchesEligibility = 
      selectedEligibility === 'All' || 
      opp.institutionEligibility?.includes(selectedEligibility as any);
    const matchesRemote = !remoteOnly || opp.isRemote;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.skillsRequired?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesEligibility && matchesRemote && matchesSearch;
  });

  const getMatchData = (oppId: string) => {
    const found = safeMatches.find(m => m.opportunityId === oppId);
    if (found) return found;
    const opp = safeOpportunities.find(o => o.id === oppId);
    if (opp) return calculateOpportunityMatch(opp, profile);
    return {
      opportunityId: oppId,
      matchScore: 82,
      matchReason: 'Aligned with your core engineering competencies and course curriculum.',
      skillsMatched: profile.skills.slice(0, 3),
      skillsMissing: [],
      recommendationNote: 'Review requirements and submit early.'
    };
  };

  const isSaved = (oppId: string) => safeApplications.some(a => a.opportunityId === oppId && a.status === 'saved');
  const isAlreadyApplied = (oppId: string) => safeApplications.some(a => a.opportunityId === oppId && a.status !== 'saved');

  // Handle generating AI cover letter
  const handleGenerateCoverLetter = async (opp: Opportunity) => {
    setIsGeneratingCoverLetter(true);
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opp.id,
          customNotes: applicationNotes
        })
      });
      const data = await res.json();
      if (data.letter) {
        setCoverLetter(data.letter);
      }
    } catch (err) {
      console.error('Failed to generate cover letter:', err);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleOpenApplyModal = (opp: Opportunity) => {
    setDetailOpp(opp);
    setIsApplying(true);
    setSubmittedSuccess(false);
    // Prefill if not generated
    if (!coverLetter) {
      setCoverLetter(`Dear Hiring Team at ${opp.organization},\n\nI am writing to express my eager interest in the ${opp.title} position. As a student in ${profile.course} at ${profile.institutionName}, I have built skills in ${profile.skills.slice(0, 4).join(', ')} that align directly with your requirements.\n\nSincerely,\n${profile.fullName}`);
    }
  };

  const handleSubmitApplication = async () => {
    if (!detailOpp) return;
    setIsSubmitting(true);
    try {
      await onApply(detailOpp.id, applicationNotes, coverLetter, selectedResume);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setIsApplying(false);
        setSubmittedSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Application failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Opportunities Hub (Digital Superhighway)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified internships, TVET industrial attachments, jobs, scholarships, and innovation competitions.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role, company, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs & Selectors */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {typeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sub Filters: Eligibility & Remote */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Eligibility:
            </span>
            <div className="flex items-center gap-1">
              {eligibilityOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedEligibility(opt)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedEligibility === opt
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span>Remote Opportunities Only</span>
          </label>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filteredOpps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No matching opportunities found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your category filter or search keywords. You can also view all opportunities across TVET and universities.
            </p>
            <button
              onClick={() => { setSelectedType('all'); setSelectedEligibility('All'); setRemoteOnly(false); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredOpps.map((opp) => {
            const match = getMatchData(opp.id);
            const applied = isAlreadyApplied(opp.id);
            const saved = isSaved(opp.id);

            return (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={opp.orgLogo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120'}
                    alt={opp.organization}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {opp.type.replace('_', ' ')}
                      </span>
                      {opp.isRemote ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          Remote
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> {opp.location}
                        </span>
                      )}
                      <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Deadline: {opp.deadline}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setDetailOpp(opp)}
                      className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
                    >
                      {opp.title}
                    </h3>
                    
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.organization}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-700 font-bold">{opp.stipendOrReward}</span>
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                      {opp.description}
                    </p>

                    {/* Required Skills Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400">Skills:</span>
                      {opp.skillsRequired.map((s) => {
                        const isStudentSkill = profile.skills.some(ps => ps.toLowerCase() === s.toLowerCase());
                        return (
                          <span
                            key={s}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                              isStudentSkill
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            {isStudentSkill ? '✓ ' : ''}{s}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Action & Match Column */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  {/* AI Match Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{match.matchScore}% AI Match</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSaveOpportunity(opp.id)}
                      title={saved ? 'Opportunity Saved' : 'Save for later'}
                      className={`p-2 rounded-xl border transition-colors ${
                        saved 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setDetailOpp(opp)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                    >
                      View Details
                    </button>

                    {applied ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenApplyModal(opp)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Opportunity Detail & Application Modal */}
      {detailOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={detailOpp.orgLogo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120'}
                  alt={detailOpp.organization}
                  className="w-12 h-12 rounded-xl object-cover bg-white p-1"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-white/10 px-2 py-0.5 rounded">
                    {detailOpp.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-lg font-extrabold font-['Outfit'] mt-1">
                    {detailOpp.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {detailOpp.organization} • {detailOpp.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => { setDetailOpp(null); setIsApplying(false); }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Stipend & Deadline Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Compensation/Reward</span>
                  <span className="font-bold text-slate-900">{detailOpp.stipendOrReward}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Application Deadline</span>
                  <span className="font-bold text-rose-600">{detailOpp.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligible Students</span>
                  <span className="font-bold text-indigo-700">{detailOpp.institutionEligibility.join(', ')}</span>
                </div>
              </div>

              {/* AI Match Diagnostic */}
              {(() => {
                const match = getMatchData(detailOpp.id);
                return (
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 font-['Outfit']">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        AI Profile Match: {match.matchScore}%
                      </span>
                      <span className="text-[11px] font-semibold text-indigo-700">
                        {match.matchScore >= 80 ? 'High Fit Candidate' : 'Moderate Fit'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {match.matchReason}
                    </p>
                    <p className="text-xs text-indigo-950 font-medium italic">
                      💡 Tip: {match.recommendationNote}
                    </p>
                  </div>
                );
              })()}

              {/* Full Description & Requirements */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Role Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {detailOpp.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Candidate Requirements
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {detailOpp.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Application Form Section */}
              {isApplying ? (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                      <Send className="w-4 h-4 text-indigo-600" />
                      <span>Submit Application</span>
                    </h4>
                    <button
                      onClick={() => handleGenerateCoverLetter(detailOpp)}
                      disabled={isGeneratingCoverLetter}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-1.5 hover:bg-teal-100 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingCoverLetter ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      )}
                      <span>Tailor Letter with AI</span>
                    </button>
                  </div>

                  {/* Attached Document Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Select Document to Attach</label>
                    <select
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    >
                      {documents.map((doc) => (
                        <option key={doc.id} value={doc.name}>
                          {doc.name} ({doc.type.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cover Letter Editor */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
                      <span>Cover Letter / Pitch</span>
                      <span className="text-slate-400 font-normal">Editable</span>
                    </div>
                    <textarea
                      rows={6}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                      placeholder="Write or customize your application letter..."
                    />
                  </div>

                  {/* Additional notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Internal Tracking Notes (Optional)</label>
                    <input
                      type="text"
                      value={applicationNotes}
                      onChange={(e) => setApplicationNotes(e.target.value)}
                      placeholder="e.g., Referred by Prof. Ochieng; interview scheduled on 25th"
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                    />
                  </div>

                  {submittedSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Application submitted successfully! Added to your application tracker.</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsApplying(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting || submittedSuccess}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Questions? Contact through official institutional career link.
                  </div>
                  <button
                    onClick={() => handleOpenApplyModal(detailOpp)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
                  >
                    <span>Proceed to Apply</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
