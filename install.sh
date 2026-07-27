#!/usr/bin/env bash
# Universal-Installer für buedominic/skills — installiert die Skills für
# verschiedene Agent-Clients. Eine Wahrheit: SKILL.md/agents-*.md bleiben die
# einzige Quelle; Client-Formate werden generiert.
#
# Nutzung:
#   ./install.sh claude [pfad]     → <projekt>/.claude/settings.json (Plugins pinnen; committen → Cloud-Sessions installieren automatisch)
#   ./install.sh claude-copy [pfad]→ <projekt>/.claude/skills + .claude/agents (Kopien im Repo, ohne Plugin-System)
#   ./install.sh codex             → ~/.agents/skills + ~/.codex/agents (alle Projekte)
#   ./install.sh codex --project   → .agents/skills + .codex/agents (aktuelles Projekt)
#   ./install.sh cursor [pfad]     → <projekt>/.agents/** + .cursor/rules/*.mdc
#   ./install.sh copilot [pfad]    → <projekt>/.agents/** + .github/prompts/*.prompt.md + AGENTS.md-Block
#   ./install.sh agents [pfad]     → <projekt>/.agents/** + AGENTS.md-Block (generisch, für alle AGENTS.md-Clients)
#
# [pfad] = Projekt-Root (Default: aktuelles Verzeichnis).
set -euo pipefail

CLIENT="${1:-}"
ARG2="${2:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() { grep '^#   ' "$0" | sed 's/^#   //'; exit 1; }
[ -n "$CLIENT" ] || usage

fm_desc() { # description aus SKILL.md/Agent-Frontmatter
  awk '/^---$/{c++;next} c==1 && /^description:/{sub(/^description:[ ]*/,"");print;exit}' "$1"
}

fm_value() { # $1 = Datei, $2 = Key
  awk -v key="$2" '/^---$/{c++;next} c==1 && index($0,key ":")==1{sub("^" key ":[ ]*","");print;exit}' "$1"
}

# `disable-model-invocation: true` ist Claude-nativ: der Skill verlässt den
# Kontext und ist nur noch durch Tippen erreichbar. Andere Clients kennen das
# Feld nicht — dort erzeugt dieses Script die Auto-Ladung selbst und muss sie
# entsprechend weglassen, sonst gilt die Achse nur in Claude.
is_user_invoked() { # $1 = SKILL.md
  [ "$(fm_value "$1" disable-model-invocation)" = "true" ]
}

copy_skills() { # $1 = Ziel-Verzeichnis für Skill-Ordner
  local target="$1"
  mkdir -p "$target"
  SKILLS=()
  for skill in "$ROOT"/plugins/*/skills/*/; do
    local name dest plugin_root plugin_docs plugin_agents
    name="$(basename "$skill")"
    dest="$target/$name"
    rm -rf "$dest"; mkdir -p "$dest"
    cp -R "$skill"/. "$dest/"
    # Plugin-weite Doku in die references/ des Skills → jeder Skill selbsttragend
    plugin_root="$(dirname "$(dirname "$skill")")"
    plugin_docs="$plugin_root/docs"
    if [ -d "$plugin_docs" ]; then
      mkdir -p "$dest/references"
      cp -R "$plugin_docs"/. "$dest/references/"
    fi
    # Rollen-Prompts als Fallback für Runtimes ohne benannte Custom Agents.
    plugin_agents="$plugin_root/agents"
    if [ -d "$plugin_agents" ]; then
      mkdir -p "$dest/references/roles"
      cp "$plugin_agents"/*.md "$dest/references/roles/" 2>/dev/null || true
    fi
    SKILLS+=("$name")
  done
}

copy_roles() { # $1 = Ziel-Verzeichnis für Rollen-Prompts (Subagenten als Markdown)
  local target="$1"
  mkdir -p "$target"
  ROLES=()
  for md in "$ROOT"/plugins/*/agents/*.md; do
    [ -e "$md" ] || continue
    cp "$md" "$target/"
    ROLES+=("$(basename "$md" .md)")
  done
}

agents_md_block() { # $1 = Projekt-Root: verwalteten Skills-Block in AGENTS.md schreiben
  local proj="$1" file="$1/AGENTS.md" tmp
  local start='<!-- buedominic-skills:start -->' end='<!-- buedominic-skills:end -->'
  tmp="$(mktemp)"
  if [ -f "$file" ]; then
    awk -v s="$start" -v e="$end" '$0==s{skip=1} !skip{print} $0==e{skip=0}' "$file" > "$tmp"
  fi
  {
    echo "$start"
    echo "## Agent-Skills (buedominic/skills — Block wird vom Installer verwaltet)"
    echo
    echo "Wiederverwendbare Workflows unter \`.agents/skills/\`. Passt eine Aufgabe"
    echo "zur Beschreibung unten, lies ZUERST die jeweilige SKILL.md (inklusive"
    echo "ihrer references/) und befolge sie. Subagenten-Rollen liegen als Prompts"
    echo "unter \`.agents/roles/\` — in einem frischen Kontext verwenden."
    echo "Claude-spezifische Tool-Namen übersetzt \`.agents/portabilitaet.md\`."
    echo "Regel ohne Hook-Unterstützung: Source-Edits nur auf feature/-Branches."
    echo
    echo "| Skill | Wann |"
    echo "|---|---|"
    for skill in "$ROOT"/plugins/*/skills/*/; do
      local name desc
      name="$(basename "$skill")"
      is_user_invoked "$skill/SKILL.md" && continue
      desc="$(fm_desc "$skill/SKILL.md" | sed 's/\. .*/./')"
      echo "| \`.agents/skills/$name/SKILL.md\` | $desc |"
    done
    echo
    # Zweite Gruppe: diese Skills sollen NICHT von selbst greifen. Stünden
    # sie in der Tabelle oben, böte ein AGENTS.md-Client sie bei jeder
    # entfernt passenden Aufgabe an — die Achse wäre ausserhalb von Claude
    # wirkungslos.
    echo "Nur auf Zuruf — diese Skills startet der Mensch, nicht die Session:"
    echo
    for skill in "$ROOT"/plugins/*/skills/*/; do
      local name desc
      name="$(basename "$skill")"
      is_user_invoked "$skill/SKILL.md" || continue
      desc="$(fm_desc "$skill/SKILL.md" | sed 's/\. .*/./')"
      echo "- \`.agents/skills/$name/SKILL.md\` — $desc"
    done
    echo "$end"
  } >> "$tmp"
  mv "$tmp" "$file"
}

