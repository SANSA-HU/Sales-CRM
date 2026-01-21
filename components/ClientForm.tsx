
import React, { useState } from 'react';
import { Client, ClientStatus, VenueType } from '../types';

interface ClientFormProps {
  client?: Client;
  onSave: (client: Client) => void;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Client>>(
    client || {
      companyName: '',
      venueName: '',
      venueType: VenueType.ARCADE,
      status: ClientStatus.POTENTIAL,
      country: '',
      contactPerson: '',
      email: '',
      phone: '',
      source: '',
      nextFollowUp: new Date().toISOString().split('T')[0],
      notes: '',
      address: '',
      scale: '',
      logs: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = {
      ...formData,
      id: client?.id || Math.random().toString(36).substr(2, 9),
      lastFollowUp: client?.lastFollowUp || new Date().toISOString().split('T')[0],
    } as Client;
    onSave(newClient);
  };

  const inputClass = "w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-scale-up overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/30">
            <h2 className="text-xl font-bold text-gray-900">
              {client ? '编辑客户信息' : '新增国际客户'}
            </h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>公司全称</label>
                <input required className={inputClass} value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="例如: Happy Land Pte Ltd" />
              </div>
              <div>
                <label className={labelClass}>场地名称</label>
                <input required className={inputClass} value={formData.venueName} onChange={e => setFormData({...formData, venueName: e.target.value})} placeholder="例如: Marina Square Arcade" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>场地类型</label>
                  <select className={inputClass} value={formData.venueType} onChange={e => setFormData({...formData, venueType: e.target.value as VenueType})}>
                    {Object.values(VenueType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>当前状态</label>
                  <select className={inputClass} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ClientStatus})}>
                    {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>国家/地区</label>
                <input required className={inputClass} value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} placeholder="例如: 新加坡 (Singapore)" />
              </div>
              <div>
                <label className={labelClass}>客户来源</label>
                <input className={inputClass} value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} placeholder="例如: 领英、展会、官网..." />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>联系人</label>
                  <input required className={inputClass} value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>联系电话</label>
                  <input required className={inputClass} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClass}>电子邮箱</label>
                <input required type="email" className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>下次跟进日期</label>
                <input 
                  required 
                  type="date" 
                  className={`${inputClass} cursor-pointer`} 
                  value={formData.nextFollowUp} 
                  onChange={e => setFormData({...formData, nextFollowUp: e.target.value})} 
                />
              </div>
              <div>
                <label className={labelClass}>场地规模</label>
                <input className={inputClass} value={formData.scale} onChange={e => setFormData({...formData, scale: e.target.value})} placeholder="例如: 1200 sqm, 150台机器" />
              </div>
              <div>
                <label className={labelClass}>备注说明</label>
                <textarea className={inputClass} rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="记录一些核心需求或痛点..." />
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">取消</button>
            <button type="submit" className="px-8 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition-shadow">
              确认保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
