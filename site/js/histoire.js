// Page Histoire (brief §7.3) : une carte modifiable par section, modifiable par toute la classe, avec historique,
// puis le rôle de chaque énigme dans l'histoire.
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, Ed = racine.EscapeLabEditeur;

  var SECTIONS = [
    { id: "titre", titre: "Titre", lignes: 1, aide: "Le nom de votre escape game." },
    { id: "theme", titre: "Thème", lignes: 2, aide: "L'univers en une phrase : où, quand, quelle ambiance ?" },
    { id: "pitch", titre: "Résumé", lignes: 4, aide: "Ce qu'on raconte aux joueurs au début : la mission et le temps." },
    { id: "personnages", titre: "Personnages", lignes: 4, aide: "Qui sont les joueurs ? Qui les aide ou les gêne ?" },
    { id: "lieu", titre: "Lieu", lignes: 3, aide: "Ce que représente le foyer dans l'histoire." },
    { id: "deroulement", titre: "Déroulement", lignes: 5, aide: "Les grandes étapes, dans l'ordre de la frise." },
    { id: "fin", titre: "Fin", lignes: 3, aide: "Comment l'histoire se termine quand les joueurs réussissent." }
  ];

  racine.EscapeLab.pages.histoire = async function (zone) {
    var app = racine.EscapeLab, st = app.etat.stockage;
    zone.innerHTML = '<p class="petit">Lecture du dossier…</p>';

    var cartes = SECTIONS.map(function (s) {
      return Ed.creerCarte({ collection: "histoire", id: s.id, titre: s.titre,
        champs: [{ cle: "texte", libelle: s.titre, aide: s.aide, lignes: s.lignes }] });
    });

    var groupes = await st.lister("groupes");
    var roles = groupes.filter(function (g) { return g.valeur.enigme && g.valeur.enigme.roleHistoire; });

    zone.innerHTML = '<p class="bandeau">L\'histoire est écrite par toute la classe. Chaque enregistrement est gardé dans l\'historique : on peut toujours revenir en arrière.</p>';
    var liste = document.createElement("div");
    liste.className = "sections";
    cartes.forEach(function (c) { liste.appendChild(c.noeud); });
    zone.appendChild(liste);

    var blocRoles = document.createElement("section");
    blocRoles.className = "carte";
    blocRoles.innerHTML = "<h3>Le rôle de chaque énigme dans l'histoire</h3>" + (roles.length ? "<ul>" + roles.map(function (g) {
      return "<li>" + app.pastille(g.valeur.mecanique) + " <strong>" + O.echapper(g.valeur.nom || "Groupe " + g.id) + "</strong> : " +
        O.echapper(g.valeur.enigme.roleHistoire) + "</li>";
    }).join("") + "</ul>" : '<p class="petit">Chaque groupe l\'écrira dans sa fiche « Mon énigme ».</p>');
    zone.appendChild(blocRoles);

    return Ed.suivreCartes(cartes);
  };
})(this);
