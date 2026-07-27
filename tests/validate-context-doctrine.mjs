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
const ABSCHLUSS_REF = 'plugins/feature-workflow/skills/spec-to-implementation/references/abschluss.md';

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
// C15 zeigt seit der Auslagerung der Abschluss-Pflichten auf references/
// statt auf die SKILL.md: die markierte Kopie ist umgezogen, nicht
// verschwunden. Geprüft wird weiterhin, DASS sie markiert ist — der Anker
// wurde verschoben, nicht abgeschwächt.
contains('C15 Abschluss-Referenz markiert die Format-Kopie', ABSCHLUSS_REF, 'bewusste Kopie über Plugin-Grenzen');
maxLines('C16 spec-to-implementation bleibt kompakt', SPEC_SKILL, 200);

contains('C17 review-loop nennt Rubric', REVIEW_LOOP, 'Rubric');

contains('C18 Vorlage nennt description', VORLAGE, 'description');
contains('C19 Vorlage nennt Progressive Disclosure', VORLAGE, 'Progressive Disclosure');
contains('C20 Vorlage nennt Urteils-Anker', VORLAGE, 'Urteils-Anker');
contains('C21 Vorlage nennt Meinung', VORLAGE, 'Meinung');
// C22–C24: die Doktrin steht in genau einer Datei. Beide Skills trugen
// zusätzlich eine Kurzfassung als Blockzitat — und die waren gedriftet
// (Gotcha-Definition nur hier, Tiefen-Regel nur dort). Anker ist die
// Formulierung, die beide Fassungen teilen.
omits('C22 projekt-setup ohne Doktrin-Kurzfassung', PROJEKT_SETUP, 'hartes Budget');
omits('C23 kontext-audit ohne Doktrin-Kurzfassung', KONTEXT_AUDIT, 'hartes Budget');
// Ohne diesen Anker bleibt die Vorlage bei „die description ist immer
// geladen" — und der nächste Skill wiederholt den Fehler, den dieser Lauf
// behebt.
contains('C24 Vorlage nennt disable-model-invocation', VORLAGE, 'disable-model-invocation');

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

// D2 — dasselbe Muster für das Leitwort „Befund vor Eingriff". Es benennt
// die geteilte Haltung dreier Audit-Skills (kontext-audit, dependency-audit,
// web-audit), und die liegen über zwei Plugins verteilt. Ein Verweis auf
// eine gemeinsame Quelle ginge nicht: `install.sh` kopiert Doku plugin-weise,
// dev-toolkit sähe eine context-kit-Datei nie. Also wortgleich dupliziert —
// und gezählt, damit die Kopien nicht auseinanderlaufen.
const LEITWORT = '**Befund vor Eingriff:** erst erheben und klassifizieren, dann vorlegen —\ngeändert wird auf Zusage.';
const leitwortHits = [];
for (const rel of [...walk('plugins'), ...walk('templates')]) {
  const n = countOccurrences(read(rel) ?? '', LEITWORT);
  if (n > 0) leitwortHits.push({ rel, n });
}
const leitwortTotal = leitwortHits.reduce((sum, h) => sum + h.n, 0);
assert(`D2  Leitwort "Befund vor Eingriff" genau 3x, wortgleich (${leitwortTotal})`, leitwortTotal === 3);

// Gruppe F — Invocation-Achse. `disable-model-invocation: true` macht einen
// Skill user-invoked: seine description wird nicht mehr in jede Session
// geladen. Geprüft wird das Frontmatter-Feld, nicht ein Substring — im
// Fliesstext steht der Feldname legitim (Vorlage, Router, portabilitaet.md).
function fmFlag(rel, field) {
  const fm = frontmatter(read(rel));
  if (fm === null) return null;
  const m = fm.match(new RegExp(`^${field}:\\s*(\\S+)`, 'm'));
  return m ? m[1] : null;
}

const USER_INVOKED = [
  'plugins/context-kit/skills/projekt-setup/SKILL.md',
  'plugins/context-kit/skills/skill-kompass/SKILL.md',
  'plugins/dev-toolkit/skills/dependency-audit/SKILL.md',
  'plugins/dev-toolkit/skills/landing-page/SKILL.md',
  'plugins/dev-toolkit/skills/resolving-merge-conflicts/SKILL.md',
  'plugins/dev-toolkit/skills/web-audit/SKILL.md',
  'plugins/feature-workflow/skills/spec-to-implementation/SKILL.md',
];

// Als exakte Menge geprüft, nicht als Stichprobe: sonst rutscht ein
// zusätzlich umgeflaggter Skill unbemerkt durch und seine Trigger sind
// still weg.
const flagged = skillFiles.filter((rel) => fmFlag(rel, 'disable-model-invocation') === 'true').sort();
const expected = [...USER_INVOKED].sort();
assert(
  `F1  genau die vorgesehenen Skills sind user-invoked (${flagged.length}/${expected.length})`,
  flagged.length === expected.length && flagged.every((rel, i) => rel === expected[i]),
);
assert(
  'F2  die uebrigen Skills bleiben model-invoked',
  skillFiles.filter((rel) => !expected.includes(rel)).every((rel) => fmFlag(rel, 'disable-model-invocation') === null),
);
// Der Router heilt die kognitive Last, die user-invoked Skills erzeugen —
// und ist selbst user-invoked, kostet also nichts.
assert(
  'F3  Router-Skill existiert und ist user-invoked',
  read('plugins/context-kit/skills/skill-kompass/SKILL.md') !== null &&
    fmFlag('plugins/context-kit/skills/skill-kompass/SKILL.md', 'disable-model-invocation') === 'true',
);

