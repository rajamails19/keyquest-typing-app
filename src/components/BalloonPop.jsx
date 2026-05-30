import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BALLOON_COLORS, DIFFICULTY_LEVELS } from '../data/letterGroups'
import BigBurst from './BigBurst'

function BalloonSVG({ color, letter, size = 90 }) {
  const display = letter.toUpperCase().slice(0, 4)
  const fs = display.length <= 1 ? 30 : display.length <= 2 ? 24 : 18
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 90 117" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Drop shadow */}
      <ellipse cx="45" cy="105" rx="18" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* Balloon body */}
      <ellipse cx="45" cy="44" rx="38" ry="42" fill={color} />
      {/* Shine */}
      <ellipse cx="32" cy="24" rx="11" ry="8" fill="white" opacity="0.38" transform="rotate(-25 32 24)" />
      <ellipse cx="28" cy="30" rx="4" ry="3" fill="white" opacity="0.18" transform="rotate(-25 28 30)" />
      {/* Bottom knot */}
      <path d="M43 85 Q45 91 47 85" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="45" cy="91" r="3.5" fill={color} />
      {/* String */}
      <path d="M45 94 Q50 100 43 107 Q40 112 45 117" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Letter */}
      <text
        x="45"
        y={display.length <= 1 ? 56 : 55}
        textAnchor="middle"
        fill="white"
        fontSize={fs}
        fontWeight="900"
        fontFamily="Nunito, sans-serif"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
      >
        {display}
      </text>
    </svg>
  )
}


function Sparkle({ x, y, color }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {['✦', '✧', '⭐', '💫'].map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-lg"
          style={{ color }}
          initial={{ x: 0, y: 0, scale: 0 }}
          animate={{
            x: Math.cos((i / 4) * Math.PI * 2) * 40,
            y: Math.sin((i / 4) * Math.PI * 2) * 40,
            scale: [0, 1.2, 0],
          }}
          transition={{ duration: 0.5, delay: i * 0.04 }}
        >
          {s}
        </motion.span>
      ))}
    </motion.div>
  )
}

let nextId = 0

function createBalloon(group, level, wordTier, speedMult) {
  const words = group.words[wordTier] ?? group.words[1]
  const word  = words[Math.floor(Math.random() * words.length)]
  const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]
  // Higher speedMult → shorter duration → faster float
  const duration = (Math.max(6, 12 - level * 0.6) + Math.random() * 3) / speedMult
  return {
    id: nextId++,
    letter: word,
    x: 8 + Math.random() * 78,
    color,
    duration,
    popped: false,
    escaped: false,
    startedAt: Date.now(),
  }
}

const POPS_TO_WIN  = 15
const MAX_BALLOONS = 3

