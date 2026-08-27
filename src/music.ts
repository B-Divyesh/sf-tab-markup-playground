export const NOTES_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const;
const NOTE_LOOKUP: Record<string, number> = {
  C: 0, 'C#': 1, DB: 1, D: 2, 'D#': 3, EB: 3, E: 4,
  F: 5, 'F#': 6, GB: 6, G: 7, 'G#': 8, AB: 8, A: 9,
  'A#': 10, BB: 10, B: 11
};

const ROMANS = ['I', '♭II', 'II', '♭III', 'III', 'IV', '♭V', 'V', '♭VI', 'VI', '♭VII', 'VII'];
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const SCALE_DEGREES = ['1', '2', '3', '4', '5', '6', '7'];

export interface ParseError { line: number; message: string }
export interface ParsedChord {
  raw: string;
  root: number;
  suffix: string;
  bass?: number;
}
export interface Exercise {
  title: string;
  key: number;
  keyName: string;
  chords: ParsedChord[];
  tab: string[];
  errors: ParseError[];
}

export const DEFAULT_MARKUP = `@title Bright-side turnaround
@key C
| C | Am7 | F | G |

e|--0---0---1---3--|
B|--1---1---1---0--|
G|--0---0---2---0--|
D|--2---2---3---0--|
A|--3---0---3---2--|
E|------x---1---3--|`;

export const PUBLIC_DOMAIN_MARKUP = `@title Simple gifts — opening idea
@key G
| G | C | G | D7 |

e|--3---0---3---2--|
B|--0---1---0---1--|
G|--0---0---0---2--|
D|--0---2---0---0--|
A|--2---3---2------|
E|--3-------3------|`;

function cleanNote(value: string): string {
  return value.trim().replace('♯', '#').replace('♭', 'b').toUpperCase();
}

export function noteNumber(value: string): number | undefined {
  return NOTE_LOOKUP[cleanNote(value)];
}

export function noteName(value: number): string {
  return NOTES_SHARP[((value % 12) + 12) % 12];
}

export function parseChord(value: string): ParsedChord | null {
  const match = value.trim().match(/^([A-Ga-g])([#b♯♭]?)(maj7|m7|sus2|sus4|dim|aug|m|7)?(?:\/([A-Ga-g])([#b♯♭]?))?$/);
  if (!match) return null;
  const root = noteNumber(`${match[1]}${match[2]}`);
  const bass = match[4] ? noteNumber(`${match[4]}${match[5]}`) : undefined;
  if (root === undefined || (match[4] && bass === undefined)) return null;
  return { raw: value.trim(), root, suffix: match[3] ?? '', bass };
}

export function parseMarkup(source: string): Exercise {
  const exercise: Exercise = { title: 'Untitled exercise', key: 0, keyName: 'C', chords: [], tab: [], errors: [] };
  const tabStrings = new Set<string>();

  source.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    const lineNumber = index + 1;
    if (!line || line.startsWith('//')) return;

    if (line.startsWith('@')) {
      const directive = line.match(/^@(title|key)\s+(.+)$/i);
      if (!directive) {
        exercise.errors.push({ line: lineNumber, message: 'Use @title or @key followed by a value.' });
        return;
      }
      if (directive[1].toLowerCase() === 'title') {
        exercise.title = directive[2].trim().slice(0, 80) || 'Untitled exercise';
      } else {
        const key = noteNumber(directive[2]);
        if (key === undefined) exercise.errors.push({ line: lineNumber, message: `“${directive[2]}” is not a supported key.` });
        else {
          exercise.key = key;
          exercise.keyName = noteName(key);
        }
      }
      return;
    }

    if (/^[eBGDAE]\|/.test(line)) {
      const stringName = line[0];
      if (tabStrings.has(stringName)) exercise.errors.push({ line: lineNumber, message: `String ${stringName} appears more than once.` });
      else {
        tabStrings.add(stringName);
        exercise.tab.push(line);
      }
      return;
    }

    if (line.startsWith('|')) {
      if (!line.endsWith('|')) exercise.errors.push({ line: lineNumber, message: 'Close the chord row with |.' });
      const tokens = line.split('|').map((token) => token.trim()).filter(Boolean);
      if (!tokens.length) {
        exercise.errors.push({ line: lineNumber, message: 'Add at least one chord between the bars.' });
        return;
      }
      tokens.forEach((token) => {
        const chord = parseChord(token);
        if (chord) exercise.chords.push(chord);
        else exercise.errors.push({ line: lineNumber, message: `“${token}” is not a supported chord.` });
      });
      return;
    }

    exercise.errors.push({ line: lineNumber, message: 'Start chord rows with |, tab rows with a string name, or use a directive.' });
  });

  if (source.length > 8000) exercise.errors.push({ line: 1, message: 'Keep exercises under 8,000 characters so links remain shareable.' });
  return exercise;
}

export function chordIntervals(chord: ParsedChord): number[] {
  switch (chord.suffix) {
    case 'm': return [0, 3, 7];
    case 'm7': return [0, 3, 7, 10];
    case '7': return [0, 4, 7, 10];
    case 'maj7': return [0, 4, 7, 11];
    case 'dim': return [0, 3, 6];
    case 'aug': return [0, 4, 8];
    case 'sus2': return [0, 2, 7];
    case 'sus4': return [0, 5, 7];
    default: return [0, 4, 7];
  }
}

export function chordTones(chord: ParsedChord, shift = 0): number[] {
  return chordIntervals(chord).map((interval) => (chord.root + shift + interval + 12) % 12);
}

export function chordName(chord: ParsedChord, shift = 0): string {
  const root = noteName(chord.root + shift);
  const bass = chord.bass === undefined ? '' : `/${noteName(chord.bass + shift)}`;
  return `${root}${chord.suffix}${bass}`;
}

export function romanNumeral(chord: ParsedChord, key: number): string {
  const distance = (chord.root - key + 12) % 12;
  const quality = chord.suffix.startsWith('m') || chord.suffix === 'dim';
  const base = quality ? ROMANS[distance].toLowerCase() : ROMANS[distance];
  const suffix = chord.suffix === '7' || chord.suffix === 'maj7' || chord.suffix === 'm7' ? '⁷' : chord.suffix === 'dim' ? '°' : '';
  return `${base}${suffix}`;
}

export function majorScale(key: number, shift = 0): Array<{ pitch: number; name: string; degree: string }> {
  return MAJOR_SCALE.map((interval, index) => {
    const pitch = (key + shift + interval + 12) % 12;
    return { pitch, name: noteName(pitch), degree: SCALE_DEGREES[index] };
  });
}

export function transposeMarkup(source: string, shift: number): string {
  if (!shift) return source;
  return source.split(/\r?\n/).map((rawLine) => {
    const keyMatch = rawLine.match(/^(\s*@key\s+)(\S+)(.*)$/i);
    if (keyMatch) {
      const key = noteNumber(keyMatch[2]);
      return key === undefined ? rawLine : `${keyMatch[1]}${noteName(key + shift)}${keyMatch[3]}`;
    }
    if (!rawLine.trim().startsWith('|')) return rawLine;
    return rawLine.replace(/([^|\s]+)/g, (token) => {
      const chord = parseChord(token);
      return chord ? chordName(chord, shift) : token;
    });
  }).join('\n');
}

export function encodeShare(source: string): string {
  const bytes = new TextEncoder().encode(source);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function decodeShare(encoded: string): string | null {
  try {
    const normalized = encoded.replaceAll('-', '+').replaceAll('_', '/');
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return decoded.length <= 8000 ? decoded : null;
  } catch {
    return null;
  }
}
