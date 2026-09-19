import { Course, Opportunity, StudentProfile, DocumentItem, NotificationItem, PlatformStats, Application } from '../types';

export const initialStudentProfile: StudentProfile = {
  id: 'student-01',
  userId: 'user-01',
  fullName: 'Amina Kimani',
  email: 'amina.kimani@university.ac.ke',
  institutionType: 'University',
  institutionName: 'Technical University of Kenya & Strathmore',
  course: 'BSc Computer Science & Information Technology',
  level: 'Year 3',
  skills: ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'Data Structures', 'REST APIs'],
  interests: ['Artificial Intelligence', 'Web Development', 'Cloud Computing', 'Tech For Good', 'Fintech'],
  careerGoal: 'Full Stack AI Engineer at a global tech firm or leading innovation hub',
  bio: 'Passionate 3rd-year CS student enthusiastic about building digital superhighway solutions, scalable cloud systems, and AI-enabled apps for emerging markets.',
  location: 'Nairobi, Kenya',
  gpaOrGrade: 'First Class Honors (3.8 GPA)',
  githubUrl: 'https://github.com/aminak-dev',
  linkedinUrl: 'https://linkedin.com/in/amina-kimani-tech',
  portfolioUrl: 'https://aminakimani.dev',
  phone: '+254 712 345 678',
};

