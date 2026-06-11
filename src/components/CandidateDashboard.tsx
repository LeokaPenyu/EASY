import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  User, 
  Clock, 
  AlertCircle, 
  Award, 
  CheckCircle, 
  Download, 
  Shield, 
  Info, 
  X,
  Wifi,
  Globe,
  Bell,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { calculateCandidateFee } from '../utils/feeCalculator';
import { UserProfileModal, UserProfileData } from './UserProfileModal';

// --- INTERFACES ---
interface UserSession {
  name: string;
  sarawakId: string;
  avatarUrl?: string;
  category: 'Cadet' | 'VAD' | 'Public';
  status: string;
}

interface ExamItem {
  id: string;
  code: string;
  title: string;
  date: string;
  startTime: string; 
  type: 'upcoming' | 'retest' | 'completed';
  retestReason?: string;
  result?: 'Pass' | 'Fail' | 'Absent';
}

// --- MOCK DATA ---
const mockUser: UserSession = {
  name: 'Ahmad Faiz Bin Abu',
  sarawakId: 'ahmad.faiz.88',
  category: 'VAD',
  status: 'Verified'
};

const populatedExams: ExamItem[] = [
  {
    id: 'e1',
    code: '800/2',
    title: 'Pertolongan Cemas Asas dan CPR',
    date: '2026-05-20',
    startTime: '13:30',
    type: 'upcoming'
  },
  {
    id: 'e2',
    code: '800/1',
    title: 'Pendidikan Kesihatan Asas',
    date: '2026-05-18',
    startTime: '09:00',
    type: 'retest',
    retestReason: 'Technical Failure during previous session'
  }
];

const completedExams: ExamItem[] = [
  {
    id: 'e3',
    code: '800/3',
    title: 'Pentadbiran dan Pengurusan BSMM',
    date: '2025-09-10',
    startTime: '10:00',
    type: 'completed',
    result: 'Pass'
  }
];

const mockNotifications = [
  { id: 'n1', type: 'info', message: 'Exam tomorrow: Pertolongan Cemas Asas — 13:30', time: '2h ago', read: false },
  { id: 'n2', type: 'warning', message: 'Certificate 800/3 expires in 45 days — Renew now', time: '1d ago', read: false },
  { id: 'n3', type: 'success', message: 'Your application for 800/2 was approved', time: '2d ago', read: true }
];

import { CandidateExamRoom } from './CandidateExamRoom';

