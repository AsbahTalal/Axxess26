import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Bloomy from './Bloomy.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Bloomy />
  </StrictMode>
)