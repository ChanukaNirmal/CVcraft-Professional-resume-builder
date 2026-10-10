import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'

/** Renders the element (an unscaled A4 CV) to a multi-page A4 PDF and triggers download. */
export async function downloadElementAsPDF(el: HTMLElement, fileName: string) {
  await document.fonts?.ready
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
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
