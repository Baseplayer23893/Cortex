"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Code, ArrowRight } from "lucide-react";

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
    let animId = 0;
    let gl: WebGLRenderingContext | null = null;

    const idle = typeof requestIdleCallback !== "undefined"
      ? requestIdleCallback
      : ((cb: () => void) => setTimeout(cb, 1));

    idle(() => {
      gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (!gl) return;

      const syncSize = () => {
        const w = canvas!.clientWidth || 1280;
        const h = canvas!.clientHeight || 720;
        if (canvas!.width !== w || canvas!.height !== h) {
          canvas!.width = w;
          canvas!.height = h;
        }
      };

      if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(syncSize).observe(canvas!);
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

    vec3 color1 = vec3(0.06, 0.06, 0.07);
    vec3 color2 = vec3(0.10, 0.09, 0.12);
    vec3 baseColor = mix(color1, color2, uv.y + sin(u_time * 0.2) * 0.2);

    float particles = 0.0;
    for(float i = 0.0; i < 40.0; i++) {
        vec2 pos = vec2(noise(vec2(i, 1.0)), noise(vec2(i, 2.0)));
        pos.y = fract(pos.y - u_time * 0.03 * (0.5 + noise(vec2(i, 3.0))));
        pos.x += sin(u_time * 0.1 + i) * 0.02;
        float dist = length(uv - pos);
        float size = 0.001 + noise(vec2(i, 4.0)) * 0.002;
        particles += smoothstep(size, 0.0, dist) * (0.3 + 0.7 * sin(u_time + i));
    }

    vec3 lavender = vec3(0.82, 0.82, 0.97);
    vec3 finalColor = baseColor + particles * lavender * 0.6;

    float vignette = smoothstep(1.5, 0.5, length(uv - 0.5));
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
}`;

      const prog = gl!.createProgram()!;
      const cs = (type: number, src: string) => {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        return s;
      };
      gl!.attachShader(prog, cs(gl!.VERTEX_SHADER, vs));
      gl!.attachShader(prog, cs(gl!.FRAGMENT_SHADER, fs));
      gl!.linkProgram(prog);
      gl!.useProgram(prog);

      const buf = gl!.createBuffer();
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl!.STATIC_DRAW);
      const pos = gl!.getAttribLocation(prog, "a_position");
      gl!.enableVertexAttribArray(pos);
      gl!.vertexAttribPointer(pos, 2, gl!.FLOAT, false, 0, 0);

      const uTime = gl!.getUniformLocation(prog, "u_time");
      const uRes = gl!.getUniformLocation(prog, "u_resolution");
      const uMouse = gl!.getUniformLocation(prog, "u_mouse");

      window.addEventListener("mousemove", handleMouseMove);

      const render = (t: number) => {
        if (typeof ResizeObserver === "undefined") syncSize();
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
        if (uTime) gl!.uniform1f(uTime, t * 0.001);
        if (uRes) gl!.uniform2f(uRes, canvas!.width, canvas!.height);
        if (uMouse) gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);
    });

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
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        window.location.href = "/dashboard";
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
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
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage("Check your email for the login link!");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg to-primary/5" />
      <ShaderCanvas />

      <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[80px] pointer-events-none animate-[drift_20s_alternate_infinite_ease-in-out]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[80px] pointer-events-none animate-[drift_20s_alternate_infinite_ease-in-out]" style={{ animationDelay: "-10s" }} />

      <div className="relative z-10 flex items-center justify-center min-h-full px-6 py-12">
        <div
          className="w-full max-w-[440px]"
          style={{
            animation: "fadeInScaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            opacity: 0,
          }}
        >
          <div className="relative glass-elevated p-8 flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex flex-col items-center mb-8 gap-2 text-center">
              <div className="size-10 rounded-lg bg-primary-container flex items-center justify-center mb-2">
                <span className="text-on-primary-container text-[28px] leading-none font-bold">A</span>
              </div>
              <h1 className="text-[32px] font-display font-semibold leading-tight tracking-tight text-primary">
                Aura
              </h1>
              <p className="text-base text-text-muted">Welcome to Focus</p>
            </div>

            <div className="flex p-1 bg-black/20 rounded-full mb-6 relative">
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-full transition-transform duration-300"
                style={{ transform: tab === "signin" ? "translateX(0)" : "translateX(100%)" }}
              />
              <button
                onClick={() => { setTab("signin"); setMessage(null); }}
                className="relative z-10 flex-1 py-2 text-center text-sm font-semibold tracking-wider transition-colors"
              >
                <span className={tab === "signin" ? "text-primary" : "text-text-muted"}>Sign In</span>
              </button>
              <button
                onClick={() => { setTab("signup"); setMessage(null); }}
                className="relative z-10 flex-1 py-2 text-center text-sm font-semibold tracking-wider transition-colors"
              >
                <span className={tab === "signup" ? "text-primary" : "text-text-muted"}>Sign Up</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wider text-text-muted ml-1" htmlFor="name">Your name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/20 border border-white/[0.08] rounded-full py-3 px-4 text-sm text-primary placeholder:text-text-muted/40 focus:border-primary-container focus:shadow-[0_0_0_4px_rgba(209,209,247,0.15)] focus:bg-black/30 focus:outline-none transition-all"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-text-muted ml-1" htmlFor="email">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-muted/50" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/20 border border-white/[0.08] rounded-full py-3 pl-11 pr-4 text-sm text-primary placeholder:text-text-muted/40 focus:border-primary-container focus:shadow-[0_0_0_4px_rgba(209,209,247,0.15)] focus:bg-black/30 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold tracking-wider text-text-muted" htmlFor="password">Password</label>
                  <a className="text-xs font-semibold tracking-wider text-primary/70 hover:text-primary transition-colors" href="#">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-muted/50" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/20 border border-white/[0.08] rounded-full py-3 pl-11 pr-4 text-sm text-primary placeholder:text-text-muted/40 focus:border-primary-container focus:shadow-[0_0_0_4px_rgba(209,209,247,0.15)] focus:bg-black/30 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {message && (
                <p className="text-xs px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative mt-2 w-full py-3.5 px-6 bg-primary-container text-on-primary-container font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(209,209,247,0.25)] hover:shadow-[0_0_30px_rgba(209,209,247,0.35)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-1.5 rounded-full bg-current animate-pulse" />
                    <span className="size-1.5 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
                    <span className="size-1.5 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
                  </span>
                ) : (
                  tab === "signin" ? "Continue" : "Create Account"
                )}
              </button>
            </form>

            <button
              onClick={handleMagicLink}
              disabled={loading || !email}
              className="mt-4 text-xs font-semibold tracking-wider text-text-muted/50 hover:text-text-muted transition-colors flex items-center justify-center gap-1 group disabled:opacity-30"
            >
              Email me a magic link
              <ArrowRight className="size-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>

            <div className="relative flex items-center py-5">
              <div className="flex-grow h-px bg-white/10" />
              <span className="flex-shrink-0 mx-4 text-text-muted/40 text-xs font-semibold tracking-widest uppercase">Or continue with</span>
              <div className="flex-grow h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth("google")}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-3 rounded-full bg-white/[0.03] backdrop-blur-[40px] border border-white/[0.12] hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <svg className="size-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#e4e2e4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#e4e2e4"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#e4e2e4"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#e4e2e4"/>
                </svg>
                <span className="text-xs font-semibold text-text-muted">Google</span>
              </button>
              <button
                onClick={() => handleOAuth("github")}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-3 rounded-full bg-white/[0.03] backdrop-blur-[40px] border border-white/[0.12] hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <Code className="size-5 text-text-muted" />
                <span className="text-xs font-semibold text-text-muted">GitHub</span>
              </button>
            </div>

            <footer className="mt-6 flex justify-center gap-4">
              <a className="text-xs text-text-muted/40 hover:text-text-muted transition-colors" href="#">Privacy Policy</a>
              <span className="text-white/10">•</span>
              <a className="text-xs text-text-muted/40 hover:text-text-muted transition-colors" href="#">Terms of Service</a>
            </footer>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScaleUp {
          from { opacity: 0; transform: scale(0.97) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes drift {
          from { transform: translate(-10%, -10%); }
          to   { transform: translate(10%, 10%); }
        }
      `}</style>
    </div>
  );
}
