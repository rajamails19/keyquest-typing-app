import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DIFFICULTY_LEVELS } from '../data/letterGroups'
import BigBurst from './BigBurst'

const POPS_TO_WIN = 15
const MAX_COMETS  = 3
const COLORS = ['#f87171','#fb923c','#fbbf24','#4ade80','#60a5fa','#a78bfa','#f472b6']

let cometId = 0
function mkComet(group, level, wordTier, speedMult) {
  const words = group.words[wordTier] ?? group.words[1]
  return {
    id: cometId++,
    letter: words[Math.floor(Math.random() * words.length)],
    x: 10 + Math.random() * 80,
    y: -12,
    speed: (0.18 + level * 0.02 + Math.random() * 0.10) * speedMult,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    angle: -15 + Math.random() * 30,
    caught: false, missed: false, caughtAt: null,
  }
}

/* ── Comet visual ─────────────────────────────────────────── */
function Comet({ color, letter, progress }) {
  const prog    = progress || ''
  const display = letter.toUpperCase().slice(0, 3)
  const fs      = display.length <= 1 ? 24 : display.length <= 2 ? 20 : 16
  return (
    <div className="flex flex-col items-center" style={{ transform: 'translateX(-50%)' }}>
      {/* Tail */}
      <div className="w-3 rounded-full" style={{
        height: 90,
        background: `linear-gradient(to bottom, transparent, ${color}44, ${color}bb)`,
      }} />
      {/* Star body — solid color so text stays readable */}
      <div
        className="w-24 h-24 rounded-full flex flex-col items-center justify-center relative"
        style={{
          background: color,
          boxShadow: `0 0 32px ${color}cc, 0 0 60px ${color}66, 0 0 100px ${color}33`,
        }}
      >
        {/* Dark overlay behind text */}
        <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(0,0,0,0.35)' }} />
        {/* Small shine — top-left only, doesn't wash out text */}
        <div className="absolute top-2 left-3 w-6 h-6 rounded-full"
          style={{ background: 'rgba(255,255,255,0.7)', filter: 'blur(4px)' }} />
        {/* Letter with strong shadow */}
        <span className="relative z-10 font-black text-white"
          style={{ fontSize: fs, textShadow: '0 2px 10px rgba(0,0,0,1), 0 0 24px rgba(0,0,0,0.9)' }}>
          {display}
        </span>
        {/* Progress dots */}
        {letter.length > 1 && (
          <div className="flex gap-1 mt-0.5 relative z-10">
            {letter.split('').map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{ background: i < prog.length ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        )}
      </div>
      {/* Sparkle ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ border: `3px solid ${color}99`, width: 110, height: 110, left: -55, top: 90 }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  )
}


/* ── Background stars ─────────────────────────────────────── */
const BG_STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 75,
  size: 1 + Math.random() * 2.5,
  dur: 2 + Math.random() * 3.5, delay: Math.random() * 5,
}))

/* ── Shooting star ────────────────────────────────────────── */
function ShootingStar({ delay }) {
  return (
    <motion.div
      className="absolute h-px rounded-full"
      style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', width: 80, top: '15%', right: '10%' }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{ x: -200, y: 120, opacity: [0, 1, 0] }}
      transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 6 + Math.random() * 4 }}
    />
  )
}

