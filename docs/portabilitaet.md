# Portabilität — die Skills mit Codex & anderen Agent-Werkzeugen nutzen

Das `SKILL.md`-Format (YAML-Frontmatter + Markdown) ist ein offener
Standard (Agent Skills). Der **Inhalt** der Skills ist bewusst
werkzeugarm gehalten: Prozeduren, Dateien, Git, ein JSON-Manifest und
menschliche Entscheidungen. Jedes Werkzeug, das Dateien lesen, schreiben
und Kommandos ausführen kann, kann die Skills fahren — nur die
**Verpackung und Verdrahtung** ist teils Claude-Code-spezifisch.

## Portabilitäts-Matrix

Alle Nicht-Claude-Wege laufen über den Universal-Installer
(`install.sh` / `install.ps1`), der die Client-Formate aus den
SKILL.md-/Agent-Markdown-Quellen **generiert** — eine Wahrheit, keine
Kopien im Repo.

| Baustein | Claude Code | Codex | Cursor | GitHub Copilot | andere |
|---|---|---|---|---|---|
| Skills | nativ (Plugin) | **nativ**: `~/.agents/skills/` (`install.sh codex`) | `.agents/skills/` + generierte `.cursor/rules/*.mdc` (Agent-Requested — lädt per description, wie Skills) | `.agents/skills/` + generierte `.github/prompts/*.prompt.md` (Slash-Command) + AGENTS.md-Block | `install.sh agents` → `.agents/skills/` + AGENTS.md-Block (jeder AGENTS.md-Client) |
| Invocation-Achse (`disable-model-invocation`) | **nativ** — Feld wirkt direkt | Feld **unbestätigt**; Auto-Laden per description ist der dokumentierte Weg, deshalb im AGENTS.md-Block getrennt ausgewiesen | emuliert: Rule ohne `description` ist „Manual" und greift nur auf `@name` | ohnehin gegeben — Prompt-Files sind Slash-Commands | emuliert via AGENTS.md-Block („nur auf Zuruf") |
| Referenz-Files | nativ | mitkopiert | mitkopiert | mitkopiert | mitkopiert |
| Agents (Rollen) | nativ als Subagenten | generierte `.codex/agents/*.toml`; Rollen-Prompts zusätzlich im installierten Skill unter `references/roles/` | `.agents/roles/*.md` — als Rollen-Prompt in frischem Kontext | `.agents/roles/*.md` — dito | dito |
| Hook `guard-branch` | nativ (PreToolUse) | prozedural via AGENTS.md-Block | prozedural | prozedural | prozedural |
| Marketplace/Manifeste | nativ | entfällt | entfällt | entfällt | entfällt |
| `workflow.config.json` / `workflow-state.json` | reines JSON — überall unverändert nutzbar | ✓ | ✓ | ✓ | ✓ |

## Übersetzungstabelle: Claude-Tool-Namen → generische Fähigkeit

Die Skill-Texte nennen teils Claude-Code-Tools. Für andere Werkzeuge
gilt die Fähigkeit dahinter:

| Im Skill-Text | Bedeutet generisch |
|---|---|
| `AskUserQuestion` | gebündelte Rückfrage an den Menschen; auf Antwort warten (zur Not: anhalten, Zustand im Manifest hinterlassen) |
| `TodoWrite` | sichtbare Fortschritts-Checkliste führen |
| Subagent dispatchen (`spec-reviewer`, `implementer`, `doc-writer`) | benannten Custom Agent verwenden oder generischen Agenten mit `references/roles/<name>.md`; Ergebnis durch Datei/Diff/parsebaren Status prüfen; Threads nach Gebrauch schliessen oder pro Rolle wiederverwenden |
| `mcp__codex__codex` verfügbar? | nur in Claude die Frage nach einem unabhängigen Codex-Zweitmodell; in Codex selbst den nativen adversarialen Subagenten nutzen |
| `/skill-name` aufrufen | die entsprechende `SKILL.md` lesen und befolgen |
| Chrome-MCP / Playwright (Smoke) | beliebige Browser-Automatisierung des Werkzeugs (Codex: In-App-Browser); sonst Variante `manual` |
| `WebSearch` | Web-Recherche-Fähigkeit des Werkzeugs; fehlt sie, entfällt die Ökosystem-Ebene (z.B. im `/prior-art-check`) und wird als Lücke dokumentiert |

## Vier Anforderungen an ein Fremd-Werkzeug

Ein Werkzeug (oder ein Mensch von Hand) kann die Workflows fahren, wenn es:

