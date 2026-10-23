import { useState } from 'react'

const KEY = 'cvcraft-cookie-consent'

// Cookie consent banner (AdSense / GDPR අවශ්‍යතාවය)
export default function CookieConsent({ onLearnMore }: { onLearnMore?: () => void }) {
  const [show, setShow] = useState(() => { try { return !localStorage.getItem(KEY) } catch { return false } })
  if (!show) return null
  const choose = (v: 'accepted' | 'declined') => { try { localStorage.setItem(KEY, v) } catch {} setShow(false) }
  return (
    <div role="region" aria-label="Cookie consent" className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-4 sm:max-w-sm z-[90] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 fade-in">
      <p className="text-sm font-700 text-slate-900 mb-1">We value your privacy</p>
      <p className="text-xs text-slate-500 leading-relaxed">We use cookies, including Google AdSense advertising cookies, to keep CVcraft free and to show relevant ads.{' '}
        {onLearnMore && <button onClick={onLearnMore} className="text-blue-600 hover:underline">Learn more</button>}
      </p>
      <div className="flex gap-2 mt-4">
        <button onClick={() => choose('declined')} className="flex-1 px-3 py-2 text-sm font-600 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">Decline</button>
        <button onClick={() => choose('accepted')} className="flex-1 btn-primary px-3 py-2 text-sm">Accept</button>
      </div>
    </div>
  )
}
