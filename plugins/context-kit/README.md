# context-kit

Kontext-Lebenszyklus für Claude-Code-Projekte: **erstmalig aufnehmen →
schlank halten → aktuell halten.** Ergänzt das `feature-workflow`-Plugin
(das deckt den Feature-Lebenszyklus ab, dieses Plugin den
Kontext-Lebenszyklus).

Die Regeln sind aus einem realen Workflow-Review destilliert. Die
typischen Symptome, gegen die sie wirken: divergierende Doppel-Doktrinen,
veraltete Fakten in der CLAUDE.md und Status-Dokumente, die auf tausende
Zeilen anwachsen und als Kontext-Bomben jede Session belasten.

## Inhalt

| Baustein | Datei | Zweck |
|---|---|---|
| Skill `/projekt-setup` | `skills/projekt-setup/SKILL.md` | Erstmalige Einrichtung: Repo-Analyse + kurzes Interview → schlanke CLAUDE.md (≤ ~120 Zeilen) mit Prüfankern, optionale feature-workflow-Verdrahtung (workflow.config, branch-guard, settings), lebende Dokumente mit Budget-Format. Unterschied zum eingebauten `/init`: meinungsstark bei Budget, Schichten-Struktur und Pflege-Verankerung |
| Skill `/kontext-audit` | `skills/kontext-audit/SKILL.md` | Pflege: Budget-Check, Drift-Check (Fakten gegen Code, mit Fundstelle), Duplikat-Auflösung, Kontext-Bomben-Archivierung — Report zuerst, Edits nach Bestätigung |
| Doktrin | `docs/kontext-architektur.md` | Die gemeinsame Wahrheit beider Skills: Schichten-Modell (immer geladen → bei Bedarf → Progressive Disclosure → Archiv), Budgets, „eine Wahrheit, dünne Adapter" |

## Wie der Kontext orchestriert wird (Kurzfassung)

1. **Kosten ∝ Ladehäufigkeit:** `CLAUDE.md` wird in jeder Session geladen →
   hartes Budget (≤ ~120 Zeilen). Detail wandert in verlinkte Doku,
   Skill-References oder Archive.
2. **Eine Wahrheit, dünne Adapter:** jeder Fakt existiert genau einmal;
   `CLAUDE.md`/`AGENTS.md` verweisen, statt zu duplizieren.
3. **Prüfanker statt Vertrauen:** stale-anfällige Fakten stehen mit
   Code-Fundstelle da, damit `/kontext-audit` sie maschinell verifizieren
   kann.
4. **Budgets + Archiv für lebende Dokumente:** Status im 5-Zeilen-Format,
   Historie wandert in `*-archiv.md`.
5. **Pflege ist verdrahtet:** die Finish-Stufe des feature-workflow schreibt
   im Budget-Format; `/kontext-audit` läuft periodisch oder bei Verdacht.
