import { randomRange } from "./utils";

interface Triangle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  alpha: number;
}

let shapes: Triangle[] = [];
let time = 0;

export function initGeometric(width: number, height: number, colors: [string, string, string]): void {
  shapes = [];
  for (let i = 0; i < 30; i++) {
    shapes.push({
      x: randomRange(0, width),
      y: randomRange(0, height),
      vx: randomRange(-0.2, 0.2),
      vy: randomRange(-0.2, 0.2),
      rotation: randomRange(0, Math.PI * 2),
      rotationSpeed: randomRange(-0.01, 0.01),
      size: randomRange(8, 30),
      color: colors[i % colors.length],
      alpha: randomRange(0.06, 0.15),
    });
  }
}

export function updateGeometric(width: number, height: number): void {
  time += 0.005;
  for (const s of shapes) {
    s.x += s.vx + Math.sin(time + s.rotation) * 0.1;
    s.y += s.vy + Math.cos(time * 0.7 + s.rotation) * 0.1;
    s.rotation += s.rotationSpeed;

    if (s.x < -s.size) s.x = width + s.size;
    if (s.x > width + s.size) s.x = -s.size;
    if (s.y < -s.size) s.y = height + s.size;
    if (s.y > height + s.size) s.y = -s.size;
  }
}

function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number): void {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = rotation + (i * Math.PI * 2) / 3;
    const px = x + Math.cos(angle) * size;
    const py = y + Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function drawGeometric(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
  ctx.clearRect(0, 0, _width, _height);

  for (const s of shapes) {
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = s.color;
    drawTriangle(ctx, s.x, s.y, s.size, s.rotation);
    ctx.fill();
    ctx.restore();
  }
}
