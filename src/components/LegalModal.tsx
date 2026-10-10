import { useEffect } from 'react'

export type LegalDoc = 'privacy' | 'terms'

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
      ['Contact', 'Questions about privacy? Email privacy@cvcraft.app.'],
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
      ['Contact', 'Questions? Email support@cvcraft.app.'],
    ],
  },
}

export default function LegalModal({ doc, onClose }: { doc: LegalDoc; onClose: () => void }) {
  const { title, sections } = content[doc]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 fade-in" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="legal-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 id="legal-title" className="text-lg font-800 text-slate-900">{title}</h2>
            <p className="text-xs text-slate-400">Last updated: January 2026</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {sections.map(([h, p], i) => (
            <section key={h}>
              <h3 className="font-700 text-slate-900 text-sm mb-1">{i + 1}. {h}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p}</p>
            </section>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="btn-primary px-5 py-2 text-sm">Got it</button>
        </div>
      </div>
    </div>
  )
}
