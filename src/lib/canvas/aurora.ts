import { hexToRgb, rgbToStr, lerpColor, clamp } from "./utils";

interface Ribbon {
  points: { x: number; y: number }[];
  color: [number, number, number];
  speed: number;
  offset: number;
  width: number;
}

let ribbons: Ribbon[] = [];
let time = 0;

export function initAurora(width: number, height: number, colors: [string, string, string]): void {
  const rgbColors = colors.map(hexToRgb) as [[number, number, number], [number, number, number], [number, number, number]];
  ribbons = [];
  for (let i = 0; i < 4; i++) {
    const pts: { x: number; y: number }[] = [];
    for (let j = 0; j <= 60; j++) {
      pts.push({ x: (j / 60) * width, y: 0 });
    }
    ribbons.push({
      points: pts,
      color: rgbColors[i % rgbColors.length],
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      width: 40 + Math.random() * 60,
    });
  }
}

export function updateAurora(width: number, height: number): void {
  time += 0.008;
  for (const r of ribbons) {
    for (let i = 0; i < r.points.length; i++) {
      const t = i / r.points.length;
      r.points[i].y =
        height * 0.3 +
        Math.sin(time * r.speed + t * 4 + r.offset) * height * 0.15 +
        Math.sin(time * r.speed * 0.5 + t * 2 + r.offset) * height * 0.1;
    }
  }
}

export function drawAurora(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
  ctx.clearRect(0, 0, _width, _height);

  for (const r of ribbons) {
    ctx.beginPath();
    ctx.moveTo(r.points[0].x, r.points[0].y);

    for (let i = 1; i < r.points.length; i++) {
      ctx.lineTo(r.points[i].x, r.points[i].y);
    }

    const [rCol, g, b] = r.color;
    ctx.strokeStyle = rgbToStr(rCol, g, b, 0.25);
    ctx.lineWidth = r.width;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.strokeStyle = rgbToStr(rCol, g, b, 0.1);
    ctx.lineWidth = r.width * 1.5;
    ctx.stroke();
  }
}
