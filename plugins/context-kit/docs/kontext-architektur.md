# Kontext-Architektur — Doktrin für beide context-kit-Skills

Gemeinsame Regeln für `/projekt-setup` (Aufnahme) und `/kontext-audit`
(Pflege). Quellen: ein realer Workflow-Review (Doktrin-Divergenz,
Kontext-Budget, Status-Bomben) und „The new rules of context engineering for
Claude 5 generation models" (Anthropic, 24.07.2026).

## Schichten-Modell: Kontext wird orchestriert, nicht angehäuft

| Schicht | Wird geladen | Budget | Inhalt |
|---|---|---|---|
| 1. `CLAUDE.md` | **immer** (jede Session) | **≤ ~120 Zeilen** | Nur was JEDE Session braucht: Gotchas, Projekt-Kern, Konventionen, Befehle, Verweise |
| 2. Kern-Doku (`docs/…`) | bei Bedarf, per Verweis | pro Dokument ein Thema | Spezifikationen, Workflow-Pipeline, Architektur-Entscheide |
| 3. Skill-References | erst beim Stufen-Eintritt (Progressive Disclosure) | — | Detail-Maschinerie von Skills |
| 4. Lebende Dokumente (`status.md`, `backlog.md`) | bei Bedarf | status < ~50 Z. (5-Zeilen-Format), Backlog mit Archiv | aktueller Stand, offene Items |
| Archiv (`*-archiv.md`) | praktisch nie | unbegrenzt | Historie — bewusst aus dem heissen Pfad entfernt |

**Kernregel: Kosten ∝ Ladehäufigkeit.** Was immer geladen wird, muss am
schlanksten sein. Detail wandert so weit nach unten wie möglich.

**Code schlägt Prosa.** Test-Suite, HTML-Mockup, zu portierende Funktion oder
Rubric schlagen jede Beschreibung desselben. Solche `Rich Reference`-Artefakte
bleiben, wo sie ohnehin liegen, und werden per `@`-Mention gezogen — bedarfs-
geladen wie Schicht 2/3, niemals nach Schicht 1 kopiert.

## Eine Wahrheit, dünne Adapter

- Jeder Fakt, jede Regel, jedes Format existiert an **genau einer Stelle**.
  Duplikate driften; eine Konventions-Änderung erreicht selten alle Kopien.
- Agent-Dateien (`CLAUDE.md`, `AGENTS.md`, Tool-Handbücher) sind **Adapter**:
  Projekt-Kern + Verweis auf die eine Quelle + werkzeugspezifische Bedienung,
  nie eine Kopie voneinander. `AGENTS.md` erbt denselben kurzen Kern-Block.

## Was gehört in CLAUDE.md (Schicht 1)

1. **Gotchas** — der Schwerpunkt-Posten, **grösster Token-Anteil der Datei**.
   Aufnahmetest: nicht in 30 Sekunden aus dem Repo ableitbar **und** hat
   schon einmal jemanden gekostet. Muster: „Typen liegen in genau einer
   monolithischen Datei." Je 1–2 Zeilen, mit Datei-Verweis.
2. **Projekt-Kern** (≤ 5 Zeilen): Was ist das, für wen, Stack in einem Satz.
3. **Befehle**: eine Zeile — dev/test/build/lint, Rest per Verweis.
4. **Konventionen**: je 1 Zeile pro verletzungsanfälliger Regel + Datei-Verweis.
5. **Workflow-Verweis**: welcher Feature-/Fix-Workflow gilt (z.B.
   `/spec-to-implementation`), 2–3 Zeilen + Verweis.
6. **Verweis-Tabelle**: Spec-Dir, Plan-Dir, Status, Backlog, Architektur-Doku.
7. **Kontext-Pflege** (3 Zeilen): Budgets + „bei Verstoss `/kontext-audit`".

**Urteils-Anker statt Regel-Liste.** Beschreibe den Zielzustand, aus dem
abgeleitet werden kann, statt Einzelfälle zu untersagen. Drei Klassen: ein realer,
nachweisbarer **Failure-Mode** (Secrets, Daten-Grenze, Gate-Bypass) bleibt ·
kodierte **Domänen-Praxis** bleibt, sofern du die Folge ihrer Verletzung benennen
kannst — auch negativ formuliert · blosser **Geschmack** bleibt draussen. Muster:
statt „schreibe keine Kommentare, nie mehrzeilige Docstrings" → „Schreib Code, der
sich wie der umgebende liest: gleiche Kommentardichte, Benennung, Idiom."

**CLAUDE.md ist kein Memory-Store.** Claude legt Relevantes selbst ab
(Auto-Memory); der Reflex, Sitzungsfunde per Hotkey nachzutragen, entfällt.
Hier steht nur bewusst kuratierte, dauerhafte Projekt-Wahrheit.

## Was gehört NICHT in CLAUDE.md

- Implementations-Historie und Begründungs-Prosa (→ Specs/Commits).
- Enzyklopädische Aufzählungen (alle Events, Endpoints, Env-Vars) — nur die
  Regel + Verweis auf Schicht 2.
- Alles, was aus dem Code in <30 Sekunden ableitbar ist.
- Skill-/Tool-Listen mit Erklärtext (eine Zeile + Verweis genügt;
  verfügbarkeits-neutral: „falls installiert, sonst §X").
- Stale-anfällige Detailfakten (Deploy-Provider, Versionen) ohne Fundstelle
  im Code, an der das Audit sie verifizieren kann.

## Format lebender Dokumente

Status-Eintrag (hartes Budget, **max. 5 Zeilen** pro Abschluss). Diese Doktrin
ist die **Quelle für dieses Format**; andere Artefakte verweisen darauf:

```markdown
- **YYYY-MM-DD — <Titel>** (`<branch>`): <Was + Warum, 1–2 Sätze>.
  <Besonderheiten/Bruchstellen, 0–2 Sätze>.
  Spec: `<pfad>` · Plan: `<pfad>` · Tests: <kurz>.
```

Archiv-Mechanismus: Überschreitet ein lebendes Dokument sein Budget, wandern die
ältesten Einträge in `<name>-archiv.md` — als eigener Commit, damit der Umzug
nachvollziehbar bleibt.

## Pflege-Trigger

- **Bei jedem Feature-/Fix-Abschluss**: Status/Backlog im Budget-Format
  nachziehen (macht die Finish-Stufe des feature-workflow-Plugins).
- **Bei Konventions-/Architektur-Änderungen**: die EINE Quelle ändern,
  Adapter nur wenn sich die Bedienung ändert.
- **Periodisch oder bei Verdacht** („CLAUDE.md fühlt sich falsch an",
  Session verhält sich entgegen der Doku): `/kontext-audit`.
