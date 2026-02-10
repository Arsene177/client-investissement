import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './LanguageContext.jsx'
import { CountryProvider } from './CountryContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <CountryProvider>
        <App />
      </CountryProvider>
    </LanguageProvider>
  </StrictMode>,
)
