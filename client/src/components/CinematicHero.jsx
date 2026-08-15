import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play } from 'lucide-react';
import { setHideUI } from '../store/uiSlice';
import { setQueue, setIsPlaying } from '../store/playerSlice';
import { setActiveStation } from '../store/radioSlice';

export default function CinematicHero({ stations = [] }) {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const { particleMode, currentTheme } = useSelector((state) => state.theme);
  const { isHideUI } = useSelector((state) => state.ui);

  // Atmospheric Particle Engine supporting all modes: 'dust' | 'stars' | 'rain' | 'fireflies' | 'none'
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Handle 'none' mode — clear canvas completely and stop rendering
    if (particleMode === 'none') {
      ctx.clearRect(0, 0, width, height);
      return () => window.removeEventListener('resize', handleResize);
    }

    // 2. Determine Particle Count per mode
    let particleCount = 60;
    if (particleMode === 'rain') particleCount = 160;
    if (particleMode === 'stars') particleCount = 130;
    if (particleMode === 'fireflies') particleCount = 45;
    if (particleMode === 'dust') particleCount = 80;

    // 3. Initialize Particles with properties customized for each mode
    const particles = Array.from({ length: particleCount }, () => {
      if (particleMode === 'rain') {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 14 + 8,
          speedY: Math.random() * 7 + 5,
          speedX: -1,
          opacity: Math.random() * 0.5 + 0.3
        };
      }
      if (particleMode === 'stars') {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.4,
          speedX: (Math.random() - 0.5) * 0.08,
          speedY: (Math.random() - 0.5) * 0.08,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2
        };
      }
      if (particleMode === 'fireflies') {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.5 + 1.5,
          speedX: (Math.random() - 0.5) * 0.6,
          speedY: (Math.random() - 0.5) * 0.4 - 0.1, // Float slightly upwards
          opacity: Math.random() * 0.6 + 0.2,
          pulseSpeed: Math.random() * 0.04 + 0.015,
          phase: Math.random() * Math.PI * 2
        };
      }
      // Default: 'dust' mode
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 + 0.1, // Slow warm float
        opacity: Math.random() * 0.5 + 0.1,
        wobble: Math.random() * 0.02
      };
    });

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.02;

      particles.forEach((p) => {
        // --- POSITION UPDATES & BOUNDARY WRAPPING ---
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        // --- RENDER PER PARTICLE MODE ---
        if (particleMode === 'rain') {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();
        } else if (particleMode === 'stars') {
          // Shimmering twinkle effect
          const currentOpacity = Math.abs(Math.sin(step * p.twinkleSpeed * 5 + p.phase)) * p.opacity;
          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = currentOpacity;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        } else if (particleMode === 'fireflies') {
          // Soft glowing firefly pulse with warm aura
          const pulse = (Math.sin(step * p.pulseSpeed * 10 + p.phase) + 1) / 2; // 0 to 1
          const alpha = p.opacity * (0.3 + pulse * 0.7);
          const accentColor = currentTheme?.colors?.accent || '#f59e0b';

          ctx.save();
          ctx.beginPath();
          ctx.shadowBlur = 12;
          ctx.shadowColor = accentColor;
          ctx.fillStyle = accentColor;
          ctx.globalAlpha = alpha;
          ctx.arc(p.x, p.y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Dust motes floating in warm light
          p.x += Math.sin(step + p.x) * 0.1;
          ctx.beginPath();
          ctx.fillStyle = currentTheme?.colors?.accent || '#f59e0b';
          ctx.globalAlpha = p.opacity;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleMode, currentTheme]);

  const handlePlayStation = (station) => {
    dispatch(setActiveStation(station));

    const validSongs = (station.songs || []).filter(
      (s) => s && typeof s === 'object' && s.audioUrl
    );

    if (validSongs.length > 0) {
      dispatch(setQueue({ songs: validSongs, startIndex: 0 }));
      dispatch(setIsPlaying(true));
    }
  };

  return (
    <div
      onClick={() => {
        if (isHideUI) dispatch(setHideUI(false));
      }}
      className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 select-none pt-20 pb-12"
    >
      {/* Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-70" />

      {/* Centered Retro Street Lamp, Glowing Light Beam Cone & Street Scene */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Glowing Triangular Light Cone (Light Beam) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[950px] md:w-[1200px] h-[90vh] pointer-events-none z-0 opacity-85">
          <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="streetLampConeBeam" x1="500" y1="0" x2="500" y2="800" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                <stop offset="18%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="55%" stopColor="#d97706" stopOpacity="0.2" />
                <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="streetLampBulbGlow" cx="500" cy="20" r="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="25%" stopColor="#fef08a" stopOpacity="0.95" />
                <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Wide Triangular Light Cone Polygon */}
            <polygon points="500,20 20,800 980,800" fill="url(#streetLampConeBeam)" />
            {/* Core Bulb Intense Glow */}
            <circle cx="500" cy="20" r="45" fill="url(#streetLampBulbGlow)" />
          </svg>
        </div>

        {/* Vertical Lamppost Pole & Retro Street Silhouette SVG */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
          {/* Ground Horizon Line & Silhouette */}
          <path d="M0,740 Q500,730 1000,740 L1000,800 L0,800 Z" fill="#080605" opacity="0.95" />
          <path d="M0,742 Q500,732 1000,742" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="2.5" />

          {/* Roadside Shop / Tea Stall Silhouette (Right side like reference image) */}
          <g opacity="0.85">
            <path d="M680,740 L680,660 L880,630 L950,640 L950,740 Z" fill="#0d0907" />
            <path d="M670,660 L890,625 L960,635" stroke="#241a12" strokeWidth="6" strokeLinecap="round" />
            {/* Small hanging warm lantern */}
            <line x1="775" y1="640" x2="775" y2="665" stroke="#d97706" strokeWidth="2" />
            <circle cx="775" cy="670" r="5" fill="#fef08a" />
            <circle cx="775" cy="670" r="14" fill="rgba(245, 158, 11, 0.3)" />
          </g>

          {/* Parked Vintage Bicycle Silhouette Leaning on Lamppost */}
          <g transform="translate(425, 672) scale(0.65)" opacity="0.8">
            {/* Wheels */}
            <circle cx="30" cy="70" r="35" fill="none" stroke="#1c1510" strokeWidth="4" />
            <circle cx="150" cy="70" r="35" fill="none" stroke="#1c1510" strokeWidth="4" />
            {/* Frame */}
            <path d="M30,70 L80,70 L130,30 L60,30 Z M80,70 L60,30 M130,30 L150,70" fill="none" stroke="#1c1510" strokeWidth="4.5" strokeLinejoin="round" />
            {/* Seat & Handlebars */}
            <line x1="55" y1="30" x2="50" y2="18" stroke="#1c1510" strokeWidth="4" />
            <line x1="38" y1="18" x2="62" y2="18" stroke="#1c1510" strokeWidth="5" />
            <line x1="130" y1="30" x2="136" y2="8" stroke="#1c1510" strokeWidth="4" />
            <path d="M124,8 L146,8" stroke="#1c1510" strokeWidth="4" />
          </g>

          {/* Central Street Lamppost Stand / Metallic Pole */}
          <line x1="500" y1="30" x2="500" y2="742" stroke="#120c09" strokeWidth="12" />
          <line x1="497" y1="30" x2="497" y2="742" stroke="#33241b" strokeWidth="2.5" />
          {/* Decorative Pole Moldings */}
          <rect x="490" y="690" width="20" height="52" rx="4" fill="#120c09" stroke="#33241b" strokeWidth="1.5" />
          <rect x="492" y="440" width="16" height="12" rx="3" fill="#241a13" />
          <rect x="492" y="240" width="16" height="12" rx="3" fill="#241a13" />

          {/* Top Curved Lamp Bracket Arm */}
          <path d="M500,55 Q500,15 480,10 T450,20" fill="none" stroke="#170f0b" strokeWidth="9" strokeLinecap="round" />
          <path d="M500,55 Q500,15 480,10 T450,20" fill="none" stroke="#3d2b1f" strokeWidth="2" strokeLinecap="round" />

          {/* Streetlamp Hood / Shade Fixture */}
          <path d="M415,20 Q450,5 485,20 Q470,32 430,32 Z" fill="#1a120d" stroke="#4a3526" strokeWidth="2" />
          {/* Lamp Glass Rim / Light Emitter */}
          <ellipse cx="450" cy="26" rx="30" ry="7" fill="#fef08a" opacity="0.95" />
        </svg>
      </div>

      {/* Hero Content */}
      <div className={`relative z-10 text-center max-w-4xl px-4 transition-all duration-700 ${isHideUI ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        {/* On-Air Gold Typography */}
        <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-black/40 border border-borderCustom text-xs tracking-widest text-accent uppercase font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>NOSTALGIA ON AIR</span>
          <span className="text-textSecondary">• 90s RADIO</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-textPrimary mb-4 drop-shadow-2xl">
          NOSTALGIA FM
        </h1>

        <p className="text-sm md:text-lg text-textSecondary font-sans max-w-2xl mx-auto mb-10 tracking-wide">
          Step into a vintage room of classic Hindi 90s, Bengali Adhunik, Bhojpuri, and retro soundscapes.
        </p>

        {/* Radio Station Cards Grid */}
        {stations.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto mt-4">
            {stations.slice(0, 4).map((st) => (
              <div
                key={st._id || st.slug}
                onClick={() => handlePlayStation(st)}
                className="group relative p-4 rounded-xl glass-card text-left cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accentGlow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-black/50 text-accent border border-borderCustom">
                    {st.language}
                  </span>
                  <button className="p-2 rounded-full bg-accent text-black group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
                <h3 className="font-serif font-bold text-sm text-textPrimary group-hover:text-accent transition-colors line-clamp-1">
                  {st.name}
                </h3>
                <p className="text-xs text-textSecondary line-clamp-1 mt-1 font-sans">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
