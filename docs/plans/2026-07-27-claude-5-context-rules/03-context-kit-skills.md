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
- [ ] **Befund F — nichts zu tun, nur bestätigen.** Runde 8 der
      Spec-Review hat gezeigt: dieser Skill verweist bereits nur auf das
      Format (Schritt 5, „mit dem 5-Zeilen-Format-Template als
      Kopfkommentar") und kopiert es nicht. Beim Editieren nicht
      versehentlich eine Kopie einführen.
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
- [ ] **Befund K — falscher Fakt in der Budget-Tabelle.** Die Zeile
      „immer geladene Skill-Prompts (`SKILL.md`)" stimmt nicht: der Body
      lädt beim Trigger, nicht in jeder Session. Korrigieren — und die
      `description` als eigene Budget-Zeile aufnehmen, denn sie ist das
      einzige wirklich immer geladene Stück und hatte bisher gar kein
      Budget. Das ist zugleich die Begründung, auf der das Zeilen-Budget
      dieses ganzen Vorhabens ruht.
- [ ] **Befund L — `/doctor` erwähnen.** Eine Zeile, verfügbarkeits-neutral
      („falls die Runtime `/doctor` anbietet, …"), wie die Doktrin es für
      Tool-Verweise vorschreibt. Kein Nachbau: der Skill deckt Drift,
      Duplikate und Archiv-Mechanik ab, die `/doctor` nicht kennt.
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
- [ ] `kontext-audit` behauptet nicht mehr, `SKILL.md`-Bodies seien immer
      geladen; die `description` hat eine eigene Budget-Zeile (K).
- [ ] `kontext-audit` nennt `/doctor` in einer verfügbarkeits-neutralen
      Zeile (L).
- [ ] `projekt-setup` hat weiterhin keine Kopie des Status-Formats.
- [ ] `.env`/Secrets-Leitplanken beider Skills unverändert (Check grün).
