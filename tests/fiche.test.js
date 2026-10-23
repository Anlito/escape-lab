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

// --- Jour J (étape 8) ---

test("jour J : prénoms d'une case « élève »", () => {
  assert.deepEqual(F.prenomsDe("Léa, Tom et Noé / Inès"), ["lea", "tom", "noe", "ines"]);
  assert.deepEqual(F.prenomsDe(""), []);
});

test("jour J : élèves sans rôle (sans doublon, accents ignorés)", () => {
  const roles = [{ role: "Game Master", eleve: "Lea" }, { role: "Accueil", eleve: "Tom, Noé" }];
  assert.deepEqual(F.elevesSansRole(["Léa", "Tom", "Inès", "Noé", "Inès"], roles), ["Inès"]);
});

test("jour J : jalon J1 d'un groupe", () => {
  const roles = [{ eleve: "Léa", texte: "Bienvenue" }, { eleve: "Tom", texte: "" }];
  assert.equal(F.etatJourJ(["Léa", "Tom"], roles), "en cours");
  assert.equal(F.etatJourJ(["Léa"], roles), "fait");
  assert.equal(F.etatJourJ(["Inès"], roles), "à faire");
  assert.equal(F.etatJourJ([], roles), "à faire");
});

// --- Programme Labo Blocs (étape 10) ---

test("programme : une entrée et une sortie, E1 respecté", () => {
  const r = F.analyserProgramme({ demarrage: [], boucle: [{ bloc: "si_alors", condition: { bloc: "bouton_etat", broche: "D2" }, alors: [{ bloc: "servo_angle", broche: "D5", angle: 90 }] }] });
  assert.deepEqual([r.entrees, r.sorties, r.e1], [["bouton_etat"], ["servo_angle"], true]);
});

test("programme : sortie seule, événement « quand appui », programme vide", () => {
  assert.equal(F.analyserProgramme({ boucle: [{ bloc: "led_etat", broche: "D3" }] }).e1, false);
  assert.equal(F.analyserProgramme([{ quand: "appui", broche: "D2", blocs: [{ bloc: "son" }] }]).e1, true);
  assert.equal(F.analyserProgramme(null).vide, true);
  assert.equal(F.analyserProgramme({ boucle: [{ bloc: "mb_lumiere" }, { bloc: "mb_image" }] }).e1, true);
});

test("programme : forme enregistrée par Labo Blocs (blocs de Blockly)", () => {
  const programme = { blocks: { languageVersion: 0, blocks: [{ type: "demarrage" }, { type: "boucle", inputs: { DO: { block: {
    type: "si_alors", inputs: { CONDITION: { block: { type: "bouton_etat" } }, ALORS: { block: { type: "led_etat" } } } } } } }] } };
  assert.equal(F.analyserProgramme(programme).e1, true);
  assert.equal(F.analyserProgramme({ blocks: { blocks: [{ type: "demarrage" }, { type: "boucle" }] } }).vide, true);
});

// --- Fils et couleurs (règles du 23/10/2026) ---

test("fils : une LED a un signal et un GND, un servomoteur VCC, GND et signal", () => {
  assert.deepEqual(F.filsDuComposant({ id: "led" }).map((f) => f.role), ["signal", "gnd"]);
  assert.deepEqual(F.filsDuComposant({ id: "servomoteur" }).map((f) => f.role), ["vcc", "gnd", "signal"]);
  assert.deepEqual(F.filsDuComposant({ id: "electroaimant" }), []);
  assert.deepEqual(F.filsDuComposant({ id: "inconnu" }).map((f) => f.role), ["signal", "gnd"]);
  assert.deepEqual(F.filsDuComposant({ id: "led", fils: [{ nom: "anode", role: "signal" }] }), [{ nom: "anode", role: "signal" }]);
});

test("fils : couleurs proposées (GND noir, VCC blanc), tout reste à brancher par l'élève", () => {
  const l = F.lignesDuComposant({ id: "servomoteur" }, "uno", []);
  assert.deepEqual(l.map((x) => [x.role, x.brocheCarte, x.fil]), [["vcc", "", "blanc"], ["gnd", "", "noir"], ["signal", "", "orange"]]);
});

