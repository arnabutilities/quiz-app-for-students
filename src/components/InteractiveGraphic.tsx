import { motion } from 'motion/react';
import { Network, ShieldCheck, Globe, Search, Mail, Laptop } from 'lucide-react';

interface InteractiveGraphicProps {
  graphic: string;
}

export default function InteractiveGraphic({ graphic }: InteractiveGraphicProps) {
  // If it's a URL, render an image safely
  if (graphic && (graphic.startsWith('http://') || graphic.startsWith('https://') || graphic.includes('.'))) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-1 shadow-inner aspect-[16/10] flex items-center justify-center">
        <img 
          src={graphic} 
          alt="Quiz illustration helper" 
          className="w-full h-full object-cover rounded-xl"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 bg-white shadow-xs border border-slate-100">
          Source Material
        </div>
      </div>
    );
  }

  // Otherwise draw beautiful interactive responsive SVGs based on keyword
  const keyword = (graphic || '').toLowerCase().trim();

  const renderVectorScene = () => {
    switch (keyword) {
      case 'network':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-blue-50/70 p-6">
            <div className="relative w-full max-w-[200px] h-[120px]">
              {/* Left computer node */}
              <motion.div 
                className="absolute left-0 bottom-2 text-blue-600 bg-white p-2 rounded-xl shadow-xs border border-blue-100"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Laptop className="w-6 h-6" />
              </motion.div>

              {/* Right computer node */}
              <motion.div 
                className="absolute right-0 bottom-2 text-indigo-600 bg-white p-2 rounded-xl shadow-xs border border-indigo-100"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Laptop className="w-6 h-6" />
              </motion.div>

              {/* Center Router Hub */}
              <motion.div 
                className="absolute left-1/2 bottom-8 -translate-x-1/2 text-emerald-600 bg-white p-3 rounded-full shadow-md border-2 border-emerald-400 z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Network className="w-8 h-8" />
              </motion.div>

              {/* Linking wires */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M 30,105 Q 100,55 100,55" fill="none" stroke="rgb(191, 219, 254)" strokeWidth="3" strokeDasharray="4 4" />
                <path d="M 170,105 Q 100,55 100,55" fill="none" stroke="rgb(191, 219, 254)" strokeWidth="3" strokeDasharray="4 4" />
              </svg>

              {/* Sliding data packet 1 */}
              <motion.div 
                className="absolute w-3.5 h-3.5 bg-blue-500 rounded-full border border-white shadow-xs z-20"
                animate={{ 
                  left: ['15%', '50%'], 
                  bottom: ['15%', '60%'] 
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />

              {/* Sliding data packet 2 */}
              <motion.div 
                className="absolute w-3.5 h-3.5 bg-indigo-500 rounded-full border border-white shadow-xs z-20"
                animate={{ 
                  right: ['15%', '50%'], 
                  bottom: ['15%', '60%'] 
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1.2 }}
              />
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 font-display">Internet packet routers directing traffic</p>
          </div>
        );

      case 'safety':
      case 'security':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-emerald-50/70 p-6">
            <div className="relative flex items-center justify-center w-full max-w-[200px] h-[120px]">
              {/* Pulsing defense ring */}
              <motion.div 
                className="absolute w-24 h-24 rounded-full border-2 border-dashed border-emerald-300 bg-emerald-100/40"
                animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              />

              {/* Secure Shield */}
              <motion.div 
                className="relative text-emerald-600 bg-white p-4 rounded-2xl shadow-lg border border-emerald-100 z-10"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldCheck className="w-12 h-12" />
              </motion.div>

              {/* Graphic key locks */}
              <motion.span 
                className="absolute right-6 top-6 bg-amber-400 p-1.5 rounded-lg text-white shadow-sm"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                🔒
              </motion.span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 font-display">Cyber Security Shield protecting your data</p>
          </div>
        );

      case 'web':
      case 'website':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-cyan-50/70 p-6">
            <div className="relative w-full max-w-[200px] h-[120px] flex items-center justify-center">
              {/* Planetary Web ring */}
              <motion.div 
                className="absolute w-28 h-28 rounded-full border border-sky-300"
                style={{ rotateX: '55deg', rotateY: '25deg' }}
                animate={{ rotateZ: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div 
                className="absolute w-28 h-28 rounded-full border border-indigo-200"
                style={{ rotateX: '-45deg', rotateY: '-25deg' }}
                animate={{ rotateZ: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />

              {/* World Globe */}
              <motion.div 
                className="relative text-cyan-600 bg-white p-4 rounded-full shadow-lg border border-sky-100 z-10"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Globe className="w-12 h-12 stroke-[1.5]" />
              </motion.div>

              {/* Satellite node */}
              <motion.div 
                className="absolute right-4 bottom-4 bg-sky-500 p-1.5 rounded-full text-white text-[10px]"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📡
              </motion.div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 font-display">The World Wide Web: connecting the globe</p>
          </div>
        );

      case 'search':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-purple-50/70 p-6">
            <div className="relative w-full max-w-[200px] h-[120px] flex items-center justify-center">
              {/* Code matrix simulation */}
              <div className="absolute inset-x-8 top-2 flex flex-col space-y-1 font-mono text-[9px] text-purple-400 opacity-60">
                <div className="text-left font-semibold">010111100 web_crawl</div>
                <div className="text-right">http_get: 200 OK</div>
                <div className="text-left">index_db: success</div>
              </div>

              {/* Search Glass */}
              <motion.div 
                className="relative text-purple-600 bg-white p-4 rounded-2xl shadow-lg border border-purple-100 z-10"
                animate={{ rotate: [0, 5, 0, -5, 0], x: [0, 5, 0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Search className="w-11 h-11" />
              </motion.div>

              {/* Floating spider */}
              <motion.div 
                className="absolute left-6 top-8 text-lg"
                animate={{ y: [-15, 10, -15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                🕷️
              </motion.div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 font-display">Spiders crawling and indexing web pages</p>
          </div>
        );

      case 'email':
      case 'mail':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-amber-50/70 p-6">
            <div className="relative w-full max-w-[200px] h-[120px] flex items-center justify-center">
              {/* Travel arc */}
              <svg className="absolute fill-none stroke-amber-200 stroke-[2] stroke-dasharray-[4_4] w-full h-full">
                <path d="M 20,90 Q 100,20 180,90" />
              </svg>

              {/* Flying paper plane / envelope */}
              <motion.div 
                className="absolute text-amber-500 bg-white p-3 rounded-full shadow-lg border border-amber-100 z-10"
                animate={{ 
                  x: [-60, 60, -60], 
                  y: [20, -30, 20],
                  rotate: [-30, 30, -30]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Mail className="w-7 h-7" />
              </motion.div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 font-display">Email protocols transmission (SMTP/IMAP)</p>
          </div>
        );

      default:
        // Generic charming computer / internet cloud illustration
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-50 p-6">
            <div className="relative w-full max-w-[160px] h-[120px] flex items-center justify-center">
              {/* Cute monitor face */}
              <motion.div 
                className="relative bg-white border border-slate-200 rounded-xl p-3 shadow-md w-24 h-20 flex flex-col items-center justify-center z-10"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Screen */}
                <div className="w-full h-11 bg-slate-900 rounded-md flex items-center justify-center">
                  <span className="text-emerald-400 font-mono text-[9px] animate-pulse">Class_8_Quiz</span>
                </div>
                {/* Stand */}
                <div className="absolute bottom-[-10px] w-6 h-2.5 bg-slate-300 rounded-b-md" />
              </motion.div>

              <span className="absolute left-4 top-4 text-2xl animate-bounce">💡</span>
              <span className="absolute right-4 top-8 text-xl">🌐</span>
            </div>
            <p className="text-xs font-semibold text-indigo-500 mt-2 font-display">Interactive Helper Graph Instruction</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full border-2 border-indigo-950 bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden aspect-[16/10] flex flex-col">
      {renderVectorScene()}
    </div>
  );
}
