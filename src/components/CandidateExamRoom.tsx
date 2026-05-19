import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Clock, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { sharedQuestions, Question } from '../data/mockQuestions';
import { useLanguage } from '../context/LanguageContext';

export const CandidateExamRoom = ({ examTitle, onFinish }: { examTitle: string, onFinish: () => void }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { translateContent } = useLanguage();

  const q = sharedQuestions[currentQIndex];

  const handleSelectOption = (opt: string) => {
    setAnswers({ ...answers, [q.id]: opt });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl border border-gray-100 rounded-2xl flex flex-col items-center mt-12 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Peperiksaan Selesai</h2>
        <p className="text-gray-500 mb-8 max-w-md">Terima kasih kerana melengkapkan peperiksaan. Jawapan anda telah direkodkan. Sila rujuk Penyelaras Peperiksaan untuk maklumat lanjut.</p>
        <button onClick={onFinish} className="btn-primary w-full max-w-sm">
          Kembali ke Papan Pemuka
        </button>
      </div>
    );
  }

  if (!sharedQuestions || sharedQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-charcoal mb-2">Tiada soalan</h3>
        <p className="text-gray-500 mb-6">Penyelaras belum memuat naik sebarang soalan untuk peperiksaan ini.</p>
        <button onClick={onFinish} className="btn-secondary">Kembali</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-brand-red/10">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{examTitle}</p>
          <p className="font-medium text-brand-red">Soalan {currentQIndex + 1} / {sharedQuestions.length}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-gray-200">
          <Clock className="w-4 h-4 text-brand-red" />
          <span className="font-mono text-sm font-bold text-charcoal">45:00</span>
        </div>
      </div>

      <motion.div 
        key={currentQIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col"
      >
        <h3 className="text-lg md:text-xl font-bold text-charcoal mb-8 leading-relaxed">
          {translateContent(q.question)}
        </h3>

        <div className="space-y-3 mb-8 flex-1">
          {q.options.map((opt, i) => {
            const isSelected = answers[q.id] === opt;
            const translatedOpt = translateContent(opt);
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  isSelected ? 'border-action-teal bg-teal-50/30' : 'border-gray-100 hover:border-action-teal/40 hover:bg-gray-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-action-teal' : 'border-gray-300'}`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-action-teal" />}
                </div>
                <span className={`text-base ${isSelected ? 'text-charcoal font-bold' : 'text-gray-600'}`}>
                  {translatedOpt}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button 
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex(prev => prev - 1)}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-500 hover:text-brand-red disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Sebelumnya
          </button>
          
          {currentQIndex === sharedQuestions.length - 1 ? (
             <button onClick={() => setSubmitted(true)} className="btn-primary">
               Hantar Jawapan
             </button>
          ) : (
            <button 
              disabled={!answers[q.id]}
              onClick={() => setCurrentQIndex(prev => prev + 1)}
              className="flex items-center gap-2 px-6 py-2 bg-action-teal hover:bg-teal-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
            >
              Seterusnya
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
