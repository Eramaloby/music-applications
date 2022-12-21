import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/home';
import AboutPage from '../pages/about/about';
import RankingNeuralNetworkPage from '../pages/networks/ranking-network';
import { LyricsGeneratorNetwork } from '../pages/networks/generator-network';
import SearchPageDb from '../pages/search/search-db';
import SearchWebPage from '../pages/search/search-web';
import SpotifyContentPage from '../pages/spotify-content/spotify-content';

import './navbar-styles.scss';

function ApplicationRouter() {
  return (
    <div className="router-wrapper">
      <div className="navbar-wrapper">
        <BrowserRouter>
          <div className="navbar-links">
            <Link className="router-link" to="/">
              Home
            </Link>
            <Link className="router-link" to="/ranking">
              Ranking Neural Network
            </Link>
            <Link className="router-link" to="/lyrics-generator">
              Lyrics generator network
            </Link>
            <Link className="router-link" to="/search">
              Explore graph base
            </Link>
            <Link className="router-link" to="/search-web">
              Explore web
            </Link>
            <Link className="router-link" to="/about">
              About
            </Link>
          </div>
          <Routes>
            <Route
              path="/lyrics-generator"
              element={<LyricsGeneratorNetwork />}
            ></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/about" element={<AboutPage />}></Route>
            <Route
              path="/ranking"
              element={<RankingNeuralNetworkPage />}
            ></Route>
            <Route path="/search" element={<SearchPageDb />}></Route>
            <Route path="/search-web" element={<SearchWebPage />}></Route>
            <Route path="/:type/:id" element={<SpotifyContentPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default ApplicationRouter;
