import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, Trash2, Search, CheckCircle, BarChart3, Users, Award, Percent, 
  BookOpen, PlusCircle, Pencil, XCircle, RefreshCw, AlertCircle
} from 'lucide-react';
import { QuizSubmission, Question } from '../types';
import appConfig from '../app-config.json';

interface TeacherPortalProps {
  questions: Question[];
  submissions: QuizSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<QuizSubmission[]>>;
  onAddQuestion: (newQ: Omit<Question, 'id'>) => void;
  onEditQuestion: (editedQ: Question) => void;
  onDeleteQuestion: (id: string | number) => void;
  onResetQuestions: () => void;
}

type TabType = 'RESULTS' | 'QUESTIONS';

export default function TeacherPortal({
  questions,
  submissions,
  setSubmissions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onResetQuestions
}: TeacherPortalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('RESULTS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSection, setFilterSection] = useState<string>('ALL');

  // Form states for Add / Edit Questions
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  // Question form fields
  const [text, setText] = useState<string>('');
  const [optionA, setOptionA] = useState<string>('');
  const [optionB, setOptionB] = useState<string>('');
  const [optionC, setOptionC] = useState<string>('');
  const [optionD, setOptionD] = useState<string>('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Clear student submissions local log portfolio
  const handleClearResults = () => {
    const confirmed = window.confirm(
      "CRITICAL SECURITY VERIFICATION: Are you sure you want to permanently empty the entire student results grade book? This action cannot be revoked."
    );
    if (!confirmed) return;

    localStorage.removeItem('qb_submissions_default');
    setSubmissions([]);
    alert("Grade book registries have been reset successfully.");
  };

  // Populate form with question values for editing
  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setText(q.text);
    setOptionA(q.options[0]);
    setOptionB(q.options[1]);
    setOptionC(q.options[2]);
    setOptionD(q.options[3]);
    setCorrectOption(q.correctOption);
    setExplanation(q.explanation);
    setFormError(null);
    setIsFormOpen(true);
    
    // Smooth scroll to form element
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Open empty form for adding question
  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOption('A');
    setExplanation('');
    setFormError(null);
    setIsFormOpen(true);
  };

  // Form submission handler
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form inputs validation
    if (!text.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim() || !explanation.trim()) {
      setFormError("All input fields are strictly required to define a clean curriculum question.");
      return;
    }

    const questionData = {
      text: text.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()] as [string, string, string, string],
      correctOption,
      explanation: explanation.trim()
    };

    if (editingQuestion) {
      // Edit existing
      onEditQuestion({
        ...questionData,
        id: editingQuestion.id
      });
      alert("Question updated successfully! ✏️");
    } else {
      // Add new
      onAddQuestion(questionData);
      alert("New Question cataloged successfully! ➕");
    }

    // Reset Form
    setIsFormOpen(false);
    setEditingQuestion(null);
  };

  // Computer Stats
  const totalSubmissions = submissions.length;
  const averageScore = totalSubmissions > 0 
    ? parseFloat((submissions.reduce((acc, s) => acc + s.score, 0) / totalSubmissions).toFixed(1))
    : 0;
  
  // Calculate average percentage with safe default values
  const totalQCount = questions.length || 10;
  const averagePercent = totalSubmissions > 0 
    ? Math.round((averageScore / totalQCount) * 100)
    : 0;

  // Max score
  const maxScore = totalSubmissions > 0
    ? Math.max(...submissions.map(s => s.score))
    : 0;

  // Sections list for filtering
  const sections = Array.from(new Set(submissions.map(s => s.student.section))).filter(Boolean);

  // Search and filtered results
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      s.student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.student.rollNumber.includes(searchQuery) ||
      s.student.section.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSection = filterSection === 'ALL' || s.student.section === filterSection;
    
    return matchesSearch && matchesSection;
  });

  // Score distribution counts (0-2, 3-5, 6-7, 8+)
  const scoreBuckets = { '0-2': 0, '3-5': 0, '6-7': 0, '8+': 0 };
  submissions.forEach(s => {
    if (s.score <= 2) scoreBuckets['0-2']++;
    else if (s.score <= 5) scoreBuckets['3-5']++;
    else if (s.score <= 7) scoreBuckets['6-7']++;
    else scoreBuckets['8+']++;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Tab Selectors header in neobrutalist style */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-4 border-indigo-950 bg-white p-4 rounded-3xl shadow-[5px_5px_0px_0px_rgba(79,70,229,1)] gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 border-2 border-indigo-950 rounded-xl flex items-center justify-center text-white font-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
            T
          </div>
          <div>
            <h2 className="text-lg font-black uppercase text-indigo-950 tracking-tight font-display">
              SCHOOL PRINCIPAL & TEACHER DESK
            </h2>
            <p className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
              {appConfig.className} • {appConfig.subject} Portal
            </p>
          </div>
        </div>

        {/* Action Tabs selector button set */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('RESULTS')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border-2 border-indigo-950 text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              activeTab === 'RESULTS' 
                ? 'bg-yellow-400 text-indigo-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] translate-x-[-1px] translate-y-[-1px]' 
                : 'bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Users className="w-4 h-4 stroke-[2.5]" />
            <span>Submissions & Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('QUESTIONS')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border-2 border-indigo-950 text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              activeTab === 'QUESTIONS' 
                ? 'bg-yellow-400 text-indigo-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] translate-x-[-1px] translate-y-[-1px]' 
                : 'bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>Syllabus Questions ({questions.length})</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard Widget Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border-2 border-indigo-950 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-950 rounded-2xl border-2 border-indigo-950">
            <Users className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-widest">Participants</div>
            <div className="text-xl md:text-2xl font-black font-display text-indigo-950">{totalSubmissions}</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border-2 border-indigo-950 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-4">
          <div className="p-3 bg-yellow-400 text-indigo-950 rounded-2xl border-2 border-indigo-950">
            <Percent className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-widest">Average Marks</div>
            <div className="text-xl md:text-2xl font-black font-display text-indigo-950">
              {averagePercent}% <span className="text-xs text-indigo-600 font-extrabold">({averageScore})</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border-2 border-indigo-950 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-4">
          <div className="p-3 bg-emerald-400 text-indigo-950 rounded-2xl border-2 border-indigo-950">
            <Award className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-widest">Highest Student</div>
            <div className="text-xl md:text-2xl font-black font-display text-indigo-950">{maxScore} / {questions.length}</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border-2 border-indigo-950 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-4">
          <div className="p-3 bg-slate-55 text-indigo-950 rounded-2xl border-2 border-indigo-950">
            <Database className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-widest">Curriculum Set</div>
            <div className="text-xl md:text-2xl font-black font-display text-indigo-950">{questions.length} Qs</div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'RESULTS' ? (
          /* TAB 1: GRADES & STUDENT REGISTRATION SUBMISSIONS SUB-VIEW */
          <motion.div
            key="results_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {/* Score Analytics Distribution Visual Area */}
            <div className="bg-white border-4 border-indigo-950 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] space-y-6">
              <div className="flex items-center space-x-2.5">
                <BarChart3 className="w-5.5 h-5.5 text-indigo-950 stroke-[2.5]" />
                <h3 className="text-xl font-black uppercase tracking-tight text-indigo-950 font-display">
                  {appConfig.subject} Grade Distribution Chart
                </h3>
              </div>

              {totalSubmissions > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  
                  {/* Neobrutalist CSS Chart */}
                  <div className="space-y-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Student Score Logs</span>
                    <div className="space-y-3">
                      {Object.entries(scoreBuckets).map(([bucket, count]) => {
                        const percent = Math.round((count / totalSubmissions) * 100);
                        return (
                          <div key={bucket} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700 font-sans">
                              <span className="font-extrabold">{bucket} points grade spectrum</span>
                              <span>{count} students ({percent}%)</span>
                            </div>
                            <div className="w-full h-4 bg-white rounded-full overflow-hidden border-2 border-indigo-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                              <motion.div 
                                className="h-full bg-indigo-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Tips Panel */}
                  <div className="bg-yellow-400 border-2 border-indigo-950 p-6 rounded-2xl text-center space-y-4 flex flex-col justify-center items-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <span className="text-2xl">🎓</span>
                    <h4 className="text-sm font-black text-indigo-950 uppercase">Offline Portfolio Safe</h4>
                    <p className="text-xs text-indigo-950 max-w-sm font-bold leading-relaxed">
                      All metrics write safely inside this browser's secure cache pool. Revert to student views to let them log exam marks continuously.
                    </p>
                    <button
                      onClick={handleClearResults}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black border-2 border-indigo-950 rounded-lg text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      Delete All Grades
                    </button>
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-sm font-bold font-display">
                  No submissions cataloged yet. Revert to Student View to complete a mock examination quiz.
                </div>
              )}
            </div>

            {/* Submission Registry Database Grid */}
            <div className="bg-white border-4 border-indigo-950 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(79,70,229,1)]">
              
              <div className="px-6 pt-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-indigo-950 font-display">Student Performance Ledger</h3>
                  <p className="text-xs text-slate-500 font-bold">Exam submissions filtered inside the system</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  
                  {/* Search box */}
                  <div className="relative flex-1 sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-indigo-950 pointer-events-none">
                      <Search className="w-4 h-4 stroke-[2.5]" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, section, roll..."
                      className="w-full pl-9 pr-4 py-2 bg-white text-indigo-950 font-bold text-xs rounded-xl border-2 border-indigo-950 outline-hidden focus:bg-yellow-50 transition-all font-mono"
                    />
                  </div>

                  {/* Dropdown Filter */}
                  <div className="relative">
                    <select
                      value={filterSection}
                      onChange={(e) => setFilterSection(e.target.value)}
                      className="pl-3 pr-8 py-2 bg-white border-2 border-indigo-950 text-indigo-950 font-black text-xs rounded-xl focus:bg-yellow-50 outline-hidden cursor-pointer"
                    >
                      <option value="ALL">All Sections</option>
                      {sections.map(sec => (
                        <option key={sec} value={sec}>Sec {sec}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              {/* Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-yellow-400 border-y-2 border-indigo-950 text-[11px] font-black text-indigo-955 font-mono">
                      <th className="p-4 pl-6">TIMESTAMP</th>
                      <th className="p-4">STUDENT NAME</th>
                      <th className="p-4">CLASS LEVEL</th>
                      <th className="p-4">SECTION</th>
                      <th className="p-4">ROLL NO.</th>
                      <th className="p-4 text-right pr-6">EVALUATION METRIC (SCORE)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-sans">
                    {filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((s, index) => {
                        const totalQ = s.totalQuestions || questions.length || 10;
                        const scorePercent = Math.round((s.score / totalQ) * 100);
                        let badgeStyle = 'bg-slate-50 border-indigo-950 text-indigo-950';
                        if (scorePercent >= 80) badgeStyle = 'bg-emerald-400 text-indigo-950 font-black border-2 border-indigo-950';
                        else if (scorePercent >= 50) badgeStyle = 'bg-yellow-300 text-indigo-950 font-black border-2 border-indigo-950';
                        else badgeStyle = 'bg-rose-400 text-indigo-950 font-black border-2 border-indigo-950';

                        return (
                          <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 pl-6 font-mono font-bold text-slate-500">{s.timestamp || 'Immediate Log'}</td>
                            <td className="p-4 font-black text-indigo-950 text-sm">{s.student.name}</td>
                            <td className="p-4 font-extrabold text-indigo-900">{s.student.className}</td>
                            <td className="p-4 font-extrabold text-indigo-900">Sec {s.student.section}</td>
                            <td className="p-4 font-mono font-extrabold text-indigo-800">#{s.student.rollNumber}</td>
                            <td className="p-4 text-right pr-6">
                              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-mono uppercase ${badgeStyle}`}>
                                {s.score} / {totalQ} ({scorePercent}%)
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-indigo-950 font-black text-sm">
                          No logged results found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </motion.div>
        ) : (
          /* TAB 2: QUESTION EDITOR & SYLLABUS MAKER DESK */
          <motion.div
            key="questions_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Top Command Ribbon Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-indigo-50 border-2 border-indigo-950 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-900 stroke-[2.5]" />
                <p className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  Active Exam Syllabus: <strong className="text-indigo-600 underline font-mono">{questions.length}</strong> Questions Compiled
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onResetQuestions}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-950 text-[11px] font-black uppercase tracking-wider border-2 border-indigo-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default Syllabus</span>
                </button>

                <button
                  onClick={handleOpenAdd}
                  className="flex items-center space-x-1 px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-indigo-950 text-[11px] font-black uppercase tracking-wider border-2 border-indigo-950 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add New Question</span>
                </button>
              </div>
            </div>

            {/* Editable Question Form Area */}
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-yellow-100 border-4 border-indigo-950 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"
              >
                <div className="flex items-center justify-between border-b-2 border-indigo-950 pb-3 mb-4">
                  <h4 className="font-extrabold uppercase text-indigo-950 text-sm tracking-tight flex items-center gap-1.5">
                    <span>✏️</span>
                    <span>{editingQuestion ? 'Edit Existing Assignment Question' : 'Formulate New Syllabus Question'}</span>
                  </h4>
                  
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-1 text-slate-500 hover:text-indigo-950 rounded border hover:bg-white transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-950 p-3 rounded-xl text-xs font-bold leading-relaxed flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
                  
                  {/* Question Textarea */}
                  <div>
                    <label className="block font-black uppercase text-indigo-950 mb-1">
                      1. Question Prompt Text
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="e.g. Which of the following components connects multiple computers into a unified local network?"
                      className="w-full p-3 bg-white border-2 border-indigo-950 rounded-xl text-indigo-950 font-bold outline-hidden transition-all focus:bg-yellow-50"
                      rows={3}
                    />
                  </div>

                  {/* Options Input Fields in grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-black uppercase text-indigo-950 mb-1 select-none">
                        Option A
                      </label>
                      <input
                        type="text"
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                        placeholder="Option A description"
                        className="w-full p-2.5 bg-white border-2 border-indigo-950 rounded-xl text-indigo-950 font-bold outline-hidden focus:bg-yellow-50"
                      />
                    </div>

                    <div>
                      <label className="block font-black uppercase text-indigo-950 mb-1 select-none">
                        Option B
                      </label>
                      <input
                        type="text"
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                        placeholder="Option B description"
                        className="w-full p-2.5 bg-white border-2 border-indigo-950 rounded-xl text-indigo-950 font-bold outline-hidden focus:bg-yellow-50"
                      />
                    </div>

                    <div>
                      <label className="block font-black uppercase text-indigo-950 mb-1 select-none">
                        Option C
                      </label>
                      <input
                        type="text"
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                        placeholder="Option C description"
                        className="w-full p-2.5 bg-white border-2 border-indigo-950 rounded-xl text-indigo-950 font-bold outline-hidden focus:bg-yellow-50"
                      />
                    </div>

                    <div>
                      <label className="block font-black uppercase text-indigo-950 mb-1 select-none">
                        Option D
                      </label>
                      <input
                        type="text"
                        value={optionD}
                        onChange={(e) => setOptionD(e.target.value)}
                        placeholder="Option D description"
                        className="w-full p-2.5 bg-white border-2 border-indigo-950 rounded-xl text-indigo-950 font-bold outline-hidden focus:bg-yellow-50"
                      />
                    </div>
                  </div>

                  {/* Correct Option Selector */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block font-black uppercase text-indigo-950 mb-1">
                        2. Correct Choice Identifier
                      </label>
                      <select
                        value={correctOption}
                        onChange={(e) => setCorrectOption(e.target.value as 'A' | 'B' | 'C' | 'D')}
                        className="w-full p-2.5 bg-white border-2 border-indigo-950 rounded-xl text-indigo-950 font-black outline-hidden cursor-pointer"
                      >
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>

                    {/* Explanation manual text area */}
                    <div className="md:col-span-2">
                      <label className="block font-black uppercase text-indigo-950 mb-1">
                        3. Interactive Solution Explanation Info
                      </label>
                      <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        placeholder="Explain why this choice is correct (displayed below answer reports)..."
                        className="w-full p-2.5 bg-white border-2 border-indigo-950 rounded-xl text-indigo-950 font-bold outline-hidden transition-all focus:bg-yellow-50"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Validation check confirmation */}
                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 bg-white text-indigo-950 font-black border-2 border-indigo-950 rounded-xl text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black border-2 border-indigo-950 rounded-xl text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      {editingQuestion ? 'Apply Edits' : 'Publish Question'}
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* Curriculum Table List of Active Questions */}
            <div className="space-y-4">
              {questions.length > 0 ? (
                questions.map((q, idx) => (
                  <div 
                    key={q.id}
                    className="bg-white border-2 border-indigo-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4.5px_4.5px_0px_0px_rgba(79,70,229,1)] transition-all"
                  >
                    
                    {/* Top title line */}
                    <div className="bg-slate-50 border-b-2 border-indigo-950 px-4 py-2.5 flex items-center justify-between text-xs">
                      <span className="font-mono font-black text-slate-500 uppercase tracking-wider">
                        CURRICULUM UNIT QUESTION #{idx + 1}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="flex items-center space-x-1 px-2 py-1 bg-white hover:bg-indigo-50 border border-indigo-950 text-[10px] text-indigo-950 font-extrabold uppercase rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm("CONFIRMATION: Are you sure you want to delete this question?")) {
                              onDeleteQuestion(q.id);
                            }
                          }}
                          className="flex items-center space-x-1 px-2 py-1 bg-rose-500 hover:bg-rose-600 border border-indigo-950 text-[10px] text-white font-extrabold uppercase rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 text-white" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Question summary presentation */}
                    <div className="p-5 space-y-4">
                      
                      <h4 className="text-sm font-black text-indigo-955 font-display leading-relaxed">
                        {q.text}
                      </h4>

                      {/* Display Choices */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const optionChar = ['A', 'B', 'C', 'D'][oIdx];
                          const isCorrect = q.correctOption === optionChar;

                          return (
                            <div 
                              key={oIdx}
                              className={`p-2.5 border rounded-xl flex items-center space-x-2 ${
                                isCorrect 
                                  ? 'bg-emerald-100 text-indigo-950 border-emerald-500 font-extrabold' 
                                  : 'bg-white text-slate-600 border-slate-100'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded border text-[10px] flex items-center justify-center font-mono font-black shrink-0 select-none ${
                                isCorrect ? 'bg-emerald-400 border-indigo-950 text-indigo-950' : 'bg-slate-50'
                              }`}>
                                {optionChar}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation Manual Block */}
                      <div className="bg-yellow-50 border border-amber-200 p-4 rounded-xl text-xs space-y-1">
                        <div className="font-extrabold uppercase text-[10px] text-amber-800 tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Interactive Explanatory Solution Guide:</span>
                        </div>
                        <p className="text-indigo-955 font-semibold leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>

                    </div>

                  </div>
                ))
              ) : (
                <div className="bg-white border-4 border-indigo-950 rounded-3xl p-12 text-center text-slate-500 font-bold font-display space-y-4">
                  <p>Curriculum syllabus is completely empty.</p>
                  <button
                    onClick={onResetQuestions}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black border-2 border-indigo-950 rounded-xl hover:shadow-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Load Default Roster Set</span>
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
