import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/home/home';
import AboutPage from '../../pages/about/about';
import RankingNeuralNetworkPage from '../../pages/networks/ranking-network';
import LyricsGeneratorNetwork from '../../pages/networks/generator-network';
import SearchPageDb from '../../pages/search/search-db';
import SearchWebPage from '../../pages/search/search-web';
import SpotifyContentPage from '../../pages/spotify-content/spotify-content';

import './navbar-styles.scss';
import { useContext } from 'react';
import { UserContext, UserContextProvider } from '../../contexts/user.context';
import Profile from '../../pages/profile/profile.component';
import SignUpPage from '../../pages/sign-up/sign-up';
import { SignInPage } from '../../pages/sign-in/sign-in';

const ApplicationRouter = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="router-wrapper">
      <div className="navbar-wrapper">
        <BrowserRouter>
          <UserContextProvider>
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
              {currentUser ? (
                <Link to="/profile" className="router-link">
                  Profile
                </Link>
              ) : (
                <Link to="/signin" className="router-link">
                  Sign in
                </Link>
              )}
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
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/signup" element={<SignUpPage />}></Route>
              <Route path="/signin" element={<SignInPage />}></Route>
            </Routes>
          </UserContextProvider>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default ApplicationRouter;
