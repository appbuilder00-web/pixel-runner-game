## Packages
three | Required 3D library for WebGL graphics
@types/three | TypeScript definitions for three.js
@react-three/fiber | React renderer for Three.js
@react-three/drei | Useful helpers and abstractions for React Three Fiber
framer-motion | For beautiful UI overlays and page transitions
zustand | Fast, unopinionated game state management (crucial for game loops to avoid React re-renders)
canvas-confetti | For high score celebration effect
@types/canvas-confetti | Types for canvas-confetti

## Notes
The game uses a global zustand store to bridge React UI components and the 3D WebGL canvas.
Game objects (obstacles, coins) use object pooling with `useRef` to maintain 60FPS and avoid garbage collection stutters.
Player and Environment collisions use Three.js `Box3` intersection tests.
