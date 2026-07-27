---
name: beispiel-skill
description: Vorlage für einen neuen Skill. Diese Beschreibung entscheidet, wann Claude den Skill automatisch lädt – beschreibe hier präzise, WOFÜR der Skill gedacht ist und bei welchen Stichwörtern er greifen soll.
---

# Beispiel-Skill

Dies ist eine Vorlage. Kopiere den Ordner, benenne ihn um und passe Frontmatter
und Inhalt an.

## Aufbau eines Skills

- Der Ordnername ist der Skill-Name (kebab-case).
- `SKILL.md` ist die einzige Pflichtdatei. Zusätzliche Dateien (Referenzen,
  Scripts, Templates) können im selben Ordner liegen und aus dem Skill heraus
  referenziert werden.

## Zuerst entscheiden: greift Claude selbst, oder tippst nur du?

Diese Wahl bestimmt, was die `description` überhaupt ist — und ob der Skill
Grundlast kostet.

**Model-invoked** (kein Extra-Feld) — die `description` liegt in **jeder**
Session im Kontext. Claude findet den Skill selbst, und andere Skills können
ihn erreichen. Der Preis ist permanent: jedes Zeichen wird immer geladen,
auch wenn der Skill monatelang nicht dran ist. Wähle das, wenn der Skill bei
einer Lage greifen soll, die du nicht als solche erkennst — eine rohe
Fehlermeldung, spürbare Doku-Drift.

**User-invoked** (`disable-model-invocation: true`) — die `description`
verlässt den Kontext. Kosten: null. Erreichbar nur, indem du den Namen
tippst; auch kein anderer Skill kann ihn auslösen. Die `description` wird
damit an *dich* gerichtet: eine Zeile, was der Skill tut, keine
Trigger-Liste. Wähle das für alles, was du ohnehin bewusst anstösst —
Setup-Läufe, Pipelines, Audits.

Die Wahl kostet an beiden Enden etwas: model-invoked kostet Kontext,
user-invoked kostet dein Gedächtnis. Häufen sich die user-invoked Skills,
fängt ein Wegweiser-Skill das auf (selbst user-invoked, also gratis).

## Die `description` ist das Interface

Für **model-invoked** Skills ist sie das einzige immer geladene Stück und
damit die **autoritative** Stelle für die Bedienung — keine Zusammenfassung
des Bodys. Was hier nicht steht, existiert für die Auswahl nicht. Sie trägt
die **Anlässe**, je einen pro unterscheidbarem Fall: Ablauf, Output-Format
und Abgrenzungen gehören in den Body, und Synonyme desselben Anlasses sind
bezahlte Wiederholung.

Die Bedienung tragen Verträge und feste Wertebereiche, nicht Beispiele: ein
Status-Feld mit dem Enum `pending`/`in_progress`/`completed` plus ein Satz zum
gewünschten Verhalten erklärt sich selbst. Lange Beispiele engen den
Explorationsraum ein — der Skill wird dann nachgeahmt statt verstanden.

## Progressive Disclosure statt langem SKILL.md

Wird ein Skill lang, ist die Antwort ein Datei-Baum, kein längeres `SKILL.md`:
der Kern orchestriert, die Detail-Maschinerie liegt daneben und wird erst beim
Eintritt in die jeweilige Stufe gelesen.

```
beispiel-skill/
  SKILL.md              # Ablauf, Entscheidungen, Verweise
  references/
    stufe-3-details.md  # wird in Stufe 3 gelesen, sonst nie
```

## Urteils-Anker statt Regel-Liste

Beschreibe den Zielzustand, aus dem abgeleitet werden kann, statt Einzelfälle
zu untersagen. Drei Klassen: ein realer, nachweisbarer **Failure-Mode**
(Secrets, Daten-Grenze, Gate-Bypass) bleibt · kodierte **Domänen-Praxis**
bleibt, sofern du die Folge ihrer Verletzung benennen kannst — auch negativ
formuliert (§ Kodiere deine Meinung) · blosser **Geschmack** bleibt draussen.

- Vorher: „Schreibe standardmässig keine Kommentare. Nie mehrzeilige
  Docstrings."
- Nachher: „Schreib Code, der sich wie der umgebende liest: gleiche
  Kommentardichte, Benennung, Idiom."

Dieser Abschnitt ist eine **bewusste Kopie**: Quelle ist die context-kit-Doktrin
`kontext-architektur.md` (§ Was gehört in CLAUDE.md), im Volltext dupliziert,
weil die Vorlage durch Kopieren des Ordners verwendet wird und ein Verweis
dabei bricht — kein Drift-Befund. Ändert sich die Doktrin, zieht diese Fassung
wortgleich nach.

## Kodiere deine Meinung

Der wertvollste Teil eines Skills ist das, was nicht allgemein bekannt ist:
Wissen und Praxis, die spezifisch für dich, dein Team oder euer Produkt sind.
Leitfrage: **Was weiss ich hier, das im Modell nicht ohnehin steckt?** Bleibt
die Antwort leer, braucht es den Skill nicht. Kodierte Domänen-Praxis ist
dieser Wert — auch als negativ formulierte Leitplanke: sie ist die zweite
Klasse aus § Urteils-Anker und bleibt, sobald du die Folge ihrer Verletzung
benennen kannst („ein Sammel-ADR lässt sich nicht pro Entscheid supersedieren").

## Projektspezifisches generalisieren

Übernimmst du einen Skill aus einem konkreten Projekt hierher: hartkodierte
Pfade, Projektnamen und URLs werden zu Platzhaltern, die der Skill zur Laufzeit
ermittelt; beschrieben wird das *Vorgehen* statt der konkreten Datei („suche
die Konfigurationsdatei via Glob" statt „öffne src/config/app.ts"); und alles
Projektspezifische bleibt im Projekt (dessen `.claude/skills/` oder
`CLAUDE.md`). Die Meinung darf mit — sie ist der Grund für den Skill.
