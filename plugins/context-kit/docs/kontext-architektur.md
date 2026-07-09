# Kontext-Architektur — Doktrin für beide context-kit-Skills

Gemeinsame Regeln für `/projekt-setup` (erstmalige Aufnahme) und
`/kontext-audit` (Pflege). Destilliert aus einem realen Workflow-Review
(Doktrin-Divergenz, Kontext-Budget, Status-Dokumente als Kontext-Bomben).

## Schichten-Modell: Kontext wird orchestriert, nicht angehäuft

| Schicht | Wird geladen | Budget | Inhalt |
|---|---|---|---|
| 1. `CLAUDE.md` | **immer** (jede Session) | **≤ ~120 Zeilen** | Nur was JEDE Session braucht: Projekt-Kern, Konventionen, Verbote, Befehle, Verweise |
| 2. Kern-Doku (`docs/…`) | bei Bedarf, per Verweis | pro Dokument ein Thema | Spezifikationen, Workflow-Pipeline, Architektur-Entscheide |
| 3. Skill-References | erst beim Stufen-Eintritt (Progressive Disclosure) | — | Detail-Maschinerie von Skills |
| 4. Lebende Dokumente (`status.md`, `backlog.md`) | bei Bedarf | status < ~50 Z. (5-Zeilen-Format), Backlog mit Archiv | aktueller Stand, offene Items |
| Archiv (`*-archiv.md`) | praktisch nie | unbegrenzt | Historie — bewusst aus dem heissen Pfad entfernt |

**Kernregel: Kosten ∝ Ladehäufigkeit.** Was immer geladen wird, muss am
schlanksten sein. Detail wandert so weit nach unten wie möglich.

## Eine Wahrheit, dünne Adapter

- Jeder Fakt, jede Regel, jedes Format existiert an **genau einer Stelle**.
- Agent-spezifische Dateien (`CLAUDE.md`, `AGENTS.md`, Tool-Handbücher)
  sind **Adapter**: Projekt-Kern + Verweis auf die eine Quelle + rein
  werkzeugspezifische Bedienung. Sie duplizieren NIE Inhalte voneinander —
  Duplikate driften erfahrungsgemäss schnell auseinander — eine
  Konventions-Änderung erreicht selten alle Kopien.
- Wenn `AGENTS.md` gewünscht ist: erzeugen als „Projekt-Kern (identischer
  kurzer Block) + Verweis auf CLAUDE.md/Kern-Doku", nicht als Kopie.

## Was gehört in CLAUDE.md (Schicht 1)

1. **Projekt-Kern** (≤ 5 Zeilen): Was ist das, für wen, Stack in einem Satz.
2. **Befehle**: dev/test/build/lint — genau die Liste, die täglich läuft.
3. **Konventionen**: NUR die nicht aus dem Code ableitbaren bzw. die
   verletzungsanfälligen Regeln (je 1 Zeile, mit Datei-Verweis statt
   Erklär-Absatz).
4. **Verbote** („Was NICHT tun"): kurz, imperativ.
5. **Workflow-Verweis**: welcher Feature-/Fix-Workflow gilt (z.B.
   `/spec-to-implementation`), 2–3 Zeilen + Verweis.
6. **Verweis-Tabelle**: wo liegt was (Spec-Dir, Plan-Dir, Status, Backlog,
   Architektur-Doku).
7. **Kontext-Pflege-Abschnitt** (3 Zeilen): Budgets + „bei Verstoss
   `/kontext-audit` fahren".

## Was gehört NICHT in CLAUDE.md

- Implementations-Historie und Begründungs-Prosa (→ Specs/Commits).
- Enzyklopädische Aufzählungen (alle Events, alle Endpoints, alle
  Env-Vars — → Schicht-2-Doku, in CLAUDE.md nur die Regel + Verweis).
- Alles, was aus dem Code selbst in <30 Sekunden ableitbar ist
  (Verzeichnisstruktur, offensichtliche Scripts).
- Skill-/Tool-Listen mit eigenem Erklärtext (eine Zeile + Verweis genügt;
  Verfügbarkeits-neutral formulieren: „falls installiert, sonst §X").
- Stale-anfällige Detailfakten ohne Prüfanker (Deploy-Provider,
  Versions-Nummern) — wenn nötig, mit Fundstelle im Code notieren, damit
  das Audit sie verifizieren kann.

## Format lebender Dokumente

Status-Eintrag (hartes Budget, **max. 5 Zeilen** pro Abschluss):

```markdown
- **YYYY-MM-DD — <Titel>** (`<branch>`): <Was + Warum, 1–2 Sätze>.
  <Besonderheiten/Bruchstellen, 0–2 Sätze>.
  Spec: `<pfad>` · Plan: `<pfad>` · Tests: <kurz>.
```

Archiv-Mechanismus: Überschreitet ein lebendes Dokument sein Budget,
wandern die ältesten Einträge in `<name>-archiv.md` — als eigener Commit,
damit der Umzug nachvollziehbar bleibt.

## Pflege-Trigger

- **Bei jedem Feature-/Fix-Abschluss**: Status/Backlog im Budget-Format
  nachziehen (macht die Finish-Stufe des feature-workflow-Plugins).
- **Bei Konventions-/Architektur-Änderungen**: die EINE Quelle ändern,
  Adapter nur wenn sich die Bedienung ändert.
- **Periodisch oder bei Verdacht** („CLAUDE.md fühlt sich falsch an",
  Session verhält sich entgegen der Doku): `/kontext-audit`.
