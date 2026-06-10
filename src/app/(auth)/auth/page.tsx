"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Mail, Lock, LogIn, Code, ArrowRight, Circle } from "lucide-react";

function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouseRef.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: 1 - (event.clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    vec3 charcoal = vec3(0.075, 0.075, 0.082);
    vec3 baseColor = charcoal;
    float particles = 0.0;
    for(float i = 0.0; i < 40.0; i++) {
        vec2 pos = vec2(noise(vec2(i, 11.0)), noise(vec2(i, 22.0)));
        pos.y = fract(pos.y + u_time * 0.02 * (0.4 + noise(vec2(i, 33.0))));
        pos.x += sin(u_time * 0.1 + i) * 0.02;
        float dist = length(uv - pos);
        float size = 0.0008 + noise(vec2(i, 44.0)) * 0.0012;
        particles += smoothstep(size, 0.0, dist) * (0.3 + 0.7 * sin(u_time * 0.8 + i * 1.5));
    }
    vec3 lavender = vec3(0.77, 0.71, 0.99);
    vec3 finalColor = baseColor + particles * lavender * 0.5;
    float vignette = smoothstep(1.3, 0.6, length(uv - 0.5));
    finalColor *= vignette;
    gl_FragColor = vec4(finalColor, 1.0);
}`;

    const prog = gl.createProgram()!;
    const cs = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    window.addEventListener("mousemove", handleMouseMove);

    const render = (t: number) => {
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    let animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/api/auth/callback` },
      });
    } catch {
      // OAuth redirect — noop
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setError("Check your email for the login link!");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg">
      <ShaderCanvas />

      {/* Ambient glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-50" />

      <div className="relative z-10 flex items-center justify-center min-h-full px-6 md:px-16 py-12">
        {/* Glassmorphism Card */}
        <div
          className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-700"
          style={{
            animation: "fadeInScaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            opacity: 0,
          }}
        >
          <div className="relative glass-elevated p-8 flex flex-col overflow-hidden">
            {/* Subtle top-edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Brand Header */}
            <div className="flex flex-col items-center mb-8 gap-2 text-center">
              <Circle className="size-10 text-primary drop-shadow-[0_0_12px_rgba(195,195,233,0.3)] mb-2" fill="currentColor" />
              <h1 className="text-[32px] font-display font-semibold leading-tight tracking-tight text-primary">
                Aura
              </h1>
              <p className="text-base text-text-muted">Enter your digital sanctuary.</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-surface/50 rounded-full mb-6 border border-glass-border/50">
              <button
                onClick={() => { setTab("signin"); setError(null); }}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full font-medium text-sm relative overflow-hidden transition-all",
                  tab === "signin"
                    ? "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-text"
                    : "text-text-muted hover:text-text",
                )}
              >
                {tab === "signin" && (
                  <div className="absolute inset-0 bg-primary/10 rounded-full mix-blend-screen opacity-50 shadow-[0_0_12px_rgba(196,181,253,0.3)]" />
                )}
                <span className="relative z-10">Sign In</span>
              </button>
              <button
                onClick={() => { setTab("signup"); setError(null); }}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full font-medium text-sm relative overflow-hidden transition-all",
                  tab === "signup"
                    ? "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-text"
                    : "text-text-muted hover:text-text",
                )}
              >
                {tab === "signup" && (
                  <div className="absolute inset-0 bg-primary/10 rounded-full mix-blend-screen opacity-50 shadow-[0_0_12px_rgba(196,181,253,0.3)]" />
                )}
                <span className="relative z-10">Sign Up</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === "signup" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium tracking-wider text-text-muted ml-1" htmlFor="name">Your name</label>
                  <div className="relative group">
                    <input
                      id="name"
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface/40 border border-glass-border rounded-full py-3 pl-4 pr-4 text-sm text-text placeholder-text-muted/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-surface/60 transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium tracking-wider text-text-muted ml-1" htmlFor="email">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-muted/50 group-focus-within:text-primary transition-colors z-10" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-surface/40 border border-glass-border rounded-full py-3 pl-11 pr-4 text-sm text-text placeholder-text-muted/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-surface/60 transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-medium tracking-wider text-text-muted" htmlFor="password">Password</label>
                  <a className="text-xs font-medium tracking-wider text-primary hover:text-primary/80 transition-colors" href="#">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-muted/50 group-focus-within:text-primary transition-colors z-10" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-surface/40 border border-glass-border rounded-full py-3 pl-11 pr-4 text-sm text-text placeholder-text-muted/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-surface/60 transition-all shadow-inner"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative mt-2 w-full py-3.5 px-6 bg-primary hover:bg-white text-bg font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_0_20px_var(--glow)] hover:shadow-[0_0_30px_var(--glow)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden group disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-1.5 rounded-full bg-current animate-pulse" />
                    <span className="size-1.5 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
                    <span className="size-1.5 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">{tab === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-glass-border" />
              <span className="flex-shrink-0 mx-4 text-text-muted/50 text-xs font-medium tracking-wider uppercase">or continue with</span>
              <div className="flex-grow border-t border-glass-border" />
            </div>

            {/* Social Logins */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleOAuth("google")}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-surface/30 hover:bg-surface/60 border border-glass-border hover:border-white/10 rounded-full text-sm font-medium text-text transition-all backdrop-blur-sm shadow-sm disabled:opacity-50"
              >
                <LogIn className="size-5 text-text-muted group-hover:text-primary transition-colors" />
                Continue with Google
              </button>
              <button
                onClick={() => handleOAuth("github")}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-surface/30 hover:bg-surface/60 border border-glass-border hover:border-white/10 rounded-full text-sm font-medium text-text transition-all backdrop-blur-sm shadow-sm disabled:opacity-50"
              >
                <Code className="size-5 text-text-muted group-hover:text-primary transition-colors" />
                Continue with GitHub
              </button>
            </div>

            {/* Magic Link */}
            <div className="mt-5 text-center">
              <button
                onClick={handleMagicLink}
                disabled={loading || !email}
                className="text-xs font-medium tracking-wider text-text-muted/60 hover:text-text-muted transition-colors flex items-center justify-center gap-1 group disabled:opacity-30"
              >
                Send magic link instead
                <ArrowRight className="size-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-4 gap-4 border-t border-glass-border/50">
        <div className="flex items-center gap-2">
          <span className="text-primary font-display font-bold">Aura</span>
          <span className="text-xs text-text-muted">© 2024 Aura. Crafted for deep focus.</span>
        </div>
        <nav className="flex gap-6">
          <a className="text-xs text-text-muted/60 hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="text-xs text-text-muted/60 hover:text-primary transition-colors" href="#">Terms</a>
          <a className="text-xs text-text-muted/60 hover:text-primary transition-colors" href="#">Support</a>
          <a className="text-xs text-text-muted/60 hover:text-primary transition-colors" href="#">Twitter</a>
        </nav>
      </footer>

      <style>{`
        @keyframes fadeInScaleUp {
          from { opacity: 0; transform: scale(0.97) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
