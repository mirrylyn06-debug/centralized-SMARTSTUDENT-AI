export type UserRole = 'student' | 'admin' | 'organization';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  institutionType: 'University' | 'College' | 'TVET' | 'Recent Graduate';
  institutionName: string;
  course: string;
  level: string; // e.g. "Year 3", "Diploma Year 2", "Degree Final Year", "Graduated 2025"
  skills: string[];
  interests: string[];
  careerGoal: string;
  bio: string;
  location: string;
  gpaOrGrade?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  phone?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "25 min"
  summary: string;
  content: string; // Detailed educational notes/code
  videoUrl?: string;
  resources?: { name: string; url: string }[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Course {
  id: string;
  title: string;
  category: 'Software & Tech' | 'Data & AI' | 'Engineering & TVET' | 'Career & Soft Skills' | 'Business & Innovation';
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor: string;
  instructorTitle: string;
  thumbnail: string;
  tags: string[];
  lessons: Lesson[];
  enrollmentCount: number;
  rating: number;
}

export interface CourseProgress {
  courseId: string;
  completedLessonIds: string[];
  lastAccessed: string;
  isCompleted: boolean;
}

export type OpportunityType = 
  | 'internship'
  | 'industrial_attachment'
  | 'job'
  | 'scholarship'
  | 'competition'
  | 'hackathon'
  | 'training'
  | 'fellowship';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  orgLogo?: string;
  type: OpportunityType;
  location: string;
  isRemote: boolean;
  deadline: string; // YYYY-MM-DD
  stipendOrReward: string; // e.g. "Paid ($600/mo)", "Full Tuition + Living Expenses", "$10,000 Prize Pool"
  description: string;
  requirements: string[];
  skillsRequired: string[];
  targetCourses: string[];
  applicationUrl?: string;
  institutionEligibility: ('University' | 'College' | 'TVET' | 'Recent Graduate')[];
  featured?: boolean;
  createdAt: string;
}

export type ApplicationStatus = 
  | 'saved'
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'accepted'
  | 'rejected';

export interface Application {
  id: string;
  opportunityId: string;
  opportunity?: Opportunity;
  studentId: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
  interviewDate?: string;
  coverLetter?: string;
  resumeAttached?: string;
}

export interface DocumentItem {
  id: string;
  studentId: string;
  name: string;
  type: 'cv' | 'certificate' | 'transcript' | 'portfolio';
  fileSize: string;
  uploadDate: string;
  downloadUrl?: string;
  verified?: boolean;
  parsedSummary?: string;
}

export interface NotificationItem {
  id: string;
  studentId: string;
  title: string;
  message: string;
  type: 'opportunity' | 'deadline' | 'application' | 'learning' | 'system';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface OpportunityMatchReport {
  opportunityId: string;
  matchScore: number; // 0 - 100
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendationNote: string;
}

export interface SkillsGapAnalysisResult {
  targetRole: string;
  currentMatchPercentage: number;
  strongAreas: string[];
  missingSkills: {
    skill: string;
    priority: 'High' | 'Medium' | 'Low';
    recommendedAction: string;
  }[];
  stepByStepRoadmap: {
    step: number;
    phase: string;
    duration: string;
    focus: string;
    recommendedCourses: string[];
  }[];
  overallAdvice: string;
}

export interface LearningRecommendation {
  courseId: string;
  title: string;
  reason: string;
  relevanceScore: number;
  category: string;
}

export interface PlatformStats {
  totalStudents: number;
  activeOpportunities: number;
  totalCourses: number;
  applicationsSubmitted: number;
  matchingSuccessRate: number;
  partnerOrganizations: number;
}
