// Tests de la couche de stockage et de la synchronisation (brief §15, étape 3).
const test = require("node:test");
const assert = require("node:assert/strict");
const S = require("../site/js/stockage.js");

// Horloge qui avance d'une seconde à chaque appel : versions ordonnées et reproductibles.
function creerHorloge() { let t = Date.UTC(2026, 10, 2, 8, 0, 0); return () => (t += 1000); }

function creerDepot(nom, horloge) {
  const adaptateur = S.creerAdaptateurMemoire();
  return { adaptateur, stockage: S.creerStockage(adaptateur, { depot: nom, horloge }) };
}

const lea = { groupe: "B", prenom: "Léa" };
const tom = { groupe: "D", prenom: "Tom" };

test("enregistrer puis lire un élément", async () => {
  const { stockage } = creerDepot("3C1", creerHorloge());
  const r = await stockage.enregistrer("histoire", "pitch", "Un savant a disparu.", null, lea);
  assert.equal(r.ok, true);
  const lu = await stockage.lire("histoire", "pitch");
  assert.equal(lu.valeur, "Un savant a disparu.");
  assert.deepEqual(lu.auteur, lea);
  assert.equal(lu.depot, "3C1");
});

test("deux enregistrements à partir de la même lecture : le second est refusé, rien n'est écrasé", async () => {
  const { stockage } = creerDepot("3C1", creerHorloge());
  const v1 = (await stockage.enregistrer("histoire", "fin", "Texte de départ", null, lea)).element;
  const r1 = await stockage.enregistrer("histoire", "fin", "Version de Léa", v1.vid, lea);
  const r2 = await stockage.enregistrer("histoire", "fin", "Version de Tom", v1.vid, tom);
  assert.equal(r1.ok, true);
  assert.equal(r2.ok, false);
  assert.equal(r2.conflit, true);
  assert.equal(r2.actuel.valeur, "Version de Léa");
  assert.equal((await stockage.lire("histoire", "fin")).valeur, "Version de Léa");
  // Garder les deux textes : Tom enregistre à partir de la version actuelle.
  const r3 = await stockage.enregistrer("histoire", "fin", "Version de Léa\n\nVersion de Tom", r2.actuel.vid, tom);
  assert.equal(r3.ok, true);
});

test("créer un élément qui existe déjà est refusé", async () => {
  const { stockage } = creerDepot("3C1", creerHorloge());
  await stockage.enregistrer("annonces", "a1", "Bonjour", null, lea);
  const r = await stockage.enregistrer("annonces", "a1", "Autre", null, tom);
  assert.equal(r.ok, false);
});

test("sections différentes : deux élèves ne se gênent pas", async () => {
  const { stockage } = creerDepot("3C1", creerHorloge());
  await stockage.enregistrer("histoire", "lieu", "Le foyer", null, lea);
  await stockage.enregistrer("histoire", "personnages", "Le Dr Vega", null, tom);
  const tous = await stockage.lister("histoire");
  assert.deepEqual(tous.map(e => e.id).sort(), ["lieu", "personnages"]);
});

test("historique et restauration : restaurer crée une nouvelle version, rien n'est supprimé", async () => {
  const { stockage } = creerDepot("3C1", creerHorloge());
  const v1 = (await stockage.enregistrer("histoire", "pitch", "A", null, lea)).element;
  const v2 = (await stockage.enregistrer("histoire", "pitch", "B", v1.vid, tom)).element;
  await stockage.enregistrer("histoire", "pitch", "C (fausse manœuvre)", v2.vid, tom);
  const r = await stockage.restaurer("histoire", "pitch", v1.vid, lea);
  assert.equal(r.ok, true);
  assert.equal((await stockage.lire("histoire", "pitch")).valeur, "A");
  const versions = await stockage.historique("histoire", "pitch");
  assert.deepEqual(versions.map(v => v.valeur), ["A", "B", "C (fausse manœuvre)", "A"]);
});

test("identifiant non valable refusé (pas de chemin dans un identifiant)", async () => {
  const { stockage } = creerDepot("3C1", creerHorloge());
  await assert.rejects(stockage.enregistrer("histoire", "../x", "?", null, lea));
});

test("ancien fichier sans lignée toujours lisible", async () => {
  const { adaptateur, stockage } = creerDepot("3C1", creerHorloge());
  adaptateur.fichiers["histoire/vieux.json"] = JSON.stringify({ id: "vieux", vid: "v0", valeur: "ancien" });
  const lu = await stockage.lire("histoire", "vieux");
  assert.equal(lu.valeur, "ancien");
  assert.deepEqual(lu.lignee, ["v0"]);
});

// --- Synchronisation 3C2D1 ---

function contenus(adaptateur) {
  const copie = {};
  for (const [chemin, valeur] of Object.entries(adaptateur.fichiers)) copie[chemin] = valeur;
  return copie;
}

// Toutes les valeurs enregistrées doivent se retrouver dans l'historique des deux dossiers.
async function valeursHistoriques(stockage, collection, id) {
  return (await stockage.historique(collection, id)).map(v => v.valeur);
}

