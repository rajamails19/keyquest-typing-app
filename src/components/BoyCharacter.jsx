import { motion } from 'framer-motion'
import { FINGER_COLORS, FINGER_HAND } from '../utils/fingerMap'

const LEFT_FINGERS  = ['leftPinky',  'leftRing',  'leftMiddle',  'leftIndex']
const RIGHT_FINGERS = ['rightIndex', 'rightMiddle','rightRing',   'rightPinky']

export default function BoyCharacter({ activeFinger }) {
  const activeHand  = activeFinger ? FINGER_HAND[activeFinger]   : null
  const activeColor = activeFinger ? FINGER_COLORS[activeFinger] : null

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <svg width="96" height="148" viewBox="0 0 96 148" fill="none">

        {/* ── HAIR ─────────────────────────────────────────── */}
        <path d="M16 46 Q18 22 48 20 Q78 22 80 46 Q75 32 48 30 Q21 32 16 46Z" fill="#2D1508" />
        {/* Side locks */}
        <path d="M16 46 Q12 55 15 65" stroke="#2D1508" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M80 46 Q84 55 81 65" stroke="#2D1508" strokeWidth="8" strokeLinecap="round" fill="none"/>

        {/* ── HEAD ─────────────────────────────────────────── */}
        <circle cx="48" cy="52" r="30" fill="#FFCD94" />

        {/* Ears */}
        <ellipse cx="18" cy="54" rx="5.5" ry="7" fill="#F5BA6E" />
        <ellipse cx="78" cy="54" rx="5.5" ry="7" fill="#F5BA6E" />
        <ellipse cx="18" cy="54" rx="3"   ry="4.5" fill="#ECA85A" />
        <ellipse cx="78" cy="54" rx="3"   ry="4.5" fill="#ECA85A" />

        {/* ── EYES ─────────────────────────────────────────── */}
        {/* Left eye */}
        <ellipse cx="36" cy="49" rx="8"   ry="9"   fill="white"   />
        <circle  cx="37" cy="50" r="5.5"  fill="#1C0A00" />
        <circle  cx="39" cy="48" r="2"    fill="white"   />
        <circle  cx="35" cy="52" r="1"    fill="white" opacity="0.6" />
        {/* Right eye */}
        <ellipse cx="60" cy="49" rx="8"   ry="9"   fill="white"   />
        <circle  cx="61" cy="50" r="5.5"  fill="#1C0A00" />
        <circle  cx="63" cy="48" r="2"    fill="white"   />
        <circle  cx="59" cy="52" r="1"    fill="white" opacity="0.6" />

        {/* Eyebrows */}
        <path d="M28 38 Q36 34 44 38" stroke="#2D1508" strokeWidth="3"  strokeLinecap="round" fill="none"/>
        <path d="M52 38 Q60 34 68 38" stroke="#2D1508" strokeWidth="3"  strokeLinecap="round" fill="none"/>

        {/* Nose */}
        <ellipse cx="48" cy="57" rx="4" ry="3" fill="#E8A067" />
        <circle cx="45.5" cy="57.5" r="1.2" fill="#D4864A" />
        <circle cx="50.5" cy="57.5" r="1.2" fill="#D4864A" />

        {/* ── MOUTH ────────────────────────────────────────── */}
        <path d="M37 66 Q48 75 59 66" stroke="#2D1508" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Teeth */}
        <path d="M40 67 Q48 72 56 67 Q48 71 40 67Z" fill="white" opacity="0.7"/>

        {/* Cheeks */}
        <ellipse cx="26" cy="62" rx="7.5" ry="5" fill="rgba(255,120,100,0.28)" />
        <ellipse cx="70" cy="62" rx="7.5" ry="5" fill="rgba(255,120,100,0.28)" />

        {/* ── NECK ─────────────────────────────────────────── */}
        <rect x="40" y="80" width="16" height="12" rx="5" fill="#FFCD94" />

        {/* ── BODY / T-SHIRT ───────────────────────────────── */}
        <rect x="18" y="90" width="60" height="52" rx="14" fill="#7C3AED" />
        {/* Collar */}
        <path d="M40 90 Q48 100 56 90" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
        {/* Stripe */}
        <rect x="18" y="104" width="60" height="5" rx="2.5" fill="rgba(255,255,255,0.18)" />

        {/* ── LEFT ARM ─────────────────────────────────────── */}
        <motion.rect
          x="1" y="93" width="17" height="34" rx="8.5"
          fill={activeHand === 'left' ? '#FFE4B5' : '#FFCD94'}
          style={activeHand === 'left' && activeColor
            ? { filter: `drop-shadow(0 0 8px ${activeColor})` }
            : {}}
          animate={activeHand === 'left' ? { y: [93, 89, 93] } : { y: 93 }}
          transition={{ duration: 0.55, repeat: activeHand === 'left' ? Infinity : 0, ease: 'easeInOut' }}
        />
        {/* Left palm */}
        <ellipse cx="9.5" cy="130" rx="9" ry="7" fill="#FFCD94" />

        {/* Left fingers */}
        {LEFT_FINGERS.map((fname, i) => {
          const on = fname === activeFinger
          return (
            <motion.rect
              key={fname}
              x={1 + i * 5}
              y={on ? 122 : 126}
              width={4} height={on ? 12 : 8} rx={2}
              fill={FINGER_COLORS[fname]}
              opacity={on ? 1 : 0.55}
              style={on ? { filter: `drop-shadow(0 0 5px ${FINGER_COLORS[fname]})` } : {}}
              animate={on ? { y: [126, 122, 126] } : {}}
              transition={{ duration: 0.55, repeat: on ? Infinity : 0 }}
            />
          )
        })}

        {/* ── RIGHT ARM ────────────────────────────────────── */}
        <motion.rect
          x="78" y="93" width="17" height="34" rx="8.5"
          fill={activeHand === 'right' ? '#FFE4B5' : '#FFCD94'}
          style={activeHand === 'right' && activeColor
            ? { filter: `drop-shadow(0 0 8px ${activeColor})` }
            : {}}
          animate={activeHand === 'right' ? { y: [93, 89, 93] } : { y: 93 }}
          transition={{ duration: 0.55, repeat: activeHand === 'right' ? Infinity : 0, ease: 'easeInOut' }}
        />
        {/* Right palm */}
        <ellipse cx="86.5" cy="130" rx="9" ry="7" fill="#FFCD94" />

        {/* Right fingers */}
        {RIGHT_FINGERS.map((fname, i) => {
          const on = fname === activeFinger
          return (
            <motion.rect
              key={fname}
              x={77 + i * 5}
              y={on ? 122 : 126}
              width={4} height={on ? 12 : 8} rx={2}
              fill={FINGER_COLORS[fname]}
              opacity={on ? 1 : 0.55}
              style={on ? { filter: `drop-shadow(0 0 5px ${FINGER_COLORS[fname]})` } : {}}
              animate={on ? { y: [126, 122, 126] } : {}}
              transition={{ duration: 0.55, repeat: on ? Infinity : 0 }}
            />
          )
        })}
      </svg>

      {/* Active finger pill */}
      {activeFinger && (
        <motion.div
          key={activeFinger}
          initial={{ opacity: 0, scale: 0.7, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: `${activeColor}22`,
            border: `1.5px solid ${activeColor}55`,
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: activeColor }} />
          <span className="text-[10px] font-black" style={{ color: activeColor }}>
            {activeFinger
              .replace('left',  'L ')
              .replace('right', 'R ')
              .replace(/([A-Z])/g, ' $1')
              .trim()}
          </span>
        </motion.div>
      )}
    </div>
  )
}
