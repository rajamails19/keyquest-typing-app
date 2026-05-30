import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DIFFICULTY_LEVELS } from '../data/letterGroups'
import BigBurst from './BigBurst'

const POPS_TO_WIN = 15
const CAR_W = 90
const ENGINE_X = 24

let carId = 0
function mkCar(group, wordTier) {
  const words = group.words[wordTier] ?? group.words[1]
  return { id: carId++, letter: words[Math.floor(Math.random() * words.length)] }
}


function Engine({ chugging }) {
  return (
    <motion.div className="flex flex-col items-center shrink-0"
      animate={chugging ? { y: [0, -5, 0, -3, 0] } : {}}
      transition={{ duration: 0.35 }}
      style={{ width: CAR_W - 4 }}>
      <svg width={CAR_W - 4} height={70} viewBox="0 0 86 70">
        <rect x="12" y="4" width="14" height="16" rx="3" fill="#374151" />
        <rect x="8"  y="4" width="22" height="5"  rx="2" fill="#4B5563" />
        <rect x="44" y="10" width="34" height="8" rx="3" fill="#F59E0B" />
        <rect x="6"  y="20" width="50" height="28" rx="8" fill="#EF4444" />
        <ellipse cx="10" cy="34" rx="6" ry="14" fill="#DC2626" />
        <rect x="54" y="18" width="28" height="30" rx="6" fill="#F59E0B" />
        <rect x="58" y="22" width="10" height="9" rx="3" fill="#BFDBFE" />
        <rect x="72" y="22" width="8"  height="9" rx="3" fill="#BFDBFE" />
        <circle cx="10" cy="28" r="5" fill="#FDE68A" />
        <circle cx="10" cy="28" r="3" fill="#FBBF24" />
        {[14, 32, 52, 68].map(x => (
          <g key={x}>
            <circle cx={x} cy="54" r="10" fill="#1F2937" stroke="#374151" strokeWidth="2" />
            <circle cx={x} cy="54" r="5"  fill="#374151" />
            <circle cx={x} cy="54" r="2"  fill="#6B7280" />
          </g>
        ))}
        <rect x="14" y="52" width="54" height="4" rx="2" fill="#374151" />
      </svg>
      <div className="w-full h-2.5 rounded" style={{ background: '#374151' }} />
    </motion.div>
  )
}

function Car({ letter, isActive, progress }) {
  const prog    = progress || ''
  const display = letter.toUpperCase().slice(0, 4)
  const fs      = display.length <= 1 ? 24 : display.length <= 2 ? 20 : 15
  return (
    <div className="flex flex-col items-center shrink-0" style={{ width: CAR_W - 4 }}>
      <motion.div
        className="relative flex flex-col items-center justify-center rounded-2xl"
        style={{
          width: CAR_W - 8, height: 64,
          background: isActive
            ? 'linear-gradient(145deg, rgba(124,58,237,0.9), rgba(236,72,153,0.75))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
          border: isActive ? '2px solid rgba(255,255,255,0.5)' : '1.5px solid rgba(255,255,255,0.12)',
          boxShadow: isActive ? '0 4px 28px rgba(124,58,237,0.65)' : '0 2px 8px rgba(0,0,0,0.25)',
        }}
        animate={isActive ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="w-12 h-8 rounded-xl flex items-center justify-center font-black text-white mb-0.5"
          style={{ background: 'rgba(0,0,0,0.2)', fontSize: fs }}>
          {display}
        </div>
        {letter.length > 1 && (
          <div className="flex gap-1">
            {letter.split('').map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-150"
                style={{ background: i < prog.length ? '#4ade80' : 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>
        )}
      </motion.div>
      <div className="flex gap-3 mt-1">
        {[0, 1].map(i => (
          <motion.div key={i} className="w-5 h-5 rounded-full border-2 border-white/20"
            style={{ background: '#1F2937' }}
            animate={{ rotate: 360 }}
            transition={{ duration: isActive ? 0.8 : 2, repeat: Infinity, ease: 'linear' }} />
        ))}
      </div>
      <div className="w-full h-2.5 rounded mt-0.5" style={{ background: '#374151' }} />
    </div>
  )
}

function Smoke() {
  return (
    <AnimatePresence>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: ENGINE_X + 16, top: 10, width: 14 + i * 6, height: 14 + i * 6, background: 'rgba(255,255,255,0.18)' }}
          initial={{ opacity: 0.8, y: 0, x: 0, scale: 0.4 }}
          animate={{ opacity: 0, y: -70 - i * 20, x: -20 - i * 8, scale: 1.8 }}
          transition={{ duration: 1.0, delay: i * 0.12 }} />
      ))}
    </AnimatePresence>
  )
}

function Cloud({ x, y, w }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="relative" style={{ width: w }}>
        <div className="absolute inset-0 rounded-full bg-white/10" />
        <div className="absolute rounded-full bg-white/10"
          style={{ width: w * 0.65, height: '70%', top: '-30%', left: '15%' }} />
        <div className="absolute rounded-full bg-white/10"
          style={{ width: w * 0.5, height: '65%', top: '-20%', left: '45%' }} />
        <div style={{ height: w * 0.38 }} />
      </div>
    </div>
  )
}

