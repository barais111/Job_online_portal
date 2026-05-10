export type UserRole = 'seeker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  avatar?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  // Seeker fields
  skills?: string[];
  experience?: string;
  education?: string;
  resumeFileName?: string;
  resumeData?: string;
  bio?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  expectedSalary?: string;
  // Employer fields
  companyName?: string;
  companyDescription?: string;
  companyWebsite?: string;
  companySize?: string;
  companyIndustry?: string;
  companyLogo?: string;
}

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salaryMin: number;
  salaryMax: number;
  experience: string;
  skills: string[];
  category: string;
  postedAt: string;
  deadline?: string;
  isActive: boolean;
  applicationsCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  employerId: string;
  coverLetter: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  seekerName: string;
  seekerEmail: string;
  jobTitle: string;
  companyName: string;
}

export interface SavedJob {
  id: string;
  jobId: string;
  seekerId: string;
  savedAt: string;
}

export interface Company {
  id: string;
  employerId: string;
  name: string;
  description: string;
  website: string;
  size: string;
  industry: string;
  logo?: string;
  location: string;
  foundedYear?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}
