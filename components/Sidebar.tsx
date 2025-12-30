
import React from 'react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: 'fa-home', label: 'Home', active: true },
    { icon: 'fa-chart-simple', label: 'Dashboard' },
    { icon: 'fa-key', label: 'API Management' },
    { icon: 'fa-gear', label: 'Settings' },
    { icon: 'fa-file-lines', label: 'Docs' },
    { icon: 'fa-circle-question', label: 'Help' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-[#0a0a0b] flex flex-col items-center lg:items-start p-4 border-r border-zinc-800/50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
          <i className="fa-solid fa-bolt text-xl text-white"></i>
        </div>
        <span className="hidden lg:block text-xl font-bold tracking-tighter">MELODY AI</span>
      </div>

      <nav className="flex-1 w-full space-y-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${
              item.active 
                ? 'bg-zinc-900 text-white border border-zinc-800' 
                : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/50'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg lg:text-base`}></i>
            <span className="hidden lg:block font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="w-full mt-auto p-2 lg:p-0">
        <div className="hidden lg:block bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
          <p className="text-xs text-zinc-400 mb-2">PRO PLAN</p>
          <p className="text-sm font-semibold mb-3">Upgrade for unlimited generations</p>
          <button className="w-full py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-colors">
            Upgrade Now
          </button>
        </div>
        
        <div className="flex items-center gap-3 p-2 border-t border-zinc-800">
          <img src="https://picsum.photos/40/40" className="w-8 h-8 rounded-full border border-zinc-700" alt="Avatar" />
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-medium truncate">Senior Composer</p>
            <p className="text-xs text-zinc-500">free_tier_user</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
