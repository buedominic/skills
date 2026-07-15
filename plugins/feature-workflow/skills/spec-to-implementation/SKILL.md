---
name: spec-to-implementation
description: Take a feature from idea to verified implementation or run a small fix through a light pipeline (e.g. "$spec-to-implementation FEATURE", "/spec-to-implementation FEATURE", "bau Feature X", "neues Feature von Spec bis Merge"). Use for the complete brainstorm→spec→review→plan→review→implement workflow with durable resume state, bounded Codex subagents, task progress and two human gates. Works across Codex and Claude; project specifics come from AGENTS.md/CLAUDE.md and optional workflow config.
---

# Spec-to-Implementation — Feature-Workflow von Idee bis Merge

Dünner Orchestrator für die Pipeline **Brainstorm → Spec → Review → Plan →
Review → Implementation → Verifikation → Smoke → Finish**. Detail-Maschinerie
liegt in Referenz-Files (Progressive Disclosure) und wird **erst beim
Eintritt in die jeweilige Stufe** gelesen:

- `references/review-loop.md` — Review-Schleifen-Mechanik + Triage (Stufen 2+4)
- `references/smoke-gate.md` — Smoke-Gate-Maschinerie (Stufe 7)
- `references/codex-runtime.md` — Codex-Dispatch, Artefaktprüfung und
  Thread-Lifecycle (vor erstem Codex-Subagenten)
- `references/progress-ledger.md` — `.superpowers/sdd/progress.md` für
  taskgenaues Resume (beim Eintritt in Stufe 5/L3)

## Projekt-Konfiguration (ZUERST lesen)

Projektspezifisches kommt aus dem Ziel-Repo, in dieser Reihenfolge:

1. `.codex/workflow.config.json` oder `.claude/workflow.config.json` (falls
   vorhanden; bei beiden gewinnt `.codex/` in Codex und `.claude/` in Claude;
   Schema siehe
   Plugin-`templates/workflow.config.example.json`): `specsDir`, `plansDir`,
   `verifyCommands[]`, `devServer`, `defaultBranch`, `maxReviewRounds`.
2. Die anwendbaren `AGENTS.md`-Dateien und die `CLAUDE.md` des Projekts
   (Konventionen, Verifikations-Befehle, Branch-Strategie,
   Spec-/Plan-Format). **Explizit einlesen.** Bei Konflikt gilt in Codex
   `AGENTS.md`, in Claude `CLAUDE.md`; den Konflikt sichtbar notieren.
3. `package.json`-Scripts als Fallback.

Defaults: `specsDir = docs/specs`, `plansDir = docs/plans`,
`defaultBranch = main`, `maxReviewRounds = 5`. Fehlen essenzielle Angaben,
leite sie aus dem Projekt ab und bestätige sie in Gate 1 gleich mit.

## Grundsätze (NICHT verhandelbar)

1. Git ist die Wahrheit; das Manifest `workflow-state.json` ist der
   Stage-Anker. In Stufe 5/L3 ist `.superpowers/sdd/progress.md` zusätzlich
   der taskgenaue Recovery-Ledger. Bei Divergenz: anhalten, diagnostizieren,
   User fragen — NICHT blind fortfahren.
2. Genau **zwei menschliche Workflow-Gates** (Klärungsfragen vor der
   Spec-Finalisierung; Plan-Approval vor der Implementation) plus die
   separate **Merge-Bestätigung**. Beide Gates laufen als einfache gebündelte
   User-Rückfrage über das verfügbare Fragetool oder im Chat — kein
   Plan-Mode-Umweg.
3. Spec + Plan + Review-State auf dem Default-Branch; Implementation auf
   `feature/<name>` bzw. `fix/<name>`. Source-Edits auf dem Default-Branch
   sind blockiert (Branch-Guard-Hook, falls im Projekt aktiviert — sonst
   gilt die Regel prozedural).
4. Review-Findings werden **triagiert** (anwenden / bewusst akzeptieren /
   bewusst ablehnen / eskalieren), jede Entscheidung dokumentiert.
5. Daten-Grenze: Reviewer erhalten ausschliesslich git-getrackte,
   nicht-geheime Pfade (`git ls-files --error-unmatch <pfad>` vor jedem
   Dispatch); nie `.env`, Logs, Dumps, Auth-Artefakte.

## Kontext-Disziplin (verbindlich — der Orchestrator bleibt schlank)