export default function BalloonPop({ group, level, difficulty = 'medium', onScore, onLevelComplete, onKeyHighlight, audio }) {
  const diffConfig = DIFFICULTY_LEVELS.find(d => d.id === difficulty) ?? DIFFICULTY_LEVELS[1]
  const wordTier   = diffConfig.wordTier
  const speedMult  = diffConfig.speedMult

  const [balloons, setBalloons] = useState([])
  const [sparkles, setSparkles] = useState([])
  const [bursts, setBursts]     = useState([])
  const [poppedCount, setPoppedCount] = useState(0)
  const [shakeId, setShakeId] = useState(null)
  const [wordProgress, setWordProgress] = useState({})
  const containerRef   = useRef(null)
  const arenaRef       = useRef(null)
  const poppedCountRef = useRef(0)
  const doneRef        = useRef(false)

  // Real-time active check — avoids the ~500 ms lag of the escaped-flag interval.
  // A balloon is "on screen" if it hasn't been popped, hasn't been explicitly
  // marked escaped, AND its CSS animation hasn't run out yet.
  const isOnScreen = useCallback(
    (b) => !b.popped && !b.escaped && (Date.now() - b.startedAt) / 1000 < b.duration,
    []
  )

  // Reset on group change
  useEffect(() => {
    setBalloons([])
    setSparkles([])
    setBursts([])
    setPoppedCount(0)
    setWordProgress({})
    poppedCountRef.current = 0
    doneRef.current = false
    nextId = 0
  }, [group.id])

  // Spawn balloons
  useEffect(() => {
    if (doneRef.current) return
    const spawn = () => {
      setBalloons(prev => {
        const active = prev.filter(b => !b.popped && !b.escaped)
        if (active.length < MAX_BALLOONS) {
          return [...prev, createBalloon(group, level, wordTier, speedMult)]
        }
        return prev
      })
    }
    spawn()
    const interval = setInterval(spawn, 2500)
    return () => clearInterval(interval)
  }, [group, level, wordTier, speedMult])

  // Mark escaped balloons
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons(prev =>
        prev.map(b => {
          if (b.popped || b.escaped) return b
          const elapsed = (Date.now() - b.startedAt) / 1000
          if (elapsed >= b.duration) return { ...b, escaped: true }
          return b
        })
      )
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Clean up old popped/escaped
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBalloons(prev => prev.filter(b => !b.escaped && !(b.popped && (Date.now() - b.poppedAt > 800))))
    }, 1000)
    return () => clearInterval(cleanup)
  }, [])

  // Highlight next target key — use real-time isOnScreen so the hint
  // never points at a balloon that has already floated away.
  useEffect(() => {
    const active = balloons.filter(isOnScreen)
    if (active.length > 0) {
      const prog = wordProgress[active[0].id] || ''
      const nextLetter = active[0].letter[prog.length] || active[0].letter[0]
      onKeyHighlight(nextLetter)
    } else {
      onKeyHighlight(null)
    }
  }, [balloons, wordProgress, onKeyHighlight, isOnScreen])

  const popBalloon = useCallback((balloon, rect) => {
    setBalloons(prev => prev.map(b =>
      b.id === balloon.id ? { ...b, popped: true, poppedAt: Date.now() } : b
    ))
    setWordProgress(prev => {
      const p = { ...prev }
      delete p[balloon.id]
      return p
    })

    const arenaRect = arenaRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 }
    const centerX = rect ? rect.left + rect.width / 2 - arenaRect.left : window.innerWidth / 2
    const centerY = rect ? rect.top  + rect.height / 2 - arenaRect.top : window.innerHeight / 2

    setSparkles(prev => [...prev, { id: Date.now(), x: centerX + arenaRect.left, y: centerY + arenaRect.top, color: balloon.color }])
    setTimeout(() => setSparkles(prev => prev.slice(1)), 700)

    setBursts(prev => [...prev, { id: Date.now() + Math.random(), x: centerX, y: centerY, color: balloon.color }])
    setTimeout(() => setBursts(prev => prev.slice(1)), 1200)

    audio.playPop()
    audio.playExplosion()
    const newCount = poppedCountRef.current + 1
    poppedCountRef.current = newCount
    setPoppedCount(newCount)
    onScore()

    if (newCount >= POPS_TO_WIN && !doneRef.current) {
      doneRef.current = true
      setTimeout(() => onLevelComplete(), 600)
    }
  }, [audio, onScore, onLevelComplete])

  // Keyboard handler
  useEffect(() => {
    const handleKey = (e) => {
      if (e.repeat) return
      const key = e.key.length === 1 ? e.key : e.key.toLowerCase()
      if (key.length !== 1) return

      const active = balloons.filter(isOnScreen)

      let matched = null
      for (const b of active) {
        const progress = wordProgress[b.id] || ''
        const expected = b.letter[progress.length]
        if (expected === key) { matched = b; break }
      }

      if (matched) {
        const newProgress = (wordProgress[matched.id] || '') + key
        if (newProgress.length >= matched.letter.length) {
          const el = document.getElementById(`balloon-${matched.id}`)
          const rect = el ? el.getBoundingClientRect() : null
          popBalloon(matched, rect)
        } else {
          setWordProgress(prev => ({ ...prev, [matched.id]: newProgress }))
          audio.playLetter(key)
        }
      } else {
        const wrongBalloon = active[0]
        if (wrongBalloon) {
          setShakeId(wrongBalloon.id)
          setTimeout(() => setShakeId(null), 400)
        }
        audio.playWrong()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [balloons, wordProgress, popBalloon, audio])

  const progress = Math.min((poppedCount / POPS_TO_WIN) * 100, 100)

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="relative z-10 px-6 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-white/50 uppercase tracking-widest">Pops</span>
          <span className="text-xs font-black text-white/70">{poppedCount} / {POPS_TO_WIN}</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #a78bfa, #ec4899)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          />
        </div>
      </div>

      {/* Balloon arena */}
      <div ref={arenaRef} className="relative flex-1 overflow-hidden">
        <AnimatePresence>
          {balloons.filter(b => !b.escaped || b.popped).map((balloon) => {
            const progress_word = wordProgress[balloon.id] || ''
            const isShaking  = shakeId === balloon.id
            const durationStr = `${balloon.duration.toFixed(1)}s`

            return (
              <motion.div
                key={balloon.id}
                id={`balloon-${balloon.id}`}
                className="absolute bottom-0 cursor-pointer"
                style={{ left: `${balloon.x}%`, transform: 'translateX(-50%)' }}
                initial={{ opacity: 1 }}
                exit={{ scale: 1.6, opacity: 0 }}
                animate={
                  balloon.popped
                    ? { scale: 1.5, opacity: 0 }
                    : isShaking
                    ? { x: [-8, 8, -6, 6, -4, 4, 0] }
                    : {}
                }
                transition={
                  balloon.popped ? { duration: 0.25 } : isShaking ? { duration: 0.4 } : {}
                }
                onClick={() => {
                  if (!balloon.popped && !balloon.escaped) {
                    const el = document.getElementById(`balloon-${balloon.id}`)
                    popBalloon(balloon, el?.getBoundingClientRect())
                  }
                }}
              >
                <div style={{ animation: `floatBalloon ${durationStr} linear forwards`, willChange: 'transform' }}>
                  <div className="relative">
                    <BalloonSVG color={balloon.color} letter={balloon.letter} />
                    {balloon.letter.length > 1 && (
                      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {balloon.letter.split('').map((ch, ci) => (
                          <div key={ci} className="w-4 h-1 rounded-full"
                            style={{ background: ci < progress_word.length ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)' }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {sparkles.map(s => <Sparkle key={s.id} x={s.x} y={s.y} color={s.color} />)}
        {bursts.map(b => <BigBurst key={b.id} x={b.x} y={b.y} color={b.color} symbol="🎈" />)}

        {balloons.filter(isOnScreen).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white/20 text-4xl font-black"
            >
              Get ready...
            </motion.div>
          </div>
        )}
      </div>

      {/* Target hint at bottom */}
      <div className="shrink-0 px-6 pb-3 pt-2">
        {balloons.filter(isOnScreen)[0] && (() => {
          const first = balloons.filter(isOnScreen)[0]
          const prog  = wordProgress[first.id] || ''
          return (
            <motion.div
              key={first.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3"
            >
              <span className="text-xs font-black text-white/30 uppercase tracking-widest">Type</span>
              <div className="flex gap-1.5">
                {first.letter.split('').map((ch, i) => {
                  const done = i < prog.length
                  return (
                    <motion.div
                      key={i}
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg"
                      style={{
                        background: done ? 'rgba(74,222,128,0.3)' : i === prog.length ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
                        border: done ? '2px solid rgba(74,222,128,0.6)' : i === prog.length ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.1)',
                        color: done ? '#4ade80' : 'white',
                      }}
                      animate={i === prog.length ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      {ch.toUpperCase()}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        })()}
      </div>
    </div>
  )
}
