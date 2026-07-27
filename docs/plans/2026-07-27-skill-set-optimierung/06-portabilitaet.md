# 06 — Portabilität: die Achse für die anderen Clients

`disable-model-invocation` ist ein Claude-Feld. Für Cursor, Codex und
Copilot erzeugt `install.sh` die Auto-Ladung **selbst** — ohne Anpassung
gilt die Achse nur in Claude, und das Repo verspricht Portabilität.

## Der Befund

`install.sh:190-199` schreibt für **jeden** Skill eine Cursor-Rule:

```
description: <aus SKILL.md>
alwaysApply: false
```

Das ist Cursors „Agent Requested"-Modus — er lädt genau per `description`
(`docs/portabilitaet.md:73`). Ein user-invoked Skill wäre dort also
weiterhin model-invoked.

Die drei Ziele verhalten sich unterschiedlich:

| Ziel | Heute | Nötig |
|---|---|---|
| **Cursor** (`:186-199`) | Agent-Requested per `description` | Manual-Rule: `description` weglassen, damit nur `@name` sie lädt |
| **Copilot** (`:206-219`) | `.github/prompts/*.prompt.md` | **nichts** — Prompt-Files sind per Konstruktion Slash-Commands, also schon user-invoked. Die `description` ist dort ein Label. |
| **Codex / AGENTS.md** | `~/.agents/skills/`, Laden per `description` (`portabilitaet.md:60`) | Feld wird vermutlich ignoriert → im AGENTS.md-Block getrennt ausweisen: „nur auf Zuruf" |

## Schritte

- [ ] **Helfer in `install.sh`:** `fm_value "$f" disable-model-invocation`
      existiert bereits als generischer Frontmatter-Leser (`:25` ff. nutzt
      ihn für `disallowedTools`) — wiederverwenden, keinen zweiten bauen.
- [ ] **Cursor-Zweig:** trägt ein Skill das Feld, wird die `.mdc` ohne
      `description` geschrieben. Die Datei entsteht weiterhin — der Skill
      bleibt per `@name` erreichbar, nur eben nicht mehr automatisch.
- [ ] **Copilot-Zweig:** unverändert. Im Skript als bewusste Entscheidung
      kommentieren, sonst „repariert" ihn der nächste Durchgang.
- [ ] **AGENTS.md-Block:** die Skill-Liste unterscheidet die beiden
      Gruppen, damit ein AGENTS.md-Client nicht alle neun als
      auto-ladbar anbietet.
- [ ] **`docs/portabilitaet.md`:** eine Zeile je Client, wie die Achse dort
      abgebildet ist — plus die ehrliche Aussage, dass sie in Codex
      **nicht verifiziert** ist. Die Portabilitäts-Matrix (`:19`) bekommt
      die Unterscheidung.
- [ ] **Verifikation:** `bash -n install.sh` (Syntax), dann ein Trockenlauf
      gegen ein Wegwerf-Verzeichnis im Scratchpad: `./install.sh cursor
      <tmp>` und prüfen, dass genau die fünf user-invoked Skills eine
      `.mdc` **ohne** `description` haben und die vier übrigen eine **mit**.

      Das Kriterium ist die **Abwesenheit der Zeile**, nicht ein leerer
      Wert: ein `description:` mit leerem String bleibt für Cursor ein
      gesetztes Feld und die Rule damit Agent-Requested. Geprüft wird
      entsprechend auf `^description:` — kein Treffer in den fünf Dateien,
      je ein Treffer in den vier übrigen.
- [ ] `./install.sh agents <tmp>` und den AGENTS.md-Block gegenlesen.

## Stopp-Bedingung

Der Trockenlauf schreibt in den Scratchpad, nie ins Repo und nie ins Home.
Läuft `install.sh` versehentlich gegen `.` oder `~`, überschreibt es
`.cursor/rules/` und `AGENTS.md` — Pfad vor jedem Lauf prüfen.