export const sampleCourses: Course[] = [
  {
    id: 'course-01',
    title: 'Full-Stack Modern Web Engineering with TypeScript & Node',
    category: 'Software & Tech',
    description: 'Master end-to-end web development from relational databases, clean RESTful architectures, and Express to modern React and state management.',
    level: 'Intermediate',
    duration: '6 Weeks (24 Hours)',
    instructor: 'Eng. David Ochieng',
    instructorTitle: 'Senior Cloud Architect & TVET Tech Mentor',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    tags: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'REST API'],
    enrollmentCount: 1420,
    rating: 4.9,
    lessons: [
      {
        id: 'c1-l1',
        title: 'Architecture of Modern Web Applications & Digital Highways',
        duration: '35 min',
        summary: 'Understand client-server 3-tier models, API gateways, and distributed cloud hosting.',
        content: `### 1. Modern Web Application Architecture
Modern web applications leverage a three-tier architecture:
- **Presentation Layer**: Single Page Applications (React, Vue) executing directly in client runtimes with responsive CSS frameworks.
- **Application/Business Logic Layer**: Stateless RESTful services running on Node.js/Express, microservices, or serverless workers.
- **Data Layer**: Relational (PostgreSQL) and cache layers (Redis) ensuring ACID compliance and high-throughput queries.

### 2. The Digital Superhighway Context
By standardizing on lightweight JSON payloads and edge distribution, bandwidth-constrained students across remote institutions can enjoy low-latency access to educational resources.`,
        resources: [
          { name: 'REST API Best Practices Guide', url: 'https://restfulapi.net' },
          { name: 'PostgreSQL Schema Blueprint', url: 'https://postgresql.org' }
        ],
        quiz: {
          question: 'In a 3-layer architecture, where should sensitive API keys and authorization verification occur?',
          options: [
            'In the client-side React component',
            'In the server-side Node.js/Express application layer',
            'Inside local storage in the browser',
            'Directly in HTML data attributes'
          ],
          correctIndex: 1,
          explanation: 'All secrets and authoritative access controls must be executed server-side to prevent exposure in client bundles.'
        }
      },
      {
        id: 'c1-l2',
        title: 'Building Production-Grade Express APIs with Input Validation',
        duration: '45 min',
        summary: 'Create secure endpoints with middleware, error handling, and robust schemas.',
        content: `### Implementing Express Middleware
Middleware functions have access to the request object (\`req\`), the response object (\`res\`), and the \`next\` middleware function:
\`\`\`typescript
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});
\`\`\`
Always validate request payloads before hitting database queries to prevent injection vulnerabilities.`,
        resources: [
          { name: 'Express Security Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html' }
        ],
        quiz: {
          question: 'What is the role of the next() function in Express middleware?',
          options: [
            'It terminates the HTTP request immediately',
            'It passes control to the next middleware in the execution stack',
            'It rolls back the database transaction',
            'It restarts the dev server'
          ],
          correctIndex: 1,
          explanation: 'Calling next() passes execution to the subsequent middleware or route handler.'
        }
      },
      {
        id: 'c1-l3',
        title: 'State Management & Asynchronous Data Fetching in React',
        duration: '40 min',
        summary: 'Coordinate state, custom hooks, and handle race conditions smoothly in frontend interfaces.',
        content: `### Efficient React State Strategies
Learn how to use React state hooks, prevent unnecessary re-renders, and abstract API communication into custom hooks with clean error and loading boundaries.`,
        resources: [
          { name: 'React Hooks Documentation', url: 'https://react.dev' }
        ]
      }
    ]
  },
  {
    id: 'course-02',
    title: 'Applied Artificial Intelligence & Prompt Engineering for Students',
    category: 'Data & AI',
    description: 'Learn foundational generative AI, LLM prompting strategies, AI system integration, and building intelligent student assistants.',
    level: 'Beginner',
    duration: '4 Weeks (16 Hours)',
    instructor: 'Dr. Sarah Mwangi',
    instructorTitle: 'AI Research Scientist & University Lecturer',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    tags: ['Artificial Intelligence', 'Gemini', 'Prompt Engineering', 'Python', 'Machine Learning'],
    enrollmentCount: 2310,
    rating: 4.95,
    lessons: [
      {
        id: 'c2-l1',
        title: 'Foundations of Generative Models and Large Language Models',
        duration: '30 min',
        summary: 'Explore how modern transformer architectures understand context, tokens, and multimodal inputs.',
        content: `### Understanding Large Language Models
LLMs predict subsequent tokens given context windows. By grounding models with structured prompts, temperature controls, and system directives, developers can produce deterministic outputs, valid JSON schemas, and reliable educational explanations.`,
        resources: [
          { name: 'Google DeepMind Research Overview', url: 'https://deepmind.google' }
        ]
      },
      {
        id: 'c2-l2',
        title: 'Designing Multi-Turn Student Coaches & Skills Analyzers',
        duration: '45 min',
        summary: 'Implement contextual conversation history, persona constraints, and automated resume feedback.',
        content: `### Crafting Contextual Student Assistant Prompts
To build a helpful academic assistant, provide:
1. Student context: Major/Course, current semester, target career.
2. Structured output: Clear action points, milestones, and practice questions.
3. Tone: Encouraging, objective, and pedagogically sound.`,
      }
    ]
  },
  {
    id: 'course-03',
    title: 'Practical TVET & Applied Engineering: Renewable Energy Systems',
    category: 'Engineering & TVET',
    description: 'Comprehensive hands-on training for technical students in solar PV installation, electrical safety, inverters, and sustainable industrial grid systems.',
    level: 'Intermediate',
    duration: '5 Weeks (20 Hours)',
    instructor: 'Ing. Joseph Kiptoo',
    instructorTitle: 'Certified Renewable Energy Inspector & TVET Master Trainer',
    thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    tags: ['TVET', 'Renewable Energy', 'Solar PV', 'Electrical Safety', 'Applied Engineering'],
    enrollmentCount: 890,
    rating: 4.85,
    lessons: [
      {
        id: 'c3-l1',
        title: 'Solar PV Sizing, Load Calculations, and Grid Synchronization',
        duration: '40 min',
        summary: 'Calculate wattage loads, battery banks, and invertor efficiencies for residential and commercial installations.',
        content: `### Load Calculation Formula:
Total Energy Demand (Watt-hours/day) = Sum of (Power Rating in Watts × Hours of Daily Operation).
Factor in 20% system loss to properly size the solar panel array and lithium battery backup systems.`,
      }
    ]
  },
  {
    id: 'course-04',
    title: 'Tech Career Readiness, CV Crafting & Technical Interview Mastery',
    category: 'Career & Soft Skills',
    description: 'Transform your student profile into compelling job and internship applications, master behavioural interviews, and ace technical coding challenges.',
    level: 'Beginner',
    duration: '3 Weeks (12 Hours)',
    instructor: 'Faith Wanjiku',
    instructorTitle: 'Head of Talent Acquisition & Career Coach',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    tags: ['Resume', 'Interviews', 'Career Growth', 'Networking', 'LinkedIn'],
    enrollmentCount: 3120,
    rating: 4.92,
    lessons: [
      {
        id: 'c4-l1',
        title: 'Structuring High-Impact Student CVs with the STAR Method',
        duration: '30 min',
        summary: 'Turn coursework, student projects, and hackathons into quantifiable professional achievements.',
        content: `### The STAR Technique for Resumes & Interviews:
- **Situation**: Context of the challenge or university project.
- **Task**: The specific responsibility you owned.
- **Action**: The exact tools, technologies, and methods you implemented.
- **Result**: Quantifiable outcome (e.g., "Reduced response latency by 35%", "Served 200+ active students").`,
      }
    ]
  }
];

