---
name: spec-to-implementation
description: Feature von der Idee bis zum verifizierten Merge — Brainstorm, Spec, Plan, Implementation mit zwei Gates.
disable-model-invocation: true
---

# Spec-to-Implementation — Feature-Workflow von Idee bis Merge

Dünner Orchestrator für **Brainstorm → Spec → Review → Plan → Review →
Implementation → Verifikation → Smoke → Finish**. Die Detail-Maschinerie steht
autoritativ in den Referenz-Files, gelesen **erst beim Eintritt in die Stufe**:

- `references/review-loop.md` — Review-Schleife + Triage (Stufen 2+4, L2)
- `references/smoke-gate.md` — Smoke-Gate-Maschinerie (Stufe 7)
- `references/codex-runtime.md` — Codex-Dispatch, Artefaktvertrag, Threads
- `references/progress-ledger.md` — Task-Zyklus + Resume (Stufe 5/L3)
- `references/light-mode.md` — Heuristik + Schritte L0–L5 (Grösse `light`)
- `references/fehlerverhalten.md` — Dispatch-, Preflight- und Divergenz-Fälle

## Projekt-Konfiguration (ZUERST lesen)

Projektspezifisches kommt aus dem Ziel-Repo, in dieser Reihenfolge:

1. `.codex/` bzw. `.claude/workflow.config.json` (Verzeichnis der laufenden
   Runtime gewinnt; Schema: Plugin-`templates/workflow.config.example.json`):
   `specsDir`, `plansDir`, `verifyCommands[]`, `devServer`, `defaultBranch`,
   `maxReviewRounds`, optional `models`.
2. Anwendbare `AGENTS.md` und `CLAUDE.md` — **explizit einlesen**. Bei Konflikt
   gilt in Codex `AGENTS.md`, in Claude `CLAUDE.md`; sichtbar notieren.
3. `package.json`-Scripts als Fallback.

Defaults: `specsDir = docs/specs`, `plansDir = docs/plans`, `defaultBranch = main`,
`maxReviewRounds = 5`. Fehlendes ableiten und in Gate 1 mitbestätigen.

## Grundsätze (NICHT verhandelbar)

1. **Git ist die Wahrheit**; `workflow-state.json` ist der Stage-Anker, ab
   Stufe 5/L3 zusätzlich `.superpowers/sdd/progress.md` als Recovery-Ledger.
   Bei Divergenz: anhalten, diagnostizieren, User fragen — nie blind weiter.
2. Genau **zwei menschliche Workflow-Gates** (Klärung vor der Spec-Finalisierung,
   Plan-Approval vor der Implementation) plus die separate **Merge-Bestätigung**.
   Ihre Form unterscheidet sich, weil ihre Frage sich unterscheidet: Gate 1 ist
   eine **Schleife** (`/grilling`) — was gebaut werden soll, erschliesst sich im
   Wechsel. Gate 2 und die Merge-Bestätigung sind **gebündelte Rückfragen** im
   Fragetool oder Chat — eine Ja/Nein-Entscheidung mit Kontext, kein
   Plan-Mode-Umweg.
3. Spec + Plan + Review-State auf dem Default-Branch, Implementation auf
   `feature/<name>` bzw. `fix/<name>`; Source-Edits auf dem Default-Branch
   sind blockiert (Branch-Guard-Hook, sonst prozedural).
4. Review-Findings werden **triagiert** (anwenden / bewusst akzeptieren /
   bewusst ablehnen / eskalieren), jede Entscheidung dokumentiert.
5. **Daten-Grenze:** Subagenten erhalten ausschliesslich git-getrackte,
   nicht-geheime Pfade (`git ls-files --error-unmatch <pfad>` vor jedem
   Dispatch); nie `.env`, Logs, Dumps, Auth-Artefakte.
6. **Zustand und Entscheide, nicht Inhalte.** Lange Dokumente schreibt der
   `doc-writer` (Spec, Plan-Files, Findings-Einarbeitung, L1-Dokument); zurück
   kommen Pfad + Zusammenfassung (≤ 8 Zeilen), nicht das Dokument. Aus grossen
   Dateien nur die benötigte Sektion; Rückgaben ≤ ~10 Zeilen, keine Dumps.
7. **Gates sind Session-Grenzen.** Nach Gate 2 und wenn der Kontext eng wird:
   Manifest committen, frischen Kontext empfehlen statt degradiert weiter —
   der Resume liest Manifest + Stufe, nicht die Historie.
