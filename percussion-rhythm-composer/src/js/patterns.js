const TRACKS = [
  { id: 'muyu', name: '木鱼', icon: '🪵' },
  { id: 'gu', name: '堂鼓', icon: '🥁' },
  { id: 'luo', name: '铜锣', icon: '🔔' },
  { id: 'bo', name: '钹', icon: '🎵' }
];

const VELOCITY_VALUES = [0, 0.4, 0.7, 1.0];

const PATTERNS = {
  basic: {
    muyu: [3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0, 3, 0, 2, 0],
    gu:   [3, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0],
    luo:  [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
    bo:   [0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0]
  },
  festive: {
    muyu: [3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
    gu:   [3, 0, 3, 0, 2, 0, 3, 0, 3, 0, 3, 0, 2, 0, 3, 0],
    luo:  [3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0],
    bo:   [0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0]
  },
  'drum-solo': {
    muyu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    gu:   [3, 2, 3, 3, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 3],
    luo:  [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    bo:   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0]
  },
  gongs: {
    muyu: [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    gu:   [2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
    luo:  [3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0],
    bo:   [0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3]
  }
};

function createEmptyPattern(length) {
  const pattern = {};
  for (const track of TRACKS) {
    pattern[track.id] = new Array(length).fill(0);
  }
  return pattern;
}

function copyPattern(pattern) {
  const copy = {};
  for (const trackId in pattern) {
    copy[trackId] = [...pattern[trackId]];
  }
  return copy;
}

function getVelocity(level) {
  return VELOCITY_VALUES[Math.min(Math.max(level, 0), 3)];
}

export { TRACKS, PATTERNS, VELOCITY_VALUES, createEmptyPattern, copyPattern, getVelocity };
