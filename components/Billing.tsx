
import React, { useState, useMemo } from 'react';
// Fix: Import Invoice from types
import { CompanySettings, Invoice } from '../types';

interface BillingProps {
  company: CompanySettings;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

const Billing: React.FC<BillingProps> = ({ company, invoices, setInvoices }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid' | 'Overdue'>('All');
  const symbol = company.currencySymbol;

  const [formData, setFormData] = useState({
    client: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'নগদ',
    status: 'Paid' as 'Paid' | 'Unpaid'
  });

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.includes(searchQuery);
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalDue = invoices.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const totalCollected = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    return { totalDue, totalCollected, count: invoices.length };
  }, [invoices]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: `INV-${1000 + invoices.length + 1}`,
      client: formData.client,
      amount: Number(formData.amount),
      date: formData.date,
      status: formData.status as any,
      method: formData.method
    };
    setInvoices([newInv, ...invoices]);
    setIsModalOpen(false);
    setFormData({ client: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'নগদ', status: 'Paid' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">বিলিং ও ইনভয়েস</h2>
          <p className="text-slate-500">লেনদেন এবং পেমেন্ট রেকর্ডসমূহ পরিচালনা করুন</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
          <span>➕</span> নতুন পেমেন্ট আদায়
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-wider">বকেয়া বিল</p>
          <p className="text-3xl font-black text-red-600 mt-1">{symbol} {stats.totalDue}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-wider">মোট আদায়</p>
          <p className="text-3xl font-black text-green-600 mt-1">{symbol} {stats.totalCollected}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-wider">মোট ইনভয়েস</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{stats.count} টি</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden no-print">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['All', 'Paid', 'Unpaid', 'Overdue'] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border'}`}>
                {s === 'All' ? 'সবগুলো' : s}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <input type="text" placeholder="খুঁজুন..." className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">ইনভয়েস নং</th>
                <th className="px-6 py-4">ক্লায়েন্ট</th>
                <th className="px-6 py-4">পরিমাণ</th>
                <th className="px-6 py-4">অবস্থা</th>
                <th className="px-6 py-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-blue-50/30 transition group">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 text-sm">{inv.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{inv.client}</td>
                  <td className="px-6 py-4 font-black text-slate-800">{symbol} {inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => { setSelectedInvoice(inv); setIsViewModalOpen(true); }} className="text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg font-bold text-xs border border-blue-600 transition">রিসিট</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;