import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  GraduationCap, 
  Compass, 
  Loader2, 
  RotateCcw,
  BookOpen,
  Code2,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, SkillsGapAnalysisResult, StudentProfile } from '../types';

interface AIAssistantTabProps {
  profile: StudentProfile;
  onNavigateToCourses: () => void;
}

export const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  profile,
  onNavigateToCourses,
}) => {
  const [activeSubView, setActiveSubView] = useState<'assistant' | 'skills_gap' | 'career_guidance'>('assistant');

  // --- AI Chat State ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `Hello ${profile.fullName}! I am your **SMARTSTUDENT AI Academic & Career Assistant**.

I am grounded with your profile:
- **Course**: ${profile.course} (${profile.level}) at ${profile.institutionName}
- **Current Skills**: ${profile.skills.join(', ')}
- **Career Goal**: ${profile.careerGoal}

How can I support you today? You can ask me to:
1. Explain complex academic or programming concepts (Node.js, Python, SQL, Algorithms, TVET Systems).
2. Simulate a mock technical or behavioral interview.
3. Review best practices for industrial attachment applications.
4. Recommend projects that will make your portfolio stand out to employers.`,
      timestamp: 'Just now',
      suggestions: [
        'Simulate a junior developer technical interview question',
        'How can I prepare my CV for an industrial attachment?',
        'Explain RESTful API architecture in simple terms',
        'Suggest 3 high-impact portfolio projects for cloud engineering'
      ]
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- Skills Gap State ---
  const [targetRoleInput, setTargetRoleInput] = useState<string>(profile.careerGoal);
  const [skillsGapResult, setSkillsGapResult] = useState<SkillsGapAnalysisResult | null>(null);
  const [isAnalyzingGap, setIsAnalyzingGap] = useState<boolean>(false);

  // --- Career Guidance State ---
  const [careerGuidanceData, setCareerGuidanceData] = useState<any | null>(null);
  const [isLoadingGuidance, setIsLoadingGuidance] = useState<boolean>(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Send Chat
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages
        })
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || []
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: `I've received your query regarding "${query}". For your target goal in **${profile.careerGoal}**, remember to anchor each concept in real project implementations. Feel free to ask another question or switch to the Skills-Gap Analyzer!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['How to prepare for coding interviews', 'Top project ideas for students']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Run Skills Gap Analysis
  const handleRunSkillsGap = async () => {
    setIsAnalyzingGap(true);
    try {
      const res = await fetch('/api/ai/skills-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole: targetRoleInput })
      });
      const data = await res.json();
      setSkillsGapResult(data);
    } catch (err) {
      console.error('Skills gap error:', err);
    } finally {
      setIsAnalyzingGap(false);
    }
  };

  // Load Career Guidance
  const handleLoadCareerGuidance = async () => {
    setIsLoadingGuidance(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setCareerGuidanceData(data);
    } catch (err) {
      console.error('Guidance error:', err);
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  useEffect(() => {
    if (activeSubView === 'career_guidance' && !careerGuidanceData) {
      handleLoadCareerGuidance();
    }
    if (activeSubView === 'skills_gap' && !skillsGapResult) {
      handleRunSkillsGap();
    }
  }, [activeSubView]);

  return (
    <div className="space-y-6">
      {/* Sub-view switcher header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <span>AI Student Assistant & Career Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized academic tutoring, skills-gap roadmap diagnostics, and industry career projections.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubView('assistant')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubView === 'assistant'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Assistant Chat
          </button>
          <button
            onClick={() => setActiveSubView('skills_gap')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubView === 'skills_gap'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skills-Gap Analyzer
          </button>
          <button
            onClick={() => setActiveSubView('career_guidance')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubView === 'career_guidance'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Career Guidance
          </button>
        </div>
      </div>

      {/* --- SUBVIEW 1: AI ASSISTANT CHAT --- */}
      {activeSubView === 'assistant' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[650px]">
          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${isAssistant ? '' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                    isAssistant 
                      ? 'bg-gradient-to-br from-indigo-600 to-teal-500 text-white' 
                      : 'bg-slate-800 text-white'
                  }`}>
                    {isAssistant ? <Bot className="w-4 h-4" /> : profile.fullName[0]}
                  </div>

                  <div className="space-y-2">
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-50 text-slate-800 border border-slate-200/80'
                        : 'bg-indigo-600 text-white shadow-xs'
                    }`}>
                      <div className="whitespace-pre-line">
                        {msg.content}
                      </div>
                    </div>

                    {/* Suggestions Chips if provided by assistant */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(sug)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 transition-colors text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <span className="animate-pulse">AI Assistant is synthesizing academic advice...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Ask SMARTSTUDENT AI anything about ${profile.course}, coding, or career prep...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-800"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isSending}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 2: SKILLS GAP ANALYZER --- */}
      {activeSubView === 'skills_gap' && (
        <div className="space-y-6">
          {/* Target Role Input Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="max-w-2xl">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Target Role & Market Benchmark
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                SMARTSTUDENT AI analyzes your existing {profile.skills.length} skills against industry demand to detect missing competencies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="e.g., Full Stack Cloud Engineer, Data Scientist, Renewable Energy Tech"
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleRunSkillsGap}
                disabled={isAnalyzingGap}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isAnalyzingGap ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Skills Gap Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {skillsGapResult && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Score & Strong Areas Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center flex flex-col justify-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Readiness Score
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-indigo-600 font-['Outfit']">
                    {skillsGapResult.currentMatchPercentage}%
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Profile alignment for "{skillsGapResult.targetRole}"
                  </p>
                </div>

                <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Strong Foundations</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {skillsGapResult.strongAreas.map((area, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Missing Competencies & Priority */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Identified Missing Skills & Actions</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {skillsGapResult.missingSkills.map((gap, i) => {
                    const isHigh = gap.priority === 'High';
                    return (
                      <div 
                        key={i} 
                        className={`p-4 rounded-xl border space-y-2 ${
                          isHigh ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{gap.skill}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isHigh ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {gap.priority} Priority
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {gap.recommendedAction}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-step roadmap */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Step-by-Step Personalized Learning Roadmap</span>
                  </h4>
                  <button
                    onClick={onNavigateToCourses}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Browse Platform Courses →
                  </button>
                </div>

                <div className="space-y-3">
                  {skillsGapResult.stepByStepRoadmap.map((step) => (
                    <div 
                      key={step.step}
                      className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                          {step.step}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit']">
                              {step.phase}
                            </h5>
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {step.focus}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Courses</span>
                        <span className="text-xs font-semibold text-indigo-700">{step.recommendedCourses.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200/70 text-xs text-slate-700 leading-relaxed">
                  <strong>Mentor Takeaway:</strong> {skillsGapResult.overallAdvice}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SUBVIEW 3: CAREER GUIDANCE & PROJECTIONS --- */}
      {activeSubView === 'career_guidance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <span>Career Pathways for {profile.course}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Market analysis and salary projections mapped to the Digital Superhighway expansion in Africa.
              </p>
            </div>

            {isLoadingGuidance ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                <span>Synthesizing labor market analytics...</span>
              </div>
            ) : careerGuidanceData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerGuidanceData.careerRecommendations?.map((role: any, idx: number) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Outfit']">
                          {role.role}
                        </h4>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {role.marketDemand} Demand
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {role.whyFit}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Typical Entry Compensation</span>
                          <span className="font-bold text-slate-800">{role.estimatedSalary}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-semibold">Projected Growth</span>
                          <span className="font-bold text-teal-700">{role.growthProjection}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended Courses to unlock pathways */}
                {careerGuidanceData.learningRecommendations && (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Platform Learning Modules Recommended For You
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {careerGuidanceData.learningRecommendations.map((rec: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                              {rec.category}
                            </span>
                            <span className="text-xs font-extrabold text-teal-700">
                              {rec.relevanceScore}% Fit
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 leading-tight">
                            {rec.title}
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            {rec.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
