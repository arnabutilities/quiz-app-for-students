import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { verifyTeacherPassword } from '../utils/crypto';

interface TeacherLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TeacherLogin({ onSuccess, onCancel }: TeacherLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Minor structural delays for natural feel
    setTimeout(() => {
      const isValid = verifyTeacherPassword(password.trim());
      if (isValid) {
        sessionStorage.setItem('qb_teacher_authenticated', 'true');
        onSuccess();
      } else {
        setError('Incorrect password credentials. Please read the security assignment manual!');
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 md:py-20">
      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)]">
        
        {/* Lock Icon and Header */}
        <div className="text-center space-y-3 mb-6 pb-4 border-b-2 border-dashed border-indigo-100">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 border-2 border-indigo-950 rounded-2xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] mb-2">
            <Lock className="w-7 h-7 text-indigo-950 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black font-display text-indigo-950 uppercase tracking-tight">
            Security Gate
          </h2>
          <p className="text-xs text-indigo-800 font-bold max-w-xs mx-auto">
            Teacher Dashboard is password-protected. Enter credentials to unlock administrative controls.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Key Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-indigo-950 uppercase tracking-widest flex items-center justify-between">
              <span>Teacher Password</span>
              <span className="text-[10px] font-mono font-bold text-slate-500">Static Encrypted Key</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-950 pointer-events-none">
                <KeyRound className="w-4 h-4 stroke-[2.5]" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className={`w-full pl-10 pr-12 py-3 bg-white text-indigo-950 text-sm font-bold rounded-xl border-2 outline-hidden transition-all ${
                  error 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-indigo-950 focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-0 bottom-0 flex items-center text-indigo-950 hover:text-indigo-600 focus:outline-hidden"
              >
                {showPassword ? <EyeOff className="w-4 h-4 stroke-[2.5]" /> : <Eye className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>
            
            {error && (
              <p className="text-rose-600 text-xs font-black mt-1 pl-1 flex items-start gap-1.5 leading-normal">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white border-2 border-indigo-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2.5px] active:translate-x-[2.5px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] font-black text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Verifying Password...' : 'Unlock Dashboard'}</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-white hover:bg-slate-50 text-indigo-950 border-2 border-indigo-950 rounded-xl text-xs font-black uppercase tracking-wider py-2.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer"
            >
              Return to Student View
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
