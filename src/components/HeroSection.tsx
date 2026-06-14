import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Clipboard, Hash, GraduationCap, ArrowRight } from 'lucide-react';
import { StudentInfo } from '../types';
import appConfig from '../app-config.json';

interface HeroSectionProps {
  onStartQuiz: (info: StudentInfo) => void;
  spreadsheetId: string | null;
  totalQuestions: number;
}

export default function HeroSection({ onStartQuiz, spreadsheetId, totalQuestions }: HeroSectionProps) {
  const [formData, setFormData] = useState<StudentInfo>({
    name: '',
    className: appConfig.className, // prefilled from JSON config
    section: '',
    rollNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your beautiful name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name should be at least 2 letters';
    }

    if (!formData.section.trim()) {
      newErrors.section = 'Please enter your section (e.g., A, B, Red, Green)';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Please enter your class roll number';
    } else if (isNaN(Number(formData.rollNumber.trim()))) {
      newErrors.rollNumber = 'Roll number must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onStartQuiz({
        name: formData.name.trim(),
        className: formData.className,
        section: formData.section.trim().toUpperCase(),
        rollNumber: formData.rollNumber.trim()
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row items-center gap-10">
      
      {/* Left Column: Visual Introduction */}
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-yellow-400 border-2 border-indigo-950 rounded-full text-indigo-950 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <GraduationCap className="w-4 h-4 text-indigo-950" />
          <span>{appConfig.className} Assignment Portal</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black font-display leading-tight tracking-tight text-indigo-950 uppercase">
          {appConfig.quizTitle} <br />
          <span className="bg-indigo-600 text-white px-3 py-1 inline-block rotate-[-1deg] my-2 border-2 border-indigo-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {appConfig.appName}!
          </span>
        </h2>
        
        <p className="text-indigo-900 text-sm md:text-base font-medium max-w-md md:max-w-lg leading-relaxed">
          Welcome, students! Are you ready to test your knowledge in {appConfig.subject} - {appConfig.quizTitle}? Let's start the interactive quiz and unlock your special progress badges!
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0 mt-4 text-left">
          <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border-2 border-indigo-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-emerald-500 font-extrabold text-xl">✓</span>
            <span className="text-xs text-indigo-950 font-bold">{totalQuestions} Interactive Questions</span>
          </div>
          <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border-2 border-indigo-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-indigo-600 font-extrabold text-xl">★</span>
            <span className="text-xs text-indigo-950 font-bold">Graphic Hints & Tips</span>
          </div>
        </div>

        {spreadsheetId && (
          <div className="text-[11px] text-indigo-950 font-mono font-bold flex items-center justify-center md:justify-start space-x-2 pt-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border border-indigo-950" />
            <span>Connected to spreadsheet 'quiz-bot'</span>
          </div>
        )}
      </div>

      {/* Right Column: Portal Enrollment Form Card */}
      <motion.div 
        className="w-full max-w-md bg-white border-4 border-indigo-950 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 pb-4 border-b-2 border-dashed border-indigo-100">
          <h3 className="text-2xl font-black font-display text-indigo-950 uppercase tracking-tight">Student Sign In</h3>
          <p className="text-xs text-indigo-700 font-bold mt-1">Please provide your details below to begin the assessment.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Student Name */}
          <div>
            <label className="block text-xs font-black text-indigo-950 uppercase tracking-widest mb-1.5">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-950 pointer-events-none">
                <User className="w-4 h-4 stroke-[2.5]" />
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full school name"
                className={`w-full pl-10 pr-4 py-3 bg-white text-indigo-950 text-sm font-bold rounded-xl border-2 outline-hidden transition-all ${
                  errors.name 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-indigo-950 focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-rose-600 text-xs font-black mt-1 pl-1">{errors.name}</p>
            )}
          </div>

          {/* Grid for Class & Section */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Prefilled Class */}
            <div>
              <label className="block text-xs font-black text-indigo-950 uppercase tracking-widest mb-1.5">Class</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-950 pointer-events-none">
                  <GraduationCap className="w-4 h-4 stroke-[2.5]" />
                </span>
                <input
                  type="text"
                  value={formData.className}
                  disabled
                  className="w-full pl-10 pr-3 py-3 bg-slate-100 text-slate-500 text-sm font-bold rounded-xl border-2 border-indigo-950/40 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Section Input */}
            <div>
              <label className="block text-xs font-black text-indigo-950 uppercase tracking-widest mb-1.5">Section</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-950 pointer-events-none">
                  <Clipboard className="w-4 h-4 stroke-[2.5]" />
                </span>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g., A, B, RED"
                  className={`w-full pl-10 pr-3 py-3 bg-white text-indigo-950 text-sm font-bold rounded-xl border-2 outline-hidden transition-all ${
                    errors.section 
                      ? 'border-rose-500 bg-rose-50' 
                      : 'border-indigo-950 focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                />
              </div>
              {errors.section && (
                <p className="text-rose-600 text-xs font-black mt-1 pl-1">{errors.section}</p>
              )}
            </div>

          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-xs font-black text-indigo-950 uppercase tracking-widest mb-1.5">School Roll Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-950 pointer-events-none">
                <Hash className="w-4 h-4 stroke-[2.5]" />
              </span>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="Enter roll number (e.g. 12)"
                className={`w-full pl-10 pr-4 py-3 bg-white text-indigo-950 text-sm font-bold rounded-xl border-2 outline-hidden transition-all ${
                  errors.rollNumber 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-indigo-950 focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              />
            </div>
            {errors.rollNumber && (
              <p className="text-rose-600 text-xs font-black mt-1 pl-1">{errors.rollNumber}</p>
            )}
          </div>

          {/* Action Trigger */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-indigo-950 border-2 border-indigo-950 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center space-x-2 transition-all mt-6 cursor-pointer"
          >
            <span>Start My Quiz Challenge</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
}
