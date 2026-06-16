import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const PLAYLIST_TTL_DAYS = parseInt(process.env.PLAYLIST_TTL_DAYS || '7', 10);

export async function cleanupOldPlaylists() {
  const [result] = await pool.execute(
    'DELETE FROM playlists WHERE created_at < NOW() - INTERVAL ? DAY',
    [PLAYLIST_TTL_DAYS]
  );
  if (result.affectedRows > 0) {
    console.log(`Cleaned up ${result.affectedRows} expired playlist(s)`);
  }
}

export async function initDb() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS playlists (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hash CHAR(36) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS playlist_songs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      playlist_hash CHAR(36) NOT NULL,
      source ENUM('youtube','spotify') NOT NULL,
      track_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      artist VARCHAR(255),
      thumbnail_url TEXT,
      position INT NOT NULL DEFAULT 0,
      FOREIGN KEY (playlist_hash) REFERENCES playlists(hash) ON DELETE CASCADE
    )
  `);
}

export default pool;
