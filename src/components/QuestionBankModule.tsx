import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Database, Edit2, Trash2, Plus, X, BookOpen, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { sharedQuestions, updateSharedQuestions, Question } from '../data/mockQuestions';

const COURSE_CATEGORIES = [
  { id: 'Category A', name: 'Principles of First Aid' },
  { id: 'Category B', name: 'Basic Life Support & CPR' },
  { id: 'Category C', name: 'Wounds, Bleeding & Shock' },
  { id: 'Category D', name: 'Musculoskeletal Injuries & Transport' },
];

const initialSubjek = [
  { id: '1', name: 'Pertolongan Cemas Asas dan CPR', code: '800/2', duration: '14' },
  { id: '2', name: 'Pertolongan Cemas Asas, CPR dan AED', code: 'CBFA1021', duration: '14' },
  { id: '3', name: 'Pendidikan Palang Merah dan Bulan Sabit Merah', code: 'CERC1011', duration: '8' },
  { id: '4', name: 'Pendidikan Kesihatan', code: 'CHED1031', duration: '8' },
  { id: '5', name: 'Rawatan Rumah', code: 'CHNU1041', duration: '8' },
  { id: '6', name: 'PERTOLONGAN CEMAS LANJUTAN, CPR & AED', code: 'PAFA1042', duration: '18 JAM' },
  { id: '7', name: 'PENGENALAN PERTOLONGAN CEMAS, CPR & AED', code: 'PIFA 1021', duration: '8 JAM' },
];