function Mountains({ offset = 0 }) {
  const peaks = [
    { x: 0,   h: 90,  col: 'rgba(124,58,237,0.18)' },
    { x: 120, h: 130, col: 'rgba(109,40,217,0.15)'  },
    { x: 260, h: 100, col: 'rgba(79,70,229,0.18)'   },
    { x: 380, h: 115, col: 'rgba(124,58,237,0.13)'  },
    { x: 510, h: 85,  col: 'rgba(109,40,217,0.16)'  },
    { x: 630, h: 120, col: 'rgba(79,70,229,0.14)'   },
    { x: 760, h: 95,  col: 'rgba(124,58,237,0.17)'  },
  ]
  return (
    <div className="absolute bottom-0 left-0" style={{ width: 900, height: 160, transform: `translateX(${offset}px)` }}>
      {peaks.map((p, i) => (
        <div key={i} className="absolute bottom-0" style={{
          left: p.x, width: 0, height: 0,
          borderLeft: `${p.h * 0.65}px solid transparent`,
          borderRight: `${p.h * 0.65}px solid transparent`,
          borderBottom: `${p.h}px solid ${p.col}`,
        }} />
      ))}
    </div>
  )
}

export default function TrainRide({ group, level, difficulty = 'medium', onScore, onLevelComplete, onKeyHighlight, audio }) {
  const diffConfig = DIFFICULTY_LEVELS.find(d => d.id === difficulty) ?? DIFFICULTY_LEVELS[1]
  const wordTier   = diffConfig.wordTier
  const speedMult  = diffConfig.speedMult

  const [cars, setCars]         = useState(() => Array.from({ length: 8 }, () => mkCar(group, wordTier)))
  const [wordProg, setWordProg] = useState('')
  const [pops, setPops]         = useState(0)
  const [chugging, setChugging] = useState(false)
  const [smokeKey, setSmokeKey] = useState(0)
  const [shaking, setShaking]   = useState(false)
  const [speed, setSpeed]       = useState(speedMult)
  const [bgX, setBgX]           = useState(0)
  const [bursts, setBursts]     = useState([])

  const completedRef = useRef(0)
  const progRef      = useRef('')
  const carsRef      = useRef(cars)
  const popsRef      = useRef(0)
  const doneRef      = useRef(false)
  const speedRef     = useRef(speedMult)

  useEffect(() => { carsRef.current = cars }, [cars])

  // Reset on group/level change
  useEffect(() => {
    carId = 0
    const initial = Array.from({ length: 8 }, () => mkCar(group, wordTier))
    setCars(initial)
    carsRef.current = initial
    completedRef.current = 0
    progRef.current = ''
    popsRef.current = 0
    doneRef.current = false
    speedRef.current = speedMult
    setWordProg(''); setPops(0)
    setChugging(false); setSpeed(speedMult); setBgX(0); setBursts([])
  }, [group.id, level, wordTier, speedMult])

  // Highlight — runs when wordProg or pops changes
  useEffect(() => {
    const car = carsRef.current[completedRef.current]
    if (car) {
      const key = car.letter[progRef.current.length] || car.letter[0]
      onKeyHighlight(key)
    }
  }, [wordProg, pops, onKeyHighlight])

  // Scroll background
  useEffect(() => {
    let raf
    const loop = () => {
      setBgX(x => { const next = x - speedRef.current * 0.7; return next < -900 ? 0 : next })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const advanceCar = useCallback(() => {
    setChugging(true)
    setTimeout(() => setChugging(false), 380)
    setSmokeKey(k => k + 1)

    const newCompleted = completedRef.current + 1
    completedRef.current = newCompleted
    progRef.current = ''
    setWordProg('')

    const newSpeed = Math.min(speedRef.current + 0.08 * speedMult, 3.5 * speedMult)
    speedRef.current = newSpeed
    setSpeed(newSpeed)

    // Replenish cars
    setCars(prev => {
      if (prev.length - newCompleted < 6) {
        const extra = Array.from({ length: 5 }, () => mkCar(group, wordTier))
        const next = [...prev, ...extra]
        carsRef.current = next
        return next
      }
      return prev
    })

    // Burst near the engine/active car junction
    setBursts(prev => [...prev, { id: Date.now() + Math.random(), x: ENGINE_X + CAR_W + 20, y: 50 }])
    setTimeout(() => setBursts(prev => prev.slice(1)), 1100)

    audio.playChug()
    audio.playExplosion()

    const newPops = popsRef.current + 1
    popsRef.current = newPops
    setPops(newPops)
    onScore()

    if (newPops >= POPS_TO_WIN && !doneRef.current) {
      doneRef.current = true
      audio.playWhistle()
      setTimeout(() => onLevelComplete(), 700)
    }
  }, [group, wordTier, speedMult, audio, onScore, onLevelComplete])

  // Keyboard handler — registered once, reads from refs
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat || doneRef.current) return
      const key = e.key.length === 1 ? e.key : e.key.toLowerCase()
      if (key.length !== 1) return
      const car = carsRef.current[completedRef.current]
      if (!car) return
      const expected = car.letter[progRef.current.length]
      if (key === expected) {
        const newProg = progRef.current + key
        if (newProg.length >= car.letter.length) {
          advanceCar()
        } else {
          progRef.current = newProg
          setWordProg(newProg)
          audio.playLetter(key)
        }
      } else {
        setShaking(true)
        setTimeout(() => setShaking(false), 420)
        speedRef.current = Math.max(speedRef.current - 0.12, 0.3 * speedMult)
        setSpeed(s => Math.max(s - 0.12, 0.3 * speedMult))
        audio.playWrong()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advanceCar, audio])

  const progress  = Math.min((pops / POPS_TO_WIN) * 100, 100)
  const activeCar = carsRef.current[completedRef.current]

  // Speed bar segments (normalized to speedMult range)
  const speedNorm = Math.min(speed / (3.5 * speedMult), 1)

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,#0a0f2e 0%,#0f2048 45%,#1a3a6e 75%,#1e4080 100%)' }} />

      {[...Array(30)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white star-particle"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 19) % 55}%`,
            width: 1 + (i % 3), height: 1 + (i % 3),
            '--duration': `${2 + (i % 4)}s`, '--delay': `${(i * 0.4) % 5}s` }} />
      ))}

      <Cloud x={8}  y={5}  w={90} />
      <Cloud x={32} y={12} w={70} />
      <Cloud x={62} y={4}  w={110} />
      <Cloud x={82} y={14} w={65} />

      <div className="absolute bottom-20 left-0 right-0 overflow-hidden" style={{ height: 160 }}>
        <Mountains offset={bgX} />
        <Mountains offset={bgX + 900} />
      </div>

      <div className="absolute bottom-14 left-0 right-0 h-10"
        style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.3), rgba(22,163,74,0.4))' }} />

      <div className="absolute bottom-14 left-0 right-0 h-10 overflow-hidden">
        <div className="flex absolute bottom-0"
          style={{ gap: 60, transform: `translateX(${bgX % 60}px)`, width: '200%' }}>
          {[...Array(40)].map((_, i) => (
            <div key={i} className="shrink-0 w-2 h-8 rounded-t"
              style={{ background: 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="relative z-10 px-6 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-white/50 uppercase tracking-widest">Journey</span>
          <span className="text-xs font-black text-white/70">{pops} / {POPS_TO_WIN}</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #fb923c, #f59e0b)' }}
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }} />
        </div>
      </div>

      {/* Train scene */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence>
          {chugging && <Smoke key={smokeKey} />}
        </AnimatePresence>

        {bursts.map(b => <BigBurst key={b.id} x={b.x} y={b.y} color="#f59e0b" symbol="⭐" />)}

        <div className="absolute flex items-end" style={{ left: ENGINE_X, bottom: 24 }}>
          <Engine chugging={chugging} />

          <div className="flex items-end gap-1">
            <AnimatePresence mode="popLayout" initial={false}>
              {cars.slice(completedRef.current, completedRef.current + 5).map((car, i) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 26, mass: 0.8 }}
                >
                  <motion.div
                    animate={shaking && i === 0 ? { x: [-5, 5, -4, 4, 0] } : {}}
                    transition={{ duration: 0.42 }}>
                    <Car letter={car.letter} isActive={i === 0}
                      progress={i === 0 ? wordProg : ''} />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Rails */}
        <div className="absolute left-0 right-0 bottom-24 h-3"
          style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0,rgba(255,255,255,0.25) 24px, transparent 24px, transparent 44px)' }} />
        <div className="absolute left-0 right-0 h-0.5 bg-white/20" style={{ bottom: 88 }} />
        <div className="absolute left-0 right-0 h-0.5 bg-white/20" style={{ bottom: 84 }} />
      </div>

      {/* Bottom status */}
      <div className="shrink-0 px-6 py-2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-base">🚅</span>
          <div className="flex gap-0.5">
            {[0.25, 0.5, 0.75, 1].map(thresh => (
              <div key={thresh} className="w-4 h-1.5 rounded-full transition-all duration-300"
                style={{ background: speedNorm >= thresh ? '#fb923c' : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        </div>

        {activeCar && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white/30 uppercase tracking-widest">Type</span>
            <div className="flex gap-1">
              {activeCar.letter.split('').map((ch, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-base transition-all duration-150"
                  style={{
                    background: i < wordProg.length ? 'rgba(74,222,128,0.3)' : i === wordProg.length ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
                    border: i === wordProg.length ? '1.5px solid rgba(255,255,255,0.45)' : '1.5px solid rgba(255,255,255,0.1)',
                    color: i < wordProg.length ? '#4ade80' : 'white',
                  }}>
                  {ch.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
