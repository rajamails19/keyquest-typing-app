import { motion } from 'framer-motion'
import { KEYBOARD_ROWS, KEY_FINGER_MAP, FINGER_COLORS, SHIFT_TO_BASE } from '../utils/fingerMap'

const ROW_OFFSETS = [0, 0, 0.55, 1.1]
const KEY_SIZE    = 40
const KEY_GAP     = 5
const MONK_SIZE   = 40

export default function KeyboardViz({ activeKey }) {
  const normalizedActive = activeKey
    ? (SHIFT_TO_BASE[activeKey] ?? activeKey.toLowerCase())
    : null

  return (
    <div className="flex flex-col items-center gap-[5px] select-none">
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex"
          style={{
            gap:         KEY_GAP,
            paddingLeft: ROW_OFFSETS[rowIdx] * (KEY_SIZE + KEY_GAP),
            overflow:    'visible',
          }}
        >
          {row.map((key) => {
            const finger   = KEY_FINGER_MAP[key]
            const color    = finger ? FINGER_COLORS[finger] : 'rgba(255,255,255,0.25)'
            const isActive = key === normalizedActive

            return (
              <motion.div
                key={key}
                className="relative flex items-center justify-center rounded-lg font-black text-xs select-none"
                style={{
                  width:      KEY_SIZE,
                  height:     KEY_SIZE,
                  overflow:   'visible',
                  background: isActive ? color : `${color}1e`,
                  border:     isActive
                    ? `2px solid ${color}`
                    : `1.5px solid ${color}44`,
                  color:      isActive ? '#fff' : `${color}cc`,
                  boxShadow:  isActive
                    ? `0 0 16px ${color}aa, 0 0 36px ${color}44, inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 0 rgba(0,0,0,0.35)`
                    : `0 3px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)`,
                  textShadow: isActive ? '0 1px 4px rgba(0,0,0,0.6)' : 'none',
                  transform:  isActive ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                  zIndex:     isActive ? 2 : 1,
                }}
                animate={isActive ? { scale: [1, 1.18, 1.08] } : { scale: 1 }}
                transition={isActive
                  ? { duration: 0.22, type: 'spring', stiffness: 500, damping: 18 }
                  : { duration: 0.18 }}
              >
                {key.toUpperCase()}

                {/* Pulsing glow ring */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{ border: `2px solid ${color}`, boxShadow: `0 0 10px ${color}` }}
                    animate={{ opacity: [0.8, 0.2, 0.8], scale: [1, 1.25, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                )}

                {/* Monk/character floating above the active key */}
                {isActive && (
                  <motion.div
                    layoutId="keyPointer"
                    className="absolute pointer-events-none flex flex-col items-center"
                    style={{
                      bottom:       '100%',
                      left:         '50%',
                      marginLeft:   -(MONK_SIZE / 2),
                      marginBottom: 5,
                      zIndex:       50,
                    }}
                    transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                  >
                    <motion.img
                      src="/monk.png"
                      alt=""
                      style={{ width: MONK_SIZE, height: MONK_SIZE }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div
                      style={{
                        width:        0,
                        height:       0,
                        borderLeft:   '4px solid transparent',
                        borderRight:  '4px solid transparent',
                        borderTop:    `5px solid ${color}`,
                        marginTop:    2,
                        filter:       `drop-shadow(0 0 4px ${color})`,
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      ))}

      {/* Space bar */}
      <div
        className="rounded-lg mt-1"
        style={{
          width:      240,
          height:     20,
          background: 'rgba(255,255,255,0.07)',
          border:     '1.5px solid rgba(255,255,255,0.14)',
          boxShadow:  '0 3px 0 rgba(0,0,0,0.25)',
        }}
      />
    </div>
  )
}
