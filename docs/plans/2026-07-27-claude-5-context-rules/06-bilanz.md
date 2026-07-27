# Phase 06 — Bilanz, Verifikation, Abschluss

## Schritte

- [ ] **Portablen Check grün fahren.** `node tests/validate-context-doctrine.mjs`
      muss ohne Fehlschlag durchlaufen — insbesondere die Status-Format-
      Assertion, die in Phase 01 bewusst rot war.
- [ ] **PowerShell-Test.** `pwsh` fehlt in dieser Umgebung. Entweder
      nachinstallieren und laufen lassen, oder die Umgebungsgrenze
      dokumentieren und belegen, dass der portable Check beide Assertions
      des PowerShell-Tests abdeckt (Frontmatter + `codex-runtime`-Verweis).
      Kein stilles Überspringen.
- [ ] **Zeilen-Bilanz eintragen** (Tabelle unten ausfüllen). Jede
      Netto-Vergrösserung bekommt eine Begründung in einer Zeile.
- [ ] **Leitplanken-Ergebnis aus Phase 05** als Tabelle eintragen.
- [ ] **Akzeptanz-Checkliste der Spec** durchgehen und abhaken. Das Repo
      führt weder Backlog noch Status-Dokument — laut Abschluss-Pflichten
      des Skills ist damit die Spec-Checkliste der Abschluss.
- [ ] **Push** auf `claude/skills-claude-5-context-b4wfoo`. Kein Merge,
      kein Pull Request ohne ausdrückliche Bestätigung.

## Zeilen-Bilanz

| Datei | Vorher | Nachher | Δ | Begründung bei Wachstum |
|---|---:|---:|---:|---|
| `kontext-architektur.md` | 80 | | | |
| `kontext-audit/SKILL.md` | 93 | | | |
| `projekt-setup/SKILL.md` | 107 | | | |
| `spec-to-implementation/SKILL.md` | 256 | | | Ziel ≤ 200 — finanziert die übrigen Phasen |
| `review-loop.md` | 81 | | | |
| dev-toolkit (6 Skills) | 499 | | | |
| `skill-vorlage/SKILL.template.md` | 29 | | | |
| **Summe** | **1145** | | | |

Die Bilanz wird ausgewiesen, nicht erzwungen. Harte Grenze bleibt das
Budget der Doktrin (~150–200 Zeilen je `SKILL.md`); nur
`spec-to-implementation` verletzt es heute und muss darunter landen.

## Leitplanken-Ergebnis (Befund J)

| Skill | Regel | Klasse | Entscheid |
|---|---|---|---|
| | | | |

## Offene Risiken

- Die Skills dieses Repos sind Prompt-Kontext. Ein zu aggressiver Schnitt
  fällt erst im Einsatz auf, nicht im Test. Deshalb die Regression-Anker
  und der konservative Umgang mit Befund J.
- `/doctor` (Befund L) ist ein bewegliches Ziel — die Zeile bleibt
  verfügbarkeits-neutral, damit sie nicht driftet.
