
import React, { useState, useEffect } from 'react';

const AdvancedSettings: React.FC = () => {
  const STORAGE_KEY = 'neo_adv_settings';
  
  // State from image/existing logic
  const [savePath, setSavePath] = useState('');
  const [autoDownload, setAutoDownload] = useState(true);
  const [compressionQuality, setCompressionQuality] = useState('high');
  const [autoRetry, setAutoRetry] = useState(true);
  const [retryCount, setRetryCount] = useState(3);
  const [notifSound, setNotifSound] = useState(true);
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'done'>('idle');

  // Load settings on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const decrypted = JSON.parse(atob(savedData));
        setSavePath(decrypted.savePath || '');
        setAutoDownload(decrypted.autoDownload ?? true);
        setCompressionQuality(decrypted.compressionQuality || 'high');
        setAutoRetry(decrypted.autoRetry ?? true);
        setRetryCount(decrypted.retryCount ?? 3);
        setNotifSound(decrypted.notifSound ?? true);
      } catch (e) {
        console.error("Failed to load advanced settings", e);
      }
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    const data = { savePath, autoDownload, compressionQuality, autoRetry, retryCount, notifSound };
    const encrypted = btoa(JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY, encrypted);
    
    setTimeout(() => {
      setSaveStatus('done');
      setTimeout(() => setSaveStatus('idle'), 1500);
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm("설정을 기본값으로 재설정하시겠습니까?")) {
      setSavePath('');
      setAutoDownload(true);
      setCompressionQuality('high');
      setAutoRetry(true);
      setRetryCount(3);
      setNotifSound(true);
    }
  };

  const handleFolderPicker = () => {
    // 브라우저 프레임 보안 정책으로 인해 직접 입력을 받는 방식으로 대체
    const manual = prompt('저장할 로컬 폴더 경로를 입력해 주세요:', savePath || 'C:\\Users\\User\\Music');
    if (manual) {
      setSavePath(manual);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header Area - Library Style */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold">고급 설정</h2>
          <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">Studio Performance & Automation</p>
        </div>
      </div>

      {/* Content Area - Wide Container like Library */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        <div className="bg-[#161618]/30 border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-12">
          
          {/* Section: 자동 저장 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <i className="fa-solid fa-floppy-disk text-sm"></i>
              </div>
              <h3 className="text-sm font-bold text-zinc-300">자동 저장</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <label className="text-[11px] text-zinc-500 font-medium ml-1">기본 저장 경로</label>
                <div className="flex gap-3">
                  <div className="flex-1 bg-[#0a0a0b] border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-400 truncate shadow-inner">
                    {savePath || "저장 경로를 선택하세요"}
                  </div>
                  <button 
                    onClick={handleFolderPicker}
                    className="bg-[#1f1f22] hover:bg-zinc-800 text-zinc-300 px-8 py-4 rounded-2xl text-xs font-bold border border-zinc-800 flex items-center gap-2 transition-all active:scale-95 shadow-lg"
                  >
                    <i className="fa-regular fa-folder-open"></i>
                    선택
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-[#0a0a0b] rounded-2xl border border-zinc-800/50 mt-2 shadow-inner">
                <div>
                  <p className="text-sm font-bold text-zinc-200">자동 다운로드</p>
                  <p className="text-[10px] text-zinc-500 mt-1">생성 완료 시 자동으로 다운로드</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoDownload}
                  onChange={() => setAutoDownload(!autoDownload)}
                  className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Section: 성능 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <i className="fa-solid fa-gauge-high text-sm"></i>
              </div>
              <h3 className="text-sm font-bold text-zinc-300">성능</h3>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] text-zinc-500 font-medium ml-1">압축 품질</label>
              <div className="relative">
                <select 
                  value={compressionQuality}
                  onChange={(e) => setCompressionQuality(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 outline-none focus:border-zinc-700 appearance-none cursor-pointer shadow-inner"
                >
                  <option value="high">높음 (느림, 작은 파일)</option>
                  <option value="medium">중간 (표준)</option>
                  <option value="low">낮음 (빠름, 큰 파일)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
          </section>

          {/* Section: 안정성 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <i className="fa-solid fa-shield-halved text-sm"></i>
              </div>
              <h3 className="text-sm font-bold text-zinc-300">안정성</h3>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-[#0a0a0b] rounded-2xl border border-zinc-800/50 shadow-inner">
              <div>
                <p className="text-sm font-bold text-zinc-200">자동 재시도</p>
                <p className="text-[10px] text-zinc-500 mt-1">실패 시 자동으로 재시도</p>
              </div>
              <input 
                type="checkbox" 
                checked={autoRetry}
                onChange={() => setAutoRetry(!autoRetry)}
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] text-zinc-500 font-medium ml-1">재시도 횟수 ({retryCount}회)</label>
              </div>
              <div className="px-1">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={retryCount}
                  onChange={(e) => setRetryCount(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </section>

          {/* Section: 알림 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <i className="fa-solid fa-bell text-sm"></i>
              </div>
              <h3 className="text-sm font-bold text-zinc-300">알림</h3>
            </div>
            <div className="flex items-center justify-between p-6 bg-[#0a0a0b] rounded-2xl border border-zinc-800/50 shadow-inner">
              <div>
                <p className="text-sm font-bold text-zinc-200">알림 사운드</p>
                <p className="text-[10px] text-zinc-500 mt-1">생성 완료 시 소리 재생</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifSound}
                onChange={() => setNotifSound(!notifSound)}
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 accent-blue-600 cursor-pointer"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Footer Area - Library Style */}
      <div className="mt-8 flex justify-between items-center bg-[#161618]/50 border border-zinc-800/50 rounded-3xl p-6">
        <button 
          onClick={handleReset}
          className="px-6 py-2 text-xs text-zinc-500 hover:text-zinc-300 font-bold transition-colors underline underline-offset-4"
        >
          기본값으로 재설정
        </button>
        <button 
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`min-w-[160px] bg-white text-black px-10 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${saveStatus !== 'idle' ? 'opacity-80 cursor-default' : 'hover:bg-zinc-200'}`}
        >
          {saveStatus === 'saving' ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : saveStatus === 'done' ? (
            <i className="fa-solid fa-check text-emerald-600"></i>
          ) : (
            <i className="fa-solid fa-floppy-disk"></i>
          )}
          {saveStatus === 'done' ? '저장 완료' : saveStatus === 'saving' ? '저장 중...' : '설정 저장'}
        </button>
      </div>
    </div>
  );
};

export default AdvancedSettings;
