import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, globalPlayerRef } from '@/store/use-game-store';

const JUMP_FORCE = 18;
const GRAVITY = 50;
const LANE_WIDTH = 2.5;

export function Player() {
  const meshRef = useRef<THREE.Group>(null);
  const velocityY = useRef(0);
  const { currentCharacter } = useGameStore();

  useFrame((_, delta) => {
    if (!globalPlayerRef.current || !meshRef.current) return;
    
    const state = useGameStore.getState();
    const group = globalPlayerRef.current;

    // Score increases with time
    if (state.status === 'playing') {
      useGameStore.getState().updateScore(Math.floor(delta * state.speed));
    }

    const targetX = state.lane * LANE_WIDTH;
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, 15 * delta);

    if (state.isJumping && velocityY.current === 0 && group.position.y <= 1.05) {
      velocityY.current = JUMP_FORCE;
    }

    group.position.y += velocityY.current * delta;

    if (group.position.y > 1 || velocityY.current !== 0) {
      velocityY.current -= GRAVITY * delta;
    }

    if (group.position.y <= 1 && velocityY.current < 0) {
      group.position.y = 1;
      velocityY.current = 0;
      if (state.isJumping) {
        useGameStore.setState({ isJumping: false });
      }
    }
    
    const tilt = (group.position.x - targetX) * -0.2;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, tilt, 10 * delta);
    
    if (state.status === 'menu' && !state.isJumping) {
      group.position.y = 1 + Math.sin(Date.now() / 200) * 0.1;
    }
  });

  const getCharacterColor = () => {
    if (currentCharacter === 'rayane') return "#00f3ff";
    if (currentCharacter === 'gold') return "#ffcf00";
    return "#ff007f";
  };

  return (
    <group ref={globalPlayerRef} position={[0, 1, 5]}>
      <group ref={meshRef}>
        {currentCharacter === 'stupid' ? (
           <mesh castShadow>
             <boxGeometry args={[0.8, 0.8, 0.8]} />
             <meshStandardMaterial color="#8b4513" />
           </mesh>
        ) : (
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.4, 0.8, 16, 16]} />
            <meshStandardMaterial 
              color={getCharacterColor()} 
              emissive={getCharacterColor()}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        )}
      </group>
      <pointLight color={getCharacterColor()} intensity={2} distance={5} />
    </group>
  );
}
