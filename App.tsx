
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import Reports from './components/Reports';
import ClientForm from './components/ClientForm';
import Login from './components/Login';
import { Client, ClientStatus, VenueType } from './types';

// Mock initial data
const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    companyName: 'Happy Land Entertainment Group Pte Ltd',
    venueName: 'Happy Land Arcade (Marina Square)',
    venueType: VenueType.ARCADE,
    country: '新加坡 (Singapore)',
    contactPerson: 'Marcus Chen',
    email: 'marcus.chen@happyland.sg',
    phone: '+65 6789 0000',
    status: ClientStatus.NEGOTIATING,
    source: '大客户推荐',
    lastFollowUp: '2023-11-24',
    nextFollowUp: new Date().toISOString().split('T')[0],
    notes: '客户对我们的多语言收银系统非常满意，特别关注礼品库存管理功能。',
    address: '6 Raffles Blvd, #03-200 Marina Square, Singapore',
    scale: '1200 sqm, 150 Machines',
    logs: [
      { id: 'l1', date: '2023-11-24', content: 'Zoom会议演示了后台ERP对接功能。', type: 'Zoom会议' },
      { id: 'l2', date: '2023-11-20', content: '初步通过Email建立联系，发送了公司Profile。', type: '邮件' }
    ]
  },
  {
    id: '2',
    companyName: 'Neon Nights LLC',
    venueName: 'Starlight KTV Lounge',
    venueType: VenueType.KTV,
    country: '美国 (USA)',
    contactPerson: 'Sarah Jenkins',
    email: 'sarah.j@starlightlounge.com',
    phone: '+1 (555) 123-4567',
    status: ClientStatus.POTENTIAL,
    source: '官网询盘',
    lastFollowUp: '2023-11-22',
    nextFollowUp: '2023-12-05',
    notes: '正在考虑更换旧的单机系统，关心SaaS的稳定性和离线工作能力。',
    address: '789 Broadway, New York, NY 10003',
    scale: '30 Premium Rooms',
    logs: [
      { id: 'l3', date: '2023-11-22', content: '发送了针对美国市场的价格方案。', type: '邮件' }
    ]
  },
  {
    id: '3',
    companyName: 'Jump Global Resorts',
    venueName: 'Sky Bound Trampoline Park',
    venueType: VenueType.TRAMPOLINE,
    country: '英国 (UK)',
    contactPerson: 'David Miller',
    email: 'd.miller@jumpglobal.co.uk',
    phone: '+44 20 7946 0000',
    status: ClientStatus.SIGNED,
    source: '海外展会',
    lastFollowUp: '2023-11-15',
    nextFollowUp: '2023-12-15',
    notes: '已完成三家分店的签约，正在准备伦敦总店的上线。',
    address: 'Unit 5, Canary Wharf, London',
    scale: '3 Locations, 5000+ Daily users',
    logs: [
      { id: 'l4', date: '2023-11-15', content: '面谈确认了定制化的会员积分系统。', type: '面访' }
    ]
  }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('arcamaster_auth') === 'true';
  });
  const [view, setView] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('arcamaster_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();

  useEffect(() => {
    localStorage.setItem('arcamaster_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('arcamaster_auth', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const handleSaveClient = (client: Client) => {
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === client.id ? client : c));
    } else {
      setClients(prev => [client, ...prev]);
    }
    setIsFormOpen(false);
    setEditingClient(undefined);
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient(client);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleUpdateClient = (updated: Client) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedClient(updated);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard 
          clients={clients} 
          onNavigateToFollowup={() => setView('followup')} 
          onSelectClient={setSelectedClient} 
        />;
      case 'clients':
        return (
          <ClientList 
            clients={clients} 
            onSelectClient={setSelectedClient} 
            onAddClient={() => { setEditingClient(undefined); setIsFormOpen(true); }} 
          />
        );
      case 'followup':
        const today = new Date().toISOString().split('T')[0];
        const pending = clients.filter(c => c.nextFollowUp === today);
        return <ClientList 
          clients={pending} 
          onSelectClient={setSelectedClient} 
          onAddClient={() => { setEditingClient(undefined); setIsFormOpen(true); }} 
        />;
      case 'reports':
        return <Reports clients={clients} />;
      default:
        return <Dashboard clients={clients} onNavigateToFollowup={() => setView('followup')} onSelectClient={setSelectedClient} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={view} setView={setView} onLogout={handleLogout} />
      
      <main className="flex-1 ml-64 p-8 bg-slate-50">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              {view === 'dashboard' ? 'ArcaMaster 看板' : 
               view === 'clients' ? '国际客户名录' : 
               view === 'reports' ? '销售分析中心' : '今日跟进提醒'}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              {view === 'reports' 
                ? '通过 AI 深度洞察您的销售业绩表现。' 
                : `当前管理 ${new Set(clients.map(c => c.country)).size} 个国家/地区的场地。`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
             <button 
              onClick={() => { setEditingClient(undefined); setIsFormOpen(true); }}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center text-sm uppercase tracking-wider"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              快速登记
            </button>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>AI Engine Active</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>

        {selectedClient && (
          <ClientDetail 
            client={selectedClient} 
            onClose={() => setSelectedClient(null)}
            onUpdateClient={handleUpdateClient}
            onEditClient={() => handleEdit(selectedClient)}
          />
        )}

        {isFormOpen && (
          <ClientForm 
            client={editingClient}
            onSave={handleSaveClient}
            onClose={() => { setIsFormOpen(false); setEditingClient(undefined); }}
          />
        )}
      </main>
    </div>
  );
};

export default App;
