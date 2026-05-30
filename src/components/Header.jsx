import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

/* ── Star / score counter ────────────────────────────────────── */
function StarCounter({ count }) {
  const [prev, setPrev] = useState(count)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (count > prev) { setBurst(true); setTimeout(() => setBurst(false), 700) }
    setPrev(count)
  }, [count, prev])

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2 rounded-2xl relative overflow-hidden"
      style={{
        background:  'rgba(251,191,36,0.12)',
        border:      `1.5px solid ${burst ? 'rgba(251,191,36,0.7)' : 'rgba(251,191,36,0.28)'}`,
        boxShadow:   burst
          ? '0 0 28px rgba(251,191,36,0.55), inset 0 0 12px rgba(251,191,36,0.15)'
          : '0 0 10px rgba(251,191,36,0.08)',
        transition:  'box-shadow 0.35s, border-color 0.35s',
      }}
    >
      <motion.span
        className="text-2xl shrink-0"
        animate={
          burst
            ? { rotate: [0, -25, 25, -12, 12, 0], scale: [1, 1.55, 1.2, 1] }
            : { rotate: [0, -6, 6, 0], scale: [1, 1.04, 1] }
        }
        transition={burst
          ? { duration: 0.65 }
          : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >⭐</motion.span>

      <div className="flex flex-col items-center leading-none gap-0.5">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            className="gold-text text-xl font-black min-w-[2.5ch] text-center leading-none"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{   y:  16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          >
            {count}
          </motion.span>
        </AnimatePresence>
        <span className="text-[8px] font-black tracking-[0.18em] uppercase text-white/30">
          Stars
        </span>
      </div>
    </div>
  )
}

/* ── Level badge ─────────────────────────────────────────────── */
function LevelBadge({ level }) {
  return (
    <motion.div
      className="relative flex items-center gap-2.5 px-5 py-2 rounded-2xl overflow-hidden cursor-default"
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.55) 0%, rgba(236,72,153,0.55) 100%)',
        border:     '1.5px solid rgba(255,255,255,0.22)',
        boxShadow:  '0 0 28px rgba(124,58,237,0.45), 0 0 56px rgba(124,58,237,0.18)',
      }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Sweeping shimmer */}
      <div className="tab-shimmer absolute inset-0" />

      <motion.span
        className="text-2xl relative z-10 shrink-0"
        animate={{ y: [0, -3, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >🏆</motion.span>

      <div className="flex flex-col items-center leading-none gap-0.5 relative z-10">
        <span className="text-[8px] font-black tracking-[0.18em] uppercase text-white/50">
          Level
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={level}
            className="text-xl font-black text-white"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{   scale: 1.9,  opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            {level}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ── Achievements mini-badge ─────────────────────────────────── */
function AchievementsBadge({ unlocked, total }) {
  const pct = total > 0 ? Math.round((unlocked / total) * 100) : 0
  return (
    <motion.div
      className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-dark cursor-default"
      whileHover={{ scale: 1.05 }}
    >
      <motion.span
        className="text-xl shrink-0"
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >🏅</motion.span>

      <div className="flex flex-col gap-1 leading-none">
        <span className="text-xs font-black text-white/85">
          {unlocked}
          <span className="text-white/30 font-semibold">/{total}</span>
        </span>
        {/* Progress bar */}
        <div
          className="w-12 h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ── Header ──────────────────────────────────────────────────── */
export default function Header({ stars, level, achievementsUnlocked = 0, achievementsTotal = 16 }) {
  return (
    <header
      className="relative z-10 flex items-center justify-between shrink-0"
      style={{
        height:              70,
        padding:             '0 24px',
        background:          'rgba(5,2,20,0.75)',
        backdropFilter:      'blur(36px) saturate(170%)',
        WebkitBackdropFilter:'blur(36px) saturate(170%)',
        borderBottom:        '1px solid rgba(255,255,255,0.10)',
        boxShadow:           '0 2px 48px rgba(0,0,0,0.65)',
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────── */}
      <motion.div
        className="flex items-center gap-3.5"
        initial={{ x: -28, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        transition={{ duration: 0.65, type: 'spring', stiffness: 180 }}
      >
        {/* Icon */}
        <motion.div
          className="relative flex items-center justify-center text-[28px] rounded-[18px] shrink-0"
          style={{
            width:      56, height: 56,
            background: 'linear-gradient(145deg, #6d28d9 0%, #7c3aed 45%, #ec4899 100%)',
            boxShadow:  '0 4px 22px rgba(124,58,237,0.65), 0 0 0 2px rgba(255,255,255,0.18)',
          }}
          animate={{ rotate: [0, -7, 7, 0], y: [0, -2, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⌨️
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-[18px]"
            style={{ border: '2px solid rgba(167,139,250,0.55)' }}
            animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.04, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Brand text */}
        <div className="flex flex-col leading-none gap-1">
          <div className="text-[26px] font-black tracking-tight rainbow-text leading-none">
            KeyQuest
          </div>
          <div className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-white/35 leading-none">
            ✦&nbsp;Magical&nbsp;Typing&nbsp;✦
          </div>
        </div>
      </motion.div>

      {/* ── Center decorative divider ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div
          className="h-px w-full max-w-xs"
          style={{
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)',
          }}
        />
      </div>

      {/* ── HUD stats ─────────────────────────────────────────── */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ x: 28, opacity: 0 }}
        animate={{ x: 0,  opacity: 1 }}
        transition={{ duration: 0.65, type: 'spring', stiffness: 180 }}
      >
        <AchievementsBadge unlocked={achievementsUnlocked} total={achievementsTotal} />
        <StarCounter count={stars} />
        <LevelBadge level={level} />
      </motion.div>
    </header>
  )
}
