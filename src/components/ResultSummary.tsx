import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, XCircle, RotateCcw, AlertCircle, FileSpreadsheet, Eye, FileDown } from 'lucide-react';
import { Question, StudentInfo, QuizSubmission } from '../types';
import InteractiveGraphic from './InteractiveGraphic';
import { jsPDF } from 'jspdf';
import appConfig from '../app-config.json';

interface ResultSummaryProps {
  questions: Question[];
  student: StudentInfo;
  submission: QuizSubmission;
  onReset: () => void;
}

export default function ResultSummary({
  questions,
  student,
  submission,
  onReset
}: ResultSummaryProps) {
  const { score, totalQuestions, answers } = submission;
  const percentage = Math.round((score / totalQuestions) * 100);

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      doc.setFont('Helvetica', 'bold');

      // 1. Sleek Top-branding header banner in deep navy slate (matching our design coordinates)
      doc.setFillColor(15, 23, 42); // Indigo-950 equivalent
      doc.rect(0, 0, 210, 42, 'F');

      // 2. High-contrast yellow accent border ribbon
      doc.setFillColor(250, 204, 21); // Yellow-400
      doc.rect(0, 42, 210, 3, 'F');

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("QUIZBOT ASSIGNMENT REPORT CARD", 15, 20);

      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text(`${appConfig.className} ${appConfig.subject} • ${appConfig.quizTitle} Competency Exam`, 15, 28);
      doc.text(`Submitted Date: ${submission.timestamp || new Date().toLocaleString()}`, 15, 33);

      // 3. Student Profile Info block (soft gray backing with deep outline border)
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.5);
      doc.roundedRect(12, 53, 186, 32, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.text("STUDENT PROFILE", 16, 59);

      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Full Name: ${student.name}`, 16, 66);
      doc.text(`Class Level: ${student.className}`, 16, 72);
      doc.text(`Section Group: ${student.section}`, 110, 66);
      doc.text(`School Roll Number: #${student.rollNumber}`, 110, 72);

      // 4. Score Metrics Block Badge
      doc.setFillColor(250, 204, 21); // Yellow-400
      doc.roundedRect(150, 57, 42, 24, 1, 1, 'FD');
      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text("GRADE SCORE", 154, 63);
      doc.setFontSize(14);
      doc.text(`${score} / ${totalQuestions}`, 154, 71);
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Percentage: ${percentage}%`, 154, 77);

      // 5. Build individual Questions report rows
      let y = 92;
      questions.forEach((q, idx) => {
        // Page breaking mechanism for optimal multi-page flow layout
        if (y > 245) {
          doc.addPage();
          y = 15;
        }

        const studentChoice = answers[q.id] || "No Answer";
        const isCorrect = studentChoice === q.correctOption;

        // Individual question card summary banner
        doc.setFillColor(isCorrect ? 209 : 254, isCorrect ? 250 : 226, isCorrect ? 229 : 226); // soft green or soft red
        doc.rect(12, y, 186, 7, 'F');

        doc.setTextColor(15, 23, 42);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(`QUESTION #${idx + 1} (${isCorrect ? 'PASSED/CORRECT' : 'FAILED/WRONG'})`, 15, y + 5);
        y += 7;

        // Question text block
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10.5);
        const splitQuestionText = doc.splitTextToSize(q.text, 180);
        doc.text(splitQuestionText, 15, y + 5);
        y += (splitQuestionText.length * 4.5) + 3;

        // Choice descriptions
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(100, 100, 100);

        const chIdx = ['A', 'B', 'C', 'D'].indexOf(studentChoice);
        const studentChoiceText = chIdx >= 0 ? q.options[chIdx] : 'No Answer Given';

        const correctChIdx = ['A', 'B', 'C', 'D'].indexOf(q.correctOption);
        const correctChoiceText = q.options[correctChIdx];

        doc.text(`Selected Answer Option: ${studentChoice} - "${studentChoiceText}"`, 15, y + 4);
        doc.text(`Correct Solution Answer: ${q.correctOption} - "${correctChoiceText}"`, 15, y + 8);
        y += 12;

        // Interactive Explanation Manual Box
        doc.setFillColor(254, 252, 232); // yellow-50
        doc.setDrawColor(217, 119, 6); // amber/warning border
        doc.roundedRect(14, y, 182, 14, 1, 1, 'FD');

        doc.setTextColor(120, 53, 4);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text("QUESTION EXPLANATION MANUAL:", 17, y + 4.5);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        const splitExplanation = doc.splitTextToSize(q.explanation, 175);
        doc.text(splitExplanation, 17, y + 8.5);
        y += (splitExplanation.length * 4) + 12;
      });

      // Footer branding on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text(`QuizBot Assignment Engine • Powered by Google Sheets API v4 • Page ${i} of ${pageCount}`, 15, 290);
      }

      doc.save(`QuizBot_Grade_${student.name.replace(/\s+/g, '_')}_Roll_${student.rollNumber}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF Report card: ', err);
    }
  };

  useEffect(() => {
    // Automatically trigger PDF download with a small comfort delay for completion feedback
    const timer = setTimeout(() => {
      handleDownloadPDF();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Grade comments
  let gradeText = '';
  let gradeSub = '';
  let gradeColor = '';
  let gradeBg = '';

  if (percentage === 100) {
    gradeText = 'Cyber Expert! 🏆';
    gradeSub = 'Perfect core logic coordinates! Outstanding internet competence!';
    gradeColor = 'text-emerald-700';
    gradeBg = 'bg-emerald-50 border-emerald-100';
  } else if (percentage >= 80) {
    gradeText = 'Digital Explorer! 🚀';
    gradeSub = 'Substantial web knowledge. Ready to browse the internet safely!';
    gradeColor = 'text-blue-700';
    gradeBg = 'bg-blue-50 border-blue-100';
  } else if (percentage >= 50) {
    gradeText = 'Cyber Apprentice! 🛡️';
    gradeSub = 'Good fundamental base. Review explanations below to strengthen safety!';
    gradeColor = 'text-indigo-700';
    gradeBg = 'bg-indigo-50 border-indigo-100';
  } else {
    gradeText = 'Keep Learning! 🧭';
    gradeSub = "Let's read safety instructions and network mechanics, and try again!";
    gradeColor = 'text-rose-700';
    gradeBg = 'bg-rose-50 border-rose-100';
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Scored Celebration Banner Card */}
      <motion.div 
        className="bg-white border-4 border-indigo-950 p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] rounded-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3 flex-1">
          <div className="flex justify-center md:justify-start">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-black font-mono rounded-lg uppercase bg-yellow-400 border-2 border-indigo-950 text-indigo-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
              <Award className="w-4 h-4 text-indigo-950 stroke-[2.5]" />
              <span>Assignment Graded</span>
            </span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-indigo-950`}>
            {gradeText}
          </h2>
          <p className="text-indigo-900 font-semibold text-sm max-w-md leading-relaxed">
            {gradeSub}
          </p>
          <div className="text-[11px] font-mono font-black text-indigo-950 uppercase bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 inline-block mt-2">
            🧑‍💻 Student: <span className="text-indigo-600 font-extrabold">{student.name}</span> (Section {student.section} / #{student.rollNumber})
          </div>
        </div>

        {/* Big circular score gauge */}
        <div className="relative flex items-center justify-center shrink-0 w-36 h-36 border-4 border-indigo-950 bg-yellow-400 rounded-full shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <div className="text-center">
            <div className="text-4xl font-black font-display text-indigo-950">
              {score}/{totalQuestions}
            </div>
            <div className="text-[10px] font-black text-indigo-950 uppercase tracking-widest font-mono mt-0.5">
              SCORE ({percentage}%)
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sync Log Confirmation / Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-yellow-400 border-2 border-indigo-950 rounded-2xl px-5 p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <FileSpreadsheet className={`w-8 h-8 shrink-0 text-indigo-950`} />
          <div>
            <h4 className="text-sm font-black text-indigo-950 uppercase">
              Submission Saved to Local Database! 🟢
            </h4>
            <p className="text-xs text-indigo-950 font-semibold">
              Your score has been cataloged onto the student score dashboard. Download your detailed report card below!
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-indigo-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer shrink-0"
          >
            <FileDown className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Download Answer PDF</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-indigo-950 border-2 border-indigo-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-indigo-950 stroke-[2.5]" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>

      {/* Grid: Detailed Review with green/red highlighting */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-indigo-950 stroke-[2.5]" />
          <h3 className="text-xl font-black uppercase font-display text-indigo-950">Option Selection Correction Paper</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q, idx) => {
            const studentChoice = answers[q.id];
            const isCorrect = studentChoice === q.correctOption;

            return (
              <motion.div 
                key={q.id}
                className={`bg-white rounded-3xl overflow-hidden border-2 border-indigo-950 flex flex-col justify-between transition-all ${
                  isCorrect 
                    ? 'shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]' 
                    : 'shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]'
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                
                {/* Header panel indicating score of this question */}
                <div className={`px-5 py-3 flex items-center justify-between text-xs font-black border-b-2 border-indigo-950 ${
                  isCorrect ? 'bg-emerald-400 text-indigo-950' : 'bg-rose-400 text-indigo-950'
                }`}>
                  <span className="font-mono">QUESTION #{idx + 1}</span>
                  <span className="flex items-center space-x-1 uppercase text-[10px] tracking-wider bg-white px-2 py-0.5 rounded-lg border border-indigo-950">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span className="font-black text-emerald-800">Correct (+1)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
                        <span className="font-black text-rose-800">Wrong (0)</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Question body content */}
                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Miniature Interactive Graphic helper for contextual recollection */}
                  <div className="w-full max-w-[140px] mx-auto">
                    <InteractiveGraphic graphic={q.graphicKeyword || "web"} />
                  </div>

                  <h4 className="text-sm font-black font-display text-indigo-950 leading-snug">
                    {q.text}
                  </h4>

                  {/* Highlighting Answers Option Frame */}
                  <div className="grid grid-cols-1 gap-2">
                    {['A', 'B', 'C', 'D'].map((char, optIdx) => {
                      const optionText = q["options"]?.[optIdx];
                      if (!optionText) return null;

                      const isChosen = studentChoice === char;
                      const isCorrectAnswer = q.correctOption === char;

                      // HIGHLIGHT STATE RULES (Green for correct, Red for chosen wrong)
                      let optionStyle = 'bg-stone-50 border-indigo-950 text-indigo-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.15)]';
                      let iconNode = null;

                      if (isCorrectAnswer) {
                        // All correct options highlighted in GREEN (with check)
                        optionStyle = 'bg-emerald-100 border-2 border-indigo-950 text-indigo-950 font-black shadow-[2.5px_2.5px_0px_0px_rgba(16,185,129,1)]';
                        iconNode = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 stroke-[3]" />;
                      } else if (isChosen && !isCorrect) {
                        // User's wrong option highlighted in RED (with cross)
                        optionStyle = 'bg-rose-100 border-2 border-indigo-950 text-indigo-950 font-black shadow-[2.5px_2.5px_0px_0px_rgba(239,68,68,1)]';
                        iconNode = <XCircle className="w-5 h-5 text-rose-600 shrink-0 stroke-[3]" />;
                      }

                      return (
                        <div 
                          key={char}
                          className={`p-3 rounded-xl border-2 flex items-center justify-between text-xs transition-all ${optionStyle}`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center border-2 border-indigo-950 ${
                              isCorrectAnswer 
                                ? 'bg-emerald-400 text-indigo-950' 
                                : (isChosen ? 'bg-rose-400 text-indigo-950' : 'bg-white text-indigo-950')
                            }`}>
                              {char}
                            </span>
                            <span className="font-bold pr-2 leading-tight">{optionText}</span>
                          </div>
                          {iconNode}
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Display educational critique / logical explanations */}
                <div className="bg-yellow-50 border-t-2 border-indigo-950 p-4 space-y-1">
                  <div className="flex items-start space-x-1.5">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-indigo-950 shrink-0" />
                    <span className="text-[10px] uppercase font-black tracking-widest font-mono text-indigo-950">EXPLANATION MANUAL</span>
                  </div>
                  <p className="text-xs text-indigo-950 font-bold leading-normal pl-5">
                    {q.explanation}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
