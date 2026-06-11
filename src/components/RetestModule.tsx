import React from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

export const RetestModule = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl font-black text-charcoal mb-4">Pengurusan Ujian Semula (Retest)</h2>
        <div className="bg-blush-rose/50 p-4 rounded-xl border border-brand-red/10 mb-6 flex items-center gap-4">
           <Calendar className="text-brand-red" />
           <div>
             <p className="font-bold text-brand-red-deep">Jadualkan Ujian Semula</p>
             <p className="text-sm text-brand-red-deep/70">Pilih calon yang gagal untuk menjadualkan semula</p>
           </div>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-500 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-2">Nama Calon</th>
              <th className="p-2">Status Asal</th>
              <th className="p-2">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-bold">Ahmad Albab</td>
              <td className="p-2 text-alert-red font-bold">Gagal (Praktikal)</td>
              <td className="p-2">
                <button className="bg-action-teal text-white px-3 py-1 text-xs rounded font-bold">Jadual Retest</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