Der Orchestrator hält Zustand und Entscheide, NICHT Inhalte:

1. **Lange Dokumente schreibt der `doc-writer`-Agent**, nie der
   Orchestrator selbst: Spec (Stufe 1), Plan-Files (Stufe 3), das
   Einarbeiten triagierter Findings (Stufen 2/4), das L1-Mini-Dokument.
   Zurück kommen nur Pfad + Kurz-Zusammenfassung (≤ 8 Zeilen) — der
   Orchestrator liest das Dokument danach NICHT komplett ein.
2. **Abschnittsweise lesen:** aus grossen Dokumenten nur die gerade
   benötigte Sektion (z.B. nur `## Akzeptanz` für das Smoke-Gate,
   nur den betroffenen Plan-Task für den `implementer`-Dispatch).
   Nichts doppelt einlesen, was schon zusammengefasst im Kontext steht.
3. **Subagenten-Rückgaben sind Verträge:** kompakt (Richtwert ≤ 10
   Zeilen), keine Datei-Dumps, keine Diffs — Details stehen in Dateien
   und Commits.
4. **Gates sind Session-Grenzen.** Das Manifest existiert genau dafür:
   Nach Gate 2 (Plan-Approval) dem User aktiv einen frischen Kontext
   empfehlen (`/clear` bzw. neue Session) — der Resume liest nur Manifest
   + aktuelle Stufe, nicht die Historie. Dasselbe gilt, wann immer der
   Kontext eng wird: Manifest committen, sauberen Wiedereinstieg
   anbieten, NICHT degradiert weiterarbeiten.
5. **Subagenten sind optional, Ergebnisse nicht.** Vor dem ersten Codex-
   Dispatch `references/codex-runtime.md` lesen. Jeden Dispatch durch Datei,
   Diff, Commit, Tests oder parsebare Findings verifizieren. Leere Rückgabe
   ist ein Fehlerpfad. Thread-Slots begrenzen und Threads schliessen oder pro
   Rolle wiederverwenden; niemals für jede Task unbeschränkt neue Threads
   ansammeln.

## Drei Weichen (Stufe 0 erkennen, im Manifest persistieren)

| Weiche | Werte | Auflösung |
|---|---|---|
| **Umgebung** | `codex-local` · `codex-cloud` · `claude-code-local` · `claude-code-web` · `other` | Tool-/Datei-Proben beim Start, kein Raten; bei Ambiguität User fragen |
| **Reviewer** | `codex-subagent` · `codex-mcp` · `claude-subagent` · `orchestrator` | nach tatsächlich verfügbarem Dispatch-/Review-Tool; keine Tool-Namen erfinden |
| **Grösse** | `full` · `light` | Heuristik + kurze User-Bestätigung (§ Light-Mode) |

Browser-Fähigkeit für das Smoke-Gate analog erkennen:
`chrome-mcp` · `playwright` (headless Chromium vorhanden, z.B. Remote-Session)
· `manual`. Ergebnis in `environment.browser`.

**Modell-Wahl für Subagenten:** Ohne Konfiguration erben `spec-reviewer`
und `implementer` die Runtime-Konfiguration. Der optionale `models`-Block
der `workflow.config.json` ist eine Präferenz pro Rolle. Nur wenn das konkrete
Dispatch-Tool Modell/Effort unterstützt, diese Werte mitgeben; andernfalls
sichtbar protokollieren, dass die Runtime-Vorgabe gilt. `models.reviewer`
steuert zusätzlich die Reviewer-Weiche: `auto` · `codex` · `claude`.
Eine Ansage des Users im Gespräch schlägt die Config.

Jede Kombination ist gültig. Resume in einer **anderen** Umgebung als
`environment.tool` ist für Stufen 0–4 erlaubt (reine Doc-Arbeit) und
blockiert ab Stufe 5 mit Diagnose.

## Zustands-Manifest

`<plansDir>/YYYY-MM-DD-<feature>/workflow-state.json` — angelegt in
Stufe 0, aktualisiert am Ende jeder Stufe:

```jsonc
{
  "featureSlug": "…",
  "mode": "full | light",
  "environment": { "tool": "…", "reviewer": "…", "browser": "…" },
  "specPath": "…", "planDir": "…", "branch": "…",
  "stage": 0, "stageStatus": "…", "approvedAt": null,
  "reviews": { "spec": { "rounds": 0, "reviewer": "…", "rejected": [] },
               "plan": { "rounds": 0, "reviewer": "…", "rejected": [] } },
  "agentFallbacks": [],
  "verification": {},
  "smoke": {},        // optionaler Block — Details in references/smoke-gate.md
  "devServer": {}     // optionaler Block — nur bei selbst gestartetem Server
}
```

