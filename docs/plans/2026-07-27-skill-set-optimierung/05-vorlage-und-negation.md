# 05 — Vorlage + chirurgischer Negations-Durchgang

Zwei Schritte, dieselbe Sache aus zwei Richtungen: die Vorlage lernt die
Regel, der Bestand wird nach ihr durchgesehen.

## 5a — Die Vorlage lernt die Invocation-Achse

`templates/skill-vorlage/SKILL.template.md:20` sagt heute: „Sie ist das
einzige immer geladene Stück des Skills" — die `description` als
unveränderliche Eigenschaft. Damit existiert die Wahl in der eigenen
Autoren-Doktrin nicht, und der nächste Skill wiederholt den Fehler.

- [ ] **Abschnitt „Die `description` ist das Interface" überarbeiten:**
      beide Modi benennen und die Entscheidungsregel dazu — greift Claude
      selbst zu (model-invoked, Description-Last) oder tippst nur du
      (user-invoked, null Last, dafür musst du dich erinnern). Der
      bestehende Inhalt zur Qualität der Description bleibt; er gilt für
      model-invoked weiter und wird dort nur enger.
- [ ] **Die Folge benennen:** viele user-invoked Skills erzeugen die Last,
      die der Router auffängt (Phase 04). Ein Satz, kein Abschnitt.
- [ ] **`disable-model-invocation` als Feld nennen** — Assertion-Anker aus
      Phase 01.
