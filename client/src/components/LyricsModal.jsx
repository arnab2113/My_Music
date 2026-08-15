import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, FileText } from 'lucide-react';
import { toggleLyrics } from '../store/playerSlice';

export default function LyricsModal() {
  const dispatch = useDispatch();
  const { currentSong, isLyricsOpen } = useSelector((state) => state.player);

  if (!isLyricsOpen || !currentSong) return null;

  const lines = currentSong.lyrics ? currentSong.lyrics.split('\n') : ['(No lyrics available for this song)'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-borderCustom p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-borderCustom">
          <div className="flex items-center space-x-3">
            {currentSong.coverUrl && (
              <img src={currentSong.coverUrl} alt="Cover" className="w-10 h-10 rounded-lg object-cover" />
            )}
            <div>
              <h3 className="font-serif font-bold text-base text-textPrimary">{currentSong.title}</h3>
              <p className="text-xs text-textSecondary">{currentSong.artistName}</p>
            </div>
          </div>
          <button onClick={() => dispatch(toggleLyrics())} className="p-1.5 rounded-full text-textSecondary hover:text-textPrimary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto space-y-4 text-center font-serif text-base md:text-lg text-textPrimary/90 leading-relaxed pr-2">
          {lines.map((line, idx) => (
            <p key={idx} className="hover:text-accent transition-colors duration-200 cursor-pointer">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
