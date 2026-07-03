"use client"

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
  gain.gain.value = amp
  if (filter) {
    const f = ctx.createBiquadFilter()
    f.type = filter.type
    f.frequency.value = filter.freq
    f.Q.value = filter.Q
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
  lfo.frequency.value = freq
  lfoGain.gain.value = amp
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
  osc.frequency.value = freq
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
  filter.frequency.value = 3000
  filter.Q.value = 0.5
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
  filter.frequency.value = 150
  filter.Q.value = 0.5
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
    sweep.frequency.value = 2000
    ctx.createOscillator()
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
    drone.frequency.value = 60
    droneGain.gain.value = 0.03
    drone.connect(droneGain)
    droneGain.connect(dest)
    drone.start()
    const drone2 = ctx.createOscillator()
    const drone2Gain = ctx.createGain()
    drone2.type = "sine"
    drone2.frequency.value = 72
    drone2Gain.gain.value = 0.015
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
      osc.frequency.value = 1000
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
}

class AsmrAudioEngine {
  private ctx: AudioContext | null = null
  private initialized = false
  private masterGain: GainNode | null = null
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
      this.masterGain.gain.value = 0.8
      this.masterGain.connect(this.ctx.destination)
      this.initialized = true
    } catch (e) {
      console.warn("[ASMR Audio] Web Audio API not available", e)
    }
  }

  destroy(): void {
    this.stopAll()
    this.ctx?.close()
    this.ctx = null
    this.initialized = false
    this.masterGain = null
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

    this.ensureContext()
    this.volumeCache.set(soundId, volume)

    const builder = SOUND_BUILDERS[soundId]
    if (!builder) return

    const soundGain = this.ctx.createGain()
    soundGain.gain.value = 0
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
      try { if (n instanceof OscillatorNode || n instanceof AudioBufferSourceNode) n.stop(); n.disconnect() } catch {}
    })
    active.gain.disconnect()
    if (active.cleanup) active.cleanup()
    this.activeSounds.delete(soundId)
  }

  stopAll(): void {
    this.activeSounds.forEach((_, id) => this.stopSound(id, false))
    this.activeSounds.clear()
  }

  isPlaying(soundId: string): boolean {
    return this.activeSounds.has(soundId)
  }

  getPlayingSounds(): string[] {
    return Array.from(this.activeSounds.keys())
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
    this.masterGain.gain.value = 0.8
  }
}

export const audioEngine = new AsmrAudioEngine()
