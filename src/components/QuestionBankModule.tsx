import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, FileUp, CheckCircle } from 'lucide-react';

export const QuestionBankModule = () => {
  const [locked, setLocked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-charcoal">Bank Soalan</h2>
          {locked ? (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Dikunci
            </span>
          ) : (
            <button onClick={() => setLocked(true)} className="btn-secondary text-xs p-2">Kunci Soalan</button>
          )}
        </div>
        
        <div className="border border-dashed border-gray-300 p-8 rounded-xl flex flex-col items-center justify-center text-center">
           {uploadedFile ? (
             <>
               <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
               <p className="text-sm font-bold text-gray-800 mb-1">{uploadedFile.name}</p>
               <p className="text-xs text-gray-500">Berjaya dimuat naik!</p>
               <button 
                 onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                 className="text-action-teal text-xs font-medium mt-3 hover:underline"
                 disabled={locked}
               >
                 Muat Naik Fail Lain
               </button>
             </>
           ) : (
             <>
               <FileUp className="w-8 h-8 text-gray-400 mb-2" />
               <p className="text-sm font-bold text-gray-600 mb-1">Muat Naik CSV Soalan Objektif</p>
               <p className="text-xs text-gray-400">Atau masukkan secara manual</p>
               <button 
                 onClick={handleUploadClick}
                 disabled={locked} 
                 className="btn-primary mt-4 disabled:opacity-50"
               >
                 Upload
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
        
        <div className="mt-6 flex justify-between gap-4">
          <button className="flex-1 bg-gray-100 p-3 rounded font-bold text-charcoal text-sm">Jana Kertas Secara Rawak</button>
        </div>
      </div>
    </motion.div>
  );
};
