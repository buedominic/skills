---
name: projekt-setup
description: Use when setting up a repository for Claude Code for the first time — creating an initial lean CLAUDE.md, wiring the feature-workflow config, and anchoring context-maintenance rules (e.g. "richte das Projekt ein", "erstelle eine CLAUDE.md", "setup für claude code", "onboarding"). Also use when an existing CLAUDE.md should be restructured to the lean layered format.
---

# Projekt-Setup — Kontext erstmalig aufnehmen

Richtet ein Repo für die Arbeit mit Claude Code ein: schlanke `CLAUDE.md`
nach Budget, optionale Workflow-Verdrahtung, verankerte Pflege-Regeln.

**Doktrin ZUERST lesen** (erster Fund gewinnt):
`references/kontext-architektur.md` (neben dieser Datei — bei
Einzel-Skill-Installation, z.B. Codex) oder
`../../docs/kontext-architektur.md` (Plugin-/Repo-Layout). Sie ist die
Wahrheit; dieser Skill beschreibt nur den Ablauf. Fehlen beide, gilt die
Kurzfassung:

> CLAUDE.md wird in jeder Session geladen → hartes Budget ≤ ~120 Zeilen
> (Kosten ∝ Ladehäufigkeit); Detail wandert in verlinkte Doku, Skill-
> References oder Archive. **Gotchas sind der Schwerpunkt-Posten** mit dem
> grössten Token-Anteil: nicht in 30 Sekunden aus dem Repo ableitbar und
> hat schon einmal jemanden gekostet. Code schlägt Prosa: Test-Suite,
> Mockup, zu portierende Funktion oder Rubric werden per `@`-Mention
> bedarfsgeladen, nie nach CLAUDE.md kopiert. Regeln stehen als
> Urteils-Anker (Zielzustand statt Einzelfall-Untersagung), ein Verbot nur
> bei realem Failure-Mode. Eine Wahrheit, dünne Adapter: jeder Fakt genau
> einmal, `AGENTS.md` & Co. verweisen statt kopieren. Kein Memory-Store —
> Claude legt Sitzungsfunde selbst ab (Auto-Memory). Status-Einträge max.
> 5 Zeilen, Historie in `*-archiv.md`.

## Ablauf

### 1. Bestandsaufnahme (read-only)

- Existiert schon eine `CLAUDE.md`/`AGENTS.md`? → **NICHT überschreiben.**
  Stattdessen Restrukturierung: Bestand gegen die Doktrin bewerten, Umbau
  als Vorschlag präsentieren (wie `/kontext-audit`, Neuaufbau statt Diät).
- Repo analysieren: `package.json`/Build-Tooling (Befehle für dev, test,
  build, lint), Verzeichnisstruktur (nur Top-Level + auffällige
  Konventionen), Test-Setup, CI-Workflows, bestehende Doku unter `docs/`,
  `.env.example` (NICHT `.env` lesen).
- Notiere, was aus dem Code ableitbar ist — das kommt NICHT in die
  CLAUDE.md.

### 2. Interview (gebündelt, max. 2 Runden `AskUserQuestion`)

Nur fragen, was nicht aus dem Repo ableitbar ist:

- Projektzweck + Zielgruppe in einem Satz (falls README es nicht hergibt).
- **Gotcha-Frage** (der grösste Posten): Was ist hier nicht aus dem Repo
  ableitbar und hat schon einmal jemanden gekostet? Nachhaken, bis 2–5
  konkrete Fälle mit Datei-Verweis stehen. Ein Verbot nur mit konkret
  genanntem Failure-Mode, sonst Urteils-Anker oder nichts.
- Nicht-verhandelbare Konventionen (je 1 Zeile + Datei-Verweis).
- Deploy-Weg (nur die eine Zeile Wahrheit + wo das Detail liegt).
- Soll der Feature-Workflow (`/spec-to-implementation`) für dieses Projekt
  gelten? Soll der Branch-Schutz aktiv sein?
