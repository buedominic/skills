# dev-toolkit

Alltags-Skills fürs Entwickeln — die Werkzeuge **um** die Feature-Pipeline
herum. Alle werden manuell angestossen; keiner läuft automatisch.

## Inhalt

| Skill | Zweck | Mündet in |
|---|---|---|
| `/prior-art-check` | Vor dem Bauen prüfen, ob das Problem schon gelöst ist: eigener Code → Ökosystem-Bibliotheken (mit Qualitäts-/Lizenz-Check) → bekannte Informatik-Problemklassen → Natur-/Domänen-Heuristiken (Simulated Annealing, evolutionäre Verfahren …). Build/Buy/Adapt-Empfehlung. | „Prior Art"-Abschnitt der Spec (Stufe 1) bzw. `/adr` |
| `/dependency-audit` | Veraltete Pakete, Sicherheitslücken, Lizenzen, tote Gewichte erfassen; risikogestufter Update-Plan (SOFORT → PATCH → MINOR → MAJOR einzeln), Verifikation nach jedem Schritt, ein Schritt = ein Commit. Report zuerst, Umsetzung nach Bestätigung. | `chore(deps)`-Commits + Backlog-Items für Zurückgestelltes |
| `/adr` | Architektur-/Technologie-Entscheide als Architecture Decision Record unter `docs/decisions/` festhalten (Kontext, Optionen, Entscheid, Konsequenzen; append-only, ≤ 1 Seite). | Schicht-2-Kontext gemäss context-kit-Doktrin |
| `/bug-triage` | Vage Fehlermeldung → Repro → Evidenz → gerankte Root-Cause-Hypothesen → fix-fertiges Mini-Dokument im Light-Mode-Format. Wendet den Fix bewusst NICHT an. | L1-Dokument für den Light-Mode von `/spec-to-implementation` |
| `/web-audit` | Accessibility-, Performance- und SEO-Audit für Web-Anwendungen: statische Analyse + optionale Laufzeit-Prüfung (Tastatur, Kontrast, Ladeverhalten), Befunde mit Fundstelle, klassifiziert KRITISCH/HOCH/POLITUR. Report zuerst, Fixes nach Bestätigung. | thematisch gebündelte Fix-Commits |
| `/landing-page` | Conversion-Struktur (Hero, Nutzenversprechen, Social Proof, CTA-Hierarchie), Copy-Prinzipien und Launch-Checkliste für Landing-/Marketing-Pages; delegiert die visuelle Gestaltung ans offizielle `frontend-design`-Plugin, falls installiert. | Landing Page + `/web-audit` für den vollen Check |

## Zusammenspiel mit den anderen Plugins

```
Idee ──────────► /prior-art-check ──► Entscheid? ──► /adr
                        │
                        ▼
Feature ───────► /spec-to-implementation (feature-workflow)
                        ▲
Bug-Meldung ───► /bug-triage ──► Light-Mode-Input
                        
Wartung ───────► /dependency-audit          (periodisch, manuell)
Kontext ───────► /kontext-audit (context-kit) (bei Verdacht, manuell)
```

Bewusst NICHT enthalten (bringt Claude Code bzw. das Ökosystem schon mit):
Code-Review, Security-Review, Verifikation, systematisches Debugging, TDD
(Claude Code / superpowers) — sowie visuelles Frontend-Design und
Playwright-Webapp-Testing: dafür die offiziellen Anthropic-Skills
`frontend-design` (claude-plugins-official) und `webapp-testing`
(anthropics/skills) installieren; `/landing-page` und `/web-audit` bauen
darauf auf, statt sie zu duplizieren.
