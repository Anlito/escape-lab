// Page Frise (brief §7.4) : Début → Énigme → liaison → … → Fin. Seul le professeur place et réordonne les énigmes
// (chaque changement est gardé et visible) ; les notes de début, de liaison et de fin sont modifiables par tous.
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, Ed = racine.EscapeLabEditeur;
  var e = O.echapper;

  var CHAMPS_LIAISON = [
    { cle: "donne", libelle: "Ce que l'énigme d'avant donne", aide: "Un objet, un code, un indice… (ce qui est dans sa boîte).", idAide: "liaison.donne", lignes: 2 },
    { cle: "utilise", libelle: "Ce que l'énigme suivante en fait", idAide: "liaison.utilise", lignes: 2 },
    { cle: "lieu", libelle: "Où ça se trouve", idAide: "liaison.lieu", lignes: 1 }
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
    var liaisons = {}, notes = { debut: await st.lire("frise", "debut"), fin: await st.lire("frise", "fin") };
    for (var k = 0; k + 1 < ordre.length; k++) {
      var l = await st.lire("liaisons", ordre[k] + "-" + ordre[k + 1]);
      if (l) liaisons[ordre[k]] = l.valeur;
    }

    // Durée de la partie, découpée par énigme (alerte en ambre si elle dépasse le temps prévu).
    var durees = {};
    ordre.forEach(function (id) { durees[id] = groupes[id] && groupes[id].enigme && groupes[id].enigme.duree; });
    var duree = O.dureeTotale(ordre, durees, parEnigme);
    var precision = duree.parDefaut ? " (dont " + duree.parDefaut + " comptée" + (duree.parDefaut > 1 ? "s" : "") + " " + parEnigme + " min par défaut)" : "";
    if (!ordre.length) zone.insertAdjacentHTML("beforeend", '<p class="bandeau">Le professeur placera ici les énigmes dans l\'ordre choisi par la classe.</p>');
    else if (duree.total > dureeJeu) zone.insertAdjacentHTML("beforeend", '<p class="bandeau ecart">La partie dure ' + duree.total + " min" + precision + ", pour " + dureeJeu + " min prévues. Il faudra gagner " + (duree.total - dureeJeu) + " min.</p>");

    // Commandes du professeur : en démonstration, on peut les essayer.
    if (et.demo && !app.modeProf) {
      zone.insertAdjacentHTML("beforeend", '<label class="case"><input type="checkbox" id="essaiProf"' + (et.prof ? " checked" : "") +
        "> Essayer les commandes du professeur (démonstration)</label>");
      zone.querySelector("#essaiProf").addEventListener("change", function () { et.prof = this.checked; app.rafraichir(); });
    }
    if (et.prof) zone.appendChild(panneauOrdre());

    // La chaîne : Début → une carte par énigme (ce qu'elle transmet) → Sortie.
    var fleche = '<span class="chaine-fleche" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
    var cadenas = '<svg width="58" height="58" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 22v-6a8 8 0 0 1 16 0v6"/><rect x="10" y="22" width="28" height="20" rx="4"/><path d="M24 30v5"/></svg>';
    var partie = document.createElement("section");
    partie.className = "carte";
    partie.innerHTML = '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:14px"><h2 style="margin:0">Chaque boîte ouvre la suivante</h2>' +
      (ordre.length ? '<div class="duree-partie"><span class="petit">Durée de la partie : ' + duree.total + " min sur " + dureeJeu + precision + '</span><div class="duree-barre" role="img" aria-label="' +
        duree.total + " minutes sur " + dureeJeu + '">' + ordre.map(function (id) {
          var m = app.mecaniques[(groupes[id] || {}).mecanique];
          return '<span style="width:' + (100 * (Number(durees[id]) || parEnigme) / Math.max(dureeJeu, duree.total)) + "%;background:" + (m ? m.couleur : "var(--texte-doux)") + '"></span>';
        }).join("") + "</div></div>" : "") + "</div>" +
      '<div class="chaine-cadre"><button class="chaine-nav gauche" aria-label="Énigmes précédentes" hidden>‹</button><div class="chaine"><div class="chaine-bout"><b>DÉBUT</b><span>' + e((notes.debut && notes.debut.valeur.texte) || "Comment commence la partie ?") + "</span></div>" +
      ordre.map(function (id, i) {
        var v = groupes[id] || {}, m = app.mecaniques[v.mecanique], av = app.avancement(v, seance);
        var boite = (liaisons[id] && liaisons[id].donne) || (v.enigme && v.enigme.contenuBoite) || (i + 1 < ordre.length ? "à préciser" : "la fin de la partie");
        var etat = av.pourcent === 100 ? '<span class="etat-fait">● prête</span>' : av.retard.length ? '<span class="etat-retard">! en retard</span>' : '<span class="etat-en-cours">◐ en préparation</span>';
        return fleche + '<button class="maillon' + (id === et.groupe && !app.modeProf ? " moi" : "") + '" data-aller="' + e(id) + '" style="--teinte:' + (m ? m.couleur : "var(--or)") + '">' +
          '<span class="haut" style="background:' + (m ? m.couleur + "22" : "var(--fond-menu)") + ";color:" + (m ? m.couleur : "var(--or)") + '"><span class="numero-case">' + (i + 1) + "</span>" + cadenas +
          '<span class="duree">' + (v.enigme && v.enigme.duree ? e(v.enigme.duree) + " min" : parEnigme + " min ?") + "</span></span>" +
          '<span class="bas"><span class="petit">Groupe ' + e(id) + " · " + e(m ? m.nom : "mécanique à attribuer") + "</span><strong>" + e(nomDe(id)) + "</strong>" +
          '<span class="petit">Cadenas : ' + e((v.cadenas && v.cadenas.type) || "à attribuer") + "</span>" +
          '<span class="dans-la-boite"><small>Dans la boîte</small>' + e(boite) + "</span>" + etat + "</span></button>";
      }).join("") + fleche +
      '<div class="chaine-bout sortie"><b>SORTIE</b><span>' + e((notes.fin && notes.fin.valeur.texte) || "Comment se termine la partie ?") + "</span></div></div><button class=\"chaine-nav droite\" aria-label=\"Énigmes suivantes\" hidden>›</button></div>";
    zone.appendChild(partie);

    // Flèches ‹ › quand la chaîne est plus large que l'écran : elles avancent d'une énigme à la fois.
    var chaine = partie.querySelector(".chaine"), gauche = partie.querySelector(".chaine-nav.gauche"), droite = partie.querySelector(".chaine-nav.droite");
    function majFleches() {
      var deborde = chaine.scrollWidth > chaine.clientWidth + 4;
      gauche.hidden = !deborde || chaine.scrollLeft <= 4;
      droite.hidden = !deborde || chaine.scrollLeft + chaine.clientWidth >= chaine.scrollWidth - 4;
      partie.querySelector(".chaine-cadre").classList.toggle("suite-a-droite", !droite.hidden);
      partie.querySelector(".chaine-cadre").classList.toggle("suite-a-gauche", !gauche.hidden);
    }
    // Défilement animé ici : il ne dépend pas du réglage « défilement doux » du navigateur.
    function avancer(sens) {
      var maillon = chaine.querySelector(".maillon"), pas = sens * (maillon ? maillon.offsetWidth + 30 : 240);
      var depart = chaine.scrollLeft, arrivee = Math.max(0, Math.min(chaine.scrollWidth - chaine.clientWidth, depart + pas)), debut = null;
      function pasSuivant(t) {
        if (debut === null) debut = t;
        var p = Math.min(1, (t - debut) / 320), lisse = 1 - Math.pow(1 - p, 3);
        chaine.scrollLeft = depart + (arrivee - depart) * lisse;
        if (p < 1) requestAnimationFrame(pasSuivant); else majFleches();
      }
      requestAnimationFrame(pasSuivant);
    }
    gauche.addEventListener("click", function () { avancer(-1); });
    droite.addEventListener("click", function () { avancer(1); });
    chaine.addEventListener("scroll", majFleches, { passive: true });
    racine.addEventListener("resize", majFleches);
    requestAnimationFrame(majFleches);
    setTimeout(majFleches, 300);
    // La largeur change aussi quand les polices et le menu finissent de se placer.
    var observateur = racine.ResizeObserver ? new ResizeObserver(majFleches) : null;
    if (observateur) observateur.observe(chaine);
    partie.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-aller]");
      if (!b) return;
      var cible = zone.querySelector('[data-liaison="' + b.getAttribute("data-aller") + '"]');
      if (cible) { cible.scrollIntoView({ behavior: "smooth", block: "center" }); cible.classList.add("repere"); setTimeout(function () { cible.classList.remove("repere"); }, 1600); }
    });

    // Les notes modifiables par tous : début et fin, puis ce qui passe d'une énigme à l'autre.
    var blocNotes = document.createElement("div");
    blocNotes.innerHTML = '<h2 style="margin-top:8px">Début et fin de la partie</h2><div class="grille notes-frise"></div>' +
      (ordre.length > 1 ? '<h2 style="margin-top:18px">Ce qui passe d\'une énigme à l\'autre</h2><div class="grille liaisons-frise"></div>' : "");
    zone.appendChild(blocNotes);
    function ajouterCarte(carte, conteneur) { cartes.push(carte); conteneur.appendChild(carte.noeud); return carte; }
    ajouterCarte(Ed.creerCarte({ collection: "frise", id: "debut", titre: "Début de partie (facultatif)",
      champs: [{ cle: "texte", libelle: "Début", aide: "Ce qui se passe à l'arrivée des joueurs.", lignes: 3 }] }), blocNotes.querySelector(".notes-frise"));
    ajouterCarte(Ed.creerCarte({ collection: "frise", id: "fin", titre: "Fin de partie",
      champs: [{ cle: "texte", libelle: "Fin", aide: "Dernière révélation, sortie, message final, remise à zéro.", lignes: 4 }] }), blocNotes.querySelector(".notes-frise"));
    ordre.forEach(function (id, i) {
      if (i + 1 >= ordre.length) return;
      var suivant = ordre[i + 1], boite = groupes[id] && groupes[id].enigme && groupes[id].enigme.contenuBoite;
      var carte = ajouterCarte(Ed.creerCarte({ collection: "liaisons", id: id + "-" + suivant, titre: (i + 1) + ". " + nomDe(id) + " → " + (i + 2) + ". " + nomDe(suivant),
        champs: CHAMPS_LIAISON, parDefaut: boite ? { donne: boite } : {} }), blocNotes.querySelector(".liaisons-frise"));
      carte.noeud.classList.add("liaison");
      carte.noeud.setAttribute("data-liaison", id);
    });

    zone.appendChild(await blocHistoriqueOrdre());

    function panneauOrdre() {
      var travail = ordre.slice(), glisse = null;
      var panneau = document.createElement("section");
      panneau.className = "carte prof ordre-plie";
      // Plié par défaut : le professeur l'ouvre seulement pour changer l'ordre.
      panneau.innerHTML = '<details><summary><h3>Ordre des énigmes (professeur)</h3> <span class="petit">' + ordre.length + " énigme" + (ordre.length > 1 ? "s" : "") +
        ' dans la frise · ouvrir pour modifier</span></summary><div class="corps-ordre"></div></details>';
      var corps = panneau.querySelector(".corps-ordre");
      function afficher() {
        var absents = tous.filter(function (id) { return travail.indexOf(id) === -1; });
        corps.innerHTML =
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

    var arreterCartes = Ed.suivreCartes(cartes);
    return function () { arreterCartes(); racine.removeEventListener("resize", majFleches); if (observateur) observateur.disconnect(); };
  };
})(this);