export default function RainbowCatch({ group, level, difficulty = 'medium', onScore, onLevelComplete, onKeyHighlight, audio }) {
  const diffConfig = DIFFICULTY_LEVELS.find(d => d.id === difficulty) ?? DIFFICULTY_LEVELS[1]
  const wordTier   = diffConfig.wordTier
  const speedMult  = diffConfig.speedMult

  const [comets, setComets]       = useState([])
  const [bursts, setBursts]       = useState([])
  const [caught, setCaught]       = useState(0)
  const [wordProg, setWordProg]   = useState({})
  const [shakeId, setShakeId]     = useState(null)
  const caughtRef = useRef(0)
  const doneRef   = useRef(false)

  useEffect(() => {
    cometId = 0
    setComets([]); setBursts([]); setCaught(0); setWordProg({})
    caughtRef.current = 0; doneRef.current = false
  }, [group.id])

  // Spawn
  useEffect(() => {
    if (doneRef.current) return
    const spawn = () => setComets(prev => {
      if (prev.filter(c => !c.caught && !c.missed).length < MAX_COMETS)
        return [...prev, mkComet(group, level, wordTier, speedMult)]
      return prev
    })
    spawn()
    const t = setInterval(spawn, 2100)
    return () => clearInterval(t)
  }, [group, level, wordTier, speedMult])

  // Fall down
  useEffect(() => {
    const t = setInterval(() => setComets(prev =>
      prev.map(c => {
        if (c.caught || c.missed) return c
        const newY = c.y + c.speed
        return { ...c, y: newY, missed: newY > 102 }
      })
    ), 50)
    return () => clearInterval(t)
  }, [])

  // Cleanup
  useEffect(() => {
    const t = setInterval(() => setComets(prev =>
      prev.filter(c => !c.missed && !(c.caught && (Date.now() - c.caughtAt > 800)))
    ), 1000)
    return () => clearInterval(t)
  }, [])

  // Highlight
  useEffect(() => {
    const active = comets.filter(c => !c.caught && !c.missed)
    if (active.length > 0) {
      const prog = wordProg[active[0].id] || ''
      onKeyHighlight(active[0].letter[prog.length] || active[0].letter[0])
    }
  }, [comets, wordProg, onKeyHighlight])

  const catchComet = useCallback((c) => {
    setComets(prev => prev.map(b => b.id === c.id ? { ...b, caught: true, caughtAt: Date.now() } : b))
    setWordProg(prev => { const p = { ...prev }; delete p[c.id]; return p })
    setBursts(prev => [...prev, { id: Date.now() + Math.random(), x: c.x, y: c.y, color: c.color }])
    setTimeout(() => setBursts(prev => prev.slice(1)), 900)
    audio.playChime()
    audio.playExplosion()
    const n = caughtRef.current + 1
    caughtRef.current = n; setCaught(n); onScore()
    if (n >= POPS_TO_WIN && !doneRef.current) {
      doneRef.current = true
      setTimeout(() => onLevelComplete(), 650)
    }
  }, [audio, onScore, onLevelComplete])

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return
      const key = e.key.length === 1 ? e.key : e.key.toLowerCase()
      if (key.length !== 1) return
      const active = comets.filter(c => !c.caught && !c.missed)
      let matched = null
      for (const c of active) {
        const prog = wordProg[c.id] || ''
        if (c.letter[prog.length] === key) { matched = c; break }
      }
      if (matched) {
        const newP = (wordProg[matched.id] || '') + key
        if (newP.length >= matched.letter.length) catchComet(matched)
        else { setWordProg(prev => ({ ...prev, [matched.id]: newP })); audio.playLetter(key) }
      } else {
        const w = comets.find(c => !c.caught && !c.missed)
        if (w) { setShakeId(w.id); setTimeout(() => setShakeId(null), 420) }
        audio.playWrong()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [comets, wordProg, catchComet, audio])

  const progress    = Math.min((caught / POPS_TO_WIN) * 100, 100)
  const firstActive = comets.find(c => !c.caught && !c.missed)

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">

      {/* Night sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #010814 0%, #040d22 40%, #081630 70%, #0d2040 100%)' }} />

      {/* Stars */}
      {BG_STARS.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white star-particle"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            '--duration': `${s.dur}s`, '--delay': `${s.delay}s` }} />
      ))}

      <ShootingStar delay={2} />
      <ShootingStar delay={8} />

      {/* Moon */}
      <div className="absolute top-6 right-12">
        <div className="w-12 h-12 rounded-full" style={{
          background: 'radial-gradient(circle at 35% 35%, #FFF3B0, #FDE68A)',
          boxShadow: '0 0 30px rgba(253,230,138,0.4)',
        }} />
      </div>

      {/* Ground glow */}
      <div className="absolute bottom-0 left-0 right-0 h-20"
        style={{ background: 'linear-gradient(to top, rgba(30,10,60,0.7), transparent)' }} />

      {/* Progress */}
      <div className="relative z-10 px-6 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-white/50 uppercase tracking-widest">Caught</span>
          <span className="text-xs font-black text-white/70">{caught} / {POPS_TO_WIN}</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#4ade80,#60a5fa,#a78bfa)' }}
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }} />
        </div>
      </div>

      {/* Game area */}
      <div className="relative flex-1">
        <AnimatePresence>
          {comets.filter(c => !c.missed).map(c => (
            <motion.div key={c.id}
              className="absolute"
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: `rotate(${c.angle}deg)` }}
              animate={c.caught ? { scale: [1, 1.6, 0], opacity: [1, 1, 0] } : {}}
              transition={c.caught ? { duration: 0.3 } : {}}
            >
              <motion.div
                animate={shakeId === c.id ? { x: [-7, 7, -5, 5, 0] } : {}}
                transition={{ duration: 0.42 }}
                style={{ cursor: 'pointer' }}
                onClick={() => !c.caught && catchComet(c)}
              >
                <Comet color={c.color} letter={c.letter} progress={wordProg[c.id] || ''} />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        {bursts.map(b => <BigBurst key={b.id} x={b.x} y={b.y} color={b.color} symbol="🌈" usePercent />)}
      </div>

      {/* Target hint */}
      <div className="shrink-0 px-6 pb-2 pt-1 relative z-10">
        {firstActive && (
          <motion.div key={firstActive.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3">
            <span className="text-xs font-black text-white/30 uppercase tracking-widest">Catch</span>
            <div className="flex gap-1.5">
              {firstActive.letter.split('').map((ch, i) => {
                const prog = wordProg[firstActive.id] || ''
                const done = i < prog.length
                return (
                  <motion.div key={i}
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg"
                    style={{
                      background: done ? 'rgba(167,139,250,0.3)' : i === prog.length ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
                      border: done ? '2px solid rgba(167,139,250,0.6)' : i === prog.length ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.1)',
                      color: done ? '#a78bfa' : 'white',
                    }}
                    animate={i === prog.length ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}>
                    {ch.toUpperCase()}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
