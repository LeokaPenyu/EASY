import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save } from 'lucide-react';

export const ExamResultsEntry = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Ali Bin Abu', theory: 0, practical: 0 },
    { id: 2, name: 'Muthu A/L Samy', theory: 0, practical: 0 }
  ]);

  const updateMark = (id: number, field: 'theory' | 'practical', val: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, [field]: Number(val) } : c));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-black text-charcoal mb-4">Pemasukan Markah Praktikal & Subjektif</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-500 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="p-2">Nama Calon</th>
                <th className="p-2 w-32">Teori (Subjektif)</th>
                <th className="p-2 w-32">Praktikal</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id} className="border-b">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2"><input type="number" min="0" max="100" className="w-full border p-1 rounded" value={c.theory} onChange={e => updateMark(c.id, 'theory', e.target.value)} /></td>
                  <td className="p-2"><input type="number" min="0" max="100" className="w-full border p-1 rounded" value={c.practical} onChange={e => updateMark(c.id, 'practical', e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-primary mt-6 flex items-center justify-center gap-2 w-full">
           <Save className="w-4 h-4" /> Simpan Markah
        </button>
      </div>
    </motion.div>
  );
};
