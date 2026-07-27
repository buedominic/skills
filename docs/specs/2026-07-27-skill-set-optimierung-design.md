# Skill-Set-Optimierung — Invocation-Achse, Duplikate, Steuerungsform

Lauf 1 von zwei. Dieser Lauf räumt den **Bestand** auf; die Übernahmen aus
`mattpocock/skills` (grilling, domain-modeling, Diff-Review, TDD-Referenz)
sind Lauf 2 und hier ausdrücklich Nicht-Ziel.

## Problem

Das Skill-Set ist inhaltlich stark, aber es fehlt ihm eine Achse, und es
verletzt an zwei Stellen seine eigene Doktrin.

**Die fehlende Achse — Invocation.** Alle neun Skills sind model-invoked.
Ihre `description`-Felder summieren sich auf **3.341 Zeichen**, die in jeder
Session jedes Projekts geladen werden — auch die von `/landing-page`, wenn
gerade eine Datenbank migriert wird. Fünf dieser Skills sind Orchestratoren,
die man ohnehin tippt; ihre Auto-Auffindbarkeit ist bezahlte Last ohne
Gegenwert. `SKILL.template.md:20` setzt „immer geladen" sogar als
unveränderliche Eigenschaft voraus — die Wahl existiert in der eigenen
Autoren-Doktrin nicht.

**Die zwei Selbstverstösse.**

1. `projekt-setup:24-38` und `kontext-audit:20-33` tragen beide eine
   „Kurzfassung" der Doktrin, und sie sind **gedriftet**: die Gotcha-
   Definition steht nur in der einen, „umso tiefer je seltener" nur in der
   anderen. Das ist der Befund, den `kontext-audit` Schritt 4 selbst als
   `CRITICAL` klassifiziert. Der Fallback ist zudem weitgehend unnötig:
   `install.sh:43-48` kopiert die Doktrin in jedes `references/`.
2. `kontext-audit` Schritt 4 klassifiziert Über-Constraints in
   *Zielprojekten*; die Skills selbst steuern durchgehend per Verbot. Die
   Vorlage kennt den Urteils-Anker (`SKILL.template.md:42-53`) — angewendet
   wurde er auf den Bestand nur teilweise.

## Entscheide (Gate 1)

| Frage | Entscheid |
|---|---|
| Invocation | 5 user-invoked (`projekt-setup`, `spec-to-implementation`, `dependency-audit`, `web-audit`, `landing-page`), 4 model-invoked (`kontext-audit`, `adr`, `bug-triage`, `prior-art-check`) |
| Router | Neuer user-invoked Skill in `context-kit` |
| Doktrin-Kurzfassung | Ersatzlos streichen, ersetzt durch eine Herkunfts-Zeile |
| Umbau-Tiefe | Chirurgisch — nur ohne realen Failure-Mode, plus Leitwort-Kollaps |

Die vier model-invoked Skills sind es aus einem Grund, nicht aus Gewohnheit:
`/adr` und `/prior-art-check` werden von anderen Skills als Anschluss
benannt, `/bug-triage` soll bei einer rohen Fehlermeldung von selbst
greifen, `/kontext-audit` bei spürbarer Doku-Drift.

### Ein Entscheid steht noch offen — und er bindet mehrere Kriterien

Der Spec-Review hat `landing-page` als schwächsten der fünf markiert: es ist
als einziger kein Repo-Orchestrator, sondern ein Fach-Skill, und „bau eine
landing page" wäre ein natürlicher Auto-Trigger. Der Einwand wurde **nicht**
im Review entschieden — die Invocation-Menge ist ein Gate-1-Entscheid des
Users und wurde an Gate 2 zur Drehung vorgelegt.

**An Gate 2 entschieden: `landing-page` bleibt user-invoked.** Der Skill ist
mit Interview, Struktur-Tabelle und Launch-Checkliste ein Orchestrator wie
die anderen vier, und eine Landing Page baut man bewusst statt nebenbei.
Damit gilt durchgehend die Menge von fünf und die Schranke ≤ 1.150.

**Diese Abhängigkeit steht hier und nur hier.** Jedes Akzeptanz-Kriterium,
das eine Menge oder eine Schranke nennt, ist gegen die an Gate 2 bestätigte
Fassung zu lesen — die beiden Varianten sind dort ausgewiesen, wo sie sich
zahlenmässig unterscheiden. Ohne diesen einen Satz müsste jedes betroffene
Kriterium seine eigene Fallunterscheidung führen, und die würden
auseinanderlaufen.

## Scope

**Neun `SKILL.md`** — Frontmatter (Invocation), `description` (Trigger statt
Identität), chirurgischer Negations-Durchgang, Leitwort-Kollaps.

**`templates/skill-vorlage/SKILL.template.md`** — die Invocation-Achse als
Autorenregel. Ohne das bleibt die Vorlage stale und der nächste Skill
wiederholt den Fehler.

**`install.sh` + `docs/portabilitaet.md`** — `disable-model-invocation` ist
Claude-nativ. Cursor-Rules entstehen heute für *jeden* Skill mit
`description` + `alwaysApply: false` (`install.sh:190-199`) — Cursors
„Agent Requested"-Modus, der genau per description lädt. Ohne Anpassung
gilt die Achse nur in Claude.

