import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Save, CheckCircle, Download, BookOpen, Clock, CalendarDays, Key, FileCheck2, ChevronDown, ChevronRight } from 'lucide-react';
import { sharedQuestions } from '../data/mockQuestions';

export const ExamPaperGeneratorModule = () => {
  const [course, setCourse] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examDuration, setExamDuration] = useState('');
  const [examiner, setExaminer] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const availableCategories = Array.from(new Set(sharedQuestions.filter(q => q.course === course).map(q => q.category)));

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const toggleQuestionSelection = (qId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(qId)) {
        return prev.filter(id => id !== qId);
      }
      return [...prev, qId];
    });
  };

  const generatePaper = () => {
    setIsGenerated(true);
    setTimeout(() => {
      setIsGenerated(false);
      alert(`Exam paper generated successfully with ${selectedQuestions.length} questions!`);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="font-bold text-xl text-gray-900 tracking-tight">Generation of Exam Paper</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-action-teal" /> 
                Exam Details
              </h3>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Course</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  <option value="">-- Select Course --</option>
                  <option value="800/2">800/2 - Pertolongan Cemas Asas dan CPR</option>
                  <option value="CBFA1021">CBFA1021 - Pertolongan Cemas Asas, CPR dan AED</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Batch Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. BATCH-2024-01"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5"/> Exam Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Exam Time</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Exam Duration (Mins)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 120"
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Examiner / Coordinator</label>
                  <input 
                    type="text" 
                    placeholder="Name"
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                    value={examiner}
                    onChange={(e) => setExaminer(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-action-teal" /> 
                Select Questions
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Select the specific questions to include from each category.</p>
                
                <div className="space-y-3">
                  {!course ? (
                    <div className="text-sm text-gray-400 italic">Please select a course to see available questions.</div>
                  ) : availableCategories.length === 0 ? (
                    <div className="text-sm text-gray-400 italic">No categories found in Question Bank for this course.</div>
                  ) : (
                    availableCategories.map(cat => {
                      const questionsInCategory = sharedQuestions.filter(q => q.course === course && q.category === cat);
                      const selectedCount = questionsInCategory.filter(q => selectedQuestions.includes(q.id)).length;
                      const isExpanded = expandedCategory === cat;
                      
                      return (
                        <div key={cat} className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                          <button 
                            onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <div>
                              <span className="font-bold text-sm text-charcoal">{cat}</span>
                              <p className="text-xs text-gray-500 mt-0.5">{selectedCount} / {questionsInCategory.length} Selected</p>
                            </div>
                            <div className="text-gray-400 p-1">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-gray-100"
                              >
                                <div className="p-3 space-y-2 bg-gray-50/50">
                                  {questionsInCategory.map(q => {
                                    const isSelected = selectedQuestions.includes(q.id);
                                    return (
                                      <label key={q.id} className="flex items-start gap-3 p-2 rounded hover:bg-white cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                                        <div className="pt-0.5">
                                          <input 
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleQuestionSelection(q.id)}
                                            className="w-4 h-4 rounded text-action-teal focus:ring-action-teal/20 border-gray-300"
                                          />
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-800 line-clamp-2">{q.description}</p>
                                          <div className="flex gap-2 items-center mt-1">
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{q.type}</span>
                                            <span className="text-[10px] text-gray-500">Score: {q.score}</span>
                                          </div>
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={generatePaper}
                  disabled={isGenerated || !course}
                  className={`px-6 py-3 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
                    isGenerated || !course 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-action-teal text-white hover:bg-teal-700 hover:shadow-md'
                  }`}
                >
                  {isGenerated ? (
                    <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span> Generating...</>
                  ) : (
                    <><FileText className="w-4 h-4" /> Generate Exam Paper</>
                  )}
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};
