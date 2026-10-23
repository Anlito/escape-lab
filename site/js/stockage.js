// Couche de stockage d'Escape Lab (brief §10).
// Un « dépôt » est un dossier de classe. Il contient des collections (histoire, frise, bibliotheque, groupes,
// liaisons, annonces, jourj) ; une collection contient des éléments ; un élément = un fichier <collection>/<id>.json.
// Un fichier par élément : deux élèves qui enregistrent deux sections différentes ne se gênent jamais.
// Chaque version est d'abord copiée dans <collection>/historique/<id>/<vid>.json : rien n'est jamais perdu.
//
// L'interface ne parle qu'à cette couche ; l'accès réel aux fichiers passe par un « adaptateur » :
//   lireTexte(chemin) -> texte ou null · ecrireTexte(chemin, texte)
//   lireOctets(chemin) -> contenu ou null · ecrireOctets(chemin, contenu)
//   lister(cheminDossier) -> [{ nom, type: "fichier" | "dossier" }] (liste vide si le dossier n'existe pas)
// Adaptateurs : creerAdaptateurMemoire (tests) ici, creerAdaptateurDossier dans stockage-dossier.js (navigateur).
(function (racine) {
  "use strict";

  var FORMAT = 1;
  var ID_VALIDE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

  function verifierId(id) {
    if (!ID_VALIDE.test(id)) throw new Error("Identifiant non valable : « " + id + " » (lettres, chiffres, - et _).");
  }

  function cheminElement(collection, id) { return collection + "/" + id + ".json"; }
  function cheminVersion(collection, id, vid) { return collection + "/historique/" + id + "/" + vid + ".json"; }

  // Anciennes sauvegardes toujours lisibles : chaque format connu est converti vers le format actuel.
  function migrer(element) {
    if (!element.format) element.format = FORMAT;
    if (!element.lignee) element.lignee = element.vid ? [element.vid] : [];
    return element;
  }

  function creerGenerateur(options) {
    var horloge = options.horloge || Date.now;
    var aleatoire = options.aleatoire || Math.random;
    return {
      maintenant: horloge,
      vid: function () {
        return horloge().toString(36) + "-" + Math.floor(aleatoire() * 1e9).toString(36);
      }
    };
  }

  // --- Stockage d'un dépôt ---------------------------------------------------------------------------------

  function creerStockage(adaptateur, options) {
    options = options || {};
    var depot = options.depot || "";
    var gen = creerGenerateur(options);

    async function lire(collection, id) {
      verifierId(id);
      var texte = await adaptateur.lireTexte(cheminElement(collection, id));
      return texte === null ? null : migrer(JSON.parse(texte));
    }

    async function lister(collection) {
      var entrees = await adaptateur.lister(collection);
      var elements = [];
      for (var i = 0; i < entrees.length; i++) {
        var e = entrees[i];
        if (e.type !== "fichier" || !/\.json$/.test(e.nom)) continue;
        var element = await lire(collection, e.nom.slice(0, -5));
        if (element) elements.push(element);
      }
      return elements;
    }

    async function ecrireVersion(collection, element) {
      var texte = JSON.stringify(element, null, 2);
      await adaptateur.ecrireTexte(cheminVersion(collection, element.id, element.vid), texte);
      await adaptateur.ecrireTexte(cheminElement(collection, element.id), texte);
    }

    // Enregistre une nouvelle version si personne n'a enregistré depuis la lecture (vidAttendu = vid lu,
    // null pour un nouvel élément). Sinon rien n'est écrit et l'appelant reçoit la version actuelle pour
    // proposer de garder les deux textes.
    async function enregistrer(collection, id, valeur, vidAttendu, auteur) {
      var actuel = await lire(collection, id);
      var vidActuel = actuel ? actuel.vid : null;
      if (vidActuel !== (vidAttendu || null)) return { ok: false, conflit: true, actuel: actuel };
      var vid = gen.vid();
      var element = {
        format: FORMAT, id: id, vid: vid,
        lignee: (actuel ? actuel.lignee : []).concat(vid),
        valeur: valeur, auteur: auteur || null, le: gen.maintenant(), depot: depot
      };
      await ecrireVersion(collection, element);
      return { ok: true, element: element };
    }

    async function historique(collection, id) {
      verifierId(id);
      var dossier = collection + "/historique/" + id;
      var entrees = await adaptateur.lister(dossier);
      var versions = [];
      for (var i = 0; i < entrees.length; i++) {
        if (entrees[i].type !== "fichier") continue;
        versions.push(migrer(JSON.parse(await adaptateur.lireTexte(dossier + "/" + entrees[i].nom))));
      }
      return versions.sort(function (a, b) { return a.le - b.le; });
    }

    // Restaurer crée une nouvelle version avec l'ancien contenu : l'historique ne fait que grandir.
    async function restaurer(collection, id, vid, auteur) {
      var texte = await adaptateur.lireTexte(cheminVersion(collection, id, vid));
      if (texte === null) throw new Error("Version introuvable : " + vid);
      var ancienne = JSON.parse(texte);
      var actuel = await lire(collection, id);
      return enregistrer(collection, id, ancienne.valeur, actuel ? actuel.vid : null, auteur);
    }

    async function ecrireFichier(collection, nom, contenu) {
      await adaptateur.ecrireOctets(collection + "/fichiers/" + nom, contenu);
    }

    async function lireFichier(collection, nom) {
      return adaptateur.lireOctets(collection + "/fichiers/" + nom);
    }

    return {
      depot: depot, lire: lire, lister: lister, enregistrer: enregistrer,
      historique: historique, restaurer: restaurer, ecrireFichier: ecrireFichier, lireFichier: lireFichier
    };
  }

  // --- Synchronisation de deux dépôts (équipe à deux dossiers, brief §10.1) ----------------------------------

  async function toutLister(adaptateur, dossier, chemins) {
    var entrees = await adaptateur.lister(dossier);
    for (var i = 0; i < entrees.length; i++) {
      var chemin = (dossier ? dossier + "/" : "") + entrees[i].nom;
      if (entrees[i].type === "dossier") await toutLister(adaptateur, chemin, chemins);
      else chemins[chemin] = true;
    }
    return chemins;
  }

  // Un fichier d'élément est à la racine d'une collection ; tout le reste (historique, fichiers, journal)
  // ne change jamais une fois écrit : il suffit de le copier là où il manque.
  function estElement(chemin) {
    var parties = chemin.split("/");
    return parties.length === 2 && /\.json$/.test(parties[1]);
  }

  function resumeVersion(e) {
    return { vid: e.vid, valeur: e.valeur, auteur: e.auteur, le: e.le, depot: e.depot };
  }

  function unionLignees(a, b) {
    var vus = {}, resultat = [];
    a.concat(b).forEach(function (vid) { if (!vus[vid]) { vus[vid] = true; resultat.push(vid); } });
    return resultat;
  }

  // Compare les versions d'un même élément dans les deux dépôts.
  function comparer(a, b, gen) {
    if (a.vid === b.vid) return { action: "egal" };
    if (a.lignee.indexOf(b.vid) !== -1) return { action: "versB" };   // A a avancé depuis la version de B
    if (b.lignee.indexOf(a.vid) !== -1) return { action: "versA" };
    // Modifié des deux côtés : on garde la plus récente en valeur, l'autre dans « conflit », le professeur choisit.
    var recente = a.le >= b.le ? a : b, autre = recente === a ? b : a;
    var vid = gen.vid();
    var fusion = {
      format: FORMAT, id: a.id, vid: vid,
      lignee: unionLignees(a.lignee, b.lignee).concat(vid),
      valeur: recente.valeur,
      conflit: (recente.conflit || []).concat(autre.conflit || [], [resumeVersion(autre)]),
      auteur: { synchronisation: true }, le: gen.maintenant(), depot: "synchronisation"
    };
    return { action: "conflit", element: fusion };
  }

  // Rend les deux dépôts identiques sans rien perdre. Avec { simuler: true }, n'écrit rien et renvoie
  // seulement le rapport (aperçu montré au professeur avant d'exécuter).
  async function synchroniser(adaptateurA, adaptateurB, options) {
    options = options || {};
    var gen = creerGenerateur(options);
    var simuler = !!options.simuler;
    var rapport = { versA: [], versB: [], conflits: [], simulation: simuler };

    var cheminsA = await toutLister(adaptateurA, "", {});
    var cheminsB = await toutLister(adaptateurB, "", {});
    var tous = Object.keys(Object.assign({}, cheminsA, cheminsB)).sort();

    for (var i = 0; i < tous.length; i++) {
      var chemin = tous[i], dansA = !!cheminsA[chemin], dansB = !!cheminsB[chemin];
      if (!estElement(chemin)) {
        if (dansA && !dansB) { rapport.versB.push(chemin); if (!simuler) await adaptateurB.ecrireOctets(chemin, await adaptateurA.lireOctets(chemin)); }
        if (dansB && !dansA) { rapport.versA.push(chemin); if (!simuler) await adaptateurA.ecrireOctets(chemin, await adaptateurB.lireOctets(chemin)); }
        continue;
      }
      var texteA = dansA ? await adaptateurA.lireTexte(chemin) : null;
      var texteB = dansB ? await adaptateurB.lireTexte(chemin) : null;
      if (texteA === null) { rapport.versA.push(chemin); if (!simuler) await adaptateurA.ecrireTexte(chemin, texteB); continue; }
      if (texteB === null) { rapport.versB.push(chemin); if (!simuler) await adaptateurB.ecrireTexte(chemin, texteA); continue; }

      var resultat = comparer(migrer(JSON.parse(texteA)), migrer(JSON.parse(texteB)), gen);
      if (resultat.action === "versB") { rapport.versB.push(chemin); if (!simuler) await adaptateurB.ecrireTexte(chemin, texteA); }
      if (resultat.action === "versA") { rapport.versA.push(chemin); if (!simuler) await adaptateurA.ecrireTexte(chemin, texteB); }
      if (resultat.action === "conflit") {
        rapport.conflits.push(chemin);
        if (!simuler) {
          var collection = chemin.split("/")[0];
          var texte = JSON.stringify(resultat.element, null, 2);
          var cheminHisto = cheminVersion(collection, resultat.element.id, resultat.element.vid);
          for (var ad of [adaptateurA, adaptateurB]) {
            await ad.ecrireTexte(cheminHisto, texte);
            await ad.ecrireTexte(chemin, texte);
          }
        }
      }
    }

    if (!simuler) {
      var entree = JSON.stringify({ le: gen.maintenant(), versA: rapport.versA, versB: rapport.versB,
                                    conflits: rapport.conflits }, null, 2);
      var cheminJournal = "synchronisation/journal/" + gen.vid() + ".json";
      await adaptateurA.ecrireTexte(cheminJournal, entree);
      await adaptateurB.ecrireTexte(cheminJournal, entree);
    }
    return rapport;
  }

  // --- Adaptateur en mémoire (tests, démonstration) ----------------------------------------------------------

  function creerAdaptateurMemoire() {
    var fichiers = {};
    function lireBrut(chemin) { return Object.prototype.hasOwnProperty.call(fichiers, chemin) ? fichiers[chemin] : null; }
    return {
      fichiers: fichiers,
      lireTexte: async function (chemin) { return lireBrut(chemin); },
      ecrireTexte: async function (chemin, texte) { fichiers[chemin] = texte; },
      lireOctets: async function (chemin) { return lireBrut(chemin); },
      ecrireOctets: async function (chemin, contenu) { fichiers[chemin] = contenu; },
      lister: async function (dossier) {
        var prefixe = dossier ? dossier + "/" : "", vus = {}, entrees = [];
        Object.keys(fichiers).forEach(function (chemin) {
          if (chemin.indexOf(prefixe) !== 0) return;
          var reste = chemin.slice(prefixe.length).split("/");
          var nom = reste[0], type = reste.length > 1 ? "dossier" : "fichier";
          if (!vus[nom]) { vus[nom] = true; entrees.push({ nom: nom, type: type }); }
        });
        return entrees;
      }
    };
  }

  var EscapeLabStockage = {
    FORMAT: FORMAT, creerStockage: creerStockage, synchroniser: synchroniser,
    creerAdaptateurMemoire: creerAdaptateurMemoire, comparer: comparer
  };
  if (typeof module !== "undefined" && module.exports) module.exports = EscapeLabStockage;
  else racine.EscapeLabStockage = EscapeLabStockage;
})(this);
