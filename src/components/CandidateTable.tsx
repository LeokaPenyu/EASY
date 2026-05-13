import React from 'react';
import { Candidate } from '../types';
import { Plus, Trash2, Upload, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CandidateTableProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({ candidates, setCandidates }) => {
  const { t } = useLanguage();
  const addRow = () => {
    const newCandidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      icNumber: '',
      membershipId: '',
      status: 'Pending',
      isMember: false,
      attendance: {
        theory: false,
        oral: false,
        practical: false
      }
    };
    setCandidates([...candidates, newCandidate]);
  };

  const removeRow = (id: string) => {
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  const updateCandidate = (id: string, field: keyof Candidate, value: string) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newCandidates: Candidate[] = lines
        .slice(1) // Skip header
        .filter((line) => line.trim() !== '')
        .map((line) => {
          const [name, icNumber, membershipId] = line.split(',').map((s) => s.trim());
          return {
            id: Math.random().toString(36).substr(2, 9),
            name: name || '',
            icNumber: icNumber || '',
            membershipId: membershipId || '',
            status: 'Pending',
            isMember: (membershipId || '').trim() !== '',
            attendance: {
              theory: false,
              oral: false,
              practical: false
            }
          };
        });
      setCandidates([...candidates, ...newCandidates]);
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const memberCount = candidates.filter((c) => c.membershipId.trim() !== '').length;
  const nonMemberCount = candidates.length - memberCount;
  const totalFee = memberCount * 2 + nonMemberCount * 14;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-red/5 rounded-lg">
            <Users className="w-5 h-5 text-brand-red" />
          </div>
          <h3 className="font-bold text-charcoal tracking-tight">
            {t('candidateList')}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn-secondary text-[11px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 flex-1 justify-center sm:flex-none h-10 px-6">
            <Upload className="w-3.5 h-3.5" />
            {t('uploadCsv')}
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
          <button onClick={addRow} className="btn-primary text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 flex-1 justify-center sm:flex-none h-10 px-6">
            <Plus className="w-3.5 h-3.5" />
            {t('addCandidate')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-[8px] bg-white shadow-sm">
        <table className="w-full text-left min-w-[840px]">
          <thead className="bg-gray-100/50 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-100 italic">
            <tr>
              <th className="px-6 py-4 w-16">{t('bil')}</th>
              <th className="px-6 py-4">{t('fullName')}</th>
              <th className="px-6 py-4">{t('icNumber')}</th>
              <th className="px-6 py-4">{t('membershipNumber')}</th>
              <th className="px-6 py-4 text-right w-24">{t('action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm italic font-medium">
                  {t('noCandidates')}
                </td>
              </tr>
            ) : (
              candidates.map((c, index) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-3 text-xs text-gray-400 font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCandidate(c.id, 'name', e.target.value)}
                      placeholder={t('fullName')}
                      className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-100 rounded-[4px] outline-none focus:border-action-teal/40 focus:bg-white transition-all font-semibold"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={c.icNumber}
                      onChange={(e) => updateCandidate(c.id, 'icNumber', e.target.value)}
                      placeholder={t('icNumber')}
                      className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-100 rounded-[4px] outline-none focus:border-action-teal/40 focus:bg-white transition-all font-medium"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={c.membershipId}
                      onChange={(e) => updateCandidate(c.id, 'membershipId', e.target.value)}
                      placeholder="Contoh: SWOT-12345"
                      className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-100 rounded-[4px] outline-none focus:border-action-teal/40 focus:bg-white transition-all font-medium"
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => removeRow(c.id)}
                      className="p-2 text-gray-300 hover:text-alert-red hover:bg-alert-red/5 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card bg-brand-red/[0.01] border-l-4 border-brand-red shadow-sm mt-8 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest">{t('feeSummary')}</p>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success-green/20 border border-success-green" />
                <p className="text-xs font-semibold text-gray-600">{t('member')}: <span className="font-bold text-charcoal">{memberCount}</span> x RM 2.00</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-red/20 border border-brand-red" />
                <p className="text-xs font-semibold text-gray-600">{t('nonMember')}: <span className="font-bold text-charcoal">{nonMemberCount}</span> x RM 14.00</p>
              </div>
            </div>
          </div>
          <div className="text-left md:text-right bg-white p-4 rounded-lg border border-gray-100 min-w-[200px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('totalPayment')}</p>
            <p className="text-3xl font-black text-charcoal tracking-tighter">RM {totalFee.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
