import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoaderProvider } from './LoaderContaxt.jsx'

createRoot(document.getElementById('root')).render(
  <LoaderProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </LoaderProvider>
  ,
)
