export default function TrackCard({ track, onAdd, added }) {
  const sourceColor = track.source === 'youtube' ? '#ff4e4e' : '#1db954';
  const sourceName = track.source === 'youtube' ? 'YT' : 'SP';

  return (
    <div className="track-card">
      <img className="track-thumb" src={track.thumbnail} alt="" loading="lazy" />
      <div className="track-info">
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist}</div>
      </div>
      <span className="track-source" style={{ color: sourceColor }}>{sourceName}</span>
      <button
        className={`add-btn ${added ? 'added' : ''}`}
        onClick={() => !added && onAdd(track)}
        disabled={added}
      >
        {added ? '✓' : '+'}
      </button>
    </div>
  );
}
