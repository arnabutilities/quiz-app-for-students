import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronRight, CheckCircle2, ChevronLeft, Lightbulb } from 'lucide-react';
import { Question, StudentInfo } from '../types';
import InteractiveGraphic from './InteractiveGraphic';

interface QuizContainerProps {
  questions: Question[];
  student: StudentInfo;
  onSubmitQuiz: (answers: Record<string | number, 'A' | 'B' | 'C' | 'D'>) => void;
}

export default function QuizContainer({ questions, student, onSubmitQuiz }: QuizContainerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string | number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showHint, setShowHint] = useState<boolean>(false);

  // current active question
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: opt
    });
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Submit all answers to parent
    onSubmitQuiz(answers);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      
      {/* Student Banner Metadata Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-yellow-400 border-2 border-indigo-950 rounded-2xl px-5 py-3.5 mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 border-2 border-indigo-950 rounded-xl text-white flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            {student.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-black text-indigo-950 uppercase">{student.name}</div>
            <div className="text-[11px] text-indigo-900 font-mono font-bold">
              {student.className} • Section {student.section} • Roll #{student.rollNumber}
            </div>
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-950 rounded-xl px-3.5 py-1 text-[11px] font-black uppercase text-indigo-950 flex items-center space-x-1.5 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)]">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>Active Assignment Task</span>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="space-y-2 mb-8">
        <div className="flex justify-between items-center text-xs text-indigo-950 font-black font-mono">
          <span>🎯 QUESTION {currentIndex + 1} OF {questions.length}</span>
          <span>{progressPercent}% COMPLETED</span>
        </div>
        <div className="w-full h-4 bg-white rounded-full overflow-hidden border-2 border-indigo-950 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
          <motion.div 
            className="h-full bg-indigo-600 border-r-2 border-indigo-950"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Grid: Left Column (Visual Helper Graphic), Right Column (Question + Choices) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Helper Graphic column (Spans 5 columns on desktop) */}
        <div className="md:col-span-5 space-y-4">
          <div className="border-2 border-indigo-950 bg-white p-4 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-3">
            <h4 className="text-xs font-black uppercase font-mono text-indigo-950 tracking-wider flex items-center gap-1.5 justify-center">
              <span>Interactive Graphic Instruction</span>
            </h4>
            <InteractiveGraphic graphic={currentQuestion.graphicKeyword || "web"} />
            <p className="text-xs text-indigo-950 bg-yellow-50 py-2.5 px-3 rounded-xl border-2 border-indigo-950/20 font-bold text-center">
              💡 Hint: Notice how information travels!
            </p>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border-2 border-indigo-950 transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer ${
              showHint 
                ? 'bg-yellow-400 text-indigo-950' 
                : 'bg-white text-indigo-950'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Lightbulb className={`w-4.5 h-4.5 ${showHint ? 'text-indigo-950 fill-yellow-200' : 'text-indigo-950'}`} />
              <span>Need a Hint / Instruction?</span>
            </span>
            <span className="text-[10px] bg-indigo-950 text-white px-2.5 py-0.5 rounded-lg font-black">
              {showHint ? 'Hide' : 'Reveal'}
            </span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div 
                className="bg-yellow-400 border-2 border-indigo-950 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h5 className="text-xs font-black text-indigo-950 flex items-center space-x-1.5 mb-1.5 uppercase">
                  <span>💡 Concept Instruction Builder</span>
                </h5>
                <p className="text-xs text-indigo-950 font-bold leading-relaxed font-sans">{currentQuestion.helpInstruction || "Read all choices to choose the most accurate response."}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quiz execution card (Spans 7 columns on desktop) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white border-2 border-indigo-950 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] min-h-[380px] flex flex-col justify-between">
            
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1 bg-indigo-600 border-2 border-indigo-950 text-white rounded-lg px-2.5 py-1 text-[10px] font-black font-mono shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)]">
                QUESTION #{currentIndex + 1}
              </span>
              
              {/* Question Text */}
              <h3 className="text-lg md:text-xl font-black font-display text-indigo-950 leading-snug">
                {currentQuestion.text}
              </h3>
 
              {/* Choices List */}
              <div className="grid grid-cols-1 gap-3">
                {['A', 'B', 'C', 'D'].map((char, index) => {
                  const optionText = currentQuestion["options"]?.[index];
                  if (!optionText) return null;
                  const isSelected = answers[currentQuestion.id] === char;

                  return (
                    <motion.button
                      key={char}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectOption(char as 'A' | 'B' | 'C' | 'D')}
                      className={`text-left p-4 rounded-xl flex items-start space-x-3 border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-950 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
                          : 'bg-stone-50 border-indigo-950 hover:bg-yellow-50 text-indigo-950 font-bold shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)]'
                      }`}
                    >
                      <span className={`w-6 h-6 shrink-0 rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-yellow-400 text-indigo-950 border-2 border-indigo-950'
                          : 'bg-white border-2 border-indigo-950 text-indigo-950'
                      }`}>
                        {char}
                      </span>
                      <span className="text-xs sm:text-sm font-black pt-0.5 leading-normal">{optionText}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Pagination / Navigation Footer togglers */}
            <div className="flex items-center justify-between border-t-2 border-dashed border-indigo-100 pt-6 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border-2 border-indigo-950 disabled:opacity-40 text-xs font-black text-indigo-950 rounded-xl transition-all disabled:pointer-events-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-indigo-950 stroke-[2.5]" />
                <span>Back</span>
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!answers[currentQuestion.id]}
                  className="flex items-center space-x-1.5 px-5 py-3 bg-emerald-400 border-2 border-indigo-950 text-indigo-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-950 animate-bounce" />
                  <span>Submit Quiz Assignment</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className="flex items-center space-x-1.5 px-5 py-3 bg-yellow-400 hover:bg-yellow-300 border-2 border-indigo-950 text-indigo-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4 text-indigo-950 stroke-[2.5]" />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