**`plugins/context-kit/skills/<router>/`** — neuer Skill. Er darf die neun
`description`-Felder **nicht nacherzählen**, sonst entsteht eine dritte
Kopie derselben Information und der Aufräum-Lauf produziert genau die
Duplikat-Klasse, die er beseitigt. Die eine Quelle je Skill bleibt dessen
Frontmatter; der Router trägt ausschliesslich das, was dort *nicht* steht:
den **Anlass** („wann greife ich zu welchem") und die Übergänge zwischen
den Skills. Pro Skill maximal eine Zeile. Die README-Tabelle wird zum
Adapter und verweist auf den Router, statt eine dritte Fassung zu führen.

**`tests/validate-context-doctrine.mjs`** — Assertions für den Soll-Zustand,
nach dem etablierten Muster der Gruppe C (zuerst rot).

**`README.md` + `marketplace.json` + `plugin.json`** — Übersicht, Versionen.

## Nicht-Ziele

- Übernahmen aus `mattpocock/skills` (Lauf 2).
- `codebase-design` / `improve-codebase-architecture` — eigener Entscheid.
- Fachliche Änderungen an Ablauf, Schwellen oder Leitplanken. Gegenstand
  sind Platzierung, Auffindbarkeit und die *Form* der Steuerung.
- `handoff`, `prototype` — verworfen, das Manifest und das Rich-References-
  Prinzip decken sie ab.

## Annahmen

1. **`disable-model-invocation: true` ist das gültige Claude-Feld** für
   user-invoked Skills. Belegt durch `mattpocock/skills` (9 Skills nutzen
   es produktiv), nicht durch offizielle Doku, die im Repo vorliegt.
   **Risiko:** kennt die Runtime das Feld nicht, ignoriert sie es still —
   die Skills blieben model-invoked, und eine reine Dateiprüfung wäre
   trotzdem grün. Die Achse wird deshalb an der laufenden Runtime
   verifiziert, nicht nur am Dateiinhalt (§ Akzeptanz).
2. **Codex ehrt das Feld vermutlich nicht.** `docs/portabilitaet.md:60`
   beschreibt Auto-Laden per description. Behandelt wie Cursor: durch
   `install.sh` emuliert statt vorausgesetzt.
3. **Skill-zu-Skill-Verweise auf user-invoked Skills sind Prosa an den
   User**, keine programmatische Invokation — z.B. `bug-triage`s Hinweis
   auf den Light-Mode. Sie bleiben gültig; nur die *automatische* Reichweite
   entfällt.
4. **Die Kurzfassung ist verzichtbar**, weil `install.sh` die Doktrin
   mitkopiert. Wer einen einzelnen Ordner von Hand kopiert, verliert sie —
   akzeptiert, dafür sagt die Herkunfts-Zeile, wo sie steht.
5. **`node` ist die Verifikations-Basis.** Kein `package.json`, kein `pwsh`
   im Container; `tests/validate-feature-workflow.ps1` bleibt ungeprüft.
6. **Spec, Plan und Implementation liegen auf einem Branch**
   (`claude/skills-optimization-spec-i2hiix`) statt getrennt — Vorgabe der
   Session schlägt Grundsatz 3 der Pipeline.

## Akzeptanz

Jedes Kriterium ist als Assertion in `tests/validate-context-doctrine.mjs`
prüfbar; die Suite ist am Ende grün und war es zu Beginn (44/44).

- [ ] Genau fünf `SKILL.md` tragen `disable-model-invocation: true` —
      `projekt-setup`, `spec-to-implementation`, `dependency-audit`,
      `web-audit`, `landing-page` (an Gate 2 bestätigt). Als **exakte
      Menge** geprüft, nicht als Stichprobe, sonst rutscht ein sechster
      Skill unbemerkt durch und seine Trigger sind still weg.
- [ ] Der neue Router-Skill trägt es ebenfalls, nennt alle neun Skills mit
      ihrem **Anlass** in je einer Zeile und erzählt dabei keine
      `description` nach.
- [ ] **Die verbleibende Grundlast ist echt gesunken.** Die model-invoked
      `description`-Felder summieren sich auf ≤ **1.150** Zeichen (vier
      Skills, heute zusammen 1.470). Die Schranke liegt bewusst **unter**
      dem heutigen Stand: läge sie darüber, wäre sie allein durch das
      Umflaggen erfüllt und würde die im Scope versprochene
      Description-Überarbeitung nicht messen. Gesamt gegen heute (3.341):
      mindestens **65 %** weniger.

      Die Alternativschranke ≤ 1.400 über fünf Felder entfiel mit dem
      Gate-2-Entscheid (§ Entscheide).
- [ ] **Das 500-Zeichen-Budget ist als Regression verankert**, nicht als
      Momentaufnahme: eine Assertion in Gruppe B prüft *jede* `SKILL.md`
      inklusive der Vorlage, sodass auch ein künftig hinzugefügter Skill
      daran scheitert. (Als reines Ist-Kriterium wäre es nach dem Umbau
      wirkungslos — die einzige Überschreitung wird user-invoked.)
- [ ] Weder `projekt-setup` noch `kontext-audit` enthalten einen
      Doktrin-Kurzfassungs-Block; beide nennen stattdessen den Pfad der
      Doktrin.
- [ ] `SKILL.template.md` erklärt beide Invocation-Modi und wann welcher
      gilt.
- [ ] `install.sh` erzeugt für user-invoked Skills **keine**
      Agent-Requested-Cursor-Rule; `docs/portabilitaet.md` hält fest, wie
      die Achse pro Client abgebildet ist.
- [ ] Der Leitwort-Kollaps ist vollzogen: „Report zuerst, Edits erst nach
      Bestätigung" steht nicht mehr dreimal ausgeschrieben, sondern als ein
      Begriff in der Doktrin plus Verweis.
- [ ] **Die Invocation-Achse ist als offener Punkt geführt, nicht als
      erledigt.** Sie lässt sich in diesem Repo nicht abschliessen: hier
      ist es die *Quelle* der Plugins, nicht ihr Installationsziel — es
      gibt keine Skill-Liste, gegen die man prüfen könnte. Der Beleg
      gehört in die erste Session eines Zielprojekts mit installiertem
      Marketplace (Skill-Liste bzw. `/doctor`). Bis dahin steht die
      Wirksamkeit als offener Punkt im Manifest und ist im
      Abschluss-Bericht benannt — ein Haken darf hier nicht aus einer
      blossen Dateiprüfung entstehen (§ Annahme 1).
- [ ] **Verhaltens-Regression: pro geänderter Datei einzeln belegt.** Die
      Testsuite deckt das *nicht* ab — Gruppe A/C prüft punktuelle
      String-Anker, an denen eine entfernte Leitplanke vorbeigeht. Der
      Nachweis ist deshalb ein dokumentierter Diff-Durchgang: je Datei
      hält eine Zeile fest, welche Änderungen rein formal waren und welche
      Leitplanken bewusst umformuliert wurden — inklusive der Feststellung,
      dass keine mit realem Failure-Mode (Secrets, Daten-Grenze,
      Gate-Bypass) entfallen ist.
- [ ] `README.md` und `marketplace.json` bilden den neuen Stand ab; alle
      drei `plugin.json` haben eine erhöhte Version.

## Review-Notizen

**Runde 1** (Reviewer: `orchestrator` — kein Subagenten-Dispatch, siehe
Manifest `agentFallbacks`). 6 Findings, 5 eingearbeitet:

- `CRITICAL` Das Grundlast-Kriterium war **vakuum**: die vier verbleibenden
  Descriptions liegen heute schon bei 1.484 Zeichen, die Schranke stand bei
  1.600. Es hätte allein durch das Umflaggen grün gemeldet und die im Scope
  versprochene Description-Überarbeitung nie gemessen. Schranke auf 1.150
  gesenkt, Begründung im Kriterium selbst.
- `IMPORTANT` Das 500-Zeichen-Kriterium wäre nach dem Umbau wirkungslos
  geworden (die einzige Überschreitung wird user-invoked). Von einer
  Momentaufnahme zu einer Gruppe-B-Regression über *alle* `SKILL.md`
  umgebaut.
- `IMPORTANT` Der Router war als dritte Kopie der Descriptions angelegt —
  die Duplikat-Klasse, die dieser Lauf beseitigt. Abgegrenzt auf das, was
  im Frontmatter *nicht* steht (Anlass, Übergänge); README wird Adapter.
- `IMPORTANT` Der Regressions-Nachweis berief sich auf die Gruppe-A/C-
  Assertions. Die prüfen punktuelle String-Anker, an denen eine entfernte
  Leitplanke vorbeigeht — die behauptete Deckung existiert nicht. Ersetzt
  durch einen dokumentierten Diff-Durchgang je Datei.
- `MINOR` Annahme 1 verschwieg den stillen Fehlerpfad (unbekanntes
  Frontmatter wird ignoriert, Dateiprüfung trotzdem grün). Risiko benannt.
- `MINOR` **Bewusst abgelehnt:** `landing-page` als user-invoked ist
  angreifbar — es ist als einziger der fünf kein Repo-Orchestrator, und
  „bau eine landing page" wäre ein natürlicher Auto-Trigger. Das ist ein
  Gate-1-Entscheid des Users; er wird nicht im Review re-litigiert,
  sondern in der Gate-2-Zusammenfassung zur Drehung angeboten.

**Runde 2.** 1 Finding, eingearbeitet:

- `IMPORTANT` Das in Runde 1 ergänzte Runtime-Kriterium war in diesem Repo
  **nicht erfüllbar** — hier liegt die Quelle der Plugins, nicht ihr
  Installationsziel. Es hätte am Ende als unbelegter Haken dagestanden.
  Umgestellt auf einen offenen Punkt, der in ein Zielprojekt gehört.

**Runde 3.** `NO_FINDINGS` — bestätigter Clean-Pass, Schleife verlassen.
