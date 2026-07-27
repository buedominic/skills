# Phase 04 — feature-workflow

Befunde E, F (Markierung), I. Diese Phase muss **netto kürzen**:
`spec-to-implementation/SKILL.md` liegt mit 256 Zeilen über dem Budget der
eigenen Doktrin (~150–200) und finanziert damit die Ergänzungen der
Phasen 02/03.

## `spec-to-implementation/SKILL.md` (Start: 256 Zeilen)

- [ ] **Befund E — Rich References in Gate 1.** Der Spec-Artefakt-Absatz
      erlaubt heute nur Markdown mit `## Annahmen` + `## Akzeptanz`.
      Ergänzen: wo ein reicheres Artefakt existiert, ist es vorzuziehen —
      HTML-Mockup statt Design-Beschreibung, Test-Suite statt Beschreibung
      des erwarteten Outputs, eine zu portierende Funktion statt ihrer
      Prosa-Erklärung. Das Markdown-Dokument bleibt der Träger für
      Annahmen und Akzeptanz und verweist auf die reicheren Artefakte.
- [ ] **Befund F — Markierung.** Das Status-Format bleibt hier (Plugin-
      Isolation, Annahme 7 der Spec), bekommt aber eine Ein-Zeilen-Notiz:
      bewusste Kopie über Plugin-Grenzen, Quelle ist die context-kit-Doktrin.
      Damit meldet `/kontext-audit` sie nicht erneut.
- [ ] **Kürzen — der eigentliche Auftrag dieser Phase.** Kandidaten, in
      dieser Reihenfolge:
      - § „Kontext-Disziplin" (28 Zeilen) und § „Grundsätze" (20 Zeilen)
        überschneiden sich teilweise; zusammenziehen ohne Substanzverlust.
      - § „Drei Weichen" plus der Modell-Wahl-Absatz (20 Zeilen) — die
        Tabelle trägt die Bedienung bereits (Shift 2: Enums statt Prosa),
        der erklärende Fliesstext darüber ist gegenfinanzierbar.
      - § „Fehlerverhalten" (15 Zeilen) — jede Zeile prüfen, ob sie einen
        realen Failure-Mode adressiert oder nur Selbstverständliches sagt.
      - Wiederholungen zwischen `SKILL.md` und den `references/` streichen;
        die Referenz ist die autoritative Stelle (Shift 4).
- [ ] **Unantastbar:** Grundsatz 1 (Git ist die Wahrheit), Grundsatz 5
      (Daten-Grenze mit `git ls-files --error-unmatch`), der
      Gate-2-Approval-Passus mit `approvedAt`, der `codex-runtime`-Verweis.
      Der Check aus Phase 01 hält das fest.
- [ ] Ziel: ≤ 200 Zeilen, ohne dass ein Akzeptanz-Kriterium der Spec fällt.

## `references/review-loop.md` (Start: 81 Zeilen)

- [ ] **Befund E — Rubric.** Der Review-Vertrag kennt heute nur
      `severity`/`stelle`/`problem`/`empfehlung`. Ergänzen: liegt für die
      Domäne eine Rubric vor (strukturierte Beschreibung dessen, was „gut"
      heisst), wird sie dem Reviewer als zusätzlicher `contextPath`
      mitgegeben und er bewertet dagegen. Der Post nennt genau das als
      Weg, Geschmack überprüfbar zu machen.
- [ ] **Befund I — Interface Design benennen.** Der Finding-Vertrag mit
      seinem `severity`-Enum ist bereits ein gutes Interface. Das in einem
      Halbsatz explizit machen, damit die Regel beim nächsten Umbau nicht
      versehentlich durch Prosa-Beispiele ersetzt wird.
- [ ] Die Rubric muss durch den Allowlist-Check (Daten-Grenze) — sie ist
      ein `contextPath` wie jeder andere.

## Abnahme

- [ ] Gate 1 erlaubt Rich References und nennt die Präferenz für Code.
- [ ] `review-loop.md` kennt die Rubric als Reviewer-Input.
- [ ] `spec-to-implementation/SKILL.md` ≤ 200 Zeilen.
- [ ] Alle Anker-Assertions des Checks grün; Status-Format markiert.
