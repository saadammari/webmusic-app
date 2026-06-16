import { useState, useEffect, useRef } from 'react';

const SOURCES = ['all', 'youtube', 'spotify'];

export default function SearchBar({ onResults, onLoading }) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!query.trim()) { onResults([]); return; }
    timer.current = setTimeout(async () => {
      onLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(query)}&source=${source}`
        );
        const data = await res.json();
        onResults(data.tracks || []);
      } catch {
        onResults([]);
      } finally {
        onLoading(false);
      }
    }, 400);
  }, [query, source]);

  return (
    <div className="search-bar">
      <input
        className="search-input"
        placeholder="Search for songs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="source-tabs">
        {SOURCES.map((s) => (
          <button
            key={s}
            className={`source-tab ${source === s ? 'active' : ''}`}
            onClick={() => setSource(s)}
          >
            {s === 'all' ? 'All' : s === 'youtube' ? 'YouTube' : 'Spotify'}
          </button>
        ))}
      </div>
    </div>
  );
}
