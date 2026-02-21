# Deploy: Render (Backend) + Vercel (Frontend)

Follow this order: **Backend first**, then **Frontend** (so you can paste the API URL into Vercel).

---

## Part 1: Backend on Render

### 1. Push your code to GitHub

- Create a repo and push your project (include both `frontend` and `backend` folders).

### 2. Create a Web Service on Render

1. Go to [render.com](https://render.com) → **Dashboard** → **New +** → **Web Service**.
2. **Connect** your GitHub repo (one-time auth if needed).
3. Choose the repo that contains this project.

### 3. Configure the service

| Field | Value |
|-------|--------|
| **Name** | `placement-api` (or any name) |
| **Region** | Oregon (or nearest to you) |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (or paid if you prefer) |

### 4. Environment variables (Render Dashboard → Environment)

Click **Add Environment Variable** and add:

| Key | Value | Notes |
|-----|--------|--------|
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/placement` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | (long random string) | e.g. use a password generator, 32+ chars |
| `JWT_REFRESH_SECRET` | (another long random string) | 32+ chars, different from JWT_SECRET |
| `CORS_ORIGIN` | `https://YOUR_VERCEL_APP.vercel.app` | **Update after Part 2** with your real Vercel URL |

- **MongoDB:** If you don’t have one, create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), get the connection string, and put it in `MONGODB_URI`.
- **PORT:** Render sets this automatically; you don’t need to add it.

### 5. Deploy

- Click **Create Web Service**.
- Wait for the first deploy to finish. The backend URL will look like:
  - `https://placement-api.onrender.com`  
  Your **API base URL** is: **`https://placement-api.onrender.com/api`** (with `/api`).

### 6. (Optional) Update CORS after Vercel is ready

- Once you have the Vercel URL (e.g. `https://placement-portal.vercel.app`), go back to Render → your service → **Environment**.
- Set `CORS_ORIGIN` to that URL (no trailing slash).
- Save; Render will redeploy automatically.

---

## Part 2: Frontend on Vercel

### 1. Create a Vercel project

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. **Import** the same GitHub repo.
3. Configure the project:

| Field | Value |
|-------|--------|
| **Root Directory** | `frontend` (click **Edit** and set to `frontend`) |
| **Framework Preset** | Vite (Vercel usually detects it) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `dist` (default for Vite) |

### 2. Environment variable (Vercel)

- Open **Environment Variables**.
- Add:

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://placement-api.onrender.com/api` |

Replace `placement-api.onrender.com` with your **actual** Render service URL from Part 1 (keep the `/api` at the end).

- Apply to **Production** (and Preview if you want).

### 3. Deploy

- Click **Deploy**.
- When it’s done, you’ll get a URL like `https://placement-portal.vercel.app`.

### 4. Point backend CORS to Vercel

- In **Render** → your backend service → **Environment**.
- Set **`CORS_ORIGIN`** to your Vercel URL, e.g. `https://placement-portal.vercel.app` (no trailing slash).
- Save so the backend redeploys with the new CORS.

---

## Summary

| What | URL |
|------|-----|
| **Backend (Render)** | `https://YOUR-SERVICE.onrender.com` → API: `https://YOUR-SERVICE.onrender.com/api` |
| **Frontend (Vercel)** | `https://YOUR-PROJECT.vercel.app` |

- **Frontend** uses `VITE_API_URL` = `https://YOUR-SERVICE.onrender.com/api`.
- **Backend** uses `CORS_ORIGIN` = `https://YOUR-PROJECT.vercel.app`.

Open the Vercel URL in the browser; the app will call the Render API. If something fails, check the browser console and Render logs.
