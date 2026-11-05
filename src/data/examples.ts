import type { CVData } from '../types'
import { defaultCV } from './sampleCV'

export interface CVExample {
  slug: string
  role: string
  level: string
  template: string
  accent: string
  why: string[]
  cv: CVData
}

const base = { ...defaultCV, projects: [], certifications: [], languages: [] }

export const EXAMPLES: CVExample[] = [
  {
    slug: 'software-engineer',
    role: 'Software Engineer',
    level: 'Mid-level · 4 years',
    template: 'sidebar',
    accent: '#0EA5E9',
    why: [
      'Summary names the stack and a concrete scale ("40k daily requests").',
      'Every bullet ends in a measurable result: latency, coverage, or time saved.',
      'Skills are specific tools, not vague traits, and match common job adverts.',
      'GitHub project link gives the reader evidence they can check.',
    ],
    cv: {
      ...base,
      selectedTemplate: 'sidebar',
      accentColor: '#0EA5E9',
      personalDetails: { firstName: 'Kasun', lastName: 'Perera', title: 'Software Engineer', email: 'kasun.perera@email.com', phone: '+94 77 123 4567', location: 'Colombo, Sri Lanka', linkedin: 'linkedin.com/in/kasunperera', website: 'github.com/kasunp', photo: null },
      summary: 'Backend-focused software engineer with 4 years of experience building Java and Node.js services for fintech products. Reduced API latency by 75% on a loan-processing platform serving 40k daily requests. Looking for a senior engineer role on a platform or payments team.',
      experience: [
        { id: '1', title: 'Software Engineer', company: 'LankaPay Solutions', location: 'Colombo', startDate: '2022-04', endDate: '', current: true, description: '• Designed REST APIs in Spring Boot and PostgreSQL for a loan-processing service handling 40k requests/day\n• Cut p95 latency from 900ms to 220ms with query tuning and Redis caching\n• Introduced GitHub Actions CI, reducing deployment time from 25 to 6 minutes' },
        { id: '2', title: 'Associate Software Engineer', company: 'Nimbus Digital', location: 'Colombo', startDate: '2020-11', endDate: '2022-03', current: false, description: '• Built React and TypeScript admin dashboards used by 300+ internal staff\n• Raised unit-test coverage of the billing module from 35% to 80%' },
      ],
      education: [{ id: '1', degree: 'BSc (Hons) Computer Science', institution: 'University of Moratuwa', startDate: '2016-09', endDate: '2020-08', gpa: 'Second Upper', description: '' }],
      skills: ['Java', 'Spring Boot', 'Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'GitHub Actions'],
      projects: [{ id: '1', name: 'OpenLedger', link: 'github.com/kasunp/openledger', description: 'Open-source double-entry accounting API with 400+ GitHub stars.' }],
      certifications: [{ id: '1', name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', year: '2024' }],
      languages: [{ id: '1', language: 'Sinhala', proficiency: 'Native' }, { id: '2', language: 'English', proficiency: 'Professional' }],
    },
  },
  {
    slug: 'accountant',
    role: 'Accountant',
    level: 'Experienced · 6 years',
    template: 'executive',
    accent: '#7C2D12',
    why: [
      'Professional qualification level is stated precisely (CIMA Passed Finalist).',
      'Achievements are expressed in business terms: days saved, accuracy, audit outcomes.',
      'Conservative Executive layout suits finance and banking employers.',
      'No unnecessary personal details such as NIC or marital status.',
    ],
    cv: {
      ...base,
      selectedTemplate: 'executive',
      accentColor: '#7C2D12',
      personalDetails: { firstName: 'Dilini', lastName: 'Fernando', title: 'Senior Accountant', email: 'dilini.fernando@email.com', phone: '+94 71 555 0198', location: 'Kandy, Sri Lanka', linkedin: 'linkedin.com/in/dilinifernando', website: '', photo: null },
      summary: 'CIMA passed finalist with 6 years in financial reporting, budgeting, and audit coordination for manufacturing and apparel exporters. Shortened month-end close from 8 to 5 working days through Excel and SAP automation. Seeking a financial reporting lead role.',
      experience: [
        { id: '1', title: 'Senior Accountant', company: 'Hill Country Apparel (Pvt) Ltd', location: 'Kandy', startDate: '2021-01', endDate: '', current: true, description: '• Lead month-end close and IFRS reporting for a LKR 4B-revenue exporter\n• Reduced closing time from 8 to 5 days by automating 12 reconciliations\n• Coordinated two clean external audits with zero material adjustments' },
        { id: '2', title: 'Accounts Executive', company: 'Ceylon Packaging PLC', location: 'Colombo', startDate: '2018-06', endDate: '2020-12', current: false, description: '• Managed accounts payable for 250+ suppliers and weekly cash-flow forecasts\n• Prepared variance reports used in monthly board reviews' },
      ],
      education: [{ id: '1', degree: 'BBA (Hons) Accounting', institution: 'University of Peradeniya', startDate: '2014-03', endDate: '2018-03', gpa: '', description: '' }],
      skills: ['IFRS', 'SAP FI', 'Financial Reporting', 'Budgeting & Forecasting', 'Advanced Excel', 'Power BI', 'Audit Coordination'],
      certifications: [{ id: '1', name: 'CIMA Passed Finalist', issuer: 'Chartered Institute of Management Accountants', year: '2022' }],
      languages: [{ id: '1', language: 'Sinhala', proficiency: 'Native' }, { id: '2', language: 'English', proficiency: 'Professional' }, { id: '3', language: 'Tamil', proficiency: 'Conversational' }],
    },
  },
  {
    slug: 'fresh-graduate',
    role: 'Fresh Graduate',
    level: 'Entry level · Internship',
    template: 'minimal',
    accent: '#059669',
    why: [
      'Education and projects lead because they are the strongest evidence.',
      'Internship bullets show real outcomes despite limited experience.',
      'Fits on one page with plenty of white space.',
      'Clean single-column Nordic template is safe for graduate-programme ATS portals.',
    ],
    cv: {
      ...base,
      selectedTemplate: 'minimal',
      accentColor: '#059669',
      personalDetails: { firstName: 'Tharushi', lastName: 'Jayasinghe', title: 'Junior Data Analyst', email: 'tharushi.j@email.com', phone: '+94 76 222 3344', location: 'Galle, Sri Lanka', linkedin: 'linkedin.com/in/tharushij', website: '', photo: null },
      summary: 'BSc Statistics graduate (First Class) with internship experience building Power BI dashboards and cleaning sales data in Python. Comfortable with SQL and presenting findings to non-technical teams. Seeking a junior data analyst role.',
      experience: [
        { id: '1', title: 'Data Analytics Intern', company: 'Southern Retail Group', location: 'Galle', startDate: '2025-01', endDate: '2025-06', current: false, description: '• Built a Power BI sales dashboard for 18 branches, replacing a weekly manual report\n• Cleaned and merged 3 years of POS data (1.2M rows) using Python and pandas' },
      ],
      education: [{ id: '1', degree: 'BSc (Hons) Statistics', institution: 'University of Ruhuna', startDate: '2021-02', endDate: '2025-10', gpa: 'First Class (3.78 / 4.0)', description: 'Final-year research: forecasting tourist arrivals with ARIMA models' }],
      skills: ['SQL', 'Python', 'pandas', 'Power BI', 'Excel', 'R', 'Statistics'],
      projects: [{ id: '1', name: 'Dengue Trend Dashboard', link: 'github.com/tharushij/dengue', description: 'Interactive dashboard of Sri Lankan dengue cases by district using public health data.' }],
      certifications: [{ id: '1', name: 'Google Data Analytics Certificate', issuer: 'Google', year: '2024' }],
      languages: [{ id: '1', language: 'Sinhala', proficiency: 'Native' }, { id: '2', language: 'English', proficiency: 'Professional' }],
    },
  },
]
