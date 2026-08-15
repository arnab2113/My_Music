import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Radio, Compass, ListMusic, Heart, Search } from 'lucide-react';

export default function MobileNavigation() {
  const location = useLocation();
  const { isHideUI } = useSelector((state) => state.ui);
  const { currentSong } = useSelector((state) => state.player);

  if (isHideUI) return null;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/radio', label: 'Radio', icon: Radio },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/playlists', label: 'Playlists', icon: ListMusic },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/search', label: 'Search', icon: Search }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`lg:hidden fixed left-0 right-0 z-40 px-3 transition-all duration-300 ${
        currentSong ? 'bottom-20' : 'bottom-3'
      }`}
    >
      <nav className="glass-panel py-2 px-3 rounded-2xl border border-borderCustom/80 shadow-2xl flex items-center justify-around max-w-md mx-auto bg-black/80 backdrop-blur-xl">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all duration-300 ${
                active
                  ? 'text-accent scale-105 font-bold'
                  : 'text-textSecondary hover:text-textPrimary active:scale-95'
              }`}
            >
              <IconComponent className={`w-4 h-4 md:w-5 md:h-5 ${active ? 'text-accent stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-mono mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
