---
name: spec-to-implementation
description: Use when the user wants to take a feature from idea to merged implementation (e.g. "/spec-to-implementation <feature>", "bau Feature X", "neues Feature von Spec bis Merge") or run a small fix through the light-mode pipeline. Runs the brainstorm→spec→review→plan→review→implement pipeline with only two human gates (clarifying questions + plan approval). Works in any repo — project specifics come from the project's CLAUDE.md and an optional workflow config.
---

# Spec-to-Implementation — Feature-Workflow von Idee bis Merge

Dünner Orchestrator für die Pipeline **Brainstorm → Spec → Review → Plan →
Review → Implementation → Verifikation → Smoke → Finish**. Detail-Maschinerie
liegt in Referenz-Files (Progressive Disclosure) und wird **erst beim
Eintritt in die jeweilige Stufe** gelesen:

- `references/review-loop.md` — Review-Schleifen-Mechanik + Triage (Stufen 2+4)
- `references/smoke-gate.md` — Smoke-Gate-Maschinerie (Stufe 7)

## Projekt-Konfiguration (ZUERST lesen)

Projektspezifisches kommt aus dem Ziel-Repo, in dieser Reihenfolge:

1. `.claude/workflow.config.json` (falls vorhanden — Schema siehe
   Plugin-`templates/workflow.config.example.json`): `specsDir`, `plansDir`,
   `verifyCommands[]`, `devServer`, `defaultBranch`, `maxReviewRounds`.
2. Die `CLAUDE.md` des Projekts (Konventionen, Verifikations-Befehle,
   Branch-Strategie, Spec-/Plan-Format). **Explizit einlesen.**
3. `package.json`-Scripts als Fallback.

Defaults: `specsDir = docs/specs`, `plansDir = docs/plans`,
`defaultBranch = main`, `maxReviewRounds = 5`. Fehlen essenzielle Angaben,
leite sie aus dem Projekt ab und bestätige sie in Gate 1 gleich mit.

## Grundsätze (NICHT verhandelbar)

1. Git ist die Wahrheit; das Manifest `workflow-state.json` ist der
   Fortschritts-Anker. Bei Divergenz zwischen Manifest und Repo: anhalten,
   diagnostizieren, User fragen — NICHT blind fortfahren.
2. Genau **zwei menschliche Workflow-Gates** (Klärungsfragen vor der
   Spec-Finalisierung; Plan-Approval vor der Implementation) plus die
   separate **Merge-Bestätigung**. Beide Gates laufen als einfache
   `AskUserQuestion` — KEIN EnterPlanMode/ExitPlanMode-Umweg.
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

## Drei Weichen (Stufe 0 erkennen, im Manifest persistieren)

| Weiche | Werte | Auflösung |
|---|---|---|
| **Umgebung** | `claude-code-local` · `claude-code-web` · `other` | Tool-/Datei-Proben beim Start, kein Raten; bei Ambiguität User fragen |
| **Reviewer** | `codex` (bevorzugt) · `claude-subagent` (Fallback) | pro Review-Dispatch: ist `mcp__codex__codex` als Tool verfügbar? |
| **Grösse** | `full` · `light` | Heuristik + kurze User-Bestätigung (§ Light-Mode) |

Browser-Fähigkeit für das Smoke-Gate analog erkennen:
`chrome-mcp` · `playwright` (headless Chromium vorhanden, z.B. Remote-Session)
· `manual`. Ergebnis in `environment.browser`.

**Modell-Wahl für Subagenten:** Ohne Konfiguration erben `spec-reviewer`
und `implementer` das Session-Modell (`model: inherit`). Der optionale
`models`-Block der `workflow.config.json` übersteuert das pro Rolle
(Modell-Alias + Reasoning-Effort) — der Orchestrator gibt die Werte beim
Dispatch mit. `models.reviewer` steuert zusätzlich die Reviewer-Weiche:
`auto` (Default: Codex, wenn verfügbar) · `codex` (erzwingen; nicht
verfügbar → harter Block statt stillem Fallback) · `claude` (nie
delegieren). Eine Ansage des Users im Gespräch schlägt die Config. Das
Codex-interne Modell wird in der Codex-MCP-Konfiguration gewählt, nicht
hier.

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

TodoWrite-Liste mit einem Eintrag pro Stufe anlegen (inkl. der zwei Gates).

## Stufen (Modus FULL)

| Stufe | Inhalt | Commit |
|---|---|---|
| 0 | Preflight (sauberer Worktree, Default-Branch, eindeutiger Slug, kein kollidierendes Plan-Dir/`feature/<name>`) + Manifest anlegen + Weichen erkennen | Default-Branch |
| 1 | Brainstorm + Spec — **Gate 1** | Default-Branch |
| 2 | Spec-Review-Schleife → `references/review-loop.md` | **ein** Squash-Commit |
| 3 | Plan via `doc-writer`: `<plansDir>/YYYY-MM-DD-<feature>/README.md` + `01-…md` … Phasen-Files mit TDD-Step-Checkboxen | Default-Branch |
| 4 | Plan-Review-Schleife → `references/review-loop.md` | **ein** Squash-Commit |
| G2 | **Gate 2: Plan-Approval** | Default-Branch |
| 5 | Implementation: je Plan-Task ein frischer `implementer`-Agent (TDD, Modell/Effort aus `models.implementerModel`/`implementerEffort`), Code-Review dazwischen; nach jedem Task `git diff --name-only` gegen den erwarteten Schreibbereich | `feature/<name>` |
| 6 | Verifikation: `verifyCommands` des Projekts, alle grün; Liste im Manifest dokumentieren | `feature/<name>` |
| 7 | Smoke-Gate → `references/smoke-gate.md` | `feature/<name>` |
| 8 | Finish: Backlog/Status nachziehen (§ Abschluss); **Merge nur auf explizite Bestätigung** | Merge |

### Gate 1 — Klärungsfragen (in Stufe 1)

Anforderungen klären (falls installiert via `superpowers:brainstorming`,
sonst strukturiert selbst: Problem, Nutzer, Randbedingungen, Nicht-Ziele).
Offene Punkte gebündelt via `AskUserQuestion` (max. 3 Runden; danach Lücken
mit dokumentierten Annahmen füllen). Dann die Spec vom `doc-writer`-Agent
nach `<specsDir>/YYYY-MM-DD-<topic>-design.md` schreiben lassen
(Material: geklärte Anforderungen + Annahmen; Format wie bestehende Specs
des Projekts, mindestens `## Annahmen` + `## Akzeptanz`-Checkliste mit
testbaren Bullets). Commit: `docs(spec): <topic> design`.

### Gate 2 — Plan-Approval

Einfache `AskUserQuestion` („Plan genehmigt → Implementation starten?") mit
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
| L3 | Implementation auf `fix/<name>` (TDD bleibt) |
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

- Review-Backend nicht verfügbar → Reviewer-Weiche greift
  (`claude-subagent`-Fallback); scheitert auch der Agent-Dispatch → harter
  Block mit Diagnose. Niemals ein Review still überspringen.
- Branch-Hook blockt einen Edit → du bist noch auf dem Default-Branch; in
  Stufe 5 zuerst den Feature-Branch anlegen.
- Manifest/Repo-Divergenz → blockieren, Diagnose dokumentieren,
  User-Entscheid.
- Preflight rot (dirty Worktree, falscher Branch, Slug-Kollision) → klare
  Abbruch-Meldung mit Fix-Hinweis, kein stilles Fortfahren.