export const sampleOpportunities: Opportunity[] = [
  {
    id: 'opp-database',
    title: 'Cloud Database Administrator & Distributed SQL Systems Intern',
    organization: 'Kenya Cloud Data Centre & Safaricom Data Infrastructure',
    orgLogo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=120&auto=format&fit=crop&q=80',
    type: 'internship',
    location: 'Nairobi / Hybrid',
    isRemote: false,
    deadline: '2026-11-20',
    stipendOrReward: 'Paid (KES 75,000 / mo + AWS Certified Database Specialty Exam Sponsorship)',
    description: 'Specialized database engineering and systems administration internship. Gain deep exposure to high-throughput PostgreSQL clusters, Redis caching tiers, automated schema migrations, zero-downtime replication, and cloud database security.',
    requirements: [
      'Enrolled in 2nd, 3rd, or final year in Computer Science, Software Engineering, BBIT, or TVET Diploma in ICT / Database Systems',
      'Solid command of SQL queries, normalization, indexing, and relational schema modeling (PostgreSQL / MySQL)',
      'Understanding of ACID properties, transaction isolation, and basic replication concepts',
      'Eagerness to automate database backups and health monitoring scripts in Python or Bash'
    ],
    skillsRequired: ['SQL', 'PostgreSQL', 'Database Design', 'Python', 'Cloud / AWS', 'Linux'],
    targetCourses: ['Computer Science', 'Software Engineering', 'Information Technology', 'BBIT', 'Data Science'],
    institutionEligibility: ['University', 'College', 'TVET', 'Recent Graduate'],
    featured: true,
    createdAt: '2026-09-15'
  },
  {
    id: 'opp-01',
    title: 'Software Engineering & Cloud Intern (Undergraduate/TVET)',
    organization: 'Safaricom PLC Digital Innovation Hub',
    orgLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    type: 'internship',
    location: 'Nairobi / Hybrid',
    isRemote: false,
    deadline: '2026-10-15',
    stipendOrReward: 'Paid (KES 65,000 / mo + Medical Cover)',
    description: 'Join Safaricom\'s cutting-edge software engineering team building financial inclusions systems, API integrations, and cloud-native microservices for millions of active users across East Africa.',
    requirements: [
      'Currently enrolled in 2nd, 3rd, or final year in Computer Science, Software Engineering, BBIT, or TVET Diploma in ICT',
      'Familiarity with at least one programming language: Python, JavaScript/TypeScript, Java, or Go',
      'Basic knowledge of Git version control and relational databases (SQL)',
      'Passion for solving real-world challenges through digital platforms'
    ],
    skillsRequired: ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'REST APIs'],
    targetCourses: ['Computer Science', 'Software Engineering', 'Information Technology', 'BBIT', 'Computer Technology'],
    institutionEligibility: ['University', 'College', 'TVET', 'Recent Graduate'],
    featured: true,
    createdAt: '2026-09-01'
  },
  {
    id: 'opp-02',
    title: 'Industrial Attachment: Telecommunications & Network Systems',
    organization: 'Kenya Electricity Transmission & ICT Authority (KETRACO)',
    orgLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
    type: 'industrial_attachment',
    location: 'Nairobi & Regional Sub-stations',
    isRemote: false,
    deadline: '2026-10-30',
    stipendOrReward: 'Government Stipend (KES 30,000 / mo)',
    description: 'Mandatory 3-month industrial attachment placement for engineering and IT students seeking hands-on exposure to SCADA systems, fiber optics, network security, and infrastructure monitoring.',
    requirements: [
      'Valid student ID and recommendation letter from recognized University, College, or TVET Institute',
      'Pursuing Degree or Diploma in Electrical & Electronics Engineering, Telecommunications, or Network Engineering',
      'Strong safety mindset and eagerness to learn on-site industrial machinery'
    ],
    skillsRequired: ['Networking', 'Electrical Systems', 'Hardware', 'Telecommunications', 'SCADA'],
    targetCourses: ['Electrical Engineering', 'Telecommunication Engineering', 'Computer Engineering', 'TVET Electrical Installation'],
    institutionEligibility: ['University', 'College', 'TVET'],
    featured: true,
    createdAt: '2026-09-05'
  },
  {
    id: 'opp-03',
    title: 'Google African Tech Scholarship & Mentorship 2026',
    organization: 'Google Developer Student Clubs, Sub-Saharan Africa',
    orgLogo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=120&auto=format&fit=crop&q=80',
    type: 'scholarship',
    location: 'Fully Remote',
    isRemote: true,
    deadline: '2026-11-10',
    stipendOrReward: 'Full Tuition + $1,500 Laptop Grant + 1-on-1 Mentorship',
    description: 'Designed to support high-achieving female and underrepresented students pursuing computing, AI, or software development qualifications with fully funded Google Cloud & Gemini developer credits.',
    requirements: [
      'Enrolled in undergraduate degree or diploma program in an accredited African tertiary institution',
      'Demonstrated academic merit or active community leadership in tech clubs',
      'Commitment to complete 3 hands-on open-source milestones'
    ],
    skillsRequired: ['Python', 'Cloud Computing', 'Git', 'Problem Solving', 'Data Structures'],
    targetCourses: ['Computer Science', 'Data Science', 'Software Engineering', 'Information Systems'],
    institutionEligibility: ['University', 'College', 'TVET', 'Recent Graduate'],
    featured: true,
    createdAt: '2026-09-10'
  },
  {
    id: 'opp-04',
    title: 'National Digital Superhighway Hackathon & Innovation Challenge',
    organization: 'Ministry of Information, Communications & Digital Economy',
    orgLogo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&auto=format&fit=crop&q=80',
    type: 'hackathon',
    location: 'Virtual + Grand Finale at Edge Convention Centre',
    isRemote: true,
    deadline: '2026-10-25',
    stipendOrReward: 'KES 2,500,000 Prize Pool + Seed Incubation Grant',
    description: 'Compete in multidisciplinary teams of 2-4 students to create digital applications addressing agricultural supply chains, accessible education, public healthcare, and digital services for all citizens.',
    requirements: [
      'Student teams containing at least one student from University/College and one from a TVET institution',
      'Working prototype or interactive demo must be presented during virtual heats'
    ],
    skillsRequired: ['React', 'Node.js', 'AI Integration', 'Mobile/Web', 'UI/UX Design'],
    targetCourses: ['Any Course', 'Computer Science', 'Business', 'Engineering', 'Agriculture'],
    institutionEligibility: ['University', 'College', 'TVET', 'Recent Graduate'],
    featured: true,
    createdAt: '2026-09-12'
  },
  {
    id: 'opp-05',
    title: 'Junior Solar & Renewable Energy Field Technician',
    organization: 'M-KOPA Solar & Green Energy Hub',
    orgLogo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=120&auto=format&fit=crop&q=80',
    type: 'job',
    location: 'Kisumu / Eldoret / Nakuru',
    isRemote: false,
    deadline: '2026-10-20',
    stipendOrReward: 'Entry Salary (KES 55,000 / mo + Transport Allowance)',
    description: 'Great career springboard for recent TVET or College graduates with diplomas in electrical installation, renewable energy, or mechanical engineering.',
    requirements: [
      'Diploma or Certificate in Electrical Installation, Renewable Energy, or Mechatronics',
      'Valid driver or motorbike license is an added advantage',
      'Strong diagnostic problem-solving abilities'
    ],
    skillsRequired: ['Electrical Systems', 'Solar PV', 'Troubleshooting', 'Customer Service'],
    targetCourses: ['Electrical Engineering', 'Renewable Energy', 'Mechanical Engineering', 'TVET Mechatronics'],
    institutionEligibility: ['TVET', 'College', 'Recent Graduate'],
    featured: false,
    createdAt: '2026-09-08'
  },
  {
    id: 'opp-06',
    title: 'Fintech Graduate Trainee & Data Analytics Fellowship',
    organization: 'Equity Group Holdings / Finserve Africa',
    orgLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    type: 'fellowship',
    location: 'Nairobi Upper Hill',
    isRemote: false,
    deadline: '2026-11-05',
    stipendOrReward: 'KES 80,000 / mo + Fast-Track Permanent Placement',
    description: 'Intensive 9-month rotational fellowship training tomorrow\'s banking technology leaders in financial data modeling, AI credit scoring, and cybersecurity compliance.',
    requirements: [
      'Recent graduate or final year student in Mathematics, Statistics, Data Science, Computer Science, or Actuarial Science',
      'Strong grasp of SQL, Python, or R',
      'Minimum second class upper or equivalent'
    ],
    skillsRequired: ['Python', 'SQL', 'Data Analytics', 'Statistics', 'Financial Modeling'],
    targetCourses: ['Data Science', 'Computer Science', 'Statistics', 'Economics & Finance', 'Actuarial Science'],
    institutionEligibility: ['University', 'Recent Graduate'],
    featured: false,
    createdAt: '2026-09-14'
  }
];

