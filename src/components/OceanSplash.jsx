import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DIFFICULTY_LEVELS } from '../data/letterGroups'
import BigBurst from './BigBurst'

const POPS_TO_WIN = 15
const MAX_FISH    = 3
const FISH_COLORS = ['#ff7f50','#4fc3f7','#81c784','#ffd54f','#ce93d8','#f48fb1','#80deea','#a5d6a7']

let fishId = 0
function mkFish(group, wordTier, speedMult) {
  const words = group.words[wordTier] ?? group.words[1]
  return {
    id: fishId++,
    letter: words[Math.floor(Math.random() * words.length)],
    x: 108,
    y: 18 + Math.random() * 52,
    speed: (0.18 + Math.random() * 0.28) * speedMult,
    color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
    swimPhase: Math.random() * Math.PI * 2,
    splashed: false, escaped: false, splashedAt: null,
  }
}

/* Fish always faces LEFT (moving right-to-left). Eye at left side. */
function FishSVG({ color, letter }) {
  const display = letter.toUpperCase().slice(0, 3)
  const fs = display.length <= 1 ? 22 : display.length <= 2 ? 18 : 14
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" fill="none">
      {/* Tail at right side */}
      <path d="M108 40 L140 18 L140 62 Z" fill={color} opacity="0.85" />
      {/* Body */}
      <ellipse cx="60" cy="40" rx="56" ry="30" fill={color} />
      {/* Belly shimmer */}
      <ellipse cx="56" cy="48" rx="38" ry="16" fill="white" opacity="0.22" />
      {/* Top fin */}
      <path d="M52 10 Q68 24 62 38" fill={color} style={{ filter: 'brightness(1.25)' }} />
      {/* Eye — left side of body */}
      <circle cx="22" cy="36" r="9" fill="white" />
      <circle cx="24" cy="36" r="5.5" fill="#1a1a2e" />
      <circle cx="26" cy="34" r="2" fill="white" />
      {/* Scales */}
      <path d="M52 24 Q66 40 52 56" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <path d="M76 28 Q90 40 76 52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {/* Smile */}
      <path d="M12 44 Q20 50 28 44" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round" />
      {/* Letter — centred in body */}
      <text x="66" y="46" textAnchor="middle" fill="white" fontSize={fs} fontWeight="900"
        fontFamily="Nunito, sans-serif" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}>
        {display}
      </text>
    </svg>
  )
}



function Seabed() {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="h-16" style={{ background: 'linear-gradient(180deg, #8B6914 0%, #C4922A 100%)' }} />
      <div className="absolute bottom-8 left-6 text-3xl select-none">🪸</div>
      <div className="absolute bottom-6 left-24 text-2xl select-none">🐚</div>
      <div className="absolute bottom-9 left-40 text-xl select-none">🪨</div>
      <div className="absolute bottom-8 right-8 text-3xl select-none">🪸</div>
      <div className="absolute bottom-6 right-28 text-2xl select-none">🌊</div>
      <div className="absolute bottom-9 right-48 text-xl select-none">🐚</div>
      <div className="absolute bottom-7 left-1/2 text-2xl select-none">🪸</div>
    </div>
  )
}

const BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  id: i, x: 5 + (i * 7) % 92,
  duration: 4 + (i % 4),
  delay: (i * 0.6) % 6,
  size: 5 + (i % 5) * 2,
}))

