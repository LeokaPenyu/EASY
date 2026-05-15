import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Download, FileText } from 'lucide-react';

export const ReportsModule = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-black text-charcoal mb-4 flex gap-2 items-center">
           <BarChart3 className="text-action-teal" />
           Laporan & Statistik
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {['Statistik Subjek', 'Rumusan Keputusan', 'Pembaharuan Sijil', 'Kutipan Yuran'].map(type => (
             <div key={type} className="border border-gray-200 p-4 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-action-teal transition-all">
                <FileText className="w-6 h-6 text-gray-400 mb-2" />
                <p className="font-bold text-sm text-charcoal">{type}</p>
             </div>
           ))}
        </div>
        
        <div className="flex gap-4">
           <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
             <Download className="w-4 h-4" /> PDF
           </button>
           <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
             <Download className="w-4 h-4" /> CSV
           </button>
           <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
             <Download className="w-4 h-4" /> Excel
           </button>
        </div>
      </div>
    </motion.div>
  );
};
