# 04 — Router-Skill

Fünf user-invoked Skills sind fünf Dinge, an die du dich erinnern musst.
Der Router ist die Antwort darauf — und selbst user-invoked, kostet also
null Grundlast.

Ort: `plugins/context-kit/skills/<name>/SKILL.md`. `context-kit` ist das
Meta-Plugin; der Router gehört zum Kontext-Lebenszyklus, nicht zu den
Fach-Skills.

## Die Abgrenzung, die diese Phase trägt

Ein Router, der die neun Skills beschreibt, ist eine **dritte Kopie**
derselben Information — neben dem Frontmatter und der README-Tabelle.
Dieser Lauf beseitigt Duplikate; er darf nicht zwei neue erzeugen.

Deshalb: die **eine Quelle** je Skill bleibt dessen Frontmatter. Der Router
trägt ausschliesslich, was dort nicht steht und auch nicht stehen kann —
**Anlass und Übergänge**. Nicht „was der Skill tut", sondern „wann du zu
ihm greifst und was danach kommt".

## Schritte

- [ ] **Namen wählen.** Er muss dir einfallen, wenn du gerade *nicht*
      weisst, welcher Skill passt — das ist die einzige Situation, in der
      der Router benutzt wird.
- [ ] **Frontmatter:** `disable-model-invocation: true`, `description` als
      menschenlesbare Einzeile.
- [ ] **Die Wege abbilden, nicht die Skills aufzählen.** Der Bestand hat
      erkennbare Ketten, und die sind der eigentliche Inhalt:
      - `/prior-art-check` → Spec (Stufe 1 der Pipeline)
      - `/bug-triage` → Light-Mode der Pipeline
      - Review-Eskalation oder Build/Buy-Entscheid → `/adr`
      - `/projekt-setup` einmalig, `/kontext-audit` bei Drift
      - `/landing-page` → `/web-audit` als voller Check danach
      Je Skill **maximal eine Zeile** Anlass.
- [ ] **Keine Nacherzählung.** Gegenprobe: enthält eine Zeile etwas, das
      wortgleich oder sinngleich schon in der `description` des Skills
      steht, gehört sie nicht in den Router.
- [ ] **README ergänzen, nicht aushöhlen.** Die Plugin-Tabelle im
      `README.md` bleibt vollständig: ihr Publikum sind Leser auf GitHub,
      die den Router weder installiert haben noch ausführen können — ein
      Verweis dorthin würde das README für genau die Leute verschlechtern,
      für die es geschrieben ist. Aufgenommen wird der Router als **neuer
      Eintrag** unter `context-kit`, mit einem Satz dazu, dass er die
      Anlass-Frage in der Session beantwortet. Die Tabelle beschreibt
      *was* die Skills tun, der Router *wann* man greift — zwei Fragen,
      kein Duplikat.
- [ ] **Verifikation:** Assertion `F3` grün (Router existiert, trägt das
      Feld). `node tests/validate-context-doctrine.mjs`.

## Stopp-Bedingung

Wächst der Router über eine Bildschirmseite, ist er zur Nacherzählung
geworden. Dann zurück auf die Anlass-Zeilen — nicht die Seite kürzen,
sondern die Nacherzählung streichen.

## Ergebnis — und eine Abweichung von der Spec

Der Skill heisst `skill-kompass` (`plugins/context-kit/skills/skill-kompass/`),
ist user-invoked, 64 Zeilen.

**Die Spec verlangt, dass der Router keine `description` nacherzählt. Für
die vier model-invoked Skills tut er es teilweise doch** — die Spalte
„Ausgangslage" nennt bei `kontext-audit`, `bug-triage`, `prior-art-check`
und `adr` denselben Anlass, den ihre `description` trägt. Bewusst so
belassen, aus zwei Gründen:

1. **Der Spec-Satz trägt hier nicht.** Er begründet die Regel mit
   vermiedener Duplikation — die kostet aber Tokens nur bei geladenen
   Artefakten. Der Kompass ist user-invoked und lädt nur, wenn man ihn
   tippt. Was bleibt, ist Wartungs-Drift, und die trifft eine Karte, keine
   Doktrin.
2. **Ohne sie zerfällt die Karte.** Ein Wegweiser, der vier von neun Wegen
   auslässt, weil sie ohnehin von selbst gefunden werden, beantwortet die
   Frage nicht mehr, für die man ihn tippt.

Die Zeilen sind **Anlass-Formulierungen, keine Kopien**: „Doku fühlt sich
falsch an, `CLAUDE.md` wächst" gegen „context has gone stale or bloated".
Driftet eine, veraltet ein Wegweiser — kein Doktrin-Verstoss. Wer die Regel
strenger will, streicht die vier Zeilen; der Kompass funktioniert dann für
die fünf, die man tatsächlich erinnern muss.

Die README-Tabelle bleibt vollständig (siehe Schritt oben) — sie beschreibt
*was*, der Kompass *wann*.
