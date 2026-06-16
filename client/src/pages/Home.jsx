import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import TrackCard from '../components/TrackCard';
import PlaylistPanel from '../components/PlaylistPanel';

export default function Home() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [saving, setSaving] = useState(false);

  const addedIds = new Set(playlist.map((s) => `${s.source}-${s.trackId}`));

  function addTrack(track) {
    setPlaylist((prev) => [...prev, track]);
  }

  function removeTrack(index) {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
  }

  async function savePlaylist(name) {
    setSaving(true);
    try {
      const base = import.meta.env.VITE_API_URL;
      const createRes = await fetch(`${base}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const { hash } = await createRes.json();

      await Promise.all(
        playlist.map((s) =>
          fetch(`${base}/api/playlists/${hash}/songs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: s.source,
              trackId: s.trackId,
              title: s.title,
              artist: s.artist,
              thumbnail_url: s.thumbnail,
            }),
          })
        )
      );

      const link = `${window.location.origin}/p/${hash}`;
      return link;
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="home-layout">
      <div className="search-col">
        <SearchBar onResults={setResults} onLoading={setLoading} />
        <div className="results-list">
          {loading && <div className="loading">Searching…</div>}
          {!loading && results.map((t) => (
            <TrackCard
              key={`${t.source}-${t.trackId}`}
              track={t}
              onAdd={addTrack}
              added={addedIds.has(`${t.source}-${t.trackId}`)}
            />
          ))}
        </div>
      </div>
      <div className="playlist-col">
        <PlaylistPanel
          songs={playlist}
          onRemove={removeTrack}
          onSave={savePlaylist}
          saving={saving}
        />
      </div>
    </div>
  );
}
