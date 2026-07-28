/**
 * AI Sound Engine — Web Audio API, zero external files
 * All sounds are procedurally synthesized.
 * SSR-safe: AudioContext created only on user gesture.
 */

type AC = AudioContext;

let _ctx: AC | null = null;
let _vol = 0.52;

const MUTE_KEY = "sfx_muted";
let _muted =
  typeof window !== "undefined" && localStorage.getItem(MUTE_KEY) === "1";

export function isMuted(): boolean {
  return _muted;
}

export function toggleMute(): boolean {
  _muted = !_muted;
  try {
    localStorage.setItem(MUTE_KEY, _muted ? "1" : "0");
  } catch { /* private mode etc. */ }
  return _muted;
}

function getAC(): AC | null {
  if (typeof window === "undefined") return null;
  if (_muted) return null; // every sfx method no-ops while muted
  try {
    if (!_ctx) {
      _ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (_ctx.state === "suspended") _ctx.resume();
    return _ctx;
  } catch {
    return null;
  }
}

/* ─── Helpers ─────────────────────────────────────────────────────── */
function out(a: AC, vol = 1): GainNode {
  const g = a.createGain();
  g.gain.value = _vol * vol;
  g.connect(a.destination);
  return g;
}
function osc(a: AC, type: OscillatorType, freq: number): OscillatorNode {
  const o = a.createOscillator();
  o.type = type; o.frequency.value = freq;
  return o;
}
function gain(a: AC, val: number): GainNode {
  const g = a.createGain(); g.gain.value = val; return g;
}
function lpf(a: AC, freq: number): BiquadFilterNode {
  const f = a.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = freq; return f;
}
function hpf(a: AC, freq: number): BiquadFilterNode {
  const f = a.createBiquadFilter(); f.type = "highpass"; f.frequency.value = freq; return f;
}
function bpf(a: AC, freq: number, q = 1): BiquadFilterNode {
  const f = a.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q; return f;
}
function noise(a: AC, dur: number): AudioBufferSourceNode {
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(); src.buffer = buf; return src;
}

/* ─── Sound Library ───────────────────────────────────────────────── */
export const sfx = {

  setVolume(v: number) { _vol = Math.max(0, Math.min(1, v)); },

  /** Crisp tactical click — nav links, filter tabs, general buttons */
  click(vol = 0.7) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      const n = noise(a, 0.003);
      const h = hpf(a, 2200);
      const g = gain(a, 0);
      g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.024);
      n.connect(h); h.connect(g); g.connect(mg); n.start(t); n.stop(t + 0.03);
      const o = osc(a, "sine", 850);
      o.frequency.exponentialRampToValueAtTime(280, t + 0.055);
      const og = gain(a, 0);
      og.gain.setValueAtTime(0.22, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
      o.connect(og); og.connect(mg); o.start(t); o.stop(t + 0.07);
    } catch { /* ignore */ }
  },

  /** Feather-light click — hover, social icons, secondary interactions */
  softClick(vol = 0.35) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      const n = noise(a, 0.003);
      const f = bpf(a, 2400, 2);
      const g = gain(a, 0);
      g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.018);
      n.connect(f); f.connect(g); g.connect(mg); n.start(t); n.stop(t + 0.022);
    } catch { /* ignore */ }
  },

  /** Access granted — rising chord + confirm beep (Hire Me, Verify Credential, primary CTAs) */
  access(vol = 0.6) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      [440, 554, 659, 880].forEach((f, i) => {
        const o = osc(a, "sine", f);
        const og = gain(a, 0); const st = t + i * 0.058;
        og.gain.setValueAtTime(0.12, st); og.gain.exponentialRampToValueAtTime(0.001, st + 0.34);
        o.connect(og); og.connect(mg); o.start(st); o.stop(st + 0.38);
      });
      const beep = osc(a, "sine", 1200);
      const bg = gain(a, 0);
      bg.gain.setValueAtTime(0.09, t + 0.27); bg.gain.exponentialRampToValueAtTime(0.001, t + 0.48);
      beep.connect(bg); bg.connect(mg); beep.start(t + 0.27); beep.stop(t + 0.52);
    } catch { /* ignore */ }
  },

  /** Radar sweep — "View My Work" CTA, input focus */
  scan(vol = 0.55) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      for (let i = 0; i < 4; i++) {
        const o = osc(a, "sine", 160 + i * 75);
        o.frequency.linearRampToValueAtTime(1000 + i * 90, t + 0.08 + i * 0.14);
        o.frequency.exponentialRampToValueAtTime(160 + i * 75, t + 0.18 + i * 0.14);
        const og = gain(a, 0); const st = t + i * 0.14;
        og.gain.setValueAtTime(0.001, st); og.gain.linearRampToValueAtTime(0.1, st + 0.04);
        og.gain.exponentialRampToValueAtTime(0.001, st + 0.14);
        o.connect(og); og.connect(mg); o.start(st); o.stop(st + 0.18);
      }
    } catch { /* ignore */ }
  },

  /** Data stream burst — Download CV, project show-all */
  dataTransfer(vol = 0.48) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      for (let i = 0; i < 20; i++) {
        const o = osc(a, "square", 320 + Math.random() * 680);
        const og = gain(a, 0); const st = t + i * 0.028 + Math.random() * 0.007;
        og.gain.setValueAtTime(0.045, st); og.gain.exponentialRampToValueAtTime(0.001, st + 0.018);
        o.connect(lpf(a, 1600)).connect(og); og.connect(mg); o.start(st); o.stop(st + 0.022);
      }
    } catch { /* ignore */ }
  },

  /** Hologram flicker — certifications lightbox open, card reveals */
  hologram(vol = 0.62) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      for (let i = 0; i < 7; i++) {
        const o = osc(a, "square", 650 + i * 180);
        const og = gain(a, 0); const st = t + i * 0.035;
        og.gain.setValueAtTime(0.12, st); og.gain.exponentialRampToValueAtTime(0.001, st + 0.024);
        o.connect(lpf(a, 1300)).connect(og); og.connect(mg); o.start(st); o.stop(st + 0.028);
      }
      const hum = osc(a, "sine", 432);
      const hg = gain(a, 0);
      hg.gain.setValueAtTime(0.001, t + 0.2); hg.gain.linearRampToValueAtTime(0.065, t + 0.35);
      hg.gain.exponentialRampToValueAtTime(0.001, t + 0.82);
      hum.connect(hg); hg.connect(mg); hum.start(t + 0.2); hum.stop(t + 0.88);
    } catch { /* ignore */ }
  },

  /** Power-down sweep — close/dismiss modals & lightboxes */
  shutdown(vol = 0.42) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      const o = osc(a, "sawtooth", 580);
      o.frequency.exponentialRampToValueAtTime(28, t + 0.36);
      const og = gain(a, 0);
      og.gain.setValueAtTime(0.16, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.connect(lpf(a, 850)).connect(og); og.connect(mg); o.start(t); o.stop(t + 0.42);
    } catch { /* ignore */ }
  },

  /** Success chime — form submit success */
  success(vol = 0.68) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      [523, 659, 784, 1047, 1319].forEach((f, i) => {
        const o = osc(a, "sine", f);
        const og = gain(a, 0); const st = t + i * 0.068;
        og.gain.setValueAtTime(0.12, st); og.gain.exponentialRampToValueAtTime(0.001, st + 0.38);
        o.connect(og); og.connect(mg); o.start(st); o.stop(st + 0.42);
      });
    } catch { /* ignore */ }
  },

  /** Error buzz — form submit failure, denied */
  error(vol = 0.62) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      [220, 198, 180].forEach((f, i) => {
        const o = osc(a, "sawtooth", f);
        const og = gain(a, 0); const st = t + i * 0.115;
        og.gain.setValueAtTime(0.2, st); og.gain.exponentialRampToValueAtTime(0.001, st + 0.1);
        o.connect(lpf(a, 580)).connect(og); og.connect(mg); o.start(st); o.stop(st + 0.12);
      });
    } catch { /* ignore */ }
  },

  /** Triple warning — validation errors */
  warning(vol = 0.5) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      [0, 0.17, 0.34].forEach((d) => {
        const o = osc(a, "square", 880);
        const og = gain(a, 0);
        og.gain.setValueAtTime(0.14, t + d); og.gain.exponentialRampToValueAtTime(0.001, t + d + 0.1);
        o.connect(lpf(a, 1300)).connect(og); og.connect(mg); o.start(t + d); o.stop(t + d + 0.12);
      });
    } catch { /* ignore */ }
  },

  /** AI startup arpeggio — skills section enters viewport */
  startup(vol = 0.42) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      [220, 330, 440, 550, 660, 880].forEach((f, i) => {
        const o = osc(a, "sine", f);
        const og = gain(a, 0); const st = t + i * 0.052;
        og.gain.setValueAtTime(0.09, st); og.gain.exponentialRampToValueAtTime(0.001, st + 0.13);
        o.connect(og); og.connect(mg); o.start(st); o.stop(st + 0.16);
      });
      const hum = osc(a, "sawtooth", 52);
      const hg = gain(a, 0);
      hg.gain.setValueAtTime(0.001, t); hg.gain.linearRampToValueAtTime(0.065, t + 0.18);
      hg.gain.exponentialRampToValueAtTime(0.001, t + 0.62);
      hum.connect(lpf(a, 180)).connect(hg); hg.connect(mg); hum.start(t); hum.stop(t + 0.65);
    } catch { /* ignore */ }
  },

  /** Sci-fi typewriter key — contact form typing (very subtle) */
  typeKey(vol = 0.2) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      const o = osc(a, "sine", 480 + Math.random() * 320);
      o.frequency.exponentialRampToValueAtTime(160 + Math.random() * 120, t + 0.026);
      const og = gain(a, 0);
      og.gain.setValueAtTime(0.26, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.032);
      o.connect(og); og.connect(mg); o.start(t); o.stop(t + 0.036);
      const n = noise(a, 0.012);
      const h = hpf(a, 3600);
      const g = gain(a, 0);
      g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
      n.connect(h); h.connect(g); g.connect(mg); n.start(t); n.stop(t + 0.016);
    } catch { /* ignore */ }
  },

  /** Data complete fanfare — expand projects / finish loading */
  dataComplete(vol = 0.55) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      for (let i = 0; i < 6; i++) {
        const n = noise(a, 0.01);
        const f = bpf(a, 2600 + i * 450, 5);
        const g = gain(a, 0); const st = t + i * 0.032;
        g.gain.setValueAtTime(0.16, st); g.gain.exponentialRampToValueAtTime(0.001, st + 0.011);
        n.connect(f); f.connect(g); g.connect(mg); n.start(st); n.stop(st + 0.014);
      }
      [523, 659, 784, 1047, 1319].forEach((f, i) => {
        const o = osc(a, "sine", f);
        const og = gain(a, 0); const st = t + 0.2 + i * 0.048;
        og.gain.setValueAtTime(0.09, st); og.gain.exponentialRampToValueAtTime(0.001, st + 0.36);
        o.connect(og); og.connect(mg); o.start(st); o.stop(st + 0.4);
      });
    } catch { /* ignore */ }
  },

  /** Soft notification ping — minor UI acknowledgements */
  notification(vol = 0.46) {
    try {
      const a = getAC(); if (!a) return;
      const t = a.currentTime, mg = out(a, vol);
      [880, 1320].forEach((f, i) => {
        const o = osc(a, "sine", f);
        const og = gain(a, 0); const st = t + i * 0.095;
        og.gain.setValueAtTime(0.1, st); og.gain.exponentialRampToValueAtTime(0.001, st + 0.26);
        o.connect(og); og.connect(mg); o.start(st); o.stop(st + 0.28);
      });
    } catch { /* ignore */ }
  },
};
