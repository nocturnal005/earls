import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './newConfigurator.css'
import NewConfigurator from './NewConfigurator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NewConfigurator />
  </StrictMode>,
)
