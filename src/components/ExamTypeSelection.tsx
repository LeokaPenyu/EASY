import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, CheckCircle2, Info } from 'lucide-react';

interface ExamTypeSelectionProps {
  onBack: () => void;
  onSelect: (examType: string) => void;
}

export const ExamTypeSelection: React.FC<ExamTypeSelectionProps> = ({ onBack, onSelect }) => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState('');

  const examTypes = [
    { id: '1', name: '700/1 - First Aid at Work', category: 'Pusat' },
    { id: '2', name: '700/2 - Advanced First Aid', category: 'Daerah' },
    { id: '3', name: '700/3 - Pendidikan Kesihatan Asas', category: 'Pusat' },
    { id: '4', name: '700/4 - Basic First Aid', category: 'Daerah' },
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
              5. Untuk terus menambah rekod baru, sila pilih <span className="font-bold underline decoration-brand-red/30 underline-offset-2">Nama Peperiksaan</span>.<br />
              6. Klik butang <span className="font-bold text-action-teal underline decoration-action-teal/30 underline-offset-2">PILIH</span> untuk memulakan permohonan.
            </p>
            <p className="text-xs text-gray-500 italic bg-white/50 p-2 rounded border border-gray-100">
              {t('peperiksaanBerpusatNote')}
            </p>
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
            {examTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name} — ({type.category.toUpperCase()})
              </option>
            ))}
          </select>
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
