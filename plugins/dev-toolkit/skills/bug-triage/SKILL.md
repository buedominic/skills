---
name: bug-triage
description: Use when a vague bug report needs to become an actionable fix input (e.g. "bei manchen teams stimmt die tabelle nicht", "irgendwas ist kaputt an X", "user meldet fehler Y"). Produces repro, evidence and ranked root-cause hypotheses.
---

# Bug-Triage — von der Meldung zum fix-fertigen Dokument

Schliesst die Lücke zwischen „jemand meldet etwas" und „die Pipeline kann
loslegen". Endet mit einem Dokument + Empfehlung — **der Fix selbst ist
nicht Teil der Triage** (der läuft danach, typischerweise als Light-Mode
über `/spec-to-implementation`).

## Ablauf

### 1. Meldung aufnehmen

Fakten von Interpretation trennen: Was wurde beobachtet (wörtlich)? Was
wurde erwartet? Seit wann? Immer oder manchmal? Fehlende essentielle
Infos gebündelt nachfragen — **max. 1 Runde `AskUserQuestion`**, danach
mit dokumentierten Annahmen weiter.

### 2. Reproduzieren (vor jeder Hypothese)

- Konkrete Repro-Schritte formulieren und ausführen: gezielter Test,
  Script, API-Call oder App-Lauf — je nachdem, was das Projekt hergibt.
- Repro gelungen → Schritte + beobachtetes vs. erwartetes Verhalten
  festhalten (minimale Repro: so wenig Schritte/Daten wie möglich).
- Repro NICHT gelungen → ehrlich dokumentieren, was probiert wurde;
  Hypothesen sind dann als „unbestätigt" zu kennzeichnen. Kein
  „wird schon stimmen".

### 3. Evidenz sammeln (gezielt, nicht breit)

Falls das superpowers-Plugin installiert ist, kann
`superpowers:systematic-debugging` diesen und den nächsten Schritt als
Sub-Skill strukturieren — die Leitplanken unten gelten trotzdem.

- Verdächtige Code-Pfade lokalisieren (vom Symptom rückwärts).
- `git log`/`git blame` der verdächtigen Pfade: Was hat sich zuletzt
  geändert? Korreliert ein Commit zeitlich mit „seit wann"?
- Logs/Fehlermeldungen zum Zeitfenster, falls vorhanden.
- Randbedingungen prüfen, die „manchmal" erklären (Datenabhängigkeit,
  Zeitzonen/Datum, Race-Conditions, Cache, Env-Unterschiede).

### 4. Root-Cause-Hypothesen (max. 3, gerankt)

Pro Hypothese: `{ vermutung (1 Satz), fundstelle (datei:zeile),
wahrscheinlichkeit (hoch/mittel/tief), prüfschritt (wie belegt/widerlegt
man sie billig?) }`. Ist der Prüfschritt der Top-Hypothese billig
(read-only oder ein gezielter Test), gleich ausführen und das Ergebnis
eintragen.

### 5. Output: Light-Mode-fertiges Mini-Dokument

Nach `<specsDir>/YYYY-MM-DD-<slug>-fix.md` (Format = L1-Dokument des
Light-Mode):

```markdown
# <Titel> — Fix-Triage

## Problem
<Beobachtet vs. erwartet, seit wann, Häufigkeit. Repro-Schritte.>

## Root-Cause
<Bestätigte Ursache mit Fundstelle — oder Top-Hypothesen mit Rang + Prüfschritt.>

## Fix-Ansatz
<1–3 Sätze; Alternativen nur, wenn der Entscheid dem User gehört.>

## Akzeptanz
- [ ] <3–5 testbare Bullets, inkl. Regression: der Repro-Fall schlägt nicht mehr fehl>
```

Abschluss-Empfehlung an den User: Light-Mode fahren (Heuristik erfüllt?)
oder FULL (Schema-/Security-/Scope-Berührung) — mit einem Satz Begründung.

## Leitplanken

- **Kein Fix während der Triage** — auch kein „kleiner Quick-Fix nebenbei".
  Einzige Ausnahme: der billige Prüfschritt aus Schritt 4 (read-only bzw.
  ein neuer, noch roter Test — der bleibt als Repro-Test liegen).
- Repro schlägt Theorie: eine unbestätigte Hypothese wird nie als Ursache
  verkauft.
- Keine PII/Secrets aus Logs ins Dokument — redigieren.
- Symptom ≠ Ursache: „wo es knallt" ist der Startpunkt der Suche, nicht
  ihr Ergebnis.