Resume-Grundregel: unbekannter Block ≠ Fehler; fehlender erwarteter
Block = Block. Bei jedem Aufruf zuerst Manifest lesen, dann gegen den
Repo-Zustand validieren (Spec-Datei da? Phasen-Files da — nicht nur das
Verzeichnis? Branch?).

## Erste Handlung

Mit dem nativen Plan-/Todo-Werkzeug der Runtime eine sichtbare Liste mit einem
Eintrag pro Stufe anlegen (inkl. der zwei Gates). Fehlt ein solches Werkzeug,
eine kurze Checkliste im Chat führen. Beim Resume zuerst Manifest und — ab
Stufe 5/L3 — den Progress-Ledger lesen, erst danach die Liste rekonstruieren.

## Stufen (Modus FULL)

| Stufe | Inhalt | Commit |
|---|---|---|
| 0 | Preflight (sauberer Worktree, Default-Branch, eindeutiger Slug, kein kollidierendes Plan-Dir/`feature/<name>`) + Manifest anlegen + Weichen erkennen | Default-Branch |
| 1 | Brainstorm + Spec — **Gate 1** | Default-Branch |
| 2 | Spec-Review-Schleife → `references/review-loop.md` | **ein** Squash-Commit |
| 3 | Plan via `doc-writer`: `<plansDir>/YYYY-MM-DD-<feature>/README.md` + `01-…md` … Phasen-Files mit TDD-Step-Checkboxen | Default-Branch |
| 4 | Plan-Review-Schleife → `references/review-loop.md` | **ein** Squash-Commit |
| G2 | **Gate 2: Plan-Approval** | Default-Branch |
| 5 | Implementation: `references/progress-ledger.md` lesen; Plan-Tasks sequenziell über den begrenzten `implementer`-Rollen-Pool (TDD), Task-Review dazwischen; nach jedem Task Artefaktvertrag und `git diff --name-only` gegen den erwarteten Schreibbereich prüfen | `feature/<name>` |
| 6 | Verifikation: `verifyCommands` des Projekts, alle grün; Liste im Manifest dokumentieren | `feature/<name>` |
| 7 | Smoke-Gate → `references/smoke-gate.md` | `feature/<name>` |
| 8 | Finish: Backlog/Status nachziehen (§ Abschluss); **Merge nur auf explizite Bestätigung** | Merge |

### Gate 1 — Klärungsfragen (in Stufe 1)

Anforderungen klären (falls in der aktuellen Runtime als Skill verfügbar via
`superpowers:brainstorming`,
sonst strukturiert selbst: Problem, Nutzer, Randbedingungen, Nicht-Ziele).
Offene Punkte gebündelt über das verfügbare Fragetool oder im Chat (max. 3
Runden; danach Lücken
mit dokumentierten Annahmen füllen). Dann die Spec vom `doc-writer`-Agent
nach `<specsDir>/YYYY-MM-DD-<topic>-design.md` schreiben lassen
(Material: geklärte Anforderungen + Annahmen; Format wie bestehende Specs
des Projekts, mindestens `## Annahmen` + `## Akzeptanz`-Checkliste mit
testbaren Bullets). Commit: `docs(spec): <topic> design`.

### Gate 2 — Plan-Approval

