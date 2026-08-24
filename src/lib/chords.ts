export const KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export const SUFFIX_ORDER = [
  'major', 'minor', '7', 'maj7', 'm7', 'm7b5', 'dim', 'dim7', 'aug',
  'sus2', 'sus4', '6', 'm6', '69', '9', 'add9', 'm9', 'maj9', '7sus4', '5',
] as const;

export type ChordSuffix = (typeof SUFFIX_ORDER)[number];

export const SUFFIX_DISPLAY: Record<string, string> = {
  major: '',
  minor: 'm',
  7: '7',
  maj7: 'maj7',
  m7: 'm7',
  m7b5: 'm7♭5',
  dim: 'dim',
  dim7: 'dim7',
  aug: 'aug',
  sus2: 'sus2',
  sus4: 'sus4',
  6: '6',
  m6: 'm6',
  69: '6/9',
  9: '9',
  add9: 'add9',
  m9: 'm9',
  maj9: 'maj9',
  '7sus4': '7sus4',
  5: '5',
};

// 别名 -> 规范后缀(查询用;匹配时先原样查、再转小写查)
export const SUFFIX_ALIASES: Record<string, string[]> = {
  major: ['', 'maj', 'M', '大'],
  minor: ['m', 'min', '小'],
  7: ['dom7', '属七'],
  maj7: ['M7', 'ma7', 'mmaj7', '大七'],
  m7: ['min7', 'mi7', '小七'],
  m7b5: ['ø', 'ø7', '半减七'],
  dim: ['°', 'o', '减'],
  dim7: ['°7', 'o7', '减七'],
  aug: ['+', '增'],
  sus2: ['挂2', '挂二'],
  sus4: ['sus', '挂4', '挂四'],
  6: ['add6'],
  m6: ['min6'],
  69: ['6/9'],
  9: ['dom9'],
  add9: ['add2', '2'],
  m9: ['min9'],
  maj9: ['M9', 'ma9'],
  '7sus4': ['7sus', 'sus7'],
  5: ['强五'],
};

export function chordName(key: string, suffix: string): string {
  return key + (SUFFIX_DISPLAY[suffix] ?? suffix);
}

export function anchorId(key: string, suffix: string): string {
  return `${key.toLowerCase()}-${suffix}`;
}

export interface ChordPosition {
  frets: number[];
  fingers: number[];
  baseFret: number;
  barres: number[];
  capo?: boolean;
}

export interface ChordEntry {
  key: string;
  suffix: string;
  positions: ChordPosition[];
}

/** 构建期生成查询索引与别名映射(序列化为 JSON 内嵌到页面) */
export function buildSearchData(chords: ChordEntry[]) {
  const index = chords.map((c) => [c.key, c.suffix, chordName(c.key, c.suffix), c.positions.length]);
  const aliases: Record<string, string> = {};
  for (const [suffix, list] of Object.entries(SUFFIX_ALIASES)) {
    for (const alias of list) aliases[alias] = suffix;
    aliases[suffix] = suffix;
  }
  return { index, aliases };
}
