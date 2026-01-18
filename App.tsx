
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import MikrotikManager from './components/MikrotikManager';
import VoucherDesigner from './components/VoucherDesigner';
import HotspotLoginPreview from './components/HotspotLoginPreview';
import SupportManager from './components/SupportManager';
import Settings from './components/Settings';
import Billing from './components/Billing';
import Reports from './components/Reports';
import Header from './components/Header';
import Login from './components/Login';
import { Page, CompanySettings, Client, Invoice } from './types';

const App: React.FC = () => {
  // Persistence logic: Check localStorage on initial load
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isp_auth_permanent') === 'true' || localStorage.getItem('isp_auth') === 'true';
  });
  
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [activeOverlay, setActiveOverlay] = useState<null | 'traffic' | 'firewall'>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [company, setCompany] = useState<CompanySettings>({
    name: 'Smart Network',
    menuLogo: 'https://picsum.photos/200/200?random=1',
    loginLogo: 'https://picsum.photos/600/300?random=2',
    voucherLogo: 'https://picsum.photos/200/200?random=3',
    profilePic: 'https://picsum.photos/200/200?random=4',
    hotspotLogo: 'https://picsum.photos/300/300?random=5',
    address: 'Dhaka, Bangladesh',
    phone: '01700-000000',
    language: 'bn', 
    currency: 'BDT',
    currencySymbol: '৳',
    loginConfig: {
      welcomeMessage: 'অ্যাডমিন প্যানেলে স্বাগতম',
      bgType: 'gradient',
      bgColor: '#006a4e',
      bgGradient: 'linear-gradient(135deg, #006a4e, #000000)',
      bgImage: '',
      overlayPattern: 'mesh',
      cardOpacity: 90,
      cardBlur: 10,
      cardRadius: 40,
      primaryColor: '#006a4e',
      headerTextColor: '#1e293b',
      bodyTextColor: '#64748b',
      showBranding: true
    },
    hotspotConfig: {
      welcomeMessage: 'হাই-স্পিড ওয়াইফাই নেটওয়ার্কে স্বাগতম',
      bgType: 'solid',
      bgColor: '#f8fafc',
      bgGradient: 'linear-gradient(135deg, #3b82f6, #000000)',
      bgImage: 'https://images.unsplash.com/photo-1557683316-973673baf926',
      overlayPattern: 'dots',
      cardOpacity: 100,
      cardBlur: 0,
      cardRadius: 24,
      primaryColor: '#006a4e',
      headerTextColor: '#0f172a',
      bodyTextColor: '#475569',
      footerText: 'Smart-ISP দ্বারা পরিচালিত। কোনো সমস্যায় যোগাযোগ করুন।',
      showPriceList: true,
      showBranding: true,
      loginMode: 'voucher'
    }
  });

  const handleLoginSuccess = () => { 
    setIsAuthenticated(true); 
    // We already set isp_auth_permanent in Login.tsx if rememberMe is true.
    // If not, we can set a session-only flag here if needed.
    localStorage.setItem('isp_auth', 'true'); 
  };
  
  const handleLogout = () => { 
    setIsAuthenticated(false); 
    localStorage.removeItem('isp_auth'); 
    localStorage.removeItem('isp_auth_permanent'); 
  };

  if (!isAuthenticated) return <Login company={company} onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} company={company} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header company={company} setCurrentPage={setCurrentPage} setOverlay={setActiveOverlay} onLogout={handleLogout} />
        <main className="flex-1 p-6 md:p-10 overflow-auto bg-[#f0fdf4]">
          {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} clients={clients} setClients={setClients} invoices={invoices} company={company} />}
          {currentPage === 'clients' && <ClientList clients={clients} setClients={setClients} company={company} />}
          {currentPage === 'mikrotik' && <MikrotikManager />}
          {currentPage === 'vouchers' && <VoucherDesigner company={company} />}
          {currentPage === 'hotspot_page' && <HotspotLoginPreview company={company} />}
          {currentPage === 'support' && <SupportManager company={company} />}
          {currentPage === 'billing' && <Billing company={company} invoices={invoices} setInvoices={setInvoices} />}
          {currentPage === 'reports' && <Reports company={company} />}
          {currentPage === 'settings' && <Settings company={company} setCompany={setCompany} />}
        </main>
      </div>
    </div>
  );
};

export default App;
