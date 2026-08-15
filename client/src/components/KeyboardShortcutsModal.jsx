import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Keyboard } from 'lucide-react';
import { toggleKeyboardHelp } from '../store/uiSlice';

const SHORTCUTS = [
  { key: 'SPACE', description: 'Play / Pause music' },
  { key: 'LEFT / RIGHT', description: 'Previous / Next track' },
  { key: 'UP / DOWN', description: 'Volume Up / Down' },
  { key: 'M', description: 'Mute / Unmute audio' },
  { key: 'L', description: 'Favorite / Like song' },
  { key: 'F', description: 'Toggle Fullscreen Player' },
  { key: 'T', description: 'Open Theme Customizer' },
  { key: 'UI', description: 'Toggle Hide UI Immersive Mode' },
  { key: '?', description: 'Toggle Keyboard Shortcuts Modal' }
];

export default function KeyboardShortcutsModal() {
  const dispatch = useDispatch();
  const { isKeyboardHelpOpen } = useSelector((state) => state.ui);

  if (!isKeyboardHelpOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-borderCustom p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-borderCustom">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-accent" />
            <h2 className="font-serif font-bold text-lg text-textPrimary">Keyboard Shortcuts</h2>
          </div>
          <button onClick={() => dispatch(toggleKeyboardHelp())} className="p-1.5 rounded-full text-textSecondary hover:text-textPrimary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-borderCustom/40">
              <kbd className="px-2.5 py-1 rounded bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold">
                {s.key}
              </kbd>
              <span className="text-xs text-textSecondary font-sans">{s.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
