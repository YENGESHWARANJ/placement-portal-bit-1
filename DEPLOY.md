# Deploy Placement Portal (Frontend + Backend)

## 1. Fix import (done)

- **NotificationsCenter** uses `import api from "../services/api"` so the dev server resolves it correctly.
- **API URL** is driven by `VITE_API_URL` in production (see below).

---

## 2. Deploy backend (Render / Railway / similar)

### 2.1 Build and run

- **Build:** `npm run build` (in `backend/`)
- **Start:** `npm start` (runs `node dist/server.js`)

### 2.2 Environment variables (backend)

Create a `.env` on the host or set in the dashboard:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/placement
JWT_SECRET=your-long-random-secret
JWT_REFRESH_SECRET=another-long-random-secret
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

- **Render:** New → Web Service → connect repo → root directory: `backend` → Build: `npm install && npm run build` → Start: `npm start` → add env vars.
- **Railway:** New project → add backend folder → set Build/Start same as above → add env vars.

### 2.3 Get backend URL

After deploy you’ll get a URL like:

- `https://placement-api.onrender.com`  
Use: **`https://placement-api.onrender.com/api`** as the API base (trailing `/api`).

---

## 3. Deploy frontend (Vercel / Netlify)

### 3.1 Build

In `frontend/`:

```bash
npm install
npm run build
```

Output is in `frontend/dist/`.

### 3.2 Environment variable (frontend)

Set in Vercel/Netlify dashboard:

- **Name:** `VITE_API_URL`
- **Value:** your backend API base URL, e.g. `https://placement-api.onrender.com/api`

(No trailing slash, or with trailing slash – both work.)

### 3.3 Deploy

- **Vercel:** Connect repo → root directory: `frontend` → Framework: Vite → add `VITE_API_URL` → Deploy.  
  `vercel.json` is already set for SPA routing.
- **Netlify:** Build command: `npm run build`, Publish directory: `dist`, add `VITE_API_URL`.

---

## 4. After deploy

1. **Backend:** Ensure `CORS_ORIGIN` includes the exact frontend URL (e.g. `https://placement-portal.vercel.app`).
2. **Frontend:** Ensure `VITE_API_URL` is the backend API base (e.g. `https://placement-api.onrender.com/api`).
3. Redeploy frontend after changing `VITE_API_URL` (build-time variable).

---

## 5. Quick local test (production build)

**Backend:**

```bash
cd backend
cp .env.example .env
# Edit .env (MONGODB_URI, JWT_SECRET, etc.)
npm run build && npm start
```

**Frontend:**

```bash
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run build && npx vite preview
```

Open `http://localhost:4173` and use the app; it will call `http://localhost:5000/api`.
