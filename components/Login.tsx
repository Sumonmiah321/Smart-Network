
import React, { useState, useEffect } from 'react';
import { CompanySettings } from '../types';

interface Props {
  company: CompanySettings;
  onLoginSuccess: () => void;
}

const Login: React.FC<Props> = ({ company, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const config = company.loginConfig;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // মক লগইন লজিক
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        if (rememberMe) {
          localStorage.setItem('isp_auth_permanent', 'true');
        }
        onLoginSuccess();
      } else {
        setError(company.language === 'bn' ? 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়!' : 'Invalid credentials!');
        setIsLoading(false);
      }
    }, 1200);
  };

  const getBackgroundStyle = () => {
    if (config.bgType === 'solid') return { backgroundColor: config.bgColor };
    if (config.bgType === 'gradient') return { background: config.bgGradient };
    if (config.bgType === 'image') return { backgroundImage: `url(${config.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return { backgroundColor: '#006a4e' };
  };

  const getPatternOverlay = () => {
    if (config.overlayPattern === 'dots') return 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)';
    if (config.overlayPattern === 'mesh') return 'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%)';
    if (config.overlayPattern === 'circuit') return 'url("https://www.transparenttextures.com/patterns/circuit-board.png")';
    return 'none';
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden font-['Hind_Siliguri']">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 transition-all duration-1000" style={getBackgroundStyle()}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: getPatternOverlay(), backgroundSize: config.overlayPattern === 'dots' ? '20px 20px' : '40px 40px' }} />
      </div>

      <div className="relative z-10 w-full max-w-md p-6 animate-fadeIn">
        <div className="mb-8 flex justify-center animate-slideDown">
           <img src={company.loginLogo} className="max-h-24 object-contain drop-shadow-2xl" alt="Brand Logo" />
        </div>

        <div 
          className="bg-white shadow-2xl overflow-hidden border border-white/20 transition-all duration-700"
          style={{ 
            borderRadius: `${config.cardRadius}px`,
            backgroundColor: `rgba(255, 255, 255, ${config.cardOpacity / 100})`,
            backdropFilter: `blur(${config.cardBlur}px)`
          }}
        >
          <div className="h-2" style={{ backgroundColor: config.primaryColor }}></div>

          <form onSubmit={handleLogin} className="p-10 pt-8 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black tracking-tight" style={{ color: config.headerTextColor }}>
                {company.language === 'bn' ? 'অ্যাডমিন এক্সেস' : 'Admin Access'}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: config.bodyTextColor }}>
                {config.welcomeMessage}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
                <p className="text-[10px] text-red-600 font-black text-center uppercase tracking-widest">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest ml-4 mb-1 block" style={{ color: config.bodyTextColor }}>Username</label>
                <input 
                  required 
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-opacity-100 font-bold text-slate-800 transition-all" 
                  style={{ borderColor: `${config.primaryColor}15` }} 
                  placeholder="admin" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest ml-4 mb-1 block" style={{ color: config.bodyTextColor }}>Password</label>
                <input 
                  required 
                  type="password" 
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white font-bold text-slate-800 transition-all" 
                  style={{ borderColor: `${config.primaryColor}15` }} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
               <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}>
                     <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                     {rememberMe && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-800">লগইন মনে রাখুন</span>
               </label>
               <button type="button" className="text-[9px] font-black uppercase text-blue-600 hover:underline">Forgot?</button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-5 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3" 
              style={{ backgroundColor: config.primaryColor }}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (company.language === 'bn' ? 'সিস্টেমে প্রবেশ করুন' : 'Enter System')}
            </button>
          </form>
        </div>
        <p className="text-center mt-8 text-[9px] text-white/30 font-black uppercase tracking-[0.4em]">Secure Admin Gateway &bull; v2.0</p>
      </div>
    </div>
  );
};

export default Login;
