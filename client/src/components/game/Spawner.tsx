import { useRef, useEffect, createRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, globalPlayerRef } from '@/store/use-game-store';

const OBSTACLE_COUNT = 20;
const COIN_COUNT = 30;
const LANE_WIDTH = 2.5;
const SPAWN_Z = -80;
const DESPAWN_Z = 10;

type PoolItem = {
  active: boolean;
  lane: number;
  mesh: React.RefObject<THREE.Mesh>;
};

export function Spawner() {
  // Use arrays of refs for extreme performance (Object Pooling)
  const obstacles = useRef<PoolItem[]>(Array.from({ length: OBSTACLE_COUNT }, () => ({
    active: false, lane: 0, mesh: createRef<THREE.Mesh>()
  })));
  
  const coins = useRef<PoolItem[]>(Array.from({ length: COIN_COUNT }, () => ({
    active: false, lane: 0, mesh: createRef<THREE.Mesh>()
  })));

  const spawnTimer = useRef(0);
  const coinPatternTimer = useRef(0);
  const coinPatternActive = useRef(false);
  const coinPatternLane = useRef(0);
  const coinsSpawnedInPattern = useRef(0);

  // Reset items when starting a new game
  useEffect(() => {
    const unsub = useGameStore.subscribe((state) => {
      if (state.status === 'playing' && state.score === 0) {
        obstacles.current.forEach(o => { o.active = false; if(o.mesh.current) o.mesh.current.visible = false; });
        coins.current.forEach(c => { c.active = false; if(c.mesh.current) c.mesh.current.visible = false; });
      }
    });
    return unsub;
  }, []);

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (state.status !== 'playing') return;

    const speed = state.speed;

    // --- MOVE & COLLIDE OBSTACLES ---
    obstacles.current.forEach(obs => {
      if (!obs.active || !obs.mesh.current) return;
      
      obs.mesh.current.position.z += speed * delta;
      
      // Collision check (only when close to player Z=5)
      const z = obs.mesh.current.position.z;
      if (z > 3.5 && z < 6.5 && globalPlayerRef.current) {
        const pBox = new THREE.Box3().setFromObject(globalPlayerRef.current);
        const oBox = new THREE.Box3().setFromObject(obs.mesh.current);
        // Shrink player box slightly for more forgiving hitboxes
        pBox.expandByScalar(-0.15);
        if (pBox.intersectsBox(oBox)) {
          useGameStore.getState().setStatus('gameover');
        }
      }

      // Despawn
      if (z > DESPAWN_Z) {
        obs.active = false;
        obs.mesh.current.visible = false;
        useGameStore.getState().addScore(1); // Give point for dodging
        // Periodically increase speed
        if (state.score > 0 && state.score % 20 === 0) {
          useGameStore.getState().increaseSpeed(1);
        }
      }
    });

    // --- MOVE & COLLIDE COINS ---
    coins.current.forEach(coin => {
      if (!coin.active || !coin.mesh.current) return;
      
      coin.mesh.current.position.z += speed * delta;
      coin.mesh.current.rotation.y += delta * 3; // Spin
      
      // Collision check
      const z = coin.mesh.current.position.z;
      if (z > 4 && z < 6 && globalPlayerRef.current) {
        const pBox = new THREE.Box3().setFromObject(globalPlayerRef.current);
        const cBox = new THREE.Box3().setFromObject(coin.mesh.current);
        if (pBox.intersectsBox(cBox)) {
          // Collect coin
          coin.active = false;
          coin.mesh.current.visible = false;
          useGameStore.getState().addScore(5);
        }
      }

      if (z > DESPAWN_Z) {
        coin.active = false;
        coin.mesh.current.visible = false;
      }
    });

    // --- SPAWNING LOGIC ---
    spawnTimer.current += delta;
    
    // Determine spawn rate based on speed
    const spawnInterval = 30 / speed; 

    if (spawnTimer.current > spawnInterval) {
      spawnTimer.current = 0;
      
      // Spawn 1 or 2 obstacles
      const numObstacles = Math.random() > 0.7 ? 2 : 1;
      const occupiedLanes = new Set<number>();
      
      for (let i = 0; i < numObstacles; i++) {
        const inactiveObs = obstacles.current.find(o => !o.active);
        if (inactiveObs && inactiveObs.mesh.current) {
          let lane;
          do { lane = Math.floor(Math.random() * 3) - 1; } 
          while (occupiedLanes.has(lane) && occupiedLanes.size < 2);
          
          occupiedLanes.add(lane);
          inactiveObs.active = true;
          inactiveObs.lane = lane;
          inactiveObs.mesh.current.position.set(lane * LANE_WIDTH, 1, SPAWN_Z);
          inactiveObs.mesh.current.visible = true;
          
          // Randomize obstacle size (tall vs wide)
          if (Math.random() > 0.5) {
            inactiveObs.mesh.current.scale.set(1, 2, 1); // Tall, need to slide or switch (we only have jump, so switch)
            inactiveObs.mesh.current.position.y = 1; // Center at 1 if height is 2
          } else {
            inactiveObs.mesh.current.scale.set(1.5, 0.8, 1); // Short, can jump over
            inactiveObs.mesh.current.position.y = 0.4;
          }
        }
      }

      // Try to start a coin pattern in the empty lane
      if (!coinPatternActive.current) {
        const emptyLanes = [-1, 0, 1].filter(l => !occupiedLanes.has(l));
        if (emptyLanes.length > 0 && Math.random() > 0.3) {
          coinPatternActive.current = true;
          coinPatternLane.current = emptyLanes[Math.floor(Math.random() * emptyLanes.length)];
          coinsSpawnedInPattern.current = 0;
          coinPatternTimer.current = 0;
        }
      }
    }

    // Spawn coins in a line
    if (coinPatternActive.current) {
      coinPatternTimer.current += delta;
      if (coinPatternTimer.current > (5 / speed)) { // Space them out
        coinPatternTimer.current = 0;
        
        const inactiveCoin = coins.current.find(c => !c.active);
        if (inactiveCoin && inactiveCoin.mesh.current) {
          inactiveCoin.active = true;
          inactiveCoin.lane = coinPatternLane.current;
          // Sine wave height for coins
          const yOffset = 0.5 + Math.sin(coinsSpawnedInPattern.current * 0.8) * 1.5;
          inactiveCoin.mesh.current.position.set(coinPatternLane.current * LANE_WIDTH, Math.max(0.5, yOffset), SPAWN_Z);
          inactiveCoin.mesh.current.visible = true;
          
          coinsSpawnedInPattern.current++;
          if (coinsSpawnedInPattern.current >= 5) {
            coinPatternActive.current = false; // end pattern
          }
        } else {
          coinPatternActive.current = false; // pool empty
        }
      }
    }
  });

  return (
    <group>
      {/* Obstacles Pool */}
      {obstacles.current.map((obs, i) => (
        <mesh key={`obs-${i}`} ref={obs.mesh} visible={false} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial 
            color="#00f3ff" 
            emissive="#00f3ff" 
            emissiveIntensity={0.4} 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
      ))}

      {/* Coins Pool */}
      {coins.current.map((coin, i) => (
        <mesh key={`coin-${i}`} ref={coin.mesh} visible={false} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
          <meshStandardMaterial 
            color="#ffcf00" 
            emissive="#ffcf00" 
            emissiveIntensity={0.6}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
