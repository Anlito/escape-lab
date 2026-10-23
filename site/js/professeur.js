// Espace professeur dans l'application (index.html?prof, brief §8) : suivi des groupes, pilotage (réglages, groupes,
// échéances, annonces, notes privées), évaluation, observation du jour J sur tablette, exports (livret du Game
// Master, fiches d'installation, CSV, sauvegarde complète).
// Notes privées, évaluations et observations vont dans le dossier PERSONNEL du professeur, jamais dans un dossier de
// classe (§10.3), avec une copie de secours dans le navigateur du poste.
(function (racine) {
  "use strict";

  var S = racine.EscapeLabStockage, O = racine.EscapeLabOutils, F = racine.EscapeLabFiche, E = racine.EscapeLabEvaluation;
  var e = O.echapper;
  var EVAL = null, APPRECIATIONS = { parNote: [], parBloc: {} }, OBSERVATIONS = { phases: {} }, ANNONCES = { seances: [] };
  racine.definirEvaluation = function (x) { EVAL = x; };
  racine.definirAppreciations = function (x) { APPRECIATIONS = x; };
  racine.definirObservations = function (x) { OBSERVATIONS = x; };
  racine.definirAnnoncesModeles = function (x) { ANNONCES = x; };

  var SYMBOLES = { "à faire": "○", "en cours": "◐", "fait": "●" };
  var COLLECTIONS_CLASSE = ["histoire", "groupes", "fiches", "bibliotheque", "frise", "jourj"];

  function app() { return racine.EscapeLab; }
  function etat() { return app().etat; }

  // --- Dossier personnel du professeur ---

  var dossierProf = null;
  async function ouvrirDossierProf(demander) {
    if (dossierProf) return dossierProf;
    if (etat().demo) return (dossierProf = avecSecours(S.creerStockage(S.creerAdaptateurMemoire(), { depot: "prof" })));
    var poignee = await app().retrouverDossier("__dossier-professeur");
    try {
      if (poignee && (await poignee.queryPermission({ mode: "readwrite" })) !== "granted") {
        if (!demander || (await poignee.requestPermission({ mode: "readwrite" })) !== "granted") return null;
      }
    } catch (err) { poignee = null; }
    if (!poignee) {
      if (!demander) return null;
      poignee = await racine.showDirectoryPicker({ id: "escape-lab-dossier-prof", mode: "readwrite" });
    }
    var adaptateur = S.creerAdaptateurDossier(poignee);
    var noms = (await adaptateur.lister("")).map(function (x) { return x.nom; });
    if (noms.some(function (n) { return COLLECTIONS_CLASSE.indexOf(n) !== -1; })) {
      throw new Error("ce dossier est un dossier de classe : les élèves pourraient lire les notes. Choisis ton dossier personnel");
    }
    await app().garderDossier("__dossier-professeur", poignee);
    return (dossierProf = avecSecours(S.creerStockage(adaptateur, { depot: "prof" })));
  }

  // Copie de secours dans le navigateur de chaque élément enregistré (brief §10.3).
  function avecSecours(st) {
    var enregistrer = st.enregistrer;
    st.enregistrer = async function (collection, id, valeur, vid, auteur) {
      var r = await enregistrer(collection, id, valeur, vid, auteur);
      if (r.ok) { try { localStorage.setItem("escape-lab:secours-prof:" + collection + "/" + id, JSON.stringify(valeur)); } catch (err) { /* plein ou bloqué */ } }
      return r;
    };
    return st;
  }

  function blocDossierProf(texte) {
    return '<section class="carte"><p>' + e(texte) + '</p><p class="petit">Choisis un dossier qui n\'est lu que par toi (par exemple dans tes documents personnels), jamais le dossier d\'une classe.</p>' +
      '<button class="principal" data-action="ouvrirDossierProf">Ouvrir mon dossier personnel</button><p class="ecart message-dossier" role="alert"></p></section>';
  }

  // Écrit un élément en reprenant la version actuelle (le professeur est seul à écrire ces éléments).
  async function remplacer(st, collection, id, modifier) {
    for (var essai = 0; essai < 3; essai++) {
      var actuel = await st.lire(collection, id);
      var v = modifier(JSON.parse(JSON.stringify(actuel ? actuel.valeur : {})));
      var r = await st.enregistrer(collection, id, v, actuel ? actuel.vid : null, { prof: true });
      if (r.ok) return r.element;
    }
    throw new Error("l'élément change trop souvent, réessaie");
  }

  // --- Données de la classe ---

  async function lireClasse() {
    var st = etat().stockage, ids = app().lettresGroupes(app().nombreGroupes());
    var groupes = {}, fiches = {}, journal = (await st.lister("journal")), reglages = await st.lire("equipe", "reglages");
    (await st.lister("groupes")).forEach(function (g) { groupes[g.id] = g; });
    (await st.lister("fiches")).forEach(function (f) {
      var i = f.id.indexOf("-"), g = f.id.slice(0, i), onglet = f.id.slice(i + 1);
      (fiches[g] = fiches[g] || {})[onglet] = f;
    });
    var frise = await st.lire("frise", "ordre");
    return { ids: ids, groupes: groupes, fiches: fiches, journal: journal, reglages: reglages ? reglages.valeur : {},
      ordre: frise ? frise.valeur.ordre : [] };
  }

  function nomGroupe(c, id) {
    var f = c.fiches[id] && c.fiches[id].enigme;
    return (f && f.valeur.titre) || (c.groupes[id] && c.groupes[id].valeur.nom) || "Groupe " + id;
  }
  function membres(c, id) {
    var f = c.fiches[id] && c.fiches[id].enigme;
    return ((f ? f.valeur.membres : c.groupes[id] && c.groupes[id].valeur.membres) || []).map(function (m) { return m.prenom; }).filter(Boolean);
  }
  function derniereActivite(c, id) {
    var t = c.groupes[id] ? c.groupes[id].le : 0;
    Object.keys(c.fiches[id] || {}).forEach(function (k) { t = Math.max(t, c.fiches[id][k].le); });
    c.journal.forEach(function (j) { if (j.valeur.groupe === id) t = Math.max(t, j.le); });
    return t;
  }

  // ===== Suivi des groupes (§8.1) =====

  app().pages.suivi = async function (zone) {
    var c = await lireClasse(), seance = c.reglages.seanceActuelle, filtre = false, tri = "nom";
    var jalons = app().jalons();
    function afficher() {
      var lignes = c.ids.map(function (id) {
        var v = c.groupes[id] ? c.groupes[id].valeur : {}, av = app().avancement(v, seance);
        var j = c.journal.filter(function (x) { return x.valeur.groupe === id; }).sort(function (a, b) { return b.le - a.le; });
        var seancesJournal = j.map(function (x) { return x.valeur.seance; });
        var sansActivite = [];
        for (var s = 1; seance && s < seance; s++) if (seancesJournal.indexOf(s) === -1) sansActivite.push(s);
        var bloque = j[0] && j[0].valeur.bloque;
        return { id: id, v: v, av: av, derniere: derniereActivite(c, id), sansActivite: sansActivite, bloque: bloque };
      });
      if (filtre) lignes = lignes.filter(function (l) { return l.av.retard.length || l.bloque || l.sansActivite.length; });
      lignes.sort(function (a, b) {
        if (tri === "avancement") return a.av.pourcent - b.av.pourcent;
        if (tri === "activite") return a.derniere - b.derniere;
        return a.id < b.id ? -1 : 1;
      });
      zone.innerHTML = '<section class="carte"><h2>Suivi des groupes' + (seance ? ' <span class="petit">· séance ' + seance + "</span>" : "") + "</h2>" +
        '<div class="filtres"><label class="case"><input type="checkbox" id="filtreRetard"' + (filtre ? " checked" : "") + "> Seulement les groupes en retard, bloqués ou sans activité</label>" +
        '<label>Trier par<select id="tri"><option value="nom">groupe</option><option value="avancement"' + (tri === "avancement" ? " selected" : "") + ">avancement (le moins avancé d'abord)</option>" +
        '<option value="activite"' + (tri === "activite" ? " selected" : "") + ">dernière activité (la plus ancienne d'abord)</option></select></label></div>" +
        '<p class="petit">○ à faire · ◐ en cours · ● fait · ✓ validé par le professeur · ! en retard (ambre).</p>' +
        '<div class="defile"><table class="suivi"><thead><tr><th>Groupe</th>' + jalons.map(function (j) {
          return '<th title="' + e(j.nom) + " (séance " + j.seance + ')">' + e(j.code || j.nom.split(" ")[0]) + '<br><span class="petit">S' + j.seance + "</span></th>";
        }).join("") + "<th>%</th><th>Dernière activité</th><th>Séances sans journal</th><th>Bloque</th></tr></thead><tbody>" +
        lignes.map(function (l) {
          return '<tr><th><button class="lien" data-ouvrir="' + l.id + '">' + e(l.id + " · " + nomGroupe(c, l.id)) + "</button></th>" + jalons.map(function (j) {
            var x = (l.v.jalons || {})[j.id] || {}, et2 = x.etat || x || "à faire";
            if (typeof et2 !== "string") et2 = "à faire";
            var retard = seance && j.seance < seance && et2 !== "fait";
            return '<td class="' + (retard ? "ecart-cellule" : "") + '" title="' + e(j.nom + " : " + et2 + (x.valide ? ", validé" : "") + (retard ? ", en retard" : "")) + '">' +
              (SYMBOLES[et2] || "○") + (x.valide ? "✓" : "") + (retard ? "!" : "") + "</td>";
          }).join("") + "<td>" + l.av.pourcent + "</td><td>" + (l.derniere ? app().dateCourte(l.derniere) : "—") + "</td>" +
            '<td class="' + (l.sansActivite.length ? "ecart" : "") + '">' + e(l.sansActivite.join(", ") || "—") + "</td><td>" + e(l.bloque || "") + "</td></tr>";
        }).join("") + "</tbody></table></div></section>";
    }
    zone.addEventListener("change", function (ev) {
      if (ev.target.id === "filtreRetard") filtre = ev.target.checked;
      if (ev.target.id === "tri") tri = ev.target.value;
      afficher();
    });
    zone.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-ouvrir]");
      if (!b) return;
      etat().groupeAOuvrir = b.getAttribute("data-ouvrir");
      location.hash = "#autres";
    });
    afficher();
  };

  // ===== Pilotage (§8.2) =====

  app().pages.pilotage = async function (zone) {
    var st = etat().stockage, message = "";
    async function afficher() {
      var c = await lireClasse(), r = c.reglages, jalons = app().jalons();
      var mecaniques = Object.keys(app().mecaniques).map(function (k) { return app().mecaniques[k]; })
        .filter(function (m) { return m.active !== false; }).sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); });
      var depots = etat().equipe.depots;
      var annonces = (await st.lister("annonces")).filter(function (a) { return !a.valeur.retiree; }).sort(function (a, b) { return b.le - a.le; });
      var modelesSeance = (ANNONCES.seances || []).filter(function (s) { return s.seance === r.seanceActuelle; })[0];
      var html = (message ? '<p class="bandeau" role="status">' + message + "</p>" : "") +
        '<section class="carte"><h2>Réglages de la classe</h2><div class="grille">' +
        champNombre("seanceActuelle", "Séance actuelle", r.seanceActuelle, 1, 20) + champNombre("dureeJeu", "Durée du jeu (min)", r.dureeJeu || 60, 10, 180) +
        champNombre("minutesParEnigme", "Minutes par énigme", r.minutesParEnigme || 12, 3, 40) +
        champNombre("nombreGroupes", "Nombre de groupes (3 à 8)", app().nombreGroupes(), 3, 8) +
        champNombre("tailleMaxMo", "Taille maximale d'un fichier (Mo)", r.tailleMaxMo || 20, 1, 200) +
        '</div><div class="boutons"><button class="principal" data-action="reglages">Enregistrer les réglages</button></div></section>';
      html += '<section class="carte"><h2>Groupes : mécanique et cadenas</h2><div class="defile"><table class="tableau-saisie"><thead><tr><th>Groupe</th><th>Mécanique</th><th>Type de cadenas</th>' +
        (depots.length > 1 ? "<th>Dossier d'origine</th>" : "") + "<th></th></tr></thead><tbody>" + c.ids.map(function (id) {
          var v = c.groupes[id] ? c.groupes[id].valeur : {};
          return '<tr data-groupe="' + id + '"><td>' + e(id + " · " + nomGroupe(c, id)) + '</td><td><select data-champ="mecanique" aria-label="Mécanique du groupe ' + id + '"><option value="">à attribuer</option>' +
            mecaniques.map(function (m) { return '<option value="' + e(m.id) + '"' + (m.id === v.mecanique ? " selected" : "") + ">" + e(m.lettre + " · " + m.nom) + "</option>"; }).join("") + "</select></td>" +
            '<td><input data-champ="cadenas" aria-label="Cadenas du groupe ' + id + '" value="' + e((v.cadenas && v.cadenas.type) || "") + '" placeholder="ex. 4 chiffres"></td>' +
            (depots.length > 1 ? '<td><select data-champ="depotOrigine" aria-label="Dossier du groupe ' + id + '"><option value="">—</option>' + depots.map(function (d) {
              return "<option" + (d === v.depotOrigine ? " selected" : "") + ">" + e(d) + "</option>"; }).join("") + "</select></td>" : "") +
            '<td><button data-action="groupe" data-groupe="' + id + '">Enregistrer</button></td></tr>';
        }).join("") + "</tbody></table></div>" +
        '<p class="petit">L\'ordre des énigmes se règle dans la page Frise. Un groupe ne mélange pas les deux moitiés de 3C2D1.</p></section>';
      html += '<section class="carte"><h2>Échéances des jalons</h2><p class="petit">Numéro de la séance où le jalon doit être fait. Après, il passe en ambre.</p><div class="grille">' +
        jalons.map(function (j) { return champNombre("ech-" + j.id, (j.code ? j.code + " · " : "") + j.nom, j.seance, 1, 20); }).join("") +
        '</div><div class="boutons"><button class="principal" data-action="echeances">Enregistrer les échéances</button></div></section>';
      html += '<section class="carte"><h2>Annonces</h2><label for="nouvelleAnnonce">Nouvelle annonce</label><textarea id="nouvelleAnnonce" rows="2"></textarea>' +
        '<label class="case"><input type="checkbox" id="epingler"> Épingler en haut</label>' +
        '<div class="boutons"><button class="principal" data-action="annonce">Publier pour la classe</button></div>' +
        (modelesSeance ? '<p class="petit">Annonces types de la séance ' + modelesSeance.seance + " (à relire) :</p><ul>" + modelesSeance.annonces.map(function (t, i) {
          return "<li>" + e(t) + ' <button data-action="modeleAnnonce" data-index="' + i + '">Reprendre</button></li>'; }).join("") + "</ul>" : "") +
        "<h3>Publiées</h3>" + (annonces.length ? "<ul>" + annonces.map(function (a) {
          return "<li>" + (a.valeur.epinglee ? "📌 " : "") + e(a.valeur.texte) + ' <span class="petit">' + app().dateCourte(a.le) + "</span> " +
            '<button data-action="epingle" data-id="' + e(a.id) + '">' + (a.valeur.epinglee ? "Désépingler" : "Épingler") + "</button> " +
            '<button data-action="retirerAnnonce" data-id="' + e(a.id) + '">Retirer</button></li>';
        }).join("") + "</ul>" : '<p class="petit">Aucune annonce.</p>') + "</section>";
      var prof = await ouvrirDossierProf(false);
      if (!prof) html += blocDossierProf("Les notes privées sur les groupes vont dans ton dossier personnel.");
      else {
        var notes = {};
        (await prof.lister("notes")).forEach(function (n) { notes[n.id] = n.valeur.texte; });
        html += '<section class="carte"><h2>Notes privées <span class="petit">(dossier personnel, jamais visibles des élèves)</span></h2>' + c.ids.map(function (id) {
          var cle = etat().depot + "-" + id;
          return '<label for="note-' + id + '">' + e(id + " · " + nomGroupe(c, id)) + '</label><textarea id="note-' + id + '" data-note="' + e(cle) + '" rows="2">' + e(notes[cle] || "") + "</textarea>";
        }).join("") + '<p class="petit">Chaque note s\'enregistre quand tu quittes le champ.</p></section>';
      }
      zone.innerHTML = html;
      zone._modeles = modelesSeance;
    }
    function champNombre(id, libelle, v, min, max) {
      return '<label>' + e(libelle) + '<input type="number" id="' + id + '" min="' + min + '" max="' + max + '" value="' + e(v == null ? "" : v) + '"></label>';
    }
    function valeurNombre(id) { var x = zone.querySelector("#" + id); return x && x.value !== "" ? Number(x.value) : null; }

    zone.addEventListener("click", async function (ev) {
      var b = ev.target.closest("button[data-action]");
      if (!b) return;
      var a = b.getAttribute("data-action");
      message = "";
      try {
        if (a === "reglages") {
          await remplacer(st, "equipe", "reglages", function (v) {
            ["seanceActuelle", "dureeJeu", "minutesParEnigme", "nombreGroupes", "tailleMaxMo"].forEach(function (k) { var n = valeurNombre(k); if (n != null) v[k] = n; });
            v.nombreGroupes = Math.max(3, Math.min(8, v.nombreGroupes || 5));
            return v;
          });
          await app().rechargerReglages();
          message = "Réglages enregistrés.";
        } else if (a === "echeances") {
          await remplacer(st, "equipe", "reglages", function (v) {
            v.echeances = v.echeances || {};
            app().jalons().forEach(function (j) { var n = valeurNombre("ech-" + j.id); if (n) v.echeances[j.id] = n; });
            return v;
          });
          await app().rechargerReglages();
          message = "Échéances enregistrées.";
        } else if (a === "groupe") {
          var id = b.getAttribute("data-groupe"), tr = zone.querySelector('tr[data-groupe="' + id + '"]');
          await remplacer(st, "groupes", id, function (v) {
            v.mecanique = tr.querySelector('[data-champ="mecanique"]').value || undefined;
            v.cadenas = Object.assign({}, v.cadenas || {}, { type: tr.querySelector('[data-champ="cadenas"]').value.trim() });
            var d = tr.querySelector('[data-champ="depotOrigine"]');
            if (d) v.depotOrigine = d.value || undefined;
            return v;
          });
          message = "Groupe " + id + " enregistré.";
        } else if (a === "annonce" || a === "modeleAnnonce") {
          var texte = a === "modeleAnnonce" ? zone._modeles.annonces[Number(b.getAttribute("data-index"))] : zone.querySelector("#nouvelleAnnonce").value.trim();
          if (!texte) { message = '<span class="ecart">Écris l\'annonce.</span>'; return afficher(); }
          if (a === "modeleAnnonce") { zone.querySelector("#nouvelleAnnonce").value = texte; return; }
          await st.enregistrer("annonces", "a" + Date.now().toString(36), { texte: texte, epinglee: zone.querySelector("#epingler").checked }, null, { prof: true });
          message = "Annonce publiée : elle apparaît dans le tableau de bord de la classe.";
        } else if (a === "epingle" || a === "retirerAnnonce") {
          await remplacer(st, "annonces", b.getAttribute("data-id"), function (v) {
            if (a === "epingle") v.epinglee = !v.epinglee; else v.retiree = true;
            return v;
          });
        } else if (a === "ouvrirDossierProf") {
          await ouvrirDossierProf(true);
        }
      } catch (err) {
        message = '<span class="ecart">L\'opération n\'a pas pu se faire (' + e(err.message) + ").</span>";
      }
      afficher();
    });
    zone.addEventListener("change", async function (ev) {
      var cle = ev.target.getAttribute("data-note");
      if (!cle) return;
      var prof = await ouvrirDossierProf(false);
      await remplacer(prof, "notes", cle, function () { return { texte: ev.target.value }; });
    });
    await afficher();
  };

  // ===== Évaluation (§8.5) =====

  function niveauxHtml(choisi, attributs, criterio) {
    return "<select " + attributs + '><option value="">—</option>' + EVAL.niveaux.map(function (n) {
      return '<option value="' + n.id + '"' + (n.id === choisi ? " selected" : "") + ' title="' + e((criterio && criterio.descripteurs && criterio.descripteurs[n.id]) || n.libelle) + '">' + e(n.lettre) + "</option>";
    }).join("") + "</select>";
  }

  // Niveau tiré des observations (jour J, comportement par séance) pour un critère et une cible.
  function niveauObserve(observations, critere, groupe, prenom) {
    var ids = observations.filter(function (o) {
      var v = o.valeur;
      return !v.retiree && v.critere === critere && v.groupe === groupe && (prenom ? v.prenom === prenom : !v.prenom) && v.niveau;
    }).map(function (o) { return o.valeur.niveau; });
    return ids.length ? E.niveauMoyen(EVAL.niveaux, ids) : null;
  }

  app().pages.evaluation = async function (zone) {
    var st = etat().stockage, c = await lireClasse(), groupe = c.ids[0], message = "";
    if (!EVAL) { zone.innerHTML = '<p class="bandeau ecart">La grille d\'évaluation (donnees/evaluation.js) n\'est pas chargée.</p>'; return; }
    async function afficher() {
      var prof = await ouvrirDossierProf(false);
      if (!prof) { zone.innerHTML = blocDossierProf("L'évaluation s'enregistre dans ton dossier personnel, jamais dans le dossier de la classe."); return; }
      var cle = etat().depot + "-" + groupe, el = await prof.lire("evaluations", cle), v = el ? el.valeur : {};
      var eleves = membres(c, groupe), obs = (await prof.lister("observations")).filter(function (o) { return o.valeur.depot === etat().depot; });
      var html = (message ? '<p class="bandeau" role="status">' + message + "</p>" : "") +
        '<p class="bandeau">Barème : A = 0, B = 1, C = 2, D = 3 points (coefficient 2 pour la fiche énigme, le câblage, le programme et le test croisé) ; note = 20 × points pondérés ÷ maximum des critères observés. Un critère non observé ne compte pas.</p>' +
        '<section class="carte"><label for="groupeEval">Groupe</label><select id="groupeEval">' + c.ids.map(function (id) {
          return '<option value="' + id + '"' + (id === groupe ? " selected" : "") + ">" + e(id + " · " + nomGroupe(c, id)) + "</option>"; }).join("") + "</select>" +
        (eleves.length ? "" : '<p class="ecart">Les membres du groupe ne sont pas encore écrits dans sa fiche « Mon énigme » : seules les colonnes du groupe sont disponibles.</p>') +
        '<div class="defile"><table class="tableau-saisie grille-eval"><thead><tr><th>Critère</th><th>Groupe</th>' + eleves.map(function (p) { return "<th>" + e(p) + "</th>"; }).join("") + "</tr></thead><tbody>";
      var blocPrecedent = "";
      EVAL.criteres.forEach(function (cr) {
        if (cr.bloc !== blocPrecedent) { html += '<tr class="bloc"><th colspan="' + (2 + eleves.length) + '">' + e(cr.bloc) + "</th></tr>"; blocPrecedent = cr.bloc; }
        var obsGroupe = niveauObserve(obs, cr.id, groupe, null);
        html += '<tr><td title="' + e(cr.competence) + '">' + e(cr.intitule) + ' <span class="petit">×' + cr.coefficient + "</span></td><td>" +
          (cr.portee === "groupe" ? niveauxHtml((v.groupe || {})[cr.id] || obsGroupe, 'data-cible="groupe" data-critere="' + cr.id + '" aria-label="' + e(cr.intitule) + ', groupe"', cr) +
            (obsGroupe && !(v.groupe || {})[cr.id] ? ' <span class="petit">obs.</span>' : "") : '<span class="petit">individuel</span>') + "</td>" +
          eleves.map(function (p) {
            var propre = ((v.eleves || {})[p] || {})[cr.id], o = niveauObserve(obs, cr.id, groupe, p);
            return "<td>" + niveauxHtml(propre || (cr.portee === "individuel" ? o : ""), 'data-cible="eleve" data-prenom="' + e(p) + '" data-critere="' + cr.id + '" aria-label="' + e(cr.intitule) + ", " + e(p) + '"', cr) +
              (cr.portee === "groupe" && !propre ? ' <span class="petit">= groupe</span>' : "") + (o && !propre && cr.portee === "individuel" ? ' <span class="petit">obs.</span>' : "") + "</td>";
          }).join("") + "</tr>";
      });
      html += "</tbody></table></div></section>";
      html += '<section class="carte"><h2>Notes et appréciations</h2>' + eleves.map(function (p) {
        var s = E.saisiesEleve(EVAL.criteres, completer(v.groupe, obs, null), completer((v.eleves || {})[p], obs, p));
        var n = E.noteSur20(EVAL.criteres, EVAL.niveaux, s);
        var appr = ((v.appreciations || {})[p]) || "";
        return '<div class="carte-groupe"><h3>' + e(p) + " : " + (n.note == null ? "pas encore de note" : String(n.note).replace(".", ",") + " / 20") +
          ' <span class="petit">(' + n.observes + " critère" + (n.observes > 1 ? "s" : "") + " observé" + (n.observes > 1 ? "s" : "") + " sur " + n.total + (n.complete ? "" : ", note provisoire") + ")</span></h3>" +
          '<label for="appr-' + e(p) + '">Appréciation (brouillon à relire)</label><textarea id="appr-' + e(p) + '" data-appreciation="' + e(p) + '" rows="2">' + e(appr) + "</textarea>" +
          '<div class="boutons"><button data-action="generer" data-prenom="' + e(p) + '">Proposer une appréciation</button></div></div>';
      }).join("") + '<div class="boutons"><button data-action="csv">Exporter la classe (CSV)</button></div></section>';
      html += await comparaison(prof);
      zone.innerHTML = html;
      zone._eval = { v: v, obs: obs, eleves: eleves };
    }
    function completer(saisies, obs, prenom) {
      var r = Object.assign({}, saisies || {});
      EVAL.criteres.forEach(function (cr) {
        if (r[cr.id]) return;
        if ((prenom && cr.portee === "individuel") || (!prenom && cr.portee === "groupe")) { var o = niveauObserve(obs, cr.id, groupe, prenom); if (o) r[cr.id] = o; }
      });
      return r;
    }
    async function comparaison(prof) {
      var toutes = await prof.lister("evaluations"), parClasse = {};
      toutes.forEach(function (el) {
        var d = el.id.split("-")[0];
        (el.valeur.listeEleves || []).forEach(function (p) {
          var s = E.saisiesEleve(EVAL.criteres, el.valeur.groupe, (el.valeur.eleves || {})[p]);
          var n = E.noteSur20(EVAL.criteres, EVAL.niveaux, s).note;
          var x = parClasse[d] = parClasse[d] || { notes: [], sans: 0 };
          if (n == null) x.sans++; else x.notes.push(n);
        });
      });
      var classes = Object.keys(parClasse).sort();
      if (!classes.length) return "";
      return '<section class="carte"><h2>Comparaison des classes</h2><table><thead><tr><th>Classe</th><th>Élèves notés</th><th>Moyenne</th><th>Sans note</th></tr></thead><tbody>' +
        classes.map(function (d) {
          var x = parClasse[d], m = x.notes.length ? Math.round(10 * x.notes.reduce(function (a, b) { return a + b; }, 0) / x.notes.length) / 10 : null;
          return "<tr><td>" + e(d) + "</td><td>" + x.notes.length + "</td><td>" + (m == null ? "—" : String(m).replace(".", ",")) + "</td><td>" + x.sans + "</td></tr>";
        }).join("") + '</tbody></table><p class="petit">Les observations du jour J non reportées dans la grille ne sont pas comptées ici.</p></section>';
    }
    async function enregistrer(modifier) {
      var prof = await ouvrirDossierProf(false);
      var cle = etat().depot + "-" + groupe;
      await remplacer(prof, "evaluations", cle, function (v) { v.listeEleves = membres(c, groupe); modifier(v); return v; });
    }
    zone.addEventListener("change", async function (ev) {
      var t = ev.target;
      if (t.id === "groupeEval") { groupe = t.value; message = ""; return afficher(); }
      var critere = t.getAttribute("data-critere");
      if (critere) {
        await enregistrer(function (v) {
          if (t.getAttribute("data-cible") === "groupe") { v.groupe = v.groupe || {}; if (t.value) v.groupe[critere] = t.value; else delete v.groupe[critere]; }
          else { v.eleves = v.eleves || {}; var p = t.getAttribute("data-prenom"); v.eleves[p] = v.eleves[p] || {}; if (t.value) v.eleves[p][critere] = t.value; else delete v.eleves[p][critere]; }
        });
        return afficher();
      }
      var pa = t.getAttribute("data-appreciation");
      if (pa) await enregistrer(function (v) { v.appreciations = v.appreciations || {}; v.appreciations[pa] = t.value; });
    });
    zone.addEventListener("click", async function (ev) {
      var b = ev.target.closest("button[data-action]");
      if (!b) return;
      var a = b.getAttribute("data-action");
      try {
        if (a === "ouvrirDossierProf") { await ouvrirDossierProf(true); return afficher(); }
        if (a === "generer") {
          var p = b.getAttribute("data-prenom"), x = zone._eval;
          var s = E.saisiesEleve(EVAL.criteres, completer(x.v.groupe, x.obs, null), completer((x.v.eleves || {})[p], x.obs, p));
          var texte = E.appreciation(EVAL.criteres, EVAL.niveaux, s, APPRECIATIONS);
          if (!texte) { message = '<span class="ecart">Aucun critère observé pour ' + e(p) + " : pas d'appréciation proposée.</span>"; return afficher(); }
          await enregistrer(function (v) { v.appreciations = v.appreciations || {}; v.appreciations[p] = texte; });
          message = "Appréciation proposée pour " + e(p) + " : relis-la et modifie-la si besoin.";
          return afficher();
        }
        if (a === "csv") await exporterCsv();
      } catch (err) {
        var m = zone.querySelector(".message-dossier");
        if (m) m.textContent = "Dossier non ouvert : " + err.message + ".";
        else { message = '<span class="ecart">' + e(err.message) + "</span>"; afficher(); }
      }
    });
    async function exporterCsv() {
      var prof = await ouvrirDossierProf(false), obs = (await prof.lister("observations")).filter(function (o) { return o.valeur.depot === etat().depot; });
      var lignes = [["Classe", "Groupe", "Prénom"].concat(EVAL.criteres.map(function (cr) { return cr.intitule; }), ["Note /20", "Critères observés", "Appréciation"])];
      for (var i = 0; i < c.ids.length; i++) {
        var id = c.ids[i], el = await prof.lire("evaluations", etat().depot + "-" + id), v = el ? el.valeur : {};
        groupe = id;
        membres(c, id).forEach(function (p) {
          var s = E.saisiesEleve(EVAL.criteres, completer(v.groupe, obs, null), completer((v.eleves || {})[p], obs, p));
          var n = E.noteSur20(EVAL.criteres, EVAL.niveaux, s);
          lignes.push([etat().depot, id, p].concat(EVAL.criteres.map(function (cr) {
            var niv = EVAL.niveaux.filter(function (x) { return x.id === s[cr.id]; })[0];
            return niv ? niv.lettre : "";
          }), [n.note, n.observes + "/" + n.total, (v.appreciations || {})[p] || ""]));
        });
      }
      groupe = zone.querySelector("#groupeEval").value;
      telecharger("evaluation-" + etat().depot + ".csv", E.csv(lignes), "text/csv");
    }
    await afficher();
  };

  // ===== Observation du jour J, sur tablette (§8.5) =====

  var PHASES = [
    { id: "miseEnPlace", nom: "Mise en place", criteres: ["mise-en-place-groupe", "mise-en-place-individuel"] },
    { id: "jeu", nom: "Pendant le jeu", criteres: ["jeu-groupe", "jeu-individuel"] },
    { id: "rangement", nom: "Rangement", criteres: ["rangement-groupe", "rangement-individuel"] },
    { id: "seance", nom: "Séance (comportement)", criteres: ["autonomie", "securite", "cooperation"] }
  ];

  app().pages.observation = async function (zone) {
    var c = await lireClasse(), phase = "jeu", groupe = c.ids[0], prenom = "", remarque = "", message = "";
    async function afficher() {
      var prof = await ouvrirDossierProf(false);
      if (!prof) { zone.innerHTML = blocDossierProf("Les observations s'enregistrent dans ton dossier personnel."); return; }
      var ph = PHASES.filter(function (p) { return p.id === phase; })[0];
      var criteres = (EVAL ? EVAL.criteres : []).filter(function (cr) { return ph.criteres.indexOf(cr.id) !== -1; })
        .filter(function (cr) { return prenom ? cr.portee === "individuel" : cr.portee === "groupe"; });
      var rapides = (OBSERVATIONS.phases[phase] || []).filter(function (r) { return criteres.some(function (cr) { return cr.id === r.critere; }); });
      var recentes = (await prof.lister("observations")).filter(function (o) { return o.valeur.depot === etat().depot && !o.valeur.retiree; })
        .sort(function (a, b) { return b.le - a.le; }).slice(0, 8);
      zone.innerHTML = (message ? '<p class="bandeau" role="status">' + message + "</p>" : "") +
        '<section class="carte observation"><div class="boutons phases">' + PHASES.map(function (p) {
          return '<button data-phase="' + p.id + '" aria-pressed="' + (p.id === phase) + '">' + e(p.nom) + "</button>"; }).join("") + "</div>" +
        '<div class="boutons">' + c.ids.map(function (id) { return '<button data-groupe="' + id + '" aria-pressed="' + (id === groupe) + '">' + e(id) + "</button>"; }).join("") + "</div>" +
        '<div class="boutons"><button data-prenom="" aria-pressed="' + (!prenom) + '">Tout le groupe</button>' + membres(c, groupe).map(function (p) {
          return '<button data-prenom="' + e(p) + '" aria-pressed="' + (p === prenom) + '">' + e(p) + "</button>"; }).join("") + "</div>" +
        (criteres.length ? criteres.map(function (cr) {
          return '<div class="carte-groupe"><h3>' + e(cr.intitule) + '</h3><div class="boutons niveaux">' + EVAL.niveaux.map(function (n) {
            return '<button class="niveau" data-critere="' + cr.id + '" data-niveau="' + n.id + '" title="' + e((cr.descripteurs || {})[n.id] || "") + '">' + e(n.lettre) + '<span class="petit"> ' + e(n.libelle) + "</span></button>";
          }).join("") + "</div></div>";
        }).join("") : '<p class="petit">Aucun critère ' + (prenom ? "individuel" : "de groupe") + " pour cette phase.</p>") +
        (rapides.length ? '<p class="petit">Remarques rapides (touche pour l\'ajouter) :</p><div class="boutons">' + rapides.map(function (r) {
          return '<button data-rapide="' + e(r.texte) + '">' + (r.sens === "positif" ? "＋ " : "→ ") + e(r.texte) + "</button>"; }).join("") + "</div>" : "") +
        '<label for="remarqueObs">Remarque (facultative)</label><input id="remarqueObs" value="' + e(remarque) + '">' +
        '<p class="petit">Toucher un niveau enregistre l\'observation tout de suite, avec l\'heure. Jamais de photo d\'élève.</p></section>' +
        '<section class="carte"><h3>Dernières observations</h3>' + (recentes.length ? "<ul>" + recentes.map(function (o) {
          var v = o.valeur, niv = EVAL.niveaux.filter(function (n) { return n.id === v.niveau; })[0];
          return "<li>" + app().dateCourte(o.le) + " · " + e(v.groupe + (v.prenom ? " · " + v.prenom : "")) + " · " + e(v.critere) + " : " + e(niv ? niv.lettre : "") +
            (v.remarque ? " · « " + e(v.remarque) + " »" : "") + ' <button data-retirer="' + e(o.id) + '">Retirer</button></li>';
        }).join("") + "</ul>" : '<p class="petit">Aucune observation.</p>') + "</section>";
    }
    zone.addEventListener("input", function (ev) { if (ev.target.id === "remarqueObs") remarque = ev.target.value; });
    zone.addEventListener("click", async function (ev) {
      var b = ev.target.closest("button");
      if (!b) return;
      message = "";
      try {
        if (b.getAttribute("data-action") === "ouvrirDossierProf") await ouvrirDossierProf(true);
        else if (b.hasAttribute("data-phase")) phase = b.getAttribute("data-phase");
        else if (b.hasAttribute("data-groupe")) { groupe = b.getAttribute("data-groupe"); prenom = ""; }
        else if (b.hasAttribute("data-prenom")) prenom = b.getAttribute("data-prenom");
        else if (b.hasAttribute("data-rapide")) { remarque = (remarque ? remarque + " ; " : "") + b.getAttribute("data-rapide"); }
        else if (b.hasAttribute("data-niveau")) {
          var prof = await ouvrirDossierProf(false), c2 = await etat().stockage.lire("equipe", "reglages");
          await prof.enregistrer("observations", etat().depot + "-" + Date.now().toString(36), { depot: etat().depot, phase: phase, critere: b.getAttribute("data-critere"),
            groupe: groupe, prenom: prenom || undefined, niveau: b.getAttribute("data-niveau"), remarque: remarque || undefined,
            seance: c2 && c2.valeur.seanceActuelle }, null, { prof: true });
          message = "Observation enregistrée (" + e(groupe + (prenom ? " · " + prenom : "")) + ").";
          remarque = "";
        } else if (b.hasAttribute("data-retirer")) {
          await remplacer(await ouvrirDossierProf(false), "observations", b.getAttribute("data-retirer"), function (v) { v.retiree = true; return v; });
        } else return;
      } catch (err) { message = '<span class="ecart">' + e(err.message) + "</span>"; }
      afficher();
    });
    await afficher();
  };

  // ===== Exports (§8.4) =====

  function telecharger(nom, texte, type) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([texte], { type: type || "application/octet-stream" }));
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function imprimer(html) {
    var boite = document.createElement("div");
    boite.id = "impression";
    boite.innerHTML = html;
    document.body.appendChild(boite);
    document.body.classList.add("impression-en-cours");
    function fin() { document.body.classList.remove("impression-en-cours"); boite.remove(); racine.removeEventListener("afterprint", fin); }
    racine.addEventListener("afterprint", fin);
    racine.print();
    setTimeout(function () { if (boite.isConnected && !racine.matchMedia("print").matches) fin(); }, 60000);
  }

  function liste(x, vide) {
    x = (x || []).filter(Boolean);
    return x.length ? "<ol>" + x.map(function (t) { return "<li>☐ " + e(t) + "</li>"; }).join("") + "</ol>" : '<p class="manque">' + e(vide || "Pas encore renseigné.") + "</p>";
  }
  function texte(t) { return t && String(t).trim() ? O.miseEnForme(t) : '<p class="manque">Pas encore renseigné.</p>'; }

  async function donneesExport() {
    var st = etat().stockage, c = await lireClasse();
    var lire = async function (col, id) { var x = await st.lire(col, id); return x ? x.valeur : {}; };
    var ordre = c.ordre.length ? c.ordre : c.ids;
    var titre = await lire("histoire", "titre"), pitch = await lire("histoire", "pitch"), debut = await lire("frise", "debut"), finP = await lire("frise", "fin");
    var date = await lire("jourj", "date"), roles = (await st.lister("jourj-roles")).filter(function (r) { return !r.valeur.retiree; }).map(function (r) { return r.valeur; });
    var rangement = (await st.lister("jourj-planning")).filter(function (r) { return !r.valeur.retiree && r.valeur.phase === "rangement"; }).map(function (r) { return r.valeur; });
    var enigmes = [];
    for (var i = 0; i < ordre.length; i++) {
      var id = ordre[i], f = {};
      Object.keys(c.fiches[id] || {}).forEach(function (k) { f[k] = c.fiches[id][k].valeur; });
      var g = c.groupes[id] ? c.groupes[id].valeur : {};
      var liaison = i + 1 < ordre.length ? await lire("liaisons", id + "-" + ordre[i + 1]) : null;
      enigmes.push({ id: id, rang: i + 1, g: g, f: f, nom: nomGroupe(c, id), liaison: liaison, suivant: ordre[i + 1] });
    }
    return { c: c, titre: titre.texte || "Escape Lab", pitch: pitch.texte, debut: debut.texte, fin: finP.texte, date: date.date, roles: roles, rangement: rangement, enigmes: enigmes };
  }

  function ficheEnigmeLivret(x, d) {
    var en = x.f.enigme || {}, ind = x.f.indices || {}, ins = x.f.installation || {}, el = x.f.electronique || {}, m = app().mecaniques[x.g.mecanique];
    return '<section class="page"><h2>' + x.rang + ". " + e(x.nom) + ' <span class="petit">(groupe ' + e(x.id) + ")</span></h2>" +
      "<p><strong>Mécanique :</strong> " + e(m ? m.lettre + " · " + m.nom : "à attribuer") + " · <strong>Durée :</strong> " + e(en.duree ? en.duree + " min" : "non estimée") + "</p>" +
      "<h3>Rôle dans l'histoire</h3>" + texte(en.roleHistoire) + "<h3>Déroulé côté joueurs</h3>" + texte(en.scenario) +
      "<h3>Solution</h3>" + texte(en.solution) + "<h3>Cadenas et code</h3><p>" + e((x.g.cadenas && x.g.cadenas.type) || "Type non attribué") + " · code : " + e(en.codeCadenas || "non renseigné") + "</p>" +
      "<h3>Contenu de la boîte</h3>" + texte(en.contenuBoite) +
      "<h3>Indices</h3>" + ["n1", "n2", "n3"].map(function (n, i) {
        var t = ind[n] || {};
        return '<div class="indice"><strong>Niveau ' + (i + 1) + " :</strong> " + (t.texte ? e(t.texte) : '<span class="manque">pas encore écrit</span>') +
          "<br><em>Talkie-walkie :</em> " + (t.talkie ? "« " + e(t.talkie) + " »" : '<span class="manque">pas encore écrit</span>') + "</div>";
      }).join("") +
      "<h3>Matériel</h3>" + tableauMateriel(x.f.materiel) +
      "<h3>Installation</h3>" + liste(ins.etapes) + tableauBranchements(el) +
      "<h3>Contrôles avant l'arrivée des joueurs</h3>" + liste(ins.verifs) +
      "<h3>Remise à zéro</h3>" + liste(ins.remiseAZero) +
      (x.liaison ? "<h3>Liaison vers l'énigme suivante</h3><p><strong>Transmis :</strong> " + e(x.liaison.donne || en.contenuBoite || "à préciser") +
        "<br><strong>Usage :</strong> " + e(x.liaison.utilise || "à préciser") + "<br><strong>Lieu :</strong> " + e(x.liaison.lieu || "à préciser") + "</p>" : "") + "</section>";
  }

  function tableauMateriel(m) {
    var l = ((m || {}).lignes || []).filter(function (x) { return x.element; });
    if (!l.length) return '<p class="manque">Pas encore renseigné.</p>';
    var o = { creer: "à créer", trouver: "à trouver", fourni: "fourni" };
    return "<table><thead><tr><th>Élément</th><th>Quantité</th><th>Origine</th><th>Responsable</th></tr></thead><tbody>" + l.map(function (x) {
      return "<tr><td>" + e(x.element) + "</td><td>" + e(x.quantite == null ? "" : x.quantite) + "</td><td>" + e(o[x.origine] || x.origine || "") + "</td><td>" + e(x.responsable || "") + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  function tableauBranchements(el) {
    var b = (el.branchements || []);
    if (!b.length) return "";
    var connus = app().composants;
    var schema = racine.EscapeLabSchema ? '<div class="zone-schema">' + racine.EscapeLabSchema.schemaSvg({ carte: el.carte, positions: el.positions, branchements: b,
      composants: (el.composants || []).map(function (id) { return connus[id] || { id: id, nom: id }; }).filter(function (c) { return !/^microbit-/.test(c.id); }) }) + "</div>" : "";
    return schema + "<p><strong>Branchements</strong> (" + e(el.carte === "microbit" ? "micro:bit" : "Arduino Uno") + ") :</p><table><thead><tr><th>Composant</th><th>Broche du composant</th><th>Broche de la carte</th><th>Fil</th><th>Vérifié</th></tr></thead><tbody>" +
      b.map(function (x) {
        var c = app().composants[x.composant];
        return "<tr><td>" + e(c ? c.nom : x.composant || "") + "</td><td>" + e(x.brocheComposant || "") + "</td><td>" + e(x.brocheCarte || "à renseigner") + "</td><td>" + e(x.fil || "") + "</td><td>" + (x.verifie ? "☑" : "☐") + "</td></tr>";
      }).join("") + "</tbody></table>" + (el.cableTeste ? "" : '<p class="manque">Câblage pas encore déclaré testé : validation du professeur avant toute mise sous tension.</p>');
  }

  function livret(d) {
    return '<section class="page"><h1>' + e(d.titre) + "</h1><p>Livret du Game Master · " + e(etat().equipe.nom) + " · exporté le " + new Date().toLocaleDateString("fr-FR") + "</p>" +
      "<p><strong>Date du jeu :</strong> " + e(d.date || "pas encore fixée") + " · <strong>Durée prévue :</strong> " + e((d.c.reglages.dureeJeu || 60) + " min") + "</p>" +
      "<h2>Mission et début de partie</h2>" + texte(d.pitch) + texte(d.debut) +
      "<h2>Frise</h2><ol>" + d.enigmes.map(function (x) { var m = app().mecaniques[x.g.mecanique]; return "<li>" + e(x.nom) + " (groupe " + e(x.id) + ", " + e(m ? m.nom : "mécanique à attribuer") + ")</li>"; }).join("") + "</ol>" +
      "<h2>Rôles</h2>" + (d.roles.length ? "<ul>" + d.roles.map(function (r) { return "<li>" + e(r.role || "Rôle") + " : " + e(r.eleve || "à attribuer") + "</li>"; }).join("") + "</ul>" : '<p class="manque">Rôles pas encore répartis.</p>') + "</section>" +
      d.enigmes.map(function (x) { return ficheEnigmeLivret(x, d); }).join("") +
      '<section class="page"><h2>Fin de partie</h2>' + texte(d.fin) + "<h2>Rangement</h2>" + liste(d.rangement.map(function (r) { return (r.quoi || "") + (r.qui ? " — " + r.qui : ""); })) + "</section>";
  }

  function fichesInstallation(d) {
    return d.enigmes.map(function (x) {
      var ins = x.f.installation || {}, en = x.f.enigme || {};
      return '<section class="page fiche-a4"><h1>' + e(x.rang + ". " + x.nom) + '</h1><p>Groupe ' + e(x.id) + " · " + e(etat().equipe.nom) + " · responsable : ________________</p>" +
        '<div class="cadre"><h2>A. Emplacement et passage à la suite</h2>' + (x.liaison ? "<p>Élément de liaison : " + e(x.liaison.donne || en.contenuBoite || "à préciser") + " · lieu : " + e(x.liaison.lieu || "à préciser") + "</p>" : "<p>Dernière énigme de la frise.</p>") + "</div>" +
        '<div class="cadre"><h2>B. Matériel à poser</h2>' + tableauMateriel(x.f.materiel) + "<p>Contenu de la boîte : " + e(en.contenuBoite || "à préciser") + "</p></div>" +
        '<div class="cadre"><h2>C. Installation</h2>' + liste(ins.etapes) + tableauBranchements(x.f.electronique || {}) + "</div>" +
        '<div class="cadre"><h2>D. Vérifications avant le jeu</h2>' + liste(ins.verifs) + "</div>" +
        '<div class="cadre"><h2>E. Remise à zéro</h2>' + liste(ins.remiseAZero) + "</div>" +
        '<p class="pied">☐ Contrôlé · date : ____________ · par : ____________</p></section>';
    }).join("");
  }

  app().pages.exports = async function (zone) {
    zone.innerHTML = '<section class="carte"><h2>Exports</h2><p class="petit">Impressions en noir et blanc. Ce qui n\'est pas encore rempli reste visible (« Pas encore renseigné »).</p><div class="boutons">' +
      '<button class="principal" data-export="livret">Livret du Game Master</button>' +
      '<button data-export="installation">Fiches d\'installation (une page par énigme)</button>' +
      '<button data-export="avancement">Avancement des groupes (CSV)</button>' +
      '<button data-export="sauvegarde">Sauvegarde complète de la classe (.json)</button></div><p class="message-export" role="status"></p></section>';
    zone.addEventListener("click", async function (ev) {
      var b = ev.target.closest("[data-export]");
      if (!b) return;
      var quoi = b.getAttribute("data-export"), msg = zone.querySelector(".message-export");
      b.disabled = true;
      try {
        if (quoi === "livret") imprimer(livret(await donneesExport()));
        else if (quoi === "installation") imprimer(fichesInstallation(await donneesExport()));
        else if (quoi === "avancement") {
          var c = await lireClasse(), jalons = app().jalons();
          var lignes = [["Classe", "Groupe", "Énigme"].concat(jalons.map(function (j) { return (j.code ? j.code + " " : "") + j.nom; }), ["% fait"])];
          c.ids.forEach(function (id) {
            var v = c.groupes[id] ? c.groupes[id].valeur : {};
            lignes.push([etat().depot, id, nomGroupe(c, id)].concat(jalons.map(function (j) {
              var x = (v.jalons || {})[j.id] || {}; return (x.etat || "à faire") + (x.valide ? " (validé)" : "");
            }), [app().avancement(v, null).pourcent]));
          });
          telecharger("avancement-" + etat().depot + ".csv", E.csv(lignes), "text/csv");
        } else if (quoi === "sauvegarde") {
          var ad = etat().adaptateur, chemins = await toutLister(ad, ""), fichiers = {}, ignores = 0;
          for (var i = 0; i < chemins.length; i++) {
            if (/\.json$/.test(chemins[i])) fichiers[chemins[i]] = await ad.lireTexte(chemins[i]); else ignores++;
          }
          telecharger("escape-lab-" + etat().depot + "-" + new Date().toISOString().slice(0, 10) + ".json",
            JSON.stringify({ format: "escape-lab/sauvegarde-classe", version: 1, classe: etat().depot, le: Date.now(), fichiers: fichiers }), "application/json");
          msg.textContent = Object.keys(fichiers).length + " fichiers enregistrés dans la sauvegarde" + (ignores ? " ; " + ignores + " fichiers joints (images, vidéos) restent dans le dossier de la classe." : ".");
        }
      } catch (err) { msg.innerHTML = '<span class="ecart">L\'export n\'a pas pu se faire (' + e(err.message) + ").</span>"; }
      b.disabled = false;
    });
  };

  async function toutLister(ad, dossier) {
    var r = [], entrees = await ad.lister(dossier);
    for (var i = 0; i < entrees.length; i++) {
      var ch = (dossier ? dossier + "/" : "") + entrees[i].nom;
      if (entrees[i].type === "dossier") r = r.concat(await toutLister(ad, ch)); else r.push(ch);
    }
    return r;
  }
})(this);
