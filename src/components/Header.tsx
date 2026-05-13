import React from 'react';
import { UserRole, Language } from '../types';
import { Bell, Menu, UserCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, setRole, onMenuClick }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-red to-red-800 bg-clip-text text-transparent">EASY</h1>
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

        <button className="relative text-gray-500 hover:text-brand-red transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-charcoal">Ahmad bin Razak</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">{role}</p>
          </div>
          <UserCircle2 className="w-8 h-8 text-brand-red" />
        </div>
      </div>
    </header>
  );
};
