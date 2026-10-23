import { useEffect } from 'react'
import { linkProps } from '../lib/router'

export type LegalDoc = 'privacy' | 'terms' | 'about' | 'contact' | 'disclaimer' | 'cookies'

export const CONTACT = {
  email: 'chanukanirmal899@gmail.com',
  whatsappDisplay: '+94 78 738 6366',
  whatsappLink: 'https://wa.me/94787386366',
  location: 'Ruwanwella, Kegalle, Sri Lanka',
  linkedin: 'https://www.linkedin.com/in/chanuka-senevirathna-ba50a9266/',
  github: 'https://github.com/ChanukaNirmal',
}

const content: Record<LegalDoc, { title: string; sections: [string, string][] }> = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['Your CV data stays on your device', 'CVcraft is a browser-based builder. Everything you enter — including your photo — is saved only in your browser\'s local storage so your work survives a reload. We do not upload your CV content to our servers.'],
      ['PDF generation', 'PDFs are created entirely in your browser. The file is downloaded straight to your device and is never sent to us.'],
      ['AI Summary', 'The AI Summary generator uses the details you have already entered (such as job title and skills) to draft text locally within the app.'],
      ['Advertising & cookies', 'We display ads through Google AdSense to keep CVcraft free. Google and its partners may use cookies to serve ads based on your visits to this and other websites. You can opt out of personalised advertising at adssettings.google.com.'],
      ['Analytics', 'We may collect anonymous, aggregated usage statistics (e.g. page views) to improve the product. This never includes your CV content.'],
      ['Deleting your data', 'Clear your browser\'s site data for CVcraft at any time to permanently remove your saved CV.'],
      ['Third-party vendors', 'Third-party vendors, including Google, use cookies to serve ads based on a user\'s prior visits to this website or other websites. Google\'s use of advertising cookies enables it and its partners to serve ads to you based on your visit to CVcraft and/or other sites on the Internet. You may opt out of personalised advertising by visiting Google Ads Settings (adssettings.google.com) or www.aboutads.info.'],
      ['How Google uses data', 'For details on how Google uses information from sites that use its services, see policies.google.com/technologies/partner-sites.'],
      ['Children\'s privacy', 'CVcraft is not directed at children under 13 and we do not knowingly collect personal information from children.'],
      ['Your rights (GDPR / CCPA)', 'Because your CV data is stored only on your device, you remain in full control of it. You may request information about any data we hold, or ask for its deletion, by contacting us.'],
      ['Contact', 'Questions about privacy? Email chanukanirmal899@gmail.com or WhatsApp +94 78 738 6366.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      ['Acceptance', 'By using CVcraft you agree to these terms. If you do not agree, please do not use the service.'],
      ['Free service', 'CVcraft is provided free of charge and supported by advertising. Features may change or be discontinued at any time.'],
      ['Your content', 'You own everything you create. You are responsible for ensuring the information in your CV is accurate and that you have the right to use any photo you upload.'],
      ['Acceptable use', 'Do not use CVcraft to create false, misleading, or unlawful documents, or attempt to disrupt, reverse-engineer, or misuse the service or its ads.'],
      ['No guarantee of results', 'Templates are designed to be ATS-friendly, but we cannot guarantee that any CV will pass a specific applicant tracking system or result in an interview or job offer.'],
      ['Disclaimer & liability', 'The service is provided "as is" without warranties. To the fullest extent permitted by law, CVcraft is not liable for any loss of data or indirect damages arising from its use. Keep a copy of your downloaded PDF.'],
      ['Changes', 'We may update these terms occasionally. Continued use after changes means you accept the revised terms.'],
      ['Governing law', 'These terms are governed by the laws of Sri Lanka.'],
      ['Contact', 'Questions? Email chanukanirmal899@gmail.com.'],
    ],
  },
  about: {
    title: 'About Us',
    sections: [
      ['Who we are', 'CVcraft is a free, browser-based CV and resume builder created by Chanuka Senevirathna, a developer based in Ruwanwella, Kegalle, Sri Lanka.'],
      ['Our mission', 'We believe everyone deserves a professional, ATS-friendly CV — without paywalls, sign-ups, or hidden fees. CVcraft helps job seekers create polished resumes in minutes.'],
      ['What we offer', 'Six professionally designed templates, a live preview editor, an AI summary helper, accent colour customisation, autosave, and instant PDF download — all running privately in your browser.'],
      ['How we stay free', 'CVcraft is supported by non-intrusive advertising through Google AdSense. Ads never appear on your downloaded CV.'],
    ],
  },
  contact: {
    title: 'Contact Us',
    sections: [
      ['Get in touch', 'We would love to hear your feedback, questions, or partnership enquiries. We usually reply within 24–48 hours.'],
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    sections: [
      ['General information', 'The content, templates, and tips on CVcraft are provided for general informational purposes only. While we strive for accuracy, we make no guarantees about completeness or suitability.'],
      ['No professional advice', 'Career guidance and ATS tips on this site do not constitute professional career, legal, or recruitment advice.'],
      ['AI-generated content', 'AI-suggested summaries are drafts. Please review and edit them to ensure they accurately represent you.'],
      ['Advertising', 'This site displays third-party advertisements. We are not responsible for the content of advertisers\' websites or products.'],
      ['External links', 'Links to external websites are provided for convenience. We have no control over and accept no responsibility for their content.'],
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    sections: [
      ['What are cookies?', 'Cookies are small text files stored on your device by websites you visit. Similar technologies include local storage.'],
      ['Essential storage', 'We use your browser\'s local storage to autosave your CV and remember your cookie preference. This is required for the app to work.'],
      ['Advertising cookies', 'Google AdSense and its partners may set cookies (such as the DoubleClick cookie) to show relevant ads and measure their performance.'],
      ['Managing cookies', 'You can accept or decline non-essential cookies using our consent banner, change your browser settings to block cookies, or opt out of personalised ads at adssettings.google.com.'],
    ],
  },
}

export const LEGAL_PATHS: Record<LegalDoc, string> = {
  about: '/about', contact: '/contact', privacy: '/privacy-policy', terms: '/terms', cookies: '/cookie-policy', disclaimer: '/disclaimer',
}

export function docFromPath(path: string): LegalDoc | null {
  const clean = path.replace(/\/+$/, '') || '/'
  return (Object.keys(LEGAL_PATHS) as LegalDoc[]).find(k => LEGAL_PATHS[k] === clean) ?? null
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const { title, sections } = content[doc]

  useEffect(() => {
    document.title = `${title} — CVcraft`
    window.scrollTo(0, 0)
    const canon = document.querySelector('link[rel=canonical]')
    canon?.setAttribute('href', `https://www.cvcraft.tech${LEGAL_PATHS[doc]}`)
    return () => { document.title = 'CVcraft — Professional CV Builder'; canon?.setAttribute('href', 'https://www.cvcraft.tech/') }
  }, [title, doc])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a {...linkProps('/')} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#2563EB' }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="8" rx="1" fill="white"/>
                <rect x="10" y="2" width="6" height="4" rx="1" fill="white" fillOpacity="0.6"/>
              </svg>
            </div>
            <span className="font-800 text-slate-900">CVcraft</span>
          </a>
          <a {...linkProps('/')} className="text-sm font-600 text-slate-600 hover:text-slate-900">← Back to home</a>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-800 text-slate-900 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-400 mt-2">Last updated: January 2026</p>
        <article className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-7">
          {sections.map(([h, p], i) => (
            <section key={h}>
              <h2 className="font-700 text-slate-900 text-lg mb-2">{sections.length > 1 ? `${i + 1}. ` : ''}{h}</h2>
              <p className="text-slate-600 leading-relaxed">{p}</p>
            </section>
          ))}
          {doc === 'contact' && <ContactList />}
        </article>
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <p className="text-xs text-slate-400">© 2026 CVcraft. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {(Object.keys(LEGAL_PATHS) as LegalDoc[]).map(k => (
              <a key={k} {...linkProps(LEGAL_PATHS[k])} className={k === doc ? 'text-blue-600 font-600' : 'hover:text-slate-900'}>{content[k].title}</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

export function ContactList() {
  const items: [string, string, string | null][] = [
    ['Email', CONTACT.email, `mailto:${CONTACT.email}`],
    ['WhatsApp', CONTACT.whatsappDisplay, CONTACT.whatsappLink],
    ['Location', CONTACT.location, null],
    ['LinkedIn', 'Chanuka Senevirathna', CONTACT.linkedin],
    ['GitHub', 'ChanukaNirmal', CONTACT.github],
  ]
  return (
    <dl className="grid sm:grid-cols-2 gap-3">
      {items.map(([k, v, href]) => (
        <div key={k} className="rounded-xl border border-slate-200 p-4">
          <dt className="text-xs font-600 uppercase tracking-wide text-slate-400">{k}</dt>
          <dd className="text-sm font-600 text-slate-800 mt-1 break-words">
            {href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-blue-600 hover:underline">{v}</a> : v}
          </dd>
        </div>
      ))}
    </dl>
  )
}
