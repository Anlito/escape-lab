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

// --- Bibliothèque (étape 6) ---

test("bibliothèque : seuls les liens web sont acceptés", () => {
  assert.ok(O.lienValide("https://www.canva.com/design/abc"));
  assert.ok(O.lienValide("http://exemple.fr"));
  assert.ok(!O.lienValide("javascript:alert(1)"));
  assert.ok(!O.lienValide("file:///C:/secret.txt"));
  assert.ok(!O.lienValide("https://"));
});

test("bibliothèque : nom de fichier stocké sûr", () => {
  assert.equal(O.nomFichierStocke("b123", "Plan du Foyer.PNG"), "b123.png");
  assert.equal(O.nomFichierStocke("b123", "../../x"), "b123");
});

test("bibliothèque : genre de fichier pour l'aperçu", () => {
  assert.equal(O.genreDeFichier("image/png"), "image");
  assert.equal(O.genreDeFichier("application/pdf"), "pdf");
  assert.equal(O.genreDeFichier("video/mp4"), "video");
  assert.equal(O.genreDeFichier("application/zip"), "");
});

test("bibliothèque : étiquettes sans doublon, suggestions toujours proposées", () => {
  assert.deepEqual(O.lireEtiquettes("Son, décor ; son,, "), ["son", "décor"]);
  const toutes = O.etiquettesDe([{ valeur: { etiquettes: ["ambiance"] } }]);
  assert.ok(toutes.includes("ambiance") && toutes.includes("indice"));
});

test("bibliothèque : recherche et filtres, corbeille à part", () => {
  const el = (id, le, v) => ({ id, le, valeur: v });
  const liste = [
    el("1", 1, { type: "note", titre: "Ambiance sonore", etiquettes: ["son"], groupe: "A" }),
    el("2", 3, { type: "lien", titre: "Affiche Canva", url: "https://canva.com/x", etiquettes: ["décor"] }),
    el("3", 2, { type: "note", titre: "Vieille idée", corbeille: true })
  ];
  assert.deepEqual(O.filtrerBibliotheque(liste, {}).map(e => e.id), ["2", "1"]);
  assert.deepEqual(O.filtrerBibliotheque(liste, { recherche: "SONORE" }).map(e => e.id), ["1"]);
  assert.deepEqual(O.filtrerBibliotheque(liste, { recherche: "decor" }).map(e => e.id), ["2"]);
  assert.deepEqual(O.filtrerBibliotheque(liste, { type: "note" }).map(e => e.id), ["1"]);
  assert.deepEqual(O.filtrerBibliotheque(liste, { groupe: "A" }).map(e => e.id), ["1"]);
  assert.deepEqual(O.filtrerBibliotheque(liste, { corbeille: true }).map(e => e.id), ["3"]);
});

test("bibliothèque : deux modifications du même élément, rien n'est perdu", () => {
  const r = O.fusionnerElementBiblio(
    { type: "note", titre: "Sons", texte: "Porte qui grince", etiquettes: ["son"] },
    { type: "note", titre: "Bruitages", texte: "Alarme", etiquettes: ["indice"] });
  assert.deepEqual(r.etiquettes, ["son", "indice"]);
  assert.ok(r.texte.includes("Porte qui grince") && r.texte.includes("Alarme") && r.texte.includes("Bruitages"));
  assert.equal(r.titre, "Sons");
});

test("bibliothèque : taille lisible", () => {
  assert.equal(O.tailleLisible(2048), "2 ko");
  assert.equal(O.tailleLisible(5 * 1024 * 1024), "5,0 Mo");
});
