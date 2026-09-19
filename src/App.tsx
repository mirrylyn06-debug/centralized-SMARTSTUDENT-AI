import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { LearningTab } from './components/LearningTab';
import { OpportunitiesTab } from './components/OpportunitiesTab';
import { ApplicationsTab } from './components/ApplicationsTab';
import { AIAssistantTab } from './components/AIAssistantTab';
import { DocumentsTab } from './components/DocumentsTab';
import { AdminTab } from './components/AdminTab';
import { ProfileModal } from './components/ProfileModal';

import { 
  StudentProfile, 
  Course, 
  CourseProgress, 
  Opportunity, 
  Application, 
  DocumentItem, 
  PlatformStats, 
  OpportunityMatchReport,
  ApplicationStatus,
  UserRole,
  NotificationItem
} from './types';

import { 
  mockStudentProfile, 
  mockCourses, 
  mockOpportunities, 
  mockApplications, 
  mockDocuments, 
  mockNotifications,
  mockPlatformStats 
} from './data/mockData';

import { Loader2, Bell, X, CheckCircle2, ArrowRight, ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import { AdminLoginModal } from './components/AdminLoginModal';
import { RegistrationModal } from './components/RegistrationModal';
import { CredentialsModal } from './components/CredentialsModal';
import { parseResponseSafely } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  // Default to true so the first window to appear on load is the Registration window
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(true);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState<boolean>(false);

  // Core App State
  const [profile, setProfile] = useState<StudentProfile>(mockStudentProfile);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [progressList, setProgressList] = useState<CourseProgress[]>([
    {
      courseId: mockCourses[0].id,
      completedLessonIds: ['c1-l1', 'c1-l2'],
      lastAccessed: '2026-09-18',
      isCompleted: false
    }
  ]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [matches, setMatches] = useState<OpportunityMatchReport[]>([]);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [stats, setStats] = useState<PlatformStats>(mockPlatformStats);

  // Modals & Navigation helpers
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [selectedCourseForView, setSelectedCourseForView] = useState<Course | null>(null);
  const [selectedOppForView, setSelectedOppForView] = useState<Opportunity | null>(null);

  // Verify Admin JWT
  const checkAdminAuth = async () => {
    const token = localStorage.getItem('smartstudent_admin_token');
    if (!token) {
      setIsAuthenticatedAdmin(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const { data } = await parseResponseSafely<any>(res);
        if (data?.authenticated && data?.role === 'admin') {
          setIsAuthenticatedAdmin(true);
          return;
        }
      }
      localStorage.removeItem('smartstudent_admin_token');
      setIsAuthenticatedAdmin(false);
    } catch {
      setIsAuthenticatedAdmin(false);
    }
  };

  // Initial Fetch from Express Backend
  const fetchAllData = async () => {
    try {
      const fetchJson = async <T,>(url: string, fallback: T): Promise<T> => {
        try {
          const r = await fetch(url);
          const { data } = await parseResponseSafely<T>(r, fallback);
          return data ?? fallback;
        } catch {
          return fallback;
        }
      };

      const [
        profileRes, 
        coursesRes, 
        progressRes, 
        oppsRes, 
        matchesRes, 
        appsRes, 
        docsRes, 
        notifsRes,
        statsRes
      ] = await Promise.allSettled([
        fetchJson('/api/profile', mockStudentProfile),
        fetchJson('/api/courses', mockCourses),
        fetchJson('/api/courses/progress', []),
        fetchJson('/api/opportunities', mockOpportunities),
        fetchJson('/api/opportunities/matches', []),
        fetchJson('/api/applications', mockApplications),
        fetchJson('/api/documents', mockDocuments),
        fetchJson('/api/notifications', mockNotifications),
        fetchJson('/api/stats', mockPlatformStats),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        const val: any = profileRes.value;
        setProfile(val.profile || val);
      }
      if (coursesRes.status === 'fulfilled' && coursesRes.value) {
        const val: any = coursesRes.value;
        if (Array.isArray(val)) {
          setCourses(val);
        } else if (val && Array.isArray(val.courses)) {
          setCourses(val.courses);
          if (Array.isArray(val.progress) && val.progress.length > 0) {
            setProgressList(val.progress);
          }
        }
      }
      if (progressRes.status === 'fulfilled' && progressRes.value) {
        const val: any = progressRes.value;
        if (Array.isArray(val) && val.length > 0) {
          setProgressList(val);
        }
      }
      if (oppsRes.status === 'fulfilled' && oppsRes.value) {
        const val: any = oppsRes.value;
        setOpportunities(Array.isArray(val) ? val : (Array.isArray(val?.opportunities) ? val.opportunities : mockOpportunities));
      }
      if (matchesRes.status === 'fulfilled' && matchesRes.value) {
        const val: any = matchesRes.value;
        setMatches(Array.isArray(val) ? val : (Array.isArray(val?.matches) ? val.matches : []));
      }
      if (appsRes.status === 'fulfilled' && appsRes.value) {
        const val: any = appsRes.value;
        setApplications(Array.isArray(val) ? val : (Array.isArray(val?.applications) ? val.applications : mockApplications));
      }
      if (docsRes.status === 'fulfilled' && docsRes.value) {
        const val: any = docsRes.value;
        setDocuments(Array.isArray(val) ? val : (Array.isArray(val?.documents) ? val.documents : mockDocuments));
      }
      if (notifsRes.status === 'fulfilled' && notifsRes.value) {
        const val: any = notifsRes.value;
        if (Array.isArray(val)) {
          setNotifications(val);
        }
      }
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        const val: any = statsRes.value;
        setStats(val.stats || val);
      }
    } catch (err) {
      console.warn('Using seeded initial state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    checkAdminAuth();
  }, []);

  // Handlers
  const handleToggleLessonProgress = async (courseId: string, lessonId: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, completed })
      });
      if (res.ok) {
        const { data } = await parseResponseSafely<CourseProgress>(res);
        if (data && data.courseId) {
          setProgressList(prev => {
            const idx = prev.findIndex(p => p.courseId === courseId);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = data;
              return next;
            }
            return [...prev, data];
          });
        }
      }
    } catch (err) {
      console.error(err);
      // Optimistic fallback
      setProgressList(prev => {
        const existing = prev.find(p => p.courseId === courseId);
        if (existing) {
          const newLessons = completed 
            ? [...existing.completedLessonIds, lessonId] 
            : existing.completedLessonIds.filter(id => id !== lessonId);
          return prev.map(p => p.courseId === courseId ? { ...p, completedLessonIds: newLessons, lastAccessed: '2026-09-18' } : p);
        }
        return [...prev, { courseId, completedLessonIds: [lessonId], lastAccessed: '2026-09-18', isCompleted: false }];
      });
    }
  };

  const handleApplyOpportunity = async (opportunityId: string, notes?: string, coverLetter?: string, resumeAttached?: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          notes,
          coverLetter,
          resumeAttached,
          status: 'applied'
        })
      });
      if (res.ok) {
        const { data } = await parseResponseSafely<Application>(res);
        const newApp = data?.id ? data : (data as any)?.application;
        if (newApp && newApp.id) {
          setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveOpportunity = async (opportunityId: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          status: 'saved'
        })
      });
      if (res.ok) {
        const { data } = await parseResponseSafely<Application>(res);
        const newApp = data?.id ? data : (data as any)?.application;
        if (newApp && newApp.id) {
          setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string, 
    status: ApplicationStatus, 
    notes?: string, 
    interviewDate?: string
  ) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, interviewDate })
      });
      if (res.ok) {
        const { data } = await parseResponseSafely<Application>(res);
        const updated = data?.id ? data : (data as any)?.application;
        if (updated && updated.id) {
          setApplications(prev => prev.map(a => a.id === applicationId ? updated : a));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadDocument = async (name: string, type: 'cv' | 'certificate' | 'transcript' | 'portfolio', fileSize: string) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, fileSize })
      });
      if (res.ok) {
        const { data } = await parseResponseSafely<DocumentItem>(res);
        const newDoc = data?.id ? data : (data as any)?.document;
        if (newDoc && newDoc.id) {
          setDocuments(prev => [newDoc, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (updated: Partial<StudentProfile>) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const { data: saved } = await parseResponseSafely<StudentProfile>(res);
        if (saved && saved.id) {
          setProfile(saved);
        }
        // Refresh matches safely
        const mRes = await fetch('/api/opportunities/matches');
        if (mRes.ok) {
          const { data: freshMatches } = await parseResponseSafely<any>(mRes, []);
          if (Array.isArray(freshMatches)) {
            setMatches(freshMatches);
          } else if (freshMatches && typeof freshMatches === 'object') {
            setMatches(Object.values(freshMatches));
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegistrationSuccess = async (newProfile: StudentProfile, token: string) => {
    setProfile(newProfile);
    localStorage.setItem('smartstudent_student_token', token);
    localStorage.setItem('smartstudent_registered_email', newProfile.email);
    setIsRegistrationOpen(false);
    
    // Refresh matches and notifications safely
    try {
      const fetchJson = async <T,>(url: string, fallback: T): Promise<T> => {
        try {
          const r = await fetch(url);
          const { data } = await parseResponseSafely<T>(r, fallback);
          return data ?? fallback;
        } catch {
          return fallback;
        }
      };

      const [matchesRes, notifsRes] = await Promise.allSettled([
        fetchJson('/api/opportunities/matches', []),
        fetchJson('/api/notifications', [])
      ]);
      if (matchesRes.status === 'fulfilled' && matchesRes.value) {
        const val = matchesRes.value;
        if (Array.isArray(val)) {
          setMatches(val);
        } else if (val && typeof val === 'object') {
          setMatches(Object.values(val));
        }
      }
      if (notifsRes.status === 'fulfilled' && notifsRes.value && Array.isArray(notifsRes.value)) {
        setNotifications(notifsRes.value);
      }
    } catch (err) {
      console.error('Failed to refresh data after registration:', err);
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    localStorage.setItem('smartstudent_admin_token', token);
    setIsAuthenticatedAdmin(true);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('smartstudent_admin_token');
    setIsAuthenticatedAdmin(false);
    if (activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOpportunity = async (oppData: Partial<Opportunity>) => {
    try {
      const token = localStorage.getItem('smartstudent_admin_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers,
        body: JSON.stringify(oppData)
      });
      if (res.ok) {
        const { data } = await parseResponseSafely<any>(res);
        const created = data?.opportunity || data;
        if (created && created.id) {
          setOpportunities(prev => [created, ...prev]);
          setStats(prev => ({ ...prev, activeOpportunities: prev.activeOpportunities + 1 }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCourse = async (courseData: Partial<Course>) => {
    try {
      const token = localStorage.getItem('smartstudent_admin_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers,
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        const { data } = await parseResponseSafely<any>(res);
        const created = data?.course || data;
        if (created && created.id) {
          setCourses(prev => [created, ...prev]);
          setStats(prev => ({ ...prev, totalCourses: prev.totalCourses + 1 }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedCourseForView(null);
          setSelectedOppForView(null);
        }}
        profile={profile}
        isAuthenticatedAdmin={isAuthenticatedAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        unreadCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onOpenCredentials={() => setIsCredentialsModalOpen(true)}
      />

      {/* Notifications Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h3 className="font-extrabold text-sm font-['Outfit']">
                  Student Alerts & Notifications
                </h3>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    handleMarkNotificationRead(notif.id);
                    if (notif.linkAction) {
                      setActiveTab(notif.linkAction);
                    }
                    setIsNotificationsOpen(false);
                  }}
                  className="pt-3 first:pt-0 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${notif.read ? 'bg-slate-300' : 'bg-indigo-600'}`} />
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-3.5">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
              <button
                onClick={handleMarkAllNotificationsRead}
                className="text-indigo-600 font-bold hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="px-3 py-1 rounded-lg bg-slate-200 text-slate-800 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="min-h-[500px] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-500 tracking-wide">
              Connecting to SMARTSTUDENT AI Digital Superhighway...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab
                profile={profile}
                courses={courses}
                progressList={progressList}
                opportunities={opportunities}
                applications={applications}
                matches={matches}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  setSelectedCourseForView(null);
                  setSelectedOppForView(null);
                }}
                onSelectCourse={(course) => {
                  setSelectedCourseForView(course);
                  setActiveTab('courses');
                }}
                onSelectOpportunity={(opp) => {
                  setSelectedOppForView(opp);
                  setActiveTab('opportunities');
                }}
              />
            )}

            {activeTab === 'courses' && (
              <LearningTab
                courses={courses}
                progressList={progressList}
                onToggleLessonProgress={handleToggleLessonProgress}
                selectedCourseFromProps={selectedCourseForView}
              />
            )}

            {activeTab === 'opportunities' && (
              <OpportunitiesTab
                opportunities={opportunities}
                matches={matches}
                profile={profile}
                applications={applications}
                documents={documents}
                onApply={handleApplyOpportunity}
                onSaveOpportunity={handleSaveOpportunity}
                initialSelectedOpp={selectedOppForView}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationsTab
                applications={applications}
                onUpdateStatus={handleUpdateApplicationStatus}
                onNavigateToOpp={(opp) => {
                  setSelectedOppForView(opp);
                  setActiveTab('opportunities');
                }}
              />
            )}

            {activeTab === 'ai-hub' && (
              <AIAssistantTab
                profile={profile}
                onNavigateToCourses={() => setActiveTab('courses')}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab
                documents={documents}
                profile={profile}
                onUploadDocument={handleUploadDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            )}

            {activeTab === 'admin' && (
              isAuthenticatedAdmin ? (
                <AdminTab
                  stats={stats}
                  opportunities={opportunities}
                  courses={courses}
                  applications={applications}
                  onAddOpportunity={handleAddOpportunity}
                  onAddCourse={handleAddCourse}
                />
              ) : (
                <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-['Outfit']">
                    Admin Authentication Required
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The Institutional Administrator Portal is strictly restricted to verified personnel. Please sign in with your administrator credentials.
                  </p>
                  <button
                    onClick={() => setIsAdminLoginOpen(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto shadow-xs transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authenticate as Administrator</span>
                  </button>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Student Registration Modal - First window that appears on load */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onRegisterSuccess={handleRegistrationSuccess}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Global Profile Editor Modal */}
      <ProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={handleUpdateProfile}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
      />

      {/* Credentials & Database Overview Modal */}
      <CredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        onOpenAdminLogin={() => {
          setIsCredentialsModalOpen(false);
          setIsAdminLoginOpen(true);
        }}
        onOpenStudentLogin={() => {
          setIsCredentialsModalOpen(false);
          setIsRegistrationOpen(true);
        }}
        onNavigateToApplications={() => {
          setIsCredentialsModalOpen(false);
          setActiveTab('applications');
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center text-white text-[10px] font-extrabold">
              SS
            </div>
            <span className="font-extrabold text-slate-900 font-['Outfit']">
              SMARTSTUDENT AI
            </span>
            <span>• Digital Superhighway for Learning, Careers & Opportunities</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Connecting TVET, College & University Students</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