8. **Subagenten sind optional, Ergebnisse nicht.** Jeden Dispatch durch Datei,
   Diff, Commit, Tests oder parsebare Findings verifizieren; leere Rückgabe ist ein
   Fehlerpfad. Vor dem ersten Codex-Dispatch `references/codex-runtime.md` lesen.

## Vier Weichen (in Stufe 0 erkennen, im Manifest persistieren — Browser: Stufe 7)

| Weiche | Werte | Auflösung |
|---|---|---|
| **Umgebung** | `codex-local` · `codex-cloud` · `claude-code-local` · `claude-code-web` · `other` | Tool-/Datei-Proben beim Start, kein Raten; bei Ambiguität User fragen |
| **Reviewer** | `codex-subagent` · `codex-mcp` · `claude-subagent` · `orchestrator` | nach tatsächlich verfügbarem Dispatch-/Review-Tool; keine Tool-Namen erfinden |
| **Grösse** | `full` · `light` | Heuristik + kurze User-Bestätigung (§ Light-Mode) |
| **Browser** | `chrome-mcp` · `playwright` · `manual` | **erst bei Eintritt in Stufe 7** erkennen (Fähigkeitsprobe: headless Chromium da?), dann in `environment.browser` persistieren |

Jede Kombination ist gültig. Resume in einer **anderen** Umgebung als
`environment.tool` ist für Stufen 0–4 erlaubt und blockiert ab Stufe 5 mit
Diagnose. `models` ist eine Präferenz pro Rolle: nur mitgeben, wenn das
Dispatch-Tool Modell/Effort kennt, sonst die Runtime-Vorgabe protokollieren;
`models.reviewer` (`auto` · `codex` · `claude`) steuert die Reviewer-Weiche mit.
Eine Ansage des Users schlägt die Config.

## Zustands-Manifest

`<plansDir>/YYYY-MM-DD-<feature>/workflow-state.json` — in Stufe 0 angelegt,
am Ende jeder Stufe aktualisiert:

```jsonc
{
  "featureSlug": "…", "mode": "full | light",
  "environment": { "tool": "…", "reviewer": "…", "browser": "…" },
  "specPath": "…", "planDir": "…", "branch": "…",
  "stage": 0, "stageStatus": "…", "approvedAt": null,
  "reviews": { "spec": { "rounds": 0, "reviewer": "…", "rejected": [] },
               "plan": { "rounds": 0, "reviewer": "…", "rejected": [] } },
  "agentFallbacks": [], "verification": {},
  "smoke": {},        // optional — Details in references/smoke-gate.md
  "devServer": {}     // optional — nur bei selbst gestartetem Server
}
```

Bei **jedem** Aufruf sichtbar eine Liste mit einem Eintrag pro Stufe plus Gates
führen — natives Todo-Werkzeug, sonst kurze Checkliste im Chat. Resume-Grundregel:
unbekannter Block ≠ Fehler; fehlender erwarteter Block = Block. Immer zuerst
Manifest und — ab Stufe 5/L3 — Ledger lesen und gegen den Repo-Zustand validieren
(Spec-Datei? Phasen-Files, nicht nur das Verzeichnis? Branch?).

## Stufen (Modus FULL)

| Stufe | Inhalt | Commit |
|---|---|---|
| 0 | Preflight (sauberer Worktree, Default-Branch, eindeutiger Slug, kein kollidierendes Plan-Dir/`feature/<name>`) + Manifest anlegen + Weichen erkennen | Default-Branch |
| 1 | Brainstorm + Spec — **Gate 1** | Default-Branch |
| 2 | Spec-Review-Schleife → `references/review-loop.md` | **ein** Squash-Commit |
| 3 | Plan via `doc-writer`: `<plansDir>/YYYY-MM-DD-<feature>/README.md` + `01-…md` … Phasen-Files mit TDD-Step-Checkboxen | Default-Branch |
| 4 | Plan-Review-Schleife → `references/review-loop.md` | **ein** Squash-Commit |
| G2 | **Gate 2: Plan-Approval** | Default-Branch |
| 5 | Implementation (§ Stufe 5) | `feature/<name>` |
| 6 | Verifikation: `verifyCommands` des Projekts, alle grün; Liste im Manifest dokumentieren | `feature/<name>` |
| 7 | Smoke-Gate → `references/smoke-gate.md` | `feature/<name>` |
| 8 | Finish: Backlog/Status nachziehen (§ Abschluss); **Merge nur auf explizite Bestätigung** | Merge |

