import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { WsServer } from './utils/wsServer.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WsServer>
        <App />
      </WsServer>
    </BrowserRouter>
  </StrictMode>,
)
