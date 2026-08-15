import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Check, Palette, Sparkles, Sliders } from 'lucide-react';
import { THEMES } from '../themes/themeSystem';
import { setTheme, setCustomAccent, setParticleMode, toggleThemeDrawer } from '../store/themeSlice';

const ACCENT_PRESETS = [
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Cyan Rain', hex: '#06b6d4' },
  { name: 'Cyber Pink', hex: '#ec4899' },
  { name: 'Emerald Forest', hex: '#10b981' },
  { name: 'Crimson Sunset', hex: '#f97316' },
  { name: 'Indigo Nebula', hex: '#6366f1' }
];

export default function ThemeDrawer() {
  const dispatch = useDispatch();
  const { currentThemeId, customAccent, particleMode, isThemeDrawerOpen } = useSelector((state) => state.theme);

  if (!isThemeDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md h-full glass-panel border-l border-borderCustom p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-borderCustom">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-accent" />
              <h2 className="font-serif font-bold text-lg text-textPrimary">Theme & Atmosphere</h2>
            </div>
            <button
              onClick={() => dispatch(toggleThemeDrawer())}
              className="p-1.5 rounded-full text-textSecondary hover:text-textPrimary hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Presets */}
          <div className="mt-6 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-textSecondary">Select Theme (10 Presets)</h3>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => {
                const isSelected = currentThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => dispatch(setTheme(theme.id))}
                    className={`p-3 rounded-xl cursor-pointer border transition-all duration-300 ${
                      isSelected
                        ? 'border-accent shadow-lg shadow-accentGlow bg-white/10'
                        : 'border-borderCustom hover:border-accent/50 bg-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-xs text-textPrimary">{theme.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                    </div>
                    {/* Color Swatch Preview */}
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.bgPrimary }} />
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.bgSurface }} />
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.accent }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accent Color Presets */}
          <div className="mt-8 space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-textSecondary">Accent Glow Color</h3>
            <div className="flex items-center space-x-3">
              {ACCENT_PRESETS.map((acc) => (
                <button
                  key={acc.hex}
                  onClick={() => dispatch(setCustomAccent(acc.hex))}
                  className={`w-7 h-7 rounded-full transition-transform border ${
                    customAccent === acc.hex ? 'scale-125 border-white ring-2 ring-accent' : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: acc.hex }}
                  title={acc.name}
                />
              ))}
            </div>
          </div>

          {/* Particle Density */}
          <div className="mt-8 space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-textSecondary">Atmospheric Particles</h3>
            <div className="flex space-x-2">
              {['dust', 'stars', 'rain', 'fireflies', 'none'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => dispatch(setParticleMode(mode))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize border transition-all ${
                    particleMode === mode ? 'bg-accent text-black font-bold border-accent' : 'bg-black/40 text-textSecondary border-borderCustom'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-borderCustom text-center text-xs text-textSecondary font-mono">
          Preferences automatically saved
        </div>
      </div>
    </div>
  );
}
