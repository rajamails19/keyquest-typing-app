/* ─── Difficulty levels ──────────────────────────────────────────────────── */
export const DIFFICULTY_LEVELS = [
  {
    id: 'easy',
    label: 'Easy',
    emoji: '🌱',
    color: '#4ade80',
    colorDark: '#16a34a',
    wordTier: 1,          // single letters / single chars
    speedMult: 0.6,       // slower
  },
  {
    id: 'medium',
    label: 'Medium',
    emoji: '🔥',
    color: '#fb923c',
    colorDark: '#ea580c',
    wordTier: 2,          // short 2-3 char words
    speedMult: 1.0,
  },
  {
    id: 'pro',
    label: 'Pro',
    emoji: '⚡',
    color: '#a78bfa',
    colorDark: '#7c3aed',
    wordTier: 3,          // 3-5 char words
    speedMult: 1.55,      // faster
  },
]

/* ─── Letter groups ──────────────────────────────────────────────────────── */
export const LETTER_GROUPS = [
  {
    id: 'abcde',
    category: 'letters',
    label: 'A · B · C · D · E',
    short: 'A–E',
    emoji: '🌸',
    letters: ['a', 'b', 'c', 'd', 'e'],
    color: '#f87171',
    colorDark: '#dc2626',
    gradient: ['#f87171', '#fb7185'],
    bgGlow: 'rgba(248, 113, 113, 0.25)',
    words: {
      1: ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e'],
      2: ['ab', 'ace', 'add', 'bad', 'bed', 'cab', 'dab', 'dad'],
      3: ['bead', 'dead', 'babe', 'cede', 'aced', 'deed', 'cafe', 'dab'],
    },
  },
  {
    id: 'fghij',
    category: 'letters',
    label: 'F · G · H · I · J',
    short: 'F–J',
    emoji: '🌈',
    letters: ['f', 'g', 'h', 'i', 'j'],
    color: '#fb923c',
    colorDark: '#ea580c',
    gradient: ['#fb923c', '#fbbf24'],
    bgGlow: 'rgba(251, 146, 60, 0.25)',
    words: {
      1: ['f', 'g', 'h', 'i', 'j', 'f', 'g', 'h', 'i', 'j'],
      2: ['fig', 'jig', 'gig', 'if', 'hi', 'fig', 'jig'],
      3: ['high', 'hifi', 'jig', 'fig', 'gig', 'if', 'hi'],
    },
  },
  {
    id: 'klmno',
    category: 'letters',
    label: 'K · L · M · N · O',
    short: 'K–O',
    emoji: '🌙',
    letters: ['k', 'l', 'm', 'n', 'o'],
    color: '#4ade80',
    colorDark: '#16a34a',
    gradient: ['#4ade80', '#34d399'],
    bgGlow: 'rgba(74, 222, 128, 0.25)',
    words: {
      1: ['k', 'l', 'm', 'n', 'o', 'k', 'l', 'm', 'n', 'o'],
      2: ['no', 'ok', 'on', 'mom', 'moo', 'look', 'moon', 'nook'],
      3: ['monk', 'loon', 'melon', 'lemon', 'nook', 'moon', 'look'],
    },
  },
  {
    id: 'pqrst',
    category: 'letters',
    label: 'P · Q · R · S · T',
    short: 'P–T',
    emoji: '🚀',
    letters: ['p', 'q', 'r', 's', 't'],
    color: '#60a5fa',
    colorDark: '#2563eb',
    gradient: ['#60a5fa', '#818cf8'],
    bgGlow: 'rgba(96, 165, 250, 0.25)',
    words: {
      1: ['p', 'q', 'r', 's', 't', 'p', 'r', 's', 't', 'p'],
      2: ['top', 'tip', 'pot', 'rip', 'sir', 'pit', 'port'],
      3: ['trip', 'stop', 'rust', 'test', 'sport', 'strip', 'twist'],
    },
  },
  {
    id: 'uvwxyz',
    category: 'letters',
    label: 'U · V · W · X · Y · Z',
    short: 'U–Z',
    emoji: '⚡',
    letters: ['u', 'v', 'w', 'x', 'y', 'z'],
    color: '#a78bfa',
    colorDark: '#7c3aed',
    gradient: ['#a78bfa', '#c084fc'],
    bgGlow: 'rgba(167, 139, 250, 0.25)',
    words: {
      1: ['u', 'v', 'w', 'x', 'y', 'z', 'u', 'v', 'w', 'y'],
      2: ['yew', 'you', 'vow', 'wow', 'yes', 'zoo', 'wuv'],
      3: ['buzz', 'fuzz', 'yew', 'view', 'vibe', 'wavy', 'fuzzy'],
    },
  },
]

