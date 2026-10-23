// Liste partagée modifiable par toute la classe (jour J : tâches, rôles, planning). Une ligne = un élément du stockage :
// deux élèves qui écrivent chacun sur sa ligne ne se gênent jamais ; sur la même ligne, leurs changements sont
// fusionnés. Retirer une ligne la met de côté (restaurable) ; chaque version reste dans l'historique.
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, F = racine.EscapeLabFiche, e = O.echapper;

  // options : { collection, titre, colonnes: [{ cle, libelle, type: texte|zone|choix|case|heure, options, aide }],
  //             disposition: "tableau" | "cartes", filtre: function (valeur) (lignes affichées), parDefaut: {…},
  //             vide: "texte si aucune ligne", modeles: [{ libelle, lignes: [{…}] }], apresChangement: function () }
  function creerListe(options) {
    var app = racine.EscapeLab, st = function () { return app.etat.stockage; };
    var noeud = document.createElement("section");
    noeud.className = "carte liste-partagee";
    var lignes = [], voirRetirees = false, historique = null, message = "";

    function visibles() {
      return lignes.filter(function (l) { return !!l.valeur.retiree === voirRetirees && (!options.filtre || options.filtre(l.valeur)); })
        .sort(function (a, b) { return (a.valeur.ordre || 0) - (b.valeur.ordre || 0); });
    }

    function champ(col, ligne) {
      var v = ligne.valeur[col.cle], nom = e(col.libelle), attr = ' data-ligne="' + e(ligne.id) + '" data-col="' + col.cle + '" aria-label="' + nom + '"';
      if (col.type === "case") return '<input type="checkbox"' + attr + (v ? " checked" : "") + ">";
      if (col.type === "choix") return "<select" + attr + ">" + '<option value="">Choisir…</option>' + col.options.map(function (o) {
        return '<option' + (o === v ? " selected" : "") + ">" + e(o) + "</option>"; }).join("") + "</select>";
      if (col.type === "zone") return "<textarea rows=\"3\"" + attr + (col.aide ? ' placeholder="' + e(col.aide) + '"' : "") + ">" + e(v || "") + "</textarea>";
      return '<input' + (col.type === "heure" ? ' type="time"' : "") + attr + (col.aide ? ' placeholder="' + e(col.aide) + '"' : "") + ' value="' + e(v || "") + '">';
    }

    function boutonsLigne(l) {
      return voirRetirees ? '<button data-action="remettre" data-ligne="' + e(l.id) + '">Remettre</button>'
        : '<button data-action="historique" data-ligne="' + e(l.id) + '" aria-label="Historique de la ligne">↺</button>' +
          '<button data-action="retirer" data-ligne="' + e(l.id) + '" aria-label="Retirer la ligne">✕</button>';
    }

    function afficher() {
      var focus = document.activeElement, cleFocus = focus && noeud.contains(focus) ? [focus.getAttribute("data-ligne"), focus.getAttribute("data-col")] : null;
      var liste = visibles(), nbRetirees = lignes.filter(function (l) { return l.valeur.retiree && (!options.filtre || options.filtre(l.valeur)); }).length;
      var html = "<h3>" + e(options.titre) + "</h3>" + (options.consigne ? '<p class="petit">' + e(options.consigne) + "</p>" : "");
      if (!liste.length) html += '<p class="petit">' + e(voirRetirees ? "Aucune ligne retirée." : options.vide || "Pas encore de ligne.") + "</p>";
      else if (options.disposition === "cartes") {
        html += '<div class="grille">' + liste.map(function (l) {
          return '<article class="carte-groupe ligne-carte">' + options.colonnes.map(function (c) {
            return c.type === "case" ? '<label class="case">' + champ(c, l) + " " + e(c.libelle) + "</label>" : "<label>" + e(c.libelle) + champ(c, l) + "</label>";
          }).join("") + '<p class="petit">' + e(O.nomAuteur(l.auteur)) + ", " + app.dateCourte(l.le) + '</p><div class="boutons">' + boutonsLigne(l) + "</div></article>";
        }).join("") + "</div>";
      } else {
        html += '<div class="defile"><table class="tableau-saisie"><thead><tr>' + options.colonnes.map(function (c) { return "<th>" + e(c.libelle) + "</th>"; }).join("") +
          "<th></th></tr></thead><tbody>" + liste.map(function (l) {
            return "<tr>" + options.colonnes.map(function (c) { return "<td>" + champ(c, l) + "</td>"; }).join("") + '<td class="actions">' + boutonsLigne(l) + "</td></tr>";
          }).join("") + "</tbody></table></div>";
      }
      if (historique) {
        html += '<div class="carte-groupe"><h4>Historique de la ligne</h4>' + historique.versions.slice().reverse().map(function (v) {
          var resume = options.colonnes.map(function (c) { var x = v.valeur[c.cle]; return x === true ? "☑ " + c.libelle : x ? x : ""; }).filter(Boolean).join(" · ");
          return '<p class="petit">' + app.dateCourte(v.le) + " · " + e(O.nomAuteur(v.auteur)) + " : " + e(resume || "(vide)") +
            ' <button data-action="restaurer" data-ligne="' + e(historique.id) + '" data-vid="' + e(v.vid) + '">Restaurer</button></p>';
        }).join("") + '<button data-action="fermerHistorique">Fermer</button></div>';
      }
      html += '<div class="boutons">' + (voirRetirees ? "" : '<button class="principal" data-action="ajouter">+ Ajouter une ligne</button>') +
        (options.modeles || []).map(function (m, i) { return voirRetirees ? "" : '<button data-action="modele" data-index="' + i + '">' + e(m.libelle) + "</button>"; }).join("") +
        (nbRetirees || voirRetirees ? '<button data-action="basculer">' + (voirRetirees ? "← Retour à la liste" : "Lignes retirées (" + nbRetirees + ")") + "</button>" : "") + "</div>" +
        '<p class="petit message-liste" role="status">' + message + "</p>";
      noeud.innerHTML = html;
      if (cleFocus) {
        var c = noeud.querySelector('[data-ligne="' + cleFocus[0] + '"][data-col="' + cleFocus[1] + '"]');
        if (c) c.focus();
      }
    }

    function trouver(id) { return lignes.filter(function (l) { return l.id === id; })[0]; }

    // Enregistre une ligne en reprenant ce qu'un autre a pu écrire entre-temps (fusion, rien n'est perdu).
    async function enregistrer(ligne, nouvelle) {
      for (var essai = 0; essai < 3; essai++) {
        var actuel = ligne ? await st().lire(options.collection, ligne.id) : null;
        var valeur = actuel ? F.fusionner(ligne.valeur, actuel.valeur, nouvelle).valeur : nouvelle;
        var id = ligne ? ligne.id : "l" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
        var r = await st().enregistrer(options.collection, id, valeur, actuel ? actuel.vid : null, app.auteur());
        if (r.ok) {
          lignes = lignes.filter(function (l) { return l.id !== id; }).concat(r.element);
          if (options.apresChangement) options.apresChangement();
          return r.element;
        }
      }
      throw new Error("la ligne change trop souvent, réessaie");
    }

    async function nouvellesLignes(valeurs) {
      var depart = Date.now();
      for (var i = 0; i < valeurs.length; i++) {
        await enregistrer(null, Object.assign({}, options.parDefaut || {}, valeurs[i], { ordre: depart + i }));
      }
    }

    function erreur(err) {
      message = '<span class="ecart">L\'enregistrement n\'a pas pu se faire (' + e(err.message) + "). Vérifie la connexion au réseau du collège, puis réessaie.</span>";
      afficher();
    }

    noeud.addEventListener("change", async function (ev) {
      var t = ev.target, id = t.getAttribute("data-ligne"), cle = t.getAttribute("data-col");
      if (!id || !cle) return;
      var ligne = trouver(id), nouvelle = Object.assign({}, ligne.valeur);
      nouvelle[cle] = t.type === "checkbox" ? t.checked : t.value;
      try { await enregistrer(ligne, nouvelle); message = "Enregistré."; noeud.querySelector(".message-liste").textContent = message; }
      catch (err) { erreur(err); }
    });

    noeud.addEventListener("click", async function (ev) {
      var b = ev.target.closest("button[data-action]");
      if (!b) return;
      var a = b.getAttribute("data-action"), ligne = trouver(b.getAttribute("data-ligne"));
      message = "";
      try {
        if (a === "ajouter") { await nouvellesLignes([{}]); }
        else if (a === "modele") { var m = options.modeles[Number(b.getAttribute("data-index"))]; await nouvellesLignes(m.lignes); message = m.lignes.length + " lignes ajoutées : complète-les."; }
        else if (a === "retirer" || a === "remettre") {
          await enregistrer(ligne, Object.assign({}, ligne.valeur, { retiree: a === "retirer" }));
          message = a === "retirer" ? "Ligne retirée : « Lignes retirées » permet de la remettre." : "Ligne remise dans la liste.";
        }
        else if (a === "basculer") { voirRetirees = !voirRetirees; historique = null; }
        else if (a === "historique") historique = { id: ligne.id, versions: await st().historique(options.collection, ligne.id) };
        else if (a === "fermerHistorique") historique = null;
        else if (a === "restaurer") {
          var r = await st().restaurer(options.collection, b.getAttribute("data-ligne"), b.getAttribute("data-vid"), app.auteur());
          if (r.ok) lignes = lignes.filter(function (l) { return l.id !== r.element.id; }).concat(r.element);
          historique = null; message = "Version restaurée (une nouvelle version a été créée).";
          if (options.apresChangement) options.apresChangement();
        }
      } catch (err) { return erreur(err); }
      afficher();
    });

    return {
      noeud: noeud,
      lignes: function () { return lignes.filter(function (l) { return !l.valeur.retiree; }).map(function (l) { return l.valeur; }); },
      charger: async function () { lignes = await st().lister(options.collection); afficher(); },
      // Relecture : seulement si personne n'écrit dans cette liste, pour ne pas perdre une saisie.
      rafraichir: async function () {
        if (noeud.contains(document.activeElement) && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return false;
        var avant = lignes.map(function (l) { return l.vid; }).sort().join();
        var nouvelles = await st().lister(options.collection);
        if (nouvelles.map(function (l) { return l.vid; }).sort().join() === avant) return false;
        lignes = nouvelles; afficher();
        return true;
      }
    };
  }

  racine.EscapeLabLignes = { creerListe: creerListe };
})(this);
