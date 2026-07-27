#!/usr/bin/env node
// Portabler Check für die Kontext-Doktrin (Node 22, keine Dependencies).
// Ersetzt tests/validate-feature-workflow.ps1 dort, wo kein `pwsh` da ist:
// dessen Assertions zu codex-runtime-Verweis, Gate-2-Anker und
// Task-Review-Dispatch (`target=task`) sind hier mit abgedeckt.
//
// Gruppen:
//   A — Anker, die heute schon halten (Regression-Schutz).
//   B — Frontmatter aller SKILL.md plus Vorlage.
//   C — Soll-Zustand der Doktrin; heute absichtlich ROT (TDD-Anker).
//   D — Status-Format-Literal genau zweimal, gezählt nur unter
//       plugins/ und templates/ (docs/ darf zitieren).
//   E — Zeilen-Bilanz. Reine Ausgabe, niemals ein Fehlschlag.
//
// Aufruf: node tests/validate-context-doctrine.mjs  (Exit 1 bei Fehlschlag)
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Repo-Wurzel aus dem Script-Pfad, nicht aus cwd — sonst prüft ein Aufruf
// aus fremdem Verzeichnis die falschen Dateien (oder gar keine).
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Pfade der geprüften Artefakte, repo-relativ und POSIX.
const SPEC_SKILL = 'plugins/feature-workflow/skills/spec-to-implementation/SKILL.md';
const REVIEW_LOOP = 'plugins/feature-workflow/skills/spec-to-implementation/references/review-loop.md';
const DOKTRIN = 'plugins/context-kit/docs/kontext-architektur.md';
const KONTEXT_AUDIT = 'plugins/context-kit/skills/kontext-audit/SKILL.md';
const PROJEKT_SETUP = 'plugins/context-kit/skills/projekt-setup/SKILL.md';
const VORLAGE = 'templates/skill-vorlage/SKILL.template.md';

// Das Status-Format, das Doktrin und spec-to-implementation teilen.
const STATUS_FORMAT = 'Spec: `<pfad>` · Plan: `<pfad>` · Tests: <kurz>.';

// --- Datei-Zugriff -------------------------------------------------------

const cache = new Map();

// Liest repo-relativ und cacht; fehlende Datei -> null (jede Assertion
// darauf schlägt fehl, statt den ganzen Lauf mit einem Throw abzubrechen).
function read(rel) {
  if (!cache.has(rel)) {
    try {
      cache.set(rel, readFileSync(path.join(repoRoot, rel), 'utf8'));
    } catch {
      cache.set(rel, null);
    }
  }
  return cache.get(rel);
}

// Zeilenzahl wie `wc -l`: abschliessendes Newline zählt nicht als Extrazeile.
function lineCount(text) {
  if (!text) return 0;
  const n = text.split('\n').length;
  return text.endsWith('\n') ? n - 1 : n;
}

// Nicht-überlappende Vorkommen (indexOf statt Regex — das Literal enthält
// Backticks und Sonderzeichen, die als Regex escaped werden müssten).
function countOccurrences(hay, needle) {
  let count = 0;
  for (let i = hay.indexOf(needle); i !== -1; i = hay.indexOf(needle, i + needle.length)) count += 1;
  return count;
}

