---
name: prior-art-check
description: Use BEFORE building non-trivial functionality, to check whether the problem is already solved — in the codebase, in a library, or as a known problem class (e.g. "gibt es das schon?", "müssen wir das selbst bauen?", "prior art"). Returns a build/buy/adapt recommendation.
---

# Prior-Art-Check — Ist das Problem schon gelöst?

Läuft VOR dem Bauen, idealerweise als Zulieferer für Stufe 1 der
`/spec-to-implementation`-Pipeline. Ziel: Eigenbau nur, wo Eigenbau die
beste Antwort ist — belegt, nicht gefühlt.

## Ablauf

### 1. Problem abstrahieren

Formuliere den **generischen Kern** hinter dem Feature-Wunsch, ohne
Projekt-Vokabular: „Dienstplan erstellen" → „faire Zuordnung von Aufgaben
auf Zeitfenster unter Nebenbedingungen". Erst der abstrahierte Kern macht die
Suche nach existierenden Lösungen möglich. Notiere die harten Constraints
und die Qualitätskriterien (was heisst „gut gelöst"?).

### 2. Vier Ebenen prüfen (in dieser Reihenfolge — billig vor teuer)

**a) Eigener Code.** Grep/Glob nach Helpern, ähnlichen Modulen,
halbfertigen Ansätzen im Projekt (und in bekannten Schwester-Projekten).
Treffer = stärkster Kandidat: erweitern schlägt neu bauen.

**b) Ökosystem.** WebSearch nach Bibliotheken/OSS-Projekten für den
abstrahierten Kern (Paket-Registry des Stacks, GitHub). Pro Kandidat den
**Qualitäts-Check** dokumentieren:
- Wartungsstand (letztes Release, offene Issues, Bus-Faktor)
- Lizenz (kompatibel mit dem Projekt?)
- Grösse + Abhängigkeits-Rattenschwanz
- Sicherheitslage (bekannte CVEs)
- Passgenauigkeit: löst es 90 % oder 40 % des Problems?

**c) Bekannte Problemklasse.** Ist der Kern ein verkapptes
Standard-Problem der Informatik (Scheduling, Matching, Bin-Packing,
kürzeste Wege, Caching/Invalidierung, Konsens, Volltextsuche …)? Dann
existieren erprobte Algorithmen mit bekannten Eigenschaften — die
Suche nach dem Fachbegriff liefert Jahrzehnte an Vorarbeit.

**d) Natur- und Domänen-Analogien.** Für Optimierungs-/Suchprobleme ohne
exakte effiziente Lösung (typisch: NP-schwer, viele weiche Constraints):
naturinspirierte Heuristiken prüfen — Simulated Annealing, evolutionäre/
genetische Verfahren, Ameisen-/Schwarm-Algorithmen, Hill-Climbing mit
Restarts. **Nüchtern bewerten:** oft schlägt ein simpler Greedy mit gutem
Scoring die exotische Heuristik — die Analogie ist ein Kandidat, kein
Selbstzweck. Auch Analogien aus anderen Branchen zählen (wie lösen
Logistik/Sport-Ligen/Börsen dasselbe Muster?).

### 3. Bewertung: Build / Buy / Adapt

Empfehlung mit Begründung entlang dieser Kriterien:
- Ist das Problem **Kernkompetenz** des Projekts (Differenzierung) oder
  Commodity? Commodity → kaufen/übernehmen.
- Wartungslast über die Lebensdauer (eigene Wartung vs. Upstream folgen).
- Anpassbarkeit: wie weit liegt der 90-%-Kandidat von den harten
  Constraints entfernt?
- Risiko: Abhängigkeit von totem Projekt vs. Eigenbau-Bugs.

### 4. Output

Kurzes Dokument (≤ 1 Seite) — bei laufender Pipeline als
„Prior Art"-Abschnitt in die Spec, sonst nach
`<specsDir>/YYYY-MM-DD-<slug>-prior-art.md`:

```markdown
## Prior Art
- Kernproblem (abstrahiert): …
- Gefunden: [Ebene a–d, je 1 Zeile mit Link/Fundstelle]
- Empfehlung: BUILD | BUY (<lib>) | ADAPT (<basis>) — Begründung 2–3 Sätze
- Verworfen: <kandidat> — <grund> (je 1 Zeile)
```

## Leitplanken

- Keine Behauptung ohne Quelle: jeder Ökosystem-Kandidat mit Link, jeder
  Eigencode-Treffer mit Datei-Pfad.
- Keine Dependency-Empfehlung ohne Lizenz- und Wartungs-Check.
- Zeitbudget: das ist ein Check, keine Studie — pro Ebene wenige gezielte
  Suchen; wenn nach ~15 Minuten nichts Brauchbares auftaucht, ist BUILD
  mit dokumentierter Suche das legitime Ergebnis.
- Der Check entscheidet nicht — er empfiehlt. Der Entscheid fällt in
  Gate 1 der Pipeline (oder per `/adr`, wenn er grundsätzlich ist).
