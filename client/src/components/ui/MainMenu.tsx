import { motion } from 'framer-motion';
import { useGameStore } from '@/store/use-game-store';
import { Link } from 'wouter';
import { Trophy, Play } from 'lucide-react';

export function MainMenu() {
  const { status, resetGame } = useGameStore();

  if (status !== 'menu') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 flex items-center justify-center z-20"
    >
      <div className="glass-panel p-10 md:p-16 rounded-3xl flex flex-col items-center max-w-lg w-full mx-4 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent text-glow-primary mb-4">
            NEON RUN
          </h1>
        </motion.div>
        
        <p className="text-muted-foreground mb-12 text-lg">
          Use <kbd className="bg-white/20 px-2 py-1 rounded text-white mx-1">A</kbd> <kbd className="bg-white/20 px-2 py-1 rounded text-white mx-1">D</kbd> to dodge, <kbd className="bg-white/20 px-2 py-1 rounded text-white mx-1">SPACE</kbd> to jump
        </p>

        <div className="flex flex-col w-full gap-4">
          <button 
            onClick={resetGame}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all box-glow-primary"
          >
            <Play className="w-8 h-8 fill-current" />
            PLAY NOW
          </button>

          <Link 
            href="/leaderboard"
            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-white/10 active:scale-95 transition-all"
          >
            <Trophy className="w-6 h-6 text-accent" />
            LEADERBOARD
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