test("synchronisation : modifications des deux côtés, conflit volontaire, dossiers identiques, aucune perte", async () => {
  const horloge = creerHorloge();
  const c = creerDepot("3C2", horloge), d = creerDepot("3D1", horloge);

  // Départ commun : le professeur crée l'histoire, puis synchronise.
  await c.stockage.enregistrer("histoire", "pitch", "Pitch de départ", null, { prof: true });
  await c.stockage.enregistrer("histoire", "fin", "Fin de départ", null, { prof: true });
  await S.synchroniser(c.adaptateur, d.adaptateur, { horloge });
  assert.deepEqual(contenus(c.adaptateur), contenus(d.adaptateur));

  // Entre deux synchronisations :
  const pitchC = await c.stockage.lire("histoire", "pitch");
  await c.stockage.enregistrer("histoire", "pitch", "Pitch modifié en 3C2", pitchC.vid, lea);   // un seul côté
  const finC = await c.stockage.lire("histoire", "fin"), finD = await d.stockage.lire("histoire", "fin");
  await c.stockage.enregistrer("histoire", "fin", "Fin version 3C2", finC.vid, lea);           // les deux côtés
  await d.stockage.enregistrer("histoire", "fin", "Fin version 3D1", finD.vid, tom);
  await d.stockage.enregistrer("groupes", "D", { nom: "Énigme du morse" }, null, tom);         // nouveau, côté D
  await c.stockage.ecrireFichier("bibliotheque", "plan.png", new Uint8Array([1, 2, 3]));       // fichier, côté C

  // Aperçu : rien n'est écrit.
  const avant = contenus(c.adaptateur);
  const apercu = await S.synchroniser(c.adaptateur, d.adaptateur, { horloge, simuler: true });
  assert.deepEqual(contenus(c.adaptateur), avant);
  assert.deepEqual(apercu.conflits, ["histoire/fin.json"]);
  assert.ok(apercu.versB.includes("histoire/pitch.json"));
  assert.ok(apercu.versA.includes("groupes/D.json"));
  assert.ok(apercu.versB.includes("bibliotheque/fichiers/plan.png"));

  // Exécution.
  const rapport = await S.synchroniser(c.adaptateur, d.adaptateur, { horloge });
  assert.deepEqual(rapport.conflits, ["histoire/fin.json"]);
  assert.deepEqual(contenus(c.adaptateur), contenus(d.adaptateur));

  assert.equal((await d.stockage.lire("histoire", "pitch")).valeur, "Pitch modifié en 3C2");
  assert.equal((await c.stockage.lire("groupes", "D")).valeur.nom, "Énigme du morse");
  assert.deepEqual([...(await d.stockage.lireFichier("bibliotheque", "plan.png"))], [1, 2, 3]);

  // Conflit : les deux textes sont gardés, le plus récent en valeur, l'autre en attente du professeur.
  const fin = await c.stockage.lire("histoire", "fin");
  assert.equal(fin.valeur, "Fin version 3D1");
  assert.deepEqual(fin.conflit.map(v => v.valeur), ["Fin version 3C2"]);
  for (const depot of [c, d]) {
    const valeurs = await valeursHistoriques(depot.stockage, "histoire", "fin");
    for (const attendu of ["Fin de départ", "Fin version 3C2", "Fin version 3D1"]) assert.ok(valeurs.includes(attendu));
  }

  // Le professeur tranche : nouvelle version normale, le conflit disparaît.
  const tranche = await c.stockage.enregistrer("histoire", "fin", "Fin fusionnée", fin.vid, { prof: true });
  assert.equal(tranche.ok, true);
  assert.equal((await c.stockage.lire("histoire", "fin")).conflit, undefined);

  // Une nouvelle synchronisation recopie la décision sans nouveau conflit.
  const r2 = await S.synchroniser(c.adaptateur, d.adaptateur, { horloge });
  assert.deepEqual(r2.conflits, []);
  assert.equal((await d.stockage.lire("histoire", "fin")).valeur, "Fin fusionnée");
  assert.deepEqual(contenus(c.adaptateur), contenus(d.adaptateur));
});

test("synchronisation sans changement : rien à copier", async () => {
  const horloge = creerHorloge();
  const c = creerDepot("3C2", horloge), d = creerDepot("3D1", horloge);
  await c.stockage.enregistrer("frise", "ordre", ["A", "B"], null, { prof: true });
  await S.synchroniser(c.adaptateur, d.adaptateur, { horloge });
  const r = await S.synchroniser(c.adaptateur, d.adaptateur, { horloge, simuler: true });
  assert.deepEqual([r.versA, r.versB, r.conflits], [[], [], []]);
});

test("synchronisation : chaque dépôt garde un journal", async () => {
  const horloge = creerHorloge();
  const c = creerDepot("3C2", horloge), d = creerDepot("3D1", horloge);
  await c.stockage.enregistrer("annonces", "a1", "Séance 3 : test croisé", null, { prof: true });
  await S.synchroniser(c.adaptateur, d.adaptateur, { horloge });
  const journal = Object.keys(d.adaptateur.fichiers).filter(ch => ch.startsWith("synchronisation/journal/"));
  assert.equal(journal.length, 1);
  assert.deepEqual(JSON.parse(d.adaptateur.fichiers[journal[0]]).versB, [
    "annonces/a1.json", "annonces/historique/a1/" + (await c.stockage.lire("annonces", "a1")).vid + ".json"
  ]);
});
