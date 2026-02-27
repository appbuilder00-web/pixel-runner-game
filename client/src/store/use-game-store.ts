import { create } from 'zustand';
import { createRef } from 'react';
import * as THREE from 'three';

export type GameStatus = 'menu' | 'playing' | 'gameover' | 'submitting' | 'shop';

interface GameState {
  status: GameStatus;
  score: number;
  coins: number;
  totalCoins: number;
  playerName: string;
  currentCharacter: string;
  unlockedCharacters: string[];
  speed: number;
  lane: number;      // -1 (left), 0 (center), 1 (right)
  isJumping: boolean;
  
  // Actions
  setStatus: (status: GameStatus) => void;
  setPlayerName: (name: string) => void;
  addCoin: () => void;
  buyCharacter: (id: string, cost: number) => void;
  selectCharacter: (id: string) => void;
  increaseSpeed: (amount: number) => void;
  setLane: (lane: number) => void;
  setJumping: (isJumping: boolean) => void;
  resetGame: () => void;
  updateScore: (delta: number) => void;
}

const savedName = localStorage.getItem('runner_name') || '';
const savedCoins = parseInt(localStorage.getItem('runner_coins') || '0');
const savedChars = JSON.parse(localStorage.getItem('runner_chars') || '["default"]');
const savedCurrentChar = localStorage.getItem('runner_current_char') || 'default';

export const useGameStore = create<GameState>((set) => ({
  status: 'menu',
  score: 0,
  coins: 0,
  totalCoins: savedCoins,
  playerName: savedName,
  currentCharacter: savedCurrentChar,
  unlockedCharacters: savedChars,
  speed: 25,
  lane: 0,
  isJumping: false,

  setStatus: (status) => set({ status }),
  setPlayerName: (name) => {
    localStorage.setItem('runner_name', name);
    set({ playerName: name });
  },
  addCoin: () => set((state) => {
    const newTotal = state.totalCoins + 1;
    localStorage.setItem('runner_coins', newTotal.toString());
    return { coins: state.coins + 1, totalCoins: newTotal };
  }),
  updateScore: (delta) => set((state) => ({ score: state.score + delta })),
  buyCharacter: (id, cost) => set((state) => {
    if (state.totalCoins >= cost && !state.unlockedCharacters.includes(id)) {
      const newTotal = state.totalCoins - cost;
      const newChars = [...state.unlockedCharacters, id];
      localStorage.setItem('runner_coins', newTotal.toString());
      localStorage.setItem('runner_chars', JSON.stringify(newChars));
      return { totalCoins: newTotal, unlockedCharacters: newChars };
    }
    return {};
  }),
  selectCharacter: (id) => set((state) => {
    if (state.unlockedCharacters.includes(id)) {
      localStorage.setItem('runner_current_char', id);
      return { currentCharacter: id };
    }
    return {};
  }),
  increaseSpeed: (amount) => set((state) => ({ speed: Math.min(state.speed + amount, 60) })),
  setLane: (lane) => set({ lane: Math.max(-1, Math.min(1, lane)) }),
  setJumping: (isJumping) => set({ isJumping }),
  
  resetGame: () => set({
    status: 'playing',
    score: 0,
    coins: 0,
    speed: 25,
    lane: 0,
    isJumping: false
  }),
}));

// Global ref for the player to allow collision detection without React re-renders
export const globalPlayerRef = createRef<THREE.Group>();
