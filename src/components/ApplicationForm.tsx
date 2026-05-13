import React from 'react';
import { CandidateTable } from './CandidateTable';
import { ApplicationFormState, Candidate } from '../types';
import { MockExam } from '../data/mockExams';
import { useLanguage } from '../context/LanguageContext';
import { ExamStatus } from '../types';
import { 
  Building2, 
  CheckCircle2,
  ChevronLeft, 
  FileText, 
  Globe, 
  MapPin, 
  Save, 
  Send, 
  Stethoscope, 
  UserSquare2 
} from 'lucide-react';

interface ApplicationFormProps {
  goBack: () => void;
  onSubmit: (exam: MockExam) => void;
  onSaveDraft: (exam: MockExam) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ goBack, onSubmit, onSaveDraft }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<'permohonan' | 'rumusan' | 'keputusan'>('permohonan');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [form, setForm] = React.useState<ApplicationFormState>({
    district: '',
    organizationName: '',
    category: 'Private',
    examAddress: '',
    trainingOfficerName: '',
    trainingOfficerId: '',
    language: 'BM',
    paymentDescription: '',
    attachment: undefined,
    candidates: [],
  });

  const [confirmDialog, setConfirmDialog] = React.useState<{message: string, onConfirm: () => void} | null>(null);
  const [alertDialog, setAlertDialog] = React.useState<{message: string, onClose?: () => void} | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlertDialog({ message: 'Saiz fail melebihi 5MB.' });
        return;
      }
      setForm(prev => ({
        ...prev,
        attachment: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          file: file
        }
      }));
    }
  };

  const handleInputChange = (field: keyof ApplicationFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateNewExam = (status: ExamStatus): MockExam => {
    const id = `EXAM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const regNo = `${form.district.substring(0, 3).toUpperCase()}/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    
    // Map candidates to match ExamSummaryView/MockExam expected format
    const mappedCandidates = form.candidates.map(c => ({
      id: c.id,
      name: c.name,
      idNo: c.icNumber,
      membershipNo: c.membershipId,
      isMember: c.isMember || (c.membershipId ? c.membershipId.trim() !== '' : false),
      attendance: c.attendance || { theory: false, oral: false, practical: false }
    }));

    return {
      id,
      no: Math.floor(Math.random() * 100) + 10,
      regNo,
      district: form.district.toUpperCase() || 'DAERAH',
      date: formattedDate,
      fee: mappedCandidates.reduce((acc, c) => acc + (c.isMember ? 2 : 14), 0),
      candidatesCount: mappedCandidates.length,
      subject: '800/2 - Pertolongan Cemas Asas dan CPR',
      updated: 'Tidak',
      status,
      organization: form.organizationName || 'Organisasi',
      unitName: form.organizationName || 'Unit',
      category: form.category || 'Private',
      courseStart: '10/05/2026',
      courseEnd: '12/05/2026',
      examDate: formattedDate,
      deadline: '20/05/2026',
      address: form.examAddress || 'Alamat Peperiksaan',
      candidates: mappedCandidates,
      attachment: form.attachment ? {
        name: form.attachment.name,
        size: form.attachment.size
      } : undefined
    };
  };

  const handleSaveDraft = () => {
    if (!form.district || !form.organizationName) {
      setAlertDialog({ message: 'Sila lengkapkan maklumat wajib (Daerah & Nama Organisasi).' });
      return;
    }
    const newExam = generateNewExam(ExamStatus.DRAFT);
    onSaveDraft(newExam);
    setAlertDialog({ message: 'Permohonan telah disimpan sebagai draf.' });
  };

  const handleSubmit = () => {
    const missingFields = [];
    if (!form.district) missingFields.push('Daerah');
    if (!form.organizationName) missingFields.push('Nama Organisasi');
    if (!form.examAddress) missingFields.push('Alamat Peperiksaan');
    if (!form.trainingOfficerName) missingFields.push('Nama Pegawai');
    if (!form.trainingOfficerId) missingFields.push('No. Kad Ahli Pegawai');

    if (missingFields.length > 0) {
      setAlertDialog({ message: `Sila lengkapkan maklumat berikut: ${missingFields.join(', ')}` });
      return;
    }
    if (form.candidates.length === 0) {
      setAlertDialog({ message: 'Sila tambah sekurang-kurangnya seorang calon.' });
      return;
    }
    setConfirmDialog({
      message: 'Hantar Permohonan ini untuk pengesahan?',
      onConfirm: () => {
        const newExam = generateNewExam(ExamStatus.SUBMITTED);
        console.log('Submitting new exam:', newExam);
        onSubmit(newExam);
      }
    });
  };

  const tabs = [
    { id: 'permohonan', label: t('tabApplication') },
    { id: 'rumusan', label: t('tabSummary') },
    { id: 'keputusan', label: t('tabResult') },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20">
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

      {/* Header & Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('registrationTitle')}</h1>
            <p className="text-gray-500 text-sm">{t('systemSubtitle')}</p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 md:px-8 py-3 text-sm font-bold transition-all border-b-2 relative ${
                  activeTab === tab.id
                    ? 'border-brand-red text-brand-red'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-brand-red rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'permohonan' ? (
        <div className="max-w-[1100px] mx-auto space-y-8">
          <div className="card bg-brand-red/[0.02] border-l-4 border-brand-red shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
              <h4 className="font-bold text-brand-red text-sm uppercase tracking-widest">{t('registrationInstructions')}</h4>
            </div>
            <ul className="text-xs text-charcoal/70 grid grid-cols-1 md:grid-cols-3 gap-6 list-disc pl-5 leading-relaxed font-medium">
              <li>{t('instructionDate')}</li>
              <li>{t('instructionFee')}</li>
              <li>{t('instructionCsv')}</li>
            </ul>
          </div>

          {/* Section 1: Maklumat Cawangan */}
          <section className="card space-y-8 shadow-sm border-gray-200/60">
            <div className="flex items-center justify-between border-b border-gray-50 pb-5">
              <h3 className="font-bold text-charcoal flex items-center gap-3">
                <div className="p-2 bg-brand-red/5 rounded-lg">
                  <Building2 className="w-5 h-5 text-brand-red" />
                </div>
                <span className="tracking-tight">{t('organizerInfo')}</span>
              </h3>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">SECTION 01</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('districtLabel')} <span className="text-brand-red">*</span></label>
                <select 
                  value={form.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 outline-none transition-all font-medium"
                >
                  <option value="">{t('selectDistrict')}</option>
                  <option value="Kuching">Kuching</option>
                  <option value="Sibu">Sibu</option>
                  <option value="Miri">Miri</option>
                  <option value="Bintulu">Bintulu</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('categoryLabel')} <span className="text-brand-red">*</span></label>
                <div className="flex gap-6 h-[44px] items-center px-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={form.category === 'Private'}
                        onChange={() => handleInputChange('category', 'Private')}
                        className="w-4 h-4 text-brand-red accent-brand-red cursor-pointer" 
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-charcoal transition-colors">Private</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={form.category === 'VAD'}
                        onChange={() => handleInputChange('category', 'VAD')}
                        className="w-4 h-4 text-brand-red accent-brand-red cursor-pointer" 
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-charcoal transition-colors">VAD / Unit</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('orgNameLabel')} <span className="text-brand-red">*</span></label>
              <input 
                type="text" 
                value={form.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder={t('orgNamePlaceholder')} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('examAddressLabel')} <span className="text-brand-red">*</span></label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                <textarea 
                  rows={3}
                  value={form.examAddress}
                  onChange={(e) => handleInputChange('examAddress', e.target.value)}
                  placeholder={t('examAddressPlaceholder')} 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium" 
                />
              </div>
            </div>
          </section>

          {/* Section 2: Jurulatih / Pegawai */}
          <section className="card space-y-8 shadow-sm border-gray-200/60">
            <div className="flex items-center justify-between border-b border-gray-50 pb-5">
              <h3 className="font-bold text-charcoal flex items-center gap-3">
                <div className="p-2 bg-brand-red/5 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-brand-red" />
                </div>
                <span className="tracking-tight">{t('officerInfo')}</span>
              </h3>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">SECTION 02</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('officerNameLabel')} <span className="text-brand-red">*</span></label>
                <div className="relative group">
                  <UserSquare2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  <input 
                    type="text" 
                    value={form.trainingOfficerName}
                    onChange={(e) => handleInputChange('trainingOfficerName', e.target.value)}
                    placeholder={t('fullName')} 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('officerIdLabel')} <span className="text-brand-red">*</span></label>
                <input 
                  type="text" 
                  value={form.trainingOfficerId}
                  onChange={(e) => handleInputChange('trainingOfficerId', e.target.value)}
                  placeholder="Contoh: SWOT-9999" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium" 
                />
              </div>
            </div>
          </section>

          {/* Section 3: Senarai Calon Table */}
          <section className="card shadow-sm border-gray-200/60 p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
               <CandidateTable 
                candidates={form.candidates} 
                setCandidates={(candidates) => handleInputChange('candidates', candidates)} 
              />
            </div>
          </section>

          {/* Section 4: Bahas & Lampiran */}
          <section className="card space-y-8 shadow-sm border-gray-200/60">
            <div className="flex items-center justify-between border-b border-gray-50 pb-5">
              <h3 className="font-bold text-charcoal flex items-center gap-3">
                <div className="p-2 bg-brand-red/5 rounded-lg">
                  <Globe className="w-5 h-5 text-brand-red" />
                </div>
                <span className="tracking-tight">{t('languageOptionLabel')} & {t('paymentProofLabel')}</span>
              </h3>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">SECTION 04</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('languageOptionLabel')} <span className="text-brand-red">*</span></label>
                <div className="flex flex-wrap gap-8 px-1">
                  {['BM', 'BI', 'BC'].map((lang) => (
                    <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="language" 
                        checked={form.language === lang}
                        onChange={() => handleInputChange('language', lang)}
                        className="w-4 h-4 text-brand-red accent-brand-red cursor-pointer" 
                      />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-charcoal transition-colors">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('paymentProofLabel')} <span className="text-brand-red">*</span></label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-[12px] p-8 text-center space-y-3 transition-all cursor-pointer group ${
                    form.attachment 
                      ? 'border-green-300 bg-green-50/30' 
                      : 'border-gray-200 bg-gray-50/50 hover:border-action-teal/40 hover:bg-action-teal/[0.02]'
                  }`}
                >
                  {form.attachment ? (
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                  ) : (
                    <FileText className="w-10 h-10 text-gray-300 mx-auto group-hover:text-action-teal group-hover:scale-110 transition-all" />
                  )}
                  <div className="space-y-1">
                    <p className="text-[13px] font-bold text-charcoal">
                      {form.attachment ? form.attachment.name : t('uploadReceipt')}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {form.attachment ? form.attachment.size : 'PDF, JPG, PNG (MAX 5MB)'}
                    </p>
                  </div>
                </div>
                <input 
                  type="text" 
                  placeholder={t('paymentDescriptionPlaceholder')} 
                  value={form.paymentDescription}
                  onChange={(e) => handleInputChange('paymentDescription', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-action-teal/10 font-medium" 
                />
              </div>
            </div>
          </section>

          {/* Action Buttons at Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-10 border-t border-gray-200">
            <button 
              onClick={goBack}
              className="w-full md:w-auto px-8 py-3 text-sm font-bold text-gray-400 hover:text-charcoal transition-colors tracking-wide uppercase"
            >
              {t('back')}
            </button>
            <button 
              onClick={handleSaveDraft}
              className="btn-secondary w-full md:w-auto h-12 flex justify-center items-center px-8 text-sm shadow-sm uppercase tracking-wide"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('save')}
            </button>
            <button 
              onClick={handleSubmit}
              className="btn-primary w-full md:w-auto h-12 px-12 flex justify-center items-center shadow-lg shadow-action-teal/10 text-sm uppercase tracking-widest"
            >
              <Send className="w-4 h-4 mr-2" />
              {t('submit')}
            </button>
          </div>
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center p-20 text-center space-y-4">
          <div className="bg-gray-100 p-8 rounded-full">
            <FileText className="w-16 h-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold">{t('moduleLocked')}</h2>
          <p className="text-gray-500 max-w-sm">{t('modulePendingTitle')}</p>
        </div>
      )}
    </div>
  );
};
