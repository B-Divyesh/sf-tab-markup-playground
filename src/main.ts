import './styles.css';
import {
  DEFAULT_MARKUP, PUBLIC_DOMAIN_MARKUP, chordName, chordTones, decodeShare,
  encodeShare, majorScale, noteName, parseMarkup, romanNumeral, transposeMarkup,
  type Exercise, type ParsedChord
} from './music.ts';

const $ = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

const editor = $<HTMLTextAreaElement>('#markup');
const status = $('#parse-status');
const lineNumbers = $('#line-numbers');
const transpose = $<HTMLSelectElement>('#transpose');
const panels = Array.from(document.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
const storageKey = 'tab-playbook:draft:v1';
let selectedChord = 0;
let clearUndo: string | null = null;
let toastTimer = 0;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function shareFromHash(): { value: string | null; invalid: boolean } {
  const params = new URLSearchParams(location.hash.slice(1));
  const value = params.get('exercise');
  if (!value) return { value: null, invalid: false };
  const decoded = decodeShare(value);
  return { value: decoded, invalid: decoded === null };
}

function initialValue(): string {
  const shared = shareFromHash();
  if (shared.value !== null) return shared.value;
  try { return localStorage.getItem(storageKey) ?? DEFAULT_MARKUP; }
  catch { return DEFAULT_MARKUP; }
}

function saveDraft(): void {
  try {
    localStorage.setItem(storageKey, editor.value);
    $('#save-state').textContent = 'Saved locally';
  } catch {
    $('#save-state').textContent = 'Storage unavailable';
  }
}

function showToast(message: string, error = false): void {
  const toast = $('#toast');
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle('error', error);
  toast.classList.add('show');
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function updateLines(): void {
  const count = editor.value.split(/\r?\n/).length;
  lineNumbers.textContent = Array.from({ length: count }, (_, index) => index + 1).join('\n');
  lineNumbers.scrollTop = editor.scrollTop;
}

function shiftedChord(chord: ParsedChord, shift: number): ParsedChord {
  return { ...chord, root: (chord.root + shift + 12) % 12, bass: chord.bass === undefined ? undefined : (chord.bass + shift + 12) % 12 };
}

function emptyMarkup(): string {
  return `<div class="empty-state"><span class="empty-glyph" aria-hidden="true">|- - -|</span><h4>No chords on the track</h4><p>Add a row like <code>| C | Am | F | G |</code> in the editor.</p></div>`;
}

function viewHeading(exercise: Exercise, shift: number, title: string, description: string): string {
  return `<div class="view-intro"><div><h4>${escapeHtml(title)}</h4><p>${escapeHtml(description)}</p></div><span class="key-chip">KEY ${escapeHtml(noteName(exercise.key + shift))}</span></div>`;
}

function renderChords(exercise: Exercise, shift: number): void {
  const panel = $('#panel-chords');
  if (!exercise.chords.length) { panel.innerHTML = emptyMarkup(); return; }
  const cards = exercise.chords.map((chord, index) => {
    const tones = chordTones(chord, shift).map(noteName).join(' · ');
    const colors = ['var(--signal)', 'var(--pulse)', 'var(--violet)', 'var(--coral)'];
    return `<article class="chord-card" style="--accent:${colors[index % colors.length]}"><span class="bar">Bar ${index + 1}</span><div class="chord-name">${escapeHtml(chordName(chord, shift))}</div><div class="roman">${escapeHtml(romanNumeral(chord, exercise.key))}</div><div class="tones">Tones · ${escapeHtml(tones)}</div></article>`;
  }).join('');
  const tab = exercise.tab.length ? `<pre class="tab-preview" aria-label="Tab preview">${escapeHtml(exercise.tab.join('\n'))}</pre>` : '';
  panel.innerHTML = `${viewHeading(exercise, shift, exercise.title, 'Chord names, scale function, and chord tones at a glance.')}<div class="chord-track">${cards}</div>${tab}`;
}

function fretboardHtml(pitches: number[], root: number, labels: Map<number, string>): string {
  const strings = [
    { name: 'e', pitch: 4 }, { name: 'B', pitch: 11 }, { name: 'G', pitch: 7 },
    { name: 'D', pitch: 2 }, { name: 'A', pitch: 9 }, { name: 'E', pitch: 4 }
  ];
  const rows = strings.map((string, stringIndex) => {
    const frets = Array.from({ length: 13 }, (_, fret) => {
      const pitch = (string.pitch + fret) % 12;
      if (!pitches.includes(pitch)) return `<span class="fret-cell" aria-hidden="true">·</span>`;
      const rootClass = pitch === root ? ' root' : '';
      const delay = Math.min((fret + stringIndex) * 12, 180);
      const label = labels.get(pitch) ?? noteName(pitch);
      return `<span class="fret-cell note"><span class="note-dot${rootClass}" style="animation-delay:${delay}ms" title="${escapeHtml(noteName(pitch))}">${escapeHtml(label)}</span></span>`;
    }).join('');
    return `<span class="fret-label">${string.name}</span>${frets}`;
  }).join('');
  const numbers = `<div class="fret-numbers" aria-hidden="true"><span></span>${Array.from({ length: 13 }, (_, i) => `<span>${i}</span>`).join('')}</div>`;
  return `<div class="fret-scroll" tabindex="0" aria-label="Guitar fretboard from open strings through fret twelve"><div class="fretboard">${rows}</div>${numbers}</div>`;
}

function renderFretboard(exercise: Exercise, shift: number): void {
  const panel = $('#panel-fretboard');
  if (!exercise.chords.length) { panel.innerHTML = emptyMarkup(); return; }
  selectedChord = Math.min(selectedChord, exercise.chords.length - 1);
  const chord = shiftedChord(exercise.chords[selectedChord], shift);
  const pitches = chordTones(chord);
  const labels = new Map(pitches.map((pitch) => [pitch, noteName(pitch)]));
  const controls = exercise.chords.map((item, index) => `<button type="button" data-chord="${index}" aria-pressed="${index === selectedChord}">${escapeHtml(chordName(item, shift))}</button>`).join('');
  panel.innerHTML = `${viewHeading(exercise, shift, `${chordName(exercise.chords[selectedChord], shift)} across the neck`, 'Choose a bar, then find every chord tone from the open strings to fret 12.')}<div class="chord-selector" aria-label="Choose chord">${controls}</div>${fretboardHtml(pitches, chord.root, labels)}<div class="legend"><span class="root-key"><i></i>Root</span><span><i></i>Chord tone</span><span>Scroll the neck horizontally on small screens.</span></div>`;
  panel.querySelectorAll<HTMLButtonElement>('[data-chord]').forEach((button) => button.addEventListener('click', () => {
    selectedChord = Number(button.dataset.chord);
    renderFretboard(exercise, shift);
  }));
}

function renderIntervals(exercise: Exercise, shift: number): void {
  const panel = $('#panel-intervals');
  if (!exercise.chords.length) { panel.innerHTML = emptyMarkup(); return; }
  const nodes = exercise.chords.map((chord, index) => `<div class="interval-step"><div class="interval-node"><span>BAR ${index + 1}</span><strong>${escapeHtml(romanNumeral(chord, exercise.key))}</strong><span>${escapeHtml(chordName(chord, shift))}</span></div>${index < exercise.chords.length - 1 ? '<span class="flow-arrow" aria-hidden="true">›</span>' : ''}</div>`).join('');
  panel.innerHTML = `${viewHeading(exercise, shift, 'Harmonic route', 'Roman numerals stay stable when you transpose, revealing the reusable pattern.')}<div class="interval-flow">${nodes}</div><p class="theory-note"><strong>Read it as a relationship:</strong> the key is home (I). Uppercase numerals are major, lowercase are minor, ° is diminished, and ⁷ marks a seventh chord.</p>`;
}

function renderScale(exercise: Exercise, shift: number): void {
  const panel = $('#panel-scale');
  const scale = majorScale(exercise.key, shift);
  const strip = scale.map((note) => `<div class="scale-note"><strong>${escapeHtml(note.name)}</strong><span>DEGREE ${note.degree}</span></div>`).join('');
  const pitches = scale.map((note) => note.pitch);
  const labels = new Map(scale.map((note) => [note.pitch, note.degree]));
  panel.innerHTML = `${viewHeading(exercise, shift, `${noteName(exercise.key + shift)} major map`, 'Degree numbers reveal the same scale shape in any key.')}<div class="scale-strip">${strip}</div>${fretboardHtml(pitches, pitches[0], labels)}<div class="legend"><span class="root-key"><i></i>Degree 1 / root</span><span><i></i>In-key note</span></div>`;
}

function render(): void {
  updateLines();
  const exercise = parseMarkup(editor.value);
  const shift = Number(transpose.value);
  if (!editor.value.trim()) {
    status.textContent = 'Empty draft — add a title, key, and chord row to begin.';
    status.className = 'parse-status';
  } else if (exercise.errors.length) {
    const first = exercise.errors[0];
    status.textContent = `Line ${first.line}: ${first.message}${exercise.errors.length > 1 ? ` (+${exercise.errors.length - 1} more)` : ''}`;
    status.className = 'parse-status error';
  } else {
    status.textContent = `${exercise.chords.length} chord${exercise.chords.length === 1 ? '' : 's'} mapped · ${exercise.tab.length ? `${exercise.tab.length} tab strings` : 'no tab lines'} · ready to share`;
    status.className = 'parse-status';
  }
  renderChords(exercise, shift);
  renderFretboard(exercise, shift);
  renderIntervals(exercise, shift);
  renderScale(exercise, shift);
  saveDraft();
}

async function copyText(value: string, success: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
    showToast(success);
  } catch {
    showToast('Clipboard access was blocked. Select and copy from the editor.', true);
    editor.focus();
    editor.select();
  }
}

function copyShareLink(): void {
  const exercise = parseMarkup(editor.value);
  if (!editor.value.trim() || !exercise.chords.length || exercise.errors.length) {
    showToast('Fix the markup and add at least one chord before sharing.', true);
    editor.focus();
    return;
  }
  const url = new URL(location.href);
  url.hash = new URLSearchParams({ exercise: encodeShare(editor.value) }).toString();
  void copyText(url.toString(), 'Share link copied · exercise travels in the URL');
}

editor.value = initialValue();
editor.addEventListener('input', render);
editor.addEventListener('scroll', () => { lineNumbers.scrollTop = editor.scrollTop; });
transpose.addEventListener('change', render);
$('#share-button').addEventListener('click', copyShareLink);
$('#copy-markup').addEventListener('click', () => void copyText(editor.value, 'Markup copied'));
$('#example-button').addEventListener('click', () => { clearUndo = editor.value; editor.value = PUBLIC_DOMAIN_MARKUP; transpose.value = '0'; render(); showToast('Public-domain example loaded'); });
$('#clear-button').addEventListener('click', () => {
  const clearButton = $<HTMLButtonElement>('#clear-button');
  if (editor.value) {
    clearUndo = editor.value;
    editor.value = '';
    clearButton.textContent = 'Undo clear';
    render();
    showToast('Draft cleared · use Undo clear to restore it');
  } else if (clearUndo !== null) {
    editor.value = clearUndo;
    clearUndo = null;
    clearButton.textContent = 'Clear';
    render();
    showToast('Draft restored');
  }
});
$('#apply-transpose').addEventListener('click', () => {
  const shift = Number(transpose.value);
  if (!shift) { showToast('Choose a transpose amount first.', true); return; }
  editor.value = transposeMarkup(editor.value, shift);
  transpose.value = '0';
  render();
  showToast('Chord text and key transposed · tab fret numbers kept as written');
});
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); copyShareLink(); }
});

tabs.forEach((tab, index) => tab.addEventListener('click', () => activateTab(index)));
tabs.forEach((tab, index) => tab.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  activateTab(target);
  tabs[target].focus();
}));

function activateTab(index: number): void {
  tabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    panels[tabIndex].hidden = !active;
  });
}

function updateNetwork(): void {
  document.body.classList.toggle('offline', !navigator.onLine);
  $('#network-label').textContent = navigator.onLine ? 'Ready offline' : 'Offline · edits still work';
}
window.addEventListener('online', updateNetwork);
window.addEventListener('offline', updateNetwork);
window.addEventListener('hashchange', () => {
  const shared = shareFromHash();
  if (shared.invalid) showToast('That share link is damaged or too large.', true);
  else if (shared.value !== null) { editor.value = shared.value; transpose.value = '0'; render(); showToast('Shared exercise loaded'); }
});
updateNetwork();
render();
if (shareFromHash().invalid) showToast('That share link is damaged or too large.', true);

if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
