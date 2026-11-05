import type { ReactNode } from 'react'
import { useState } from 'react'
import { linkProps } from '../lib/router'
import { CONTACT, LEGAL_PATHS } from './LegalPage'

export const NAV = [
  ['CV Guides', '/guides'],
  ['Templates', '/templates'],
  ['CV Examples', '/cv-examples'],
  ['About', '/about'],
] as const

export function Logo({ size = 8 }: { size?: number }) {
  return (
    <a {...linkProps('/')} className="flex items-center gap-2" aria-label="CVcraft home">
      <div className={`rounded-lg flex items-center justify-center ${size === 8 ? 'w-8 h-8' : 'w-6 h-6'}`} style={{ background: '#2563EB' }}>
        <svg width={size === 8 ? 16 : 12} height={size === 8 ? 16 : 12} viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="6" height="8" rx="1" fill="white"/>
          <rect x="10" y="2" width="6" height="4" rx="1" fill="white" fillOpacity="0.6"/>
        </svg>
      </div>
      <span className="font-800 text-slate-900 text-lg">CVcraft</span>
    </a>
  )
}

export function SiteHeader({ onStart, active }: { onStart: () => void; active?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map(([label, path]) => (
            <a key={path} {...linkProps(path)} className={`text-sm font-medium transition-colors ${active === path ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onStart} className="btn-primary px-4 py-2 text-sm">Create My CV</button>
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-50" aria-label="Menu" onClick={() => setOpen(o => !o)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="17" y2="6"/><line x1="3" y1="12" x2="17" y2="12"/><line x1="3" y1="18" x2="17" y2="18"/></svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-slate-100 px-4 py-3">
          {NAV.map(([label, path]) => (
            <a key={path} {...linkProps(path)} onClick={e => { setOpen(false); linkProps(path).onClick(e) }} className="block py-2.5 text-sm font-medium text-slate-600">{label}</a>
          ))}
        </nav>
      )}
    </header>
  )
}

function Col({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-700 text-slate-900 mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-slate-500">{children}</ul>
    </div>
  )
}
const L = ({ to, children }: { to: string; children: ReactNode }) => <li><a {...linkProps(to)} className="hover:text-slate-900">{children}</a></li>

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo size={6} />
          <p className="text-sm text-slate-500 leading-relaxed mt-3 max-w-xs">A free, private CV builder with practical career guides for job seekers in Sri Lanka and around the world.</p>
          <div className="flex gap-2 mt-4">
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
            </a>
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>
            </a>
          </div>
        </div>
        <Col title="Resources">
          <L to="/guides">CV Writing Guides</L>
          <L to="/templates">CV Templates</L>
          <L to="/cv-examples">CV Examples</L>
          <L to="/guides/ats-friendly-resume">ATS Guide</L>
        </Col>
        <Col title="Company">
          <L to={LEGAL_PATHS.about}>About Us</L>
          <L to={LEGAL_PATHS.contact}>Contact Us</L>
          <L to={LEGAL_PATHS.privacy}>Privacy Policy</L>
          <L to={LEGAL_PATHS.terms}>Terms of Service</L>
          <L to={LEGAL_PATHS.cookies}>Cookie Policy</L>
          <L to={LEGAL_PATHS.disclaimer}>Disclaimer</L>
        </Col>
        <Col title="Contact">
          <li><a href={`mailto:${CONTACT.email}`} className="hover:text-slate-900 break-all">{CONTACT.email}</a></li>
          <li><a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">WhatsApp: {CONTACT.whatsappDisplay}</a></li>
          <li>{CONTACT.location}</li>
        </Col>
      </div>
      <div className="border-t border-slate-100">
        <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-400">© 2026 CVcraft. All rights reserved.</p>
      </div>
    </footer>
  )
}
