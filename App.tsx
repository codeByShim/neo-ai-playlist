
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MusicForm from './components/MusicForm';
import AdvancedSettings from './components/AdvancedSettings';
import ApiSettings from './components/ApiSettings';
import { MusicMetadata, GenerationSettings } from './types';
import { generateAIPrompt, analyzeDescription, AIResult } from './services/aiService';

type ViewMode = 'library' | 'production' | 'settings' | 'extra';

const App: React.FC = () => {
  const [generatedMusic, setGeneratedMusic] = useState<MusicMetadata[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResults, setLastResults] = useState<AIResult[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('production');
  const [activeSettings, setActiveSettings] = useState<GenerationSettings | undefined>(undefined);

  // Load music library on mount
  useEffect(() => {
    const savedMusic = localStorage.getItem('neo_music_library');
    if (savedMusic) {
      try {
        setGeneratedMusic(JSON.parse(savedMusic));
      } catch (e) {
        console.error("Failed to load music library", e);
      }
    }
  }, []);

  // Save music library whenever it changes (Always sync with storage)
  useEffect(() => {
    localStorage.setItem('neo_music_library', JSON.stringify(generatedMusic));
  }, [generatedMusic]);

  const getApiSettings = () => {
    const savedData = localStorage.getItem('neo_api_settings');
    if (savedData) {
      try {
        return JSON.parse(atob(savedData));
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleAutoSetup = async (description: string): Promise<Partial<GenerationSettings> | null> => {
    const apiSettings = getApiSettings();
    if (!apiSettings || (!apiSettings.geminiKey && !apiSettings.openaiKey)) {
      alert("API 설정을 먼저 완료해주세요 (우측 상단 톱니바퀴 아이콘)");
      setCurrentView('settings');
      return null;
    }
    try {
      const analysis = await analyzeDescription(description, apiSettings);
      return analysis || null;
    } catch (error: any) {
      console.error("Auto setup failed:", error);
      alert("분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
      return null;
    }
  };

  const handleGenerate = async (settings: any) => {
    const apiSettings = getApiSettings();
    if (!apiSettings || (!apiSettings.geminiKey && !apiSettings.openaiKey)) {
      alert("API 설정을 먼저 완료해주세요 (우측 상단 톱니바퀴 아이콘)");
      setCurrentView('settings');
      return;
    }

    setIsGenerating(true);
    setCurrentView('production');
    
    try {
      const results = await generateAIPrompt(settings, apiSettings);
      setLastResults(results);
      
      const newTracks: MusicMetadata[] = results.map(result => ({
        id: Math.random().toString(36).substr(2, 9),
        title: (result.titles && result.titles.length > 0) ? result.titles[0] : "Untitled Track",
        style: Array.isArray(settings.genres) ? settings.genres.join(', ') : "Original",
        mood: Array.isArray(settings.mood) ? settings.mood.join(', ') : 'Generated',
        lyrics: result.lyrics || '',
        detailedPrompt: result.detailedPrompt || '',
        bpm: settings.tempo || 120,
        duration: "03:45",
        status: 'completed',
        createdAt: Date.now(),
        settings: settings, // Store the settings used
        aiResult: result    // Store the full AI result
      }));
      
      setGeneratedMusic(prev => [...newTracks, ...prev]);
    } catch (error: any) {
      alert("생성 실패: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectLibraryItem = (track: MusicMetadata) => {
    if (track.aiResult) {
      setLastResults([track.aiResult]);
    }
    if (track.settings) {
      setActiveSettings(track.settings);
    }
    setCurrentView('production');
  };

  const handleToggleLibrary = () => {
    setCurrentView(currentView === 'library' ? 'production' : 'library');
  };

  const copyToClipboard = (text: string, message: string = "클립보드에 복사되었습니다!") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert(message);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a0b] text-zinc-100 overflow-hidden font-sans">
      <Header 
        activeView={currentView} 
        onToggleLibrary={handleToggleLibrary}
        onViewChange={setCurrentView} 
      />
      
      <main className="flex-1 flex overflow-hidden">
        <div className="w-[550px] p-6 overflow-y-auto scroll-smooth border-r border-zinc-800/30 bg-[#0a0a0b]">
          <MusicForm 
            onGenerate={handleGenerate} 
            onAutoSetup={handleAutoSetup} 
            isLoading={isGenerating} 
            initialSettings={activeSettings}
          />
        </div>

        <div className="flex-1 flex flex-col p-8 bg-[#0a0a0b] overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
            
            {currentView === 'library' ? (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">음악 라이브러리</h2>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => { if(confirm("모든 라이브러리를 초기화할까요?")) setGeneratedMusic([]); }}
                      className="text-[10px] text-zinc-600 hover:text-red-400 font-bold transition-colors"
                    >
                      전체 삭제
                    </button>
                    <span className="text-xs text-zinc-500">{generatedMusic.length}개 항목</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                   {generatedMusic.length === 0 ? (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-600">
                        <i className="fa-solid fa-music text-6xl opacity-10 mb-6"></i>
                        <p>생성된 음악이 없습니다</p>
                      </div>
                   ) : (
                     generatedMusic.map(m => (
                       <div 
                        key={m.id} 
                        onClick={() => handleSelectLibraryItem(m)}
                        className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl hover:border-violet-500/50 cursor-pointer transition-all group hover:bg-zinc-900/60 shadow-lg"
                       >
                         <div className="flex justify-between items-start mb-3">
                           <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{m.title}</h4>
                           <span className="text-[10px] text-zinc-600 tabular-nums">
                            {new Date(m.createdAt).toLocaleDateString()}
                           </span>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded-lg text-zinc-400 font-medium">{m.style}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-violet-600/10 rounded-lg text-violet-400 font-bold">{m.mood}</span>
                         </div>
                         <div className="mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black text-violet-500 uppercase flex items-center gap-1">
                              데이터 불러오기 <i className="fa-solid fa-arrow-right text-[8px]"></i>
                            </span>
                         </div>
                       </div>
                     ))
                   )}
                </div>
              </div>
            ) : currentView === 'settings' ? (
              <ApiSettings onClose={() => setCurrentView('production')} />
            ) : currentView === 'extra' ? (
              <AdvancedSettings />
            ) : (
              <div className="flex-1 flex flex-col items-center animate-in zoom-in-95 duration-500">
                {lastResults.length === 0 && !isGenerating ? (
                  <div className="w-full h-full bg-[#161618] border border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-16 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="mb-10 w-32 h-32 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center relative">
                      <i className="fa-solid fa-compact-disc text-5xl text-zinc-700 opacity-40"></i>
                    </div>
                    <h3 className="text-3xl font-black mb-4 tracking-tight">스튜디오 대기 중</h3>
                    <p className="text-zinc-500 max-w-md text-lg leading-relaxed">
                      모든 준비가 되었습니다. 왼쪽의 설정을 확인한 후 하단의 프롬프트 생성 버튼을 눌러주세요.
                    </p>
                  </div>
                ) : isGenerating ? (
                   <div className="w-full h-full bg-[#161618] border border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center p-16 shadow-2xl">
                     <div className="mb-10 w-32 h-32 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center relative shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                        <i className="fa-solid fa-compact-disc text-5xl text-violet-400 animate-spin-slow"></i>
                      </div>
                      <h3 className="text-3xl font-black mb-4 tracking-tight">창의적인 선율을 빚는 중...</h3>
                      <div className="mt-12 w-full max-w-xs h-2 bg-zinc-900 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                      </div>
                   </div>
                ) : (
                  <div className="w-full space-y-12 pb-20">
                    {lastResults.map((result, index) => (
                      <div key={index} className="bg-[#161618] border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
                              <span className="text-sm font-black">{index + 1}</span>
                            </div>
                            <div className="space-y-4">
                              <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Recommended Titles</label>
                                <div className="flex flex-wrap gap-2">
                                  {result.titles && result.titles.map((t, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 px-4 py-2 rounded-xl group/title hover:border-violet-500/50 transition-colors">
                                      <span className="text-sm font-bold text-zinc-300">{t}</span>
                                      <button 
                                        onClick={() => copyToClipboard(t, `제목 '${t}'이(가) 복사되었습니다.`)}
                                        className="text-zinc-600 hover:text-violet-400 transition-colors"
                                        title="제목 복사"
                                      >
                                        <i className="fa-solid fa-copy text-[11px]"></i>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] font-black text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 shrink-0">Concept #{index + 1}</span>
                            <div className="flex items-center gap-2 bg-violet-600/10 px-3 py-1 rounded-full border border-violet-500/20">
                              <i className="fa-solid fa-venus-mars text-[10px] text-violet-400"></i>
                              <span className="text-[10px] font-black text-violet-300 uppercase">{result.recommendedGender || 'Any'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Technical Production Prompt</label>
                            <button 
                              onClick={() => copyToClipboard(result.detailedPrompt || '')}
                              className="text-[10px] font-bold text-violet-400 hover:text-white transition-colors"
                            >
                              <i className="fa-solid fa-copy mr-1"></i> 프롬프트 복사
                            </button>
                          </div>
                          <div className="bg-[#0a0a0b] border border-zinc-800 rounded-3xl p-8 shadow-inner">
                            <p className="text-zinc-400 leading-relaxed text-sm whitespace-pre-wrap">
                              {result.detailedPrompt}
                            </p>
                          </div>
                        </div>

                        {/* ImageFX Prompt Section */}
                        <div className="space-y-6 mb-10">
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-image text-zinc-500 text-xs"></i>
                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">ImageFX Prompts (Album Art)</label>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Version 1: Right-side */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Thumbnail Ver. (Right)</span>
                                <button 
                                  onClick={() => copyToClipboard(result.imagePrompt || '')}
                                  className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors"
                                >
                                  <i className="fa-solid fa-copy mr-1"></i> 복사
                                </button>
                              </div>
                              <div className="bg-[#0a0a0b] border border-zinc-800 rounded-3xl p-5 shadow-inner border-dashed hover:border-blue-500/30 transition-colors">
                                <p className="text-zinc-500 italic leading-relaxed text-[11px]">
                                  {result.imagePrompt}
                                </p>
                              </div>
                            </div>

                            {/* Version 2: Center */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Classic Ver. (Center)</span>
                                <button 
                                  onClick={() => copyToClipboard(result.imagePromptCenter || '')}
                                  className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors"
                                >
                                  <i className="fa-solid fa-copy mr-1"></i> 복사
                                </button>
                              </div>
                              <div className="bg-[#0a0a0b] border border-zinc-800 rounded-3xl p-5 shadow-inner border-dashed hover:border-emerald-500/30 transition-colors">
                                <p className="text-zinc-500 italic leading-relaxed text-[11px]">
                                  {result.imagePromptCenter || "Generating center version..."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-10 border-t border-zinc-800/50">
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
                                <i className="fa-solid fa-microphone-lines"></i>
                              </div>
                              <label className="text-lg font-bold">가사 및 곡 구성 (3-4분 분량)</label>
                            </div>
                            <button 
                              onClick={() => copyToClipboard(result.lyrics || '')}
                              className="text-[10px] font-bold text-amber-400 hover:text-white transition-colors"
                            >
                              <i className="fa-solid fa-copy mr-1"></i> 가사 전체 복사
                            </button>
                          </div>
                          <div className="bg-[#0a0a0b]/80 border border-zinc-800/50 rounded-3xl p-10 shadow-inner">
                            <div className="text-zinc-200 font-sans text-base whitespace-pre-wrap leading-[1.8] tracking-wide text-center max-w-2xl mx-auto italic opacity-90">
                              {result.lyrics}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
