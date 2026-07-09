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
- Das `description`-Feld im Frontmatter ist das Wichtigste: Claude entscheidet
  allein darauf basierend, ob der Skill geladen wird.

## Tipps zum Generalisieren projektspezifischer Skills

Wenn du einen Skill aus einem konkreten Projekt hierher übernimmst:

1. Entferne hartkodierte Pfade, Projektnamen und URLs – oder mache sie zu
   Platzhaltern, die der Skill zur Laufzeit aus dem Projekt ermittelt.
2. Beschreibe das *Vorgehen* statt der konkreten Dateien ("suche die
   Konfigurationsdatei via Glob" statt "öffne src/config/app.ts").
3. Verschiebe alles Projektspezifische zurück ins Projekt (dessen eigene
   `.claude/skills/` oder `CLAUDE.md`) und lasse hier nur den generischen Teil.
