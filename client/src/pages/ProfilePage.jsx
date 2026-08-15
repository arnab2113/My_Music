import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, LogOut, BarChart3, Music, Camera, Upload, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { logout, setUser, toggleAuthModal } from '../store/authSlice';
import { setQueue, setIsPlaying } from '../store/playerSlice';
import { addToast } from '../store/uiSlice';
import api from '../services/api';
import SongListView from '../components/SongListView';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, favorites } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [userSongs, setUserSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);

  // Edit Avatar states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Real-Time Listening Statistics Polling (fetches live updates every 3 seconds while on profile)
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStats = () => {
      api.get('/stats/user')
        .then((res) => setStats(res.data))
        .catch(() => {});
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Fetch Songs collection
  useEffect(() => {
    if (!isAuthenticated) return;

    api.get('/favorites')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setUserSongs(res.data);
        } else {
          return api.get('/songs').then((sRes) => setUserSongs(sRes.data));
        }
      })
      .catch(() => {
        api.get('/songs').then((sRes) => setUserSongs(sRes.data)).catch(() => {});
      })
      .finally(() => setLoadingSongs(false));
  }, [isAuthenticated]);

  const handlePlaySong = (song, index) => {
    dispatch(setQueue({ songs: userSongs, startIndex: index }));
    dispatch(setIsPlaying(true));
  };

  const handleToggleFavorite = async (songId) => {
    try {
      const res = await api.post('/favorites/toggle', { songId });
      dispatch(
        addToast({
          message: res.data.isFavorite ? 'Added to Favorites!' : 'Removed from Favorites',
          type: 'success'
        })
      );
    } catch (err) {
      console.error('Favorite toggle error:', err);
    }
  };

  // Avatar Upload / Edit Handler
  const handleUpdateAvatar = async (newAvatarUrl) => {
    try {
      setUploadingAvatar(true);
      const res = await api.put('/auth/profile', { avatar: newAvatarUrl });
      dispatch(setUser(res.data));
      setShowAvatarModal(false);
      setAvatarUrlInput('');
      dispatch(addToast({ message: 'Profile picture updated successfully!', type: 'success' }));
    } catch (err) {
      dispatch(addToast({ message: 'Failed to update profile picture', type: 'error' }));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingAvatar(true);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await handleUpdateAvatar(res.data.url);
    } catch (err) {
      dispatch(addToast({ message: 'Image upload failed. Try another file.', type: 'error' }));
      setUploadingAvatar(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-36 text-center space-y-4 px-4">
        <User className="w-14 h-14 md:w-16 md:h-16 text-accent mx-auto animate-pulse" />
        <h2 className="font-serif font-bold text-xl md:text-2xl text-textPrimary">Sign In to View Profile & Songs</h2>
        <p className="text-xs md:text-sm text-textSecondary max-w-sm mx-auto">
          Sign in to access your personal profile, favorite songs archive, custom playlists, and listening statistics.
        </p>
        <button
          onClick={() => dispatch(toggleAuthModal('login'))}
          className="px-6 py-2.5 rounded-full bg-accent text-black font-bold text-xs md:text-sm shadow-lg shadow-accentGlow hover:bg-amber-400 transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  const currentAvatar = user?.avatar || '/default-avatar.png';

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-44 md:pb-32 max-w-5xl mx-auto px-4 md:px-8 space-y-8">
      {/* Profile Header Card */}
      <div className="glass-panel p-5 md:p-8 rounded-3xl border border-borderCustom flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 min-w-0">
          
          {/* Editable Profile Picture */}
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
            <img
              src={currentAvatar}
              alt={user.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-accent shadow-xl shadow-accentGlow/50 group-hover:opacity-80 transition-all"
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
            />
            {/* Camera Overlay Icon */}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
              <Camera className="w-6 h-6 text-accent animate-bounce" />
              <span className="text-[9px] font-mono font-bold mt-1">Edit Photo</span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-textPrimary truncate">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-mono text-[10px] uppercase font-bold border border-accent/40 shrink-0">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-textSecondary font-mono mt-1 truncate">{user.email}</p>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="mt-2 text-[11px] font-mono text-accent hover:underline flex items-center gap-1 mx-auto sm:mx-0"
            >
              <Camera className="w-3.5 h-3.5" /> Change Profile Picture
            </button>
          </div>
        </div>

        <button
          onClick={() => dispatch(logout())}
          className="px-4 py-2.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/60 hover:bg-red-900 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all shadow-md"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Real-Time Detectable Listening Statistics */}
      {stats && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-borderCustom/60 pb-2">
            <h2 className="font-serif font-bold text-lg md:text-xl text-textPrimary flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent animate-pulse" /> Real-Time Listening Statistics
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Detecting
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <div className="p-4 md:p-5 rounded-2xl glass-card text-center border border-borderCustom/60 hover:border-accent transition-colors">
              <span className="font-serif font-extrabold text-3xl md:text-4xl text-accent">{stats.totalPlays || 0}</span>
              <p className="text-[10px] md:text-[11px] uppercase font-mono text-textSecondary mt-1">Songs Played</p>
            </div>

            <div className="p-4 md:p-5 rounded-2xl glass-card text-center border border-borderCustom/60 hover:border-accent transition-colors">
              <span className="font-serif font-extrabold text-3xl md:text-4xl text-accent">{stats.totalHours || '0.0'}H</span>
              <p className="text-[10px] md:text-[11px] uppercase font-mono text-textSecondary mt-1">Listening Time</p>
            </div>

            <div className="p-4 md:p-5 rounded-2xl glass-card text-center border border-borderCustom/60 hover:border-accent transition-colors">
              <span className="font-serif font-extrabold text-base md:text-lg text-accent truncate block mt-1">{stats.favoriteGenre || 'Bengali 90s'}</span>
              <p className="text-[10px] md:text-[11px] uppercase font-mono text-textSecondary mt-1">Top Genre</p>
            </div>

            <div className="p-4 md:p-5 rounded-2xl glass-card text-center border border-borderCustom/60 hover:border-accent transition-colors">
              <span className="font-serif font-extrabold text-base md:text-lg text-accent truncate block mt-1">{stats.favoriteEra || '90s'}</span>
              <p className="text-[10px] md:text-[11px] uppercase font-mono text-textSecondary mt-1">Favorite Era</p>
            </div>
          </div>
        </div>
      )}

      {/* Songs Section After Login */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-borderCustom/60 pb-3">
          <div className="flex items-center space-x-2">
            <Music className="w-5 h-5 text-accent" />
            <h2 className="font-serif font-bold text-xl md:text-2xl text-textPrimary tracking-wide">
              Your Personal Songs Collection
            </h2>
          </div>
          <span className="text-xs font-mono text-textSecondary uppercase">
            {userSongs.length} Tracks Available
          </span>
        </div>

        {loadingSongs ? (
          <p className="text-center font-mono text-accent text-xs animate-pulse py-8">Loading your songs collection...</p>
        ) : userSongs.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl p-6 space-y-2">
            <p className="font-serif font-bold text-base text-textPrimary">No songs in your collection yet.</p>
            <p className="text-xs text-textSecondary">Add songs from the Explore or Home page to build your personal archive!</p>
          </div>
        ) : (
          <SongListView
            songs={userSongs}
            onPlaySong={handlePlaySong}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      {/* Edit Profile Picture Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-borderCustom space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-borderCustom">
              <h3 className="font-serif font-bold text-lg text-textPrimary flex items-center gap-2">
                <Camera className="w-5 h-5 text-accent" /> Edit Profile Picture
              </h3>
              <button onClick={() => setShowAvatarModal(false)} className="text-textSecondary hover:text-textPrimary font-mono text-sm">
                ✕
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src={avatarUrlInput || currentAvatar}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-accent shadow-xl shadow-accentGlow"
                onError={(e) => { e.target.src = '/default-avatar.png'; }}
              />
              <span className="text-[11px] font-mono text-textSecondary">Image Preview</span>
            </div>

            {/* Option 1: File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-textSecondary">Option 1: Upload from Device</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="w-full py-2.5 rounded-xl bg-white/10 border border-borderCustom hover:border-accent text-xs font-semibold text-textPrimary flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-accent" />
                <span>{uploadingAvatar ? 'Uploading image...' : 'Choose Image File'}</span>
              </button>
            </div>

            {/* Option 2: Image URL */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-textSecondary">Option 2: Image Web URL</label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={avatarUrlInput}
                  onChange={(e) => setAvatarUrlInput(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent"
                />
                <button
                  onClick={() => avatarUrlInput.trim() && handleUpdateAvatar(avatarUrlInput.trim())}
                  disabled={!avatarUrlInput.trim() || uploadingAvatar}
                  className="px-4 py-2 rounded-xl bg-accent text-black font-bold text-xs shadow-md shadow-accentGlow hover:bg-amber-400 transition-all disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Option 3: Reset to Default App Logo Avatar */}
            <div className="pt-2 border-t border-borderCustom/60">
              <button
                onClick={() => handleUpdateAvatar('/default-avatar.png')}
                disabled={uploadingAvatar}
                className="w-full py-2 rounded-xl bg-black/40 text-textSecondary hover:text-accent border border-borderCustom text-xs font-mono flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-accent" />
                <span>Reset to Default Vintage Radio Avatar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
