
import React, { useState, useEffect } from 'react';
import { MikrotikConfig } from '../types';

interface InterfaceStats {
  name: string;
  type: string;
  status: 'up' | 'down';
  rx: string;
  tx: string;
}

interface PPPoESecret {
  id: string;
  name: string;
  password: string;
  service: string;
  profile: string;
  status: 'Enabled' | 'Disabled';
  lastCaller?: string;
}

interface HotspotServer {
  id: string;
  name: string;
  interface: string;
  profile: string;
  status: 'Enabled' | 'Disabled';
  addressPool: string;
}

interface FirewallRule {
  id: string;
  chain: 'forward' | 'input' | 'output' | 'srcnat' | 'dstnat';
  action: 'accept' | 'drop' | 'masquerade' | 'redirect';
  srcAddress?: string;
  dstAddress?: string;
  comment: string;
  status: 'Enabled' | 'Disabled';
}

interface SystemLog {
  id: string;
  time: string;
  topics: string;
  message: string;
  type: 'info' | 'error' | 'warning';
}

interface RouterDetails extends MikrotikConfig {
  cpu: number;
  memory: string;
  uptime: string;
  interfaces: InterfaceStats[];
}

const INITIAL_ROUTERS: RouterDetails[] = [
  { 
    id: '1', 
    name: 'Main Core Router', 
    ip: '192.168.88.1', 
    username: 'admin', 
    status: 'Connected',
    cpu: 12,
    memory: '128MB / 512MB',
    uptime: '15d 04h 22m',
    interfaces: [
      { name: 'ether1-WAN', type: 'ether', status: 'up', rx: '45 Mbps', tx: '12 Mbps' },
      { name: 'ether2-LAN', type: 'ether', status: 'up', rx: '10 Mbps', tx: '40 Mbps' },
      { name: 'wlan1', type: 'wifi', status: 'up', rx: '2 Mbps', tx: '5 Mbps' },
    ]
  }
];

const INITIAL_PPPOE: PPPoESecret[] = [
  { id: 'p1', name: 'user01', password: '123', service: 'pppoe', profile: '5Mbps_Profile', status: 'Enabled', lastCaller: '00:1A:2B:3C:4D:5E' },
  { id: 'p2', name: 'user02', password: '456', service: 'pppoe', profile: '10Mbps_Profile', status: 'Disabled' },
  { id: 'p3', name: 'user03', password: '789', service: 'any', profile: '20Mbps_Profile', status: 'Enabled' },
];

const INITIAL_HOTSPOT: HotspotServer[] = [
  { id: 'h1', name: 'hotspot1', interface: 'bridge-local', profile: 'hsprof1', status: 'Enabled', addressPool: 'hs-pool-1' },
  { id: 'h2', name: 'hotspot-guest', interface: 'wlan1', profile: 'default', status: 'Disabled', addressPool: 'none' },
];

const INITIAL_FIREWALL: FirewallRule[] = [
  { id: 'f1', chain: 'forward', action: 'drop', srcAddress: '10.5.50.12', comment: 'Block malicious user', status: 'Enabled' },
  { id: 'f2', chain: 'srcnat', action: 'masquerade', dstAddress: '0.0.0.0/0', comment: 'Main Internet NAT', status: 'Enabled' },
  { id: 'f3', chain: 'input', action: 'accept', srcAddress: '192.168.88.0/24', comment: 'Allow local management', status: 'Enabled' },
];

const INITIAL_LOGS: SystemLog[] = [
  { id: 'l1', time: '10:45:22', topics: 'system,info', message: 'User admin logged in via webfig from 192.168.88.25', type: 'info' },
  { id: 'l2', time: '10:46:05', topics: 'interface,info', message: 'ether1-WAN link up (1Gbps Full Duplex)', type: 'info' },
  { id: 'l3', time: '10:50:11', topics: 'firewall,warning', message: 'Drop forward rule matched: src 10.5.50.12', type: 'warning' },
  { id: 'l4', time: '11:02:44', topics: 'pppoe,info', message: 'user01 connected via ether2-LAN', type: 'info' },
];

