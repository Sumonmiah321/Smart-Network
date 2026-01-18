
import React, { useState, useMemo } from 'react';
import { CompanySettings, SupportTicket, Announcement } from '../types';

interface Props {
  company: CompanySettings;
}

const INITIAL_TICKETS: SupportTicket[] = [
  { id: 'T-101', clientId: '1', clientName: 'Abdur Rahim', subject: 'Internet very slow', description: 'Getting only 1Mbps on a 5Mbps plan.', priority: 'Medium', status: 'Processing', createdAt: '2024-06-20 10:30 AM', category: 'Internet Slow' },
  { id: 'T-102', clientId: '3', clientName: 'Siddikur Rahman', subject: 'No link / Red light', description: 'Since morning no connection. Router showing red light.', priority: 'Urgent', status: 'Open', createdAt: '2024-06-21 08:15 AM', category: 'No Link' },
  { id: 'T-103', clientId: '2', clientName: 'Karim Hossain', subject: 'Billing issue', description: 'Paid via bKash but balance not updated.', priority: 'Low', status: 'Resolved', createdAt: '2024-06-19 02:45 PM', category: 'Billing' },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'A-1', title: 'Maintenance Alert', message: 'Core router maintenance on Sunday 2AM to 4AM.', type: 'Maintenance', active: true, createdAt: '2024-06-20' },
  { id: 'A-2', title: 'Fiber Cut', message: 'Fiber cut in Mirpur Area. Our team is working on it.', type: 'Alert', active: true, createdAt: '2024-06-21' },
];

const SupportManager: React.FC<Props> = ({ company }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [activeTab, setActiveTab] = useState<'tickets' | 'announcements'>('tickets');
  const [ticketFilter, setTicketFilter] = useState<'All' | 'Open' | 'Processing' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const lang = company.language;

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesFilter = ticketFilter === 'All' || t.status === ticketFilter;
      const matchesSearch = t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.includes(searchQuery);
      return matchesFilter && matchesSearch;
    });
  }, [tickets, ticketFilter, searchQuery]);

  const stats = useMemo(() => ({
    open: tickets.filter(t => t.status === 'Open').length,
    processing: tickets.filter(t => t.status === 'Processing').length,
    urgent: tickets.filter(t => t.priority === 'Urgent').length,
  }), [tickets]);

  const updateTicketStatus = (id: string, newStatus: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteTicket = (id: string) => {
    if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে এই টিকেটটি মুছে ফেলতে চান?' : 'Delete this ticket?')) {
      setTickets(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {lang === 'bn' ? 'গ্রাহক সেবা ও সম্প্রদায়' : 'Support & Community'}
          </h2>
          <p className="text-slate-500 text-sm font-medium">Manage complaints and broadcast messages</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-green-100 shadow-xl">
           <button 
             onClick={() => setActiveTab('tickets')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-[#006a4e] text-white' : 'text-slate-400 hover:text-green-800'}`}
           >
             Tickets
           </button>
           <button 
             onClick={() => setActiveTab('announcements')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'announcements' ? 'bg-[#006a4e] text-white' : 'text-slate-400 hover:text-green-800'}`}
           >
             Broadcasts
           </button>
        </div>
      </header>

      {activeTab === 'tickets' && (
        <div className="space-y-8 animate-slideUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-red-50 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Requests</p>
                  <p className="text-3xl font-black text-[#f42a41] mt-1">{stats.open}</p>
               </div>
               <span className="text-3xl opacity-30">🔔</span>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-blue-50 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing</p>
                  <p className="text-3xl font-black text-blue-600 mt-1">{stats.processing}</p>
               </div>
               <span className="text-3xl opacity-30">⚙️</span>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgent Cases</p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">{stats.urgent}</p>
               </div>
               <span className="text-3xl opacity-30">🚨</span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
                <div className="flex gap-2">
                   {(['All', 'Open', 'Processing', 'Resolved'] as const).map(f => (
                     <button key={f} onClick={() => setTicketFilter(f)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${ticketFilter === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'}`}>
                       {lang === 'bn' ? (f === 'All' ? 'সবগুলো' : f) : f}
                     </button>
                   ))}
                </div>
                <div className="relative w-full md:w-72">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                   <input className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-green-50 focus:border-[#006a4e] transition-all" placeholder="Search by name or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                      <tr>
                         <th className="px-8 py-5">Complaint Identity</th>
                         <th className="px-8 py-5">Subject & Category</th>
                         <th className="px-8 py-5">Priority</th>
                         <th className="px-8 py-5">Status</th>
                         <th className="px-8 py-5 text-right">Quick Control</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {filteredTickets.map(ticket => (
                        <tr key={ticket.id} className="hover:bg-green-50/20 transition group">
                           <td className="px-8 py-5">
                              <p className="font-black text-slate-800 text-sm">{ticket.clientName}</p>
                              <p className="text-[9px] text-blue-600 font-mono font-bold uppercase">{ticket.id}</p>
                           </td>
                           <td className="px-8 py-5">
                              <p className="text-xs font-bold text-slate-700">{ticket.subject}</p>
                              <span className="text-[9px] font-black uppercase text-slate-400">{ticket.category}</span>
                           </td>
                           <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                ticket.priority === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100' :
                                ticket.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                                {ticket.priority}
                              </span>
                           </td>
                           <td className="px-8 py-5">
                              <select 
                                value={ticket.status} 
                                onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                                className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                                  ticket.status === 'Open' ? 'bg-red-500 text-white' :
                                  ticket.status === 'Processing' ? 'bg-blue-600 text-white' :
                                  'bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                <option value="Open">Open</option>
                                <option value="Processing">Processing</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-[#006a4e] hover:text-white transition shadow-sm">✉️</button>
                                 <button onClick={() => deleteTicket(ticket.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm">🗑️</button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
                {filteredTickets.length === 0 && (
                   <div className="p-20 text-center text-slate-300">
                      <span className="text-6xl block mb-4 opacity-10">🎫</span>
                      <p className="text-xs font-black uppercase tracking-widest">No matching tickets found</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-8 animate-slideUp">
           <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-inner">📣</div>
                 <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Community Broadcast Center</h3>
                    <p className="text-xs text-slate-500 font-bold">Post news and alerts directly to your customer portal</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-[#006a4e] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-green-800 transition active:scale-95">
                 Create Announcement
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {announcements.map(ann => (
                <div key={ann.id} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border-2 transition-all ${ann.active ? 'border-emerald-100 ring-4 ring-emerald-50' : 'border-slate-100 opacity-60 grayscale'}`}>
                   <div className="flex justify-between items-start mb-6">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        ann.type === 'Alert' ? 'bg-red-100 text-red-600' :
                        ann.type === 'Maintenance' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {ann.type}
                      </span>
                      <button onClick={() => toggleAnnouncement(ann.id)} className={`w-10 h-5 rounded-full relative transition-all ${ann.active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                         <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${ann.active ? 'left-5.5' : 'left-0.5'}`}></div>
                      </button>
                   </div>
                   <h4 className="text-lg font-black text-slate-800 leading-tight mb-2">{ann.title}</h4>
                   <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6">{ann.message}</p>
                   <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                      <span>{ann.createdAt}</span>
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700">EDIT</button>
                        <button className="text-red-500 hover:text-red-700">DELETE</button>
                      </div>
                   </div>
                </div>
              ))}
              
              <button className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-300 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                 <span className="text-4xl mb-4 transition-transform group-hover:scale-125">➕</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Broadcast Card</span>
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupportManager;
