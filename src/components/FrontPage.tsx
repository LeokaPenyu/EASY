import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, User, Shield, BookOpen } from 'lucide-react';

interface FrontPageProps {
  onSelectRole: (role: 'coordinator' | 'candidate') => void;
}

export const FrontPage: React.FC<FrontPageProps> = ({ onSelectRole }) => {
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                <span className="notranslate" translate="no">EASY</span> <br />
                <span className="text-red-200 text-lg lg:text-xl xl:text-2xl font-bold tracking-normal block mt-1">
                  Examination <br /> 
                  System
                </span>
              </h1>
              <p className="text-red-100/80 font-medium text-sm xl:text-base max-w-sm mt-4 leading-relaxed">
                Sistem pengurusan peperiksaan rasmi Bulan Sabit Merah Malaysia, Cawangan Sarawak.
              </p>
            </motion.div>
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
          <div className="w-28 h-28 bg-transparent flex items-center justify-center mb-8 relative">
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
          
          <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight text-center">Red Crescent</h2>

          <div className="w-full space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole('candidate')}
              className="w-full bg-white border border-brand-red text-brand-red hover:bg-red-50 font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-sm sm:text-base flex items-center justify-center gap-3"
            >
              <User className="w-5 h-5" /> Calon / Umum
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole('coordinator')}
              className="w-full bg-brand-red hover:bg-brand-red-deep text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-sm sm:text-base flex items-center justify-center gap-3"
            >
              <Building2 className="w-5 h-5" /> Pentadbir
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
