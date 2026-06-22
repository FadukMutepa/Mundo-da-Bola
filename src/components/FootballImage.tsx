import React, { useState } from 'react';
import { Trophy, Flame, Play, Sparkles, Activity } from 'lucide-react';

interface FootballImageProps {
  src: string;
  alt: string;
  category: string;
  className?: string;
  heightClass?: string;
  id?: string;
}

export default function FootballImage({ 
  src, 
  alt, 
  category, 
  className = '', 
  heightClass = 'h-full',
  id
}: FootballImageProps) {
  const [hasError, setHasError] = useState(false);

  // Fallback gradient styles based on categories
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Transferências':
        return {
          from: 'from-amber-700',
          to: 'to-slate-900',
          accent: 'border-amber-400 text-amber-400',
          bg: 'bg-amber-950',
          indicator: 'Mercado da Bola'
        };
      case 'Jogos':
        return {
          from: 'from-emerald-700',
          to: 'to-cyan-950',
          accent: 'border-emerald-400 text-emerald-400',
          bg: 'bg-emerald-950',
          indicator: 'Tempo Real'
        };
      case 'Resultados':
        return {
          from: 'from-slate-800',
          to: 'to-slate-950',
          accent: 'border-slate-400 text-slate-350',
          bg: 'bg-slate-900',
          indicator: 'Análise tática'
        };
      case 'Curiosidades':
        return {
          from: 'from-emerald-800',
          to: 'to-purple-950',
          accent: 'border-purple-400 text-purple-400',
          bg: 'bg-emerald-950',
          indicator: 'História e Mitos'
        };
      default:
        return {
          from: 'from-emerald-800',
          to: 'to-slate-950',
          accent: 'border-emerald-400 text-emerald-400',
          bg: 'bg-slate-950',
          indicator: 'Portal Futebol'
        };
    }
  };

  const theme = getCategoryTheme(category);

  if (hasError || !src) {
    return (
      <div 
        className={`relative w-full ${heightClass} ${className} ${theme.bg} bg-gradient-to-br ${theme.from} ${theme.to} flex flex-col items-center justify-center p-6 overflow-hidden select-none min-h-[180px]`}
        id={id}
      >
        {/* Tactical fields decoration */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          {/* Soccer pitch lines and circles */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white border-dashed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-white" />
          <div className="absolute top-4 left-4 right-4 bottom-4 border border-white" />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-24 border border-white" />
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-40 h-24 border border-white" />
        </div>

        {/* Dynamic Glowing icon badge */}
        <div className={`relative z-10 w-14 h-14 rounded-full bg-slate-950/75 border-2 ${theme.accent.split(' ')[0]} flex items-center justify-center text-white mb-3.5 shadow-lg`}>
          {category === 'Transferências' ? (
            <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
          ) : category === 'Jogos' ? (
            <Play className="w-7 h-7 text-emerald-400 fill-emerald-400" />
          ) : category === 'Resultados' ? (
            <Activity className="w-7 h-7 text-slate-200" />
          ) : (
            <Trophy className="w-7 h-7 text-emerald-400" />
          )}
        </div>

        {/* Overlay category title indicator */}
        <span className="relative z-10 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-100 px-3 py-1 bg-slate-950/45 rounded-md border border-slate-800/60 shadow">
          {theme.indicator}
        </span>
        
        {/* Large faint visual soccer ball pattern in corner */}
        <div className="absolute -bottom-6 -right-6 text-white opacity-5 font-black text-8xl">
          ⚽
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${heightClass} object-cover`}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      id={id}
      loading="lazy"
    />
  );
}