export const sampleDocuments: DocumentItem[] = [
  {
    id: 'doc-01',
    studentId: 'student-01',
    name: 'Amina_Kimani_Resume_2026.pdf',
    type: 'cv',
    fileSize: '1.2 MB',
    uploadDate: '2026-09-15',
    downloadUrl: '#',
    verified: true,
    parsedSummary: 'Highlights BSc Computer Science, proficient in Python, React, SQL, and Git. Includes 2 projects: AgriMarket Portal & Student Community App.'
  },
  {
    id: 'doc-02',
    studentId: 'student-01',
    name: 'Official_Transcript_Years_1_to_3.pdf',
    type: 'transcript',
    fileSize: '3.4 MB',
    uploadDate: '2026-09-10',
    downloadUrl: '#',
    verified: true,
    parsedSummary: 'GPA: 3.82. Top marks in Algorithms, Database Systems, Operating Systems, and Object-Oriented Programming.'
  },
  {
    id: 'doc-03',
    studentId: 'student-01',
    name: 'Certificate_Google_Cloud_Skills_Boost.pdf',
    type: 'certificate',
    fileSize: '850 KB',
    uploadDate: '2026-08-20',
    downloadUrl: '#',
    verified: true,
    parsedSummary: 'Issued by Google Cloud: Foundational Infrastructure and Gemini Generative AI Fundamentals.'
  }
];

