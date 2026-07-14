import { useState } from 'react'
import toast from 'react-hot-toast'
import { Building2, Send, RotateCcw, AlertCircle } from 'lucide-react'
import DropZone from '../components/DropZone'
import CertificateCard from '../components/CertificateCard'
import { issueCertificate } from '../utils/api'

const INITIAL = { studentName: '', institution: '', course: '', issueDate: '' }

export default function InstitutionPortal() {
  const [fields, setFields]       = useState(INITIAL)
  const [file, setFile]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [progress, setProgress]   = useState(0)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState(null)

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  const isValid =
    file &&
    fields.studentName.trim() &&
    fields.institution.trim() &&
    fields.course.trim() &&
    fields.issueDate

  const reset = () => {
    setFields(INITIAL)
    setFile(null)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file',         file)
      formData.append('studentName',  fields.studentName.trim())
      formData.append('institution',  fields.institution.trim())
      formData.append('course',       fields.course.trim())
      formData.append('issueDate',    fields.issueDate)

      const data = await issueCertificate(formData, setProgress)
      setResult(data.certificate ?? data)
      toast.success('Certificate issued and anchored on blockchain!')
    } catch (err) {
      const msg = err.response?.data?.error ?? err.message ?? 'Something went wrong'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="portal-layout">
      {/* ── Page header ── */}
      <div className="page-header">
        <div className="page-header-icon">
          <Building2 size={22} />
        </div>
        <div>
          <h1 className="page-title">Institution Portal</h1>
          <p className="page-subtitle">
            Issue education certificates — hashed, stored in PostgreSQL, and anchored on Polygon Amoy.
          </p>
        </div>
      </div>

      <div className="portal-grid">
        {/* ── Issue form ── */}
        <div className="card animate-fade-up">
          <div className="card-section">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
              Certificate Details
            </h2>

            <div className="form-stack">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Amara Okafor"
                    value={fields.studentName}
                    onChange={set('studentName')}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={fields.issueDate}
                    onChange={set('issueDate')}
                    disabled={loading}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Institution</label>
                <input
                  className="form-input"
                  placeholder="e.g. University of Lagos"
                  value={fields.institution}
                  onChange={set('institution')}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course / Programme</label>
                <input
                  className="form-input"
                  placeholder="e.g. BSc. Computer Science"
                  value={fields.course}
                  onChange={set('course')}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="card-section">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              Certificate Document
            </h2>
            <DropZone
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
              hint="PDF only · max 5 MB · will be SHA-256 hashed"
            />
          </div>

          {/* Progress bar */}
          {loading && progress > 0 && (
            <div className="card-section" style={{ paddingTop: 0 }}>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                Uploading… {progress}%
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card-section" style={{ paddingTop: 0 }}>
              <div className="error-banner">
                <AlertCircle size={15} />
                {error}
              </div>
            </div>
          )}

          <div className="card-section" style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                disabled={!isValid || loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <><div className="spinner" /> Issuing…</>
                ) : (
                  <><Send size={16} /> Issue Certificate</>
                )}
              </button>
              {result && (
                <button className="btn btn-ghost btn-lg" onClick={reset} title="Start over">
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Result panel ── */}
        <div className="result-panel">
          {result ? (
            <CertificateCard cert={result} mode="issued" />
          ) : (
            <div className="result-placeholder">
              <div className="result-placeholder-inner">
                <div className="result-placeholder-icon">
                  <Building2 size={28} />
                </div>
                <p className="result-placeholder-title">Issued certificate appears here</p>
                <p className="result-placeholder-sub">
                  Fill in the form, attach a PDF, and click Issue Certificate.
                  The document will be hashed and recorded on-chain.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .portal-layout { max-width: 1060px; }

        .page-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 36px;
        }
        .page-header-icon {
          width: 46px;
          height: 46px;
          background: var(--accent-dim);
          border: 1px solid rgba(0,212,170,0.2);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .page-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .page-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 3px;
          line-height: 1.5;
        }

        .portal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .portal-grid { grid-template-columns: 1fr; }
        }

        .form-stack { display: flex; flex-direction: column; gap: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }

        .progress-bar-track {
          height: 4px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
          transition: width 200ms ease;
        }

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

        .result-placeholder {
          border: 1.5px dashed var(--border);
          border-radius: var(--radius-lg);
          padding: 48px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 360px;
        }
        .result-placeholder-inner {
          text-align: center;
          max-width: 260px;
        }
        .result-placeholder-icon {
          width: 56px;
          height: 56px;
          background: var(--bg-elevated);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          margin: 0 auto 16px;
        }
        .result-placeholder-title {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .result-placeholder-sub {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}
