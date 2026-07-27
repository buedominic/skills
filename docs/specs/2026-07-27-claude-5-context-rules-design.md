# Claude-5-Kontext-Regeln — Repo an den neuen Anthropic-Blogpost angleichen

Angleichung der Skills, der Kontext-Doktrin und der Skill-Vorlage dieses Repos
an *„The new rules of context engineering for Claude 5 generation models"*
(Thariq Shihipar, Anthropic, 24.07.2026).

## Quelle

Der Blogpost liegt als PDF-Export des Originals vor (17 Seiten, gezogen am
27.07.2026) und ist die Wahrheit für diese Spec. `claude.com` ist aus der
Arbeitsumgebung nicht erreichbar (Netzwerk-Policy, 403 CONNECT über den
Agent-Proxy) — eine frühere Rekonstruktion über WebSearch wurde verworfen,
nachdem der Vergleich mit dem Original zwei Fehler zeigte (siehe § Annahmen).

## Was der Post sagt

Anthropic hat >80 % des Claude-Code-System-Prompts für Opus 5 und Fable 5
entfernt, ohne messbaren Verlust auf den Coding-Evals. Diagnose: **Über-
Constraining**. In echten Transkripten kollidierten „leave documentation as
appropriate", „DO NOT add comments" und der User-Wunsch im selben Request —
Claude kommt zwar zum richtigen Ergebnis, muss aber erst die widersprüchlichen
Signale auflösen.

Sechs Verschiebungen:

| Vorher | Jetzt | Kern |
|---|---|---|
| Regeln geben | Urteilsvermögen nutzen | Prescriptive Regel durch einen Anker ersetzen, aus dem das Modell ableiten kann. Beispiel aus dem Post: statt „default to writing no comments. Never write multi-paragraph docstrings…" jetzt „Write code that reads like the surrounding code: match its comment density, naming, and idiom." |
| Beispiele geben | Interfaces designen | Beispiele engen den Explorationsraum ein. Stattdessen expressive Parameter und constrained values — im Todo-Tool trägt schon das Enum `pending`/`in_progress`/`completed` die Bedienung, plus ein Satz zum gewünschten Verhalten. |
| Alles vorab laden | Progressive Disclosure | Verification und Code-Review wurden aus dem System-Prompt in eigene Skills verschoben. Gilt auch für Tools (deferred loading via ToolSearch) und für CLAUDE.md/SKILL.md: **ein Baum von Dateien**, die zur richtigen Zeit geladen werden. |
| Sich wiederholen | Einfache Tool-Descriptions | Ältere Modelle brauchten dieselbe Instruktion doppelt (System-Prompt *und* Tool-Description) und hörten am Kontext-Ende besser zu. Die Wiederholungen sind gelöscht; die Bedienung steht in der Description. |
| Memory in CLAUDE.md | Auto-Memory | Der `#`-Hotkey, der in die CLAUDE.md schrieb, ist überholt — Claude speichert relevante Memories selbst. |
| Einfache Specs | Rich References | HTML-Artefakte, Code, eine detaillierte Test-Suite, eine zu portierende Funktion aus einer anderen Codebase, Rubrics für Verifier-Agenten. **Dateien in Code sind zu bevorzugen** — ein HTML-Mockup schlägt eine Beschreibung *und* einen Screenshot. |

Dazu der Abschnitt „Applying this to your context" mit den konkretesten
Vorgaben des Posts:

