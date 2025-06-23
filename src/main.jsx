import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "tailwindcss";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
