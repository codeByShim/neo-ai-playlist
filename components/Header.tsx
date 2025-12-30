
import React from 'react';

interface Props {
  activeView: 'library' | 'production' | 'settings' | 'extra';
  onToggleLibrary: () => void;
  onViewChange: (view: 'library' | 'production' | 'settings' | 'extra') => void;
}

const Header: React.FC<Props> = ({ activeView, onToggleLibrary, onViewChange }) => {
  return (
    <header className="h-[72px] border-b border-zinc-800/60 flex items-center justify-between px-8 bg-[#0a0a0b] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/10">
          <i className="fa-solid fa-bolt text-white text-base"></i>
        </div>
        <div>
          <h1 className="text-lg font-black leading-tight tracking-tight text-white">네오뮤직 AI</h1>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">AI 기반 음악 제작 도구</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* FIRST ICON: Toggles between Library (Active) and Studio (Inactive) */}
        <button 
          onClick={onToggleLibrary}
          title="라이브러리 / 스튜디오 토글"
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
            activeView === 'library' 
              ? 'bg-white text-black shadow-lg shadow-white/10' 
              : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800 hover:bg-zinc-800'
          }`}
        >
          <i className="fa-solid fa-lines-leaning text-base"></i>
        </button>

        {/* SECOND ICON: Advanced Settings */}
        <button 
          onClick={() => onViewChange('extra')}
          title="고급 설정"
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
            activeView === 'extra'
              ? 'bg-white text-black shadow-lg shadow-white/10'
              : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800 hover:bg-zinc-800'
          }`}
        >
          <i className="fa-solid fa-sliders text-base"></i>
        </button>

        {/* THIRD ICON: Settings */}
        <button 
          onClick={() => onViewChange('settings')}
          title="환경 설정"
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
            activeView === 'settings' 
              ? 'bg-white text-black shadow-lg shadow-white/10' 
              : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800 hover:bg-zinc-800'
          }`}
        >
          <i className="fa-solid fa-gear text-base"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