export default function OceanSplash({ group, level, difficulty = 'medium', onScore, onLevelComplete, onKeyHighlight, audio }) {
  const diffConfig = DIFFICULTY_LEVELS.find(d => d.id === difficulty) ?? DIFFICULTY_LEVELS[1]
  const wordTier   = diffConfig.wordTier
  const speedMult  = diffConfig.speedMult

  const [fish, setFish]         = useState([])
  const [bursts, setBursts]     = useState([])
  const [caught, setCaught]     = useState(0)
  const [wordProg, setWordProg] = useState({})
  const [shakeId, setShakeId]   = useState(null)
  const caughtRef = useRef(0)
  const doneRef   = useRef(false)
  const timeRef   = useRef({})

  useEffect(() => {
    fishId = 0
    setFish([]); setBursts([]); setCaught(0); setWordProg({})
    caughtRef.current = 0; doneRef.current = false
  }, [group.id])

  // Spawn
  useEffect(() => {
    if (doneRef.current) return
    const spawn = () => setFish(prev => {
      if (prev.filter(f => !f.splashed && !f.escaped).length < MAX_FISH)
        return [...prev, mkFish(group, wordTier, speedMult)]
      return prev
    })
    spawn()
    const t = setInterval(spawn, 2400)
    return () => clearInterval(t)
  }, [group, wordTier, speedMult])

  // Move + swim wobble
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now()
      setFish(prev => prev.map(f => {
        if (f.splashed || f.escaped) return f
        if (!timeRef.current[f.id]) timeRef.current[f.id] = now
        const elapsed = (now - timeRef.current[f.id]) / 1000
        const newX = f.x - f.speed
        const swimY = f.y + Math.sin(elapsed * 2.5 + f.swimPhase) * 0.4
        return { ...f, x: newX, y: swimY, escaped: newX < -16 }
      }))
    }, 50)
    return () => clearInterval(t)
  }, [])

  // Cleanup
  useEffect(() => {
    const t = setInterval(() => setFish(prev =>
      prev.filter(f => !f.escaped && !(f.splashed && (Date.now() - f.splashedAt > 900)))
    ), 1000)
    return () => clearInterval(t)
  }, [])

  // Highlight
  useEffect(() => {
    const active = fish.filter(f => !f.splashed && !f.escaped)
    if (active.length > 0) {
      const f = active[0]
      const prog = wordProg[f.id] || ''
      onKeyHighlight(f.letter[prog.length] || f.letter[0])
    }
  }, [fish, wordProg, onKeyHighlight])

  const catchFish = useCallback((f) => {
    setFish(prev => prev.map(b => b.id === f.id ? { ...b, splashed: true, splashedAt: Date.now() } : b))
    setWordProg(prev => { const p = { ...prev }; delete p[f.id]; return p })
    setBursts(prev => [...prev, { id: Date.now() + Math.random(), x: f.x, y: f.y }])
    setTimeout(() => setBursts(prev => prev.slice(1)), 900)
    audio.playSplash()
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
      const active = fish.filter(f => !f.splashed && !f.escaped)
      let matched = null
      for (const f of active) {
        const prog = wordProg[f.id] || ''
        if (f.letter[prog.length] === key) { matched = f; break }
      }
      if (matched) {
        const newP = (wordProg[matched.id] || '') + key
        if (newP.length >= matched.letter.length) catchFish(matched)
        else { setWordProg(prev => ({ ...prev, [matched.id]: newP })); audio.playBubble() }
      } else {
        const w = active[0]
        if (w) { setShakeId(w.id); setTimeout(() => setShakeId(null), 420) }
        audio.playWrong()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fish, wordProg, catchFish, audio])

  const progress    = Math.min((caught / POPS_TO_WIN) * 100, 100)
  const firstActive = fish.find(f => !f.splashed && !f.escaped)

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,#062033 0%,#0a3d6b 35%,#0a6080 65%,#0d8caa 100%)' }} />

      {[20, 45, 68].map((x, i) => (
        <div key={i} className="absolute top-0"
          style={{
            left: `${x}%`, width: 60, height: '60%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)',
            transform: `rotate(${(i - 1) * 8}deg)`, transformOrigin: 'top center',
          }} />
      ))}

      {BUBBLES.map(b => (
        <div key={b.id} className="absolute rounded-full border border-white/25"
          style={{
            left: `${b.x}%`, bottom: 50, width: b.size, height: b.size,
            background: 'rgba(255,255,255,0.08)',
            animation: `floatBalloon ${b.duration}s ${b.delay}s ease-in infinite`,
          }} />
      ))}

      <Seabed />

      {/* Progress */}
      <div className="relative z-10 px-6 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-white/50 uppercase tracking-widest">Splashes</span>
          <span className="text-xs font-black text-white/70">{caught} / {POPS_TO_WIN}</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #06b6d4, #0284c7)' }}
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }} />
        </div>
      </div>

      {/* Fish area */}
      <div className="relative flex-1">
        <AnimatePresence>
          {fish.filter(f => !f.escaped).map(f => (
            <motion.div key={f.id}
              className="absolute"
              style={{ left: `${f.x}%`, top: `${f.y}%`, transform: 'translateY(-50%)' }}
              animate={f.splashed ? { y: -90, opacity: 0, scale: 0.5 } : {}}
              transition={f.splashed ? { duration: 0.5 } : {}}>
              <motion.div
                animate={shakeId === f.id ? { x: [-8, 8, -5, 5, 0] } : {}}
                transition={{ duration: 0.42 }}
                style={{ cursor: 'pointer' }}
                onClick={() => !f.splashed && catchFish(f)}>
                {f.letter.length > 1 && (
                  <div className="flex gap-1 justify-center mb-1">
                    {f.letter.split('').map((_, ci) => {
                      const prog = wordProg[f.id] || ''
                      return (
                        <div key={ci} className="w-2 h-2 rounded-full"
                          style={{ background: ci < prog.length ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)' }} />
                      )
                    })}
                  </div>
                )}
                <FishSVG color={f.color} letter={f.letter} />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {bursts.map(b => <BigBurst key={b.id} x={b.x} y={b.y} color="#06b6d4" symbol="💦" usePercent />)}
      </div>

      {/* Target hint */}
      <div className="shrink-0 px-6 pb-2 pt-1 relative z-10">
        {firstActive && (
          <motion.div key={firstActive.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3">
            <span className="text-xs font-black text-white/30 uppercase tracking-widest">Type</span>
            <div className="flex gap-1.5">
              {firstActive.letter.split('').map((ch, i) => {
                const prog = wordProg[firstActive.id] || ''
                const done = i < prog.length
                return (
                  <motion.div key={i}
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg"
                    style={{
                      background: done ? 'rgba(6,182,212,0.3)' : i === prog.length ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
                      border: done ? '2px solid rgba(6,182,212,0.6)' : i === prog.length ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.1)',
                      color: done ? '#22d3ee' : 'white',
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
