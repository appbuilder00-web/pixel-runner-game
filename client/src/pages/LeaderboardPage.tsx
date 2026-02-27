import { useScores } from '@/hooks/use-scores';
import { Link } from 'wouter';
import { Trophy, ArrowLeft, Loader2, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const { data: scores, isLoading, error } = useScores();

  // Sort by score descending and take top 100
  const sortedScores = scores 
    ? [...scores].sort((a, b) => b.score - a.score).slice(0, 100) 
    : [];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col p-4 md:p-8">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col h-full">
        <header className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline font-bold">Back to Game</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-5xl font-display text-white text-glow-primary">LEADERBOARD</h1>
          </div>
          
          <div className="w-[100px] sm:w-[140px]" /> {/* Spacer for centering */}
        </header>

        <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center p-8">
              <p className="text-destructive text-xl font-bold">Failed to load scores</p>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
          ) : sortedScores.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center p-8">
              <Trophy className="w-16 h-16 text-muted-foreground/30" />
              <p className="text-xl text-muted-foreground">No scores yet. Be the first!</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
              <div className="flex flex-col gap-3">
                {sortedScores.map((score, index) => {
                  const isTop3 = index < 3;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      key={score.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border ${
                        index === 0 ? 'bg-accent/10 border-accent box-glow-secondary' :
                        index === 1 ? 'bg-zinc-300/10 border-zinc-300/50' :
                        index === 2 ? 'bg-amber-700/10 border-amber-700/50' :
                        'bg-black/40 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg ${
                          index === 0 ? 'bg-accent text-black' :
                          index === 1 ? 'bg-zinc-300 text-black' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-white/10 text-white'
                        }`}>
                          {index === 0 ? <Medal className="w-6 h-6" /> : `#${index + 1}`}
                        </div>
                        <span className={`text-xl font-bold ${isTop3 ? 'text-white' : 'text-white/80'}`}>
                          {score.playerName}
                        </span>
                      </div>
                      <div className={`text-2xl font-display font-bold ${
                        index === 0 ? 'text-accent text-glow-secondary' : 'text-white'
                      }`}>
                        {score.score}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--primary)/0.5); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--primary)); }
      `}} />
    </div>
  );
}
