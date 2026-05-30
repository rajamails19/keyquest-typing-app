import { motion } from 'framer-motion'
import { GAMES, DIFFICULTY_LEVELS } from '../data/letterGroups'

/* ── Tiny section header ─────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div className="text-[8.5px] font-black tracking-[0.22em] uppercase px-1 pt-1 mb-1"
      style={{ color: 'rgba(255,255,255,0.22)' }}>
      {children}
    </div>
  )
}

/* ── Thin divider ────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="my-2 mx-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
  )
}

export default function GameSelector({ activeGame, onChange, difficulty, onDifficultyChange }) {
  return (
    <div className="flex flex-col gap-1 p-3">

      {/* ── Game mode ──────────────────────────────────────────── */}
      <SectionLabel>Game</SectionLabel>

      {GAMES.map((game, i) => {
        const isActive = game.id === activeGame
        return (
          <motion.button
            key={game.id}
            onClick={() => onChange(game.id)}
            className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-left overflow-hidden shrink-0"
            style={{
              background: isActive
                ? `linear-gradient(145deg, ${game.glow.replace('0.4', '0.30')}, rgba(0,0,0,0.15))`
                : 'rgba(255,255,255,0.04)',
              border: isActive
                ? `1.5px solid ${game.glow.replace('0.4', '0.55')}`
                : '1.5px solid rgba(255,255,255,0.07)',
              boxShadow: isActive
                ? `0 6px 24px ${game.glow}, inset 0 1px 0 rgba(255,255,255,0.12)`
                : 'none',
              outline: 'none',
            }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.055, type: 'spring', stiffness: 340, damping: 24 }}
          >
            {/* Left accent bar */}
            {isActive && (
              <motion.div
                layoutId="gameAccentBar"
                className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                style={{ background: game.color }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              />
            )}

            {/* Shimmer on active */}
            {isActive && <div className="tab-shimmer absolute inset-0" />}

            {/* Emoji */}
            <motion.span
              className="text-xl shrink-0 relative z-10"
              animate={isActive
                ? { y: [0, -3, 0], rotate: [0, -7, 7, 0] }
                : {}
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {game.emoji}
            </motion.span>

            {/* Name */}
            <span
              className="font-black text-xs truncate flex-1 relative z-10"
              style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.55)' }}
            >
              {game.name}
            </span>

            {/* Pulse dot */}
            {isActive && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full shrink-0 relative z-10"
                style={{ background: game.color }}
                animate={{ opacity: [1, 0.15, 1], scale: [1, 0.6, 1] }}
                transition={{ duration: 1.15, repeat: Infinity }}
              />
            )}
          </motion.button>
        )
      })}

      <Divider />

      {/* ── Difficulty ─────────────────────────────────────────── */}
      <SectionLabel>Difficulty</SectionLabel>

      {DIFFICULTY_LEVELS.map((d, i) => {
        const isActive = d.id === difficulty
        return (
          <motion.button
            key={d.id}
            onClick={() => onDifficultyChange(d.id)}
            className="relative flex items-center gap-2.5 px-3 py-2 rounded-2xl text-left overflow-hidden shrink-0"
            style={{
              background: isActive
                ? `${d.color}16`
                : 'rgba(255,255,255,0.04)',
              border: isActive
                ? `1.5px solid ${d.color}55`
                : '1.5px solid rgba(255,255,255,0.07)',
              boxShadow: isActive
                ? `0 4px 16px ${d.color}28`
                : 'none',
              outline: 'none',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.055 + 0.22, type: 'spring', stiffness: 340, damping: 24 }}
          >
            {/* Colored left bar */}
            {isActive && (
              <motion.div
                layoutId="diffAccentBar"
                className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                style={{ background: d.color }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              />
            )}

            <span className="text-base shrink-0 relative z-10">{d.emoji}</span>
            <span
              className="font-black text-xs flex-1 relative z-10"
              style={{ color: isActive ? d.color : 'rgba(255,255,255,0.45)' }}
            >
              {d.label}
            </span>

            {isActive && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full shrink-0 relative z-10"
                style={{ background: d.color }}
                animate={{ opacity: [1, 0.2, 1], scale: [1, 0.6, 1] }}
                transition={{ duration: 1.3, repeat: Infinity }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
