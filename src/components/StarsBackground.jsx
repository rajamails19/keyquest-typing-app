import { useMemo } from 'react'

/* Six aurora orbs — each uses a different animation + timing so
   they feel alive and independent, never perfectly in sync.        */
const AURORA_ORBS = [
  { x: -8,  y: -12, w: 720, h: 620, color: '#7c3aed', opacity: 0.30, blur: 115, anim: 'auroraFloat',  dur: 26, delay:   0 },
  { x: 62,  y: -18, w: 600, h: 500, color: '#ec4899', opacity: 0.22, blur: 105, anim: 'auroraFloat2', dur: 34, delay: -11 },
  { x: 28,  y:  52, w: 820, h: 620, color: '#4f46e5', opacity: 0.26, blur: 125, anim: 'auroraFloat3', dur: 42, delay: -21 },
  { x: 78,  y:  38, w: 440, h: 380, color: '#06b6d4', opacity: 0.18, blur:  90, anim: 'auroraFloat',  dur: 30, delay:  -6 },
  { x: -5,  y:  62, w: 540, h: 440, color: '#10b981', opacity: 0.15, blur: 100, anim: 'auroraFloat2', dur: 38, delay: -16 },
  { x: 52,  y:  18, w: 340, h: 300, color: '#f59e0b', opacity: 0.11, blur:  80, anim: 'auroraFloat3', dur: 24, delay:  -9 },
]

export default function StarsBackground() {
  const { smallStars, largeStars } = useMemo(() => {
    const smallStars = Array.from({ length: 130 }, (_, i) => ({
      id: i,
      x:        Math.random() * 100,
      y:        Math.random() * 100,
      size:     0.7 + Math.random() * 1.9,
      duration: 2.5 + Math.random() * 4,
      delay:    Math.random() * 6,
    }))
    const largeStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x:        Math.random() * 100,
      y:        Math.random() * 100,
      size:     3.5 + Math.random() * 5,
      duration: 4 + Math.random() * 5,
      delay:    Math.random() * 7,
    }))
    return { smallStars, largeStars }
  }, [])

  return (
    <div className="stars-bg" aria-hidden="true">

      {/* ── Deep space base gradient ─────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 18% -5%, #0e0530 0%, #030014 55%, #06001e 100%)',
        }}
      />

      {/* ── Aurora colour orbs ───────────────────────────────── */}
      {AURORA_ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left:            `${orb.x}%`,
            top:             `${orb.y}%`,
            width:           orb.w,
            height:          orb.h,
            background:      orb.color,
            opacity:         orb.opacity,
            filter:          `blur(${orb.blur}px)`,
            animation:       `${orb.anim} ${orb.dur}s ease-in-out infinite`,
            animationDelay:  `${orb.delay}s`,
            willChange:      'transform',
          }}
        />
      ))}

      {/* ── Small twinkling star field ───────────────────────── */}
      {smallStars.map(s => (
        <div
          key={s.id}
          className="star-particle"
          style={{
            left:       `${s.x}%`,
            top:        `${s.y}%`,
            width:      s.size,
            height:     s.size,
            '--duration': `${s.duration}s`,
            '--delay':    `${s.delay}s`,
          }}
        />
      ))}

      {/* ── Bright feature stars ─────────────────────────────── */}
      {largeStars.map(s => (
        <div
          key={s.id}
          className="star-large"
          style={{
            left:       `${s.x}%`,
            top:        `${s.y}%`,
            width:      s.size,
            height:     s.size,
            '--duration': `${s.duration}s`,
            '--delay':    `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