// Rekursiver Walk über einen Repo-Unterbaum; liefert repo-relative Pfade.
function walk(rel, out = []) {
  let entries;
  try {
    entries = readdirSync(path.join(repoRoot, rel), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const child = `${rel}/${entry.name}`;
    if (entry.isDirectory()) walk(child, out);
    else if (entry.isFile()) out.push(child);
  }
  return out;
}

// --- Assertions ----------------------------------------------------------

const results = [];

function assert(name, ok) {
  results.push({ name, ok: ok === true });
}

function contains(name, rel, needle) {
  assert(name, read(rel)?.includes(needle));
}

// Negative Assertion: Datei muss existieren UND das Fragment darf fehlen —
// eine gelöschte Datei ist kein bestandener Check.
function omits(name, rel, needle) {
  const text = read(rel);
  assert(name, text !== null && !text.includes(needle));
}

function maxLines(name, rel, limit) {
  const text = read(rel);
  assert(`${name} (${text === null ? 'fehlt' : lineCount(text)} / max ${limit})`, text !== null && lineCount(text) <= limit);
}

// Gruppe A — Anker, die heute schon halten.
contains('A1  spec-to-implementation nennt Daten-Grenze', SPEC_SKILL, 'Daten-Grenze');
contains('A2  spec-to-implementation nennt git ls-files --error-unmatch', SPEC_SKILL, 'git ls-files --error-unmatch');
contains('A3  spec-to-implementation nennt "Git ist die Wahrheit"', SPEC_SKILL, 'Git ist die Wahrheit');
contains('A4  spec-to-implementation nennt den Gate-2-Anker', SPEC_SKILL, '`approvedAt` gesetzt + sauberer Worktree');
contains('A5  spec-to-implementation verweist auf references/codex-runtime.md', SPEC_SKILL, 'references/codex-runtime.md');
contains('A6  landing-page nennt "Keine erfundenen Beweise"', 'plugins/dev-toolkit/skills/landing-page/SKILL.md', 'Keine erfundenen Beweise');
contains('A7  bug-triage nennt "Keine PII/Secrets"', 'plugins/dev-toolkit/skills/bug-triage/SKILL.md', 'Keine PII/Secrets');
contains('A8  web-audit nennt "Keine PII/Secrets"', 'plugins/dev-toolkit/skills/web-audit/SKILL.md', 'Keine PII/Secrets');
// Backticks gehören zum Anker: der nackte Substring `.env` trifft auch
// `process.env`, `.envrc` oder `.env.local` und hielte dann versehentlich.
contains('A9  kontext-audit nennt `.env`', KONTEXT_AUDIT, '`.env`');
contains('A10 projekt-setup nennt `.env`', PROJEKT_SETUP, '`.env`');
// A11 spiegelt die dritte Assertion der `.ps1` („Per-task review dispatch is
// missing."). Sie fehlte hier — deshalb blieb unbemerkt, dass ein Trim den
// Dispatch aus § Stufe 5 entfernt hatte, während `pwsh` fehlte.
contains('A11 spec-to-implementation nennt den Task-Review-Dispatch', SPEC_SKILL, 'target=task');

// Gruppe B — Frontmatter. Skills werden entdeckt, nicht hartkodiert; die
// Mindestzahl verhindert, dass ein leerer Fund alle Assertions still grün
// macht.
const skillFiles = walk('plugins')
  .filter((f) => /^plugins\/[^/]+\/skills\/[^/]+\/SKILL\.md$/.test(f))
  .sort();
assert(`B0  mindestens 9 SKILL.md gefunden (${skillFiles.length})`, skillFiles.length >= 9);

// Frontmatter-Block zwischen den beiden `---`-Zeilen; null wenn keiner da ist.
function frontmatter(text) {
  if (!text?.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 3);
  return end === -1 ? null : text.slice(4, end + 1);
}

for (const rel of [...skillFiles, VORLAGE]) {
  const fm = frontmatter(read(rel));
  // `\S` erzwingt einen nicht-leeren Wert — `description:` allein reicht nicht.
  assert(`B   Frontmatter name+description: ${rel}`, fm !== null && /^name:\s*\S/m.test(fm) && /^description:\s*\S/m.test(fm));
}

// Gruppe C — Soll-Zustand. Heute absichtlich teilweise rot.
contains('C1  Doktrin nennt Gotcha', DOKTRIN, 'Gotcha');
contains('C2  Doktrin nennt Auto-Memory', DOKTRIN, 'Auto-Memory');
contains('C3  Doktrin nennt Rich Reference', DOKTRIN, 'Rich Reference');
contains('C4  Doktrin ist als Quelle des Status-Formats markiert', DOKTRIN, 'Quelle für dieses Format');
// Auf das blosse Wort verengt, nicht auf eine Auszeichnung: `**Verbote**`
// wäre durch `### Verbote` oder `**Verbote:**` kosmetisch umgehbar, und die
// Doktrin nennt das Wort an zwei Stellen (Tabelle und Aufzählung).
omits('C5  Doktrin ohne das Wort "Verbote"', DOKTRIN, 'Verbote');

omits('C6  kontext-audit ohne "immer geladene"', KONTEXT_AUDIT, 'immer geladene');
// Budget-Zeile = Markdown-Tabellenzeile, die `description` nennt UND in
// derselben Zeile eine Zahl mit Budget-Einheit führt. Ohne Zahl und Einheit
// würde schon eine Frontmatter-Feldliste („name, description") grün färben.
assert(
  'C7  kontext-audit hat eine Budget-Tabellenzeile für description',
  (read(KONTEXT_AUDIT) ?? '')
    .split('\n')
    .some(
      (line) =>
        line.trimStart().startsWith('|') &&
        line.includes('description') &&
        /\d/.test(line) &&
        /Zeichen|Zeile|Token/.test(line),
    ),
);
contains('C8  kontext-audit nennt /doctor', KONTEXT_AUDIT, '/doctor');
contains('C9  kontext-audit nennt kollidierend', KONTEXT_AUDIT, 'kollidierend');
contains('C10 kontext-audit nennt Einstiegsheuristik', KONTEXT_AUDIT, 'Einstiegsheuristik');
contains('C11 kontext-audit nennt Datei-Baum', KONTEXT_AUDIT, 'Datei-Baum');

contains('C12 projekt-setup nennt Gotcha', PROJEKT_SETUP, 'Gotcha');
// Wie C5: das Streichen nur des Klammerzusatzes reicht nicht, das Wort
// selbst muss weg — auch an der zweiten Fundstelle in der Aufzählung.
omits('C13 projekt-setup ohne das Wort "Verbote"', PROJEKT_SETUP, 'Verbote');

contains('C14 spec-to-implementation nennt Mockup', SPEC_SKILL, 'Mockup');
contains('C15 spec-to-implementation markiert die Format-Kopie', SPEC_SKILL, 'bewusste Kopie über Plugin-Grenzen');
maxLines('C16 spec-to-implementation bleibt kompakt', SPEC_SKILL, 200);

contains('C17 review-loop nennt Rubric', REVIEW_LOOP, 'Rubric');

contains('C18 Vorlage nennt description', VORLAGE, 'description');
contains('C19 Vorlage nennt Progressive Disclosure', VORLAGE, 'Progressive Disclosure');
contains('C20 Vorlage nennt Urteils-Anker', VORLAGE, 'Urteils-Anker');
contains('C21 Vorlage nennt Meinung', VORLAGE, 'Meinung');

// Gruppe D — Status-Format-Literal. Bewusst nur plugins/ und templates/:
// docs/specs und docs/plans dürfen das Format zitieren, ohne den Check zu
// brechen — sonst wird jede künftige Spec, die es erwähnt, zum Fehlschlag.
const formatHits = [];
for (const rel of [...walk('plugins'), ...walk('templates')]) {
  const n = countOccurrences(read(rel) ?? '', STATUS_FORMAT);
  if (n > 0) formatHits.push({ rel, n });
}
const formatTotal = formatHits.reduce((sum, h) => sum + h.n, 0);
assert(`D1  Status-Format genau 2x unter plugins/ und templates/ (${formatTotal})`, formatTotal === 2);

// --- Ausgabe -------------------------------------------------------------

for (const { name, ok } of results) console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}`);

const green = results.filter((r) => r.ok).length;
console.log(`\n${green} von ${results.length} Assertions grün`);

if (formatHits.length > 0) {
  console.log('\nFundstellen Status-Format:');
  for (const { rel, n } of formatHits) console.log(`  ${rel} (${n}x)`);
}

// Gruppe E — Zeilen-Bilanz. Reine Ausgabe, die Bewertung bleibt menschlich.
const bilanz = [DOKTRIN, KONTEXT_AUDIT, PROJEKT_SETUP, SPEC_SKILL, REVIEW_LOOP, VORLAGE];
const width = Math.max(...bilanz.map((r) => r.length));
console.log('\nZeilen-Bilanz:');
let sum = 0;
for (const rel of bilanz) {
  const text = read(rel);
  const n = lineCount(text);
  sum += n;
  console.log(`  ${rel.padEnd(width)}  ${text === null ? 'FEHLT' : String(n).padStart(5)}`);
}
console.log(`  ${'Summe'.padEnd(width)}  ${String(sum).padStart(5)}`);

process.exit(green === results.length ? 0 : 1);
