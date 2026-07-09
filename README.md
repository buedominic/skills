# skills

Generische, wiederverwendbare Claude-Code-**Skills**, **Agents**, **Hooks**
und **Workflows** – zentral gepflegt, damit sie in jedem Projekt nutzbar
sind und einfach mit anderen geteilt werden können.

Das Repo ist als **Claude-Code-Plugin-Marketplace** aufgebaut. Das ist der
offiziell unterstützte Weg, Skills zu verteilen: einmal hinzufügen, danach
bekommt jeder Updates einfach per Plugin-Update.

## Installation (Claude Code)

In Claude Code (CLI oder Web) genügen zwei Befehle:

```
/plugin marketplace add buedominic/skills
/plugin install context-kit@buedominic-skills
/plugin install feature-workflow@buedominic-skills
/plugin install dev-toolkit@buedominic-skills
```

Danach stehen die Skills, Agents und Hooks der Plugins in jedem Projekt zur
Verfügung. Skills ruft man über ihren Namen auf (z.B. `/projekt-setup`)
oder eindeutig mit Plugin-Präfix (`/context-kit:projekt-setup`) — Claude
lädt sie auch selbstständig, wenn die Aufgabe passt. Updates holt man sich
mit:

```
/plugin marketplace update buedominic-skills
```

Alternativ (ohne Plugin-System) kann man Skill-Ordner auch direkt nach
`~/.claude/skills/` (global) oder `<projekt>/.claude/skills/` (pro Projekt)
kopieren.

### Installation für Codex, Cursor, GitHub Copilot & Co. (ohne Claude)

Der Universal-Installer generiert die Client-Formate aus den
SKILL.md-Quellen. Repo klonen, dann:

```bash
./install.sh codex             # → ~/.codex/skills + ~/.codex/agents (nativ)
./install.sh cursor <projekt>  # → .agents/** + .cursor/rules/*.mdc (Agent-Requested)
./install.sh copilot <projekt> # → .agents/** + .github/prompts/*.prompt.md + AGENTS.md
./install.sh agents <projekt>  # → .agents/** + AGENTS.md (jeder AGENTS.md-Client)
```

Windows: `.\install.ps1 <client>`. Alternativ `npx skills add
buedominic/skills`. Update = Repo pullen, Script erneut ausführen.
Details, Portabilitäts-Matrix und die Übersetzungstabelle für
Claude-Tool-Namen: [`docs/portabilitaet.md`](docs/portabilitaet.md).

## Schnellstart: ein Projekt damit fahren

1. **Einmalig einrichten:** `/projekt-setup` im Projekt ausführen — erstellt
   eine schlanke `CLAUDE.md` und verdrahtet auf Wunsch den Feature-Workflow
   (Config, Branch-Schutz, Permissions).
2. **Features bauen:** `/spec-to-implementation <feature>` — die Pipeline
   führt von der Idee bis zum Merge, mit genau zwei Rückfragen
   (Klärungsfragen + Plan-Freigabe). Kleine Fixes laufen automatisch als
   Light-Mode-Vorschlag.
3. **Kontext pflegen:** bei Bedarf **manuell** `/kontext-audit` ausführen —
   z.B. wenn sich die Doku falsch anfühlt oder `CLAUDE.md`/Status-Dokumente
   wachsen. Läuft bewusst nie automatisch.
4. **Alltag drumherum:** `/prior-art-check` bevor etwas Nicht-Triviales
   gebaut wird, `/bug-triage` für Fehlermeldungen (mündet in den
   Light-Mode), `/adr` für Grundsatz-Entscheide, `/dependency-audit` für
   die Paket-Pflege — alle manuell angestossen.

