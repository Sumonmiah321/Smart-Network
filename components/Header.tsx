
import React, { useState, useEffect, useRef } from 'react';
import { CompanySettings, Page } from '../types';
import { t } from '../translations';

interface HeaderProps {
  company: CompanySettings;
  setCurrentPage: (page: Page) => void;
  setOverlay: (overlay: 'traffic' | 'firewall' | null) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ company, setCurrentPage, setOverlay, onLogout }) => {
  const [time, setTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lang = company.language;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  
  return (
    <header className="bg-[#f42a41] px-6 py-2 sticky top-0 z-50 flex justify-between items-center no-print shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-1 bg-black/20 rounded-xl border border-white/10 text-white font-mono text-xs">
           <span className="text-[9px] font-black opacity-60">LIVE</span>
           <span className="font-black">{formattedTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-4" ref={menuRef}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {/* USER PROFILE PIC */}
          <div className="w-10 h-10 bg-white rounded-full border-2 border-white/30 overflow-hidden shadow-lg transition-transform group-hover:scale-110">
            <img src={company.profilePic} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="bg-black/20 px-4 py-1.5 rounded-lg text-white">
            <h4 className="font-black text-[10px] leading-none uppercase tracking-widest">Admin</h4>
            <p className="text-[7px] text-emerald-400 font-black mt-1 uppercase flex items-center gap-1">
               <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 animate-slideUp">
             <div className="p-4 border-b border-slate-50 mb-4 flex items-center gap-4">
                <img src={company.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-[#f42a41]" alt="Avatar" />
                <div>
                   <p className="font-black text-slate-800 text-sm leading-none">System Admin</p>
                   <p className="text-[10px] text-slate-400 mt-1 uppercase">Full Access Control</p>
                </div>
             </div>
             <button onClick={() => {setCurrentPage('settings'); setIsMenuOpen(false);}} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">⚙️ Settings</button>
             <button onClick={onLogout} className="w-full text-left p-3 rounded-xl hover:bg-red-50 text-xs font-black text-red-600">退出 Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
