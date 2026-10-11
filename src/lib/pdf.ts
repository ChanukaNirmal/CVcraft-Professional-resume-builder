import { jsPDF } from 'jspdf'

/*
 * Why not html2canvas?
 * html2canvas re-implements text layout: it measures every word with the canvas
 * text API and paints words one by one at its own computed offsets. Canvas metrics
 * differ from CSS layout (kerning, letter-spacing, variable fonts, device pixel
 * ratio, OS text rasteriser), so words drift into each other or overlap in the PDF.
 *
 * Instead we let the browser itself lay the CV out: the element is serialised into
 * an SVG <foreignObject> together with the page CSS, the web fonts it uses
 * (inlined as data URLs) and its images. The browser renders that SVG with the very
 * same layout engine as the on-screen preview, so typography is pixel-identical.
 * A hidden text layer is then added so the PDF stays searchable / ATS-readable.
 */

const SCALE = 2.5 // raster density (~240 dpi on A4)
const PAGE_W = 210
const PAGE_H = 297

/** Renders the element (an unscaled A4 CV) to a multi-page A4 PDF and triggers download. */
export async function downloadElementAsPDF(el: HTMLElement, fileName: string) {
  const pdf = await buildPDF(el)
  pdf.save(fileName)
}

export async function buildPDF(el: HTMLElement) {
  await document.fonts?.ready
  const width = el.offsetWidth
  const height = el.scrollHeight

  let canvas: HTMLCanvasElement
  try {
    canvas = await renderWithBrowserLayout(el, width, height)
  } catch (err) {
    // e.g. older Safari taints canvases that draw <foreignObject>
    console.warn('[pdf] native renderer unavailable, falling back to html2canvas', err)
    canvas = await renderWithHtml2Canvas(el)
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
  const mmPerPx = PAGE_W / width
  const imgH = height * mmPerPx
  const img = canvas.toDataURL('image/jpeg', 0.95)
  const pages = Math.max(1, Math.ceil((imgH - 1) / PAGE_H))

  for (let p = 0; p < pages; p++) {
    if (p > 0) pdf.addPage()
    pdf.addImage(img, 'JPEG', 0, -p * PAGE_H, PAGE_W, imgH, 'cv', 'FAST')
  }
  addTextLayer(pdf, el, mmPerPx)
  return pdf
}

/* ------------------------------------------------------------------ */
/* Native (foreignObject) renderer                                     */
/* ------------------------------------------------------------------ */

async function renderWithBrowserLayout(el: HTMLElement, width: number, height: number) {
  const clone = el.cloneNode(true) as HTMLElement
  await inlineImages(el, clone)

  const [css, fontCss] = await Promise.all([collectPageCss(), collectFontCss(el)])

  // `html`/`body` selectors don't match inside foreignObject, so carry over the
  // inherited text styles the element receives from its ancestors.
  const inherited = getComputedStyle(el.parentElement ?? el)
  const wrapperStyle = [
    `width:${width}px`, `height:${height}px`, 'margin:0', 'padding:0', 'background:#fff',
    `font-family:${inherited.fontFamily}`, `font-size:${inherited.fontSize}`,
    `line-height:${inherited.lineHeight}`, `color:${inherited.color}`,
    `letter-spacing:${inherited.letterSpacing}`, `word-spacing:${inherited.wordSpacing}`,
    '-webkit-font-smoothing:antialiased', '-webkit-text-size-adjust:100%',
  ].join(';')

  const xhtml = new XMLSerializer().serializeToString(clone)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<foreignObject x="0" y="0" width="100%" height="100%">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" style="${escapeAttr(wrapperStyle)}">` +
    `<style>${escapeXmlText(fontCss + css)}</style>${xhtml}</div></foreignObject></svg>`

  const image = new Image()
  image.decoding = 'sync'
  // Must be a data: URL — Chrome taints canvases drawn from blob: SVGs with foreignObject.
  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  {
    await image.decode()
    // Give embedded fonts a frame to be applied inside the SVG document.
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * SCALE)
    canvas.height = Math.round(height * SCALE)
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    canvas.toDataURL('image/png', 0) // throws SecurityError if the browser tainted it
    return canvas
  }
}

/** All same-origin CSS rules (Tailwind, index.css, ...) except imports & font faces. */
let pageCssCache: string | null = null
function collectPageCss() {
  if (pageCssCache !== null && !import.meta.env.DEV) return pageCssCache
  const out: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try { rules = sheet.cssRules } catch { continue } // cross-origin
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSImportRule || rule instanceof CSSFontFaceRule) continue
      out.push(rule.cssText)
    }
  }
  return (pageCssCache = out.join('\n'))
}

/** @font-face rules for the families the CV actually uses, with font files inlined. */
const fontDataCache = new Map<string, Promise<string>>()
async function collectFontCss(el: HTMLElement) {
  const used = usedFamilies(el)
  const faces: { css: string; base: string }[] = []

  const visit = async (sheet: CSSStyleSheet, base: string) => {
    let rules: CSSRuleList
    try { rules = sheet.cssRules } catch {
      // Cross-origin sheet (e.g. Google Fonts): fetch its text, which is CORS-enabled.
      if (!sheet.href) return
      try { faces.push(...parseFontFaces(await fetchText(sheet.href), sheet.href)) } catch { /* offline */ }
      return
    }
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSFontFaceRule) faces.push({ css: rule.cssText, base: sheet.href || base })
      else if (rule instanceof CSSImportRule) {
        if (rule.styleSheet) await visit(rule.styleSheet, rule.href)
        else try { faces.push(...parseFontFaces(await fetchText(rule.href), rule.href)) } catch { /* offline */ }
      }
    }
  }
  for (const sheet of Array.from(document.styleSheets)) await visit(sheet, location.href)

  const relevant = faces.filter(f => {
    const fam = /font-family:\s*["']?([^;"']+)/i.exec(f.css)?.[1]?.trim().toLowerCase()
    return fam && used.has(fam)
  })
  const inlined = await Promise.all(relevant.map(f => inlineFontUrls(f.css, f.base)))
  return inlined.join('\n')
}