**Optionale Ergänzungen** (alles funktioniert auch ohne):
[superpowers](https://github.com/obra/superpowers)-Plugin (Brainstorming-/
Planungs-Skills), Codex-MCP (Zweitmodell für Spec-/Plan-Reviews),
Browser-MCP oder Playwright (automatisiertes Smoke-Gate). Für Web-Arbeit
zusätzlich empfohlen: das offizielle
[frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)-Plugin
(visuelle Gestaltung — `/landing-page` nutzt es als Sub-Skill) und der
[webapp-testing](https://github.com/anthropics/skills/tree/main/skills/webapp-testing)-Skill
(Playwright-Unterbau für Smoke-Gate und `/web-audit`). Details in den
Plugin-READMEs.

## Verfügbare Plugins

| Plugin | Inhalt |
|---|---|
| [`context-kit`](plugins/context-kit/) | Kontext-Lebenszyklus: `/projekt-setup` (erstmalige, schlanke CLAUDE.md ≤ ~120 Zeilen mit Prüfankern + optionale Workflow-Verdrahtung) und `/kontext-audit` (hält den Kontext aktuell und schlank: Budget-, Drift-, Duplikat- und Kontext-Bomben-Check). Gemeinsame Doktrin: Schichten-Modell + „eine Wahrheit, dünne Adapter". |
| [`dev-toolkit`](plugins/dev-toolkit/) | Alltags-Skills: `/prior-art-check` (ist das Problem schon gelöst? Eigencode → Bibliotheken → CS-Problemklassen → Natur-Heuristiken, mit Build/Buy/Adapt-Empfehlung), `/dependency-audit` (risikogestufter Update-Plan, Report zuerst), `/adr` (Architecture Decision Records unter `docs/decisions/`), `/bug-triage` (Meldung → Repro → Root-Cause-Hypothesen → Light-Mode-Input), `/web-audit` (Accessibility/Performance/SEO mit Fundstellen-Report) und `/landing-page` (Conversion-Struktur, Copy-Prinzipien, Launch-Checkliste). |
| [`feature-workflow`](plugins/feature-workflow/) | Spec-to-Implementation-Pipeline: `/spec-to-implementation`-Skill (Brainstorm → Spec → Review → Plan → Review → Implementation mit zwei Gates, Workflow-State-Manifest, Light-Mode für kleine Fixes, Smoke-Gate mit chrome-mcp/playwright/manual-Varianten), `spec-reviewer`- und `implementer`-Agents, Branch-Schutz-Hook (Opt-in pro Projekt) sowie Konfigurations-Vorlagen. Projektunabhängig konfigurierbar. |

## Struktur

```
.claude-plugin/
  marketplace.json          ← Marketplace-Manifest (Liste der Plugins)
plugins/
  feature-workflow/         ← ein Plugin = ein installierbares Bündel
    .claude-plugin/
      plugin.json           ← Plugin-Manifest (Name, Version, Beschreibung)
    skills/<name>/SKILL.md  ← ein Skill pro Ordner
    agents/<name>.md        ← Subagenten
    hooks/hooks.json        ← Hook-Verdrahtung + Scripts
    templates/              ← Konfigurations-Vorlagen für Ziel-Projekte
templates/                  ← Vorlagen zum Erstellen neuer Skills/Commands
```

Thematisch getrennte Bündel legt man als weitere Ordner unter `plugins/`
an und trägt sie in der `marketplace.json` ein.

## Neuen Skill hinzufügen

1. Ordner `plugins/<plugin>/skills/<skill-name>/` anlegen.
2. `SKILL.md` mit Frontmatter (`name`, `description`) erstellen – die
   Vorlage in `templates/skill-vorlage/` zeigt den Aufbau und gibt Tipps,
   wie man projektspezifische Skills generalisiert.
3. Version in `plugin.json` erhöhen, committen, pushen.

## Skills aus einem bestehenden Projekt übernehmen

Skills/Agents/Hooks eines Projekts liegen dort unter `.claude/`:

1. Nach `plugins/<plugin>/skills|agents|hooks/` kopieren.
2. Projektspezifisches generalisieren: hartkodierte Pfade, Befehle und
   Namen entweder durch Konventionen ersetzen („lies die Verifikations-
   Befehle aus der Projekt-CLAUDE.md") oder in eine Projekt-Config
   auslagern, für die das Plugin eine Vorlage mitliefert (siehe
   `plugins/feature-workflow/templates/`).
3. Was wirklich nur im Projekt Sinn ergibt, bleibt im Projekt; hier landet
   nur der wiederverwendbare Teil.
