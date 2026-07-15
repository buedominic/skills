# Task-Fortschritt in Stage 5

Diese Referenz beim Eintritt in Stage 5 beziehungsweise L3 lesen.

## Zwei Zustände, zwei Zwecke

- `<planDir>/workflow-state.json`: commitfähiger Stage-/Gate-Status.
- `<repoRoot>/.superpowers/sdd/progress.md`: gitignorierter, taskgenauer
  Recovery-Ledger, kompatibel mit `superpowers:subagent-driven-development`.

Der Ledger ersetzt das Manifest nicht. Das Manifest sagt, in welcher Stage der
Workflow steht; der Ledger verhindert, dass nach Resume oder Compaction bereits
erledigte Plan-Tasks erneut dispatcht werden.

## Initialisierung

1. Vor Todo-/Plan-Anzeige und vor dem ersten Implementer-Dispatch den Ledger
   lesen, falls er existiert.
2. Mit `git check-ignore .superpowers/sdd/progress.md` prüfen, dass er ignoriert
   wird. Falls nicht, `/.superpowers/` einmal in die Repo-`.gitignore`
   aufnehmen. Den Ledger selbst nie stagen oder committen.
3. Falls er fehlt, Verzeichnisse und Datei anlegen:

   ```markdown
   # SDD Progress: <featureSlug>
   Plan: <planPath>
   Branch: <branch>
   Started: <ISO-8601>

   ## Tasks
   ```

4. Für jede Plan-Task einen sichtbaren Todo-Eintrag anlegen. Bereits als
   `complete` geführte Tasks direkt als erledigt markieren.
5. Pro offener Task unter `.superpowers/sdd/<featureSlug>/` drei Handoffs
   verwenden: `task-N-brief.md` (nur die vollständige Task plus bindende
   globale Constraints), `task-N-report.md` (Implementer-Status und Tests) und
   `task-N-review.patch` (Commit-Liste, Diff-Stat und Diff `baseCommit..HEAD`).
   Diese Dateien bleiben gitignoriert und werden nicht in Chat-Prompts kopiert.

## Abschluss einer Task

Eine Task erst nach grünem Implementer-Report und sauberem Task-Review
(`spec-reviewer`, `target=task`) als
fertig markieren. Dann exakt eine kompatible Zeile anhängen:

```text
Task N: complete (commits <base7>..<head7>, review clean)
```

Minor-Findings darunter als `Minor Task N: ...` notieren, damit der finale
Branch-Review sie erneut triagiert. Critical/Important-Findings vor dem
Task-Abschluss beheben und re-reviewen.

## Resume und Konsistenz

Beim Resume:

1. Manifest, Ledger und `git log` lesen.
2. Für jede Complete-Zeile prüfen, dass die genannten Commits erreichbar sind.
3. Abgeschlossene Tasks nie erneut dispatchen; bei der ersten nicht
   abgeschlossenen Task fortsetzen.
4. Behauptet der Ledger einen Abschluss, den Git nicht belegt, oder steht der
   Branch im Header im Widerspruch zum Manifest: als Divergenz blockieren und
   diagnostizieren.
5. Fehlt nur der gitignorierte Ledger, ihn aus Plan-Checkboxen und Git-Historie
   rekonstruieren; Unsicheres nicht als complete markieren.

Vor einer Kontextübergabe den Ledger aktualisieren und in der User-Zusammenfassung
Manifestpfad, Ledgerpfad und nächste Task nennen.
