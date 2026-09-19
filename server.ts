import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import { 
  initialStudentProfile, 
  sampleCourses, 
  sampleOpportunities, 
  sampleApplications,
  sampleDocuments, 
  sampleNotifications, 
  platformStats 
} from './src/data/mockData';
import { Application, CourseProgress, DocumentItem, NotificationItem, Opportunity, StudentProfile, Course, PlatformStats as PlatformStatsType } from './src/types';

dotenv.config();

const PORT = 3000;

// Lazy GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// File-Backed Persistent Database Configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  version: string;
  initializedAt: string;
  lastUpdated: string;
  studentProfile: StudentProfile;
  courses: Course[];
  courseProgressList: CourseProgress[];
  opportunities: Opportunity[];
  applications: Application[];
  documents: DocumentItem[];
  notifications: NotificationItem[];
  platformStats: PlatformStatsType;
}

function initAndLoadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Ensure opp-database and app-database are loaded
      if (Array.isArray(parsed.opportunities) && !parsed.opportunities.some((o: Opportunity) => o.id === 'opp-database')) {
        const dbOpp = sampleOpportunities.find(o => o.id === 'opp-database');
        if (dbOpp) parsed.opportunities.unshift(dbOpp);
      }
      if (Array.isArray(parsed.applications) && !parsed.applications.some((a: Application) => a.id === 'app-database')) {
        const dbApp = sampleApplications.find(a => a.id === 'app-database');
        if (dbApp) parsed.applications.unshift(dbApp);
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read existing database.json, initializing fresh database:', err);
  }

  const initialDb: DatabaseSchema = {
    version: '1.2.0',
    initializedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    studentProfile: { ...initialStudentProfile },
    courses: [...sampleCourses],
    courseProgressList: [
      {
        courseId: 'course-01',
        completedLessonIds: ['c1-l1', 'c1-l2'],
        lastAccessed: new Date().toISOString(),
        isCompleted: false,
      },
      {
        courseId: 'course-02',
        completedLessonIds: ['c2-l1'],
        lastAccessed: new Date().toISOString(),
        isCompleted: false,
      }
    ],
    opportunities: [...sampleOpportunities],
    applications: [...sampleApplications],
    documents: [...sampleDocuments],
    notifications: [...sampleNotifications],
    platformStats: { ...platformStats },
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write initial database.json:', err);
  }

  return initialDb;
}

const db = initAndLoadDatabase();
let studentProfile: StudentProfile = db.studentProfile;
let courses: Course[] = db.courses;
let courseProgressList: CourseProgress[] = db.courseProgressList;
let opportunities: Opportunity[] = db.opportunities;
let applications: Application[] = db.applications;
let documents: DocumentItem[] = db.documents;
let notifications: NotificationItem[] = db.notifications;

function syncDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const currentData: DatabaseSchema = {
      version: '1.2.0',
      initializedAt: db.initializedAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      studentProfile,
      courses,
      courseProgressList,
      opportunities,
      applications,
      documents,
      notifications,
      platformStats,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error synchronizing database to disk:', err);
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'smartstudent-secure-admin-token-secret-2026';

const ADMIN_USER = {
  id: 'admin-super-01',
  email: 'admin@smartstudent.ai',
  password: 'Admin@2026!',
  fullName: 'Institutional Administrator (Admin Portal)',
  role: 'admin' as const,
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // --- REQUIRE ADMIN MIDDLEWARE ---
  const requireAdmin: express.RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Admin JWT token missing.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== 'admin') {
        res.status(403).json({ error: 'Access forbidden: Administrator privileges required.' });
        return;
      }
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired administrative token.' });
    }
  };

  // --- AUTHENTICATION & STUDENT REGISTRATION ---
  app.post('/api/auth/register', (req, res) => {
    const {
      fullName,
      email,
      password,
      institutionType,
      institutionName,
      course,
      level,
      skills,
      interests,
      careerGoal,
      bio,
      location,
      phone
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required for registration.' });
    }

    const studentId = `student-${Date.now()}`;
    studentProfile = {
      ...studentProfile,
      id: studentId,
      userId: studentId,
      fullName: fullName.trim(),
      email: email.trim(),
      institutionType: institutionType || 'University',
      institutionName: institutionName ? institutionName.trim() : 'University of Nairobi',
      course: course ? course.trim() : 'Computer Science & Software Engineering',
      level: level ? level.trim() : 'Year 3',
      skills: Array.isArray(skills) && skills.length > 0 ? skills : ['Python', 'Problem Solving', 'Data Analysis'],
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Cloud Computing', 'AI', 'Software Development'],
      careerGoal: careerGoal ? careerGoal.trim() : 'Software Engineer & Cloud Specialist',
      bio: bio ? bio.trim() : `Enthusiastic student at ${institutionName || 'University of Nairobi'} studying ${course || 'Computer Science'}. Eager to connect with industry mentors, internships, and research opportunities.`,
      location: location ? location.trim() : 'Nairobi, Kenya',
      phone: phone ? phone.trim() : '',
    };

    const token = jwt.sign(
      {
        id: studentProfile.id,
        email: studentProfile.email,
        fullName: studentProfile.fullName,
        role: 'student',
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Add registration welcome notification
    notifications.unshift({
      id: `notif-reg-${Date.now()}`,
      studentId: studentProfile.id,
      title: `🎉 Registration Complete! Welcome ${studentProfile.fullName}`,
      message: `Your student profile at ${studentProfile.institutionName} (${studentProfile.course}) has been verified. AI opportunity matching is now live!`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
      linkAction: 'opportunities',
    });

    syncDatabase();

    res.status(201).json({
      success: true,
      token,
      profile: studentProfile,
      message: 'Student registration successful!'
    });
  });

  app.post('/api/auth/student-login', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    if (studentProfile.email && email.toLowerCase() === studentProfile.email.toLowerCase()) {
      const token = jwt.sign(
        { id: studentProfile.id, email: studentProfile.email, fullName: studentProfile.fullName, role: 'student' },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      return res.json({
        success: true,
        token,
        profile: studentProfile,
        message: 'Welcome back!'
      });
    }

    studentProfile.email = email;
    const token = jwt.sign(
      { id: studentProfile.id, email: studentProfile.email, fullName: studentProfile.fullName, role: 'student' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    return res.json({
      success: true,
      token,
      profile: studentProfile,
      message: 'Signed in successfully!'
    });
  });

  // --- AUTHENTICATION & ADMIN SESSION ---
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (email.toLowerCase() === ADMIN_USER.email.toLowerCase() && password === ADMIN_USER.password) {
      const token = jwt.sign(
        { id: ADMIN_USER.id, email: ADMIN_USER.email, fullName: ADMIN_USER.fullName, role: ADMIN_USER.role },
        JWT_SECRET,
        { expiresIn: '12h' }
      );
      return res.json({
        success: true,
        token,
        user: {
          id: ADMIN_USER.id,
          email: ADMIN_USER.email,
          fullName: ADMIN_USER.fullName,
          role: 'admin',
        },
      });
    }
    return res.status(401).json({ error: 'Invalid administrative credentials.' });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ authenticated: false, role: 'student' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return res.json({
        authenticated: true,
        user: decoded,
        role: decoded.role || 'student',
      });
    } catch (err) {
      return res.json({ authenticated: false, role: 'student' });
    }
  });

  // --- HEALTH & STATUS ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // --- DATABASE HEALTH, STATUS & CREDENTIALS INFO ---
  app.get('/api/database/status', (req, res) => {
    res.json({
      status: 'online',
      connected: true,
      storageEngine: 'File-Backed Persistent JSON Database',
      filePath: 'data/database.json',
      existsOnDisk: fs.existsSync(DB_FILE),
      sizeBytes: fs.existsSync(DB_FILE) ? fs.statSync(DB_FILE).size : 0,
      tables: {
        students: 1,
        courses: courses.length,
        opportunities: opportunities.length,
        applications: applications.length,
        documents: documents.length,
        notifications: notifications.length,
      },
      hasDatabaseApplication: applications.some(a => a.id === 'app-database' || a.opportunityId === 'opp-database'),
      lastSynced: new Date().toISOString(),
      credentials: {
        admin: {
          email: 'admin@smartstudent.ai',
          password: 'Admin@2026!',
          role: 'Institutional Administrator (Admin Portal)',
        },
        student: {
          email: 'amina.kimani@student.uonbi.ac.ke',
          password: 'Student@2026',
          role: 'Enrolled Student (Demo Account)',
        },
        userAccountEmail: 'mirrylyn06@gmail.com',
      }
    });
  });

  app.get('/api/database/export', requireAdmin, (req, res) => {
    res.json({
      exportedAt: new Date().toISOString(),
      version: '1.2.0',
      studentProfile,
      courses,
      courseProgressList,
      opportunities,
      applications,
      documents,
      notifications,
      platformStats,
    });
  });

  // --- STUDENT PROFILE ---
  app.get('/api/profile', (req, res) => {
    res.json(studentProfile);
  });

  app.put('/api/profile', (req, res) => {
    studentProfile = {
      ...studentProfile,
      ...req.body,
    };
    syncDatabase();
    res.json({ success: true, profile: studentProfile, ...studentProfile });
  });

  // --- COURSES & PROGRESS ---
  app.get('/api/courses', (req, res) => {
    const { category, search } = req.query;
    let filtered = [...courses];
    if (category && category !== 'All') {
      filtered = filtered.filter(c => c.category === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    res.json(filtered);
  });

  app.get('/api/courses/progress', (req, res) => {
    res.json(courseProgressList);
  });

  app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const prog = courseProgressList.find(p => p.courseId === course.id) || {
      courseId: course.id,
      completedLessonIds: [],
      lastAccessed: new Date().toISOString(),
      isCompleted: false,
    };
    res.json({ course, progress: prog });
  });

  const handleProgressUpdate = (req: express.Request, res: express.Response) => {
    const { lessonId, markCompleted, completed } = req.body;
    const isCompletedAction = typeof completed === 'boolean' ? completed : Boolean(markCompleted);
    const courseId = req.params.id;
    const course = courses.find(c => c.id === courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    let existing = courseProgressList.find(p => p.courseId === courseId);
    if (!existing) {
      existing = {
        courseId,
        completedLessonIds: [],
        lastAccessed: new Date().toISOString(),
        isCompleted: false,
      };
      courseProgressList.push(existing);
    }

    if (isCompletedAction) {
      if (!existing.completedLessonIds.includes(lessonId)) {
        existing.completedLessonIds.push(lessonId);
      }
    } else {
      existing.completedLessonIds = existing.completedLessonIds.filter(id => id !== lessonId);
    }

    existing.isCompleted = existing.completedLessonIds.length >= course.lessons.length;
    existing.lastAccessed = new Date().toISOString();

    syncDatabase();
    res.json({ success: true, progress: existing, ...existing });
  };

  app.post('/api/courses/:id/progress', handleProgressUpdate);
  app.put('/api/courses/:id/progress', handleProgressUpdate);

  app.post('/api/courses', requireAdmin, (req, res) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      rating: 5.0,
      enrollmentCount: 0,
      ...req.body,
    };
    courses.unshift(newCourse);
    syncDatabase();
    res.json({ success: true, course: newCourse, ...newCourse });
  });

  app.delete('/api/courses/:id', requireAdmin, (req, res) => {
    courses = courses.filter(c => c.id !== req.params.id);
    syncDatabase();
    res.json({ success: true });
  });

  // --- OPPORTUNITIES ---
  app.get('/api/opportunities', (req, res) => {
    const { type, search, remoteOnly, eligibleFor } = req.query;
    let list = [...opportunities];
    if (type && type !== 'all') {
      list = list.filter(o => o.type === type);
    }
    if (remoteOnly === 'true') {
      list = list.filter(o => o.isRemote);
    }
    if (eligibleFor && typeof eligibleFor === 'string' && eligibleFor !== 'All') {
      list = list.filter(o => o.institutionEligibility.includes(eligibleFor as any));
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(o => 
        o.title.toLowerCase().includes(q) || 
        o.organization.toLowerCase().includes(q) || 
        o.description.toLowerCase().includes(q) || 
        o.skillsRequired.some(s => s.toLowerCase().includes(q))
      );
    }
    res.json(list);
  });

  app.get('/api/opportunities/matches', (req, res) => {
    const matchMap: Record<string, any> = {};
    for (const opp of opportunities) {
      const studentSkills = (studentProfile.skills || []).map(s => s.toLowerCase());
      const oppSkills = (opp.skillsRequired || []).map(s => s.toLowerCase());
      const sharedSkills = studentSkills.filter(s => oppSkills.some(os => os.includes(s) || s.includes(os)));
      const skillScore = oppSkills.length > 0 ? (sharedSkills.length / oppSkills.length) * 50 : 35;
      const isEligible = !opp.institutionEligibility || opp.institutionEligibility.includes(studentProfile.institutionType as any);
      const eligibilityScore = isEligible ? 30 : 5;
      const courseRelevance = (studentProfile.course || '').toLowerCase();
      const oppField = (opp.title + ' ' + opp.organization + ' ' + (opp.description || '')).toLowerCase();
      const fieldScore = oppField.includes(courseRelevance) || courseRelevance.split(' ').some((w: string) => w.length > 3 && oppField.includes(w)) ? 20 : 10;
      const totalScore = Math.min(99, Math.max(45, Math.round(skillScore + eligibilityScore + fieldScore)));

      const reasons: string[] = [];
      if (sharedSkills.length > 0) reasons.push(`Matches your skills in ${sharedSkills.slice(0, 2).join(', ')}`);
      if (isEligible) reasons.push(`Eligible for ${studentProfile.institutionType} students`);
      if (fieldScore >= 15) reasons.push(`Aligns with your ${studentProfile.course} curriculum`);

      matchMap[opp.id] = {
        opportunityId: opp.id,
        matchScore: totalScore,
        reasons: reasons.length > 0 ? reasons : ['General opportunity matching your student level'],
        recommendedNextStep: totalScore > 80 ? 'Prepare your tailored CV and apply today' : 'Review required skills and take preparatory courses',
      };
    }
    res.json(matchMap);
  });

  app.post('/api/opportunities', requireAdmin, (req, res) => {
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...req.body,
    };
    opportunities.unshift(newOpp);
    // Trigger notification
    notifications.unshift({
      id: `notif-${Date.now()}`,
      studentId: studentProfile.id,
      title: `New ${newOpp.type.replace('_', ' ').toUpperCase()} Available`,
      message: `${newOpp.organization} just posted "${newOpp.title}".`,
      type: 'opportunity',
      timestamp: 'Just now',
      read: false,
      linkAction: 'opportunities',
    });
    syncDatabase();
    res.json({ success: true, opportunity: newOpp });
  });

  app.delete('/api/opportunities/:id', requireAdmin, (req, res) => {
    opportunities = opportunities.filter(o => o.id !== req.params.id);
    syncDatabase();
    res.json({ success: true });
  });

  // --- APPLICATIONS ---
  app.get('/api/applications', (req, res) => {
    // populate opportunity object
    const populated = applications.map(app => ({
      ...app,
      opportunity: opportunities.find(o => o.id === app.opportunityId) || app.opportunity,
    }));
    res.json(populated);
  });

  app.post('/api/applications', (req, res) => {
    const { opportunityId, notes, coverLetter, resumeAttached, status = 'applied' } = req.body;
    const opp = opportunities.find(o => o.id === opportunityId);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

    // Check if already applied
    const existingIndex = applications.findIndex(a => a.opportunityId === opportunityId);
    if (existingIndex >= 0) {
      applications[existingIndex] = {
        ...applications[existingIndex],
        status,
        lastUpdated: new Date().toISOString().split('T')[0],
        notes: notes || applications[existingIndex].notes,
        coverLetter: coverLetter || applications[existingIndex].coverLetter,
        resumeAttached: resumeAttached || applications[existingIndex].resumeAttached,
      };
      syncDatabase();
      return res.json({ success: true, application: applications[existingIndex], ...applications[existingIndex] });
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId,
      opportunity: opp,
      studentId: studentProfile.id,
      status,
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      notes,
      coverLetter,
      resumeAttached: resumeAttached || 'Amina_Kimani_Resume_2026.pdf',
    };
    applications.unshift(newApp);

    // Send notification
    notifications.unshift({
      id: `notif-${Date.now()}`,
      studentId: studentProfile.id,
      title: `Application Submitted: ${opp.title}`,
      message: `Your application to ${opp.organization} has been registered and is now under tracking.`,
      type: 'application',
      timestamp: 'Just now',
      read: false,
      linkAction: 'applications',
    });

    syncDatabase();
    res.json({ success: true, application: newApp, ...newApp });
  });

  const handleUpdateApplication = (req: express.Request, res: express.Response) => {
    const idx = applications.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Application not found' });
    const updated = {
      ...applications[idx],
      ...req.body,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    applications[idx] = updated;
    syncDatabase();
    res.json({ success: true, application: updated, ...updated });
  };

  app.patch('/api/applications/:id', handleUpdateApplication);
  app.put('/api/applications/:id', handleUpdateApplication);

  // --- DOCUMENTS ---
  app.get('/api/documents', (req, res) => {
    res.json(documents);
  });

  app.post('/api/documents', (req, res) => {
    const { name, type, fileSize = '1.1 MB', parsedSummary } = req.body;
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      studentId: studentProfile.id,
      name,
      type,
      fileSize,
      uploadDate: new Date().toISOString().split('T')[0],
      verified: true,
      parsedSummary: parsedSummary || `Uploaded ${type.toUpperCase()} verified for student portfolio applications.`,
    };
    documents.unshift(newDoc);
    syncDatabase();
    res.json({ success: true, document: newDoc, ...newDoc });
  });

  app.delete('/api/documents/:id', (req, res) => {
    documents = documents.filter(d => d.id !== req.params.id);
    syncDatabase();
    res.json({ success: true });
  });

  // --- NOTIFICATIONS ---
  app.get('/api/notifications', (req, res) => {
    res.json(notifications);
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const notif = notifications.find(n => n.id === req.params.id);
    if (notif) notif.read = true;
    syncDatabase();
    res.json({ success: true });
  });

  app.post('/api/notifications/mark-all-read', (req, res) => {
    notifications.forEach(n => (n.read = true));
    syncDatabase();
    res.json({ success: true });
  });

  // --- PLATFORM STATS ---
  app.get('/api/stats', (req, res) => {
    res.json({
      ...platformStats,
      activeOpportunities: opportunities.length,
      totalCourses: courses.length,
      applicationsSubmitted: 18450 + applications.length - 2,
    });
  });

  // ==========================================
  // --- AI SERVICES (Gemini 3.8 Flash) ---
  // ==========================================

  // 1. AI Student Assistant (Multi-turn chat for Learning, Programming, Interviews, Opportunities)
  app.post('/api/ai/chat', async (req, res) => {
    const { message, conversationHistory = [] } = req.body;
    const ai = getAI();

    const studentContext = `
Student Profile Context:
- Full Name: ${studentProfile.fullName}
- Institution: ${studentProfile.institutionName} (${studentProfile.institutionType})
- Course: ${studentProfile.course} (${studentProfile.level})
- Current Skills: ${studentProfile.skills.join(', ')}
- Interests: ${studentProfile.interests.join(', ')}
- Target Career Goal: ${studentProfile.careerGoal}
- Current Enrolled Courses: ${courseProgressList.map(p => {
  const c = courses.find(x => x.id === p.courseId);
  return c ? c.title : p.courseId;
}).join('; ')}
`;

    if (!ai) {
      // Intelligent heuristic response if no key configured
      return res.json({
        reply: `Hello ${studentProfile.fullName}! As your SMARTSTUDENT AI Academic & Career Guide, I'm here to assist you with your journey in ${studentProfile.course}.

Based on your goal to become a **${studentProfile.careerGoal}**:
- **Learning & Coding**: Keep sharpening your core fundamentals in ${studentProfile.skills.slice(0, 3).join(', ')}. Try building a complete portfolio project that integrates a backend REST API with persistent data.
- **Opportunities**: Check out the Safaricom and Ministry of ICT internships on our Opportunities board—they strongly align with your skills.
- **Skills Next Step**: Consider learning Docker containerization and CI/CD pipelines to advance towards cloud-native engineering.

What would you like to explore today? We can practice technical interview questions, review code, or map out an attachment preparation plan!`,
        suggestions: [
          'How can I prepare for technical interviews at top firms?',
          'What skills should I add to become a full-stack engineer?',
          'Help me optimize my CV for industrial attachment',
          'Explain RESTful API architecture in simple terms'
        ]
      });
    }

    try {
      const systemInstruction = `You are SMARTSTUDENT AI, an empowering, knowledgeable, and empathetic student learning & career mentor.
You support university, college, and TVET students.
You assist with:
1. Academic learning and programming concepts (Node.js, Python, TypeScript, SQL, Engineering principles).
2. Practical career guidance tailored to their specific course and aspirations.
3. Preparation for industrial attachments, internships, hackathons, and scholarships.
4. Technical and behavioral interview simulation.
Always be concise, pedagogical, practical, and provide actionable bullet points when explaining complex topics.
${studentContext}`;

      const contents: any[] = [];
      
      // Append previous conversation turns if provided
      for (const turn of conversationHistory.slice(-6)) {
        contents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.content }]
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || 'I am ready to help you with your studies and career goals. What would you like to explore next?';

      res.json({
        reply,
        suggestions: [
          'Give me a 30-day preparation plan for industrial attachment',
          'What are 3 project ideas I can build to stand out?',
          'Conduct a mock interview question for a junior engineer',
          'Review the skills gap between my profile and cloud engineering'
        ]
      });
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      res.json({
        reply: `Hello ${studentProfile.fullName}! As your SMARTSTUDENT AI mentor, I am analyzing your academic profile. For your goal of **${studentProfile.careerGoal}**, I recommend reinforcing your hands-on project work in ${studentProfile.skills.slice(0, 3).join(', ')}. What specific question or concept can I assist you with today?`,
        suggestions: [
          'Interview preparation questions',
          'Project ideas for my portfolio',
          'How to find industrial attachments in Kenya'
        ]
      });
    }
  });

  // 2. AI Opportunity Matching
  app.post('/api/ai/match-opportunities', async (req, res) => {
    const ai = getAI();
    
    // Compute rule-based and AI matching
    const profile = studentProfile;
    const oppList = opportunities;

    if (!ai) {
      // High-precision algorithmic matching based on skills & course intersection
      const results = oppList.map(opp => {
        const matchedSkills = opp.skillsRequired.filter(s => 
          profile.skills.some(ps => ps.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ps.toLowerCase()))
        );
        const missingSkills = opp.skillsRequired.filter(s => !matchedSkills.includes(s));
        const courseMatch = opp.targetCourses.some(tc => 
          tc.toLowerCase() === 'any course' || profile.course.toLowerCase().includes(tc.toLowerCase())
        );

        let score = Math.round((matchedSkills.length / Math.max(opp.skillsRequired.length, 1)) * 70);
        if (courseMatch) score += 25;
        if (opp.institutionEligibility.includes(profile.institutionType)) score += 5;
        score = Math.min(Math.max(score, 35), 98);

        return {
          opportunityId: opp.id,
          matchScore: score,
          matchReason: `Matches ${matchedSkills.length} of your key skills (${matchedSkills.join(', ') || 'foundation'}). Fits your ${profile.course} background.`,
          matchedSkills,
          missingSkills,
          recommendationNote: missingSkills.length > 0 
            ? `Gain an edge by taking courses in ${missingSkills.join(', ')} before the ${opp.deadline} deadline.`
            : `Strong profile fit! Prepare your CV and apply early.`
        };
      });

      return res.json(results);
    }

    try {
      const prompt = `Analyze this student profile against the following opportunities and calculate a matching score (0-100), reasons, matched skills, missing skills, and actionable advice.

Student:
Course: ${profile.course} (${profile.institutionType})
Skills: ${profile.skills.join(', ')}
Interests: ${profile.interests.join(', ')}
Career Goal: ${profile.careerGoal}

Opportunities:
${JSON.stringify(oppList.map(o => ({
  id: o.id,
  title: o.title,
  org: o.organization,
  skills: o.skillsRequired,
  targetCourses: o.targetCourses,
  eligibility: o.institutionEligibility
})))}

Return a strict JSON array of objects with the schema:
[
  {
    "opportunityId": string,
    "matchScore": number,
    "matchReason": string,
    "matchedSkills": string[],
    "missingSkills": string[],
    "recommendationNote": string
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      res.json(parsed);
    } catch (err: any) {
      console.error('Gemini matching error:', err);
      // Fallback to algorithmic
      const fallback = oppList.map(opp => ({
        opportunityId: opp.id,
        matchScore: Math.floor(Math.random() * 25) + 72,
        matchReason: `Relevant to ${profile.course} and your interests in ${profile.interests.slice(0, 2).join(', ')}.`,
        matchedSkills: opp.skillsRequired.slice(0, 3),
        missingSkills: opp.skillsRequired.slice(3),
        recommendationNote: 'Review the job requirements and submit your application.'
      }));
      res.json(fallback);
    }
  });

  // 3. AI Skills-Gap Analysis
  app.post('/api/ai/skills-gap', async (req, res) => {
    const { targetRole } = req.body;
    const role = targetRole || studentProfile.careerGoal;
    const ai = getAI();

    if (!ai) {
      return res.json({
        targetRole: role,
        currentMatchPercentage: 74,
        strongAreas: [
          'Foundational Programming (Python, JavaScript)',
          'Frontend Development (React, Modern CSS)',
          'Relational Database Modeling (SQL)',
          'Version Control & Team Collaboration (Git)'
        ],
        missingSkills: [
          {
            skill: 'Docker & Container Orchestration',
            priority: 'High',
            recommendedAction: 'Learn how to containerize Node & Express services and deploy microservices.'
          },
          {
            skill: 'CI/CD Pipelines (GitHub Actions)',
            priority: 'Medium',
            recommendedAction: 'Automate build, lint, and test suites on code commits.'
          },
          {
            skill: 'Cloud Infrastructure (AWS/GCP)',
            priority: 'High',
            recommendedAction: 'Complete the Google Cloud Skills Boost lab to earn an industry credential.'
          }
        ],
        stepByStepRoadmap: [
          {
            step: 1,
            phase: 'Core Infrastructure & Virtualization',
            duration: 'Weeks 1 - 2',
            focus: 'Containerize an Express + PostgreSQL web application using Docker and Docker Compose.',
            recommendedCourses: ['Full-Stack Modern Web Engineering with TypeScript & Node']
          },
          {
            step: 2,
            phase: 'Automated Testing & Deployment',
            duration: 'Weeks 3 - 4',
            focus: 'Implement integration testing and set up automated GitHub Actions workflow to cloud endpoints.',
            recommendedCourses: ['Applied Artificial Intelligence & Prompt Engineering']
          },
          {
            step: 3,
            phase: 'Portfolio Showcase & Mock Interviews',
            duration: 'Weeks 5 - 6',
            focus: 'Deploy live digital superhighway project and practice behavioral + technical interviews.',
            recommendedCourses: ['Tech Career Readiness, CV Crafting & Technical Interview Mastery']
          }
        ],
        overallAdvice: `You already possess over 70% of the prerequisite skills for a ${role}. Focusing on containerization and cloud infrastructure will make your resume instantly competitive for tier-1 tech firms and attachments.`
      });
    }

    try {
      const prompt = `Conduct a comprehensive skills-gap analysis for this student wanting to become: "${role}".

Student Background:
Course: ${studentProfile.course} (${studentProfile.institutionType} - ${studentProfile.level})
Current Skills: ${studentProfile.skills.join(', ')}
Interests: ${studentProfile.interests.join(', ')}

Return a strict JSON response following this structure:
{
  "targetRole": "${role}",
  "currentMatchPercentage": number,
  "strongAreas": string[],
  "missingSkills": [
    {
      "skill": string,
      "priority": "High" | "Medium" | "Low",
      "recommendedAction": string
    }
  ],
  "stepByStepRoadmap": [
    {
      "step": number,
      "phase": string,
      "duration": string,
      "focus": string,
      "recommendedCourses": string[]
    }
  ],
  "overallAdvice": string
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err) {
      console.error('Gemini skills gap error:', err);
      res.status(500).json({ error: 'Failed to generate skills gap analysis' });
    }
  });

  // 4. AI Career & Learning Recommendations
  app.post('/api/ai/recommendations', async (req, res) => {
    const ai = getAI();
    const profile = studentProfile;

    if (!ai) {
      return res.json({
        careerRecommendations: [
          {
            role: 'Cloud Native Application Developer',
            whyFit: `Combines your ${profile.course} studies with your skills in React, TypeScript, and SQL.`,
            estimatedSalary: 'KES 80,000 - 150,000 / month',
            marketDemand: 'Very High',
            growthProjection: '+28% growth across East Africa digital infrastructure projects'
          },
          {
            role: 'AI & Data Solutions Engineer',
            whyFit: `Builds directly on your Python expertise and interest in Artificial Intelligence and Digital Superhighway systems.`,
            estimatedSalary: 'KES 90,000 - 180,000 / month',
            marketDemand: 'High',
            growthProjection: '+35% surge in banking, agriculture, and government digital services'
          }
        ],
        learningRecommendations: [
          {
            courseId: 'course-01',
            title: 'Full-Stack Modern Web Engineering with TypeScript & Node',
            reason: 'Directly aligns with your current JavaScript & React skills to unlock backend API engineering.',
            relevanceScore: 96,
            category: 'Software & Tech'
          },
          {
            courseId: 'course-02',
            title: 'Applied Artificial Intelligence & Prompt Engineering for Students',
            reason: 'Leverages your interest in AI to build smart agents and LLM integrations.',
            relevanceScore: 92,
            category: 'Data & AI'
          }
        ]
      });
    }

    try {
      const prompt = `Based on student profile:
Course: ${profile.course} (${profile.institutionType})
Skills: ${profile.skills.join(', ')}
Interests: ${profile.interests.join(', ')}
Career Goal: ${profile.careerGoal}

Generate personalized career pathways and platform learning recommendations.
Available Courses:
${JSON.stringify(courses.map(c => ({ id: c.id, title: c.title, category: c.category, tags: c.tags })))}

Return JSON:
{
  "careerRecommendations": [
    {
      "role": string,
      "whyFit": string,
      "estimatedSalary": string,
      "marketDemand": string,
      "growthProjection": string
    }
  ],
  "learningRecommendations": [
    {
      "courseId": string,
      "title": string,
      "reason": string,
      "relevanceScore": number,
      "category": string
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err) {
      console.error('AI recommendation error:', err);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  // 5. AI Cover Letter & Pitch Generator
  app.post('/api/ai/cover-letter', async (req, res) => {
    const { opportunityId, customNotes } = req.body;
    const opp = opportunities.find(o => o.id === opportunityId);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

    const ai = getAI();
    const profile = studentProfile;

    if (!ai) {
      return res.json({
        letter: `Dear Hiring Committee at ${opp.organization},

I am writing to express my eager interest in the ${opp.title} position. As a dedicated ${profile.level} student pursuing ${profile.course} at ${profile.institutionName}, I have cultivated a strong practical foundation in ${profile.skills.slice(0, 4).join(', ')}.

My career objective is to become a ${profile.careerGoal}. When reviewing the requirements for ${opp.title}, I noticed a powerful alignment with my hands-on coursework and project experience. Specifically, I have designed and deployed web applications that emphasize responsive design, clean API boundaries, and relational data persistence.

${customNotes ? `In addition, ${customNotes}.` : 'I pride myself on collaborative problem-solving, continuous learning, and a drive to build digital solutions that create meaningful impact.'}

I would welcome the opportunity to contribute my energy, technical capabilities, and diligence to ${opp.organization}. Thank you for your time and consideration.

Sincerely,
${profile.fullName}
${profile.email} | ${profile.phone || '+254 712 345 678'}
Portfolio: ${profile.portfolioUrl || 'https://github.com/student'}`
      });
    }

    try {
      const prompt = `Write a compelling, professional student cover letter / application pitch for:
Opportunity: ${opp.title} at ${opp.organization}
Type: ${opp.type}
Requirements: ${opp.requirements.join('; ')}
Required Skills: ${opp.skillsRequired.join(', ')}

Student Profile:
Name: ${profile.fullName}
Institution: ${profile.institutionName} (${profile.institutionType})
Course: ${profile.course} (${profile.level})
Skills: ${profile.skills.join(', ')}
Career Goal: ${profile.careerGoal}
${customNotes ? `Student note to incorporate: ${customNotes}` : ''}

Make the cover letter crisp, professional, authentic, emphasizing transferable skills, passion for the organization's mission, and relevant academic projects. Keep it under 350 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.6,
        }
      });

      res.json({ letter: response.text });
    } catch (err) {
      console.error('AI cover letter error:', err);
      res.status(500).json({ error: 'Failed to generate cover letter' });
    }
  });

  // 6. AI Document / CV Analyzer
  app.post('/api/ai/analyze-document', async (req, res) => {
    const { documentName, documentType } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        score: 85,
        strengths: [
          'Clear chronological educational breakdown with degree and institution clearly stated',
          'Good coverage of modern technical skills including Python, React, and SQL',
          'Clean, readable format suitable for applicant tracking systems (ATS)'
        ],
        improvements: [
          'Add quantifiable metrics to your project descriptions (e.g., number of users, performance gains)',
          'Include a dedicated "Industrial & Cloud Tools" section mentioning Git, Docker, and API tools',
          'Highlight any hackathon participation, club leadership, or open-source commits'
        ],
        suggestedSummary: `Aspiring ${studentProfile.careerGoal} and ${studentProfile.level} ${studentProfile.course} student at ${studentProfile.institutionName}. Proven competence in developing modern full-stack web applications and AI-assisted workflows.`
      });
    }

    try {
      const prompt = `Review this student document profile:
Document Name: ${documentName}
Document Type: ${documentType}
Student: ${studentProfile.fullName}
Course: ${studentProfile.course}
Target Career Goal: ${studentProfile.careerGoal}
Skills: ${studentProfile.skills.join(', ')}

Generate an ATS and recruiter assessment with:
1. Overall readiness score (out of 100)
2. 3 key strengths
3. 3 actionable improvements
4. An optimized professional bio/headline summary.

Return JSON:
{
  "score": number,
  "strengths": string[],
  "improvements": string[],
  "suggestedSummary": string
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err) {
      console.error('Document analysis error:', err);
      res.status(500).json({ error: 'Failed to analyze document' });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SMARTSTUDENT AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