const MikrotikManager: React.FC = () => {
  const [routers, setRouters] = useState<RouterDetails[]>(INITIAL_ROUTERS);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedRouter, setSelectedRouter] = useState<RouterDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'Interfaces' | 'PPPoE' | 'Hotspot' | 'Firewall' | 'Log'>('Interfaces');
  
  const [pppoeSecrets, setPppoeSecrets] = useState<PPPoESecret[]>(INITIAL_PPPOE);
  const [hotspotServers, setHotspotServers] = useState<HotspotServer[]>(INITIAL_HOTSPOT);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(INITIAL_FIREWALL);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  // Edit States
  const [editingPppoe, setEditingPppoe] = useState<PPPoESecret | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<HotspotServer | null>(null);
  const [editingFirewall, setEditingFirewall] = useState<FirewallRule | null>(null);
  const [viewingLog, setViewingLog] = useState<SystemLog | null>(null);

  const [newRouter, setNewRouter] = useState({ name: '', ip: '', username: '', password: '' });

  useEffect(() => {
    if (selectedRouter && activeTab === 'Log') {
      const interval = setInterval(() => {
        const newLog: SystemLog = {
          id: Math.random().toString(36).substr(2, 5),
          time: new Date().toLocaleTimeString(),
          topics: 'system,info',
          message: 'Monitoring active session heartbeat...',
          type: 'info'
        };
        setSystemLogs(prev => [newLog, ...prev].slice(0, 50));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedRouter, activeTab]);

  const handleAddRouter = (e: React.FormEvent) => {
    e.preventDefault();
    const router: RouterDetails = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRouter.name,
      ip: newRouter.ip,
      username: newRouter.username,
      status: 'Connected',
      cpu: Math.floor(Math.random() * 20),
      memory: '256MB / 1024MB',
      uptime: '0h 01m',
      interfaces: [{ name: 'ether1', type: 'ether', status: 'up', rx: '0', tx: '0' }]
    };
    setRouters([...routers, router]);
    setNewRouter({ name: '', ip: '', username: '', password: '' });
    setShowAdd(false);
  };

  const handleDeleteRouter = (id: string) => {
    if (window.confirm('আপনি কি এই রাউটারটি মুছে ফেলতে চান?')) {
      setRouters(routers.filter(r => r.id !== id));
      if (selectedRouter?.id === id) setSelectedRouter(null);
    }
  };

  const togglePppoeStatus = (id: string) => {
    setPppoeSecrets(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Enabled' ? 'Disabled' : 'Enabled' } : p));
  };

  const handleSavePppoe = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPppoe) {
      setPppoeSecrets(prev => prev.map(p => p.id === editingPppoe.id ? editingPppoe : p));
      setEditingPppoe(null);
    }
  };

  const deletePppoeSecret = (id: string) => {
    if (confirm('আপনি কি এই PPPoE সিক্রেটটি ডিলিট করতে চান?')) {
      setPppoeSecrets(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleHotspotStatus = (id: string) => {
    setHotspotServers(prev => prev.map(h => h.id === id ? { ...h, status: h.status === 'Enabled' ? 'Disabled' : 'Enabled' } : h));
  };

  const handleSaveHotspot = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHotspot) {
      setHotspotServers(prev => prev.map(h => h.id === editingHotspot.id ? editingHotspot : h));
      setEditingHotspot(null);
    }
  };

  const deleteHotspotServer = (id: string) => {
    if (confirm('আপনি কি এই হটস্পট সার্ভারটি ডিলিট করতে চান?')) {
      setHotspotServers(prev => prev.filter(h => h.id !== id));
    }
  };

  const toggleFirewallStatus = (id: string) => {
    setFirewallRules(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'Enabled' ? 'Disabled' : 'Enabled' } : f));
  };

  const handleSaveFirewall = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFirewall) {
      setFirewallRules(prev => prev.map(f => f.id === editingFirewall.id ? editingFirewall : f));
      setEditingFirewall(null);
    }
  };

  const deleteFirewallRule = (id: string) => {
    if (confirm('আপনি কি এই ফায়ারওয়াল রুলটি ডিলিট করতে চান?')) {
      setFirewallRules(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">🌐</span>
            মাইক্রোটিক নেটওয়ার্ক
          </h2>
          <p className="text-slate-500 font-medium mt-1">আপনার রাউটারগুলো মনিটর ও কন্ট্রোল করুন সরাসরি এখান থেকে</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className={`px-8 py-4 rounded-2xl transition-all flex items-center gap-2 font-black uppercase text-sm tracking-widest active:scale-95 ${
            showAdd ? 'bg-slate-200 text-slate-700' : 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
          }`}
        >
          {showAdd ? '✖️ বন্ধ করুন' : '➕ নতুন রাউটার'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddRouter} className="bg-white p-10 rounded-[3rem] shadow-xl border border-blue-50 animate-slideUp">
          <h3 className="text-xl font-black mb-8 text-slate-800 flex items-center gap-3 uppercase tracking-tight">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">📡</span>
            নতুন মাইক্রোটিক কানেকশন
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">রাউটার নাম</label>
              <input required className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-700 transition-all" placeholder="Core-Router-01" value={newRouter.name} onChange={e => setNewRouter({...newRouter, name: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">আইপি এড্রেস</label>
              <input required className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-700 transition-all" placeholder="192.168.88.1" value={newRouter.ip} onChange={e => setNewRouter({...newRouter, ip: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ইউজারনেম</label>
              <input required className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-700 transition-all" placeholder="admin" value={newRouter.username} onChange={e => setNewRouter({...newRouter, username: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পাসওয়ার্ড</label>
              <input required className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-700 transition-all" type="password" placeholder="••••••••" value={newRouter.password} onChange={e => setNewRouter({...newRouter, password: e.target.value})} />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition shadow-xl active:scale-95">কানেক্ট করুন</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {routers.map((router) => (
          <div 
            key={router.id} 
            className={`bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all cursor-pointer group ${
              selectedRouter?.id === router.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 hover:shadow-xl'
            }`}
            onClick={() => setSelectedRouter(router)}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 ${selectedRouter?.id === router.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>📡</div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg leading-tight">{router.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-1 font-bold">{router.ip}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black border tracking-widest ${
                router.status === 'Connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {router.status === 'Connected' ? 'সংযুক্ত' : 'অফলাইন'}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">সিপিইউ লোড</span>
                <span className={router.cpu > 70 ? 'text-red-500' : 'text-slate-700'}>{router.cpu}%</span>
              </div>
              <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ${router.cpu > 80 ? 'bg-red-500 animate-pulse' : 'bg-slate-900'}`} 
                  style={{ width: `${router.cpu}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[10px] pt-4 border-t border-slate-50">
                <div>
                  <p className="text-slate-400 uppercase font-black tracking-tighter">মেমোরি ব্যবহার</p>
                  <p className="font-black text-slate-700 mt-1">{router.memory}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-black tracking-tighter">টোটাল আপটাইম</p>
                  <p className="font-black text-slate-700 mt-1">{router.uptime}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl hover:bg-black transition text-[10px] font-black uppercase tracking-widest active:scale-95"
                onClick={(e) => { e.stopPropagation(); setSelectedRouter(router); }}
              >
                বিস্তারিত মডিউল
              </button>
              <button 
                className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition active:scale-95"
                onClick={(e) => { e.stopPropagation(); handleDeleteRouter(router.id); }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRouter && (
        <div className="mt-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-slideUp">
          <div className="bg-slate-900 text-white px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="text-3xl">🛠️</span>
              <div>
                <h3 className="font-black text-lg tracking-tight uppercase leading-none">{selectedRouter.name} - কনফিগারেশন মডিউল</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1.5 font-bold">{selectedRouter.ip} • Logged as {selectedRouter.username} • {selectedRouter.uptime}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedRouter(null)}
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition text-2xl font-black"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[500px]">
            <div className="w-full lg:w-56 bg-slate-50 border-r border-slate-100 p-4 space-y-2">
              {(['Interfaces', 'PPPoE', 'Hotspot', 'Firewall', 'Log'] as const).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-105' 
                    : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'PPPoE' ? '🔒 ' + tab : tab === 'Hotspot' ? '📶 ' + tab : tab === 'Interfaces' ? '🔌 ' + tab : tab === 'Firewall' ? '🛡️ ' + tab : '📜 ' + tab}
                </button>
              ))}
              <div className="pt-8 px-4">
                 <p className="text-[9px] font-black text-slate-300 uppercase italic">Router Identity: {selectedRouter.id}</p>
              </div>
            </div>

            <div className="flex-1 p-10 bg-white">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                  {activeTab} Management Control
                </h4>
                <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase hover:bg-slate-200 transition">🔄 Refresh</button>
              </div>
              
              <div className="overflow-x-auto h-[400px] custom-scrollbar">
                {activeTab === 'Interfaces' && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 font-black uppercase tracking-[0.15em] border-b sticky top-0 bg-white z-10">
                      <tr>
                        <th className="pb-5 px-4">Status</th>
                        <th className="pb-5 px-4">Interface Name</th>
                        <th className="pb-5 px-4">Type</th>
                        <th className="pb-5 px-4">RX Traffic</th>
                        <th className="pb-5 px-4">TX Traffic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedRouter.interfaces.map((iface, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition group">
                          <td className="py-4 px-4">
                            <span className={`w-3 h-3 rounded-full inline-block ${iface.status === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          </td>
                          <td className="py-4 px-4 font-black text-slate-700">{iface.name}</td>
                          <td className="py-4 px-4 text-slate-400 font-bold italic">{iface.type}</td>
                          <td className="py-4 px-4 font-mono font-black text-blue-600 group-hover:scale-105 transition-transform">{iface.rx}</td>
                          <td className="py-4 px-4 font-mono font-black text-purple-600 group-hover:scale-105 transition-transform">{iface.tx}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'PPPoE' && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 font-black uppercase tracking-[0.15em] border-b sticky top-0 bg-white z-10">
                      <tr>
                        <th className="pb-5 px-4">Enable</th>
                        <th className="pb-5 px-4">Secret Name</th>
                        <th className="pb-5 px-4">Service</th>
                        <th className="pb-5 px-4">Profile</th>
                        <th className="pb-5 px-4">Last Caller</th>
                        <th className="pb-5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {pppoeSecrets.map((secret) => (
                        <tr key={secret.id} className={`hover:bg-slate-50 transition ${secret.status === 'Disabled' ? 'opacity-50 grayscale' : ''}`}>
                          <td className="py-4 px-4">
                             <button 
                               onClick={() => togglePppoeStatus(secret.id)}
                               className={`w-10 h-5 rounded-full relative transition-all ${secret.status === 'Enabled' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                             >
                               <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${secret.status === 'Enabled' ? 'left-5.5' : 'left-0.5'}`}></div>
                             </button>
                          </td>
                          <td className="py-4 px-4 font-black text-slate-800">{secret.name}</td>
                          <td className="py-4 px-4 font-bold text-slate-400 uppercase">{secret.service}</td>
                          <td className="py-4 px-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-black">{secret.profile}</span></td>
                          <td className="py-4 px-4 font-mono text-slate-400">{secret.lastCaller || 'never'}</td>
                          <td className="py-4 px-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingPppoe(secret)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition shadow-sm">⚙️</button>
                                <button onClick={() => deletePppoeSecret(secret.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm">🗑️</button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'Hotspot' && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 font-black uppercase tracking-[0.15em] border-b sticky top-0 bg-white z-10">
                      <tr>
                        <th className="pb-5 px-4">Enable</th>
                        <th className="pb-5 px-4">Server Name</th>
                        <th className="pb-5 px-4">Interface</th>
                        <th className="pb-5 px-4">Profile</th>
                        <th className="pb-5 px-4">Address Pool</th>
                        <th className="pb-5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {hotspotServers.map((server) => (
                        <tr key={server.id} className={`hover:bg-slate-50 transition ${server.status === 'Disabled' ? 'opacity-50 grayscale' : ''}`}>
                          <td className="py-4 px-4">
                             <button 
                               onClick={() => toggleHotspotStatus(server.id)}
                               className={`w-10 h-5 rounded-full relative transition-all ${server.status === 'Enabled' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                             >
                               <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${server.status === 'Enabled' ? 'left-5.5' : 'left-0.5'}`}></div>
                             </button>
                          </td>
                          <td className="py-4 px-4 font-black text-slate-800">{server.name}</td>
                          <td className="py-4 px-4 font-bold text-emerald-600">{server.interface}</td>
                          <td className="py-4 px-4"><span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md font-black">{server.profile}</span></td>
                          <td className="py-4 px-4 font-mono text-slate-400">{server.addressPool}</td>
                          <td className="py-4 px-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingHotspot(server)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition shadow-sm">⚙️</button>
                                <button onClick={() => deleteHotspotServer(server.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm">🗑️</button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'Firewall' && (
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 font-black uppercase tracking-[0.15em] border-b sticky top-0 bg-white z-10">
                      <tr>
                        <th className="pb-5 px-4">Enable</th>
                        <th className="pb-5 px-4">Chain</th>
                        <th className="pb-5 px-4">Action</th>
                        <th className="pb-5 px-4">Src. Address</th>
                        <th className="pb-5 px-4">Comment</th>
                        <th className="pb-5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {firewallRules.map((rule) => (
                        <tr key={rule.id} className={`hover:bg-slate-50 transition ${rule.status === 'Disabled' ? 'opacity-50 grayscale' : ''}`}>
                          <td className="py-4 px-4">
                             <button 
                               onClick={() => toggleFirewallStatus(rule.id)}
                               className={`w-10 h-5 rounded-full relative transition-all ${rule.status === 'Enabled' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                             >
                               <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${rule.status === 'Enabled' ? 'left-5.5' : 'left-0.5'}`}></div>
                             </button>
                          </td>
                          <td className="py-4 px-4 font-black text-slate-800 uppercase">{rule.chain}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded font-black uppercase text-[9px] ${
                              rule.action === 'drop' ? 'bg-red-100 text-red-600' : 
                              rule.action === 'accept' ? 'bg-emerald-100 text-emerald-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>{rule.action}</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-500">{rule.srcAddress || 'any'}</td>
                          <td className="py-4 px-4 italic text-slate-400 text-[10px] truncate max-w-[150px]">{rule.comment}</td>
                          <td className="py-4 px-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingFirewall(rule)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition shadow-sm">⚙️</button>
                                <button onClick={() => deleteFirewallRule(rule.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm">🗑️</button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'Log' && (
                  <div className="space-y-2">
                    {systemLogs.map((log) => (
                      <div 
                        key={log.id} 
                        onClick={() => setViewingLog(log)}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-4 text-[10px] group hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                      >
                        <span className="font-mono text-slate-400 font-bold shrink-0">{log.time}</span>
                        <span className={`font-black uppercase shrink-0 w-24 truncate ${
                          log.type === 'error' ? 'text-red-500' : log.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                        }`}>{log.topics}</span>
                        <span className="text-slate-700 font-medium truncate">{log.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 shadow-sm group hover:scale-105 transition-transform">
                  <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Active PPPoE</h5>
                  <p className="text-3xl font-black text-blue-900">{pppoeSecrets.filter(p => p.status === 'Enabled').length}</p>
                </div>
                <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 shadow-sm group hover:scale-105 transition-transform">
                  <h5 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Active Hotspot</h5>
                  <p className="text-3xl font-black text-orange-900">{hotspotServers.filter(h => h.status === 'Enabled').length}</p>
                </div>
                <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 shadow-sm group hover:scale-105 transition-transform">
                  <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Dropped Packets</h5>
                  <p className="text-3xl font-black text-red-900">৪৫</p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-sm group hover:scale-105 transition-transform">
                  <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">WAN Uptime</h5>
                  <p className="text-3xl font-black text-emerald-900">৯৯.৯%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit PPPoE Secret Modal */}
      {editingPppoe && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
               <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">🔒</span>
               PPPoE সিক্রেট এডিট
            </h3>
            <form onSubmit={handleSavePppoe} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ইউজারনেম</label>
                 <input className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-blue-500" value={editingPppoe.name} onChange={e => setEditingPppoe({...editingPppoe, name: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">পাসওয়ার্ড</label>
                 <input className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-blue-500" type="text" value={editingPppoe.password} onChange={e => setEditingPppoe({...editingPppoe, password: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">প্রোফাইল</label>
                 <select className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-blue-500" value={editingPppoe.profile} onChange={e => setEditingPppoe({...editingPppoe, profile: e.target.value})}>
                    <option value="5Mbps_Profile">5Mbps_Profile</option>
                    <option value="10Mbps_Profile">10Mbps_Profile</option>
                    <option value="20Mbps_Profile">20Mbps_Profile</option>
                 </select>
               </div>
               <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setEditingPppoe(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl text-xs font-black uppercase text-slate-500">বাতিল</button>
                  <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-200">সেভ করুন</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Hotspot Server Modal */}
      {editingHotspot && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
               <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">📶</span>
               হটস্পট সার্ভার এডিট
            </h3>
            <form onSubmit={handleSaveHotspot} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">সার্ভার নাম</label>
                 <input className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-orange-500" value={editingHotspot.name} onChange={e => setEditingHotspot({...editingHotspot, name: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ইন্টারফেস</label>
                 <input className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-orange-500" value={editingHotspot.interface} onChange={e => setEditingHotspot({...editingHotspot, interface: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">প্রোফাইল</label>
                 <input className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-orange-500" value={editingHotspot.profile} onChange={e => setEditingHotspot({...editingHotspot, profile: e.target.value})} />
               </div>
               <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setEditingHotspot(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl text-xs font-black uppercase text-slate-500">বাতিল</button>
                  <button type="submit" className="flex-1 py-4 bg-orange-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-orange-200">সেভ করুন</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Firewall Rule Modal */}
      {editingFirewall && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
               <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">🛡️</span>
               ফায়ারওয়াল রুল এডিট
            </h3>
            <form onSubmit={handleSaveFirewall} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">চেইন (Chain)</label>
                 <select className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-red-500" value={editingFirewall.chain} onChange={e => setEditingFirewall({...editingFirewall, chain: e.target.value as any})}>
                    <option value="forward">Forward</option>
                    <option value="input">Input</option>
                    <option value="output">Output</option>
                    <option value="srcnat">SRCNAT</option>
                    <option value="dstnat">DSTNAT</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">অ্যাকশন (Action)</label>
                 <select className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-red-500" value={editingFirewall.action} onChange={e => setEditingFirewall({...editingFirewall, action: e.target.value as any})}>
                    <option value="accept">Accept</option>
                    <option value="drop">Drop</option>
                    <option value="masquerade">Masquerade</option>
                    <option value="redirect">Redirect</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">কমেন্ট</label>
                 <textarea className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-red-500 resize-none" value={editingFirewall.comment} onChange={e => setEditingFirewall({...editingFirewall, comment: e.target.value})} rows={2} />
               </div>
               <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setEditingFirewall(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl text-xs font-black uppercase text-slate-500">বাতিল</button>
                  <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-slate-200">সেভ করুন</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* View Log Detail Modal */}
      {viewingLog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className={`p-8 ${viewingLog.type === 'error' ? 'bg-red-600' : viewingLog.type === 'warning' ? 'bg-amber-500' : 'bg-blue-600'} text-white`}>
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Log Entry</p>
                    <h3 className="text-xl font-black mt-1">লগ বিস্তারিত তথ্য</h3>
                  </div>
                  <button onClick={() => setViewingLog(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">×</button>
               </div>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</p>
                     <p className="font-mono font-black text-slate-800">{viewingLog.time}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Topics</p>
                     <p className="font-black text-slate-800 uppercase truncate">{viewingLog.topics}</p>
                  </div>
               </div>
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Message Content</p>
                  <p className="text-blue-100 font-mono text-sm leading-relaxed">{viewingLog.message}</p>
               </div>
               <div className="flex justify-end">
                  <button onClick={() => setViewingLog(null)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition">বন্ধ করুন</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MikrotikManager;
