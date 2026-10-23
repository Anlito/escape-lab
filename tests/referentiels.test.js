// Tests des fiches mécaniques et composants rédigées par le professeur (étape 9).
const test = require("node:test");
const assert = require("node:assert/strict");
const R = require("../site/js/referentiels.js");

const morse = { id: "morse", nom: "Morse", lettre: "M", couleur: "#ffd37f" };

test("mécanique complète : aucun problème", () => {
  assert.deepEqual(R.verifierMecanique({ id: "lettre-miroir", nom: "Lettre-miroir", lettre: "L", couleur: "#aabbcc" }, [morse]), []);
});

test("mécanique : identifiant, nom, lettre et couleur vérifiés", () => {
  const p = R.verifierMecanique({ id: "Lettre Miroir", nom: " ", lettre: "", couleur: "rouge" }, []);
  assert.equal(p.length, 4);
});

test("mécanique : même lettre ou même couleur qu'une autre signalée", () => {
  const p = R.verifierMecanique({ id: "miroir", nom: "Miroir", lettre: "M", couleur: "#FFD37F" }, [morse]);
  assert.equal(p.length, 2);
  assert.ok(p[0].includes("Morse"));
  assert.deepEqual(R.verifierMecanique(morse, [morse]), []); // elle-même ne compte pas
});

test("composant : type obligatoire, pas de validation avec « à vérifier »", () => {
  assert.deepEqual(R.verifierComposant({ id: "bouton", nom: "Bouton", type: "capteur" }), []);
  assert.equal(R.verifierComposant({ id: "bouton", nom: "Bouton", type: "moteur" }).length, 1);
  assert.equal(R.verifierComposant({ id: "bouton", nom: "Bouton", type: "capteur", valideParProf: true, tension: "⚠️ à vérifier" }).length, 1);
});

test("référentiel : la fiche du dossier remplace l'ébauche du site", () => {
  const liste = R.fusionnerReferentiel([morse, { id: "cesar", nom: "César" }],
    [{ id: "morse", valeur: { id: "morse", nom: "Morse (revu)" } }, { id: "miroir", valeur: { id: "miroir", nom: "Miroir" } }]);
  assert.deepEqual(liste.map(x => x.valeur.nom + "/" + x.source), ["César/ebauche", "Miroir/dossier", "Morse (revu)/dossier"]);
});

test("export puis import d'une fiche", () => {
  const texte = R.exporter("mecanique", morse);
  assert.deepEqual(R.importer(texte, "mecanique"), { genre: "mecanique", fiche: morse });
  assert.ok(R.importer(texte, "composant").erreur);
  assert.ok(R.importer("pas du json", "mecanique").erreur);
  assert.deepEqual(R.importer(JSON.stringify(morse), "mecanique").fiche, morse); // fiche seule acceptée
});
