
import React from 'react';

const NewsPanel: React.FC = () => {
  const cards = [
    {
      label: '블로그 AI 에이전트',
      title: '알파블로그 AI',
      desc: 'Chat GPT, Claude, Gemini\n3대 AI 통합 에이전트\n\n고품격 고품질 블로그\n콘텐츠 생성 + 대량생성',
      link: '자세히 보기 →',
      bgColor: 'from-[#1a0b2e] to-[#0d041a]',
      borderColor: 'border-fuchsia-900/40',
      labelColor: 'text-fuchsia-300'
    },
    {
      label: '퍼스널 브랜딩',
      title: 'Alphademy',
      desc: 'AI를 활용한\n퍼스널 브랜딩의 시작\n\n아이템이 변해도\n변하지 않는 본질',
      link: '자세히 보기 →',
      bgColor: 'from-[#0b1a2e] to-[#040d1a]',
      borderColor: 'border-blue-900/40',
      labelColor: 'text-blue-300'
    },
    {
      label: '자동화 & AI 뉴스',
      title: '알파GOGOGO 블로그',
      desc: '다양한 자동화 프로그램\n무료 다운로드\n\nAI 관련 최신뉴스\n실시간 업데이트',
      link: '자세히 보기 →',
      bgColor: 'from-[#0b2e1a] to-[#041a0d]',
      borderColor: 'border-emerald-900/40',
      labelColor: 'text-emerald-300'
    }
  ];

  return (
    <aside className="w-[320px] flex flex-col p-6 space-y-4 overflow-y-auto bg-[#030303]">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className={`p-6 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.bgColor} space-y-4 cursor-pointer hover:border-zinc-700 transition-all group`}
        >
          <div className="text-center">
            <span className={`text-[10px] font-black uppercase tracking-tighter ${card.labelColor}`}>
              {card.label}
            </span>
            <h3 className="text-lg font-black text-white mt-1 group-hover:scale-105 transition-transform">{card.title}</h3>
          </div>
          
          <div className="w-full h-px bg-white/10 my-4" />
          
          <p className="text-[11px] text-zinc-400 whitespace-pre-line leading-relaxed text-center">
            {card.desc}
          </p>
          
          <div className="text-[10px] text-zinc-500 font-bold text-center group-hover:text-white transition-colors">
            {card.link}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default NewsPanel;
