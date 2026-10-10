import type { CSSProperties, ReactNode } from 'react'
import type { CVData } from '../types'

interface Props {
  cvData: CVData
  scale?: number
  id?: string
}

export const TEMPLATES = [
  { id: 'modern', name: 'Modern', tag: 'ATS-friendly' },
  { id: 'sidebar', name: 'Horizon', tag: 'Two-column' },
  { id: 'executive', name: 'Executive', tag: 'Serif · Classic' },
  { id: 'minimal', name: 'Nordic', tag: 'Minimal' },
  { id: 'creative', name: 'Studio', tag: 'Bold header' },
  { id: 'timeline', name: 'Timeline', tag: 'Chronological' },
] as const

export function formatDate(d: string) {
  if (!d) return ''
  const [y, m] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return m ? `${months[parseInt(m) - 1]} ${y}` : y
}

function range(start: string, end: string, current?: boolean) {
  const s = formatDate(start)
  const e = current ? 'Present' : formatDate(end)
  return s || e ? `${s}${s && e ? ' – ' : ''}${e}` : ''
}

// Hex → rgba helper so tints follow the chosen accent colour
function tint(hex: string, a: number) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

const page: CSSProperties = {
  background: 'white',
  width: '210mm',
  minHeight: '297mm',
  fontSize: '9pt',
  lineHeight: 1.5,
  color: '#1E293B',
  boxSizing: 'border-box',
}

export default function CVPreview({ cvData, scale = 1, id }: Props) {
  const t = cvData.selectedTemplate
  const Tpl =
    t === 'sidebar' ? Sidebar :
    t === 'executive' ? Executive :
    t === 'minimal' ? Minimal :
    t === 'creative' ? Creative :
    t === 'timeline' ? Timeline : Modern
  return (
    <div id={id} className="cv-preview shadow-2xl" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      <Tpl d={cvData} />
    </div>
  )
}

/* ───────────── Shared blocks ───────────── */

function Contacts({ d, color = '#475569', gap = 12, column = false }: { d: CVData; color?: string; gap?: number; column?: boolean }) {
  const pd = d.personalDetails
  const items = [pd.email, pd.phone, pd.location, pd.linkedin, pd.website].filter(Boolean)
  return (
    <div style={{ display: 'flex', flexDirection: column ? 'column' : 'row', flexWrap: 'wrap', gap: column ? 4 : gap, fontSize: '8pt', color }}>
      {items.map(i => <span key={i} style={{ wordBreak: 'break-word' }}>{i}</span>)}
    </div>
  )
}

function Avatar({ d, size, color, radius = '50%' }: { d: CVData; size: number; color: string; radius?: string }) {
  const pd = d.personalDetails
  if (pd.photo) return <img src={pd.photo} alt="Profile" style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover', flexShrink: 0 }} />
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: size * 0.34, flexShrink: 0 }}>
      {pd.firstName?.[0]}{pd.lastName?.[0]}
    </div>
  )
}

function Experiences({ d, accent, dateBelow = false }: { d: CVData; accent: string; dateBelow?: boolean }) {
  return <>{d.experience.map(exp => (
    <div key={exp.id} style={{ marginBottom: 10, breakInside: 'avoid' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexDirection: dateBelow ? 'column' : 'row' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '10pt', color: '#0F172A' }}>{exp.title}</div>
          <div style={{ color: accent, fontWeight: 600, fontSize: '8.5pt' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
        </div>
        <div style={{ fontSize: '8pt', color: '#64748B', whiteSpace: 'nowrap' }}>{range(exp.startDate, exp.endDate, exp.current)}</div>
      </div>
      {exp.description && <div style={{ fontSize: '8.5pt', color: '#334155', marginTop: 4, whiteSpace: 'pre-line' }}>{exp.description}</div>}
    </div>
  ))}</>
}

function Educations({ d, accent }: { d: CVData; accent: string }) {
  return <>{d.education.map(edu => (
    <div key={edu.id} style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '10pt', color: '#0F172A' }}>{edu.degree}</div>
          <div style={{ color: accent, fontWeight: 600, fontSize: '8.5pt' }}>{edu.institution}</div>
        </div>
        <div style={{ fontSize: '8pt', color: '#64748B', whiteSpace: 'nowrap' }}>{range(edu.startDate, edu.endDate)}</div>
      </div>
      {edu.gpa && <div style={{ fontSize: '8pt', color: '#64748B', marginTop: 2 }}>GPA: {edu.gpa}</div>}
      {edu.description && <div style={{ fontSize: '8.5pt', color: '#334155', marginTop: 2 }}>{edu.description}</div>}
    </div>
  ))}</>
}

