
import React, { useRef, useState } from 'react';
import { CompanySettings, HotspotDesignConfig } from '../types';

interface Props {
  company: CompanySettings;
}

const HOTSPOT_TEMPLATES: { name: string; config: Partial<HotspotDesignConfig> }[] = [
  {
    name: 'Royal Blue Glass',
    config: {
      bgType: 'gradient',
      bgGradient: 'linear-gradient(135deg, #1e3a8a, #000000)',
      overlayPattern: 'mesh',
      cardOpacity: 30,
      cardBlur: 15,
      cardRadius: 30,
      primaryColor: '#3b82f6',
      headerTextColor: '#ffffff',
      bodyTextColor: '#cbd5e1'
    }
  },
  {
    name: 'Eco Green',
    config: {
      bgType: 'solid',
      bgColor: '#f0fdf4',
      overlayPattern: 'dots',
      cardOpacity: 100,
      cardBlur: 0,
      cardRadius: 20,
      primaryColor: '#006a4e',
      headerTextColor: '#064e3b',
      bodyTextColor: '#374151'
    }
  },
  {
    name: 'Dark Circuit',
    config: {
      bgType: 'solid',
      bgColor: '#0f172a',
      overlayPattern: 'circuit',
      cardOpacity: 85,
      cardBlur: 5,
      cardRadius: 10,
      primaryColor: '#f42a41',
      headerTextColor: '#ffffff',
      bodyTextColor: '#94a3b8'
    }
  },
  {
    name: 'Sunset Image',
    config: {
      bgType: 'image',
      bgImage: 'https://images.unsplash.com/photo-1470252649358-969e7c729499',
      overlayPattern: 'none',
      cardOpacity: 50,
      cardBlur: 10,
      cardRadius: 40,
      primaryColor: '#f59e0b',
      headerTextColor: '#ffffff',
      bodyTextColor: '#ffffff'
    }
  }
];

