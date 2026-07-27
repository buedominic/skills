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
