import { lerpColor, rgbToStr, hexToRgb, clamp } from "./utils";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: [number, number, number];
  phase: number;
}

let blobs: Blob[] = [];
let time = 0;

export function initFluid(width: number, height: number, colors: [string, string, string]): void {
  const rgbColors = colors.map(hexToRgb) as [[number, number, number], [number, number, number], [number, number, number]];
  blobs = [];
  for (let i = 0; i < 5; i++) {
    blobs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.min(width, height) * (0.15 + Math.random() * 0.25),
      color: rgbColors[i % rgbColors.length],
      phase: Math.random() * Math.PI * 2,
    });
  }
}

export function updateFluid(width: number, height: number): void {
  time += 0.005;
  for (const b of blobs) {
    b.x += b.vx + Math.sin(time + b.phase) * 0.3;
    b.y += b.vy + Math.cos(time + b.phase * 1.3) * 0.3;
    b.radius += Math.sin(time * 0.5 + b.phase) * 0.3;

    if (b.x < -b.radius) b.x = width + b.radius;
    if (b.x > width + b.radius) b.x = -b.radius;
    if (b.y < -b.radius) b.y = height + b.radius;
    if (b.y > height + b.radius) b.y = -b.radius;
  }
}

export function drawFluid(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
  ctx.clearRect(0, 0, _width, _height);

  for (const b of blobs) {
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
    const [r, g, bl] = b.color;
    grad.addColorStop(0, rgbToStr(r, g, bl, 0.15));
    grad.addColorStop(0.5, rgbToStr(r, g, bl, 0.08));
    grad.addColorStop(1, rgbToStr(r, g, bl, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
