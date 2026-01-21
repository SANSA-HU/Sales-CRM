
import React, { useState, useEffect } from 'react';
import { Client, FollowUpLog } from '../types';
import { getClientInsight, generateOutreachDraft } from '../services/geminiService';
import { STATUS_COLORS, VENUE_ICONS } from '../constants';
import { calculateLeadScore } from '../services/scoringService';
import { getClientLocalTimeInfo } from '../services/timeService';

interface ClientDetailProps {
  client: Client;
  onClose: () => void;
  onUpdateClient: (updated: Client) => void;
  onEditClient: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ client, onClose, onUpdateClient, onEditClient }) => {
  const [insight, setInsight] = useState<any>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [newLog, setNewLog] = useState('');
  
  // AI Outreach states
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState('');
  const [loadingOutreach, setLoadingOutreach] = useState(false);

  const score = calculateLeadScore(client);
  const timeInfo = getClientLocalTimeInfo(client.country);

  useEffect(() => {
    fetchInsight();
  }, [client.id]);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const result = await getClientInsight(client);
    setInsight(result);
    setLoadingInsight(false);
  };

  const handleGenerateOutreach = async () => {
    setIsOutreachOpen(true);
    setLoadingOutreach(true);
    const draft = await generateOutreachDraft(client);
    setOutreachDraft(draft || '');
    setLoadingOutreach(false);
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(outreachDraft);
    alert('已成功复制到剪贴板！');
  };

  const handleAddLog = () => {
    if (!newLog) return;
    const log: FollowUpLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      content: newLog,
      type: '邮件'
    };
    onUpdateClient({
      ...client,
      logs: [log, ...client.logs],
      lastFollowUp: log.date
    });
    setNewLog('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl text-indigo-600 border border-indigo-100 relative">
              {VENUE_ICONS[client.venueType]}
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black shadow-md ${
                score > 80 ? 'bg-orange-500 text-white' : 'bg-indigo-500 text-white'
              }`}>
                {score}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-gray-900">{client.venueName}</h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                  {client.country}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[client.status]}`}>
                  {client.status}
                </span>
                <span>•</span>
                <span className="font-medium text-gray-700">{client.companyName}</span>
                <span>•</span>
                <span className="text-indigo-600 font-bold italic">{client.venueType}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <button 
              onClick={handleGenerateOutreach}
              className="p-2.5 px-4 bg-indigo-600 border border-indigo-700 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 transition-all flex items-center shadow-md"
            >
              <i className="fa-solid fa-wand-sparkles mr-2"></i>
              AI 开发信
            </button>
            <button 
              onClick={onEditClient}
              className="p-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center"
            >
              <i className="fa-solid fa-pen-to-square mr-2"></i>
              修改资料
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Intelligence Row: Smart Scoring + Time Advice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-6">
                <div className="relative">
                   <svg className="w-20 h-20 transform -rotate-90">
                     <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                     <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={226} strokeDashoffset={226 - (226 * score) / 100} className={score > 80 ? "text-orange-500" : "text-indigo-500"} />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-gray-800">
                     {score}
                   </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">智能线索评分</h3>
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    {score > 80 ? "优质潜力客户：推荐关系稳定，来源权重极高，建议作为本月攻坚重点。" : "常规意向线索：已建立初步联系，建议持续通过案例推送保持热度。"}
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex items-center space-x-6 transition-all ${timeInfo.isOptimal ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${timeInfo.isOptimal ? 'bg-emerald-600 text-white' : 'bg-white text-gray-400 shadow-sm border border-gray-200'}`}>
                   <span className="text-[10px] font-black uppercase opacity-60">当地</span>
                   <span className="text-lg font-black leading-none">{timeInfo.localTime}</span>
                </div>
                <div>
                  <h3 className={`font-bold text-sm mb-1 ${timeInfo.isOptimal ? 'text-emerald-900' : 'text-gray-900'}`}>最佳联系时间提示</h3>
                  <p className={`text-xs leading-relaxed ${timeInfo.isOptimal ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {timeInfo.advice}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Insight Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-earth-americas text-6xl text-indigo-900"></i>
              </div>
              <h3 className="text-indigo-900 font-bold mb-4 flex items-center">
                <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                AI 全球销售助手分析 ({client.country})
              </h3>
              {loadingInsight ? (
                <div className="flex items-center space-x-2 text-indigo-400">
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  <span>正在深度分析跨区域需求与文化差异...</span>
                </div>
              ) : insight ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">市场痛点分析</p>
                    <p className="text-indigo-900 text-sm">{insight.analysis}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/60 p-3 rounded-lg border border-white/50">
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">推荐跟进策略</p>
                      <p className="text-indigo-900 text-xs leading-relaxed">{insight.strategy}</p>
                    </div>
                    <div className="bg-indigo-600 p-3 rounded-lg shadow-lg">
                      <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">专业沟通话术</p>
                      <p className="text-white text-xs italic leading-relaxed">"{insight.script}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">暂无 AI 洞察，请完善客户背景资料。</p>
              )}
            </div>

            {/* Follow-up History */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <i className="fa-solid fa-history text-gray-400 mr-2"></i>
                跟进历程
              </h3>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex space-x-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="输入新的沟通摘要..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newLog}
                    onChange={(e) => setNewLog(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLog()}
                  />
                  <button 
                    onClick={handleAddLog}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-shadow hover:shadow-md"
                  >
                    保存记录
                  </button>
                </div>
                <div className="space-y-6">
                  {client.logs.map((log, i) => (
                    <div key={log.id} className="relative pl-6 pb-6 border-l border-gray-100 last:pb-0">
                      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-white"></div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-400">{log.date}</span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded uppercase font-bold">{log.type}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{log.content}</p>
                    </div>
                  ))}
                  {client.logs.length === 0 && (
                    <p className="text-sm text-gray-400 italic py-4">尚无跟进记录</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Info Panel */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 space-y-6 border border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">核心联络信息</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-xl border border-gray-100 group transition-colors hover:border-indigo-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">联系人姓名</p>
                    <p className="text-sm font-black text-gray-900 flex items-center">
                      <i className="fa-solid fa-user-tie mr-2 text-indigo-500"></i>
                      {client.contactPerson}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-100 group transition-colors hover:border-indigo-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">电子邮箱</p>
                    <a href={`mailto:${client.email}`} className="text-sm font-bold text-indigo-600 flex items-center hover:underline">
                      <i className="fa-solid fa-envelope mr-2"></i>
                      {client.email}
                    </a>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">联系电话</p>
                    <p className="text-sm font-bold text-gray-700 flex items-center">
                      <i className="fa-solid fa-phone mr-2"></i>
                      {client.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">业务属性</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-gray-500">客户来源</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{client.source}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-gray-500">国家/地区</span>
                    <span className="font-semibold text-gray-900">{client.country}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-gray-500">公司全称</span>
                    <span className="font-semibold text-gray-900 text-right text-[11px] leading-tight max-w-[120px]">{client.companyName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">场地规模</span>
                    <span className="font-semibold text-gray-900">{client.scale || '未备注'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">跟进提醒</h4>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div>
                    <p className="text-xs text-orange-800 font-bold">下次跟进日期</p>
                    <p className="text-lg font-bold text-orange-900">{client.nextFollowUp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Outreach Draft Modal */}
      {isOutreachOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[70] p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh] animate-scale-up">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center">
                <i className="fa-solid fa-wand-sparkles text-indigo-600 mr-2"></i>
                AI 个性化开发信草稿
              </h3>
              <button onClick={() => setIsOutreachOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {loadingOutreach ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-indigo-600">AI 正在根据场地背景和推荐关系撰写开发信...</p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-inner whitespace-pre-wrap text-sm leading-relaxed font-mono text-gray-700">
                  {outreachDraft}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end space-x-3">
              <button 
                onClick={() => setIsOutreachOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
              <button 
                onClick={handleCopyOutreach}
                disabled={loadingOutreach}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition-all flex items-center disabled:opacity-50"
              >
                <i className="fa-solid fa-copy mr-2"></i>
                复制草稿
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetail;
