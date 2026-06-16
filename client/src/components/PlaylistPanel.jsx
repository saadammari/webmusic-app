import { useState } from 'react';

export default function PlaylistPanel({ songs, onRemove, onSave, saving }) {
  const [name, setName] = useState('My Playlist');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSave() {
    const link = await onSave(name);
    setShareLink(link);
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="playlist-panel">
      <input
        className="playlist-name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Playlist name..."
      />
      <div className="playlist-songs">
        {songs.length === 0 && (
          <div className="empty-state">Add songs from the search results</div>
        )}
        {songs.map((s, i) => (
          <div className="playlist-song" key={`${s.source}-${s.trackId}-${i}`}>
            <img className="ps-thumb" src={s.thumbnail} alt="" />
            <div className="ps-info">
              <div className="ps-title">{s.title}</div>
              <div className="ps-artist">{s.artist}</div>
            </div>
            <span
              className="ps-source"
              style={{ color: s.source === 'youtube' ? '#ff4e4e' : '#1db954' }}
            >
              {s.source === 'youtube' ? 'YT' : 'SP'}
            </span>
            <button className="remove-btn" onClick={() => onRemove(i)}>×</button>
          </div>
        ))}
      </div>

      {!shareLink && (
        <>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={songs.length === 0 || saving}
          >
            {saving ? 'Saving…' : 'Save & Get Link'}
          </button>
          <p className="expiry-notice">Shared playlists expire after 7 days.</p>
        </>
      )}

      {shareLink && (
        <div className="share-box">
          <input className="share-input" value={shareLink} readOnly />
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
