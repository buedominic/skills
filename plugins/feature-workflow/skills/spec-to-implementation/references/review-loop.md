# Review-Schleife (Stufen 2 + 4, sowie L2 im Light-Mode)

Iterative Review-Schleife für Spec bzw. Plan. Gilt für JEDEN Reviewer —
der Vertrag ist reviewer-unabhängig.

## Review-Vertrag

- Finding: `{ severity: CRITICAL|IMPORTANT|MINOR, stelle, problem, empfehlung }`
- Antwort ohne Findings: exakt `NO_FINDINGS`
- Cap: `maxReviewRounds` Dispatches pro Stufe (Default 5); bei Cap ohne
  bestätigten Clean-Pass → User entscheidet (weitere Runde / bewusst
  akzeptieren), NICHT still weiter
- Identität wiederkehrender Findings heuristisch über `stelle` +
  Problem-Kern; begründet abgelehnte Findings zählen nicht als „neu"

## Reviewer-Weiche (pro Dispatch)

1. **Erkennung:** `models.reviewer` aus der `workflow.config.json` lesen
   (Default `auto`). Bei `auto`: Ist `mcp__codex__codex` als Tool
   verfügbar? → `reviewer = codex`, sonst `claude-subagent`
   (Tool-Verfügbarkeit prüfen, kein Shell-Health-Check nötig). Bei
   `codex`: erzwingen — nicht verfügbar → harter Block statt stillem
   Fallback. Bei `claude`: nie delegieren. Eine Ansage des Users im
   Gespräch schlägt die Config. Beim Dispatch `reviewerModel`/
   `reviewerEffort` aus dem `models`-Block mitgeben (Default: Session-
   Modell erben).
2. Beide Pfade laufen über den `spec-reviewer`-Agent des Plugins: er
   delegiert an Codex, wenn verfügbar (Modell-Diversität), sonst reviewt er
   selbst — frischer Kontext, erhält NUR `targetFiles` + `contextPaths`
   (nie die Autoren-Konversation), Rolle „kritischer Senior-Reviewer,
   versuche die Spec/den Plan zu **widerlegen**".
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
   (Projekt-`CLAUDE.md`, Quell-Spec, ggf. verwandte Specs) jeweils mit
   `git ls-files --error-unmatch <pfad>` als git-tracked + nicht-secret
   verifizieren; bei Treffer auf Secret/Ignore → Abbruch.
3. `spec-reviewer`-Agent mit `target`, `targetFiles`, `contextPaths`
   dispatchen.
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
