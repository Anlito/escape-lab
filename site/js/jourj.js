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
      parDefaut: { etat: "à faire" }, vide: "Pas encore de tâche.",
      modeles: modeles.logistique.length ? [{ libelle: "Ajouter les tâches types", lignes: modeles.logistique.map(function (t) { return { tache: t.tache, quand: t.quand }; }) }] : [] });

    var listeRoles = L.creerListe({ collection: "jourj-roles", titre: "Rôles et textes", disposition: "cartes",
      consigne: "Chaque élève a au moins un rôle et écrit lui-même le texte qu'il dira.",
      colonnes: [{ cle: "role", libelle: "Rôle", type: "choix", options: nomsRoles }, { cle: "eleve", libelle: "Élève(s)", type: "texte", aide: "Prénom(s)" },
                 { cle: "texte", libelle: "Texte à dire", type: "zone", aide: "Écris ton texte avec tes mots." },
                 { cle: "accessoires", libelle: "Accessoires ou costume", type: "texte" }, { cle: "etat", libelle: "État", type: "choix", options: ETATS_ROLE }],
      parDefaut: { etat: "à écrire" }, vide: "Pas encore de rôle.",
      modeles: roles.length ? [{ libelle: "Ajouter les rôles types", lignes: roles.map(function (r) { return { role: r.nom, texte: "" }; }) }] : [],
      apresChangement: function () { majControleRoles(); majJalons(); } });

    function listePlanning(phase, titre, modele, consigne) {
      return L.creerListe({ collection: "jourj-planning", titre: titre, consigne: consigne, filtre: function (v) { return v.phase === phase; },
        colonnes: [{ cle: "heure", libelle: "Heure", type: "heure" }, { cle: "quoi", libelle: "Quoi", type: "texte" },
                   { cle: "qui", libelle: "Qui", type: "texte" }, { cle: "fait", libelle: "Fait", type: "case" }],
        parDefaut: { phase: phase }, vide: "Pas encore d'étape.",
        modeles: (modele || []).length ? [{ libelle: "Ajouter les étapes types", lignes: modele.map(function (q) { return { quoi: q }; }) }] : [] });
    }
    var miseEnPlace = listePlanning("miseEnPlace", "Mise en place", modeles.miseEnPlace, "Qui installe quoi, et à quelle heure.");
    var deroule = listePlanning("deroule", "Déroulé du jeu", modeles.deroule);
    var rangement = listePlanning("rangement", "Rangement", modeles.rangement, "Qui range quoi.");
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

    // --- Mise en page ---
    zone.innerHTML = '<p class="bandeau">La classe organise le jour J ; le professeur voit et complète. Tout est gardé dans l\'historique.</p>';
    function section(titre, noeuds) {
      var s = document.createElement("div");
      s.className = "section-jourj";
      s.innerHTML = "<h2>" + e(titre) + "</h2>";
      noeuds.forEach(function (n) { s.appendChild(n); });
      zone.appendChild(s);
    }
    section("Date et logistique", [cartes[0].noeud, cartes[1].noeud, taches.noeud]);
    section("Rôles et textes", [controle, listeRoles.noeud]);
    var blocRemises = document.createElement("section");
    blocRemises.className = "carte";
    blocRemises.innerHTML = "<h3>Remise à zéro de chaque énigme</h3><p class=\"petit\">Écrite par chaque groupe dans l'onglet « Installation » de sa fiche.</p>" +
      remises.map(function (r) {
        return "<h4>" + e(r.nom) + ' <span class="petit">(groupe ' + e(r.id) + ")</span></h4>" +
          (r.etapes.length ? "<ol>" + r.etapes.map(function (x) { return "<li>☐ " + e(x) + "</li>"; }).join("") + "</ol>" : '<p class="petit vide">Pas encore écrite.</p>');
      }).join("");
    section("Planning du jour", [miseEnPlace.noeud, deroule.noeud, rangement.noeud, verifications.noeud, blocRemises]);
    section("Répétition", [cartes[2].noeud]);

    for (var j = 0; j < listes.length; j++) await listes[j].charger();
    majControleRoles();
    majJalons();

    var arreterCartes = Ed.suivreCartes(cartes);
    var minuterie = setInterval(async function () {
      for (var k = 0; k < listes.length; k++) {
        try { if (await listes[k].rafraichir() && listes[k] === listeRoles) majControleRoles(); } catch (err) { /* relecture suivante */ }
      }
    }, 20000);
    return function () { arreterCartes(); clearInterval(minuterie); };
  };
})(this);
