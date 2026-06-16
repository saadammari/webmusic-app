import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SharedPlaylist from './pages/SharedPlaylist';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <Link to="/" className="app-logo">WebMusic</Link>
          <span className="app-tagline">Mix YouTube &amp; Spotify into one playlist</span>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/p/:hash" element={<SharedPlaylist />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
