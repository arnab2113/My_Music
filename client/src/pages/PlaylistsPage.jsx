import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListMusic, Plus, Play, Trash2 } from 'lucide-react';
import api from '../services/api';
import { setPlaylists } from '../store/playlistSlice';
import { setQueue, setIsPlaying } from '../store/playerSlice';
import { toggleAuthModal } from '../store/authSlice';
import { addToast } from '../store/uiSlice';

export default function PlaylistsPage() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { playlists } = useSelector((state) => state.playlist);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/playlists').then((res) => dispatch(setPlaylists(res.data)));
    }
  }, [isAuthenticated, dispatch]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      const res = await api.post('/playlists', { name: newPlaylistName });
      dispatch(setPlaylists([res.data, ...playlists]));
      setNewPlaylistName('');
      setIsCreating(false);
      dispatch(addToast({ message: 'Playlist created!', type: 'success' }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/playlists/${id}`);
      dispatch(setPlaylists(playlists.filter((p) => p._id !== id)));
      dispatch(addToast({ message: 'Playlist deleted', type: 'info' }));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlayPlaylist = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      dispatch(setQueue({ songs: playlist.songs, startIndex: 0 }));
      dispatch(setIsPlaying(true));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-36 text-center space-y-4 px-4">
        <ListMusic className="w-14 h-14 md:w-16 md:h-16 text-accent mx-auto" />
        <h2 className="font-serif font-bold text-xl md:text-2xl text-textPrimary">Sign In to Manage Custom Playlists</h2>
        <button
          onClick={() => dispatch(toggleAuthModal('login'))}
          className="px-6 py-2.5 rounded-full bg-accent text-black font-bold shadow-lg shadow-accentGlow text-xs md:text-sm"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-44 md:pb-32 max-w-7xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between border-b border-borderCustom/60 pb-4">
        <div className="flex items-center space-x-3">
          <ListMusic className="w-7 h-7 md:w-8 md:h-8 text-accent shrink-0" />
          <div>
            <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-textPrimary">Your Playlists</h1>
            <p className="text-xs md:text-sm text-textSecondary font-sans">Collect memories & custom song mixes.</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-3.5 py-2 rounded-full bg-accent text-black font-semibold text-xs flex items-center gap-1 shadow-md shadow-accentGlow shrink-0"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create Playlist</span><span className="sm:hidden">Create</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreatePlaylist} className="p-4 rounded-xl glass-panel flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist name (e.g. Late Night 90s)"
            className="w-full sm:flex-1 bg-black/40 border border-borderCustom px-4 py-2 rounded-lg text-sm text-textPrimary focus:outline-none focus:border-accent"
            autoFocus
          />
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button type="submit" className="px-4 py-2 rounded-lg bg-accent text-black text-xs font-bold">
              Save
            </button>
            <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 text-xs text-textSecondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {playlists.length === 0 ? (
        <div className="text-center py-16 space-y-2 glass-panel rounded-2xl p-8">
          <p className="font-serif font-bold text-lg text-textPrimary">No playlists created yet.</p>
          <p className="text-xs text-textSecondary font-sans">Create your first playlist and start collecting memories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {playlists.map((pl) => (
            <div
              key={pl._id}
              onClick={() => handlePlayPlaylist(pl)}
              className="group p-5 rounded-2xl glass-card cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent px-2 py-0.5 rounded bg-black/50">
                    {pl.songs?.length || 0} TRACKS
                  </span>
                  <button onClick={(e) => handleDelete(pl._id, e)} className="text-textSecondary hover:text-red-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-serif font-bold text-base md:text-lg text-textPrimary group-hover:text-accent transition-colors">
                  {pl.name}
                </h3>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="p-3 rounded-full bg-accent text-black font-bold group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
