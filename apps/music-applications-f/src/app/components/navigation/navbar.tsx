import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from '../../pages/home/home';
import AboutPage from '../../pages/about/about';
import RankingNeuralNetworkPage from '../../pages/networks/ranking-network';
import LyricsGeneratorNetwork from '../../pages/networks/generator-network';
import SearchPageDb from '../../pages/search/search-db';
import SearchWebPage from '../../pages/search/search-web';
import SpotifyContentPage from '../../pages/spotify-content/spotify-content';

import './navbar-styles.scss';
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import Profile from '../../pages/profile/profile.component';
import SignUpPage from '../../pages/sign-up/sign-up';
import { SignInPage } from '../../pages/sign-in/sign-in';
import DatabaseItemPage from '../view-pages/database-pages/item-view';
import ForeignProfile from '../../pages/foreign-profile/foreign-profile.component';
import ChangePasswordPage from '../../pages/change-password-page/change-password.component';
import AddItemPage from '../../pages/add-item-page/add-item-section.component';

const ApplicationRouter = () => {
  const { currentUser, signOut } = useContext(UserContext);

  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const router = useNavigate();

  return (
    <>
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
          <div className="router-link profile-page-icon">
            <img
              src={currentUser.profileImageBase64}
              alt="profile-page-icon"
              onClick={() => setProfileMenuVisible(!profileMenuVisible)}
            ></img>
          </div>
        ) : (
          <Link to="/signin" className="router-link">
            Sign in
          </Link>
        )}
      </div>
      <div className="main-content">
        <Routes>
          <Route
            path="/lyrics-generator"
            element={<LyricsGeneratorNetwork />}
          ></Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/about" element={<AboutPage />}></Route>
          <Route path="/ranking" element={<RankingNeuralNetworkPage />}></Route>
          <Route path="/search" element={<SearchPageDb />}></Route>
          <Route path="/search-web" element={<SearchWebPage />}></Route>
          <Route path="web/:type/:id" element={<SpotifyContentPage />}></Route>
          <Route path="db/:type/:id" element={<DatabaseItemPage />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/profile/:username" element={<ForeignProfile />}></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/signin" element={<SignInPage />}></Route>
          <Route
            path="/change-password"
            element={<ChangePasswordPage />}
          ></Route>
          <Route path="/new-item" element={<AddItemPage />}></Route>
          {/* Add 404 page */}
          <Route path="*" element={<div>No page found</div>}></Route>
        </Routes>
      </div>

      {/* TODO: refactor to mouseenter/mouseleave events?  */}
      {profileMenuVisible && (
        <div className="profile-menu">
          <div className="profile-menu__link">Profile</div>
          <div
            className="profile-menu__link"
            onClick={() => router('/change-password')}
          >
            Change password
          </div>
          <div className="profile-menu__link" onClick={() => router('/new-item')}>Add new instance</div>
          <div className="profile-menu__link" onClick={signOut}>
            Sign out
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationRouter;
