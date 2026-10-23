// Page Jour J (brief §7.9) : organisée par la classe, modifiable par tous, avec historique. Date et logistique,
// rôles et textes (chaque élève a au moins un rôle), planning (mise en place, déroulé, rangement), répétition.
// Stockage : jourj/<section> (cartes de texte), jourj-taches/, jourj-roles/, jourj-planning/ (une ligne = un élément).
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, F = racine.EscapeLabFiche, Ed = racine.EscapeLabEditeur, L = racine.EscapeLabLignes;
  var e = O.echapper;
  var MODELES = null;
  racine.definirModelesJourJ = function (m) { MODELES = m; };

  var ETATS_TACHE = ["à faire", "en cours", "fait"];
  var ETATS_ROLE = ["à écrire", "écrit", "répété"];
  // Rôle « régie caméras » : phase 2, seulement après décision du professeur (brief §7.10).
  var ROLES_EXCLUS = ["regie-cameras"];

  racine.EscapeLab.pages.jourj = async function (zone) {
    var app = racine.EscapeLab, et = app.etat, st = et.stockage;
    zone.innerHTML = '<p class="petit">Lecture du dossier…</p>';

    // Élèves de la classe : membres écrits dans les fiches « Mon énigme » de chaque groupe.
    var groupes = {}, membresParGroupe = {}, remises = [];
    (await st.lister("groupes")).forEach(function (g) { groupes[g.id] = g.valeur; });
    var frise = await st.lire("frise", "ordre");
    var ordre = frise ? frise.valeur.ordre : [];
    var ids = app.lettresGroupes(app.nombreGroupes());
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i], enigme = await st.lire("fiches", id + "-enigme"), installation = await st.lire("fiches", id + "-installation");
      var g = groupes[id] || {};
      membresParGroupe[id] = ((enigme ? enigme.valeur.membres : g.membres) || []).map(function (m) { return m.prenom; }).filter(Boolean);
      var raz = installation ? installation.valeur.remiseAZero : (g.installation || {}).remiseAZero;
      remises.push({ id: id, nom: (enigme && enigme.valeur.titre) || g.nom || "Groupe " + id, etapes: raz || [], rang: ordre.indexOf(id) });
    }
    remises.sort(function (a, b) { return (a.rang < 0 ? 99 : a.rang) - (b.rang < 0 ? 99 : b.rang); });
    var eleves = [].concat.apply([], ids.map(function (id) { return membresParGroupe[id]; }));

    // --- Cartes de texte (comme l'histoire) ---
    var cartes = [
      Ed.creerCarte({ collection: "jourj", id: "date", titre: "Date et lieu", consigne: "La date se décide avec la direction : écrivez-la quand elle est confirmée.",
        champs: [{ cle: "date", libelle: "Date et horaires", lignes: 1, idAide: "jourJ.logistique" },
                 { cle: "lieu", libelle: "Lieu", lignes: 1 }, { cle: "accord", libelle: "Accord de la direction (quand, par qui)", lignes: 1 }],
        parDefaut: { lieu: "Le foyer" } }),
      Ed.creerCarte({ collection: "jourj", id: "invites", titre: "Joueurs invités et cours",
        champs: [{ cle: "joueurs", libelle: "Joueurs invités : nombre et fonction (jamais de noms)", aide: "Par exemple : 5 joueurs, deux professeurs et trois agents.", lignes: 2 },
                 { cle: "cours", libelle: "Cours déplacés ou annulés", lignes: 2 }, { cle: "materiel", libelle: "Matériel à réserver", lignes: 2 }] }),
      Ed.creerCarte({ collection: "jourj", id: "repetition", titre: "Répétition", idAide: "jourJ.repetition",
        champs: [{ cle: "faite", libelle: "Répétition faite (date) ou prévue", lignes: 1, idAide: "jourJ.repetition" },
                 { cle: "remarques", libelle: "Remarques après la répétition", lignes: 3 }] })
    ];

    // --- Listes ---
    var modeles = MODELES || { roles: [], logistique: [], miseEnPlace: [], deroule: [], rangement: [], verifications: [] };
    var roles = modeles.roles.filter(function (r) { return ROLES_EXCLUS.indexOf(r.id) === -1; });
    var nomsRoles = roles.map(function (r) { return r.nom; }).concat(["Responsable de l'énigme", "Autre rôle"])
      .filter(function (x, i, t) { return t.indexOf(x) === i; });

    var taches = L.creerListe({ collection: "jourj-taches", titre: "Tâches à organiser", consigne: "Chaque tâche a un responsable et un état.",
      colonnes: [{ cle: "tache", libelle: "Tâche", type: "texte" }, { cle: "quand", libelle: "Pour quand", type: "texte" },
                 { cle: "responsable", libelle: "Responsable", type: "texte" }, { cle: "etat", libelle: "État", type: "choix", options: ETATS_TACHE }],
      parDefaut: { etat: "à faire" }, vide: "Pas encore de tâche.", apresChangement: function () { majResume(); },
      modeles: modeles.logistique.length ? [{ libelle: "Ajouter les tâches types", lignes: modeles.logistique.map(function (t) { return { tache: t.tache, quand: t.quand }; }) }] : [] });

    var listeRoles = L.creerListe({ collection: "jourj-roles", titre: "Rôles et textes", disposition: "cartes",
      consigne: "Chaque élève a au moins un rôle et écrit lui-même le texte qu'il dira.",
      colonnes: [{ cle: "role", libelle: "Rôle", type: "choix", options: nomsRoles }, { cle: "eleve", libelle: "Élève(s)", type: "texte", aide: "Prénom(s)" },
                 { cle: "texte", libelle: "Texte à dire", type: "zone", aide: "Écris ton texte avec tes mots." },
                 { cle: "accessoires", libelle: "Accessoires ou costume", type: "texte" }, { cle: "etat", libelle: "État", type: "choix", options: ETATS_ROLE }],
      parDefaut: { etat: "à écrire" }, vide: "Pas encore de rôle.",
      modeles: roles.length ? [{ libelle: "Ajouter les rôles types", lignes: roles.map(function (r) { return { role: r.nom, texte: "" }; }) }] : [],
      apresChangement: function () { majControleRoles(); majJalons(); majResume(); } });

    function listePlanning(phase, titre, modele, consigne) {
      return L.creerListe({ collection: "jourj-planning", titre: titre, consigne: consigne, filtre: function (v) { return v.phase === phase; }, apresChangement: function () { majResume(); },
        colonnes: [{ cle: "heure", libelle: "Heure", type: "heure" }, { cle: "quoi", libelle: "Quoi", type: "texte" },
                   { cle: "qui", libelle: "Qui", type: "texte" }, { cle: "fait", libelle: "Fait", type: "case" }],
        parDefaut: { phase: phase }, vide: "Pas encore d'étape.",
        modeles: (modele || []).length ? [{ libelle: "Ajouter les étapes types", lignes: modele.map(function (q) { return { quoi: q }; }) }] : [] });
    }
    var miseEnPlace = listePlanning("miseEnPlace", "Avant · la mise en place", modeles.miseEnPlace, "Qui installe quoi, et à quelle heure.");
    var deroule = listePlanning("deroule", "Pendant · le déroulé du jeu", modeles.deroule, "Les grands moments de la partie, dans l'ordre.");
    var rangement = listePlanning("rangement", "Après · le rangement", modeles.rangement, "Qui range quoi.");
    var verifications = listePlanning("verifications", "Tout est à sa place", modeles.verifications, "À cocher à la fin de la mise en place et du rangement.");
    var listes = [taches, listeRoles, miseEnPlace, deroule, rangement, verifications];

    // --- Contrôle « chaque élève a au moins un rôle » ---
    var controle = document.createElement("div");
    function majControleRoles() {
      if (!eleves.length) { controle.innerHTML = '<p class="petit">Les prénoms des élèves viennent des fiches « Mon énigme » (membres et rôles).</p>'; return; }
      var sans = F.elevesSansRole(eleves, listeRoles.lignes());
      controle.innerHTML = sans.length
        ? '<p class="bandeau ecart">Encore sans rôle : ' + e(sans.join(", ")) + ". Chaque élève a au moins un rôle.</p>"
        : '<p class="bandeau">✓ Chaque élève de la classe a au moins un rôle.</p>';
    }

    // Jalon J1 de chaque groupe, recopié dans groupes/<g> (lu par le tableau de bord).
    var majEnCours = false;
    async function majJalons() {
      if (majEnCours) return;
      majEnCours = true;
      try {
        var r = listeRoles.lignes();
        for (var i = 0; i < ids.length; i++) {
          var etatJ1 = F.etatJourJ(membresParGroupe[ids[i]], r);
          for (var essai = 0; essai < 3; essai++) {
            var actuel = await st.lire("groupes", ids[i]);
            var v = Object.assign({}, actuel ? actuel.valeur : {});
            var ancien = (v.jalons || {}).jourJ || {};
            if ((ancien.etat || ancien) === etatJ1 || (!actuel && etatJ1 === "à faire")) break;
            v.jalons = Object.assign({}, v.jalons || {}, { jourJ: { etat: etatJ1, valide: !!ancien.valide } });
            if ((await st.enregistrer("groupes", ids[i], v, actuel ? actuel.vid : null, app.auteur())).ok) break;
          }
        }
      } catch (err) { /* le jalon sera recalculé au prochain changement */ }
      majEnCours = false;
    }

    // --- Mise en page : chiffres clés, puis une partie à la fois ---
    var PARTIES = [["logistique", "Date et logistique"], ["roles", "Rôles et textes"], ["planning", "Planning du jour"], ["repetition", "Répétition"]];
    var CLE = "escape-lab:jourj-partie", partie = "logistique";
    try { partie = localStorage.getItem(CLE) || partie; } catch (err) { /* navigation privée */ }
    zone.innerHTML = '<p class="bandeau">La classe organise le jour J ; le professeur voit et complète. Tout est gardé dans l\'historique.</p>' +
      '<div class="chiffres" id="resumeJourJ"></div><div class="pastilles" role="tablist" aria-label="Parties du jour J">' + PARTIES.map(function (p, i) {
        return '<button class="pastille-filtre" role="tab" data-partie="' + p[0] + '"><b>' + (i + 1) + "</b>&nbsp;· " + e(p[1]) + ' <span class="compte" data-compte="' + p[0] + '"></span></button>';
      }).join("") + "</div>";
    var blocs = {};
    function partieBloc(id, noeuds, classe) {
      var b = document.createElement("div");
      b.className = "partie-jourj " + (classe || "");
      b.setAttribute("role", "tabpanel");
      noeuds.forEach(function (n) { b.appendChild(n); });
      zone.appendChild(b);
      blocs[id] = b;
    }
    var duo = document.createElement("div");
    duo.className = "grille-deux";
    duo.appendChild(cartes[0].noeud); duo.appendChild(cartes[1].noeud);
    partieBloc("logistique", [duo, taches.noeud]);
    partieBloc("roles", [controle, listeRoles.noeud]);
    var blocRemises = document.createElement("section");
    blocRemises.className = "carte";
    blocRemises.innerHTML = "<h3>Remise à zéro de chaque énigme</h3><p class=\"petit\">Écrite par chaque groupe dans l'onglet « Installation » de sa fiche.</p>" +
      remises.map(function (r) {
        return "<h4>" + e(r.nom) + ' <span class="petit">(groupe ' + e(r.id) + ")</span></h4>" +
          (r.etapes.length ? "<ol>" + r.etapes.map(function (x) { return "<li>☐ " + e(x) + "</li>"; }).join("") + "</ol>" : '<p class="petit vide">Pas encore écrite.</p>');
      }).join("");
    var fin2 = document.createElement("div");
    fin2.className = "grille-deux";
    fin2.appendChild(verifications.noeud); fin2.appendChild(blocRemises);
    var etapesJour = document.createElement("div");
    etapesJour.className = "etapes-jour";
    [miseEnPlace, deroule, rangement].forEach(function (l, i) {
      var etape = document.createElement("div");
      etape.className = "etape-jour";
      etape.innerHTML = '<span class="numero-case" aria-hidden="true">' + (i + 1) + "</span>";
      etape.appendChild(l.noeud);
      etapesJour.appendChild(etape);
    });
    partieBloc("planning", [etapesJour, fin2]);
    partieBloc("repetition", [cartes[2].noeud]);

    function montrer(id) {
      partie = blocs[id] ? id : "logistique";
      try { localStorage.setItem(CLE, partie); } catch (err) { /* navigation privée */ }
      Object.keys(blocs).forEach(function (k) { blocs[k].hidden = k !== partie; });
      zone.querySelectorAll("[data-partie]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-partie") === partie)); b.setAttribute("aria-selected", String(b.getAttribute("data-partie") === partie)); });
    }
    zone.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-partie]");
      if (b) montrer(b.getAttribute("data-partie"));
    });
    montrer(partie);

    // Chiffres clés, recalculés à chaque changement.
    async function majResume() {
      var d = await st.lire("jourj", "date"), rep = await st.lire("jourj", "repetition");
      var t = taches.lignes().filter(function (x) { return x.tache; }), tFaites = t.filter(function (x) { return x.etat === "fait"; }).length;
      var roles = listeRoles.lignes(), sans = eleves.length ? F.elevesSansRole(eleves, roles).length : null;
      var plan = [miseEnPlace, deroule, rangement, verifications].reduce(function (a, l) { return a.concat(l.lignes()); }, []).filter(function (x) { return x.quoi; });
      var pFaites = plan.filter(function (x) { return x.fait; }).length;
      var repetee = rep && rep.valeur.faite && String(rep.valeur.faite).trim();
      function chiffre(valeur, libelle, ecart) { return '<div class="chiffre' + (ecart ? " ecart-chiffre" : "") + '"><b>' + e(valeur) + "</b><span>" + e(libelle) + "</span></div>"; }
      zone.querySelector("#resumeJourJ").innerHTML =
        chiffre((d && d.valeur.date) || "à fixer", "date du jeu", !(d && d.valeur.date)) +
        chiffre(tFaites + " / " + t.length, "tâches faites") +
        chiffre(sans === null ? roles.length : sans === 0 ? "✓" : String(sans), sans === null ? "rôles" : sans === 0 ? "chaque élève a un rôle" : "élève" + (sans > 1 ? "s" : "") + " sans rôle", sans > 0) +
        chiffre(pFaites + " / " + plan.length, "étapes du planning faites") +
        chiffre(repetee ? "✓" : "à faire", "répétition", !repetee);
      var comptes = { logistique: t.length ? tFaites + "/" + t.length : "", roles: roles.length ? String(roles.length) : "", planning: plan.length ? pFaites + "/" + plan.length : "", repetition: repetee ? "✓" : "" };
      zone.querySelectorAll("[data-compte]").forEach(function (c) { var v = comptes[c.getAttribute("data-compte")]; c.textContent = v ? "(" + v + ")" : ""; });
    }

    for (var j = 0; j < listes.length; j++) await listes[j].charger();
    majControleRoles();
    majJalons();
    majResume();

    var arreterCartes = Ed.suivreCartes(cartes);
    var minuterie = setInterval(async function () {
      for (var k = 0; k < listes.length; k++) {
        try { if (await listes[k].rafraichir() && listes[k] === listeRoles) majControleRoles(); } catch (err) { /* relecture suivante */ }
      }
      majResume();
    }, 20000);
    return function () { arreterCartes(); clearInterval(minuterie); };
  };
})(this);
