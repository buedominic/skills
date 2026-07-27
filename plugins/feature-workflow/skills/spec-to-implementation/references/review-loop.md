# Review-Schleife (Stufen 2 + 4, sowie L2 im Light-Mode)

Iterative Review-Schleife für Spec bzw. Plan. Gilt für JEDEN Reviewer —
der Vertrag ist reviewer-unabhängig.

## Review-Vertrag

- Dispatch-Parameter `target`: `spec` (Stufe 2) | `plan` (Stufe 4) | `task`
  (Task-Review in Stufe 5/L3, Zyklus in `progress-ledger.md`) — kein anderer Wert
- Finding: `{ severity: CRITICAL|IMPORTANT|MINOR, stelle, problem, empfehlung }`
- Antwort ohne Findings: exakt `NO_FINDINGS`
- Dieser Vertrag **ist** das Interface des Reviewers: das `severity`-Enum trägt
  die Bedienung und die Triage-Priorität. Beim Umbau die Feldnamen und das Enum
  schärfen — nicht durch Prosa-Beispiele guter Findings ersetzen
- **Rubric als Reviewer-Input:** liegt für die Domäne eine `Rubric` vor — eine
  strukturierte Beschreibung dessen, was „gut" heisst (Kriterien, Skala,
  Ausschlüsse) — wird sie als zusätzlicher `contextPath` mitgegeben, und der
  Reviewer bewertet gegen sie statt gegen seinen Geschmack. Sie durchläuft
  denselben Allowlist-Check wie jeder andere `contextPath` (Schritt 2)
- Cap: `maxReviewRounds` Dispatches pro Stufe (Default 5); bei Cap ohne
  bestätigten Clean-Pass → User entscheidet (weitere Runde / bewusst
  akzeptieren), NICHT still weiter
- Identität wiederkehrender Findings heuristisch über `stelle` +
  Problem-Kern; begründet abgelehnte Findings zählen nicht als „neu"

## Reviewer-Weiche (pro Dispatch)

1. **Erkennung:** `models.reviewer` aus der `workflow.config.json` lesen
   (Default `auto`) und die tatsächlich angebotenen Tools prüfen. In einer
   Codex-Session ist ein Codex-Subagent der native Pfad; `mcp__codex__codex`
   ist dort keine Voraussetzung. In Claude kann das Codex-MCP als unabhängiges
   Zweitmodell dienen. Bei erzwungenem Backend und fehlender Fähigkeit hart
   blockieren statt still wechseln. Eine Ansage des Users schlägt die Config.
   `reviewerModel`/`reviewerEffort` nur mitgeben, wenn das Dispatch-Tool diese
   Parameter wirklich unterstützt.
2. Der Dispatch nutzt die Rolle `spec-reviewer`: benannter Custom Agent, wenn
   auswählbar; sonst generischer Subagent mit dem Rollen-Prompt; ohne
   Subagenten-Tool führt der Orchestrator den adversarialen Review in einem
   abgegrenzten Pass selbst aus. Er erhält NUR `targetFiles` + `contextPaths`
   (nie die Autoren-Konversation) und versucht die Spec/den Plan zu
   **widerlegen**. Für Codex gelten Slot-/Artefaktvertrag aus
   `codex-runtime.md`.
3. Optional (auf Ansage des Users) als Diversitäts-Ersatz: zwei Subagenten
   mit unterschiedlichen Linsen (Korrektheit vs. Vollständigkeit/
   Testbarkeit), Findings vereinigt.
4. **Protokoll:** `reviews.<stufe>.reviewer` im Manifest; im
   Review-Notizen-Abschnitt steht pro Runde, wer reviewt hat. Ein
   Reviewer-Wechsel zwischen Runden ist erlaubt und wird nur protokolliert.

## Schleifen-Mechanik

Halte `rejected = {}` und `round = 0`:

1. `round += 1`. Wenn `round > maxReviewRounds` → eskalieren (offene
   Findings + bisherige Triage), Schleife verlassen. Hat die letzte Runde
   noch editiert, gibt es keinen bestätigten Clean-Pass → mit genau diesem
   Status eskalieren.
2. **Pre-Dispatch-Allowlist-Check (Daten-Grenze):** `targetFiles` (Stufe 2:
   die Spec-Datei; Stufe 4: README + Phasen-Files — das Verzeichnis
   expandiert der Orchestrator, nicht der Agent) und `contextPaths`
   (anwendbare Projekt-`AGENTS.md`, Projekt-`CLAUDE.md`, Quell-Spec, ggf.
   verwandte Specs, ggf. die Rubric) jeweils mit
   `git ls-files --error-unmatch <pfad>` als git-tracked + nicht-secret
   verifizieren; bei Treffer auf Secret/Ignore → Abbruch.
3. `spec-reviewer` mit `target`, `targetFiles`, `contextPaths` dispatchen.
   Leere oder nicht parsebare Rückgabe ist `EMPTY_RESULT`; einmal auf
   demselben Rollen-Thread gezielt nachfassen, nicht neu spawnen.
4. `newActionable` = Findings MINUS `rejected`. Status `NO_FINDINGS` ODER
   `newActionable` leer → **Schleife verlassen** (Stufe fertig).
5. Sonst jedes Finding **triagieren** (der Orchestrator entscheidet, hält
   aber nur die kompakte Entscheid-Liste im Kontext): anwenden / bewusst
   akzeptieren oder ablehnen (zu `rejected` + 1-Zeilen-Grund) / bei echtem
   Konflikt mit der Projekt-`CLAUDE.md` o.ä. an den User eskalieren. Das
   **Einarbeiten** übernimmt der `doc-writer`-Agent
   (`zweck: triage-einarbeitung`, Findings mit Entscheid als Material) —
   er schreibt auch die Review-Notizen ins Dokument; der Orchestrator
   liest danach nicht das ganze Dokument zurück.
6. Manifest `reviews.<stufe>` aktualisieren (rounds, reviewer, rejected).
   Zurück zu 1.

## Commit-Regel: Squash pro Stufe

Die Runden werden während der Schleife NICHT einzeln auf den Default-Branch
committet. Beim Verlassen der Schleife landet die ganze Stufe als **ein**
Commit:

- Stufe 2: `docs(spec): <topic> — Review triagiert + eingearbeitet (<n> Runden, <reviewer>)`
- Stufe 4: `docs(plan): <feature> — Review triagiert + eingearbeitet (<n> Runden, <reviewer>)`

Die Runden-Details (Findings + Triage-Entscheide) stehen in den
Review-Notizen des Dokuments — nicht in der Commit-Historie.
