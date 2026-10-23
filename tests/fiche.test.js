// Tests des règles de la fiche énigme (étape 7).
const test = require("node:test");
const assert = require("node:assert/strict");
const F = require("../site/js/fiche-regles.js");

test("chemins : lire et écrire un champ imbriqué", () => {
  const o = {};
  F.ecrireChemin(o, "n1.texte", "Regardez la grille");
  assert.equal(F.lireChemin(o, "n1.texte"), "Regardez la grille");
  assert.equal(F.lireChemin(o, "n2.texte"), undefined);
});

test("fusion : deux membres sur deux champs différents, les deux modifications restent", () => {
  const base = { scenario: "A", solution: "" };
  const actuel = { scenario: "A", solution: "Le mot LUNE" };       // Léa a écrit la solution
  const mien = { scenario: "Les joueurs entrent", solution: "" };  // Tom a écrit le scénario
  const r = F.fusionner(base, actuel, mien);
  assert.deepEqual(r.valeur, { scenario: "Les joueurs entrent", solution: "Le mot LUNE" });
  assert.deepEqual(r.signales, []);
});

test("fusion : le même texte modifié des deux côtés, les deux textes sont gardés", () => {
  const r = F.fusionner({ n1: { texte: "" } }, { n1: { texte: "Version Léa" } }, { n1: { texte: "Version Tom" } });
  assert.equal(r.valeur.n1.texte, "Version Léa\n\nVersion Tom");
});

test("fusion : une liste modifiée des deux côtés est signalée", () => {
  const r = F.fusionner({ lignes: [] }, { lignes: [{ element: "carton" }] }, { lignes: [{ element: "PVC" }] });
  assert.deepEqual(r.valeur.lignes, [{ element: "PVC" }]);
  assert.deepEqual(r.signales, ["lignes"]);
});

const COMPOSANTS = {
  bouton: { id: "bouton", type: "capteur" }, servomoteur: { id: "servomoteur", type: "actionneur" },
  relais: { id: "relais", type: "actionneur" }, electroaimant: { id: "electroaimant", type: "actionneur" }
};

test("jalons : fiche vide, tout est à faire", () => {
  const j = F.calculerJalons({}, {});
  assert.equal(j.scenario, "à faire");
  assert.equal(j.indices, "à faire");
  assert.equal(j.M1, "à faire");
});

test("jalons : calculés depuis le contenu", () => {
  const j = F.calculerJalons({
    mecanique: { compris: true },
    enigme: { scenario: "…", solution: "LUNE", codeCadenas: "", matiere: "Mathématiques", lienMatiere: "Nous utilisons le repérage sur une grille du plan." },
    materiel: { lignes: [{ element: "Grille" }] },
    electronique: { composants: ["bouton", "servomoteur"], branchements: [{ composant: "bouton" }] },
    indices: { n1: { texte: "a", talkie: "a" }, n2: { texte: "b" }, n3: { texte: "c", talkie: "c" } },
    fabrication: { M1: { description: "Affiche", pret: true }, M2: { description: "Plateau" } }
  }, { composants: COMPOSANTS, avisRecus: 1 });
  assert.equal(j.mecanique, "fait");
  assert.equal(j.scenario, "en cours");     // il manque le code du cadenas
  assert.equal(j.matiere, "fait");
  assert.equal(j.materiel, "fait");
  assert.equal(j.choixE1, "fait");
  assert.equal(j.cablage, "en cours");
  assert.equal(j.indices, "en cours");
  assert.equal(j.M1, "fait");
  assert.equal(j.M2, "en cours");
  assert.equal(j.M3, "à faire");
  assert.equal(j.test, "fait");
});

test("indices : ce qui manque encore", () => {
  assert.deepEqual(F.manquesIndices({ n1: { texte: "a", talkie: "b" }, n2: { texte: "c" } }),
    [{ id: "talkieManquant", niveau: 2 }, { id: "indiceManquant3", niveau: 3 }]);
});

test("câblage : même broche, broche absente, masse, capteur et actionneur", () => {
  const ids = (r) => r.map((x) => x.id).sort();
  assert.deepEqual(ids(F.controlesCablage("uno", [COMPOSANTS.bouton, COMPOSANTS.servomoteur], [
    { composant: "bouton", brocheCarte: "D2" }, { composant: "servomoteur", brocheCarte: "d2" },
    { composant: "bouton", brocheCarte: "GND" }, { composant: "servomoteur", brocheCarte: "GND" }
  ])), ["memeBroche"]);
  assert.deepEqual(ids(F.controlesCablage("uno", [COMPOSANTS.bouton], [{ composant: "bouton", brocheCarte: "D22" }])),
    ["actionneurManquant", "brocheIndisponible", "masseCommune"]);
  assert.deepEqual(ids(F.controlesCablage("uno", [COMPOSANTS.servomoteur], [{ composant: "servomoteur", brocheCarte: "D1" }, { composant: "servomoteur", brocheCarte: "GND" }])),
    ["brochesEnvoi", "capteurManquant"]);
  assert.deepEqual(ids(F.controlesCablage("microbit", [COMPOSANTS.bouton], [{ composant: "bouton", brocheCarte: "D2" }, { composant: "bouton", brocheCarte: "GND" }])),
    ["actionneurManquant", "brocheIndisponible"]);
});

test("câblage : toute charge 12 V affiche la règle de sécurité", () => {
  const r = F.controlesCablage("uno", [COMPOSANTS.bouton, COMPOSANTS.relais, COMPOSANTS.electroaimant], []);
  assert.ok(r.some((x) => x.id === "douzeVoltsSansRelais") && r.some((x) => x.id === "validationProfAvantTension"));
  assert.ok(!F.controlesCablage("uno", [COMPOSANTS.bouton], []).some((x) => x.id === "douzeVoltsSansRelais"));
});
