---
name: kontext-audit
description: Use when a project's Claude context has gone stale or bloated — CLAUDE.md, AGENTS.md or linked living documents drifting from the code, exceeding their budget, duplicating doctrine or colliding (e.g. "räum die CLAUDE.md auf", "kontext audit", "die doku stimmt nicht mehr mit dem code überein").
---

# Kontext-Audit — Kontext aktuell + schlank halten

Prüft die Steuerungs-Artefakte eines Projekts gegen die Doktrin und räumt
auf.

**Befund vor Eingriff:** erst erheben und klassifizieren, dann vorlegen —
geändert wird auf Zusage.

**Doktrin ZUERST lesen** (erster Fund gewinnt):
`references/kontext-architektur.md` (neben dieser Datei — bei
Einzel-Skill-Installation, z.B. Codex) oder
`../../docs/kontext-architektur.md` (Plugin-/Repo-Layout) —
Schichten-Modell, Budgets, Adapter-Regel.

Fehlen beide, ist die Doktrin nicht mitinstalliert worden — sie liegt im
Plugin `context-kit` unter `docs/kontext-architektur.md`. Dann das Audit
anhalten und den Pfad klären: ein Audit gegen eine nacherzählte Doktrin
misst gegen die falsche Wahrheit und meldet Befunde, die keine sind.

## Ablauf

Falls die Runtime `/doctor` anbietet: vor Schritt 1 laufen lassen.

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
| Skill-`description` (lädt in jeder Session) | ≤ ~500 Zeichen, ein Absatz | auf die Trigger-Anlässe kürzen, Bedienung in den Body |
| `SKILL.md`-Body (lädt beim Trigger, flutet dann den Kontext) | Orchestrator-Kern ~150–200 Zeilen | über Budget **mit** `references/`-Datei-Baum ist gesund, **ohne** ist der Befund: Detail-Maschinerie auslagern (Progressive Disclosure) |

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

### 4. Konsistenz-Check (eine Wahrheit, keine Kollisionen)

Ein Durchgang über dieselbe Menge — CLAUDE.md ↔ AGENTS.md ↔ Handbücher ↔
Skills ↔ Agent-Definitionen — mit zwei Fragen je Regel/Fakt:

- **Steht sie mehrfach?** Die EINE Quelle nach Schichten-Modell bestimmen,
  alle anderen Stellen durch Verweis ersetzen.
- **Widerspricht sie sich?** Gedriftete Kopien und **kollidierende**
  Instruktionen (Post-Muster: „leave documentation as appropriate" gegen
  „DO NOT add comments" im selben Request) kosten bei jedem Request
  Auflösungsarbeit. Bei gedrifteten **Fakten** zuerst per Fundstelle klären,
  welche Version stimmt; Präzedenz entscheidet nur bei Regeln.

Einstiegsheuristik für Kandidaten: Scan nach NIE/NIEMALS/NICHT/NEVER/
ALWAYS und ALL-CAPS-Imperativen. Sie liefert Fundstellen, entschieden wird
über die Klassifikation — nicht über den Grep:

| Klasse | Test | Folge |
|---|---|---|
| realer Failure-Mode | Secrets, Daten-Grenze, Gate-Bypass, erfundene Fakten | bleibt wörtlich |
| kodierte Domänen-Meinung | Fach-Praxis, die der Skill bewusst vertritt | bleibt |
| Geschmack = **Über-Constraint** | kein nachweisbarer Schaden bei Verstoss | wird Urteils-Anker oder entfällt |
| Kollision | zwei Stellen fordern Unvereinbares | eine Seite gewinnt, die andere wird angeglichen oder durch Verweis ersetzt |

### 5. Kontext-Bomben

Dokumente, die als Pflicht-Referenz verlinkt sind und > ~300 Zeilen haben:
Split- oder Archiv-Vorschlag (heisser Teil bleibt, Historie →
`*-archiv.md`). Prüfe auch Format-Zwänge, die Blähung erzeugen („Format
wie die bestehenden Einträge" bei bereits aufgeblähten Einträgen) — die
Format-Vorgabe selbst korrigieren, sonst wächst es nach.

### 6. Report + Umsetzung

Report als kompakte Findings-Liste, sortiert nach Schwere
(`CRITICAL` Kollisionen, gedriftete Duplikate, falsche Fakten → `HOCH`
Budget, Bomben, Über-Constraints → `MITTEL` Redundanz/Politur), je 1–2
Zeilen mit Fundstelle und konkretem Fix. Dann EINE gebündelte Rückfrage
(`AskUserQuestion`): alles umsetzen / nur CRITICAL+HOCH / nur Report.

Umsetzung: thematisch gebündelte Commits (Diät, Archiv-Umzug,
Duplikat-Auflösung getrennt), Archiv-Umzüge verlustfrei (verschieben,
nicht löschen). Abschluss: neue Zeilen-Stände gegen die Budgets.

## Leitplanken

- Inhalte werden verschoben oder verwiesen, NIE ersatzlos gelöscht — ausser
  sie sind nachweislich falsch ODER als Geschmack klassifiziert (Schritt 4),
  immer mit Befund und erst nach Bestätigung in Schritt 6.
- Fachliche Schwellen und Inhalte bleiben unberührt; Gegenstand sind
  Duplikation, Platzierung und die Form der Constraints. Fachliche
  Regel-Änderungen → User.
- `.env`/Secrets nie lesen; Audit-Report enthält keine Secret-Werte.
