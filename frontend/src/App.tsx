import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Admin from './pages/Admin'
import './App.css'

function SiteNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')

  // Secret triple-click on logo to access admin
  const [logoClicks, setLogoClicks] = useState(0)
  const clickTimer = useRef<number | null>(null)

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAdmin) {
      navigate('/')
      return
    }

    e.preventDefault()

    const newCount = logoClicks + 1
    setLogoClicks(newCount)

    if (clickTimer.current) {
      window.clearTimeout(clickTimer.current)
    }

    if (newCount >= 3) {
      setLogoClicks(0)
      navigate('/admin')
    } else {
      clickTimer.current = window.setTimeout(() => {
        setLogoClicks(0)
      }, 700)
    }
  }

  if (isAdmin) {
    return null // Admin has its own minimal header
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a 
          href="/" 
          className="logo" 
          onClick={handleLogoClick}
        >
          BRAGIBYTES
        </a>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <a href="/#contact" onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault()
              const el = document.getElementById('contact')
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
            }
          }}>Contact</a>
        </div>
      </div>
    </nav>
  )
}

function SiteFooter() {
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) return null

  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Sam Bragge — Bragibytes</div>
      <div>Built with Go, React, and intention.</div>
    </footer>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SiteNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={
          <div className="section" style={{ textAlign: 'center', paddingTop: '120px' }}>
            <h1>Page not found</h1>
            <Link to="/">Go home</Link>
          </div>
        } />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  )
}

export default App
