import type { User, Job, Application, SavedJob, Company, Notification } from '../types';

const KEYS = {
  USERS: 'jobportal_users',
  JOBS: 'jobportal_jobs',
  APPLICATIONS: 'jobportal_applications',
  SAVED_JOBS: 'jobportal_savedJobs',
  COMPANIES: 'jobportal_companies',
  NOTIFICATIONS: 'jobportal_notifications',
  CURRENT_USER: 'jobportal_currentUser',
};

// Generic helpers
function getItem<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItem<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ─── USER OPERATIONS ─────────────────────────────
export function getUsers(): User[] {
  return getItem<User>(KEYS.USERS);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  setItem(KEYS.USERS, users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  setItem(KEYS.USERS, users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  setItem(KEYS.USERS, filtered);
  // Also delete related data
  const applications = getApplications().filter(a => a.seekerId !== id && a.employerId !== id);
  setItem(KEYS.APPLICATIONS, applications);
  const savedJobs = getSavedJobs().filter(s => s.seekerId !== id);
  setItem(KEYS.SAVED_JOBS, savedJobs);
  const jobs = getJobs().filter(j => j.employerId !== id);
  setItem(KEYS.JOBS, jobs);
  return true;
}

// ─── AUTH OPERATIONS ──────────────────────────────
export function getCurrentUser(): User | null {
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export function login(email: string, password: string): User | null {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

export function signup(userData: Omit<User, 'id' | 'createdAt'>): User | null {
  if (getUserByEmail(userData.email)) return null;
  const user = createUser(userData);
  setCurrentUser(user);
  return user;
}

export function logout(): void {
  setCurrentUser(null);
}

// ─── JOB OPERATIONS ──────────────────────────────
export function getJobs(): Job[] {
  return getItem<Job>(KEYS.JOBS);
}

export function getActiveJobs(): Job[] {
  return getJobs().filter(j => j.isActive);
}

export function getJobById(id: string): Job | undefined {
  return getJobs().find(j => j.id === id);
}

export function getJobsByEmployer(employerId: string): Job[] {
  return getJobs().filter(j => j.employerId === employerId);
}

export function createJob(job: Omit<Job, 'id' | 'postedAt' | 'applicationsCount'>): Job {
  const jobs = getJobs();
  const newJob: Job = {
    ...job,
    id: generateId(),
    postedAt: new Date().toISOString(),
    applicationsCount: 0,
  };
  jobs.push(newJob);
  setItem(KEYS.JOBS, jobs);
  return newJob;
}

export function updateJob(id: string, updates: Partial<Job>): Job | null {
  const jobs = getJobs();
  const index = jobs.findIndex(j => j.id === id);
  if (index === -1) return null;
  jobs[index] = { ...jobs[index], ...updates };
  setItem(KEYS.JOBS, jobs);
  return jobs[index];
}

export function deleteJob(id: string): boolean {
  const jobs = getJobs();
  const filtered = jobs.filter(j => j.id !== id);
  if (filtered.length === jobs.length) return false;
  setItem(KEYS.JOBS, filtered);
  // Also delete related applications
  const applications = getApplications().filter(a => a.jobId !== id);
  setItem(KEYS.APPLICATIONS, applications);
  const savedJobs = getSavedJobs().filter(s => s.jobId !== id);
  setItem(KEYS.SAVED_JOBS, savedJobs);
  return true;
}

export function searchJobs(filters: {
  keyword?: string;
  location?: string;
  type?: string;
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
  category?: string;
}): Job[] {
  let jobs = getActiveJobs();

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(kw) ||
      j.description.toLowerCase().includes(kw) ||
      j.companyName.toLowerCase().includes(kw) ||
      j.skills.some(s => s.toLowerCase().includes(kw))
    );
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    jobs = jobs.filter(j => j.location.toLowerCase().includes(loc));
  }

  if (filters.type) {
    jobs = jobs.filter(j => j.type === filters.type);
  }

  if (filters.salaryMin !== undefined) {
    jobs = jobs.filter(j => j.salaryMax >= filters.salaryMin!);
  }

  if (filters.salaryMax !== undefined) {
    jobs = jobs.filter(j => j.salaryMin <= filters.salaryMax!);
  }

  if (filters.experience) {
    jobs = jobs.filter(j => j.experience === filters.experience);
  }

  if (filters.category) {
    jobs = jobs.filter(j => j.category === filters.category);
  }

  return jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

// ─── APPLICATION OPERATIONS ───────────────────────
export function getApplications(): Application[] {
  return getItem<Application>(KEYS.APPLICATIONS);
}

export function getApplicationById(id: string): Application | undefined {
  return getApplications().find(a => a.id === id);
}

export function getApplicationsBySeeker(seekerId: string): Application[] {
  return getApplications().filter(a => a.seekerId === seekerId);
}

export function getApplicationsByJob(jobId: string): Application[] {
  return getApplications().filter(a => a.jobId === jobId);
}

export function getApplicationsByEmployer(employerId: string): Application[] {
  return getApplications().filter(a => a.employerId === employerId);
}

export function hasApplied(seekerId: string, jobId: string): boolean {
  return getApplications().some(a => a.seekerId === seekerId && a.jobId === jobId);
}

export function createApplication(app: Omit<Application, 'id' | 'appliedAt' | 'status'>): Application {
  const applications = getApplications();
  const newApp: Application = {
    ...app,
    id: generateId(),
    appliedAt: new Date().toISOString(),
    status: 'pending',
  };
  applications.push(newApp);
  setItem(KEYS.APPLICATIONS, applications);

  // Update job applications count
  const job = getJobById(app.jobId);
  if (job) {
    updateJob(job.id, { applicationsCount: job.applicationsCount + 1 });
  }

  return newApp;
}

export function updateApplicationStatus(id: string, status: Application['status']): Application | null {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === id);
  if (index === -1) return null;
  applications[index].status = status;
  setItem(KEYS.APPLICATIONS, applications);
  return applications[index];
}

// ─── SAVED JOBS OPERATIONS ────────────────────────
export function getSavedJobs(): SavedJob[] {
  return getItem<SavedJob>(KEYS.SAVED_JOBS);
}

export function getSavedJobsBySeeker(seekerId: string): SavedJob[] {
  return getSavedJobs().filter(s => s.seekerId === seekerId);
}

export function isJobSaved(seekerId: string, jobId: string): boolean {
  return getSavedJobs().some(s => s.seekerId === seekerId && s.jobId === jobId);
}

export function saveJob(seekerId: string, jobId: string): SavedJob {
  const savedJobs = getSavedJobs();
  const newSaved: SavedJob = {
    id: generateId(),
    seekerId,
    jobId,
    savedAt: new Date().toISOString(),
  };
  savedJobs.push(newSaved);
  setItem(KEYS.SAVED_JOBS, savedJobs);
  return newSaved;
}

export function unsaveJob(seekerId: string, jobId: string): void {
  const savedJobs = getSavedJobs().filter(s => !(s.seekerId === seekerId && s.jobId === jobId));
  setItem(KEYS.SAVED_JOBS, savedJobs);
}

// ─── COMPANY OPERATIONS ──────────────────────────
export function getCompanies(): Company[] {
  return getItem<Company>(KEYS.COMPANIES);
}

export function getCompanyByEmployer(employerId: string): Company | undefined {
  return getCompanies().find(c => c.employerId === employerId);
}

export function createCompany(company: Omit<Company, 'id'>): Company {
  const companies = getCompanies();
  const newCompany: Company = {
    ...company,
    id: generateId(),
  };
  companies.push(newCompany);
  setItem(KEYS.COMPANIES, companies);
  return newCompany;
}

export function updateCompany(id: string, updates: Partial<Company>): Company | null {
  const companies = getCompanies();
  const index = companies.findIndex(c => c.id === id);
  if (index === -1) return null;
  companies[index] = { ...companies[index], ...updates };
  setItem(KEYS.COMPANIES, companies);
  return companies[index];
}

// ─── NOTIFICATION OPERATIONS ──────────────────────
export function getNotifications(userId: string): Notification[] {
  return getItem<Notification>(KEYS.NOTIFICATIONS).filter(n => n.userId === userId);
}

export function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
  const notifications = getItem<Notification>(KEYS.NOTIFICATIONS);
  const newNotification: Notification = {
    ...notification,
    id: generateId(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  notifications.push(newNotification);
  setItem(KEYS.NOTIFICATIONS, notifications);
  return newNotification;
}

export function markNotificationRead(id: string): void {
  const notifications = getItem<Notification>(KEYS.NOTIFICATIONS);
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    setItem(KEYS.NOTIFICATIONS, notifications);
  }
}

// ─── ANALYTICS ────────────────────────────────────
export function getAnalytics() {
  const users = getUsers();
  const jobs = getJobs();
  const applications = getApplications();

  return {
    totalUsers: users.length,
    totalSeekers: users.filter(u => u.role === 'seeker').length,
    totalEmployers: users.filter(u => u.role === 'employer').length,
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.isActive).length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    shortlistedApplications: applications.filter(a => a.status === 'shortlisted').length,
    hiredApplications: applications.filter(a => a.status === 'hired').length,
    rejectedApplications: applications.filter(a => a.status === 'rejected').length,
  };
}

// ─── SEED DATA ────────────────────────────────────
export function seedData(): void {
  if (getUsers().length > 0) return; // Already seeded

  // Create admin
  const admin = createUser({
    email: 'admin@jobportal.com',
    password: 'admin123',
    role: 'admin',
    name: 'Portal Admin',
    location: 'Mumbai, India',
    phone: '+91 9876543210',
  });

  // Create employers
  const employer1 = createUser({
    email: 'hr@techcorp.com',
    password: 'employer123',
    role: 'employer',
    name: 'Priya Sharma',
    companyName: 'TechCorp India',
    companyDescription: 'Leading technology solutions provider specializing in AI, cloud computing, and enterprise software.',
    companyWebsite: 'https://techcorp.in',
    companySize: '500-1000',
    companyIndustry: 'Technology',
    location: 'Bangalore, India',
    phone: '+91 9876543211',
  });

  const employer2 = createUser({
    email: 'hr@designstudio.com',
    password: 'employer123',
    role: 'employer',
    name: 'Rahul Verma',
    companyName: 'DesignStudio Pro',
    companyDescription: 'Award-winning design agency creating beautiful digital experiences for global brands.',
    companyWebsite: 'https://designstudiopro.com',
    companySize: '50-200',
    companyIndustry: 'Design',
    location: 'Mumbai, India',
    phone: '+91 9876543212',
  });

  const employer3 = createUser({
    email: 'hr@dataflow.com',
    password: 'employer123',
    role: 'employer',
    name: 'Ankit Patel',
    companyName: 'DataFlow Analytics',
    companyDescription: 'Data-driven company helping businesses make smarter decisions with advanced analytics and machine learning.',
    companyWebsite: 'https://dataflow.io',
    companySize: '200-500',
    companyIndustry: 'Data Science',
    location: 'Hyderabad, India',
    phone: '+91 9876543213',
  });

  // Create seekers
  const seeker1 = createUser({
    email: 'john@email.com',
    password: 'seeker123',
    role: 'seeker',
    name: 'John Doe',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
    experience: '3-5 years',
    education: 'B.Tech in Computer Science',
    bio: 'Passionate full-stack developer with 4 years of experience building scalable web applications.',
    location: 'Delhi, India',
    phone: '+91 9876543214',
    expectedSalary: '12-15 LPA',
  });

  const seeker2 = createUser({
    email: 'sarah@email.com',
    password: 'seeker123',
    role: 'seeker',
    name: 'Sarah Khan',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'SQL'],
    experience: '1-3 years',
    education: 'M.Tech in AI & ML',
    bio: 'Data scientist with strong foundation in machine learning and statistical analysis.',
    location: 'Pune, India',
    phone: '+91 9876543215',
    expectedSalary: '10-12 LPA',
  });

  // Create sample jobs
  const sampleJobs: Omit<Job, 'id' | 'postedAt' | 'applicationsCount'>[] = [
    {
      employerId: employer1.id,
      companyName: 'TechCorp India',
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer to join our frontend team. You will be responsible for building user interfaces for our enterprise applications using React, TypeScript, and modern web technologies.',
      requirements: ['5+ years of React experience', 'Strong TypeScript skills', 'Experience with state management', 'Understanding of RESTful APIs', 'Excellent problem-solving skills'],
      location: 'Bangalore, India',
      type: 'full-time',
      salaryMin: 1500000,
      salaryMax: 2500000,
      experience: '3-5 years',
      skills: ['React', 'TypeScript', 'Redux', 'CSS', 'Jest'],
      category: 'Engineering',
      isActive: true,
    },
    {
      employerId: employer1.id,
      companyName: 'TechCorp India',
      title: 'Cloud Solutions Architect',
      description: 'Design and implement cloud infrastructure solutions for our clients. Lead migration projects and optimize cloud spending across AWS and Azure platforms.',
      requirements: ['AWS/Azure certification', '5+ years cloud experience', 'Infrastructure as Code', 'Security best practices', 'Team leadership'],
      location: 'Bangalore, India',
      type: 'full-time',
      salaryMin: 2500000,
      salaryMax: 4000000,
      experience: '5-10 years',
      skills: ['AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes'],
      category: 'Engineering',
      isActive: true,
    },
    {
      employerId: employer2.id,
      companyName: 'DesignStudio Pro',
      title: 'UI/UX Designer',
      description: 'Create stunning user interfaces and seamless user experiences for web and mobile applications. Work closely with development teams to bring designs to life.',
      requirements: ['3+ years design experience', 'Figma/Sketch proficiency', 'Portfolio of shipped products', 'Understanding of design systems', 'User research experience'],
      location: 'Mumbai, India',
      type: 'full-time',
      salaryMin: 800000,
      salaryMax: 1500000,
      experience: '1-3 years',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
      category: 'Design',
      isActive: true,
    },
    {
      employerId: employer2.id,
      companyName: 'DesignStudio Pro',
      title: 'Creative Director',
      description: 'Lead our creative team and drive the visual direction for all client projects. Mentor junior designers and establish creative processes.',
      requirements: ['8+ years design experience', 'Team management experience', 'Strong portfolio', 'Client presentation skills', 'Brand strategy knowledge'],
      location: 'Mumbai, India',
      type: 'full-time',
      salaryMin: 2000000,
      salaryMax: 3500000,
      experience: '5-10 years',
      skills: ['Creative Direction', 'Team Management', 'Brand Strategy', 'Visual Design', 'Mentoring'],
      category: 'Design',
      isActive: true,
    },
    {
      employerId: employer3.id,
      companyName: 'DataFlow Analytics',
      title: 'Data Scientist',
      description: 'Apply machine learning and statistical methods to solve complex business problems. Work with large datasets to extract actionable insights.',
      requirements: ['Strong Python skills', 'ML/DL experience', 'Statistics background', 'SQL proficiency', 'Communication skills'],
      location: 'Hyderabad, India',
      type: 'full-time',
      salaryMin: 1200000,
      salaryMax: 2000000,
      experience: '1-3 years',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
      category: 'Data Science',
      isActive: true,
    },
    {
      employerId: employer3.id,
      companyName: 'DataFlow Analytics',
      title: 'ML Engineering Intern',
      description: 'Join our ML team as an intern and work on real-world machine learning projects. Great opportunity to learn from experienced data scientists.',
      requirements: ['Currently pursuing CS/AI degree', 'Basic Python knowledge', 'Understanding of ML concepts', 'Eagerness to learn', 'Strong analytical skills'],
      location: 'Remote',
      type: 'internship',
      salaryMin: 25000,
      salaryMax: 40000,
      experience: '0-1 years',
      skills: ['Python', 'Machine Learning', 'NumPy', 'Pandas'],
      category: 'Data Science',
      isActive: true,
    },
    {
      employerId: employer1.id,
      companyName: 'TechCorp India',
      title: 'DevOps Engineer',
      description: 'Build and maintain CI/CD pipelines, manage container orchestration, and ensure high availability of our production systems.',
      requirements: ['3+ years DevOps experience', 'CI/CD pipeline expertise', 'Container orchestration', 'Monitoring and alerting', 'Scripting skills'],
      location: 'Bangalore, India',
      type: 'full-time',
      salaryMin: 1200000,
      salaryMax: 2000000,
      experience: '3-5 years',
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Linux'],
      category: 'Engineering',
      isActive: true,
    },
    {
      employerId: employer2.id,
      companyName: 'DesignStudio Pro',
      title: 'Frontend Developer (Part-time)',
      description: 'Build responsive and interactive web interfaces using modern frontend technologies. Part-time role, 20 hours per week.',
      requirements: ['React/Vue experience', 'HTML/CSS expertise', 'JavaScript proficiency', 'Responsive design', 'Version control'],
      location: 'Remote',
      type: 'part-time',
      salaryMin: 400000,
      salaryMax: 700000,
      experience: '1-3 years',
      skills: ['React', 'CSS', 'JavaScript', 'Responsive Design', 'Git'],
      category: 'Engineering',
      isActive: true,
    },
    {
      employerId: employer3.id,
      companyName: 'DataFlow Analytics',
      title: 'Product Manager',
      description: 'Define product strategy and roadmap for our analytics platform. Work with cross-functional teams to deliver features that delight our users.',
      requirements: ['3+ years PM experience', 'Analytics background', 'Agile methodology', 'Stakeholder management', 'Data-driven mindset'],
      location: 'Hyderabad, India',
      type: 'full-time',
      salaryMin: 1800000,
      salaryMax: 2800000,
      experience: '3-5 years',
      skills: ['Product Management', 'Analytics', 'Agile', 'Stakeholder Management', 'Strategy'],
      category: 'Management',
      isActive: true,
    },
    {
      employerId: employer1.id,
      companyName: 'TechCorp India',
      title: 'Backend Developer (Contract)',
      description: 'Join us on a 6-month contract to build microservices for our new platform. Work with Node.js, PostgreSQL, and GraphQL.',
      requirements: ['Node.js expertise', 'Database design', 'API development', 'Testing experience', 'Microservices architecture'],
      location: 'Delhi, India',
      type: 'contract',
      salaryMin: 100000,
      salaryMax: 180000,
      experience: '3-5 years',
      skills: ['Node.js', 'PostgreSQL', 'GraphQL', 'Microservices', 'Docker'],
      category: 'Engineering',
      isActive: true,
    },
  ];

  sampleJobs.forEach(job => createJob(job));

  // Create sample applications
  const jobs = getJobs();
  if (jobs.length > 0) {
    createApplication({
      jobId: jobs[0].id,
      seekerId: seeker1.id,
      employerId: employer1.id,
      coverLetter: 'I am very interested in this position. With 4 years of React experience, I believe I would be a great fit for your team.',
      seekerName: seeker1.name,
      seekerEmail: seeker1.email,
      jobTitle: jobs[0].title,
      companyName: jobs[0].companyName,
    });

    createApplication({
      jobId: jobs[4].id,
      seekerId: seeker2.id,
      employerId: employer3.id,
      coverLetter: 'As an M.Tech graduate specializing in AI & ML, I am excited about this data science opportunity at DataFlow Analytics.',
      seekerName: seeker2.name,
      seekerEmail: seeker2.email,
      jobTitle: jobs[4].title,
      companyName: jobs[4].companyName,
    });
  }

  console.log('✅ Seed data loaded successfully');
}
