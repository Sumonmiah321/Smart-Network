
import React, { useState, useMemo, useEffect } from 'react';
import { Client, CompanySettings } from '../types';

interface ClientListProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  company: CompanySettings;
}

const ClientList: React.FC<ClientListProps> = ({ clients, setClients, company }) => {
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState<'All' | 'PPPoE' | 'Hotspot'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [collectionAmount, setCollectionAmount] = useState<number>(0);
  const symbol = company.currencySymbol;

  // Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    macAddress: '',
    type: 'PPPoE',
    plan: '5 Mbps',
    status: 'Active',
    balance: 0,
    joinDate: '',
    expiryDate: ''
  });

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesFilter = filter === 'All' || client.type === filter;
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        client.phone.includes(searchQuery) ||
        (client.macAddress && client.macAddress.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [clients, filter, searchQuery]);

  // Modal open handler for both add and edit
  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        phone: client.phone,
        email: client.email || '',
        address: client.address || '',
        macAddress: client.macAddress || '',
        type: client.type,
        plan: client.plan,
        status: client.status,
        balance: client.balance,
        joinDate: client.joinDate,
        expiryDate: client.expiryDate
      });
    } else {
      setEditingClient(null);
      setFormData({ 
        name: '', phone: '', email: '', address: '', macAddress: '',
        type: 'PPPoE', plan: '5 Mbps', status: 'Active', balance: 0,
        joinDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setViewMode('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const updatedClients = clients.map(c => 
        c.id === editingClient.id ? { ...c, ...formData } as Client : c
      );
      setClients(updatedClients);
      if (selectedClient && selectedClient.id === editingClient.id) {
        setSelectedClient({ ...selectedClient, ...formData } as Client);
      }
      alert('গ্রাহকের তথ্য সফলভাবে আপডেট করা হয়েছে!');
    } else {
      const newClient: Client = { 
        ...formData, 
        id: (clients.length + 1).toString() + Math.random().toString(36).substr(2, 4)
      } as Client;
      setClients([newClient, ...clients]);
      alert('নতুন গ্রাহক সফলভাবে যোগ করা হয়েছে!');
    }
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleToggleStatus = (id: string, currentStatus: Client['status']) => {
    const nextStatus: Client['status'] = currentStatus === 'Active' ? 'Disabled' : 'Active';
    const updated = clients.map(c => c.id === id ? { ...c, status: nextStatus } : c);
    setClients(updated);
    if (selectedClient?.id === id) setSelectedClient({ ...selectedClient, status: nextStatus });
  };

  const handleSuspendToggle = (id: string, currentStatus: Client['status']) => {
    const nextStatus: Client['status'] = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    const updated = clients.map(c => c.id === id ? { ...c, status: nextStatus } : c);
    setClients(updated);
    if (selectedClient?.id === id) setSelectedClient({ ...selectedClient, status: nextStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ক্লায়েন্টটি ডিলিট করতে চান?')) {
      const updated = clients.filter(c => c.id !== id);
      setClients(updated);
      if (viewMode === 'details') setViewMode('list');
    }
  };

  const handleRenew = () => {
    if (!selectedClient) return;
    const currentExpiry = new Date(selectedClient.expiryDate);
    const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
    const updated = clients.map(c => c.id === selectedClient.id ? { ...c, expiryDate: newExpiry.toISOString().split('T')[0], status: 'Active' } as Client : c);
    setClients(updated);
    setSelectedClient({ ...selectedClient, expiryDate: newExpiry.toISOString().split('T')[0], status: 'Active' });
    setIsRenewModalOpen(false);
    alert('মেয়াদ ৩০ দিন বৃদ্ধি করা হয়েছে!');
  };

  const handleCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    const updated = clients.map(c => c.id === selectedClient.id ? { ...c, balance: c.balance + collectionAmount } : c);
    setClients(updated);
    setSelectedClient({ ...selectedClient, balance: selectedClient.balance + collectionAmount });
    setIsCollectionModalOpen(false);
    setCollectionAmount(0);
    alert('বিল কালেকশন সফল হয়েছে!');
  };

  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Suspended': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Disabled': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const ClientFormModal = () => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-slideUp">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <span className="w-10 h-10 bg-[#006a4e] text-white rounded-xl flex items-center justify-center text-xl shadow-lg">📋</span>
             {editingClient ? 'গ্রাহক তথ্য সম্পাদনা' : 'নতুন গ্রাহক যোগ করুন'}
          </h3>
          <button onClick={() => { setIsModalOpen(false); setEditingClient(null); }} className="w-10 h-10 flex items-center justify-center bg-slate-200 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-all text-2xl font-black">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6 h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পুরো নাম</label>
              <input required className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-bold text-slate-700 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">মোবাইল নাম্বার</label>
              <input required className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-bold text-slate-700" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ইমেল (ঐচ্ছিক)</label>
              <input type="email" className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-bold text-slate-700" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ম্যাক এড্রেস (MAC)</label>
              <input className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-mono font-bold text-slate-700 uppercase" placeholder="00:00:00:00:00:00" value={formData.macAddress} onChange={e => setFormData({...formData, macAddress: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">কানেকশন টাইপ</label>
              <select className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none font-black text-slate-800" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                <option value="PPPoE">PPPoE</option>
                <option value="Hotspot">Hotspot</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">প্যাকেজ প্ল্যান</label>
              <select className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none font-black text-slate-800" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})}>
                <option value="5 Mbps">5 Mbps - 500 {symbol}</option>
                <option value="10 Mbps">10 Mbps - 800 {symbol}</option>
                <option value="20 Mbps">20 Mbps - 1200 {symbol}</option>
                <option value="Daily">Daily Hotspot</option>
                <option value="Weekly">Weekly Hotspot</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">জয়নিং ডেট</label>
              <input type="date" className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none font-bold text-slate-700" value={formData.joinDate} onChange={e => setFormData({...formData, joinDate: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">মেয়াদ শেষ তারিখ</label>
              <input type="date" className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none font-bold text-slate-700" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">বর্তমান ব্যালেন্স ({symbol})</label>
              <input type="number" className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-black text-slate-700" value={formData.balance} onChange={e => setFormData({...formData, balance: Number(e.target.value)})} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">বিস্তারিত ঠিকানা</label>
              <textarea rows={2} className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-bold text-slate-700 resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>
          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => { setIsModalOpen(false); setEditingClient(null); }} className="flex-1 py-5 bg-slate-100 rounded-2xl font-black uppercase text-xs text-slate-500 hover:bg-slate-200 transition-all active:scale-95">বাতিল</button>
            <button type="submit" className="flex-1 py-5 bg-[#006a4e] text-white rounded-2xl font-black uppercase text-xs hover:bg-green-800 transition-all shadow-xl active:scale-95">সেভ করুন</button>
          </div>
        </form>
      </div>
    </div>
  );

  if (viewMode === 'details' && selectedClient) {
    return (
      <div className="animate-fadeIn space-y-8 pb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 gap-6">
          <div className="flex items-center gap-6">
            <button onClick={() => setViewMode('list')} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl hover:bg-slate-200 transition text-2xl shadow-inner">⬅️</button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900">{selectedClient.name}</h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(selectedClient.status)}`}>
                  {selectedClient.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Customer Profile Control Center</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setIsRenewModalOpen(true)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase hover:bg-blue-700 transition shadow-lg">🔄 রিনিউ করুন</button>
            <button onClick={() => setIsCollectionModalOpen(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase hover:bg-emerald-700 transition shadow-lg">{symbol} বিল জমা</button>
            <button onClick={() => handleOpenModal(selectedClient)} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase hover:bg-black transition flex items-center gap-2">✏️ এডিট</button>
          </div>
        </div>

        {selectedClient.status === 'Suspended' && (
          <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex items-center gap-4 animate-pulse">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="text-amber-800 font-black text-sm uppercase">অ্যাকাউন্ট স্থগিত (Suspended)</p>
              <p className="text-amber-600 text-xs font-bold">এই গ্রাহকের সংযোগটি সাময়িকভাবে স্থগিত করা হয়েছে।</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 bg-slate-50 border-b border-slate-100"><h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">প্রাথমিক তথ্য</h3></div>
             <table className="w-full text-left">
               <tbody className="divide-y divide-slate-50">
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase w-1/3">নাম</td><td className="px-8 py-4 text-sm font-bold text-slate-800">{selectedClient.name}</td></tr>
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">আইডি</td><td className="px-8 py-4 text-sm font-mono font-black text-blue-600">{selectedClient.id}</td></tr>
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">মোবাইল</td><td className="px-8 py-4 text-sm font-bold text-slate-800">{selectedClient.phone}</td></tr>
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">ইমেল</td><td className="px-8 py-4 text-sm font-bold text-slate-800">{selectedClient.email || 'N/A'}</td></tr>
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">ঠিকানা</td><td className="px-8 py-4 text-xs font-bold text-slate-600 leading-relaxed">{selectedClient.address || 'N/A'}</td></tr>
               </tbody>
             </table>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 bg-slate-50 border-b border-slate-100"><h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">নেটওয়ার্ক ও পেমেন্ট</h3></div>
             <table className="w-full text-left">
               <tbody className="divide-y divide-slate-50">
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase w-1/3">প্যাকেজ</td><td className="px-8 py-4 text-sm font-black text-emerald-600 uppercase">{selectedClient.plan}</td></tr>
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">কানেকশন টাইপ</td><td className="px-8 py-4 text-sm font-black text-slate-600">{selectedClient.type}</td></tr>
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">MAC এড্রেস</td><td className="px-8 py-4 text-sm font-mono font-black text-slate-500 uppercase">{selectedClient.macAddress || 'N/A'}</td></tr>
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">মেয়াদ শেষ</td><td className="px-8 py-4 text-sm font-black text-red-600">{selectedClient.expiryDate}</td></tr>
                 <tr><td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">বর্তমান ব্যালেন্স</td><td className="px-8 py-4 text-2xl font-black text-slate-900">{symbol} {selectedClient.balance}</td></tr>
                 <tr>
                    <td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">কন্ট্রোল</td>
                    <td className="px-8 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleStatus(selectedClient.id, selectedClient.status)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition">{selectedClient.status === 'Disabled' ? '🔌 চালু করুন' : '🚫 ডিজেবল'}</button>
                        <button onClick={() => handleSuspendToggle(selectedClient.id, selectedClient.status)} className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-100 transition">{selectedClient.status === 'Suspended' ? '🔓 আনসাসপেন্ড' : '⏳ সাসপেন্ড'}</button>
                      </div>
                    </td>
                 </tr>
               </tbody>
             </table>
          </div>
        </div>

        {isModalOpen && <ClientFormModal />}

        {/* Modal: Bill Collection */}
        {isCollectionModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-slideUp">
               <div className="p-8 bg-emerald-600 text-white text-center">
                  <p className="text-xs font-black uppercase tracking-widest opacity-70">টাকা জমা নিন</p>
                  <h3 className="text-2xl font-black mt-2">{selectedClient.name}</h3>
               </div>
               <form onSubmit={handleCollection} className="p-10 space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">বর্তমান ব্যালেন্স</p>
                     <p className={`text-3xl font-black mt-1 ${selectedClient.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{symbol} {selectedClient.balance}</p>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">কালেকশন পরিমাণ ({symbol})</label>
                     <input type="number" required autoFocus className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-emerald-500 font-black text-2xl text-center" value={collectionAmount} onChange={e => setCollectionAmount(Number(e.target.value))} />
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => setIsCollectionModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs text-slate-500">বাতিল</button>
                     <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95">কালেক্ট করুন</button>
                  </div>
               </form>
            </div>
          </div>
        )}

        {/* Modal: User Renewal */}
        {isRenewModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-slideUp">
               <div className="p-8 bg-blue-600 text-white text-center">
                  <p className="text-xs font-black uppercase tracking-widest opacity-70">সার্ভিস রিনিউয়াল</p>
                  <h3 className="text-2xl font-black mt-2">{selectedClient.name}</h3>
               </div>
               <div className="p-10 space-y-8">
                  <div className="bg-blue-50 p-6 rounded-3xl border-blue-100 text-center">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">বর্তমান মেয়াদ শেষ</p>
                     <p className="text-xl font-black text-blue-900 mt-1">{selectedClient.expiryDate}</p>
                  </div>
                  <div className="text-center space-y-4">
                     <p className="text-sm font-bold text-slate-600">আপনি কি নিশ্চিত যে এই গ্রাহকের মেয়াদ আরও ৩০ দিনের জন্য বৃদ্ধি করতে চান?</p>
                  </div>
                  <div className="flex gap-4">
                     <button type="button" onClick={() => setIsRenewModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs text-slate-500">বাতিল</button>
                     <button onClick={handleRenew} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-blue-200 active:scale-95">নিশ্চিত করুন</button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <span className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">👥</span>
             গ্রাহক কন্ট্রোল প্যানেল
          </h2>
          <p className="text-slate-500 font-medium mt-1">আপনার নেটওয়ার্কের সকল গ্রাহক ও তাদের বিস্তারিত প্রোফাইল পরিচালনা করুন</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-[#006a4e] text-white px-8 py-4 rounded-2xl hover:bg-green-800 transition shadow-xl shadow-green-900/10 flex items-center gap-2 font-black text-sm uppercase tracking-widest active:scale-95">
          <span>➕</span> নতুন ক্লায়েন্ট
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/20 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            {(['All', 'PPPoE', 'Hotspot'] as const).map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${filter === t ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'}`}>
                {t === 'All' ? 'সব গ্রাহক' : t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
            <input type="text" placeholder="নাম, ফোন বা ম্যাক এড্রেস দিয়ে খুঁজুন..." className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.1em] border-b">
              <tr>
                <th className="px-8 py-5">গ্রাহক পরিচিতি</th>
                <th className="px-8 py-5">জয়নিং ও মেয়াদ</th>
                <th className="px-8 py-5">কানেকশন</th>
                <th className="px-8 py-5">স্থিতি</th>
                <th className="px-8 py-5 text-right">ব্যালেন্স</th>
                <th className="px-8 py-5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-blue-50/20 transition-all group cursor-pointer" onClick={() => handleViewClient(client)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">👤</div>
                       <div>
                          <p className="font-black text-slate-800 text-sm">{client.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{client.phone}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                       <p className="text-[10px] font-bold text-slate-400">📅 {client.joinDate}</p>
                       <p className={`text-xs font-black flex items-center gap-1.5 ${new Date(client.expiryDate).getTime() < Date.now() ? 'text-red-600' : 'text-emerald-600'}`}>⏳ {client.expiryDate}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${client.type === 'PPPoE' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>{client.type}</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{client.plan}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(client.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`}></span>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                     <p className={`text-sm font-black ${client.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>{symbol} {client.balance}</p>
                  </td>
                  <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleViewClient(client)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">👁️</button>
                      <button onClick={() => handleOpenModal(client)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-[#006a4e] hover:text-white transition-all shadow-sm">✏️</button>
                      <button onClick={() => handleDelete(client.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <ClientFormModal />}
    </div>
  );
};

export default ClientList;
