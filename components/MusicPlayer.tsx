
import React, { useState } from 'react';
import { MusicMetadata } from '../types';

interface Props {
  currentTrack: MusicMetadata | null;
}

const MusicPlayer: React.FC<Props> = ({ currentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  if (!currentTrack) {
    return (
      <div className="bg-[#161618] border border-zinc-800 rounded-xl p-6 h-40 flex flex-col items-center justify-center text-zinc-500 text-sm">
        <i className="fa-solid fa-compact-disc text-3xl mb-3 opacity-20"></i>
        <p>Select a concept to listen</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#161618] to-[#1a1a1e] border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
      {/* Waveform Visualization (Mock) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 overflow-hidden">
        <div 
          className="h-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-zinc-900 rounded-lg flex-shrink-0 flex items-center justify-center relative shadow-xl">
          <i className={`fa-solid fa-music text-3xl text-violet-500/50 ${isPlaying ? 'animate-pulse' : ''}`}></i>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-2xl`}></i>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-violet-400 font-bold tracking-widest uppercase">Now Auditioning</span>
            <div className="flex gap-2">
              <button className="text-zinc-500 hover:text-white transition-colors text-xs"><i className="fa-solid fa-share-nodes"></i></button>
              <button className="text-zinc-500 hover:text-white transition-colors text-xs"><i className="fa-solid fa-download"></i></button>
            </div>
          </div>
          <h3 className="text-xl font-bold truncate mb-1">{currentTrack.title}</h3>
          <p className="text-xs text-zinc-400 italic mb-3">"{currentTrack.style}"</p>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-500 tabular-nums">1:12</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer relative group/bar">
               <div 
                className="absolute top-0 left-0 h-full bg-violet-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/bar:scale-100 transition-transform"
                style={{ left: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-500 tabular-nums">{currentTrack.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
