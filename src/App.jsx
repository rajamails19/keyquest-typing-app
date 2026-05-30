import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import LetterGroupTabs from './components/LetterGroupTabs'
import GameSelector from './components/GameSelector'
import BalloonPop from './components/BalloonPop'
import TrainRide from './components/TrainRide'
import OceanSplash from './components/OceanSplash'
import RainbowCatch from './components/RainbowCatch'
import FingerGuide from './components/FingerGuide'
import CelebrationOverlay from './components/CelebrationOverlay'
import AchievementToast from './components/AchievementToast'
import StarsBackground from './components/StarsBackground'
import { useAudio } from './hooks/useAudio'
import { useAchievements } from './hooks/useAchievements'
import { ALL_GROUPS } from './data/letterGroups'

export default function App() {
  const [activeGroupId, setActiveGroupId] = useState('abcde')
  const [activeGame, setActiveGame]       = useState('balloon')
  const [stars, setStars]                 = useState(0)
  const [level, setLevel]                 = useState(1)
  const [showCelebration, setShowCelebration] = useState(false)
  const [activeKey, setActiveKey]         = useState(null)
  const [gameKey, setGameKey]             = useState(0)
  const [mistakesThisLevel, setMistakesThisLevel] = useState(0)
  const [difficulty, setDifficulty]       = useState('medium')

  const audio = useAudio()
  const ach   = useAchievements()

  const activeGroup = ALL_GROUPS.find(g => g.id === activeGroupId)

  const handleScore = useCallback(() => {
    setStars(s => {
      const next = s + 1
      ach.onStar(next)
      return next
    })
    ach.onCorrect(activeKey)
  }, [ach, activeKey])

  const handleWrong = useCallback(() => {
    setMistakesThisLevel(m => m + 1)
    ach.onWrong()
  }, [ach])

  const handleLevelComplete = useCallback(() => {
    const perfect = mistakesThisLevel === 0
    setShowCelebration(true)
    audio.playCelebration()
    const nextLevel = level + 1
    ach.onLevelComplete(activeGame, nextLevel, perfect)
    setTimeout(() => {
      setShowCelebration(false)
      setLevel(nextLevel)
      setGameKey(k => k + 1)
      setMistakesThisLevel(0)
    }, 3400)
  }, [audio, ach, level, activeGame, mistakesThisLevel])

  const handleGroupChange = useCallback((id) => {
    setActiveGroupId(id)
    setGameKey(k => k + 1)
    setMistakesThisLevel(0)
    ach.onGroup(id)
  }, [ach])

  const handleGameChange = useCallback((id) => {
    setActiveGame(id)
    setGameKey(k => k + 1)
    setMistakesThisLevel(0)
  }, [])

  const handleDifficultyChange = useCallback((id) => {
    setDifficulty(id)
    setGameKey(k => k + 1)
    setMistakesThisLevel(0)
  }, [])

  const handleKeyHighlight = useCallback((key) => {
    setActiveKey(key)
  }, [])

  const gameProps = {
    group: activeGroup,
    level,
    difficulty,
    onScore:  handleScore,
    onWrong:  handleWrong,
    onLevelComplete: handleLevelComplete,
    onKeyHighlight:  handleKeyHighlight,
    audio,
  }

  return (
    <div className="relative flex flex-col h-screen overflow-hidden font-nunito">
      <StarsBackground />

      <div className="relative z-10 flex flex-col h-full min-h-0">
        <Header stars={stars} level={level}
          achievementsUnlocked={ach.unlocked.length}
          achievementsTotal={ach.allAchievements.length}
        />
        <LetterGroupTabs
          groups={ALL_GROUPS}
          activeGroupId={activeGroupId}
          onChange={handleGroupChange}
        />

        {/* Main layout */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left sidebar */}
          <aside className="w-44 shrink-0 overflow-y-auto"
            style={{
              background: 'rgba(0,0,0,0.22)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
            }}>
            <GameSelector
              activeGame={activeGame}
              onChange={handleGameChange}
              difficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
            />
          </aside>

          {/* Game area */}
          <main className="flex-1 overflow-hidden relative"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 70%)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeGame}-${activeGroupId}-${gameKey}`}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {activeGame === 'balloon' && <BalloonPop   {...gameProps} />}
                {activeGame === 'train'   && <TrainRide    {...gameProps} />}
                {activeGame === 'ocean'   && <OceanSplash  {...gameProps} />}
                {activeGame === 'rainbow' && <RainbowCatch {...gameProps} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Finger guide */}
        <FingerGuide activeKey={activeKey} />
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && <CelebrationOverlay key="cel" />}
      </AnimatePresence>

      {/* Achievement toast */}
      <AchievementToast
        achievement={ach.queue[0] || null}
        onDismiss={ach.dismissFirst}
      />
    </div>
  )
}
