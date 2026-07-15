# Codex-Runtime-Vertrag

Diese Referenz beim ersten Subagenten-Dispatch einer Codex-Session lesen. Sie
übersetzt die Claude-Agent-Annahmen in die tatsächlich verfügbare Codex-
Runtime.

## Capability-Preflight

Vor dem ersten Dispatch die vorhandenen Agent-Tools prüfen. Keine Tool-Namen
erfinden und keine Agent-Datei als Beleg nehmen, dass die Runtime sie auswählen
kann.

- Kann die Runtime einen benannten Custom Agent wählen, die Rollen
  `doc-writer`, `spec-reviewer` und `implementer` verwenden.
- Kann sie nur generische Subagenten starten, den Rollen-Prompt aus
  `references/roles/<rolle>.md` (installierter Skill) beziehungsweise
  `../../agents/<rolle>.md` (Plugin-Quellbaum) zusammen mit dem Task-Input
  übergeben. Den Agenten ohne Autorenhistorie starten, sofern die Runtime dies
  unterstützt.
- Fehlen Subagenten-Tools vollständig, führt der Orchestrator die Rolle selbst
  aus. Das ist ein sichtbarer Fallback, kein still übersprungener Schritt.
- Modell-/Effort-Werte aus der Projekt-Config nur übergeben, wenn das konkrete
  Dispatch-Tool diese Felder unterstützt. Andernfalls erbt der Agent die
  Runtime-Konfiguration; niemals nicht vorhandene Parameter simulieren.

## Thread-Lifecycle und Slot-Budget

Codex begrenzt gleichzeitig offene Agent-Threads. Für diesen Workflow gelten
deshalb folgende Regeln:

1. Höchstens drei Rollen-Threads dieses Workflows offen halten: je einen für
   `doc-writer`, `spec-reviewer` und `implementer`. Schreibende Rollen nie
   parallel auf demselben Worktree ausführen.
2. Unterstützt die Runtime das Schliessen abgeschlossener Threads, jeden
   One-shot-Agenten unmittelbar nach ausgewertetem Ergebnis schliessen.
3. Fehlt eine Close-Funktion, pro Rolle genau einen Thread anlegen und ihn für
   spätere Tasks per Follow-up wiederverwenden. Vor jedem Follow-up ausdrücklich
   anweisen, nur den neuen Task-Brief und die genannten Dateien als
   Anforderungen zu verwenden.
4. Vor jedem Spawn den vorhandenen Rollen-Pool prüfen. Nie blind einen neuen
   Agenten erzeugen, wenn ein passender Thread existiert.
5. Bei Slot-Limit: beendete Threads schliessen, falls möglich; sonst den
   bestehenden Rollen-Thread wiederverwenden. Nicht in einer Spawn-Schleife
   retryen.

Ein wiederverwendeter Thread ist nicht kontextfrisch. Deshalb bleiben Task-
Brief, Report und Review-Paket die einzigen fachlichen Handoffs; frühere
Thread-Antworten sind keine Anforderungen.

## Dispatch- und Artefaktvertrag

Jeder Dispatch erhält:

- Rolle und Zweck;
- Repo-Root und aktuellen Branch;
- ausschließlich die benötigten Input-Pfade;
- erwartete Schreibpfade beziehungsweise erlaubten Schreibbereich;
- einen maschinenprüfbaren Output-Vertrag.

Nach jedem Dispatch nicht der Erfolgsmeldung vertrauen, sondern das Ergebnis
prüfen:

| Rolle | Erfolgskriterium |
|---|---|
| `doc-writer` | Zielpfad existiert, ist nicht leer und enthält die geforderten Überschriften |
| `spec-reviewer` | exakt `NO_FINDINGS` oder parsebare Findings mit Severity, Stelle, Problem, Empfehlung |
| `implementer` | Report-Datei vorhanden, erwarteter Diff/Commit vorhanden und genannte Tests nachvollziehbar |

Leere Rückgabe ohne nachweisbares Artefakt ist `EMPTY_RESULT`, nicht Erfolg.
Einmal auf demselben Rollen-Thread mit engerem Prompt und explizitem fehlendem
Erfolgskriterium nachfassen. Scheitert auch das:

1. `agentFallbacks[]` im Manifest mit Rolle, Task, Grund und Zeitpunkt
   ergänzen;
2. die Rolle im Orchestrator ausführen, sofern sicher möglich;
3. bei fehlender Berechtigung oder fachlicher Blockade anhalten und den User
   mit der konkreten Diagnose informieren.

Keine unbeschränkten Re-Spawn- oder Re-Dispatch-Schleifen.
