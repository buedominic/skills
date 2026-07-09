---
name: kontext-audit
description: Use to keep a project's Claude context current and lean — audits CLAUDE.md, AGENTS.md and linked living documents for budget violations, stale facts (drift against the code), duplicated doctrine and context bombs, then proposes and applies a cleanup (e.g. "räum die CLAUDE.md auf", "kontext audit", "die doku stimmt nicht mehr mit dem code überein", "status.md ist zu gross").
---

# Kontext-Audit — Kontext aktuell + schlank halten

Prüft die Steuerungs-Artefakte eines Projekts gegen die Doktrin und räumt
auf. Report zuerst, Edits erst nach User-Bestätigung.

**Doktrin ZUERST lesen** (erster Fund gewinnt):
`references/kontext-architektur.md` (neben dieser Datei — bei
Einzel-Skill-Installation, z.B. Codex) oder
`../../docs/kontext-architektur.md` (Plugin-/Repo-Layout) —
Schichten-Modell, Budgets, Adapter-Regel. Ist keine der beiden vorhanden,
gilt die Kurzfassung:

> CLAUDE.md wird in jeder Session geladen → hartes Budget ≤ ~120 Zeilen;
> Detail in verlinkte Doku/Archive. Eine Wahrheit, dünne Adapter: jeder
> Fakt genau einmal, Adapter verweisen statt kopieren. Status-Einträge
> max. 5 Zeilen, Historie in `*-archiv.md`; Pflicht-Referenzen > ~300
> Zeilen sind Kontext-Bomben (Archiv-Split).

## Ablauf

### 1. Inventar

Sammle die Steuerungs-Artefakte: `CLAUDE.md`, `AGENTS.md`, weitere
Tool-Handbücher (z.B. `WORKFLOW.md`), `.claude/` (skills, agents, config),
plus alle Dokumente, die CLAUDE.md als Pflicht-Referenz verlinkt
(status, backlog, Spezifikationen). Miss pro Datei die Zeilenzahl.

### 2. Budget-Check

| Artefakt | Budget | Bei Verstoss |
|---|---|---|
| `CLAUDE.md` (und jeder weitere Adapter) | ≤ ~120 Zeilen | Diät: Absätze → 1 Zeile + Verweis; Enzyklopädisches → Schicht-2-Doku |
| Status-Dokument | < ~50 Zeilen | Alt-Einträge → `status-archiv.md`; künftige Einträge aufs 5-Zeilen-Format |
| Backlog | funktionsfähig mit Archiv | erledigte/verwaiste Items → Archiv |
| immer geladene Skill-Prompts (`SKILL.md`) | Orchestrator-Kern ~150–200 Zeilen | Detail-Maschinerie → `references/`-Files (Progressive Disclosure) |

### 3. Drift-Check (Fakten gegen Code)

Verifiziere jede prüfbare Behauptung der Adapter stichprobenartig gegen
das Repo — mit Fundstelle:

- Befehle: existieren die genannten Scripts noch in `package.json` (bzw.
  Makefile/Tooling)? Fehlen neue, täglich genutzte?
- Pfade/Module: existieren referenzierte Dateien und Verzeichnisse noch?
- Architektur-Fakten (Deploy-Weg, zentrale Module, Event-/API-Listen):
  stimmt die Aussage noch mit dem Code überein?
- Skill-/Tool-Referenzen: sind referenzierte Skills/MCP-Server (noch)
  verfügbar bzw. verfügbarkeits-neutral formuliert?

Jeder Befund: `{ stelle, behauptet, tatsächlich (mit Datei:Zeile), fix }`.

### 4. Duplikat-Check (eine Wahrheit, dünne Adapter)

Suche dieselbe Regel/denselben Fakt an mehr als einer Stelle (CLAUDE.md ↔
AGENTS.md ↔ Handbücher ↔ Agent-Definitionen). Pro Duplikat: die EINE
Quelle bestimmen (wo gehört es nach Schichten-Modell hin?), alle anderen
Stellen durch Verweis ersetzen. Bereits gedriftete Duplikate (Kopien mit
abweichendem Inhalt) sind CRITICAL — hier zusätzlich klären, welche
Version stimmt.

### 5. Kontext-Bomben

Dokumente, die als Pflicht-Referenz verlinkt sind und > ~300 Zeilen haben:
Split- oder Archiv-Vorschlag (heisser Teil bleibt, Historie →
`*-archiv.md`). Prüfe auch Format-Zwänge, die Blähung erzeugen („Format
wie die bestehenden Einträge" bei bereits aufgeblähten Einträgen) — die
Format-Vorgabe selbst korrigieren, sonst wächst es nach.

### 6. Report + Umsetzung

Report als kompakte Findings-Liste, sortiert nach Schwere
(`CRITICAL` gedriftete Duplikate/falsche Fakten → `HOCH` Budget/Bomben →
`MITTEL` Redundanz/Politur), je 1–2 Zeilen mit Fundstelle und konkretem
Fix. Dann EINE gebündelte Rückfrage (`AskUserQuestion`): alles umsetzen /
nur CRITICAL+HOCH / nur Report.

Umsetzung: thematisch gebündelte Commits (Diät, Archiv-Umzug,
Duplikat-Auflösung getrennt), Archiv-Umzüge verlustfrei (verschieben,
nicht löschen). Abschluss: neue Zeilen-Stände gegen die Budgets.

## Leitplanken

- Inhalte werden verschoben oder verwiesen, NIE ersatzlos gelöscht —
  ausser sie sind nachweislich falsch (dann mit Befund dokumentiert).
- Konventions-INHALTE sind nicht Gegenstand des Audits (nur ihre
  Duplikation/Platzierung); fachliche Regel-Änderungen → User.
- Keine Edits vor der Bestätigung in Schritt 6.
- `.env`/Secrets nie lesen; Audit-Report enthält keine Secret-Werte.
