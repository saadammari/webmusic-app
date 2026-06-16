import axios from 'axios';

let token = null;
let tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const { data } = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    { headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  token = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return token;
}

export async function spotifySearch(query) {
  const t = await getToken();
  const { data } = await axios.get('https://api.spotify.com/v1/search', {
    params: { q: query, type: 'track', limit: 10 },
    headers: { Authorization: `Bearer ${t}` },
  });

  return data.tracks.items.map((item) => ({
    source: 'spotify',
    trackId: item.id,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(', '),
    thumbnail: item.album.images[1]?.url || item.album.images[0]?.url || '',
    url: item.external_urls.spotify,
  }));
}