function usedFamilies(el: HTMLElement) {
  const set = new Set<string>()
  for (const node of [el, ...Array.from(el.querySelectorAll<HTMLElement>('*'))]) {
    for (const fam of getComputedStyle(node).fontFamily.split(',')) set.add(fam.trim().replace(/^["']|["']$/g, '').toLowerCase())
  }
  return set
}

function parseFontFaces(cssText: string, base: string) {
  return (cssText.match(/@font-face\s*{[^}]*}/g) ?? []).map(css => ({ css, base }))
}

async function inlineFontUrls(css: string, base: string) {
  const urls = Array.from(css.matchAll(/url\((['"]?)([^'")]+)\1\)/g))
  let result = css
  for (const [match, , raw] of urls) {
    if (raw.startsWith('data:')) continue
    const abs = new URL(raw, base).href
    if (!fontDataCache.has(abs)) fontDataCache.set(abs, fetchDataUrl(abs))
    try { result = result.replace(match, `url("${await fontDataCache.get(abs)}")`) } catch { fontDataCache.delete(abs) }
  }
  return result
}

async function inlineImages(src: HTMLElement, clone: HTMLElement) {
  const originals = Array.from(src.querySelectorAll('img'))
  const copies = Array.from(clone.querySelectorAll('img'))
  await Promise.all(copies.map(async (img, i) => {
    const s = originals[i]?.currentSrc || img.getAttribute('src') || ''
    if (!s || s.startsWith('data:')) return
    try { img.setAttribute('src', await fetchDataUrl(s)) } catch { img.removeAttribute('src') }
  }))
}

async function fetchText(url: string) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.text()
}

async function fetchDataUrl(url: string) {
  const r = await fetch(url, { mode: 'cors' })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  const blob = await r.blob()
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result as string)
    fr.onerror = reject
    fr.readAsDataURL(blob)
  })
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const escapeXmlText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* ------------------------------------------------------------------ */
/* Searchable text layer                                               */
/* ------------------------------------------------------------------ */

/**
 * Places every word, invisibly, at the exact position the browser laid it out, so
 * the PDF can be searched, copied and parsed by applicant tracking systems.
 */
function addTextLayer(pdf: jsPDF, el: HTMLElement, mmPerPx: number) {
  const origin = el.getBoundingClientRect()
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  pdf.setFont('helvetica', 'normal')

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const text = node.data
    if (!text.trim()) continue
    const style = getComputedStyle(node.parentElement!)
    const transform = style.textTransform
    for (const m of text.matchAll(/\S+/g)) {
      range.setStart(node, m.index!)
      range.setEnd(node, m.index! + m[0].length)
      const r = range.getClientRects()[0]
      if (!r || !r.width) continue
      let word = m[0]
      if (transform === 'uppercase') word = word.toUpperCase()
      else if (transform === 'lowercase') word = word.toLowerCase()

      const x = (r.left - origin.left) * mmPerPx
      const yTop = (r.top - origin.top) * mmPerPx
      const h = r.height * mmPerPx
      const page = Math.floor((yTop + h / 2) / PAGE_H)
      const fontPt = (h / 0.3528) * 0.8
      pdf.setPage(Math.min(page + 1, pdf.getNumberOfPages()))
      pdf.setFontSize(fontPt)
      // Stretch to the real word width so selection boxes line up with the image.
      const natural = pdf.getTextWidth(word) || 1
      pdf.text(word + ' ', x, yTop - page * PAGE_H + h * 0.78, {
        renderingMode: 'invisible',
        horizontalScale: (r.width * mmPerPx) / natural,
      } as Parameters<jsPDF['text']>[3])
    }
  }
  range.detach?.()
}

/* ------------------------------------------------------------------ */
/* Fallback renderer                                                   */
/* ------------------------------------------------------------------ */

async function renderWithHtml2Canvas(el: HTMLElement) {
  const { default: html2canvas } = await import('html2canvas-pro')
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    onclone: doc => {
      const style = doc.createElement('style')
      style.textContent = '*{font-kerning:none!important;font-variant-ligatures:none!important}'
      doc.head.appendChild(style)
    },
  })
}

/** Opens the browser print dialog for the CV element only. */
export function printElement(el: HTMLElement) {
  const w = window.open('', '_blank', 'width=900,height=1200')
  if (!w) return
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(n => n.outerHTML).join('')
  w.document.write(`<html><head><title>CV</title>${styles}<style>@page{size:A4;margin:0}body{margin:0}.cv-preview{box-shadow:none!important;transform:none!important}</style></head><body>${el.outerHTML}</body></html>`)
  w.document.close()
  w.onload = () => { w.focus(); w.print() }
}
