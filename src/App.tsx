import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { UserRole, ViewType, ExamStatus } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './context/LanguageContext';
import { 
  Building2,
  CheckCircle2
} from 'lucide-react';

import { ApplicationForm } from './components/ApplicationForm';
import { ExamApplicationModule } from './components/ExamApplicationModule';
import { ExamTypeSelection } from './components/ExamTypeSelection';
import { ExamSummaryView } from './components/ExamSummaryView';
import { mockExams as initialExams, MockExam } from './data/mockExams';

export default function App() {
  const { t } = useLanguage();
  const [activeView, setActiveView] = React.useState<ViewType>('Dashboard');
  const [role, setRole] = React.useState<UserRole>(UserRole.DEC);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [examStep, setExamStep] = React.useState<'list' | 'select' | 'form' | 'summary' | 'success'>('list');
  const [selectedExamId, setSelectedExamId] = React.useState<string | null>(null);
  const [submittedExam, setSubmittedExam] = React.useState<MockExam | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isSummaryReadyView, setIsSummaryReadyView] = React.useState(false);
  const [initialModuleTab, setInitialModuleTab] = React.useState<'borang' | 'rumusan' | 'keputusan'>('borang');
  const [initialModuleStatus, setInitialModuleStatus] = React.useState<string>('');
  const [exams, setExams] = React.useState<MockExam[]>(initialExams);

  const handleAddExam = (exam: MockExam) => {
    setExams(prev => [exam, ...prev]);
  };

  const handleUpdateExam = (id: string, updates: Partial<MockExam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  // Reset to dashboard when role changes
  React.useEffect(() => {
    setActiveView('Dashboard');
    setExamStep('list');
  }, [role]);

  // Reset step when view changes
  React.useEffect(() => {
    if (activeView !== 'ExamApplication') {
      setIsSummaryReadyView(false);
    }
    // Only reset to list if we are not in success or summary mode
    if (activeView === 'ExamApplication' && !isSummaryReadyView && examStep !== 'success' && examStep !== 'summary') {
      setExamStep('list');
      setIsEditMode(false);
    }
  }, [activeView]);

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return (
          <Dashboard 
            role={role} 
            exams={exams}
            onViewExam={(key) => {
              setActiveView('ExamApplication');
              if (key === 'summary-ready') {
                setIsSummaryReadyView(true);
                setExamStep('list');
                setIsEditMode(false);
              } else if (key === 'menunggu-penyerahan') {
                setActiveView('ExamApplication');
                setIsSummaryReadyView(false);
                setInitialModuleTab('rumusan');
                setInitialModuleStatus(ExamStatus.EXPIRED); // "Menunggu Penyerahan" relates to Expired status based on counts
                setExamStep('list');
              } else if (key === 'borang-list') {
                setExamStep('list');
                setIsSummaryReadyView(false);
                setInitialModuleTab('borang');
                setInitialModuleStatus('');
              } else if (key === 'verification-list') {
                setExamStep('list');
                setIsSummaryReadyView(false);
              } else if (key === 'unlock-list') {
                setSelectedExamId('1');
                setIsEditMode(false);
                setExamStep('summary');
                setIsSummaryReadyView(false);
              } else if (key === 'print-list' || key === 'personnel-input' || key === 'results-input') {
                setSelectedExamId('1');
                setExamStep('summary');
                setIsEditMode(false);
                setIsSummaryReadyView(false);
              } else {
                setSelectedExamId(key);
                setIsEditMode(false);
                setIsSummaryReadyView(false);
                setExamStep('summary');
              }
            }} 
          />
        );
      case 'ExamApplication':
        if (examStep === 'list') {
          return (
            <ExamApplicationModule 
              key={`${isSummaryReadyView ? 'summary' : 'normal'}-${initialModuleTab}-${initialModuleStatus}`}
              role={role}
              exams={exams}
              isSummaryReadyMode={isSummaryReadyView}
              initialTab={initialModuleTab}
              initialStatusFilter={initialModuleStatus}
              onAddNew={() => setExamStep('select')} 
              onView={(id) => {
                setSelectedExamId(id);
                setIsEditMode(false);
                setExamStep('summary');
              }}
              onEdit={(id) => {
                setSelectedExamId(id);
                setIsEditMode(true);
                setExamStep('summary');
              }}
              onDelete={(id) => {
                setExams(prev => prev.filter(e => e.id !== id));
              }}
            />
          );
        }
        if (examStep === 'summary' && selectedExamId) {
          return (
            <ExamSummaryView 
              role={role}
              exams={exams}
              examId={selectedExamId}
              onBack={() => {
                setExamStep('list');
              }}
              onUpdateExam={handleUpdateExam}
              onUpdateStatus={(id, status) => handleUpdateExam(id, { status })}
              onSuccess={(exam) => {
                setSubmittedExam(exam);
                setExamStep('success');
              }}
              initialEditMode={isEditMode}
              isSummaryReady={isSummaryReadyView}
            />
          );
        }
        if (examStep === 'select') {
          return <ExamTypeSelection onBack={() => setExamStep('list')} onSelect={(type) => setExamStep('form')} />;
        }
        if (examStep === 'success' && submittedExam) {
          return (
            <div className="max-w-[800px] mx-auto py-12 px-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card text-center space-y-8 py-16 shadow-2xl border-t-8 border-green-500 bg-white"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm transition-transform hover:rotate-12">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-charcoal tracking-tight uppercase">Penyerahan Berjaya!</h2>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                    {isSummaryReadyView 
                      ? 'Sistem telah menerima Rumusan Peperiksaan anda. Rumusan kini dihantar untuk pengesahan SEC.'
                      : 'Sistem telah menerima permohonan peperiksaan anda (DEC). Permohonan kini dihantar untuk pengesahan SEC.'}
                  </p>
                  <p className="text-sm text-action-teal font-bold bg-action-teal/5 py-2 px-4 rounded-full inline-block">
                    Sistem akan memaklumkan Penyelaras Peperiksaan Negeri (SEC) di Cawangan.
                  </p>
                </div>

                <div className="bg-surface-cream border border-gray-100 rounded-xl p-6 max-w-sm mx-auto space-y-4 shadow-sm">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                    <span>No. Pendaftaran</span>
                    <span className="text-charcoal">{submittedExam.regNo}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                    <span>Status Semasa</span>
                    <span className="text-action-teal px-2 py-0.5 bg-action-teal/10 rounded font-black tracking-wider">DIHANTAR</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none pt-2 border-t border-gray-100 italic">
                    <span>Tarikh Hantar</span>
                    <span className="text-charcoal font-medium">{new Date().toLocaleDateString('ms-MY')}</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => {
                      setExamStep('list');
                      setSubmittedExam(null);
                    }}
                    className="btn-primary px-12 py-3 shadow-xl shadow-action-teal/20 uppercase tracking-widest font-bold h-12 rounded-lg"
                  >
                    Kembali ke Senarai
                  </button>
                </div>
                
                <div className="pt-4 space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                    EASY — EXAM ADMINISTRATION SYSTEM
                  </p>
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    Persatuan Bulan Sabit Merah Malaysia
                  </p>
                </div>
              </motion.div>
            </div>
          );
        }
        return (
          <ApplicationForm 
            goBack={() => setExamStep('select')} 
            onSubmit={(newExam) => {
              const submittedWithCorrectStatus = { ...newExam, status: ExamStatus.SUBMITTED };
              handleAddExam(submittedWithCorrectStatus);
              setSubmittedExam(submittedWithCorrectStatus);
              setExamStep('success');
            }}
            onSaveDraft={(newExam) => {
              handleAddExam(newExam);
              setExamStep('list');
              setActiveView('ExamApplication');
            }}
          />
        );
      case 'NewRequest':
        return (
          <ApplicationForm 
            goBack={() => setActiveView('Dashboard')} 
            onSubmit={(newExam) => {
              const submittedWithCorrectStatus = { ...newExam, status: ExamStatus.SUBMITTED };
              handleAddExam(submittedWithCorrectStatus);
              setSubmittedExam(submittedWithCorrectStatus);
              setExamStep('success');
              setActiveView('ExamApplication');
            }}
            onSaveDraft={(newExam) => {
              handleAddExam(newExam);
              setActiveView('ExamApplication');
              setExamStep('list');
            }}
          />
        );
      case 'Calon':
      case 'ExamProfile':
      case 'ExamSchedule':
      case 'Jurulatih':
      case 'Panduan':
        return (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="bg-gray-100 p-8 rounded-full">
              <Building2 className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold">{t(activeView.toLowerCase() as any)} {t('page')}</h2>
            <p className="text-gray-500 max-w-sm">{t('optimizationNotice')}</p>
            <button onClick={() => setActiveView('Dashboard')} className="btn-secondary">{t('back')}</button>
          </div>
        );
      default:
        return <Dashboard role={role} onViewExam={(id) => console.log('View exam', id)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-cream text-charcoal overflow-x-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role={role}
      />
      
      <main className={`flex-1 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'} min-h-screen flex flex-col w-full transition-all duration-300`}>
        <Header 
          role={role} 
          setRole={setRole} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          <div className="max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView + role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="p-4 text-center border-t border-gray-100 bg-white/50 backdrop-blur-sm">
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
            {t('confidentialNotice')}
          </p>
        </footer>
      </main>
    </div>
  );
}
