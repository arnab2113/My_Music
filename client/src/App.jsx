import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import MobileNavigation from './components/MobileNavigation';
import PersistentPlayer from './components/PersistentPlayer';
import ThemeDrawer from './components/ThemeDrawer';
import AmbientMixerModal from './components/AmbientMixerModal';
import LyricsModal from './components/LyricsModal';
import FullscreenPlayer from './components/FullscreenPlayer';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import ToastNotification from './components/ToastNotification';

import HomePage from './pages/HomePage';
import RadioPage from './pages/RadioPage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import PlaylistsPage from './pages/PlaylistsPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import AuthLandingPage from './pages/AuthLandingPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

import { applyThemeTokens } from './themes/themeSystem';
import { toggleHideUI, toggleKeyboardHelp } from './store/uiSlice';
import { setIsPlaying, toggleMute, setVolume, playNext, playPrevious, toggleFullscreen } from './store/playerSlice';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const dispatch = useDispatch();
  const { currentThemeId, customAccent } = useSelector((state) => state.theme);
  const { isPlaying, volume } = useSelector((state) => state.player);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Apply theme tokens on initial load & updates
  useEffect(() => {
    applyThemeTokens(currentThemeId, customAccent);
  }, [currentThemeId, customAccent]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture when typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
          audioEngine.pause();
          dispatch(setIsPlaying(false));
        } else {
          audioEngine.play();
          dispatch(setIsPlaying(true));
        }
      } else if (e.code === 'ArrowRight') {
        dispatch(playNext());
      } else if (e.code === 'ArrowLeft') {
        dispatch(playPrevious());
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        dispatch(setVolume(Math.min(1, volume + 0.1)));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        dispatch(setVolume(Math.max(0, volume - 0.1)));
      } else if (e.key === 'm' || e.key === 'M') {
        dispatch(toggleMute());
      } else if (e.key === 'f' || e.key === 'F') {
        dispatch(toggleFullscreen());
      } else if (e.key === 'u' || e.key === 'U') {
        dispatch(toggleHideUI());
      } else if (e.key === '?') {
        dispatch(toggleKeyboardHelp());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isPlaying, volume]);

  // 1. If NOT authenticated: Show ONLY the Auth Landing Page (no navbar, no player bar, no song section)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a060d] text-white">
        <AuthLandingPage />
        <ToastNotification />
      </div>
    );
  }

  // 2. Once Authenticated: Show Full Application with Navbar, Player, and all Features
  return (
    <Router>
      <div className="relative min-h-screen bg-bgPrimary text-textPrimary transition-colors duration-500 font-sans">
        <Header />
        <MobileNavigation />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/radio" element={<RadioPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <PersistentPlayer />
        <ThemeDrawer />
        <AmbientMixerModal />
        <LyricsModal />
        <FullscreenPlayer />
        <KeyboardShortcutsModal />
        <ToastNotification />
      </div>
    </Router>
  );
}
