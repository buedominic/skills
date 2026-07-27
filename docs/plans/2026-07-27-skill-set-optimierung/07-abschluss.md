# 07 — Abschluss

Die Phase, in der der Regressions-Nachweis tatsächlich geführt wird — er
ist Akzeptanz-Kriterium, und die Testsuite trägt ihn ausdrücklich **nicht**.

## Schritte

- [ ] **Diff-Durchgang je geänderter Datei.** Aus den Protokoll-Zeilen der
      Phase 05 plus dem Diff je Datei eine Zeile: was war rein formal
      (Frontmatter, Description, Verweis), welche Leitplanke wurde
      umformuliert, und die ausdrückliche Feststellung, dass keine mit
      realem Failure-Mode entfallen ist. Das Protokoll kommt in diese Datei
      unter „Ergebnis".

      **Der Diff muss auf die Artefakte eingeschränkt werden:**

      ```
      git diff main...HEAD -- plugins/ templates/ install.sh docs/portabilitaet.md
      ```

      Ohne die Pfad-Grenze zieht `main...HEAD` Spec und Plan mit herein —
      die liegen in diesem Lauf auf demselben Branch (Abweichung im
      Manifest). Der Nachweis liefe dann über neue Doku statt über die
      Skills und wäre wertlos.
- [ ] **Anlass-Gegenprobe (aus Phase 03).** Die vier gekürzten
      Descriptions gegen ihre Ursprungsfassung halten: ist jeder
      *unterscheidbare* Anlass erhalten? Gestrichen werden durften
      Synonyme und Body-Inhalt — kein Anlass.
- [ ] **Versionen erhöhen:** alle drei `plugin.json` (heute `dev-toolkit`
      1.0.1, `context-kit` 1.1.0, `feature-workflow` 1.4.0). `context-kit`
      bekommt einen Minor (neuer Router-Skill), die beiden anderen
      ebenfalls Minor — die Invocation-Achse ändert das Verhalten
      gegenüber dem Nutzer, das ist kein Patch.
- [ ] **`marketplace.json`:** Version erhöhen, `context-kit`-Beschreibung
      um den Router ergänzen.
- [ ] **`README.md`:** Plugin-Tabelle auf den neuen Stand, Router
      aufgenommen, Adapter-Verweis aus Phase 04 gesetzt. Der Abschnitt
      „Neuen Skill hinzufügen" (`:145-151`) nennt die Invocation-Wahl als
      Schritt.
- [ ] **Volle Verifikation:** `node tests/validate-context-doctrine.mjs`
      vollständig grün — die 44 Baseline-Assertions **und** die neuen
      Gruppen `F`, `G` sowie die Erweiterungen in `B` und `C`. Die
      Zeilen-Bilanz am Ende der Ausgabe wird mit der Ausgangslage
      verglichen und in dieser Datei festgehalten.
- [ ] **Manifest schliessen:** `stage`, `stageStatus`, `verification` mit
      den echten Zahlen. Der offene Punkt zur Runtime-Wirksamkeit bleibt
      unter `openPoints` **stehen** — er ist in diesem Repo nicht
      abschliessbar.
- [ ] **Abschluss-Bericht:** was geändert wurde, die Grundlast vorher/
      nachher mit echter Zahl, was bewusst nicht angefasst wurde, und der
      offene Punkt als solcher benannt.

## Was hier nicht passiert

Kein Merge nach `main`. Die Session-Vorgabe bindet diesen Lauf an
`claude/skills-optimization-spec-i2hiix`; der Merge ist deine
Entscheidung und braucht die separate Bestätigung aus Stufe 8 der
Pipeline. Ein Pull Request entsteht nur auf ausdrücklichen Auftrag.

## Ergebnis

_(wird beim Ausführen gefüllt: Diff-Protokoll, Grundlast vorher/nachher,
Zeilen-Bilanz, Testergebnis)_
