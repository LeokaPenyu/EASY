import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  UserSquare2, 
  BookOpen, 
  ChevronDown,
  Plus,
  X,
  Settings,
  Award,
  BarChart,
  UserCircle2,
  Shield // ensure Shield is imported
} from 'lucide-react';
import { ViewType, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UserProfileModal, UserProfileData } from './UserProfileModal';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose, role }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [sijilOpen, setSijilOpen] = useState(false);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Ahmad bin Razak',
    email: 'ahmad.razak@example.com',
    bio: 'Pengurus Peperiksaan Negeri',
    avatarUrl: null
  });

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
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          className="p-5 border-b border-gray-50 flex items-center justify-between bg-brand-red cursor-pointer hover:bg-brand-red-deep transition-colors"
        >
          <div className="flex items-center gap-3">
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            ) : (
              <UserCircle2 className="w-10 h-10 text-white" />
            )}
            <div>
              <p className="text-sm font-bold text-white">{userProfile.name}</p>
              <p className="text-[11px] text-red-100 font-medium uppercase tracking-wider">{role}</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="lg:hidden p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

      <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto custom-scrollbar bg-gray-50/20">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all relative group ${
              activeView === item.id 
              ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
              : 'text-charcoal/80 hover:bg-gray-50'
            }`}
          >
            {activeView === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-brand-red rounded-r-full" />
            )}
            <item.icon className={`w-[18px] h-[18px] transition-colors ${activeView === item.id ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
            {item.label}
          </button>
        ))}

        <div className="space-y-0.5">
          <button
            onClick={() => setExamOpen(!examOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all ${
              examOpen ? 'text-charcoal' : 'text-charcoal/80'
            } hover:bg-gray-50 group`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className={`w-[18px] h-[18px] transition-colors ${examOpen ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
              <span>{t('exam')}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${examOpen ? 'rotate-180' : ''}`} />
          </button>

          {examOpen && (
            <div className="pl-10 space-y-0.5 pb-1">
              <button
                onClick={() => setActiveView('ExamSchedule')}
                className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                  activeView === 'ExamSchedule' 
                  ? 'text-brand-red font-bold bg-gray-50' 
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                }`}
              >
                Jadual Peperiksaan Pusat
              </button>
              <button
                onClick={() => setActiveView('OnlineExam')}
                className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                  activeView === 'OnlineExam' 
                  ? 'text-brand-red font-bold bg-gray-50' 
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                }`}
              >
                Peperiksaan Dalam Talian
              </button>
              <button
                onClick={() => setActiveView('QuestionBank')}
                className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                  activeView === 'QuestionBank' 
                  ? 'text-brand-red font-bold bg-gray-50' 
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                }`}
              >
                Bank Soalan
              </button>
              <button
                onClick={() => setActiveView('Retest')}
                className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                  activeView === 'Retest' 
                  ? 'text-brand-red font-bold bg-gray-50' 
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                }`}
              >
                Ujian Semula
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setActiveView('Jurulatih')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all relative group ${
            activeView === 'Jurulatih' 
            ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
            : 'text-charcoal/80 hover:bg-gray-50'
          }`}
        >
          {activeView === 'Jurulatih' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-brand-red rounded-r-full" />
          )}
          <UserSquare2 className={`w-[18px] h-[18px] transition-colors ${activeView === 'Jurulatih' ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
          {t('trainer')}
        </button>

        {(role === UserRole.DEC || role === UserRole.SEBC) && (
          <div className="space-y-0.5">
            <button
              onClick={() => setSijilOpen(!sijilOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all ${
                sijilOpen ? 'text-charcoal' : 'text-charcoal/80'
              } hover:bg-gray-50 group`}
            >
              <div className="flex items-center gap-3">
                <Award className={`w-[18px] h-[18px] transition-colors ${sijilOpen ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
                <span>Pengurusan Sijil</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${sijilOpen ? 'rotate-180' : ''}`} />
            </button>

            {sijilOpen && (
              <div className="pl-10 space-y-0.5 pb-1">
                <button
                  onClick={() => setActiveView('CertificateRenewal')}
                  className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                    activeView === 'CertificateRenewal' 
                    ? 'text-brand-red font-bold bg-gray-50' 
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                  }`}
                >
                  Pembaharuan Sijil
                </button>
                <button
                  onClick={() => setActiveView('AttendanceCertificate')}
                  className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                    activeView === 'AttendanceCertificate' 
                    ? 'text-brand-red font-bold bg-gray-50' 
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                  }`}
                >
                  Sijil Kehadiran
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-0.5">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all ${
              settingsOpen ? 'text-charcoal' : 'text-charcoal/80'
            } hover:bg-gray-50 group`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-[18px] h-[18px] transition-colors ${settingsOpen ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
              <span>Tetapan</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${settingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {settingsOpen && (
            <div className="pl-10 space-y-0.5 pb-1">
              {['Profil Daerah', 'Profil Subjek', 'Peranan Pengguna', 'Profil Pengguna', 'Tetapan Am'].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Profil Daerah') setActiveView('ProfilDaerah');
                    if (item === 'Profil Subjek') setActiveView('ProfilSubjek');
                    if (item === 'Profil Pengguna') setActiveView('ProfilPengguna');
                    if (item === 'Peranan Pengguna') setActiveView('PerananPengguna');
                    if (item === 'Tetapan Am') setActiveView('TetapanAm');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
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

        <button
          onClick={() => setActiveView('Reports')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all relative group ${
            activeView === 'Reports' 
            ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
            : 'text-charcoal/80 hover:bg-gray-50'
          }`}
        >
          {activeView === 'Reports' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-brand-red rounded-r-full" />
          )}
          <BarChart className={`w-[18px] h-[18px] transition-colors ${activeView === 'Reports' ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
          Laporan & Statistik
        </button>
      </nav>

      {(role === UserRole.DEC || role === UserRole.SEC) && (
        <div className="p-3 border-t border-gray-100 mt-auto">
          <button 
            onClick={() => setActiveView('ExamApplication')}
            className="w-full btn-primary justify-center text-[13px] py-2"
          >
            <Plus className="w-4 h-4" />
            {t('examApplication')}
          </button>
        </div>
      )}
    </div>
    
    <UserProfileModal 
      isOpen={isProfileModalOpen} 
      onClose={() => setIsProfileModalOpen(false)} 
      userData={userProfile} 
      onSave={(data) => setUserProfile(data)} 
    />
    </>
  );
};
