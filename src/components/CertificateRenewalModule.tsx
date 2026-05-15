import React, { useState } from 'react';
import { motion } from 'motion/react';
import { calculateRenewalExpiry } from '../utils/certificateUtils';
import { FileText, Save, CheckCircle2 } from 'lucide-react';

export const CertificateRenewalModule = () => {
  const [query, setQuery] = useState('');
  const [foundCert, setFoundCert] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const handleSearch = () => {
    // mock finding a cert
    if (query.length > 3) {
      setFoundCert({
        name: 'Ahmad bin Abu',
        oldExpiry: '2023-05-10',
        certNo: query
      });
      setSuccess(false);
    }
  };

  const handleRenew = () => {
    setSuccess(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-black text-charcoal mb-4">Pembaharuan Sijil (Certificate Renewal)</h2>
        <div className="flex gap-4 mb-6">
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masukkan No. Sijil / KP" 
            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
          />
          <button onClick={handleSearch} className="btn-primary">Cari Sijil</button>
        </div>

        {foundCert && !success && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-charcoal mb-2">{foundCert.name}</h3>
            <p className="text-sm text-gray-500 mb-1">No Sijil Lama: {foundCert.certNo}</p>
            <p className="text-sm text-gray-500 mb-4">Tarikh Luput Asal: {foundCert.oldExpiry}</p>
            
            <div className="bg-blush-rose p-4 rounded-lg flex flex-col gap-2 border border-brand-red/10">
              <span className="text-xs font-bold text-brand-red uppercase tracking-widest">Tarikh Luput Baru</span>
              <p className="text-lg font-black text-brand-red-deep">
                {calculateRenewalExpiry(foundCert.oldExpiry, 3)}
              </p>
              <p className="text-xs text-brand-red/70">* Pembaharuan bermula dari tarikh luput asal, bukan tarikh hari ini.</p>
            </div>
            
            <button onClick={handleRenew} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Sahkan Pembaharuan
            </button>
          </div>
        )}

        {success && (
          <div className="bg-success-green/10 p-6 rounded-xl border border-success-green flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-success-green mb-2" />
            <h3 className="font-bold text-success-green">Pembaharuan Berjaya!</h3>
            <p className="text-sm text-success-green/70">Tarikh luput baru telah dikemaskini dalam sistem.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