### Gate 1 — Klärung im Wechsel (in Stufe 1)

Anforderungen per `/grilling` klären: eine Frage, warten, nächste, bis eine
lückenlose Zusammenfassung der Entscheide steht (Problem, Nutzer,
Randbedingungen, Nicht-Ziele). Fehlt der Skill, klärt der Orchestrator selbst —
dann gebündelt, max. 3 Runden, Lücken als dokumentierte Annahmen.

**Die Entscheide der Schleife gehören in die Spec**, nicht in den
Gesprächsverlauf: Annahmen, Nicht-Ziele und Randbedingungen. Nur dann ist
Stufe 1 eine Session-Grenze (Grundsatz 7) und Stufe 2 kann frisch beginnen.

Dann die Spec vom `doc-writer` nach `<specsDir>/YYYY-MM-DD-<topic>-design.md`
schreiben lassen — Format wie bestehende Specs, mindestens `## Annahmen` +
`## Akzeptanz` mit testbaren Bullets. Commit: `docs(spec): <topic> design`.

**Rich References bevorzugen.** Existiert ein reicheres Artefakt als Prosa, ist
es der bessere Spec-Träger: ein HTML-`Mockup` statt einer Design-Beschreibung
(und statt eines Screenshots), eine Test-Suite statt der Beschreibung des
erwarteten Outputs, die zu portierende Funktion statt ihrer Erklärung, eine
Rubric statt „soll gut sein". Dateien in Code haben Vorrang; liegen sie im Repo,
ist der getrackte Pfad die Referenz (Daten-Grenze gilt). Das Markdown-Dokument
bleibt Träger von Annahmen und Akzeptanz und **verweist** darauf, statt es
nachzuerzählen.

### Gate 2 — Plan-Approval

Gebündelte Rückfrage („Plan genehmigt → Implementation starten?") mit Spec-Pfad,
Plan-Pfad, triagierten Findings (Spec + Plan), Branch-Name und
Implementations-Ablauf. Nach Approval `approvedAt`, `stage = 5`,
`stageStatus = "implementation-ready"` ins Manifest committen, **bevor** der
Pre-Implementation-Preflight läuft — der prüft genau diese Felder
(`approvedAt` gesetzt + sauberer Worktree), sonst wäre es ein Approval-Bypass.
Danach frischen Kontext für Stufe 5 empfehlen (Grundsatz 7).

### Stufe 5 — Implementation

Branch idempotent: `feature/<name>` existiert (Resume) → `git checkout` +
Manifest-Abgleich, sonst `git checkout -b` vom Default-Branch. Dann
`references/progress-ledger.md` lesen, Ledger anlegen bzw. validieren und die
Plan-Tasks sequenziell nach dessen Zyklus abarbeiten: Task-Brief → `implementer` →
Report/Diff/Tests plus `git diff --name-only` gegen den Schreibbereich →
Task-Review (`spec-reviewer` mit `target=task`) → Complete-Zeile. In Codex gelten
zusätzlich Slot-/Thread- und Artefaktvertrag aus `references/codex-runtime.md`.

## Light-Mode (Grösse `light`)

Heuristik, Schritte L0–L5 und Abgrenzungen: `references/light-mode.md` —
gelesen, sobald die Grössen-Weiche auf `light` steht.

## Abschluss-Pflichten (Stufe 8 / L5)

- Backlog (falls vorhanden): umgesetzte Items abhaken, neue Funde eintragen.
- Status-Dokument (falls das Projekt eines führt): **max. 5 Zeilen** pro
  Abschluss, alles Längere gehört in Spec/Plan/Commits —

  ```markdown
  - **YYYY-MM-DD — <Titel>** (`<branch>`): <Was + Warum, 1–2 Sätze>.
    <Besonderheiten/Bruchstellen, 0–2 Sätze>.
    Spec: `<pfad>` · Plan: `<pfad>` · Tests: <kurz>.
  ```

  Dieser Block ist eine **bewusste Kopie über Plugin-Grenzen**: Quelle ist die
  context-kit-Doktrin (`kontext-architektur.md`), dupliziert weil Plugins
  einzeln gecacht sind — kein Drift-Befund.
- Weder Backlog noch Status im Projekt: Akzeptanz-Checkliste der Spec abhaken.

## Fehlerverhalten

Scheitert ein Dispatch, ist ein Preflight rot, blockt der Branch-Hook oder
divergieren Manifest und Repo: `references/fehlerverhalten.md` — **lesen,
bevor improvisiert wird.**
