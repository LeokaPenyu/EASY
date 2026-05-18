import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Download, FileText, Loader2, CheckCircle } from 'lucide-react';

export const ReportsModule = () => {
  const [selectedReport, setSelectedReport] = useState<string>('Statistik Subjek');
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadComplete, setDownloadComplete] = useState<string | null>(null);

  const handleDownload = (format: string) => {
    setDownloadingFormat(format);
    setDownloadComplete(null);
    
    // Simulate download processing
    setTimeout(() => {
      setDownloadingFormat(null);
      setDownloadComplete(`Laporan '${selectedReport}' telah dimuat turun dalam format ${format}.`);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setDownloadComplete(null);
      }, 4000);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-black text-charcoal mb-4 flex gap-2 items-center">
           <BarChart3 className="text-action-teal" />
           Laporan & Statistik
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {['Statistik Subjek', 'Rumusan Keputusan', 'Pembaharuan Sijil', 'Kutipan Yuran'].map(type => (
             <div 
                key={type} 
                onClick={() => setSelectedReport(type)}
                className={`border p-4 rounded-xl cursor-pointer transition-all ${
                  selectedReport === type 
                  ? 'border-action-teal bg-teal-50 shadow-sm' 
                  : 'border-gray-200 hover:bg-gray-50 hover:border-action-teal'
                }`}
             >
                <FileText className={`w-6 h-6 mb-2 ${selectedReport === type ? 'text-action-teal' : 'text-gray-400'}`} />
                <p className={`font-bold text-sm ${selectedReport === type ? 'text-teal-900' : 'text-charcoal'}`}>{type}</p>
             </div>
           ))}
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
             <button 
                onClick={() => handleDownload('PDF')}
                disabled={downloadingFormat !== null}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50"
             >
               {downloadingFormat === 'PDF' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
               {downloadingFormat === 'PDF' ? 'Memuat turun...' : 'PDF'}
             </button>
             <button 
                onClick={() => handleDownload('CSV')}
                disabled={downloadingFormat !== null}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50"
             >
               {downloadingFormat === 'CSV' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
               {downloadingFormat === 'CSV' ? 'Memuat turun...' : 'CSV'}
             </button>
             <button 
                onClick={() => handleDownload('Excel')}
                disabled={downloadingFormat !== null}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50"
             >
               {downloadingFormat === 'Excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
               {downloadingFormat === 'Excel' ? 'Memuat turun...' : 'Excel'}
             </button>
          </div>
          
          {downloadComplete && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex gap-2 items-center"
            >
               <CheckCircle className="w-4 h-4 text-green-600" />
               {downloadComplete}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