export const sampleNotifications: NotificationItem[] = [
  {
    id: 'notif-01',
    studentId: 'student-01',
    title: 'High Opportunity Match Found (94%)',
    message: 'Safaricom PLC posted "Software Engineering & Cloud Intern" matching your skills in Python, React, and REST APIs.',
    type: 'opportunity',
    timestamp: '2 hours ago',
    read: false,
    linkAction: 'opportunities'
  },
  {
    id: 'notif-02',
    studentId: 'student-01',
    title: 'Upcoming Application Deadline',
    message: 'Reminder: The National Digital Superhighway Hackathon registration closes in 5 days.',
    type: 'deadline',
    timestamp: '1 day ago',
    read: false,
    linkAction: 'opportunities'
  },
  {
    id: 'notif-03',
    studentId: 'student-01',
    title: 'Course Milestone Achieved',
    message: 'You completed Lesson 2 in "Full-Stack Modern Web Engineering". Keep up the great pace!',
    type: 'learning',
    timestamp: '3 days ago',
    read: true,
    linkAction: 'courses'
  }
];

export const platformStats: PlatformStats = {
  totalStudents: 48920,
  activeOpportunities: 342,
  totalCourses: 78,
  applicationsSubmitted: 18450,
  matchingSuccessRate: 88,
  partnerOrganizations: 215,
};

