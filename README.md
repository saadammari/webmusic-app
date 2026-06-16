# webmusic-app

A cross-platform music playlist builder. Search YouTube and Spotify simultaneously, mix tracks from both into a single playlist, and share it with a link.

## Features

- Search across YouTube and Spotify at the same time
- Filter results by source (All / YouTube / Spotify)
- Build a playlist by mixing tracks from both platforms
- Save playlists and generate a shareable link (`/p/:hash`)
- Shared playlists link directly to YouTube or Spotify

## Stack

- **Frontend:** React 19, Vite, React Router
- **Backend:** Node.js, Express 5
- **Database:** MySQL
- **APIs:** YouTube Data API v3, Spotify Web API

## Project Structure

```
client/   ← React frontend (deployed to Vercel)
server/   ← Express API (deployed to Railway)
```

## Local Development

### Prerequisites

- Node.js v18+
- MySQL
- Spotify API credentials (developer.spotify.com)
- YouTube Data API v3 key (console.cloud.google.com)

### Setup

1. **Server** — create `server/.env`:

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_user
   DB_PASS=your_mysql_password
   DB_NAME=webmusic
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   YOUTUBE_API_KEY=...
   PORT=3001
   ```

2. **Client** — create `client/.env`:

   ```
   VITE_API_URL=http://localhost:3001
   ```

3. **Create the database:**

   ```sql
   CREATE DATABASE webmusic;
   ```

   Tables are created automatically on server startup.

4. **Run:**

   ```bash
   # Terminal 1
   cd server && npm install && npm run dev

   # Terminal 2
   cd client && npm install && npm run dev
   ```

   Frontend: http://localhost:5173

## Deployment

**Live:** https://webmusic-frontend.vercel.app

| Part     | Technology |
|----------|------------|
| Frontend | Vercel (static hosting, automatic deploys from GitHub) |
| Backend  | Railway (Node.js container, auto-scales, runs Express API) |
| Database | Railway MySQL (managed MySQL instance, auto-provisioned tables) |
