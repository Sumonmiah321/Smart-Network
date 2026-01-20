
import React, { useState, useMemo, useEffect } from 'react';
import { CompanySettings, VoucherTemplate, SavedVoucherTemplate, VoucherCard, HotspotPackage } from '../types';

interface Props {
  company: CompanySettings;
}

const INITIAL_PACKAGES: HotspotPackage[] = [
  { id: 'p1', name: '500MB Daily', price: 10, validity: '1 Day', limit: '500MB' },
  { id: 'p2', name: '1GB Standard', price: 20, validity: '2 Days', limit: '1GB' },
  { id: 'p3', name: 'Unlimited Monthly', price: 500, validity: '30 Days', limit: 'Unlimited' },
];

const PRESET_TEMPLATES: SavedVoucherTemplate[] = [
  { id: 't1', templateName: 'Classic ISP', backgroundColor: '#006a4e', secondaryColor: '#ffffff', textColor: '#ffffff', showLogo: true, showQR: true, pattern: 'mesh', borderStyle: 'solid', layout: 'modern', createdAt: '2024-01-01' },
  { id: 't2', templateName: 'Premium Red', backgroundColor: '#f42a41', secondaryColor: '#000000', textColor: '#ffffff', showLogo: true, showQR: true, pattern: 'circuit', borderStyle: 'double', layout: 'gradient', createdAt: '2024-01-01' },
  { id: 't3', templateName: 'Eco Light', backgroundColor: '#f0fdf4', secondaryColor: '#006a4e', textColor: '#064e3b', showLogo: true, showQR: true, pattern: 'dots', borderStyle: 'dashed', layout: 'classic', createdAt: '2024-01-01' },
];

