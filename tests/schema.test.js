// Tests du schéma de câblage (étape 12).
const test = require("node:test");
const assert = require("node:assert/strict");
const Sc = require("../site/js/schema.js");

test("broches : Uno et micro:bit, noms normalisés, rails de la platine", () => {
  assert.ok(Sc.positionBroche("uno", "d2"));
  assert.ok(Sc.positionBroche("uno", "3.3V"));
  assert.equal(Sc.positionBroche("uno", "P0"), null);
  assert.ok(Sc.positionBroche("microbit", "P0"));
  assert.equal(Sc.positionBroche("microbit", "D2"), null);
  assert.ok(Sc.positionBroche("uno", "Rail − de la platine", 300));
  assert.equal(Object.keys(Sc.brochesCarte("uno")).length, 24);
});

test("schéma : un fil par ligne reliée, un point par ligne du composant", () => {
  const svg = Sc.schemaSvg({ carte: "uno", composants: [{ id: "bouton", nom: "Bouton", type: "capteur" }, { id: "servomoteur", nom: "Servomoteur", type: "actionneur" }],
    branchements: [{ composant: "bouton", brocheComposant: "1", brocheCarte: "D2", fil: "jaune" }, { composant: "bouton", brocheComposant: "2", brocheCarte: "GND", fil: "noir" },
      { composant: "servomoteur", brocheComposant: "signal", brocheCarte: "" }] });
  assert.equal((svg.match(/class="schema-fil"/g) || []).length, 2);
  assert.equal((svg.match(/class="schema-point/g) || []).length, 3);
  assert.equal((svg.match(/schema-point relie/g) || []).length, 2);
  assert.ok(svg.includes('data-broche="D2"') && svg.includes("Arduino Uno"));
});

test("schéma : les capteurs intégrés de la micro:bit ne sont pas dessinés ; texte échappé", () => {
  const svg = Sc.schemaSvg({ carte: "microbit", composants: [{ id: "microbit-lumiere", nom: "Lumière", integre: true }, { id: "x", nom: "<b>LED</b>" }], branchements: [] });
  assert.ok(!svg.includes("microbit-lumiere"));
  assert.ok(!svg.includes("<b>") && svg.includes("&lt;b&gt;"));
});

test("couleur du fil d'après le texte du tableau", () => {
  assert.equal(Sc.couleurFil("Fil rouge"), "#d9534f");
  assert.equal(Sc.couleurFil(""), "#c9a227");
});

test("positions par défaut : celles déjà placées sont gardées", () => {
  const p = Sc.positionsParDefaut([{ id: "a" }, { id: "b" }], { b: { x: 10, y: 20 } });
  assert.deepEqual(p.b, { x: 10, y: 20 });
  assert.ok(p.a.x > 500);
});
