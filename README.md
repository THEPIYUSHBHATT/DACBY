# Hacker News Scraper Clone (MERN)

A mini full-stack web application that scrapes the top stories from Hacker News in real-time. Users can register, log in, and bookmark their favorite stories. Built with the MERN stack and WebSockets for real-time updates.

**Live Demo:**
- **Frontend:** [https://dacby-eta.vercel.app/](https://dacby-eta.vercel.app/) (Hosted on Vercel)
- **Backend API:** [https://dacby-lzod.onrender.com/](https://dacby-lzod.onrender.com/) (Hosted on Render)

## Features Implemented

- **Web Scraper (Server-side):** Automatically scrapes top 10 HN stories using `axios` and `cheerio`.
- **Real-Time Updates:** Backend pushes new stories to connected clients instantly via WebSockets (`socket.io`), seamlessly updating the UI without a page refresh.
- **User Authentication:** Secure JWT-based authentication with `bcryptjs` password hashing. Protected endpoints.
- **Bookmark System:** Users can save/unsave stories to their personal account.
- **Clean Architecture:** Strict separation of concerns (Routes -> Controllers -> Services).
- **Responsive UI:** Custom CSS design system (no messy inline styles).
- **Graceful Async Handling:** Uses `AbortController` in React to cleanly cancel strict-mode duplicate requests and prevent memory leaks.

## Tech Stack

- **Frontend:** React 19 (Vite), Context API, React Router DOM, Axios, Custom CSS.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Additional:** Socket.io (Real-time events), Cheerio (HTML Parsing), JWT.

## Running the Project Locally

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend server (starts the DB connection and initial scrape):
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the React application:
```bash
npm run dev
# App runs on http://localhost:5173
```

## Folder Structure Highlights

The backend follows a scalable MVC-inspired structure:
- `routes/` - Maps HTTP paths to controller functions.
- `controllers/` - Handles req/res parsing and error handling.
- `models/` - Mongoose schemas (Story, User).
- `services/` - Business logic (the Scraper logic lives here).
- `middleware/` - JWT auth validation.

## Edge Cases Handled
- **No Duplicate Stories:** The scraper uses `findOneAndUpdate` with `upsert: true` matching by HackerNews' unique ID to prevent duplicating database records on re-scrapes.
- **Secure Password Hashing:** User schema intercepts `save` events to hash passwords, ensuring they are never stored in plaintext.
