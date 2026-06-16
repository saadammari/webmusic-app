import { Router } from 'express';
import { spotifySearch } from '../spotify.js';
import { youtubeSearch } from '../youtube.js';

const router = Router();

router.get('/', async (req, res) => {
  const { q, source = 'all' } = req.query;
  if (!q || !q.trim()) return res.status(400).json({ error: 'Missing query' });

  try {
    const tasks = [];
    if (source === 'all' || source === 'youtube') tasks.push(youtubeSearch(q));
    if (source === 'all' || source === 'spotify') tasks.push(spotifySearch(q));

    const results = await Promise.allSettled(tasks);
    const tracks = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    res.json({ tracks });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
