
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Fix: Import Invoice from types
import { Page, Client, CompanySettings, Invoice } from '../types';
import { t } from '../translations';

const chartData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

interface MiniStatProps {
  title: string;
  value: string;
  color: string;
  icon?: string;
  onClick: () => void;
}

const MiniStat: React.FC<MiniStatProps> = ({ title, value, color, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="p-4 rounded-2xl border border-green-100 bg-white hover:border-[#f42a41] hover:shadow-xl hover:shadow-[#f42a41]/5 transition-all duration-300 group cursor-pointer text-left w-full active:scale-95"
  >
    <div className="flex justify-between items-start mb-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight group-hover:text-[#006a4e] transition-colors">{title}</p>
      {icon && <span className="text-sm opacity-50 group-hover:scale-125 transition-transform group-hover:opacity-100">{icon}</span>}
    </div>
    <p className={`text-lg font-black tracking-tight ${color}`}>{value}</p>
  </button>
);

interface DashboardProps {
  setCurrentPage: (page: Page) => void;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  invoices: Invoice[];
  company: CompanySettings;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage, clients, setClients, invoices, company }) => {
  const [selectedDetail, setSelectedDetail] = useState<{ title: string; type: string } | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const lang = company.language;
  const symbol = company.currencySymbol;

  // Global derived stats
  const activeClients = useMemo(() => clients.filter(c => c.status === 'Active'), [clients]);
  const hotspotClients = useMemo(() => clients.filter(c => c.type === 'Hotspot'), [clients]);
  const expiredClients = useMemo(() => clients.filter(c => new Date(c.expiryDate).getTime() < Date.now()), [clients]);
  const pendingClients = useMemo(() => clients.filter(c => c.status === 'Disabled' || c.status === 'Inactive'), [clients]);

  const getFilteredData = (type: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    switch (type) {
      case 'joined_month': 
        return clients.filter(c => {
          const d = new Date(c.joinDate);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
      case 'active_now': 
        return clients.filter(c => c.status === 'Active');
      case 'hotspot': 
        return clients.filter(c => c.type === 'Hotspot');
      case 'expired_total': 
        return clients.filter(c => new Date(c.expiryDate).getTime() < Date.now());
      case 'expired_hotspot':
        return clients.filter(c => c.type === 'Hotspot' && new Date(c.expiryDate).getTime() < Date.now());
      case 'pending':
        return clients.filter(c => c.status === 'Disabled' || c.status === 'Inactive');
      case 'left':
        return clients.filter(c => c.status === 'Inactive');
      default: 
        return clients;
    }
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    setEditingClient(null);
  };

  const handleQuickSuspend = (id: string, currentStatus: Client['status']) => {
    const nextStatus: Client['status'] = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    alert(nextStatus === 'Suspended' ? 'ইউজার সাময়িকভাবে স্থগিত করা হয়েছে।' : 'ইউজার পুনরায় সক্রিয় করা হয়েছে।');
  };

  const handleQuickRenew = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    const currentExpiry = new Date(client.expiryDate);
    const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
    setClients(prev => prev.map(c => c.id === id ? { 
      ...c, 
      expiryDate: newExpiry.toISOString().split('T')[0], 
      status: 'Active' 
    } : c));
    alert('ইউজারের মেয়াদ ৩০ দিন বৃদ্ধি করা হয়েছে।');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setCurrentPage('settings')}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-2xl cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <span className="group-hover:rotate-90 transition-transform duration-500">⚙️</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</h2>
            <p className="text-slate-500 text-sm font-medium">{lang === 'bn' ? 'ISP এবং হটস্পট নেটওয়ার্কের বিস্তারিত রিপোর্ট' : 'Detailed reports for ISP and Hotspot networks'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setCurrentPage('billing')} className="bg-[#f42a41] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition shadow-lg shadow-red-100">{t('billing', lang)}</button>
          <button onClick={() => setCurrentPage('vouchers')} className="bg-[#006a4e] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-800 transition shadow-lg">{lang === 'bn' ? 'ভাউচার প্রিন্ট' : 'Voucher Print'}</button>
        </div>
      </header>

      {/* Stats Group 1: New Joins & Active */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-[#006a4e]/60 uppercase tracking-[0.2em] ml-1">{lang === 'bn' ? 'গ্রাহক পরিসংখ্যান' : 'Client Statistics'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'এই মাসে যোগদান' : 'Joined This Month', type: 'joined_month'})} title={lang === 'bn' ? 'এই মাসে যোগদান' : 'Joined This Month'} value={`${getFilteredData('joined_month').length} জন`} color="text-green-700" icon="🆕" />
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'গত মাসে যোগদান' : 'Joined Last Month', type: 'joined_last_month'})} title={lang === 'bn' ? 'গত মাসে যোগদান' : 'Joined Last Month'} value="৩৮ জন" color="text-green-600" icon="📅" />
          <MiniStat onClick={() => setSelectedDetail({title: t('active_now', lang), type: 'active_now'})} title={t('active_now', lang)} value={`${activeClients.length} জন`} color="text-emerald-600" icon="🟢" />
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'এই মাসে সক্রিয়' : 'Active This Month', type: 'active_month'})} title={lang === 'bn' ? 'এই মাসে সক্রিয়' : 'Active This Month'} value={`${activeClients.length} জন`} color="text-emerald-500" icon="✅" />
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'গত মাসে সক্রিয়' : 'Active Last Month', type: 'active_last_month'})} title={lang === 'bn' ? 'গত মাসে সক্রিয়' : 'Active Last Month'} value="৪৬০ জন" color="text-slate-500" icon="📊" />
        </div>
      </div>

      {/* Stats Group 2: Connections & Expired */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-[#006a4e]/60 uppercase tracking-[0.2em] ml-1">{lang === 'bn' ? 'কানেকশন ও স্থিতি' : 'Connection & Status'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'হটস্পট ক্লায়েন্ট' : 'Hotspot Clients', type: 'hotspot'})} title={lang === 'bn' ? 'হটস্পট ক্লায়েন্ট' : 'Hotspot Clients'} value={`${hotspotClients.length} জন`} color="text-orange-600" icon="📶" />
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'মোট মেয়াদ শেষ' : 'Total Expired', type: 'expired_total'})} title={lang === 'bn' ? 'মোট মেয়াদ শেষ' : 'Total Expired'} value={`${expiredClients.length} জন`} color="text-[#f42a41]" icon="⚠️" />
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'হটস্পটের মেয়াদ শেষ' : 'Expired Hotspot', type: 'expired_hotspot'})} title={lang === 'bn' ? 'হটস্পটের মেয়াদ শেষ' : 'Expired Hotspot'} value={`${getFilteredData('expired_hotspot').length} জন`} color="text-[#f42a41]" icon="🚨" />
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'মুলতুবি ক্লায়েন্ট' : 'Pending Clients', type: 'pending'})} title={lang === 'bn' ? 'মulতুবি ক্লায়েন্ট' : 'Pending Clients'} value={`${pendingClients.length} জন`} color="text-amber-500" icon="⏳" />
          <MiniStat onClick={() => setSelectedDetail({title: lang === 'bn' ? 'বাম ক্লায়েন্ট' : 'Left Clients', type: 'left'})} title={lang === 'bn' ? 'বাম ক্লায়েন্ট' : 'Left Clients'} value="৩ জন" color="text-slate-400" icon="🚶" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-green-50">
          <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> {t('revenue', lang)}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="sales" fill="#006a4e" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-green-50 flex flex-col">
          <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> {t('latest_invoices', lang)}
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {invoices.map((inv, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl hover:bg-green-50 transition">
                <div>
                  <p className="text-[10px] font-black text-[#006a4e] mb-0.5">{inv.id}</p>
                  <p className="text-xs font-bold text-slate-800">{inv.client}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{inv.date}</p>
                </div>
                <p className="text-sm font-black text-slate-900">{symbol} {inv.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Stat Detail Modal with User Controls */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-slideUp">
            <div className="p-8 bg-[#006a4e] text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{selectedDetail.title}</h3>
                <p className="text-xs text-green-100/60 font-bold mt-1 uppercase tracking-widest">{lang === 'bn' ? 'সরাসরি ইউজার কন্ট্রোল মেনু' : 'Direct User Control Menu'}</p>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition text-2xl font-black">×</button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">গ্রাহক</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">কানেকশন ও মেয়াদ</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ব্যালেন্স</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">স্ট্যাটাস</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">কুইক অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {getFilteredData(selectedDetail.type).map((item, idx) => (
                    <tr key={idx} className="hover:bg-green-50/30 transition-colors group">
                      <td className="py-4">
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{item.phone}</p>
                      </td>
                      <td className="py-4">
                         <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">{item.plan}</span>
                         <p className={`text-[10px] font-bold mt-1 ${new Date(item.expiryDate).getTime() < Date.now() ? 'text-red-500' : 'text-slate-400'}`}>মেয়াদ: {item.expiryDate}</p>
                      </td>
                      <td className="py-4 text-xs font-black text-slate-700">{symbol} {item.balance}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleQuickRenew(item.id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm" title="Renew Plan">🔄</button>
                          <button onClick={() => handleQuickSuspend(item.id, item.status)} className={`p-2 rounded-lg transition shadow-sm ${item.status === 'Suspended' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'}`} title="Suspend/Unsuspend">⏳</button>
                          <button onClick={() => setEditingClient(item)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition" title="Edit">✏️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase italic">সরাসরি এখান থেকেই গ্রাহক রিনিউ বা সাসপেন্ড করতে পারবেন</p>
              <button onClick={() => setSelectedDetail(null)} className="px-6 py-2 bg-[#f42a41] text-white rounded-xl text-xs font-black uppercase hover:bg-red-700 transition">বন্ধ করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Logic (Same as before) */}
      {editingClient && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6">
            <h3 className="text-lg font-black text-[#006a4e] uppercase border-b border-green-50 pb-4">{lang === 'bn' ? 'গ্রাহক তথ্য পরিবর্তন' : 'Edit Client Information'}</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">{lang === 'bn' ? 'নাম' : 'Name'}</label>
                <input 
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#006a4e] font-bold text-slate-700"
                  value={editingClient.name}
                  onChange={e => setEditingClient({...editingClient, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">{lang === 'bn' ? 'প্যাকেজ' : 'Package'}</label>
                <input 
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#006a4e] font-bold text-slate-700"
                  value={editingClient.plan}
                  onChange={e => setEditingClient({...editingClient, plan: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">{t('status', lang)}</label>
                <select 
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#006a4e] font-bold text-slate-700"
                  value={editingClient.status}
                  onChange={e => setEditingClient({...editingClient, status: e.target.value as any})}
                >
                  <option value="Active">{t('active', lang)}</option>
                  <option value="Inactive">{t('inactive', lang)}</option>
                  <option value="Suspended">সাসপেন্ড</option>
                  <option value="Disabled">বন্ধ (Disabled)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setEditingClient(null)} className="flex-1 py-3 bg-slate-100 rounded-xl text-xs font-black uppercase text-slate-500">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
              <button onClick={() => handleUpdateClient(editingClient)} className="flex-1 py-3 bg-[#f42a41] text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-red-100">{t('save', lang)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;