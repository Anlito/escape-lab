// Escape Lab — accueil, identification, navigation et tableau de bord de l'équipe (brief §6, §7.1, §7.2).
// Chargé avant les fichiers de données : il définit les fonctions definirXxx qu'ils appellent.
(function (racine) {
  "use strict";

  var S = racine.EscapeLabStockage;
  var REGLAGES = null, JALONS = [], MECANIQUES = {}, DEMO = null;
  var CLE_DERNIER = "escape-lab:dernier";

  racine.definirEquipes = function (r) { REGLAGES = r; };
  racine.definirJalons = function (j) { JALONS = j.jalons; };
  racine.definirMecaniques = function (m) { m.mecaniques.forEach(function (x) { MECANIQUES[x.id] = x; }); };
  racine.definirDemo = function (d) { DEMO = d; };

  // Personne connectée et dossier ouvert.
  // prof : commandes du professeur (ordre de la frise…), données par prof.html ou essayées en démonstration.
  var etat = { equipe: null, depot: "", groupe: "", prenom: "", stockage: null, adaptateur: null,
               demo: false, nomDossier: "", prof: false };

  var PAGES = [
    { id: "tableau", nom: "Tableau de bord" },
    { id: "histoire", nom: "Histoire", etape: 5 },
    { id: "frise", nom: "Frise", etape: 5 },
    { id: "bibliotheque", nom: "Bibliothèque", etape: 6 },
    { id: "enigme", nom: "Mon énigme", etape: 7 },
    { id: "autres", nom: "Énigmes des autres", etape: 7 },
    { id: "programmation", nom: "Programmation", etape: 10 },
    { id: "jourj", nom: "Jour J", etape: 8 }
  ];

  function $(id) { return document.getElementById(id); }

  function echapper(texte) {
    return String(texte == null ? "" : texte).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function dateCourte(ms) {
    var d = new Date(ms);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) + " à " +
           d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  function auteur() { return { classe: etat.depot, groupe: etat.groupe, prenom: etat.prenom }; }

  // --- Équipes et groupes ---

  function equipeDuDepot(depot) {
    return (REGLAGES.equipes || []).filter(function (e) { return e.depots.indexOf(depot) !== -1; })[0] || null;
  }

  function lettresGroupes(nombre) {
    var lettres = [];
    for (var i = 0; i < nombre; i++) lettres.push(String.fromCharCode(65 + i));
    return lettres;
  }

  // Chemin attendu du dossier de la classe, d'après les Réglages du collège (affiché comme aide).
  function cheminAttendu(depot) {
    var LB = racine.LaboBlocs || {};
    var debut = LB.college && LB.remplirChemin ? LB.remplirChemin(LB.college.cheminClasse, depot) : [];
    var fin = (REGLAGES.cheminProjet || []).map(function (p) { return p.replace("{depot}", depot); });
    return debut.concat(fin).join(" › ");
  }

  // --- Mémoire du navigateur (aucune donnée sensible ; tout est facultatif) ---

  function lireDernier() {
    try { return JSON.parse(localStorage.getItem(CLE_DERNIER)) || null; } catch (e) { return null; }
  }
  function memoriserDernier() {
    try { localStorage.setItem(CLE_DERNIER, JSON.stringify({ depot: etat.depot, groupe: etat.groupe, prenom: etat.prenom })); } catch (e) { /* navigation privée */ }
  }

  // Le dossier choisi est gardé dans le navigateur pour « Reprendre » (le navigateur redemande l'accès).
  function baseDossiers() {
    return new Promise(function (ok, ko) {
      var req = indexedDB.open("escape-lab", 1);
      req.onupgradeneeded = function () { req.result.createObjectStore("dossiers"); };
      req.onsuccess = function () { ok(req.result); };
      req.onerror = function () { ko(req.error); };
    });
  }
  async function garderDossier(depot, poignee) {
    try {
      var db = await baseDossiers();
      db.transaction("dossiers", "readwrite").objectStore("dossiers").put(poignee, depot);
    } catch (e) { /* sans mémoire : on redemandera le dossier */ }
  }
  async function retrouverDossier(depot) {
    try {
      var db = await baseDossiers();
      return await new Promise(function (ok) {
        var req = db.transaction("dossiers").objectStore("dossiers").get(depot);
        req.onsuccess = function () { ok(req.result || null); };
        req.onerror = function () { ok(null); };
      });
    } catch (e) { return null; }
  }

  // --- Accueil ---

  function remplirAccueil() {
    var depots = [];
    REGLAGES.equipes.forEach(function (e) { depots = depots.concat(e.depots); });
    $("choixClasse").innerHTML = '<option value="">Choisir…</option>' + depots.map(function (d) {
      var e = equipeDuDepot(d);
      var detail = e.depots.length > 1 ? " (équipe " + e.nom + ")" : "";
      return '<option value="' + echapper(d) + '">' + echapper(d + detail) + "</option>";
    }).join("");
    $("choixGroupe").innerHTML = '<option value="">Choisir…</option>' + lettresGroupes(REGLAGES.nombreGroupes)
      .map(function (g) { return '<option value="' + g + '">Groupe ' + g + "</option>"; }).join("");

    var dernier = lireDernier();
    if (dernier && equipeDuDepot(dernier.depot)) {
      $("btnReprendre").hidden = false;
      $("btnReprendre").textContent = "Reprendre : " + dernier.prenom + ", groupe " + dernier.groupe + " (" + dernier.depot + ")";
    }
    majAideChemin();
  }

  function majAideChemin() {
    var depot = $("choixClasse").value;
    $("aideChemin").textContent = depot ? "Dossier à choisir : " + cheminAttendu(depot) : "";
  }

  function messageAccueil(texte) {
    $("messageAccueil").textContent = texte;
    $("messageAccueil").hidden = !texte;
  }

  function lireFormulaire() {
    var depot = $("choixClasse").value, groupe = $("choixGroupe").value, prenom = $("prenom").value.trim();
    if (!depot) return messageAccueil("Choisis ta classe.");
    if (!groupe) return messageAccueil("Choisis ton groupe.");
    if (!prenom) return messageAccueil("Écris ton prénom : il signe ton travail.");
    messageAccueil("");
    return { depot: depot, groupe: groupe, prenom: prenom };
  }

  async function ouvrirDossier(personne, poignee) {
    if (!poignee) {
      if (!racine.showDirectoryPicker) {
        return messageAccueil("Ce navigateur ne sait pas ouvrir un dossier. Ouvre Escape Lab avec Chrome ou Edge.");
      }
      try {
        poignee = await racine.showDirectoryPicker({ id: "escape-lab", mode: "readwrite" });
      } catch (e) {
        return messageAccueil("Aucun dossier choisi. Clique de nouveau et choisis le dossier de ta classe.");
      }
    }
    try {
      if ((await poignee.requestPermission({ mode: "readwrite" })) !== "granted") {
        return messageAccueil("Escape Lab a besoin d'écrire dans le dossier. Clique de nouveau et accepte.");
      }
    } catch (e) {
      return messageAccueil("Le dossier n'est plus accessible. Choisis-le de nouveau.");
    }
    await garderDossier(personne.depot, poignee);
    var adaptateur = S.creerAdaptateurDossier(poignee);
    entrer(personne, adaptateur, false, poignee.name);
  }

  function entrer(personne, adaptateur, demo, nomDossier) {
    etat.depot = personne.depot;
    etat.groupe = personne.groupe;
    etat.prenom = personne.prenom;
    etat.equipe = demo ? DEMO.equipe : equipeDuDepot(personne.depot);
    etat.adaptateur = adaptateur;
    etat.stockage = S.creerStockage(adaptateur, { depot: personne.depot });
    etat.demo = demo;
    etat.nomDossier = nomDossier || "";
    if (!demo) memoriserDernier();
    $("accueil").hidden = true;
    $("espace").hidden = false;
    $("connecte").innerHTML = "<strong>" + echapper(etat.prenom) + "</strong> · groupe " + echapper(etat.groupe) +
      " · " + echapper(etat.equipe.nom) + (demo ? " · démonstration" : "");
    if (!location.hash) location.hash = "#tableau";
    afficherPage();
  }

  async function entrerDemo() {
    var adaptateur = S.creerAdaptateurMemoire();
    var stockage = S.creerStockage(adaptateur, { depot: DEMO.equipe.depots[0] });
    for (var i = 0; i < DEMO.elements.length; i++) {
      var e = DEMO.elements[i];
      await stockage.enregistrer(e.collection, e.id, e.valeur, null, { prenom: "Démo" });
    }
    entrer({ depot: DEMO.equipe.depots[0], groupe: "A", prenom: "Visiteur" }, adaptateur, true, DEMO.equipe.depots[0]);
  }

  function quitter() {
    if (arreterPage) { arreterPage(); arreterPage = null; }
    etat.stockage = etat.adaptateur = null;
    etat.prof = false;
    $("espace").hidden = true;
    $("accueil").hidden = false;
    history.replaceState(null, "", location.pathname);
    document.title = "Escape Lab";
    remplirAccueil();
  }

  // --- Navigation ---

  function pageCourante() {
    var id = location.hash.replace("#", "");
    return PAGES.filter(function (p) { return p.id === id; })[0] || PAGES[0];
  }

  function afficherNavigation(page) {
    $("navigation").innerHTML = PAGES.map(function (p) {
      return '<a href="#' + p.id + '"' + (p === page ? ' aria-current="page"' : "") + ">" + echapper(p.nom) + "</a>";
    }).join("");
  }

  async function afficherPage() {
    if (!etat.stockage) return;
    var page = pageCourante();
    afficherNavigation(page);
    document.title = page.nom + " — Escape Lab";
    var zone = $("contenu");
    if (arreterPage) { arreterPage(); arreterPage = null; }
    if (page.id === "tableau") return afficherTableau(zone);
    if (app.pages[page.id]) { arreterPage = await app.pages[page.id](zone) || null; return; }
    zone.innerHTML = '<section class="carte"><h2>' + echapper(page.nom) + "</h2><p>Cette page arrive bientôt (étape " +
      page.etape + " du projet).</p></section>";
  }

  // --- Tableau de bord ---

  function pastille(idMecanique) {
    var m = MECANIQUES[idMecanique];
    if (!m) return '<span class="pastille" title="Mécanique pas encore attribuée">?</span>';
    return '<span class="pastille" style="background:' + m.couleur + '" title="' + echapper(m.nom) + '">' + echapper(m.lettre) + "</span>";
  }

  // Avancement d'un groupe : jalons faits, jalons en retard (séance dépassée et pas encore faits).
  function avancement(valeur, seanceActuelle) {
    var jalons = (valeur && valeur.jalons) || {}, faits = 0, retard = [];
    JALONS.forEach(function (j) {
      var e = jalons[j.id];
      var fait = e === "fait" || (e && e.etat === "fait");
      if (fait) faits++;
      else if (seanceActuelle && j.seance < seanceActuelle) retard.push(j.nom);
    });
    return { pourcent: JALONS.length ? Math.round(100 * faits / JALONS.length) : 0, faits: faits, retard: retard };
  }

  async function derniereSynchronisation() {
    var entrees = await etat.adaptateur.lister("synchronisation/journal"), plusRecente = 0;
    for (var i = 0; i < entrees.length; i++) {
      var texte = await etat.adaptateur.lireTexte("synchronisation/journal/" + entrees[i].nom);
      try { plusRecente = Math.max(plusRecente, JSON.parse(texte).le || 0); } catch (e) { /* fichier illisible : ignoré */ }
    }
    return plusRecente;
  }

  async function afficherTableau(zone) {
    zone.innerHTML = '<p class="petit">Lecture du dossier…</p>';
    var html = "";
    try {
      var st = etat.stockage;
      var reglages = await st.lire("equipe", "reglages");
      var seance = reglages && reglages.valeur.seanceActuelle;
      var groupesLus = {};
      (await st.lister("groupes")).forEach(function (g) { groupesLus[g.id] = g; });
      var annonces = (await st.lister("annonces")).sort(function (a, b) {
        return (!!b.valeur.epinglee - !!a.valeur.epinglee) || (b.le - a.le);
      });
      var frise = await st.lire("frise", "ordre");

      if (etat.nomDossier && !etat.demo && etat.nomDossier.toUpperCase() !== etat.depot.toUpperCase()) {
        html += '<p class="bandeau ecart">Le dossier ouvert s\'appelle « ' + echapper(etat.nomDossier) +
          " ». Le dossier attendu est : " + echapper(cheminAttendu(etat.depot)) + ". Si ce n'est pas le bon, clique sur « Changer ».</p>";
      }
      if (etat.equipe.depots.length > 1) {
        var synchro = await derniereSynchronisation();
        html += '<p class="bandeau">' + (synchro ? "Dernière synchronisation : " + dateCourte(synchro) : "Pas encore de synchronisation") +
          ". Le travail de l'autre moitié de l'équipe apparaît après synchronisation par le professeur.</p>";
      }

      html += '<section class="carte"><h2>Annonces du professeur</h2>';
      html += annonces.length ? annonces.map(function (a) {
        return "<p>" + (a.valeur.epinglee ? "📌 " : "") + echapper(a.valeur.texte) + ' <span class="petit">(' + dateCourte(a.le) + ")</span></p>";
      }).join("") : '<p class="petit">Pas encore d\'annonce.</p>';
      html += "</section>";

      html += '<section class="carte"><h2>Les groupes' + (seance ? ' <span class="petit">· séance ' + seance + "</span>" : "") + "</h2><div class=\"grille\">";
      lettresGroupes(REGLAGES.nombreGroupes).forEach(function (id) {
        var g = groupesLus[id], v = g ? g.valeur : {};
        var av = avancement(v, seance);
        var m = MECANIQUES[v.mecanique];
        html += '<article class="carte groupe"><h3>' + pastille(v.mecanique) + echapper(v.nom || "Groupe " + id) + "</h3>" +
          '<p class="petit">Groupe ' + id + " · " + echapper(m ? m.nom : "mécanique à attribuer") +
          (id === etat.groupe ? ' · <span class="etiquette">ton groupe</span>' : "") + "</p>" +
          '<div class="barre" role="img" aria-label="' + av.pourcent + ' % des jalons faits"><div style="width:' + av.pourcent + '%"></div></div>' +
          "<p>" + av.faits + " jalon" + (av.faits > 1 ? "s" : "") + " fait" + (av.faits > 1 ? "s" : "") + " sur " + JALONS.length + " (" + av.pourcent + " %)</p>" +
          (av.retard.length ? '<p class="ecart">Encore à faire : ' + echapper(av.retard.join(", ")) + "</p>" : "") +
          '<p class="petit">' + (g ? "Dernière activité : " + dateCourte(g.le) : "Pas encore commencé") + "</p></article>";
      });
      html += "</div></section>";

      var ordre = (frise && frise.valeur.ordre) || [];
      html += '<section class="carte"><h2>Frise des énigmes</h2>';
      if (ordre.length) {
        var etapes = ['<span class="etape">Début</span>'].concat(ordre.map(function (id, i) {
          var v = groupesLus[id] ? groupesLus[id].valeur : {};
          return '<span class="etape">' + (i + 1) + ". " + echapper(v.nom || "Groupe " + id) + "</span>";
        }), ['<span class="etape">Fin</span>']);
        html += '<div class="frise">' + etapes.join('<span class="fleche" aria-hidden="true">→</span>') + "</div>";
      } else {
        html += '<p class="petit">Le professeur placera ici les énigmes dans l\'ordre choisi par la classe.</p>';
      }
      html += "</section>";
    } catch (e) {
      html = '<p class="bandeau ecart">Le dossier n\'a pas pu être lu (' + echapper(e.message) +
        "). Vérifie que tu es bien connecté au réseau du collège, puis clique sur « Changer » pour rouvrir le dossier.</p>";
    }
    zone.innerHTML = html;
  }

  // --- Pour les autres pages (histoire.js, frise.js…) ---
  // Une page s'inscrit dans EscapeLab.pages[id] = async function (zone) { … ; return fonctionPourArreter; }.
  var arreterPage = null;
  var app = racine.EscapeLab = {
    etat: etat, pages: {}, mecaniques: MECANIQUES, pastille: pastille, avancement: avancement,
    dateCourte: dateCourte, auteur: auteur, lettresGroupes: lettresGroupes,
    jalons: function () { return JALONS; },
    nombreGroupes: function () { return REGLAGES.nombreGroupes; },
    rafraichir: afficherPage
  };

  // --- Démarrage ---

  document.addEventListener("DOMContentLoaded", function () {
    var LB = racine.LaboBlocs || {};
    if (LB.chargerCollegeEnLigne) LB.chargerCollegeEnLigne();
    if (LB.EVENEMENT_COLLEGE) document.addEventListener(LB.EVENEMENT_COLLEGE, majAideChemin);
    remplirAccueil();
    $("choixClasse").addEventListener("change", majAideChemin);
    $("btnOuvrir").addEventListener("click", function () { var p = lireFormulaire(); if (p) ouvrirDossier(p); });
    $("btnReprendre").addEventListener("click", async function () {
      var d = lireDernier();
      if (d) ouvrirDossier(d, await retrouverDossier(d.depot));
    });
    $("btnDemo").addEventListener("click", entrerDemo);
    $("btnQuitter").addEventListener("click", quitter);
    racine.addEventListener("hashchange", afficherPage);
  });
})(this);