install_neutral() { # gemeinsamer Unterbau für cursor/copilot/agents
  local proj="$1"
  copy_skills "$proj/.agents/skills"
  copy_roles "$proj/.agents/roles"
  cp "$ROOT/docs/portabilitaet.md" "$proj/.agents/portabilitaet.md"
  agents_md_block "$proj"
}

case "$CLIENT" in
  claude)
    PROJ="${ARG2:-.}"
    SETTINGS="$PROJ/.claude/settings.json"
    if [ -f "$SETTINGS" ] && grep -q 'buedominic-skills' "$SETTINGS"; then
      echo "$SETTINGS referenziert buedominic-skills bereits — nichts zu tun."
    elif [ -f "$SETTINGS" ]; then
      echo "$SETTINGS existiert bereits. Folgende Keys auf oberster Ebene"
      echo "manuell zusammenführen (Vorlage: templates/claude-settings.example.json):"
      echo
      cat "$ROOT/templates/claude-settings.example.json"
      exit 1
    else
      mkdir -p "$PROJ/.claude"
      cp "$ROOT/templates/claude-settings.example.json" "$SETTINGS"
      echo "→ $SETTINGS geschrieben."
    fi
    echo
    echo "Datei ins Projekt-Repo committen — Claude Code registriert den"
    echo "Marketplace und installiert die Plugins dann bei jedem Session-Start"
    echo "automatisch, auch in flüchtigen Cloud-/Web-Containern."
    ;;

  claude-copy)
    PROJ="${ARG2:-.}"
    copy_skills "$PROJ/.claude/skills"
    copy_roles "$PROJ/.claude/agents"
    echo "Skills → $PROJ/.claude/skills:"; printf '  - %s\n' "${SKILLS[@]}"
    echo "Agents → $PROJ/.claude/agents:"; printf '  - %s\n' "${ROLES[@]}"
    echo
    echo "Ins Projekt-Repo committen — die Kopien sind Teil des Klons und laden"
    echo "in jeder Session (auch Cloud/Web, auch ohne Netzzugriff). Nicht"
    echo "enthalten: Hooks des feature-workflow-Plugins (nur über die"
    echo "Plugin-Route bzw. plugins/feature-workflow/templates/)."
    echo "Update = Repo pullen, Script erneut ausführen."
    ;;

  codex)
    SK_TARGET="${HOME}/.agents/skills"; AG_TARGET="${HOME}/.codex/agents"
    if [ "$ARG2" = "--project" ]; then SK_TARGET=".agents/skills"; AG_TARGET=".codex/agents"; fi
    copy_skills "$SK_TARGET"
    mkdir -p "$AG_TARGET"
    ROLES=()
    for md in "$ROOT"/plugins/*/agents/*.md; do
      [ -e "$md" ] || continue
      name="$(basename "$md" .md)"
      desc="$(fm_desc "$md")"
      disallowed="$(fm_value "$md" disallowedTools)"
      agent_model="$(fm_value "$md" model)"
      body="$(awk '/^---$/{c++;next} c>=2{print}' "$md")"
      desc="${desc//\\/\\\\}"; desc="${desc//\"/\\\"}"
      body="${body//\\/\\\\}"; body="${body//\"\"\"/\\\"\\\"\\\"}"
      {
        echo "# Generiert aus plugins/.../agents/$name.md — Quelle dort ändern, Script erneut ausführen."
        echo "name = \"$name\""
        echo "description = \"$desc\""
        if [[ "$disallowed" =~ Edit|Write|MultiEdit|NotebookEdit ]]; then
          echo 'sandbox_mode = "read-only"'
        fi
        if [ -n "$agent_model" ] && [ "$agent_model" != "inherit" ]; then
          printf 'model = "%s"\n' "$agent_model"
        fi
        echo 'developer_instructions = """'
        printf '%s\n' "$body"
        echo '"""'
      } > "$AG_TARGET/$name.toml"
      ROLES+=("$name")
    done
    echo "Skills → $SK_TARGET:"; printf '  - %s\n' "${SKILLS[@]}"
    echo "Codex-Agenten → $AG_TARGET:"; printf '  - %s\n' "${ROLES[@]}"
    echo; echo "Neue Codex-Session starten (bzw. /skills prüfen)."
    ;;

  cursor)
    PROJ="${ARG2:-.}"
    install_neutral "$PROJ"
    mkdir -p "$PROJ/.cursor/rules"
    for skill in "$ROOT"/plugins/*/skills/*/; do
      name="$(basename "$skill")"
      desc="$(fm_desc "$skill/SKILL.md")"
      {
        echo "---"
        # Mit `description` ist die Rule „Agent Requested" — Cursor lädt sie
        # anhand der Beschreibung, also model-invoked. Ohne sie ist sie
        # „Manual" und greift nur auf `@name`. Das Feld zu leeren genügt
        # nicht: gesetzt ist gesetzt.
        is_user_invoked "$skill/SKILL.md" || echo "description: $desc"
        echo "alwaysApply: false"
        echo "---"
        echo
        echo "Folge dem Workflow in \`.agents/skills/$name/SKILL.md\` (inklusive"
        echo "seiner \`references/\`). Claude-spezifische Tool-Namen übersetzt"
        echo "\`.agents/portabilitaet.md\`. Subagenten-Rollen: \`.agents/roles/\`."
      } > "$PROJ/.cursor/rules/$name.mdc"
    done
    echo "Skills → $PROJ/.agents/skills:"; printf '  - %s\n' "${SKILLS[@]}"
    echo "Cursor-Rules (Agent-Requested) → $PROJ/.cursor/rules/*.mdc"
    echo "AGENTS.md-Block aktualisiert."
    ;;

  copilot)
    PROJ="${ARG2:-.}"
    install_neutral "$PROJ"
    mkdir -p "$PROJ/.github/prompts"
    for skill in "$ROOT"/plugins/*/skills/*/; do
      name="$(basename "$skill")"
      desc="$(fm_desc "$skill/SKILL.md")"
      {
        echo "---"
        # Copilot-Prompt-Files sind per Konstruktion Slash-Commands (`/name`
        # im Chat) — hier ist schon alles user-invoked, und `description` ist
        # bloss das Label in der Auswahl. Deshalb bewusst KEINE Weiche.
        echo "description: $desc"
        echo "---"
        echo
        echo "Folge dem Workflow in \`.agents/skills/$name/SKILL.md\` (inklusive"
        echo "seiner \`references/\`). Claude-spezifische Tool-Namen übersetzt"
        echo "\`.agents/portabilitaet.md\`. Subagenten-Rollen: \`.agents/roles/\`."
      } > "$PROJ/.github/prompts/$name.prompt.md"
    done
    echo "Skills → $PROJ/.agents/skills:"; printf '  - %s\n' "${SKILLS[@]}"
    echo "Copilot-Prompts (/name im Chat) → $PROJ/.github/prompts/*.prompt.md"
    echo "AGENTS.md-Block aktualisiert (Copilot Coding Agent liest AGENTS.md)."
    ;;

  agents)
    PROJ="${ARG2:-.}"
    install_neutral "$PROJ"
    echo "Skills → $PROJ/.agents/skills:"; printf '  - %s\n' "${SKILLS[@]}"
    echo "AGENTS.md-Block aktualisiert — jeder Client, der AGENTS.md liest,"
    echo "findet die Skills darüber."
    ;;

  *) usage ;;
esac
