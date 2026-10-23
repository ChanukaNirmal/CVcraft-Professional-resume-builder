import { useEffect, useState } from 'react'

// Minimal History-API router so legal pages have real, crawlable URLs (AdSense requirement)
export function navigate(path: string) {
  if (path === window.location.pathname) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const on = () => setPath(window.location.pathname)
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])
  return path
}

export function linkProps(path: string) {
  return {
    href: path,
    onClick: (e: { preventDefault: () => void; metaKey?: boolean; ctrlKey?: boolean }) => {
      if (e.metaKey || e.ctrlKey) return
      e.preventDefault()
      navigate(path)
    },
  }
}
