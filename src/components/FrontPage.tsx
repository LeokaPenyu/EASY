import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, User, Shield, ArrowRight, BookOpen } from 'lucide-react';

interface FrontPageProps {
  onSelectRole: (role: 'coordinator' | 'candidate') => void;
}

export const FrontPage: React.FC<FrontPageProps> = ({ onSelectRole }) => {
  const [loginType, setLoginType] = useState<'candidate' | 'coordinator'>('candidate');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectRole(loginType);
  };

  return (
    <div className="min-h-screen bg-surface-cream flex flex-col md:flex-row selection:bg-red-100">
      
      {/* Left Panel - Branding */}
      <div 
        className="hidden md:flex md:w-5/12 lg:w-1/2 border-r border-red-800 flex-col justify-between p-4 md:p-6 xl:p-10 relative overflow-hidden shadow-2xl z-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1584697964190-73812548770a?q=80&w=1920&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Background Dark/Red Overlay for text readability */}
        <div className="absolute inset-0 bg-brand-red/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-red-900/40 to-transparent"></div>
        
        {/* Decorative Pattern Pattern over the image */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <BookOpen className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-xl">
            <Shield className="w-6 h-6 text-brand-red" />
          </div>
          
          <AnimatePresence mode="wait">
            {loginType === 'coordinator' ? (
              <motion.div
                key="coordinator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                  <span className="notranslate" translate="no">EASY</span> <br />
                  <span className="text-red-200 text-lg lg:text-xl xl:text-2xl font-bold tracking-normal block mt-1">
                    Examination <br /> 
                    Administration <br /> 
                    System
                  </span>
                </h1>
                <p className="text-red-100/80 font-medium text-sm xl:text-base max-w-sm mt-4 leading-relaxed">
                  Sistem pengurusan peperiksaan rasmi Bulan Sabit Merah Malaysia, Cawangan Sarawak.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="candidate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                  Portal Calon <br />
                  <span className="text-red-200 text-lg lg:text-xl xl:text-2xl font-bold tracking-normal block mt-1">
                    Bulan Sabit <br /> 
                    Merah <br /> 
                    Malaysia
                  </span>
                </h1>
                <p className="text-red-100/80 font-medium text-sm xl:text-base max-w-sm mt-4 leading-relaxed">
                  Semak jadual peperiksaan, duduki peperiksaan, dan muat turun sijil digital anda.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <div className="text-[9px] sm:text-[10px] font-bold text-red-200/60 tracking-widest uppercase">
            TERTAKLUK KEPADA AKTA RAHSIA RASMI 1972 <br /> KERAJAAN SARAWAK
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-7/12 lg:w-1/2 bg-surface-cream flex items-center justify-center p-4 md:p-6 md:p-8 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-100/30 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[300px] flex flex-col items-center relative z-10"
        >
          
          {/* Logo */}
          <div className="w-28 h-28 bg-transparent flex items-center justify-center mb-5 relative">
            <img 
              src="https://api.mrcscommunity.org.my/uploads/event/20241025-5d0jbb-mrcs-logo-roundel.png" 
              alt="MRCS Logo" 
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                // Fallback if the URL breaks
                (e.target as HTMLImageElement).src = 'https://mrcscommunity.org.my/images/logo.svg';
              }} 
            />
          </div>
          
          <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Red Crescent</h2>

          {/* Toggle Tabs */}
          <div className="w-full relative flex bg-gray-200/60 p-1.5 rounded-lg mb-8 shadow-inner">
            <button 
              type="button"
              onClick={() => setLoginType('candidate')} 
              className={`flex-1 py-2 text-xs sm:text-sm font-bold z-10 transition-colors flex items-center justify-center gap-2 ${loginType === 'candidate' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User className="w-4 h-4" /> Calon Awam
            </button>
            <button 
              type="button"
              onClick={() => setLoginType('coordinator')} 
              className={`flex-1 py-2 text-xs sm:text-sm font-bold z-10 transition-colors flex items-center justify-center gap-2 ${loginType === 'coordinator' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Building2 className="w-4 h-4" /> Pentadbir
            </button>
            
            {/* Animated Tab Background */}
            <div className="absolute inset-0 p-1.5 pointer-events-none">
              <motion.div 
                className="w-1/2 h-full bg-white rounded-md shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]"
                animate={{ x: loginType === 'candidate' ? '0%' : '100%' }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            </div>
          </div>

          {/* Form */}
          <form className="w-full space-y-3" onSubmit={handleLogin}>
            <AnimatePresence mode="wait">
              <motion.div
                key={loginType}
                initial={{ opacity: 0, x: loginType === 'candidate' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: loginType === 'candidate' ? 10 : -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={loginType === 'candidate' ? "ID SarawakID / No K/P" : "ID Pentadbir"} 
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata Laluan" 
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                </div>

                <div className="flex justify-end">
                  <a href="#" className="flex items-center text-[11px] font-bold text-gray-500 hover:text-red-700 transition-colors">
                    Lupa Kata Laluan?
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-2 flex flex-col gap-2.5">
              <motion.button 
                whileHover={{ scale: 1.01, translateY: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red-deep text-white font-bold py-2.5 px-4 rounded-[6px] transition-all shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-2 group"
              >
                Log Masuk {loginType === 'candidate' ? 'SarawakID' : 'Sistem'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              {loginType === 'candidate' && (
                <button type="button" className="w-full bg-white border border-gray-200 text-charcoal font-bold py-2 px-4 rounded-[6px] hover:bg-gray-50 transition-colors text-sm shadow-sm">
                  Daftar Akaun Baru
                </button>
              )}
            </div>
          </form>

        </motion.div>
      </div>
    </div>
  );
};
