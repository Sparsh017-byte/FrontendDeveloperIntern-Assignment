# MyNotes — Frontend + Backend

## 🚀 Project Overview
A simple notes application with user authentication. Backend is built with Express + MongoDB, frontend is a React (Vite) app with Tailwind. Notes are private to each authenticated user.
I updated it

---

## 🧰 Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT stored in an httpOnly cookie
- Frontend: React (Vite), Tailwind CSS, Axios

---

## ✅ Prerequisites
- Node.js 18+ and npm
- A running MongoDB instance (Atlas or local)

---

## ⚙️ Environment Variables
Create a `.env` file in the `backend/` folder with the following variables:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=some_secret_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

For the frontend create a `.env` (or `.env.local`) in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

> Note: Vite env variables must start with `VITE_` to be accessible in the app.

---

## 📦 Install & Run
Open two terminals (one for backend, one for frontend):

Backend:
```bash
cd backend
npm install
# Start in dev mode (nodemon)
npm run dev
# or run production
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Open the frontend (Vite) dev server URL in your browser (usually `http://localhost:5173`).

---

## 📚 API Summary
Base URL is: `http://localhost:5000/api/v1`

Users
- POST `/users/register` { userName, email, password }
- POST `/users/login` { email, password }
- POST `/users/logout` (clears cookie)
- GET `/users/me` (protected)
- PATCH `/users/me` { userName } (protected)

Notes (protected — require login cookie)
- GET `/notes` — list user's notes
- POST `/notes` — create note { title, description, status? }
- PATCH `/notes/:id` — update note
- DELETE `/notes/:id` — delete note

All responses use JSON and error responses contain `{ message: '...' }`.

---

## 🔁 Demo / Seed Steps (quick)
You can create demo accounts using the registration API or via the frontend UI.

Example using `curl` (creates and logs in then uses cookie for note creation):

1) Register (or use the Register UI):
```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"userName":"Demo User","email":"demo1@example.com","password":"Password123"}' -c cookie.txt
```

2) Login (if you registered previously):
```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo1@example.com","password":"Password123"}' -c cookie.txt -b cookie.txt
```

3) Create a note (uses saved cookie for authentication):
```bash
curl -X POST http://localhost:5000/api/v1/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First Note","description":"This is a seeded note"}' -b cookie.txt
```

4) List notes:
```bash
curl -X GET http://localhost:5000/api/v1/notes -b cookie.txt
```

Demo credentials you can use (create them via register):
- demo1@example.com / Password123
- demo2@example.com / Password123

---

## 🧪 Testing & Debug
- Check backend logs in the terminal that runs `npm run dev`.
- Use browser DevTools → Network to inspect frontend requests/responses (particularly check cookie set on login).

---

## 💡 Tips
- The backend stores a JWT in an httpOnly cookie — calls to protected endpoints must include credentials (Axios is configured with `withCredentials: true`).
- If notes or auth fail, inspect the response body for `{ message: '...' }` which is bubbled up to the UI.

---

If you'd like, I can add an automated seed script, nicer README badges, or Postman collection snippets next. 😊
