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

export const Dashboard: React.FC<DashboardProps> = ({ role, exams, onViewExam }) => {
  const { t } = useLanguage();

  const stats = [
    { label: t('upcomingExams'), value: '4', icon: Calendar, color: 'text-action-teal' },
    { label: t('pendingVerification'), value: '12', icon: Clock, color: 'text-orange-500' },
    { label: t('completedMonth'), value: '8', icon: CheckCircle2, color: 'text-success-green' },
    { label: t('lockedReports'), value: '1', icon: Lock, color: 'text-alert-red' },
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
  const decPendingSubmissionCount = exams.filter(e => e.status === ExamStatus.EXPIRED || e.status === ExamStatus.LOCKED).length;

  const secVerificationCount = exams.filter(e => e.status === ExamStatus.PENDING_VERIFICATION || e.status === ExamStatus.SUBMITTED).length;
  const secUnlockRequestCount = exams.filter(e => e.status === ExamStatus.EXPIRED || e.status === ExamStatus.LOCKED).length;
  const secPrintReadyCount = exams.filter(e => e.status === ExamStatus.COMPLETED).length;

  const sebcPersonnelInputCount = exams.filter(e => e.status === ExamStatus.APPROVED && e.district === 'BINTULU').length; // Dummy logic
  const sebcResultsInputCount = exams.filter(e => e.status === ExamStatus.APPROVED).length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-charcoal">{t('welcome')}</h1>
        <p className="text-gray-500">{t('roleSummary')} {role}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  onClick={() => onViewExam('print-list')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-action-teal/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-action-teal">Sedia untuk Dicetak</span>
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
            <div className="card border-l-4 border-l-orange-500 bg-orange-50/10">
               <h3 className="text-sm font-black uppercase tracking-widest text-charcoal mb-4 flex items-center gap-2">
                 <FileCheck className="w-4 h-4 text-orange-500" />
                 Senarai Kerja (Worklist) - Board
               </h3>
               <div className="space-y-3">
                 <button 
                  onClick={() => onViewExam('personnel-input')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-brand-red/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-brand-red">Sedia untuk Memasukkan Senarai Pemeriksa</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-brand-red text-white px-2 py-0.5 rounded-full text-[10px] font-black">{sebcPersonnelInputCount}</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-brand-red" />
                   </div>
                 </button>
                 <button 
                  onClick={() => onViewExam('results-input')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-action-teal/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-action-teal">Sedia untuk Memasukkan Keputusan</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-action-teal text-white px-2 py-0.5 rounded-full text-[10px] font-black">{sebcResultsInputCount}</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-action-teal" />
                   </div>
                 </button>
                 <button 
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-gray-500/30 transition-all group"
                 >
                   <span className="text-sm font-medium text-gray-700 group-hover:text-gray-500">Permintaan Membuka Keputusan yang Dikunci</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-gray-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">0</span>
                     <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                   </div>
                 </button>
               </div>
            </div>
          )}

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t('examStatus')}</h3>
              <button className="text-action-teal text-sm font-medium hover:underline flex items-center gap-1">
                {t('viewAll')} <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 font-semibold">{t('examTitle')}</th>
                    <th className="pb-3 font-semibold text-center">{t('date')}</th>
                    <th className="pb-3 font-semibold text-center">{t('statusHeader')}</th>
                    <th className="pb-3 font-semibold text-right">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="group hover:bg-surface-cream/50 transition-colors">
                      <td className="py-4">
                        <p className="font-semibold text-sm">{exam.subject}</p>
                        <p className="text-xs text-gray-500">{exam.category} • {exam.district}</p>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-sm text-gray-600">{exam.examDate}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`badge ${
                          exam.status === ExamStatus.LOCKED ? 'badge-tolak' : 
                          exam.status === ExamStatus.APPROVED ? 'badge-lulus' : 'badge-baru'
                        }`}>
                          {getStatusLabel(exam.status)}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => onViewExam(exam.id)}
                          className="text-[10px] font-bold uppercase tracking-widest text-action-teal bg-action-teal/5 px-3 py-1.5 rounded-md hover:bg-action-teal hover:text-white transition-all"
                        >
                          {t('details')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
