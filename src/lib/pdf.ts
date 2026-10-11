import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'

/** Renders the element (an unscaled A4 CV) to a multi-page A4 PDF and triggers download. */
export async function downloadElementAsPDF(el: HTMLElement, fileName: string) {
  await document.fonts?.ready
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    // html2canvas measures text word-by-word; kerning/ligatures make those
    // measurements drift and words collapse together. Disable them in the clone.
    onclone: doc => {
      const style = doc.createElement('style')
      style.textContent = `* {
        font-kerning: none !important;
        font-variant-ligatures: none !important;
        font-feature-settings: "liga" 0, "kern" 0 !important;
        text-rendering: geometricPrecision !important;
        -webkit-font-smoothing: antialiased;
      }`
      doc.head.appendChild(style)
      wrapWords(doc.body)
    },
  })
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
  const pageW = 210
  const pageH = 297
  const imgH = (canvas.height * pageW) / canvas.width
  const img = canvas.toDataURL('image/jpeg', 0.95)

  let offset = 0
  while (offset < imgH - 1) {
    if (offset > 0) pdf.addPage()
    pdf.addImage(img, 'JPEG', 0, -offset, pageW, imgH)
    offset += pageH
  }
  pdf.save(fileName)
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

/** Wraps each word in its own span so the browser lays out word positions, not html2canvas. */
function wrapWords(root: HTMLElement) {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) {
    const n = walker.currentNode as Text
    if (n.data.trim() && !n.parentElement?.closest('script,style,svg')) nodes.push(n)
  }
  for (const node of nodes) {
    const frag = root.ownerDocument.createDocumentFragment()
    for (const part of node.data.split(/(\s+)/)) {
      if (!part) continue
      if (/^\s+$/.test(part)) frag.appendChild(root.ownerDocument.createTextNode(part))
      else {
        const span = root.ownerDocument.createElement('span')
        span.textContent = part
        frag.appendChild(span)
      }
    }
    node.replaceWith(frag)
  }
}
