
import React, { useState } from 'react';
import { MusicMetadata } from '../types';

interface Props {
  music: MusicMetadata;
  onPlay: () => void;
}

const PromptCard: React.FC<Props> = ({ music, onPlay }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#1c1c1f] border border-zinc-800 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all group">
      <div className="p-4 flex gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden group">
          <i className="fa-solid fa-music text-zinc-500 text-2xl group-hover:scale-110 transition-transform"></i>
          <button 
            onClick={onPlay}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <i className="fa-solid fa-play text-white text-xl"></i>
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm truncate group-hover:text-violet-400 transition-colors">{music.title}</h3>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase tracking-wider">
              {music.duration}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{music.style}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] text-violet-400 font-bold px-1.5 py-0.5 border border-violet-400/20 rounded">
              {music.mood}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 border border-emerald-400/20 rounded">
              {music.bpm} BPM
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
        >
          {expanded ? 'Hide Details' : 'Show Detailed Prompt & Lyrics'}
          <i className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'} text-[10px]`}></i>
        </button>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-4 animate-in slide-in-from-top-1 duration-200">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Production Prompt</p>
              <p className="text-xs text-zinc-300 bg-black/20 p-2 rounded leading-relaxed">{music.detailedPrompt}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Lyrics / Structure</p>
              <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-sans bg-black/20 p-2 rounded leading-relaxed">
                {music.lyrics}
              </pre>
            </div>
            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-clapperboard"></i>
              Regenerate Version
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptCard;
