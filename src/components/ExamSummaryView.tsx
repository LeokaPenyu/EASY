import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Printer, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Users,
  CreditCard,
  Save,
  Send,
  Calendar,
  Plus,
  Lock,
  Unlock,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MockExam } from '../data/mockExams';
import { UserRole, ExamStatus } from '../types';

interface Candidate {
  id: string;
  name: string;
  idNo: string;
  membershipNo: string;
  isMember: boolean;
  attendance?: {
    theory: boolean;
    oral: boolean;
    practical: boolean;
  };
}

interface ExamSummaryViewProps {
  role: UserRole;
  exams: MockExam[];
  examId: string;
  onBack: () => void;
  onUpdateExam?: (id: string, updates: Partial<MockExam>) => void;
  onUpdateStatus?: (id: string, status: ExamStatus) => void;
  onSuccess?: (exam: MockExam) => void;
  initialEditMode?: boolean;
  isSummaryReady?: boolean;
}

export const ExamSummaryView: React.FC<ExamSummaryViewProps> = ({ 
  role,
  exams,
  examId, 
  onBack, 
  onUpdateExam,
  onUpdateStatus,
  onSuccess,
  initialEditMode = false,
  isSummaryReady = false
}) => {
  const { t } = useLanguage();
  
  // Look up data from exams or use default Figure 12 data
  const selectedMock = exams.find(e => e.id === examId) || exams[0];

  const [activeTab, setActiveTab] = useState<'borang' | 'rumusan' | 'keputusan'>(
    selectedMock.status === ExamStatus.DRAFT || selectedMock.status === ExamStatus.PENDING_VERIFICATION || selectedMock.status === ExamStatus.SUBMITTED ? 'borang' : 'rumusan'
  );
  const [isEditable, setIsEditable] = useState(initialEditMode);
  
  const isSummaryReadyFinal = selectedMock.regNo === 'BTU/2016/0009' || isSummaryReady;

  const [localStatus, setLocalStatus] = useState<ExamStatus>(selectedMock.status as ExamStatus);
  const [showNotification, setShowNotification] = useState<{show: boolean, message: string} | null>(null);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [unlockApproved, setUnlockApproved] = useState(false);
  const [isUnlockRequested, setIsUnlockRequested] = useState(false);
  const [isResultsSubmitted, setIsResultsSubmitted] = useState(false);
  const [showSECUnlockDialog, setShowSECUnlockDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{message: string, onConfirm: () => void} | null>(null);
  const [alertDialog, setAlertDialog] = useState<{message: string, onClose?: () => void} | null>(null);
  const [newDueDate, setNewDueDate] = useState('25/11/2016');
  const [isSecondUnlock, setIsSecondUnlock] = useState(false);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);

  const examData = {
    regNo: selectedMock.regNo,
    status: selectedMock.status,
    deadline: selectedMock.deadline || '28/11/2017',
    district: selectedMock.district,
    organization: selectedMock.organization || 'Sekolah SAINS',
    category: selectedMock.category || 'Private',
    courseStart: selectedMock.courseStart || '23/11/2016',
    courseEnd: selectedMock.courseEnd || '23/11/2016',
    examDate: selectedMock.examDate || selectedMock.date,
    subject: selectedMock.subject,
    address: selectedMock.address || 'Sekolah SAINS',
    attachment: selectedMock.attachment || { name: 'rena-deco-clay-craft-map.png', size: '390 KB' },
    candidates: selectedMock.candidates as Candidate[]
  };

  const [candidates, setCandidates] = useState<Candidate[]>(examData.candidates);
  const [courseStart, setCourseStart] = useState(examData.courseStart);
  const [courseEnd, setCourseEnd] = useState(examData.courseEnd);
  const [address, setAddress] = useState(examData.address);

  const [jurulatih, setJurulatih] = useState([
    { id: 'j1', name: 'RODNEY AUDI', ic: '800101-10-1001', address: '', waran: '007' }
  ]);
  const [penyelia, setPenyelia] = useState([
    { id: 'p1', name: 'Farid Kamil', ic: 'K801001' }
  ]);
  const [pemeriksa, setPemeriksa] = useState([
    { id: 'pr1', name: 'LUKE', ic: '881201-52-5342', address: 'No 199, JLN ANGSANA, LOWER SUNGAI MAONG', waran: '1' },
    { id: 'pr2', name: 'TERESA', ic: '901212-12-1212', address: '', waran: '3' }
  ]);

  // Sync candidates if examId changes
  React.useEffect(() => {
    setCandidates(examData.candidates);
    setCourseStart(examData.courseStart);
    setCourseEnd(examData.courseEnd);
    setAddress(examData.address);
    setIsEditable(initialEditMode);
  }, [examId, initialEditMode]);

  const triggerNotification = (message: string) => {
    setShowNotification({ show: true, message });
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsEditable(false);
    if (onUpdateExam) {
      onUpdateExam(examId, {
        candidates,
        courseStart,
        courseEnd,
        address
      });
    }
    triggerNotification('Maklumat berjaya disimpan!');
  };

  const handleSubmit = () => {
    setConfirmDialog({
      message: 'Hantar Rumusan Peperiksaan ini?',
      onConfirm: () => {
        const updatedExam = { ...selectedMock, status: ExamStatus.SUBMITTED };
        if (onUpdateStatus) onUpdateStatus(examId, ExamStatus.SUBMITTED);
        setLocalStatus(ExamStatus.SUBMITTED);
        
        setAlertDialog({
          message: 'Penyerahan Berjaya! Rumusan peperiksaan telah dihantar untuk pengesahan SEC. Sila tunggu maklum balas daripada pihak berkaitan.',
          onClose: () => {
            if (onSuccess) {
              onSuccess(updatedExam);
            } else {
              onBack();
            }
          }
        });
      }
    });
  };

  const handleRenew = () => {
    triggerNotification('Permohonan untuk memperbaharui kursus telah diproses.');
  };

  const addJurulatih = () => setJurulatih([...jurulatih, { id: Math.random().toString(), name: '', ic: '', address: '', waran: '' }]);
  const addPenyelia = () => setPenyelia([...penyelia, { id: Math.random().toString(), name: '', ic: '' }]);
  const addPemeriksa = () => setPemeriksa([...pemeriksa, { id: Math.random().toString(), name: '', ic: '', address: '', waran: '' }]);

  const removeJurulatih = (id: string) => setJurulatih(jurulatih.filter(j => j.id !== id));
  const removePenyelia = (id: string) => setPenyelia(penyelia.filter(p => p.id !== id));
  const removePemeriksa = (id: string) => setPemeriksa(pemeriksa.filter(p => p.id !== id));

  const toInputDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const fromInputDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  };

  const toggleAttendance = (candidateId: string, field: keyof NonNullable<Candidate['attendance']>) => {
    if (!isEditable) return;
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      const currentAttendance = c.attendance || { theory: false, oral: false, practical: false };
      return { 
        ...c, 
        attendance: { 
          ...currentAttendance, 
          [field]: !currentAttendance[field] 
        } 
      };
    }));
  };

  const totals = {
    theory: candidates.filter(c => c.attendance?.theory).length,
    oral: candidates.filter(c => c.attendance?.oral).length,
    practical: candidates.filter(c => c.attendance?.practical).length,
    members: candidates.filter(c => c.isMember).length,
    nonMembers: candidates.filter(c => !c.isMember).length,
    totalCount: candidates.length,
    lang: (selectedMock as any).lang || { bm: 1, bi: 1, bc: 0 }
  };

  const isExpired = localStatus === ExamStatus.EXPIRED && !unlockApproved;

  const handleUnlockRequest = () => {
    setShowUnlockDialog(true);
  };

  const confirmUnlock = () => {
    setShowUnlockDialog(false);
    setIsUnlockRequested(true);
    triggerNotification('Permintaan untuk membuka kunci telah dihantar kepada SEC/SEBC.');
  };

  const handleUnlockApprove = () => {
    setShowSECUnlockDialog(true);
  };

  const confirmSECUnlock = () => {
    setShowSECUnlockDialog(false);
    setUnlockApproved(true);
    triggerNotification(`Permohonan telah dibuka kunci. Tarikh akhir baru: ${newDueDate}`);
  };

  const fees = {
    memberTotal: totals.members * 2.00,
    nonMemberTotal: totals.nonMembers * 14.00,
    grandTotal: (totals.members * 2.00) + (totals.nonMembers * 14.00)
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto p-6 space-y-6">
            <h3 className="text-lg font-bold text-charcoal">{confirmDialog.message}</h3>
            <div className="flex gap-3 justify-end pt-4">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-6 py-2 border border-gray-200 text-gray-600 bg-gray-50 rounded shadow-sm font-bold text-sm hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-6 py-2 bg-action-teal text-white rounded shadow-md font-bold text-sm hover:bg-teal-700"
              >
                Teruskan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      {alertDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto p-6 space-y-6 border-t-4 border-action-teal">
            <h3 className="text-xl font-black text-action-teal uppercase flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Notifikasi
            </h3>
            <p className="text-gray-600 font-medium">{alertDialog.message}</p>
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => {
                  if (alertDialog.onClose) alertDialog.onClose();
                  setAlertDialog(null);
                }}
                className="px-8 py-2 bg-action-teal text-white rounded shadow-md font-bold text-sm hover:bg-teal-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Tab Navigation - Figure 12 Style */}
      <div className="flex bg-[#E5E7EB] border-b border-gray-400">
        {[
          { id: 'borang', label: 'Borang Permohonan' },
          { id: 'rumusan', label: 'Rumusan Peperiksaan' },
          { id: 'keputusan', label: 'Keputusan' }
        ].map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-1 text-[11px] font-bold border-r border-gray-400 transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-black border-t-2 border-t-brand-red' 
                : 'text-gray-600 hover:bg-gray-200'
            } ${idx === 0 ? 'border-l border-gray-400' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{showNotification.message}</span>
          </motion.div>
        )}

        {activeTab === 'borang' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-[13px] text-charcoal"
          >
            <div className="grid grid-cols-[200px_1fr] gap-x-0 gap-y-1">
              <span className="text-[#8B4513] text-right pr-4 font-medium">No. Pendaftaran:</span>
              <span className="font-bold text-base leading-none">{examData.regNo}</span>
              
              <span className="text-[#8B4513] text-right pr-4 font-medium">Status:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{localStatus}</span>
              </div>
              
              <div className="col-span-2 my-2"></div>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Nama Daerah:</span>
              <span className="font-bold uppercase">{examData.district}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Nama Unit/Organisasi:</span>
              <span className="font-bold">{examData.organization}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Kategori Unit/Organisasi:</span>
              <span className="font-medium">{examData.category}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Alamat Peperiksaan:</span>
              <span className="font-medium">{address}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Nama dan Alamat Latihan O/C:</span>
              <span className="font-medium">Capten Nemo, Sekolah SAINS</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Tarikh Peperiksaan:</span>
              <span className="font-medium">{examData.examDate}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Subjek:</span>
              <span className="font-medium">{examData.subject}</span>
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 mt-4">
              <span className="text-gray-400 font-bold text-right">Senarai Calon:</span>
              <div className="overflow-hidden border border-gray-300 rounded-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#D1D5DB]">
                    <tr className="divide-x divide-gray-400">
                      <th className="px-3 py-1.5 text-[11px] font-black text-charcoal">Nama</th>
                      <th className="px-3 py-1.5 text-[11px] font-black text-charcoal">No. KP/Pasport</th>
                      <th className="px-3 py-1.5 text-[11px] font-black text-charcoal">No. Ahli BSMM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {candidates.map((c) => (
                      <tr key={c.id} className="divide-x divide-gray-300">
                        <td className="px-3 py-1.5 font-bold uppercase">{c.name}</td>
                        <td className="px-3 py-1.5">{c.idNo}</td>
                        <td className="px-3 py-1.5">{c.membershipNo}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-white border-t border-gray-300">
                    <tr className="divide-x divide-gray-300">
                      <td colSpan={1} className="px-3 py-1.5 text-right font-bold bg-gray-50 uppercase">Kehadiran</td>
                      <td colSpan={2} className="px-3 py-1.5 text-center font-bold text-gray-500 italic block sm:flex sm:gap-4 justify-around">
                        <span>0/{totals.totalCount}</span>
                        <span>0/{totals.totalCount}</span>
                        <span>0/{totals.totalCount}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr_1fr] gap-4 mt-4">
              <span className="text-gray-400 font-bold text-right pt-1">Bilangan Calon:</span>
              <div className="space-y-0.5">
                <div className="flex gap-4 items-center">
                  <span className="text-gray-500 font-medium">Jumlah Calon :</span>
                  <span className="text-lg font-black">{totals.totalCount}</span>
                </div>
                <div className="pl-4 space-y-0.5">
                  <div className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Ahli :</span>
                    <span className="font-bold">{totals.members}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Bukan Ahli :</span>
                    <span className="font-bold">{totals.nonMembers}</span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <span className="text-gray-400 font-bold block text-[10px]">Pilihan bahasa dalam peperiksaan:</span>
                <div className="flex justify-end gap-3 font-black text-[10px]">
                  <span>BM : {totals.lang.bm}</span>
                  <span>BI : {totals.lang.bi}</span>
                  <span>BC : {totals.lang.bc}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFEFEF] border border-[#FFD0D0] p-4 rounded-sm space-y-1 mt-4">
              <div className="grid grid-cols-[150px_1fr] gap-x-4">
                <span className="text-gray-500 text-right font-medium">Pembayaran:</span>
                <div className="space-y-1">
                  <p className="font-medium">Bayaran yuran peperiksaan (Ahli) <span className="font-black">{totals.members}</span> x RM 2.00/calon = <span className="font-black">RM {fees.memberTotal.toFixed(0)}</span></p>
                  <p className="font-medium">Bayaran yuran peperiksaan (Bukan Ahli) <span className="font-black">{totals.nonMembers}</span> x RM 14.00/calon = <span className="font-black">RM {fees.nonMemberTotal.toFixed(0)}</span></p>
                  <p className="font-medium pt-1 border-t border-red-100">Jumlah bayaran yuran peperiksaan = <span className="font-black">RM {fees.grandTotal.toFixed(0)}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-[150px_1fr] gap-x-4 pt-2">
                <span className="text-gray-500 text-right font-medium">Lampiran Pembayaran:</span>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <button 
                    onClick={() => setAlertDialog({message: `Membuka fail: ${examData.attachment.name}`})}
                    className="text-blue-600 hover:underline font-bold underline decoration-1 underline-offset-4 text-left"
                  >
                    {examData.attachment.name}
                  </button>
                  <span className="text-gray-400 text-[10px]">({examData.attachment.size})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-300 flex-wrap">
              <button onClick={onBack} className="btn-footer flex items-center gap-1.5 px-3 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal">
                <ArrowLeft className="w-3.5 h-3.5 text-blue-600" /> Kembali
              </button>
              <button onClick={handlePrint} className="btn-footer flex items-center gap-1.5 px-3 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal">
                <Printer className="w-3.5 h-3.5 text-blue-600" /> Cetak
              </button>
              
              {role === UserRole.DEC && localStatus === ExamStatus.DRAFT && (
                <button 
                  onClick={() => {
                    setConfirmDialog({
                      message: 'Hantar Permohonan ini untuk pengesahan?',
                      onConfirm: () => {
                        const updatedExam = { ...selectedMock, status: ExamStatus.SUBMITTED };
                        if (onUpdateStatus) onUpdateStatus(examId, ExamStatus.SUBMITTED);
                        setLocalStatus(ExamStatus.SUBMITTED);
                        setAlertDialog({
                          message: 'Penyerahan Berjaya! Borang telah dihantar untuk pengesahan SEC. Sila tunggu maklum balas daripada pihak berkaitan.',
                          onClose: () => {
                            if (onSuccess) {
                              onSuccess(updatedExam);
                            } else {
                              onBack();
                            }
                          }
                        });
                      }
                    });
                  }}
                  className="flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-green-50 font-bold text-[11px] shadow-sm text-action-teal transition-all uppercase"
                >
                  <Send className="w-3.5 h-3.5 text-action-teal" />
                  {t('submit')}
                </button>
              )}
              
              {role === UserRole.SEC && (localStatus === ExamStatus.PENDING_VERIFICATION || localStatus === ExamStatus.SUBMITTED) && (
                <div className="flex border border-gray-400 rounded overflow-hidden">
                  <button 
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(examId, ExamStatus.APPROVED);
                      setLocalStatus(ExamStatus.APPROVED);
                      setAlertDialog({
                        message: 'Berjaya! Permohonan telah diluluskan. DEC telah dikemaskini dan akan diberitahu tentang kelulusan ini.',
                        onClose: () => onBack()
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-green-50 font-bold text-[11px] text-charcoal hover:text-green-700 transition-all uppercase border-r border-gray-400"
                  >
                    <ThumbsUp className="w-4 h-4 text-green-600 fill-green-600/10" />
                    Lulus
                  </button>
                  <button 
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(examId, ExamStatus.REJECTED);
                      setLocalStatus(ExamStatus.REJECTED);
                      setAlertDialog({
                        message: 'Permohonan telah ditolak.',
                        onClose: () => onBack()
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-red-50 font-bold text-[11px] text-charcoal hover:text-red-700 transition-all uppercase"
                  >
                    <ThumbsDown className="w-4 h-4 text-red-600 fill-red-600/10" />
                    Tolak
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'rumusan' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-[13px] text-charcoal"
          >
            {/* Locked/Submitted/Ready Worklist Style Header (Figure 14) */}
            {(isExpired || localStatus === ExamStatus.SUBMITTED || localStatus === ExamStatus.APPROVED) && (
              <div className="border border-gray-300 p-4 mb-4 bg-[#F0F0F0]/50">
                <div className="border-b border-gray-400 pb-2 mb-3">
                  <h3 className="text-xl text-charcoal font-bold">
                    {localStatus === ExamStatus.SUBMITTED 
                      ? 'Rumusan Peperiksaan Telah Dihantar' 
                      : (localStatus === ExamStatus.EXPIRED 
                          ? 'Menunggu Penyerahan Rumusan Peperiksaan' 
                          : 'Sedia untuk Penyediaan Rumusan Peperiksaan')
                    }
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="font-black uppercase text-[11px] text-charcoal">{examData.district}</p>
                  <div className="flex items-center gap-1 text-blue-500 font-bold text-xs">
                    <span className="hover:underline cursor-pointer">{examData.regNo} - {examData.subject.split(' - ')[0]} - {examData.examDate}</span>
                    {isExpired && <span className="text-red-600 leading-none ml-1">(Tamat Tempoh)</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Locked/Submitted Content View (Figure 17 Style) */}
            {(isExpired || localStatus === ExamStatus.SUBMITTED) ? (
              <div className="card text-center py-12 space-y-6 border border-gray-300">
                <p className="text-lg font-bold text-charcoal max-w-2xl mx-auto leading-relaxed">
                  {localStatus === ExamStatus.SUBMITTED 
                    ? 'Rumusan Peperiksaan telah dihantar dan sedang diproses oleh Penyelaras Peperiksaan Negeri (SEC).'
                    : `Rumusan Peperiksaan menunggu penyerahan oleh Penyelaras Peperiksaan Daerah. 
                       Tarikh akhir penyerahan: ${examData.deadline}`
                  }
                </p>
                {/* Status-specific indicators in center (keeping as extra context, but Figure 15 buttons go in footer) */}
                {isExpired && isUnlockRequested && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 px-6 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded font-bold text-xs">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Permintaan Menunggu Pengesahan...
                    </div>
                  </div>
                )}
                {localStatus === ExamStatus.SUBMITTED && (
                   <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-6 py-2 bg-green-50 text-green-700 border border-green-200 rounded font-bold text-xs uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Telah Dihantar
                      </div>
                   </div>
                )}
              </div>
            ) : (
              <>
                {/* Personnel Tables - Figure 12 Style */}
            <div className="grid grid-cols-[200px_1fr] gap-x-0 gap-y-1">
              <span className="text-[#8B4513] text-right pr-4 font-medium">No. Pendaftaran:</span>
              <span className="font-bold text-base leading-none">{examData.regNo}</span>
              
              <span className="text-[#8B4513] text-right pr-4 font-medium">Status:</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${isExpired ? 'text-red-600' : 'text-charcoal'}`}>{localStatus}</span>
              </div>
              
              <span className="text-[#8B4513] text-right pr-4 font-medium">Tarikh Akhir Penyerahan:</span>
              <span className="font-medium">{examData.deadline}</span>
              
              <div className="col-span-2 my-1"></div>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Nama Daerah:</span>
              <span className="font-bold uppercase">{examData.district}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Nama Unit/Organisasi:</span>
              <span className="font-bold">{examData.organization}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Kategori Unit/Organisasi:</span>
              <span className="font-medium">{examData.category}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Tarikh Mula Kursus:</span>
              <span className="font-medium">{courseStart}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Tarikh Tamat Kursus:</span>
              <span className="font-medium">{courseEnd}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Tarikh Peperiksaan:</span>
              <span className="font-medium">{examData.examDate}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Subjek:</span>
              <span className="font-medium">{examData.subject}</span>

              <span className="text-[#8B4513] text-right pr-4 font-medium">Alamat Peperiksaan:</span>
              <span className="font-medium">{address}</span>
            </div>

            {/* Personnel Tables - Figure 12 Style */}
            <div className="space-y-8 mt-8">
              {/* Jurulatih */}
              <div className="grid grid-cols-[150px_1fr] gap-4">
                <span className="text-gray-400 font-bold text-right py-1">
                  <span className="text-brand-red font-bold mr-1">*</span>Senarai Jurulatih:
                </span>
                <div className="space-y-2">
                  <div className="overflow-hidden border border-gray-200 rounded-sm">
                    <table className="w-full">
                      <thead className="bg-[#D1D5DB]">
                        <tr>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal border-r border-gray-300 w-1/3">Nama</th>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal border-r border-gray-300">No. KP/Pasport</th>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal border-r border-gray-300">Alamat</th>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal">No. Jurulatih/Waran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jurulatih.map((j) => (
                          <tr key={j.id} className="border-t border-gray-100 group">
                            <td className="px-3 py-1.5 flex items-center gap-2">
                              {isEditable && (
                                <button onClick={() => removeJurulatih(j.id)} className="text-black font-bold hover:text-brand-red">X</button>
                              )}
                              <span className="font-bold uppercase">{j.name}</span>
                            </td>
                            <td className="px-3 py-1.5">{j.ic}</td>
                            <td className="px-3 py-1.5">{j.address}</td>
                            <td className="px-3 py-1.5">{j.waran}</td>
                          </tr>
                        ))}
                        {jurulatih.length === 0 && (
                          <tr className="border-t border-gray-100">
                            <td colSpan={4} className="px-3 py-4 text-center text-gray-300 italic">Tiada Rekod</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {isEditable && (
                    <button 
                      onClick={addJurulatih}
                      className="border border-gray-400 px-4 py-1 flex items-center gap-2 text-action-teal font-bold text-xs rounded-sm hover:bg-gray-50"
                    >
                      <span className="text-lg leading-none">+</span> Tambah
                    </button>
                  )}
                </div>
              </div>

              {/* Penyelia */}
              <div className="grid grid-cols-[150px_1fr] gap-4">
                <span className="text-gray-400 font-bold text-right py-1">
                  <span className="text-brand-red font-bold mr-1">*</span>Senarai Penyelia:
                </span>
                <div className="space-y-2">
                  <div className="overflow-hidden border border-gray-200 rounded-sm">
                    <table className="w-full">
                      <thead className="bg-[#D1D5DB]">
                        <tr>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal border-r border-gray-300">Nama</th>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal">No. KP/Pasport</th>
                        </tr>
                      </thead>
                      <tbody>
                        {penyelia.map((p) => (
                          <tr key={p.id} className="border-t border-gray-100">
                            <td className="px-3 py-1.5">
                              <div className="flex items-center gap-2">
                                {isEditable && (
                                  <button onClick={() => removePenyelia(p.id)} className="text-black font-bold hover:text-brand-red">X</button>
                                )}
                                {isEditable ? (
                                  <input 
                                    type="text" 
                                    value={p.name} 
                                    onChange={(e) => setPenyelia(penyelia.map(item => item.id === p.id ? {...item, name: e.target.value} : item))}
                                    className="flex-1 border border-gray-300 rounded px-2 py-0.5" 
                                  />
                                ) : (
                                  <span className="font-bold">{p.name}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-1.5">
                              {isEditable ? (
                                <input 
                                  type="text" 
                                  value={p.ic} 
                                  onChange={(e) => setPenyelia(penyelia.map(item => item.id === p.id ? {...item, ic: e.target.value} : item))}
                                  className="w-full border border-gray-300 rounded px-2 py-0.5" 
                                />
                              ) : (
                                <span>{p.ic}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {isEditable && (
                    <button 
                      onClick={addPenyelia}
                      className="border border-gray-400 px-4 py-1 flex items-center gap-2 text-action-teal font-bold text-xs rounded-sm hover:bg-gray-50"
                    >
                      <span className="text-lg leading-none">+</span> Tambah
                    </button>
                  )}
                </div>
              </div>

              {/* Pemeriksa Praktikal */}
              <div className="grid grid-cols-[150px_1fr] gap-4">
                <span className="text-gray-400 font-bold text-right py-1">
                  <span className="text-brand-red font-bold mr-1">*</span>Senarai Pemeriksa Praktikal:
                </span>
                <div className="space-y-2">
                  <div className="overflow-hidden border border-gray-200 rounded-sm">
                    <table className="w-full">
                      <thead className="bg-[#D1D5DB]">
                        <tr>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal border-r border-gray-300">Nama</th>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal border-r border-gray-300">No. KP/Pasport</th>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal border-r border-gray-300 text-center">Alamat</th>
                          <th className="px-3 py-1.5 text-left text-[11px] font-black text-charcoal">No. Jurulatih/Waran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pemeriksa.map((pr) => (
                          <tr key={pr.id} className="border-t border-gray-100">
                            <td className="px-3 py-1.5">
                              <div className="flex items-center gap-2">
                                {isEditable && (
                                  <button onClick={() => removePemeriksa(pr.id)} className="text-black font-bold hover:text-brand-red">X</button>
                                )}
                                <span className="font-bold uppercase">{pr.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-1.5">{pr.ic}</td>
                            <td className="px-3 py-1.5 text-xs text-gray-500">{pr.address}</td>
                            <td className="px-3 py-1.5">{pr.waran}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {isEditable && (
                    <button 
                      onClick={addPemeriksa}
                      className="border border-gray-400 px-4 py-1 flex items-center gap-2 text-action-teal font-bold text-xs rounded-sm hover:bg-gray-50"
                    >
                      <span className="text-lg leading-none">+</span> Tambah
                    </button>
                  )}
                </div>
              </div>

              {/* Candidate Table - Figure 12 Style */}
              <div className="grid grid-cols-[150px_1fr] gap-4">
                <span className="text-gray-400 font-bold text-right py-1">Senarai Calon:</span>
                <div className="overflow-hidden border border-gray-300 rounded-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#D1D5DB]">
                      <tr className="divide-x divide-gray-400">
                        <th className="px-3 py-2 text-[11px] font-black text-charcoal">Nama</th>
                        <th className="px-3 py-2 text-[11px] font-black text-charcoal">No. KP/Pasport</th>
                        <th className="px-3 py-2 text-[11px] font-black text-charcoal">No. Ahli BSMM</th>
                        <th className="px-2 py-2 text-[10px] font-black text-charcoal text-center w-20 leading-tight">Kehadiran (Teori)</th>
                        <th className="px-2 py-2 text-[10px] font-black text-charcoal text-center w-20 leading-tight">Kehadiran (Lisan)</th>
                        <th className="px-2 py-2 text-[10px] font-black text-charcoal text-center w-20 leading-tight">Kehadiran (Praktikal)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {candidates.map((c) => (
                        <tr key={c.id} className="divide-x divide-gray-300">
                          <td className="px-3 py-2 font-bold uppercase">{c.name}</td>
                          <td className="px-3 py-2">{c.idNo}</td>
                          <td className="px-3 py-2">{c.membershipNo}</td>
                          {['theory', 'oral', 'practical'].map(type => (
                            <td key={type} className="px-3 py-2 text-center">
                              <input 
                                type="checkbox"
                                checked={c.attendance?.[type as keyof NonNullable<Candidate['attendance']>] || false}
                                onChange={() => toggleAttendance(c.id, type as any)}
                                disabled={!isEditable}
                                className="w-4 h-4 cursor-pointer"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-white border-t border-gray-300">
                      <tr className="divide-x divide-gray-300">
                        <td colSpan={3} className="px-3 py-2 text-right font-bold bg-gray-50">Kehadiran</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-500">{totals.theory}/{totals.totalCount}</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-500">{totals.oral}/{totals.totalCount}</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-500">{totals.practical}/{totals.totalCount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-[150px_1fr_1fr] gap-4 mt-6">
              <span className="text-gray-400 font-bold text-right pt-1">Bilangan Calon:</span>
              <div className="space-y-1">
                <div className="flex gap-4 items-center">
                  <span className="text-gray-500 font-medium">Jumlah Calon :</span>
                  <span className="text-lg font-black">{totals.totalCount}</span>
                </div>
                <div className="pl-4 space-y-0.5">
                  <div className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Ahli :</span>
                    <span className="font-bold">{totals.members}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Bukan Ahli :</span>
                    <span className="font-bold">{totals.nonMembers}</span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <span className="text-gray-400 font-bold block">Pilihan bahasa dalam peperiksaan:</span>
                <div className="flex justify-end gap-4 font-black">
                  <span>BM : {totals.lang.bm}</span>
                  <span>BI : {totals.lang.bi}</span>
                  <span>BC : {totals.lang.bc}</span>
                </div>
              </div>
            </div>

            {/* Payment Section - Pink Background Style */}
            <div className="bg-[#FFEFEF] border border-[#FFD0D0] p-6 rounded-sm space-y-2 relative mt-8">
              <div className="grid grid-cols-[150px_1fr] gap-x-4">
                <span className="text-gray-500 text-right font-medium">Pembayaran:</span>
                <div className="space-y-2">
                  <p className="font-medium">Bayaran yuran peperiksaan (Ahli) <span className="font-black">{totals.members}</span> x RM 2.00/calon = <span className="font-black">RM {fees.memberTotal.toFixed(2)}</span></p>
                  <p className="font-medium">Bayaran yuran peperiksaan (Bukan Ahli) <span className="font-black">{totals.nonMembers}</span> x RM 14.00/calon = <span className="font-black">RM {fees.nonMemberTotal.toFixed(2)}</span></p>
                  <p className="font-medium pt-1 border-t border-red-100">Jumlah bayaran yuran peperiksaan = <span className="font-black">RM {fees.grandTotal.toFixed(2)}</span></p>
                </div>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] gap-x-4 pt-4">
                <span className="text-gray-500 text-right font-medium">Lampiran Pembayaran:</span>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <button 
                    onClick={() => setAlertDialog({message: `Membuka fail: ${examData.attachment.name}`})}
                    className="text-blue-600 hover:underline font-bold underline decoration-1 underline-offset-4 text-left"
                  >
                    {examData.attachment.name}
                  </button>
                  <span className="text-gray-400 text-xs">({examData.attachment.size})</span>
                </div>
              </div>
            </div>

            {/* Footer Actions - Flexible based on Role and Mode (Figure 15) */}
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-300 flex-wrap">
                <button 
                  onClick={onBack}
                  className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-blue-600"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Kembali
                </button>
                
                <button 
                  onClick={handlePrint}
                  className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-blue-600"
                >
                  <Printer className="w-3 h-3" />
                  Cetak
                </button>

                {/* DEC View Mode Actions */}
                {isEditable && role === UserRole.DEC && (
                  <>
                    <button 
                      onClick={() => {
                        handleSave();
                        triggerNotification('Maklumat berjaya disimpan sebagai draf.');
                      }}
                      className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-action-teal"
                    >
                      <Save className="w-3 h-3" />
                      Simpan
                    </button>
                    {(isSummaryReadyFinal || localStatus === ExamStatus.APPROVED) && !isExpired && (
                      <button 
                        onClick={handleSubmit}
                        className="flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-green-50 font-bold text-[11px] text-action-teal shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        Hantar Rumusan Peperiksaan
                      </button>
                    )}
                    <button 
                      onClick={() => setIsEditable(false)}
                      className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-brand-red"
                    >
                      Batal
                    </button>
                  </>
                )}
                {!isEditable && role === UserRole.DEC && localStatus !== ExamStatus.SUBMITTED && (
                  <>
                    {(isSummaryReadyFinal || initialEditMode || localStatus === ExamStatus.APPROVED) && !isExpired && (
                      <button 
                        onClick={() => setIsEditable(true)}
                        className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-blue-600"
                      >
                        <Edit3 className="w-3 h-3" />
                        Ubah
                      </button>
                    )}

                    {(isSummaryReadyFinal || localStatus === ExamStatus.APPROVED) && (
                      <>
                        {!isExpired && (
                          <button 
                            onClick={handleSubmit}
                            className="flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-green-50 font-bold text-[11px] text-action-teal shadow-sm"
                          >
                            <Send className="w-3 h-3" />
                            Hantar Rumusan Peperiksaan
                          </button>
                        )}

                        <button 
                          onClick={handleRenew}
                          className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-blue-600"
                        >
                          <FileText className="w-3 h-3" />
                          Memperbaharui Kursus?
                        </button>
                      </>
                    )}
                  </>
                )}
            </div>
          </>
        )}
      </motion.div>
    )}

      {/* Unlock Dialog (Figure 16) */}
      {showUnlockDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-2xl w-full max-w-lg border border-gray-300 overflow-hidden"
          >
            <div className="border border-gray-300 m-2 p-4 space-y-4">
              <div className="p-3 border border-gray-300 font-bold text-xs leading-relaxed">
                <p className="text-gray-500 mb-2 underline">Nota</p>
                <p className="mb-2">Tarikh akhir penyerahan telah lepas, dan anda tidak dibenarkan untuk mengemukakan Exam Return Report sehingga ia dibuka.</p>
                <p>Permohonan untuk membuka pertama adalah percuma, tetapi anda perlu bayar untuk permohonan yang seterusnya.</p>
              </div>

              <div className="text-center py-4 space-y-4">
                <p className="text-base font-bold text-charcoal flex flex-col">
                  Tarikh akhir penyerahan: <span className="text-red-600 text-xl font-black">{examData.deadline}</span>
                </p>
                <p className="text-base font-bold text-charcoal px-8">
                  Adakah anda ingin memohon untuk peperiksaan ini dibuka?
                </p>
              </div>

              <div className="flex justify-center gap-3 border-t border-gray-100 pt-4 pb-2">
                <button 
                  onClick={() => setShowUnlockDialog(false)}
                  className="flex items-center gap-2 px-4 py-1 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded text-xs font-bold"
                >
                  <span className="text-red-500 font-black">X</span> Tidak
                </button>
                <button 
                  onClick={confirmUnlock}
                  className="flex items-center gap-2 px-4 py-1 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded text-xs font-bold"
                >
                  <span className="text-green-600 font-black">✓</span> Ya
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* SEC Unlock Dialog (Figure 18 & 19) */}
      {showSECUnlockDialog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded shadow-xl w-full max-w-xl border border-gray-400 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {isSecondUnlock && (
                <div className="p-3 border border-gray-300 font-bold text-[11px] leading-relaxed bg-white">
                  <p className="text-charcoal mb-2 underline">Nota</p>
                  <p className="mb-2">Tarikh akhir penyerahan telah lepas, dan anda tidak dibenarkan untuk mengemukakan Exam Return Report sehingga ia dibuka.</p>
                  <p>Permohonan untuk membuka pertama adalah percuma, tetapi anda perlu bayar untuk permohonan yang seterusnya.</p>
                </div>
              )}

              <div className="text-center py-6 space-y-4">
                <p className="text-base font-bold text-charcoal">
                  Tarikh akhir penyerahan: <span className="text-red-500">{examData.deadline}</span>
                </p>
                
                <p className="text-lg font-black text-charcoal">
                  {isSecondUnlock 
                    ? "Adakah anda ingin memohon untuk pemeriksaan ini dibuka?" 
                    : "Adakah anda ingin membuka peperiksaan ini?"}
                </p>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500">Tarikh Akhir Penyerahan Baru:</span>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={toInputDate(newDueDate)}
                        onChange={(e) => setNewDueDate(fromInputDate(e.target.value))}
                        className="border border-gray-300 rounded px-8 py-1 text-xs font-bold focus:outline-none" 
                      />
                      <Calendar className="w-3.5 h-3.5 text-orange-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {isSecondUnlock && (
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center px-4 mt-4">
                    <span className="text-gray-500 text-right text-xs font-bold">Lampiran Pembayaran</span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 p-2 border border-blue-200 bg-blue-50/30 rounded">
                        <button className="bg-gray-100 border border-gray-300 px-3 py-1 text-[10px] font-bold rounded shadow-sm">Browse...</button>
                        <span className="text-xs text-gray-600 truncate">{paymentFile || 'rena-deco-clay-craft-map.png'}</span>
                      </div>
                      <input 
                        className="border border-gray-300 rounded px-3 py-1 text-xs" 
                        placeholder="Sila masukkan deskripsi pembayaran."
                      />
                    </div>
                  </div>
                )}
                
                {!isSecondUnlock && (
                   <button 
                    onClick={() => setIsSecondUnlock(true)}
                    className="text-[10px] text-blue-500 underline font-bold"
                   >
                     Tukar ke permohonan berbayar (Unlock Ke-2)
                   </button>
                )}
              </div>

              <div className="flex justify-center gap-4 bg-gray-50 p-3 border-t border-gray-200">
                <button 
                  onClick={() => setShowSECUnlockDialog(false)}
                  className="flex items-center gap-2 px-6 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded text-xs font-bold shadow-sm"
                >
                  <span className="text-gray-400 font-bold">X</span> Tidak
                </button>
                <button 
                  onClick={confirmSECUnlock}
                  className="flex items-center gap-2 px-6 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded text-xs font-bold shadow-sm"
                >
                  <span className="text-green-600 font-black">✓</span> Ya
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

        {activeTab === 'keputusan' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-sm font-black uppercase mb-4">Kemasukan Keputusan Peperiksaan</h3>
              <div className="overflow-hidden border border-gray-300 rounded-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#D1D5DB]">
                    <tr>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-400">Nama Calon</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-400 text-center">Skor Teori / 100</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-400 text-center">Skor Lisan / 40</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal text-center">Skor Praktikal / 60</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {candidates.map((c) => (
                      <tr key={c.id} className="divide-x divide-gray-300">
                        <td className="px-3 py-2 font-bold uppercase">{c.name}</td>
                        <td className="px-3 py-2">
                          <input 
                            type="number" 
                            disabled={!isEditable || role !== UserRole.SEBC}
                            placeholder="0"
                            className="w-full text-center focus:outline-none bg-transparent"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input 
                            type="number" 
                            disabled={!isEditable || role !== UserRole.SEBC}
                            placeholder="0"
                            className="w-full text-center focus:outline-none bg-transparent"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input 
                            type="number" 
                            disabled={!isEditable || role !== UserRole.SEBC}
                            placeholder="0"
                            className="w-full text-center focus:outline-none bg-transparent"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-center mt-8 gap-4">
                {role === UserRole.SEBC && !isResultsSubmitted && (
                  <>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-action-teal text-white font-bold rounded shadow-md hover:bg-teal-700 transition-all uppercase"
                    >
                      Simpan Keputusan
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmDialog({
                          message: 'Hantar Keputusan Peperiksaan ini?',
                          onConfirm: () => {
                            setIsResultsSubmitted(true);
                            triggerNotification('Keputusan telah dihantar untuk pengesahan.');
                          }
                        });
                      }}
                      className="px-6 py-2 bg-[#C0182A] text-white font-bold rounded shadow-md hover:bg-red-800 transition-all uppercase"
                    >
                      Hantar Keputusan
                    </button>
                  </>
                )}
                {isResultsSubmitted && (
                  <div className="px-6 py-2 bg-green-50 text-green-700 font-bold border border-green-200 rounded flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Keputusan Telah Dihantar
                  </div>
                )}
                <button 
                  onClick={onBack}
                  className="px-6 py-2 border border-gray-300 bg-white text-gray-700 font-bold rounded hover:bg-gray-50 transition-all uppercase"
                >
                  Kembali
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
