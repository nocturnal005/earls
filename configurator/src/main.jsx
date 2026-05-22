import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './newConfigurator.css'
import NewConfigurator from './NewConfigurator.jsx'
import { CartProvider } from './CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <NewConfigurator />
    </CartProvider>
  </StrictMode>,
)
