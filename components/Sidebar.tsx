
import React, { useState } from 'react';
import { Page, CompanySettings } from '../types';
import { t } from '../translations';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  company: CompanySettings;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, company }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lang = company.language;
  
  const menuItems = [
    { id: 'dashboard' as Page, label: t('dashboard', lang), icon: '📊' },
    { id: 'clients' as Page, label: t('clients', lang), icon: '👥' },
    { id: 'mikrotik' as Page, label: t('mikrotik', lang), icon: '🌐' },
    { id: 'vouchers' as Page, label: t('vouchers', lang), icon: '🎟️' },
    { id: 'hotspot_page' as Page, label: t('hotspot_page', lang), icon: '📱' },
    { id: 'support' as Page, label: lang === 'bn' ? 'গ্রাহক সেবা' : 'Support', icon: '🎧' },
    { id: 'billing' as Page, label: t('billing', lang), icon: '💰' },
    { id: 'reports' as Page, label: t('reports', lang), icon: '📝' },
    { id: 'settings' as Page, label: t('settings', lang), icon: '⚙️' },
  ];

  return (
    <aside className={`bg-[#006a4e] text-white flex flex-col no-print relative overflow-hidden transition-all duration-500 h-screen ${isCollapsed ? 'w-20' : 'w-72'}`}>
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all border border-white/10">
        <span className={`text-xs transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>◀</span>
      </button>

      <div className={`border-b border-white/10 flex flex-col items-center gap-4 relative z-10 shrink-0 transition-all ${isCollapsed ? 'p-4' : 'p-8'}`}>
        <div onClick={() => setCurrentPage('settings')} className="relative cursor-pointer hover:scale-105 transition-transform">
          <div className={`bg-white p-1 shadow-2xl overflow-hidden transition-all ${isCollapsed ? 'w-12 h-12 rounded-xl' : 'w-24 h-24 rounded-[2rem]'}`}>
            <img src={company.menuLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        {!isCollapsed && (
          <div className="text-center animate-fadeIn">
            <h1 className="font-black text-lg tracking-tight truncate max-w-[200px]">{company.name}</h1>
            <p className="text-[10px] text-green-100/60 font-black uppercase tracking-widest mt-1">PRO ISP CORE</p>
          </div>
        )}
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto custom-sidebar-scrollbar relative z-10">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`flex items-center transition-all group ${isCollapsed ? 'w-12 h-12 justify-center rounded-xl' : 'w-full px-5 py-4 rounded-2xl gap-4'} ${currentPage === item.id ? 'bg-[#f42a41] text-white' : 'text-green-50/70 hover:bg-white/10'}`}>
            <span className="text-xl group-hover:scale-125 transition-transform">{item.icon}</span>
            {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>
      
      {!isCollapsed && <div className="p-6 bg-black/30 text-[9px] text-center text-green-100/40 uppercase tracking-widest">&copy; 2024 SMART-ISP</div>}
    </aside>
  );
};

export default Sidebar;
