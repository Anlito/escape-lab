// Carte modifiable par tous, partagée par l'histoire, les liaisons, la fin de partie et le jour J (brief §7.3) :
// lecture, modification, « Léa (groupe B) modifie cette section », conflit à l'enregistrement (garder les deux
// textes), historique avec restauration. Un élément du stockage par carte.
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils;
  var DUREE_PRESENCE = 90 * 1000;   // sans nouvelle depuis 90 s : la personne a quitté la section
  var RAPPEL_PRESENCE = 30 * 1000;
  var DOSSIER_PRESENCE = "presence/actifs";

  function app() { return racine.EscapeLab; }
  function e(t) { return O.echapper(t); }

  // --- Présence : un petit fichier par personne et par section, réécrit pendant la modification ---

  function clePresence(collection, id) {
    var et = app().etat;
    return [collection, id, et.depot, et.groupe, et.prenom].join("_").replace(/[^A-Za-z0-9À-ÿ_-]/g, "-");
  }

  async function signalerPresence(collection, id, finie) {
    var et = app().etat;
    var valeur = { collection: collection, id: id, prenom: et.prenom, groupe: et.groupe, depot: et.depot, le: Date.now(), fin: !!finie };
    try { await et.adaptateur.ecrireTexte(DOSSIER_PRESENCE + "/" + clePresence(collection, id) + ".json", JSON.stringify(valeur)); }
    catch (err) { /* la présence n'est qu'une aide : jamais bloquante */ }
  }

  // Personnes (autres que moi) en train de modifier, rangées par « collection/id ».
  async function lirePresences() {
    var et = app().etat, parSection = {}, maintenant = Date.now();
    try {
      var entrees = await et.adaptateur.lister(DOSSIER_PRESENCE);
      for (var i = 0; i < entrees.length; i++) {
        var p = JSON.parse(await et.adaptateur.lireTexte(DOSSIER_PRESENCE + "/" + entrees[i].nom));
        if (p.fin || maintenant - p.le > DUREE_PRESENCE) continue;
        if (p.prenom === et.prenom && p.groupe === et.groupe && p.depot === et.depot) continue;
        (parSection[p.collection + "/" + p.id] = parSection[p.collection + "/" + p.id] || []).push(p);
      }
    } catch (err) { /* dossier de présence absent ou illisible */ }
    return parSection;
  }

  // --- Carte ---
  // options : { collection, id, titre, champs: [{ cle, libelle, aide, lignes }], parDefaut: {…}, consigne }

  function creerCarte(options) {
    var noeud = document.createElement("section");
    noeud.className = "carte editable";
    var element = null, presences = [], mode = "lecture", brouillon = null, conflit = null, versions = null;
    var changeEnDessous = false, minuteriePresence = null;
    var cles = options.champs.map(function (c) { return c.cle; });

    function valeurAffichee() {
      var v = element ? element.valeur : (options.parDefaut || {});
      return v || {};
    }

    function signature() {
      if (!element) return '<p class="petit">Pas encore écrit.</p>';
      return '<p class="petit">Modifié par ' + e(O.nomAuteur(element.auteur)) + " le " + app().dateCourte(element.le) + "</p>";
    }

    function lignePresence() {
      if (!presences.length) return "";
      return '<p class="presence">✎ ' + presences.map(function (p) { return e(p.prenom + " (groupe " + p.groupe + ")"); }).join(", ") +
        (presences.length > 1 ? " modifient" : " modifie") + " cette section.</p>";
    }

    function blocConflitSynchro() {
      if (!element || !element.conflit || !element.conflit.length) return "";
      return '<div class="bandeau ecart">Deux versions existent depuis la synchronisation des deux dossiers. Le professeur choisira. Autre version :' +
        element.conflit.map(function (v) {
          return '<div class="autre-version">' + champsEnLecture(v.valeur || {}) + '<p class="petit">' + e(O.nomAuteur(v.auteur)) + ", " + app().dateCourte(v.le) + "</p></div>";
        }).join("") + "</div>";
    }

    function champsEnLecture(valeur) {
      return options.champs.map(function (c) {
        var texte = valeur[c.cle];
        var contenu = texte ? O.miseEnForme(texte) : '<p class="petit vide">À écrire.</p>';
        return options.champs.length > 1 ? '<div class="champ"><h4 class="libelle">' + e(c.libelle) + "</h4>" + contenu + "</div>" : contenu;
      }).join("");
    }

    function champsEnEdition(valeur) {
      return options.champs.map(function (c) {
        var idChamp = "ch-" + options.collection + "-" + options.id + "-" + c.cle;
        return '<label for="' + idChamp + '">' + e(c.libelle) + "</label>" +
          (c.aide ? '<p class="petit">' + e(c.aide) + "</p>" : "") +
          '<textarea id="' + idChamp + '" data-cle="' + c.cle + '" rows="' + (c.lignes || 4) + '">' + e(valeur[c.cle] || "") + "</textarea>";
      }).join("") + '<p class="petit">Mise en forme : **gras** · une ligne qui commence par « - » fait une liste · « ## » fait un titre.</p>';
    }

    function afficher() {
      var html = "<h3>" + e(options.titre) + "</h3>";
      if (options.consigne && mode !== "lecture") html += '<p class="petit">' + e(options.consigne) + "</p>";
      if (mode === "lecture") {
        html += lignePresence() + blocConflitSynchro() + champsEnLecture(valeurAffichee()) + signature() +
          '<div class="boutons"><button data-action="modifier">Modifier</button><button data-action="historique">Historique</button></div>';
      } else if (mode === "edition") {
        html += lignePresence() +
          (changeEnDessous ? '<p class="bandeau ecart">Quelqu\'un a enregistré cette section pendant que tu écrivais. En enregistrant, tu pourras garder les deux textes.</p>' : "") +
          champsEnEdition(brouillon) +
          '<div class="boutons"><button class="principal" data-action="enregistrer">Enregistrer</button><button data-action="annuler">Annuler</button></div>';
      } else if (mode === "conflit") {
        html += '<p class="bandeau ecart">' + e(O.nomAuteur(conflit.actuel.auteur)) + " a enregistré cette section le " +
          app().dateCourte(conflit.actuel.le) + ", pendant que tu écrivais. Rien n'est perdu : choisis ce que tu veux faire.</p>" +
          '<div class="deux-textes"><div><h4>Son texte</h4>' + champsEnLecture(conflit.actuel.valeur || {}) + "</div>" +
          "<div><h4>Ton texte</h4>" + champsEnLecture(conflit.mien) + "</div></div>" +
          '<div class="boutons"><button class="principal" data-action="garderDeux">Garder les deux textes</button>' +
          '<button data-action="retoucher">Les réunir et modifier avant d\'enregistrer</button></div>';
      } else if (mode === "historique") {
        html += '<p class="petit">Chaque enregistrement est gardé. Restaurer crée une nouvelle version : rien n\'est supprimé.</p>';
        html += !versions ? '<p class="petit">Lecture de l\'historique…</p>' : versions.slice().reverse().map(function (v, i) {
          var actuelle = element && v.vid === element.vid;
          return '<details class="version"><summary>' + app().dateCourte(v.le) + " · " + e(O.nomAuteur(v.auteur)) + (actuelle ? " · version actuelle" : "") + "</summary>" +
            champsEnLecture(v.valeur || {}) + (actuelle ? "" : '<button data-action="restaurer" data-vid="' + e(v.vid) + '">Restaurer cette version</button>') + "</details>";
        }).join("") || '<p class="petit">Pas encore d\'historique.</p>';
        html += '<div class="boutons"><button data-action="fermer">Fermer l\'historique</button></div>';
      }
      noeud.innerHTML = html;
    }

    function lireBrouillon() {
      var valeur = {};
      noeud.querySelectorAll("textarea[data-cle]").forEach(function (t) { valeur[t.getAttribute("data-cle")] = t.value; });
      return valeur;
    }

    function commencerPresence() {
      signalerPresence(options.collection, options.id, false);
      clearInterval(minuteriePresence);
      minuteriePresence = setInterval(function () { signalerPresence(options.collection, options.id, false); }, RAPPEL_PRESENCE);
    }
    function finirPresence() {
      if (!minuteriePresence) return;
      clearInterval(minuteriePresence);
      minuteriePresence = null;
      signalerPresence(options.collection, options.id, true);
    }

    async function enregistrer(valeur, vidDeBase) {
      var et = app().etat;
      var r = await et.stockage.enregistrer(options.collection, options.id, valeur, vidDeBase, app().auteur());
      if (r.ok) {
        element = r.element; mode = "lecture"; conflit = null; changeEnDessous = false;
        finirPresence();
      } else {
        conflit = { actuel: r.actuel, mien: valeur }; mode = "conflit";
      }
      afficher();
    }

    noeud.addEventListener("click", async function (ev) {
      var bouton = ev.target.closest("button[data-action]");
      if (!bouton) return;
      var action = bouton.getAttribute("data-action");
      bouton.disabled = true;
      try {
        if (action === "modifier") {
          brouillon = Object.assign({}, valeurAffichee()); brouillon.vidDeBase = element ? element.vid : null;
          mode = "edition"; changeEnDessous = false; commencerPresence(); afficher();
          var premier = noeud.querySelector("textarea"); if (premier) premier.focus();
        } else if (action === "annuler") {
          mode = "lecture"; finirPresence(); afficher();
        } else if (action === "enregistrer") {
          var vid = brouillon.vidDeBase; brouillon = lireBrouillon(); brouillon.vidDeBase = vid;
          var valeur = {}; cles.forEach(function (c) { valeur[c] = brouillon[c] || ""; });
          await enregistrer(valeur, vid);
        } else if (action === "garderDeux") {
          await enregistrer(O.combinerTextes(conflit.actuel.valeur, conflit.mien, cles), conflit.actuel.vid);
        } else if (action === "retoucher") {
          brouillon = O.combinerTextes(conflit.actuel.valeur, conflit.mien, cles); brouillon.vidDeBase = conflit.actuel.vid;
          element = conflit.actuel; mode = "edition"; changeEnDessous = false; afficher();
        } else if (action === "historique") {
          mode = "historique"; versions = null; afficher();
          versions = await app().etat.stockage.historique(options.collection, options.id); afficher();
        } else if (action === "fermer") {
          mode = "lecture"; afficher();
        } else if (action === "restaurer") {
          var r = await app().etat.stockage.restaurer(options.collection, options.id, bouton.getAttribute("data-vid"), app().auteur());
          if (r.ok) element = r.element;
          mode = "lecture"; afficher();
        }
      } catch (err) {
        noeud.insertAdjacentHTML("beforeend", '<p class="bandeau ecart">L\'enregistrement n\'a pas pu se faire (' + e(err.message) +
          "). Ton texte est toujours là : vérifie la connexion au réseau du collège, puis réessaie.</p>");
      }
      if (bouton.isConnected) bouton.disabled = false;
    });

    return {
      noeud: noeud,
      collection: options.collection,
      id: options.id,
      // Nouvelle lecture du dossier : met à jour la carte sans jamais toucher au texte en cours d'écriture.
      rafraichir: function (nouveau, presencesSection) {
        var avant = JSON.stringify([presences.map(function (p) { return p.prenom + p.groupe; }), changeEnDessous]);
        presences = presencesSection || [];
        var aChange = nouveau && (!element || nouveau.vid !== element.vid);
        if (mode === "edition") { if (aChange && nouveau.vid !== brouillon.vidDeBase) changeEnDessous = true; }
        else if (mode === "lecture") element = nouveau;
        var apres = JSON.stringify([presences.map(function (p) { return p.prenom + p.groupe; }), changeEnDessous]);
        if (mode === "edition" && avant !== apres) {
          var garde = lireBrouillon(), vid = brouillon.vidDeBase;
          brouillon = Object.assign(brouillon, garde); brouillon.vidDeBase = vid;
          var actif = document.activeElement, cleActive = actif && actif.getAttribute && actif.getAttribute("data-cle");
          var position = cleActive ? actif.selectionStart : null;
          afficher();
          if (cleActive) {
            var t = noeud.querySelector('textarea[data-cle="' + cleActive + '"]');
            if (t) { t.focus(); t.selectionStart = t.selectionEnd = position; }
          }
        } else if (mode === "lecture") afficher();
      },
      arreter: finirPresence
    };
  }

  // Lit régulièrement le dossier et met à jour toutes les cartes de la page. Renvoie la fonction d'arrêt.
  function suivreCartes(cartes, delai) {
    var arrete = false;
    async function relire() {
      if (arrete) return;
      var st = app().etat.stockage;
      if (!st) return;
      var presences = await lirePresences();
      for (var i = 0; i < cartes.length; i++) {
        var c = cartes[i];
        try { c.rafraichir(await st.lire(c.collection, c.id), presences[c.collection + "/" + c.id]); }
        catch (err) { /* lecture manquée : la suivante rattrapera */ }
      }
    }
    relire();
    var minuterie = setInterval(relire, delai || 15000);
    return function () {
      arrete = true;
      clearInterval(minuterie);
      cartes.forEach(function (c) { c.arreter(); });
    };
  }

  racine.EscapeLabEditeur = { creerCarte: creerCarte, suivreCartes: suivreCartes };
})(this);
