import { motion } from 'framer-motion'

/**
 * Dramatic explosion burst.
 * x, y: position. usePercent=true → CSS %, false → px
 * symbol: emoji that flies upward (🎈 / ⭐ / 💦 / 🌈)
 * color: theme color of the burst
 */
export default function BigBurst({ x, y, color, symbol, usePercent = false }) {
  const N = 32
  const cols = ['white', color, '#fbbf24', '#f472b6', '#60a5fa', 'white', color, '#fde68a']

  const posStyle = usePercent
    ? { left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }
    : { left: x,       top: y,       transform: 'translate(-50%,-50%)' }

  return (
    <motion.div className="absolute pointer-events-none z-30" style={posStyle}>

      {/* 1 — Instant white camera-flash */}
      <motion.div className="absolute rounded-full"
        style={{ background: 'white', filter: 'blur(28px)', width: 180, height: 180, left: -90, top: -90 }}
        initial={{ scale: 0.1, opacity: 1 }}
        animate={{ scale: 6,   opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }} />

      {/* 2 — Color energy bloom */}
      <motion.div className="absolute rounded-full"
        style={{ background: color, filter: 'blur(22px)', width: 130, height: 130, left: -65, top: -65 }}
        initial={{ scale: 0.2, opacity: 0.95 }}
        animate={{ scale: 11,  opacity: 0 }}
        transition={{ duration: 0.85, delay: 0.02 }} />

      {/* 3 — Fast white ring */}
      <motion.div className="absolute rounded-full"
        style={{ border: '7px solid white' }}
        initial={{ width: 24,  height: 24,  left: -12,  top: -12,  opacity: 1 }}
        animate={{ width: 320, height: 320, left: -160, top: -160, opacity: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }} />

      {/* 4 — Slow color ring */}
      <motion.div className="absolute rounded-full"
        style={{ border: `5px solid ${color}` }}
        initial={{ width: 40,  height: 40,  left: -20,  top: -20,  opacity: 0.85 }}
        animate={{ width: 440, height: 440, left: -220, top: -220, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.06 }} />

      {/* 5 — Third thin ring, delayed */}
      <motion.div className="absolute rounded-full"
        style={{ border: '2px solid rgba(255,255,255,0.6)' }}
        initial={{ width: 10,  height: 10,  left: -5,   top: -5,   opacity: 1 }}
        animate={{ width: 500, height: 500, left: -250, top: -250, opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.12 }} />

      {/* 6 — 32 particles: varied size, spread far */}
      {Array.from({ length: N }, (_, i) => {
        const angle = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
        const dist  = 90 + Math.random() * 130
        const size  = 5 + Math.random() * 14
        const c     = cols[i % cols.length]
        return (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2, background: c }}
            initial={{ x: 0, y: 0, scale: 2.2, opacity: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 + Math.random() * 0.45, delay: i * 0.007, ease: 'easeOut' }} />
        )
      })}

      {/* 7 — Sparkle symbols spinning outward */}
      {['✦', '✧', '✨', '⚡', '💥', '✦'].map((s, i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
        return (
          <motion.span key={i} className="absolute text-3xl"
            style={{ left: -15, top: -15 }}
            initial={{ x: 0, y: 0, scale: 0.6, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(angle) * 80, y: Math.sin(angle) * 80, scale: 0, opacity: 0, rotate: 480 }}
            transition={{ duration: 0.8, delay: i * 0.055 }} />
        )
      })}

      {/* 8 — Main emoji: huge, shoots straight up */}
      <motion.span className="absolute select-none" style={{ fontSize: 56, left: -28, top: -80 }}
        initial={{ scale: 0.3, opacity: 1, y: 0, rotate: -25 }}
        animate={{ scale: 4.5, opacity: 0, y: -200, rotate: 30 }}
        transition={{ duration: 1.05, ease: [0.15, 0.85, 0.35, 1] }}>
        {symbol}
      </motion.span>

      {/* 9 — Second emoji: right diagonal */}
      <motion.span className="absolute select-none" style={{ fontSize: 40, left: 24, top: -58 }}
        initial={{ scale: 0.4, opacity: 1, y: 0, x: 0 }}
        animate={{ scale: 2.5, opacity: 0, y: -120, x: 90, rotate: -35 }}
        transition={{ duration: 0.9, delay: 0.07 }}>
        {symbol}
      </motion.span>

      {/* 10 — Third emoji: left diagonal */}
      <motion.span className="absolute select-none" style={{ fontSize: 32, left: -58, top: -42 }}
        initial={{ scale: 0.4, opacity: 1, y: 0, x: 0 }}
        animate={{ scale: 2, opacity: 0, y: -90, x: -70, rotate: 40 }}
        transition={{ duration: 0.85, delay: 0.05 }}>
        {symbol}
      </motion.span>

    </motion.div>
  )
}
