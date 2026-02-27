import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, globalPlayerRef } from '@/store/use-game-store';

const JUMP_FORCE = 18;
const GRAVITY = 50;
const LANE_WIDTH = 2.5;

export function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityY = useRef(0);

  useFrame((_, delta) => {
    if (!globalPlayerRef.current || !meshRef.current) return;
    
    const state = useGameStore.getState();
    const group = globalPlayerRef.current;

    // Smooth Lane Switching (X axis)
    const targetX = state.lane * LANE_WIDTH;
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, 15 * delta);

    // Jump Physics (Y axis)
    // 1.0 is the base Y position because our capsule is 2 units tall (centered at 0, so bottom is at -1. Group sits at Y=1 so bottom touches Y=0 floor)
    if (state.isJumping && velocityY.current === 0 && group.position.y <= 1.05) {
      velocityY.current = JUMP_FORCE;
    }

    group.position.y += velocityY.current * delta;

    if (group.position.y > 1 || velocityY.current !== 0) {
      velocityY.current -= GRAVITY * delta;
    }

    // Ground collision
    if (group.position.y <= 1 && velocityY.current < 0) {
      group.position.y = 1;
      velocityY.current = 0;
      if (state.isJumping) {
        useGameStore.setState({ isJumping: false });
      }
    }
    
    // Slight rotation based on movement
    const tilt = (group.position.x - targetX) * -0.2;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, tilt, 10 * delta);
    
    // Idle bobbing
    if (state.status === 'menu' && !state.isJumping) {
      group.position.y = 1 + Math.sin(Date.now() / 200) * 0.1;
    }
  });

  return (
    <group ref={globalPlayerRef} position={[0, 1, 5]}>
      {/* Player Model */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <capsuleGeometry args={[0.4, 0.8, 16, 16]} />
        <meshStandardMaterial 
          color="#ff007f" 
          emissive="#ff007f"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Glowing Aura */}
      <pointLight color="#ff007f" intensity={2} distance={5} />
    </group>
  );
}
