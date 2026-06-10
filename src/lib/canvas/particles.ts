import { randomRange } from "./utils";

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function createParticle(width: number, height: number): Particle {
  return {
    x: randomRange(0, width),
    y: randomRange(0, height),
    vx: randomRange(-0.3, 0.3),
    vy: randomRange(-0.3, 0.3),
    size: randomRange(1.5, 4),
    alpha: randomRange(0.15, 0.5),
    life: 0,
    maxLife: randomRange(200, 600),
  };
}

export function updateParticle(p: Particle, width: number, height: number): void {
  p.x += p.vx;
  p.y += p.vy;
  p.life++;

  p.alpha = Math.max(0, p.alpha - 0.001);

  if (p.x < 0) p.x = width;
  if (p.x > width) p.x = 0;
  if (p.y < 0) p.y = height;
  if (p.y > height) p.y = 0;
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  color: string,
): void {
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
