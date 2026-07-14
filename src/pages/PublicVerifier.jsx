import { useState } from 'react'
import toast from 'react-hot-toast'
import { Search, Hash, FileText, ShieldCheck, ShieldX, RotateCcw, Info } from 'lucide-react'
import DropZone from '../components/DropZone'
import CertificateCard from '../components/CertificateCard'
import { verifyCertificateByFile, verifyCertificateByHash } from '../utils/api'

const MODES = [
  { id: 'file', label: 'Upload PDF',  Icon: FileText },
  { id: 'hash', label: 'Enter Hash',  Icon: Hash },
]

export default function PublicVerifier() {
  const [mode, setMode]       = useState('file')
  const [file, setFile]       = useState(null)
  const [hashInput, setHash]  = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)   // { found, certificate?, blockchainValid? }
  const [error, setError]     = useState(null)

  const canVerify = mode === 'file' ? !!file : hashInput.trim().length === 64

  const reset = () => {
    setFile(null)
    setHash('')
    setResult(null)
    setError(null)
  }

  const handleVerify = async () => {
    if (!canVerify) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let data
      if (mode === 'file') {
        data = await verifyCertificateByFile(file)
      } else {
        data = await verifyCertificateByHash(hashInput.trim())
      }
      setResult(data)
      if (data.found) {
        toast.success('Certificate verified!')
      } else {
        toast.error('Certificate not found in records')
      }
    } catch (err) {
      const msg = err.response?.data?.error ?? err.message ?? 'Verification failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="verifier-layout">
      {/* ── Page header ── */}
      <div className="verifier-hero">
        <div className="hero-badge">
          <ShieldCheck size={14} />
          Polygon Amoy Blockchain
        </div>
        <h1 className="hero-title">Verify a Certificate</h1>
        <p className="hero-sub">
          Upload the original PDF or paste its SHA-256 hash to check authenticity
          against both the database and the blockchain.
        </p>
      </div>

      {/* ── Verify card ── */}
      <div className="verifier-card card animate-fade-up">
        {/* Mode toggle */}
        <div className="card-section" style={{ paddingBottom: 0 }}>
          <div className="mode-tabs">
            {MODES.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`mode-tab${mode === id ? ' mode-tab--active' : ''}`}
                onClick={() => { setMode(id); reset() }}
                disabled={loading}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="card-section">
          {mode === 'file' ? (
            <DropZone
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
              hint="Upload the exact original PDF — any modification will invalidate the hash"
            />
          ) : (
            <div className="form-group">
              <label className="form-label">SHA-256 Hash (64 hex characters)</label>
              <input
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.02em' }}
                placeholder="e.g. a3f1c2d9e4b8..."
                value={hashInput}
                onChange={(e) => setHash(e.target.value.toLowerCase().replace(/[^0-9a-f]/g, ''))}
                maxLength={64}
                disabled={loading}
                spellCheck={false}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {hashInput.length}/64 characters
                </span>
                {hashInput.length > 0 && hashInput.length < 64 && (
                  <span style={{ fontSize: 12, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Info size={11} /> Incomplete hash
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-banner" style={{ marginTop: 16 }}>
              <ShieldX size={15} />
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              disabled={!canVerify || loading}
              onClick={handleVerify}
            >
              {loading ? (
                <><div className="spinner" /> Verifying…</>
              ) : (
                <><Search size={16} /> Verify Certificate</>
              )}
            </button>
            {result && (
              <button className="btn btn-ghost btn-lg" onClick={reset} title="Verify another">
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Result ── */}
      {result && (
        <div className="verify-result animate-fade-up">
          {result.found ? (
            <>
              <div className="verify-status verify-status--valid">
                <ShieldCheck size={20} />
                <div>
                  <div className="verify-status-title">Authentic Certificate</div>
                  <div className="verify-status-sub">
                    {result.blockchainValid
                      ? 'Verified in database and confirmed on Polygon Amoy blockchain'
                      : 'Found in database — blockchain record could not be confirmed'}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  {result.blockchainValid ? (
                    <span className="badge badge-success">On-chain ✓</span>
                  ) : (
                    <span className="badge badge-warning">DB only</span>
                  )}
                </div>
              </div>
              <CertificateCard cert={result.certificate} mode="verified" />
            </>
          ) : (
            <div className="verify-status verify-status--invalid">
              <ShieldX size={20} />
              <div>
                <div className="verify-status-title">Not Found</div>
                <div className="verify-status-sub">
                  This certificate is not in our records. It may be invalid, tampered,
                  or was issued by a different institution.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── How it works ── */}
      {!result && (
        <div className="how-it-works animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="how-title">How verification works</h3>
          <div className="how-steps">
            {[
              { n: '01', title: 'Upload or hash', body: 'Provide the original PDF or its 64-character SHA-256 fingerprint.' },
              { n: '02', title: 'Hash computed', body: 'The document is hashed client-side (for file) or taken as-is (for hash).' },
              { n: '03', title: 'Database lookup', body: 'The hash is matched against records in the PostgreSQL database.' },
              { n: '04', title: 'Blockchain check', body: 'The hash is simultaneously verified on the Polygon Amoy smart contract.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="how-step">
                <div className="how-step-n">{n}</div>
                <div className="how-step-title">{title}</div>
                <div className="how-step-body">{body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .verifier-layout {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .verifier-hero {
          text-align: center;
          padding: 20px 0 8px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid rgba(0,212,170,0.2);
          padding: 4px 14px;
          border-radius: 100px;
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
        }
        .hero-sub {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 460px;
          margin: 0 auto;
        }

        .verifier-card { max-width: 680px; }

        .mode-tabs {
          display: flex;
          gap: 4px;
          background: var(--bg-surface);
          padding: 4px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          margin-bottom: 4px;
        }
        .mode-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 16px;
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          color: var(--text-secondary);
          background: none;
        }
        .mode-tab:hover { color: var(--text-primary); }
        .mode-tab--active {
          background: var(--bg-card);
          color: var(--text-primary);
          border: 1px solid var(--border-bright);
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .mode-tab:disabled { opacity: 0.5; cursor: not-allowed; }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--danger-dim);
          border: 1px solid rgba(255, 77, 109, 0.2);
          border-radius: var(--radius-md);
          font-size: 13px;
          color: var(--danger);
        }

        .verify-result {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .verify-status {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 20px;
          border-radius: var(--radius-lg);
          flex-wrap: wrap;
        }
        .verify-status--valid {
          background: var(--accent-dim);
          border: 1px solid rgba(0,212,170,0.25);
          color: var(--accent);
        }
        .verify-status--invalid {
          background: var(--danger-dim);
          border: 1px solid rgba(255,77,109,0.25);
          color: var(--danger);
        }
        .verify-status-title {
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 2px;
        }
        .verify-status-sub {
          font-size: 13px;
          opacity: 0.8;
          line-height: 1.5;
        }

        .how-it-works {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
        }
        .how-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-family: var(--font-mono);
          margin-bottom: 20px;
        }
        .how-steps {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 520px) { .how-steps { grid-template-columns: 1fr; } }
        .how-step {}
        .how-step-n {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 4px;
          opacity: 0.7;
        }
        .how-step-title {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 4px;
        }
        .how-step-body {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}
