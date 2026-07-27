# TDD — was die Pipeline meint, wenn sie „TDD" verlangt

Der Plan schreibt TDD-Schritte als Checkboxen, die Implementation arbeitet
sie ab. Diese Referenz sagt, was dabei ein guter Test ist. Vom
`implementer`-Agenten zu lesen, bevor der erste Test entsteht.

Sie beschreibt Testpraxis, kein Framework: welche Befehle laufen, steht in
`verifyCommands` des Projekts.

## Was ein guter Test ist

Er prüft **Verhalten über die öffentliche Schnittstelle**, nicht die
Implementierung dahinter. Der Code darf sich vollständig ändern, der Test
nicht. Er liest sich wie eine Aussage über das Produkt — „Nutzer kann mit
gültigem Warenkorb auschecken" sagt, welche Fähigkeit existiert — und
überlebt ein Refactoring, weil ihn die innere Struktur nicht interessiert.

Existiert ein `CONTEXT.md`, verwenden Testnamen dessen Begriffe. Ein Test,
der die Projekt-Sprache spricht, ist für den nächsten Leser ohne Umweg
verständlich.

## Seams — wo geprüft wird

Ein **Seam** ist die Schnittstelle, an der Verhalten beobachtbar ist, ohne
hineinzugreifen. Tests sitzen dort, nie an Interna.

**Der Seam wird vorher vereinbart.** Vor dem ersten Test wird festgehalten,
an welchen Nähten geprüft wird, und der User bestätigt sie. Kein Test an
einer nicht bestätigten Naht.

Der Grund ist nicht Formalismus: man kann nicht alles testen. Die Naht
vorher zu benennen, ist der Mechanismus, mit dem der Aufwand auf die
kritischen Pfade und die komplexe Logik fällt statt auf jeden Randfall.
Ohne diese Absprache entscheidet der Zufall der Reihenfolge.

## Drei Anti-Muster

- **Implementation-gekoppelt** — der Test mockt interne Mitspieler, prüft
  private Methoden oder beobachtet über einen Seitenkanal (fragt die
  Datenbank ab, statt die Schnittstelle zu benutzen). Erkennungszeichen: er
  bricht beim Refactoring, obwohl sich das Verhalten nicht geändert hat.
- **Tautologisch** — die Erwartung wird so berechnet, wie der Code sie
  berechnet (`expect(add(a, b)).toBe(a + b)`, ein von Hand nach derselben
  Regel erzeugter Snapshot). Der Test kann dem Code nie widersprechen, weil
  er ihn wiederholt. Erwartungswerte kommen aus einer **unabhängigen**
  Quelle: ein bekannter Wert, ein durchgerechnetes Beispiel, die Spec.
- **Horizontal geschnitten** — erst alle Tests, dann alle Implementierung.
  Solche Tests prüfen *ausgedachtes* Verhalten: man legt die Form der Sache
  fest, bevor man sie verstanden hat, und die Tests werden unempfindlich
  gegen echte Änderungen. Stattdessen **vertikal**: ein Test, eine
  Implementierung, wiederholen — jeder Test eine Sonde, die auf das
  reagiert, was der letzte Zyklus gezeigt hat.

## Regeln der Schleife

- **Rot vor grün.** Erst der fehlschlagende Test, dann genau so viel Code,
  wie ihn grün macht. Nichts vorwegnehmen, was ein späterer Test verlangt.
- **Eine Scheibe pro Zyklus.** Ein Seam, ein Test, eine minimale
  Implementierung.
- **Refactoring gehört nicht in die Schleife**, sondern in den Review
  (Stufe 6b). In der Schleife verwischt es die Grenze zwischen „grün, weil
  es funktioniert" und „grün, weil es umgebaut wurde".
