import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="relative">
        <Radio className="w-24 h-24 text-accent/40 animate-pulse" />
        <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-2xl text-accent">
          404
        </span>
      </div>

      <h1 className="font-serif font-extrabold text-4xl text-textPrimary tracking-wide">
        RADIO SIGNAL LOST...
      </h1>

      <p className="text-sm text-textSecondary font-sans max-w-md">
        The station frequency or page you are looking for has drifted into static memory.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-accent text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-accentGlow hover:scale-105 transition-transform"
      >
        <ArrowLeft className="w-4 h-4" /> RETURN TO NOSTALGIA
      </Link>
    </div>
  );
}
