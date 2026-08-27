import { describe, expect, it } from 'vitest';
import {
  chordName, chordTones, decodeShare, encodeShare, majorScale, parseChord,
  parseMarkup, romanNumeral, transposeMarkup
} from '../../src/music.ts';

describe('Tab Playbook markup', () => {
  it('parses a complete four-bar exercise', () => {
    const result = parseMarkup('@title Loop\n@key G\n| G | Em7 | C | D7 |\ne|--3--|');
    expect(result.errors).toEqual([]);
    expect(result.title).toBe('Loop');
    expect(result.chords.map((chord) => chord.raw)).toEqual(['G', 'Em7', 'C', 'D7']);
    expect(result.tab).toHaveLength(1);
  });

  it('reports useful line-level errors', () => {
    const result = parseMarkup('@key H\n| C | Nope |\nplain text');
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ line: 1 }),
      expect.objectContaining({ line: 2 }),
      expect.objectContaining({ line: 3 })
    ]));
  });

  it('derives chord tones and roman numerals', () => {
    const chord = parseChord('Am7');
    expect(chord).not.toBeNull();
    expect(chordTones(chord!).map((pitch) => chordName({ raw: '', root: pitch, suffix: '' }))).toEqual(['A', 'C', 'E', 'G']);
    expect(romanNumeral(chord!, 0)).toBe('vi⁷');
  });

  it('transposes chord rows and the key but leaves tab fingering intact', () => {
    const source = '@key C\n| C | Am7 | F/G |\ne|--0--|';
    expect(transposeMarkup(source, 2)).toBe('@key D\n| D | Bm7 | G/A |\ne|--0--|');
  });

  it('round-trips unicode markup through a share payload', () => {
    const source = '@title Café idea\n@key F#\n| F# | C#7 |';
    expect(decodeShare(encodeShare(source))).toBe(source);
    expect(decodeShare('%%%')).toBeNull();
  });

  it('creates the seven-note major scale', () => {
    expect(majorScale(0).map((note) => note.name)).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });
});
