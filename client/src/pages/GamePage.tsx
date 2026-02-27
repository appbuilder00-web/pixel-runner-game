import { GameCanvas } from '@/components/game/GameCanvas';
import { MainMenu } from '@/components/ui/MainMenu';
import { HUD } from '@/components/ui/HUD';
import { GameOver } from '@/components/ui/GameOver';

export default function GamePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-background">
      <GameCanvas />
      
      {/* UI Overlays */}
      <MainMenu />
      <HUD />
      <GameOver />
      
      {/* Vignette effect for immersion */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-0" />
    </main>
  );
}
