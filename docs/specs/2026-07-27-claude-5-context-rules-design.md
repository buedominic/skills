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
   gelten (`docs/specs`, `docs/plans`). `maxReviewRounds` wurde für die
   Spec-Review auf User-Entscheid vom Default 5 angehoben — die Schleife
   läuft, bis eine Runde ohne Edits durchgeht.
7. **Plugin-Isolation ist bindend.** `install.sh` kopiert jeden Skill
   selbsttragend (Plugin-`docs/` wandern in die `references/` des Skills),
   und `projekt-setup` warnt ausdrücklich: „Plugins sind einzeln gecacht —
   verlasse dich nicht auf Dateien eines anderen Plugins." Dedup nach Shift 4
   ist deshalb nur **innerhalb** eines Plugins zulässig. Ein Verweis von
   `feature-workflow` auf `context-kit` wäre ein Portabilitäts-Bruch.
8. Der Post wertet Skills auf, die *eigene* Meinungen und Domänen-Praxis
   kodieren. Fachliche Leitplanken sind damit kein Über-Constraining, auch
   wenn sie negativ formuliert sind — der Test ist nicht die Grammatik,
   sondern ob ein realer Failure-Mode dahintersteht.

## Befunde und Soll-Zustand

Reichweite laut Gate 1: alle Befunde. Selbstanwendung auf dem Mittelweg —
die Guidance ändern *und* die eigenen Skills dort entschlacken, wo ein Verbot
klar Geschmack ist.