- [ ] Der Abschnitt „Kodiere deine Meinung" (`:61-69`) bleibt **wie er
      ist**. Er trägt den No-Op-Test bereits („Was weiss ich hier, das im
      Modell nicht ohnehin steckt?") und ist die stärkste Stelle der
      Vorlage.

## 5b — Chirurgischer Negations-Durchgang

Der Bestand steuert durchgehend per Verbot; die Vorlage kennt den
Urteils-Anker seit `:42-53`, angewendet wurde er nur teilweise. Die
Klassifikation ist **nicht neu zu erfinden** — sie steht in
`kontext-audit` Schritt 4 und gilt hier für die Skills selbst.

- [ ] **Kandidaten sammeln:** Scan über die neun Skills nach
      `NIE|NIEMALS|NICHT|KEIN|NEVER` und ALL-CAPS-Imperativen. Der Scan
      liefert Fundstellen, **entschieden wird über die Klassifikation** —
      nicht über den Grep.
- [ ] **Je Fundstelle klassifizieren** nach der bestehenden Tabelle:
      - **realer Failure-Mode** (Secrets, Daten-Grenze, Gate-Bypass,
        erfundene Fakten) → **bleibt wörtlich.** Beispiele, die bleiben:
        `.env` nie lesen · Subagenten nur git-getrackte Pfade · kein
        Approval-Bypass vor Gate 2 · keine erfundenen Testimonials.
      - **kodierte Domänen-Meinung** → bleibt, sofern die Folge ihrer
        Verletzung benennbar ist. Beispiel: „kein Sammel-ADR" — der Grund
        steht in der Vorlage (`:69`).
      - **Geschmack / Über-Constraint** → wird Urteils-Anker oder entfällt.
- [ ] **Positiv drehen, wo die Klasse es zulässt.** Der Zielzustand ersetzt
      das Verbot, statt es zu ergänzen: „Keine Behauptung ohne Quelle" →
      „Jede Behauptung mit Fundstelle". Die Regel wird dadurch nicht
      schwächer, sondern nennt das gewünschte Verhalten statt des
      unerwünschten.
- [ ] **Protokoll führen:** je Fundstelle eine Zeile — Stelle, Klasse,
      Entscheid. Das ist der Rohstoff für den Regressions-Nachweis in
      Phase 07; ohne es ist die Akzeptanz dort nicht belegbar.
- [ ] **Verifikation:** `node tests/validate-context-doctrine.mjs`. Die
      Gruppe-A/C-Anker müssen **alle** halten — sie sind der einzige
      automatische Schutz in dieser Phase.

## Stopp-Bedingung

Diese Phase hat das höchste Risiko des ganzen Laufs: eine positiv gedrehte
Leitplanke kann still schwächer werden, und kein Test merkt es. Zwei
Regeln dagegen — im Zweifel bleibt die Formulierung wie sie ist, und keine
Fundstelle wird ohne Protokoll-Zeile angefasst. Eine Regel, die sich nicht
ohne Bedeutungsverlust positiv formulieren lässt, ist damit fertig
klassifiziert: sie bleibt.

## Protokoll des Durchgangs

Scan-Treffer: **26**. Davon sind 6 gar keine Steuerungs-Negationen
(beschreibende Verzweigungen wie „Repro NICHT gelungen →", die
Grep-Heuristik in `kontext-audit:74`, die Überschrift „Grundsätze (NICHT
verhandelbar)"). Bleiben 20 zur Klassifikation.

### Bleibt wörtlich — realer Failure-Mode (10)

| Stelle | Failure-Mode |
|---|---|
| `projekt-setup` `.env.example` (NICHT `.env` lesen) | Secrets |
| `projekt-setup` `.env`/Secrets nie lesen | Secrets |
| `projekt-setup` Keine Fakten erfinden | erfundene Fakten |
| `projekt-setup` Nichts löschen ohne Auftrag | Datenverlust |
| `projekt-setup` `AGENTS.md` NIE als Kopie | Drift (Folge benennbar) |
| `kontext-audit` NIE ersatzlos gelöscht | Datenverlust |
| `bug-triage` Keine PII/Secrets aus Logs | Secrets |
| `web-audit` Keine PII/Secrets aus der Laufzeit | Secrets |
| `landing-page` Keine erfundenen Beweise | erfundene Fakten |
| `dependency-audit` NICHT den nächsten Schritt draufsetzen | kaskadierende Fehler |

Die Testanker `A6`–`A10` prüfen fünf davon als exakten String und blieben
den ganzen Durchgang grün — der beste verfügbare Beleg, dass die harten
Leitplanken unberührt sind.

### Bleibt — kodierte Domänen-Meinung (2)

- `landing-page` **Keine Dark Patterns**: Fake-Countdown, vorgetäuschte
  Knappheit, versteckte Kosten. Die Aufzählung *ist* der Wert — sie benennt,
  was gemeint ist.
- `web-audit` **Kein Design-Umbau unter dem Deckmantel von A11y**: der
  positive Teil („Farbwerte nur minimal anpassen, Charakter erhalten") führt
  bereits; das „Deckmantel"-Bild trägt die eigentliche Warnung.

### Gedreht (8)

| Stelle | Vorher | Nachher |
|---|---|---|
| `projekt-setup` | „**NICHT überschreiben.** Stattdessen Restrukturierung" | „**Umbau-Vorschlag statt Neuanlage.**" |
| `projekt-setup` | „das kommt NICHT in die CLAUDE.md" | „das leitet Claude selbst ab und bleibt draussen" |
| `adr` | „NICHT für: …" | „Gehört woanders hin: …" |
| `bug-triage` | „**Kein Fix während der Triage**" | „**Die Triage endet mit dem Dokument**" |
| `dependency-audit` | „NIE ohne Breaking-Changes-Lektüre" | „Breaking Changes vorher gelesen" |
| `dependency-audit` | „Kein Major-Update ohne gelesene Release-Notes" | Duplikat der Tabellen-Zeile → aufgelöst, Urteils-Anker bleibt |
| `dependency-audit` | „Keine neuen Pakete einführen" | „Neue Pakete gehören in `/prior-art-check`" |
| `prior-art-check` / `web-audit` | „Keine Behauptung ohne Quelle/Fundstelle" | „Jede Behauptung mit Quelle" / „Jeder Befund mit Fundstelle" |

Vier der acht hatten den positiven Zielzustand **bereits im Satz**, nur an
zweiter Stelle — das Verbot stand vorn und bestimmte, worauf die
Aufmerksamkeit fiel. Umstellen genügte, formulieren musste niemand.

Ein Duplikat fiel nebenbei auf: `dependency-audit` trug die
Breaking-Changes-Regel zweimal (Tabelle **und** Leitplanke). Die Tabelle
behält die Regel, die Leitplanke den Urteils-Anker („‚latest' ist kein
Argument").
