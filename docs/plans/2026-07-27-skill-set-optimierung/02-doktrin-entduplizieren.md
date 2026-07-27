# 02 — Doktrin entduplizieren + Leitwort einführen

Zwei Befunde, eine Phase, weil beide dieselbe Datei anfassen:
`plugins/context-kit/docs/kontext-architektur.md` ist die Quelle, aus der
`projekt-setup` und `kontext-audit` heute je eine gedriftete Kopie führen.

## Der Befund

`projekt-setup:24-38` und `kontext-audit:20-33` tragen beide einen
Blockzitat-Fallback der Doktrin. Sie sind **nicht wortgleich**: die
Gotcha-Definition („nicht in 30 Sekunden aus dem Repo ableitbar und hat
schon einmal jemanden gekostet") steht nur in `projekt-setup`, die
Tiefen-Regel („umso tiefer je seltener es gebraucht wird") nur in
`kontext-audit`. Genau die Klasse, die `kontext-audit` Schritt 4 selbst als
`CRITICAL` führt.

Der Fallback ist zudem weitgehend unnötig: `install.sh:43-48` kopiert die
Plugin-Doku in jedes `references/`. Er greift nur, wenn jemand einen
einzelnen Skill-Ordner von Hand kopiert.

## Schritte

- [ ] **Leitwort „Befund vor Eingriff" in der Doktrin definieren.** Heute
      steht dieselbe Regel dreimal ausgeschrieben — `kontext-audit`
      („Report zuerst, Edits erst nach User-Bestätigung"),
      `dependency-audit` („Report zuerst, Updates erst nach Bestätigung"),
      `web-audit` („Report zuerst, Fixes nach Bestätigung"). Ein Abschnitt
      in der Doktrin definiert den Begriff einmal: erheben, klassifizieren,
      vorlegen, und erst auf Zusage eingreifen. Der Begriff ist bewusst
      pretrained (Diagnose vor Therapie, Eingriff nur mit Einwilligung) —
      er zieht Priors, statt Definitions-Tokens zu kosten.

### Der Kollaps überquert eine Plugin-Grenze — und das ist gelöst, nicht ignoriert

Von den drei Stellen liegt nur `kontext-audit` in `context-kit`.
`dependency-audit` und `web-audit` liegen in `dev-toolkit`, und
`install.sh:43-48` kopiert Doku **plugin-weise**: `plugins/dev-toolkit/`
hat kein `docs/`, seine Skills sehen die Doktrin also nie. Ein blosser
Verweis dorthin wäre für zwei der drei Stellen ein toter Link — genau die
Falle, die `projekt-setup` schon benennt („Plugins sind einzeln gecacht —
verlasse dich nicht auf Dateien eines anderen Plugins").

Das Repo hat dafür einen Präzedenzfall: das Status-Format steht bewusst
zweimal, markiert als Kopie über Plugin-Grenzen
(`spec-to-implementation:186-188`), und `D1` zählt die Vorkommen. Dasselbe
Muster gilt hier.

- [ ] **In `context-kit`** (`kontext-audit`): Verweis auf die Doktrin.
- [ ] **In `dev-toolkit`** (`dependency-audit`, `web-audit`): der Begriff
      plus eine Definitionszeile, mit derselben Herkunfts-Markierung wie
      beim Status-Format — Quelle ist die Doktrin, dupliziert wegen
      Plugin-Cache, kein Drift-Befund.
- [ ] **Test-Anker analog `D1` — erst jetzt, nicht in Phase 01.** Die
      Definitionszeile kommt unter `plugins/` genau **dreimal** vor:
      Doktrin, `dependency-audit`, `web-audit` (`D1` zählt die Doktrin
      mit, und `kontext-audit` verweist nur, definiert nicht). Ohne Zähler
      driftet die Kopie, und der Lauf hätte ein Duplikat durch ein besser
      getarntes ersetzt. Der Anker entsteht **nach** dem Entscheid unten —
      in Phase 01 hätte er ihn erzwungen.

**Wenn dieser Aufwand den Gewinn übersteigt**, ist der Kollaps über die
Plugin-Grenze das falsche Werkzeug: dann bleiben die drei Formulierungen
stehen und werden nur wortgleich gemacht. Diese Entscheidung fällt beim
Schreiben der Definitionszeile — passt sie nicht in **eine** Zeile, gewinnt
die Wortgleichheit.
- [ ] **Kurzfassungs-Block in `projekt-setup` streichen** (`:24-38`).
      Ersetzt durch eine Zeile, die sagt, wo die Doktrin liegt und was
      gilt, wenn sie fehlt: die Skill-Schritte selbst, nicht eine
      nacherzählte Kurzfassung.
- [ ] **Kurzfassungs-Block in `kontext-audit` streichen** (`:20-33`),
      gleiches Muster.
- [ ] **Prüfen, ob beide Blöcke Inhalt tragen, der nirgends sonst steht.**
      Falls ja — z.B. eine Formulierung, die schärfer ist als die Doktrin —
      wandert sie **in die Doktrin**, statt mit dem Block zu verschwinden.
      Das ist der Punkt, an dem „entduplizieren" zu „löschen" entgleisen
      kann.
- [ ] **Die drei „Report zuerst"-Stellen** auf den Begriff umstellen: ein
      Verweis statt der ausgeschriebenen Regel. Die *Schritte* der Skills
      (Report-Aufbau, Klassifizierung, `AskUserQuestion`-Bündelung) bleiben
      unverändert — kollabiert wird die Regel, nicht der Ablauf.
- [ ] **Verifikation:** `node tests/validate-context-doctrine.mjs`. Die
      Gruppe-C-Assertion auf den fehlenden Kurzfassungs-Block wird grün,
      das Leitwort-Anker ebenso. `D1` (Status-Format genau 2×) bleibt
      unberührt — falls nicht, wurde versehentlich in die falsche Datei
      geschrieben.

## Stopp-Bedingung

Verliert eine der drei Audit-Skills durch den Leitwort-Kollaps die
Information, dass die Bestätigung **eine gebündelte `AskUserQuestion` mit
drei Optionen** ist (alles / nur kritisch / nur Report), ist der Kollaps zu
weit gegangen. Der Begriff trägt das Prinzip, nicht die Bedienung.
