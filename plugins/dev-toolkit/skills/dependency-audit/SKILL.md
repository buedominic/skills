---
name: dependency-audit
description: Abhängigkeiten prüfen und risikogestuft aktualisieren.
disable-model-invocation: true
---

# Dependency-Audit — Abhängigkeiten prüfen + risikoarm aktualisieren

**Befund vor Eingriff:** erst erheben und klassifizieren, dann vorlegen —
geändert wird auf Zusage.
Wird manuell angestossen.

## Ablauf

### 0. Bestehende Automation prüfen

Hat das Repo schon Renovate (`renovate.json`) oder Dependabot
(`.github/dependabot.yml`)? Dann nicht dagegen arbeiten: das Audit
konzentriert sich auf das, was die Automation NICHT abdeckt (liegengebliebene
Major-PRs bewerten, Lizenz-Check, tote Gewichte) und empfiehlt ggf.
Konfigurations-Anpassungen statt manueller Updates.

### 1. Inventar

- Manifest + Lockfile des Stacks lesen (z.B. `package.json` +
  `package-lock.json`; analog für andere Ökosysteme).
- Veraltete Pakete erfassen (`npm outdated` o.ä.): current / wanted /
  latest.
- Bekannte Lücken erfassen (`npm audit` o.ä.), Schweregrade notieren.
- Lizenz-Auffälligkeiten prüfen (Copyleft in proprietärem Kontext,
  Lizenzwechsel bei Major-Sprüngen).
- Tote Gewichte: deklarierte, aber nirgends importierte Pakete
  (Grep nach Imports) → Entfernungs-Kandidaten.

### 2. Risiko-Klassifizierung

| Stufe | Kriterium | Behandlung |
|---|---|---|
| SOFORT | Lücke mit Schweregrad high/critical und verfügbarem Fix | eigener, kleiner Update-Schritt — zuerst |
| PATCH | reine Patch-Sprünge | gesammelt in einem Schritt |
| MINOR | Minor-Sprünge | gesammelt, aber Changelog-Stichprobe bei zentralen Paketen |
| MAJOR | Major-Sprünge | je Paket EIN eigener Schritt, NIE ohne Breaking-Changes-Lektüre |
| ENTFERNEN | ungenutzt / durch Bordmittel ersetzbar | Vorschlag mit Fundstellen-Beleg |

### 3. Report + Bestätigung

Kompakter Report: pro Stufe die Pakete mit 1 Zeile (von → nach, Grund,
bei MAJOR: die 2–3 relevanten Breaking Changes mit Quelle). Dann EINE
gebündelte `AskUserQuestion`: alles / nur SOFORT+PATCH / nur Report.

### 4. Umsetzung (nach Bestätigung)

- Reihenfolge: SOFORT → PATCH → MINOR → MAJOR (einzeln).
- **Nach JEDEM Schritt** die Verifikations-Suite des Projekts
  (`verifyCommands` aus `.claude/workflow.config.json`, sonst
  Typecheck + Tests + Build). Rot → Schritt isolieren: fixen oder
  zurückrollen und im Report als blockiert dokumentieren — NICHT den
  nächsten Schritt draufsetzen.
- Ein Schritt = ein Commit (`chore(deps): …`), damit jeder Sprung einzeln
  revertierbar ist.
- Lockfile-Änderungen gehören in denselben Commit wie das Manifest.

### 5. Abschluss

Kurz-Bericht: was aktualisiert, was blockiert (mit Grund), was bewusst
zurückgestellt (z.B. Major mit grossem Migrationsaufwand → als
Backlog-Item formulieren).

## Leitplanken

- Kein Major-Update ohne gelesene Release-Notes/Changelog — „latest" ist
  kein Argument.
- Keine neuen Pakete einführen (das ist `/prior-art-check`-Territorium).
- Peer-Dependency-Konflikte nicht mit `--force`/`--legacy-peer-deps`
  übertünchen — als blockiert dokumentieren.
- Registry-Skripte nicht blind ausführen; Installationen laufen mit den
  Standard-Sicherheitsmechanismen des Projekts.
