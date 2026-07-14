import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ShieldCheck, Building2, Search } from 'lucide-react'
import InstitutionPortal from './pages/InstitutionPortal'
import PublicVerifier from './pages/PublicVerifier'

function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <ShieldCheck size={22} className="shield-icon" />
          <span>CertVerify</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link${path === '/issue' ? ' active' : ''}`}
            onClick={() => navigate('/issue')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={14} />
              Institution Portal
            </span>
          </button>
          <button
            className={`nav-link${path === '/' || path === '/verify' ? ' active' : ''}`}
            onClick={() => navigate('/verify')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={14} />
              Verify Certificate
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Nav />
        <main className="page-content animate-fade-in">
          <Routes>
            <Route path="/"       element={<PublicVerifier />} />
            <Route path="/verify" element={<PublicVerifier />} />
            <Route path="/issue"  element={<InstitutionPortal />} />
          </Routes>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c2029',
            color: '#eef0f4',
            border: '1px solid #252a35',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#00d4aa', secondary: '#0a0c0f' } },
          error:   { iconTheme: { primary: '#ff4d6d', secondary: '#0a0c0f' } },
        }}
      />
    </BrowserRouter>
  )
}
