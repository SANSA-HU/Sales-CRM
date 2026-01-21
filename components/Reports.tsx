
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Client, VenueType } from '../types';
import { getPeriodSummary } from '../services/geminiService';

interface ReportsProps {
  clients: Client[];
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

const Reports: React.FC<ReportsProps> = ({ clients }) => {
  const [reportType, setReportType] = useState<'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'month' | 'year'>('month');
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Sync chart type with the main report filter initially
  useEffect(() => {
    setChartType(reportType);
  }, [reportType]);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const summary = await getPeriodSummary(clients, reportType);
      setAiSummary(summary);
      setLoading(false);
    };
    fetchSummary();
  }, [reportType, clients]);

  // Mock Trend Data
  const trendData = chartType === 'month' 
    ? [
        { name: 'W1', new: 2, conv: 1 },
        { name: 'W2', new: 5, conv: 2 },
        { name: 'W3', new: 3, conv: 1 },
        { name: 'W4', new: 8, conv: 4 },
      ]
    : [
        { name: 'Q1', new: 12, conv: 5 },
        { name: 'Q2', new: 18, conv: 8 },
        { name: 'Q3', new: 15, conv: 6 },
        { name: 'Q4', new: 25, conv: 12 },
      ];

  // Calculate Channel Distribution
  const channelData = React.useMemo(() => {
    const map: Record<string, number> = {};
    clients.forEach(c => {
      const source = c.source || '未知来源';
      map[source] = (map[source] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [clients]);

  // Calculate Venue Type Distribution
  const venueTypeData = React.useMemo(() => {
    const map: Record<string, number> = {};
    clients.forEach(c => {
      map[c.venueType] = (map[c.venueType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [clients]);

  return (
    <div className="space-y-8 pb-20">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm w-fit">
          <button 
            onClick={() => setReportType('month')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${reportType === 'month' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            本月报告
          </button>
          <button 
            onClick={() => setReportType('year')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${reportType === 'year' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            年度汇总
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
          <i className="fa-solid fa-circle-info"></i>
          <span>报告数据每 24 小时自动更新，AI 分析实时生成。</span>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/20 overflow-hidden">
        <div className="bg-indigo-600 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-wand-sparkles text-xl"></i>
            </div>
            <div>
              <h2 className="font-black text-lg uppercase tracking-tight">AI 销售分析简报</h2>
              <p className="text-indigo-100 text-xs font-medium">由 Gemini 3 Pro 深度引擎驱动</p>
            </div>
          </div>
          {loading && <i className="fa-solid fa-circle-notch animate-spin text-white text-xl"></i>}
        </div>
        
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">正在解析全球销售数据结构...</p>
            </div>
          ) : aiSummary ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">业绩总览</h3>
                  <p className="text-gray-700 leading-relaxed text-sm font-medium">{aiSummary.overview}</p>
                </div>
                <div>
                  <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">阶段亮点</h3>
                  <ul className="space-y-3">
                    {aiSummary.highlights?.map((h: string, i: number) => (
                      <li key={i} className="flex items-start space-x-3">
                        <i className="fa-solid fa-check-circle text-emerald-500 mt-1"></i>
                        <span className="text-sm text-gray-600 font-medium">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-amber-500 uppercase tracking-[0.2em] mb-3">潜在风险</h3>
                  <ul className="space-y-3">
                    {aiSummary.risks?.map((r: string, i: number) => (
                      <li key={i} className="flex items-start space-x-3">
                        <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
                        <span className="text-sm text-gray-600 font-medium">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">下一步行动计划</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {aiSummary.actions?.map((a: string, i: number) => (
                      <div key={i} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-900 leading-tight">
                          <span className="bg-indigo-600 text-white w-5 h-5 inline-flex items-center justify-center rounded-md mr-2 text-[10px]">0{i+1}</span>
                          {a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 italic">未能生成 AI 报告，请尝试刷新。</div>
          )}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">获客与转化趋势</h3>
              <p className="text-sm text-gray-400 font-medium">{chartType === 'month' ? '本月每周表现数据' : '年度季度汇总数据'}</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={chartType === 'year'} 
                    onChange={() => setChartType(prev => prev === 'month' ? 'year' : 'month')}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${chartType === 'year' ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${chartType === 'year' ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">切换全年趋势</span>
              </label>
            </div>
          </div>
          
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={15}
                  fontFamily="Inter, sans-serif"
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }} 
                />
                <Area 
                  name="新增线索"
                  type="monotone" 
                  dataKey="new" 
                  stroke="#6366F1" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorNew)" 
                />
                <Area 
                  name="成功转化"
                  type="monotone" 
                  dataKey="conv" 
                  stroke="#10B981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorConv)" 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Analysis Pie Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">获客渠道分布</h3>
            <p className="text-sm text-gray-400 font-medium">线索来源占比分析</p>
          </div>
          
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">主要来源</p>
              <p className="text-lg font-black text-indigo-600 truncate">{channelData.sort((a,b)=>b.value-a.value)[0]?.name || '--'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">渠道集中度</p>
              <p className="text-lg font-black text-indigo-600">
                {channelData.length > 0 ? ((channelData.sort((a,b)=>b.value-a.value)[0]?.value / clients.length) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Venue Type Analysis Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">场地类型占比</h3>
            <p className="text-sm text-gray-400 font-medium">不同娱乐业态的分布情况</p>
          </div>
          
          <div className="flex-1 min-h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={venueTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {venueTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 space-y-3">
             {venueTypeData.sort((a,b)=>b.value-a.value).slice(0,3).map((item, i) => (
               <div key={i} className="flex items-center justify-between text-xs font-bold">
                 <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[(venueTypeData.indexOf(item) + 2) % COLORS.length] }}></div>
                   <span className="text-gray-500">{item.name}</span>
                 </div>
                 <span className="text-gray-900">{item.value} 场地</span>
               </div>
             ))}
          </div>
        </div>

        {/* Global Activity Map Placeholder */}
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 200C100 200 150 150 200 180C250 210 300 100 350 150C400 200 450 250 500 220C550 190 600 200 700 150" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
              <circle cx="200" cy="180" r="4" fill="white" className="animate-pulse" />
              <circle cx="500" cy="220" r="4" fill="white" className="animate-pulse" />
              <circle cx="350" cy="150" r="4" fill="white" className="animate-pulse" />
            </svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white tracking-tight">全球业务热度</h3>
            <p className="text-sm text-slate-400 font-medium">基于线索密度的动态市场地图</p>
          </div>
          <div className="mt-12 relative z-10 flex flex-wrap gap-4">
            <div className="bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-3">
              <span className="text-xl">🇸🇬</span>
              <span className="text-xs font-black text-white uppercase tracking-widest">Singapore High Density</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-3">
              <span className="text-xl">🇺🇸</span>
              <span className="text-xs font-black text-white uppercase tracking-widest">USA Emerging</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-3">
              <span className="text-xl">🇬🇧</span>
              <span className="text-xs font-black text-white uppercase tracking-widest">UK Steady Growth</span>
            </div>
          </div>
          <div className="mt-8 flex justify-end relative z-10">
            <button className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
              展开完整版全球分析图表 <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
