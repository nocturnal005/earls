import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Configurator from './Configurator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Configurator />
  </StrictMode>,
)
