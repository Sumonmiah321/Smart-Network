
import React, { useState, useMemo, useEffect } from 'react';
import { CompanySettings } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
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
];

interface Props {
  company: CompanySettings;
}

const Reports: React.FC<Props> = ({ company }) => {
  const [timeframe, setTimeframe] = useState('This Month');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'financials' | 'users'>('overview');
  const [exporting, setExporting] = useState<string | null>(null);
  const symbol = company.currencySymbol;

  const currentChartData = useMemo(() => REVENUE_DATA[timeframe] || REVENUE_DATA['This Month'], [timeframe]);

  const totals = useMemo(() => {
    const revenue = currentChartData.reduce((acc, curr) => acc + curr.revenue, 0);
    const expenses = currentChartData.reduce((acc, curr) => acc + curr.expense, 0);
    return { revenue, expenses, profit: revenue - expenses };
  }, [currentChartData]);

  const handleExport = (type: string) => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      alert(`${type} ফরম্যাটে রিপোর্ট এক্সপোর্ট সফল হয়েছে!`);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">রিপোর্ট ও এনালাইটিক্স</h2>
          <p className="text-slate-500 text-sm font-medium">আপনার ব্যবসার আর্থিক ও টেকনিক্যাল রিপোর্ট বিশ্লেষণ করুন</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-lg">
             <button onClick={() => setActiveSubTab('overview')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Summary</button>
             <button onClick={() => setActiveSubTab('financials')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'financials' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Financials</button>
             <button onClick={() => setActiveSubTab('users')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Users</button>
          </div>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-2.5 text-xs font-black text-slate-700 outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="Today">Today</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      </header>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">মোট আয় (নির্বাচিত সময়)</p>
          <p className="text-3xl font-black text-blue-600 mt-2 group-hover:scale-105 transition-transform">{symbol} {totals.revenue.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-4">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
             <p className="text-[10px] text-green-500 font-bold uppercase">↑ ১২% গত মাসের তুলনায়</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">মোট খরচ</p>
          <p className="text-3xl font-black text-red-500 mt-2">{symbol} {totals.expenses.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase">অপারেশনাল ও রক্ষণাবেক্ষণ</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">নিট মুনাফা</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{symbol} {totals.profit.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-4">
             <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${Math.round((totals.profit / totals.revenue) * 100)}%` }}></div>
             </div>
             <span className="text-[9px] font-black text-emerald-600">{Math.round((totals.profit / totals.revenue) * 100)}%</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">ARPU (গড় ইউজার আয়)</p>
          <p className="text-3xl font-black text-slate-800 mt-2">{symbol} ৪২৫</p>
          <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-tighter">৫৪২ জন সক্রিয় ইউজার ভিত্তিক</p>
        </div>
      </div>

      {/* --- SUB-TAB: OVERVIEW --- */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slideUp">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> আয় বনাম খরচ বিশ্লেষণ ({timeframe})
              </h3>
              <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest">
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
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm mb-10 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span> প্যাকেজ জনপ্রিয়তা
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PACKAGE_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {PACKAGE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-3">
              {PACKAGE_DISTRIBUTION.map((type) => (
                <div key={type.name} className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }}></span>
                    <span className="text-slate-500">{type.name}</span>
                  </div>
                  <span className="text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md">{type.value} জন</span>
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
              <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">লেনদেনের বিস্তারিত রিপোর্ট</h3>
                    <p className="text-xs text-slate-500 font-bold mt-1">আয় এবং ব্যয়ের পূর্ণাঙ্গ তালিকা</p>
                 </div>
                 <div className="flex gap-3">
                    <button 
                      onClick={() => handleExport('PDF')} 
                      disabled={exporting !== null}
                      className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition flex items-center gap-2 disabled:opacity-50"
                    >
                       {exporting === 'PDF' ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span> : '📥 PDF'}
                    </button>
                    <button 
                      onClick={() => handleExport('Excel')} 
                      disabled={exporting !== null}
                      className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition flex items-center gap-2 disabled:opacity-50"
                    >
                       {exporting === 'Excel' ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span> : '📊 Excel'}
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition">🖨️ Print List</button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                       <tr>
                          <th className="px-10 py-5">TXN ID</th>
                          <th className="px-10 py-5">বিবরণ (Description)</th>
                          <th className="px-10 py-5">তারিখ</th>
                          <th className="px-10 py-5">টাইপ</th>
                          <th className="px-10 py-5">মেথড</th>
                          <th className="px-10 py-5 text-right">পরিমাণ</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {TRANSACTION_LOGS.map(txn => (
                         <tr key={txn.id} className="hover:bg-slate-50/50 transition group">
                            <td className="px-10 py-6 font-mono font-black text-blue-600 text-[10px]">{txn.id}</td>
                            <td className="px-10 py-6">
                               <p className="font-black text-slate-800 text-xs">{txn.client}</p>
                            </td>
                            <td className="px-10 py-6 text-[10px] font-bold text-slate-400">{txn.date}</td>
                            <td className="px-10 py-6">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${txn.type === 'Income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{txn.type}</span>
                            </td>
                            <td className="px-10 py-6 font-black text-slate-500 text-[10px] uppercase">{txn.method}</td>
                            <td className="px-10 py-6 text-right">
                               <p className={`text-sm font-black ${txn.type === 'Income' ? 'text-slate-900' : 'text-red-500'}`}>
                                 {txn.type === 'Expense' ? '-' : ''}{symbol} {txn.amount.toLocaleString()}
                               </p>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* --- SUB-TAB: USERS --- */}
      {activeSubTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slideUp">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 tracking-tight uppercase text-sm mb-10 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span> ইউজার বৃদ্ধি (User Growth)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={REVENUE_DATA['This Year']}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'black', fill: '#94a3b8'}} />
                      <YAxis hide />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-6 text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">বিগত ৬ মাসের ইউজার অ্যাডিশন ট্রেন্ড</p>
           </div>

           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><span className="text-8xl font-black">74%</span></div>
              <h4 className="text-xl font-black uppercase tracking-tight relative z-10">নেটওয়ার্ক রিপোর্ট</h4>
              <div className="mt-10 space-y-8 relative z-10">
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>ব্যান্ডউইথ ব্যবহার</span>
                       <span className="text-blue-400">৭৪%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                       <div className="bg-blue-500 h-full" style={{ width: '74%' }}></div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>সার্ভার আপটাইম</span>
                       <span className="text-emerald-400">৯৯.৯%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full" style={{ width: '99%' }}></div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>পেমেন্ট রেশিও</span>
                       <span className="text-amber-400">৮৫%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                       <div className="bg-amber-500 h-full" style={{ width: '85%' }}></div>
                    </div>
                 </div>
              </div>
              <button className="w-full mt-10 py-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Download Technical Audit</button>
           </div>
        </div>
      )}
      
      {/* Footer Info no-print */}
      <footer className="text-center no-print pt-10">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">&copy; 2024 Smart-ISP Analytics Engine v4.0</p>
      </footer>
    </div>
  );
};

export default Reports;
