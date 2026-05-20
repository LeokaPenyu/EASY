import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, AlertTriangle, ArrowRight, ArrowLeft, Info, Play, AlertCircle, Camera, CheckSquare, Square } from 'lucide-react';
import { sharedQuestions, Question } from '../data/mockQuestions';
import { useLanguage } from '../context/LanguageContext';

export const CandidateExamRoom = ({ examTitle, onFinish }: { examTitle: string, onFinish: () => void }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const { translateContent } = useLanguage();

  // Verification State
  const [checks, setChecks] = useState({
    doc: false,
    id: false,
    cam: false,
    net: false,
    noCamAck: false
  });
  const [streamActive, setStreamActive] = useState(false);
  const [camError, setCamError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (!hasStarted && !submitted) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setStreamActive(true);
          setCamError(false);
        })
        .catch(err => {
          console.error("Webcam error:", err);
          setCamError(true);
          setStreamActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasStarted, submitted]);

  const allChecksPassed = checks.doc && checks.id && checks.net && (streamActive ? checks.cam : checks.noCamAck);

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

  const q = sharedQuestions[currentQIndex];

  const handleSelectOption = (opt: string) => {
    setAnswers({ ...answers, [q?.id]: opt });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl border border-gray-100 rounded-2xl flex flex-col items-center mt-12 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">{translateContent('Peperiksaan Selesai')}</h2>
        <p className="text-gray-500 mb-8 max-w-md">{translateContent('Terima kasih kerana melengkapkan peperiksaan. Jawapan anda telah direkodkan. Sila rujuk Penyelaras Peperiksaan untuk maklumat lanjut.')}</p>
        <button onClick={onFinish} className="bg-brand-red hover:bg-brand-red-deep text-white font-bold py-3 px-6 rounded-lg transition-colors w-full max-w-sm">
          {translateContent('Kembali ke Papan Pemuka')}
        </button>
      </div>
    );
  }

  if (!sharedQuestions || sharedQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-charcoal mb-2">{translateContent('Tiada soalan')}</h3>
        <p className="text-gray-500 mb-6">{translateContent('Penyelaras belum memuat naik sebarang soalan untuk peperiksaan ini.')}</p>
        <button onClick={onFinish} className="bg-gray-100 hover:bg-gray-200 text-charcoal font-bold py-2 px-6 rounded-lg transition-colors">{translateContent('Kembali')}</button>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white shadow-xl border border-gray-100 rounded-2xl mt-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-charcoal mb-2">{translateContent(examTitle)}</h2>
          <p className="text-gray-500 max-w-md">{translateContent('Sila baca arahan di bawah sebelum memulakan peperiksaan anda.')}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
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
              <Camera className="w-5 h-5 text-action-teal" />
              {translateContent('Langkah 1: Pengesahan Identiti & Kamera')}
            </h3>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={checks.doc} onChange={e => setChecks({...checks, doc: e.target.checked})} className="mt-1 w-5 h-5 text-action-teal rounded border-gray-300 focus:ring-action-teal" />
                  <span className="text-sm text-gray-700 group-hover:text-charcoal">{translateContent('I confirm my physical MyKad / Passport is in hand')}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={checks.id} onChange={e => setChecks({...checks, id: e.target.checked})} className="mt-1 w-5 h-5 text-action-teal rounded border-gray-300 focus:ring-action-teal" />
                  <span className="text-sm text-gray-700 group-hover:text-charcoal">{translateContent('I confirm I am the registered candidate (Name: Ahmad Faiz, IC: 880101-13-XXXX)')}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={checks.net} onChange={e => setChecks({...checks, net: e.target.checked})} className="mt-1 w-5 h-5 text-action-teal rounded border-gray-300 focus:ring-action-teal" />
                  <span className="text-sm text-gray-700 group-hover:text-charcoal">{translateContent('My internet connection is stable')}</span>
                </label>
                
                {streamActive && (
                  <label className="flex items-start gap-3 cursor-pointer group pt-2 border-t border-slate-200 mt-2">
                    <input type="checkbox" checked={checks.cam} onChange={e => setChecks({...checks, cam: e.target.checked})} className="mt-1 w-5 h-5 text-action-teal rounded border-gray-300 focus:ring-action-teal" />
                    <span className="text-sm font-semibold text-charcoal">{translateContent('My webcam is active and I can be seen clearly')}</span>
                  </label>
                )}
                {camError && (
                  <label className="flex items-start gap-3 cursor-pointer group pt-2 border-t border-slate-200 mt-2">
                    <input type="checkbox" checked={checks.noCamAck} onChange={e => setChecks({...checks, noCamAck: e.target.checked})} className="mt-1 w-5 h-5 text-brand-red rounded border-brand-red focus:ring-brand-red" />
                    <span className="text-sm font-semibold text-brand-red">{translateContent('I acknowledge my webcam is unavailable, and I proceed at my own risk.')}</span>
                  </label>
                )}
              </div>

              <div className="w-full md:w-[200px] shrink-0 flex flex-col items-center">
                <div className="w-full h-[150px] bg-gray-900 rounded-xl overflow-hidden relative border-2 border-slate-200 shadow-inner flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {!streamActive && !camError && (
                    <span className="absolute text-white text-xs text-center px-4 font-medium animate-pulse">{translateContent('Starting camera...')}</span>
                  )}
                  {camError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gray-900">
                      <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                      <span className="text-white text-xs leading-tight font-medium pb-2 text-amber-400">{translateContent('Webcam access required. Please allow camera permissions.')}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-bold mt-2 uppercase tracking-wide">{translateContent('Live Webcam — Exam Board can see you')}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          disabled={!allChecksPassed}
          onClick={() => setHasStarted(true)} 
          className={`w-full font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-lg
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
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="mb-4 flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-brand-red/10">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{translateContent(examTitle)}</p>
          <p className="font-medium text-brand-red">{translateContent('Soalan')} {currentQIndex + 1} / {sharedQuestions.length}</p>
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
            {q.options.map((opt, i) => {
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
            })}
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
               <button onClick={() => setSubmitted(true)} className="bg-action-teal hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                 {translateContent('Hantar Jawapan')}
               </button>
            ) : (
              <button 
                disabled={!answers[q.id]}
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="flex items-center gap-2 px-6 py-2 bg-action-teal hover:bg-teal-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
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
