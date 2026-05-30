import { useState, useCallback, useRef } from 'react'

export const ALL_ACHIEVEMENTS = [
  { id: 'first_pop',    emoji: '🎈', name: 'First Pop!',      desc: 'Pop your very first balloon' },
  { id: 'streak_5',    emoji: '🔥', name: 'On Fire!',         desc: 'Type 5 correct in a row' },
  { id: 'streak_10',   emoji: '⚡', name: 'Lightning Fast!',  desc: 'Type 10 correct in a row' },
  { id: 'stars_25',    emoji: '⭐', name: 'Star Collector',   desc: 'Earn 25 stars total' },
  { id: 'stars_50',    emoji: '💫', name: 'Star Shower!',     desc: 'Earn 50 stars total' },
  { id: 'stars_100',   emoji: '🌟', name: 'Galaxy Brain!',    desc: 'Earn 100 stars total' },
  { id: 'train_win',   emoji: '🚂', name: 'Train Engineer',   desc: 'Complete a Train Ride level' },
  { id: 'ocean_win',   emoji: '🐠', name: 'Ocean Explorer',   desc: 'Complete an Ocean Splash level' },
  { id: 'rainbow_win', emoji: '🌈', name: 'Rainbow Hunter',   desc: 'Complete a Rainbow Catch level' },
  { id: 'all_games',   emoji: '🎮', name: 'Game Master!',     desc: 'Complete all 4 game types' },
  { id: 'level_3',     emoji: '🏅', name: 'Level 3 Hero!',    desc: 'Reach Level 3' },
  { id: 'level_5',     emoji: '🏆', name: 'Champion!',        desc: 'Reach Level 5' },
  { id: 'level_10',    emoji: '🚀', name: 'Space Cadet!',     desc: 'Reach Level 10' },
  { id: 'all_groups',  emoji: '🌍', name: 'Explorer!',        desc: 'Try all 5 letter groups' },
  { id: 'perfect',     emoji: '💎', name: 'Flawless!',        desc: 'Complete a level with no mistakes' },
  { id: 'all_keys',    emoji: '⌨️',  name: 'Keyboard Hero!',  desc: 'Type every letter of the alphabet' },
]

function loadUnlocked() {
  try { return JSON.parse(localStorage.getItem('kq_achievements') || '[]') } catch { return [] }
}
function loadStats() {
  try { return JSON.parse(localStorage.getItem('kq_stats') || '{}') } catch { return {} }
}

export function useAchievements() {
  const [unlocked, setUnlocked] = useState(loadUnlocked)
  const [queue, setQueue] = useState([])
  const unlockedRef = useRef(loadUnlocked())

  const savedStats = loadStats()
  const statsRef = useRef({
    totalPops:    savedStats.totalPops    ?? 0,
    currentStreak: 0,
    bestStreak:   savedStats.bestStreak   ?? 0,
    stars:        savedStats.stars        ?? 0,
    trainWins:    savedStats.trainWins    ?? 0,
    oceanWins:    savedStats.oceanWins    ?? 0,
    rainbowWins:  savedStats.rainbowWins  ?? 0,
    balloonWins:  savedStats.balloonWins  ?? 0,
    level:        savedStats.level        ?? 1,
    perfectLevels:savedStats.perfectLevels?? 0,
    groupsTried:  new Set(savedStats.groupsTried ?? ['abcde']),
    keysTyped:    new Set(savedStats.keysTyped   ?? []),
  })

  const tryUnlock = useCallback((id) => {
    if (unlockedRef.current.includes(id)) return
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === id)
    if (!ach) return
    const next = [...unlockedRef.current, id]
    unlockedRef.current = next
    setUnlocked(next)
    localStorage.setItem('kq_achievements', JSON.stringify(next))
    setQueue(q => [...q, { ...ach, queueId: Date.now() + Math.random() }])
  }, [])

  const saveStats = useCallback(() => {
    const s = statsRef.current
    localStorage.setItem('kq_stats', JSON.stringify({
      totalPops: s.totalPops,
      bestStreak: s.bestStreak,
      stars: s.stars,
      trainWins: s.trainWins,
      oceanWins: s.oceanWins,
      rainbowWins: s.rainbowWins,
      balloonWins: s.balloonWins,
      level: s.level,
      groupsTried: [...s.groupsTried],
      perfectLevels: s.perfectLevels,
      keysTyped: [...s.keysTyped],
    }))
  }, [])

  const onCorrect = useCallback((key) => {
    const s = statsRef.current
    s.totalPops++
    s.currentStreak++
    if (s.currentStreak > s.bestStreak) s.bestStreak = s.currentStreak
    if (key) s.keysTyped.add(key)

    if (s.totalPops === 1) tryUnlock('first_pop')
    if (s.currentStreak >= 5)  tryUnlock('streak_5')
    if (s.currentStreak >= 10) tryUnlock('streak_10')
    if (s.keysTyped.size >= 26) tryUnlock('all_keys')
    saveStats()
  }, [tryUnlock, saveStats])

  const onWrong = useCallback(() => {
    statsRef.current.currentStreak = 0
  }, [])

  const onStar = useCallback((total) => {
    statsRef.current.stars = total
    if (total >= 25)  tryUnlock('stars_25')
    if (total >= 50)  tryUnlock('stars_50')
    if (total >= 100) tryUnlock('stars_100')
    saveStats()
  }, [tryUnlock, saveStats])

  const onLevelComplete = useCallback((game, level, perfect) => {
    const s = statsRef.current
    s.level = level
    if (game === 'balloon') s.balloonWins++
    if (game === 'train')   { s.trainWins++;   tryUnlock('train_win') }
    if (game === 'ocean')   { s.oceanWins++;   tryUnlock('ocean_win') }
    if (game === 'rainbow') { s.rainbowWins++; tryUnlock('rainbow_win') }
    if (perfect) { s.perfectLevels++; tryUnlock('perfect') }

    if (level >= 3)  tryUnlock('level_3')
    if (level >= 5)  tryUnlock('level_5')
    if (level >= 10) tryUnlock('level_10')

    if (s.balloonWins > 0 && s.trainWins > 0 && s.oceanWins > 0 && s.rainbowWins > 0)
      tryUnlock('all_games')
    saveStats()
  }, [tryUnlock, saveStats])

  const onGroup = useCallback((groupId) => {
    statsRef.current.groupsTried.add(groupId)
    if (statsRef.current.groupsTried.size >= 5) tryUnlock('all_groups')
    saveStats()
  }, [tryUnlock, saveStats])

  const dismissFirst = useCallback(() => {
    setQueue(q => q.slice(1))
  }, [])

  return {
    unlocked,
    allAchievements: ALL_ACHIEVEMENTS,
    queue,
    dismissFirst,
    onCorrect, onWrong, onStar, onLevelComplete, onGroup,
  }
}
