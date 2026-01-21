
import React from 'react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: '工作看板', icon: 'fa-chart-pie' },
    { id: 'clients', label: '客户管理', icon: 'fa-users-viewfinder' },
    { id: 'followup', label: '智能跟进', icon: 'fa-clock-rotate-left' },
    { id: 'reports', label: '分析中心', icon: 'fa-file-invoice-dollar' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-40 border-r border-slate-800 shadow-2xl">
      <div className="p-8 flex items-center space-x-4 border-b border-slate-800/50">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
          <i className="fa-solid fa-vr-cardboard text-xl"></i>
        </div>
        <span className="text-xl font-black tracking-tighter uppercase">ArcaMaster</span>
      </div>
      
      <nav className="flex-1 mt-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all group ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-lg transition-transform group-hover:scale-110`}></i>
            <span className="font-bold text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800/50 space-y-4">
        <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-2xl border border-slate-800/50">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-10 h-10 rounded-xl bg-slate-700 p-1" alt="Avatar" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black truncate uppercase tracking-widest">王销售</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase truncate tracking-tighter">海外业务经理</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-transparent hover:border-red-500/20"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>退出系统</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
