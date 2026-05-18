import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Edit, Trash2, X, Save, UserSquare2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Trainer {
  id: string;
  nama: string;
  noKp: string;
  noWaran: string;
  alamat: string;
}

const initialData: Trainer[] = [
  { id: '1', nama: 'LEONARDO ROSSI', noKp: '790701-13-5813', noWaran: 'TD0001106', alamat: 'C/O PEJABAT BSMM DAERAH SERIAN' },
  { id: '2', nama: 'SOFIA BIANCHI', noKp: '621009-13-5959', noWaran: 'WA(HA) 0743', alamat: '' },
  { id: '3', nama: 'MATTEO FERRARI', noKp: 'K260167', noWaran: 'WA(D)062', alamat: '' },
  { id: '4', nama: 'GIULIA ESPOSITO', noKp: '891028135209', noWaran: 'TB0000037', alamat: '' },
  { id: '5', nama: 'ALESSANDRO ROMANO', noKp: '780301-13-6367', noWaran: 'JL1002383', alamat: '' },
  { id: '6', nama: 'AURORA COLOMBO', noKp: '920820-13-5958', noWaran: 'TD0000701', alamat: '' },
  { id: '7', nama: 'LORENZO RICCI', noKp: '831207-13-5293', noWaran: 'JL1002137', alamat: '' },
  { id: '8', nama: 'CHIARA MARINO', noKp: '620213-13-5011', noWaran: 'JK2000335', alamat: '' },
  { id: '9', nama: 'FRANCESCO GRECO', noKp: '550214-13-5178', noWaran: 'WA (N) 0470', alamat: '' },
  { id: '10', nama: 'MARTINA GALLO', noKp: '560603-13-5269', noWaran: 'JK2000392', alamat: '' },
];

export const Jurulatih: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<Trainer[]>(initialData);
  
  const [filterNama, setFilterNama] = useState('');
  const [filterNoKp, setFilterNoKp] = useState('');
  const [filterNoWaran, setFilterNoWaran] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    noKp: '',
    noWaran: '',
    alamat: ''
  });

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (item: Trainer) => {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      noKp: item.noKp,
      noWaran: item.noWaran,
      alamat: item.alamat
    });
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      noKp: '',
      noWaran: '',
      alamat: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nama || !formData.noKp || !formData.noWaran) {
      return;
    }

    if (editingId) {
      setData(prev => prev.map(item => item.id === editingId ? {
        ...item,
        nama: formData.nama.toUpperCase(),
        noKp: formData.noKp,
        noWaran: formData.noWaran,
        alamat: formData.alamat
      } : item));
    } else {
      const newId = String(Math.max(...data.map(d => parseInt(d.id, 10)), 0) + 1);
      setData(prev => [...prev, {
        id: newId,
        nama: formData.nama.toUpperCase(),
        noKp: formData.noKp,
        noWaran: formData.noWaran,
        alamat: formData.alamat
      }]);
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter(item => {
    return (
      item.nama.toLowerCase().includes(filterNama.toLowerCase()) &&
      item.noKp.toLowerCase().includes(filterNoKp.toLowerCase()) &&
      item.noWaran.toLowerCase().includes(filterNoWaran.toLowerCase())
    );
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-sm">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <UserSquare2 className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">{t('trainerList')}</h2>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-action-teal hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            {t('addTrainer')}
          </button>
        </div>

        {/* Filter Section */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <label className="w-48 text-right font-medium text-gray-700 text-xs text-nowrap">{t('trainerName')} :</label>
            <input 
              type="text" 
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-right font-medium text-gray-700 text-xs text-nowrap">{t('trainerIc')} :</label>
            <input 
              type="text" 
              value={filterNoKp}
              onChange={(e) => setFilterNoKp(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-right font-medium text-gray-700 text-xs text-nowrap">{t('noWaranTrainer')} :</label>
            <input 
              type="text" 
              value={filterNoWaran}
              onChange={(e) => setFilterNoWaran(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="w-48"></div>
            <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
              <Search className="w-4 h-4 text-action-teal" /> {t('search')}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 border-r border-gray-100 text-center w-12">{t('bil')}</th>
                    <th className="px-4 py-3 border-r border-gray-100 text-center uppercase">{t('trainerName')}</th>
                    <th className="px-4 py-3 border-r border-gray-100 text-center uppercase w-48">{t('trainerIc')}</th>
                    <th className="px-4 py-3 border-r border-gray-100 text-center uppercase w-48">{t('noWaranTrainer')}</th>
                    <th className="px-4 py-3 text-center uppercase w-24">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-center">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 border-r border-gray-50 text-center text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-gray-900">{item.nama}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-gray-700">{item.noKp}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-gray-700">{item.noWaran}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-action-teal hover:bg-teal-50 transition-colors"
                            title={t('update')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-alert-red hover:bg-red-50 transition-colors"
                            title={t('padam')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 italic">
                        {t('noItemFound')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-center items-center py-4 bg-gray-50 gap-4 border-t border-gray-200">
               <div className="flex space-x-2 text-xs font-semibold">
                  <button className="text-gray-400 cursor-not-allowed">« {t('first')}</button>
                  <button className="text-gray-400 cursor-not-allowed">‹ {t('previous')}</button>
               </div>
               <div className="text-xs text-gray-500 flex items-center space-x-1">
                 <span>{t('page')}</span>
                 <input type="text" value="1" readOnly className="w-8 text-center border border-gray-300 rounded p-0.5" />
                 <span>{t('pageOf')} 9</span>
                 <span className="ml-2">{t('recordCount')} 167</span>
               </div>
               <div className="flex space-x-2 text-xs font-semibold">
                  <button className="text-action-teal hover:underline">{t('next')} ›</button>
                  <button className="text-action-teal hover:underline">{t('last')} »</button>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white shadow-xl rounded-xl w-full max-w-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-gradient-to-r from-gray-800 to-gray-700 text-white">
              <h3 className="font-bold text-base tracking-wide">
                {editingId ? t('ubahJurulatih') : t('addTrainer')}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-lg border border-white/20 bg-black/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 bg-gray-50/50 space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-48 text-right font-medium text-gray-700 text-sm">
                  <span className="text-alert-red">*</span>{t('trainerName')}:
                </label>
                <input 
                  type="text" 
                  value={formData.nama}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="w-48 text-right font-medium text-gray-700 text-sm">
                  <span className="text-alert-red">*</span>{t('trainerIc')}:
                </label>
                <input 
                  type="text" 
                  value={formData.noKp}
                  onChange={(e) => setFormData(prev => ({ ...prev, noKp: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-48 text-right font-medium text-gray-700 text-sm">
                  <span className="text-alert-red">*</span>{t('noWaranTrainer')}:
                </label>
                <input 
                  type="text" 
                  value={formData.noWaran}
                  onChange={(e) => setFormData(prev => ({ ...prev, noWaran: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
                />
              </div>

              <div className="flex items-start gap-4">
                <label className="w-48 text-right font-medium text-gray-700 text-sm pt-2">
                  {t('trainerAddress')}:
                </label>
                <textarea 
                  value={formData.alamat}
                  onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                  rows={3}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="w-48 mt-1"></div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium flex items-center gap-2 bg-white"
                  >
                    <X className="w-4 h-4" /> {t('close')}
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors shadow-sm text-sm font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> {t('saveTrainer')}
                  </button>
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
