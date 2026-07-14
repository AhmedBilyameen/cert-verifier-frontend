import { GraduationCap, Building2, BookOpen, Calendar, Hash, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import toast from 'react-hot-toast'

const POLYGONSCAN = 'https://amoy.polygonscan.com/tx/'

function InfoRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="cert-info-row">
      <div className="cert-info-label">
        <Icon size={13} />
        {label}
      </div>
      <div className={`cert-info-value${mono ? ' mono' : ''}`}>{value}</div>
    </div>
  )
}

export default function CertificateCard({ cert, mode = 'issued' }) {
  const [copied, setCopied] = useState(false)

  if (!cert) return null

  const issueDate = cert.issueDate
    ? format(new Date(cert.issueDate), 'dd MMM yyyy')
    : '—'

  const shortHash = cert.hash
    ? `${cert.hash.slice(0, 16)}…${cert.hash.slice(-10)}`
    : '—'

  const shortTx = cert.blockchainTx
    ? `${cert.blockchainTx.slice(0, 14)}…${cert.blockchainTx.slice(-8)}`
    : null

  const copyHash = () => {
    if (!cert.hash) return
    navigator.clipboard.writeText(cert.hash)
    setCopied(true)
    toast.success('Hash copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`cert-card animate-fade-up${mode === 'verified' ? ' cert-card--verified' : ''}`}>
      {/* Header */}
      <div className="cert-card-header">
        <div className="cert-card-badge">
          <CheckCircle size={16} />
          {mode === 'verified' ? 'Verified on Blockchain' : 'Certificate Issued'}
        </div>
        <div className="cert-card-id">
          #{String(cert.id).padStart(6, '0')}
        </div>
      </div>

      {/* Student name */}
      <div className="cert-card-name">{cert.studentName}</div>
      <div className="cert-card-sub">
        {cert.course} — {cert.institution}
      </div>

      <div className="divider" style={{ margin: '20px 0' }} />

      {/* Info grid */}
      <div className="cert-info-grid">
        <InfoRow icon={GraduationCap} label="Student"      value={cert.studentName} />
        <InfoRow icon={Building2}    label="Institution"   value={cert.institution} />
        <InfoRow icon={BookOpen}     label="Course"        value={cert.course} />
        <InfoRow icon={Calendar}     label="Issue Date"    value={issueDate} />
      </div>

      <div className="divider" style={{ margin: '20px 0' }} />

      {/* Hash */}
      <div className="cert-hash-section">
        <div className="cert-hash-label">
          <Hash size={13} />
          SHA-256 Document Hash
        </div>
        <div className="cert-hash-row">
          <div className="hash-display" style={{ flex: 1 }}>{shortHash}</div>
          <button className="btn btn-ghost btn-sm" onClick={copyHash} title="Copy full hash">
            {copied ? <CheckCircle size={14} style={{ color: 'var(--accent)' }} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Blockchain Tx */}
      {cert.blockchainTx && (
        <div className="cert-tx-section">
          <div className="cert-hash-label">
            <ExternalLink size={13} />
            Blockchain Transaction
          </div>
          <a
            href={`${POLYGONSCAN}${cert.blockchainTx}`}
            target="_blank"
            rel="noreferrer"
            className="cert-tx-link"
          >
            <span className="tx-link">{shortTx}</span>
            <ExternalLink size={11} style={{ opacity: 0.6 }} />
          </a>
        </div>
      )}

      <style>{`
        .cert-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
          box-shadow: var(--shadow-card);
        }
        .cert-card--verified {
          border-color: rgba(0, 212, 170, 0.3);
          box-shadow: var(--shadow-card), 0 0 40px rgba(0, 212, 170, 0.08);
        }
        .cert-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .cert-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid rgba(0,212,170,0.2);
          padding: 4px 12px;
          border-radius: 100px;
        }
        .cert-card-id {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
        }
        .cert-card-name {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .cert-card-sub {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .cert-info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cert-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .cert-info-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          font-family: var(--font-mono);
          flex-shrink: 0;
        }
        .cert-info-value {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
          text-align: right;
        }
        .cert-info-value.mono {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-secondary);
        }
        .cert-hash-section, .cert-tx-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        .cert-hash-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .cert-hash-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cert-tx-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .cert-tx-link:hover .tx-link { color: var(--accent); }
      `}</style>
    </div>
  )
}
