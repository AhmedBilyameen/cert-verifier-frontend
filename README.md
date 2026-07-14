# CertVerify — React Frontend (Phase 3)

Vite + React frontend for the Digital Certificate Verifier.
Connects to the Node.js/Express backend on `localhost:5000`.

## Quick Start

```bash
cd ~/Desktop/cert-verifier-frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

> The Vite dev server proxies all `/api/*` requests to `http://localhost:5000`.
> Make sure your Express backend is running first.

---

## Pages

| Route      | Component            | Purpose                                              |
|------------|----------------------|------------------------------------------------------|
| `/`        | `PublicVerifier`     | Verify certificates by file upload or SHA-256 hash   |
| `/verify`  | `PublicVerifier`     | Same — aliased for clean URL sharing                 |
| `/issue`   | `InstitutionPortal`  | Issue new certificates (upload PDF + metadata)       |

---

## Project Structure

```
src/
├── pages/
│   ├── InstitutionPortal.jsx   # Issue flow: form + PDF upload + result card
│   └── PublicVerifier.jsx      # Verify flow: file or hash input + result card
├── components/
│   ├── DropZone.jsx            # Drag-and-drop PDF input (react-dropzone)
│   └── CertificateCard.jsx     # Displays issued/verified certificate details
├── utils/
│   └── api.js                  # Axios instance + typed API calls
├── App.jsx                     # Router + Nav + Toaster
├── index.css                   # Global design system (tokens, components)
└── main.jsx                    # React entry point
```

---

## API Calls (wired to backend)

```
POST /api/certificates/issue    — multipart/form-data (file + fields)
POST /api/certificates/verify   — multipart/form-data (file)  OR  { hash }
```

---

## Build for Production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

For deployment: serve `dist/` from the same origin as your backend,
or configure CORS + update `VITE_API_BASE` in `.env` to point to your API host.
