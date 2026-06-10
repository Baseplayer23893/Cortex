import { Particle, createParticle, updateParticle, drawParticles } from "./particles";
import { initFluid, updateFluid, drawFluid } from "./fluid";
import { initAurora, updateAurora, drawAurora } from "./aurora";
import { initGeometric, updateGeometric, drawGeometric } from "./geometric";
import { initStars, updateStars, drawStars } from "./stars";

export type AnimMode = "particles" | "fluid" | "aurora" | "geometric" | "stars" | "fireflies" | "petals";
export type CanvasColors = [string, string, string];

interface EngineConfig {
  mode: AnimMode;
  speed: number;
  opacity: number;
  colors: CanvasColors;
}

const DEFAULT_CONFIG: EngineConfig = {
  mode: "fluid",
  speed: 1,
  opacity: 1,
  colors: ["#a78bfa", "#f472b6", "#67e8f9"],
};

export class CanvasEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animId = 0;
  private lastTime = 0;
  private config: EngineConfig;
  private particles: Particle[] = [];
  private running = false;
  private destroyed = false;
  private fps = 60;
  private frameCount = 0;
  private fpsTimer = 0;
  private throttleLevel = 0;
  private resizeObserver: ResizeObserver | null = null;

  constructor(config?: Partial<EngineConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  start(canvas: HTMLCanvasElement): void {
    if (this.running) return;
    this.canvas = canvas;
    this.destroyed = false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    this.ctx = ctx;

    this.syncSize();
    this.resizeObserver = new ResizeObserver(() => this.syncSize());
    this.resizeObserver.observe(canvas);

    document.addEventListener("visibilitychange", this.handleVisibility);

    this.initRenderers();
    this.running = true;
    this.lastTime = performance.now();
    this.animId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.animId);
  }

  destroy(): void {
    this.stop();
    this.destroyed = true;
    document.removeEventListener("visibilitychange", this.handleVisibility);
    if (this.resizeObserver && this.canvas) {
      this.resizeObserver.unobserve(this.canvas);
    }
    this.resizeObserver = null;
    this.canvas = null;
    this.ctx = null;
  }

  setMode(mode: AnimMode): void {
    this.config.mode = mode;
    this.initRenderers();
  }

  setSpeed(speed: number): void {
    this.config.speed = speed;
  }

  setOpacity(opacity: number): void {
    this.config.opacity = opacity;
  }

  setColors(colors: CanvasColors): void {
    this.config.colors = colors;
    this.initRenderers();
  }

  private handleVisibility = (): void => {
    if (document.hidden) {
      this.stop();
    } else if (!this.destroyed && this.canvas) {
      this.lastTime = performance.now();
      this.frameCount = 0;
      this.fpsTimer = 0;
      this.start(this.canvas);
    }
  };

  private syncSize(): void {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dpr = this.throttleLevel > 1 || window.devicePixelRatio < 1.5 ? 1 : Math.min(window.devicePixelRatio, 2);
    const cw = Math.round(w * dpr);
    const ch = Math.round(h * dpr);
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw;
      this.canvas.height = ch;
    }
    this.ctx.scale(dpr, dpr);
  }

  private initRenderers(): void {
    const w = this.canvas?.width || 800;
    const h = this.canvas?.height || 600;
    const { mode, colors } = this.config;

    switch (mode) {
      case "particles":
      case "fireflies":
      case "petals": {
        this.particles = Array.from({ length: 60 }, () => createParticle(w, h));
        break;
      }
      case "fluid":
        initFluid(w, h, colors);
        break;
      case "aurora":
        initAurora(w, h, colors);
        break;
      case "geometric":
        initGeometric(w, h, colors);
        break;
      case "stars":
        initStars(w, h, colors);
        break;
    }
  }

  private loop = (now: number): void => {
    if (!this.running || !this.ctx || !this.canvas) return;

    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 1) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer = 0;
      if (this.fps < 30) this.throttleLevel = Math.min(3, this.throttleLevel + 1);
      else if (this.fps > 50) this.throttleLevel = Math.max(0, this.throttleLevel - 1);
    }

    this.update(dt);
    this.draw();

    this.animId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const speed = this.config.speed * (1 - this.throttleLevel * 0.15);
    const scaledDt = dt * speed;
    const skipFrames = this.throttleLevel > 1;

    if (skipFrames && Math.random() > 1 / this.throttleLevel) return;

    const { mode } = this.config;

    switch (mode) {
      case "particles":
      case "fireflies":
      case "petals":
        for (const p of this.particles) {
          updateParticle(p, w, h);
          if (p.life >= p.maxLife || p.alpha <= 0) {
            Object.assign(p, createParticle(w, h));
          }
        }
        break;
      case "fluid":
        for (let i = 0; i < Math.ceil(scaledDt * 60); i++) updateFluid(w, h);
        break;
      case "aurora":
        for (let i = 0; i < Math.ceil(scaledDt * 60); i++) updateAurora(w, h);
        break;
      case "geometric":
        for (let i = 0; i < Math.ceil(scaledDt * 60); i++) updateGeometric(w, h);
        break;
      case "stars":
        updateStars(w, h);
        break;
    }
  }

  private draw(): void {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;

    this.ctx.save();
    this.ctx.globalAlpha = this.config.opacity;

    const { mode, colors } = this.config;

    switch (mode) {
      case "particles":
        drawParticles(this.ctx, this.particles, colors[0]);
        break;
      case "fireflies": {
        drawParticles(this.ctx, this.particles, colors[0]);
        this.drawConnections(w, h);
        break;
      }
      case "petals":
        this.drawPetals(w, h);
        break;
      case "fluid":
        drawFluid(this.ctx, w, h);
        break;
      case "aurora":
        drawAurora(this.ctx, w, h);
        break;
      case "geometric":
        drawGeometric(this.ctx, w, h);
        break;
      case "stars":
        drawStars(this.ctx, w, h);
        break;
    }

    this.ctx.restore();
  }

  private drawConnections(w: number, h: number): void {
    if (!this.ctx) return;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.config.colors[0];
          this.ctx.globalAlpha = (1 - dist / 80) * 0.15;
          this.ctx.stroke();
        }
      }
    }
  }

  private drawPetals(w: number, h: number): void {
    if (!this.ctx) return;
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.life * 0.02);
      this.ctx.globalAlpha = p.alpha * 0.6;
      this.ctx.fillStyle = this.config.colors[0];
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.5, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
