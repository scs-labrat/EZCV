export interface ContactLink {
  label: string;
  url: string;
}

export interface Metric {
  label: string;
  value: string;
  unit: string;
}

export interface Highlight {
  id: string;
  text: string;
  tags?: string[];
  metrics?: Metric[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  highlights: Highlight[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
}

export interface Conference {
  id: string;
  name: string;
  event: string;
  date: string;
}

export interface CareerProfile {
  profileVersion: string;
  basics: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    links: ContactLink[];
  };
  summary: string;
  experience: ExperienceItem[];
  skills: SkillGroup[];
  education: EducationItem[];
  projects: Project[];
  certifications: Certification[];
  publications: Publication[];
  conferences: Conference[];
  linkedinContext?: string; // Raw text from LinkedIn posts/articles
}

export interface JobBrief {
  id: string;
  roleTitle: string;
  companyName: string;
  rawDescription: string;
  extractedKeywords: string[];
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  tone: 'Professional' | 'Relaxed' | 'Corporate' | 'Light Hearted' | 'Technical' | 'Founder' | 'Formal' | 'Punchy';
}

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'creative';

export interface AppState {
  profile: CareerProfile;
  jobBrief: JobBrief | null;
  activeView: 'editor' | 'cover-letter';
  isGenerating: boolean;
  selectedTemplate: TemplateId;
}

export enum Tone {
  Modern = 'Modern Professional',
  Executive = 'Executive',
  Startup = 'Startup / Founder',
  Technical = 'Technical Operator'
}