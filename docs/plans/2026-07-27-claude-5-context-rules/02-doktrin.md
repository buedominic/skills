# Phase 02 — Doktrin (`plugins/context-kit/docs/kontext-architektur.md`)

Die Doktrin ist die Quelle, auf die beide context-kit-Skills verweisen.
Befunde A, D, F (Quellseite), H sowie Rich References.

## Schritte

- [ ] **Befund H — Gotchas als Schwerpunkt.** § „Was gehört in CLAUDE.md"
      umbauen. Der Post weist den Gotchas der Codebase den Grossteil der
      Tokens zu (Beispiel: „Typen liegen in genau einer monolithischen
      Datei"). Gotchas werden ein eigener, führender Posten; die bisherigen
      Posten „Konventionen" und „Befehle" schrumpfen auf je eine Zeile mit
      Verweis. Der Test für einen Gotcha: er ist aus dem Repo *nicht* in
      30 Sekunden ableitbar und hat schon einmal jemanden gekostet.
- [ ] **Befund A — Verbote entschärfen.** Punkt 4 („Verbote (Was NICHT tun):
      kurz, imperativ") verliert den Pflicht-Charakter. Ersatz: eine Regel
      mit Urteils-Anker im Stil des Posts — nicht „nie X", sondern eine
      Beschreibung des Zielzustands, aus der Claude ableiten kann. Ein
      Verbot bleibt zulässig, wenn ein realer Failure-Mode dahintersteht
      („hochwichtige Bereiche" im Sinn des Posts); Geschmacks-Verbote
      entfallen. Beispiel-Paar aus dem Post mitgeben, damit die Regel
      operationalisierbar ist.
- [ ] **Befund D — Auto-Memory.** Einen kurzen Absatz ergänzen: CLAUDE.md
      ist kein Memory-Store; Claude speichert Relevantes selbst. Was in die
      CLAUDE.md gehört, ist bewusst kuratierte, dauerhafte Projekt-Wahrheit —
      nicht das Sitzungsgedächtnis.
- [ ] **Rich References.** Im Schichten-Modell festhalten: Code schlägt
      Prosa. Eine Test-Suite, ein HTML-Mockup, eine zu portierende Funktion
      oder eine Rubric sind bessere Referenzen als eine Beschreibung
      desselben. Gehört zu Schicht 2/3, nicht in die CLAUDE.md.
- [ ] **Befund F — Quellseite.** Das 5-Zeilen-Status-Format bleibt hier und
      wird ausdrücklich als *die* Quelle markiert.
- [ ] Herkunft in **einer** Zeile nennen (die einzige laut Spec erlaubte
      Quellenangabe im ganzen Repo).
- [ ] Gegenfinanzierung prüfen: Was durch die neuen Abschnitte wächst, muss
      an anderer Stelle der Datei durch Straffung zurückkommen. Zeilenzahl
      vorher/nachher notieren (Start: 80).

## Abnahme

- [ ] Kein Pflicht-Abschnitt „Verbote" mehr; Urteils-Regel plus Ausnahme
      für hochwichtige Bereiche steht da.
- [ ] Gotchas sind als Schwerpunkt-Posten mit grösstem Token-Anteil benannt.
- [ ] Auto-Memory und Rich References kommen vor.
- [ ] Status-Format als Quelle markiert.
- [ ] `node tests/validate-context-doctrine.mjs` — Anker weiterhin grün.
