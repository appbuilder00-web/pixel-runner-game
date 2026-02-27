import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/use-game-store';
import { Zap } from 'lucide-react';

export function HUD() {
  const { status, score, speed, totalCoins, coins } = useGameStore();
  // Local state to track changes for animation
  const [lastScore, setLastScore] = useState(score);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (score !== lastScore) {
      setLastScore(score);
      setPop(true);
      const t = setTimeout(() => setPop(false), 150);
      return () => clearTimeout(t);
    }
  }, [score, lastScore]);

  if (status !== 'playing' && status !== 'gameover') return null;

  return (
    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
      <motion.div 
        animate={{ scale: pop ? 1.2 : 1 }}
        className="glass-panel px-6 py-3 rounded-2xl border-l-4 border-l-accent flex flex-col"
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Score</span>
        <span className="text-4xl font-display text-accent text-glow-secondary leading-none">{score}</span>
      </motion.div>

      <div className="flex flex-col items-end gap-2">
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-primary/30">
          <Zap className="w-5 h-5 text-primary animate-pulse" />
          <span className="font-bold text-white font-display text-xl">{Math.floor(speed)} MPH</span>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-yellow-500/30">
          <div className="w-4 h-4 bg-yellow-500 rounded-full" />
          <span className="font-bold text-white font-display text-xl">{totalCoins}</span>
          {coins > 0 && <span className="text-yellow-500 text-xs">+{coins}</span>}
        </div>
      </div>
    </div>
  );
}
