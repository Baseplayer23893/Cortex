import { randomRange } from "./utils";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  baseAlpha: number;
  layer: number;
}

let stars: Star[] = [];
let time = 0;
let parsedColor = "165,180,252";

const LAYER_SPEEDS = [0.02, 0.05, 0.1];
const LAYER_SIZES = [0.5, 1.2, 2.0];
const LAYER_COUNTS = [80, 50, 25];

export function initStars(width: number, height: number, _colors?: [string, string, string]): void {
  if (_colors?.[0]) {
    const hex = _colors[0].replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (!isNaN(r + g + b)) parsedColor = `${r},${g},${b}`;
  }

  stars = [];
  for (let layer = 0; layer < 3; layer++) {
    for (let i = 0; i < LAYER_COUNTS[layer]; i++) {
      const base = randomRange(0.3, 0.8);
      stars.push({
        x: randomRange(0, width),
        y: randomRange(0, height),
        size: LAYER_SIZES[layer],
        alpha: base,
        alphaSpeed: randomRange(0.005, 0.02) * (layer + 1),
        baseAlpha: base,
        layer,
      });
    }
  }
}

export function updateStars(width: number, height: number): void {
  time += 0.008;
  for (const s of stars) {
    s.y += LAYER_SPEEDS[s.layer];
    s.alpha = s.baseAlpha + Math.sin(time * s.alphaSpeed + s.x * 0.01) * 0.2;
    if (s.y > height + 2) { s.y = -2; s.x = randomRange(0, width); }
  }
}

export function drawStars(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
  ctx.clearRect(0, 0, _width, _height);

  for (const s of stars) {
    ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
    ctx.fillStyle = `rgb(${parsedColor})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
