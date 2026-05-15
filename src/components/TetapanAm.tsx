import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Edit, X, Save } from 'lucide-react';

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
        
        {/* Header */}
        <div className="bg-brand-red p-3 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-white/80" />
            <h2 className="font-bold text-[15px]">Tetapan Am</h2>
          </div>
        </div>

        {/* Content Area */}
        <div>
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#E8EEF4] text-[#2D5A8D] font-bold border-b-2 border-gray-200">
              <tr>
                <th className="p-2 border-r border-gray-200 text-center w-12">NO.</th>
                <th className="p-2 border-r border-gray-200 uppercase">NAMA</th>
                <th className="p-2 border-r border-gray-200 uppercase w-32 text-center">NILAI</th>
                <th className="p-2 text-center uppercase w-20">TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {tetapanList.map((tetapan, index) => (
                <tr key={tetapan.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                  <td className="p-2 border-r border-gray-100 text-center font-medium text-gray-700 bg-[#FAFBFD]">{index + 1}</td>
                  <td className="p-2 border-r border-gray-100 text-gray-800">{tetapan.name}</td>
                  <td className="p-2 border-r border-gray-100 text-gray-800 text-center">{tetapan.value}</td>
                  <td className="p-2 text-center">
                    <button 
                      onClick={() => handleOpenModal(tetapan)}
                      className="text-action-teal hover:text-action-teal/80 bg-[#E8F0FE] border border-gray-300 p-0.5 rounded-[2px]"
                      title="Kemaskini"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-center p-2 text-[11px] text-[#0066CC] font-medium bg-[#F8F9FA] border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 cursor-not-allowed uppercase tracking-wider text-[10px]">Pertama</span>
              <span className="text-gray-400 cursor-not-allowed uppercase tracking-wider text-[10px]">Sebelumnya</span>
              <span className="text-gray-600">Halaman <input type="text" value="1" className="w-8 border border-gray-300 text-center mx-1 py-0.5 rounded-[2px]" readOnly /> dari 1</span>
              <span className="text-gray-400 cursor-not-allowed uppercase tracking-wider text-[10px]">Seterusnya</span>
              <span className="text-gray-400 cursor-not-allowed uppercase tracking-wider text-[10px]">Terakhir</span>
            </div>
          </div>
          <div className="text-center text-[11px] text-gray-500 pb-2 bg-[#F8F9FA]">
            Jumlah Rekod : {tetapanList.length}
          </div>
        </div>
      </div>

      {/* Modal / Dialog */}
      {isModalOpen && editingTetapan && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-[#F0F0F0] shadow-xl w-full max-w-xl flex flex-col overflow-hidden border border-gray-400"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-b from-[#4A4A4A] to-[#1A1A1A] text-white px-3 py-1 flex justify-between items-center border-b-[3px] border-brand-red">
              <h3 className="font-bold text-[13px] tracking-wide">Ubah Tetapan Am</h3>
              <button onClick={handleCloseModal} className="bg-[#E8E8E8] text-gray-800 rounded-[2px] px-2 py-0.5 ml-4 flex items-center justify-center hover:bg-white inset-shadow border border-gray-400">
                <X className="w-3 h-3 text-brand-red" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="bg-white p-6 min-h-[300px]">
               <div className="flex justify-center mb-4">
                 <div className="grid grid-cols-[80px_1fr] items-center gap-2 max-w-md w-full">
                    <div className="text-right text-gray-700 font-medium text-[13px]">Nama:</div>
                    <div className="text-gray-900 text-[13px]">{editingTetapan.name}</div>
                 </div>
               </div>

               <div className="flex justify-center mb-8">
                 <div className="grid grid-cols-[80px_1fr] items-center gap-2 max-w-md w-full">
                    <div className="text-right font-bold text-gray-800 text-[13px]">
                      <span className="text-alert-red">*</span>Nilai:
                    </div>
                    <input 
                      type="text" 
                      value={editValue} 
                      onChange={e => setEditValue(e.target.value)} 
                      className="border border-gray-300 w-32 px-2 py-1 outline-none focus:border-action-teal text-[13px] shadow-inner rounded-[2px]"
                    />
                 </div>
               </div>

               <div className="flex justify-center gap-2">
                 <button onClick={handleCloseModal} className="flex items-center gap-1.5 bg-[#E8F0FE] border border-gray-300 rounded-[2px] px-3 py-1 text-gray-700 font-bold text-[12px] hover:bg-white transition-colors">
                    <X className="w-4 h-4 text-brand-red" /> Tutup
                 </button>
                 <button onClick={handleSave} className="flex items-center gap-1.5 bg-[#E8F0FE] border border-gray-300 rounded-[2px] px-3 py-1 text-[#0066CC] font-bold text-[12px] hover:bg-white transition-colors">
                    <Save className="w-4 h-4" /> Simpan
                 </button>
               </div>
            </div>

            {/* Bottom Gray Bar in Modal like in image */}
            <div className="h-6 bg-[#E8E8E8] border-t border-gray-300"></div>

          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
