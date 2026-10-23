// Référentiels rédigés par le professeur (brief §8.3, §11.1) : fiches mécaniques et bibliothèque de composants.
// Les ébauches du site (donnees/mecaniques.js, donnees/composants.js) servent de départ ; une fiche modifiée par le
// professeur est enregistrée dans chaque dossier de classe (collections « mecaniques » et « composants ») et
// remplace l'ébauche pour cette classe. Ici : règles sans accès aux fichiers (testées avec node:test).
(function (racine) {
  "use strict";

  var ID = /^[a-z0-9][a-z0-9-]{1,30}$/;
  var COULEUR = /^#[0-9a-fA-F]{6}$/;
  var TYPES_COMPOSANT = ["capteur", "actionneur", "afficheur", "saisie"];
  var FORMAT_EXPORT = "escape-lab/fiche";

  // Problèmes d'une fiche mécanique, décrits pour le professeur (liste vide si tout va bien).
  // autres : les autres mécaniques (pour éviter deux fois la même lettre ou la même couleur).
  function verifierMecanique(m, autres) {
    var p = [];
    if (!ID.test(m.id || "")) p.push("Identifiant : minuscules, chiffres et tirets (2 à 31 signes), par exemple « lettre-miroir ».");
    if (!String(m.nom || "").trim()) p.push("Il manque le nom de la mécanique.");
    if (!/^\S{1,2}$/.test(m.lettre || "")) p.push("La lettre de la pastille : un ou deux signes.");
    if (!COULEUR.test(m.couleur || "")) p.push("La couleur de la pastille doit être choisie.");
    (autres || []).forEach(function (a) {
      if (a.id === m.id) return;
      if (a.lettre && a.lettre === m.lettre) p.push("La lettre « " + m.lettre + " » est déjà celle de « " + a.nom + " » : la pastille ne doit pas reposer sur la couleur seule.");
      if (a.couleur && m.couleur && a.couleur.toLowerCase() === m.couleur.toLowerCase()) p.push("Cette couleur est déjà celle de « " + a.nom + " ».");
    });
    return p;
  }

  function verifierComposant(c) {
    var p = [];
    if (!ID.test(c.id || "")) p.push("Identifiant : minuscules, chiffres et tirets (2 à 31 signes), par exemple « capteur-ultrason ».");
    if (!String(c.nom || "").trim()) p.push("Il manque le nom du composant.");
    if (TYPES_COMPOSANT.indexOf(c.type) === -1) p.push("Choisis le type : capteur, actionneur, afficheur ou saisie.");
    if (c.valideParProf && JSON.stringify(c).indexOf("⚠️") !== -1) p.push("La fiche contient encore « ⚠️ à vérifier » : complète-la avant de la valider.");
    return p;
  }

  // Liste fusionnée : les ébauches du site, remplacées par les fiches du dossier quand elles existent.
  function fusionnerReferentiel(ebauches, duDossier) {
    var parId = {};
    ebauches.forEach(function (x) { parId[x.id] = { valeur: x, source: "ebauche" }; });
    duDossier.forEach(function (el) { parId[el.id] = { valeur: el.valeur, source: "dossier", element: el }; });
    return Object.keys(parId).map(function (id) { return parId[id]; })
      .sort(function (a, b) { return String(a.valeur.nom || "").localeCompare(String(b.valeur.nom || ""), "fr"); });
  }

  function exporter(genre, valeur) {
    return JSON.stringify({ format: FORMAT_EXPORT, version: 1, genre: genre, fiche: valeur }, null, 2);
  }

  // Lit un fichier exporté (ou une fiche seule) ; renvoie { genre, fiche } ou { erreur }.
  function importer(texte, genreAttendu) {
    var d;
    try { d = JSON.parse(texte); } catch (e) { return { erreur: "Ce fichier n'est pas une fiche Escape Lab (.json illisible)." }; }
    if (d && d.format === FORMAT_EXPORT) {
      if (genreAttendu && d.genre !== genreAttendu) return { erreur: "Ce fichier contient une fiche « " + d.genre + " », pas une fiche « " + genreAttendu + " »." };
      return { genre: d.genre, fiche: d.fiche };
    }
    if (d && d.id && d.nom) return { genre: genreAttendu, fiche: d };
    return { erreur: "Ce fichier n'est pas une fiche Escape Lab." };
  }

  var EscapeLabReferentiels = {
    verifierMecanique: verifierMecanique, verifierComposant: verifierComposant, fusionnerReferentiel: fusionnerReferentiel,
    exporter: exporter, importer: importer, TYPES_COMPOSANT: TYPES_COMPOSANT
  };
  if (typeof module !== "undefined" && module.exports) module.exports = EscapeLabReferentiels;
  else racine.EscapeLabReferentiels = EscapeLabReferentiels;
})(this);
