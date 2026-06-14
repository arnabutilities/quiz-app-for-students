import { motion } from 'motion/react';
import { Database, User, ShieldAlert, GraduationCap, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import appConfig from '../app-config.json';

interface HeaderProps {
  isAdminView: boolean;
  setIsAdminView: (v: boolean) => void;
}

export default function Header({
  isAdminView,
  setIsAdminView
}: HeaderProps) {
  return (
    <header className="w-full border-b-4 border-indigo-800 bg-indigo-600 text-white sticky top-0 z-50 px-4 py-4 sm:px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo and Title */}
        <div className="flex items-center space-x-3">
          <motion.div 
            className="p-2.5 bg-yellow-400 text-indigo-950 rounded-2xl border-2 border-indigo-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <GraduationCap className="w-6 h-6 stroke-[2.5]" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white flex items-center gap-1.5 uppercase">
              {appConfig.appName} <span className="text-xl sm:text-2xl">🌐</span>
            </h1>
            <p className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest font-mono">
              {appConfig.className}: {appConfig.unitName} - {appConfig.quizTitle}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-end">
          
          {/* Teacher / Student Toggle */}
          <button
            onClick={() => setIsAdminView(!isAdminView)}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-black tracking-wider uppercase border-2 border-indigo-950 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
              isAdminView 
                ? 'bg-yellow-400 text-indigo-950 font-black'
                : 'bg-indigo-950 text-white hover:bg-indigo-900 border-indigo-950'
            }`}
          >
            {isAdminView ? (
              <>
                <GraduationCap className="w-4 h-4 text-indigo-950 shrink-0" />
                <span>Go to Quiz Mode</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-4 h-4 text-white shrink-0" />
                <span>Teacher Dashboard</span>
              </>
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
