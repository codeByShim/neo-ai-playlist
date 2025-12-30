
import React, { useState, useRef, useEffect } from 'react';
import { GenerationSettings } from '../types';

interface Props {
  onGenerate: (settings: GenerationSettings) => void;
  onAutoSetup: (description: string) => Promise<Partial<GenerationSettings> | null>;
  isLoading: boolean;
  initialSettings?: GenerationSettings;
}

const MusicForm: React.FC<Props> = ({ onGenerate, onAutoSetup, isLoading, initialSettings }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    description: '',
    genres: [], 
    subGenres: [],
    musicType: 'vocal',
    vocalType: '',
    vocalGender: '',
    tempo: 120,
    mood: [], 
    instruments: [],
    language: 'English',
    aiModel: 'V5',
    negativeElements: [],
    additionalRequests: '',
    generationCount: 1,
    savePath: '',
    includeIntro: true,
    includeOutro: true
  });

  // Sync internal state when initialSettings prop changes
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      setShowAdvanced(true);
    }
  }, [initialSettings]);

  const [customInput, setCustomInput] = useState<{ field: string; value: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const genresList = ['Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip-Hop', 'R&B', 'Country', 'Folk', 'Blues', 'Reggae', 'K-POP', 'J-POP', 'EDM', 'House', 'Techno', 'Ambient', 'Indie', 'Alternative', 'Metal'];
  const genreDescriptions: Record<string, string> = {
    'Pop': '대중음악', 'Rock': '락', 'Jazz': '재즈', 'Classical': '클래식', 'Electronic': '전자음악',
    'Hip-Hop': '힙합', 'R&B': '알앤비', 'Country': '컨트리', 'Folk': '포크', 'Blues': '블루스',
    'Reggae': '레게', 'K-POP': '한국가요', 'J-POP': '일본가요', 'EDM': '이디엠', 'House': '하우스',
    'Techno': '테크노', 'Ambient': '앰비언트', 'Indie': '인디', 'Alternative': '얼터너티브', 'Metal': '메탈'
  };
  const subGenresList = ['Synthwave', 'Indie Rock', 'Progressive', 'Acoustic', 'Lo-fi', 'Dream Pop', 'Shoegaze', 'Post-Rock', 'Experimental', 'Fusion', 'Trap', 'Boom Bap', 'Drill', 'Future Bass', 'Dubstep'];
  const subGenreDescriptions: Record<string, string> = {
    'Synthwave': '80년대 신스 사운드', 'Indie Rock': '인디 락', 'Progressive': '진보적 구성',
    'Acoustic': '자연스러운 악기 소리', 'Lo-fi': '편안한 저음질 감성', 'Dream Pop': '몽환적인 분위기',
    'Shoegaze': '강렬한 기타 노이즈', 'Post-Rock': '실험적 락 구조', 'Experimental': '전위적인 사운드',
    'Fusion': '장르 간 결합', 'Trap': '강렬한 808 비트', 'Boom Bap': '클래식 힙합 리듬',
    'Drill': '다크한 드릴 사운드', 'Future Bass': '세련된 신스 베이스', 'Dubstep': '강력한 워블 베이스'
  };
  const aiModelList = ['V3_5', 'V4', 'V4_5', 'V4_5PLUS', 'V5'];
  const aiModelDescriptions: Record<string, string> = {
    'V3_5': '표준 품질', 'V4': '안정적인 성능', 'V4_5': '향상된 사운드', 'V4_5PLUS': '최고 음질', 'V5': '차세대 최신 엔진'
  };
  const languageList = ['English', 'Korean', 'Japanese', 'Spanish', 'French', 'German', 'Chinese'];
  const languageDescriptions: Record<string, string> = {
    'English': '영어', 'Korean': '한국어', 'Japanese': '일본어', 'Spanish': '스페인어', 'French': '프랑스어', 'German': '독일어', 'Chinese': '중국어'
  };
  const moodList = ['행복한', '슬픈', '에너제틱', '차분한', '로맨틱', '우울한', '밝은', '어두운', '향수', '몽환적', '공격적', '평화로운'];
  const instrumentList = ['피아노', '기타', '드럼', '베이스', '바이올린', '첼로', '플루트', '색소폰', '트럼펫', '신디사이저', '일렉기타', '어쿠스틱기타', '오케스트라', '스트링', '브라스', '우드윈드', '퍼커션', '하프', '오르간', '아코디언', '밴조', '만돌린', '우쿨렐레'];
  const vocalTypeList = ['맑음', '거친', '부드러움', '파워풀', '소프트', '숨소리'];
  const negativeElementsList = ['허밍 (humming)', '긴 인트로 (long intro)', '긴 아웃트로 (long outro)', '보컬라이즈 (vocalise)', '스켓 보컬 (scat vocals)', '넌센스 실러블 (nonsense syllables)', '보컬 필러 (vocal fillers)', '앰비언트 보컬 (ambient vox)', '스포큰 애드립 (spoken ad-libs)', '휘파람 (whistling)', '박수 소리 (clapping)', '핑거스냅 (finger snaps)', '보컬 이펙트 (vocal effects)', '오토튠 (auto-tune)', '보코더 (vocoder)'];

  const handleAutoSetup = async () => {
    if (!settings.description.trim()) {
      alert("음악 설명을 먼저 입력해주세요.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await onAutoSetup(settings.description);
      if (result) {
        setSettings(prev => ({
          ...prev,
          ...result,
          genres: Array.isArray(result.genres) && result.genres.length > 0 ? result.genres : prev.genres,
          subGenres: Array.isArray(result.subGenres) && result.subGenres.length > 0 ? result.subGenres : prev.subGenres,
          instruments: Array.isArray(result.instruments) && result.instruments.length > 0 ? result.instruments : prev.instruments,
          mood: Array.isArray(result.mood) && result.mood.length > 0 ? result.mood : prev.mood,
          negativeElements: Array.isArray(result.negativeElements) && result.negativeElements.length > 0 ? result.negativeElements : prev.negativeElements,
        }));
        setShowAdvanced(true);
      }
    } catch (err) {
      console.error("Auto setup error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFolderPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    const manualPath = prompt("음악 파일이 저장될 로컬 경로를 입력해 주세요:", settings.savePath || "C:\\Users\\User\\Music\\NeoMusic");
    if (manualPath) {
      setSettings(prev => ({ ...prev, savePath: manualPath }));
    }
  };

  const handleCustomSubmit = (field: string) => {
    if (!customInput || !customInput.value.trim()) return;
    const currentValues = (settings as any)[field];
    if (Array.isArray(currentValues) && !currentValues.includes(customInput.value.trim())) {
      setSettings({ ...settings, [field]: [...currentValues, customInput.value.trim()] });
    }
    setCustomInput(null);
  };

  const removeChip = (field: keyof GenerationSettings, value: string) => {
    const currentValues = settings[field];
    if (Array.isArray(currentValues)) {
      setSettings({ ...settings, [field]: currentValues.filter(v => v !== value) });
    }
  };

  const renderSingleSelect = (label: string, field: keyof GenerationSettings, options: string[], descriptions: Record<string, string>) => {
    const currentValue = settings[field] as string;
    const isOpen = activeDropdown === field;
    return (
      <div className="space-y-2">
        <label className="text-[11px] text-zinc-500 font-medium">{label}</label>
        <div className="relative">
          <div 
            onClick={() => setActiveDropdown(isOpen ? null : (field as string))}
            className={`w-full bg-[#0a0a0b] border rounded-xl p-3 text-xs flex justify-between items-center transition-all ${isOpen ? 'border-violet-500/50' : 'border-zinc-800 hover:border-zinc-700'} text-zinc-300 cursor-pointer`}
          >
            <span className="font-bold">{currentValue || 'Select...'}</span>
            <i className={`fa-solid fa-chevron-down text-[10px] text-zinc-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
          </div>
          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#1c1c1f] border border-zinc-800 rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto divide-y divide-zinc-800/50 animate-in fade-in zoom-in-95 duration-200">
              {options.map(opt => {
                const isSelected = currentValue === opt;
                const displayLabel = descriptions[opt] ? `${opt} (${descriptions[opt]})` : opt;
                return (
                  <div 
                    key={opt}
                    onClick={() => {
                      setSettings({ ...settings, [field]: opt });
                      setActiveDropdown(null);
                    }}
                    className={`px-4 py-2.5 flex justify-between items-center transition-colors cursor-pointer ${
                      isSelected ? 'bg-zinc-800/50 text-violet-400' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px]">{displayLabel}</span>
                    {isSelected && <i className="fa-solid fa-check text-[10px]"></i>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSelectWithAdd = (label: string, field: keyof GenerationSettings, placeholder: string, options: string[] = [], descriptions?: Record<string, string>) => {
    const currentValues = Array.isArray(settings[field]) ? (settings[field] as string[]) : [];
    const isOpen = activeDropdown === field;
    return (
      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-400">{label}</label>
        <div className="relative">
          <div 
            onClick={() => setActiveDropdown(isOpen ? null : (field as string))}
            className={`w-full bg-[#0a0a0b] border rounded-xl p-3 text-sm flex justify-between items-center text-zinc-500 cursor-pointer transition-all ${isOpen ? 'border-violet-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
          >
            <span className="truncate">{placeholder}</span>
            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
          </div>
          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#1c1c1f] border border-zinc-800 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-zinc-800/50 animate-in fade-in zoom-in-95 duration-200">
              {options.map(opt => {
                const isSelected = currentValues.includes(opt);
                const displayLabel = descriptions && descriptions[opt] ? `${opt} (${descriptions[opt]})` : opt;
                return (
                  <div 
                    key={opt} 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSettings({ ...settings, [field]: [...currentValues, opt] });
                      }
                    }} 
                    className={`px-4 py-2.5 flex justify-between items-center transition-colors ${
                      isSelected ? 'bg-zinc-800/50 cursor-default pointer-events-none' : 'hover:bg-zinc-800 cursor-pointer text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className={isSelected ? 'text-zinc-600 font-medium' : ''}>{displayLabel}</span>
                    {isSelected && <span className="text-[10px] font-bold text-violet-400">선택됨</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <button onClick={(e) => { e.stopPropagation(); setCustomInput({ field: field as string, value: '' }); }} className="text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1 transition-colors pl-1">
          <i className="fa-solid fa-plus text-[8px]"></i> 직접 추가
        </button>
        {customInput?.field === field && (
          <div className="flex gap-2 animate-in slide-in-from-top-1 duration-200" onClick={e => e.stopPropagation()}>
            <input autoFocus className="bg-[#0a0a0b] border border-zinc-700 rounded-xl px-4 py-2 text-xs outline-none flex-1 text-white focus:border-violet-500/50" value={customInput.value} onChange={(e) => setCustomInput({ ...customInput, value: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit(field)} placeholder="새 항목 입력..." />
            <button onClick={() => handleCustomSubmit(field)} className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200">추가</button>
            <button onClick={() => setCustomInput(null)} className="bg-zinc-800 text-zinc-500 px-3 py-2 rounded-xl text-xs font-bold">취소</button>
          </div>
        )}
        {currentValues.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
            {currentValues.map(val => (
              <div key={val} className="flex items-center gap-2 bg-zinc-100 text-black px-3 py-1.5 rounded-lg text-xs font-black shadow-sm group hover:bg-white transition-colors">
                {val}
                <i className="fa-solid fa-xmark cursor-pointer text-zinc-400 hover:text-red-600 transition-colors" onClick={() => removeChip(field, val)}></i>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" ref={dropdownRef}>
      <div className="bg-[#161618] border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-black tracking-wide text-white">음악 설명</label>
          <button 
            onClick={handleAutoSetup}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-violet-500/30 text-[10px] font-black transition-all ${isAnalyzing ? 'bg-zinc-800 text-zinc-500 cursor-wait' : 'bg-violet-600/10 text-violet-400 hover:bg-violet-600/20 active:scale-95'}`}
          >
            <i className={`fa-solid fa-wand-magic-sparkles ${isAnalyzing ? 'animate-spin' : ''}`}></i>
            {isAnalyzing ? 'AI 분석 중...' : '자동 설정'}
          </button>
        </div>
        <textarea
          value={settings.description}
          onChange={(e) => setSettings({ ...settings, description: e.target.value })}
          className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-2xl p-4 text-sm focus:border-violet-500/50 outline-none min-h-[140px] resize-none transition-all placeholder:text-zinc-700 text-white"
          placeholder="만들고 싶은 음악의 느낌, 분위기, 가사 주제 등을 자유롭게 설명해주세요..."
        />
      </div>

      <div className="bg-[#161618] border border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm cursor-pointer hover:border-zinc-700 transition-all" onClick={() => setShowAdvanced(!showAdvanced)}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showAdvanced ? 'bg-violet-600/20 text-violet-400' : 'bg-zinc-900 text-zinc-500'}`}>
            <i className="fa-solid fa-sliders"></i>
          </div>
          <div>
            <p className="text-sm font-bold text-white">고급 설정</p>
            <p className="text-[10px] text-zinc-600 font-medium">장르, 보컬, 악기 구성 등 세부 제어</p>
          </div>
        </div>
        <button className={`w-11 h-6 rounded-full relative transition-all duration-300 ${showAdvanced ? 'bg-violet-600' : 'bg-zinc-800'}`}>
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${showAdvanced ? 'translate-x-5 shadow-lg' : ''}`} />
        </button>
      </div>

      {showAdvanced && (
        <div className="bg-[#161618] border border-zinc-800 rounded-2xl p-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl">
          {renderSelectWithAdd('장르', 'genres', '장르 선택...', genresList, genreDescriptions)}
          {renderSelectWithAdd('세부 장르', 'subGenres', '세부 장르 선택...', subGenresList, subGenreDescriptions)}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400">음악 타입</label>
            <div className="flex gap-1.5 bg-[#0a0a0b] p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
              <button onClick={() => setSettings({...settings, musicType: 'vocal'})} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${settings.musicType === 'vocal' ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-zinc-500'}`}>보컬 포함</button>
              <button onClick={() => setSettings({...settings, musicType: 'instrumental'})} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${settings.musicType === 'instrumental' ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-zinc-500'}`}>연주곡</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] text-zinc-500 font-medium">보컬 타입</label>
              <select className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 focus:border-violet-500/50 outline-none appearance-none" value={settings.vocalType} onChange={e => setSettings({...settings, vocalType: e.target.value})}>
                <option value="">보컬 타입 선택...</option>
                {vocalTypeList.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] text-zinc-500 font-medium">보컬 성별</label>
              <select className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 focus:border-violet-500/50 outline-none appearance-none" value={settings.vocalGender} onChange={e => setSettings({...settings, vocalGender: e.target.value})}>
                <option value="">성별 무관</option>
                <option value="Male">남성</option>
                <option value="Female">여성</option>
                <option value="Mixed">혼성</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400">템포</label>
              <span className="text-sm font-black text-white">{settings.tempo} BPM</span>
            </div>
            <input type="range" min="60" max="180" value={settings.tempo} onChange={(e) => setSettings({...settings, tempo: parseInt(e.target.value)})} className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white shadow-inner" />
          </div>
          {renderSelectWithAdd('분위기', 'mood' as any, '분위기 선택...', moodList)}
          {renderSelectWithAdd('악기 구성', 'instruments' as any, '악기 선택...', instrumentList)}
          <div className="grid grid-cols-2 gap-4">
            {renderSingleSelect('가사 언어', 'language', languageList, languageDescriptions)}
            {renderSingleSelect('AI 모델', 'aiModel', aiModelList, aiModelDescriptions)}
          </div>
          {renderSelectWithAdd('제외할 요소', 'negativeElements', '제외할 요소 선택...', negativeElementsList)}
          
          {/* Song Structure Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400">인트로(Intro)</label>
              <div className="flex gap-1.5 bg-[#0a0a0b] p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
                <button onClick={() => setSettings({...settings, includeIntro: true})} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${settings.includeIntro ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-zinc-600'}`}>포함</button>
                <button onClick={() => setSettings({...settings, includeIntro: false})} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${!settings.includeIntro ? 'bg-zinc-800 text-white shadow-lg scale-[1.02]' : 'text-zinc-600'}`}>제외</button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400">아웃트로(Outro)</label>
              <div className="flex gap-1.5 bg-[#0a0a0b] p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
                <button onClick={() => setSettings({...settings, includeOutro: true})} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${settings.includeOutro ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-zinc-600'}`}>포함</button>
                <button onClick={() => setSettings({...settings, includeOutro: false})} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${!settings.includeOutro ? 'bg-zinc-800 text-white shadow-lg scale-[1.02]' : 'text-zinc-600'}`}>제외</button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400">추가 요청사항</label>
            <textarea value={settings.additionalRequests} onChange={(e) => setSettings({ ...settings, additionalRequests: e.target.value })} className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-2xl p-4 text-xs focus:border-violet-500/50 outline-none min-h-[100px] resize-none transition-all placeholder:text-zinc-700 text-white" placeholder="추가로 원하는 사항을 입력하세요..." />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400">생성 횟수</label>
              <span className="text-xs font-black text-white">{settings.generationCount}회 요청</span>
            </div>
            <div className="px-2">
              <input type="range" min="1" max="15" step="1" value={settings.generationCount} onChange={(e) => setSettings({...settings, generationCount: parseInt(e.target.value)})} className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white" />
              <div className="flex justify-between mt-2 px-1">
                {[1, 5, 10, 15].map(val => (
                  <span key={val} className="text-[10px] text-zinc-600 font-bold">{val}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#161618] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-wider">
          <i className="fa-solid fa-floppy-disk"></i>
          저장 위치 설정
        </div>
        <div className="space-y-2">
          <label className="text-[11px] text-zinc-500 font-medium">기본 저장 경로</label>
          <div className="flex gap-2">
            <div onClick={handleFolderPicker} className={`flex-1 bg-[#0a0a0b] border border-zinc-800 rounded-xl px-4 py-3.5 text-xs outline-none shadow-inner overflow-hidden truncate cursor-pointer hover:border-zinc-700 transition-colors flex items-center ${settings.savePath ? 'text-zinc-100 font-bold' : 'text-zinc-600 italic'}`}>{settings.savePath || "파일을 저장할 폴더를 선택하세요"}</div>
            <button type="button" onClick={handleFolderPicker} className="px-5 h-[46px] flex items-center justify-center gap-2 rounded-xl bg-zinc-800 text-white border border-zinc-800 hover:bg-zinc-700 hover:border-zinc-600 transition-all shadow-md active:scale-95 text-xs font-bold"><i className="fa-solid fa-folder-open text-[14px]"></i>선택</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 pt-4">
        <button
          type="button"
          onClick={() => onGenerate(settings)}
          disabled={isLoading}
          className="w-full py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-zinc-800 disabled:to-zinc-800 rounded-2xl flex items-center justify-center gap-4 transition-all text-base font-black group shadow-xl active:scale-[0.98]"
        >
          <i className={`fa-solid fa-wand-magic-sparkles text-white/70 ${isLoading ? 'animate-spin' : ''}`}></i>
          <span className="text-white drop-shadow-md font-black">{isLoading ? '창작 프로세스 가동 중...' : '프롬프트 생성'}</span>
        </button>
      </div>
    </div>
  );
};

export default MusicForm;
