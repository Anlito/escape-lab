// Tests des règles de l'évaluation (étape 11).
const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../site/js/evaluation-regles.js");

const NIVEAUX = [{ id: "n1", lettre: "A", points: 0 }, { id: "n2", lettre: "B", points: 1 }, { id: "n3", lettre: "C", points: 2 }, { id: "n4", lettre: "D", points: 3 }];
const CRITERES = [
  { id: "fiche", bloc: "Livrables", portee: "groupe", coefficient: 2 },
  { id: "objet", bloc: "Livrables", portee: "groupe", coefficient: 1 },
  { id: "autonomie", bloc: "Comportement", portee: "individuel", coefficient: 1 }
];

test("note /20 : tout en D donne 20, tout en C donne 13,3", () => {
  assert.equal(E.noteSur20(CRITERES, NIVEAUX, { fiche: "n4", objet: "n4", autonomie: "n4" }).note, 20);
  assert.equal(E.noteSur20(CRITERES, NIVEAUX, { fiche: "n3", objet: "n3", autonomie: "n3" }).note, 13.3);
});

test("note /20 : un critère non observé ne compte pas (ni A, ni zéro)", () => {
  const r = E.noteSur20(CRITERES, NIVEAUX, { fiche: "n4" });
  assert.deepEqual([r.note, r.observes, r.complete], [20, 1, false]);
  assert.equal(E.noteSur20(CRITERES, NIVEAUX, {}).note, null);
});

test("note /20 : les coefficients pèsent", () => {
  // fiche D (3×2) + objet A (0×1) = 6 sur 9 → 13,3
  assert.equal(E.noteSur20(CRITERES, NIVEAUX, { fiche: "n4", objet: "n1" }).note, 13.3);
});

test("saisies d'un élève : le groupe, sauf ajustement individuel explicite", () => {
  assert.deepEqual(E.saisiesEleve(CRITERES, { fiche: "n3", objet: "n2", autonomie: "n4" }, { objet: "n4", autonomie: "n2" }),
    { fiche: "n3", objet: "n4", autonomie: "n2" });
});

test("observations par séance : niveau moyen", () => {
  assert.equal(E.niveauMoyen(NIVEAUX, ["n2", "n4", "n4"]), "n3");
  assert.equal(E.niveauMoyen(NIVEAUX, []), null);
});

test("appréciation : tranche de note puis une phrase par bloc observé", () => {
  const modeles = { parNote: [{ min: 0, max: 10, texte: "À consolider." }, { min: 10, max: 20, texte: "Bon travail." }],
    parBloc: { Livrables: { fort: "Livrables solides.", aTravailler: "Livrables à compléter." }, Comportement: { fort: "Autonome.", aTravailler: "Autonomie à gagner." } } };
  assert.equal(E.appreciation(CRITERES, NIVEAUX, { fiche: "n4", objet: "n4", autonomie: "n1" }, modeles), "Bon travail. Livrables solides. Autonomie à gagner.");
  assert.equal(E.appreciation(CRITERES, NIVEAUX, { fiche: "n4", objet: "n4", autonomie: "n4" }, modeles), "Bon travail. Livrables solides. Autonome.");
  assert.equal(E.appreciation(CRITERES, NIVEAUX, {}, modeles), "");
});

test("CSV : point-virgule, virgule décimale, guillemets", () => {
  assert.equal(E.csv([["Prénom", "Note"], ["Léa", 13.3], ['Dit "oui"; non', null]]),
    "﻿Prénom;Note\r\nLéa;13,3\r\n\"Dit \"\"oui\"\"; non\";\r\n");
});
