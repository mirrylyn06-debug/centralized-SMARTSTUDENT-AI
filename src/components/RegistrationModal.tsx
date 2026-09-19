import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2, 
  BookOpen, 
  Award, 
  Target, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  X, 
  Zap, 
  ShieldCheck,
  Plus,
  Compass,
  KeyRound
} from 'lucide-react';
import { StudentProfile } from '../types';
import { parseResponseSafely } from '../utils/api';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (profile: StudentProfile, token: string) => void;
  onOpenAdminLogin?: () => void;
}

const POPULAR_INSTITUTIONS = [
  'University of Nairobi',
  'Kenya Coast National Poly',
  'Kenyatta University',
  'Strathmore University',
  'Jomo Kenyatta Univ (JKUAT)',
  'Kabete National Poly',
  'Rift Valley Tech Training Inst',
];

const POPULAR_COURSES = [
  'Computer Science & Software Eng',
  'Electrical & Electronic Engineering',
  'Mechanical & Automotive Eng',
  'Business Information Technology',
  'Data Science & Artificial Intelligence',
  'Civil Engineering & Construction',
];

const POPULAR_SKILLS = [
  'Python',
  'JavaScript & React',
  'Data Analysis',
  'Cloud / AWS',
  'Cybersecurity',
  'PLC & Industrial Automation',
  'CAD / Mechanical Modeling',
  'UI/UX Design',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onOpenAdminLogin,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institutionType, setInstitutionType] = useState<'University' | 'College' | 'TVET' | 'Recent Graduate'>('University');
  const [institutionName, setInstitutionName] = useState('');
  const [course, setCourse] = useState('');
  const [level, setLevel] = useState('Year 3');
  const [careerGoal, setCareerGoal] = useState('');
  const [location, setLocation] = useState('Nairobi, Kenya');
  const [skills, setSkills] = useState<string[]>(['Python', 'Problem Solving']);
  const [newSkill, setNewSkill] = useState('');

  if (!isOpen) return null;

  const handleQuickDemoFill = () => {
    setFullName('Amina Kimani');
    setEmail('amina.kimani@student.uonbi.ac.ke');
    setPassword('Student@2026');
    setInstitutionType('University');
    setInstitutionName('University of Nairobi');
    setCourse('Computer Science & Software Engineering');
    setLevel('Year 3');
    setCareerGoal('Software Engineer & Cloud Solutions Architect');
    setLocation('Nairobi, Kenya');
    setSkills(['Python', 'React', 'Node.js', 'PostgreSQL', 'Cloud / AWS', 'Problem Solving']);
    setError(null);
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (mode === 'login') {
      try {
        const res = await fetch('/api/auth/student-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password })
        });
        const { data, error: parseErr } = await parseResponseSafely<any>(res);
        if (!res.ok || !data?.success) {
          throw new Error(data?.error || parseErr || 'Student sign-in failed. Please check your credentials.');
        }
        onRegisterSuccess(data.profile, data.token);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to sign in.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Register mode
    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your full name and student email.');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim() || 'Student@Pass2026',
        institutionType,
        institutionName: institutionName.trim() || 'University of Nairobi',
        course: course.trim() || 'Computer Science & Software Engineering',
        level: level.trim() || 'Year 3',
        skills: skills.length > 0 ? skills : ['Digital Literacy', 'Problem Solving'],
        careerGoal: careerGoal.trim() || 'Software & Industry Professional',
        location: location.trim() || 'Nairobi, Kenya',
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const { data, error: parseErr } = await parseResponseSafely<any>(res);
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || parseErr || 'Registration failed. Please try again.');
      }

      onRegisterSuccess(data.profile, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> SMARTSTUDENT AI
                  </span>
                  <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    First-Time Welcome
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] tracking-tight">
                  {mode === 'register' ? 'Student Registration Portal' : 'Student Account Sign In'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {mode === 'register' 
                    ? 'Register your profile to connect with subsidized courses, internships, and AI career guidance.'
                    : 'Sign in with your registered student credentials to access your dashboard.'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              title="Explore as Guest"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  mode === 'register' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Create Student Account
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  mode === 'login' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {mode === 'register' && (
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold transition-colors border border-teal-400/30"
              >
                <Zap className="w-3.5 h-3.5 text-teal-300" />
                <span>Quick Demo Fill</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs max-h-[68vh] overflow-y-auto">
          
          {mode === 'register' ? (
            <>
              {/* SECTION 1: Credentials */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" /> Personal & Login Details
                  </span>
                  <span className="text-[10px] text-slate-400">Step 1 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amina Kimani"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Student Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="e.g. student@uonbi.ac.ke"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Create Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Location / Campus City
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Nairobi, Kenya"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Academic Details */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" /> Academic Institution & Program
                  </span>
                  <span className="text-[10px] text-slate-400">Step 2 of 3</span>
                </div>

                {/* Institution Type Selector */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Institution Classification
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['University', 'TVET', 'College', 'Recent Graduate'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setInstitutionType(type)}
                        className={`p-2 rounded-xl border text-center font-bold text-xs transition-all ${
                          institutionType === type
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Institution Name */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Institution / University / Polytechnic Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. University of Nairobi or Kenya Coast National Poly"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                  {/* Quick pills */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Suggestions:</span>
                    {POPULAR_INSTITUTIONS.slice(0, 4).map((inst) => (
                      <button
                        key={inst}
                        type="button"
                        onClick={() => setInstitutionName(inst)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors"
                      >
                        {inst}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course & Level */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">
                      Degree / Diploma Course <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science, Mechanical Eng, Business IT"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Popular:</span>
                      {POPULAR_COURSES.slice(0, 3).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCourse(c)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Year / Level of Study
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                    >
                      <option value="Year 1">Year 1 (Freshman)</option>
                      <option value="Year 2">Year 2 (Sophomore)</option>
                      <option value="Year 3">Year 3 (Junior / Attachment)</option>
                      <option value="Final Year">Final Year (Senior / Capstone)</option>
                      <option value="Diploma Year 1">Diploma Year 1</option>
                      <option value="Diploma Year 2">Diploma Year 2</option>
                      <option value="TVET Level 5/6">TVET Level 5/6</option>
                      <option value="Recent Graduate">Recent Graduate (Alumni)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Career Goals & Skills */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" /> Career Goals & Skills
                  </span>
                  <span className="text-[10px] text-slate-400">Step 3 of 3</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Primary Career Target
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer, Cloud Architect, Industrial Mechatronics Engineer"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                {/* Skills tags */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Your Current Skills & Technical Competencies
                  </label>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add a skill (e.g. React, CAD, Python)..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(newSkill);
                        }
                      }}
                      className="flex-1 p-2 rounded-xl border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill(newSkill)}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Active Skill Tags */}
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-50 rounded-xl border border-slate-200/80 mb-2">
                    {skills.length === 0 ? (
                      <span className="text-slate-400 text-[11px] italic py-0.5">No skills added yet. Click suggestions below or type above.</span>
                    ) : (
                      skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(s)}
                            className="hover:text-rose-600 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Popular Skill Suggestions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-medium">Quick add:</span>
                    {POPULAR_SKILLS.map((sk) => (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleAddSkill(sk)}
                        disabled={skills.includes(sk)}
                        className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${
                          skills.includes(sk)
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 text-slate-700'
                        }`}
                      >
                        + {sk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Login Mode Form */
            <div className="space-y-4 py-4 max-w-md mx-auto">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs">
                <p className="font-semibold">Welcome back to SMARTSTUDENT AI!</p>
                <p className="text-indigo-700 mt-0.5">
                  Enter your registered student email address to sign into your personal learning & career dashboard.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Registered Student Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="student@uonbi.ac.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold flex items-center gap-1.5 text-amber-900">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    Student Account Credentials
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('amina.kimani@student.uonbi.ac.ke');
                      setPassword('Student@2026');
                    }}
                    className="text-[11px] font-bold text-amber-800 bg-white/90 border border-amber-300 px-2 py-0.5 rounded-md hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Auto-Fill Demo
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/90 p-2 rounded-xl border border-amber-200/80">
                  <div>
                    <span className="text-[10px] text-slate-500 font-sans font-bold block uppercase">Email</span>
                    <span className="font-bold text-slate-800 truncate block">amina.kimani@student.uonbi.ac.ke</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-sans font-bold block uppercase">Password</span>
                    <span className="font-bold text-teal-700">Student@2026</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors text-center"
              >
                Skip / Explore as Guest
              </button>
              {onOpenAdminLogin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminLogin();
                  }}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Portal
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === 'register' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Register & Launch Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign In & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
