
import React, { useState } from 'react';
import { CompanySettings, Language } from '../types';

interface Props {
  company: CompanySettings;
  setCompany: React.Dispatch<React.SetStateAction<CompanySettings>>;
}

const Settings: React.FC<Props> = ({ company, setCompany }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'login' | 'hotspot'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const lang = company.language;

  const updateCompany = (updates: Partial<CompanySettings>) => {
    setCompany(prev => ({ ...prev, ...updates }));
  };

  const updateLoginGraphics = (updates: Partial<typeof company.loginConfig>) => {
    setCompany(prev => ({ ...prev, loginConfig: { ...prev.loginConfig, ...updates } }));
  };

  const updateHotspotGraphics = (updates: Partial<typeof company.hotspotConfig>) => {
    setCompany(prev => ({ ...prev, hotspotConfig: { ...prev.hotspotConfig, ...updates } }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(lang === 'bn' ? 'সেটিংস সফলভাবে সেভ হয়েছে!' : 'Settings saved successfully!');
    }, 800);
  };

  const logoTypes = [
    { key: 'menuLogo', label: 'Sidebar Menu Logo', desc: 'সাইডবারে ছোট লোগো' },
    { key: 'loginLogo', label: 'Admin Login Logo', desc: 'লগইন পেজের বড় লোগো' },
    { key: 'voucherLogo', label: 'Voucher Print Logo', desc: 'ভাউচার কার্ডের লোগো' },
    { key: 'hotspotLogo', label: 'Hotspot Login Logo', desc: 'হটস্পট পেজের লোগো' },
    { key: 'profilePic', label: 'Admin Profile Picture', desc: 'অ্যাডমিন প্রোফাইল ছবি' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fadeIn pb-32">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">সিস্টেম ডিজাইন স্টুডিও</h2>
           <p className="text-slate-500 text-sm font-medium">আইডেন্টিটি, লোগো এবং ইন্টারফেস কন্ট্রোল প্যানেল</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-xl overflow-x-auto">
           <button onClick={() => setActiveTab('general')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'general' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>⚙️ General</button>
           <button onClick={() => setActiveTab('login')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'login' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>🖥️ Admin UI</button>
           <button onClick={() => setActiveTab('hotspot')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'hotspot' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>📶 Hotspot UI</button>
        </div>
      </header>

      {/* --- TAB 1: GENERAL (Identity, Logos, Localization) --- */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp">
           <div className="lg:col-span-2 space-y-8">
              {/* Identity & Localization */}
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-10">
                 <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> সিস্টেম আইডেন্টিটি ও ভাষা
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">কোম্পানির নাম</label>
                       <input className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none focus:bg-white focus:border-blue-500" value={company.name} onChange={e => updateCompany({ name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">সিস্টেম ভাষা (System Language)</label>
                       <select className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none focus:bg-white focus:border-blue-500" value={company.language} onChange={e => updateCompany({ language: e.target.value as Language })}>
                          <option value="bn">Bengali (বাংলা)</option>
                          <option value="en">English (ইংরেজি)</option>
                          <option value="hi">Hindi (हिन्दी)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">কারেন্সি সিম্বল</label>
                       <input className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-6 py-4 font-black text-slate-700 outline-none focus:bg-white focus:border-blue-500 text-center text-xl" value={company.currencySymbol} onChange={e => updateCompany({ currencySymbol: e.target.value })} />
                    </div>
                 </div>
              </div>

              {/* Logo Management Table */}
              <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                 <div className="p-10 pb-6 border-b border-slate-50">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-600"></span> লোগো ম্যানেজমেন্ট টেবিল
                    </h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b">
                          <tr>
                             <th className="px-10 py-5">Preview</th>
                             <th className="px-10 py-5">Logo Type & Purpose</th>
                             <th className="px-10 py-5">Source URL</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {logoTypes.map((logo) => (
                             <tr key={logo.key} className="hover:bg-slate-50/50 transition">
                                <td className="px-10 py-6">
                                   <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl p-2 flex items-center justify-center shadow-sm">
                                      <img src={(company as any)[logo.key]} className="max-w-full max-h-full object-contain" alt="Logo" />
                                   </div>
                                </td>
                                <td className="px-10 py-6">
                                   <p className="font-black text-slate-800 text-xs">{logo.label}</p>
                                   <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{logo.desc}</p>
                                </td>
                                <td className="px-10 py-6">
                                   <input 
                                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-mono outline-none focus:bg-white focus:border-blue-400" 
                                     value={(company as any)[logo.key]} 
                                     onChange={e => updateCompany({ [logo.key]: e.target.value })}
                                     placeholder="https://..."
                                   />
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl font-black italic">ID</span></div>
                 <h4 className="text-lg font-black uppercase tracking-tight relative z-10">ব্র্যান্ড সেটিংস</h4>
                 <p className="mt-4 text-[10px] font-bold text-white/50 leading-relaxed relative z-10">আপনার প্রতিষ্ঠানের লোগো এবং ব্র্যান্ডিং কালার এখান থেকেই মেইনটেইন করুন। লোগোগুলো অবশ্যই সরাসরি ছবির লিঙ্কে হতে হবে (যেমন: .png বা .jpg)।</p>
                 <ul className="mt-6 space-y-3 text-[10px] font-bold text-emerald-400 relative z-10">
                    <li>✓ সকল লোগো ট্রান্সপারেন্ট ব্যবহার করুন</li>
                    <li>✓ মিনিমাম রেজোলিউশন ৫১২x৫১২ পিক্সেল</li>
                    <li>✓ প্রোফাইল ছবি স্কয়ার ফরম্যাট হতে হবে</li>
                 </ul>
                 <button onClick={handleSave} disabled={isSaving} className="w-full mt-10 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition shadow-xl active:scale-95 flex items-center justify-center gap-3">
                    {isSaving ? 'Saving...' : 'Save All Identity Changes'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- TAB 2 & 3: UI Design Studio (Login/Hotspot) --- */}
      {(activeTab === 'login' || activeTab === 'hotspot') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp">
           <div className="lg:col-span-2 space-y-8">
              {/* Background Studio */}
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
                 <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> {activeTab === 'login' ? 'Admin Login' : 'Hotspot Login'} ব্যাকগ্রাউন্ড
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ব্যাকগ্রাউন্ড টাইপ</label>
                       <div className="flex bg-slate-50 p-1 rounded-xl border-2 border-slate-100">
                          {(['solid', 'gradient', 'image'] as const).map(type => (
                             <button key={type} onClick={() => (activeTab === 'login' ? updateLoginGraphics({ bgType: type }) : updateHotspotGraphics({ bgType: type }))} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${(activeTab === 'login' ? company.loginConfig.bgType : company.hotspotConfig.bgType) === type ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>{type}</button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">কালার / গ্রাডিয়েন্ট</label>
                       {(activeTab === 'login' ? company.loginConfig.bgType : company.hotspotConfig.bgType) === 'solid' ? (
                          <input type="color" className="w-full h-11 rounded-xl cursor-pointer" value={activeTab === 'login' ? company.loginConfig.bgColor : company.hotspotConfig.bgColor} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ bgColor: e.target.value }) : updateHotspotGraphics({ bgColor: e.target.value }))} />
                       ) : (activeTab === 'login' ? company.loginConfig.bgType : company.hotspotConfig.bgType) === 'gradient' ? (
                          <input className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 font-mono text-[10px] focus:bg-white outline-none" value={activeTab === 'login' ? company.loginConfig.bgGradient : company.hotspotConfig.bgGradient} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ bgGradient: e.target.value }) : updateHotspotGraphics({ bgGradient: e.target.value }))} placeholder="linear-gradient(...)" />
                       ) : (
                          <input className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 font-mono text-[10px] focus:bg-white outline-none" value={activeTab === 'login' ? company.loginConfig.bgImage : company.hotspotConfig.bgImage} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ bgImage: e.target.value }) : updateHotspotGraphics({ bgImage: e.target.value }))} placeholder="Image URL..." />
                       )}
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ওভারলে প্যাটার্ন</label>
                       <select className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 font-black text-[10px] uppercase" value={activeTab === 'login' ? company.loginConfig.overlayPattern : company.hotspotConfig.overlayPattern} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ overlayPattern: e.target.value as any }) : updateHotspotGraphics({ overlayPattern: e.target.value as any }))}>
                          <option value="none">None</option>
                          <option value="dots">Dots</option>
                          <option value="mesh">Mesh</option>
                          <option value="circuit">Circuit Board</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Card Studio */}
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
                 <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> কার্ড ও গ্লাস সেটিংস
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>অপাসিটি</span>
                          <span className="text-slate-900">{activeTab === 'login' ? company.loginConfig.cardOpacity : company.hotspotConfig.cardOpacity}%</span>
                       </label>
                       <input type="range" min="10" max="100" className="w-full accent-emerald-500" value={activeTab === 'login' ? company.loginConfig.cardOpacity : company.hotspotConfig.cardOpacity} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ cardOpacity: Number(e.target.value) }) : updateHotspotGraphics({ cardOpacity: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                       <label className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>ব্লার ইফেক্ট</span>
                          <span className="text-slate-900">{activeTab === 'login' ? company.loginConfig.cardBlur : company.hotspotConfig.cardBlur}px</span>
                       </label>
                       <input type="range" min="0" max="40" className="w-full accent-emerald-500" value={activeTab === 'login' ? company.loginConfig.cardBlur : company.hotspotConfig.cardBlur} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ cardBlur: Number(e.target.value) }) : updateHotspotGraphics({ cardBlur: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                       <label className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>বর্ডার রেডিয়াস</span>
                          <span className="text-slate-900">{activeTab === 'login' ? company.loginConfig.cardRadius : company.hotspotConfig.cardRadius}px</span>
                       </label>
                       <input type="range" min="0" max="60" className="w-full accent-emerald-500" value={activeTab === 'login' ? company.loginConfig.cardRadius : company.hotspotConfig.cardRadius} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ cardRadius: Number(e.target.value) }) : updateHotspotGraphics({ cardRadius: Number(e.target.value) }))} />
                    </div>
                 </div>
              </div>

              {/* Colors Studio */}
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
                 <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span> কালার প্যালেট
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">প্রাইমারি কালার</label>
                       <input type="color" className="w-full h-11 rounded-xl cursor-pointer" value={activeTab === 'login' ? company.loginConfig.primaryColor : company.hotspotConfig.primaryColor} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ primaryColor: e.target.value }) : updateHotspotGraphics({ primaryColor: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">হেডার টেক্সট</label>
                       <input type="color" className="w-full h-11 rounded-xl cursor-pointer" value={activeTab === 'login' ? company.loginConfig.headerTextColor : company.hotspotConfig.headerTextColor} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ headerTextColor: e.target.value }) : updateHotspotGraphics({ headerTextColor: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">বডি টেক্সট</label>
                       <input type="color" className="w-full h-11 rounded-xl cursor-pointer" value={activeTab === 'login' ? company.loginConfig.bodyTextColor : company.hotspotConfig.bodyTextColor} onChange={e => (activeTab === 'login' ? updateLoginGraphics({ bodyTextColor: e.target.value }) : updateHotspotGraphics({ bodyTextColor: e.target.value }))} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl font-black italic">GFX</span></div>
                 <h4 className="text-lg font-black uppercase tracking-tight relative z-10">ডিজাইন গাইডলাইন</h4>
                 <ul className="mt-6 space-y-4 text-[10px] font-bold text-white/60 relative z-10">
                    <li className="flex items-start gap-2"><span>✨</span> হাই-কোয়ালিটি ব্যাকগ্রাউন্ড ইমেজ ব্যবহার করুন (1920x1080)।</li>
                    <li className="flex items-start gap-2"><span>🔮</span> গ্লাস ইফেক্টের জন্য অপাসিটি ৮০-৯০% এবং ব্লার ১০-১৫px রাখা ভালো।</li>
                    <li className="flex items-start gap-2"><span>🎨</span> ব্যাকগ্রাউন্ড কালারের সাথে টেক্সট কালারের কন্ট্রাস্ট ঠিক রাখুন।</li>
                 </ul>
                 <button onClick={handleSave} className="w-full mt-10 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition shadow-xl active:scale-95">Save {activeTab.toUpperCase()} UI Style</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
