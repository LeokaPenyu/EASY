import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Edit, X, Save, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Tetapan {
  id: string;
  name: string;
  value: string;
}

const initialTetapan: Tetapan[] = [
  { id: '1', name: 'Julat tarikh sebelum hari peperiksaan (hari)', value: '9' },
  { id: '2', name: 'Yuran peperiksaan biasa untuk ahli (RM)', value: '0' },
  { id: '3', name: 'Yuran peperiksaan biasa untuk bukan ahli (RM)', value: '14' },
  { id: '4', name: 'Yuran pembaharuan sijil untuk ahli (RM)', value: '10' },
  { id: '5', name: 'Yuran pembaharuan sijil untuk bukan ahli (RM)', value: '10' },
];

export const TetapanAm = () => {
  const [tetapanList, setTetapanList] = useState<Tetapan[]>(initialTetapan);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTetapan, setEditingTetapan] = useState<Tetapan | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleOpenModal = (tetapan: Tetapan) => {
    setEditingTetapan(tetapan);
    setEditValue(tetapan.value);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTetapan(null);
  };

  const handleSave = () => {
    if (editingTetapan) {
      setTetapanList(prev => prev.map(t => 
        t.id === editingTetapan.id ? { ...t, value: editValue } : t
      ));
    }
    handleCloseModal();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-sm">
      <div className="card shadow-sm border border-gray-100 p-0 overflow-hidden bg-white">
        
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Tetapan Am</h2>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-center w-16">NO.</th>
                <th className="px-6 py-4">NAMA</th>
                <th className="px-6 py-4 text-center w-32">NILAI</th>
                <th className="px-6 py-4 text-center w-28">TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {tetapanList.map((tetapan, index) => (
                <tr key={tetapan.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-center font-medium text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{tetapan.name}</td>
                  <td className="px-6 py-4 text-center text-gray-600 font-medium">{tetapan.value}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleOpenModal(tetapan)}
                      className="text-action-teal hover:text-teal-700 bg-teal-50 border border-teal-100 p-1.5 rounded-md transition-colors inline-flex"
                      title="Kemaskini"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Menunjukkan <span className="font-semibold text-gray-900">{tetapanList.length}</span> rekod keseluruhan
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed hover:bg-gray-50">Pertama</button>
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed hover:bg-gray-50">Sblm</button>
              <span className="px-2">Hal <input type="text" value="1" className="w-10 border border-gray-300 text-center mx-1 py-1 rounded-md" readOnly /> dari 1</span>
              <button className="px-3 py-1 border border-gray-200 rounded text-action-teal hover:bg-gray-50">Setrnya</button>
              <button className="px-3 py-1 border border-gray-200 rounded text-action-teal hover:bg-gray-50">Terakhir</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Dialog */}
      {isModalOpen && editingTetapan && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col my-auto overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[15px] text-gray-900">Ubah Tetapan Am</h3>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex-1 flex flex-col bg-white">
               <div className="space-y-4 mb-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nama
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                       {editingTetapan.name}
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nilai <span className="text-brand-red">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={editValue} 
                      onChange={e => setEditValue(e.target.value)} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20 outline-none transition-all"
                    />
                 </div>
               </div>

               <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                 <button 
                   onClick={handleCloseModal} 
                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                 >
                    Tutup
                 </button>
                 <button 
                   onClick={handleSave} 
                   className="px-4 py-2 text-sm font-medium text-white bg-action-teal hover:bg-teal-700 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                 >
                    <Save className="w-4 h-4" /> Simpan
                 </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
