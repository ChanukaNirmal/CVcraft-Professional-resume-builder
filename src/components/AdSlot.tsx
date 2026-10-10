import { useEffect, useRef } from 'react'

/* ============================================================================
 * 🟡 GOOGLE ADSENSE සැකසුම් (Configuration)
 * ----------------------------------------------------------------------------
 * 1. ඔබගේ AdSense ගිණුමෙන් ලැබෙන Publisher ID එක (ca-pub-XXXXXXXXXXXXXXXX)
 *    පහත ADSENSE_CLIENT අගයට ඇතුළත් කරන්න.
 * 2. AdSense → Ads → By ad unit → "Display ads" මගින් ad unit එකක් සාදා,
 *    ලැබෙන data-ad-slot අංකය පහත AD_SLOTS වස්තුවේ අදාළ ස්ථානයට දමන්න.
 * 3. index.html ගොනුවේ <head> කොටසේ ඇති AdSense script එක uncomment කරන්න.
 * 4. ADSENSE_CLIENT හිස්ව තිබෙන තාක් කල් (development), සැබෑ දැන්වීම් වෙනුවට
 *    placeholder කොටුවක් පමණක් පෙන්වයි.
 * ========================================================================== */
export const ADSENSE_CLIENT = '' // උදා: 'ca-pub-1234567890123456'

// 🟡 එක් එක් දැන්වීම් ස්ථානය සඳහා ad slot ID (AdSense dashboard එකෙන් ලබාගන්න)
export const AD_SLOTS = {
  leaderboard: '0000000001', // 728×90 — Landing / Download පිටු වල ඉහළ/පහළ තීරුව
  mobileBanner: '0000000002', // 320×50 — ජංගම දුරකථන සඳහා කුඩා බැනරය
  rectangle: '0000000003', // 300×250 — Builder form එක යට / Download පැති තීරුව
  interstitial: '0000000004', // 300×250 — Download කිරීමට පෙර පෙන්වන modal දැන්වීම
}

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

interface Props {
  slot: keyof typeof AD_SLOTS
  width: number
  height: number
  label?: string
  className?: string
}

/* ============================================================================
 * 🟡 GOOGLE ADSENSE දැන්වීම් කොටස (Ad Unit Component)
 * ----------------------------------------------------------------------------
 * මෙම component එක යෙදූ සෑම තැනකම Google AdSense දැන්වීමක් පෙන්වයි.
 * - <ins className="adsbygoogle"> ටැගය AdSense විසින් දැන්වීමෙන් පුරවනු ලැබේ.
 * - useEffect තුළ ඇති adsbygoogle.push({}) මගින් දැන්වීම load කරයි.
 * - AdSense ප්‍රතිපත්ති අනුව: බොත්තම් අසලම (accidental clicks) නොතැබිය යුතුය,
 *   "Advertisement" ලේබලය පැහැදිලිව පෙන්විය යුතුය.
 * ========================================================================== */
export default function AdSlot({ slot, width, height, label, className = '' }: Props) {
  const pushed = useRef(false)

  useEffect(() => {
    // 🟡 AdSense දැන්වීම load කරන කොටස — client ID ඇත්නම් පමණක් ක්‍රියාත්මක වේ
    if (!ADSENSE_CLIENT || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      /* AdSense script එක තවම load වී නැත්නම් නිහඬව මඟහරියි */
    }
  }, [])

  // 🟡 සැබෑ AdSense දැන්වීම (Production)
  if (ADSENSE_CLIENT) {
    return (
      <div className={className}><div className="mx-auto" style={{ width: '100%', maxWidth: width }}>
        <p className="text-[9px] tracking-[0.08em] uppercase text-slate-400 mb-1">Advertisement</p>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={AD_SLOTS[slot]}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div></div>
    )
  }

  // 🟡 Placeholder — AdSense සක්‍රීය කිරීමට පෙර (Development) පෙන්වන කොටුව
  return (
    <div className={className}>
      <div className="ad-slot mx-auto" style={{ width: '100%', maxWidth: width, height }}>
        <div className="flex flex-col items-center gap-1 text-center px-2">
          <span>{label ?? `${width} × ${height}`}</span>
          <span className="text-slate-300 text-[10px]">Google AdSense</span>
        </div>
      </div>
    </div>
  )
}
