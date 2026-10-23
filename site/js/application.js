// Escape Lab — accueil, identification, navigation et tableau de bord de l'équipe (brief §6, §7.1, §7.2).
// Chargé avant les fichiers de données : il définit les fonctions definirXxx qu'ils appellent.
(function (racine) {
  "use strict";

  var S = racine.EscapeLabStockage;
  var REGLAGES = null, JALONS = [], MECANIQUES = {}, DEMO = null;
  // Espace professeur : index.html?prof, derrière le code professeur (porte-professeur.js).
  var MODE_PROF = new URLSearchParams(racine.location.search).has("prof");
  var REGLAGES_EQUIPE = {};   // equipe/reglages du dossier : séance, nombre de groupes, échéances…
  var CLE_DERNIER = new URLSearchParams(racine.location.search).has("prof") ? "escape-lab:dernier-prof" : "escape-lab:dernier";

  racine.definirEquipes = function (r) { REGLAGES = r; };
  racine.definirJalons = function (j) { JALONS = j.jalons; };
  // Ébauches du site ; les fiches enregistrées par le professeur dans le dossier les remplacent (chargerReferentiels).
  var EBAUCHES_MECANIQUES = [], EBAUCHES_COMPOSANTS = [];
  racine.definirMecaniques = function (m) { EBAUCHES_MECANIQUES = EBAUCHES_MECANIQUES.concat(m.mecaniques); m.mecaniques.forEach(function (x) { MECANIQUES[x.id] = x; }); };
  racine.definirDemo = function (d) { DEMO = d; };
  var AIDES = {};
  racine.definirAides = function (a) { AIDES = a.champs || {}; };
  var COMPOSANTS = {};
  racine.definirComposants = function (c) { EBAUCHES_COMPOSANTS = c.composants; c.composants.forEach(function (x) { COMPOSANTS[x.id] = x; }); };

  async function chargerReferentiels() {
    [[MECANIQUES, EBAUCHES_MECANIQUES, "mecaniques"], [COMPOSANTS, EBAUCHES_COMPOSANTS, "composants"]].forEach(function (t) {
      Object.keys(t[0]).forEach(function (k) { delete t[0][k]; });
      t[1].forEach(function (x) { t[0][x.id] = x; });
    });
    try {
      (await etat.stockage.lister("mecaniques")).forEach(function (el) { MECANIQUES[el.id] = el.valeur; });
      (await etat.stockage.lister("composants")).forEach(function (el) { COMPOSANTS[el.id] = el.valeur; });
      var r = await etat.stockage.lire("equipe", "reglages");
      REGLAGES_EQUIPE = r ? r.valeur : {};
      memoriserNombreGroupes(etat.depot, REGLAGES_EQUIPE.nombreGroupes);
    } catch (err) { /* dossier illisible : les ébauches du site restent */ }
  }

  // Messages des contrôles : ceux de donnees/messages.js (tâche C7) en priorité, sinon ceux-ci. {x} est remplacé.
  var MESSAGES = {
    indiceManquant1: "Il manque encore l'indice de niveau 1 : où regarder ?",
    indiceManquant2: "Il manque encore l'indice de niveau 2 : comment s'y prendre ?",
    indiceManquant3: "Il manque encore l'indice de niveau 3 : la dernière action à faire.",
    talkieManquant: "Il manque la phrase à dire au talkie-walkie pour le niveau {niveau}.",
    solutionManquante: "Il manque encore la solution : le professeur en a besoin pour vérifier.",
    matiereManquante: "Il manque encore la matière vue en cours et le lien avec l'énigme.",
    lienMatiereTropCourt: "Explique le lien avec la matière en deux ou trois phrases.",
    contenuBoiteManquant: "Écris ce qui est dans la boîte : c'est ce qui passe à l'énigme suivante.",
    memeBroche: "Deux composants sont sur la broche {broche} : choisis une autre broche pour l'un d'eux.",
    brocheIndisponible: "La broche « {broche} » n'existe pas sur cette carte : vérifie son nom.",
    brochesEnvoi: "D0 et D1 servent à envoyer le programme : préfère une autre broche.",
    capteurManquant: "Il manque encore un capteur : l'énigme doit réagir à une action des joueurs.",
    actionneurManquant: "Il manque encore un actionneur : quelque chose doit bouger, sonner ou s'allumer.",
    masseCommune: "Aucun fil ne va à GND : les composants ont besoin d'une masse commune.",
    douzeVoltsSansRelais: "12 V : relais et alimentation séparée, jamais sur la carte ni la platine.",
    validationProfAvantTension: "Avant toute mise sous tension, le professeur vérifie et valide le montage.",
    aVerifier: "Information pas encore vérifiée sur le composant réel : demande au professeur avant de brancher.",
    dureeEnigmeLongue: "Ton énigme dure plus de {minutes} min : la partie risque d'être trop longue."
  };
  var MESSAGES_JALONS = {};
  racine.definirMessages = function (m) { Object.assign(MESSAGES, m.controles || {}); MESSAGES_JALONS = m.jalons || {}; };

  // Personne connectée et dossier ouvert.
  // prof : commandes du professeur (ordre de la frise…), données par prof.html ou essayées en démonstration.
  var etat = { equipe: null, depot: "", groupe: "", prenom: "", stockage: null, adaptateur: null,
               demo: false, nomDossier: "", prof: MODE_PROF };

  var PAGES = [
    { id: "tableau", nom: "Tableau de bord" },
    { id: "histoire", nom: "Histoire", etape: 5 },
    { id: "frise", nom: "Frise", etape: 5 },
    { id: "bibliotheque", nom: "Bibliothèque", etape: 6 },
    { id: "enigme", nom: "Mon énigme", eleve: true },
    { id: "autres", nom: "Énigmes des autres", nomProf: "Fiches des groupes" },
    { id: "programmation", nom: "Programmation", etape: 10 },
    { id: "jourj", nom: "Jour J", etape: 8 },
    { id: "suivi", nom: "Suivi des groupes", prof: true },
    { id: "pilotage", nom: "Pilotage", prof: true },
    { id: "evaluation", nom: "Évaluation", prof: true },
    { id: "observation", nom: "Observation jour J", prof: true },
    { id: "exports", nom: "Exports", prof: true }
  ];
  function pagesVisibles() {
    return PAGES.filter(function (p) { return MODE_PROF ? !p.eleve : !p.prof; });
  }

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

  function auteur() { return MODE_PROF ? { prof: true } : { classe: etat.depot, groupe: etat.groupe, prenom: etat.prenom }; }

  // Nombre de groupes : réglé par le professeur dans le dossier, sinon celui de donnees/equipes.js.
  function nombreGroupes() { return REGLAGES_EQUIPE.nombreGroupes || REGLAGES.nombreGroupes; }
  // Jalons avec les échéances réglées par le professeur (equipe/reglages.echeances).
  function jalonsActuels() {
    var ech = REGLAGES_EQUIPE.echeances || {};
    return JALONS.map(function (j) { return ech[j.id] ? Object.assign({}, j, { seance: ech[j.id] }) : j; });
  }

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

  // Nombre de groupes vu au dernier passage dans le dossier de cette classe (liste « Ton groupe » de l'accueil).
  function nombreGroupesMemorise(depot) {
    try { return Number(localStorage.getItem("escape-lab:groupes:" + depot)) || REGLAGES.nombreGroupes; } catch (e) { return REGLAGES.nombreGroupes; }
  }
  function memoriserNombreGroupes(depot, n) {
    try { if (n) localStorage.setItem("escape-lab:groupes:" + depot, String(n)); } catch (e) { /* navigation privée */ }
  }

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
    $("choixGroupe").innerHTML = '<option value="">Choisir…</option>' + lettresGroupes(nombreGroupesMemorise($("choixClasse").value))
      .map(function (g) { return '<option value="' + g + '">Groupe ' + g + "</option>"; }).join("");

    var dernier = lireDernier();
    if (dernier && equipeDuDepot(dernier.depot)) {
      $("btnReprendre").hidden = false;
      $("btnReprendre").textContent = MODE_PROF ? "Reprendre : " + dernier.depot : "Reprendre : " + dernier.prenom + ", groupe " + dernier.groupe + " (" + dernier.depot + ")";
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
    if (!depot) return messageAccueil(MODE_PROF ? "Choisis la classe." : "Choisis ta classe.");
    if (MODE_PROF) { messageAccueil(""); return { depot: depot, groupe: "", prenom: "Professeur" }; }
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
    $("connecte").innerHTML = (MODE_PROF ? "<strong>Professeur</strong> · " + echapper(etat.depot)
      : "<strong>" + echapper(etat.prenom) + "</strong> · groupe " + echapper(etat.groupe)) +
      " · " + echapper(etat.equipe.nom) + (demo ? " · démonstration" : "");
    if (!location.hash) location.hash = "#tableau";
    chargerReferentiels().then(afficherPage);
  }

  async function entrerDemo() {
    var adaptateur = S.creerAdaptateurMemoire();
    var stockage = S.creerStockage(adaptateur, { depot: DEMO.equipe.depots[0] });
    for (var i = 0; i < DEMO.elements.length; i++) {
      var e = DEMO.elements[i];
      await stockage.enregistrer(e.collection, e.id, e.valeur, null, { prenom: "Démo" });
    }
    entrer(MODE_PROF ? { depot: DEMO.equipe.depots[0], groupe: "", prenom: "Professeur" } : { depot: DEMO.equipe.depots[0], groupe: "A", prenom: "Visiteur" }, adaptateur, true, DEMO.equipe.depots[0]);
  }

  function quitter() {
    if (arreterPage) { arreterPage(); arreterPage = null; }
    etat.stockage = etat.adaptateur = null;
    etat.prof = MODE_PROF;
    $("espace").hidden = true;
    $("accueil").hidden = false;
    history.replaceState(null, "", location.pathname);
    document.title = "Escape Lab";
    remplirAccueil();
  }

  // --- Navigation ---

  function pageCourante() {
    var id = location.hash.replace("#", "");
    var visibles = pagesVisibles();
    return visibles.filter(function (p) { return p.id === id; })[0] || visibles[0];
  }

  function afficherNavigation(page) {
    $("navigation").innerHTML = pagesVisibles().map(function (p) {
      return '<a href="#' + p.id + '"' + (p === page ? ' aria-current="page"' : "") + ">" + echapper(MODE_PROF && p.nomProf || p.nom) + "</a>";
    }).join("");
  }

  async function afficherPage() {
    if (!etat.stockage) return;
    var page = pageCourante();
    afficherNavigation(page);
    document.title = page.nom + " — Escape Lab";
    // Un conteneur neuf par affichage : les écouteurs d'une page quittée ne reçoivent plus rien.
    var zone = document.createElement("div");
    $("contenu").replaceChildren(zone);
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
    var JALONS = jalonsActuels();
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

  // Résumé de la page Jour J (brief §7.9) : date, tâches faites, élèves encore sans rôle.
  async function resumeJourJ(st, groupesLus) {
    var date = await st.lire("jourj", "date");
    var taches = (await st.lister("jourj-taches")).filter(function (t) { return !t.valeur.retiree && t.valeur.tache; });
    var roles = (await st.lister("jourj-roles")).filter(function (r) { return !r.valeur.retiree; }).map(function (r) { return r.valeur; });
    var eleves = [];
    var ids = lettresGroupes(nombreGroupes());
    for (var i = 0; i < ids.length; i++) {
      var en = await st.lire("fiches", ids[i] + "-enigme");
      var membres = en ? en.valeur.membres : (groupesLus[ids[i]] && groupesLus[ids[i]].valeur.membres);
      (membres || []).forEach(function (m) { if (m.prenom) eleves.push(m.prenom); });
    }
    var sans = racine.EscapeLabFiche.elevesSansRole(eleves, roles);
    var faites = taches.filter(function (t) { return t.valeur.etat === "fait"; }).length;
    return '<section class="carte"><h2>Jour J</h2><p>Date : ' + echapper((date && date.valeur.date) || "pas encore fixée") + "</p>" +
      "<p>Tâches faites : " + faites + " sur " + taches.length + " · Rôles : " + roles.length + "</p>" +
      (eleves.length ? (sans.length ? '<p class="ecart">Encore sans rôle : ' + sans.length + " élève" + (sans.length > 1 ? "s" : "") + "</p>" : "<p>✓ Chaque élève a un rôle.</p>") : "") +
      '<p><a href="#jourj">Ouvrir la page Jour J</a></p></section>';
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
      var annonces = (await st.lister("annonces")).filter(function (a) { return !a.valeur.retiree; }).sort(function (a, b) {
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
      lettresGroupes(nombreGroupes()).forEach(function (id) {
        var g = groupesLus[id], v = g ? g.valeur : {};
        var av = avancement(v, seance);
        var m = MECANIQUES[v.mecanique];
        html += '<article class="carte groupe"><h3>' + pastille(v.mecanique) + echapper(v.nom || "Groupe " + id) + "</h3>" +
          '<p class="petit">Groupe ' + id + " · " + echapper(m ? m.nom : "mécanique à attribuer") +
          (id === etat.groupe ? ' · <span class="etiquette">ton groupe</span>' : "") + "</p>" +
          '<div class="barre" role="img" aria-label="' + av.pourcent + ' % des jalons faits"><div style="width:' + av.pourcent + '%"></div></div>' +
          "<p>" + av.faits + " jalon" + (av.faits > 1 ? "s" : "") + " fait" + (av.faits > 1 ? "s" : "") + " sur " + jalonsActuels().length + " (" + av.pourcent + " %)</p>" +
          (av.retard.length ? '<p class="ecart">Encore à faire : ' + echapper(av.retard.join(", ")) + "</p>" : "") +
          '<p class="petit">' + (g ? "Dernière activité : " + dateCourte(g.le) : "Pas encore commencé") + "</p></article>";
      });
      html += "</div></section>";

      html += await resumeJourJ(st, groupesLus);

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
    jalons: jalonsActuels,
    modeProf: MODE_PROF,
    reglagesEquipe: function () { return REGLAGES_EQUIPE; },
    // Texte d'aide d'un champ (donnees/aides.js) : { consigne, exemple, phraseACompleter }, ou {}.
    aide: function (id) { return AIDES[id] || {}; },
    composants: COMPOSANTS,
    // Message d'un jalon selon son état (« à faire », « en cours », « fait » ou « enRetard »).
    messageJalon: function (id, etat) {
      var m = MESSAGES_JALONS[id] || {};
      return m[{ "à faire": "aFaire", "en cours": "enCours", "fait": "fait", "enRetard": "enRetard" }[etat]] || "";
    },
    message: function (id, valeurs) {
      return String(MESSAGES[id] || id).replace(/\{(\w+)\}/g, function (t, cle) { return valeurs && valeurs[cle] != null ? valeurs[cle] : t; });
    },
    nombreGroupes: nombreGroupes,
    garderDossier: garderDossier,
    retrouverDossier: retrouverDossier,
    rechargerReglages: async function () {
      var r = await etat.stockage.lire("equipe", "reglages");
      REGLAGES_EQUIPE = r ? r.valeur : {};
      memoriserNombreGroupes(etat.depot, REGLAGES_EQUIPE.nombreGroupes);
    },
    rafraichir: afficherPage
  };

  // --- Démarrage ---

  document.addEventListener("DOMContentLoaded", function () {
    var LB = racine.LaboBlocs || {};
    if (LB.chargerCollegeEnLigne) LB.chargerCollegeEnLigne();
    if (LB.EVENEMENT_COLLEGE) document.addEventListener(LB.EVENEMENT_COLLEGE, majAideChemin);
    remplirAccueil();
    $("choixClasse").addEventListener("change", function () {
      majAideChemin();
      var choisi = $("choixGroupe").value;
      $("choixGroupe").innerHTML = '<option value="">Choisir…</option>' + lettresGroupes(nombreGroupesMemorise(this.value))
        .map(function (g) { return '<option value="' + g + '"' + (g === choisi ? " selected" : "") + ">Groupe " + g + "</option>"; }).join("");
    });
    if (MODE_PROF) {
      document.body.classList.add("mode-prof");
      $("introAccueil").textContent = "Espace professeur : choisis la classe, puis ouvre le dossier de la classe.";
      document.querySelector(".champs-eleve").hidden = true;
      document.querySelector("label[for=choixClasse]").textContent = "Classe";
      $("btnVerrouiller").hidden = false;
      $("lienProf").hidden = false;
      $("btnVerrouiller").addEventListener("click", function () { if (racine.EscapeLabPorte) racine.EscapeLabPorte.verrouiller(); });
    }
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
