import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { verifyUserCredentials } from '../lib/supabase';
import BrandLogo from './BrandLogo';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await verifyUserCredentials(username, password);

    if (result.success) {
      const loginName = result.user?.username || username.trim();
      localStorage.setItem('trip_user', loginName);
      onLoginSuccess(loginName);
    } else {
      setErrorMsg(result.error || '帳號或密碼錯誤，請重新輸入！');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 text-slate-800 font-sans relative overflow-hidden select-none">
      
      {/* Light Soft Glow Background Circles */}
      <div className="absolute top-1/4 left-1/3 w-[30rem] h-[30rem] bg-orange-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] bg-amber-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Light Theme Card */}
      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-white backdrop-blur-md border border-slate-200/80 shadow-xl rounded-3xl relative z-10 space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <BrandLogo className="w-20 h-20 mx-auto drop-shadow-sm" />

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-1 mt-3">
            <span className="text-orange-500">旅遊</span>筆記
          </h2>

          <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 特色旅遊規劃與實時雲端記帳
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              使用者帳號
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="請輸入帳號"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              密碼
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" /> {loading ? '驗證中...' : '登入系統'}
          </button>
        </form>

      </div>
    </div>
  );
}
