import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    if (!achievement) return
    const t = setTimeout(onDismiss, 3800)
    return () => clearTimeout(t)
  }, [achievement, onDismiss])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.queueId}
          className="fixed top-20 right-4 z-50 flex items-center gap-3.5 px-5 py-4 rounded-3xl cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(30,15,60,0.95), rgba(20,10,50,0.95))',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 60px rgba(124,58,237,0.5), 0 0 0 1px rgba(167,139,250,0.2)',
            maxWidth: 280,
          }}
          initial={{ x: 320, opacity: 0, scale: 0.85 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 320, opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          onClick={onDismiss}
        >
          {/* Emoji */}
          <motion.div
            className="text-4xl shrink-0"
            animate={{ rotate: [0, -12, 14, -8, 8, 0], scale: [1, 1.25, 1] }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {achievement.emoji}
          </motion.div>

          <div className="min-w-0">
            {/* Badge */}
            <div className="text-[9px] font-black tracking-widest uppercase mb-0.5"
              style={{ color: 'rgba(167,139,250,0.8)' }}>
              🏆 Achievement Unlocked!
            </div>
            <div className="font-black text-white text-sm leading-tight truncate">
              {achievement.name}
            </div>
            <div className="text-[11px] font-semibold text-white/50 mt-0.5 leading-tight">
              {achievement.desc}
            </div>
          </div>

          {/* Glow stripe */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.15), transparent 60%)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />

          {/* Corner sparkles */}
          {['✦', '✧'].map((s, i) => (
            <motion.span key={i}
              className="absolute text-xs text-purple-300/60 pointer-events-none"
              style={{ top: i === 0 ? 6 : 'auto', bottom: i === 1 ? 6 : 'auto', right: 10 }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}>
              {s}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
