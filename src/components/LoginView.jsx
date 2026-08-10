import React, { useState } from 'react';
import { Compass, Lock, User, LogIn, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      // Default credentials check
      if (username.trim().toLowerCase() === 'test' && password === '000000') {
        localStorage.setItem('trip_user', username.trim());
        onLoginSuccess(username.trim());
      } else {
        setErrorMsg('帳號或密碼錯誤！(預設帳號: test / 密碼: 000000)');
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickLogin = () => {
    setUsername('test');
    setPassword('000000');
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('trip_user', 'test');
      onLoginSuccess('test');
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans relative overflow-hidden bg-codecat-glow select-none">
      
      {/* Warm Ambient Glow Circles */}
      <div className="absolute top-1/4 left-1/3 w-[30rem] h-[30rem] bg-orange-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Login Glass Card */}
      <div className="w-full max-w-md glass-card p-8 bg-slate-900/80 border border-slate-800 shadow-2xl rounded-3xl relative z-10 space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Compass className="w-9 h-9 animate-spin-slow" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1 mt-3">
            <span className="text-orange-500">旅遊</span>筆記
          </h2>

          <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 特色旅遊規劃與實時雲端記帳
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              使用者帳號
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="預設帳號: test"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              密碼
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="預設密碼: 000000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" /> {loading ? '登入中...' : '登入系統'}
          </button>
        </form>

        {/* Quick Test Login Hint & Button */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
          <div className="text-[11px] text-slate-400 font-semibold">
            預設帳號: <span className="text-orange-400 font-mono font-bold">test</span> | 密碼: <span className="text-orange-400 font-mono font-bold">000000</span>
          </div>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            ⚡ 一鍵帶入預設帳號並登入
          </button>
        </div>

      </div>
    </div>
  );
}
