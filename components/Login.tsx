
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white/20 backdrop-blur-sm relative z-10 animate-scale-up">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <i className="fa-solid fa-vr-cardboard text-white text-4xl"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">ArcaMaster</h1>
          <p className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest">SaaS Sales Intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">工作邮箱</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <input 
                type="email" 
                required 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">访问密码</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <i className="fa-solid fa-lock"></i>
              </div>
              <input 
                type="password" 
                required 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold">
            <label className="flex items-center text-slate-500 cursor-pointer group">
              <input type="checkbox" className="mr-2 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 transition-all" />
              <span className="group-hover:text-indigo-600 transition-colors">保持登录</span>
            </label>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-500/30 underline-offset-4">找回密码</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
            ) : (
              <>
                进入销售中心
                <i className="fa-solid fa-arrow-right-long ml-3"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-6">第三方安全验证</p>
          <div className="flex justify-center space-x-4">
            <button className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all group">
              <i className="fa-brands fa-google text-xl"></i>
            </button>
            <button className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all group">
              <i className="fa-brands fa-linkedin-in text-xl"></i>
            </button>
            <button className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all group">
              <i className="fa-brands fa-microsoft text-xl"></i>
            </button>
          </div>
          <p className="mt-8 text-[11px] text-slate-400 font-medium">
            还没有账号? <a href="#" className="text-indigo-600 font-bold hover:underline">申请加入 ArcaMaster</a>
          </p>
        </div>
      </div>
      
      {/* Footer info */}
      <div className="absolute bottom-8 text-center w-full text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
        &copy; 2024 ArcaMaster Global Entertainment Solutions
      </div>
    </div>
  );
};

export default Login;
