# feature-workflow

Spec-to-Implementation-Pipeline für Claude Code: **Brainstorm → Spec →
Review → Plan → Review → Implementation → Verifikation → Smoke-Gate →
Finish** mit genau zwei menschlichen Gates (Klärungsfragen + Plan-Approval).
Aufgebaut nach dem Prinzip „Ein Kern, drei Weichen": dünner Orchestrator-Skill,
Detail-Maschinerie in Referenz-Files (Progressive Disclosure), drei im
Manifest protokollierte Weichen — **Umgebung** (local/web/other),
**Reviewer** (Codex bevorzugt, Claude-Subagent-Fallback) und **Grösse**
(Full-Pipeline oder Light-Mode für Fix-Scope).

## Inhalt

| Baustein | Datei | Zweck |
|---|---|---|
| Skill `/spec-to-implementation` | `skills/spec-to-implementation/SKILL.md` | Dünner Orchestrator: Stufen, Gates (beide als `AskUserQuestion`), Manifest-Pflege, Weichen-Erkennung, Light-Mode |
| Referenz: Review-Schleife | `skills/spec-to-implementation/references/review-loop.md` | Schleifen-Mechanik, Triage, Reviewer-Weiche, Squash-pro-Stufe — erst bei Stufe 2/4 gelesen |
| Referenz: Smoke-Gate | `skills/spec-to-implementation/references/smoke-gate.md` | Zustandsmaschine, Budgets, Evidenz-Redaktion, Fix-Loop; Varianten chrome-mcp / playwright / manual — erst bei Stufe 7 gelesen |
| Agent `spec-reviewer` | `agents/spec-reviewer.md` | Read-only Review von Spec/Plan; nutzt Codex-MCP falls vorhanden, sonst reviewt er selbst |
| Agent `implementer` | `agents/implementer.md` | Setzt genau eine Plan-Task TDD-first um, Konventionen aus der Projekt-`CLAUDE.md` |
| Agent `doc-writer` | `agents/doc-writer.md` | Schreibt Spec/Plan/Mini-Doc und arbeitet Review-Findings ein — hält die langen Dokument-Texte aus dem Orchestrator-Kontext (Rückgabe nur Pfad + Kurz-Zusammenfassung) |
| Hook `guard-branch` | `hooks/guard-branch.mjs` | Blockt Source-Edits auf dem geschützten Branch — **Opt-in pro Projekt** via `.claude/branch-guard.json` |

## Konfiguration pro Projekt

Das Plugin selbst ist projektunabhängig. Projektspezifisches lebt im
jeweiligen Repo:

1. **`CLAUDE.md`** — Konventionen, Verifikations-Befehle, Branch-Strategie.
   Der Skill und der `implementer`-Agent lesen sie als Quelle der Wahrheit.
2. **`.claude/workflow.config.json`** (optional) — Spec-/Plan-Verzeichnisse,
   Verifikations-Commands, Dev-Server/Health-Check fürs Smoke-Gate sowie
   `models` (Modell + Reasoning-Effort pro Subagenten-Rolle; Reviewer-Weiche
   `auto`/`codex`/`claude` erzwingbar).
   Vorlage: [`templates/workflow.config.example.json`](templates/workflow.config.example.json)
3. **`.claude/branch-guard.json`** (optional) — aktiviert den
   Branch-Schutz-Hook. Ohne die Datei ist der Hook ein No-op.
   Vorlage: [`templates/branch-guard.example.json`](templates/branch-guard.example.json)
4. **`.claude/settings.json`** (optional) — Permissions-Grundstock.
   Vorlage: [`templates/settings.example.json`](templates/settings.example.json)

## Empfohlene Ergänzungen (optional)

- **[superpowers](https://github.com/obra/superpowers)-Plugin** — der Skill
  nutzt `superpowers:brainstorming`, `writing-plans`,
  `test-driven-development` etc., wenn installiert; ohne läuft er mit
  eingebauten Fallbacks.
- **Codex MCP** (`mcp__codex__codex`) — Spec-/Plan-Reviews laufen dann durch
  ein zweites Modell statt durch einen Claude-Subagenten.
- **Browser-MCP** (z.B. Claude in Chrome) — für das automatisierte
  Browser-Smoke-Gate; alternativ bestätigt man den Smoke manuell.