const HotspotLoginPreview: React.FC<Props> = ({ company }) => {
  const [config, setConfig] = useState<HotspotDesignConfig>(company.hotspotConfig);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lang = company.language;

  const updateConfig = (updates: Partial<HotspotDesignConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const applyTemplate = (tpl: Partial<HotspotDesignConfig>) => {
    setConfig(prev => ({ ...prev, ...tpl }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        updateConfig({ bgType: 'image', bgImage: re.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getBackgroundStyle = () => {
    if (config.bgType === 'solid') return { backgroundColor: config.bgColor };
    if (config.bgType === 'gradient') return { background: config.bgGradient };
    if (config.bgType === 'image') return { backgroundImage: `url(${config.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return { backgroundColor: '#f8fafc' };
  };

  const getPatternOverlay = () => {
    if (config.overlayPattern === 'dots') return 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)';
    if (config.overlayPattern === 'mesh') return 'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%)';
    if (config.overlayPattern === 'circuit') return 'url("https://www.transparenttextures.com/patterns/circuit-board.png")';
    return 'none';
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">হটস্পট ডিজাইন স্টুডিও</h2>
          <p className="text-slate-500 text-sm font-medium">লাইভ গ্রাফিক্স কাস্টমাইজেশন ও টেমপ্লেট লাইব্রেরি</p>
        </div>
        <button onClick={() => alert('ডিজাইন সফলভাবে সেভ হয়েছে!')} className="bg-[#006a4e] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-green-800 transition active:scale-95">Save Design</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Controls Panel */}
        <div className="space-y-8">
          {/* Templates Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> টেমপ্লেট গ্যালারি
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {HOTSPOT_TEMPLATES.map((tpl, i) => (
                <button 
                  key={i} 
                  onClick={() => applyTemplate(tpl.config)}
                  className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-[10px] font-black uppercase text-slate-600 text-left"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Background Controls */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ব্যাকগ্রাউন্ড ও ইমেজ
            </h3>
            
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {(['solid', 'gradient', 'image'] as const).map(type => (
                <button 
                  key={type} 
                  onClick={() => updateConfig({ bgType: type })} 
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${config.bgType === type ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  {type}
                </button>
              ))}
            </div>

            {config.bgType === 'image' && (
              <div className="space-y-3">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors group overflow-hidden"
                 >
                    {config.bgImage ? (
                      <img src={config.bgImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <>
                        <span className="text-2xl mb-1">🖼️</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">Click to Upload</span>
                      </>
                    )}
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            )}

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ওভারলে প্যাটার্ন</label>
               <select 
                 className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 font-black text-[10px] uppercase outline-none" 
                 value={config.overlayPattern} 
                 onChange={e => updateConfig({ overlayPattern: e.target.value as any })}
               >
                  <option value="none">None</option>
                  <option value="dots">Dots Pattern</option>
                  <option value="mesh">Mesh Mesh</option>
                  <option value="circuit">Circuit Board</option>
               </select>
            </div>
          </div>

          {/* Card Style */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> কার্ড কাস্টমাইজেশন
            </h3>
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>কার্ড অপাসিটি</span>
                    <span className="text-slate-900">{config.cardOpacity}%</span>
                  </label>
                  <input type="range" min="10" max="100" className="w-full accent-slate-900" value={config.cardOpacity} onChange={e => updateConfig({ cardOpacity: Number(e.target.value) })} />
               </div>
               <div className="space-y-2">
                  <label className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>ব্লার ইফেক্ট (Glass)</span>
                    <span className="text-slate-900">{config.cardBlur}px</span>
                  </label>
                  <input type="range" min="0" max="40" className="w-full accent-slate-900" value={config.cardBlur} onChange={e => updateConfig({ cardBlur: Number(e.target.value) })} />
               </div>
            </div>
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="lg:col-span-2 flex justify-center sticky top-24 h-fit">
          <div className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-800 shadow-2xl overflow-hidden ring-8 ring-slate-800/10">
            {/* Mockup Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-black/20 backdrop-blur-sm flex justify-between px-8 items-center z-30">
              <span className="text-[9px] text-white font-black">12:30</span>
              <div className="flex gap-1.5 items-center">
                 <span className="text-[9px] text-white">📶</span>
                 <span className="text-[9px] text-white">🛜</span>
                 <span className="text-[9px] text-white">🔋</span>
              </div>
            </div>

            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 transition-all duration-700" style={getBackgroundStyle()}>
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: getPatternOverlay(), backgroundSize: config.overlayPattern === 'dots' ? '20px 20px' : '40px 40px' }} />
            </div>

            {/* Content Container */}
            <div className="h-full w-full pt-24 relative z-10 flex flex-col">
              <div className="flex-1 p-6 flex flex-col items-center justify-center animate-fadeIn">
                <div className="w-full p-8 shadow-2xl relative overflow-hidden flex flex-col items-center" 
                   style={{ 
                      backgroundColor: `rgba(255, 255, 255, ${config.cardOpacity / 100})`, 
                      borderRadius: `${config.cardRadius}px`,
                      backdropFilter: `blur(${config.cardBlur}px)`
                   }}
                >
                  {config.showBranding && (
                    <img 
                      src={company.hotspotLogo} 
                      alt="Logo" 
                      className="w-20 h-20 rounded-2xl shadow-lg mb-6 border-2 border-white object-cover transform hover:scale-110 transition-transform" 
                    />
                  )}
                  <h1 className="font-black text-xl tracking-tight mb-2" style={{ color: config.headerTextColor }}>{company.name}</h1>
                  <div className="w-10 h-1 bg-current opacity-20 rounded-full mb-8" style={{ color: config.primaryColor }}></div>
                  
                  <div className="w-full space-y-6">
                     <p className="text-[12px] font-bold text-center leading-relaxed" style={{ color: config.bodyTextColor }}>
                        {config.welcomeMessage}
                     </p>
                     
                     <div className="space-y-4">
                       <div className="relative">
                          <input 
                            disabled 
                            className="w-full border-2 border-slate-100 bg-white/40 rounded-2xl px-4 py-4 outline-none text-center font-black tracking-[0.3em] text-slate-800 placeholder-slate-400" 
                            placeholder="VOUCHER CODE" 
                          />
                       </div>
                       <button 
                         className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95" 
                         style={{ backgroundColor: config.primaryColor }}
                       >
                         কানেক্ট করুন (Login)
                       </button>
                     </div>
                     
                     <div className="pt-4 flex justify-center gap-4 border-t border-slate-200/20">
                        <button className="text-[9px] font-black uppercase tracking-widest opacity-60" style={{ color: config.bodyTextColor }}>Help</button>
                        <button className="text-[9px] font-black uppercase tracking-widest opacity-60" style={{ color: config.bodyTextColor }}>Pricing</button>
                     </div>
                  </div>
                </div>
                
                <div className="mt-10 text-center px-4 space-y-2">
                   <p className="text-[10px] font-bold drop-shadow-md" style={{ color: config.bgType === 'image' || config.bgType === 'gradient' ? '#fff' : config.bodyTextColor }}>
                      {config.footerText}
                   </p>
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: config.bgType === 'image' || config.bgType === 'gradient' ? '#fff' : config.bodyTextColor }}>
                      Powered by Smart-ISP Pro
                   </p>
                </div>
              </div>
            </div>
            
            {/* Phone Home Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-800/50 rounded-full z-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotspotLoginPreview;