- **CLAUDE.md**: leichtgewichtig halten, kurz sagen wofür das Repo da ist,
  und **den Grossteil der Tokens auf die Gotchas der Codebase verwenden**
  (Post-Beispiel: „Typen liegen in genau einer monolithischen Datei").
  Das Offensichtliche weglassen — alles, was Claude aus Dateisystem und Repo
  sieht. Progressive Disclosure aktiv nutzen: mehrere Verifikations-
  Anweisungen werden ein Verification-Skill, aus der CLAUDE.md referenziert.
- **Skills**: „lightweight guides to let Claude find information when needed."
  Nicht über-constrainen — **ausser in hochwichtigen Bereichen**. Lange Skills
  in viele Dateien aufteilen. Am wertvollsten sind Skills, die *eigene*
  Meinungen, Wissen oder Best Practices kodieren.
- **References**: `@`-mentions; Code-Dateien bevorzugen.
- `/doctor` in Claude Code rightsized Skills und CLAUDE.md automatisch.

## Annahmen

1. Der PDF-Export gibt den Post vollständig wieder. Navigations- und
   Footer-Fragmente des Exports wurden ignoriert.
2. **Korrektur gegenüber der Vorab-Analyse:** Die Liste „harte Constraints,
   die bleiben dürfen — Brand Voice, Pricing, Sign-off-Autorität,
   Vertraulichkeit" stammt aus einer Sekundärquelle und steht **nicht** im
   Post. Der Post formuliert die Ausnahme offener: nicht über-constrainen,
   „except in highly important areas". Wir übernehmen die offene Formulierung
   und definieren „hochwichtig" für dieses Repo selbst.
3. **Korrektur gegenüber der Vorab-Analyse:** Der Post verlangt *nicht*, nach
   NEVER/ALWAYS/DO-NOT zu grepen. Seine eigene Diagnose ist schärfer und
   besser prüfbar: **kollidierende Instruktionen** über System-Prompt, Skills
   und CLAUDE.md hinweg. Der neue Audit-Check wird darauf gebaut, mit dem
   Ban-Scan nur als Einstiegsheuristik.
4. Shift 1 ist Ersetzen, nicht bloss Löschen. Wo eine Regel entfällt, tritt
   ein Urteils-Anker an ihre Stelle — das ist der Unterschied zwischen dem
   alten und dem neuen Kommentar-Satz im Post.
5. „Hochwichtig" heisst in diesem Repo: Constraints, die einen realen,
   nachweisbaren Failure-Mode abdecken — Secrets/Daten-Grenze, Git-als-
   Wahrheit, Gate-Bypass-Schutz, keine erfundenen Fakten oder Beweise.
   Diese bleiben unverändert.
6. Das Repo hat keine CLAUDE.md und keine `workflow.config.json`; Defaults
   gelten (`docs/specs`, `docs/plans`, `maxReviewRounds = 5`).

## Befunde und Soll-Zustand

Reichweite laut Gate 1: alle Befunde. Selbstanwendung auf dem Mittelweg —
die Guidance ändern *und* die eigenen Skills dort entschlacken, wo ein Verbot
klar Geschmack ist.

| # | Datei | Befund | Soll |
|---|---|---|---|
| A | `plugins/context-kit/docs/kontext-architektur.md` | § „Was gehört in CLAUDE.md" Punkt 4 schreibt einen Pflicht-Abschnitt „Verbote (Was NICHT tun): kurz, imperativ" vor | Verbote sind kein Pflicht-Abschnitt mehr. Ersetzt durch Urteils-Anker plus die Ausnahme für hochwichtige Bereiche |
| B | `.../skills/projekt-setup/SKILL.md` | Schritt 2 fragt aktiv nach Verboten, Schritt 3 schreibt den Abschnitt in die CLAUDE.md | Interview fragt nach **Gotchas** statt nach Verboten; Verbote nur, wenn der User einen echten Failure-Mode nennt |
| C | `.../skills/kontext-audit/SKILL.md` | kein Check auf Über-Constraining | Neuer Prüfschritt: kollidierende Instruktionen über die Artefakte hinweg finden; Ban-Scan als Einstiegsheuristik; jeder Fund wird klassifiziert (hochwichtig → bleibt, sonst → Urteils-Anker oder weg) |
| D | Doktrin | Auto-Memory kommt nicht vor | CLAUDE.md ist kein Memory-Store; der `#`-Hotkey-Reflex entfällt |
| E | `plugins/feature-workflow/skills/spec-to-implementation/` | Gate 1 erzeugt Prosa-Specs; `references/review-loop.md` ohne Rubric | Rich References zulassen und bevorzugen: Mockup/Test-Suite/Code als Spec-Artefakt; Rubric für den Reviewer |
| F | drei Dateien | Das 5-Zeilen-Status-Format steht wörtlich in `kontext-architektur.md`, `projekt-setup/SKILL.md` und `spec-to-implementation/SKILL.md` | Eine Quelle (Doktrin), die anderen verweisen — Shift 4 und die repo-eigene Regel „Eine Wahrheit, dünne Adapter" |
| G | `templates/skill-vorlage/SKILL.template.md` | transportiert keine der neuen Autoren-Regeln | Neue Regeln aufnehmen: Description als autoritatives Interface, Progressive Disclosure via Datei-Baum, Urteils-Anker statt Regel-Listen, eigene Meinung kodieren |
| H | `kontext-architektur.md` § „Was gehört in CLAUDE.md" | **Gotchas** kommen im Schichten-Modell nicht vor, obwohl der Post ihnen den Grossteil der Tokens zuweist | Gotchas werden der Schwerpunkt-Posten der CLAUDE.md; die übrigen Posten schrumpfen entsprechend |

## Nicht-Ziele

- Keine CLAUDE.md für dieses Repo anlegen (eigener Entscheid, eigener Auftrag).
- Keine inhaltliche Änderung an den Fach-Regeln der dev-toolkit-Skills
  (Accessibility-Schwellen, Dependency-Risikostufen, ADR-Format o.ä.) —
  nur die Form ihrer Leitplanken steht zur Debatte.
- Kein Nachbau von `/doctor`.
- Kein Merge und kein Pull Request; die Arbeit endet mit dem Push auf
  `claude/skills-claude-5-context-b4wfoo`.

## Akzeptanz

- [ ] `kontext-architektur.md` schreibt keinen Pflicht-Abschnitt „Verbote" mehr vor; an seiner Stelle steht eine Urteils-Regel mit der Ausnahme für hochwichtige Bereiche.
- [ ] `kontext-architektur.md` § „Was gehört in CLAUDE.md" führt **Gotchas** als Schwerpunkt-Posten und benennt sie als grössten Token-Anteil.
- [ ] `kontext-architektur.md` hält fest, dass CLAUDE.md kein Memory-Store ist (Auto-Memory).
- [ ] `kontext-architektur.md` benennt Rich References (Code, Test-Suite, Mockup, Rubric) als der Prosa vorzuziehen.
- [ ] Das 5-Zeilen-Status-Format steht in genau **einer** Datei; `projekt-setup/SKILL.md` und `spec-to-implementation/SKILL.md` verweisen darauf, statt es zu wiederholen. Prüfbar per Suche nach dem Format-Literal.
- [ ] `projekt-setup/SKILL.md` fragt im Interview nach Gotchas; „Verbote" sind keine eigene Interview-Frage und kein Pflicht-Abschnitt der erzeugten CLAUDE.md mehr.
- [ ] `kontext-audit/SKILL.md` hat einen Prüfschritt, der kollidierende Instruktionen über CLAUDE.md, AGENTS.md und Skills hinweg findet, jeden Fund klassifiziert und den Ban-Scan als Einstiegsheuristik nennt.
- [ ] `kontext-audit/SKILL.md` prüft, ob lange Skills in einen Datei-Baum aufgeteilt sind (Progressive Disclosure), nicht nur ob sie im Zeilen-Budget liegen.
- [ ] `spec-to-implementation/SKILL.md` erlaubt in Gate 1 Rich References als Spec-Artefakt und nennt die Präferenz für Code-Dateien.
- [ ] `references/review-loop.md` kennt eine Rubric als Reviewer-Input.
- [ ] `templates/skill-vorlage/SKILL.template.md` nennt Description-als-Interface, Progressive Disclosure via Datei-Baum, Urteils-Anker statt Regel-Liste und „eigene Meinung kodieren".
- [ ] Die hochwichtigen Constraints sind wortwörtlich erhalten: Daten-Grenze/Secrets, Git-als-Wahrheit, Gate-Bypass-Schutz, keine erfundenen Fakten/Beweise. Prüfbar per Diff gegen `main`.
- [ ] Jede geänderte Datei nennt die Quelle (Blogpost mit Datum), damit ein späteres Audit die Herkunft der Regel prüfen kann.
- [ ] `tests/validate-feature-workflow.ps1` läuft unverändert grün — oder die Nicht-Ausführbarkeit ist dokumentiert.
- [ ] Alle Änderungen sind auf `claude/skills-claude-5-context-b4wfoo` gepusht; `main` ist unberührt.
