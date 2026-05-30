import { useRef, useCallback } from 'react'

export function useAudio() {
  const ctxRef = useRef(null)

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  const tone = useCallback((freq, type = 'sine', duration = 0.15, vol = 0.22, delay = 0) => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      gain.gain.setValueAtTime(vol, ctx.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + duration)
    } catch (_) {}
  }, [])

  const noise = useCallback((duration = 0.06, vol = 0.35, freq = 800) => {
    try {
      const ctx = getCtx()
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = freq
      src.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      src.start()
    } catch (_) {}
  }, [])

  const playPop = useCallback(() => {
    noise(0.07, 0.4, 700)
    tone(500, 'sine', 0.1, 0.15, 0)
  }, [noise, tone])

  const playSuccess = useCallback(() => {
    tone(523, 'sine', 0.18, 0.2, 0)
    tone(659, 'sine', 0.18, 0.2, 0.11)
    tone(784, 'sine', 0.22, 0.2, 0.22)
  }, [tone])

  const playWrong = useCallback(() => {
    tone(180, 'sawtooth', 0.1, 0.08, 0)
  }, [tone])

  const playCelebration = useCallback(() => {
    const m = [[523,0],[659,.1],[784,.2],[1047,.32],[784,.45],[1047,.56],[1319,.7],[1047,.86]]
    m.forEach(([f, d]) => tone(f, 'sine', 0.22, 0.28, d))
  }, [tone])

  const playLetter = useCallback((letter) => {
    const freq = 320 + (letter.charCodeAt(0) - 97) * 16
    tone(freq, 'sine', 0.08, 0.12, 0)
  }, [tone])

  // Ocean bubble pop
  const playBubble = useCallback(() => {
    tone(800, 'sine', 0.08, 0.15, 0)
    tone(1000, 'sine', 0.06, 0.1, 0.04)
  }, [tone])

  // Water splash
  const playSplash = useCallback(() => {
    noise(0.15, 0.3, 400)
    tone(300, 'sine', 0.2, 0.15, 0)
    tone(200, 'sine', 0.15, 0.1, 0.08)
  }, [noise, tone])

  // Train chug
  const playChug = useCallback(() => {
    noise(0.08, 0.25, 200)
    tone(150, 'sawtooth', 0.12, 0.15, 0)
  }, [noise, tone])

  // Train whistle
  const playWhistle = useCallback(() => {
    tone(1200, 'sine', 0.3, 0.18, 0)
    tone(1440, 'sine', 0.25, 0.15, 0.08)
  }, [tone])

  // Rainbow chime
  const playChime = useCallback(() => {
    tone(1046, 'sine', 0.18, 0.2, 0)
    tone(1319, 'sine', 0.16, 0.18, 0.07)
    tone(1568, 'sine', 0.14, 0.18, 0.14)
  }, [tone])

  const playExplosion = useCallback(() => {
    noise(0.12, 0.55, 300)
    noise(0.08, 0.35, 700)
    tone(180, 'sawtooth', 0.06, 0.3, 0)
    tone(260, 'square',   0.12, 0.25, 0.04)
    tone(80,  'sawtooth', 0.14, 0.28, 0.09)
  }, [noise, tone])

  return {
    playPop, playSuccess, playWrong, playCelebration, playLetter,
    playBubble, playSplash, playChug, playWhistle, playChime, playExplosion,
  }
}
