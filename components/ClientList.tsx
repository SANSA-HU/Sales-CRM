
import React, { useState } from 'react';
import { Client, ClientStatus, VenueType } from '../types';
import { STATUS_COLORS, VENUE_ICONS } from '../constants';
import { calculateLeadScore } from '../services/scoringService';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onAddClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const today = new Date().toISOString().split('T')[0];

  const filteredClients = clients.filter(client => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = 
      client.venueName.toLowerCase().includes(searchStr) || 
      client.companyName.toLowerCase().includes(searchStr) ||
      client.contactPerson.toLowerCase().includes(searchStr) ||
      client.country.toLowerCase().includes(searchStr) ||
      client.source.toLowerCase().includes(searchStr);
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="搜索场地、联系人、国家..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">所有状态</option>
            {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button 
          onClick={onAddClient}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          新增国际客户
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">智能评分</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">国家 & 来源</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">场地 & 联系人</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">当前状态</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">下次跟进</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClients.map((client) => {
              const isToday = client.nextFollowUp === today;
              const score = calculateLeadScore(client);
              return (
                <tr 
                  key={client.id} 
                  className={`transition-colors cursor-pointer group ${
                    isToday 
                      ? 'bg-orange-50/70 hover:bg-orange-100/70' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectClient(client)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-2 ${
                         score > 80 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' :
                         score > 50 ? 'border-indigo-500 text-indigo-600 bg-indigo-50' :
                         'border-gray-200 text-gray-400'
                       }`}>
                         {score}
                       </div>
                       {score > 80 && <i className="fa-solid fa-fire text-orange-500 animate-pulse text-[10px]"></i>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{client.country}</span>
                      <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-1.5 py-0.5 rounded w-fit mt-1">
                        {client.source}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 flex-shrink-0">
                        {VENUE_ICONS[client.venueType]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{client.venueName}</p>
                        <p className="text-[11px] text-indigo-600 font-bold mt-0.5">
                          <i className="fa-solid fa-user-tie mr-1 text-[9px] opacity-70"></i>
                          {client.contactPerson}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${STATUS_COLORS[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <i className={`fa-solid fa-calendar-day text-xs ${isToday ? 'text-orange-600' : 'text-gray-300'}`}></i>
                        <span className={`text-sm font-bold ${isToday ? 'text-orange-700' : 'text-gray-600'}`}>
                          {client.nextFollowUp}
                        </span>
                      </div>
                      {isToday && (
                        <div className="flex items-center text-[10px] font-black text-orange-600 uppercase bg-orange-100 px-2 py-0.5 rounded-md w-fit animate-pulse border border-orange-200">
                          <i className="fa-solid fa-bolt-lightning mr-1"></i>
                          立即跟进
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className={`font-bold text-sm transition-colors ${isToday ? 'text-orange-600 hover:text-orange-800' : 'text-indigo-600 hover:text-indigo-800'}`}>
                      查看详情
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="py-20 text-center">
            <i className="fa-solid fa-earth-americas text-5xl text-gray-200 mb-4"></i>
            <p className="text-gray-500">未找到相关国际客户</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
