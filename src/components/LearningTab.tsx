import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  Clock, 
  Star, 
  Award, 
  Play, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft,
  BookMarked,
  Sparkles,
  Layers,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { Course, CourseProgress, Lesson } from '../types';

interface LearningTabProps {
  courses: Course[];
  progressList: CourseProgress[];
  onToggleLessonProgress: (courseId: string, lessonId: string, completed: boolean) => void;
  selectedCourseFromProps?: Course | null;
}

export const LearningTab: React.FC<LearningTabProps> = ({
  courses,
  progressList,
  onToggleLessonProgress,
  selectedCourseFromProps,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCourse, setActiveCourse] = useState<Course | null>(selectedCourseFromProps || null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [quizSelection, setQuizSelection] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const categories = [
    'All',
    'Software & Tech',
    'Data & AI',
    'Engineering & TVET',
    'Career & Soft Skills',
  ];

  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeProgressList = Array.isArray(progressList) ? progressList : [];

  const filteredCourses = safeCourses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeProgress = activeCourse 
    ? safeProgressList.find(p => p.courseId === activeCourse.id) 
    : null;

  const currentLesson: Lesson | undefined = activeCourse?.lessons[activeLessonIndex];
  const isLessonCompleted = currentLesson && activeProgress?.completedLessonIds.includes(currentLesson.id);

  const handleSelectCourse = (course: Course) => {
    setActiveCourse(course);
    setActiveLessonIndex(0);
    setQuizSelection(null);
    setQuizSubmitted(false);
  };

  const handleLessonChange = (index: number) => {
    setActiveLessonIndex(index);
    setQuizSelection(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* If viewing a specific course lesson */}
      {activeCourse && currentLesson ? (
        <div className="space-y-4">
          {/* Breadcrumb / Top Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setActiveCourse(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Courses</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {activeCourse.category}
              </span>
              <span className="text-xs font-bold text-slate-700">
                Lesson {activeLessonIndex + 1} of {activeCourse.lessons.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Lesson Content & Quiz */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Content Box */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{currentLesson.duration}</span>
                    <span>•</span>
                    <span>{activeCourse.title}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                    {currentLesson.title}
                  </h1>
                  <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {currentLesson.summary}
                  </p>
                </div>

                {/* Lesson Notes / Code Markdown */}
                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
                  {currentLesson.content.split('\n\n').map((paragraph, i) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={i} className="text-base font-bold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('```')) {
                      const codeContent = paragraph.replace(/```[a-z]*\n?/g, '');
                      return (
                        <pre key={i} className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono">
                          <code>{codeContent}</code>
                        </pre>
                      );
                    }
                    return <p key={i}>{paragraph}</p>;
                  })}
                </div>

                {/* Additional Learning Resources */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Curated Guides & Technical References</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentLesson.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:border-indigo-300 transition-colors shadow-2xs"
                        >
                          <span>{res.name}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Knowledge Check / Interactive Quiz */}
                {currentLesson.quiz && (
                  <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50/50 to-teal-50/40 border border-indigo-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">
                        Quick Knowledge Check
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800">
                      {currentLesson.quiz.question}
                    </p>

                    <div className="space-y-2 pt-1">
                      {currentLesson.quiz.options.map((option, idx) => {
                        const isSelected = quizSelection === idx;
                        const isCorrect = idx === currentLesson.quiz?.correctIndex;
                        let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                          }
                        } else if (isSelected) {
                          btnStyle = 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => !quizSubmitted && setQuizSelection(idx)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={() => quizSelection !== null && setQuizSubmitted(true)}
                        disabled={quizSelection === null}
                        className="mt-2 px-4 py-1.5 rounded-lg bg-indigo-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className="pt-2 text-xs space-y-1">
                        <p className={quizSelection === currentLesson.quiz.correctIndex ? 'text-emerald-700 font-bold' : 'text-amber-800 font-semibold'}>
                          {quizSelection === currentLesson.quiz.correctIndex
                            ? 'Excellent! Correct Answer.'
                            : 'Review the concept:'}
                        </p>
                        <p className="text-slate-600">{currentLesson.quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Mark Completed & Next Lesson Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onToggleLessonProgress(activeCourse.id, currentLesson.id, !isLessonCompleted)}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                      isLessonCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isLessonCompleted ? 'Completed ✓ (Click to toggle)' : 'Mark Lesson as Completed'}</span>
                  </button>

                  {activeLessonIndex < activeCourse.lessons.length - 1 && (
                    <button
                      onClick={() => handleLessonChange(activeLessonIndex + 1)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Next Lesson</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Course Outline & Certification */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                      Course Syllabus & Modules
                    </h3>
                    <span className="text-xs font-bold text-indigo-600">
                      {Math.min(100, Math.max(0, Math.round(((activeProgress?.completedLessonIds?.filter(id => activeCourse.lessons.some(l => l.id === id)).length ?? (activeProgress?.completedLessonIds?.length || 0)) / Math.max(1, activeCourse.lessons.length)) * 100)))}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {activeProgress?.completedLessonIds?.filter(id => activeCourse.lessons.some(l => l.id === id)).length ?? (activeProgress?.completedLessonIds?.length || 0)} of {activeCourse.lessons.length} lessons done
                  </p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, Math.max(0, Math.round(((activeProgress?.completedLessonIds?.filter(id => activeCourse.lessons.some(l => l.id === id)).length ?? (activeProgress?.completedLessonIds?.length || 0)) / Math.max(1, activeCourse.lessons.length)) * 100)))}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {activeCourse.lessons.map((lesson, idx) => {
                    const done = activeProgress?.completedLessonIds.includes(lesson.id);
                    const isCurrent = idx === activeLessonIndex;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonChange(idx)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border flex items-start gap-3 ${
                          isCurrent
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                            : 'border-slate-200/70 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          done 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : isCurrent 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {done ? '✓' : idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-indigo-950' : 'text-slate-800'}`}>
                            {lesson.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {lesson.duration}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Course Completion Badge */}
                {activeProgress?.isCompleted && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                      <Award className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs font-['Outfit']">
                      Course Completed!
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      You've verified all competencies for "{activeCourse.title}". This achievement is reflected in your AI Opportunity Matching score!
                    </p>
                  </div>
                )}
              </div>

              {/* Instructor Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Instructor & Mentor
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {activeCourse.instructor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{activeCourse.instructor}</p>
                    <p className="text-[11px] text-slate-500">{activeCourse.instructorTitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Course Catalog View */
        <div className="space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Student Learning Hub & Courses</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted technical, vocational, TVET, and career modules designed for practical employment readiness.
              </p>
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses, skills, TVET..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const prog = progressList.find(p => p.courseId === course.id);
              const completedCount = prog?.completedLessonIds?.filter(id => course.lessons?.some(l => l.id === id)).length ?? (prog?.completedLessonIds?.length ?? 0);
              const totalCount = Math.max(1, course.lessons?.length || 1);
              const pct = Math.min(100, Math.max(0, Math.round((completedCount / totalCount) * 100)));

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {course.level}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      {/* Skills tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {course.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Progress bar if started */}
                      {completedCount > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                            <span>Progress</span>
                            <span className="text-indigo-600">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-600 h-full rounded-full" 
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {course.duration}
                        </span>
                        <button
                          onClick={() => handleSelectCourse(course)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{completedCount > 0 ? 'Continue' : 'Start Course'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
