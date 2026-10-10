export interface PersonalDetails {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  photo: string | null
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string
  gpa: string
  description: string
}

export interface Project {
  id: string
  name: string
  link: string
  description: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  year: string
}

export interface Language {
  id: string
  language: string
  proficiency: string
}

export interface CVData {
  personalDetails: PersonalDetails
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  selectedTemplate: string
  accentColor: string
}
