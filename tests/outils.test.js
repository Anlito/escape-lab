// Tests des fonctions communes (étape 5 : histoire et frise).
const test = require("node:test");
const assert = require("node:assert/strict");
const O = require("../site/js/outils.js");

test("mise en forme : titres, listes, gras, paragraphes", () => {
  assert.equal(O.miseEnForme("## Le lieu\nLe **foyer**.\n\n- un\n- deux"),
    "<h4>Le lieu</h4><p>Le <strong>foyer</strong>.</p><ul><li>un</li><li>deux</li></ul>");
});

test("mise en forme : une balise écrite par un élève n'est jamais interprétée", () => {
  const html = O.miseEnForme('<img src=x onerror="alert(1)"> **<b>x</b>**');
  assert.ok(!html.includes("<img"));
  assert.ok(!html.includes("<b>"));
  assert.ok(html.includes("&lt;img"));
});

test("combiner deux textes : rien n'est perdu, pas de doublon", () => {
  const r = O.combinerTextes({ texte: "Version de Léa", lieu: "Foyer" }, { texte: "Version de Tom", lieu: "Foyer" }, ["texte", "lieu"]);
  assert.equal(r.texte, "Version de Léa\n\nVersion de Tom");
  assert.equal(r.lieu, "Foyer");
  assert.equal(O.combinerTextes({ texte: "" }, { texte: "Seul" }, ["texte"]).texte, "Seul");
  assert.equal(O.combinerTextes({ texte: "A puis B" }, { texte: "B" }, ["texte"]).texte, "A puis B");
});

test("nom de l'auteur", () => {
  assert.equal(O.nomAuteur({ prenom: "Léa", groupe: "B" }), "Léa (groupe B)");
  assert.equal(O.nomAuteur({ prof: true }), "le professeur");
  assert.equal(O.nomAuteur(null), "quelqu'un");
});

test("frise : liaisons entre énigmes voisines", () => {
  assert.deepEqual(O.liaisonsDeLOrdre(["C", "A", "D"]), ["C-A", "A-D"]);
  assert.deepEqual(O.liaisonsDeLOrdre(["A"]), []);
});

test("frise : déplacer une énigme, sans sortir de la liste", () => {
  assert.deepEqual(O.deplacer(["A", "B", "C"], 2, -1), ["A", "C", "B"]);
  assert.deepEqual(O.deplacer(["A", "B", "C"], 0, -1), ["A", "B", "C"]);
  const ordre = ["A", "B"];
  O.deplacer(ordre, 0, 1);
  assert.deepEqual(ordre, ["A", "B"]);
});

test("frise : durée totale, 12 min par défaut", () => {
  assert.deepEqual(O.dureeTotale(["A", "B", "C"], { A: 15, B: 0 }, 12), { total: 39, parDefaut: 2 });
});

test("frise : description d'un changement d'ordre", () => {
  assert.equal(O.decrireChangementOrdre([], ["A", "B"]), "Premier ordre : A → B");
  assert.equal(O.decrireChangementOrdre(["A", "B"], ["B", "A", "C"]), "A → B  devient  B → A → C · ajouté : C");
});
