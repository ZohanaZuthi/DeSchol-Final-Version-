# Deschol Frontend (Auth-enabled)

Includes login & register flows with JWT storage, protected routes, and scholarship/news pages.

## Quick start
```bash
npm i
cp .env.example .env   # set VITE_API_BASE_URL to your backend
npm run dev
```
Back-end endpoints expected (adjust in `src/lib/api.js` if different):
- POST /api/auth/register  -> { user, token }
- POST /api/auth/login     -> { user, token }
- GET  /api/scholarships
- GET  /api/scholarships/:id
- GET  /api/news
_Last updated 2025-08-24T20:38:48.636107Z_
