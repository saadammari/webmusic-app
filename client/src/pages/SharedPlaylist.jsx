import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SharedPlaylist() {
  const { hash } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/playlists/${hash}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setPlaylist)
      .catch(() => setError(true));
  }, [hash]);

  if (error) return <div className="shared-error">Playlist not found.</div>;
  if (!playlist) return <div className="loading">Loading…</div>;

  return (
    <div className="shared-view">
      <h1 className="shared-title">{playlist.name}</h1>
      <p className="shared-count">{playlist.songs.length} tracks</p>
      <div className="shared-songs">
        {playlist.songs.map((s) => (
          <a
            key={s.id}
            className="shared-song"
            href={
              s.source === 'youtube'
                ? `https://www.youtube.com/watch?v=${s.track_id}`
                : `https://open.spotify.com/track/${s.track_id}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="ss-thumb" src={s.thumbnail_url} alt="" loading="lazy" />
            <div className="ss-info">
              <div className="ss-title">{s.title}</div>
              <div className="ss-artist">{s.artist}</div>
            </div>
            <span
              className="ss-source"
              style={{ color: s.source === 'youtube' ? '#ff4e4e' : '#1db954' }}
            >
              {s.source === 'youtube' ? 'YouTube' : 'Spotify'}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
