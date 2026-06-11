import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, FileUp, CheckCircle, Database, Edit2, Trash2, Plus, Shuffle, Save, Info, ArrowLeft, Settings, Edit } from 'lucide-react';
import Papa from 'papaparse';
import { sharedQuestions, updateSharedQuestions, Question } from '../data/mockQuestions';
import { useLanguage } from '../context/LanguageContext';

interface Subjek {
  id: string;
  name: string;
  code: string;
  duration: string;
  languages: string[];
}

const initialSubjek: Subjek[] = [
  { id: '1', name: 'Pertolongan Cemas Asas dan CPR', code: '800/2', duration: '14', languages: ['BI', 'BM'] },
  { id: '2', name: 'Pertolongan Cemas Asas, CPR dan AED', code: 'CBFA1021', duration: '14', languages: ['BI', 'BM', 'BC'] },
  { id: '3', name: 'Pendidikan Palang Merah dan Bulan Sabit Merah', code: 'CERC1011', duration: '8', languages: ['BI', 'BM'] },
  { id: '4', name: 'Pendidikan Kesihatan', code: 'CHED1031', duration: '8', languages: ['BI', 'BM'] },
  { id: '5', name: 'Rawatan Rumah', code: 'CHNU1041', duration: '8', languages: ['BI', 'BM'] },
  { id: '6', name: 'PERTOLONGAN CEMAS LANJUTAN, CPR & AED', code: 'PAFA1042', duration: '18 JAM', languages: ['BI', 'BM'] },
  { id: '7', name: 'PENGENALAN PERTOLONGAN CEMAS, CPR & AED', code: 'PIFA 1021', duration: '8 JAM', languages: ['BI', 'BM'] },
];

