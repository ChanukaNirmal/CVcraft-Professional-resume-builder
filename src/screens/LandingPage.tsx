import { CONTACT, LEGAL_PATHS } from '../components/LegalPage'
import { linkProps, navigate } from '../lib/router'
import { useState, type MouseEvent } from 'react'
import CookieConsent from '../components/CookieConsent'
import CVPreview from '../components/CVPreview'
import AdSlot from '../components/AdSlot'
import { defaultCV } from '../data/sampleCV'

interface Props {
  onStart: (template?: string) => void
}

const templates = [
  { id: 'modern', name: 'Modern', type: 'ats', color: '#2563EB' },
  { id: 'sidebar', name: 'Horizon', type: 'modern', color: '#0EA5E9' },
  { id: 'executive', name: 'Executive', type: 'ats', color: '#7C2D12' },
  { id: 'minimal', name: 'Nordic', type: 'ats', color: '#059669' },
  { id: 'creative', name: 'Studio', type: 'modern', color: '#7C3AED' },
  { id: 'timeline', name: 'Timeline', type: 'modern', color: '#DB2777' },
]

const features = [
  { icon: '🎯', title: 'ATS-Optimized', desc: 'Parsed by all major applicant tracking systems including Greenhouse, Lever, and Workday.' },
  { icon: '⚡', title: 'AI Summary Generator', desc: 'Generate a compelling professional summary in seconds with our built-in AI assistant.' },
  { icon: '📄', title: 'One-Click PDF Export', desc: 'Download a pixel-perfect, print-ready PDF in A4 or US Letter format instantly.' },
  { icon: '🎨', title: '6 Premium Templates', desc: 'Professionally designed layouts reviewed by Fortune 500 hiring managers.' },
  { icon: '📱', title: 'Mobile-First Builder', desc: 'Build and update your CV from any device — phone, tablet, or desktop.' },
  { icon: '🔒', title: 'Private & Secure', desc: 'Your data never leaves your browser. No account required to get started.' },
]

