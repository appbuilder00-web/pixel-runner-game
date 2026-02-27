import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/use-game-store';

export function GameEnvironment() {
  const gridRef = useRef<THREE.Group>(null);
  const fogColor = new THREE.Color("#1a2e1a"); // Dark forest green

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (state.status === 'playing' && gridRef.current) {
      const speed = state.speed;
      gridRef.current.position.z = (gridRef.current.position.z + speed * delta) % 10;
    }
  });

  return (
    <group>
      <fog attach="fog" args={[fogColor, 10, 60]} />
      <color attach="background" args={[fogColor]} />

      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1} 
        castShadow 
      />
      
      {/* Nature Ground */}
      <group ref={gridRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 1000]} />
          <meshStandardMaterial color="#2d4c2d" />
        </mesh>
        
        {/* Simple Trees */}
        {Array.from({ length: 40 }).map((_, i) => (
          <group key={i} position={[(i % 2 === 0 ? 1 : -1) * (8 + Math.random() * 5), 0, -i * 15]}>
            <mesh position={[0, 2, 0]} castShadow>
              <coneGeometry args={[1.5, 4, 8]} />
              <meshStandardMaterial color="#1b331b" />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.4, 1, 8]} />
              <meshStandardMaterial color="#3d2b1f" />
            </mesh>
          </group>
        ))}
      </group>

      <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}
