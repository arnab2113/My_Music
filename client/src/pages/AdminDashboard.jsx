import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Music, Radio, User, Plus, Trash2, Play, BarChart2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { addToast } from '../store/uiSlice';
import { setQueue, setIsPlaying } from '../store/playerSlice';
import { toggleAuthModal, logout } from '../store/authSlice';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [stations, setStations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states for creating new song
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songGenre, setSongGenre] = useState('Bengali 90s Classics');
  const [songLanguage, setSongLanguage] = useState('Bengali');
  const [songAudioUrl, setSongAudioUrl] = useState('');
  const [songCoverUrl, setSongCoverUrl] = useState('');
  const [targetStation, setTargetStation] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleGenreChange = (g) => {
    setSongGenre(g);
    if (g.includes('Bengali')) setSongLanguage('Bengali');
    else if (g.includes('Bhojpuri')) setSongLanguage('Bhojpuri');
    else if (g.includes('Instrumental')) setSongLanguage('Instrumental');
    else setSongLanguage('Hindi');
  };

  const handleClearAllSongs = async () => {
    if (window.confirm('Clear all default demo songs? You can now add your own custom songs archive.')) {
      try {
        await api.delete('/songs/clear/all');
        setSongs([]);
        dispatch(addToast({ message: 'Default demo songs cleared! Ready for custom songs.', type: 'info' }));
      } catch (err) {
        dispatch(addToast({ message: 'Failed to clear songs', type: 'error' }));
      }
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (type === 'audio') {
        setSongAudioUrl(res.data.url);
        dispatch(addToast({ message: `Audio file "${file.name}" uploaded successfully!`, type: 'success' }));
      } else {
        setSongCoverUrl(res.data.url);
        dispatch(addToast({ message: `Cover image uploaded successfully!`, type: 'success' }));
      }
    } catch (err) {
      dispatch(addToast({ message: 'File upload failed. Please try again.', type: 'error' }));
    } finally {
      setUploading(false);
    }
  };

  // Form states for creating radio station
  const [stationName, setStationName] = useState('');
  const [stationLanguage, setStationLanguage] = useState('Hindi');
  const [stationGenre, setStationGenre] = useState('90s Classics');
  const [stationDesc, setStationDesc] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, stRes, aRes] = await Promise.all([
        api.get('/songs'),
        api.get('/radio'),
        api.get('/stats/admin')
      ]);
      setSongs(sRes.data);
      setStations(stRes.data);
      setAnalytics(aRes.data);
    } catch (err) {
      console.error('Admin data load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen pt-36 text-center space-y-4 px-4">
        <Shield className="w-14 h-14 md:w-16 md:h-16 text-red-500 mx-auto" />
        <h2 className="font-serif font-bold text-xl md:text-2xl text-textPrimary">Admin Access Restricted</h2>
        <p className="text-xs md:text-sm text-textSecondary font-sans">You must be logged in with administrator privileges.</p>
        <button
          onClick={() => dispatch(toggleAuthModal('login'))}
          className="px-6 py-2.5 rounded-full bg-accent text-black font-bold text-xs shadow-lg shadow-accentGlow hover:bg-amber-400 transition-all"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  const handleCreateSong = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!songTitle.trim() || !songArtist.trim()) {
      setErrorMsg('Song Title and Artist Name are required fields.');
      return;
    }

    try {
      const res = await api.post('/songs', {
        title: songTitle,
        artistName: songArtist,
        genre: songGenre,
        language: songLanguage,
        audioUrl: songAudioUrl,
        coverUrl: songCoverUrl,
        stationId: targetStation
      });

      setSongs([res.data, ...songs]);
      setSongTitle('');
      setSongArtist('');
      setSongAudioUrl('');
      setSongCoverUrl('');
      dispatch(addToast({ message: `"${res.data.title}" added to archive!`, type: 'success' }));
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(logout());
        dispatch(toggleAuthModal('login'));
        dispatch(addToast({ message: 'Session expired. Please sign in as Admin again.', type: 'error' }));
        return;
      }
      const msg = err.response?.data?.message || 'Failed to add song';
      setErrorMsg(msg);
      dispatch(addToast({ message: msg, type: 'error' }));
    }
  };

  const handleDeleteSong = async (id, title) => {
    try {
      await api.delete(`/songs/${id}`);
      setSongs(songs.filter((s) => s._id !== id));
      dispatch(addToast({ message: `Removed "${title}" from archive`, type: 'info' }));
    } catch (err) {
      dispatch(addToast({ message: 'Failed to delete song', type: 'error' }));
    }
  };

  const handleCreateStation = async (e) => {
    e.preventDefault();
    if (!stationName.trim()) return;

    try {
      const slug = stationName.toLowerCase().replace(/\s+/g, '-');
      const res = await api.post('/radio', {
        name: stationName,
        slug,
        language: stationLanguage,
        genre: stationGenre,
        description: stationDesc || 'Custom Radio Stream'
      });
      setStations([...stations, res.data]);
      setStationName('');
      setStationDesc('');
      dispatch(addToast({ message: `Station "${res.data.name}" created!`, type: 'success' }));
    } catch (err) {
      dispatch(addToast({ message: 'Failed to create station', type: 'error' }));
    }
  };

  const handleDeleteStation = async (id, name) => {
    try {
      await api.delete(`/radio/${id}`);
      setStations(stations.filter((st) => st._id !== id));
      dispatch(addToast({ message: `Station "${name}" deleted`, type: 'info' }));
    } catch (err) {
      dispatch(addToast({ message: 'Failed to delete station', type: 'error' }));
    }
  };

  const handlePlaySong = (song) => {
    dispatch(setQueue({ songs: [song], startIndex: 0 }));
    dispatch(setIsPlaying(true));
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-44 md:pb-32 max-w-7xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8">
      {/* Admin Header Banner */}
      <div className="glass-panel p-5 md:p-6 rounded-3xl border border-red-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-center md:text-left">
          <Shield className="w-7 h-7 md:w-8 md:h-8 text-red-400 shrink-0" />
          <div>
            <h1 className="font-serif font-extrabold text-xl md:text-2xl text-textPrimary">Nostalgia FM Admin Control</h1>
            <p className="text-[11px] md:text-xs text-textSecondary font-mono">Manage audio archive, station broadcasts, and platform analytics.</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-1.5 sm:space-x-2 bg-black/50 p-1 rounded-2xl border border-borderCustom text-[11px] md:text-xs font-mono max-w-full overflow-x-auto">
          {[
            { id: 'songs', label: 'Songs' },
            { id: 'stations', label: 'Stations' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-accent text-black shadow-lg shadow-accentGlow'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Summary Bar */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="p-4 md:p-5 rounded-2xl glass-card text-center">
            <span className="font-serif font-extrabold text-2xl md:text-3xl text-accent">{songs.length}</span>
            <p className="text-[10px] uppercase font-mono text-textSecondary mt-1">Total Songs</p>
          </div>
          <div className="p-4 md:p-5 rounded-2xl glass-card text-center">
            <span className="font-serif font-extrabold text-2xl md:text-3xl text-accent">{stations.length}</span>
            <p className="text-[10px] uppercase font-mono text-textSecondary mt-1">Radio Stations</p>
          </div>
          <div className="p-4 md:p-5 rounded-2xl glass-card text-center">
            <span className="font-serif font-extrabold text-2xl md:text-3xl text-accent">{analytics.totalUsers || 2}</span>
            <p className="text-[10px] uppercase font-mono text-textSecondary mt-1">Registered Users</p>
          </div>
          <div className="p-4 md:p-5 rounded-2xl glass-card text-center">
            <span className="font-serif font-extrabold text-2xl md:text-3xl text-accent">{analytics.totalPlays || 48}</span>
            <p className="text-[10px] uppercase font-mono text-textSecondary mt-1">Total Audio Plays</p>
          </div>
        </div>
      )}

      {/* TAB 1: SONGS MANAGEMENT */}
      {activeTab === 'songs' && (
        <div className="space-y-6">
          {/* Create Song Form */}
          <form onSubmit={handleCreateSong} className="p-5 md:p-6 rounded-3xl glass-panel space-y-4 border border-borderCustom shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h3 className="font-serif font-bold text-base md:text-lg text-textPrimary flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" /> Add New Song to Archive
              </h3>
              <span className="text-[11px] font-mono text-textSecondary">Royalty-free audio stream or MP3 URL</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div>
                <label className="block text-[11px] uppercase font-mono text-textSecondary mb-1">Song Title *</label>
                <input
                  type="text"
                  required
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="e.g. Barbaadiyan"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono text-textSecondary mb-1">Artist Name *</label>
                <input
                  type="text"
                  required
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  placeholder="e.g. Sachet T, Nikhita Gandhi"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono text-textSecondary mb-1">Genre & Language</label>
                <select
                  value={songGenre}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-borderCustom text-xs text-accent focus:outline-none focus:border-accent font-bold cursor-pointer shadow-inner"
                >
                  <option value="Bengali 90s Classics" className="bg-zinc-900 text-amber-100 font-sans py-2">Bengali 90s Classics (Bengali)</option>
                  <option value="Bhojpuri Top Hits" className="bg-zinc-900 text-amber-100 font-sans py-2">Bhojpuri Top Hits (Bhojpuri)</option>
                  <option value="Hindi 90s Classics" className="bg-zinc-900 text-amber-100 font-sans py-2">Hindi 90s Classics (Hindi)</option>
                  <option value="80s Retro" className="bg-zinc-900 text-amber-100 font-sans py-2">80s Retro (Hindi)</option>
                  <option value="Romantic Nights" className="bg-zinc-900 text-amber-100 font-sans py-2">Romantic Nights (Hindi)</option>
                  <option value="Soft Instrumentals" className="bg-zinc-900 text-amber-100 font-sans py-2">Soft Instrumentals (Instrumental)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono text-textSecondary mb-1">Target Station Section</label>
                <select
                  value={targetStation}
                  onChange={(e) => setTargetStation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent cursor-pointer shadow-inner"
                >
                  <option value="" className="bg-zinc-900 text-amber-100 font-sans py-2">Auto Link by Genre/Language</option>
                  {stations.map((st) => (
                    <option key={st._id} value={st._id} className="bg-zinc-900 text-amber-100 font-sans py-2">
                      {st.name} ({st.language})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-[11px] uppercase font-mono text-textSecondary block mb-1">
                  Audio Stream / File URL (MP3/WAV link or YouTube link)
                </label>
                <input
                  type="text"
                  value={songAudioUrl}
                  onChange={(e) => setSongAudioUrl(e.target.value)}
                  placeholder="https://example.com/song.mp3 or YouTube link"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent"
                />
                <div className="mt-1.5 flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono text-accent border border-accent/30 transition-all flex items-center gap-1.5">
                    <span>📁 Upload MP3 / Audio File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'audio')}
                      disabled={uploading}
                    />
                  </label>
                  {uploading && <span className="text-[10px] font-mono text-amber-400 animate-pulse">Uploading file...</span>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono text-textSecondary mb-1">Cover Image URL (Optional)</label>
                <input
                  type="text"
                  value={songCoverUrl}
                  onChange={(e) => setSongCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent"
                />
                <div className="mt-1.5 flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono text-textSecondary hover:text-textPrimary border border-borderCustom transition-all flex items-center gap-1.5">
                    <span>🖼️ Upload Artwork Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'cover')}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-accent text-black font-bold text-xs shadow-lg shadow-accentGlow hover:bg-amber-400 transition-all"
            >
              Add Song to Archive
            </button>
          </form>

          {/* Song Catalog Table */}
          <div className="p-5 md:p-6 rounded-3xl glass-panel overflow-x-auto border border-borderCustom">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <h4 className="font-serif font-bold text-base text-textPrimary">Current Songs Archive ({songs.length})</h4>
              {songs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllSongs}
                  className="px-3 py-1.5 rounded-xl bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-800 text-[11px] font-mono transition-all"
                >
                  🗑️ Clear All Demo Songs
                </button>
              )}
            </div>
            <table className="w-full text-left text-xs font-sans min-w-[500px]">
              <thead>
                <tr className="border-b border-borderCustom text-textSecondary uppercase font-mono">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Artist</th>
                  <th className="pb-3">Genre</th>
                  <th className="pb-3">Language</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderCustom/40">
                {songs.map((song) => (
                  <tr key={song._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-serif font-bold text-textPrimary flex items-center space-x-3">
                      <img src={song.coverUrl} alt={song.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <span className="truncate max-w-[140px] md:max-w-xs">{song.title}</span>
                    </td>
                    <td className="py-3 text-textSecondary truncate max-w-[100px]">{song.artistName}</td>
                    <td className="py-3 text-accent font-mono truncate">{song.genre}</td>
                    <td className="py-3 text-textSecondary font-bold">{song.language}</td>
                    <td className="py-3 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => handlePlaySong(song)}
                        className="p-1.5 rounded-lg bg-accent/20 text-accent hover:bg-accent hover:text-black transition-colors"
                        title="Test Play"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song._id, song.title)}
                        className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900 transition-colors"
                        title="Delete Song"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STATIONS MANAGEMENT */}
      {activeTab === 'stations' && (
        <div className="space-y-6">
          {/* Create Station Form */}
          <form onSubmit={handleCreateStation} className="p-5 md:p-6 rounded-3xl glass-panel space-y-4 border border-borderCustom">
            <h3 className="font-serif font-bold text-base md:text-lg text-textPrimary flex items-center gap-2">
              <Radio className="w-5 h-5 text-accent" /> Create New Radio Station
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <input
                type="text"
                required
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="Station Name (e.g. 90s Love Hits)"
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent"
              />
              <select
                value={stationLanguage}
                onChange={(e) => setStationLanguage(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent cursor-pointer shadow-inner"
              >
                <option value="Hindi" className="bg-zinc-900 text-amber-100 font-sans py-2">Hindi</option>
                <option value="Bengali" className="bg-zinc-900 text-amber-100 font-sans py-2">Bengali</option>
                <option value="Bhojpuri" className="bg-zinc-900 text-amber-100 font-sans py-2">Bhojpuri</option>
                <option value="English" className="bg-zinc-900 text-amber-100 font-sans py-2">English</option>
                <option value="Instrumental" className="bg-zinc-900 text-amber-100 font-sans py-2">Instrumental</option>
              </select>
              <input
                type="text"
                value={stationDesc}
                onChange={(e) => setStationDesc(e.target.value)}
                placeholder="Station Description"
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-xs text-textPrimary focus:outline-none focus:border-accent"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-accent text-black font-bold text-xs shadow-md shadow-accentGlow">
              Create Station
            </button>
          </form>

          {/* Stations List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {stations.map((st) => (
              <div key={st._id} className="p-5 rounded-2xl glass-card flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/40">
                      {st.language}
                    </span>
                    <button onClick={() => handleDeleteStation(st._id, st.name)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-serif font-bold text-base md:text-lg text-textPrimary">{st.name}</h4>
                  <p className="text-xs text-textSecondary font-sans mt-1 line-clamp-2">{st.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="p-5 md:p-6 rounded-3xl glass-panel border border-borderCustom space-y-6">
          <h3 className="font-serif font-bold text-lg md:text-xl text-textPrimary flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-accent" /> Platform Listening Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-4 rounded-2xl bg-black/40 border border-borderCustom space-y-3">
              <h4 className="font-serif font-bold text-sm text-textPrimary">Top Stations by Live Activity</h4>
              {stations.map((s) => (
                <div key={s._id} className="flex justify-between text-xs font-mono p-2 rounded bg-white/5">
                  <span className="text-textPrimary truncate">{s.name}</span>
                  <span className="text-emerald-400 font-bold shrink-0">{s.listenerCount || 42} Listeners</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-borderCustom space-y-3">
              <h4 className="font-serif font-bold text-sm text-textPrimary">Top Played Track Archive</h4>
              {songs.slice(0, 5).map((s) => (
                <div key={s._id} className="flex justify-between text-xs font-mono p-2 rounded bg-white/5">
                  <span className="text-textPrimary truncate max-w-[180px] md:max-w-[200px]">{s.title}</span>
                  <span className="text-accent shrink-0">{s.playsCount || 12} Plays</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
