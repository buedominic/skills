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

### Grundlast

**3.341 → 990 Zeichen (−70 %)** je Session, je Projekt.

| | Vorher | Nachher |
|---|---|---|
| geladene Descriptions | 9 Skills, 3.341 Z. | 4 Skills, 990 Z. |
| user-invoked | – | 6 (fünf plus Kompass), 0 Z. geladen |

### Diff-Protokoll (Regressions-Nachweis)

Basis ist **`origin/main` (053dc7d)**, nicht der lokale `main`-Ref — der war
vier Commits veraltet und hätte PR #3 als Teil dieses Laufs ausgewiesen.
Pfad-eingeschränkt auf die Artefakte: **14 Dateien, +273/−62.**

Entfernte Zeilen mit Steuerungs-Charakter: **12, alle zugeordnet.**

| Zeilen | Was | Beleg |
|---|---|---|
| 2 | Blockzitat-Reste der Doktrin-Kurzfassungen | Inhalt in `kontext-architektur.md` verifiziert (Phase 02) |
| 8 | positiv gedrehte Leitplanken | Protokoll in `05-vorlage-und-negation.md` |
| 2 | aufgelöstes Duplikat `dependency-audit` | Regel bleibt in der Tabelle |

**Null unzugeordnete Entfernungen.** Keine Leitplanke mit realem
Failure-Mode ist entfallen: die Anker `A6`–`A10` prüfen fünf davon als
exakten String und blieben durchgehend grün.

### Verifikation

`node tests/validate-context-doctrine.mjs` — **64/64 grün** (44 Baseline
plus 20 neue). `bash -n install.sh` sauber, Trockenläufe für Cursor und
AGENTS.md geprüft. `tests/validate-feature-workflow.ps1` blieb ungeprüft:
kein `pwsh` im Container.

### Zeilen-Bilanz

| Datei | Vorher | Nachher |
|---|---|---|
| `kontext-architektur.md` | 93 | 93 |
| `kontext-audit/SKILL.md` | 117 | 113 |
| `projekt-setup/SKILL.md` | 116 | 109 |
| `spec-to-implementation/SKILL.md` | 199 | **200** |
| `review-loop.md` | 91 | 91 |
| `SKILL.template.md` | 78 | 104 |
| Summe | 694 | 710 |

**`spec-to-implementation` steht jetzt exakt auf dem `C16`-Cap von 200** —
das Frontmatter-Feld hat die letzte freie Zeile verbraucht. Die nächste
Ergänzung dort erzwingt eine Auslagerung nach `references/`. Das ist der
Zweck des Caps, aber es ist ab sofort scharf.

Die Vorlage wuchs um 26 Zeilen (Invocation-Achse). Sie wird kopiert, nicht
geladen — Wachstum kostet dort nichts.

### Versionen

`context-kit` 1.0.1 → 1.2.0 · `dev-toolkit` 1.1.0 → 1.2.0 ·
`feature-workflow` 1.4.0 → 1.5.0 · Marketplace 0.5.5 → 0.6.0. Minor
durchgehend: die Achse ändert das Verhalten gegenüber dem Nutzer.

### Offen geblieben

Ob `disable-model-invocation` in der Runtime wirkt, ist hier **nicht
belegbar** — dieses Repo ist die Quelle der Plugins, nicht ihr
Installationsziel. Der Beleg gehört in die erste Session eines
Zielprojekts mit installiertem Marketplace. Steht im Manifest unter
`openPoints`.
