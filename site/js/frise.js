// Page Frise (brief §7.4) : Début → Énigme → liaison → … → Fin. Seul le professeur place et réordonne les énigmes
// (chaque changement est gardé et visible) ; les notes de début, de liaison et de fin sont modifiables par tous.
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, Ed = racine.EscapeLabEditeur;
  var e = O.echapper;

  var CHAMPS_LIAISON = [
    { cle: "donne", libelle: "Ce que l'énigme d'avant donne", aide: "Un objet, un code, un indice… (ce qui est dans sa boîte).", lignes: 2 },
    { cle: "utilise", libelle: "Ce que l'énigme suivante en fait", lignes: 2 },
    { cle: "lieu", libelle: "Où ça se trouve", lignes: 1 }
  ];

  racine.EscapeLab.pages.frise = async function (zone) {
    var app = racine.EscapeLab, et = app.etat, st = et.stockage;
    zone.innerHTML = '<p class="petit">Lecture du dossier…</p>';

    var groupes = {};
    (await st.lister("groupes")).forEach(function (g) { groupes[g.id] = g.valeur; });
    var tous = app.lettresGroupes(app.nombreGroupes());
    var elementOrdre = await st.lire("frise", "ordre");
    var ordre = elementOrdre ? elementOrdre.valeur.ordre.slice() : [];
    var reglages = await st.lire("equipe", "reglages");
    var dureeJeu = (reglages && reglages.valeur.dureeJeu) || 60;
    var parEnigme = (reglages && reglages.valeur.minutesParEnigme) || 12;
    var seance = reglages && reglages.valeur.seanceActuelle;

    function nomDe(id) { return (groupes[id] && groupes[id].nom) || "Groupe " + id; }

    zone.innerHTML = "";
    var cartes = [];

    // Durée de la partie (alerte en ambre si elle dépasse le temps prévu).
    var durees = {};
    ordre.forEach(function (id) { durees[id] = groupes[id] && groupes[id].enigme && groupes[id].enigme.duree; });
    var duree = O.dureeTotale(ordre, durees, parEnigme);
    var precision = duree.parDefaut ? " (dont " + duree.parDefaut + " énigme" + (duree.parDefaut > 1 ? "s" : "") + " comptée" + (duree.parDefaut > 1 ? "s" : "") + " " + parEnigme + " min par défaut)" : "";
    zone.insertAdjacentHTML("beforeend", ordre.length ? (duree.total > dureeJeu
      ? '<p class="bandeau ecart">Durée estimée : ' + duree.total + " min" + precision + ", pour " + dureeJeu + " min de jeu prévues. Il faudra gagner " + (duree.total - dureeJeu) + " min.</p>"
      : '<p class="bandeau">Durée estimée : ' + duree.total + " min" + precision + " sur " + dureeJeu + " min de jeu prévues.</p>")
      : '<p class="bandeau">Le professeur placera ici les énigmes dans l\'ordre choisi par la classe.</p>');

    // Commandes du professeur : en démonstration, on peut les essayer.
    if (et.demo) {
      zone.insertAdjacentHTML("beforeend", '<label class="case"><input type="checkbox" id="essaiProf"' + (et.prof ? " checked" : "") +
        "> Essayer les commandes du professeur (démonstration)</label>");
      zone.querySelector("#essaiProf").addEventListener("change", function () { et.prof = this.checked; app.rafraichir(); });
    }
    if (et.prof) zone.appendChild(panneauOrdre());

    // La suite : Début → énigmes et liaisons → Fin.
    var suite = document.createElement("div");
    suite.className = "suite";
    function ajouterCarte(carte) { cartes.push(carte); suite.appendChild(carte.noeud); }

    ajouterCarte(Ed.creerCarte({ collection: "frise", id: "debut", titre: "Début de partie (facultatif)",
      champs: [{ cle: "texte", libelle: "Début", aide: "Ce qui se passe à l'arrivée des joueurs.", lignes: 3 }] }));
    ordre.forEach(function (id, i) {
      suite.appendChild(carteEnigme(id, i + 1));
      if (i + 1 < ordre.length) {
        var suivant = ordre[i + 1], boite = groupes[id] && groupes[id].enigme && groupes[id].enigme.contenuBoite;
        var carte = Ed.creerCarte({ collection: "liaisons", id: id + "-" + suivant, titre: "Liaison " + (i + 1) + " → " + (i + 2),
          champs: CHAMPS_LIAISON, parDefaut: boite ? { donne: boite } : {} });
        carte.noeud.classList.add("liaison");
        ajouterCarte(carte);
      }
    });
    ajouterCarte(Ed.creerCarte({ collection: "frise", id: "fin", titre: "Fin de partie",
      champs: [{ cle: "texte", libelle: "Fin", aide: "Dernière révélation, sortie, message final, remise à zéro.", lignes: 4 }] }));
    zone.appendChild(suite);

    zone.appendChild(await blocHistoriqueOrdre());

    function carteEnigme(id, rang) {
      var v = groupes[id] || {}, m = app.mecaniques[v.mecanique];
      var av = app.avancement(v, seance);
      var noeud = document.createElement("article");
      noeud.className = "carte enigme";
      noeud.innerHTML = '<p class="rang">Énigme ' + rang + "</p><h3>" + app.pastille(v.mecanique) + " " + e(nomDe(id)) + "</h3>" +
        '<p class="petit">Groupe ' + e(id) + " · " + e(m ? m.nom : "mécanique à attribuer") + "</p>" +
        "<p>Avancement : " + av.pourcent + " %</p>" +
        "<p>Cadenas : " + e((v.cadenas && v.cadenas.type) || "à attribuer") + "</p>" +
        "<p>Durée estimée : " + (v.enigme && v.enigme.duree ? e(v.enigme.duree) + " min" : "pas encore estimée") + "</p>";
      return noeud;
    }

    function panneauOrdre() {
      var travail = ordre.slice(), glisse = null;
      var panneau = document.createElement("section");
      panneau.className = "carte prof";
      function afficher() {
        var absents = tous.filter(function (id) { return travail.indexOf(id) === -1; });
        panneau.innerHTML = "<h3>Ordre des énigmes (professeur)</h3>" +
          '<p class="petit">Glisser une énigme, ou utiliser les flèches. Chaque changement est gardé et visible par la classe.</p>' +
          '<ol class="ordre">' + travail.map(function (id, i) {
            return '<li draggable="true" data-index="' + i + '"><span class="poignee" aria-hidden="true">⠿</span> ' + e(nomDe(id)) +
              ' <span class="petit">(groupe ' + e(id) + ')</span><span class="commandes">' +
              '<button data-action="monter" data-index="' + i + '" aria-label="Monter ' + e(nomDe(id)) + '">↑</button>' +
              '<button data-action="descendre" data-index="' + i + '" aria-label="Descendre ' + e(nomDe(id)) + '">↓</button>' +
              '<button data-action="retirer" data-index="' + i + '">Retirer</button></span></li>';
          }).join("") + "</ol>" +
          (absents.length ? "<p>Pas encore dans la frise : " + absents.map(function (id) {
            return '<button data-action="ajouter" data-id="' + e(id) + '">+ ' + e(nomDe(id)) + "</button>";
          }).join(" ") + "</p>" : "") +
          '<label for="noteOrdre">Note (facultative)</label><input id="noteOrdre" placeholder="Décidé en classe le …">' +
          '<div class="boutons"><button class="principal" data-action="enregistrer">Enregistrer l\'ordre</button>' +
          '<button data-action="annuler">Annuler les changements</button></div><p class="message" role="status"></p>';
      }
      panneau.addEventListener("click", async function (ev) {
        var b = ev.target.closest("button[data-action]");
        if (!b) return;
        var a = b.getAttribute("data-action"), i = Number(b.getAttribute("data-index"));
        if (a === "monter") travail = O.deplacer(travail, i, -1);
        if (a === "descendre") travail = O.deplacer(travail, i, 1);
        if (a === "retirer") travail.splice(i, 1);
        if (a === "ajouter") travail.push(b.getAttribute("data-id"));
        if (a === "annuler") travail = ordre.slice();
        if (a === "enregistrer") {
          var note = panneau.querySelector("#noteOrdre").value.trim();
          var r = await st.enregistrer("frise", "ordre", { ordre: travail, note: note }, elementOrdre ? elementOrdre.vid : null,
            Object.assign({ prof: true }, et.demo ? {} : { prenom: et.prenom }));
          if (!r.ok) {
            panneau.querySelector(".message").innerHTML = '<span class="ecart">L\'ordre a été changé entre-temps par ' +
              e(O.nomAuteur(r.actuel.auteur)) + ". La page se recharge avec le nouvel ordre.</span>";
            setTimeout(app.rafraichir, 2500);
            return;
          }
          return app.rafraichir();
        }
        afficher();
      });
      panneau.addEventListener("dragstart", function (ev) {
        var li = ev.target.closest("li[data-index]");
        if (li) { glisse = Number(li.getAttribute("data-index")); ev.dataTransfer.effectAllowed = "move"; }
      });
      panneau.addEventListener("dragover", function (ev) { if (glisse !== null && ev.target.closest("li[data-index]")) ev.preventDefault(); });
      panneau.addEventListener("drop", function (ev) {
        var li = ev.target.closest("li[data-index]");
        if (!li || glisse === null) return;
        ev.preventDefault();
        travail = O.deplacer(travail, glisse, Number(li.getAttribute("data-index")) - glisse);
        glisse = null;
        afficher();
      });
      afficher();
      return panneau;
    }

    async function blocHistoriqueOrdre() {
      var bloc = document.createElement("section");
      bloc.className = "carte";
      var versions = await st.historique("frise", "ordre");
      bloc.innerHTML = "<h3>Historique de l'ordre</h3>" + (versions.length ? "<ul>" + versions.slice().reverse().map(function (v) {
        var index = versions.indexOf(v), precedent = index > 0 ? versions[index - 1].valeur.ordre : [];
        return "<li>" + app.dateCourte(v.le) + " · " + e(O.nomAuteur(v.auteur)) + " : " + e(O.decrireChangementOrdre(precedent, v.valeur.ordre, nomDe)) +
          (v.valeur.note ? " · « " + e(v.valeur.note) + " »" : "") + "</li>";
      }).join("") + "</ul>" : '<p class="petit">L\'ordre n\'a pas encore été fixé.</p>');
      return bloc;
    }

    return Ed.suivreCartes(cartes);
  };
})(this);
