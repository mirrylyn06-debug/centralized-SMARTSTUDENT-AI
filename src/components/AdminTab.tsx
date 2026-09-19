import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  Users, 
  Briefcase, 
  BookOpen, 
  FileCheck, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Calendar,
  Send,
  Loader2,
  Database,
  KeyRound,
  Download,
  Copy,
  Check,
  Server
} from 'lucide-react';
import { Application, Course, Opportunity, PlatformStats } from '../types';

interface AdminTabProps {
  stats: PlatformStats;
  opportunities: Opportunity[];
  courses: Course[];
  applications: Application[];
  onAddOpportunity: (opp: Partial<Opportunity>) => Promise<void>;
  onAddCourse: (course: Partial<Course>) => Promise<void>;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  stats,
  opportunities,
  courses,
  applications,
  onAddOpportunity,
  onAddCourse,
}) => {
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeApplications = Array.isArray(applications) ? applications : [];

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'analytics' | 'add_opportunity' | 'add_course' | 'review_applications' | 'database'>('analytics');
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (activeAdminSubTab === 'database') {
      fetch('/api/database/status')
        .then(r => r.json())
        .then(data => setDbStatus(data))
        .catch(err => console.error('Failed to load DB status:', err));
    }
  }, [activeAdminSubTab]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // New Opportunity Form
  const [oppTitle, setOppTitle] = useState('');
  const [oppOrg, setOppOrg] = useState('');
  const [oppType, setOppType] = useState('internship');
  const [oppLocation, setOppLocation] = useState('Nairobi / Hybrid');
  const [oppIsRemote, setOppIsRemote] = useState(false);
  const [oppDeadline, setOppDeadline] = useState('2026-11-30');
  const [oppStipend, setOppStipend] = useState('Paid (KES 50,000 / mo)');
  const [oppDesc, setOppDesc] = useState('');
  const [oppReqs, setOppReqs] = useState('');
  const [oppSkills, setOppSkills] = useState('Python, JavaScript, SQL');
  const [oppEligibility, setOppEligibility] = useState<string[]>(['University', 'TVET', 'College']);
  const [isPublishingOpp, setIsPublishingOpp] = useState(false);
  const [oppSuccess, setOppSuccess] = useState(false);

  // New Course Form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCat, setCourseCat] = useState('Software & Tech');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [courseInstructor, setCourseInstructor] = useState('Eng. Jane Mutua');
  const [courseDuration, setCourseDuration] = useState('4 Weeks (16 Hours)');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseTags, setCourseTags] = useState('AI, Cloud, Python');
  const [isPublishingCourse, setIsPublishingCourse] = useState(false);
  const [courseSuccess, setCourseSuccess] = useState(false);

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle || !oppOrg) return;
    setIsPublishingOpp(true);
    try {
      await onAddOpportunity({
        title: oppTitle,
        organization: oppOrg,
        type: oppType as any,
        location: oppLocation,
        isRemote: oppIsRemote,
        deadline: oppDeadline,
        stipendOrReward: oppStipend,
        description: oppDesc || 'Hands-on practical placement for ambitious students.',
        requirements: oppReqs ? oppReqs.split('\n') : ['Currently enrolled in accredited diploma or degree', 'Strong drive to learn'],
        skillsRequired: oppSkills.split(',').map(s => s.trim()),
        targetCourses: ['Computer Science', 'Engineering', 'TVET ICT', 'Business'],
        institutionEligibility: oppEligibility as any,
        featured: true,
      });
      setOppSuccess(true);
      setTimeout(() => {
        setOppSuccess(false);
        setOppTitle('');
        setOppDesc('');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishingOpp(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;
    setIsPublishingCourse(true);
    try {
      await onAddCourse({
        title: courseTitle,
        category: courseCat as any,
        level: courseLevel as any,
        instructor: courseInstructor,
        instructorTitle: 'Industry Mentor & Certified Instructor',
        duration: courseDuration,
        description: courseDesc || 'Comprehensive skill-building course designed for modern workforce requirements.',
        tags: courseTags.split(',').map(s => s.trim()),
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        lessons: [
          {
            id: `l-${Date.now()}-1`,
            title: 'Module 1: Principles and Industry Fundamentals',
            duration: '35 min',
            summary: 'Core concepts and standard workflow methodologies.',
            content: 'Detailed educational notes covering system architecture, practical guidelines, and hands-on examples.'
          }
        ]
      });
      setCourseSuccess(true);
      setTimeout(() => {
        setCourseSuccess(false);
        setCourseTitle('');
        setCourseDesc('');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishingCourse(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration & Superhighway Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit']">
            Institutional Management Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Oversee educational courses, manage employer opportunity listings, review student pipelines, and inspect real-time platform metrics.
          </p>
        </div>

        {/* Subtab Selector */}
        <div className="flex flex-wrap gap-1.5 bg-slate-800 p-1 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveAdminSubTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeAdminSubTab === 'analytics' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Analytics & Impact
          </button>
          <button
            onClick={() => setActiveAdminSubTab('add_opportunity')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeAdminSubTab === 'add_opportunity' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            + Post Opportunity
          </button>
          <button
            onClick={() => setActiveAdminSubTab('add_course')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeAdminSubTab === 'add_course' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            + Add Course
          </button>
          <button
            onClick={() => setActiveAdminSubTab('review_applications')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeAdminSubTab === 'review_applications' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('database')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeAdminSubTab === 'database' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-amber-300 hover:text-white bg-amber-400/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database & Creds</span>
          </button>
        </div>
      </div>

      {/* --- SUBTAB 1: ANALYTICS & IMPACT METRICS --- */}
      {activeAdminSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Connected Students</span>
              <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
                {stats.totalStudents.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                +14% TVET and University signups
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Live Opportunities</span>
              <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
                {stats.activeOpportunities}
              </div>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                From {stats.partnerOrganizations} verified partners
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Courses</span>
              <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
                {stats.totalCourses}
              </div>
              <p className="text-xs text-teal-600 font-semibold mt-1">
                Vocational & Academic curricula
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Applications Placed</span>
              <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
                {stats.applicationsSubmitted.toLocaleString()}
              </div>
              <p className="text-xs text-purple-600 font-semibold mt-1">
                {stats.matchingSuccessRate}% AI match correlation
              </p>
            </div>
          </div>

          {/* Demographic & Superhighway Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">
                Student Institution Type Distribution
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Universities (Public & Private)</span>
                    <span className="text-indigo-600 font-bold">52% (25,438)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '52%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>TVET Colleges & Institutes</span>
                    <span className="text-teal-600 font-bold">34% (16,632)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: '34%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Polytechnics & Vocational Centers</span>
                    <span className="text-amber-600 font-bold">14% (6,850)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">
                Top In-Demand Skills on the Superhighway
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Python & AI</span>
                  <span className="text-emerald-700 font-bold">+42%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Full Stack Web</span>
                  <span className="text-emerald-700 font-bold">+38%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Solar & Renewable PV</span>
                  <span className="text-emerald-700 font-bold">+31%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Telecommunications</span>
                  <span className="text-emerald-700 font-bold">+26%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: POST OPPORTUNITY --- */}
      {activeAdminSubTab === 'add_opportunity' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>Post New Student Opportunity</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly notifies matching TVET, College, and University students via the AI Opportunity Matcher.
            </p>
          </div>

          <form onSubmit={handleCreateOpportunity} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={oppTitle}
                  onChange={(e) => setOppTitle(e.target.value)}
                  placeholder="e.g. AI Research Intern / Solar Systems Trainee"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={oppOrg}
                  onChange={(e) => setOppOrg(e.target.value)}
                  placeholder="e.g. Kenya Power, Safaricom, Microsoft, UNEP"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Type</label>
                <select
                  value={oppType}
                  onChange={(e) => setOppType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="internship">Internship</option>
                  <option value="industrial_attachment">Industrial Attachment</option>
                  <option value="job">Job / Graduate Role</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="hackathon">Hackathon / Competition</option>
                  <option value="fellowship">Fellowship</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={oppLocation}
                  onChange={(e) => setOppLocation(e.target.value)}
                  placeholder="e.g. Nairobi / Mombasa / Remote"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={oppDeadline}
                  onChange={(e) => setOppDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Compensation / Stipend / Award</label>
                <input
                  type="text"
                  value={oppStipend}
                  onChange={(e) => setOppStipend(e.target.value)}
                  placeholder="e.g. Paid (KES 45,000 / mo)"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={oppSkills}
                  onChange={(e) => setOppSkills(e.target.value)}
                  placeholder="e.g. Python, SQL, React, Git"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Detailed Description</label>
              <textarea
                rows={3}
                value={oppDesc}
                onChange={(e) => setOppDesc(e.target.value)}
                placeholder="Responsibilities, learning outcomes, mentorship structure..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Requirements (one per line)</label>
              <textarea
                rows={3}
                value={oppReqs}
                onChange={(e) => setOppReqs(e.target.value)}
                placeholder="Enrolled in TVET Diploma or Degree in Computing&#10;Familiarity with basic programming&#10;Recommendation letter from institution"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={oppIsRemote}
                  onChange={(e) => setOppIsRemote(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>Remote / Virtual Placement Available</span>
              </label>
            </div>

            {oppSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Opportunity published successfully and matched to student feeds!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPublishingOpp}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isPublishingOpp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Publish to Superhighway Board</span>
            </button>
          </form>
        </div>
      )}

      {/* --- SUBTAB 3: ADD COURSE --- */}
      {activeAdminSubTab === 'add_course' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Publish Course to Learning Hub</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add curriculum modules, reading materials, quizzes, and certificates.
            </p>
          </div>

          <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Applied Cyber Security & Network Defense"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={courseCat}
                  onChange={(e) => setCourseCat(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Software & Tech">Software & Tech</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Engineering & TVET">Engineering & TVET</option>
                  <option value="Career & Soft Skills">Career & Soft Skills</option>
                  <option value="Business & Innovation">Business & Innovation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Level</label>
                <select
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Duration</label>
                <input
                  type="text"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  placeholder="e.g. 4 Weeks (16 Hours)"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instructor</label>
                <input
                  type="text"
                  value={courseInstructor}
                  onChange={(e) => setCourseInstructor(e.target.value)}
                  placeholder="e.g. Dr. Alex Kamau"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Course Description</label>
              <textarea
                rows={3}
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="Comprehensive technical overview of what students will master..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Skills & Topic Tags (comma separated)</label>
              <input
                type="text"
                value={courseTags}
                onChange={(e) => setCourseTags(e.target.value)}
                placeholder="e.g. Python, Network Security, TVET, Linux"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            {courseSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Course created and enrolled in Learning Hub catalog!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPublishingCourse}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isPublishingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              <span>Add to Learning Hub</span>
            </button>
          </form>
        </div>
      )}

      {/* --- SUBTAB 4: APPLICATIONS REVIEW --- */}
      {activeAdminSubTab === 'review_applications' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 font-['Outfit'] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <span>Student Application Influx</span>
            </h3>
            <p className="text-xs text-slate-500">
              Review candidates, track employer interviews, and verify documents.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Opportunity</th>
                  <th className="py-3 px-3">Organization</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Applied Date</th>
                  <th className="py-3 px-3">Attached Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {app.opportunity?.title || 'Unknown Opportunity'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {app.opportunity?.organization}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {app.appliedDate}
                    </td>
                    <td className="py-3 px-3 text-indigo-600 font-medium">
                      {app.resumeAttached || 'Default_CV.pdf'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUBTAB 5: DATABASE & CREDENTIALS --- */}
      {activeAdminSubTab === 'database' && (
        <div className="space-y-6">
          {/* Database Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-lg">Application Database Engine</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Persistent & Synchronized
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    File-backed persistent storage located at <code className="font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">data/database.json</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/api/database/export"
                  download="smartstudent-database.json"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup JSON</span>
                </a>
              </div>
            </div>

            {/* Collection Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Opportunities</span>
                <span className="text-xl font-black text-slate-900">{safeOpportunities.length}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Courses</span>
                <span className="text-xl font-black text-slate-900">{safeCourses.length}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Applications</span>
                <span className="text-xl font-black text-indigo-700">{safeApplications.length}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">DB Size</span>
                <span className="text-xl font-black text-slate-900">{dbStatus ? `${(dbStatus.sizeBytes / 1024).toFixed(1)} KB` : 'Active'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                <span className="text-xs font-black text-emerald-600 uppercase block mt-1">Operational</span>
              </div>
            </div>
          </div>

          {/* User & Admin Credentials Reminder Card */}
          <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Platform Credentials Reminder</h3>
                  <p className="text-xs text-slate-600">Saved login credentials for administrator access and student profiles.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900 border border-amber-300">
                Security Reference
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Institutional Admin */}
              <div className="p-4 rounded-xl bg-white border border-amber-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Institutional Admin Account
                  </span>
                  <button
                    onClick={() => copyToClipboard('admin@smartstudent.ai | Admin@2026!', 'admin')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === 'admin' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedText === 'admin' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-sans text-[11px]">Email:</span>
                    <span className="font-bold text-slate-900 select-all">admin@smartstudent.ai</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-sans text-[11px]">Password:</span>
                    <span className="font-bold text-indigo-700 select-all">Admin@2026!</span>
                  </div>
                </div>
              </div>

              {/* Demo Student */}
              <div className="p-4 rounded-xl bg-white border border-amber-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    Student Profile (Amina Kimani)
                  </span>
                  <button
                    onClick={() => copyToClipboard('amina.kimani@student.uonbi.ac.ke | Student@2026', 'student')}
                    className="text-[11px] text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === 'student' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedText === 'student' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-sans text-[11px]">Email:</span>
                    <span className="font-bold text-slate-900 select-all truncate max-w-[200px]">amina.kimani@student.uonbi.ac.ke</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-sans text-[11px]">Password:</span>
                    <span className="font-bold text-teal-700 select-all">Student@2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
