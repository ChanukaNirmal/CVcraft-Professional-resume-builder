import { useEffect, useMemo, useRef, useState } from 'react'
import type { CVData } from '../types'
import CVPreview, { TEMPLATES } from '../components/CVPreview'
import AdSlot from '../components/AdSlot'
import { downloadElementAsPDF, printElement } from '../lib/pdf'

interface Props {
  cvData: CVData
  setCVData: (d: CVData) => void
  onEdit: () => void
  onHome: () => void
}

const colors = [
  { label: 'Trust Blue', value: '#2563EB' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Rose', value: '#DB2777' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Amber', value: '#D97706' },
  { label: 'Slate', value: '#0F172A' },
]

const AD_SECONDS = 5

export default function DownloadPage({ cvData, setCVData, onEdit, onHome }: Props) {
  const [showAdModal, setShowAdModal] = useState(false)
  const [countdown, setCountdown] = useState(AD_SECONDS)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState<'preview' | 'colors'>('preview')
  const exportRef = useRef<HTMLDivElement>(null)

  const pd = cvData.personalDetails
  const fileName = `${(pd.firstName || 'My').trim()}_${(pd.lastName || 'CV').trim()}_CV.pdf`.replace(/\s+/g, '_')
  const update = (partial: Partial<CVData>) => setCVData({ ...cvData, ...partial })

  // Real CV strength scores derived from the data
  const strength = useMemo(() => {
    const checks = [
      pd.firstName, pd.lastName, pd.title, pd.email, pd.phone, pd.location, pd.linkedin,
      cvData.summary.length > 120, cvData.experience.length > 0, cvData.education.length > 0,
      cvData.skills.length >= 5, cvData.projects.length > 0, cvData.certifications.length > 0, cvData.languages.length > 0,
    ]
    const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100)
    const bullets = cvData.experience.filter(e => e.description.split('\n').length >= 2).length
    const ats = Math.min(100, 50 + (pd.email ? 10 : 0) + (cvData.experience.length ? 15 : 0) + Math.min(bullets * 5, 15) + (cvData.skills.length >= 5 ? 10 : 0))
    const text = (cvData.summary + cvData.experience.map(e => e.description).join(' ')).toLowerCase()
    const matched = cvData.skills.filter(s => text.includes(s.toLowerCase())).length
    const keyword = cvData.skills.length ? Math.round(40 + (matched / cvData.skills.length) * 60) : 30
    return [
      { label: 'ATS Score', pct: ats, color: '#10B981' },
      { label: 'Completeness', pct: completeness, color: '#2563EB' },
      { label: 'Keyword Match', pct: keyword, color: '#7C3AED' },
    ]
  }, [cvData, pd])

  // Interstitial countdown
  useEffect(() => {
    if (!showAdModal || countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [showAdModal, countdown])

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  function handleDownload() {
    setCountdown(AD_SECONDS)
    setShowAdModal(true)
  }

  async function startPdf() {
    setShowAdModal(false)
    if (!exportRef.current) return
    setDownloading(true)
    setError('')
    try {
      await downloadElementAsPDF(exportRef.current.firstElementChild as HTMLElement, fileName)
      setDownloaded(true)
    } catch (e) {
      console.error(e)
      setError('PDF generation failed. Try "Print / Save as PDF" instead.')
    } finally {
      setDownloading(false)
    }
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(cvData, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName.replace('.pdf', '.json')
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then(t => {
      try { setCVData({ ...cvData, ...JSON.parse(t) }); flash('CV data imported') } catch { flash('Invalid file') }
    })
    e.target.value = ''
  }

  async function share() {
    const text = `${pd.firstName} ${pd.lastName} — ${pd.title}\n${[pd.email, pd.phone, pd.linkedin].filter(Boolean).join(' · ')}`
    try {
      if (navigator.share) await navigator.share({ title: `${pd.firstName} ${pd.lastName} CV`, text })
      else { await navigator.clipboard.writeText(text); flash('Contact card copied to clipboard') }
    } catch { /* cancelled */ }
  }

  const DownloadIcon = ({ s = 14 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  )
  const Spinner = ({ s = 14 }: { s?: number }) => (
    <svg width={s} height={s} className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0110 10"/></svg>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onHome} aria-label="Home" className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#2563EB' }}>
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="8" rx="1" fill="white"/><rect x="10" y="2" width="6" height="4" rx="1" fill="white" fillOpacity="0.6"/></svg>
              </div>
              <span className="font-700 text-slate-800">CVcraft</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-600 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
              ✏ Edit Details
            </button>
            <button onClick={handleDownload} disabled={downloading} className="btn-emerald px-5 py-2 text-sm flex items-center gap-2">
              {downloading ? <><Spinner /> Preparing...</> : downloaded ? <>✓ Download again</> : <><DownloadIcon /> Download PDF</>}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {downloaded && (
          <div className="mb-6 p-4 rounded-xl border flex items-center gap-3 fade-in" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-700" style={{ background: '#10B981' }}>✓</div>
            <div>
              <p className="font-700 text-sm" style={{ color: '#065F46' }}>Your CV has been downloaded!</p>
              <p className="text-xs" style={{ color: '#059669' }}>Check your Downloads folder for <strong>{fileName}</strong></p>
            </div>
          </div>
        )}
        {error && <div className="mb-6 p-4 rounded-xl border text-sm font-600" style={{ background: '#FEF2F2', borderColor: '#FECACA', color: '#B91C1C' }}>{error}</div>}

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="min-w-0">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                <h1 className="font-800 text-slate-900 text-xl">Your CV is Ready</h1>
                <p className="text-sm text-slate-400 mt-0.5">Review, switch templates, and download.</p>
              </div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {([['preview', 'Preview'], ['colors', 'Customize']] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setActiveTab(val)} className="px-3 py-1.5 text-xs font-600 rounded-md transition-all"
                    style={activeTab === val ? { background: 'white', color: '#2563EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#64748B' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'colors' && (
              <div className="card p-5 mb-4 fade-in space-y-5">
                <div>
                  <h3 className="font-700 text-sm text-slate-800 mb-3">Template</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {TEMPLATES.map(t => (
                      <button key={t.id} onClick={() => update({ selectedTemplate: t.id })}
                        className="rounded-lg border-2 overflow-hidden text-left transition-all hover:-translate-y-0.5"
                        style={{ borderColor: cvData.selectedTemplate === t.id ? cvData.accentColor : '#E2E8F0' }}>
                        <div className="h-24 overflow-hidden relative bg-slate-100">
                          <div className="absolute left-1/2 top-1 pointer-events-none" style={{ width: '210mm', transform: 'translateX(-50%) scale(0.13)', transformOrigin: 'top center' }}>
                            <CVPreview cvData={{ ...cvData, selectedTemplate: t.id }} />
                          </div>
                        </div>
                        <div className="px-2 py-1.5 text-[11px] font-700 text-slate-700">{t.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-700 text-sm text-slate-800 mb-3">Accent Color</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                    {colors.map(c => (
                      <button key={c.value} onClick={() => update({ accentColor: c.value })}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all hover:bg-slate-50"
                        style={{ borderColor: cvData.accentColor === c.value ? c.value : '#E2E8F0' }}>
                        <div className="w-8 h-8 rounded-full shadow-sm" style={{ background: c.value }}/>
                        <span className="text-[10px] text-slate-500 font-500">{c.label}</span>
                      </button>
                    ))}
                    <label className="flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-slate-200 cursor-pointer hover:bg-slate-50">
                      <div className="w-8 h-8 rounded-full shadow-sm relative overflow-hidden" style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}>
                        <input type="color" value={cvData.accentColor} onChange={e => update({ accentColor: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer"/>
                      </div>
                      <span className="text-[10px] text-slate-500 font-500">Custom</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="card overflow-hidden shadow-lg" style={{ borderRadius: 16 }}>
              <div className="flex items-center gap-1.5 px-4 h-9 border-b border-slate-100 bg-slate-50">
                {['#FF5F56','#FFBD2E','#27C93F'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }}/>)}
                <div className="flex-1 text-center text-xs text-slate-400 font-500 truncate">{fileName}</div>
              </div>
              <div className="overflow-auto p-4 sm:p-6 bg-slate-100 flex justify-center" style={{ maxHeight: '75vh' }}>
                <div style={{ width: 'calc(210mm * 0.65)', height: 'calc(297mm * 0.65)' }}>
                  <div style={{ transform: 'scale(0.65)', transformOrigin: 'top left', width: '210mm' }}>
                    <CVPreview cvData={cvData}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-700 text-slate-900 mb-1">Download Your CV</h3>
              <p className="text-xs text-slate-400 mb-4">A4 · Print-ready · {TEMPLATES.find(t => t.id === cvData.selectedTemplate)?.name ?? 'Modern'} template</p>

              <button onClick={handleDownload} disabled={downloading} className="w-full btn-emerald py-4 flex items-center justify-center gap-2.5 mb-3" style={{ borderRadius: 10, fontSize: 15 }}>
                {downloading ? <><Spinner s={18} /> Generating PDF...</> : <><DownloadIcon s={18} /> Download PDF</>}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => exportRef.current && printElement(exportRef.current.firstElementChild as HTMLElement)} className="py-2.5 text-sm font-600 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">🖨 Print</button>
                <button onClick={share} className="py-2.5 text-sm font-600 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">🔗 Share</button>
                <button onClick={exportJSON} className="py-2.5 text-sm font-600 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">⬇ Save data</button>
                <label className="py-2.5 text-sm font-600 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                  ⬆ Load data
                  <input type="file" accept="application/json" className="hidden" onChange={importJSON}/>
                </label>
              </div>
              <button onClick={onEdit} className="w-full mt-2 py-2.5 text-sm font-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">✏ Edit details</button>
            </div>

            {/* 🟡 GOOGLE ADSENSE — Download පිටුවේ පැති තීරුවේ 300×250 Medium Rectangle දැන්වීම */}
            <AdSlot slot="rectangle" width={300} height={250} label="300 × 250 — Medium Rectangle" />

            <div className="card p-4">
              <p className="section-label mb-3">CV Strength</p>
              <div className="space-y-3">
                {strength.map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-600 mb-1">
                      <span className="text-slate-600">{label}</span>
                      <span style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }}/>
                    </div>
                  </div>
                ))}
              </div>
              {strength[1].pct < 100 && <p className="text-[11px] text-slate-400 mt-3">Tip: fill in every section and add 5+ skills to reach 100% completeness.</p>}
            </div>
          </div>
        </div>

        {/* 🟡 GOOGLE ADSENSE — Download බොත්තමට බොහෝ පහළින් Leaderboard දැන්වීම (ප්‍රධාන CTA එකට ආසන්න නොවේ) */}
        <div className="mt-10">
          {/* 🟡 Desktop: 728×90 Leaderboard */}
          <AdSlot slot="leaderboard" width={728} height={90} label="728 × 90 — Leaderboard" className="hidden md:block" />
          {/* 🟡 Mobile: 320×50 Banner */}
          <AdSlot slot="mobileBanner" width={320} height={50} label="320 × 50 — Mobile Banner" className="md:hidden" />
        </div>

        <div className="mt-8 text-center">
          <button onClick={onHome} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">← Back to home</button>
        </div>
      </div>

      {/* Off-screen, unscaled copy used as the PDF source */}
      <div ref={exportRef} aria-hidden style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}>
        <CVPreview cvData={cvData}/>
      </div>

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-600 px-4 py-2.5 rounded-lg shadow-lg fade-in">{toast}</div>}

      {/* ==================================================================
          🟡 GOOGLE ADSENSE — Download Interstitial (Modal) දැන්වීම
          ------------------------------------------------------------------
          PDF download කිරීමට පෙර තත්පර කිහිපයක් පෙන්වන 300×250 දැන්වීම.
          AdSense ප්‍රතිපත්තියට අනුකූලව: "Skip" බොත්තම සෑම විටම ඇත, ඔබට
          දැන්වීම click කිරීමට බල නොකරයි, download එක දැන්වීම මත රඳා නොපවතී.
          ================================================================== */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowAdModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden slide-up">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-700 text-slate-900 text-sm">Almost ready!</p>
                <p className="text-xs text-slate-400">{countdown > 0 ? `Your PDF will be ready in ${countdown}s` : 'Your PDF is ready.'}</p>
              </div>
              <button onClick={startPdf} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 text-xs font-600">Skip</button>
            </div>

            <div className="p-4">
              {/* 🟡 Interstitial දැන්වීම් ඒකකය */}
              <AdSlot slot="interstitial" width={300} height={250} label="300 × 250 — Interstitial Ad" />
            </div>

            <div className="px-5 pb-5">
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className="h-full transition-all duration-1000 ease-linear" style={{ width: `${((AD_SECONDS - countdown) / AD_SECONDS) * 100}%`, background: '#10B981' }}/>
              </div>
              <button onClick={startPdf} className="w-full btn-emerald py-3.5 text-sm flex items-center justify-center gap-2">
                <DownloadIcon s={16} /> Download My PDF
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-2">Generated in your browser. Your data stays private.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
