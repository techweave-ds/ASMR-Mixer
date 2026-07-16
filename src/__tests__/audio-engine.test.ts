import { describe, it, expect, vi, beforeEach } from "vitest"

const mockAnalyser = {
  fftSize: 256,
  frequencyBinCount: 128,
  getByteFrequencyData: vi.fn((arr: Uint8Array) => arr.fill(128)),
  connect: vi.fn(),
}

const mockGain = () => ({
  gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
  connect: vi.fn(() => mockAnalyser),
  disconnect: vi.fn(),
})

type Ctx = {
  createGain: ReturnType<typeof vi.fn>
  createAnalyser: ReturnType<typeof vi.fn>
  currentTime: number
  state: string
  resume: ReturnType<typeof vi.fn>
  suspend: ReturnType<typeof vi.fn>
  close: ReturnType<typeof vi.fn>
  destination: object
}

let latestCtx: Ctx | null = null

function newMockCtx(): Ctx {
  const ctx: Ctx = {
    createGain: vi.fn(mockGain),
    createAnalyser: vi.fn(() => mockAnalyser),
    currentTime: 0,
    state: "running",
    resume: vi.fn(),
    suspend: vi.fn(),
    close: vi.fn(),
    destination: {},
  }
  latestCtx = ctx
  return ctx
}

vi.stubGlobal("AudioContext", vi.fn(newMockCtx))
vi.stubGlobal("OfflineAudioContext", vi.fn())

describe("AsmrAudioEngine", () => {
  beforeEach(async () => {
    const { audioEngine } = await import("@/audio")
    await audioEngine.destroy()
    latestCtx = null
  })

  it("creates AudioContext and master gain on init", async () => {
    const { audioEngine } = await import("@/audio")
    await audioEngine.init()
    expect(latestCtx).not.toBeNull()
    expect(latestCtx!.createGain).toHaveBeenCalled()
    expect(latestCtx!.createAnalyser).toHaveBeenCalled()
  })

  it("returns frequency data from analyser", async () => {
    const { audioEngine } = await import("@/audio")
    await audioEngine.init()
    const data = audioEngine.getFrequencyData()
    expect(data).toBeInstanceOf(Uint8Array)
    expect(data.length).toBe(128)
  })

  it("handles double init gracefully", async () => {
    const { audioEngine } = await import("@/audio")
    await audioEngine.init()
    const first = latestCtx
    await audioEngine.init()
    expect(latestCtx).toBe(first)
  })

  it("stopAll clears active sounds", async () => {
    const { audioEngine } = await import("@/audio")
    await audioEngine.init()
    await audioEngine.stopAll()
    expect(audioEngine.getPlayingSounds()).toEqual([])
  })

  it("destroy tears down context", async () => {
    const { audioEngine } = await import("@/audio")
    await audioEngine.init()
    const closeFn = latestCtx!.close
    await audioEngine.destroy()
    expect(closeFn).toHaveBeenCalled()
  })
})
