import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, UploadCloud, X } from 'lucide-react'

export default function DropZone({ file, onFile, onClear, label = 'Certificate PDF', hint }) {
  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onFile(accepted[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    noClick: !!file,
  })

  return (
    <div className="dropzone-wrapper">
      {!file ? (
        <div
          {...getRootProps()}
          className={`dropzone${isDragActive ? ' dropzone--active' : ''}`}
        >
          <input {...getInputProps()} />
          <UploadCloud size={32} className="dropzone-icon" />
          <p className="dropzone-title">
            {isDragActive ? 'Drop your PDF here' : 'Drop PDF here or click to browse'}
          </p>
          <p className="dropzone-hint">
            {hint || 'PDF only · max 5 MB'}
          </p>
        </div>
      ) : (
        <div className="file-pill">
          <FileText size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span className="file-pill-name">{file.name}</span>
          <span className="file-pill-size">
            {(file.size / 1024).toFixed(1)} KB
          </span>
          <button
            className="file-pill-clear"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            title="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <style>{`
        .dropzone {
          border: 1.5px dashed var(--border-bright);
          border-radius: var(--radius-lg);
          padding: 36px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all var(--transition);
          background: var(--bg-surface);
          text-align: center;
        }
        .dropzone:hover, .dropzone--active {
          border-color: var(--accent);
          background: var(--accent-dim);
        }
        .dropzone-icon {
          color: var(--text-muted);
          transition: color var(--transition);
        }
        .dropzone:hover .dropzone-icon,
        .dropzone--active .dropzone-icon {
          color: var(--accent);
        }
        .dropzone-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .dropzone-hint {
          font-size: 12px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .file-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: var(--accent-dim);
          border: 1px solid rgba(0, 212, 170, 0.2);
          border-radius: var(--radius-md);
        }
        .file-pill-name {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .file-pill-size {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .file-pill-clear {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          border-radius: 4px;
          transition: color var(--transition), background var(--transition);
        }
        .file-pill-clear:hover {
          color: var(--danger);
          background: var(--danger-dim);
        }
      `}</style>
    </div>
  )
}