interface CandidateDashboardProps {
  onLogout: () => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ onLogout }) => {
  // States
  const [isPopulated, setIsPopulated] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { t, language, setLanguage, translateContent } = useLanguage();
  const [takingExamId, setTakingExamId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [userProfileData, setUserProfileData] = useState<UserProfileData>({
    name: mockUser.name,
    email: 'ahmad.faiz@example.com',
    bio: 'Candidate Member - ' + mockUser.category,
    avatarUrl: mockUser.avatarUrl || null
  });
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDownloadCert = (certName: string) => {
    const text = `Certificate of Completion\n\nThis is to certify that you have passed the ${certName} examination.\n\nMalaysian Red Crescent Society`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${certName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAttendExam = (examId: string) => {
    setConnectingId(examId);
    // Simulate connection validation
    setTimeout(() => {
      setTakingExamId(examId);
      setConnectingId(null);
    }, 1200);
  };

  const exams = isPopulated ? [...populatedExams, ...completedExams] : [];
  const upcomingExams = exams.filter(e => e.type === 'upcoming');
  const retestExams = exams.filter(e => e.type === 'retest');
  const historyExams = exams.filter(e => e.type === 'completed');

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  // Exam Locked Logic
  const getExamStatus = (examDateStr: string, startTimeStr: string) => {
    return { 
      locked: false, 
      message: 'Exam is currently open (Dev Mode)' 
    };
  };

  return (
    <div className="candidate-panel min-h-screen bg-surface-cream font-sans text-charcoal">
      
      {/* --- DEV TOGGLE BAR --- */}
      <div className="bg-charcoal text-white text-xs py-1.5 px-4 flex justify-between items-center z-50 relative">
        <span className="font-mono text-gray-300">DEVELOPER MODE / STATE CONTROLS</span>
        <button 
          onClick={() => setIsPopulated(!isPopulated)}
          className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors font-medium"
        >
          Toggle State: {isPopulated ? 'Populated' : 'Empty'}
        </button>
      </div>

      {/* --- HEADER COMPONENT --- */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm">
        {/* Left Side: Branding */}
        <div className="flex items-center gap-3">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv9nKB44c6cGGVDzbxCl8ctElibJoYsmXGUg&s" 
            alt="MRCS Logo" 
            className="h-8 object-contain"
          />
          <div>
            <h1 className="text-[14px] uppercase tracking-wider text-slate-700 font-bold">MRC Sarawak Branch</h1>
          </div>
        </div>

        {/* Right Side: Tools & Profile */}
        <div className="flex items-center gap-4 lg:gap-6">
          
          {/* Language Toggle */}
          <div className="hidden md:flex bg-slate-100 p-1 rounded-full border border-slate-200 items-center notranslate" translate="no">
            <Globe className="w-4 h-4 text-slate-400 ml-2 mr-1" />
            {['BM', 'EN', 'BC'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as any)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors notranslate ${
                  language === lang 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Notification Center */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-white"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 flex flex-col"
                >
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-charcoal">{translateContent('Notifications')}</h3>
                    <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-slate-400" /></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-slate-50 flex gap-3 ${notif.read ? 'opacity-60' : 'bg-white'}`}>
                        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100`}>
                          {notif.type === 'info' && <Bell className="w-4 h-4 text-action-teal" />}
                          {notif.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                          {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-charcoal mb-1 leading-snug">{translateContent(notif.message)}</p>
                          <span className="text-[10px] font-bold text-slate-400">{notif.time}</span>
                        </div>
                        <button 
                          onClick={() => setNotifications(notifications.filter(n => n.id !== notif.id))}
                          className="shrink-0 text-slate-300 hover:text-brand-red"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )) : (
                      <div className="p-4 md:p-8 text-center text-slate-500 text-sm">{translateContent('No notifications')}</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live Clock */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm font-mono font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
            <Clock className="w-4 h-4 text-brand-red" />
            {formatTime(currentTime)}
          </div>
          
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-charcoal leading-tight">{mockUser.name}</span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Shield className="w-3 h-3 text-brand-red" />
                {mockUser.sarawakId}
              </div>
            </div>
            
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold overflow-hidden ring-1 ring-slate-200 hover:ring-brand-red transition-all cursor-pointer outline-none focus:ring-brand-red"
            >
              {userProfileData.avatarUrl ? (
                <img src={userProfileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </button>
            
            <button 
              onClick={onLogout}
              className="ml-2 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-red transition-colors"
              title="Keluar / Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden lg:block">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {takingExamId ? (
        <CandidateExamRoom 
          examTitle={upcomingExams.find(e => e.id === takingExamId)?.title || "Peperiksaan"} 
          onFinish={() => setTakingExamId(null)} 
        />
      ) : (
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 md:py-8 md:py-10">
        
        {upcomingExams.some(e => {
          const d = new Date(e.date);
          const diffMs = d.getTime() - new Date().getTime();
          return diffMs > 0 && diffMs < 48 * 60 * 60 * 1000;
        }) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex flex-col md:flex-row md:items-start gap-4 lg:max-w-4xl">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-amber-800 font-bold text-sm mb-2">{translateContent("Exam Readiness Checklist (Next 48 Hours)")}</h4>
              <ul className="space-y-2 text-sm text-amber-700/90 font-medium">
                <li className="flex items-center gap-2 text-emerald-600"><CheckCircle className="w-4 h-4"/> {translateContent("Stable internet connection confirmed")}</li>
                <li className="flex items-center gap-2 text-amber-600/70"><div className="w-4 h-4 rounded border-2 border-amber-400 flex items-center justify-center"></div> {translateContent("Identity document ready")}</li>
                <li className="flex items-center gap-2 text-amber-600/70"><div className="w-4 h-4 rounded border-2 border-amber-400 flex items-center justify-center"></div> {translateContent("Exam time confirmed (13:30)")}</li>
                <li className="flex items-center gap-2 text-amber-600/70"><div className="w-4 h-4 rounded border-2 border-amber-400 flex items-center justify-center"></div> {translateContent("Device charged and ready")}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 md:gap-6 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          <button 
            onClick={() => setActiveTab('active')}
            className={`pb-2 text-sm font-bold transition-colors relative whitespace-nowrap ${activeTab === 'active' ? 'text-brand-red' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {translateContent('Active')}
            {activeTab === 'active' && <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-brand-red rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-2 text-sm font-bold transition-colors relative whitespace-nowrap ${activeTab === 'history' ? 'text-brand-red' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {translateContent('History')}
            {activeTab === 'history' && <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-brand-red rounded-t-full"></div>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          
          {/* --- LEFT COLUMN (65% -> col-span-8) --- */}
          <motion.div 
            layout
            className={`${activeTab === 'active' ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-8`}
          >
            <AnimatePresence mode="wait">
            {activeTab === 'active' ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="bg-brand-red/10 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-brand-red" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal tracking-tight">{translateContent("Active Registrations")}</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {translateContent("System Online")}
                </div>
              </div>
              
              {upcomingExams.length > 0 ? (
                <div className="space-y-5">
                  {upcomingExams.map((exam) => {
                    const timeStatus = getExamStatus(exam.date, exam.startTime);
                    const isLocked = timeStatus.locked;
                    
                    return (
                      <motion.div 
                        key={exam.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="exam-container bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:border-slate-300 transition-colors"
                      >
                        <div className="p-4 md:p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 md:gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="exam-code-disp candidate-tooltip group relative px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold font-mono tracking-wide border border-slate-200 cursor-help transition-colors hover:bg-slate-200">
                                {exam.code}
                                <span className="tooltip-text pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-50 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 z-10 font-sans">
                                  Certification ID: {exam.code}
                                  <span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-800"></span>
                                </span>
                              </span>
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100/50">
                                Jadual Rasmi
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-charcoal mb-2 leading-snug group-hover:text-brand-red transition-colors">{exam.title}</h3>
                            <div className="mt-2 mb-4">
                              {(() => {
                                const feeDetails = calculateCandidateFee("unknown", mockUser.category as any, new Date().toISOString().split('T')[0], exam.date);
                                const isLate = feeDetails.isLate;
                                return isLate ? (
                                  <div className="candidate-alert pending-fee inline-flex items-center gap-2 bg-amber-50 md:bg-[#fff9f0] border border-amber-200/60 rounded-md px-3 py-2 text-xs font-bold text-amber-800 shadow-sm">
                                    <AlertCircle className="w-4 h-4 text-amber-500"/> 
                                    {translateContent("Late Application: RM14 (merged with other late applicants)")}
                                  </div>
                                ) : (
                                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> ✓ {translateContent("Standard Fee: RM")}{feeDetails.fee}</span>
                                )
                              })()}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium mt-4">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" /> 
                                {new Date(exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                Strictly Starts at <strong className="text-slate-800">{exam.startTime} Hours</strong>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-start md:items-end justify-center shrink-0">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mb-3 bg-emerald-50 px-2 py-1 rounded">
                              <Wifi className="w-3.5 h-3.5" /> Good Network Latency
                            </div>
                            <span className="text-xs text-slate-400 font-medium text-right max-w-[140px] leading-tight">
                              ID Verification Required Before Entry
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50/50 p-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className={`exam-status-indicator text-sm font-semibold flex items-center gap-2 ${
                            isLocked ? 'text-slate-500' : 'text-emerald-600'
                          }`}>
                            {isLocked ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            {timeStatus.message.includes('(Dev Mode)') ? (
                              <span className="flex items-center gap-2">
                                {timeStatus.message.replace(' (Dev Mode)', '')}
                                <span className="dev-mode-badge px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold rounded-full">
                                  Dev Mode
                                </span>
                              </span>
                            ) : (
                              timeStatus.message
                            )}
                          </div>
                          
                          <button 
                            disabled={isLocked || connectingId === exam.id}
                            onClick={() => handleAttendExam(exam.id)}
                            className={`attend-exam-btn w-full sm:w-auto px-4 md:px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                              isLocked 
                                ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed' 
                                : connectingId === exam.id
                                  ? 'bg-teal-600 text-white cursor-wait opacity-90'
                                  : 'bg-action-teal hover:bg-teal-700 hover:-translate-y-0.5 text-white shadow-md hover:shadow-lg hover:shadow-teal-900/20 active:shadow-sm active:translate-y-0'
                            }`}
                          >
                            {isLocked 
                              ? 'Locked' 
                              : connectingId === exam.id 
                                ? (
                                  <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span>
                                    {translateContent('Loading...')}
                                  </>
                                ) 
                                : translateContent('Attend Exam')}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <CheckCircle className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl text-charcoal font-bold mb-2">No Active Registrations</h3>
                  <p className="text-slate-500 max-w-md mx-auto">You do not have any exams scheduled at the moment. Please contact your coordinator if this is a mistake.</p>
                </div>
              )}
            </section>
            </motion.div>
            ) : activeTab === 'history' ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-charcoal tracking-tight">{translateContent("Application History")}</h2>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-4 md:px-6 py-4">{translateContent('Exam')}</th>
                        <th className="px-4 md:px-6 py-4">{translateContent('Date')}</th>
                        <th className="px-4 md:px-6 py-4">{translateContent('Result')}</th>
                        <th className="px-4 md:px-6 py-4 text-right">{translateContent('Certificate')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {historyExams.length > 0 ? historyExams.map(exam => (
                        <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 md:px-6 py-4">
                            <div className="exam-title font-bold text-charcoal">{exam.title}</div>
                            <div className="candidate-tooltip group relative inline-block font-mono text-[10px] text-slate-400 mt-0.5 cursor-help">
                              {exam.code}
                              <span className="tooltip-text pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 z-10 font-sans">
                                Certification ID: {exam.code}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 font-medium">{new Date(exam.date).toLocaleDateString('en-GB')}</td>
                          <td className="px-4 md:px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                              exam.result === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 
                              exam.result === 'Fail' ? 'bg-brand-red/10 text-brand-red' : 
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {translateContent(exam.result || 'Pending')}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-right">
                            {exam.result === 'Pass' && (
                              <button 
                                onClick={() => handleDownloadCert(exam.title)}
                                className="text-action-teal hover:text-teal-700 font-bold text-xs flex items-center justify-end gap-1.5 ml-auto"
                              >
                                <Download className="w-3.5 h-3.5" />
                                {translateContent('Download')}
                              </button>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-4 md:px-6 py-4 md:py-8 text-center text-slate-500">{translateContent('No history found')}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            </motion.div>
            ) : null}
            </AnimatePresence>
          </motion.div>

          {/* --- RIGHT COLUMN (35% -> col-span-4) --- */}
          <AnimatePresence mode="wait">
          {activeTab === 'active' && (
          <motion.div 
            key="right-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-4 space-y-8"
          >


            {/* Retest Area */}
            {retestExams.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal tracking-tight">{translateContent("Action Required")}</h2>
                </div>
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 md:p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-amber-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    {translateContent("Required Retests")}
                  </h3>
                  <div className="space-y-3">
                  {retestExams.map((exam) => (
                    <div 
                      key={exam.id}
                      className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-black uppercase tracking-widest leading-none">
                          {translateContent('Retest')}
                        </span>
                        <span className="candidate-tooltip group relative text-xs font-bold text-slate-500 cursor-help">
                          {exam.code}
                          <span className="tooltip-text pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 z-10 font-normal font-sans">
                            Certification ID: {exam.code}
                          </span>
                        </span>
                      </div>
                      <h4 className="font-bold text-charcoal text-sm mb-2">{exam.title}</h4>
                      <p className="text-xs text-slate-600 mb-3 flex gap-1.5">
                        <Info className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{translateContent('Reason:')} {exam.retestReason}</span>
                      </p>
                      <button className="w-full py-2 bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-900 rounded-lg text-xs font-bold transition-colors">
                        {translateContent('Review Requirements')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              </section>
            )}
          </motion.div>
          )}
          </AnimatePresence>
        </div>
      </main>
      )}
      
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={userProfileData}
        onSave={(data) => {
          setUserProfileData(data);
          setIsProfileModalOpen(false);
          // show a mock toast or just let it close
        }}
      />
    </div>
  );
};

