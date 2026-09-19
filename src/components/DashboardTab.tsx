import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Compass, 
  Award, 
  Target, 
  Zap, 
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { Course, CourseProgress, Opportunity, StudentProfile, Application, OpportunityMatchReport } from '../types';
import { calculateOpportunityMatch } from '../utils/matching';

interface DashboardTabProps {
  profile: StudentProfile;
  courses: Course[];
  progressList: CourseProgress[];
  opportunities: Opportunity[];
  applications: Application[];
  matches: OpportunityMatchReport[];
  onNavigate: (tab: string) => void;
  onSelectCourse: (course: Course) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  courses,
  progressList,
  opportunities,
  applications,
  matches,
  onNavigate,
  onSelectCourse,
  onSelectOpportunity,
}) => {
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeProgressList = Array.isArray(progressList) ? progressList : [];
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const safeApplications = Array.isArray(applications) ? applications : [];
  const safeMatches = Array.isArray(matches) ? matches : [];

  // Compute metrics
  const totalCompletedLessons = safeProgressList.reduce((acc, p) => acc + (p.completedLessonIds?.length || 0), 0);
  const activeApplications = safeApplications.filter(a => a.status !== 'saved');
  const topMatchedOpps = safeOpportunities.slice(0, 3).map(opp => {
    const dynamicMatch = calculateOpportunityMatch(opp, profile);
    const serverMatch = safeMatches.find(m => m.opportunityId === opp.id);
    return {
      opportunity: opp,
      matchScore: serverMatch?.matchScore ?? dynamicMatch.matchScore,
      matchReason: serverMatch?.matchReason ?? dynamicMatch.matchReason,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart Student AI • Digital Superhighway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] text-white">
              Welcome back, {profile.fullName.split(' ')[0]}!
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Pursuing <span className="text-teal-300 font-medium">{profile.course}</span> at {profile.institutionName}. 
              Your target career goal is <span className="text-indigo-300 font-medium">{profile.careerGoal}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400">Current Focus:</span>
              {profile.skills.slice(0, 5).map((skill) => (
                <span key={skill} className="px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 text-xs font-medium border border-white/10">
                  {skill}
                </span>
              ))}
              {profile.skills.length > 5 && (
                <span className="text-xs text-slate-400">+{profile.skills.length - 5} more</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('ai-hub')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <BotIcon className="w-4 h-4" />
              <span>Ask AI Student Assistant</span>
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 flex items-center justify-center gap-2 transition-all"
            >
              <Briefcase className="w-4 h-4 text-teal-400" />
              <span>Explore Opportunities</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lessons Completed</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {totalCompletedLessons}
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2 this week
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across enrolled interactive modules</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Opportunities Active</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {opportunities.length}
            </span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Internships, attachments, jobs & grants</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Applications Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {activeApplications.length}
            </span>
            <span className="text-xs text-slate-400">/ {applications.length} saved</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Pipeline & interview readiness</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Skill Match Avg</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              88%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              High Fit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Based on course + skills + goals</p>
        </div>
      </div>

      {/* Main Grid: AI Matched Opportunities & Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Recommendations & Top Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Matched Opportunities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span>AI-Matched Opportunities for You</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Calculated against your course ({profile.course}) and {profile.skills.length} verified skills
                </p>
              </div>
              <button
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
              >
                View all ({opportunities.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {topMatchedOpps.map(({ opportunity: opp, matchScore, matchReason }) => (
                <div 
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp)}
                  className="group p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img 
                      src={opp.orgLogo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'} 
                      alt={opp.organization} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                          {opp.type.replace('_', ' ')}
                        </span>
                        {opp.isRemote && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Remote Available
                          </span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due {opp.deadline}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base leading-snug">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {opp.organization} • <span className="text-slate-500">{opp.location}</span>
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        "{matchReason}"
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{matchScore}% Match</span>
                    </div>
                    <span className="text-xs font-medium text-slate-700 hidden sm:block">
                      {opp.stipendOrReward}
                    </span>
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Superhighway Architectural Bridge */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-teal-200/70">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 rounded-md bg-teal-600 text-white text-xs font-bold">
                SUPERHIGHWAY
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm font-['Outfit']">
                How SMARTSTUDENT AI Connects Your Career Journey
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              A unified digital pipeline connecting TVET, College, and University students directly to industry:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/80">
                <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-1">
                  1
                </div>
                <p className="text-xs font-bold text-slate-800">Student Profile</p>
                <p className="text-[10px] text-slate-500">Course, Skills & Goals</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/80">
                <div className="w-7 h-7 mx-auto rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs mb-1">
                  2
                </div>
                <p className="text-xs font-bold text-slate-800">Learning Hub</p>
                <p className="text-[10px] text-slate-500">Hands-on Lessons</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/80">
                <div className="w-7 h-7 mx-auto rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mb-1">
                  3
                </div>
                <p className="text-xs font-bold text-slate-800">AI Matching</p>
                <p className="text-[10px] text-slate-500">Skills Gap & Fit</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/80">
                <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-1">
                  4
                </div>
                <p className="text-xs font-bold text-slate-800">Placement</p>
                <p className="text-[10px] text-slate-500">Attachments & Jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Enrolled Courses & AI Career Quick Actions */}
        <div className="space-y-6">
          {/* Active Learning Progress */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>My Learning Progress</span>
              </h2>
              <button 
                onClick={() => onNavigate('courses')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Browse All
              </button>
            </div>

            <div className="space-y-4">
              {safeCourses.slice(0, 2).map((course) => {
                const prog = safeProgressList.find(p => p.courseId === course.id);
                const completedCount = prog?.completedLessonIds?.filter(id => course.lessons?.some(l => l.id === id)).length ?? (prog?.completedLessonIds?.length ?? 0);
                const totalCount = Math.max(1, course.lessons?.length || 1);
                const pct = Math.min(100, Math.max(0, Math.round((completedCount / totalCount) * 100)));

                return (
                  <div 
                    key={course.id}
                    onClick={() => onSelectCourse(course)}
                    className="p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 cursor-pointer transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {course.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1 line-clamp-2">
                          {course.title}
                        </h4>
                      </div>
                      <span className="text-xs font-extrabold text-slate-700 shrink-0">
                        {pct}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{completedCount} of {totalCount} lessons completed</span>
                      <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                        Continue <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('courses')}
              className="w-full mt-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors text-center"
            >
              Explore Course Catalog & Certifications
            </button>
          </div>

          {/* AI Skills-Gap Quick Action Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
            
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-500 text-slate-950">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm font-['Outfit']">
                  AI Skills-Gap Analyzer
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aiming for <strong>"{profile.careerGoal}"</strong>? Let SMARTSTUDENT AI identify missing competencies and map a 6-week curriculum.
              </p>
              <button
                onClick={() => onNavigate('ai-hub')}
                className="w-full py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Run Skills-Gap Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
