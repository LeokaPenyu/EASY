import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, AlertTriangle, ArrowRight, ArrowLeft, Info, Play, AlertCircle, CheckSquare, XCircle, Ban } from 'lucide-react';
import { sharedQuestions, Question } from '../data/mockQuestions';
import { useLanguage } from '../context/LanguageContext';

export const CandidateExamRoom = ({ examTitle, onFinish }: { examTitle: string, onFinish: () => void }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const { translateContent } = useLanguage();

  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passFail, setPassFail] = useState('');
  const [cooldownTime, setCooldownTime] = useState<Date | null>(null);

  // Verification State
  const [checks, setChecks] = useState({
    doc: false,
    id: false
  });

  const allChecksPassed = checks.doc && checks.id;

  useEffect(() => {
    // Check localStorage for cooldown
    const cooldown = localStorage.getItem(`retest_cooldown_${examTitle}`);
    if (cooldown) {
      const cooldownDate = new Date(cooldown);
      if (new Date() < cooldownDate) {
        setCooldownTime(cooldownDate);
      } else {
        localStorage.removeItem(`retest_cooldown_${examTitle}`);
      }
    }
  }, [examTitle]);

  useEffect(() => {
    let timer: any;
    if (hasStarted && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && hasStarted && !submitted) {
      setSubmitted(true);
    }
    return () => clearInterval(timer);
  }, [hasStarted, submitted, timeLeft]);

  useEffect(() => {
     if (submitted && !showResults) {
       let correctCount = 0;
       sharedQuestions.forEach(q => {
         const userAns = answers[q.id];
         if (userAns) {
           if (!q.category || q.category === 'Objektif') {
             const optIndex = q.options.indexOf(userAns);
             const isCorrect = String.fromCharCode(65 + optIndex) === (q?.answer || '').toUpperCase() || userAns.trim().toLowerCase() === (q?.answer || '').trim().toLowerCase();
             if (isCorrect) correctCount++;
           } else {
             // For subjective/QA, basic loose check or just give point if not empty for mock purposes
             const isCorrect = userAns.trim().toLowerCase() === (q?.answer || '').trim().toLowerCase();
             if (isCorrect || userAns.trim().length > 5) correctCount++;
           }
         }
       });
       const percentage = Math.round((correctCount / sharedQuestions.length) * 100);
       setScore(percentage);
       if (percentage >= 50) { 
         setPassFail('LULUS');
       } else {
         setPassFail('GAGAL');
         // Set 1 hour cooldown
         const oneHourLater = new Date(new Date().getTime() + 60 * 60 * 1000);
         localStorage.setItem(`retest_cooldown_${examTitle}`, oneHourLater.toISOString());
         setCooldownTime(oneHourLater);
       }
       setShowResults(true);
     }
  }, [submitted, showResults, answers, examTitle]);

  const q = sharedQuestions[currentQIndex];

  if (!q && !showResults && !cooldownTime) {
    return (
      <div className="p-4 md:p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-charcoal mb-2">{translateContent('Ralat Peperiksaan')}</h3>
        <p className="text-gray-500 mb-6">{translateContent('Soalan tidak ditemui. Sila hubungi Penyelaras Peperiksaan.')}</p>
        <button onClick={onFinish} className="bg-gray-100 hover:bg-gray-200 text-charcoal font-bold py-2 px-4 md:px-6 rounded-lg transition-colors">{translateContent('Kembali')}</button>
      </div>
    );
  }

  const handleSelectOption = (opt: string) => {
    setAnswers({ ...answers, [q?.id]: opt });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (cooldownTime) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white shadow-xl border border-gray-100 rounded-2xl flex flex-col items-center mt-12 text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
          <Ban className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">{translateContent('Peperiksaan Dikunci Sementara')}</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          {translateContent(`Oleh kerana anda tidak melepasi markah lulus, peperiksaan dihentikan untuk sementara. Sila cuba lagi selepas tempoh menunggu (1 jam).`)}
        </p>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-8 font-medium">
          Dibenarkan mencuba lagi pada: {cooldownTime.toLocaleTimeString()}
        </div>
        <button onClick={onFinish} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 md:px-6 rounded-lg transition-colors w-full max-w-sm">
          {translateContent('Kembali ke Papan Pemuka')}
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white shadow-xl border border-gray-100 rounded-2xl flex flex-col items-center mt-12 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${passFail === 'LULUS' ? 'bg-green-50' : 'bg-red-50'}`}>
          {passFail === 'LULUS' ? <CheckCircle className="w-10 h-10 text-green-500" /> : <XCircle className="w-10 h-10 text-brand-red" />}
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">{translateContent('Rumusan Peperiksaan')}</h2>
        <p className="text-gray-500 mb-6 max-w-md">{translateContent('Terima kasih kerana melengkapkan peperiksaan. Penilaian anda telah direkodkan.')}</p>
        
        <div className="w-full max-w-xs mb-8 flex flex-col items-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">Mata Penilaian</div>
          <div className={`text-5xl font-black mb-2 ${passFail === 'LULUS' ? 'text-green-600' : 'text-brand-red'}`}>{score}%</div>
          <div className={`px-4 py-1 rounded-full text-sm font-bold ${passFail === 'LULUS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-brand-red'}`}>
            {passFail}
          </div>
          {passFail === 'GAGAL' && (
            <p className="mt-4 text-xs font-semibold text-brand-red">Anda perlu menunggu selama 1 jam sebelum mengambil peperiksaan semula.</p>
          )}
        </div>

        <button onClick={onFinish} className="bg-brand-red hover:bg-brand-red-deep text-white font-bold py-3 px-4 md:px-6 rounded-lg transition-colors w-full max-w-sm">
          {translateContent('Kembali ke Papan Pemuka')}
        </button>
      </div>
    );
  }

  if (!sharedQuestions || sharedQuestions.length === 0) {
    return (
      <div className="p-4 md:p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-charcoal mb-2">{translateContent('Tiada soalan')}</h3>
        <p className="text-gray-500 mb-6">{translateContent('Penyelaras belum memuat naik sebarang soalan untuk peperiksaan ini.')}</p>
        <button onClick={onFinish} className="bg-gray-100 hover:bg-gray-200 text-charcoal font-bold py-2 px-4 md:px-6 rounded-lg transition-colors">{translateContent('Kembali')}</button>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white shadow-xl border border-gray-100 rounded-2xl mt-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 text-charcoal rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-charcoal mb-2">{translateContent(examTitle)}</h2>
          <p className="text-gray-500 max-w-md">{translateContent('Sila baca arahan di bawah sebelum memulakan peperiksaan anda.')}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6 mb-8">
          <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-brand-red" />
            {translateContent('Arahan Penting')}
          </h3>
          <ul className="space-y-3 text-sm text-gray-700 mb-8">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full mt-1.5 shrink-0" />
              <span>{translateContent('Masa yang diperuntukkan adalah 45 minit.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full mt-1.5 shrink-0" />
              <span>{translateContent('Terdapat 40 soalan objektif yang perlu dijawab.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full mt-1.5 shrink-0" />
              <span>{translateContent('Sila pastikan sambungan internet anda stabil.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full mt-1.5 shrink-0" />
              <span>{translateContent('Jangan tutup (close) atau muat semula (refresh) pelayar web web semasa peperiksaan sedang berjalan. Jawapan anda mungkin tidak akan direkodkan.')}</span>
            </li>
          </ul>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-action-teal" />
              {translateContent('Langkah 1: Pengesahan Identiti')}
            </h3>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex-1 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={checks.doc} onChange={e => setChecks({...checks, doc: e.target.checked})} className="mt-1 w-5 h-5 text-action-teal rounded border-gray-300 focus:ring-action-teal" />
                  <span className="text-sm text-gray-700 group-hover:text-charcoal">{translateContent('I confirm my physical MyKad / Passport is in hand')}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={checks.id} onChange={e => setChecks({...checks, id: e.target.checked})} className="mt-1 w-5 h-5 text-action-teal rounded border-gray-300 focus:ring-action-teal" />
                  <span className="text-sm text-gray-700 group-hover:text-charcoal">{translateContent('I confirm I am the registered candidate (Name: Ahmad Faiz, IC: 880101-13-XXXX)')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button 
          disabled={!allChecksPassed}
          onClick={() => setHasStarted(true)} 
          className={`w-full font-bold py-4 px-4 md:px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-lg
            ${allChecksPassed 
              ? 'bg-action-teal hover:bg-teal-700 text-white shadow-md hover:shadow-lg' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'}`}
        >
          <Play className="w-6 h-6" fill="currentColor" />
          {translateContent('Mula Peperiksaan Sekarang')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 md:py-6 px-4">
      
      <div className="mb-4 flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-brand-red/10">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{translateContent(examTitle)}</p>
            <p className="font-medium text-brand-red">{translateContent('Soalan')} {currentQIndex + 1} / {sharedQuestions.length}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-700 animate-pulse' : 'bg-slate-50 border-gray-200 text-charcoal'}`}>
          <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-600' : 'text-brand-red'}`} />
          <span className="font-mono text-sm font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[350px] flex flex-col"
        >
          <h3 className="text-base md:text-lg font-bold text-charcoal mb-6 leading-relaxed">
            {translateContent(q.question)}
          </h3>

          <div className="space-y-2 mb-6 flex-1">
            {(!q.category || q.category === 'Objektif') ? (
              q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt;
                const translatedOpt = translateContent(opt);
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                      isSelected ? 'border-action-teal bg-teal-50/30' : 'border-gray-200 hover:border-action-teal/40 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-action-teal' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-action-teal" />}
                    </div>
                    <span className={`text-sm ${isSelected ? 'text-charcoal font-bold' : 'text-gray-600'}`}>
                      {translatedOpt}
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="w-full">
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleSelectOption(e.target.value)}
                  className="w-full min-h-[150px] p-4 rounded-xl border border-gray-200 focus:border-action-teal focus:ring-1 focus:ring-action-teal outline-none resize-y text-sm text-gray-700 font-medium"
                  placeholder={q.category === 'Q/A' ? "Taip jawapan pendek anda di sini..." : "Taip jawapan subjektif/esei anda di sini..."}
                ></textarea>
                <div className="text-right mt-2 text-xs text-gray-400 font-medium">
                  {((answers[q.id] || '').match(/\S+/g) || []).length} patah perkataan
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <button 
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(prev => prev - 1)}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-500 hover:text-brand-red disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {translateContent('Sebelumnya')}
            </button>
            
            {currentQIndex === sharedQuestions.length - 1 ? (
               <button onClick={() => setSubmitted(true)} className="bg-action-teal hover:bg-teal-700 text-white font-bold py-2 px-4 md:px-6 rounded-lg transition-colors">
                 {translateContent('Hantar Jawapan')}
               </button>
            ) : (
              <button 
                disabled={!answers[q.id]}
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="flex items-center gap-2 px-4 md:px-6 py-2 bg-action-teal hover:bg-teal-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
              >
                {translateContent('Seterusnya')}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
