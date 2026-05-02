import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import lp1 from './assets/img/lp1.jpg'
import lp2 from './assets/img/lp2.jpg'
import lp3 from './assets/img/lp3.jpg'
import lp4 from './assets/img/lp4.jpg'

const backgrounds = [lp1, lp2, lp3, lp4]
const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]

document.documentElement.style.setProperty('--page-bg-image', `url(${randomBackground})`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
