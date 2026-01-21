
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Client, ClientStatus } from '../types';

interface DashboardProps {
  clients: Client[];
  onNavigateToFollowup: () => void;
  onSelectClient: (client: Client) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ clients, onNavigateToFollowup, onSelectClient }) => {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // 1. Stat Cards Calculations
  const totalLeads = clients.length;
  const newThisWeek = clients.filter(c => new Date(c.lastFollowUp) >= oneWeekAgo).length;
  const signedCount = clients.filter(c => c.status === ClientStatus.SIGNED).length;
  const conversionRate = totalLeads > 0 ? ((signedCount / totalLeads) * 100).toFixed(1) : '0.0';

  // 2. 14-Day Trend Data
  const trendData = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];
    const count = clients.filter(c => c.lastFollowUp === dateStr).length + Math.floor(Math.random() * 3);
    return {
      date: d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      leads: count,
    };
  });

  // 3. Country Distribution (Top 5)
  const countryMap: Record<string, number> = {};
  clients.forEach(c => countryMap[c.country] = (countryMap[c.country] || 0) + 1);
  const topCountries = Object.entries(countryMap)
    .map(([name, count]) => ({ name, count, percentage: (count / totalLeads) * 100 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 4. Referrer Ranking
  const referrerMap: Record<string, number> = {};
  clients.forEach(c => {
    const src = c.source || '未知来源';
    referrerMap[src] = (referrerMap[src] || 0) + 1;
  });
  const topReferrers = Object.entries(referrerMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // 5. Funnel Stages
  const funnel = [
    { label: '新线索 (Leads)', value: totalLeads, color: 'bg-indigo-400' },
    { label: '初步沟通 (Contacted)', value: clients.filter(c => c.logs.length > 0).length, color: 'bg-indigo-500' },
    { label: '方案报价 (Proposal)', value: clients.filter(c => c.status === ClientStatus.NEGOTIATING || c.status === ClientStatus.SIGNED).length, color: 'bg-indigo-600' },
    { label: '成交 (Closed)', value: signedCount, color: 'bg-indigo-800' },
  ];

  // 6. Activity Feed
  const activities = clients.flatMap(c => 
    c.logs.map(l => ({
      id: l.id,
      clientName: c.venueName,
      country: c.country,
      type: l.type,
      content: l.content,
      date: l.date,
      timestamp: new Date(l.date).getTime()
    }))
  ).sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

  return (
    <div className="space-y-6 pb-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="总线索数" value={totalLeads} trend="+8.2%" icon="fa-users" color="bg-indigo-600" />
        <StatCard label="本周新增" value={newThisWeek} trend="+3" icon="fa-bolt-lightning" color="bg-purple-500" />
        <StatCard label="线索转化率" value={`${conversionRate}%`} trend="+1.5%" icon="fa-chart-pie" color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">线索增长趋势</h3>
              <p className="text-sm text-gray-400">14天内的日获取线索量</p>
            </div>
            <select className="text-xs font-bold bg-gray-50 border-none rounded-lg px-3 py-1.5 outline-none">
              <option>过去 14 天</option>
              <option>过去 30 天</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="leads" stroke="#6366F1" strokeWidth={4} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Countries Bar Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">重点地区分布</h3>
          <div className="flex-1 space-y-6">
            {topCountries.map((c, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getFlag(c.name)}</span>
                    <span className="text-sm font-bold text-gray-700">{c.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-400">{c.percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${c.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
            查看全球分布地图
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">销售转化漏斗</h3>
          <div className="space-y-1">
            {funnel.map((step, i) => (
              <div key={i} className="relative group">
                <div className={`h-12 ${step.color} flex items-center justify-between px-4 rounded-lg transition-transform hover:scale-[1.02] cursor-default mb-1`}>
                  <span className="text-[10px] font-bold text-white uppercase truncate mr-2">{step.label}</span>
                  <span className="text-sm font-black text-white">{step.value}</span>
                </div>
                {i < funnel.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <i className="fa-solid fa-caret-down text-gray-200"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex justify-between">
            推荐热度榜
            <i className="fa-solid fa-trophy text-yellow-500"></i>
          </h3>
          <div className="space-y-4">
            {topReferrers.map((ref, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-white text-gray-400'
                  }`}>
                    {i === 0 ? <i className="fa-solid fa-crown"></i> : i + 1}
                  </div>
                  <span className="text-sm font-bold text-gray-700 truncate max-w-[80px]">{ref.name}</span>
                </div>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                  {ref.count} 线索
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center">
            待处理动态
            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activities.length > 0 ? activities.map((act, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100 group">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-500 shrink-0 text-xs">
                  <i className={`fa-solid ${getActivityIcon(act.type)}`}></i>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-800 leading-tight">
                    <span className="font-bold text-indigo-600">[{act.country}]</span> {act.clientName}: {act.content.substring(0, 15)}...
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">
                    {act.date} • {act.type}
                  </p>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-10 text-gray-300 italic text-sm">暂无近期活动记录</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group overflow-hidden relative">
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform">
      <i className={`fa-solid ${icon} text-6xl text-gray-900`}></i>
    </div>
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className={`text-[10px] font-black px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {trend}
      </div>
    </div>
    <h4 className="text-2xl font-black text-gray-900 mb-1">{value}</h4>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
  </div>
);

const getFlag = (country: string) => {
  if (country.includes('新加坡')) return '🇸🇬';
  if (country.includes('美国')) return '🇺🇸';
  if (country.includes('英国')) return '🇬🇧';
  if (country.includes('日本')) return '🇯🇵';
  if (country.includes('韩国')) return '🇰🇷';
  if (country.includes('澳洲')) return '🇦🇺';
  return '🏳️';
};

const getActivityIcon = (type: string) => {
  switch(type) {
    case '邮件': return 'fa-envelope';
    case 'Zoom会议': return 'fa-video';
    case '电话': return 'fa-phone';
    case '系统演示': return 'fa-display';
    default: return 'fa-circle-dot';
  }
};

export default Dashboard;
