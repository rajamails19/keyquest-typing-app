import { motion } from 'framer-motion'

const CATEGORIES = ['letters', 'numbers', 'symbols']

const CATEGORY_META = {
  letters: { label: 'ABC',  icon: '✦'  },
  numbers: { label: '123',  icon: '🔢' },
  symbols: { label: 'SYM',  icon: '✨' },
}

export default function LetterGroupTabs({ groups, activeGroupId, onChange }) {
  const sections = CATEGORIES
    .map(cat => ({ cat, items: groups.filter(g => g.category === cat) }))
    .filter(s => s.items.length > 0)

  return (
    <div
      className="relative z-10 flex items-center shrink-0 overflow-x-auto"
      style={{
        height:       58,
        paddingLeft:  12,
        paddingRight: 40,           /* leaves room for right fade */
        gap:          0,
        background:   'rgba(3,1,18,0.62)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        scrollbarWidth: 'none',
      }}
    >
      {sections.map(({ cat, items }, sIdx) => (
        <div key={cat} className="flex items-center shrink-0">

          {/* Category divider + badge */}
          {sIdx > 0 && (
            <div className="flex items-center shrink-0 mx-2.5 gap-2">
              <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span style={{ fontSize: 10 }}>{CATEGORY_META[cat].icon}</span>
                <span
                  className="font-black uppercase tracking-widest"
                  style={{ fontSize: 8, color: 'rgba(255,255,255,0.38)' }}
                >
                  {CATEGORY_META[cat].label}
                </span>
              </div>
            </div>
          )}

          {/* Group tabs */}
          <div className="flex items-center gap-1.5 py-1">
            {items.map(group => {
              const isActive = group.id === activeGroupId
              return (
                <motion.button
                  key={group.id}
                  onClick={() => onChange(group.id)}
                  className="relative flex items-center gap-2 rounded-xl font-black shrink-0 overflow-hidden"
                  style={{
                    padding:  isActive ? '6px 16px' : '6px 14px',
                    color:    isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                    outline:  'none',
                    border:   'none',
                    minWidth: 0,
                  }}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                >
                  {/* ── Active background ─────────────────────────────── */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 rounded-xl tab-shimmer"
                      style={{
                        background: `linear-gradient(135deg, ${group.gradient[0]}, ${group.gradient[1]})`,
                        boxShadow:  `0 4px 20px ${group.bgGlow}, 0 0 0 1.5px rgba(255,255,255,0.22)`,
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}

                  {/* ── Hover ghost ───────────────────────────────────── */}
                  {!isActive && (
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    />
                  )}

                  {/* ── Emoji ─────────────────────────────────────────── */}
                  <motion.span
                    className="relative z-10"
                    style={{ fontSize: isActive ? 17 : 15 }}
                    animate={isActive ? { y: [0, -2, 0] } : {}}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {group.emoji}
                  </motion.span>

                  {/* ── Label ─────────────────────────────────────────── */}
                  <span
                    className="relative z-10 tracking-wide"
                    style={{ fontSize: isActive ? 13 : 12, fontWeight: 900 }}
                  >
                    {group.short}
                  </span>

                  {/* ── Active dot pulse ─────────────────────────────── */}
                  {isActive && (
                    <motion.span
                      className="relative z-10 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: 'rgba(255,255,255,0.8)' }}
                      animate={{ opacity: [1, 0.2, 1], scale: [1, 0.7, 1] }}
                      transition={{ duration: 1.3, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Right fade edge */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-12"
        style={{ background: 'linear-gradient(to left, rgba(3,1,18,0.95), transparent)' }}
      />
    </div>
  )
}
