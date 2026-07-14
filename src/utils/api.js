import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
})

// ── Certificates ─────────────────────────────────────────────────────────────

/**
 * Issue a certificate by uploading a PDF + metadata.
 * POST /api/certificates/issue
 * @param {FormData} formData  — must include: file, studentName, institution, course, issueDate
 * @param {function} onProgress — optional (0–100)
 */
export async function issueCertificate(formData, onProgress) {
  const res = await api.post('/certificates/issue', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    },
  })
  return res.data
}

/**
 * Verify a certificate by uploading a PDF file.
 * POST /api/certificates/verify
 * @param {File} file
 */
export async function verifyCertificateByFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/certificates/verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

/**
 * Verify a certificate by its SHA-256 hash string.
 * POST /api/certificates/verify
 * @param {string} hash
 */
export async function verifyCertificateByHash(hash) {
  const res = await api.post('/certificates/verify', { hash })
  return res.data
}

export default api
