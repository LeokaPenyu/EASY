import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, CheckCircle2, Info } from 'lucide-react';

interface ExamTypeSelectionProps {
  onBack: () => void;
  onSelect: (examType: string) => void;
}

export const ExamTypeSelection: React.FC<ExamTypeSelectionProps> = ({ onBack, onSelect }) => {
  const { t } = useLanguage();
  const [examCategory, setExamCategory] = useState<'biasa' | 'berpusat'>('berpusat');
  const [selectedType, setSelectedType] = useState('');

  const berpusatExams = [
    { id: '2016-12-31 - 800/2', text: '2016-12-31 - 800/2' },
    { id: '2017-06-15 - 800/3', text: '2017-06-15 - 800/3' },
  ];

  const biasaExams = [
    { id: '700/1', text: '700/1 - First Aid at Work' },
    { id: '700/2', text: '700/2 - Advanced First Aid' },
    { id: '700/4', text: '700/4 - Basic First Aid' },
  ];

  return (
    <div className="max-w-[720px] mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('registrationTitle')}</h1>
          <p className="text-gray-500 text-sm">Sila pilih jenis peperiksaan untuk diteruskan.</p>
        </div>
      </div>

      <div className="card space-y-8 shadow-md border-gray-200/60 p-8">
        <div className="bg-brand-red/[0.03] border-l-4 border-brand-red p-6 rounded-r-lg flex gap-4">
          <Info className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
          <div className="space-y-3">
            <p className="text-[11px] text-brand-red leading-relaxed font-bold uppercase tracking-wider">
              Arahan Pendaftaran:
            </p>
            <p className="text-[13px] text-charcoal/80 leading-relaxed">
              Sila pilih jenis peperiksaan kemudian klik butang <span className="font-bold text-action-teal">PILIH</span> untuk memulakan permohonan.
            </p>
            <p className="text-xs text-gray-500 italic bg-white/50 p-2 rounded border border-gray-100">
              {t('peperiksaanBerpusatNote')}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Kategori Peperiksaan</label>
            <div className="flex gap-6 p-4 bg-gray-50 border border-gray-200 rounded-[6px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="examCategory" 
                  value="biasa" 
                  checked={examCategory === 'biasa'} 
                  onChange={() => {
                    setExamCategory('biasa');
                    setSelectedType('');
                  }}
                  className="w-4 h-4 text-action-teal focus:ring-action-teal"
                />
                <span className="text-sm text-charcoal font-semibold">Peperiksaan Biasa</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="examCategory" 
                  value="berpusat" 
                  checked={examCategory === 'berpusat'} 
                  onChange={() => {
                    setExamCategory('berpusat');
                    setSelectedType('');
                  }}
                  className="w-4 h-4 text-action-teal focus:ring-action-teal"
                />
                <span className="text-sm text-charcoal font-semibold">Peperiksaan Berpusat</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('examTypeLabel')}</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-action-teal/10 transition-all font-semibold text-charcoal"
            >
              <option value="">{t('examTypePlaceholder')}</option>
              {examCategory === 'berpusat' 
                ? berpusatExams.map(ex => <option key={ex.id} value={ex.id}>{ex.text}</option>)
                : biasaExams.map(ex => <option key={ex.id} value={ex.id}>{ex.text}</option>)
              }
            </select>
          </div>
        </div>

        <button 
          disabled={!selectedType}
          onClick={() => onSelect(selectedType)}
          className={`w-full h-14 flex justify-center items-center rounded-[6px] font-bold transition-all shadow-lg ${
            selectedType 
            ? 'bg-action-teal text-white shadow-action-teal/20 hover:bg-action-teal/90 active:scale-[0.98]' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          {t('pilih')}
        </button>
      </div>
    </div>
  );
};
