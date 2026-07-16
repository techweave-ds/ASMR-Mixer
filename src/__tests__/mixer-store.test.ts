import { describe, it, expect, beforeEach } from "vitest"
import { useMixerStore } from "@/store/mixer-store"

describe("MixerStore", () => {
  beforeEach(() => {
    useMixerStore.setState({ layers: [], masterVolume: 0.8, presets: [], activePresetId: null })
  })

  it("adds a layer", () => {
    useMixerStore.getState().addLayer("rain-light")
    expect(useMixerStore.getState().layers).toHaveLength(1)
    expect(useMixerStore.getState().layers[0].soundId).toBe("rain-light")
  })

  it("does not add duplicate layers", () => {
    useMixerStore.getState().addLayer("rain-light")
    useMixerStore.getState().addLayer("rain-light")
    expect(useMixerStore.getState().layers).toHaveLength(1)
  })

  it("removes a layer", () => {
    useMixerStore.getState().addLayer("rain-light")
    useMixerStore.getState().removeLayer("rain-light")
    expect(useMixerStore.getState().layers).toHaveLength(0)
  })

  it("sets layer volume", () => {
    useMixerStore.getState().addLayer("rain-light")
    useMixerStore.getState().setLayerVolume("rain-light", 0.7)
    expect(useMixerStore.getState().layers[0].volume).toBe(0.7)
  })

  it("clamps layer volume", () => {
    useMixerStore.getState().addLayer("rain-light")
    useMixerStore.getState().setLayerVolume("rain-light", 1.5)
    expect(useMixerStore.getState().layers[0].volume).toBe(1)
    useMixerStore.getState().setLayerVolume("rain-light", -0.5)
    expect(useMixerStore.getState().layers[0].volume).toBe(0)
  })

  it("toggles mute", () => {
    useMixerStore.getState().addLayer("rain-light")
    expect(useMixerStore.getState().layers[0].isMuted).toBe(false)
    useMixerStore.getState().toggleMute("rain-light")
    expect(useMixerStore.getState().layers[0].isMuted).toBe(true)
  })

  it("saves and loads a preset", () => {
    useMixerStore.getState().addLayer("rain-light")
    useMixerStore.getState().setLayerVolume("rain-light", 0.5)
    useMixerStore.getState().savePreset("Test Mix")
    const { presets, activePresetId } = useMixerStore.getState()
    expect(presets).toHaveLength(1)
    expect(presets[0].name).toBe("Test Mix")
    expect(activePresetId).toBe(presets[0].id)
  })

  it("sets master volume", () => {
    useMixerStore.getState().setMasterVolume(0.5)
    expect(useMixerStore.getState().masterVolume).toBe(0.5)
  })

  it("resets the mix", () => {
    useMixerStore.getState().addLayer("rain-light")
    useMixerStore.getState().resetMix()
    expect(useMixerStore.getState().layers).toHaveLength(0)
    expect(useMixerStore.getState().masterVolume).toBe(0.8)
  })
})
