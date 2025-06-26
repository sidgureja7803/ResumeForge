export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  htmlStructure: string;
}

export interface ResumeData {
  id?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn?: string;
    github?: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
}

export interface ATSScore {
  overallScore: number;
  keywordMatches: number;
  totalKeywords: number;
  suggestions: string[];
  missingSkills: string[];
} 