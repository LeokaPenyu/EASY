import React, { useState, useEffect } from 'react';
import { UserRole, Language } from '../types';
import { Bell, Menu, LogOut, Info, LockKeyhole } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, setRole, onMenuClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold bg-gradient-to-r from-brand-red to-red-800 bg-clip-text text-transparent">Exam Administration System (EASY)</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setLanguage(Language.BM)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              language === Language.BM 
              ? 'bg-white shadow-sm text-brand-red' 
              : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            BM
          </button>
          <button 
            onClick={() => setLanguage(Language.EN)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              language === Language.EN 
              ? 'bg-white shadow-sm text-brand-red' 
              : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            EN
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 lg:pr-6 border-r border-gray-200">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role Swapper:</span>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="text-sm font-medium bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none cursor-pointer"
          >
            <option value={UserRole.DEC}>DEC (District)</option>
            <option value={UserRole.SEC}>SEC (State)</option>
            <option value={UserRole.SEBC}>SEBC (Chairman)</option>
          </select>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotification(!showNotification)}
            className="relative text-gray-500 hover:text-brand-red transition-colors p-1 flex items-center justify-center"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white"></span>
          </button>

          <AnimatePresence>
            {showNotification && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 origin-top-right"
              >
                <div className="bg-brand-red px-4 py-3 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Notifikasi Sistem</h3>
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Baru !</span>
                </div>
                <div className="p-2">
                  <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg flex gap-3 cursor-pointer border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <LockKeyhole className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">Tindakan: Buka Kunci Laporan</p>
                      <p className="text-xs text-gray-500 mt-1">Laporan peperiksaan daerah Kuching melebihi 7 hari. Sila mohon "Buka Kunci" untuk menyunting.</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">Beberapa saat yang lalu</p>
                    </div>
                  </div>
                  
                  <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg flex gap-3 cursor-pointer">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Info className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">Kemas Kini Sistem</p>
                      <p className="text-xs text-gray-500 mt-1">Modul Bank Soalan telah dikemas kini. Pengguna kini boleh muat naik soalan secara pukal.</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">1 jam yang lalu</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 ml-2">
          <button className="text-sm font-bold text-gray-500 hover:text-brand-red transition-colors flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Log Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