export default function LandingPage({ onStart }: Props) {
  const [templateFilter, setTemplateFilter] = useState<'all' | 'ats' | 'modern'>('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [['Templates', 'templates'], ['Features', 'features'], ['ATS Guide', 'ats-guide']] as const
  const goTo = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filtered = templates.filter(t => templateFilter === 'all' || t.type === templateFilter)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2563EB' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="6" height="8" rx="1" fill="white" fillOpacity="0.9"/>
                  <rect x="10" y="2" width="6" height="4" rx="1" fill="white" fillOpacity="0.6"/>
                  <rect x="2" y="12" width="14" height="2" rx="1" fill="white" fillOpacity="0.7"/>
                  <rect x="2" y="15" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.5"/>
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">CVcraft</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map(([label, id]) => (
                <a key={id} href={`#${id}`} onClick={goTo(id)} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{label}</a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={() => onStart()} className="btn-primary px-5 py-2.5 text-sm">
                Create My CV →
              </button>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileMenuOpen
                    ? <><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></>
                    : <><line x1="3" y1="6" x2="17" y2="6"/><line x1="3" y1="12" x2="17" y2="12"/><line x1="3" y1="18" x2="17" y2="18"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-100 py-4 fade-in">
              {navItems.map(([label, id]) => (
                <a key={id} href={`#${id}`} onClick={goTo(id)} className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900">{label}</a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]" style={{ background: 'radial-gradient(circle at 70% 30%, #2563EB 0%, transparent 70%)' }}/>
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: '#2563EB' }}/>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="slide-up">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-4 py-1.5 text-xs font-600 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
                Trusted by 120,000+ professionals
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-800 text-slate-900 leading-[1.1] tracking-tight mb-6">
                Build a Winning CV<br />
                <span style={{ color: '#2563EB' }}>in Minutes.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                Create ATS-optimized, recruiter-approved CVs with our intelligent builder. Stand out, get shortlisted, and land the interview.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => onStart()} className="btn-emerald px-7 py-3.5 text-base">
                  🚀 Start Building — It's Free
                </button>
                <button className="px-7 py-3.5 text-base font-600 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                  ▶ Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {[['4.9★', 'App Rating'], ['2 min', 'Avg. Build Time'], ['ATS', 'Guaranteed Pass']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-lg font-700 text-slate-900">{val}</div>
                    <div className="text-xs text-slate-400 font-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero CV Preview */}
            <div className="relative hidden lg:block slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative w-full max-w-sm mx-auto">
                <div className="absolute -inset-4 rounded-2xl opacity-20 blur-2xl" style={{ background: 'linear-gradient(135deg, #2563EB, #10B981)' }}/>
                <div className="relative card p-0 overflow-hidden shadow-2xl" style={{ borderRadius: 16 }}>
                  {/* Mini CV Preview */}
                  <div className="h-2" style={{ background: '#2563EB' }}/>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-700 text-sm" style={{ background: '#2563EB' }}>AM</div>
                      <div>
                        <div className="font-700 text-slate-900 text-sm">Alexandra Morrison</div>
                        <div className="text-xs text-slate-400">Senior Product Designer</div>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Experience', items: ['Figma Inc. — 2021–Present', 'Stripe — 2018–2021'] },
                        { label: 'Education', items: ['Carnegie Mellon University, B.S. HCI'] },
                        { label: 'Skills', items: ['Figma · Prototyping · React · Design Systems'] },
                      ].map(section => (
                        <div key={section.label}>
                          <div className="text-[9px] font-700 uppercase tracking-widest mb-1" style={{ color: '#2563EB' }}>{section.label}</div>
                          {section.items.map(item => (
                            <div key={item} className="text-[11px] text-slate-600 leading-relaxed">{item}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      {['ATS Optimized', 'PDF Ready'].map(tag => (
                        <span key={tag} className="text-[9px] font-600 px-2 py-0.5 rounded-full" style={{ background: '#EFF6FF', color: '#2563EB' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center" style={{ background: '#10B981' }}>
                  <svg width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🟡 GOOGLE ADSENSE — Landing පිටුවේ Leaderboard දැන්වීම (Hero කොටසට යටින්) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* 🟡 Desktop/Tablet සඳහා 728×90 Leaderboard */}
        <AdSlot slot="leaderboard" width={728} height={90} label="728 × 90 — Leaderboard Ad" className="hidden md:flex" />
        {/* 🟡 Mobile සඳහා 320×50 Banner */}
        <AdSlot slot="mobileBanner" width={320} height={50} label="320 × 50 — Mobile Banner" className="md:hidden" />
      </div>

      {/* Template Showcase */}
      <section id="templates" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="section-label mb-3">Templates</p>
          <h2 className="text-3xl font-800 text-slate-900 mb-4">Choose Your Style</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">Every template is crafted to beat ATS filters and impress hiring managers.</p>
          <div className="inline-flex bg-slate-100 rounded-lg p-1 gap-1">
            {[['all', 'All Templates'], ['ats', 'ATS-Friendly'], ['modern', 'Modern Design']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTemplateFilter(val as 'all' | 'ats' | 'modern')}
                className="px-4 py-2 text-sm font-600 rounded-md transition-all"
                style={templateFilter === val
                  ? { background: 'white', color: '#2563EB', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                  : { color: '#64748B' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {filtered.map((tpl, i) => (
            <div key={tpl.id} className="template-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Live mini render of the real template */}
              <div className="aspect-[3/4] overflow-hidden relative bg-slate-100">
                <div className="absolute left-1/2 top-3 pointer-events-none" style={{ width: '210mm', transform: 'translateX(-50%) scale(0.3)', transformOrigin: 'top center' }}>
                  <CVPreview cvData={{ ...defaultCV, selectedTemplate: tpl.id, accentColor: tpl.color }} />
                </div>
              </div>

              <div className="overlay">
                <button onClick={() => onStart(tpl.id)} className="bg-white font-700 text-sm px-5 py-2.5 rounded-lg" style={{ color: '#2563EB' }}>
                  Use Template
                </button>
              </div>

              <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-700 text-sm text-slate-900">{tpl.name}</div>
                  <div className="text-xs text-slate-400 font-500">{tpl.type === 'ats' ? 'ATS-Friendly' : 'Modern Design'}</div>
                </div>
                {tpl.type === 'ats' && (
                  <span className="text-[10px] font-700 px-2 py-0.5 rounded-full" style={{ background: '#ECFDF5', color: '#059669' }}>ATS ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button onClick={() => onStart()} className="btn-primary px-8 py-3.5 text-sm">
            Start With Any Template →
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="scroll-mt-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="section-label mb-3">Why CVcraft</p>
            <h2 className="text-3xl font-800 text-slate-900">Everything You Need to Get Hired</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-700 text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Guide */}
      <section id="ats-guide" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="section-label mb-3">ATS Guide</p>
          <h2 className="text-3xl font-800 text-slate-900 mb-4">Get Past the Applicant Tracking System</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Over 75% of CVs are filtered out by software before a human sees them. Follow these rules to make sure yours gets through.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-700 text-emerald-700 mb-4">Do</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {[
                'Mirror keywords from the job description in your summary and skills.',
                'Use standard headings: Experience, Education, Skills.',
                'Keep a single-column, simple layout (try Executive or Nordic).',
                'Write dates consistently, e.g. "Jan 2022 – Present".',
                'Save and submit as a text-based PDF.',
              ].map(t => <li key={t} className="flex gap-2"><span className="text-emerald-600 font-700">✓</span>{t}</li>)}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-700 text-rose-600 mb-4">Avoid</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {[
                'Putting key details in headers, footers, or images.',
                'Tables, text boxes, and skill-rating graphics.',
                'Creative headings like "My Journey" instead of "Experience".',
                'Uncommon fonts or abbreviations without the full term.',
                'Sending one generic CV to every role.',
              ].map(t => <li key={t} className="flex gap-2"><span className="text-rose-500 font-700">✕</span>{t}</li>)}
            </ul>
          </div>
        </div>
        <ol className="grid sm:grid-cols-3 gap-4 mt-6">
          {[
            ['1', 'Pick an ATS-friendly template', 'Look for the "ATS ✓" badge above.'],
            ['2', 'Tailor your keywords', 'Match the exact skills listed in the job ad.'],
            ['3', 'Quantify achievements', 'Numbers like "cut costs 20%" stand out to recruiters.'],
          ].map(([n, title, desc]) => (
            <li key={n} className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-700 mb-3" style={{ background: '#2563EB' }}>{n}</div>
              <div className="font-700 text-slate-900 text-sm mb-1">{title}</div>
              <div className="text-xs text-slate-500">{desc}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl p-10 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }}/>
          <h2 className="text-3xl font-800 text-white mb-4 relative">Ready to Land Your Dream Job?</h2>
          <p className="text-blue-100 mb-8 relative max-w-md mx-auto">Join 120,000+ professionals who built their winning CV with CVcraft.</p>
          <button onClick={() => onStart()} className="bg-white font-700 px-8 py-3.5 rounded-lg text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 relative" style={{ color: '#2563EB' }}>
            🚀 Create My CV — Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#2563EB' }}>
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="6" height="8" rx="1" fill="white"/>
                  <rect x="10" y="2" width="6" height="4" rx="1" fill="white" fillOpacity="0.6"/>
                </svg>
              </div>
              <span className="font-700 text-slate-800">CVcraft</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Free, private, ATS-friendly CV builder. Create a professional resume in minutes.</p>
            <div className="flex gap-2 mt-4">
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
              </a>
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-700 text-slate-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a {...linkProps(LEGAL_PATHS.about)} className="hover:text-slate-900">About Us</a></li>
              <li><a {...linkProps(LEGAL_PATHS.contact)} className="hover:text-slate-900">Contact Us</a></li>
              <li><a href="#templates" className="hover:text-slate-900">Templates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-700 text-slate-900 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a {...linkProps(LEGAL_PATHS.privacy)} className="hover:text-slate-900">Privacy Policy</a></li>
              <li><a {...linkProps(LEGAL_PATHS.terms)} className="hover:text-slate-900">Terms of Service</a></li>
              <li><a {...linkProps(LEGAL_PATHS.cookies)} className="hover:text-slate-900">Cookie Policy</a></li>
              <li><a {...linkProps(LEGAL_PATHS.disclaimer)} className="hover:text-slate-900">Disclaimer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-700 text-slate-900 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-slate-900 break-all">{CONTACT.email}</a></li>
              <li><a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">WhatsApp: {CONTACT.whatsappDisplay}</a></li>
              <li>{CONTACT.location}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100">
          <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-400">© 2026 CVcraft. All rights reserved.</p>
        </div>
      </footer>
      <CookieConsent onLearnMore={() => navigate(LEGAL_PATHS.cookies)} />
    </div>
  )
}
