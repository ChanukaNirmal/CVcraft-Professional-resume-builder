import { useEffect, useState } from 'react'
import LandingPage from './screens/LandingPage'
import BuilderWorkspace from './screens/BuilderWorkspace'
import DownloadPage from './screens/DownloadPage'
import type { CVData } from './types'
import { defaultCV } from './data/sampleCV'

export type Screen = 'landing' | 'builder' | 'download'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [cvData, setCVData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem('cvcraft:data')
      return saved ? { ...defaultCV, ...JSON.parse(saved) } : defaultCV
    } catch { return defaultCV }
  })

  // Autosave to the browser so work survives reloads
  useEffect(() => {
    try { localStorage.setItem('cvcraft:data', JSON.stringify(cvData)) } catch { /* quota (large photo) */ }
  }, [cvData])

  useEffect(() => { window.scrollTo(0, 0) }, [screen])

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {screen === 'landing' && (
        <LandingPage onStart={(template?: string) => { if (template) setCVData(d => ({ ...d, selectedTemplate: template })); setScreen('builder') }} />
      )}
      {screen === 'builder' && (
        <BuilderWorkspace
          cvData={cvData}
          setCVData={setCVData}
          onFinish={() => setScreen('download')}
          onBack={() => setScreen('landing')}
        />
      )}
      {screen === 'download' && (
        <DownloadPage
          cvData={cvData}
          setCVData={setCVData}
          onEdit={() => setScreen('builder')}
          onHome={() => setScreen('landing')}
        />
      )}
    </div>
  )
}
