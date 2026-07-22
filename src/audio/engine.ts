"use client"

import * as Sentry from "@sentry/nextjs"

function captureError(error: unknown, context: string) {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(`[Audio] ${context}: ${String(error)}`, "error")
  }
}

function createNoiseBuffer(ctx: AudioContext, type: "white" | "brown" | "pink", duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const length = sampleRate * duration
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  if (type === "white") {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  } else if (type === "brown") {
    let last = 0
    for (let i = 0; i < length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
      data[i] = last * 3.5
    }
  } else {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.969 * b2 + w * 0.153852
      b3 = 0.8665 * b3 + w * 0.3104856
      b4 = 0.55 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.016898
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }
  }
  return buffer
}

function noiseSource(ctx: AudioContext, type: "white" | "brown" | "pink", amp: number, dest: AudioNode, filter?: { type: BiquadFilterType; freq: number; Q: number }) {
  const buf = createNoiseBuffer(ctx, type, 8)
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(amp, ctx.currentTime)
  if (filter) {
    const f = ctx.createBiquadFilter()
    f.type = filter.type
    f.frequency.setValueAtTime(filter.freq, ctx.currentTime)
    f.Q.setValueAtTime(filter.Q, ctx.currentTime)
    src.connect(gain)
    gain.connect(f)
    f.connect(dest)
    src.start()
    return { nodes: [src, gain, f], gain }
  }
  src.connect(gain)
  gain.connect(dest)
  src.start()
  return { nodes: [src, gain], gain }
}

function lfoModulate(ctx: AudioContext, freq: number, amp: number, target: AudioParam) {
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.type = "sine"
  lfo.frequency.setValueAtTime(freq, ctx.currentTime)
  lfoGain.gain.setValueAtTime(amp, ctx.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(target)
  lfo.start()
  return { nodes: [lfo, lfoGain] }
}

function makeChirp(ctx: AudioContext, delay: number, f1: number, f2: number, amp: number, dest: AudioNode) {
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(f1, now + delay)
  osc.frequency.linearRampToValueAtTime(f2, now + delay + 0.12)
  gain.gain.setValueAtTime(0, now + delay)
  gain.gain.linearRampToValueAtTime(amp, now + delay + 0.01)
  gain.gain.linearRampToValueAtTime(0, now + delay + 0.12)
  osc.connect(gain)
  gain.connect(dest)
  osc.start(now + delay)
  osc.stop(now + delay + 0.12)
  return { nodes: [osc, gain] }
}

function makeClick(ctx: AudioContext, delay: number, freq: number, amp: number, dest: AudioNode) {
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "square"
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  gain.gain.setValueAtTime(0, now + delay)
  gain.gain.linearRampToValueAtTime(amp, now + delay + 0.001)
  gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03)
  osc.connect(gain)
  gain.connect(dest)
  osc.start(now + delay)
  osc.stop(now + delay + 0.03)
  return { nodes: [osc, gain] }
}