- Braucht es `AGENTS.md` (arbeiten auch Nicht-Claude-Werkzeuge im Repo)?

### 3. CLAUDE.md schreiben (Budget ≤ ~120 Zeilen)

Struktur exakt nach Doktrin § „Was gehört in CLAUDE.md": Gotchas zuerst und
mit dem grössten Token-Anteil, dann Projekt-Kern, Befehle, Konventionen
(1 Zeile + Verweis pro Regel), Workflow-Verweis, Verweis-Tabelle,
Kontext-Pflege-Abschnitt. Regeln als Urteils-Anker formulieren; jeder
stale-anfällige Fakt bekommt eine Code-Fundstelle als Prüfanker.

Falls `AGENTS.md` gewünscht: als dünner Adapter (Projekt-Kern + Verweis auf
CLAUDE.md), NIE als Kopie.

### 4. Workflow verdrahten (falls in Schritt 2 bejaht)

Die Config-Dateien projektspezifisch erzeugen. Ist das
feature-workflow-Plugin installiert, dessen Vorlagen (`templates/` im
Plugin-Ordner) als Ausgangspunkt nehmen; sonst die Dateien direkt mit den
unten genannten Feldern anlegen (Plugins sind einzeln gecacht — verlasse
dich nicht auf Dateien eines anderen Plugins):

- `.claude/workflow.config.json` — Felder: `specsDir`, `plansDir`,
  `defaultBranch`, `maxReviewRounds`, `verifyCommands[]` (aus den echten
  package.json-Scripts), `devServer` (`command`, `port`, `healthUrl`,
  `appMarker`) aus dem Repo ableiten; nur Verifiziertes eintragen.
- `.claude/branch-guard.json` — Felder: `protectedBranch`, `protected[]`,
  `allowed[]` (case-insensitive Regexes auf repo-relative Pfade);
  geschützte Pfade aus der realen Source-Struktur (z.B. `^src/`,
  Test-Verzeichnis, Schema-Verzeichnis); Docs/Config bleiben auf dem
  Default-Branch editierbar. Nur anlegen, wenn der User den Schutz will
  (Opt-in).
- `.claude/settings.json` — Permissions-Grundstock aus der Vorlage, auf die
  tatsächlichen Projekt-Befehle reduziert/erweitert.

### 5. Lebende Dokumente anlegen (falls Workflow verdrahtet)

- `docs/status.md` mit dem 5-Zeilen-Format-Template als Kopfkommentar und
  einem ersten Eintrag („Projekt-Setup").
- `docs/backlog.md` als leere Tabelle mit Archiv-Hinweis.
- Spec-/Plan-Verzeichnisse gemäss `workflow.config.json` anlegen
  (`.gitkeep`), inkl. `.gitignore`-Eintrag für Smoke-Evidenz
  (`<plansDir>/**/smoke/`).

### 6. Abschluss

- Alles als EIN Commit („chore: Claude-Code-Setup — CLAUDE.md + Workflow-
  Konfiguration").
- Kurzer Abschluss-Bericht: was angelegt wurde, welche Budgets gelten, wie
  die Pflege läuft (`/kontext-audit`), was bewusst NICHT aufgenommen wurde
  (ableitbar aus Code) und wo Detail-Doku hingehört.

## Leitplanken

- Budget ist hart: lieber ein Verweis mehr als ein Absatz mehr. Wenn der
  User Enzyklopädisches wünscht → Schicht-2-Dokument anlegen und verweisen.
- Keine Fakten erfinden: was weder aus dem Repo noch vom User kommt, bleibt
  draussen (kein „vermutlich wird mit X deployed").
- Nichts Bestehendes löschen oder überschreiben ohne expliziten Auftrag.
- `.env`/Secrets nie lesen, nie referenzieren (ausser `.env.example`).
