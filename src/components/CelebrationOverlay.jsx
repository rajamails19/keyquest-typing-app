import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

const FLOATING = ['⭐', '🌟', '✨', '🎉', '🎈', '💫', '🎊', '🌈']

export default function CelebrationOverlay({ onComplete }) {
  useEffect(() => {
    // Launch confetti bursts
    const fire = (particleRatio, opts) => {
      confetti({
        origin: { y: 0.6 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      })
    }

    const burst = () => {
      fire(0.25, { spread: 26, startVelocity: 55 })
      fire(0.2,  { spread: 60 })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
      fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1,  { spread: 120, startVelocity: 45 })
    }

    burst()
    const t1 = setTimeout(burst, 600)
    const t2 = setTimeout(burst, 1200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(13,11,30,0.85)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Floating emojis */}
      {FLOATING.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl pointer-events-none"
          style={{ left: `${10 + (i * 11) % 80}%`, bottom: '5%' }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: -window.innerHeight * 0.9, opacity: [0, 1, 1, 0], scale: [0, 1.2, 1] }}
          transition={{ duration: 2.5, delay: i * 0.18, ease: 'easeOut' }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 }}
      >
        <motion.div
          className="text-8xl"
          animate={{ rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          🏆
        </motion.div>

        <div>
          <motion.div
            className="text-5xl font-black mb-2 rainbow-text"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            Amazing!
          </motion.div>
          <div className="text-xl font-bold text-white/70">
            Level Complete! 🎊
          </div>
        </div>

        {/* Star row */}
        <div className="flex gap-3">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="text-4xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.5 + i * 0.15 }}
            >
              ⭐
            </motion.div>
          ))}
        </div>

        <motion.div
          className="px-6 py-3 rounded-2xl font-black text-base"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            boxShadow: '0 8px 32px rgba(124,58,237,0.5)',
          }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Next Level Coming Up! 🚀
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
