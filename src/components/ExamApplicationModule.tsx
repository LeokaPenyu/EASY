import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Filter,
  Users,
  FileText,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
import { ExamStatus, UserRole } from '../types';
import { MockExam } from '../data/mockExams';

interface ExamApplicationModuleProps {
  role: UserRole;
  exams: MockExam[];
  onAddNew: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isSummaryReadyMode?: boolean;
  initialStatusFilter?: string;
  initialTab?: 'borang' | 'rumusan' | 'keputusan';
}

export const ExamApplicationModule: React.FC<ExamApplicationModuleProps> = ({ 
  role, exams, onAddNew, onView, onEdit, onDelete, 
  isSummaryReadyMode = false,
  initialStatusFilter,
  initialTab = 'borang'
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'borang' | 'rumusan' | 'keputusan'>(
    isSummaryReadyMode ? 'rumusan' : initialTab
  );
  const [filters, setFilters] = useState({
    status: isSummaryReadyMode ? ExamStatus.APPROVED : (initialStatusFilter || ''),
    subject: '',
    district: '',
    regNo: '',
    dateFrom: '',
    dateTo: '',
    isReady: isSummaryReadyMode,
    isOpenExaminer: false
  });

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  // Initialize data on first load and when activeTab or exams list changes
  React.useEffect(() => {
    handleSearch();
  }, [activeTab, exams]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setIsSearched(true);
    let results = [...exams];

    // Filter by tab context
    if (activeTab === 'borang') {
      results = results.filter(item => 
        item.status === ExamStatus.PENDING_VERIFICATION || 
        item.status === ExamStatus.REJECTED ||
        item.status === ExamStatus.DRAFT ||
        item.status === ExamStatus.SUBMITTED
      );
    } else if (activeTab === 'rumusan') {
      results = results.filter(item => 
        item.status === ExamStatus.APPROVED || 
        item.status === ExamStatus.EXPIRED || 
        item.status === ExamStatus.LOCKED ||
        item.status === ExamStatus.SUBMITTED
      );
    } else if (activeTab === 'keputusan') {
      results = results.filter(item => item.status === ExamStatus.APPROVED || item.status === ExamStatus.REJECTED);
    }

    if (filters.status && filters.status !== 'Semua') {
      results = results.filter(item => item.status === filters.status);
    }

    if (filters.district) {
      results = results.filter(item => item.district === filters.district.toUpperCase());
    }

    if (filters.subject) {
      results = results.filter(item => item.subject.includes(filters.subject));
    }

    if (filters.regNo) {
      results = results.filter(item => item.regNo.toLowerCase().includes(filters.regNo.toLowerCase()));
    }

    if (filters.isReady) {
      results = results.filter(item => item.status === ExamStatus.APPROVED);
    }

    if (filters.isOpenExaminer) {
      results = results.filter(item => item.status === ExamStatus.EXPIRED || item.status === ExamStatus.LOCKED);
    }

    setFilteredData(results);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Adakah anda pasti mahu memadam permohonan ini?')) {
      if (onDelete) onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      {!isSummaryReadyMode && (
        <div className="flex gap-2 border-b border-gray-100 bg-white p-2 rounded-t-xl shadow-sm">
          {[
            { id: 'borang', label: 'Borang Permohonan', icon: FileText },
            { id: 'rumusan', label: 'Rumusan Peperiksaan', icon: CheckCircle2 },
            { id: 'keputusan', label: 'Keputusan', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 rounded-t-lg ${
                activeTab === tab.id 
                  ? 'border-brand-red text-brand-red bg-brand-red/5 shadow-inner' 
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-red' : 'text-gray-300'}`} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-brand-red p-4 flex items-center justify-between shadow-md">
        <h2 className="text-white font-bold text-xl flex items-center gap-2">
          {isSummaryReadyMode 
            ? 'Sedia untuk Penyediaan Rumusan Peperiksaan' 
            : (role === UserRole.DEC ? t('examApplication') : (role === UserRole.SEC ? 'Permohonan Peperiksaan Baru' : 'Kemasukan Keputusan Peperiksaan'))}
        </h2>
        {role === UserRole.DEC && !isSummaryReadyMode && (
          <button 
            onClick={onAddNew}
            className="bg-action-teal text-white px-8 py-2.5 rounded-[6px] font-bold text-sm shadow-lg shadow-action-teal/20 hover:bg-action-teal/90 transition-all flex items-center gap-2"
          >
            {t('add')}
          </button>
        )}
      </div>

      {/* Search Section */}
      <div className="card shadow-sm border-gray-200/60 pb-6 bg-[#fcfcfc]">
        <div className="grid grid-cols-1 gap-y-3">
          {/* Row 1: Status */}
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label className="text-[11px] font-bold text-charcoal text-right">Status :</label>
            <div className="w-1/2">
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-1 bg-white border border-gray-300 rounded text-xs outline-none shadow-sm h-7"
              >
                <option value="Semua">-- Semua --</option>
                <option value={ExamStatus.APPROVED}>Diluluskan</option>
                <option value={ExamStatus.PENDING_VERIFICATION}>Menunggu Pengesahan</option>
                <option value={ExamStatus.REJECTED}>Ditolak</option>
                <option value={ExamStatus.EXPIRED}>Tamat Tempoh</option>
                <option value={ExamStatus.SUBMITTED}>Telah Dihantar</option>
              </select>
            </div>
          </div>

          {/* Row 2: Subjek */}
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label className="text-[11px] font-bold text-charcoal text-right">Subjek :</label>
            <div className="w-[70%]">
              <select 
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full p-1 bg-white border border-gray-300 rounded text-xs outline-none shadow-sm h-7"
              >
                <option value="">-- Sila Pilih --</option>
                <option value="800/1">800/1 - Pertolongan Cemas Asas</option>
                <option value="800/2">800/2 - Pertolongan Cemas Asas dan CPR</option>
                <option value="700/1">700/1 - Pendidikan Kesihatan Asas</option>
              </select>
            </div>
          </div>

          {/* Row 3: No. Pendaftaran */}
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label className="text-[11px] font-bold text-charcoal text-right">No. Pendaftaran :</label>
            <div className="w-1/3">
              <input 
                type="text"
                value={filters.regNo}
                onChange={(e) => handleFilterChange('regNo', e.target.value)}
                className="w-full p-1 bg-white border border-gray-300 rounded text-xs outline-none shadow-sm h-7"
              />
            </div>
          </div>

          {/* Row 4: Tarikh Peperiksaan */}
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label className="text-[11px] font-bold text-charcoal text-right">Tarikh Peperiksaan :</label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-charcoal">Dari</span>
              <div className="relative">
                <input 
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="p-1 bg-white border border-gray-300 rounded text-xs outline-none shadow-sm h-7 pl-6"
                />
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                   <div className="w-3 h-3 border border-red-500 bg-red-50 rounded-[1px]"></div>
                </div>
              </div>
              <span className="text-[11px] text-charcoal">Hingga</span>
              <div className="relative">
                <input 
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="p-1 bg-white border border-gray-300 rounded text-xs outline-none shadow-sm h-7 pl-6"
                />
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                   <div className="w-3 h-3 border border-red-500 bg-red-50 rounded-[1px]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Nama Daerah */}
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label className="text-[11px] font-bold text-charcoal text-right">Nama Daerah :</label>
            <div className="w-[120px]">
              <select 
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full p-1 bg-white border border-gray-300 rounded text-xs outline-none shadow-sm h-7"
              >
                <option value="">All</option>
                <option value="BINTULU">BINTULU</option>
                <option value="KUCHING">KUCHING</option>
                <option value="MIRI">MIRI</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-[160px_1fr] gap-4">
            <div></div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.isReady}
                  onChange={(e) => handleFilterChange('isReady', e.target.checked)}
                  className="w-3 h-3 mt-0.5" 
                />
                <span className="text-[11px] font-medium text-charcoal">Bersedia untuk menyediakan Rumusan Peperiksaan</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.isOpenExaminer}
                  onChange={(e) => handleFilterChange('isOpenExaminer', e.target.checked)}
                  className="w-3 h-3 mt-0.5" 
                />
                <span className="text-[11px] font-medium text-charcoal">Permintaan untuk Membuka Peperiksaan yang Dikunci</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-[160px_1fr] gap-4 mt-2">
            <div></div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSearch}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-300 rounded shadow-sm hover:bg-gray-100 transition-all text-xs font-bold"
              >
                <Search className="w-3.5 h-3.5 text-action-teal" />
                Cari
              </button>
              <button 
                onClick={() => {
                  setIsSearched(false);
                  setFilters({
                    status: '',
                    subject: '',
                    district: '',
                    regNo: '',
                    dateFrom: '',
                    dateTo: '',
                    isReady: false,
                    isOpenExaminer: false
                  });
                  handleSearch();
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-300 rounded shadow-sm hover:bg-gray-100 transition-all text-xs font-bold"
              >
                <Filter className="w-3.5 h-3.5 text-orange-500" />
                Kosongkan Keputusan Carian
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden p-0 border-gray-200 shadow-sm rounded-none border">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px] border-collapse">
            <thead className="bg-[#E6EFF5] border-b border-gray-300">
              <tr>
                <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] border-r border-gray-300 uppercase w-12 text-center">NO.</th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] border-r border-gray-300 uppercase">NO. PENDAFTARAN</th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] border-r border-gray-300 uppercase">NAMA DAERAH</th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] border-r border-gray-300 uppercase">TARIKH PEPERIKSAAN</th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] border-r border-gray-300 uppercase text-center">JUMLAH YURAN(RM)</th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] border-r border-gray-300 uppercase text-center">JUMLAH CALON</th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] border-r border-gray-300 uppercase">SUBJEK</th>
                {!isSummaryReadyMode && <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] border-r border-gray-300 uppercase">Status</th>}
                {!isSummaryReadyMode && <th className="px-3 py-2 text-[11px] font-bold text-[#2D5A8E] uppercase text-right">Tindakan</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredData.length > 0 ? filteredData.map((row, index) => (
                <tr 
                  key={row.id} 
                  onClick={() => isSummaryReadyMode ? onView(row.id) : undefined}
                  onDoubleClick={() => isSummaryReadyMode ? onView(row.id) : undefined}
                  className={`hover:bg-blue-50 transition-colors group cursor-pointer`}
                >
                  <td className="px-3 py-1.5 text-[11px] text-charcoal border-r border-gray-200 text-center">{index + 1}</td>
                  <td className="px-3 py-1.5 text-[11px] border-r border-gray-200">
                    <span className="text-blue-600 font-bold hover:underline">
                      {row.regNo} {row.status === ExamStatus.EXPIRED && <span className="text-red-600 font-bold ml-1">(Tamat Tempoh)</span>}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-[11px] font-bold text-charcoal uppercase border-r border-gray-200">{row.district}</td>
                  <td className="px-3 py-1.5 text-[11px] text-blue-600 font-bold border-r border-gray-200">
                    {new Date(row.date).toLocaleDateString('ms-MY')}
                  </td>
                  <td className="px-3 py-1.5 text-[11px] font-bold text-charcoal text-center border-r border-gray-200">{row.fee.toFixed(0)}</td>
                  <td className="px-3 py-1.5 text-[11px] font-bold text-charcoal text-center border-r border-gray-200">
                    {row.candidatesCount || (row.candidates ? row.candidates.length : 0)}
                  </td>
                  <td className="px-3 py-1.5 text-[11px] text-charcoal font-bold border-r border-gray-200">{row.subject}</td>
                  {!isSummaryReadyMode && (
                    <td className="px-3 py-1.5 text-center border-r border-gray-200">
                      <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${
                        row.status === ExamStatus.APPROVED ? 'bg-green-100 text-green-700' : 
                        row.status === ExamStatus.REJECTED ? 'bg-red-100 text-red-700' : 
                        row.status === ExamStatus.PENDING_VERIFICATION ? 'bg-blue-100 text-blue-700' :
                        row.status === ExamStatus.SUBMITTED ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  )}
                  {!isSummaryReadyMode && (
                    <td className="px-3 py-1.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onView(row.id); }} className="hover:text-action-teal transition-all p-1" title="Lihat">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {role === UserRole.DEC && (row.status === ExamStatus.DRAFT || row.status === ExamStatus.REJECTED) && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); onEdit(row.id); }} className="hover:text-brand-red transition-all p-1" title="Edit">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleDeleteItem(row.id, e)} className="hover:text-alert-red transition-all p-1" title="Padam">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={isSummaryReadyMode ? 7 : 9} className="px-4 py-12 text-center text-gray-400 font-medium">
                    Tiada rekod dijumpai
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium">
            {t('totalRecords')}: <span className="text-charcoal font-bold">{filteredData.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-charcoal transition-colors" title={t('first')}>
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-charcoal transition-colors" title={t('previous')}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="bg-white border border-gray-200 px-3 py-1 rounded text-xs font-bold text-brand-red">
              1
            </div>
            <button className="p-2 text-gray-400 hover:text-charcoal transition-colors" title={t('next')}>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-charcoal transition-colors" title={t('last')}>
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
