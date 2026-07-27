# Plan — Claude-5-Kontext-Regeln

Spec: `docs/specs/2026-07-27-claude-5-context-rules-design.md`
Branch: `claude/skills-claude-5-context-b4wfoo` (Mandats-Abweichung von
`feature/<name>` — siehe Manifest `deviations`)

## Reihenfolge und Begründung

| Phase | Datei | Inhalt | Befunde |
|---|---|---|---|
| 01 | `01-portabler-check.md` | `tests/validate-context-doctrine.mjs` — erst rot, dann grün | Regression |
| 02 | `02-doktrin.md` | `kontext-architektur.md` als die eine Quelle umbauen | A, D, F, H, Rich References |
| 03 | `03-context-kit-skills.md` | `projekt-setup` + `kontext-audit` | B, C, F, K, L |
| 04 | `04-feature-workflow.md` | `spec-to-implementation` + `review-loop.md` | E, F, I |
| 05 | `05-vorlage-und-dev-toolkit.md` | Skill-Vorlage + Leitplanken-Durchgang | G, I, J |
| 06 | `06-bilanz.md` | Zeilen-Bilanz, Verifikation, Abschluss | Budget |

Jeder Befund A–L hat damit genau eine zuständige Phase. Befund F ist in 02,
03 und 04 aufgeführt, weil er drei Dateien berührt — inhaltlich bleibt davon
nach der Runde-8-Korrektur nur noch die Markierung.

Phase 01 zuerst, weil der Check die Akzeptanz maschinell festnagelt, bevor
irgendetwas editiert wird — das ist die TDD-Form für Prompt-Inhalte. Phase 02
vor 03/04, weil die Doktrin die Quelle ist, auf die die Skills verweisen.

## Ausgangs-Bilanz (Zeilen)

```
kontext-architektur.md                    80
kontext-audit/SKILL.md                    93
projekt-setup/SKILL.md                   107
spec-to-implementation/SKILL.md          256   <- über dem eigenen Budget
review-loop.md                            81
dev-toolkit (6 Skills)                   499
skill-vorlage/SKILL.template.md           29
                                        ----
                                        1145
```

**Der Hebel:** `spec-to-implementation/SKILL.md` verletzt mit 256 Zeilen das
Budget der eigenen Doktrin (Orchestrator-Kern ~150–200). Die Kürzung dort
finanziert die Ergänzungen in Phase 02/03 — genau die Gegenfinanzierung, die
die Spec verlangt.

## Was hart bleibt

Die Anker aus § Regression der Spec sind unantastbar: Daten-Grenze und
`git ls-files --error-unmatch`, „Git ist die Wahrheit", der
Gate-2-Approval-Passus, der Verweis auf `references/codex-runtime.md`,
„Keine erfundenen Beweise", „Keine PII/Secrets", die `.env`-Verbote.
Phase 01 macht genau das prüfbar, bevor Phase 02 beginnt.

`references/smoke-gate.md` wird **nicht** angefasst — bewusst abgelehntes
Review-Finding, siehe § Nicht-Ziele der Spec. Keine Phase hat dort etwas
zu suchen.