Einfache gebündelte User-Rückfrage („Plan genehmigt → Implementation
starten?") mit
Zusammenfassung: Spec-Pfad, Plan-Pfad, triagierte Findings (Spec + Plan),
Branch-Name, Implementations-Ablauf. Nach Approval: `approvedAt`,
`stage = 5`, `stageStatus = "implementation-ready"` ins Manifest committen,
**bevor** der Pre-Implementation-Preflight läuft (der genau diese Felder
prüft: `approvedAt` gesetzt + sauberer Worktree — sonst Approval-Bypass).
Danach dem User einen **frischen Kontext für Stufe 5** empfehlen
(Kontext-Disziplin § 4) — der Resume steigt über das Manifest direkt in
die Implementation ein.

### Stufe 5 — Branch-Wechsel (idempotent)

Existiert `feature/<name>` schon (Resume) → `git checkout` + gegen Manifest
validieren; sonst `git checkout -b` vom Default-Branch.

Danach `references/progress-ledger.md` lesen und den Ledger vor dem ersten
Implementer-Dispatch initialisieren beziehungsweise validieren. Die
Implementation läuft sequenziell. In Codex gelten zusätzlich Slot-Budget,
Thread-Reuse/Close und der Artefaktvertrag aus `references/codex-runtime.md`.
Pro Task: Task-Brief erzeugen → `implementer` → Report/Diff/Tests prüfen →
Review-Paket aus `baseCommit..HEAD` erzeugen → `spec-reviewer` mit
`target=task` → Critical/Important beheben und re-reviewen → erst dann die
Complete-Zeile in den Ledger schreiben.

## Light-Mode (Grösse `light`)

**Qualifikation (Heuristik):** kein Schema-/Migrations-Change · Kern-Diff
≤ ~3 Dateien (Tests zählen nicht) · kein neues Event / kein neuer Endpoint ·
kein Security-Touchpoint (Auth/Rollen). Bei qualifizierenden Aufgaben den
Light-Mode aktiv **vorschlagen**; kurze User-Bestätigung ist Pflicht;
Übersteuern in beide Richtungen jederzeit möglich. Wird die Heuristik
mittendrin verletzt (doch Schema-Change nötig) → anhalten, auf FULL
eskalieren (Spec/Plan nachziehen), nicht still weitermachen.

| Schritt | Inhalt |
|---|---|
| L0 | Preflight + Manifest (`mode: "light"`) |
| L1 | **Ein** Mini-Dokument `<specsDir>/<datum>-<slug>-fix.md`: Problem, Root-Cause (falls bekannt), Fix-Ansatz, Akzeptanz (3–5 Bullets) — Commit auf Default-Branch |
| L2 | **Eine** Review-Runde (Reviewer-Weiche wie FULL); Triage; ein Squash-Commit |
| L3 | Implementation auf `fix/<name>` (TDD bleibt); Task-Ledger und Codex-Runtime-Vertrag gelten analog |
| L4 | Verifikation: Typecheck + betroffene Test-Suites + Build (Integration nur bei API-/DB-Berührung) |
| L5 | Finish: Backlog/Status (5-Zeilen-Format), Merge auf Bestätigung |

Kein Gate 1 (Klärungsfragen nur bei Bedarf, formlos), kein
Plan-Approval-Gate, kein Smoke-Gate-Apparat (manuelle Bestätigung oder ein
gezielter Browser-Check genügt, im Manifest notiert). Die Merge-Bestätigung
bleibt.

## Abschluss-Pflichten (Stufe 8 / L5)

- Backlog des Projekts (falls vorhanden): umgesetzte Items als erledigt
  markieren, neue Funde eintragen.
- Status-Dokument (falls das Projekt eines führt): **max. 5 Zeilen** pro
  Abschluss —

  ```markdown
  - **YYYY-MM-DD — <Titel>** (`<branch>`): <Was + Warum, 1–2 Sätze>.
    <Besonderheiten/Bruchstellen, 0–2 Sätze>.
    Spec: `<pfad>` · Plan: `<pfad>` · Tests: <kurz>.
  ```

  Alles Längere gehört in Spec/Plan/Commits.
- Führt das Projekt weder Backlog noch Status: Akzeptanz-Checkliste der
  Spec abhaken.

## Fehlerverhalten

- Review-Backend nicht verfügbar → Reviewer-Weiche greift. Scheitert ein
  Agent-Dispatch oder liefert er weder parsebaren Status noch nachweisbares
  Artefakt, einmal gezielt nachfassen und danach den dokumentierten
  Orchestrator-Fallback nutzen beziehungsweise hart blockieren. Niemals einen
  Review oder eine Implementation still überspringen.
- Agent-Slot-Limit erreicht → vorhandenen Rollen-Thread schliessen oder
  wiederverwenden; keine Spawn-Schleife.
- Branch-Hook blockt einen Edit → du bist noch auf dem Default-Branch; in
  Stufe 5 zuerst den Feature-Branch anlegen.
- Manifest/Repo-Divergenz → blockieren, Diagnose dokumentieren,
  User-Entscheid.
- Preflight rot (dirty Worktree, falscher Branch, Slug-Kollision) → klare
  Abbruch-Meldung mit Fix-Hinweis, kein stilles Fortfahren.