export const QuestionBankModule = () => {
  const [selectedCourse, setSelectedCourse] = useState<{name: string, code: string} | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const [questions, setQuestions] = useState<Question[]>(sharedQuestions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    updateSharedQuestions(questions);
  }, [questions]);

  const handleAddNew = (categoryId: string) => {
    setIsAddingNew(true);
    setEditForm({ 
      id: 'q_' + Math.random().toString(36).substr(2, 9), 
      course: selectedCourse?.code || '',
      category: categoryId,
      type: 'Objective',
      description: '', 
      options: ['', '', '', ''], 
      answer: '',
      score: 1 
    });
    setEditingIndex(-1);
  };

  const saveNew = () => {
    if (editForm) {
      setQuestions([editForm, ...questions]);
      setIsAddingNew(false);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handleEdit = (questionId: string) => {
    const idx = questions.findIndex(q => q.id === questionId);
    if (idx !== -1) {
      setEditingIndex(idx);
      setEditForm({ ...questions[idx] });
    }
  };

  const saveEdit = () => {
    if (editForm && editingIndex !== null) {
      const newQ = [...questions];
      newQ[editingIndex] = editForm;
      setQuestions(newQ);
      setEditingIndex(null);
      setEditForm(null);
      setIsAddingNew(false);
    }
  };

  const handleDelete = (questionId: string) => {
    const newQ = questions.filter(q => q.id !== questionId);
    setQuestions(newQ);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditForm(null);
    setIsAddingNew(false);
  };

  const renderEditForm = () => {
    if (!editForm) return null;
    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h4 className="font-bold text-gray-900">{isAddingNew ? 'Question Setup (New)' : 'Edit Question'}</h4>
            <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Course</label>
                <input 
                  value={editForm.course}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded-md p-2.5 text-sm outline-none text-gray-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Score</label>
                <input 
                  type="number"
                  value={editForm.score}
                  onChange={(e) => setEditForm({...editForm, score: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Type</label>
                <select 
                  value={editForm.type}
                  onChange={(e) => setEditForm({...editForm, type: e.target.value as 'Objective' | 'Subjective'})}
                  className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none bg-white"
                >
                  <option value="Objective">Objective</option>
                  <option value="Subjective">Subjective</option>
                </select>
              </div>
              {editForm.type === 'Objective' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Option Count</label>
                  <select 
                    value={editForm.options.length}
                    onChange={(e) => {
                      const count = parseInt(e.target.value);
                      const currentOptions = [...editForm.options];
                      if (count > currentOptions.length) {
                        currentOptions.push(...Array(count - currentOptions.length).fill(''));
                      } else {
                        currentOptions.splice(count);
                      }
                      setEditForm({...editForm, options: currentOptions});
                    }}
                    className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Options</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
              <textarea 
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
                rows={3}
                placeholder="Question Details"
              />
            </div>
            
            {editForm.type === 'Objective' && (
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Option of answer
                </label>
                <div className="space-y-2">
                  {editForm.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-8 h-8 shrink-0 rounded bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input 
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOps = [...editForm.options];
                          newOps[idx] = e.target.value;
                          setEditForm({...editForm, options: newOps});
                        }}
                        placeholder={`Option Description ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Answer</label>
              {editForm.type === 'Objective' ? (
                <select 
                  value={editForm.answer}
                  onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
                  className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none bg-white"
                >
                  <option value="">-- Select Answer --</option>
                  {editForm.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    return <option key={idx} value={letter}>{letter} - {opt || `(Empty Option)`}</option>
                  })}
                </select>
              ) : (
                <textarea 
                  value={editForm.answer}
                  onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
                  className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
                  rows={2}
                  placeholder="Expected answer or grading rubric..."
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button onClick={cancelEdit} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-md transition-colors">Cancel</button>
            <button onClick={isAddingNew ? saveNew : saveEdit} disabled={!editForm.category} className="disabled:opacity-50 px-5 py-2 bg-action-teal text-white rounded-md text-sm font-bold shadow-sm hover:bg-teal-700 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4"/> Save Question
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedCourse) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-xl text-gray-900 tracking-tight">Question Collection</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {initialSubjek.map((subjek, index) => (
              <motion.button
                key={subjek.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCourse({ name: subjek.name, code: subjek.code })}
                className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-action-teal/30 transition-all text-left flex flex-col items-start gap-4 h-full relative group"
              >
                <div className="flex bg-action-teal/10 text-action-teal p-3 rounded-lg group-hover:bg-action-teal group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight mb-2 text-sm md:text-base">{subjek.name}</h3>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold font-mono inline-block">
                      {subjek.code}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  const courseQuestions = questions.filter(q => q.course === selectedCourse.code);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-xl text-gray-900 tracking-tight">{selectedCourse.code} Questions</h2>
          <p className="text-sm text-gray-500">{selectedCourse.name}</p>
        </div>
      </div>

      <div className="space-y-4">
        {COURSE_CATEGORIES.map(category => {
          const isExpanded = expandedCategory === category.id;
          const questionsInCategory = courseQuestions.filter(q => q.category === category.id);

          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 bg-white hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <h3 className="font-bold text-lg text-charcoal flex items-center gap-2">
                    {category.id}: {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{questionsInCategory.length} questions</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                  {isExpanded ? <ChevronDown className="w-5 h-5"/> : <ChevronRight className="w-5 h-5"/>}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex justify-end mb-4">
                        <button 
                          onClick={() => handleAddNew(category.id)}
                          className="bg-white hover:bg-gray-50 text-action-teal border border-action-teal/30 px-3 py-1.5 text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5"/> New Question
                        </button>
                      </div>

                      <div className="overflow-x-auto rounded-lg border border-gray-100">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-widest font-semibold">
                            <tr>
                              <th className="px-6 py-4 text-center">Type</th>
                              <th className="px-6 py-4 w-1/2">Description</th>
                              <th className="px-6 py-4 text-center">Score</th>
                              <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {questionsInCategory.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium bg-white">No questions in this category.</td>
                              </tr>
                            ) : (
                              questionsInCategory.map((q) => (
                                <tr key={q.id} className="hover:bg-gray-50/50 bg-white">
                                  <td className="px-6 py-4 text-center text-gray-600">{q.type}</td>
                                  <td className="px-6 py-4 text-gray-900 whitespace-normal min-w-[200px]">{q.description}</td>
                                  <td className="px-6 py-4 text-center text-action-teal font-bold">{q.score}</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <button 
                                        onClick={() => handleEdit(q.id)}
                                        className="p-1.5 text-gray-400 hover:text-action-teal transition-colors"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(q.id)}
                                        className="p-1.5 text-gray-400 hover:text-brand-red transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      
      {renderEditForm()}
    </motion.div>
  );
};

