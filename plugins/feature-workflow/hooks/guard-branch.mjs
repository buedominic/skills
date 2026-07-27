#!/usr/bin/env node
// PreToolUse-Hook: blockt Source-Edits auf dem geschützten Branch (Default: main).
// Workflow-Regel: Spec/Plan/Docs auf main, Implementation auf feature/-Branch.
//
// Opt-in pro Projekt: Der Hook ist NUR aktiv, wenn im Projekt
// `.claude/branch-guard.json` existiert (Schema siehe
// templates/branch-guard.example.json im Plugin). Ohne Config: no-op —
// damit blockiert das Plugin niemanden, der den Schutz nicht will.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Datei-Write-Tools, die der Hook abdeckt.
const WRITE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);

// Zwei Git-Operationen, die unwiederbringlich sind: kein Reflog, kein
// `--abort`, keine Kopie. Alles andere bleibt unangetastet — ein Guardrail,
// der legitime Arbeit blockt, wird umgangen und schützt dann gar nichts.
// `--force-with-lease` ist ausdrücklich erlaubt: es ist der Weg nach einem
// Rebase und bricht von selbst ab, wenn jemand anderes gepusht hat.
const FORCE_PUSH = /\bgit\s+push\b(?=.*(?:--force\b|\s-f\b))(?!.*--force-with-lease)/;
const HARD_RESET = /\bgit\s+(?:reset\s+--hard|checkout\s+--\s|restore\s)/;

// Repo-Wurzel aus CLAUDE_PROJECT_DIR (vom Hook-Runner gesetzt), Fallback cwd.
// Sonst checkt der Hook bei Aufruf aus fremdem cwd den falschen Branch/Root.
const repoRoot = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

function loadConfig() {
  try {
    const raw = readFileSync(path.join(repoRoot, '.claude', 'branch-guard.json'), 'utf8');
    const cfg = JSON.parse(raw);
    // Case-insensitive (Windows: Src/foo.ts adressiert dieselbe Datei wie
    // src/foo.ts) — der `i`-Flag verhindert Bypass über Gross-/Kleinschreibung.
    const toRegex = (arr) => (Array.isArray(arr) ? arr : []).map((p) => new RegExp(p, 'i'));
    return {
      protectedBranch: typeof cfg.protectedBranch === 'string' ? cfg.protectedBranch : 'main',
      protected: toRegex(cfg.protected),
      allowed: toRegex(cfg.allowed),
    };
  } catch {
    return null; // keine/kaputte Config -> Hook inaktiv
  }
}

// Stdin über den Stream lesen (robust auf Windows-Pipes; readFileSync(0) ist
// dort unzuverlässig).
function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve(''); // kein Pipe -> kein Event
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(''));
  });
}

function parseEvent(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function currentBranch() {
  // Test-Override für deterministische, branch-unabhängige Tests.
  if (process.env.GUARD_BRANCH_OVERRIDE) return process.env.GUARD_BRANCH_OVERRIDE;
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: repoRoot }).trim();
  } catch {
    return null;
  }
}

function relPath(p) {
  if (!p) return '';
  // Auf Repo-relativen POSIX-Pfad normalisieren (./, .\, absolut, Windows-Separator).
  const abs = path.resolve(repoRoot, String(p));
  return path.relative(repoRoot, abs).split(path.sep).join('/');
}

// Sammelt alle Ziel-Pfade aus dem Tool-Input (verschiedene Tools nutzen andere Felder).
function targetPaths(input) {
  if (!input) return [];
  const out = [];
  if (input.file_path) out.push(input.file_path);
  if (input.notebook_path) out.push(input.notebook_path);
  if (Array.isArray(input.edits)) for (const e of input.edits) if (e?.file_path) out.push(e.file_path);
  return out;
}

const config = loadConfig();
if (!config || config.protected.length === 0) process.exit(0); // Opt-in fehlt -> nicht blockieren.

const event = parseEvent(await readStdin());
if (!event) process.exit(0); // Im Zweifel nicht blockieren.

const toolName = event.tool_name ?? '';

// --- Git-Guardrail (Bash) ------------------------------------------------
if (toolName === 'Bash') {
  const cmd = String(event.tool_input?.command ?? '');

  if (FORCE_PUSH.test(cmd)) {
    process.stderr.write(
      'Git-Schutz: `push --force` überschreibt fremde Commits ohne Vorwarnung.\n' +
        'Nimm `git push --force-with-lease` — es tut dasselbe und bricht ab,\n' +
        'wenn jemand anderes zwischenzeitlich gepusht hat.\n',
    );
    process.exit(2);
  }

  // Nur blocken, wenn tatsächlich etwas zu verlieren ist: bei sauberem
  // Worktree ist `reset --hard` harmlos und ein Block wäre reine Schikane.
  if (HARD_RESET.test(cmd)) {
    let dirty = '';
    try {
      dirty = execSync('git status --porcelain --untracked-files=no', {
        encoding: 'utf8',
        cwd: repoRoot,
      }).trim();
    } catch {
      dirty = ''; // Kein Git-Repo o.ä. -> nicht blockieren.
    }
    if (dirty) {
      process.stderr.write(
        'Git-Schutz: nicht committete Änderungen an getrackten Dateien gingen\n' +
          'dabei verloren — ohne Reflog-Rettung.\n' +
          'Sichere sie zuerst: `git stash` (oder committe sie auf einen Branch).\n',
      );
      process.exit(2);
    }
  }

  process.exit(0);
}

// --- Branch-Schutz (Datei-Writes) ----------------------------------------
if (!WRITE_TOOLS.has(toolName)) process.exit(0);

const branch = currentBranch();
if (branch !== config.protectedBranch) process.exit(0); // Nur auf dem geschützten Branch wachen.

const paths = targetPaths(event.tool_input).map(relPath);
const blocked = paths.find(
  (f) => config.protected.some((re) => re.test(f)) && !config.allowed.some((re) => re.test(f)),
);

if (blocked) {
  // Exit-Code 2 = Block mit Begründung auf stderr (Claude-Code-Konvention).
  process.stderr.write(
    `Branch-Schutz: '${blocked}' darf nicht auf '${config.protectedBranch}' editiert werden.\n` +
      `Implementation gehört auf einen feature/-Branch (siehe .claude/branch-guard.json).\n` +
      `Wechsle mit: git checkout -b feature/<name>\n`,
  );
  process.exit(2);
}

process.exit(0);
