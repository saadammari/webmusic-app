import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';

const router = Router();

// Create a new playlist
router.post('/', async (req, res) => {
  const { name = 'My Playlist' } = req.body;
  const hash = uuidv4();
  await pool.execute('INSERT INTO playlists (hash, name) VALUES (?, ?)', [hash, name]);
  res.status(201).json({ hash });
});

// Get a playlist by hash
router.get('/:hash', async (req, res) => {
  const { hash } = req.params;
  const [[playlist]] = await pool.execute('SELECT * FROM playlists WHERE hash = ?', [hash]);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

  const [songs] = await pool.execute(
    'SELECT * FROM playlist_songs WHERE playlist_hash = ? ORDER BY position ASC',
    [hash]
  );
  res.json({ ...playlist, songs });
});

// Add a song to a playlist
router.post('/:hash/songs', async (req, res) => {
  const { hash } = req.params;
  const { source, trackId, title, artist, thumbnail_url } = req.body;

  if (!source || !trackId || !title) return res.status(400).json({ error: 'Missing required fields' });

  const [[{ maxPos }]] = await pool.execute(
    'SELECT COALESCE(MAX(position), -1) AS maxPos FROM playlist_songs WHERE playlist_hash = ?',
    [hash]
  );
  await pool.execute(
    'INSERT INTO playlist_songs (playlist_hash, source, track_id, title, artist, thumbnail_url, position) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [hash, source, trackId, title, artist || '', thumbnail_url || '', maxPos + 1]
  );
  res.status(201).json({ ok: true });
});

// Remove a song
router.delete('/:hash/songs/:songId', async (req, res) => {
  const { hash, songId } = req.params;
  await pool.execute('DELETE FROM playlist_songs WHERE id = ? AND playlist_hash = ?', [songId, hash]);
  res.json({ ok: true });
});

export default router;
