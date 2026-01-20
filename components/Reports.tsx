
import React, { useState, useMemo } from 'react';
import { CompanySettings } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

const REVENUE_DATA: Record<string, any[]> = {
  'This Month': [
    { date: 'Week 1', revenue: 15000, expense: 4000 },
    { date: 'Week 2', revenue: 18000, expense: 4500 },
    { date: 'Week 3', revenue: 12000, expense: 3800 },
    { date: 'Week 4', revenue: 20000, expense: 5000 },
  ],
  'This Year': [
    { date: 'Jan', revenue: 45000, expense: 12000 },
    { date: 'Feb', revenue: 52000, expense: 12500 },
    { date: 'Mar', revenue: 48000, expense: 11800 },
    { date: 'Apr', revenue: 61000, expense: 13000 },
    { date: 'May', revenue: 55000, expense: 12200 },
    { date: 'Jun', revenue: 75000, expense: 15000 },
  ],
  'Today': [
    { date: '08 AM', revenue: 1200, expense: 200 },
    { date: '12 PM', revenue: 4500, expense: 800 },
    { date: '04 PM', revenue: 3200, expense: 500 },
    { date: '08 PM', revenue: 5600, expense: 1200 },
  ]
};

const PACKAGE_DISTRIBUTION = [
  { name: '5 Mbps', value: 240, color: '#3b82f6' },
  { name: '10 Mbps', value: 120, color: '#8b5cf6' },
  { name: '20 Mbps', value: 45, color: '#ec4899' },
  { name: 'Hotspot Daily', value: 85, color: '#f59e0b' },
  { name: 'Hotspot Weekly', value: 52, color: '#10b981' },
];

const TRANSACTION_LOGS = [
  { id: 'TXN-9901', client: 'উত্তরা কর্পোরেশন', amount: 5000, date: '2024-06-21', type: 'Income', method: 'bKash' },
  { id: 'TXN-9902', client: 'মিরপুর টাওয়ার্স', amount: 3200, date: '2024-06-20', type: 'Income', method: 'Cash' },
  { id: 'TXN-9903', client: 'অফিস বিদ্যুৎ বিল', amount: 1500, date: '2024-06-19', type: 'Expense', method: 'Bank' },
  { id: 'TXN-9904', client: 'এবিসি গ্রুপ', amount: 4500, date: '2024-06-18', type: 'Income', method: 'Nagad' },
  { id: 'TXN-9905', client: 'লাইনম্যান স্যালারি', amount: 12000, date: '2024-06-15', type: 'Expense', method: 'Cash' },
  { id: 'TXN-9906', client: 'সাভার আইটি', amount: 8000, date: '2024-06-14', type: 'Income', method: 'Bank' },
  { id: 'TXN-9907', client: 'ইন্টারনেট ব্যান্ডউইথ', amount: 25000, date: '2024-06-10', type: 'Expense', method: 'Bank' },
];

interface Props {
  company: CompanySettings;
}