| # | Datei | Befund | Soll |
|---|---|---|---|
| A | `plugins/context-kit/docs/kontext-architektur.md`, **zwei Stellen** | § „Was gehört in CLAUDE.md" Punkt 4 schreibt einen Pflicht-Abschnitt „Verbote (Was NICHT tun): kurz, imperativ" vor — und die Schichten-Tabelle listet „Verbote" zusätzlich als CLAUDE.md-Inhalt (Zeile 11). In Runde 9 per Grep gefunden; nur eine der beiden zu ändern würde die Doktrin in sich widersprüchlich machen | Beide Stellen. Verbote sind kein Pflicht-Abschnitt mehr; ersetzt durch Urteils-Anker plus die Ausnahme für hochwichtige Bereiche. Die Tabellenzeile führt stattdessen die Gotchas (Befund H) |
| B | `.../skills/projekt-setup/SKILL.md` | Schritt 2 fragt aktiv nach Verboten, Schritt 3 schreibt den Abschnitt in die CLAUDE.md | Interview fragt nach **Gotchas** statt nach Verboten; Verbote nur, wenn der User einen echten Failure-Mode nennt |
| C | `.../skills/kontext-audit/SKILL.md` | kein Check auf Über-Constraining | Neuer Prüfschritt: kollidierende Instruktionen über die Artefakte hinweg finden; Ban-Scan als Einstiegsheuristik; jeder Fund wird klassifiziert (hochwichtig → bleibt, sonst → Urteils-Anker oder weg) |
| D | Doktrin | Auto-Memory kommt nicht vor | CLAUDE.md ist kein Memory-Store; der `#`-Hotkey-Reflex entfällt |
| E | `plugins/feature-workflow/skills/spec-to-implementation/` | Gate 1 erzeugt Prosa-Specs; `references/review-loop.md` ohne Rubric | Rich References zulassen und bevorzugen: Mockup/Test-Suite/Code als Spec-Artefakt; Rubric für den Reviewer |
| F | zwei Dateien | Das 5-Zeilen-Status-Format steht wörtlich in `kontext-architektur.md` und `spec-to-implementation/SKILL.md`. **Korrigiert in Runde 8:** die Ist-Analyse hatte drei Fundstellen behauptet — `projekt-setup/SKILL.md` verweist aber nur auf das Format, ohne es zu kopieren. Der context-kit-Teil dieses Befunds ist damit gegenstandslos | Es bleibt genau die Cross-Plugin-Kopie, die nach Annahme 7 bleiben **muss**. Zu tun ist nur noch die Markierung: die Doktrin als Quelle kennzeichnen, die Kopie in `spec-to-implementation` als bewusste Plugin-Isolations-Ausnahme — damit `/kontext-audit` sie nicht als Drift meldet. Keine Dedup |
| G | `templates/skill-vorlage/SKILL.template.md` | transportiert keine der neuen Autoren-Regeln | Neue Regeln aufnehmen: Description als autoritatives Interface, Progressive Disclosure via Datei-Baum, Urteils-Anker statt Regel-Listen, eigene Meinung kodieren |
| H | `kontext-architektur.md` § „Was gehört in CLAUDE.md" | **Gotchas** kommen im Schichten-Modell nicht vor, obwohl der Post ihnen den Grossteil der Tokens zuweist | Gotchas werden der Schwerpunkt-Posten der CLAUDE.md; die übrigen Posten schrumpfen entsprechend |
| I | `templates/skill-vorlage/`, `references/review-loop.md` | Shift 2 (Interface Design) ist nirgends benannt, obwohl das Repo ihn stellenweise schon erfüllt (Finding-Vertrag mit `severity`-Enum, `mode`/`environment`-Enums im Manifest) | Das Prinzip explizit machen: die `description` ist das Interface eines Skills, Enums und Verträge tragen die Bedienung. Bestehende gute Stellen bleiben, die Vorlage benennt die Regel |
| J | `plugins/dev-toolkit/skills/*/SKILL.md` (6 Skills) | Gate 1 hat die Selbstanwendung auf dem Mittelweg entschieden, aber kein Befund deckt dev-toolkit ab | Ein dokumentierter Durchgang durch alle „Leitplanken"-Abschnitte: pro Regel entscheiden, ob ein realer Failure-Mode dahintersteht (bleibt), ob es kodierte Domänen-Meinung ist (bleibt — der Post wertet das auf) oder blosser Geschmack (wird Urteils-Anker oder entfällt). Das Ergebnis wird festgehalten, auch wenn es „nichts zu streichen" lautet |
| K | `kontext-audit/SKILL.md`, Budget-Tabelle | Die Tabelle führt „**immer geladene** Skill-Prompts (`SKILL.md`)" — faktisch falsch. Der Body einer `SKILL.md` lädt beim Trigger, nicht in jeder Session; immer geladen ist nur die `description`. Die Doktrin hat es richtig (Schicht 3: „erst beim Stufen-Eintritt"). Ein gedrifteter Fakt in genau dem Skill, der gedriftete Fakten finden soll — und die Begründung, auf die sich das Zeilen-Budget dieser Spec stützt | Zeile korrigieren: `SKILL.md`-Body lädt beim Trigger. Das Budget bleibt (ein getriggerter Skill flutet den Kontext trotzdem), aber mit richtiger Begründung. Zusätzlich die `description` als eigene Budget-Zeile aufnehmen — sie ist das einzige wirklich immer geladene Stück und hat bisher gar kein Budget |
| L | `kontext-audit/SKILL.md` | Der Post nennt `/doctor` als das eingebaute Werkzeug, das Skills und CLAUDE.md automatisch rightsized — also dieselbe Aufgabe wie dieser Skill. `kontext-audit` erwähnt es nicht | Eine verfügbarkeits-neutrale Zeile aufnehmen („falls die Runtime `/doctor` anbietet, …"), wie die Doktrin es für Tool-Verweise ohnehin vorschreibt. Der Skill bleibt eigenständig — er deckt Drift, Duplikate und Archiv-Mechanik ab, die `/doctor` nicht kennt |

## Nicht-Ziele

- Keine CLAUDE.md für dieses Repo anlegen (eigener Entscheid, eigener Auftrag).
- Keine inhaltliche Änderung an den Fach-Regeln der dev-toolkit-Skills
  (Accessibility-Schwellen, Dependency-Risikostufen, ADR-Format o.ä.).
  Befund J prüft die **Form** der Leitplanken, nicht ihren Fachgehalt.
- Kein Split von `references/smoke-gate.md` (172 Zeilen). Begründung über
  die repo-eigene Kernregel **Kosten ∝ Ladehäufigkeit**, nicht über
  „immer vs. nie geladen" — Befund K zeigt, dass diese Grenze so nicht
  existiert. Der Body einer `SKILL.md` lädt bei *jedem* Aufruf des Skills
  und trägt deshalb ein Budget; `smoke-gate.md` lädt in Stufe 7 eines
  vollen Durchlaufs, also um Grössenordnungen seltener, und ist an dieser
  Stelle selbst der Arbeitsgegenstand. Es bleibt bei der Ablehnung, aber
  mit tragfähiger Begründung.
- Kein Nachbau von `/doctor`.
- Kein Merge und kein Pull Request; die Arbeit endet mit dem Push auf
  `claude/skills-claude-5-context-b4wfoo`.

## Akzeptanz

- [ ] `kontext-architektur.md` schreibt an **beiden** Fundstellen keinen Pflicht-Posten „Verbote" mehr vor (Punkt 4 und die Schichten-Tabelle); an seiner Stelle steht eine Urteils-Regel mit der Ausnahme für hochwichtige Bereiche. Prüfbar: kein Vorkommen von „Verbote" als Pflicht-Posten.
- [ ] `kontext-architektur.md` § „Was gehört in CLAUDE.md" führt **Gotchas** als Schwerpunkt-Posten und benennt sie als grössten Token-Anteil.
- [ ] `kontext-architektur.md` hält fest, dass CLAUDE.md kein Memory-Store ist (Auto-Memory).
- [ ] `kontext-architektur.md` benennt Rich References (Code, Test-Suite, Mockup, Rubric) als der Prosa vorzuziehen.
- [ ] Das Format-Literal kommt im Repo genau **zweimal** vor (Doktrin + `spec-to-implementation`, Stand heute unverändert). Die Doktrin ist als Quelle gekennzeichnet, die Kopie in `spec-to-implementation` als bewusste Plugin-Isolations-Ausnahme — beides prüfbar per Grep. `projekt-setup` verweist weiterhin nur und bekommt keine Kopie.
- [ ] `projekt-setup/SKILL.md` fragt im Interview nach Gotchas; „Verbote" sind keine eigene Interview-Frage und kein Pflicht-Abschnitt der erzeugten CLAUDE.md mehr.
- [ ] `kontext-audit/SKILL.md` hat einen Prüfschritt, der kollidierende Instruktionen über CLAUDE.md, AGENTS.md und Skills hinweg findet, jeden Fund klassifiziert und den Ban-Scan als Einstiegsheuristik nennt.
- [ ] `kontext-audit/SKILL.md` prüft, ob lange Skills in einen Datei-Baum aufgeteilt sind (Progressive Disclosure), nicht nur ob sie im Zeilen-Budget liegen.
- [ ] `spec-to-implementation/SKILL.md` erlaubt in Gate 1 Rich References als Spec-Artefakt und nennt die Präferenz für Code-Dateien.
- [ ] `references/review-loop.md` kennt eine Rubric als Reviewer-Input und benennt den Finding-Vertrag mit seinem `severity`-Enum als das Interface, das die Bedienung trägt (Befund I).
- [ ] `kontext-audit/SKILL.md` behauptet nicht mehr, `SKILL.md`-Bodies seien immer geladen; die `description` hat eine eigene Budget-Zeile (Befund K).
- [ ] `kontext-audit/SKILL.md` weist in einer Zeile auf `/doctor` hin, verfügbarkeits-neutral formuliert (Befund L).
- [ ] `templates/skill-vorlage/SKILL.template.md` nennt vier Dinge: die `description` als autoritatives Interface des Skills (mit Enums/Verträgen als Trägern der Bedienung, Shift 2), Progressive Disclosure via Datei-Baum, Urteils-Anker statt Regel-Liste, und „eigene Meinung kodieren".
- [ ] Befund J ist abgearbeitet: für jede „Leitplanke" der sechs dev-toolkit-Skills liegt ein Entscheid vor (realer Failure-Mode / kodierte Domänen-Meinung / Geschmack), und die Geschmacks-Fälle sind umgeschrieben oder entfernt. Das Ergebnis steht im Plan, auch wenn nichts gestrichen wurde.

### Budget — die Änderung muss selbst dem Post folgen

- [ ] **Zeilen-Bilanz wird ausgewiesen** (vorher/nachher pro Datei) und jede Netto-Vergrösserung ist mit dem Failure-Mode begründet, den sie adressiert. Harte Grenze ist das bereits geltende Budget — Orchestrator-Kern ~150–200 Zeilen je `SKILL.md` — nicht eine neu erfundene Null-Bilanz. Die Begründung des Budgets wird dabei mit Befund K geradegezogen: sie trägt, weil ein getriggerter Skill den Kontext flutet, nicht weil er „immer geladen" wäre. Eine starre „darf nicht wachsen"-Regel wäre selbst die Sorte Constraint, die dieser Post streicht.
- [ ] Kein Artefakt trägt eine Quellen-/Changelog-Zeile zum Blogpost. Provenienz steht in dieser Spec und in der Git-Historie — eine Quellenzeile pro Datei wäre genau der Token-Ballast, den der Post streicht. Einzige Ausnahme: die Doktrin `kontext-architektur.md` darf die Herkunft in einer Zeile nennen.

### Regression — was nicht kaputtgehen darf

- [ ] Diese Anker sind wortwörtlich erhalten (prüfbar per Grep): `Daten-Grenze` und `git ls-files --error-unmatch` in `spec-to-implementation`; `Git ist die Wahrheit`; der Gate-2-Passus `approvedAt` gesetzt + sauberer Worktree; `Keine erfundenen Beweise` in `landing-page`; `Keine PII/Secrets` in `bug-triage` und `web-audit`; `.env`/Secrets-Verbote in beiden context-kit-Skills.
- [ ] Das Frontmatter aller **neun** `SKILL.md` bleibt gültig (`name:` + nichtleere `description:`) — genau das prüft `validate-feature-workflow.ps1`, und Befund E fasst diese Datei an.
- [ ] `spec-to-implementation/SKILL.md` verweist weiterhin auf `references/codex-runtime.md` (zweite Assertion desselben Tests).
- [ ] Ein portabler Check (`tests/`, ohne PowerShell lauffähig) verifiziert die maschinell prüfbaren Kriterien dieser Liste: Anker-Grep, Frontmatter, Status-Format-Vorkommen. Die Zeilen-Bilanz gibt er als Zahl aus, ohne sie zu erzwingen — die Bewertung bleibt menschlich.
- [ ] `tests/validate-feature-workflow.ps1` läuft grün — oder die fehlende `pwsh`-Installation ist als Umgebungsgrenze dokumentiert und der portable Check deckt seine beiden Assertions mit ab.
- [ ] Alle Änderungen sind auf `claude/skills-claude-5-context-b4wfoo` gepusht; `main` ist unberührt.

## Review-Notizen

**Runde 1** (Reviewer: `orchestrator`, adversarialer Pass) — 8 Findings,
7 angewendet:

- *CRITICAL* Befund F verlangte einen Cross-Plugin-Verweis und hätte die
  Plugin-Isolation gebrochen → F umformuliert, Annahme 7 ergänzt.
- *CRITICAL* Alle Befunde fügten nur Text hinzu → Budget-Sektion mit
  Netto-Zeilen-Bilanz ergänzt.
- *CRITICAL* Der Gate-1-Entscheid „Mittelweg" war für dev-toolkit nicht
  operationalisiert → Befund J ergänzt.
- *IMPORTANT* Das Kriterium „jede Datei nennt die Quelle" war nach diesem
  Post selbst ein Anti-Pattern → gestrichen, durch das Gegenteil ersetzt.
- *IMPORTANT* Shift 2 hatte keinen Befund → Befund I ergänzt.
- *IMPORTANT* Die Akzeptanz stützte sich auf einen Test, der hier nicht
  läuft und nichts zur Sache sagt → Regression-Sektion mit portablem Check.
- *MINOR* „Prüfbar per Diff gegen main" benannte keine Anker → Anker-Liste.

**Runde 2** (Reviewer: `orchestrator`) — 2 Findings, beide angewendet.
Beides Folgefehler der Runde-1-Korrekturen:

- *CRITICAL* Das Akzeptanz-Kriterium „Status-Format steht in genau einer
  Datei" widersprach dem in Runde 1 reparierten Befund F, der
  `spec-to-implementation` seine Kopie ausdrücklich belässt → auf „genau
  zwei Vorkommen, eines markiert" korrigiert.
- *IMPORTANT* Die neu eingeführte Netto-Null-Zeilenbilanz war selbst eine
  starre Regel der Sorte, die dieser Post streicht → ersetzt durch
  „Bilanz ausweisen und Wachstum begründen", hart begrenzt durch das
  bereits bestehende Budget der Doktrin.

**Runde 3** (Reviewer: `orchestrator`) — 2 MINOR-Findings, beide angewendet:

- Die Akzeptanzliste enthielt zwei Kriterien für `skill-vorlage`, die
  einander überlappten — ein Duplikat in der Spec, die Duplikate abschafft
  → zu einem Kriterium zusammengezogen.
- Das Kriterium zum portablen Check verlangte weiterhin eine
  „Netto-Zeilen-Bilanz", obwohl Runde 2 die Null-Bilanz verworfen hatte
  → der Check gibt die Zahl aus, erzwingt sie nicht.

**Korrektur am Protokoll.** Der ursprüngliche Eintrag „Runde 4 —
`NO_FINDINGS`, Clean-Pass" wurde im selben Edit geschrieben, in dem die
Runde-3-Fixes eingearbeitet wurden. Diese Runde 4 hat nie stattgefunden.
Die Schleifen-Mechanik schliesst genau das aus: *„Hat die letzte Runde noch
editiert, gibt es keinen bestätigten Clean-Pass."* Der Eintrag war falsch
und ist durch das tatsächliche Ergebnis unten ersetzt.

**Runde 4** (Reviewer: `orchestrator`, tatsächlich ausgeführt) —
2 Findings, beide angewendet:

- *IMPORTANT* Die Budget-Tabelle in `kontext-audit` behauptet „immer
  geladene Skill-Prompts (`SKILL.md`)". Das ist falsch — Bodies laden beim
  Trigger, immer geladen ist nur die `description`. Ein gedrifteter Fakt
  in dem Skill, der gedriftete Fakten finden soll, und zugleich die
  Begründung, auf die sich das Zeilen-Budget dieser Spec stützt
  → Befund K ergänzt.
- *MINOR* Befund I verlangt für `review-loop.md`, das Interface-Prinzip zu
  benennen, hatte dafür aber kein Akzeptanz-Kriterium → ergänzt.

**Runde 5** (Reviewer: `orchestrator`) — 2 Findings, beide angewendet:

- *IMPORTANT* Befund K macht die Ablehnung des `smoke-gate.md`-Splits
  unhaltbar: sie stützte sich auf „immer geladen vs. bedarfsgeladen", eine
  Grenze, die es so nicht gibt. Die Ablehnung bleibt, ist aber auf die
  repo-eigene Regel *Kosten ∝ Ladehäufigkeit* umgestellt.
- *MINOR* Befund K war zwischen I und J einsortiert → Reihenfolge korrigiert.

**Cap erreicht** (`maxReviewRounds = 5`) ohne bestätigten Clean-Pass →
eskaliert. **User-Entscheid: Cap anheben und durchlaufen lassen**, bis eine
Runde ohne Edits durchgeht.

**Runde 6** (Reviewer: `orchestrator`) — 3 Findings, alle angewendet:

- *MINOR* Annahme 6 nannte weiterhin `maxReviewRounds = 5` als geltend,
  obwohl der Cap gerade angehoben worden war → aktualisiert.
- *MINOR* Der Post nennt `/doctor` als das eingebaute Werkzeug für
  dieselbe Aufgabe, die `kontext-audit` macht; der Skill verschweigt es
  → Befund L ergänzt (verfügbarkeits-neutrale Zeile, kein Nachbau).
- *MINOR* Befund L wurde beim Einfügen erneut vor K einsortiert — derselbe
  Reihenfolge-Fehler wie in Runde 5 → sofort korrigiert, Reihenfolge ist
  jetzt A–L.

**Runde 7** (Reviewer: `orchestrator`) — 2 Findings, beide angewendet:

- *MINOR* Die Regression-Liste sprach von „acht `SKILL.md`". Es sind
  **neun** (2 context-kit + 6 dev-toolkit + 1 feature-workflow) → in Spec
  und Plan-Phase 01 korrigiert. Ein Zählfehler in einem Kriterium, das ein
  automatischer Check auswertet, hätte den Check gegen die falsche Menge
  laufen lassen.
- *MINOR* Das Akzeptanz-Kriterium zu Befund L wiederholte die Begründung
  aus der Befund-Tabelle — Shift-4-Verstoss in der Spec selbst → auf die
  prüfbare Aussage gekürzt.

**Runde 8** (Reviewer: `orchestrator`, Konsistenz-Sweep per Grep über
Reihenfolge, Zählungen und Fundstellen) — 1 Finding, angewendet:

- *CRITICAL* **Befund F beruhte auf einer ungeprüften Behauptung.** Die
  Ist-Analyse nannte drei Fundstellen des Status-Formats; der Grep findet
  zwei. `projekt-setup/SKILL.md` verweist nur auf das Format, ohne es zu
  kopieren. Damit ist der context-kit-Teil von F gegenstandslos, und die
  einzige verbliebene Duplikation ist genau die Cross-Plugin-Kopie, die
  nach Annahme 7 bleiben muss. F reduziert sich auf die Markierung; Spec,
  Akzeptanz-Kriterium und Plan-Phase 03 entsprechend korrigiert.

Lehre für die Umsetzung: jede Fundstellen-Behauptung dieser Spec vor dem
Editieren per Grep verifizieren, nicht aus der Analyse übernehmen.

**Runde 9** (Reviewer: `orchestrator`) — die Lehre aus Runde 8 systematisch
angewendet: sämtliche Prämissen aller zwölf Befunde per Grep geprüft.
Bestätigt wurden B, C, D, E, G, H, I, J, K, L (Abwesenheiten wie
Vorkommen). 1 Finding, angewendet:

- *IMPORTANT* **Befund A war unvollständig.** „Verbote" steht in der
  Doktrin an zwei Stellen: Punkt 4 des CLAUDE.md-Abschnitts *und* die
  Schichten-Tabelle, die „Verbote" als CLAUDE.md-Inhalt führt. Nur eine zu
  ändern hätte die Doktrin in sich widersprüchlich gemacht — genau die
  kollidierenden Instruktionen, die Befund C künftig finden soll. Spec,
  Akzeptanz-Kriterium und Plan-Phase 02 decken jetzt beide Stellen ab.

**Runde 10** (Reviewer: `orchestrator`) — **`NO_FINDINGS`**, bestätigter
Clean-Pass. Keine inhaltliche Änderung in dieser Runde; nur dieser
Protokoll-Eintrag. Geprüft wurde:

- Befund-Reihenfolge A–L lückenlos.
- 22 Akzeptanz-Kriterien, keine Dubletten.
- Keine Verweise auf nicht existierende Dateien (`workflow.config.json`
  wird korrekt als *abwesend* geführt, siehe Annahme 6).
- Alle zehn Anker der Regression-Liste existieren wortwörtlich im Repo —
  einzeln per `grep -F` verifiziert, nicht behauptet.
- Die verbliebenen „drei Fundstellen"-Stellen sind bewusste historische
  Verweise auf die in Runde 8 korrigierte Fehlannahme.

**Stufe 2 abgeschlossen** nach 10 Runden (Cap auf User-Entscheid angehoben).
Bewusst abgelehnt bleibt einzig der Split von `references/smoke-gate.md`.

**Bewusst abgelehnt:** Split von `references/smoke-gate.md` (172 Zeilen).
Die Datei ist bereits das Ergebnis eines Splits und wird bedarfsgeladen —
der Post kritisiert lange *immer* geladene Kontexte. Als Nicht-Ziel notiert.
