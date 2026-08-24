import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'vendor/chords-db/guitar.json');
const OUT_CHORDS = join(ROOT, 'src/data/chords.json');
const OUT_DEGREES = join(ROOT, 'src/data/degrees.json');

const KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const SUFFIX_ORDER = [
  'major', 'minor', '7', 'maj7', 'm7', 'm7b5', 'dim', 'dim7', 'aug',
  'sus2', 'sus4', '6', 'm6', '69', '9', 'add9', 'm9', 'maj9', '7sus4', '5',
];
const MAX_POSITIONS = 3;
const FRETS_WINDOW = 5;

// 级数和弦:七个级数的品质模式与功能标签
const DEGREE_PATTERN = [
  { deg: 'I', suffix: 'major', func: '主' },
  { deg: 'ii', suffix: 'minor', func: '下属' },
  { deg: 'iii', suffix: 'minor', func: '中介' },
  { deg: 'IV', suffix: 'major', func: '下属' },
  { deg: 'V', suffix: 'major', func: '属' },
  { deg: 'vi', suffix: 'minor', func: '中介' },
  { deg: 'vii°', suffix: 'dim', func: '导' },
];
// 七个自然大调音阶(I~VII)
const SCALES = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  B: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
};
// 等音映射:显示名 -> 源 JSON 键名(chords-db 用 Eb/Ab/Bb 与 Csharp/Fsharp)
const SOURCE_KEY = {
  'C#': 'Csharp', Db: 'Csharp',
  'D#': 'Eb', Eb: 'Eb',
  'F#': 'Fsharp', Gb: 'Fsharp',
  'G#': 'Ab', Ab: 'Ab',
  'A#': 'Bb', Bb: 'Bb',
};
const srcNameOf = (root) => SOURCE_KEY[root] ?? root;

function normalizePosition(p, label) {
  // chords-db 的 frets/barres 是相对 baseFret 的品位,统一换算为绝对品位
  const bf = p.baseFret ?? 1;
  if (!Array.isArray(p.frets) || p.frets.length !== 6) throw new Error(`${label}: frets 异常`);
  const frets = p.frets.map((f) => (f > 0 ? f + bf - 1 : f));
  const barres = (p.barres ?? []).map((b) => b + bf - 1);
  for (const f of frets) {
    if (f > 0 && (f < bf || f > bf + FRETS_WINDOW - 1)) {
      throw new Error(`${label}: 品位 ${f} 超出窗口 [${bf}, ${bf + FRETS_WINDOW - 1}]`);
    }
  }
  for (const b of barres) {
    if (b < bf || b > bf + FRETS_WINDOW - 1) throw new Error(`${label}: 横按 ${b} 超出窗口`);
  }
  return {
    frets,
    fingers: p.fingers,
    baseFret: bf,
    barres,
    ...(p.capo ? { capo: true } : {}),
  };
}

function extractChord(db, srcKey, suffix, displayKey) {
  const chord = (db.chords[srcNameOf(srcKey)] ?? []).find((c) => c.suffix === suffix);
  if (!chord) return null;
  const positions = (chord.positions ?? [])
    .slice(0, MAX_POSITIONS)
    .map((p) => normalizePosition(p, `${displayKey} ${suffix}`))
    .filter(Boolean);
  return positions.length ? { key: displayKey, suffix, positions } : null;
}

const db = JSON.parse(readFileSync(SRC, 'utf8'));

// 1) 常用和弦(七自然调 × 20 后缀)
const out = [];
for (const key of KEYS) {
  for (const suffix of SUFFIX_ORDER) {
    const entry = extractChord(db, key, suffix, key);
    if (!entry) continue;
    out.push(entry);
  }
}

// 2) 级数和弦引用表 + 补齐升根音和弦
const degrees = {};
const needed = new Set();
for (const key of KEYS) {
  degrees[key] = DEGREE_PATTERN.map(({ deg, suffix, func }, i) => {
    const root = SCALES[key][i];
    needed.add(`${root}|${suffix}`);
    return { deg, func, root, suffix };
  });
}
let added = 0;
for (const ref of needed) {
  const [root, suffix] = ref.split('|');
  if (out.some((c) => c.key === root && c.suffix === suffix)) continue;
  const entry = extractChord(db, root, suffix, root);
  if (!entry) throw new Error(`级数和弦缺数据: ${root} ${suffix}`);
  out.push(entry);
  added++;
}

mkdirSync(dirname(OUT_CHORDS), { recursive: true });
writeFileSync(OUT_CHORDS, JSON.stringify(out, null, 1) + '\n');
writeFileSync(OUT_DEGREES, JSON.stringify(degrees, null, 1) + '\n');

// 自检:degrees 引用必须全部可解析
for (const key of KEYS) {
  for (const d of degrees[key]) {
    if (!out.some((c) => c.key === d.root && c.suffix === d.suffix)) {
      throw new Error(`degrees 引用未解析: ${key} ${d.deg} -> ${d.root}${d.suffix}`);
    }
  }
}
console.log(`chords: ${out.length}(+${added} 级数补充), size: ${(JSON.stringify(out).length / 1024).toFixed(0)}KB`);
console.log(`degrees keys: ${Object.keys(degrees).length}`);
