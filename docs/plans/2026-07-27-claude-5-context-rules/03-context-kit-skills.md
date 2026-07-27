# Phase 03 — context-kit-Skills

Befunde B, C, F (Verweisseite). Beide Skills tragen eine Kurzfassung der
Doktrin für den Fall der Einzel-Installation — die Kurzfassungen müssen der
neuen Doktrin folgen, sonst driften sie (und wären genau das gedriftete
Duplikat, das `/kontext-audit` als CRITICAL führt).

## `projekt-setup/SKILL.md` (Start: 107 Zeilen)

- [ ] **Befund B — Interview.** Schritt 2 fragt nicht mehr nach
      „Nicht-verhandelbaren Konventionen und Verboten", sondern nach
      **Gotchas**: was hat schon einmal jemanden gekostet, was ist aus dem
      Repo nicht ableitbar. Ein Verbot wird nur aufgenommen, wenn der User
      einen konkreten Failure-Mode nennt.
- [ ] **Befund B — erzeugte CLAUDE.md.** Schritt 3 folgt der neuen
      Doktrin-Struktur: Gotchas als Schwerpunkt, „Verbote" kein
      Pflicht-Abschnitt mehr.
- [ ] **Befund F.** Das Status-Format nicht wiederholen, sondern auf die
      Doktrin verweisen. Zulässig, weil beide im selben Plugin liegen und
      `install.sh` die Plugin-`docs/` in die `references/` jedes Skills
      kopiert — der Verweis hält also auch bei Einzel-Installation.
- [ ] Kurzfassung der Doktrin am Dateikopf an die neue Fassung angleichen.

## `kontext-audit/SKILL.md` (Start: 93 Zeilen)

- [ ] **Befund C — neuer Prüfschritt „Über-Constraining".** Kern ist die
      Diagnose des Posts, nicht ein Caps-Grep: **kollidierende
      Instruktionen** über CLAUDE.md, AGENTS.md, Skills und Agent-Definitionen
      hinweg finden — das Post-Beispiel ist „leave documentation as
      appropriate" gegen „DO NOT add comments" im selben Request. Der Scan
      nach NIE/NIEMALS/NICHT/NEVER/ALWAYS/ALL-CAPS ist die *Einstiegs-
      heuristik*, die die Kandidaten liefert.
- [ ] **Klassifikation je Fund**, damit der Schritt entscheidbar ist:
      realer Failure-Mode (bleibt) · kodierte Domänen-Meinung (bleibt — der
      Post wertet sie ausdrücklich auf) · Geschmack (wird Urteils-Anker
      oder entfällt) · Kollision (eine Seite gewinnt, die andere weicht).
- [ ] Schwere einordnen: Kollisionen sind CRITICAL (sie kosten das Modell
      Auflösungsarbeit bei *jedem* Request), blosse Über-Constraints HOCH.
- [ ] **Progressive-Disclosure-Check** in die Budget-Tabelle: nicht nur
      „ist die `SKILL.md` im Zeilen-Budget", sondern „ist ein langer Skill
      in einen Datei-Baum aufgeteilt". Ein Skill über Budget mit
      `references/` ist gesund; einer ohne ist der Befund.
- [ ] Kurzfassung der Doktrin am Dateikopf angleichen.
- [ ] Gegenfinanzierung: Der neue Schritt kostet Zeilen. Prüfen, ob der
      Duplikat-Check (Schritt 4) und der neue Über-Constraining-Check sich
      überlappen und zusammengezogen werden können.

## Abnahme

- [ ] `projekt-setup` fragt nach Gotchas; „Verbote" ist keine eigene
      Interview-Frage und kein Pflicht-Abschnitt mehr.
- [ ] `kontext-audit` findet kollidierende Instruktionen, klassifiziert
      jeden Fund und nennt den Ban-Scan als Einstiegsheuristik.
- [ ] `kontext-audit` prüft den Datei-Baum, nicht nur das Zeilen-Budget.
- [ ] Status-Format-Literal steht nicht mehr in `projekt-setup`.
- [ ] `.env`/Secrets-Leitplanken beider Skills unverändert (Check grün).
