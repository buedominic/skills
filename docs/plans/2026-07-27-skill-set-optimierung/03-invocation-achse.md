# 03 — Invocation-Achse

Die Kern-Phase. Fünf Skills werden user-invoked, vier bleiben
model-invoked und werden dabei auf Trigger eingedampft.

## Ausgangslage

Neun `description`-Felder, **3.341 Zeichen**, in jeder Session jedes
Projekts geladen:

| Skill | Zeichen | Nachher |
|---|---|---|
| `spec-to-implementation` | 496 | user-invoked → 0 geladen |
| `kontext-audit` | 421 | bleibt geladen, wird gekürzt |
| `prior-art-check` | 395 | bleibt geladen, wird gekürzt |
| `projekt-setup` | 367 | user-invoked → 0 |
| `web-audit` | 341 | user-invoked → 0 |
| `dependency-audit` | 333 | user-invoked → 0 |
| `landing-page` | 334 | user-invoked → 0 |
| `bug-triage` | 330 | bleibt geladen, wird gekürzt |
| `adr` | 324 | bleibt geladen, wird gekürzt |

Die vier bleibenden liegen zusammen bei **1.470**. Das Ziel ist
**≤ 1.150** — die Schranke ist mit Absicht unter dem Ist gesetzt, sonst
wäre sie allein durch das Umflaggen erfüllt (Finding aus Runde 1 des
Spec-Reviews).

## Schritte

- [ ] **Fünf Skills umflaggen:** `disable-model-invocation: true` ins
      Frontmatter von `projekt-setup`, `spec-to-implementation`,
      `dependency-audit`, `web-audit`, `landing-page`.
- [ ] **Deren `description` auf eine menschenlesbare Zeile eindampfen.**
      Sie wird nicht mehr vom Modell gelesen, sondern von dir in der
      Skill-Liste — Trigger-Listen und Beispiel-Phrasen sind dort tote
      Zeichen. Eine Zeile, die sagt, was der Skill tut.
- [ ] **Die vier bleibenden Descriptions auf Trigger reduzieren.** Was
      gestrichen wird, ist Body-Inhalt, der sich in die Beschreibung
      verirrt hat:
      - `prior-art-check` erzählt seine vier Ebenen und sein Output-Format
        nach — beides steht im Body.
      - `bug-triage` erklärt, was es *nicht* tut („does NOT apply the
        fix"). Eine Abgrenzung ist keine Trigger-Bedingung.
      - `kontext-audit` führt fünf Beispiel-Phrasen, von denen mehrere
        denselben Anlass umschreiben (Budget/Grösse zweimal).
      - `adr` listet Auslöser, die schon in den Beispielen stecken.
      Was bleibt, sind **unterscheidbare Anlässe** — je einer pro Fall,
      keine Synonyme.
- [ ] **Gegenprobe pro gestrichener Zeile:** steht der Inhalt wirklich im
      Body? Wenn nein, wandert er dorthin, statt verloren zu gehen.
- [ ] **Verifikation:** `node tests/validate-context-doctrine.mjs` —
      Gruppe `F1`/`F2` grün (die Fünf tragen das Feld, die Vier nicht),
      Gruppe `G` grün (Summe ≤ 1.150, Ist-Wert in der Ausgabe), Gruppe `B`
      grün (kein Feld > 500).

## Stopp-Bedingung

Die vier bleibenden Descriptions sind das **einzige**, woran Claude diese
Skills noch selbst erkennt. Wird beim Kürzen ein Anlass gestrichen statt
eines Synonyms, verliert der Skill still seinen Auto-Trigger — der Test
merkt das nicht, er zählt nur Zeichen. Deshalb pro Skill notieren, welche
Anlässe erhalten bleiben, und die Liste in Phase 07 gegen die
Ursprungs-Description halten.

## Bekannter Einwand

`landing-page` ist als einziger der fünf kein Repo-Orchestrator, sondern
ein Fach-Skill — „bau eine landing page" wäre ein natürlicher
Auto-Trigger. Der Einwand kam im Spec-Review (Runde 1, `MINOR`) und wurde
als Gate-1-Entscheid des Users bewusst nicht re-litigiert. Er steht in der
Gate-2-Zusammenfassung zur Drehung.

**An Gate 2 bestätigt: `landing-page` bleibt user-invoked.** Der Einwand
wurde geprüft und abgelehnt. Der folgende Absatz dokumentiert, was eine
Drehung gekostet hätte — er ist ab hier historisch.

**Fällt der Entscheid um, ist es kein Einzeiler.** `landing-page` brächte
seine 334 Zeichen zurück in die geladene Menge: 1.470 + 334 = **1.804**, und die Schranke `G ≤ 1.150` wäre unerreichbar. Betroffen sind
dann drei Stellen — die Mengen in `F1`/`F2`, die Schranke in `G`, und die
Akzeptanz-Zeile der Spec. Die Schranke wird in diesem Fall auf
**≤ 1.400** gesetzt: das hält die Anforderung, dass die vier — dann fünf —
Descriptions echt gekürzt werden (heute zusammen 1.804), statt sie allein
durchs Umflaggen zu erfüllen. Der Entscheid gehört an Gate 2, nicht in die
Implementation.

## Ergebnis

**Grundlast: 3.341 → 990 Zeichen (−70 %).** Die vier geladenen Descriptions
fielen von 1.470 auf 990 (−33 %); die fünf user-invoked tragen null.

| Skill | Vorher | Nachher |
|---|---|---|
| `kontext-audit` | 421 | 296 |
| `prior-art-check` | 395 | 269 |
| `bug-triage` | 330 | 232 |
| `adr` | 324 | 193 |
| fünf user-invoked | 1.871 | 0 (geladen) |

### Anlass-Gegenprobe

Vorgezogen aus Phase 07, solange die Alt-Fassungen frisch sind. Gestrichen
wurde ausschliesslich Body-Inhalt und Synonyme — mit **einer Ausnahme, die
der Durchgang gefunden hat**:

- `adr` hatte drei Auslöser („after a build/buy decision, a review
  escalation **or a fundamental design choice**"). Die dritte ist kein
  Synonym der beiden anderen — ein Modul-Schnitt oder eine DB-Wahl entsteht
  ohne vorherigen Prior-Art-Check und ohne Review-Eskalation. Sie war
  gestrichen und wurde zurückgeholt (+25 Zeichen).
- `kontext-audit`: „status.md ist zu gross" entfiel als Formulierung, der
  Anlass (lebendes Dokument über Budget) steht weiterhin drin. „Context
  bombs" und „over-constraining" sind Begriffe der Skill-Schritte 4 und 5 —
  Body-Inhalt.
- `prior-art-check`: die vier Ebenen und „as spec input" beschreiben den
  Ablauf, nicht den Anlass. Drei der vier Ebenen bleiben als Kurzform
  erhalten, weil sie sagen, *wonach* gesucht wird.
- `bug-triage`: „ending in a light-mode-ready mini document" und „it does
  NOT apply the fix" sind Ablauf und Abgrenzung. Eine Abgrenzung ist keine
  Trigger-Bedingung.
