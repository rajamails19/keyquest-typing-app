export const FINGER_COLORS = {
  leftPinky:  '#f87171',
  leftRing:   '#fb923c',
  leftMiddle: '#fbbf24',
  leftIndex:  '#4ade80',
  rightIndex: '#60a5fa',
  rightMiddle:'#a78bfa',
  rightRing:  '#f472b6',
  rightPinky: '#34d399',
}

export const FINGER_LABELS = {
  leftPinky:  'Left Pinky',
  leftRing:   'Left Ring',
  leftMiddle: 'Left Middle',
  leftIndex:  'Left Index',
  rightIndex: 'Right Index',
  rightMiddle:'Right Middle',
  rightRing:  'Right Ring',
  rightPinky: 'Right Pinky',
}

export const KEY_FINGER_MAP = {
  // Number row (left)
  '`': 'leftPinky', '1': 'leftPinky',
  '2': 'leftRing',
  '3': 'leftMiddle',
  '4': 'leftIndex', '5': 'leftIndex',
  // Number row (right)
  '6': 'rightIndex', '7': 'rightIndex',
  '8': 'rightMiddle',
  '9': 'rightRing',
  '0': 'rightPinky', '-': 'rightPinky', '=': 'rightPinky',
  // Shifted number row (symbols — same finger as the base key)
  '!': 'leftPinky',
  '@': 'leftRing',
  '#': 'leftMiddle',
  '$': 'leftIndex', '%': 'leftIndex',
  '^': 'rightIndex', '&': 'rightIndex',
  '*': 'rightMiddle',
  '(': 'rightRing',
  ')': 'rightPinky',
  // Extra punctuation keys
  '[': 'rightPinky', ']': 'rightPinky', '\\': 'rightPinky',

  // Top row
  'q': 'leftPinky',
  'w': 'leftRing',
  'e': 'leftMiddle',
  'r': 'leftIndex', 't': 'leftIndex',
  'y': 'rightIndex', 'u': 'rightIndex',
  'i': 'rightMiddle',
  'o': 'rightRing',
  'p': 'rightPinky',

  // Home row
  'a': 'leftPinky',
  's': 'leftRing',
  'd': 'leftMiddle',
  'f': 'leftIndex', 'g': 'leftIndex',
  'h': 'rightIndex', 'j': 'rightIndex',
  'k': 'rightMiddle',
  'l': 'rightRing',
  ';': 'rightPinky', "'": 'rightPinky',

  // Bottom row
  'z': 'leftPinky',
  'x': 'leftRing',
  'c': 'leftMiddle',
  'v': 'leftIndex', 'b': 'leftIndex',
  'n': 'rightIndex', 'm': 'rightIndex',
  ',': 'rightMiddle',
  '.': 'rightRing',
  '/': 'rightPinky',
}

// Keyboard layout rows (what to render)
export const KEYBOARD_ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l',';'],
  ['z','x','c','v','b','n','m',',','.','/'],
]

// Map shifted symbols → base key (so keyboard can highlight base key when target is a shift-symbol)
export const SHIFT_TO_BASE = {
  '!':'1','@':'2','#':'3','$':'4','%':'5',
  '^':'6','&':'7','*':'8','(':'9',')':'0',
}

// Which hand side each finger belongs to
export const FINGER_HAND = {
  leftPinky:  'left',
  leftRing:   'left',
  leftMiddle: 'left',
  leftIndex:  'left',
  rightIndex: 'right',
  rightMiddle:'right',
  rightRing:  'right',
  rightPinky: 'right',
}

// Finger position for hand SVG (0=pinky, 1=ring, 2=middle, 3=index)
export const FINGER_POSITION = {
  leftPinky:  0,
  leftRing:   1,
  leftMiddle: 2,
  leftIndex:  3,
  rightIndex: 3,
  rightMiddle:2,
  rightRing:  1,
  rightPinky: 0,
}
