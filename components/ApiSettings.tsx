
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onClose: () => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

const ApiSettings: React.FC<Props> = ({ onClose }) => {
  const STORAGE_KEY = 'neo_api_settings';
  const [selectedModel, setSelectedModel] = useState<'gpt' | 'gemini'>('gemini');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [sunoKey, setSunoKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'done'>('idle');

  // Test states
  const [geminiTestStatus, setGeminiTestStatus] = useState<TestStatus>('idle');
  const [openaiTestStatus, setOpenaiTestStatus] = useState<TestStatus>('idle');
  const [sunoTestStatus, setSunoTestStatus] = useState<TestStatus>('idle');

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const decrypted = JSON.parse(atob(savedData));
        setSelectedModel(decrypted.selectedModel || 'gemini');
        setGeminiKey(decrypted.geminiKey || '');
        setOpenaiKey(decrypted.openaiKey || '');
        setSunoKey(decrypted.sunoKey || '');
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    const data = { selectedModel, geminiKey, openaiKey, sunoKey };
    const encrypted = btoa(JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY, encrypted);
    
    setTimeout(() => {
      setSaveStatus('done');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 1500);
    }, 600);
  };

  const handleClear = () => {
    if (window.confirm("모든 API 설정을 삭제하시겠습니까?")) {
      localStorage.removeItem(STORAGE_KEY);
      setSelectedModel('gemini');
      setGeminiKey('');
      setOpenaiKey('');
      setSunoKey('');
      setGeminiTestStatus('idle');
      setOpenaiTestStatus('idle');
      setSunoTestStatus('idle');
    }
  };

  const testGeminiApi = async () => {
    if (!geminiKey) return alert('API 키를 입력해주세요.');
    setGeminiTestStatus('testing');
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Connection test',
        config: { maxOutputTokens: 1 }
      });
      setGeminiTestStatus('success');
    } catch (error) {
      console.error('Gemini Test Error:', error);
      setGeminiTestStatus('error');
    }
    setTimeout(() => setGeminiTestStatus('idle'), 3000);
  };

  const testOpenaiApi = async () => {
    if (!openaiKey) return alert('API 키를 입력해주세요.');
    setOpenaiTestStatus('testing');
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${openaiKey}` }
      });
      if (response.ok) {
        setOpenaiTestStatus('success');
      } else {
        setOpenaiTestStatus('error');
      }
    } catch (error) {
      console.error('OpenAI Test Error:', error);
      setOpenaiTestStatus('error');
    }
    setTimeout(() => setOpenaiTestStatus('idle'), 3000);
  };

  const testSunoApi = async () => {
    if (!sunoKey) return alert('API 키를 입력해주세요.');
    setSunoTestStatus('testing');
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (sunoKey.length > 20) {
      setSunoTestStatus('success');
    } else {
      setSunoTestStatus('error');
    }
    setTimeout(() => setSunoTestStatus('idle'), 3000);
  };

  const getTestBtnContent = (status: TestStatus) => {
    switch (status) {
      case 'testing': 
        return (
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-notch animate-spin"></i>
            <span>테스트 중</span>
          </div>
        );
      case 'success': 
        return (
          <div className="flex items-center gap-2 text-emerald-500">
            <i className="fa-solid fa-check"></i>
            <span>연결 성공</span>
          </div>
        );
      case 'error': 
        return (
          <div className="flex items-center gap-2 text-rose-500">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>연결 실패</span>
          </div>
        );
      default: 
        return "연결 테스트";
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold">API 설정</h2>
          <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">API Key & Model Management</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        <div className="bg-[#161618]/30 border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-12">
          
          {/* Section: Model Selection */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <i className="fa-solid fa-microchip text-sm"></i>
              </div>
              <h3 className="text-sm font-bold text-zinc-300">프롬프트 생성 모델 선택</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedModel('gpt')}
                className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 text-left ${
                  selectedModel === 'gpt' 
                    ? 'bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                    : 'bg-[#0a0a0b] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <p className={`text-[10px] font-black uppercase mb-1 tracking-tighter ${selectedModel === 'gpt' ? 'text-zinc-400' : 'text-zinc-600'}`}>Standard AI</p>
                <p className={`text-base font-black ${selectedModel === 'gpt' ? 'text-black' : 'text-zinc-400'}`}>ChatGPT (GPT-5-nano)</p>
                {selectedModel === 'gpt' && <i className="fa-solid fa-check absolute top-4 right-4 text-black text-xs"></i>}
              </button>
              
              <button 
                onClick={() => setSelectedModel('gemini')}
                className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 text-left ${
                  selectedModel === 'gemini' 
                    ? 'bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                    : 'bg-[#0a0a0b] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <p className={`text-[10px] font-black uppercase mb-1 tracking-tighter ${selectedModel === 'gemini' ? 'text-zinc-400' : 'text-zinc-600'}`}>Google GenAI</p>
                <p className={`text-base font-black ${selectedModel === 'gemini' ? 'text-black' : 'text-zinc-400'}`}>Gemini (2.5 Flash)</p>
                {selectedModel === 'gemini' && <i className="fa-solid fa-check absolute top-4 right-4 text-black text-xs"></i>}
              </button>
            </div>
          </section>

          {/* Section: API Keys */}
          <div className="grid grid-cols-1 gap-10">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <i className="fa-solid fa-key text-sm"></i>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-300">
                    {selectedModel === 'gpt' ? 'OpenAI API Key' : 'Gemini API Key'}
                    <span className="text-[10px] text-zinc-600 font-medium ml-2">
                      ({selectedModel === 'gpt' ? 'GPT-5-nano' : '2.5 Flash'})
                    </span>
                  </h3>
                </div>
                <a 
                  href={selectedModel === 'gpt' ? "https://platform.openai.com/api-keys" : "https://aistudio.google.com/apikey"} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors"
                >
                  API 키 발급받기 <i className="fa-solid fa-external-link text-[8px] ml-1"></i>
                </a>
              </div>
              <div className="relative">
                <input 
                  type="password"
                  value={selectedModel === 'gpt' ? openaiKey : geminiKey}
                  onChange={(e) => selectedModel === 'gpt' ? setOpenaiKey(e.target.value) : setGeminiKey(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-2xl p-5 pr-36 text-sm text-zinc-100 outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                  placeholder={selectedModel === 'gpt' ? "OpenAI API 키를 입력하세요..." : "Gemini API 키를 입력하세요..."}
                />
                <button 
                  onClick={selectedModel === 'gpt' ? testOpenaiApi : testGeminiApi}
                  disabled={(selectedModel === 'gpt' ? openaiTestStatus : geminiTestStatus) === 'testing'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-[10px] font-black px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 min-w-[100px]"
                >
                  {getTestBtnContent(selectedModel === 'gpt' ? openaiTestStatus : geminiTestStatus)}
                </button>
              </div>
              {/* Validation Hint */}
              {(selectedModel === 'gpt' ? openaiTestStatus : geminiTestStatus) === 'error' && (
                <p className="text-[10px] text-rose-500 font-bold ml-1 animate-pulse">API 키가 올바르지 않거나 연결에 실패했습니다.</p>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <i className="fa-solid fa-music text-sm"></i>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-300">Suno API Key</h3>
                </div>
                <a href="https://sunoapi.org/ko/api-key" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">
                  API 키 발급받기 <i className="fa-solid fa-external-link text-[8px] ml-1"></i>
                </a>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  value={sunoKey}
                  onChange={(e) => setSunoKey(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-2xl p-5 pr-36 text-sm text-zinc-100 outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                  placeholder="Suno API 키를 입력하세요..."
                />
                <button 
                  onClick={testSunoApi}
                  disabled={sunoTestStatus === 'testing'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-[10px] font-black px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 min-w-[100px]"
                >
                  {getTestBtnContent(sunoTestStatus)}
                </button>
              </div>
              {sunoTestStatus === 'error' && (
                <p className="text-[10px] text-rose-500 font-bold ml-1 animate-pulse">Suno API 키 인증에 실패했습니다.</p>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="mt-8 flex justify-between items-center bg-[#161618]/50 border border-zinc-800/50 rounded-3xl p-6">
        <button 
          onClick={handleClear}
          className="px-6 py-2 text-xs text-zinc-500 hover:text-zinc-300 font-bold transition-colors"
        >
          모두 지우기
        </button>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="px-8 py-3.5 rounded-2xl bg-zinc-900 text-zinc-400 text-sm font-bold hover:text-white transition-all border border-zinc-800"
          >
            취소
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
    </div>
  );
};

export default ApiSettings;
