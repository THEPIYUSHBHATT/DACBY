# Hacker News Scraper Clone

A full-stack web application that scrapes the top stories from Hacker News in real-time, allowing users to register, log in, and bookmark their favorite stories. Built with the MERN stack and WebSockets for real-time updates.

## Features

- **Real-Time Web Scraping:** Backend periodically scrapes Hacker News using `axios` and `cheerio`, broadcasting updates to all connected clients instantly via WebSockets (`socket.io`).
- **User Authentication:** Secure JWT-based authentication with properly hashed passwords (`bcryptjs`).
- **Bookmark System:** Users can bookmark/unbookmark stories. Bookmarks are persisted in MongoDB and linked directly to the user's account.
- **Service Layer Architecture:** Clean frontend architecture abstracting API calls away from UI components using Axios Interceptors for seamless token injection.
- **Pagination:** Feed supports pagination to easily navigate through the scraped stories.

## Tech Stack

**Frontend:**

- React 19 (Vite)
- React Router DOM
- Context API (Global State Management)
- Axios (HTTP requests & Interceptors)
- Socket.io-client
- Lucide React (Icons)

**Backend:**

- Node.js & Express
- MongoDB & Mongoose (Schema validation & relationships)
- Socket.io (Real-time updates)
- Cheerio (HTML Parsing)
- JSON Web Tokens (JWT) & bcryptjs

## Prerequisites

- Node.js installed
- A running MongoDB URI (Local or Atlas)

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Run the backend server:

```bash
npm start
# Server will run on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Run the frontend app:

```bash
npm run dev
# App will run on http://localhost:5173 (or 5174)
```

## Architecture Overview

- **REST API:** Handles standard CRUD operations (Register, Login, Fetch Stories, Toggle Bookmarks).
- **WebSockets:** The backend pushes a `newScrape` event socket whenever new stories are persisted in the DB. The frontend listens to this and soft-reloads the feed.
- **Axios Interceptor:** Intercepts all outgoing requests in the frontend and securely injects the Authorization Bearer Token.
- **Upsert DB Logic:** The scraper ensures no duplicate story entries by utilizing Mongoose's `findOneAndUpdate` with `upsert: true` utilizing the unique `hnId`.
