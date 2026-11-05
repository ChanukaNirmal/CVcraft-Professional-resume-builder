import { useEffect, type ReactNode } from 'react'
import AdSlot from '../components/AdSlot'
import CVPreview from '../components/CVPreview'
import { SiteFooter, SiteHeader } from '../components/SiteChrome'
import { defaultCV } from '../data/sampleCV'
import { EXAMPLES } from '../data/examples'
import { GUIDES, guideBySlug, type Block } from '../data/guides'
import { linkProps } from '../lib/router'
import type { CVData } from '../types'

export type StartFn = (preset?: Partial<CVData>) => void

const SITE = 'https://www.cvcraft.tech'

function useMeta(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = `${title} — CVcraft`
    const desc = document.querySelector('meta[name=description]')
    const prevDesc = desc?.getAttribute('content') ?? ''
    desc?.setAttribute('content', description)
    const canon = document.querySelector('link[rel=canonical]')
    canon?.setAttribute('href', SITE + path)
    window.scrollTo(0, 0)
    return () => {
      document.title = 'CVcraft — Professional CV Builder'
      desc?.setAttribute('content', prevDesc)
      canon?.setAttribute('href', SITE + '/')
    }
  }, [title, description, path])
}

function Shell({ onStart, active, children }: { onStart: StartFn; active: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader onStart={() => onStart()} active={active} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

// Ads only appear inside long-form publisher content (AdSense policy)
function InContentAd() {
  return (
    <div className="my-10">
      <AdSlot slot="leaderboard" width={728} height={90} label="728 × 90 — Advertisement" className="hidden md:flex" />
      <AdSlot slot="mobileBanner" width={320} height={50} label="320 × 50 — Advertisement" className="md:hidden" />
    </div>
  )
}

function CTA({ onStart, text = 'Put these tips into practice with a free, ATS-friendly template.' }: { onStart: StartFn; text?: string }) {
  return (
    <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg,#1E40AF,#2563EB)' }}>
      <p className="text-xl font-800 text-white">Ready to build your CV?</p>
      <p className="text-blue-100 mt-2 mb-5 max-w-md mx-auto text-sm">{text}</p>
      <button onClick={() => onStart()} className="btn-emerald px-6 py-3 text-sm">Start building — it's free</button>
    </div>
  )
}

/* ---------------- Guides index ---------------- */
export function GuidesIndex({ onStart }: { onStart: StartFn }) {
  useMeta('CV Writing Guides & Career Advice', 'Free, practical guides on writing a professional CV, ATS-friendly resumes, CV summaries, work experience, and tips for Sri Lankan job seekers.', '/guides')
  const [featured, ...rest] = GUIDES
  return (
    <Shell onStart={onStart} active="/guides">
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <p className="section-label mb-3">Career Guides</p>
          <h1 className="text-3xl sm:text-4xl font-800 text-slate-900 tracking-tight">CV writing guides that get you interviews</h1>
          <p className="text-slate-500 mt-3 max-w-2xl">Practical, example-led advice on every part of your CV, from the summary to ATS formatting, written for job seekers in Sri Lanka and abroad.</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <a {...linkProps(`/guides/${featured.slug}`)} className="block rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-lg transition-all">
          <span className="text-xs font-700 text-blue-600">{featured.category} · Featured</span>
          <h2 className="text-2xl font-800 text-slate-900 mt-2">{featured.title}</h2>
          <p className="text-slate-500 mt-2">{featured.excerpt}</p>
          <p className="text-xs text-slate-400 mt-4">{featured.readMins} min read · Updated {featured.updated}</p>
        </a>
        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          {rest.map(g => (
            <a key={g.slug} {...linkProps(`/guides/${g.slug}`)} className="flex flex-col rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
              <span className="text-xs font-700 text-blue-600">{g.category}</span>
              <h2 className="text-lg font-700 text-slate-900 mt-2 leading-snug">{g.title}</h2>
              <p className="text-sm text-slate-500 mt-2 flex-1">{g.excerpt}</p>
              <p className="text-xs text-slate-400 mt-4">{g.readMins} min read</p>
            </a>
          ))}
        </div>
        <InContentAd />
        <CTA onStart={onStart} />
      </div>
    </Shell>
  )
}

/* ---------------- Guide article ---------------- */
function renderBlock(b: Block, i: number) {
  switch (b.t) {
    case 'h2': return <h2 key={i} className="text-2xl font-800 text-slate-900 mt-10 mb-3 tracking-tight">{b.v}</h2>
    case 'h3': return <h3 key={i} className="text-lg font-700 text-slate-900 mt-6 mb-2">{b.v}</h3>
    case 'p': return <p key={i} className="text-slate-700 leading-[1.8] mb-4">{b.v}</p>
    case 'ul': return <ul key={i} className="list-disc pl-6 space-y-2 text-slate-700 leading-relaxed mb-5">{b.v.map(x => <li key={x}>{x}</li>)}</ul>
    case 'ol': return <ol key={i} className="list-decimal pl-6 space-y-2 text-slate-700 leading-relaxed mb-5">{b.v.map(x => <li key={x}>{x}</li>)}</ol>
    case 'tip': return <aside key={i} className="my-6 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-5 py-4 text-sm text-slate-700"><strong className="text-blue-700">Tip: </strong>{b.v}</aside>
    case 'compare': return (
      <div key={i} className="my-6 grid sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4"><p className="text-xs font-700 text-red-600 mb-1">Weak</p><p className="text-slate-700">{b.bad}</p></div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-700 text-emerald-700 mb-1">Strong</p><p className="text-slate-700">{b.good}</p></div>
      </div>
    )
  }
}

export function GuideArticle({ slug, onStart }: { slug: string; onStart: StartFn }) {
  const g = guideBySlug(slug)
  useMeta(g?.title ?? 'Guide not found', g?.excerpt ?? '', `/guides/${slug}`)
  if (!g) return <NotFound onStart={onStart} />
  const mid = Math.floor(g.body.length / 2)
  const related = GUIDES.filter(x => x.slug !== g.slug).slice(0, 3)
  return (
    <Shell onStart={onStart} active="/guides">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <a {...linkProps('/guides')} className="text-sm font-600 text-blue-600 hover:underline">← All guides</a>
        <p className="text-xs font-700 text-blue-600 mt-6">{g.category}</p>
        <h1 className="text-3xl sm:text-4xl font-800 text-slate-900 tracking-tight mt-2 leading-tight">{g.title}</h1>
        <p className="text-sm text-slate-400 mt-3">By Chanuka Senevirathna · {g.readMins} min read · Updated {g.updated}</p>
        <div className="mt-8">
          {g.body.slice(0, mid).map(renderBlock)}
          <InContentAd />
          {g.body.slice(mid).map((b, i) => renderBlock(b, i + mid))}
        </div>
        <div className="mt-12"><CTA onStart={onStart} /></div>
        <section className="mt-14">
          <h2 className="text-lg font-800 text-slate-900 mb-4">Related guides</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(r => (
              <a key={r.slug} {...linkProps(`/guides/${r.slug}`)} className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 transition-colors">
                <p className="text-sm font-700 text-slate-900 leading-snug">{r.title}</p>
                <p className="text-xs text-slate-400 mt-2">{r.readMins} min read</p>
              </a>
            ))}
          </div>
        </section>
      </article>
    </Shell>
  )
}

/* ---------------- Templates ---------------- */
const TEMPLATE_INFO = [
  { id: 'modern', name: 'Modern', color: '#2563EB', ats: true, layout: 'Single column with accent header', bestFor: 'Corporate, banking, IT, and any role applied to through an online portal.', desc: 'A balanced, highly readable layout. Section headings use your accent colour and every element follows a single top-to-bottom reading order, which makes it one of the safest choices for applicant tracking systems.' },
  { id: 'sidebar', name: 'Horizon', color: '#0EA5E9', ats: false, layout: 'Two columns with coloured sidebar', bestFor: 'Software engineers, designers, and marketers with many skills or tools to show.', desc: 'Contact details, skills, and languages sit in a sidebar so your experience gets the full width of the main column. Great for direct emails to hiring managers; for strict ATS portals choose Modern or Nordic.' },
  { id: 'executive', name: 'Executive', color: '#7C2D12', ats: true, layout: 'Traditional single column, serif accents', bestFor: 'Finance, law, management, government, and senior professionals.', desc: 'A conservative, formal style with a centred header and clear dividers. It signals seniority and works well when employers expect a classic CV.' },
  { id: 'minimal', name: 'Nordic', color: '#059669', ats: true, layout: 'Minimal single column, generous white space', bestFor: 'Fresh graduates, academics, and anyone who wants maximum clarity.', desc: 'Strips away decoration so content leads. Ideal for one-page graduate CVs and applications where readability matters most.' },
  { id: 'creative', name: 'Studio', color: '#7C3AED', ats: false, layout: 'Bold header block with two-column body', bestFor: 'Creative roles: graphic design, media, content, and brand marketing.', desc: 'A confident, colourful header with your photo and a modern body layout. Use it when you are sending your CV directly to a person and want it to be memorable.' },
  { id: 'timeline', name: 'Timeline', color: '#DB2777', ats: false, layout: 'Vertical timeline for experience', bestFor: 'Candidates with clear career progression or several roles at one company.', desc: 'Experience is shown on a connected timeline that makes promotions and progression easy to follow at a glance.' },
]

export function TemplatesPage({ onStart }: { onStart: StartFn }) {
  useMeta('Free CV Templates', 'Six free, professionally designed CV templates. Compare layouts, ATS compatibility, and which template suits your industry.', '/templates')
  return (
    <Shell onStart={onStart} active="/templates">
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <p className="section-label mb-3">Templates</p>
          <h1 className="text-3xl sm:text-4xl font-800 text-slate-900 tracking-tight">Choose the right CV template for your job</h1>
          <p className="text-slate-500 mt-3 max-w-2xl">Every template is free and fully editable. The right one depends on how you apply: through an online portal (choose an ATS-friendly design) or directly to a hiring manager (a more visual design can stand out).</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {TEMPLATE_INFO.map((t, i) => (
          <section key={t.id} className={`grid md:grid-cols-[280px_1fr] gap-8 items-center ${i % 2 ? 'md:grid-cols-[1fr_280px]' : ''}`}>
            <div className={`aspect-[3/4] overflow-hidden relative bg-slate-100 rounded-xl border border-slate-200 ${i % 2 ? 'md:order-2' : ''}`}>
              <div className="absolute left-1/2 top-3 pointer-events-none" style={{ width: '210mm', transform: 'translateX(-50%) scale(0.33)', transformOrigin: 'top center' }}>
                <CVPreview cvData={{ ...defaultCV, selectedTemplate: t.id, accentColor: t.color }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-800 text-slate-900">{t.name}</h2>
                <span className={`text-[11px] font-700 px-2 py-0.5 rounded-full ${t.ats ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'}`}>{t.ats ? 'ATS-friendly' : 'Visual design'}</span>
              </div>
              <p className="text-slate-600 mt-3 leading-relaxed">{t.desc}</p>
              <dl className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3"><dt className="text-xs font-700 text-slate-400 uppercase">Layout</dt><dd className="text-slate-700 mt-1">{t.layout}</dd></div>
                <div className="rounded-lg bg-slate-50 p-3"><dt className="text-xs font-700 text-slate-400 uppercase">Best for</dt><dd className="text-slate-700 mt-1">{t.bestFor}</dd></div>
              </dl>
              <button onClick={() => onStart({ selectedTemplate: t.id, accentColor: t.color })} className="btn-primary px-5 py-2.5 text-sm mt-5">Use {t.name} template</button>
            </div>
          </section>
        ))}
        <section className="rounded-2xl border border-slate-200 p-8">
          <h2 className="text-xl font-800 text-slate-900">How to choose</h2>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-600">
            <li>Applying through a company careers portal or job board? Pick <strong>Modern</strong>, <strong>Executive</strong>, or <strong>Nordic</strong>.</li>
            <li>Emailing your CV directly to a recruiter or manager? A visual template like <strong>Horizon</strong> or <strong>Studio</strong> is fine.</li>
            <li>Not sure? Start with Modern. You can switch templates at any time without losing your content.</li>
          </ul>
          <p className="text-sm text-slate-500 mt-4">Learn more in our <a {...linkProps('/guides/ats-friendly-resume')} className="text-blue-600 hover:underline">ATS-friendly resume guide</a>.</p>
        </section>
        <InContentAd />
      </div>
    </Shell>
  )
}

/* ---------------- Examples ---------------- */
export function ExamplesPage({ onStart }: { onStart: StartFn }) {
  useMeta('CV Examples', 'Real-world CV examples for software engineers, accountants, and fresh graduates, with notes on why each one works.', '/cv-examples')
  return (
    <Shell onStart={onStart} active="/cv-examples">
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <p className="section-label mb-3">CV Examples</p>
          <h1 className="text-3xl sm:text-4xl font-800 text-slate-900 tracking-tight">CV examples with expert notes</h1>
          <p className="text-slate-500 mt-3 max-w-2xl">Complete sample CVs for different careers and experience levels. Each one explains what makes it effective, and you can open any example in the builder and replace the details with your own.</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {EXAMPLES.map((ex, i) => (
          <section key={ex.slug} id={ex.slug} className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            <div>
              <p className="text-xs font-700 text-blue-600">{ex.level}</p>
              <h2 className="text-2xl font-800 text-slate-900 mt-1">{ex.role} CV example</h2>
              <p className="text-slate-600 mt-3 leading-relaxed">{ex.cv.summary}</p>
              <h3 className="font-700 text-slate-900 mt-6 mb-2">Why this CV works</h3>
              <ul className="space-y-2">
                {ex.why.map(w => (
                  <li key={w} className="flex gap-2 text-sm text-slate-600">
                    <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#ECFDF5"/><path d="M5 8.2l2 2 4-4.4" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {w}
                  </li>
                ))}
              </ul>
              <button onClick={() => onStart({ ...ex.cv })} className="btn-primary px-5 py-2.5 text-sm mt-6">Edit this example</button>
              {i === 0 && <InContentAd />}
            </div>
            <div className="aspect-[3/4] overflow-hidden relative bg-slate-100 rounded-xl border border-slate-200">
              <div className="absolute left-1/2 top-3 pointer-events-none" style={{ width: '210mm', transform: 'translateX(-50%) scale(0.45)', transformOrigin: 'top center' }}>
                <CVPreview cvData={ex.cv} />
              </div>
            </div>
          </section>
        ))}
        <p className="text-sm text-slate-500">Names and companies in these examples are fictional. For more advice see <a {...linkProps('/guides/how-to-write-work-experience')} className="text-blue-600 hover:underline">how to write work experience</a> and <a {...linkProps('/guides/professional-cv-summary')} className="text-blue-600 hover:underline">12 CV summary examples</a>.</p>
        <CTA onStart={onStart} text="Start from a blank CV or adapt one of these examples." />
      </div>
    </Shell>
  )
}

export function NotFound({ onStart }: { onStart: StartFn }) {
  return (
    <Shell onStart={onStart} active="">
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-800 text-slate-900">Page not found</h1>
        <p className="text-slate-500 mt-3">The page you are looking for does not exist or has moved.</p>
        <div className="flex justify-center gap-3 mt-6">
          <a {...linkProps('/')} className="btn-primary px-5 py-2.5 text-sm">Go home</a>
          <a {...linkProps('/guides')} className="px-5 py-2.5 text-sm font-600 border border-slate-200 rounded-lg text-slate-700">Read guides</a>
        </div>
      </div>
    </Shell>
  )
}