export const QuestionBankModule = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subjek | null>(null);

  const [locked, setLocked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>(sharedQuestions);
  const { translateContent } = useLanguage();

  // Sync back to shared state so candidates see new updates (simulating a database)
  React.useEffect(() => {
    updateSharedQuestions(questions);
  }, [questions]);

  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(false);
  
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [randomizeSuccessMsg, setRandomizeSuccessMsg] = useState(false);
  const [isRandomized, setIsRandomized] = useState(false);
  
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
                id: 'q_' + Math.random().toString(36).substr(2, 9),
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
    setEditForm({ id: 'q_' + Math.random().toString(36).substr(2, 9), question: '', options: ['', '', '', ''], answer: '' });
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

  if (!selectedSubject) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden bg-white">
          <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 mb-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-gray-900">Pilih Subjek untuk Bank Soalan</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-center w-12 border-b border-gray-100">No.</th>
                  <th className="px-4 md:px-6 py-4 border-b border-gray-100">Nama Subjek</th>
                  <th className="px-4 md:px-6 py-4 text-center whitespace-nowrap border-b border-gray-100">Kod Subjek</th>
                  <th className="px-4 md:px-6 py-4 text-center whitespace-nowrap border-b border-gray-100">Waktu Subjek</th>
                  <th className="px-4 md:px-6 py-4 text-center whitespace-nowrap border-b border-gray-100">Bahasa Subjek</th>
                  <th className="px-4 md:px-6 py-4 text-center w-28 border-b border-gray-100">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {initialSubjek.map((subjek, index) => (
                  <tr key={subjek.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedSubject(subjek)}>
                    <td className="px-4 md:px-6 py-4 text-center font-medium text-gray-500">{index + 1}</td>
                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900">{subjek.name}</td>
                    <td className="px-4 md:px-6 py-4 text-center text-gray-600">{subjek.code}</td>
                    <td className="px-4 md:px-6 py-4 text-center text-gray-600 truncate max-w-[100px]">{subjek.duration}</td>
                    <td className="px-4 md:px-6 py-4 text-center text-gray-600">{subjek.languages.join(', ')}</td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedSubject(subjek); }} className="bg-action-teal text-white w-full py-1.5 px-3 rounded text-xs font-bold hover:bg-teal-700 transition shadow-sm whitespace-nowrap">
                          Pilih
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-4 md:p-6 bg-white rounded-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedSubject(null)}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-charcoal flex items-center gap-2">
                <Database className="w-6 h-6 text-brand-red" />
                Bank Soalan
              </h2>
              <p className="text-xs font-bold text-gray-500 mt-1.5 flex items-center gap-1.5"><span className="text-action-teal uppercase tracking-widest">{selectedSubject.code}</span> - {selectedSubject.name}</p>
            </div>
          </div>
          {locked ? (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Dikunci
            </span>
          ) : (
            <button onClick={() => setLocked(true)} className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-200 text-sm font-bold shadow-sm transition-colors">Kunci Soalan</button>
          )}
        </div>
        
        <AnimatePresence>
          {uploadSuccessMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }} 
              animate={{ opacity: 1, y: 0, x: '-50%' }} 
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-20 left-1/2 z-[100] p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-green-800 shadow-xl w-11/12 max-w-[400px]"
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

        <div className="border border-dashed border-gray-300 p-4 md:p-8 rounded-xl flex flex-col items-center justify-center text-center bg-gray-50/50">
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
                 className="bg-brand-red text-white px-4 md:px-6 py-2.5 rounded-[6px] font-bold text-sm shadow-sm hover:bg-red-700 disabled:opacity-50 transition-all cursor-pointer"
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
                className="flex items-center gap-1.5 bg-action-teal text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Soalan
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
                          {q ? translateContent(q.question) : 'Soalan Tidak Sah'}
                        </div>
                        {!locked && editingIndex === null && !isAddingNew && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(i)} className="p-1.5 text-gray-400 hover:text-action-teal rounded hover:bg-teal-50 cursor-pointer" title="Kemaskini">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(i)} className="p-1.5 text-gray-400 hover:text-brand-red rounded hover:bg-red-50 cursor-pointer" title="Padam">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5">
                        {q?.options?.map((opt, optIndex) => {
                          const isCorrect = String.fromCharCode(65 + optIndex) === (q?.answer || '').toUpperCase() || opt.trim().toLowerCase() === (q?.answer || '').trim().toLowerCase();
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
                              <span className={`${isCorrect ? 'font-semibold' : 'font-medium'} text-sm`}>{translateContent(opt)}</span>
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

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3 z-10 relative">
          <button 
            onClick={() => {
              setIsRandomized(true);
              setRandomizeSuccessMsg(true);
              setTimeout(() => setRandomizeSuccessMsg(false), 5000);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[6px] font-bold text-sm shadow-sm transition-all text-center cursor-pointer ${
              isRandomized 
                ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' 
                : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            {isRandomized ? 'Peperiksaan Telah Dirawak' : 'Jana Kertas Secara Rawak'}
          </button>
          
          <button 
            onClick={() => {
              setSaveSuccessMsg(true);
              setTimeout(() => setSaveSuccessMsg(false), 5000);
            }}
            className="flex items-center gap-2 bg-action-teal hover:bg-teal-700 text-white px-4 md:px-8 py-2.5 rounded-[6px] font-bold text-sm shadow-sm transition-all text-center cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Bank Soalan
          </button>
        </div>
      </div>
      
      {/* Popups */}
      <AnimatePresence>
        {randomizeSuccessMsg && (
          <motion.div 
            key="randomize-success"
            initial={{ opacity: 0, y: 20, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-4 text-blue-800 shadow-xl max-w-md w-full"
          >
            <div className="mt-0.5">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold mb-1">Peperiksaan Rawak Berjaya Diaktifkan</h4>
              <p className="text-sm text-blue-700">Setiap calon akan menerima susunan soalan yang berbeza secara rawak (Cth: Calon A mendapat Soalan 1, Calon B mendapat Soalan 4 sebagai soalan pertama mereka).</p>
            </div>
            <button onClick={() => setRandomizeSuccessMsg(false)} className="text-blue-500 hover:text-blue-700 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </motion.div>
        )}

        {saveSuccessMsg && (
          <motion.div 
            key="save-success"
            initial={{ opacity: 0, y: -20, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[100] p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-green-800 shadow-xl w-11/12 max-w-[400px]"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-sm font-bold">Berjaya! Bank soalan telah disimpan.</p>
            </div>
            <button onClick={() => setSaveSuccessMsg(false)} className="text-green-500 hover:text-green-700 ml-4 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