/* ─── Number groups ──────────────────────────────────────────────────────── */
export const NUMBER_GROUPS = [
  {
    id: 'num1',
    category: 'numbers',
    label: '1 · 2 · 3 · 4 · 5',
    short: '1–5',
    emoji: '🔢',
    letters: ['1', '2', '3', '4', '5'],
    color: '#f59e0b',
    colorDark: '#d97706',
    gradient: ['#f59e0b', '#fbbf24'],
    bgGlow: 'rgba(245, 158, 11, 0.25)',
    words: {
      1: ['1', '2', '3', '4', '5', '1', '2', '3', '4', '5'],
      2: ['12', '23', '34', '45', '51', '21', '43', '32'],
      3: ['123', '234', '345', '451', '512', '321', '432'],
    },
  },
  {
    id: 'num2',
    category: 'numbers',
    label: '6 · 7 · 8 · 9 · 0',
    short: '6–0',
    emoji: '🔢',
    letters: ['6', '7', '8', '9', '0'],
    color: '#06b6d4',
    colorDark: '#0891b2',
    gradient: ['#06b6d4', '#38bdf8'],
    bgGlow: 'rgba(6, 182, 212, 0.25)',
    words: {
      1: ['6', '7', '8', '9', '0', '6', '7', '8', '9', '0'],
      2: ['67', '78', '89', '90', '76', '87', '98', '69'],
      3: ['678', '789', '890', '907', '076', '876', '987'],
    },
  },
]

/* ─── Symbol groups ──────────────────────────────────────────────────────── */
export const SYMBOL_GROUPS = [
  {
    id: 'sym1',
    category: 'symbols',
    label: 'Dot · Comma · Slash',
    short: '. , /',
    emoji: '🎯',
    letters: ['.', ',', ';', "'", '/'],
    color: '#f472b6',
    colorDark: '#db2777',
    gradient: ['#f472b6', '#fb7185'],
    bgGlow: 'rgba(244, 114, 182, 0.25)',
    words: {
      1: ['.', ',', ';', "'", '/', '.', ',', ';'],
      2: ['.,', ".'", ',;', '/,', "';"],
      3: [".,;", "',.", ";',", './;'],
    },
  },
  {
    id: 'sym2',
    category: 'symbols',
    label: 'Dash · Equals · Brackets',
    short: '- = [ ]',
    emoji: '🔑',
    letters: ['-', '=', '[', ']'],
    color: '#34d399',
    colorDark: '#059669',
    gradient: ['#34d399', '#4ade80'],
    bgGlow: 'rgba(52, 211, 153, 0.25)',
    words: {
      1: ['-', '=', '[', ']', '-', '=', '[', ']', '-', '='],
      2: ['[-', '-]', '[]', '=-', '-='],
      3: ['[-]', '-[=', '[]=', '=[-]'],
    },
  },
  {
    id: 'sym3',
    category: 'symbols',
    label: '! · @ · # · $',
    short: '! @ #',
    emoji: '⭐',
    letters: ['!', '@', '#', '$', '%'],
    color: '#fbbf24',
    colorDark: '#d97706',
    gradient: ['#fbbf24', '#f59e0b'],
    bgGlow: 'rgba(251, 191, 36, 0.25)',
    words: {
      1: ['!', '@', '#', '$', '%', '!', '@', '#', '$', '%'],
      2: ['!@', '@#', '#$', '$%', '!%'],
      3: ['!@#', '@#$', '#$%', '!@%'],
    },
  },
]

/* ─── Combined ───────────────────────────────────────────────────────────── */
export const ALL_GROUPS = [...LETTER_GROUPS, ...NUMBER_GROUPS, ...SYMBOL_GROUPS]

export const BALLOON_COLORS = [
  '#fda4af', '#93c5fd', '#fde68a', '#fdba74',
  '#6ee7b7', '#c4b5fd', '#f9a8d4', '#a5f3fc',
]

export const GAMES = [
  {
    id: 'balloon',
    name: 'Balloon Pop',
    emoji: '🎈',
    desc: 'Pop flying balloons!',
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.4)',
  },
  {
    id: 'train',
    name: 'Train Ride',
    emoji: '🚂',
    desc: 'Keep the train rolling!',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'ocean',
    name: 'Ocean Splash',
    emoji: '🐠',
    desc: 'Splash the fish!',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  {
    id: 'rainbow',
    name: 'Rainbow Catch',
    emoji: '🌈',
    desc: 'Catch shooting stars!',
    color: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.4)',
  },
]
