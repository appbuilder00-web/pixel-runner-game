import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/use-game-store';
import { useCreateScore } from '@/hooks/use-scores';
import { Trophy, RefreshCw, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLocation } from 'wouter';

export function GameOver() {
  const { status, score, resetGame, setStatus } = useGameStore();
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const createScore = useCreateScore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (status === 'gameover' && score > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff007f', '#00f3ff', '#ffcf00']
      });
    }
  }, [status, score]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter your name!");
      return;
    }
    
    setStatus('submitting');
    createScore.mutate({ playerName: name.trim(), score }, {
      onSuccess: () => {
        setLocation('/leaderboard');
        // Reset state so when they come back it's fresh
        useGameStore.setState({ status: 'menu', score: 0 });
      },
      onError: (err) => {
        setErrorMsg(err.message || "Failed to submit score");
        setStatus('gameover');
      }
    });
  };

  if (status !== 'gameover' && status !== 'submitting') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm"
      >
        <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center max-w-md w-full mx-4 border-primary/50 box-glow-primary">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-2 text-glow-primary">GAME OVER</h2>
          <p className="text-xl text-muted-foreground mb-8">You crashed into an obstacle!</p>
          
          <div className="text-center mb-10">
            <span className="block text-sm text-secondary uppercase tracking-widest font-bold mb-1">Final Score</span>
            <span className="text-7xl font-display text-accent text-glow-secondary block leading-none">{score}</span>
          </div>

          {score > 0 ? (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                  placeholder="Enter your name" 
                  maxLength={15}
                  disabled={status === 'submitting'}
                  className="w-full bg-black/40 border-2 border-primary/50 rounded-xl px-4 py-4 text-white text-center font-bold text-xl placeholder:text-white/30 focus:outline-none focus:border-primary focus:box-glow-primary transition-all disabled:opacity-50"
                />
                {errorMsg && <p className="text-destructive text-sm mt-2 text-center">{errorMsg}</p>}
              </div>

              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all box-glow-primary disabled:opacity-70 disabled:hover:scale-100"
              >
                {status === 'submitting' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Trophy className="w-6 h-6" />
                    SUBMIT SCORE
                  </>
                )}
              </button>
            </form>
          ) : (
             <p className="text-muted-foreground mb-6 text-center">You need a score &gt; 0 to submit to the leaderboard.</p>
          )}

          <button 
            type="button"
            onClick={resetGame}
            disabled={status === 'submitting'}
            className="mt-4 w-full py-4 bg-white/10 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-50 disabled:hover:bg-white/10"
          >
            <RefreshCw className="w-5 h-5" />
            PLAY AGAIN
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
