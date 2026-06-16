import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.scss'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Remove the initial page loader once the app has mounted, keeping it on
// screen for a minimum time so it never flashes.
const MIN_VISIBLE_MS = 1400
const hideInitialLoader = () => {
  const el = document.getElementById('initial-loader')
  if (!el) return
  const remaining = Math.max(0, MIN_VISIBLE_MS - performance.now())
  window.setTimeout(() => {
    el.classList.add('is-hidden')
    el.addEventListener('transitionend', () => el.remove(), { once: true })
    window.setTimeout(() => el.remove(), 600)
  }, remaining)
}

if (document.readyState === 'complete') hideInitialLoader()
else window.addEventListener('load', hideInitialLoader, { once: true })
