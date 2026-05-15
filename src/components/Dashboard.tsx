import React from 'react';
import { ExamStatus, UserRole } from '../types';
import { MockExam } from '../data/mockExams';
import { 
  AlertCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Lock,
  Calendar,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProps {
  role: UserRole;
  exams: MockExam[];
  onViewExam: (id: string) => void;
}

const ExamListAccordion: React.FC<{ exams: MockExam[] }> = ({ exams }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="card shadow-sm border border-gray-100 p-0 overflow-hidden">
      <button 
        className="w-full text-left bg-gray-100 p-4 flex justify-between items-center hover:bg-gray-200 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold text-charcoal">
          Peperiksaan yang Akan Datang ({exams.length})
        </h3>
        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200 text-sm">
          <div className="space-y-2">
            {exams.map((exam) => {
              const parts = exam.examDate.split('/');
              let exDate = new Date();
              let hariLagi = '';
              if (parts.length === 3) {
                 exDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                 const today = new Date();
                 const diffTime = Math.ceil((exDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                 hariLagi = diffTime >= 0 ? `${diffTime} hari lagi` : `${Math.abs(diffTime)} hari lepas`;
              }
              
              return (
                <div key={exam.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded cursor-pointer transition-colors text-[#0066CC] font-medium truncate">
                  <span>{exam.regNo} - {exam.subject} - {exam.examDate} ({hariLagi})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ role, exams, onViewExam }) => {
  const { t } = useLanguage();

  const stats = [
    { label: t('upcomingExams'), value: '4', icon: Calendar, color: 'text-action-teal' },
    { label: t('pendingVerification'), value: '12', icon: Clock, color: 'text-orange-500' },
    { label: t('completedMonth'), value: '8', icon: CheckCircle2, color: 'text-success-green' },
    { label: 'Sijil Tamat Tempoh (30 hari)', value: '3', icon: AlertCircle, color: 'text-amber-500' },
    { label: 'Calon Retest Tertunda', value: '5', icon: Clock, color: 'text-brand-red' },
    { label: 'Laporan Dijana', value: '14', icon: FileCheck, color: 'text-[#2D5A8E]' },
  ];

  const getStatusLabel = (status: ExamStatus) => {
    switch (status) {
      case ExamStatus.DRAFT: return t('statusDraft');
      case ExamStatus.PENDING_VERIFICATION: return t('statusPending');
      case ExamStatus.APPROVED: return t('statusApproved');
      case ExamStatus.REJECTED: return t('statusRejected');
      case ExamStatus.LOCKED: return t('statusLocked');
      case ExamStatus.SUBMITTED: return t('statusSubmitted') || 'Dihantar';
      case ExamStatus.COMPLETED: return t('statusCompleted');
      default: return status;
    }
  };

  const decSummaryReadyCount = exams.filter(e => e.status === ExamStatus.APPROVED).length;
  const decPendingSubmissionCount = exams.filter(e => e.status === ExamStatus.EXPIRED || e.status === ExamStatus.LOCKED || e.status === ExamStatus.UNLOCK_REQUESTED).length;

  const secNewApplicationCount = exams.filter(e => e.status === ExamStatus.PENDING_VERIFICATION).length;
  const secVerificationCount = exams.filter(e => e.status === ExamStatus.SUBMITTED).length;
  const secUnlockRequestCount = exams.filter(e => e.status === ExamStatus.UNLOCK_REQUESTED).length;
  const secPrintReadyCount = exams.filter(e => e.status === ExamStatus.COMPLETED).length;

  const sebcPersonnelInputCount = exams.filter(e => e.status === ExamStatus.APPROVED).length;
  const sebcResultsInputCount = exams.filter(e => e.status === ExamStatus.APPROVED).length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-charcoal">{t('welcome')}</h1>
        <p className="text-gray-500">{t('roleSummary')} {role}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="card flex items-center justify-between"
          >
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-charcoal tracking-tight">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl bg-gray-50/50 group-hover:bg-white transition-colors shadow-inner ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* DEC Role Worklist */}
          {role === UserRole.DEC && (
            <div className="card border-l-4 border-l-action-teal bg-teal-50/10">
               <h3 className="text-sm font-black uppercase tracking-widest text-charcoal mb-4 flex items-center gap-2">
                 <FileCheck className="w-4 h-4 text-action-teal" />
                 Senarai Kerja (Worklist) - District
               </h3>
                <div className="space-y-3">
                  <button 
                   onClick={() => onViewExam('menunggu-penyerahan')}
                   className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-blue-400/30 transition-all group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-500">Menunggu Penyerahan</span>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold">{decPendingSubmissionCount}</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                    </div>
                  </button>
                  <button 
                   onClick={() => onViewExam('borang-list')}
                   className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-red-400/30 transition-all group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-red-500">Ditolak</span>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 font-bold">0</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-red-500" />
                    </div>
                  </button>
                  <button 
                   onClick={() => onViewExam('summary-ready')}
                   className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-action-teal/30 transition-all group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-action-teal">Sedia untuk Penyediaan Rumusan Peperiksaan</span>
                    <div className="flex items-center gap-3">
                      <span className="text-action-teal font-bold">{decSummaryReadyCount}</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-action-teal" />
                    </div>
                  </button>
                  <button 
                   onClick={() => console.log('AttendanceCertificate')} // For routing
                   className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-action-teal/30 transition-all group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-action-teal">Sijil Kehadiran Perlu Dijana</span>
                    <div className="flex items-center gap-3">
                      <span className="text-action-teal font-bold">2</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-action-teal" />
                    </div>
                  </button>
                  <button 
                   onClick={() => console.log('CertificateRenewal')}
                   className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-amber-500/30 transition-all group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-amber-500">Sijil Tamat Tempoh (30 hari)</span>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-500 font-bold">3</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500" />
                    </div>
                  </button>
                </div>
            </div>
          )}

          {/* SEC Role Worklist */}
          {role === UserRole.SEC && (
            <div className="card border-l-4 border-l-brand-red bg-red-50/10">
               <h3 className="text-sm font-black uppercase tracking-widest text-charcoal mb-4 flex items-center gap-2">
                 <FileCheck className="w-4 h-4 text-brand-red" />
                 Senarai Kerja (Worklist) - State
               </h3>
               <div className="space-y-3">
                 <button 
                  onClick={() => onViewExam('new-application-list')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-brand-red/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-brand-red">Permohonan Baru Dihantar</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-brand-red text-white px-2 py-0.5 rounded-full text-[10px] font-black">{secNewApplicationCount}</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-brand-red" />
                   </div>
                 </button>
                 <button 
                  onClick={() => onViewExam('verification-list')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-brand-red/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-brand-red">Sedia untuk Pengesahan Permohonan</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-brand-red text-white px-2 py-0.5 rounded-full text-[10px] font-black">{secVerificationCount}</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-brand-red" />
                   </div>
                 </button>
                 <button 
                  onClick={() => onViewExam('unlock-list')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-orange-500/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500">Permintaan Membuka Pemeriksa (Unlock)</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">{secUnlockRequestCount}</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500" />
                   </div>
                 </button>
                 <button 
                  onClick={() => onViewExam('sedia-cetak-list')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-action-teal/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-action-teal">Sedia untuk Dicetak</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-action-teal text-white px-2 py-0.5 rounded-full text-[10px] font-black">{secPrintReadyCount}</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-action-teal" />
                   </div>
                 </button>
                 <button 
                  onClick={() => onViewExam('print-list')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-action-teal/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-action-teal">Penyata Peperiksaan</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-action-teal text-white px-2 py-0.5 rounded-full text-[10px] font-black">{secPrintReadyCount}</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-action-teal" />
                   </div>
                 </button>
               </div>
            </div>
          )}

          {/* SEBC Role Worklist */}
          {role === UserRole.SEBC && (
            <div className="card border-l-4 border-l-[#2D5A8E] bg-[#2D5A8E]/5">
               <h3 className="text-sm font-black uppercase tracking-widest text-[#2D5A8E] mb-2 flex items-center gap-2">
                 <FileCheck className="w-4 h-4 text-[#2D5A8E]" />
                 Senarai Kerja (Worklist) - Board
               </h3>
               <p className="text-xs font-medium text-gray-500 mb-4 px-6 border-b border-gray-200 pb-2 border-dashed">
                 Pengerusi Lembaga Pengarah Peperiksaan Cawangan
               </p>
               <div className="space-y-3">
                 <button 
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-[#2D5A8E]/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-[#2D5A8E]">Sedia untuk Penyediaan Peperiksaan</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-gray-400 group-hover:bg-[#2D5A8E] text-white px-2 py-0.5 rounded-full text-[10px] font-black transition-colors">0</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#2D5A8E]" />
                   </div>
                 </button>
                 <button 
                  onClick={() => onViewExam('personnel-input')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-[#2D5A8E]/30 transition-all group shadow-sm hover:shadow-md"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-[#2D5A8E]">Sedia untuk memasukkan Senarai Pemeriksa</span>
                   <div className="flex items-center gap-3">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${sebcPersonnelInputCount > 0 ? 'bg-[#2D5A8E] text-white' : 'bg-gray-400 group-hover:bg-[#2D5A8E] text-white'}`}>
                       {sebcPersonnelInputCount}
                     </span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#2D5A8E]" />
                   </div>
                 </button>
                 <button 
                  onClick={() => onViewExam('results-input')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-[#2D5A8E]/30 transition-all group shadow-sm hover:shadow-md"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-[#2D5A8E]">Sedia untuk memasukkan Keputusan</span>
                   <div className="flex items-center gap-3">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${sebcResultsInputCount > 0 ? 'bg-[#2D5A8E] text-white' : 'bg-gray-400 group-hover:bg-[#2D5A8E] text-white'}`}>
                       {sebcResultsInputCount}
                     </span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#2D5A8E]" />
                   </div>
                 </button>
                 <button 
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-[#2D5A8E]/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-[#2D5A8E]">Permintaan untuk Membuka Peperiksaan yang Dikunci</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-gray-400 group-hover:bg-[#2D5A8E] text-white px-2 py-0.5 rounded-full text-[10px] font-black transition-colors">0</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#2D5A8E]" />
                   </div>
                 </button>
                 <button 
                  onClick={() => console.log('OnlineExam')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-[#2D5A8E]/30 transition-all group shadow-sm hover:shadow-md"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-[#2D5A8E]">Peperiksaan Aktif – Masuk Markah</span>
                   <div className="flex items-center gap-3">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors bg-[#2D5A8E] text-white`}>
                       4
                     </span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#2D5A8E]" />
                   </div>
                 </button>
               </div>
            </div>
          )}


        </div>

        <div className="space-y-6">
          <ExamListAccordion exams={exams} />

          {role === UserRole.DEC && (
            <div className="card border-l-4 border-l-alert-red bg-red-50/30">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-alert-red flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-alert-red text-sm mb-1">{t('lockedNoticeTitle')}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {t('lockedNoticeDesc')}
                  </p>
                  <button 
                    onClick={() => onViewExam('unlock-list')}
                    className="btn-secondary text-xs py-1.5 w-full flex justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" /> {t('requestUnlock')}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-bold mb-4">{t('quickLinks')}</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-action-teal/30 hover:bg-action-teal/5 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-gray-400 group-hover:text-action-teal" />
                  <span className="text-sm font-medium">{t('downloadGuide')}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-action-teal" />
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-action-teal/30 hover:bg-action-teal/5 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-action-teal" />
                  <span className="text-sm font-medium">{t('summaryForm')}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-action-teal" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