// Gruppe G — Grundlast. Nur model-invoked descriptions werden geladen; sie
// sind der Preis, den jede Session jedes Projekts zahlt. Die Schranke liegt
// unter dem Ist-Stand der verbleibenden vier (1484), damit sie nicht schon
// durchs blosse Umflaggen erfüllt ist.
function descLength(rel) {
  const fm = frontmatter(read(rel));
  const m = fm?.match(/^description:[ \t]*(.*)$/m);
  return m ? m[1].trim().length : 0;
}

const loaded = skillFiles.filter((rel) => fmFlag(rel, 'disable-model-invocation') !== 'true');
const loadedTotal = loaded.reduce((sum, rel) => sum + descLength(rel), 0);
assert(`G1  geladene description-Summe <= 1250 Zeichen (${loadedTotal})`, loadedTotal <= 1250);

// G2 — Obergrenze je einzelnem geladenem Feld. Ohne sie könnte ein Skill die
// Gesamtschranke allein aufbrauchen und die übrigen aushungern. Bewusst
// namenlos formuliert statt „die vier bestehenden zusammen <= X": eine
// Liste von Skill-Namen deckt einen künftig hinzukommenden nicht ab.
const widest = loaded.reduce((max, rel) => Math.max(max, descLength(rel)), 0);
assert(`G2  kein geladenes description-Feld > 300 Zeichen (max ${widest})`, widest <= 300);

// Budget je Feld — als Regression über ALLE Skills, nicht nur die
// geladenen: ein künftig hinzugefügter Skill scheitert daran, auch wenn er
// heute noch user-invoked ist.
for (const rel of [...skillFiles, VORLAGE]) {
  const n = descLength(rel);
  assert(`B   description <= 500 Zeichen (${n}): ${rel}`, n > 0 && n <= 500);
}

// Gruppe H — die Übernahmen aus mattpocock/skills.
const GRILLING = 'plugins/context-kit/skills/grilling/SKILL.md';
const DOMAIN_MODELING = 'plugins/context-kit/skills/domain-modeling/SKILL.md';
const MERGE_CONFLICTS = 'plugins/dev-toolkit/skills/resolving-merge-conflicts/SKILL.md';
const TDD_REF = 'plugins/feature-workflow/skills/spec-to-implementation/references/tdd.md';
const IMPLEMENTER = 'plugins/feature-workflow/agents/implementer.md';
const LIGHT_MODE = 'plugins/feature-workflow/skills/spec-to-implementation/references/light-mode.md';

// Beide sind model-invoked, weil Gate 1 bzw. andere Skills sie erreichen
// müssen — ein user-invoked Skill ist für nichts als den Menschen sichtbar.
assert('H1  grilling existiert und ist model-invoked',
  read(GRILLING) !== null && fmFlag(GRILLING, 'disable-model-invocation') === null);
assert('H2  domain-modeling existiert und ist model-invoked',
  read(DOMAIN_MODELING) !== null && fmFlag(DOMAIN_MODELING, 'disable-model-invocation') === null);
// H3 verhindert einen zweiten ADR-Erzeuger neben /adr. Anker sind die
// Format-Marker, die /adr besitzt — nicht das Wort „ADR": darauf VERWEISEN
// soll der Skill ja gerade.
omits('H3a domain-modeling ohne eigene ADR-Statuszeile', DOMAIN_MODELING, 'Status: proposed');
omits('H3b domain-modeling ohne eigene Supersede-Regel', DOMAIN_MODELING, 'superseded by');
contains('H4  review-loop.md führt diff im target-Enum', REVIEW_LOOP, '`diff`');
// Getrennt: bei einem gemeinsamen Anker sagt Rot nicht, welche Hälfte fehlt.
assert('H5a references/tdd.md existiert', read(TDD_REF) !== null);
contains('H5b implementer verweist auf references/tdd.md', IMPLEMENTER, 'tdd.md');
assert('H6  resolving-merge-conflicts existiert und ist user-invoked',
  read(MERGE_CONFLICTS) !== null && fmFlag(MERGE_CONFLICTS, 'disable-model-invocation') === 'true');

// Gruppe C, Fortsetzung — CONTEXT.md als Schicht-2-Artefakt, der ausgelagerte
// Light-Mode und der aufgelöste Grundsatz-2-Konflikt.
contains('C25 Doktrin führt CONTEXT.md', DOKTRIN, 'CONTEXT.md');
contains('C26 projekt-setup fragt nach CONTEXT.md', PROJEKT_SETUP, 'CONTEXT.md');
contains('C27 kontext-audit inventarisiert CONTEXT.md', KONTEXT_AUDIT, 'CONTEXT.md');
assert('C28 references/light-mode.md existiert', read(LIGHT_MODE) !== null);
contains('C29 spec-to-implementation verweist auf light-mode.md', SPEC_SKILL, 'references/light-mode.md');
// Gate 1 ist keine gebündelte Rückfrage mehr, sondern eine Schleife. Bliebe
// die alte Formulierung im Grundsatz stehen, widerspräche er der Stufe —
// die Kollisions-Klasse, die /kontext-audit selbst als CRITICAL führt.
omits('C30 Grundsatz 2 ohne "gebündelte Rückfrage"', SPEC_SKILL, 'je als gebündelte Rückfrage');
contains('C31 spec-to-implementation nennt Stufe 6b', SPEC_SKILL, '6b');

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
