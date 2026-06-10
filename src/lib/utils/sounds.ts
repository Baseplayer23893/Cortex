import { Howl } from "howler";

let enabled = false;
let volume = 0.5;

const sounds: Record<string, Howl | null> = {
  "focus-start": null,
  "focus-end": null,
  "break-start": null,
  "break-end": null,
};

export function initSounds(enabled_: boolean, volume_: number): void {
  enabled = enabled_;
  volume = volume_;

  if (!enabled) return;

  for (const key of Object.keys(sounds)) {
    const src = `/sounds/${key}.mp3`;
    sounds[key] = new Howl({ src: [src], volume, preload: true });
  }
}

export function setSoundEnabled(v: boolean): void {
  enabled = v;
}

export function setSoundVolume(v: number): void {
  volume = v;
  for (const s of Object.values(sounds)) {
    if (s) s.volume(v);
  }
}

export function playSound(name: "focus-start" | "focus-end" | "break-start" | "break-end"): void {
  if (!enabled) return;
  const s = sounds[name];
  if (s) {
    s.play();
  }
}
