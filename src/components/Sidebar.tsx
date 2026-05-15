import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  UserSquare2, 
  BookOpen, 
  ChevronDown,
  Plus,
  X,
  Settings
} from 'lucide-react';
import { ViewType, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose, role }) => {
  const [examOpen, setExamOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { t } = useLanguage();

  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'Calon', icon: Users, label: t('candidates') },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`w-72 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-brand-red">
          <div>
            <h2 className="text-white font-black text-2xl tracking-tighter leading-none">EASY</h2>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

      <nav className="flex-1 px-5 py-8 space-y-2 overflow-y-auto custom-scrollbar bg-gray-50/20">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewType)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-[6px] text-sm font-bold transition-all relative group ${
              activeView === item.id 
              ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
              : 'text-charcoal/80 hover:bg-gray-50'
            }`}
          >
            {activeView === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-brand-red rounded-r-full" />
            )}
            <item.icon className={`w-5 h-5 transition-colors ${activeView === item.id ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
            {item.label}
          </button>
        ))}

        <div className="space-y-1 pt-1">
          <button
            onClick={() => setExamOpen(!examOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-[6px] text-sm font-bold transition-all ${
              examOpen ? 'text-charcoal' : 'text-charcoal/80'
            } hover:bg-gray-50 group`}
          >
            <div className="flex items-center gap-4">
              <ClipboardList className={`w-5 h-5 transition-colors ${examOpen ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
              <span>{t('exam')}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${examOpen ? 'rotate-180' : ''}`} />
          </button>

          {examOpen && (
            <div className="pl-12 space-y-1">
              <button
                onClick={() => setActiveView('ExamProfile')}
                className={`w-full text-left px-4 py-2.5 rounded-[6px] text-sm font-medium transition-all ${
                  activeView === 'ExamProfile' 
                  ? 'text-brand-red font-bold bg-brand-red/5' 
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                }`}
              >
                {t('profile')}
              </button>
              <button
                onClick={() => setActiveView('ExamSchedule')}
                className={`w-full text-left px-4 py-2.5 rounded-[6px] text-sm font-medium transition-all ${
                  activeView === 'ExamSchedule' 
                  ? 'text-brand-red font-bold bg-brand-red/5' 
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                }`}
              >
                {t('schedule')}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setActiveView('Jurulatih')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-[6px] text-sm font-bold transition-all relative group ${
            activeView === 'Jurulatih' 
            ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
            : 'text-charcoal/80 hover:bg-gray-50'
          }`}
        >
          {activeView === 'Jurulatih' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-brand-red rounded-r-full" />
          )}
          <UserSquare2 className={`w-5 h-5 transition-colors ${activeView === 'Jurulatih' ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
          {t('trainer')}
        </button>

        <button
          onClick={() => setActiveView('Panduan')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-[6px] text-sm font-bold transition-all relative group ${
            activeView === 'Panduan' 
            ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
            : 'text-charcoal/80 hover:bg-gray-50'
          }`}
        >
          {activeView === 'Panduan' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-brand-red rounded-r-full" />
          )}
          <BookOpen className={`w-5 h-5 transition-colors ${activeView === 'Panduan' ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
          {t('guide')}
        </button>

        <div className="space-y-1 pt-1">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-[6px] text-sm font-bold transition-all ${
              settingsOpen ? 'text-charcoal' : 'text-charcoal/80'
            } hover:bg-gray-50 group`}
          >
            <div className="flex items-center gap-4">
              <Settings className={`w-5 h-5 transition-colors ${settingsOpen ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
              <span>Tetapan</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${settingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {settingsOpen && (
            <div className="pl-12 space-y-1">
              {['Profil Daerah', 'Profil Subjek', 'Peranan Pengguna', 'Profil Pengguna', 'Tetapan Am', 'Susun Atur Sijil'].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Profil Daerah') setActiveView('ProfilDaerah');
                    if (item === 'Profil Subjek') setActiveView('ProfilSubjek');
                    if (item === 'Profil Pengguna') setActiveView('ProfilPengguna');
                    if (item === 'Peranan Pengguna') setActiveView('PerananPengguna');
                    if (item === 'Tetapan Am') setActiveView('TetapanAm');
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-[6px] text-sm font-medium transition-all ${
                    (activeView === 'ProfilDaerah' && item === 'Profil Daerah') ||
                    (activeView === 'ProfilSubjek' && item === 'Profil Subjek') ||
                    (activeView === 'ProfilPengguna' && item === 'Profil Pengguna') ||
                    (activeView === 'PerananPengguna' && item === 'Peranan Pengguna') ||
                    (activeView === 'TetapanAm' && item === 'Tetapan Am')
                    ? 'text-charcoal font-bold bg-gray-50' : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
           <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">New Features / Ciri Baharu</h3>
           {[
             { id: 'CertificateRenewal', label: 'Pembaharuan Sijil', badge: 'New' },
             { id: 'AttendanceCertificate', label: 'Sijil Kehadiran', badge: 'New' },
             { id: 'OnlineExam', label: 'Peperiksaan Dalam Talian', badge: 'New' },
             { id: 'Reports', label: 'Laporan & Statistik', badge: 'New' },
             { id: 'QuestionBank', label: 'Bank Soalan', badge: 'New' },
             { id: 'Retest', label: 'Ujian Semula (Retest)', badge: 'New' }
           ].map((mod) => (
             <button
               key={mod.id}
               onClick={() => setActiveView(mod.id as ViewType)}
               className={`w-full flex items-center justify-between px-4 py-3 rounded-[6px] text-sm font-bold transition-all relative group ${
                 activeView === mod.id 
                 ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
                 : 'text-charcoal/80 hover:bg-gray-50'
               }`}
             >
               {activeView === mod.id && (
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-brand-red rounded-r-full" />
               )}
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                 {mod.label}
               </div>
               <span className="text-[9px] uppercase bg-brand-red text-white px-2 py-0.5 rounded-full">{mod.badge}</span>
             </button>
           ))}
        </div>
      </nav>

      {(role === UserRole.DEC || role === UserRole.SEC) && (
        <div className="p-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={() => setActiveView('ExamApplication')}
            className="w-full btn-primary justify-center text-sm"
          >
            <Plus className="w-4 h-4" />
            {t('examApplication')}
          </button>
        </div>
      )}
    </div>
    </>
  );
};