const VoucherDesigner: React.FC<Props> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'designer' | 'templates' | 'generator' | 'packages' | 'search'>('designer');
  const [template, setTemplate] = useState<VoucherTemplate>({
    backgroundColor: '#006a4e',
    secondaryColor: '#f42a41',
    textColor: '#ffffff',
    showLogo: true,
    showQR: true,
    pattern: 'mesh',
    borderStyle: 'solid',
    layout: 'modern'
  });

  const [packages, setPackages] = useState<HotspotPackage[]>(INITIAL_PACKAGES);
  const [generatedVouchers, setGeneratedVouchers] = useState<VoucherCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genCount, setGenCount] = useState(10);
  const [selectedPackageId, setSelectedPackageId] = useState(packages[0]?.id || '');
  
  const [userTemplates, setUserTemplates] = useState<SavedVoucherTemplate[]>(() => {
    const saved = localStorage.getItem('user_voucher_templates');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user_voucher_templates', JSON.stringify(userTemplates));
  }, [userTemplates]);

  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<HotspotPackage | null>(null);
  const [pkgFormData, setPkgFormData] = useState<Partial<HotspotPackage>>({
    name: '',
    price: 0,
    validity: '1 Day',
    limit: '1GB'
  });

  const symbol = company.currencySymbol;

  const handleSaveCurrentDesign = () => {
    const name = prompt('ডিজাইনটির একটি নাম দিন:');
    if (!name) return;
    
    const newTpl: SavedVoucherTemplate = {
      ...template,
      id: 'custom-' + Date.now(),
      templateName: name,
      createdAt: new Date().toLocaleDateString()
    };
    
    setUserTemplates([newTpl, ...userTemplates]);
    alert('ডিজাইনটি সফলভাবে লাইব্রেরিতে সেভ করা হয়েছে!');
  };

  const deleteUserTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('আপনি কি এই ডিজাইনটি মুছে ফেলতে চান?')) {
      setUserTemplates(userTemplates.filter(t => t.id !== id));
    }
  };

  // Function to generate 10-digit numeric code
  const generateCode = () => {
    const part1 = Math.floor(1000 + Math.random() * 9000); // 4 digits
    const part2 = Math.floor(1000 + Math.random() * 9000); // 4 digits
    const part3 = Math.floor(10 + Math.random() * 89);     // 2 digits
    return `${part1}-${part2}-${part3}`; // Total 10 digits
  };

  const handleGenerate = () => {
    const pkg = packages.find(p => p.id === selectedPackageId);
    if (!pkg) {
      alert('অনুগ্রহ করে একটি প্যাকেজ নির্বাচন করুন!');
      return;
    }

    const newVouchers: VoucherCard[] = Array.from({ length: genCount }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      code: generateCode(),
      serial: 'SN-' + (generatedVouchers.length + i + 1001),
      plan: pkg.name,
      price: pkg.price,
      validity: pkg.validity,
      status: 'Unused',
      createdAt: new Date().toLocaleDateString(),
      design: { ...template }
    }));

    setGeneratedVouchers([...newVouchers, ...generatedVouchers]);
    alert(`${genCount} টি ভাউচার সফলভাবে জেনারেট করা হয়েছে!`);
    setActiveTab('search');
  };

  const handleOpenPkgModal = (pkg?: HotspotPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPkgFormData({ ...pkg });
    } else {
      setEditingPackage(null);
      setPkgFormData({ name: '', price: 0, validity: '1 Day', limit: '1GB' });
    }
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPackage) {
      setPackages(prev => prev.map(p => p.id === editingPackage.id ? { ...p, ...pkgFormData } as HotspotPackage : p));
    } else {
      const newPkg: HotspotPackage = {
        ...pkgFormData,
        id: 'p-' + Date.now()
      } as HotspotPackage;
      setPackages([...packages, newPkg]);
      if (packages.length === 0) setSelectedPackageId(newPkg.id);
    }
    setIsPackageModalOpen(false);
  };

  const deletePackage = (id: string) => {
    if (window.confirm('আপনি কি এই প্যাকেজটি ডিলিট করতে চান?')) {
      const updated = packages.filter(p => p.id !== id);
      setPackages(updated);
      if (selectedPackageId === id) {
        setSelectedPackageId(updated[0]?.id || '');
      }
    }
  };

  const filteredVouchers = useMemo(() => {
    return generatedVouchers.filter(v => 
      v.code.includes(searchQuery) || v.serial.includes(searchQuery) || v.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [generatedVouchers, searchQuery]);

  const CardPreview: React.FC<{ card?: Partial<VoucherCard>, customTemplate?: VoucherTemplate, size?: 'sm' | 'md' | 'lg' }> = ({ card, customTemplate, size = 'lg' }) => {
    const activeDesign = customTemplate || template;
    const bgStyle = activeDesign.layout === 'gradient' 
      ? { background: `linear-gradient(135deg, ${activeDesign.backgroundColor}, ${activeDesign.secondaryColor})` }
      : { backgroundColor: activeDesign.backgroundColor };

    const getPatternOverlay = () => {
      if (activeDesign.pattern === 'dots') return 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)';
      if (activeDesign.pattern === 'mesh') return 'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%)';
      if (activeDesign.pattern === 'circuit') return 'url("https://www.transparenttextures.com/patterns/circuit-board.png")';
      return 'none';
    };

    return (
      <div 
        className={`relative overflow-hidden p-6 flex flex-col justify-between shadow-2xl transition-all duration-500 rounded-[2.5rem] border-4 border-white/20`}
        style={{ 
          ...bgStyle, 
          color: activeDesign.textColor, 
          aspectRatio: '1.6 / 1', 
          width: '100%', 
          maxWidth: size === 'sm' ? '180px' : '450px',
          transform: size === 'sm' ? 'scale(0.8)' : 'none'
        }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: getPatternOverlay(), backgroundSize: '30px 30px' }} />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            {activeDesign.showLogo && (
              <div className="bg-white p-1 rounded-xl shadow-lg border border-white/50">
                <img src={company.voucherLogo} className="w-10 h-10 object-contain" alt="Logo" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-black text-[12px] uppercase leading-none tracking-tighter">{company.name}</span>
              <span className="text-[8px] opacity-70 font-black uppercase mt-1 tracking-widest">WIFI VOUCHER</span>
            </div>
          </div>
          {activeDesign.showQR && (
            <div className="w-14 h-14 bg-white rounded-xl p-1.5 shadow-xl flex items-center justify-center border-2 border-slate-100">
               <div className="w-full h-full relative overflow-hidden flex flex-wrap gap-0.5 opacity-80">
                  {/* Visual QR Simulation */}
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className={`w-[22%] h-[22%] ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`}></div>
                  ))}
               </div>
            </div>
          )}
        </div>

        <div className="text-center space-y-3 relative z-10">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Security Access Code</p>
           <div className="bg-white/10 backdrop-blur-xl px-4 py-4 rounded-[2rem] border border-white/20 font-mono font-black text-2xl md:text-3xl tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2">
             {card?.code || '4822-9011-54'}
           </div>
           <p className="text-[9px] font-bold opacity-60">Expires in {card?.validity || '30 Days'} after first login</p>
        </div>

        <div className="flex justify-between items-end border-t border-white/10 pt-4 relative z-10">
           <div>
              <p className="text-[9px] font-black uppercase opacity-60 mb-0.5 tracking-wider">Package Plan</p>
              <span className="text-sm font-black uppercase bg-white/20 px-3 py-1 rounded-lg">{card?.plan || '1GB High Speed'}</span>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black uppercase opacity-60 mb-0.5 tracking-wider">Price</p>
              <span className="text-3xl font-black leading-none">{symbol} {card?.price || '20'}</span>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">ভাউচার ডিজাইন স্টুডিও</h2>
            <p className="text-slate-500 text-sm font-medium">কাস্টম কার্ড ডিজাইন এবং ১০-ডিজিট কোড জেনারেশন</p>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto custom-scrollbar">
            {(['designer', 'templates', 'generator', 'packages', 'search'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'designer' ? '🎨 Designer' : 
                 tab === 'templates' ? '📚 Templates' : 
                 tab === 'generator' ? '⚡ Generator' : 
                 tab === 'packages' ? '📦 Packages' : '🔍 Search'}
              </button>
            ))}
          </div>
       </header>

       {/* --- TAB: DESIGNER --- */}
       {activeTab === 'designer' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-10">
               <div className="flex justify-between items-center">
                 <h3 className="text-xs font-black text-[#006a4e] uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#006a4e]"></span> স্টাইল কাস্টমাইজেশন
                 </h3>
                 <button onClick={handleSaveCurrentDesign} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-black uppercase border border-emerald-100 hover:bg-emerald-100 transition shadow-sm">💾 Save Design</button>
               </div>
               
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">মেইন কালার</label>
                     <input type="color" className="w-full h-12 rounded-2xl cursor-pointer border-0 shadow-inner" value={template.backgroundColor} onChange={e => setTemplate({...template, backgroundColor: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">সেকেন্ডারি কালার</label>
                     <input type="color" className="w-full h-12 rounded-2xl cursor-pointer border-0 shadow-inner" value={template.secondaryColor} onChange={e => setTemplate({...template, secondaryColor: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">টেক্সট কালার</label>
                     <input type="color" className="w-full h-12 rounded-2xl cursor-pointer border-0 shadow-inner" value={template.textColor} onChange={e => setTemplate({...template, textColor: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">প্যাটার্ন ওভারলে</label>
                     <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black uppercase" value={template.pattern} onChange={e => setTemplate({...template, pattern: e.target.value as any})}>
                        <option value="none">None</option>
                        <option value="dots">Dots</option>
                        <option value="mesh">Mesh</option>
                        <option value="circuit">Circuit</option>
                     </select>
                  </div>
               </div>

               <div className="flex flex-wrap gap-4 pt-4">
                  <button onClick={() => setTemplate({...template, showLogo: !template.showLogo})} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${template.showLogo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Show Logo</button>
                  <button onClick={() => setTemplate({...template, showQR: !template.showQR})} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${template.showQR ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Show QR Code</button>
                  <button onClick={() => setTemplate({...template, layout: template.layout === 'modern' ? 'gradient' : 'modern'})} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-blue-100 text-blue-700`}>Toggle Gradient</button>
               </div>
            </div>

            <div className="flex flex-col items-center gap-8 sticky top-32">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Card Preview</h4>
               <CardPreview />
               <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white w-full max-w-[450px] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl font-black italic">PRO</span></div>
                  <p className="text-xs font-bold leading-relaxed opacity-60 mb-6">আপনার ডিজাইনটি সেভ করে জেনারেটরে ব্যবহার করুন। ভাউচার কোডটি অটোমেটিক ১০-ডিজিটের হবে।</p>
                  <button onClick={() => setActiveTab('generator')} className="w-full py-4 bg-emerald-500 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">Go to Generator ⚡</button>
               </div>
            </div>
         </div>
       )}

       {/* --- TAB: TEMPLATES --- */}
       {activeTab === 'templates' && (
         <div className="space-y-12 animate-slideUp">
            {userTemplates.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-xs font-black text-[#006a4e] uppercase tracking-[0.2em] ml-2">My Saved Designs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {userTemplates.map(tpl => (
                    <div key={tpl.id} className="group relative">
                       <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                       <div className="relative bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all" onClick={() => { setTemplate({...tpl}); setActiveTab('designer'); }}>
                          <CardPreview customTemplate={tpl} size="sm" />
                          <div className="text-center w-full pb-2">
                             <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{tpl.templateName}</h4>
                             <p className="text-[10px] text-slate-400 font-bold mt-1">Saved: {tpl.createdAt}</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">System Presets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {PRESET_TEMPLATES.map(tpl => (
                  <div key={tpl.id} className="group relative">
                     <div className="relative bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all" onClick={() => { setTemplate({...tpl}); setActiveTab('designer'); }}>
                        <CardPreview customTemplate={tpl} size="sm" />
                        <div className="text-center w-full pb-4">
                           <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{tpl.templateName}</h4>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </section>
         </div>
       )}

       {/* --- TAB: GENERATOR --- */}
       {activeTab === 'generator' && (
         <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 space-y-10 animate-slideUp">
            <div className="text-center space-y-2">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Bulk Voucher Generator</h3>
               <p className="text-slate-500 text-sm font-medium">অটোমেটিক ১০-ডিজিট কোড জেনারেশন টুল</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">প্যাকেজ নির্বাচন করুন</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:border-blue-500" 
                    value={selectedPackageId} 
                    onChange={e => setSelectedPackageId(e.target.value)}
                  >
                     {packages.map(p => <option key={p.id} value={p.id}>{p.name} - {symbol}{p.price}</option>)}
                  </select>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">পরিমাণ (Quantity)</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:border-blue-500" value={genCount} onChange={e => setGenCount(Number(e.target.value))} min="1" max="500" />
               </div>
            </div>

            <button 
              onClick={handleGenerate} 
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all"
            >
               Generate {genCount} Vouchers (10-Digit Code) ⚡
            </button>
         </div>
       )}

       {/* --- TAB: SEARCH --- */}
       {activeTab === 'search' && (
         <div className="space-y-8 animate-slideUp">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
               <div className="relative w-full md:w-96">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
                  <input 
                    type="text" 
                    placeholder="সিরিয়াল বা কোড দিয়ে খুঁজুন..." 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
               </div>
               <button onClick={() => window.print()} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition">Bulk Print 🖨️</button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                       <tr>
                          <th className="px-8 py-5">Serial No</th>
                          <th className="px-8 py-5">Voucher Code (10 Digits)</th>
                          <th className="px-8 py-5">Plan</th>
                          <th className="px-8 py-5">Amount</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredVouchers.map(v => (
                          <tr key={v.id} className="hover:bg-slate-50/50 transition group">
                             <td className="px-8 py-5 font-mono text-[10px] font-black text-blue-600">{v.serial}</td>
                             <td className="px-8 py-5">
                                <span className="font-mono font-black text-slate-800 tracking-widest bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">{v.code}</span>
                             </td>
                             <td className="px-8 py-5 text-xs font-bold text-slate-600">{v.plan}</td>
                             <td className="px-8 py-5 text-sm font-black text-slate-900">{symbol} {v.price}</td>
                             <td className="px-8 py-5">
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">{v.status}</span>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <button className="text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-blue-600 transition">Print Single</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
         </div>
       )}

       {/* --- PACKAGE MODAL --- */}
       {isPackageModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-slideUp">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                     <span className="w-10 h-10 bg-[#006a4e] text-white rounded-xl flex items-center justify-center text-xl shadow-lg">📦</span>
                     {editingPackage ? 'প্যাকেজ এডিট' : 'নতুন প্যাকেজ তৈরি'}
                  </h3>
                  <button onClick={() => setIsPackageModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-200 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-all text-2xl font-black">×</button>
               </div>
               <form onSubmit={handleSavePackage} className="p-10 space-y-6">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">প্যাকেজ নাম</label>
                     <input required className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-bold text-slate-700" value={pkgFormData.name} onChange={e => setPkgFormData({...pkgFormData, name: e.target.value})} placeholder="যেমন: 1GB Daily" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">দাম ({symbol})</label>
                        <input type="number" required className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-black text-slate-700" value={pkgFormData.price} onChange={e => setPkgFormData({...pkgFormData, price: Number(e.target.value)})} />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">মেয়াদ</label>
                        <select className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none font-black text-slate-800" value={pkgFormData.validity} onChange={e => setPkgFormData({...pkgFormData, validity: e.target.value})}>
                           <option value="1 Hour">1 Hour</option>
                           <option value="1 Day">1 Day</option>
                           <option value="7 Days">7 Days</option>
                           <option value="30 Days">30 Days</option>
                        </select>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ডেটা লিমিট</label>
                     <input required className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#006a4e] font-bold text-slate-700" value={pkgFormData.limit} onChange={e => setPkgFormData({...pkgFormData, limit: e.target.value})} placeholder="যেমন: 500MB বা Unlimited" />
                  </div>
                  <div className="pt-6 flex gap-4">
                     <button type="button" onClick={() => setIsPackageModalOpen(false)} className="flex-1 py-5 bg-slate-100 rounded-2xl font-black uppercase text-xs text-slate-500">বাতিল</button>
                     <button type="submit" className="flex-1 py-5 bg-[#006a4e] text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">সেভ করুন</button>
                  </div>
               </form>
            </div>
         </div>
       )}
    </div>
  );
};

export default VoucherDesigner;