const Reports: React.FC<Props> = ({ company }) => {
  const [timeframe, setTimeframe] = useState('This Month');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'financials' | 'users'>('overview');
  const [exporting, setExporting] = useState<string | null>(null);
  const [txnSearch, setTxnSearch] = useState('');
  const [txnTypeFilter, setTxnTypeFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  
  const symbol = company.currencySymbol;

  const currentChartData = useMemo(() => REVENUE_DATA[timeframe] || REVENUE_DATA['This Month'], [timeframe]);

  const totals = useMemo(() => {
    const revenue = currentChartData.reduce((acc, curr) => acc + curr.revenue, 0);
    const expenses = currentChartData.reduce((acc, curr) => acc + curr.expense, 0);
    return { revenue, expenses, profit: revenue - expenses };
  }, [currentChartData]);

  const filteredTxns = useMemo(() => {
    return TRANSACTION_LOGS.filter(txn => {
      const matchesSearch = txn.client.toLowerCase().includes(txnSearch.toLowerCase()) || txn.id.includes(txnSearch);
      const matchesType = txnTypeFilter === 'All' || txn.type === txnTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [txnSearch, txnTypeFilter]);

  const handleExport = (type: string) => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      alert(`${type} ফরম্যাটে রিপোর্ট এক্সপোর্ট সফল হয়েছে!`);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      {/* Exporting Progress Overlay */}
      {exporting && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-sm font-black uppercase tracking-widest text-slate-800">Generating {exporting} Report...</p>
           </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">রিপোর্ট ও এনালাইটিক্স</h2>
          <p className="text-slate-500 text-sm font-medium">আপনার ব্যবসার আর্থিক ও টেকনিক্যাল রিপোর্ট বিশ্লেষণ করুন</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-lg">
             <button onClick={() => setActiveSubTab('overview')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>Summary</button>
             <button onClick={() => setActiveSubTab('financials')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'financials' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>Financials</button>
             <button onClick={() => setActiveSubTab('users')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>Users & Health</button>
          </div>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-2.5 text-xs font-black text-slate-700 outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="Today">Today (আজকের ডেটা)</option>
            <option value="This Month">This Month (চলতি মাস)</option>
            <option value="This Year">This Year (চলতি বছর)</option>
          </select>
        </div>
      </header>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider relative z-10">মোট আয় ({timeframe})</p>
          <p className="text-3xl font-black text-blue-600 mt-2 relative z-10">{symbol} {totals.revenue.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-4 relative z-10">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
             <p className="text-[10px] text-green-500 font-bold uppercase">পেমেন্ট সাকসেস রেট ৯৪%</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">মোট খরচ</p>
          <p className="text-3xl font-black text-red-500 mt-2">{symbol} {totals.expenses.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-tighter">ব্যান্ডউইথ ও মেইনটেন্যান্স খরচ</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">নিট মুনাফা (Profit)</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{symbol} {totals.profit.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-4">
             <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${Math.round((totals.profit / totals.revenue) * 100) || 0}%` }}></div>
             </div>
             <span className="text-[9px] font-black text-emerald-600 shrink-0">{Math.round((totals.profit / (totals.revenue || 1)) * 100)}%</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">ARPU (গড় ইউজার আয়)</p>
          <p className="text-3xl font-black text-slate-800 mt-2">{symbol} {(totals.revenue / 40).toFixed(0)}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-tighter">সক্রিয় ইউজার রেশিও ভিত্তিক</p>
        </div>
      </div>

      {/* --- SUB-TAB: OVERVIEW --- */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slideUp">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
              <div>
                 <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm flex items-center gap-3">
                   <span className="w-3 h-3 rounded-full bg-blue-500"></span> আয়ের পারফরম্যান্স গ্রাফ
                 </h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{timeframe} এর সংক্ষিপ্ত চিত্র</p>
              </div>
              <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> আয়</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> খরচ</div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1500} />
                  <Area type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm mb-10 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span> জনপ্রিয় প্যাকেজসমূহ
            </h3>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PACKAGE_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                    {PACKAGE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <p className="text-2xl font-black text-slate-800 leading-none">542</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Users</p>
              </div>
            </div>
            <div className="mt-8 space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {PACKAGE_DISTRIBUTION.map((type) => (
                <div key={type.name} className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight group hover:bg-slate-50 p-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: type.color }}></span>
                    <span className="text-slate-500">{type.name}</span>
                  </div>
                  <span className="text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">{type.value} User</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB: FINANCIALS --- */}
      {activeSubTab === 'financials' && (
        <div className="space-y-8 animate-slideUp">
           <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
                 <div className="w-full md:w-1/3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">লেনদেনের বিস্তারিত রিপোর্ট</h3>
                    <div className="flex items-center gap-4 mt-4">
                       <select 
                         value={txnTypeFilter}
                         onChange={(e) => setTxnTypeFilter(e.target.value as any)}
                         className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 shadow-sm"
                       >
                          <option value="All">All Transactions</option>
                          <option value="Income">Income (আয়)</option>
                          <option value="Expense">Expense (ব্যয়)</option>
                       </select>
                    </div>
                 </div>
                 
                 <div className="flex-1 w-full relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input 
                      type="text" 
                      placeholder="গ্রাহকের নাম বা ট্রানজেকশন আইডি দিয়ে খুঁজুন..." 
                      className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" 
                      value={txnSearch} 
                      onChange={(e) => setTxnSearch(e.target.value)} 
                    />
                 </div>

                 <div className="flex gap-3 shrink-0">
                    <button onClick={() => handleExport('PDF')} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition shadow-sm" title="PDF Export">📄</button>
                    <button onClick={() => handleExport('Excel')} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition shadow-sm" title="Excel Export">📊</button>
                    <button onClick={() => window.print()} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition">🖨️ Print List</button>
                 </div>
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                       <tr>
                          <th className="px-10 py-5">TXN ID</th>
                          <th className="px-10 py-5">বিবরণ (Description)</th>
                          <th className="px-10 py-5">তারিখ</th>
                          <th className="px-10 py-5">টাইপ</th>
                          <th className="px-10 py-5">পেমেন্ট মেথড</th>
                          <th className="px-10 py-5 text-right">পরিমাণ (Amount)</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredTxns.map(txn => (
                         <tr key={txn.id} className="hover:bg-blue-50/30 transition group">
                            <td className="px-10 py-6 font-mono font-black text-blue-600 text-[10px]">{txn.id}</td>
                            <td className="px-10 py-6">
                               <p className="font-black text-slate-800 text-xs">{txn.client}</p>
                            </td>
                            <td className="px-10 py-6 text-[10px] font-bold text-slate-400">{txn.date}</td>
                            <td className="px-10 py-6">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${txn.type === 'Income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{txn.type}</span>
                            </td>
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                  <span className="font-black text-slate-500 text-[10px] uppercase">{txn.method}</span>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <p className={`text-sm font-black ${txn.type === 'Income' ? 'text-slate-900' : 'text-red-500'}`}>
                                 {txn.type === 'Expense' ? '-' : '+'}{symbol} {txn.amount.toLocaleString()}
                               </p>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 {filteredTxns.length === 0 && (
                   <div className="p-32 text-center text-slate-300">
                      <span className="text-6xl block mb-4 opacity-10">🔍</span>
                      <p className="text-xs font-black uppercase tracking-widest">দুঃখিত, কোনো ট্রানজেকশন খুঁজে পাওয়া যায়নি</p>
                   </div>
                 )}
              </div>
              
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center rounded-b-[3rem]">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">এই তালিকার সারাংশ</p>
                 <div className="flex gap-12 text-right">
                    <div>
                       <p className="text-[9px] font-black uppercase opacity-40">Total Filtered Income</p>
                       <p className="text-xl font-black text-emerald-400">{symbol} {filteredTxns.filter(t => t.type === 'Income').reduce((a, b) => a + b.amount, 0).toLocaleString()}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase opacity-40">Total Filtered Expense</p>
                       <p className="text-xl font-black text-red-400">{symbol} {filteredTxns.filter(t => t.type === 'Expense').reduce((a, b) => a + b.amount, 0).toLocaleString()}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- SUB-TAB: USERS & HEALTH --- */}
      {activeSubTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-slideUp">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 lg:col-span-2">
              <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm mb-10 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span> ইউজার বৃদ্ধির ট্রেন্ড (User Growth)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={REVENUE_DATA['This Year']}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'black', fill: '#94a3b8'}} />
                      <YAxis hide />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                   </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 pt-10 border-t border-slate-50">
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Clients</p>
                    <p className="text-xl font-black text-slate-800 mt-1">৮৫ জন</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Churn Rate</p>
                    <p className="text-xl font-black text-red-500 mt-1">২.৪%</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Ratio</p>
                    <p className="text-xl font-black text-emerald-500 mt-1">৯১%</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><span className="text-9xl font-black">PRO</span></div>
              <div className="relative z-10">
                 <h4 className="text-xl font-black uppercase tracking-tight">নেটওয়ার্ক হেলথ রিপোর্ট</h4>
                 <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest leading-relaxed">রিয়েল-টাইম সার্ভার ও ব্যান্ডউইথ স্ট্যাটাস</p>
              </div>

              <div className="mt-12 space-y-10 relative z-10">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>ব্যান্ডউইথ ইউটিলাইজেশন</span>
                       <span className="text-blue-400">৭৪%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden shadow-inner">
                       <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: '74%' }}></div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>সার্ভার আপটাইম (Monthly)</span>
                       <span className="text-emerald-400">৯৯.৯৮%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden shadow-inner">
                       <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: '99%' }}></div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>পেমেন্ট রিকাভারি রেশিও</span>
                       <span className="text-amber-400">৮৫%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden shadow-inner">
                       <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: '85%' }}></div>
                    </div>
                 </div>
              </div>
              
              <div className="pt-10 relative z-10">
                 <button className="w-full py-5 bg-white text-slate-900 hover:bg-slate-200 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl">
                    Download Detailed Health Audit (PDF)
                 </button>
              </div>
           </div>
        </div>
      )}
      
      {/* Footer Info no-print */}
      <footer className="text-center no-print pt-10 border-t border-slate-100">
         <div className="flex items-center justify-center gap-4 mb-4 opacity-30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
         </div>
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">&copy; 2024 Smart-ISP Analytics Engine v4.0 &bull; Secure Data</p>
      </footer>
    </div>
  );
};

export default Reports;
