import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { Spawner } from './Spawner';
import { GameEnvironment } from './Environment';
import { useGameStore } from '@/store/use-game-store';

export function GameCanvas() {
  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState();
      
      // Start game on any key if in menu
      if (state.status === 'menu') {
        state.resetGame();
        return;
      }

      if (state.status !== 'playing') return;

      if ((e.key === 'a' || e.key === 'ArrowLeft') && state.lane > -1) {
        state.setLane(state.lane - 1);
      }
      if ((e.key === 'd' || e.key === 'ArrowRight') && state.lane < 1) {
        state.setLane(state.lane + 1);
      }
      if ((e.key === 'w' || e.key === 'ArrowUp' || e.key === ' ') && !state.isJumping) {
        state.setJumping(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-background z-0">
      <Canvas shadows camera={{ position: [0, 4, 12], fov: 60 }}>
        <GameEnvironment />
        <Player />
        <Spawner />
      </Canvas>
    </div>
  );
}
