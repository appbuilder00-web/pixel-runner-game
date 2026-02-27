import { motion } from 'framer-motion';
import { useGameStore } from '@/store/use-game-store';
import { Link } from 'wouter';
import { Trophy, Play, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';

export function MainMenu() {
  const { status, resetGame, playerName, setPlayerName, totalCoins, setStatus, unlockedCharacters, currentCharacter, buyCharacter, selectCharacter } = useGameStore();
  const [tempName, setTempName] = useState(playerName);

  if (status === 'shop') {
    const chars = [
      { id: 'default', name: 'Original', cost: 0, color: '#ff007f' },
      { id: 'rayane', name: 'Rayane', cost: 50, color: '#00f3ff' },
      { id: 'gold', name: 'Goldy', cost: 200, color: '#ffcf00' },
      { id: 'stupid', name: 'Stupid Block', cost: 10, color: '#8b4513' },
    ];
    
    return (
      <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80 p-4">
        <div className="glass-panel p-8 rounded-3xl max-w-2xl w-full">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-3xl font-display text-white">Character Shop</h2>
             <div className="text-accent font-bold">Coins: {totalCoins}</div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             {chars.map(c => (
               <div key={c.id} className={`p-4 rounded-xl border-2 transition-all ${currentCharacter === c.id ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/5'}`}>
                 <div className="w-full h-20 rounded-lg mb-2" style={{ backgroundColor: c.color }} />
                 <div className="text-white font-bold text-sm mb-1">{c.name}</div>
                 {unlockedCharacters.includes(c.id) ? (
                   <button 
                     onClick={() => selectCharacter(c.id)}
                     className="w-full py-1 text-xs bg-white/20 rounded hover:bg-white/30"
                   >
                     {currentCharacter === c.id ? 'Selected' : 'Select'}
                   </button>
                 ) : (
                   <button 
                     onClick={() => buyCharacter(c.id, c.cost)}
                     disabled={totalCoins < c.cost}
                     className="w-full py-1 text-xs bg-accent text-black rounded font-bold disabled:opacity-50"
                   >
                     {c.cost} Coins
                   </button>
                 )}
               </div>
             ))}
           </div>
           <button onClick={() => setStatus('menu')} className="w-full py-3 bg-white/10 text-white rounded-xl">Back to Menu</button>
        </div>
      </div>
    );
  }

  if (status !== 'menu') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 flex items-center justify-center z-20"
    >
      <div className="glass-panel p-10 md:p-16 rounded-3xl flex flex-col items-center max-w-lg w-full mx-4 text-center">
        {!playerName ? (
           <div className="w-full">
             <h2 className="text-2xl font-display text-white mb-4">Welcome Runner!</h2>
             <input 
               type="text" 
               value={tempName}
               onChange={(e) => setTempName(e.target.value)}
               placeholder="Enter your name"
               className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white mb-4 outline-none focus:border-primary"
             />
             <button 
               onClick={() => tempName && setPlayerName(tempName)}
               className="w-full py-4 bg-primary text-white rounded-xl font-bold"
             >
               SAVE NAME
             </button>
           </div>
        ) : (
          <>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent text-glow-primary mb-4">
                FOREST RUN
              </h1>
            </motion.div>
            
            <p className="text-white font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Hello, {playerName}!
            </p>

            <div className="flex flex-col w-full gap-4">
              <button 
                onClick={resetGame}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all box-glow-primary"
              >
                <Play className="w-8 h-8 fill-current" />
                PLAY NOW
              </button>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStatus('shop')}
                  className="flex-1 py-4 bg-accent text-black rounded-2xl font-bold text-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"
                >
                  <ShoppingBag className="w-6 h-6" /> SHOP
                </button>
                <Link 
                  href="/leaderboard"
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                >
                  <Trophy className="w-6 h-6 text-accent" /> TOP
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
