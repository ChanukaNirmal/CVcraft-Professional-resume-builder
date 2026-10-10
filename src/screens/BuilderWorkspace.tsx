import { useState, useRef } from 'react'
import type { CVData, Experience, Education, Project, Certification, Language } from '../types'
import CVPreview, { TEMPLATES } from '../components/CVPreview'
import AdSlot from '../components/AdSlot'

interface Props {
  cvData: CVData
  setCVData: (d: CVData) => void
  onFinish: () => void
  onBack: () => void
}

const STEPS = ['Personal', 'Summary', 'Experience', 'Education', 'Skills', 'Extras']

function uid() { return Math.random().toString(36).slice(2, 9) }

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-600 text-slate-600 mb-1.5">{children}</label>
}

function Accordion({ title, icon, children, defaultOpen = false }: { title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base">{icon}</span>
          <span className="font-600 text-sm text-slate-800">{title}</span>
        </div>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform text-slate-400" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
          <polyline points="4 6 8 10 12 6"/>
        </svg>
      </button>
      {open && <div className="p-4 pt-0 bg-white border-t border-slate-100 fade-in">{children}</div>}
    </div>
  )
}

export default function BuilderWorkspace({ cvData, setCVData, onFinish, onBack }: Props) {
  const [mobileStep, setMobileStep] = useState(0)
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(0.55)
  const fileRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLTextAreaElement>(null)
  const [aiVariant, setAiVariant] = useState(0)
  const [aiBusy, setAiBusy] = useState(false)

  const update = (partial: Partial<CVData>) => setCVData({ ...cvData, ...partial })
  const updatePD = (partial: Partial<CVData['personalDetails']>) =>
    update({ personalDetails: { ...cvData.personalDetails, ...partial } })

  const colors = ['#2563EB', '#7C3AED', '#DB2777', '#059669', '#D97706', '#DC2626', '#0F172A']

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Please choose an image under 2MB.'); return }
    const reader = new FileReader()
    reader.onload = ev => updatePD({ photo: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  // Builds a tailored summary from what the user has entered (runs locally, cycles through tones)
  function generateSummary() {
    setAiBusy(true)
    const pd = cvData.personalDetails
    const role = pd.title || 'professional'
    const years = (() => {
      const starts = cvData.experience.map(e => e.startDate).filter(Boolean).sort()
      if (!starts.length) return 0
      return Math.max(1, new Date().getFullYear() - parseInt(starts[0]))
    })()
    const exp = years ? `${years}+ years of experience` : 'hands-on experience'
    const companies = cvData.experience.map(e => e.company).filter(Boolean).slice(0, 2).join(' and ')
    const skills = cvData.skills.slice(0, 4)
    const skillText = skills.length ? skills.slice(0, -1).join(', ') + (skills.length > 1 ? ' and ' : '') + skills[skills.length - 1] : 'modern tools'
    const variants = [
      `Results-driven ${role} with ${exp} delivering measurable impact${companies ? ` at ${companies}` : ''}. Skilled in ${skillText}, with a track record of turning complex problems into simple, elegant solutions. Known for clear communication, cross-functional collaboration and a relentless focus on quality.`,
      `${role} bringing ${exp} across fast-paced teams${companies ? ` including ${companies}` : ''}. Combines deep expertise in ${skillText} with strong ownership and a data-informed mindset. Thrives on shipping work that users love and that moves business metrics.`,
      `Versatile ${role} with ${exp}. Core strengths in ${skillText}. Proven ability to lead initiatives end-to-end, mentor peers and adapt quickly to new domains — now seeking to bring that energy to a mission-driven team.`,
    ]
    setTimeout(() => {
      update({ summary: variants[aiVariant % variants.length] })
      setAiVariant(v => v + 1)
      setAiBusy(false)
    }, 700)
  }

  function insertBullet() {
    const el = summaryRef.current
    const pos = el?.selectionStart ?? cvData.summary.length
    const before = cvData.summary.slice(0, pos)
    const next = before + (before && !before.endsWith('\n') ? '\n' : '') + '• ' + cvData.summary.slice(pos)
    update({ summary: next })
    requestAnimationFrame(() => el?.focus())
  }

  const wordCount = cvData.summary.trim() ? cvData.summary.trim().split(/\s+/).length : 0

  // ── Form Sections ──────────────────────────────────────────────
  const formSections = [
    // 0: Personal
    <div className="space-y-4 fade-in" key="personal">
      {/* Photo upload */}
      <div>
        <Label>Profile Photo</Label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          {cvData.personalDetails.photo ? (
            <img src={cvData.personalDetails.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover"/>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl">🖼</div>
              <p className="text-xs text-slate-400 text-center">Drag & drop or click to upload<br/><span className="text-slate-300">JPG, PNG — max 2MB</span></p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>
        {cvData.personalDetails.photo && (
          <button onClick={() => { updatePD({ photo: null }); if (fileRef.current) fileRef.current.value = '' }} className="mt-2 text-xs font-600 text-slate-400 hover:text-red-500">Remove photo</button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div><Label>First Name</Label><input className="form-input" placeholder="Alexandra" value={cvData.personalDetails.firstName} onChange={e => updatePD({ firstName: e.target.value })}/></div>
        <div><Label>Last Name</Label><input className="form-input" placeholder="Morrison" value={cvData.personalDetails.lastName} onChange={e => updatePD({ lastName: e.target.value })}/></div>
      </div>
      <div><Label>Professional Title</Label><input className="form-input" placeholder="Senior Product Designer" value={cvData.personalDetails.title} onChange={e => updatePD({ title: e.target.value })}/></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Email</Label><input className="form-input" type="email" placeholder="you@email.com" value={cvData.personalDetails.email} onChange={e => updatePD({ email: e.target.value })}/></div>
        <div><Label>Phone</Label><input className="form-input" placeholder="+1 (555) 000-0000" value={cvData.personalDetails.phone} onChange={e => updatePD({ phone: e.target.value })}/></div>
      </div>
      <div><Label>City / Country</Label><input className="form-input" placeholder="San Francisco, CA" value={cvData.personalDetails.location} onChange={e => updatePD({ location: e.target.value })}/></div>
      <div><Label>LinkedIn URL</Label><input className="form-input" placeholder="linkedin.com/in/yourname" value={cvData.personalDetails.linkedin} onChange={e => updatePD({ linkedin: e.target.value })}/></div>
      <div><Label>Portfolio / Website</Label><input className="form-input" placeholder="yourwebsite.com" value={cvData.personalDetails.website} onChange={e => updatePD({ website: e.target.value })}/></div>
    </div>,

    // 1: Summary
    <div className="space-y-3 fade-in" key="summary">
      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
        <button onClick={insertBullet} className="px-2.5 py-1 text-xs font-700 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">• Bullet</button>
        <span className="ml-auto text-xs font-600" style={{ color: wordCount > 80 ? '#D97706' : '#94A3B8' }}>{wordCount} words · aim 40–80</span>
      </div>
      <textarea
        ref={summaryRef}
        className="form-input resize-none"
        rows={7}
        placeholder="Results-driven professional with X years of experience in..."
        value={cvData.summary}
        onChange={e => update({ summary: e.target.value })}
      />
      <button
        onClick={generateSummary}
        disabled={aiBusy}
        className="w-full border border-blue-200 bg-blue-50 text-blue-700 rounded-lg py-2.5 text-sm font-600 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {aiBusy ? 'Writing…' : aiVariant ? '✨ Regenerate (new tone)' : '✨ AI Generate Summary'}
      </button>
      <p className="text-[11px] text-slate-400 text-center">Uses your title, experience and skills to draft a summary.</p>
    </div>,

    // 2: Experience
    <div className="space-y-4 fade-in" key="experience">
      {cvData.experience.map((exp, idx) => (
        <div key={exp.id} className="border border-slate-200 rounded-xl p-4 space-y-3 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-700 text-slate-400 uppercase tracking-wider">Role {idx + 1}</span>
            {cvData.experience.length > 1 && (
              <button onClick={() => update({ experience: cvData.experience.filter(e => e.id !== exp.id) })} className="text-slate-300 hover:text-red-400 transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="3" x2="11" y2="11"/><line x1="11" y1="3" x2="3" y2="11"/></svg>
              </button>
            )}
          </div>
          <ExperienceFields exp={exp} onChange={updated => update({ experience: cvData.experience.map(e => e.id === exp.id ? updated : e) })}/>
        </div>
      ))}
      <button
        onClick={() => update({ experience: [...cvData.experience, { id: uid(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }] })}
        className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 text-sm font-600 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
      >
        + Add Another Role
      </button>
    </div>,

    // 3: Education
    <div className="space-y-4 fade-in" key="education">
      {cvData.education.map((edu, idx) => (
        <div key={edu.id} className="border border-slate-200 rounded-xl p-4 space-y-3 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-700 text-slate-400 uppercase tracking-wider">Degree {idx + 1}</span>
            {cvData.education.length > 1 && (
              <button onClick={() => update({ education: cvData.education.filter(e => e.id !== edu.id) })} className="text-slate-300 hover:text-red-400 transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="3" x2="11" y2="11"/><line x1="11" y1="3" x2="3" y2="11"/></svg>
              </button>
            )}
          </div>
          <EducationFields edu={edu} onChange={updated => update({ education: cvData.education.map(e => e.id === edu.id ? updated : e) })}/>
        </div>
      ))}
      <button
        onClick={() => update({ education: [...cvData.education, { id: uid(), degree: '', institution: '', startDate: '', endDate: '', gpa: '', description: '' }] })}
        className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 text-sm font-600 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
      >
        + Add Another Degree
      </button>
    </div>,

    // 4: Skills
    <div className="space-y-4 fade-in" key="skills">
      <div>
        <Label>Skills (press Enter to add)</Label>
        <SkillInput skills={cvData.skills} onChange={skills => update({ skills })}/>
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs text-slate-400 mb-2 font-500">Suggested skills</p>
        <div className="flex flex-wrap gap-1.5">
          {['Figma', 'React', 'TypeScript', 'Python', 'SQL', 'Agile', 'Leadership', 'Excel', 'Photoshop', 'Node.js'].filter(s => !cvData.skills.includes(s)).map(s => (
            <button key={s} onClick={() => update({ skills: [...cvData.skills, s] })} className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">+ {s}</button>
          ))}
        </div>
      </div>
    </div>,

    // 5: Extras
    <div className="space-y-2 fade-in" key="extras">
      <Accordion title="Projects" icon="💡" defaultOpen>
        {cvData.projects.map((p, idx) => (
          <div key={p.id} className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Project {idx + 1}</span>
              <button onClick={() => update({ projects: cvData.projects.filter(x => x.id !== p.id) })} className="text-slate-300 hover:text-red-400">✕</button>
            </div>
            <input className="form-input" placeholder="Project Name" value={p.name} onChange={e => update({ projects: cvData.projects.map(x => x.id === p.id ? { ...x, name: e.target.value } : x) })}/>
            <input className="form-input" placeholder="github.com/..." value={p.link} onChange={e => update({ projects: cvData.projects.map(x => x.id === p.id ? { ...x, link: e.target.value } : x) })}/>
            <textarea className="form-input resize-none" rows={2} placeholder="Brief description..." value={p.description} onChange={e => update({ projects: cvData.projects.map(x => x.id === p.id ? { ...x, description: e.target.value } : x) })}/>
          </div>
        ))}
        <button onClick={() => update({ projects: [...cvData.projects, { id: uid(), name: '', link: '', description: '' }] })} className="text-xs font-600 text-blue-600 hover:text-blue-700">+ Add Project</button>
      </Accordion>

      <Accordion title="Certifications" icon="🏆">
        {cvData.certifications.map((c, idx) => (
          <div key={c.id} className="space-y-2 mb-3">
            <div className="flex justify-between"><span className="text-xs text-slate-400">Cert {idx + 1}</span><button onClick={() => update({ certifications: cvData.certifications.filter(x => x.id !== c.id) })} className="text-slate-300 hover:text-red-400">✕</button></div>
            <input className="form-input" placeholder="Certificate Name" value={c.name} onChange={e => update({ certifications: cvData.certifications.map(x => x.id === c.id ? { ...x, name: e.target.value } : x) })}/>
            <div className="grid grid-cols-2 gap-2">
              <input className="form-input" placeholder="Issuing Org" value={c.issuer} onChange={e => update({ certifications: cvData.certifications.map(x => x.id === c.id ? { ...x, issuer: e.target.value } : x) })}/>
              <input className="form-input" placeholder="Year" value={c.year} onChange={e => update({ certifications: cvData.certifications.map(x => x.id === c.id ? { ...x, year: e.target.value } : x) })}/>
            </div>
          </div>
        ))}
        <button onClick={() => update({ certifications: [...cvData.certifications, { id: uid(), name: '', issuer: '', year: '' }] })} className="text-xs font-600 text-blue-600">+ Add Certification</button>
      </Accordion>

      <Accordion title="Languages" icon="🌐">
        {cvData.languages.map((l, idx) => (
          <div key={l.id} className="flex gap-2 mb-2">
            <input className="form-input" placeholder="Language" value={l.language} onChange={e => update({ languages: cvData.languages.map(x => x.id === l.id ? { ...x, language: e.target.value } : x) })}/>
            <select className="form-input" value={l.proficiency} onChange={e => update({ languages: cvData.languages.map(x => x.id === l.id ? { ...x, proficiency: e.target.value } : x) })}>
              {['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'].map(p => <option key={p}>{p}</option>)}
            </select>
            <button onClick={() => update({ languages: cvData.languages.filter(x => x.id !== l.id) })} className="text-slate-300 hover:text-red-400 flex-shrink-0">✕</button>
          </div>
        ))}
        <button onClick={() => update({ languages: [...cvData.languages, { id: uid(), language: '', proficiency: 'Professional' }] })} className="text-xs font-600 text-blue-600">+ Add Language</button>
      </Accordion>
    </div>,
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#2563EB' }}>
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="8" rx="1" fill="white"/><rect x="10" y="2" width="6" height="4" rx="1" fill="white" fillOpacity="0.6"/></svg>
              </div>
              <span className="font-700 text-slate-800 hidden sm:block">CVcraft</span>
            </div>
            <span className="text-slate-200 hidden sm:block">|</span>
            <span className="text-sm font-500 text-slate-500 hidden sm:block">CV Builder</span>
          </div>

          {/* Desktop step indicators */}
          <div className="hidden lg:flex items-center gap-1 step-bar">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`step ${i < mobileStep ? 'done' : i === mobileStep ? 'active' : ''}`}>
                  <div className="step-dot">{i < mobileStep ? '✓' : i + 1}</div>
                  <span className="hidden xl:block text-xs">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-6 h-px mx-1" style={{ background: i < mobileStep ? '#10B981' : '#E2E8F0' }}/>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 text-sm font-600 text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
              Saved
            </button>
            <button onClick={onFinish} className="btn-emerald px-4 py-2 text-sm flex items-center gap-1.5">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Step Bar */}
      <div className="lg:hidden bg-white border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-700 text-slate-500">Step {mobileStep + 1} of {STEPS.length}</span>
          <span className="text-xs font-600" style={{ color: '#2563EB' }}>{STEPS[mobileStep]}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((mobileStep + 1) / STEPS.length) * 100}%`, background: '#2563EB' }}/>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden max-w-screen-2xl mx-auto w-full">
        {/* Left Pane */}
        <aside className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 flex flex-col border-r border-slate-200 bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 xl:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-700 text-slate-900">{STEPS[mobileStep]}</h2>
              <span className="section-label">{mobileStep + 1} / {STEPS.length}</span>
            </div>
            {formSections[mobileStep]}

            {/* 🟡 GOOGLE ADSENSE — Builder form එකට යටින් 300×250 Medium Rectangle දැන්වීම */}
            {/* 🟡 Form input/බොත්තම් වලින් ඈතින් තබා ඇත (AdSense accidental-click ප්‍රතිපත්තිය) */}
            <div className="mt-8">
              <AdSlot slot="rectangle" width={300} height={250} label="300 × 250 — Medium Rectangle" />
            </div>
          </div>

          {/* Bottom nav */}
          <div className="border-t border-slate-200 p-4 bg-white flex items-center gap-2">
            <button
              disabled={mobileStep === 0}
              onClick={() => setMobileStep(s => s - 1)}
              className="flex-1 py-2.5 text-sm font-600 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            {mobileStep < STEPS.length - 1 ? (
              <button
                onClick={() => setMobileStep(s => s + 1)}
                className="flex-1 py-2.5 text-sm font-600 rounded-lg text-white transition-colors"
                style={{ background: '#2563EB' }}
              >
                Next →
              </button>
            ) : (
              <button onClick={onFinish} className="btn-emerald flex-1 py-2.5 text-sm">
                Finish & Download
              </button>
            )}
            <button
              onClick={() => setShowMobilePreview(true)}
              className="lg:hidden px-3 py-2.5 text-xs font-600 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"
            >
              👁 Preview
            </button>
          </div>
        </aside>

        {/* Right Preview Pane — desktop only */}
        <main className="hidden lg:flex flex-1 flex-col bg-slate-100 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={cvData.selectedTemplate}
                onChange={e => update({ selectedTemplate: e.target.value })}
                className="text-xs font-600 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
                aria-label="Template"
              >
                {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name} — {t.tag}</option>)}
              </select>
              <span className="text-xs font-600 text-slate-500">Accent</span>
              <div className="flex gap-1.5">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => update({ accentColor: c })}
                    className="w-5 h-5 rounded-full transition-all"
                    style={{ background: c, outline: cvData.accentColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }}
                  />
                ))}
                <label className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer relative overflow-hidden" title="Custom colour" style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}>
                  <input type="color" value={cvData.accentColor} onChange={e => update({ accentColor: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer"/>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreviewZoom(z => Math.max(0.3, z - 0.05))} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 text-sm font-700">−</button>
              <span className="text-xs text-slate-500 w-12 text-center font-600">{Math.round(previewZoom * 100)}%</span>
              <button onClick={() => setPreviewZoom(z => Math.min(1, z + 0.05))} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 text-sm font-700">+</button>
              <div className="w-px h-4 bg-slate-200 mx-1"/>
              <span className="text-xs text-slate-400">Live Preview</span>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
            <div style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center', width: '210mm' }}>
              <CVPreview cvData={cvData} scale={1}/>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile full-screen preview modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 bg-white">
            <span className="font-700 text-slate-900">CV Preview</span>
            <button onClick={() => setShowMobilePreview(false)} className="p-2 rounded-lg hover:bg-slate-100">✕</button>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-white border-t border-slate-100">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => update({ selectedTemplate: t.id })} className="shrink-0 px-3 py-1.5 text-xs font-600 rounded-full border transition-colors"
                style={cvData.selectedTemplate === t.id ? { background: '#2563EB', color: 'white', borderColor: '#2563EB' } : { borderColor: '#E2E8F0', color: '#475569' }}>
                {t.name}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-4 bg-slate-100">
            <div style={{ transform: 'scale(0.38)', transformOrigin: 'top center', width: '210mm' }}>
              <CVPreview cvData={cvData} scale={1}/>
            </div>
          </div>
          <div className="p-4 bg-white flex gap-3">
            <button onClick={() => setShowMobilePreview(false)} className="flex-1 py-3 border border-slate-200 rounded-lg text-sm font-600 text-slate-600">Close Preview</button>
            <button onClick={onFinish} className="btn-emerald flex-1 py-3 text-sm">Download PDF</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ExperienceFields({ exp, onChange }: { exp: Experience; onChange: (e: Experience) => void }) {
  return (
    <div className="space-y-2.5">
      <input className="form-input" placeholder="Job Title" value={exp.title} onChange={e => onChange({ ...exp, title: e.target.value })}/>
      <div className="grid grid-cols-2 gap-2">
        <input className="form-input" placeholder="Company" value={exp.company} onChange={e => onChange({ ...exp, company: e.target.value })}/>
        <input className="form-input" placeholder="Location" value={exp.location} onChange={e => onChange({ ...exp, location: e.target.value })}/>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input className="form-input" type="month" value={exp.startDate} onChange={e => onChange({ ...exp, startDate: e.target.value })}/>
        <input className="form-input" type="month" value={exp.endDate} disabled={exp.current} placeholder="End Date" onChange={e => onChange({ ...exp, endDate: e.target.value })}/>
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
        <input type="checkbox" checked={exp.current} onChange={e => onChange({ ...exp, current: e.target.checked, endDate: '' })} className="rounded"/>
        I currently work here
      </label>
      <textarea className="form-input resize-none" rows={4} placeholder="• Led design for key product features&#10;• Collaborated with engineering teams&#10;• Drove measurable user outcomes" value={exp.description} onChange={e => onChange({ ...exp, description: e.target.value })}/>
    </div>
  )
}

function EducationFields({ edu, onChange }: { edu: Education; onChange: (e: Education) => void }) {
  return (
    <div className="space-y-2.5">
      <input className="form-input" placeholder="Degree / Certificate" value={edu.degree} onChange={e => onChange({ ...edu, degree: e.target.value })}/>
      <input className="form-input" placeholder="University / Institution" value={edu.institution} onChange={e => onChange({ ...edu, institution: e.target.value })}/>
      <div className="grid grid-cols-2 gap-2">
        <input className="form-input" type="month" value={edu.startDate} onChange={e => onChange({ ...edu, startDate: e.target.value })}/>
        <input className="form-input" type="month" value={edu.endDate} onChange={e => onChange({ ...edu, endDate: e.target.value })}/>
      </div>
      <input className="form-input" placeholder="GPA / Grade (optional)" value={edu.gpa} onChange={e => onChange({ ...edu, gpa: e.target.value })}/>
      <textarea className="form-input resize-none" rows={2} placeholder="Honors, activities, relevant coursework..." value={edu.description} onChange={e => onChange({ ...edu, description: e.target.value })}/>
    </div>
  )
}

function SkillInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState('')

  function addSkill() {
    const val = input.trim()
    if (val && !skills.includes(val)) onChange([...skills, val])
    setInput('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl min-h-[48px] bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        {skills.map(s => (
          <span key={s} className="skill-tag">
            {s}
            <button onClick={() => onChange(skills.filter(x => x !== s))} className="ml-0.5 text-blue-300 hover:text-blue-600">✕</button>
          </span>
        ))}
        <input
          className="tag-input border-none outline-none text-sm bg-transparent flex-1 min-w-[120px] text-slate-700 placeholder:text-slate-300"
          placeholder="Type a skill, press Enter..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
        />
      </div>
    </div>
  )
}
