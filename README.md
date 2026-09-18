# GSR INTERNATIONAL CERTIFICATIONS

Global Standards | Integrity | Assurance

A deployment-ready ISO certification company website built from scratch with a fresh UI/UX while preserving the requested VJ International-style business workflows.

## Apps

- `frontend` - Next.js, React, TypeScript, Tailwind CSS
- `backend` - Node.js, Express.js, MongoDB, Mongoose

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run create-admin
npm run dev
```

Set `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `.env`.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the backend API URL, for example `http://localhost:5000/api`.

## Deployment

- Frontend: deploy `frontend` to Vercel.
- Backend: deploy `backend` to Render.
- Database: use MongoDB Atlas and configure `MONGODB_URI` in Render environment variables.

## Admin

Admin credentials are not hardcoded. Create the first admin with:

```bash
cd backend
npm run create-admin
```

The script reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optional `ADMIN_NAME` from environment variables.