function Projects({ d }: { d: CVData }) {
  return <>{d.projects.map(p => (
    <div key={p.id} style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#0F172A' }}>{p.name}</span>
        {p.link && <span style={{ fontSize: '7.5pt', color: '#64748B' }}>{p.link}</span>}
      </div>
      {p.description && <div style={{ fontSize: '8.5pt', color: '#334155', marginTop: 2 }}>{p.description}</div>}
    </div>
  ))}</>
}

function Certs({ d, sub = '#64748B', main = '#0F172A' }: { d: CVData; sub?: string; main?: string }) {
  return <>{d.certifications.map(c => (
    <div key={c.id} style={{ marginBottom: 5 }}>
      <div style={{ fontWeight: 600, fontSize: '8.5pt', color: main }}>{c.name}</div>
      <div style={{ fontSize: '8pt', color: sub }}>{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
    </div>
  ))}</>
}

function Langs({ d, sub = '#64748B', main = '#0F172A' }: { d: CVData; sub?: string; main?: string }) {
  return <>{d.languages.map(l => (
    <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt', marginBottom: 3 }}>
      <span style={{ fontWeight: 600, color: main }}>{l.language}</span>
      <span style={{ color: sub }}>{l.proficiency}</span>
    </div>
  ))}</>
}

function Pills({ d, bg, fg, border }: { d: CVData; bg: string; fg: string; border: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {d.skills.map(s => (
        <span key={s} style={{ background: bg, color: fg, border: `1px solid ${border}`, borderRadius: 99, padding: '2px 10px', fontSize: '8pt', fontWeight: 600 }}>{s}</span>
      ))}
    </div>
  )
}

function RuleHeading({ title, color, children }: { title: string; color: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <h2 style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color, margin: 0 }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
      </div>
      {children}
    </div>
  )
}

/* ───────────── 1. Modern (original) ───────────── */

