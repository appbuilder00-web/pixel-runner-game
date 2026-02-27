import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/use-game-store';

export function GameEnvironment() {
  const gridRef = useRef<THREE.Group>(null);
  const fogColor = new THREE.Color("#06060c"); // matching --background

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (state.status === 'playing' && gridRef.current) {
      // Create seamless treadmill effect for the grid
      const speed = state.speed;
      gridRef.current.position.z = (gridRef.current.position.z + speed * delta) % 2;
    }
  });

  return (
    <group>
      <fog attach="fog" args={[fogColor, 20, 80]} />
      <color attach="background" args={[fogColor]} />

      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 5, -20]} intensity={2} color="#00f3ff" />
      <pointLight position={[-10, 5, -50]} intensity={5} color="#ff007f" />
      <pointLight position={[10, 5, -50]} intensity={5} color="#ffcf00" />

      {/* Moving Floor */}
      <group ref={gridRef}>
        <Grid 
          position={[0, 0, 0]} 
          args={[100, 100]} 
          cellSize={1} 
          cellThickness={1} 
          cellColor="#333344" 
          sectionSize={2} 
          sectionThickness={1.5} 
          sectionColor="#ff007f" 
          fadeDistance={60}
          fadeStrength={1}
        />
      </group>

      {/* Background Decor */}
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}