function makeCrackle(ctx: AudioContext, delay: number, amp: number, dest: AudioNode) {
  const now = ctx.currentTime
  const buf = createNoiseBuffer(ctx, "white", 0.05)
  const src = ctx.createBufferSource()
  src.buffer = buf
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = "highpass"
  filter.frequency.setValueAtTime(3000, ctx.currentTime)
  filter.Q.setValueAtTime(0.5, ctx.currentTime)
  gain.gain.setValueAtTime(amp, now + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(dest)
  src.start(now + delay)
  return { nodes: [src, filter, gain] }
}

function makeRumble(ctx: AudioContext, delay: number, amp: number, dest: AudioNode) {
  const now = ctx.currentTime
  const buf = createNoiseBuffer(ctx, "brown", 0.5)
  const src = ctx.createBufferSource()
  src.buffer = buf
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.setValueAtTime(150, ctx.currentTime)
  filter.Q.setValueAtTime(0.5, ctx.currentTime)
  gain.gain.setValueAtTime(0, now + delay)
  gain.gain.linearRampToValueAtTime(amp, now + delay + 0.3)
  gain.gain.linearRampToValueAtTime(0, now + delay + 1.5)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(dest)
  src.start(now + delay)
  src.stop(now + delay + 2)
  return { nodes: [src, filter, gain] }
}

type SoundBuilder = (ctx: AudioContext, dest: AudioNode) => { nodes: AudioNode[]; cleanup?: () => void }

const SOUND_BUILDERS: Record<string, SoundBuilder> = {
  "rain-light": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.08, dest, { type: "highpass", freq: 3500, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.4, 0.04, n.gain.gain)
    return { nodes: [...n.nodes, ...m.nodes] }
  },
  "rain-heavy": (ctx, dest) => {
    const n1 = noiseSource(ctx, "white", 0.15, dest, { type: "highpass", freq: 1800, Q: 0.4 })
    const n2 = noiseSource(ctx, "white", 0.06, dest, { type: "highpass", freq: 5000, Q: 0.3 })
    n1.gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 2)
    n2.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.25, 0.05, n1.gain.gain)
    return { nodes: [...n1.nodes, ...n2.nodes, ...m.nodes] }
  },
  "rain-thunder": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.1, dest, { type: "highpass", freq: 2000, Q: 0.5 })
    const m = lfoModulate(ctx, 0.2, 0.04, n.gain.gain)
    const active = { current: true }
    const thunder = setInterval(() => {
      if (!active.current) { clearInterval(thunder); return }
      const delay = Math.random() * 3
      const r = makeRumble(ctx, delay, 0.15 + Math.random() * 0.15, dest)
      scheduleCleanupNodes.push(...r.nodes)
    }, 6000)
    const scheduleCleanupNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(thunder) } }
  },
  "forest-day": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.06, dest, { type: "bandpass", freq: 600, Q: 1.2 })
    n.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2)
    const active = { current: true }
    const chirpTimer = setInterval(() => {
      if (!active.current) { clearInterval(chirpTimer); return }
      const d = Math.random() * 2
      const f1 = 2000 + Math.random() * 1200
      const f2 = f1 + 400 + Math.random() * 600
      const c = makeChirp(ctx, d, f1, f2, 0.04, dest)
      extraNodes.push(...c.nodes)
    }, 3500)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(chirpTimer) } }
  },
  "forest-night": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.04, dest, { type: "lowpass", freq: 350, Q: 0.8 })
    n.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)
    const active = { current: true }
    const cricketTimer = setInterval(() => {
      if (!active.current) { clearInterval(cricketTimer); return }
      const d = Math.random() * 0.5
      const c = makeChirp(ctx, d, 4000, 4200, 0.02, dest)
      extraNodes.push(...c.nodes)
    }, 2000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(cricketTimer) } }
  },
  "ocean-waves": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.12, dest, { type: "lowpass", freq: 500, Q: 0.3 })
    n.gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.07, 0.09, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.03, dest, { type: "bandpass", freq: 3000, Q: 0.3 })
    const m2 = lfoModulate(ctx, 0.09, 0.02, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  "ocean-storm": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.18, dest, { type: "lowpass", freq: 700, Q: 0.4 })
    n.gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.09, 0.1, n.gain.gain)
    const active = { current: true }
    const thunder = setInterval(() => {
      if (!active.current) { clearInterval(thunder); return }
      const r = makeRumble(ctx, Math.random() * 2, 0.2 + Math.random() * 0.15, dest)
      extraNodes.push(...r.nodes)
    }, 8000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(thunder) } }
  },
  "river-stream": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.07, dest, { type: "bandpass", freq: 1000, Q: 0.8 })
    n.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.3, 0.04, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.03, dest, { type: "bandpass", freq: 2500, Q: 1.5 })
    n2.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const m2 = lfoModulate(ctx, 0.7, 0.02, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  waterfall: (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.15, dest, { type: "bandpass", freq: 2000, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2)
    const n2 = noiseSource(ctx, "pink", 0.08, dest, { type: "lowpass", freq: 400, Q: 0.5 })
    const m = lfoModulate(ctx, 0.5, 0.03, n.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes] }
  },
  fireplace: (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.08, dest, { type: "lowpass", freq: 350, Q: 0.7 })
    n.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2)
    const active = { current: true }
    const crackleTimer = setInterval(() => {
      if (!active.current) { clearInterval(crackleTimer); return }
      if (Math.random() < 0.4) {
        const c = makeCrackle(ctx, Math.random() * 0.3, 0.06 + Math.random() * 0.06, dest)
        extraNodes.push(...c.nodes)
      }
    }, 800)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(crackleTimer) } }
  },
  campfire: (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.06, dest, { type: "bandpass", freq: 250, Q: 0.6 })
    n.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2)
    const n2 = noiseSource(ctx, "white", 0.02, dest, { type: "highpass", freq: 3000, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.7, 0.03, n.gain.gain)
    const active = { current: true }
    const crackleTimer = setInterval(() => {
      if (!active.current) { clearInterval(crackleTimer); return }
      if (Math.random() < 0.3) {
        const c = makeCrackle(ctx, Math.random() * 0.2, 0.04 + Math.random() * 0.04, dest)
        extraNodes.push(...c.nodes)
      }
    }, 1200)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(crackleTimer) } }
  },
  "wind-gentle": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.04, dest, { type: "bandpass", freq: 1800, Q: 0.4 })
    n.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.08, 0.025, n.gain.gain)
    const sweep = ctx.createBiquadFilter()
    sweep.type = "lowpass"
    sweep.frequency.setValueAtTime(2000, ctx.currentTime)
    return { nodes: [...n.nodes, ...m.nodes] }
  },
  "wind-strong": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.1, dest, { type: "bandpass", freq: 1200, Q: 0.3 })
    n.gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.05, 0.06, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.04, dest, { type: "highpass", freq: 4000, Q: 0.3 })
    const m2 = lfoModulate(ctx, 0.12, 0.03, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  "cafe-bustling": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.03, dest, { type: "bandpass", freq: 1200, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const active = { current: true }
    const clatterTimer = setInterval(() => {
      if (!active.current) { clearInterval(clatterTimer); return }
      if (Math.random() < 0.25) {
        const c = makeCrackle(ctx, Math.random() * 0.5, 0.03 + Math.random() * 0.03, dest)
        extraNodes.push(...c.nodes)
      }
    }, 2000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(clatterTimer) } }
  },
  "library-quiet": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.02, dest, { type: "lowpass", freq: 250, Q: 1.0 })
    n.gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2)
    const active = { current: true }
    const pageTimer = setInterval(() => {
      if (!active.current) { clearInterval(pageTimer); return }
      if (Math.random() < 0.15) {
        const c = makeCrackle(ctx, 0, 0.015, dest)
        extraNodes.push(...c.nodes)
      }
    }, 5000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(pageTimer) } }
  },
  "keyboard-mechanical": (ctx, dest) => {
    const active = { current: true }
    const clickTimer = setInterval(() => {
      if (!active.current) { clearInterval(clickTimer); return }
      const d = Math.random() * 0.15
      const c = makeClick(ctx, d, 1200 + Math.random() * 400, 0.06, dest)
      extraNodes.push(...c.nodes)
      if (Math.random() < 0.3) {
        const c2 = makeClick(ctx, d + 0.04, 800, 0.04, dest)
        extraNodes.push(...c2.nodes)
      }
    }, 250)
    const n = noiseSource(ctx, "white", 0.01, dest, { type: "bandpass", freq: 2500, Q: 2.0 })
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(clickTimer) } }
  },
  "writing-pen": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.02, dest, { type: "bandpass", freq: 3500, Q: 4.0 })
    n.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 1.5, 0.015, n.gain.gain)
    const active = { current: true }
    const scratchTimer = setInterval(() => {
      if (!active.current) { clearInterval(scratchTimer); return }
      if (Math.random() < 0.3) {
        const n2 = noiseSource(ctx, "white", 0.025, dest, { type: "bandpass", freq: 3000 + Math.random() * 1000, Q: 3.0 })
        const g = n2.gain
        if (g) { g.gain.setValueAtTime(0.03, ctx.currentTime); g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3 + Math.random() * 0.3) }
        extraNodes.push(...n2.nodes)
      }
    }, 600)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(scratchTimer) } }
  },
  "city-night": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.05, dest, { type: "lowpass", freq: 400, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2)
    const n2 = noiseSource(ctx, "white", 0.01, dest, { type: "bandpass", freq: 2000, Q: 0.3 })
    const m = lfoModulate(ctx, 0.15, 0.02, n.gain.gain)
    const active = { current: true }
    const carTimer = setInterval(() => {
      if (!active.current) { clearInterval(carTimer); return }
      if (Math.random() < 0.1) {
        const r = makeRumble(ctx, 0, 0.04, dest)
        extraNodes.push(...r.nodes)
      }
    }, 4000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(carTimer) } }
  },
  "train-journey": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.08, dest, { type: "bandpass", freq: 180, Q: 1.5 })
    n.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.4, 0.04, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.02, dest, { type: "highpass", freq: 4000, Q: 0.3 })
    const active = { current: true }
    const trackTimer = setInterval(() => {
      if (!active.current) { clearInterval(trackTimer); return }
      const c = makeClick(ctx, 0, 600 + Math.random() * 200, 0.03, dest)
      extraNodes.push(...c.nodes)
      const c2 = makeClick(ctx, 0.06, 500, 0.025, dest)
      extraNodes.push(...c2.nodes)
    }, 400)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(trackTimer) } }
  },
  "white-noise": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.12, dest, { type: "lowpass", freq: 8000, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1)
    return { nodes: n.nodes }
  },
  "brown-noise": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.12, dest, { type: "lowpass", freq: 300, Q: 0.7 })
    n.gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1)
    return { nodes: n.nodes }
  },
  "pink-noise": (ctx, dest) => {
    const n = noiseSource(ctx, "pink", 0.12, dest, { type: "lowpass", freq: 2000, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1)
    return { nodes: n.nodes }
  },
  "birds-garden": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.01, dest, { type: "highpass", freq: 5000, Q: 0.5 })
    const active = { current: true }
    const chirpTimer = setInterval(() => {
      if (!active.current) { clearInterval(chirpTimer); return }
      const d = Math.random() * 1.5
      const f1 = 2500 + Math.random() * 1500
      const f2 = f1 + 500 + Math.random() * 1000
      const c = makeChirp(ctx, d, f1, f2, 0.05, dest)
      extraNodes.push(...c.nodes)
      if (Math.random() < 0.4) {
        const c2 = makeChirp(ctx, d + 0.1, f1 + 300, f2 + 200, 0.03, dest)
        extraNodes.push(...c2.nodes)
      }
    }, 3000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(chirpTimer) } }
  },
  "space-ambient": (ctx, dest) => {
    const n = noiseSource(ctx, "pink", 0.04, dest, { type: "bandpass", freq: 200, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4)
    const m = lfoModulate(ctx, 0.03, 0.03, n.gain.gain)
    const drone = ctx.createOscillator()
    const droneGain = ctx.createGain()
    drone.type = "sine"
    drone.frequency.setValueAtTime(60, ctx.currentTime)
    droneGain.gain.setValueAtTime(0.03, ctx.currentTime)
    drone.connect(droneGain)
    droneGain.connect(dest)
    drone.start()
    const drone2 = ctx.createOscillator()
    const drone2Gain = ctx.createGain()
    drone2.type = "sine"
    drone2.frequency.setValueAtTime(72, ctx.currentTime)
    drone2Gain.gain.setValueAtTime(0.015, ctx.currentTime)
    drone2.connect(drone2Gain)
    drone2Gain.connect(dest)
    drone2.start()
    const m2 = lfoModulate(ctx, 0.01, 0.02, droneGain.gain)
    return { nodes: [...n.nodes, ...m.nodes, drone, droneGain, drone2, drone2Gain, ...m2.nodes] }
  },
  "fan-sleep": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.08, dest, { type: "lowpass", freq: 1500, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 6, 0.02, n.gain.gain)
    return { nodes: [...n.nodes, ...m.nodes] }
  },
  "clock-ticking": (ctx, dest) => {
    const active = { current: true }
    const tickTimer = setInterval(() => {
      if (!active.current) { clearInterval(tickTimer); return }
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "triangle"
      osc.frequency.setValueAtTime(1000, now)
      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01)
      osc.connect(gain)
      gain.connect(dest)
      osc.start(now)
      osc.stop(now + 0.01)
      extraNodes.push(osc, gain)
    }, 1000)
    const extraNodes: AudioNode[] = []
    return { nodes: [], cleanup: () => { active.current = false; clearInterval(tickTimer) } }
  },
  "night-crickets": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.02, dest, { type: "lowpass", freq: 300, Q: 0.5 })
    const active = { current: true }
    const cricketTimer = setInterval(() => {
      if (!active.current) { clearInterval(cricketTimer); return }
      const d = Math.random() * 0.3
      for (let i = 0; i < 4; i++) {
        const c = makeChirp(ctx, d + i * 0.06, 4200 + Math.random() * 800, 4400 + Math.random() * 600, 0.015, dest)
        extraNodes.push(...c.nodes)
      }
    }, 1500)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(cricketTimer) } }
  },
  "thunder-distant": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.06, dest, { type: "lowpass", freq: 150, Q: 1.0 })
    n.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.02, 0.05, n.gain.gain)
    const active = { current: true }
    const thunderTimer = setInterval(() => {
      if (!active.current) { clearInterval(thunderTimer); return }
      const delay = Math.random() * 4
      const r = makeRumble(ctx, delay, 0.1 + Math.random() * 0.2, dest)
      extraNodes.push(...r.nodes)
      if (Math.random() < 0.3) {
        const r2 = makeRumble(ctx, delay + 0.5 + Math.random(), 0.06, dest)
        extraNodes.push(...r2.nodes)
      }
    }, 10000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(thunderTimer) } }
  },
  "whisper-soft": (ctx, dest) => {
    const n = noiseSource(ctx, "pink", 0.05, dest, { type: "bandpass", freq: 1500, Q: 1.5 })
    n.gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.3, 0.03, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.02, dest, { type: "bandpass", freq: 3500, Q: 3.0 })
    n2.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 3)
    const m2 = lfoModulate(ctx, 0.6, 0.015, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  "whisper-breathy": (ctx, dest) => {
    const n = noiseSource(ctx, "pink", 0.04, dest, { type: "bandpass", freq: 600, Q: 1.2 })
    n.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 4)
    const m = lfoModulate(ctx, 0.15, 0.025, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.015, dest, { type: "bandpass", freq: 2500, Q: 4.0 })
    n2.gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 4)
    const m2 = lfoModulate(ctx, 0.4, 0.01, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  "tapping-gentle": (ctx, dest) => {
    const active = { current: true }
    const tapTimer = setInterval(() => {
      if (!active.current) { clearInterval(tapTimer); return }
      const d = Math.random() * 0.3
      const freq = 800 + Math.random() * 1200
      const c = makeClick(ctx, d, freq, 0.03, dest)
      extraNodes.push(...c.nodes)
      if (Math.random() < 0.35) {
        const c2 = makeClick(ctx, d + 0.05 + Math.random() * 0.1, freq * 1.2, 0.02, dest)
        extraNodes.push(...c2.nodes)
      }
    }, 1200)
    const n = noiseSource(ctx, "white", 0.008, dest, { type: "highpass", freq: 4000, Q: 0.5 })
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(tapTimer) } }
  },
  "tapping-chalkboard": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.02, dest, { type: "bandpass", freq: 3000, Q: 3.0 })
    n.gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 2.0, 0.01, n.gain.gain)
    const active = { current: true }
    const chalkTimer = setInterval(() => {
      if (!active.current) { clearInterval(chalkTimer); return }
      const d = Math.random() * 0.5
      const n2 = noiseSource(ctx, "white", 0.025, dest, { type: "bandpass", freq: 2000 + Math.random() * 2000, Q: 4.0 })
      const g = n2.gain
      if (g) { g.gain.setValueAtTime(0.03, ctx.currentTime + d); g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.2 + Math.random() * 0.3) }
      extraNodes.push(...n2.nodes)
    }, 1500)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(chalkTimer) } }
  },
  "pages-turning": (ctx, dest) => {
    const active = { current: true }
    const pageTimer = setInterval(() => {
      if (!active.current) { clearInterval(pageTimer); return }
      const d = Math.random() * 1.5
      const buf = createNoiseBuffer(ctx, "white", 0.15)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.setValueAtTime(2500 + Math.random() * 1000, ctx.currentTime + d)
      filter.Q.setValueAtTime(2.0, ctx.currentTime + d)
      gain.gain.setValueAtTime(0, ctx.currentTime + d)
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + d + 0.02)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.12)
      src.connect(filter)
      filter.connect(gain)
      gain.connect(dest)
      src.start(ctx.currentTime + d)
      extraNodes.push(src, filter, gain)
    }, 4000)
    const n = noiseSource(ctx, "brown", 0.01, dest, { type: "lowpass", freq: 200, Q: 0.5 })
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(pageTimer) } }
  },
  "crinkling-paper": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.03, dest, { type: "bandpass", freq: 4000, Q: 2.0 })
    n.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 8.0, 0.025, n.gain.gain)
    const active = { current: true }
    const crinkleTimer = setInterval(() => {
      if (!active.current) { clearInterval(crinkleTimer); return }
      if (Math.random() < 0.3) {
        const c = makeCrackle(ctx, Math.random() * 0.2, 0.03 + Math.random() * 0.04, dest)
        extraNodes.push(...c.nodes)
      }
    }, 900)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(crinkleTimer) } }
  },
  "crinkling-cellophane": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.04, dest, { type: "highpass", freq: 5000, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 12.0, 0.03, n.gain.gain)
    const active = { current: true }
    const crinkleTimer = setInterval(() => {
      if (!active.current) { clearInterval(crinkleTimer); return }
      if (Math.random() < 0.35) {
        const c = makeCrackle(ctx, Math.random() * 0.15, 0.04 + Math.random() * 0.05, dest)
        extraNodes.push(...c.nodes)
      }
    }, 600)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(crinkleTimer) } }
  },
  "scratching-fabric": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.03, dest, { type: "bandpass", freq: 400, Q: 1.5 })
    n.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.8, 0.02, n.gain.gain)
    const active = { current: true }
    const scratchTimer = setInterval(() => {
      if (!active.current) { clearInterval(scratchTimer); return }
      if (Math.random() < 0.25) {
        const n2 = noiseSource(ctx, "white", 0.025, dest, { type: "bandpass", freq: 1500 + Math.random() * 1500, Q: 3.0 })
        const g = n2.gain
        if (g) { g.gain.setValueAtTime(0.025, ctx.currentTime); g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2 + Math.random() * 0.4) }
        extraNodes.push(...n2.nodes)
      }
    }, 1000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(scratchTimer) } }
  },
  "rain-on-glass": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.06, dest, { type: "highpass", freq: 4000, Q: 0.8 })
    n.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.6, 0.05, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.03, dest, { type: "bandpass", freq: 6000, Q: 1.5 })
    n2.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const m2 = lfoModulate(ctx, 0.3, 0.03, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  "rain-on-leaves": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.05, dest, { type: "bandpass", freq: 2500, Q: 0.6 })
    n.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.5, 0.04, n.gain.gain)
    const n2 = noiseSource(ctx, "brown", 0.03, dest, { type: "lowpass", freq: 400, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes] }
  },
  "rain-on-tent": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.07, dest, { type: "lowpass", freq: 3000, Q: 0.4 })
    n.gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.4, 0.04, n.gain.gain)
    const n2 = noiseSource(ctx, "brown", 0.02, dest, { type: "lowpass", freq: 200, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes] }
  },
  "rain-on-car": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.1, dest, { type: "bandpass", freq: 1500, Q: 1.2 })
    n.gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.3, 0.06, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.04, dest, { type: "highpass", freq: 5000, Q: 0.3 })
    n2.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)
    const m2 = lfoModulate(ctx, 0.5, 0.03, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  "glass-fruit-slicing": (ctx, dest) => {
    const active = { current: true }
    const sliceTimer = setInterval(() => {
      if (!active.current) { clearInterval(sliceTimer); return }
      const d = Math.random() * 1.5
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(3000 + Math.random() * 2000, ctx.currentTime + d)
      gain.gain.setValueAtTime(0, ctx.currentTime + d)
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + d + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.15)
      osc.connect(gain)
      gain.connect(dest)
      osc.start(ctx.currentTime + d)
      osc.stop(ctx.currentTime + d + 0.15)
      extraNodes.push(osc, gain)
      const buf = createNoiseBuffer(ctx, "white", 0.08)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const g2 = ctx.createGain()
      const f = ctx.createBiquadFilter()
      f.type = "highpass"
      f.frequency.setValueAtTime(4000, ctx.currentTime + d)
      f.Q.setValueAtTime(0.5, ctx.currentTime + d)
      g2.gain.setValueAtTime(0.06, ctx.currentTime + d)
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.08)
      src.connect(f)
      f.connect(g2)
      g2.connect(dest)
      src.start(ctx.currentTime + d)
      extraNodes.push(src, f, g2)
    }, 2000)
    const n = noiseSource(ctx, "pink", 0.01, dest, { type: "lowpass", freq: 200, Q: 0.5 })
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(sliceTimer) } }
  },
  "soap-carving": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.03, dest, { type: "bandpass", freq: 800, Q: 1.5 })
    n.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.6, 0.02, n.gain.gain)
    const active = { current: true }
    const carveTimer = setInterval(() => {
      if (!active.current) { clearInterval(carveTimer); return }
      if (Math.random() < 0.35) {
        const d = Math.random() * 0.5
        const buf = createNoiseBuffer(ctx, "white", 0.1)
        const src = ctx.createBufferSource()
        src.buffer = buf
        const g = ctx.createGain()
        const f = ctx.createBiquadFilter()
        f.type = "bandpass"
        f.frequency.setValueAtTime(1000 + Math.random() * 800, ctx.currentTime + d)
        f.Q.setValueAtTime(3.0, ctx.currentTime + d)
        g.gain.setValueAtTime(0, ctx.currentTime + d)
        g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + d + 0.02)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.15 + Math.random() * 0.15)
        src.connect(f)
        f.connect(g)
        g.connect(dest)
        src.start(ctx.currentTime + d)
        extraNodes.push(src, f, g)
      }
    }, 1200)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(carveTimer) } }
  },
  "glass-clink": (ctx, dest) => {
    const active = { current: true }
    const clinkTimer = setInterval(() => {
      if (!active.current) { clearInterval(clinkTimer); return }
      if (Math.random() < 0.4) {
        const d = Math.random() * 2.0
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(3500 + Math.random() * 1500, ctx.currentTime + d)
        gain.gain.setValueAtTime(0, ctx.currentTime + d)
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + d + 0.002)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.25)
        osc.connect(gain)
        gain.connect(dest)
        osc.start(ctx.currentTime + d)
        osc.stop(ctx.currentTime + d + 0.3)
        extraNodes.push(osc, gain)
        if (Math.random() < 0.3) {
          const osc2 = ctx.createOscillator()
          const g2 = ctx.createGain()
          osc2.type = "sine"
          osc2.frequency.setValueAtTime(5000 + Math.random() * 1000, ctx.currentTime + d + 0.02)
          g2.gain.setValueAtTime(0.03, ctx.currentTime + d + 0.02)
          g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.15)
          osc2.connect(g2)
          g2.connect(dest)
          osc2.start(ctx.currentTime + d + 0.02)
          osc2.stop(ctx.currentTime + d + 0.2)
          extraNodes.push(osc2, g2)
        }
      }
    }, 1800)
    const extraNodes: AudioNode[] = []
    return { nodes: [], cleanup: () => { active.current = false; clearInterval(clinkTimer) } }
  },
  "glass-shatter": (ctx, dest) => {
    const active = { current: true }
    const shatterTimer = setInterval(() => {
      if (!active.current) { clearInterval(shatterTimer); return }
      const d = Math.random() * 5.0
      const count = 5 + Math.floor(Math.random() * 8)
      for (let i = 0; i < count; i++) {
        const offset = d + i * 0.015 + Math.random() * 0.01
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(2000 + Math.random() * 4000, ctx.currentTime + offset)
        gain.gain.setValueAtTime(0, ctx.currentTime + offset)
        gain.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.04, ctx.currentTime + offset + 0.002)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.08 + Math.random() * 0.12)
        osc.connect(gain)
        gain.connect(dest)
        osc.start(ctx.currentTime + offset)
        osc.stop(ctx.currentTime + offset + 0.2)
        extraNodes.push(osc, gain)
      }
      const buf = createNoiseBuffer(ctx, "white", 0.08)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const g = ctx.createGain()
      const f = ctx.createBiquadFilter()
      f.type = "highpass"
      f.frequency.setValueAtTime(5000, ctx.currentTime + d)
      f.Q.setValueAtTime(0.5, ctx.currentTime + d)
      g.gain.setValueAtTime(0.07, ctx.currentTime + d)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.15)
      src.connect(f)
      f.connect(g)
      g.connect(dest)
      src.start(ctx.currentTime + d)
      extraNodes.push(src, f, g)
    }, 6000)
    const extraNodes: AudioNode[] = []
    return { nodes: [], cleanup: () => { active.current = false; clearInterval(shatterTimer) } }
  },
  "thunderstorm-sleep": (ctx, dest) => {
    const n1 = noiseSource(ctx, "white", 0.1, dest, { type: "highpass", freq: 1800, Q: 0.4 })
    n1.gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 3)
    const n2 = noiseSource(ctx, "white", 0.04, dest, { type: "highpass", freq: 5000, Q: 0.3 })
    n2.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.2, 0.04, n1.gain.gain)
    const active = { current: true }
    const thunderTimer = setInterval(() => {
      if (!active.current) { clearInterval(thunderTimer); return }
      if (Math.random() < 0.3) {
        const delay = Math.random() * 4
        const r = makeRumble(ctx, delay, 0.12 + Math.random() * 0.12, dest)
        extraNodes.push(...r.nodes)
      }
    }, 8000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n1.nodes, ...n2.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(thunderTimer) } }
  },
  "ocean-sleep": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.08, dest, { type: "lowpass", freq: 400, Q: 0.3 })
    n.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 4)
    const m = lfoModulate(ctx, 0.04, 0.07, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.02, dest, { type: "bandpass", freq: 2500, Q: 0.3 })
    n2.gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 4)
    const m2 = lfoModulate(ctx, 0.06, 0.015, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  "face-scratching": (ctx, dest) => {
    const n = noiseSource(ctx, "pink", 0.02, dest, { type: "bandpass", freq: 600, Q: 1.5 })
    n.gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.3, 0.015, n.gain.gain)
    const active = { current: true }
    const traceTimer = setInterval(() => {
      if (!active.current) { clearInterval(traceTimer); return }
      if (Math.random() < 0.3) {
        const d = Math.random() * 1.0
        const buf = createNoiseBuffer(ctx, "white", 0.12)
        const src = ctx.createBufferSource()
        src.buffer = buf
        const g = ctx.createGain()
        const f = ctx.createBiquadFilter()
        f.type = "bandpass"
        f.frequency.setValueAtTime(2000 + Math.random() * 2000, ctx.currentTime + d)
        f.Q.setValueAtTime(4.0, ctx.currentTime + d)
        g.gain.setValueAtTime(0, ctx.currentTime + d)
        g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + d + 0.03)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.3 + Math.random() * 0.4)
        src.connect(f)
        f.connect(g)
        g.connect(dest)
        src.start(ctx.currentTime + d)
        extraNodes.push(src, f, g)
      }
      if (Math.random() < 0.15) {
        const d = Math.random() * 1.5
        const osc = ctx.createOscillator()
        const g2 = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(200 + Math.random() * 100, ctx.currentTime + d)
        g2.gain.setValueAtTime(0, ctx.currentTime + d)
        g2.gain.linearRampToValueAtTime(0.02, ctx.currentTime + d + 0.1)
        g2.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.8)
        osc.connect(g2)
        g2.connect(dest)
        osc.start(ctx.currentTime + d)
        osc.stop(ctx.currentTime + d + 1.0)
        extraNodes.push(osc, g2)
      }
    }, 1500)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(traceTimer) } }
  },
  "rain-rooftop": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.08, dest, { type: "bandpass", freq: 800, Q: 1.5 })
    n.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.3, 0.04, n.gain.gain)
    const n2 = noiseSource(ctx, "brown", 0.03, dest, { type: "lowpass", freq: 200, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes] }
  },
  "rain-forest-canopy": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.04, dest, { type: "bandpass", freq: 3000, Q: 0.8 })
    n.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.4, 0.03, n.gain.gain)
    const n2 = noiseSource(ctx, "brown", 0.02, dest, { type: "lowpass", freq: 350, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2)
    const active = { current: true }
    const dripTimer = setInterval(() => {
      if (!active.current) { clearInterval(dripTimer); return }
      if (Math.random() < 0.15) {
        const d = Math.random() * 1.0
        const buf = createNoiseBuffer(ctx, "white", 0.04)
        const src = ctx.createBufferSource()
        src.buffer = buf
        const g = ctx.createGain()
        const f = ctx.createBiquadFilter()
        f.type = "lowpass"; f.frequency.setValueAtTime(800, ctx.currentTime + d)
        g.gain.setValueAtTime(0, ctx.currentTime + d)
        g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + d + 0.01)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.15)
        src.connect(f); f.connect(g); g.connect(dest)
        src.start(ctx.currentTime + d)
        extraNodes.push(src, f, g)
      }
    }, 2000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(dripTimer) } }
  },
  "thunder-close": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.08, dest, { type: "lowpass", freq: 250, Q: 1.2 })
    n.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.04, 0.06, n.gain.gain)
    const active = { current: true }
    const thunderTimer = setInterval(() => {
      if (!active.current) { clearInterval(thunderTimer); return }
      const delay = Math.random() * 5
      const r = makeRumble(ctx, delay, 0.25 + Math.random() * 0.2, dest)
      extraNodes.push(...r.nodes)
      if (Math.random() < 0.4) {
        const r2 = makeRumble(ctx, delay + 0.15, 0.15, dest)
        extraNodes.push(...r2.nodes)
      }
    }, 7000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(thunderTimer) } }
  },
  "ocean-cave": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.08, dest, { type: "lowpass", freq: 350, Q: 0.3 })
    n.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.03, 0.08, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.02, dest, { type: "bandpass", freq: 700, Q: 2.0 })
    n2.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 3)
    const m2 = lfoModulate(ctx, 0.04, 0.02, n2.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes, ...m2.nodes] }
  },
  "ocean-night": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.05, dest, { type: "lowpass", freq: 300, Q: 0.3 })
    n.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4)
    const m = lfoModulate(ctx, 0.03, 0.05, n.gain.gain)
    const n2 = noiseSource(ctx, "pink", 0.015, dest, { type: "lowpass", freq: 500, Q: 0.3 })
    n2.gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 4)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes] }
  },
  "river-gentle": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.04, dest, { type: "bandpass", freq: 800, Q: 1.0 })
    n.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.25, 0.03, n.gain.gain)
    const n2 = noiseSource(ctx, "pink", 0.02, dest, { type: "lowpass", freq: 400, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes] }
  },
  "waterfall-large": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.2, dest, { type: "lowpass", freq: 600, Q: 0.3 })
    n.gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 3)
    const n2 = noiseSource(ctx, "pink", 0.1, dest, { type: "lowpass", freq: 250, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.5, 0.05, n.gain.gain)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes] }
  },
  "fireplace-old": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.06, dest, { type: "lowpass", freq: 400, Q: 0.7 })
    n.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2)
    const active = { current: true }
    const crackleTimer = setInterval(() => {
      if (!active.current) { clearInterval(crackleTimer); return }
      if (Math.random() < 0.6) {
        const c = makeCrackle(ctx, Math.random() * 0.3, 0.04 + Math.random() * 0.08, dest)
        extraNodes.push(...c.nodes)
      }
    }, 500)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(crackleTimer) } }
  },
  "campfire-beach": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.05, dest, { type: "bandpass", freq: 250, Q: 0.6 })
    n.gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2)
    const n2 = noiseSource(ctx, "white", 0.015, dest, { type: "highpass", freq: 3000, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 2)
    const ocean = noiseSource(ctx, "brown", 0.04, dest, { type: "lowpass", freq: 500, Q: 0.3 })
    ocean.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3)
    const om = lfoModulate(ctx, 0.07, 0.03, ocean.gain.gain)
    const active = { current: true }
    const crackleTimer = setInterval(() => {
      if (!active.current) { clearInterval(crackleTimer); return }
      if (Math.random() < 0.3) {
        const c = makeCrackle(ctx, Math.random() * 0.2, 0.03 + Math.random() * 0.04, dest)
        extraNodes.push(...c.nodes)
      }
    }, 1200)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...n2.nodes, ...ocean.nodes, ...om.nodes], cleanup: () => { active.current = false; clearInterval(crackleTimer) } }
  },
  "wind-winter": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.06, dest, { type: "bandpass", freq: 3500, Q: 0.3 })
    n.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.06, 0.04, n.gain.gain)
    const whistle = ctx.createOscillator()
    const wGain = ctx.createGain()
    whistle.type = "sine"
    whistle.frequency.setValueAtTime(4500, ctx.currentTime)
    wGain.gain.setValueAtTime(0.01, ctx.currentTime)
    const wMod = lfoModulate(ctx, 0.08, 0.008, wGain.gain)
    const wFreqMod = ctx.createOscillator()
    const wFreqGain = ctx.createGain()
    wFreqMod.type = "sine"; wFreqMod.frequency.setValueAtTime(0.04, ctx.currentTime)
    wFreqGain.gain.setValueAtTime(600, ctx.currentTime)
    wFreqMod.connect(wFreqGain); wFreqGain.connect(whistle.frequency)
    wFreqMod.start(); whistle.connect(wGain); wGain.connect(dest); whistle.start()
    return { nodes: [...n.nodes, ...m.nodes, whistle, wGain, wFreqMod, wFreqGain, ...wMod.nodes] }
  },
  "forest-deep": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.04, dest, { type: "lowpass", freq: 200, Q: 1.0 })
    n.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3)
    const active = { current: true }
    const hootTimer = setInterval(() => {
      if (!active.current) { clearInterval(hootTimer); return }
      if (Math.random() < 0.12) {
        const d = Math.random() * 2
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(200 + Math.random() * 100, ctx.currentTime + d)
        osc.frequency.linearRampToValueAtTime(180 + Math.random() * 80, ctx.currentTime + d + 0.5)
        g.gain.setValueAtTime(0, ctx.currentTime + d)
        g.gain.linearRampToValueAtTime(0.02, ctx.currentTime + d + 0.1)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.6)
        osc.connect(g); g.connect(dest)
        osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.7)
        extraNodes.push(osc, g)
      }
    }, 4000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(hootTimer) } }
  },
  "cafe-rainy": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.03, dest, { type: "bandpass", freq: 1200, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const rain = noiseSource(ctx, "white", 0.03, dest, { type: "highpass", freq: 4000, Q: 0.5 })
    rain.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const active = { current: true }
    const clatterTimer = setInterval(() => {
      if (!active.current) { clearInterval(clatterTimer); return }
      if (Math.random() < 0.2) {
        const c = makeCrackle(ctx, Math.random() * 0.5, 0.025 + Math.random() * 0.02, dest)
        extraNodes.push(...c.nodes)
      }
    }, 2000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...rain.nodes], cleanup: () => { active.current = false; clearInterval(clatterTimer) } }
  },
  "library-fireplace": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.02, dest, { type: "lowpass", freq: 250, Q: 1.0 })
    n.gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2)
    const fire = noiseSource(ctx, "brown", 0.04, dest, { type: "lowpass", freq: 400, Q: 0.7 })
    fire.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)
    const active = { current: true }
    const crackleTimer = setInterval(() => {
      if (!active.current) { clearInterval(crackleTimer); return }
      if (Math.random() < 0.3) {
        const c = makeCrackle(ctx, Math.random() * 0.3, 0.03 + Math.random() * 0.04, dest)
        extraNodes.push(...c.nodes)
      }
    }, 1000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...fire.nodes], cleanup: () => { active.current = false; clearInterval(crackleTimer) } }
  },
  "keyboard-laptop": (ctx, dest) => {
    const active = { current: true }
    const clickTimer = setInterval(() => {
      if (!active.current) { clearInterval(clickTimer); return }
      const d = Math.random() * 0.2
      const c = makeClick(ctx, d, 600 + Math.random() * 200, 0.03, dest)
      extraNodes.push(...c.nodes)
    }, 350)
    const n = noiseSource(ctx, "white", 0.005, dest, { type: "bandpass", freq: 2000, Q: 0.5 })
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(clickTimer) } }
  },
  "writing-pencil": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.015, dest, { type: "bandpass", freq: 5000, Q: 5.0 })
    n.gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 1.2, 0.01, n.gain.gain)
    const active = { current: true }
    const scratchTimer = setInterval(() => {
      if (!active.current) { clearInterval(scratchTimer); return }
      if (Math.random() < 0.25) {
        const n2 = noiseSource(ctx, "white", 0.015, dest, { type: "bandpass", freq: 4500 + Math.random() * 1500, Q: 4.0 })
        const g = n2.gain
        if (g) { g.gain.setValueAtTime(0.02, ctx.currentTime); g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2 + Math.random() * 0.2) }
        extraNodes.push(...n2.nodes)
      }
    }, 800)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(scratchTimer) } }
  },
  "city-rain": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.04, dest, { type: "lowpass", freq: 400, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)
    const rain = noiseSource(ctx, "white", 0.03, dest, { type: "highpass", freq: 4000, Q: 0.5 })
    rain.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.15, 0.02, n.gain.gain)
    const active = { current: true }
    const carTimer = setInterval(() => {
      if (!active.current) { clearInterval(carTimer); return }
      if (Math.random() < 0.08) {
        const r = makeRumble(ctx, 0, 0.03, dest)
        extraNodes.push(...r.nodes)
      }
    }, 5000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...rain.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(carTimer) } }
  },
  "train-subway": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.1, dest, { type: "bandpass", freq: 250, Q: 1.5 })
    n.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 0.6, 0.05, n.gain.gain)
    const n2 = noiseSource(ctx, "white", 0.015, dest, { type: "highpass", freq: 3000, Q: 0.3 })
    const active = { current: true }
    const trackTimer = setInterval(() => {
      if (!active.current) { clearInterval(trackTimer); return }
      const d = Math.random() * 0.1
      for (let i = 0; i < 3; i++) {
        const c = makeClick(ctx, d + i * 0.04, 800 + Math.random() * 400, 0.025 - i * 0.005, dest)
        extraNodes.push(...c.nodes)
      }
    }, 500)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(trackTimer) } }
  },
  "blue-noise": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.06, dest, { type: "highpass", freq: 6000, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1)
    return { nodes: n.nodes }
  },
  "birds-tropical": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.008, dest, { type: "highpass", freq: 4000, Q: 0.5 })
    const active = { current: true }
    const chirpTimer = setInterval(() => {
      if (!active.current) { clearInterval(chirpTimer); return }
      const d = Math.random() * 1.0
      const count = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        const f1 = 2000 + Math.random() * 3000
        const f2 = f1 + 1000 + Math.random() * 2000
        const c = makeChirp(ctx, d + i * 0.15, f1, f2, 0.04 + Math.random() * 0.03, dest)
        extraNodes.push(...c.nodes)
      }
    }, 2500)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(chirpTimer) } }
  },
  "birds-seabirds": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.005, dest, { type: "highpass", freq: 2000, Q: 0.5 })
    const active = { current: true }
    const callTimer = setInterval(() => {
      if (!active.current) { clearInterval(callTimer); return }
      if (Math.random() < 0.3) {
        const d = Math.random() * 3.0
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(2000, ctx.currentTime + d)
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + d + 0.8)
        g.gain.setValueAtTime(0, ctx.currentTime + d)
        g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + d + 0.05)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 1.0)
        osc.connect(g); g.connect(dest)
        osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 1.2)
        extraNodes.push(osc, g)
      }
    }, 4000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(callTimer) } }
  },
  "space-drone": (ctx, dest) => {
    const n = noiseSource(ctx, "pink", 0.03, dest, { type: "bandpass", freq: 150, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 4)
    const oscs: AudioNode[] = []
    const baseFreqs = [40, 52, 68, 85]
    for (const f of baseFreqs) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(f, ctx.currentTime)
      g.gain.setValueAtTime(0.015, ctx.currentTime)
      const detune = ctx.createOscillator()
      const dGain = ctx.createGain()
      detune.type = "sine"; detune.frequency.setValueAtTime(0.02 + Math.random() * 0.03, ctx.currentTime)
      dGain.gain.setValueAtTime(5 + Math.random() * 10, ctx.currentTime)
      detune.connect(dGain); dGain.connect(osc.frequency)
      detune.start()
      osc.connect(g); g.connect(dest); osc.start()
      oscs.push(osc, g, detune, dGain)
    }
    return { nodes: [...n.nodes, ...oscs] }
  },
  "fan-box": (ctx, dest) => {
    const n = noiseSource(ctx, "white", 0.1, dest, { type: "lowpass", freq: 1000, Q: 0.4 })
    n.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 5, 0.025, n.gain.gain)
    const n2 = noiseSource(ctx, "brown", 0.04, dest, { type: "lowpass", freq: 150, Q: 0.5 })
    n2.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)
    return { nodes: [...n.nodes, ...n2.nodes, ...m.nodes] }
  },
  "clock-alarm": (ctx, dest) => {
    const active = { current: true }
    const alarmTimer = setInterval(() => {
      if (!active.current) { clearInterval(alarmTimer); return }
      const now = ctx.currentTime
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(1600 + i * 200, now + i * 0.12)
        g.gain.setValueAtTime(0, now + i * 0.12)
        g.gain.linearRampToValueAtTime(0.05, now + i * 0.12 + 0.005)
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1)
        osc.connect(g); g.connect(dest)
        osc.start(now + i * 0.12); osc.stop(now + i * 0.12 + 0.12)
        extraNodes.push(osc, g)
      }
    }, 2000)
    const extraNodes: AudioNode[] = []
    return { nodes: [], cleanup: () => { active.current = false; clearInterval(alarmTimer) } }
  },
  "night-owls": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.03, dest, { type: "lowpass", freq: 250, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 3)
    const active = { current: true }
    const hootTimer = setInterval(() => {
      if (!active.current) { clearInterval(hootTimer); return }
      if (Math.random() < 0.2) {
        const d = Math.random() * 3.0
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = "sawtooth"
        const f = 200 + Math.random() * 150
        osc.frequency.setValueAtTime(f, ctx.currentTime + d)
        osc.frequency.linearRampToValueAtTime(f - 30, ctx.currentTime + d + 0.3)
        osc.frequency.linearRampToValueAtTime(f, ctx.currentTime + d + 0.6)
        const filter = ctx.createBiquadFilter()
        filter.type = "lowpass"; filter.frequency.setValueAtTime(600, ctx.currentTime + d)
        g.gain.setValueAtTime(0, ctx.currentTime + d)
        g.gain.linearRampToValueAtTime(0.025, ctx.currentTime + d + 0.05)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.7)
        osc.connect(filter); filter.connect(g); g.connect(dest)
        osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.8)
        extraNodes.push(osc, filter, g)
      }
    }, 5000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(hootTimer) } }
  },
  "night-windchimes": (ctx, dest) => {
    const active = { current: true }
    const chimeTimer = setInterval(() => {
      if (!active.current) { clearInterval(chimeTimer); return }
      if (Math.random() < 0.2) {
        const d = Math.random() * 4.0
        const count = 1 + Math.floor(Math.random() * 3)
        for (let i = 0; i < count; i++) {
          const osc = ctx.createOscillator()
          const g = ctx.createGain()
          osc.type = "sine"
          osc.frequency.setValueAtTime(2000 + Math.random() * 3000, ctx.currentTime + d + i * 0.08)
          g.gain.setValueAtTime(0, ctx.currentTime + d + i * 0.08)
          g.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.02, ctx.currentTime + d + i * 0.08 + 0.002)
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + i * 0.08 + 1.5 + Math.random() * 1.0)
          osc.connect(g); g.connect(dest)
          osc.start(ctx.currentTime + d + i * 0.08); osc.stop(ctx.currentTime + d + i * 0.08 + 3)
          extraNodes.push(osc, g)
        }
      }
    }, 3000)
    const extraNodes: AudioNode[] = []
    return { nodes: [], cleanup: () => { active.current = false; clearInterval(chimeTimer) } }
  },
  "snow-falling": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.03, dest, { type: "lowpass", freq: 300, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3)
    const m = lfoModulate(ctx, 0.15, 0.02, n.gain.gain)
    return { nodes: [...n.nodes, ...m.nodes] }
  },
  "cabin-porch": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.04, dest, { type: "lowpass", freq: 400, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)
    const active = { current: true }
    const creakTimer = setInterval(() => {
      if (!active.current) { clearInterval(creakTimer); return }
      if (Math.random() < 0.1) {
        const d = Math.random() * 2.0
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(200, ctx.currentTime + d)
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + d + 0.05)
        osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + d + 0.15)
        g.gain.setValueAtTime(0.015, ctx.currentTime + d)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.3)
        osc.connect(g); g.connect(dest)
        osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.4)
        extraNodes.push(osc, g)
      }
    }, 3000)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes], cleanup: () => { active.current = false; clearInterval(creakTimer) } }
  },
  "coffee-machine": (ctx, dest) => {
    const n = noiseSource(ctx, "brown", 0.04, dest, { type: "bandpass", freq: 800, Q: 0.8 })
    n.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)
    const m = lfoModulate(ctx, 2.0, 0.03, n.gain.gain)
    const active = { current: true }
    const gurgleTimer = setInterval(() => {
      if (!active.current) { clearInterval(gurgleTimer); return }
      if (Math.random() < 0.2) {
        const d = Math.random() * 0.5
        const buf = createNoiseBuffer(ctx, "white", 0.06)
        const src = ctx.createBufferSource()
        src.buffer = buf
        const g = ctx.createGain()
        const f = ctx.createBiquadFilter()
        f.type = "bandpass"; f.frequency.setValueAtTime(1200 + Math.random() * 800, ctx.currentTime + d); f.Q.setValueAtTime(2.0, ctx.currentTime + d)
        g.gain.setValueAtTime(0, ctx.currentTime + d)
        g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + d + 0.02)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + d + 0.2)
        src.connect(f); f.connect(g); g.connect(dest)
        src.start(ctx.currentTime + d)
        extraNodes.push(src, f, g)
      }
    }, 1500)
    const extraNodes: AudioNode[] = []
    return { nodes: [...n.nodes, ...m.nodes], cleanup: () => { active.current = false; clearInterval(gurgleTimer) } }
  },
  "heater-hum": (ctx, dest) => {
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(70, ctx.currentTime)
    oscGain.gain.setValueAtTime(0.04, ctx.currentTime)
    const m = lfoModulate(ctx, 0.5, 0.015, oscGain.gain)
    osc.connect(oscGain); oscGain.connect(dest); osc.start()
    const n = noiseSource(ctx, "brown", 0.03, dest, { type: "lowpass", freq: 400, Q: 0.5 })
    n.gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2)
    return { nodes: [osc, oscGain, ...n.nodes, ...m.nodes] }
  },
  "ac-unit": (ctx, dest) => {
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    oscGain.gain.setValueAtTime(0.03, ctx.currentTime)
    const m = lfoModulate(ctx, 3.0, 0.02, oscGain.gain)
    osc.connect(oscGain); oscGain.connect(dest); osc.start()
    const n = noiseSource(ctx, "white", 0.06, dest, { type: "lowpass", freq: 2000, Q: 0.3 })
    n.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2)
    const nm = lfoModulate(ctx, 2.0, 0.025, n.gain.gain)
    return { nodes: [osc, oscGain, ...n.nodes, ...m.nodes, ...nm.nodes] }
  },
}

