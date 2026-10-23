// Règles de la fiche énigme (brief §7.6, §11.1), sans accès aux fichiers ni à la page (testées avec node:test) :
// fusion de deux enregistrements, calcul des jalons, contrôles bienveillants du câblage.
(function (racine) {
  "use strict";

  var O = typeof module !== "undefined" && module.exports ? require("./outils.js") : racine.EscapeLabOutils;

  function lireChemin(objet, chemin) {
    return chemin.split(".").reduce(function (o, cle) { return o == null ? undefined : o[cle]; }, objet);
  }

  function ecrireChemin(objet, chemin, valeur) {
    var cles = chemin.split("."), o = objet;
    for (var i = 0; i < cles.length - 1; i++) {
      if (o[cles[i]] == null || typeof o[cles[i]] !== "object") o[cles[i]] = {};
      o = o[cles[i]];
    }
    o[cles[cles.length - 1]] = valeur;
    return objet;
  }

  function pareil(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function estObjet(x) { return x && typeof x === "object" && !Array.isArray(x); }

  // Fusion à trois : base = ce que j'ai ouvert, actuel = ce qui est dans le dossier, mien = ce que j'enregistre.
  // Ce que je n'ai pas touché garde la version du dossier ; ce que seul moi ai changé est repris ; si nous avons
  // changé le même texte, les deux textes sont gardés ; pour une liste ou un nombre, ma version est prise et
  // signalée (l'autre reste dans l'historique).
  function fusionner(base, actuel, mien) {
    var signales = [];
    function f(b, a, m, chemin) {
      if (pareil(m, b)) return a;                 // pas touché par moi
      if (pareil(a, b) || pareil(a, m)) return m; // touché par moi seul (ou pareil des deux côtés)
      if (estObjet(m) && estObjet(a)) {
        var r = {}, cles = {};
        Object.keys(a).concat(Object.keys(m)).forEach(function (k) { cles[k] = true; });
        Object.keys(cles).forEach(function (k) { r[k] = f(estObjet(b) ? b[k] : undefined, a[k], m[k], chemin ? chemin + "." + k : k); });
        return r;
      }
      if (typeof m === "string" && typeof a === "string") return O.combinerTextes({ t: a }, { t: m }, ["t"]).t;
      signales.push(chemin);
      return m;
    }
    var valeur = f(base || {}, actuel || {}, mien || {}, "");
    return { valeur: valeur, signales: signales };
  }

  // --- Jalons (site/donnees/jalons.js) ---

  var A_FAIRE = "à faire", EN_COURS = "en cours", FAIT = "fait";
  function rempli(x) { return x != null && String(x).trim() !== ""; }
  function etat(fait, commence) { return fait ? FAIT : commence ? EN_COURS : A_FAIRE; }

  function compterE1(electronique, composants) {
    var capteurs = 0, actionneurs = 0;
    ((electronique || {}).composants || []).forEach(function (id) {
      var c = composants[id];
      if (!c) return;
      if (c.type === "capteur" || c.type === "saisie") capteurs++;
      if (c.type === "actionneur" || c.type === "afficheur") actionneurs++;
    });
    return { capteurs: capteurs, actionneurs: actionneurs };
  }

  // fiche : { mecanique, enigme, materiel, fabrication, electronique, indices, installation } (un objet par onglet)
  // autres : { avisRecus, composants: { id: fiche composant } }
  function calculerJalons(fiche, autres) {
    fiche = fiche || {}; autres = autres || {};
    var en = fiche.enigme || {}, fab = fiche.fabrication || {}, ind = fiche.indices || {}, ins = fiche.installation || {};
    var elec = fiche.electronique || {}, e1 = compterE1(elec, autres.composants || {});
    var lignesMateriel = ((fiche.materiel || {}).lignes || []).filter(function (l) { return rempli(l.element); });
    // Un niveau compte quand l’indice et sa phrase pour le talkie-walkie sont écrits.
    var indices = ["n1", "n2", "n3"].filter(function (n) { return ind[n] && rempli(ind[n].texte) && rempli(ind[n].talkie); }).length;
    var commences = ["n1", "n2", "n3"].filter(function (n) { return ind[n] && (rempli(ind[n].texte) || rempli(ind[n].talkie)); }).length;
    var jalons = {
      mecanique: etat((fiche.mecanique || {}).compris, false),
      scenario: etat(rempli(en.scenario) && rempli(en.solution) && rempli(en.codeCadenas),
        rempli(en.scenario) || rempli(en.solution) || rempli(en.codeCadenas)),
      materiel: etat(lignesMateriel.length > 0, false),
      matiere: etat(rempli(en.matiere) && String(en.lienMatiere || "").trim().length >= 40, rempli(en.matiere) || rempli(en.lienMatiere)),
      choixE1: etat(e1.capteurs > 0 && e1.actionneurs > 0, e1.capteurs + e1.actionneurs > 0),
      cablage: etat(elec.cableTeste, (elec.branchements || []).length > 0),
      programme: etat(elec.programmeOk, false),
      indices: etat(indices === 3, commences > 0),
      installation: etat(((ins.etapes || []).length > 0) && ((ins.remiseAZero || []).length > 0),
        (ins.etapes || []).length + (ins.remiseAZero || []).length + (ins.verifs || []).length > 0),
      test: etat((autres.avisRecus || 0) > 0, false)
    };
    ["M1", "M2", "M3"].forEach(function (m) { var c = fab[m] || {}; jalons[m] = etat(c.pret, rempli(c.description)); });
    return jalons;
  }

  // Ce qui manque encore pour les indices (brief §7.6) : messages courts, jamais « faux ».
  function manquesIndices(indices) {
    var manques = [];
    ["n1", "n2", "n3"].forEach(function (n, i) {
      var x = (indices || {})[n] || {};
      if (!rempli(x.texte)) manques.push({ id: "indiceManquant" + (i + 1), niveau: i + 1 });
      else if (!rempli(x.talkie)) manques.push({ id: "talkieManquant", niveau: i + 1 });
    });
    return manques;
  }

  // --- Câblage (atelier v1) ---

  var BROCHES = {
    uno: ["D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "A0", "A1", "A2", "A3", "A4", "A5",
          "D0", "D1", "5V", "3,3V", "GND", "VIN"],
    microbit: ["P0", "P1", "P2", "3V", "GND"]
  };
  var ALIMENTATIONS = ["5V", "3,3V", "3V", "GND", "VIN"];

  function normaliserBroche(b) { return String(b || "").trim().toUpperCase().replace("3.3V", "3,3V").replace(/^MASSE$/, "GND"); }

  // Contrôles signalés, jamais bloquants. Renvoie [{ id, broche?, composants? }].
  function controlesCablage(carte, composantsChoisis, branchements) {
    var resultats = [], parBroche = {}, liste = BROCHES[carte] || BROCHES.uno;
    (branchements || []).forEach(function (b) {
      var broche = normaliserBroche(b.brocheCarte);
      if (!broche) return;
      if (liste.indexOf(broche) === -1) resultats.push({ id: "brocheIndisponible", broche: b.brocheCarte });
      if (ALIMENTATIONS.indexOf(broche) !== -1) return;
      (parBroche[broche] = parBroche[broche] || []).push(b.composant);
    });
    Object.keys(parBroche).forEach(function (broche) {
      var differents = parBroche[broche].filter(function (c, i, t) { return t.indexOf(c) === i; });
      if (parBroche[broche].length > 1) resultats.push({ id: "memeBroche", broche: broche, composants: differents });
    });
    if (carte !== "microbit" && Object.keys(parBroche).some(function (b) { return b === "D0" || b === "D1"; })) resultats.push({ id: "brochesEnvoi" });
    var types = composantsChoisis.map(function (c) { return c.type; });
    if (composantsChoisis.length) {
      if (!types.some(function (t) { return t === "capteur" || t === "saisie"; })) resultats.push({ id: "capteurManquant" });
      if (!types.some(function (t) { return t === "actionneur" || t === "afficheur"; })) resultats.push({ id: "actionneurManquant" });
      var masse = (branchements || []).some(function (b) { return normaliserBroche(b.brocheCarte) === "GND"; });
      if ((branchements || []).length && !masse) resultats.push({ id: "masseCommune" });
    }
    if (composantsChoisis.some(function (c) { return c.id === "electroaimant" || c.id === "relais" || /12\s*V/i.test(c.tension || ""); })) {
      resultats.push({ id: "douzeVoltsSansRelais" }, { id: "validationProfAvantTension" });
    }
    return resultats;
  }

  // --- Jour J (brief §7.9) ---

  // « Léa, Tom et Noa » ou « Léa / Tom » -> ["léa", "tom", "noa"] (comparaison sans majuscules ni accents).
  function prenomsDe(texte) {
    return String(texte || "").split(/,|;|\/|\bet\b|\+/i).map(cleNom).filter(Boolean);
  }
  function cleNom(t) { return String(t || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  // Élèves (prénoms des membres de tous les groupes) qui n'ont encore aucun rôle.
  function elevesSansRole(eleves, roles) {
    var avecRole = {};
    roles.forEach(function (r) { prenomsDe(r.eleve).forEach(function (p) { avecRole[p] = true; }); });
    var vus = {};
    return eleves.filter(function (p) {
      var c = cleNom(p);
      if (!c || vus[c]) return false;
      vus[c] = true;
      return !avecRole[c];
    });
  }

  // Jalon J1 d'un groupe : chaque membre a un rôle et a écrit son texte (fait), ou au moins un a commencé (en cours).
  function etatJourJ(membres, roles) {
    var noms = membres.map(cleNom).filter(Boolean);
    if (!noms.length) return A_FAIRE;
    var complets = 0, commences = 0;
    noms.forEach(function (n) {
      var siens = roles.filter(function (r) { return prenomsDe(r.eleve).indexOf(n) !== -1; });
      if (siens.length) commences++;
      if (siens.length && siens.every(function (r) { return rempli(r.texte); })) complets++;
    });
    return etat(complets === noms.length, commences > 0);
  }

  var EscapeLabFiche = {
    prenomsDe: prenomsDe, elevesSansRole: elevesSansRole, etatJourJ: etatJourJ,
    lireChemin: lireChemin, ecrireChemin: ecrireChemin, fusionner: fusionner, calculerJalons: calculerJalons,
    manquesIndices: manquesIndices, controlesCablage: controlesCablage, BROCHES: BROCHES, A_FAIRE: A_FAIRE, EN_COURS: EN_COURS, FAIT: FAIT
  };
  if (typeof module !== "undefined" && module.exports) module.exports = EscapeLabFiche;
  else racine.EscapeLabFiche = EscapeLabFiche;
})(this);
