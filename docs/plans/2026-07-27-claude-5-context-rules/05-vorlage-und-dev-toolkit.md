# Phase 05 — Skill-Vorlage und dev-toolkit-Durchgang

Befunde G, I (Vorlagen-Teil), J.

## `templates/skill-vorlage/SKILL.template.md` (Start: 29 Zeilen)

Die Vorlage ist der Ort, an dem die neuen Regeln in jeden künftigen Skill
dieses Repos einwandern. Sie darf dabei nicht zur Regel-Liste werden — das
wäre genau der Fehler, den sie verhindern soll.

- [ ] **Description als Interface** (Befund G, und der Vorlagen-Teil von
      Befund I). Der bestehende Hinweis
      („das `description`-Feld ist das Wichtigste") wird präzisiert: die
      Description ist die *autoritative* Stelle für die Bedienung, nicht
      eine Zusammenfassung des Bodys. Enums und Verträge tragen die
      Bedienung besser als Beispiele — Post-Beispiel ist das Todo-Tool,
      dessen Status-Enum die Nutzung schon erklärt.
- [ ] **Progressive Disclosure via Datei-Baum.** Der bestehende Satz über
      „zusätzliche Dateien im selben Ordner" wird zur Regel: wird der Skill
      lang, ist die Antwort ein Baum aus `references/`, die beim Eintritt
      in die jeweilige Stufe gelesen werden — nicht ein längeres SKILL.md.
- [ ] **Urteils-Anker statt Regel-Liste.** Kurzer Abschnitt mit dem
      Vorher/Nachher-Paar aus dem Post als einzigem Beispiel. Ein Verbot
      gehört nur hinein, wenn ein realer Failure-Mode dahintersteht.
- [ ] **Eigene Meinung kodieren.** Der Post nennt das den wertvollsten
      Inhalt eines Skills: Wissen und Praxis, die spezifisch für dich, dein
      Team oder dein Produkt sind. Das gehört als Leitfrage in die Vorlage —
      sie ersetzt den generischen „Tipps zum Generalisieren"-Abschnitt
      teilweise.
- [ ] Budget: Die Vorlage darf wachsen (29 Zeilen sind wenig), aber sie
      muss selbst vorbildlich sein — keine Regel-Kaskade.

## dev-toolkit — Leitplanken-Durchgang (Befund J)

Sechs Skills, je genau ein `## Leitplanken`-Abschnitt (per Grep bestätigt).
Pro Regel ein Entscheid nach der Klassifikation der Spec. **Erwartung nach
Vorprüfung: der Grossteil bleibt** — die meisten dieser Regeln sind
entweder harte Constraints oder kodierte Domänen-Meinung, die der Post
ausdrücklich aufwertet. Der Durchgang wird trotzdem vollständig
dokumentiert, damit das Ergebnis nachvollziehbar ist und nicht als
„übersehen" gelesen wird.

- [ ] `adr` — append-only, ein ADR pro Entscheid, verworfene Optionen mit
      Grund, Konflikt mit CLAUDE.md nachziehen.
- [ ] `bug-triage` — kein Fix während der Triage, Repro schlägt Theorie,
      keine PII/Secrets, Symptom ≠ Ursache.
- [ ] `dependency-audit` — kein Major ohne Changelog, keine neuen Pakete,
      kein `--force`, Registry-Skripte nicht blind ausführen.
- [ ] `landing-page` — keine erfundenen Beweise, keine Dark Patterns, ein
      primäres Ziel pro Seite, Copy-Entscheide gehören dem User.
- [ ] `prior-art-check` — keine Behauptung ohne Quelle, kein
      Dependency-Vorschlag ohne Lizenz-/Wartungs-Check, Zeitbudget, der
      Check entscheidet nicht.
- [ ] `web-audit` — keine Behauptung ohne Fundstelle, kein Design-Umbau
      unter A11y-Deckmantel, Alt-Text-Praxis, keine PII/Secrets.

Je Regel eintragen: `{ skill, regel, klasse, entscheid }` mit
`klasse ∈ {failure-mode, domänen-meinung, geschmack}`. Nur
`geschmack` wird angefasst — umformuliert zum Urteils-Anker oder gestrichen.

- [ ] Ergebnis-Tabelle in `06-bilanz.md` eintragen (nicht hier — dort steht
      die Gesamtbilanz).

## Abnahme

- [ ] Vorlage nennt alle vier Punkte aus dem Akzeptanz-Kriterium.
- [ ] Für jede Leitplanke der sechs Skills liegt ein Entscheid vor.
- [ ] Die Regression-Anker in `landing-page`, `bug-triage` und `web-audit`
      sind unverändert — der Check aus Phase 01 belegt das.