const MAX_CONCURRENT_SOUNDS = 16

class AsmrAudioEngine {
  private ctx: AudioContext | null = null
  private initialized = false
  private masterGain: GainNode | null = null
  private analyser: AnalyserNode | null = null
  private activeSounds = new Map<string, { gain: GainNode; nodes: AudioNode[]; cleanup?: () => void }>()
  private volumeCache = new Map<string, number>()
  private fadeTimer: ReturnType<typeof setTimeout> | null = null

  async init(): Promise<void> {
    if (this.initialized && this.ctx) {
      try {
        if (this.ctx.state === "suspended") await this.ctx.resume()
      } catch {}
      return
    }
    try {
      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime)
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 256
      this.masterGain.connect(this.analyser)
      this.analyser.connect(this.ctx.destination)
      this.initialized = true
    } catch (e) {
      captureError(e, "AudioContext init failed")
    }
  }

  async destroy(): Promise<void> {
    await this.stopAll()
    this.ctx?.close()
    this.ctx = null
    this.initialized = false
    this.masterGain = null
    this.analyser = null
  }

  private ensureContext(): void {
    if (this.ctx?.state === "suspended" || this.ctx?.state === "interrupted") {
      this.ctx.resume()
    }
  }

  suspend(): void {
    if (this.ctx?.state === "running") this.ctx.suspend()
  }

  resume(): void {
    if (this.ctx?.state === "suspended") this.ctx.resume()
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx!.currentTime + 0.05)
    }
  }

  setSoundVolume(soundId: string, volume: number): void {
    this.volumeCache.set(soundId, volume)
    const active = this.activeSounds.get(soundId)
    if (active) {
      active.gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx!.currentTime + 0.05)
    }
  }

  getSoundVolume(soundId: string): number {
    return this.volumeCache.get(soundId) ?? 0.5
  }

  async playSound(soundId: string, volume: number = 0.5): Promise<void> {
    if (!this.ctx || !this.masterGain) return
    if (this.activeSounds.has(soundId)) return
    if (this.activeSounds.size >= MAX_CONCURRENT_SOUNDS) {
      console.warn(`[Audio] Reached max concurrent sounds (${MAX_CONCURRENT_SOUNDS}). Ignoring "${soundId}".`)
      return
    }

    this.ensureContext()
    this.volumeCache.set(soundId, volume)

    const builder = SOUND_BUILDERS[soundId]
    if (!builder) { console.warn(`[Audio] No builder for "${soundId}"`); return }

    const soundGain = this.ctx.createGain()
    soundGain.gain.setValueAtTime(0, this.ctx.currentTime)
    soundGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 2)
    soundGain.connect(this.masterGain)

    const { nodes, cleanup } = builder(this.ctx, soundGain)

    this.activeSounds.set(soundId, { gain: soundGain, nodes, cleanup })
  }

  async stopSound(soundId: string, fadeOut: boolean = true): Promise<void> {
    const active = this.activeSounds.get(soundId)
    if (!active) return

    if (fadeOut && this.ctx) {
      active.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    active.nodes.forEach((n) => {
      try {
        if (n instanceof OscillatorNode || n instanceof AudioBufferSourceNode) n.stop()
        n.disconnect()
      } catch {}
    })
    active.gain.disconnect()
    if (active.cleanup) active.cleanup()
    this.activeSounds.delete(soundId)
  }

  async stopAll(): Promise<void> {
    const ids = Array.from(this.activeSounds.keys())
    await Promise.all(ids.map((id) => this.stopSound(id, false)))
    this.activeSounds.clear()
  }

  isPlaying(soundId: string): boolean {
    return this.activeSounds.has(soundId)
  }

  getPlayingSounds(): string[] {
    return Array.from(this.activeSounds.keys())
  }

  getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(128).fill(0)
    const data = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(data)
    return data
  }

  setFadeTimer(durationMinutes: number, callback: () => void): void {
    this.cancelFadeTimer()
    this.fadeTimer = setTimeout(() => {
      this.fadeOutAll(30)
      callback()
    }, durationMinutes * 60 * 1000)
  }

  cancelFadeTimer(): void {
    if (this.fadeTimer) { clearTimeout(this.fadeTimer); this.fadeTimer = null }
  }

  async fadeOutAll(durationSeconds: number): Promise<void> {
    if (!this.masterGain) return
    const now = this.ctx!.currentTime
    this.masterGain.gain.linearRampToValueAtTime(0, now + durationSeconds)
    await new Promise((resolve) => setTimeout(resolve, durationSeconds * 1000))
    this.stopAll()
    this.masterGain.gain.setValueAtTime(0.8, this.ctx!.currentTime)
  }
}

export const audioEngine = new AsmrAudioEngine()
