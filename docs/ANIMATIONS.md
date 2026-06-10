# Aura — Animation System

## 1. Overview

Aura has two animation layers:

1. **Canvas Background Engine** — full-screen generative art behind the UI
2. **Framer Motion** — UI micro-interactions, page transitions, component animations

Both respect `prefers-reduced-motion`.

## 2. Canvas Background Engine

### Architecture

```
/lib/canvas/
├── engine.ts        # Main loop, resize, RAF
├── particles.ts     # Particle system
├── fluid.ts         # Fluid gradient renderer
├── aurora.ts        # Aurora wave renderer
├── geometric.ts     # Geometric drift renderer
├── stars.ts         # Starfield renderer
└── utils.ts         # Colour interpolation, math helpers
```

### Render Loop

```typescript
class CanvasEngine {
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number;
  private lastTime: number;
  private particles: Particle[];
  private mode: AnimationMode;

  start(canvas: HTMLCanvasElement): void;
  stop(): void;
  setMode(mode: AnimationMode): void;
  setSpeed(speed: number): void;
  setOpacity(opacity: number): void;
  setColors(primary: string, secondary: string, accent: string): void;
  handleResize(): void;
}
```

### Animation Modes (per Theme)

| Theme | Default Mode | Description |
|---|---|---|
| Dawn | Fluid | Slow-moving colour blobs in warm pastels |
| Dusk | Geometric | Drifting triangles in amber hues |
| Forest | Particles | Green-tinted floating orbs |
| Ocean | Waves | Sinusoidal wave patterns in blue-teal |
| Aurora | Aurora | Flowing aurora borealis ribbons |
| Cabin | Fireflies | Warm dots drifting like embers |
| Midnight | Stars | Starfield with slow parallax |
| Bloom | Petals | Soft petal-like shapes falling |

### Performance Adaptation

- **Frame rate target**: 60fps
- **Auto-throttle**: If frame rate drops below 30fps for 1 second, reduce particle count by half
- **Tab visibility**: Pause via `requestAnimationFrame` cancel when tab hidden (Page Visibility API)
- **Device pixel ratio**: Renders at 1x on low-end devices, up to 2x on retina
- **User setting**: Off / Subtle / Full — controls particle count and effects

### Canvas Sizing

- Full viewport, `position: fixed`, `z-index: 0`, `pointer-events: none`
- Resize via `ResizeObserver`

## 3. Framer Motion Animations

### Page Transitions

```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Component Animations

| Component | Animation |
|---|---|
| Glass cards | Mount: scale(0.97 → 1) + fade, 0.2s |
| Task check | Scale bounce on checkmark |
| Habit check | Circle fill animation (SVG stroke-dashoffset) |
| Timer digits | Smooth number transition with tabular nums |
| Progress ring | SVG stroke-dashoffset animation, 1s |
| Modal | Backdrop fade + card scale(0.9 → 1) |
| Toast | Slide up from bottom, 0.3s |
| Sidebar | Slide in from left, 0.2s |
| Stat counter | Animated count up (useMotionValue) |
| Journey steps | Staggered reveal on load (each step fades in left to right) |
| Heatmap cells | Staggered fill animation on scroll |
| Live Pulse items | Staggered slide-in |
| Skeleton | Shimmer pulse |

### Motion Preferences

```typescript
const prefersReducedMotion = useReducedMotion();

const transition = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 0.25, ease: 'easeOut' };
```

## 4. Timer-Reactive Effects

The canvas engine subscribes to `focus-store` and adjusts in real-time:

- **Focus active**: Colour temperature shifts +5% warmer, particles speed up 40%, glow pulse begins
- **Break active**: Colour temperature shifts -10% cooler, particles slow down 50%, glow fades
- **Paused**: Particles decelerate to near-stop
- **Completed**: 2-second burst of celebratory particles in primary colours
- **Idle**: Default theme animation
