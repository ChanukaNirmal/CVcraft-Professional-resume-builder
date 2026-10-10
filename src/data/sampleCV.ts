import type { CVData } from '../types'

export const defaultCV: CVData = {
  personalDetails: {
    firstName: 'Alexandra',
    lastName: 'Morrison',
    title: 'Senior Product Designer',
    email: 'alex.morrison@email.com',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorrison',
    website: 'alexmorrison.design',
    photo: null,
  },
  summary: 'Results-driven Product Designer with 7+ years of experience crafting intuitive digital experiences for SaaS and consumer products. Adept at leading end-to-end design processes from research to high-fidelity prototypes, collaborating cross-functionally with engineering and product teams to ship user-centered solutions.',
  experience: [
    {
      id: '1',
      title: 'Senior Product Designer',
      company: 'Figma Inc.',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '• Led design for the Auto Layout 4.0 feature shipped to 8M+ users\n• Ran 40+ usability studies and translated insights into measurable UX improvements\n• Mentored a team of 3 junior designers across sprint cycles',
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: '• Redesigned the Stripe Dashboard onboarding flow, reducing time-to-first-charge by 34%\n• Collaborated with 6 engineering squads to ship the Stripe Atlas product',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. Human-Computer Interaction',
      institution: 'Carnegie Mellon University',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8 / 4.0',
      description: 'Dean\'s List, HCI Lab Research Assistant',
    },
  ],
  skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'React', 'TypeScript', 'Framer', 'Notion'],
  projects: [
    { id: '1', name: 'DesignOS', link: 'github.com/alexm/designos', description: 'Open-source Figma plugin with 12k+ installs for automating design token generation.' },
  ],
  certifications: [
    { id: '1', name: 'Google UX Design Certificate', issuer: 'Google', year: '2020' },
  ],
  languages: [
    { id: '1', language: 'English', proficiency: 'Native' },
    { id: '2', language: 'Spanish', proficiency: 'Professional' },
  ],
  selectedTemplate: 'modern',
  accentColor: '#2563EB',
}