test("fils : les signaux de deux composants n'ont pas la même couleur", () => {
  const led = F.lignesDuComposant({ id: "led" }, "uno", []);
  const bouton = F.lignesDuComposant({ id: "bouton" }, "uno", led);
  assert.notEqual(led[0].fil, bouton[0].fil);
  assert.equal(F.lignesDuComposant({ id: "lcd" }, "uno", []).filter((x) => x.role === "signal")[1].fil, "violet");
});

test("contrôles des fils : GND ou VCC oubliés, mauvaise couleur, même couleur de signal", () => {
  const ids = (r) => r.map((x) => x.id).sort();
  const servo = { id: "servomoteur", nom: "Servomoteur" }, led = { id: "led", nom: "LED" };
  assert.deepEqual(ids(F.controlesFils([servo], [
    { composant: "servomoteur", role: "vcc", brocheCarte: "", fil: "blanc" },
    { composant: "servomoteur", role: "gnd", brocheCarte: "", fil: "noir" },
    { composant: "servomoteur", role: "signal", brocheCarte: "D5", fil: "orange" }])), ["filGndManquant", "filVccManquant"]);
  assert.deepEqual(ids(F.controlesFils([led], [
    { composant: "led", role: "signal", brocheCarte: "D3", fil: "jaune" },
    { composant: "led", role: "gnd", brocheCarte: "GND", fil: "rouge" }])), ["couleurGnd"]);
  assert.deepEqual(ids(F.controlesFils([led, { id: "bouton" }], [
    { composant: "led", role: "signal", brocheCarte: "D3", fil: "vert" }, { composant: "led", role: "gnd", brocheCarte: "GND", fil: "noir" },
    { composant: "bouton", role: "signal", brocheCarte: "D2", fil: "vert" }, { composant: "bouton", role: "gnd", brocheCarte: "GND", fil: "noir" }])), ["memeCouleur"]);
});

test("tous les composants ont tous leurs fils, même une fiche ancienne", () => {
  const connus = { bouton: { id: "bouton", nom: "Bouton" }, servomoteur: { id: "servomoteur", nom: "Servomoteur" } };
  const v = { carte: "uno", composants: ["bouton", "servomoteur"], branchements: [
    { composant: "bouton", brocheComposant: "À vérifier sur le modèle réel", brocheCarte: "", fil: "", verifie: false },
    { composant: "servomoteur", brocheComposant: "signal", brocheCarte: "D9", fil: "orange" }] };
  assert.equal(F.completerTousLesFils(v, connus), true);
  const vue = v.branchements.map((b) => [b.composant, b.role, b.brocheCarte]);
  assert.deepEqual(vue, [["servomoteur", "signal", "D9"], ["bouton", "signal", ""], ["bouton", "gnd", ""], ["servomoteur", "vcc", ""], ["servomoteur", "gnd", ""]]);
  assert.equal(v.branchements.find((b) => b.composant === "bouton" && b.role === "gnd").fil, "noir");
  assert.equal(F.completerTousLesFils(v, connus), false); // déjà complet : rien ne change
});

test("rails : le rail − vaut GND, le rail + vaut 5 V ; fil sur le mauvais rail signalé", () => {
  const ids = (r) => r.map((x) => x.id).sort();
  const led = { id: "led", nom: "LED" }, servo = { id: "servomoteur", nom: "Servomoteur" };
  assert.deepEqual(ids(F.controlesFils([led], [
    { composant: "led", role: "signal", brocheCarte: "D3", fil: "vert" }, { composant: "led", role: "gnd", brocheCarte: "Rail − de la platine", fil: "noir" }])), []);
  assert.deepEqual(ids(F.controlesFils([servo], [
    { composant: "servomoteur", role: "vcc", brocheCarte: "Rail − de la platine", fil: "blanc" },
    { composant: "servomoteur", role: "gnd", brocheCarte: "Rail + de la platine", fil: "noir" },
    { composant: "servomoteur", role: "signal", brocheCarte: "5V", fil: "orange" }])), ["filGndManquant", "gndVersPlus", "signalVersAlimentation", "vccVersMoins"]);
  assert.equal(F.controlesCablage("uno", [led], [{ composant: "led", brocheCarte: "Rail − de la platine" }]).some((x) => x.id === "masseCommune"), false);
});
