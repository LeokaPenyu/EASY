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
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

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
  type: 'upcoming' | 'retest';
  retestReason?: string;
}

interface CertificateItem {
  id: string;
  code: string;
  title: string;
  dateIssued: string;
  grade: string;
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

const populatedCerts: CertificateItem[] = [
  {
    id: 'c1',
    code: '800/3',
    title: 'Pentadbiran dan Pengurusan BSMM',
    dateIssued: '2025-10-15',
    grade: 'Lulus'
  }
];

import { CandidateExamRoom } from './CandidateExamRoom';

interface CandidateDashboardProps {
  onLogout: () => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ onLogout }) => {
  // States
  const [isPopulated, setIsPopulated] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showAlert, setShowAlert] = useState<boolean>(true);
  const { t, language, setLanguage, translateContent } = useLanguage();
  const [takingExamId, setTakingExamId] = useState<string | null>(null);
  
  const exams = isPopulated ? populatedExams : [];
  const certs = isPopulated ? populatedCerts : [];
  const upcomingExams = exams.filter(e => e.type === 'upcoming');
  const retestExams = exams.filter(e => e.type === 'retest');

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
    <div className="min-h-screen bg-surface-cream font-sans text-charcoal">
      
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
          <div className="w-9 h-9 bg-brand-red text-white rounded-lg flex items-center justify-center shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-charcoal text-base leading-tight tracking-tight">EASY</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">MRC Sarawak Branch</p>
          </div>
        </div>

        {/* Right Side: Tools & Profile */}
        <div className="flex items-center gap-4 lg:gap-6">
          
          {/* Language Toggle */}
          <div className="hidden md:flex bg-slate-100 p-1 rounded-full border border-slate-200 items-center">
            <Globe className="w-4 h-4 text-slate-400 ml-2 mr-1" />
            {['BM', 'EN', 'BC'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as any)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                  language === lang 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
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
            
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold overflow-hidden ring-1 ring-slate-200">
              {mockUser.avatarUrl ? (
                <img src={mockUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </div>
            
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
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-10">
        
        {/* Verification Alert Banner */}
        <AnimatePresence>
          {showAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
              className="mb-8 bg-blush-rose border border-brand-red/20 rounded-xl p-4 md:p-5 flex items-start gap-4 shadow-sm"
            >
              <div className="bg-brand-red/10 text-brand-red p-2 rounded-lg shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-brand-red-deep font-bold text-sm mb-1">{translateContent("Identity Verification Required")}</h4>
                <p className="text-brand-red-deep/80 text-sm leading-relaxed">
                  {translateContent("Please ensure you have your physical MyKad, Pasport, or BSMM Membership Card ready. Online exams require active web camera monitoring and a stable internet connection.")}
                </p>
              </div>
              <button 
                onClick={() => setShowAlert(false)}
                className="text-brand-red/50 hover:text-brand-red transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN (65% -> col-span-8) --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active/Upcoming Exams */}
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
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:border-slate-300 transition-colors"
                      >
                        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold font-mono tracking-wide border border-slate-200">
                                {exam.code}
                              </span>
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100/50">
                                Jadual Rasmi
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-charcoal mb-2 leading-snug group-hover:text-brand-red transition-colors">{exam.title}</h3>
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
                          <div className={`text-sm font-semibold flex items-center gap-2 ${
                            isLocked ? 'text-slate-500' : 'text-emerald-600'
                          }`}>
                            {isLocked ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            {timeStatus.message}
                          </div>
                          
                          <button 
                            disabled={isLocked}
                            onClick={() => setTakingExamId(exam.id)}
                            className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                              isLocked 
                                ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed' 
                                : 'bg-action-teal hover:bg-teal-700 text-white shadow-md hover:shadow-xl hover:shadow-teal-900/20 active:scale-[0.98]'
                            }`}
                          >
                            {isLocked ? 'Locked' : 'Enter Exam Room'}
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

            {/* Retest Area */}
            {retestExams.length > 0 && (
              <section className="pt-2">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-charcoal tracking-tight">Required Retests</h2>
                </div>
                
                <div className="space-y-4">
                  {retestExams.map((exam) => (
                    <motion.div 
                      key={exam.id}
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-amber-50/50 rounded-2xl border border-amber-200/60 overflow-hidden relative group hover:border-amber-300 transition-colors"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-amber-400 to-amber-500"></div>
                      <div className="p-6 pl-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-[10px] font-black uppercase tracking-widest">
                              Mandatory Retest
                            </span>
                            <span className="text-xs font-bold text-amber-700/70 border border-amber-200 px-2 py-0.5 rounded">{exam.code}</span>
                          </div>
                          <h3 className="font-bold text-charcoal text-lg">{exam.title}</h3>
                          <p className="text-sm text-slate-600 mt-2 font-medium flex items-center gap-2">
                            <Info className="w-4 h-4 text-amber-500" />
                            Reason: {exam.retestReason}
                          </p>
                        </div>
                        <button className="w-full md:w-auto px-6 py-3 bg-white border border-amber-200 text-slate-800 hover:text-amber-800 hover:bg-amber-50 hover:border-amber-300 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap active:scale-[0.98]">
                          Review Requirements
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* --- RIGHT COLUMN (35% -> col-span-4) --- */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Profile Summary Widget */}
            <section>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible relative">
                <div className="p-6 pb-8 bg-charcoal rounded-t-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-5 pointer-events-none">
                    <Shield className="w-48 h-48 text-white" />
                  </div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Membership Profile</h3>
                  
                  <div className="flex items-center justify-between group">
                    <div>
                      <div className="flex items-end gap-3 mb-1">
                        <h4 className="text-3xl font-black text-white">{mockUser.category}</h4>
                      </div>
                      <span className="text-sm font-medium text-slate-300 block">Verified Tier</span>
                    </div>
                    
                    {/* Tooltip trigger */}
                    <div className="relative flex flex-col items-center cursor-help">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition-colors">
                        <Info className="w-5 h-5 text-slate-300" />
                      </div>
                      {/* Tooltip Content */}
                      <div className="absolute top-full right-0 mt-3 w-64 bg-slate-800 text-slate-200 text-xs rounded-xl p-4 shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-medium leading-relaxed">
                        <div className="absolute -top-2 right-4 w-4 h-4 bg-slate-800 border-l border-t border-slate-700 rotate-45"></div>
                        <span className="relative z-10"><strong className="text-white">Fee Structure:</strong> As a registered {mockUser.category} member, your examination fees are subsidized according to the state branch charter.</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-b-2xl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Account Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* My Digital Certificates */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-charcoal tracking-tight">Digital Certificates</h3>
              </div>
              
              {certs.length > 0 ? (
                <div className="space-y-4">
                  {certs.map(cert => (
                    <div key={cert.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors group">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex shrink-0 items-center justify-center border border-yellow-100/50">
                          <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400 mb-1 font-mono tracking-wide">{cert.code}</div>
                          <h4 className="font-bold text-charcoal text-sm leading-snug group-hover:text-action-teal transition-colors">{cert.title}</h4>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Issued: <span className="text-slate-700">{cert.dateIssued}</span>
                        </span>
                        <button className="text-slate-600 hover:text-action-teal text-xs font-bold flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-action-teal/30 px-3 py-2 rounded-lg transition-all active:scale-[0.98]">
                          <Download className="w-3.5 h-3.5" />
                          Cetak Sijil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-cream rounded-2xl border border-slate-200 border-dashed p-8 text-center">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-charcoal font-bold mb-1">No Certificates Yet</p>
                  <p className="text-sm text-slate-500 max-w-[200px] mx-auto leading-relaxed">Complete an exam to earn your digital certificate.</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
      )}
    </div>
  );
};