export const sampleApplications: Application[] = [
  {
    id: 'app-database',
    opportunityId: 'opp-database',
    opportunity: sampleOpportunities[0], // opp-database
    studentId: 'student-01',
    status: 'interview_scheduled',
    appliedDate: '2026-09-15',
    lastUpdated: '2026-09-18',
    notes: 'Database Administrator application submitted: Attached SQL schema design portfolio, query optimization benchmark test (PostgreSQL 16), and database normalization project.',
    interviewDate: '2026-09-28',
    resumeAttached: 'Amina_Kimani_Resume_2026.pdf',
    coverLetter: 'Dear Selection Committee at Kenya Cloud Data Centre,\n\nI am writing to express my enthusiastic application for the Cloud Database Administrator & Distributed SQL Systems Internship. As a student in computer science with a specialized focus on relational database design, query optimization, and cloud storage systems, I have hands-on experience designing normalized schemas, configuring automated backup routines, and tuning query execution plans in PostgreSQL and SQLite.\n\nThank you for considering my application.\n\nAmina Kimani'
  },
  {
    id: 'app-01',
    opportunityId: 'opp-01',
    opportunity: sampleOpportunities[0],
    studentId: 'student-01',
    status: 'interview_scheduled',
    appliedDate: '2026-09-12',
    lastUpdated: '2026-09-16',
    notes: 'Technical assessment passed; virtual system design interview on Zoom',
    interviewDate: '2026-09-24',
    resumeAttached: 'Amina_Kimani_Resume_2026.pdf'
  },
  {
    id: 'app-02',
    opportunityId: 'opp-02',
    opportunity: sampleOpportunities[1],
    studentId: 'student-01',
    status: 'under_review',
    appliedDate: '2026-09-14',
    lastUpdated: '2026-09-15',
    notes: 'Submitted with institutional Dean recommendation letter',
    resumeAttached: 'Amina_Kimani_Resume_2026.pdf'
  },
  {
    id: 'app-03',
    opportunityId: 'opp-04',
    opportunity: sampleOpportunities[3],
    studentId: 'student-01',
    status: 'shortlisted',
    appliedDate: '2026-09-05',
    lastUpdated: '2026-09-17',
    notes: 'Application ranked in top 10% of applicants',
    resumeAttached: 'Official_Transcript_Years_1_to_3.pdf'
  }
];

export const mockStudentProfile = initialStudentProfile;
export const mockCourses = sampleCourses;
export const mockOpportunities = sampleOpportunities;
export const mockApplications = sampleApplications;
export const mockDocuments = sampleDocuments;
export const mockNotifications = sampleNotifications;
export const mockPlatformStats = platformStats;

