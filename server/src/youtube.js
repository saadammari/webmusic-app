import axios from 'axios';

export async function youtubeSearch(query) {
  const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      q: query,
      part: 'snippet',
      type: 'video',
      videoCategoryId: '10', // Music category
      maxResults: 10,
    },
  });

  return data.items.map((item) => ({
    source: 'youtube',
    trackId: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
}
