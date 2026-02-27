import { create } from 'zustand';
import { createRef } from 'react';
import * as THREE from 'three';

export type GameStatus = 'menu' | 'playing' | 'gameover' | 'submitting';

interface GameState {
  status: GameStatus;
  score: number;
  speed: number;
  lane: number;      // -1 (left), 0 (center), 1 (right)
  isJumping: boolean;
  
  // Actions
  setStatus: (status: GameStatus) => void;
  addScore: (points: number) => void;
  increaseSpeed: (amount: number) => void;
  setLane: (lane: number) => void;
  setJumping: (isJumping: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'menu',
  score: 0,
  speed: 25,
  lane: 0,
  isJumping: false,

  setStatus: (status) => set({ status }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  increaseSpeed: (amount) => set((state) => ({ speed: Math.min(state.speed + amount, 60) })),
  setLane: (lane) => set({ lane: Math.max(-1, Math.min(1, lane)) }),
  setJumping: (isJumping) => set({ isJumping }),
  
  resetGame: () => set({
    status: 'playing',
    score: 0,
    speed: 25,
    lane: 0,
    isJumping: false
  }),
}));

// Global ref for the player to allow collision detection without React re-renders
export const globalPlayerRef = createRef<THREE.Group>();
