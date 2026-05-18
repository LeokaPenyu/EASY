import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, FileUp, CheckCircle, Database, Edit2, Trash2, Plus } from 'lucide-react';
import Papa from 'papaparse';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const mockQuestions: Question[] = [
  {
    question: "Apakah prinsip pertama di dalam pergerakan Palang Merah?",
    options: ["Kemanusiaan", "Kesaksamaan", "Keberkecualian", "Kebebasan"],
    answer: "Kemanusiaan"
  },
  {
    question: "Berapakah bilangan prinsip asas pergerakan Palang Merah dan Bulan Sabit Merah?",
    options: ["5", "6", "7", "8"],
    answer: "7"
  }
];

export const QuestionBankModule = () => {
  const [locked, setLocked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadSuccessMsg(true);
      setTimeout(() => setUploadSuccessMsg(false), 5000);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        Papa.parse<string[]>(text, {
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            if (data.length === 0) return;
            
            let startIndex = 0;
            const headerStr = data[0].join(' ').toLowerCase();
            if (headerStr.includes('soalan') || headerStr.includes('question') || headerStr.includes('jawapan')) {
              startIndex = 1;
            }

            const parsed: Question[] = data.slice(startIndex).map(row => {
              const optionA = row[1] && row[1].trim() !== '' ? row[1] : '';
              const optionB = row[2] && row[2].trim() !== '' ? row[2] : '';
              const optionC = row[3] && row[3].trim() !== '' ? row[3] : '';
              const optionD = row[4] && row[4].trim() !== '' ? row[4] : '';
              
              const options = [optionA, optionB, optionC, optionD].filter(o => o !== '');
              const rawAnswer = row[5] ? row[5].trim() : '';
              let answerText = rawAnswer;
              if (rawAnswer.toUpperCase() === 'A' && optionA) answerText = optionA;
              if (rawAnswer.toUpperCase() === 'B' && optionB) answerText = optionB;
              if (rawAnswer.toUpperCase() === 'C' && optionC) answerText = optionC;
              if (rawAnswer.toUpperCase() === 'D' && optionD) answerText = optionD;

              return {
                question: row[0] || 'Soalan Tidak Diketahui',
                options: options.length > 0 ? options : ['Tiada', 'Pilihan', 'Disertakan'],
                answer: answerText || options[0] || 'Tiada'
              };
            });
            
            if (parsed.length > 0) {
              setQuestions([...parsed, ...questions]);
            }
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const handleDelete = (index: number) => {
    if (locked) return;
    const newQ = [...questions];
    newQ.splice(index, 1);
    setQuestions(newQ);
  };

  const handleEdit = (index: number) => {
    if (locked) return;
    setEditingIndex(index);
    setEditForm({ ...questions[index] });
  };

  const saveEdit = () => {
    if (editForm && editingIndex !== null) {
      const newQ = [...questions];
      newQ[editingIndex] = editForm;
      setQuestions(newQ);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditForm({ question: '', options: ['', '', '', ''], answer: '' });
    setEditingIndex(-1);
  };

  const saveNew = () => {
    if (editForm) {
      setQuestions([editForm, ...questions]);
      setIsAddingNew(false);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const renderEditForm = () => {
    if (!editForm) return null;
    return (
      <div className="border border-brand-red/20 rounded-lg p-5 bg-red-50/30 shadow-sm mb-4">
        <h4 className="font-bold text-brand-red mb-4">{isAddingNew ? 'Tambah Soalan Baru' : 'Kemaskini Soalan'}</h4>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Soalan</label>
            <textarea 
              value={editForm.question}
              onChange={(e) => setEditForm({...editForm, question: e.target.value})}
              className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none"
              rows={2}
              placeholder="Masukkan soalan di sini..."
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Pilihan Jawapan</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {editForm.options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="w-8 h-8 shrink-0 rounded bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <input 
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOps = [...editForm.options];
                      newOps[idx] = e.target.value;
                      setEditForm({...editForm, options: newOps});
                    }}
                    placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                    className="flex-1 border border-gray-200 rounded-md p-2.5 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Jawapan Tepat</label>
            <input 
              type="text"
              value={editForm.answer}
              onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
              placeholder="Cth: A, Kemanusiaan"
              className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-2">
            <button onClick={isAddingNew ? () => {setIsAddingNew(false); cancelEdit();} : cancelEdit} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">Batal</button>
            <button onClick={isAddingNew ? saveNew : saveEdit} className="px-5 py-2 bg-action-teal text-white rounded-md text-sm font-bold shadow-sm hover:bg-teal-700 transition-colors">Simpan Soalan</button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-charcoal flex items-center gap-2">
            <Database className="w-6 h-6 text-brand-red" />
            Bank Soalan
          </h2>
          {locked ? (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Dikunci
            </span>
          ) : (
            <button onClick={() => setLocked(true)} className="btn-secondary text-xs p-2">Kunci Soalan</button>
          )}
        </div>
        
        <AnimatePresence>
          {uploadSuccessMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }} 
              animate={{ opacity: 1, y: 0, x: '-50%' }} 
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-20 left-1/2 z-[100] p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-green-800 shadow-xl min-w-[400px]"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm font-bold">Berjaya! Bank soalan telah dikemas kini daripada fail CSV anda.</p>
              </div>
              <button onClick={() => setUploadSuccessMsg(false)} className="text-green-500 hover:text-green-700 ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border border-dashed border-gray-300 p-8 rounded-xl flex flex-col items-center justify-center text-center bg-gray-50/50">
           {uploadedFile ? (
             <AnimatePresence>
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                 <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
                 <p className="text-[15px] font-bold text-gray-800 mb-1">{uploadedFile.name}</p>
                 <p className="text-xs text-gray-500 mb-4">Fail CSV berjaya dimuat naik dan diproses!</p>
                 <button 
                   onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                   className="text-action-teal text-sm font-bold mt-2 hover:text-teal-700 flex items-center gap-1"
                   disabled={locked}
                 >
                   <FileUp className="w-4 h-4" /> Muat Naik Fail Lain
                 </button>
               </motion.div>
             </AnimatePresence>
           ) : (
             <>
               <FileUp className="w-10 h-10 text-brand-red/50 mb-3" />
               <p className="text-[15px] font-bold text-gray-800 mb-1">Muat Naik CSV Soalan Objektif</p>
               <p className="text-xs text-gray-500 mb-5">Format yang disyorkan: Soalan, Pilihan A, B, C, D, Jawapan</p>
               <button 
                 onClick={handleUploadClick}
                 disabled={locked} 
                 className="bg-brand-red text-white px-6 py-2.5 rounded-[6px] font-bold text-sm shadow-sm hover:bg-red-700 disabled:opacity-50 transition-all"
               >
                 Tarik fail atau Klik untuk Muat Naik
               </button>
             </>
           )}
           <input 
             type="file" 
             ref={fileInputRef}
             className="hidden" 
             accept=".csv"
             onChange={handleFileChange}
           />
        </div>
        
        {questions.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-lg font-bold text-gray-800">Senarai Soalan Diproses ({questions.length})</h3>
              <button 
                onClick={handleAddNew}
                disabled={locked || isAddingNew || editingIndex !== null}
                className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Soalan Manual
              </button>
            </div>
            
            {isAddingNew && renderEditForm()}

            <div className="grid grid-cols-1 gap-4">
              {questions.map((q, i) => (
                <div key={i}>
                  {editingIndex === i ? (
                    renderEditForm()
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:border-gray-300 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-charcoal text-[15px] pr-8">
                          <span className="text-brand-red mr-2">{i + 1}.</span>
                          {q.question}
                        </div>
                        {!locked && editingIndex === null && !isAddingNew && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(i)} className="p-1.5 text-gray-400 hover:text-action-teal rounded hover:bg-teal-50" title="Kemaskini">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(i)} className="p-1.5 text-gray-400 hover:text-brand-red rounded hover:bg-red-50" title="Padam">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5">
                        {q.options.map((opt, optIndex) => {
                          const isCorrect = String.fromCharCode(65 + optIndex) === q.answer.toUpperCase() || opt.trim().toLowerCase() === q.answer.trim().toLowerCase();
                          return (
                            <div key={optIndex} className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                              isCorrect 
                              ? 'bg-green-50/50 border-green-200 text-green-900 shadow-sm' 
                              : 'bg-gray-50/50 border-gray-100 text-gray-600'
                            }`}>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                                isCorrect ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-500'
                              }`}>
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className={`${isCorrect ? 'font-semibold' : 'font-medium'} text-sm`}>{opt}</span>
                              {isCorrect && <CheckCircle className="w-5 h-5 ml-auto text-green-500" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3 z-10 relative">
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-[6px] font-bold text-sm shadow-sm transition-all text-center">
            Jana Kertas Secara Rawak
          </button>
          <button className="bg-action-teal hover:bg-teal-700 text-white px-8 py-2.5 rounded-[6px] font-bold text-sm shadow-sm transition-all text-center">
            Simpan Bank Soalan
          </button>
        </div>
      </div>
    </motion.div>
  );
};
