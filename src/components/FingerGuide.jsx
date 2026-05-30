import { motion, AnimatePresence } from 'framer-motion'
import { KEY_FINGER_MAP, FINGER_COLORS, FINGER_HAND } from '../utils/fingerMap'
import KeyboardViz from './KeyboardViz'

const LEFT_FINGERS  = ['leftPinky', 'leftRing', 'leftMiddle', 'leftIndex']
const RIGHT_FINGERS = ['rightIndex', 'rightMiddle', 'rightRing', 'rightPinky']

const FINGER_HEIGHTS = {
  leftPinky:   38, leftRing:    48, leftMiddle:  52, leftIndex:   46,
  rightIndex:  46, rightMiddle: 52, rightRing:   48, rightPinky:  38,
}

function FlatHand({ side, activeFinger }) {
  const fingers = side === 'left' ? LEFT_FINGERS : RIGHT_FINGERS
  return (
    <div className="flex flex-col items-center gap-0 shrink-0">
      <div className="flex gap-1.5 items-end" style={{ height: 60 }}>
        {fingers.map((fname) => {
          const isActive = fname === activeFinger
          const color = FINGER_COLORS[fname]
          const h = FINGER_HEIGHTS[fname]
          return (
            <motion.div
              key={fname}
              className="rounded-t-full"
              style={{
                width: 14, height: h,
                background: isActive ? color : `${color}28`,
                boxShadow: isActive ? `0 0 14px ${color}99, 0 0 28px ${color}44` : 'none',
                border: `1.5px solid ${isActive ? color : color + '55'}`,
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
              animate={isActive ? { y: -6, scaleY: 1.06 } : { y: 0, scaleY: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            />
          )
        })}
      </div>
      <div
        className="rounded-b-2xl rounded-t-sm"
        style={{
          width: 76, height: 20,
          background: 'rgba(255,255,255,0.07)',
          border: '1.5px solid rgba(255,255,255,0.12)',
        }}
      />
      <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mt-1">
        {side}
      </div>
    </div>
  )
}

/* ── Mascot image — reused for both sides ────────────────────── */
function Mascot({ flip = false, delay = 0 }) {
  return (
    <motion.img
      src="/girl-mascot.png"
      alt="mascot"
      className="shrink-0 pointer-events-none select-none"
      style={{
        height:      190,
        width:       'auto',
        objectFit:   'contain',
        alignSelf:   'flex-end',
        transform:   flip ? 'scaleX(-1)' : 'none',
        filter:      'drop-shadow(0 -6px 18px rgba(167,139,250,0.4))',
      }}
      animate={{ y: [0, -7, 0] }}
      transition={{
        duration: 3.4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

export default function FingerGuide({ activeKey }) {
  const finger = activeKey ? KEY_FINGER_MAP[activeKey.toLowerCase()] : null
  const hand   = finger   ? FINGER_HAND[finger] : null

  return (
    <div
      className="relative z-10 shrink-0"
      style={{
        background:           'rgba(0,0,0,0.4)',
        backdropFilter:       'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop:            '1px solid rgba(255,255,255,0.07)',
        minHeight:            195,
        overflow:             'visible',
      }}
    >
      {/* ── "Press X!" speech bubble — centred above keyboard ── */}
      <AnimatePresence>
        {activeKey && (
          <motion.div
            key={activeKey}
            className="absolute pointer-events-none select-none"
            style={{
              bottom:          200,
              left:            '50%',
              transform:       'translateX(-50%)',
              zIndex:          40,
              background:      'rgba(124,58,237,0.92)',
              color:           '#fff',
              fontSize:        11,
              fontWeight:      900,
              padding:         '4px 12px',
              borderRadius:    20,
              letterSpacing:   '0.04em',
              boxShadow:       '0 2px 16px rgba(124,58,237,0.55)',
              whiteSpace:      'nowrap',
            }}
            initial={{ opacity: 0, y: 8,  scale: 0.8 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{   opacity: 0, y: -6,  scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            Press&nbsp;
            <span style={{ fontSize: 14, textTransform: 'uppercase' }}>
              {activeKey}
            </span>
            &nbsp;!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main row: mascot · left hand · keyboard · right hand · mascot ── */}
      <div
        className="flex items-center justify-center gap-4 px-4 py-3"
        style={{ minHeight: 195 }}
      >
        {/* Left girl — normal orientation */}
        <Mascot flip={false} delay={0} />

        <FlatHand side="left"  activeFinger={hand === 'left'  ? finger : null} />
        <KeyboardViz activeKey={activeKey} />
        <FlatHand side="right" activeFinger={hand === 'right' ? finger : null} />

        {/* Right girl — mirrored, slightly offset phase */}
        <Mascot flip={true} delay={0.9} />
      </div>
    </div>
  )
}
