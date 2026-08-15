import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Volume2, CloudRain, Coffee, Flame, Disc, Waves, Trees, Building, VolumeX } from 'lucide-react';
import { toggleAmbienceModal, setAmbienceVolumeState } from '../store/ambienceSlice';
import { audioEngine } from '../services/audioEngine';

const AMBIENT_CHANNELS = [
  { id: 'rain', name: 'Gentle Rain', icon: CloudRain },
  { id: 'cafe', name: 'Midnight Café', icon: Coffee },
  { id: 'fireplace', name: 'Warm Fireplace', icon: Flame },
  { id: 'vinyl', name: 'Vinyl Hiss & Crackle', icon: Disc },
  { id: 'ocean', name: 'Ocean Waves', icon: Waves },
  { id: 'forest', name: 'Midnight Forest', icon: Trees },
  { id: 'city', name: 'Night City Traffic', icon: Building }
];

export default function AmbientMixerModal() {
  const dispatch = useDispatch();
  const { isAmbienceModalOpen, volumes } = useSelector((state) => state.ambience);

  if (!isAmbienceModalOpen) return null;

  const handleVolumeChange = (soundId, volume) => {
    dispatch(setAmbienceVolumeState({ soundId, volume }));
    audioEngine.setAmbientVolume(soundId, volume);
  };

  const handleMuteAll = () => {
    audioEngine.stopAllAmbient();
    AMBIENT_CHANNELS.forEach((c) => {
      dispatch(setAmbienceVolumeState({ soundId: c.id, volume: 0 }));
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-borderCustom p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-borderCustom">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-accent" />
            <h2 className="font-serif font-bold text-lg text-textPrimary">Ambient Sound Mixer</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMuteAll}
              className="px-2.5 py-1 rounded-md bg-red-950/60 text-red-400 border border-red-800/40 text-xs font-mono flex items-center gap-1 hover:bg-red-900"
            >
              <VolumeX className="w-3.5 h-3.5" />
              Mute All
            </button>
            <button
              onClick={() => dispatch(toggleAmbienceModal())}
              className="p-1.5 rounded-full text-textSecondary hover:text-textPrimary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ambient Channels List */}
        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {AMBIENT_CHANNELS.map((channel) => {
            const IconComponent = channel.icon;
            const vol = volumes[channel.id] || 0;
            return (
              <div key={channel.id} className="p-3 rounded-xl bg-black/40 border border-borderCustom/60 flex items-center space-x-4">
                <div className={`p-2.5 rounded-lg border ${vol > 0 ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-borderCustom text-textSecondary'}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-textPrimary">{channel.name}</span>
                    <span className="font-mono text-accent">{Math.round(vol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={vol}
                    onChange={(e) => handleVolumeChange(channel.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-textSecondary font-sans">
          Ambient sound levels are mixed independently alongside your playing music track.
        </p>
      </div>
    </div>
  );
}
