import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { Question, StudentInfo, QuizSubmission } from './types';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import QuizContainer from './components/QuizContainer';
import ResultSummary from './components/ResultSummary';
import TeacherPortal from './components/TeacherPortal';
import TeacherLogin from './components/TeacherLogin';
import appConfig from './app-config.json';
import { DEFAULT_QUESTIONS } from './utils/googleSheets';

export default function App() {
  // State elements
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('qb_teacher_authenticated') === 'true';
  });

  // Load questions initially from local storage or fallback to standard DEFAULT_QUESTIONS roster
  const [questions, setQuestions] = useState<Question[]>(() => {
    const cached = localStorage.getItem('qb_questions_list');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return DEFAULT_QUESTIONS;
      }
    }
    return DEFAULT_QUESTIONS;
  });

  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);
  
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => {
    const cached = localStorage.getItem('qb_submissions_default');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<QuizSubmission | null>(null);

  // Student details entered
  const handleStudentSignup = (info: StudentInfo) => {
    let pool = [...questions];
    
    // Ensure we have at least 10 unique questions by merging with defaults if edited list is short
    if (pool.length < 10) {
      for (const defQ of DEFAULT_QUESTIONS) {
        if (pool.length >= 10) break;
        const alreadyExists = pool.some(
          pq => pq.text.toLowerCase().trim() === defQ.text.toLowerCase().trim()
        );
        if (!alreadyExists) {
          pool.push({ ...defQ, id: 'def_' + defQ.id });
        }
      }
    }

    // Shuffle
    const shuffled = pool.sort(() => Math.random() - 0.5);

    // Pick top 10 questions for high-quality variety
    const selected10 = shuffled.slice(0, 10);
    
    setActiveQuizQuestions(selected10);
    setStudent(info);
    setCurrentSubmission(null);
  };

  // Student submitted quiz
  const handleQuizSubmission = async (studentAnswers: Record<string | number, 'A' | 'B' | 'C' | 'D'>) => {
    if (!student) return;

    let score = 0;
    activeQuizQuestions.forEach(q => {
      if (studentAnswers[q.id] === q.correctOption) {
        score++;
      }
    });

    const now = new Date();
    const submissionObj: QuizSubmission = {
      student,
      answers: studentAnswers,
      score,
      totalQuestions: activeQuizQuestions.length,
      timestamp: now.toLocaleString()
    };

    setCurrentSubmission(submissionObj);

    // Save result
    const defaults = [...submissions, submissionObj];
    localStorage.setItem('qb_submissions_default', JSON.stringify(defaults));
    setSubmissions(defaults);
  };

  // Let student take quiz again
  const handleResetQuiz = () => {
    setStudent(null);
    setCurrentSubmission(null);
  };

  // Question CRUD management handlers
  const handleAddQuestion = (newQ: Omit<Question, 'id'>) => {
    const newId = 'user_q_' + Date.now();
    const questionToAdd: Question = { ...newQ, id: newId };
    const updated = [...questions, questionToAdd];
    setQuestions(updated);
    localStorage.setItem('qb_questions_list', JSON.stringify(updated));
  };

  const handleEditQuestion = (editedQ: Question) => {
    const updated = questions.map(q => q.id === editedQ.id ? editedQ : q);
    setQuestions(updated);
    localStorage.setItem('qb_questions_list', JSON.stringify(updated));
  };

  const handleDeleteQuestion = (id: string | number) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    localStorage.setItem('qb_questions_list', JSON.stringify(updated));
  };

  const handleResetQuestions = () => {
    if (window.confirm("Are you sure you want to revert all questions to the default syllabus set?")) {
      setQuestions(DEFAULT_QUESTIONS);
      localStorage.setItem('qb_questions_list', JSON.stringify(DEFAULT_QUESTIONS));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Sleek App Navigation bar */}
      <Header 
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
      />

      {/* Main Container Section */}
      <main className="flex-1 overflow-y-auto">

        <AnimatePresence mode="wait">
          {isAdminView ? (
            !isTeacherAuthenticated ? (
              /* SECURED LOCK SCREEN */
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <TeacherLogin 
                  onSuccess={() => setIsTeacherAuthenticated(true)}
                  onCancel={() => setIsAdminView(false)}
                />
              </motion.div>
            ) : (
              /* TEACHER PORTAL ADMIN INTERFACE */
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <TeacherPortal 
                  questions={questions}
                  submissions={submissions}
                  setSubmissions={setSubmissions}
                  onAddQuestion={handleAddQuestion}
                  onEditQuestion={handleEditQuestion}
                  onDeleteQuestion={handleDeleteQuestion}
                  onResetQuestions={handleResetQuestions}
                />
              </motion.div>
            )
          ) : (
            /* STUDENT EXAM MODE INTERFACE */
            <motion.div
              key="student"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="py-6"
            >
              {!student ? (
                /* STEP 1: Student detail form credentials */
                <HeroSection 
                  onStartQuiz={handleStudentSignup}
                  spreadsheetId={null}
                  totalQuestions={10}
                />
              ) : !currentSubmission ? (
                /* STEP 2: Active sequential quiz container */
                <QuizContainer 
                  questions={activeQuizQuestions}
                  student={student}
                  onSubmitQuiz={handleQuizSubmission}
                />
              ) : (
                /* STEP 3: Grading & highlighted answers */
                <ResultSummary 
                  questions={activeQuizQuestions}
                  student={student}
                  submission={currentSubmission}
                  onReset={handleResetQuiz}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Humble Footer branding panel */}
      <footer className="py-6 text-center text-slate-400 text-[10px] font-medium border-t border-slate-100 bg-white">
        <p className="font-display tracking-tight text-slate-500 font-semibold">
          QuizBot © 2026 • {appConfig.className} {appConfig.subject} Assignments Engine
        </p>
        <p className="font-mono text-[9px] text-slate-300 mt-1">
          Developed as a local digital portfolio for classroom exams
        </p>
      </footer>

    </div>
  );
}