function Modern({ d }: { d: CVData }) {
  const a = d.accentColor, pd = d.personalDetails
  return (
    <div style={{ ...page, padding: '14mm 16mm' }}>
      <div style={{ borderBottom: `3px solid ${a}`, paddingBottom: 8, marginBottom: 12, display: 'flex', gap: 14 }}>
        <Avatar d={d} size={54} color={a} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '18pt', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>{pd.firstName} {pd.lastName}</h1>
          <p style={{ fontSize: '11pt', color: a, fontWeight: 600, margin: '2px 0 6px' }}>{pd.title}</p>
          <Contacts d={d} />
        </div>
      </div>
      {d.summary && <RuleHeading title="Professional Summary" color={a}><p style={{ color: '#334155', lineHeight: 1.6, margin: 0 }}>{d.summary}</p></RuleHeading>}
      {d.experience.length > 0 && <RuleHeading title="Work Experience" color={a}><Experiences d={d} accent={a} /></RuleHeading>}
      {d.education.length > 0 && <RuleHeading title="Education" color={a}><Educations d={d} accent={a} /></RuleHeading>}
      {d.skills.length > 0 && <RuleHeading title="Skills" color={a}><Pills d={d} bg={tint(a, 0.08)} fg={a} border={tint(a, 0.3)} /></RuleHeading>}
      {d.projects.length > 0 && <RuleHeading title="Projects" color={a}><Projects d={d} /></RuleHeading>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {d.certifications.length > 0 && <RuleHeading title="Certifications" color={a}><Certs d={d} /></RuleHeading>}
        {d.languages.length > 0 && <RuleHeading title="Languages" color={a}><Langs d={d} /></RuleHeading>}
      </div>
    </div>
  )
}

/* ───────────── 2. Horizon — dark sidebar ───────────── */

function Sidebar({ d }: { d: CVData }) {
  const a = d.accentColor, pd = d.personalDetails
  const SideH = ({ children }: { children: ReactNode }) => (
    <h3 style={{ fontSize: '7.5pt', letterSpacing: '0.16em', textTransform: 'uppercase', color: tint('#FFFFFF', 0.55), margin: '18px 0 8px', fontWeight: 700 }}>{children}</h3>
  )
  const MainH = ({ children }: { children: ReactNode }) => (
    <h2 style={{ fontSize: '11pt', fontWeight: 800, color: '#0F172A', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 14, height: 3, background: a, borderRadius: 2 }} />{children}
    </h2>
  )
  return (
    <div style={{ ...page, display: 'grid', gridTemplateColumns: '72mm 1fr' }}>
      <aside style={{ background: '#0F172A', color: 'white', padding: '14mm 8mm' }}>
        <Avatar d={d} size={96} color={a} radius="16px" />
        <SideH>Contact</SideH>
        <Contacts d={d} color={tint('#FFFFFF', 0.85)} column />
        {d.skills.length > 0 && <>
          <SideH>Skills</SideH>
          {d.skills.map((s, i) => (
            <div key={s} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: '8pt', marginBottom: 2 }}>{s}</div>
              <div style={{ height: 3, background: tint('#FFFFFF', 0.12), borderRadius: 2 }}>
                <div style={{ height: 3, width: `${92 - (i % 4) * 12}%`, background: a, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </>}
        {d.languages.length > 0 && <><SideH>Languages</SideH><Langs d={d} main="#FFFFFF" sub={tint('#FFFFFF', 0.6)} /></>}
        {d.certifications.length > 0 && <><SideH>Certifications</SideH><Certs d={d} main="#FFFFFF" sub={tint('#FFFFFF', 0.6)} /></>}
      </aside>
      <main style={{ padding: '14mm 10mm' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 800, lineHeight: 1.05, margin: 0, color: '#0F172A', letterSpacing: '-0.5px' }}>
          {pd.firstName}<br /><span style={{ color: a }}>{pd.lastName}</span>
        </h1>
        <p style={{ fontSize: '10.5pt', fontWeight: 600, color: '#475569', margin: '6px 0 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{pd.title}</p>
        {d.summary && <div style={{ marginBottom: 16 }}><MainH>Profile</MainH><p style={{ margin: 0, color: '#334155' }}>{d.summary}</p></div>}
        {d.experience.length > 0 && <div style={{ marginBottom: 12 }}><MainH>Experience</MainH><Experiences d={d} accent={a} /></div>}
        {d.education.length > 0 && <div style={{ marginBottom: 12 }}><MainH>Education</MainH><Educations d={d} accent={a} /></div>}
        {d.projects.length > 0 && <div><MainH>Projects</MainH><Projects d={d} /></div>}
      </main>
    </div>
  )
}

/* ───────────── 3. Executive — serif, centred ───────────── */

function Executive({ d }: { d: CVData }) {
  const a = d.accentColor, pd = d.personalDetails
  const serif = "'Fraunces', Georgia, serif"
  const H = ({ children }: { children: ReactNode }) => (
    <h2 style={{ fontFamily: serif, fontSize: '11pt', fontWeight: 600, color: a, margin: '0 0 6px', paddingBottom: 3, borderBottom: '0.75px solid #CBD5E1', letterSpacing: '0.06em', fontVariant: 'small-caps' }}>{children}</h2>
  )
  return (
    <div style={{ ...page, padding: '16mm 20mm' }}>
      <header style={{ textAlign: 'center', marginBottom: 14 }}>
        <h1 style={{ fontFamily: serif, fontSize: '26pt', fontWeight: 500, margin: 0, color: '#0F172A', letterSpacing: '0.02em' }}>{pd.firstName} {pd.lastName}</h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '11pt', color: '#475569', margin: '2px 0 8px' }}>{pd.title}</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Contacts d={d} gap={14} /></div>
        <div style={{ margin: '12px auto 0', width: 60, height: 2, background: a }} />
      </header>
      {d.summary && <section style={{ marginBottom: 12 }}><H>Summary</H><p style={{ margin: 0, color: '#334155', textAlign: 'justify' }}>{d.summary}</p></section>}
      {d.experience.length > 0 && <section style={{ marginBottom: 12 }}><H>Professional Experience</H><Experiences d={d} accent="#475569" /></section>}
      {d.education.length > 0 && <section style={{ marginBottom: 12 }}><H>Education</H><Educations d={d} accent="#475569" /></section>}
      {d.skills.length > 0 && <section style={{ marginBottom: 12 }}><H>Core Competencies</H>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px 12px' }}>
          {d.skills.map(s => <span key={s} style={{ fontSize: '8.5pt' }}><span style={{ color: a }}>▪</span> {s}</span>)}
        </div>
      </section>}
      {d.projects.length > 0 && <section style={{ marginBottom: 12 }}><H>Selected Projects</H><Projects d={d} /></section>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {d.certifications.length > 0 && <section><H>Certifications</H><Certs d={d} /></section>}
        {d.languages.length > 0 && <section><H>Languages</H><Langs d={d} /></section>}
      </div>
    </div>
  )
}

/* ───────────── 4. Nordic — minimal, left label column ───────────── */

function Minimal({ d }: { d: CVData }) {
  const a = d.accentColor, pd = d.personalDetails
  const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '34mm 1fr', gap: 12, padding: '10px 0', borderTop: '1px solid #EEF2F6' }}>
      <div style={{ fontSize: '7.5pt', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', paddingTop: 2 }}>{label}</div>
      <div>{children}</div>
    </div>
  )
  return (
    <div style={{ ...page, padding: '18mm 18mm' }}>
      <header style={{ marginBottom: 18 }}>
        <div style={{ width: 8, height: 8, borderRadius: 99, background: a, marginBottom: 12 }} />
        <h1 style={{ fontSize: '22pt', fontWeight: 300, margin: 0, color: '#0F172A', letterSpacing: '-0.5px' }}>
          {pd.firstName} <strong style={{ fontWeight: 800 }}>{pd.lastName}</strong>
        </h1>
        <p style={{ fontSize: '10pt', color: '#64748B', margin: '4px 0 10px' }}>{pd.title}</p>
        <Contacts d={d} color="#64748B" gap={16} />
      </header>
      {d.summary && <Row label="About"><p style={{ margin: 0, color: '#334155' }}>{d.summary}</p></Row>}
      {d.experience.length > 0 && <Row label="Experience"><Experiences d={d} accent={a} /></Row>}
      {d.education.length > 0 && <Row label="Education"><Educations d={d} accent={a} /></Row>}
      {d.skills.length > 0 && <Row label="Skills"><p style={{ margin: 0, color: '#334155' }}>{d.skills.join('  ·  ')}</p></Row>}
      {d.projects.length > 0 && <Row label="Projects"><Projects d={d} /></Row>}
      {d.certifications.length > 0 && <Row label="Certificates"><Certs d={d} /></Row>}
      {d.languages.length > 0 && <Row label="Languages"><div style={{ maxWidth: 220 }}><Langs d={d} /></div></Row>}
    </div>
  )
}

/* ───────────── 5. Studio — colour-block header ───────────── */

function Creative({ d }: { d: CVData }) {
  const a = d.accentColor, pd = d.personalDetails
  const H = ({ children }: { children: ReactNode }) => (
    <h2 style={{ display: 'inline-block', fontSize: '8.5pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, background: tint(a, 0.1), padding: '3px 10px', borderRadius: 6, margin: '0 0 8px' }}>{children}</h2>
  )
  return (
    <div style={page}>
      <header style={{ background: a, color: 'white', padding: '12mm 16mm 10mm', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: tint('#FFFFFF', 0.1) }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 120, height: 120, borderRadius: '50%', background: tint('#FFFFFF', 0.08) }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <div style={{ border: '3px solid white', borderRadius: '50%' }}><Avatar d={d} size={72} color={tint('#000000', 0.2)} /></div>
          <div>
            <h1 style={{ fontSize: '22pt', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{pd.firstName} {pd.lastName}</h1>
            <p style={{ fontSize: '11pt', margin: '2px 0 0', opacity: 0.9, fontWeight: 500 }}>{pd.title}</p>
          </div>
        </div>
        <div style={{ marginTop: 12, position: 'relative' }}><Contacts d={d} color={tint('#FFFFFF', 0.92)} gap={14} /></div>
      </header>
      <div style={{ padding: '10mm 16mm', display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
        <div>
          {d.summary && <section style={{ marginBottom: 14 }}><H>About me</H><p style={{ margin: 0, color: '#334155' }}>{d.summary}</p></section>}
          {d.experience.length > 0 && <section style={{ marginBottom: 14 }}><H>Experience</H><Experiences d={d} accent={a} dateBelow /></section>}
          {d.projects.length > 0 && <section><H>Projects</H><Projects d={d} /></section>}
        </div>
        <div>
          {d.skills.length > 0 && <section style={{ marginBottom: 14 }}><H>Skills</H><Pills d={d} bg="#F8FAFC" fg="#0F172A" border="#E2E8F0" /></section>}
          {d.education.length > 0 && <section style={{ marginBottom: 14 }}><H>Education</H><Educations d={d} accent={a} /></section>}
          {d.certifications.length > 0 && <section style={{ marginBottom: 14 }}><H>Certificates</H><Certs d={d} /></section>}
          {d.languages.length > 0 && <section><H>Languages</H><Langs d={d} /></section>}
        </div>
      </div>
    </div>
  )
}

/* ───────────── 6. Timeline — vertical rail ───────────── */

function Timeline({ d }: { d: CVData }) {
  const a = d.accentColor, pd = d.personalDetails
  const H = ({ children }: { children: ReactNode }) => (
    <h2 style={{ fontSize: '10pt', fontWeight: 800, color: '#0F172A', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{children}</h2>
  )
  const Rail = ({ items }: { items: { id: string; date: string; title: string; sub: string; body?: string }[] }) => (
    <div style={{ borderLeft: `2px solid ${tint(a, 0.25)}`, marginLeft: 5, paddingLeft: 16 }}>
      {items.map(it => (
        <div key={it.id} style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: -23, top: 3, width: 10, height: 10, borderRadius: 99, background: 'white', border: `2.5px solid ${a}` }} />
          <div style={{ fontSize: '7.5pt', fontWeight: 700, color: a, letterSpacing: '0.04em' }}>{it.date}</div>
          <div style={{ fontWeight: 700, fontSize: '10pt', color: '#0F172A' }}>{it.title}</div>
          <div style={{ fontSize: '8.5pt', color: '#64748B', fontWeight: 600 }}>{it.sub}</div>
          {it.body && <div style={{ fontSize: '8.5pt', color: '#334155', marginTop: 3, whiteSpace: 'pre-line' }}>{it.body}</div>}
        </div>
      ))}
    </div>
  )
  return (
    <div style={{ ...page, padding: '14mm 16mm' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>
        <div>
          <p style={{ fontSize: '9pt', fontWeight: 700, color: a, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{pd.title}</p>
          <h1 style={{ fontSize: '24pt', fontWeight: 800, margin: '2px 0 0', color: '#0F172A', letterSpacing: '-0.6px' }}>{pd.firstName} {pd.lastName}</h1>
        </div>
        <div style={{ textAlign: 'right' }}><Contacts d={d} column /></div>
      </header>
      {d.summary && <p style={{ margin: '0 0 16px', color: '#334155', fontSize: '9.5pt', borderLeft: `3px solid ${a}`, paddingLeft: 10 }}>{d.summary}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        <div>
          {d.experience.length > 0 && <><H>Experience</H><Rail items={d.experience.map(e => ({ id: e.id, date: range(e.startDate, e.endDate, e.current), title: e.title, sub: [e.company, e.location].filter(Boolean).join(' · '), body: e.description }))} /></>}
          {d.education.length > 0 && <><H>Education</H><Rail items={d.education.map(e => ({ id: e.id, date: range(e.startDate, e.endDate), title: e.degree, sub: e.institution + (e.gpa ? ` · GPA ${e.gpa}` : ''), body: e.description }))} /></>}
        </div>
        <div>
          {d.skills.length > 0 && <div style={{ marginBottom: 14 }}><H>Skills</H><Pills d={d} bg={tint(a, 0.08)} fg={a} border={tint(a, 0.25)} /></div>}
          {d.projects.length > 0 && <div style={{ marginBottom: 14 }}><H>Projects</H><Projects d={d} /></div>}
          {d.certifications.length > 0 && <div style={{ marginBottom: 14 }}><H>Certifications</H><Certs d={d} /></div>}
          {d.languages.length > 0 && <div><H>Languages</H><Langs d={d} /></div>}
        </div>
      </div>
    </div>
  )
}