1. **Instruktionen aufnimmt** — liest `AGENTS.md` und findet dort den
   Verweis auf die Skill-Dateien;
2. **Dateien + Git beherrscht** — Markdown schreiben, committen,
   Branch-Disziplin einhalten (ohne Hook gilt die Regel prozedural);
3. **Kommandos ausführt** — die Verifikations-Suite des Projekts;
4. **Gates respektiert** — an den menschlichen Entscheidungspunkten
   (Klärungsfragen, Plan-Approval, Merge) fragt und wartet.

## Konkrete Einrichtung je Client

Repo klonen, dann den Universal-Installer aufrufen (Windows:
`.\install.ps1 <client>` mit denselben Optionen). Update = Repo pullen,
Script erneut ausführen.

**Codex** — unterstützt SKILL.md nativ; Skills werden wie bei Claude
automatisch anhand der `description` geladen (`/skills` zeigt sie an).
Ob Codex `disable-model-invocation` ehrt, ist **nicht verifiziert** — der
AGENTS.md-Block weist die user-invoked Skills darum getrennt als „nur auf
Zuruf" aus, statt sich auf das Feld zu verlassen:

```bash
./install.sh codex             # → ~/.agents/skills + ~/.codex/agents (alle Projekte)
./install.sh codex --project   # → .agents/skills + .codex/agents (nur dieses Projekt)
```

Installiert die Skills flach nach den aktuellen Codex-Suchpfaden (Plugin-Doku
und Rollen-Prompts wandern in die `references/`
der betroffenen Skills — jeder Skill selbsttragend) und generiert die
Agenten (`spec-reviewer`, `implementer`, `doc-writer`) als
`.codex/agents/*.toml`.

**Cursor** — Regeln im „Agent Requested"-Modus laden per `description`,
funktional dasselbe wie Skill-Auto-Loading. User-invoked Skills bekommen
deshalb **keine** `description` in ihre Rule: ohne das Feld ist sie
„Manual" und greift nur auf `@name`. Das Feld zu leeren genügt nicht —
gesetzt ist gesetzt.

```bash
./install.sh cursor <projekt-pfad>
```

Kopiert die Skills nach `<projekt>/.agents/skills/`, die Rollen-Prompts
nach `.agents/roles/` und generiert pro Skill eine dünne Zeiger-Regel
`.cursor/rules/<name>.mdc` (`alwaysApply: false`; `description` aus dem
Skill, sofern er model-invoked ist), die auf die SKILL.md verweist. Zusätzlich wird der
AGENTS.md-Block gepflegt (Cursor liest auch AGENTS.md).

**GitHub Copilot** — der Coding Agent liest `AGENTS.md` als primäre
Instruktionen; im VS-Code-Chat sind Prompt-Files als `/name` aufrufbar:

```bash
./install.sh copilot <projekt-pfad>
```

Wie Cursor (`.agents/**` + AGENTS.md-Block), zusätzlich pro Skill ein
generiertes Prompt-File `.github/prompts/<name>.prompt.md`.

**Alle übrigen AGENTS.md-Clients** (Windsurf, Gemini CLI, Aider & Co.):

```bash
./install.sh agents <projekt-pfad>
```

Nur der neutrale Unterbau: `.agents/skills/` + `.agents/roles/` +
`.agents/portabilitaet.md` + der verwaltete Skills-Index-Block in
`AGENTS.md` (idempotent — bei erneutem Lauf wird nur der Block zwischen
den Markern aktualisiert, der Rest der Datei bleibt unangetastet).

**Alternative:** Cross-Tool-Installer `npx skills add buedominic/skills`
(erkennt installierte Agenten und installiert dorthin; `--list` zeigt
die Skills) — oder einzelne Skill-Ordner von Hand kopieren.

## Bekannte Grenzen

- Der Branch-Schutz ist ausserhalb von Claude Code nicht technisch
  erzwungen — nur dokumentiert.
- Das Reviewer-Erzwingen (`models.reviewer = "codex"`) ergibt in Codex
  selbst keinen Sinn; dort ist der adversariale Zweit-Kontext die
  Diversitäts-Massnahme.
- Nicht jede Codex-Oberfläche bietet eine explizite Close-Operation für
  Agent-Threads. Der Feature-Workflow hält deshalb höchstens einen Thread pro
  Rolle offen und verwendet ihn wieder, wenn Schliessen nicht verfügbar ist.
- Skill-**Auto-Aktivierung** (Claude lädt Skills anhand der description)
  haben andere Werkzeuge nicht unbedingt — dort muss der Verweis in
  `AGENTS.md` bzw. der explizite Aufruf den Einstieg leisten.
