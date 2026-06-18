import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb, cleanupOldPlaylists } from './src/db.js';
import searchRouter from './src/routes/search.js';
import playlistsRouter from './src/routes/playlists.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL,
}));
app.use(express.json());

app.use('/api/search', searchRouter);
app.use('/api/playlists', playlistsRouter);

app.get('/health', (_, res) => res.json({ ok: true }));

initDb()
  .then(() => {
    cleanupOldPlaylists();
    setInterval(cleanupOldPlaylists, 24 * 60 * 60 * 1000);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to init DB:', err);
    process.exit(1);
  });
