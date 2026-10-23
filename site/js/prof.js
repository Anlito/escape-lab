// Espace du professeur (brief §8). Étape 9 : fiches mécaniques (§8.3) et bibliothèque de composants (§11.1),
// créées ou modifiées sans toucher au code, importées ou exportées en .json, enregistrées dans chaque dossier de
// classe ouvert (et donc propagées aux deux dossiers de l'équipe 3C2D1).
(function (racine) {
  "use strict";

  var S = racine.EscapeLabStockage, O = racine.EscapeLabOutils, F = racine.EscapeLabFiche, R = racine.EscapeLabReferentiels;
  var e = O.echapper;
  var REGLAGES = null, DEMO = null, EBAUCHES = { mecaniques: [], composants: [] };
  racine.definirEquipes = function (r) { REGLAGES = r; };
  racine.definirMecaniques = function (m) { EBAUCHES.mecaniques = EBAUCHES.mecaniques.concat(m.mecaniques); };
  racine.definirComposants = function (c) { EBAUCHES.composants = c.composants; };
  racine.definirDemo = function (d) { DEMO = d; };

  var AUTEUR = { prof: true };
  var dossiers = [];           // [{ depot, nom, stockage }]
  var page = "mecaniques", edition = null, enAttente = [], message = "";

  var GENRES = {
    mecaniques: { genre: "mecanique", titre: "Fiches mécaniques", nouveau: "+ Nouvelle mécanique" },
    composants: { genre: "composant", titre: "Bibliothèque de composants", nouveau: "+ Nouveau composant" }
  };

  // --- Champs des formulaires ---

  var CHAMPS = {
    mecaniques: [
      { chemin: "id", type: "texte", libelle: "Identifiant (minuscules et tirets, ne change plus ensuite)", id: true },
      { chemin: "nom", type: "texte", libelle: "Nom" },
      { chemin: "lettre", type: "texte", libelle: "Lettre de la pastille" },
      { chemin: "couleur", type: "couleur", libelle: "Couleur de la pastille" },
      { chemin: "resume", type: "zone", libelle: "Résumé en 2 phrases" },
      { chemin: "etapesJoueur", type: "liste", libelle: "Comment ça marche pour le joueur (une étape par ligne)" },
      { chemin: "aConcevoir", type: "liste", libelle: "Ce que le groupe doit concevoir (une ligne par élément)" },
      { chemin: "formatReponse", type: "zone", libelle: "Format de la réponse (aide au choix du cadenas)" },
      { chemin: "materiel.aCreer", type: "liste", libelle: "Matériel à créer" },
      { chemin: "materiel.aTrouver", type: "liste", libelle: "Matériel à trouver" },
      { chemin: "materiel.fourni", type: "liste", libelle: "Matériel fourni" },
      { chemin: "pistesManuelles.M1", type: "zone", libelle: "Piste M1 (documents à imprimer)" },
      { chemin: "pistesManuelles.M2", type: "zone", libelle: "Piste M2 (objet pour résoudre)" },
      { chemin: "pistesManuelles.M3", type: "zone", libelle: "Piste M3 (système à cadenas)" },
      { chemin: "pistesElectroniques", type: "liste", libelle: "Pistes électroniques (une par ligne)" },
      { chemin: "pieges", type: "liste", libelle: "Pièges fréquents (un par ligne)" },
      { chemin: "indicesExemple.niveau1", type: "zone", libelle: "Exemple d'indice, niveau 1 (orienter)" },
      { chemin: "indicesExemple.niveau2", type: "zone", libelle: "Exemple d'indice, niveau 2 (méthode)" },
      { chemin: "indicesExemple.niveau3", type: "zone", libelle: "Exemple d'indice, niveau 3 (presque la solution)" },
      { chemin: "liens", type: "tableau", libelle: "Liens externes (vidéo, site…)", colonnes: [{ cle: "titre", libelle: "Titre" }, { cle: "url", libelle: "Adresse (https://…)" }] },
      { chemin: "ressources", type: "ressources", libelle: "Exemples et ressources (images, PDF, audio, vidéo)" }
    ],
    composants: [
      { chemin: "id", type: "texte", libelle: "Identifiant (minuscules et tirets, ne change plus ensuite)", id: true },
      { chemin: "nom", type: "texte", libelle: "Nom (avec la référence)" },
      { chemin: "type", type: "choix", libelle: "Type", options: R.TYPES_COMPOSANT },
      { chemin: "cartes.uno", type: "case", libelle: "Utilisable avec l'Arduino Uno" },
      { chemin: "cartes.microbit", type: "case", libelle: "Utilisable avec la micro:bit" },
      { chemin: "broches", type: "tableau", libelle: "Broches du composant et leur rôle", colonnes: [{ cle: "nom", libelle: "Broche" }, { cle: "role", libelle: "Rôle" }] },
      { chemin: "tension", type: "texte", libelle: "Tension (relevée sur la fiche technique)" },
      { chemin: "cablageType", type: "liste", libelle: "Câblage type, en phrases courtes (une par ligne)" },
      { chemin: "precautions", type: "liste", libelle: "Précautions (une par ligne)" },
      { chemin: "lies", type: "liste", libelle: "Composants liés (identifiants, un par ligne : ex. relais)" },
      { chemin: "source", type: "texte", libelle: "Fiche technique (adresse https://…)" },
      { chemin: "valideParProf", type: "case", libelle: "Fiche vérifiée sur le composant réel : je la valide" }
    ]
  };

  function $(id) { return document.getElementById(id); }

  // --- Dossiers ---

  function tousLesDepots() {
    var d = [];
    (REGLAGES.equipes || []).forEach(function (eq) { d = d.concat(eq.depots); });
    return d;
  }

  function cheminAttendu(depot) {
    var LB = racine.LaboBlocs || {};
    var debut = LB.college && LB.remplirChemin ? LB.remplirChemin(LB.college.cheminClasse, depot) : [];
    return debut.concat((REGLAGES.cheminProjet || []).map(function (p) { return p.replace("{depot}", depot); })).join(" › ");
  }

  function afficherDossiers() {
    $("listeDossiers").innerHTML = dossiers.length ? "<ul>" + dossiers.map(function (d, i) {
      return "<li><strong>" + e(d.depot) + "</strong> · dossier « " + e(d.nom) + " » " +
        (d.nom.toUpperCase() !== d.depot.toUpperCase() && d.depot !== "3Z9" ? '<span class="ecart">(nom différent de la classe : vérifie)</span> ' : "") +
        '<button data-fermer="' + i + '">Fermer</button></li>';
    }).join("") + "</ul>" : '<p class="petit">Aucun dossier ouvert.</p>';
    $("resumeDossiers").textContent = dossiers.length ? dossiers.length + " dossier" + (dossiers.length > 1 ? "s" : "") + " ouvert" + (dossiers.length > 1 ? "s" : "") + " : " + dossiers.map(function (d) { return d.depot; }).join(", ") : "Aucun dossier ouvert";
    afficherPage();
  }

  function messageDossiers(t) { $("messageDossiers").textContent = t; $("messageDossiers").hidden = !t; }

  async function ouvrirDossier() {
    var depot = $("choixDepot").value;
    if (!depot) return messageDossiers("Choisis d'abord la classe du dossier.");
    if (dossiers.some(function (d) { return d.depot === depot; })) return messageDossiers("Le dossier de " + depot + " est déjà ouvert.");
    if (!racine.showDirectoryPicker) return messageDossiers("Ce navigateur ne sait pas ouvrir un dossier : utilise Chrome ou Edge.");
    try {
      var poignee = await racine.showDirectoryPicker({ id: "escape-lab-prof-" + depot, mode: "readwrite" });
      var adaptateur = S.creerAdaptateurDossier(poignee);
      dossiers.push({ depot: depot, nom: poignee.name, adaptateur: adaptateur, stockage: S.creerStockage(adaptateur, { depot: depot }) });
      messageDossiers("");
      afficherDossiers();
    } catch (err) {
      messageDossiers("Aucun dossier ouvert. Recommence et accepte l'accès en écriture.");
    }
  }

  async function ouvrirDemo() {
    if (dossiers.some(function (d) { return d.depot === "3Z9"; })) return;
    var adaptateurDemo = S.creerAdaptateurMemoire(), st = S.creerStockage(adaptateurDemo, { depot: "3Z9" });
    for (var i = 0; i < DEMO.elements.length; i++) await st.enregistrer(DEMO.elements[i].collection, DEMO.elements[i].id, DEMO.elements[i].valeur, null, { prenom: "Démo" });
    dossiers.push({ depot: "3Z9", nom: "classe fictive (rien n'est enregistré)", adaptateur: adaptateurDemo, stockage: st });
    afficherDossiers();
  }

  // --- Liste des fiches ---

  async function lireTout(collection) {
    var parDossier = [];
    for (var i = 0; i < dossiers.length; i++) parDossier.push(await dossiers[i].stockage.lister(collection));
    var ids = {}, liste = [];
    EBAUCHES[collection].forEach(function (x) { ids[x.id] = true; });
    parDossier.forEach(function (els) { els.forEach(function (el) { ids[el.id] = true; }); });
    Object.keys(ids).forEach(function (id) {
      var etats = dossiers.map(function (d, i) { return parDossier[i].filter(function (el) { return el.id === id; })[0] || null; });
      var premier = etats.filter(Boolean)[0];
      var ebauche = EBAUCHES[collection].filter(function (x) { return x.id === id; })[0];
      liste.push({ id: id, valeur: premier ? premier.valeur : ebauche, etats: etats, ebauche: ebauche });
    });
    return liste.sort(function (a, b) { return String(a.valeur.nom).localeCompare(String(b.valeur.nom), "fr"); });
  }

  function pastille(m) {
    return '<span class="pastille" style="background:' + e(m.couleur || "#c9c4bb") + '">' + e(m.lettre || "?") + "</span>";
  }

  async function afficherListe(zone) {
    var g = GENRES[page], liste = await lireTout(page);
    var html = '<section class="carte"><h2>' + e(g.titre) + '</h2><div class="boutons">' +
      '<button class="principal" data-action="nouveau">' + e(g.nouveau) + "</button>" +
      '<label class="bouton">Importer une fiche (.json)<input type="file" accept=".json,application/json" id="importer" hidden></label></div>' +
      '<p class="petit">« Ébauche » : texte préparé dans le site, pas encore relu. Enregistrer une fiche la copie dans les dossiers cochés.</p>' +
      (message ? '<p class="bandeau" role="status">' + message + "</p>" : "") + '<div class="grille">';
    html += liste.map(function (x) {
      var v = x.valeur;
      var detail = page === "composants"
        ? '<p class="petit">' + e(v.type || "") + " · " + (v.valideParProf ? '<span class="valide">✓ validée</span>' : '<span class="ecart">pas encore validée</span>') + "</p>"
        : v.supplementaire ? '<p class="petit">Mécanique supplémentaire : principe à confirmer avant de l\'attribuer.</p>' : "";
      return '<article class="carte groupe"><h3>' + (page === "mecaniques" ? pastille(v) + " " : "") + e(v.nom) + "</h3>" + detail +
        "<ul class=\"petit\">" + dossiers.map(function (d, i) {
          var el = x.etats[i];
          var etat = el ? "modifiée le " + dateCourte(el.le) : x.ebauche ? "ébauche du site" : "absente";
          var active = page === "mecaniques" ? ' <label class="case"><input type="checkbox" data-activer="' + e(x.id) + '" data-dossier="' + i + '"' +
            (!el || el.valeur.active !== false ? " checked" : "") + (el || x.ebauche ? "" : " disabled") + "> active</label>" : "";
          return "<li>" + e(d.depot) + " : " + etat + active + "</li>";
        }).join("") + "</ul>" +
        '<div class="boutons"><button data-action="modifier" data-id="' + e(x.id) + '">Modifier</button>' +
        '<button data-action="exporter" data-id="' + e(x.id) + '">Exporter</button></div></article>';
    }).join("") + "</div></section>";
    zone.innerHTML = html;
    zone._liste = liste;
  }

  function dateCourte(ms) {
    var d = new Date(ms);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  // --- Formulaire ---

  function champHtml(c, v) {
    var x = F.lireChemin(v, c.chemin), id = "p-" + c.chemin.replace(/\./g, "-");
    var lab = '<label for="' + id + '">' + e(c.libelle) + "</label>";
    if (c.type === "texte") return lab + '<input id="' + id + '" data-chemin="' + c.chemin + '" value="' + e(x || "") + '"' + (c.id && !edition.nouveau ? " readonly" : "") + ">";
    if (c.type === "couleur") return lab + '<input id="' + id + '" type="color" data-chemin="' + c.chemin + '" value="' + e(x || "#c9c4bb") + '" style="width:6em;height:2.4em">';
    if (c.type === "zone") return lab + '<textarea id="' + id + '" rows="2" data-chemin="' + c.chemin + '">' + e(x || "") + "</textarea>";
    if (c.type === "liste") return lab + '<textarea id="' + id + '" rows="3" data-chemin="' + c.chemin + '" data-liste="1">' + e((x || []).join("\n")) + "</textarea>";
    if (c.type === "case") return '<label class="case"><input type="checkbox" data-chemin="' + c.chemin + '" data-case="1"' + (x ? " checked" : "") + "> " + e(c.libelle) + "</label>";
    if (c.type === "choix") return lab + '<select id="' + id + '" data-chemin="' + c.chemin + '"><option value="">Choisir…</option>' +
      c.options.map(function (o) { return "<option" + (o === x ? " selected" : "") + ">" + e(o) + "</option>"; }).join("") + "</select>";
    if (c.type === "tableau") {
      var lignes = (x || []).concat([{}]);   // toujours une ligne vide pour ajouter
      return "<label>" + e(c.libelle) + '</label><table class="tableau-saisie" data-tableau="' + c.chemin + '"><thead><tr>' +
        c.colonnes.map(function (k) { return "<th>" + e(k.libelle) + "</th>"; }).join("") + "</tr></thead><tbody>" + lignes.map(function (l, i) {
          return "<tr>" + c.colonnes.map(function (k) { return '<td><input data-col="' + k.cle + '" aria-label="' + e(k.libelle) + " " + (i + 1) + '" value="' + e(l[k.cle] || "") + '"></td>'; }).join("") + "</tr>";
        }).join("") + '</tbody></table><p class="petit">Laisser une ligne vide pour la retirer.</p>';
    }
    if (c.type === "ressources") {
      var r = (x || []).map(function (f, i) {
        return "<li>" + e(f.titre || f.nomOrigine) + ' <span class="petit">(' + e(f.nomOrigine) + ", " + O.tailleLisible(f.taille || 0) + ')</span> <button data-action="retirerRessource" data-index="' + i + '">Retirer</button></li>';
      }).concat(enAttente.map(function (f, i) {
        return "<li>" + e(f.name) + ' <span class="petit">(sera copié à l\'enregistrement)</span> <button data-action="retirerAttente" data-index="' + i + '">Retirer</button></li>';
      }));
      return "<label>" + e(c.libelle) + "</label>" + (r.length ? "<ul>" + r.join("") + "</ul>" : '<p class="petit">Aucune ressource.</p>') +
        '<input type="file" id="ajoutRessource" accept="image/*,application/pdf,audio/*,video/*" multiple aria-label="Ajouter des ressources">';
    }
    return "";
  }

  function collecter() {
    var v = JSON.parse(JSON.stringify(edition.valeur));
    document.querySelectorAll("#formulaireProf [data-chemin]").forEach(function (c) {
      var x = c.getAttribute("data-case") ? c.checked
        : c.getAttribute("data-liste") ? c.value.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean) : c.value.trim();
      F.ecrireChemin(v, c.getAttribute("data-chemin"), x);
    });
    document.querySelectorAll("#formulaireProf table[data-tableau]").forEach(function (t) {
      var lignes = [].map.call(t.querySelectorAll("tbody tr"), function (tr) {
        var l = {};
        tr.querySelectorAll("[data-col]").forEach(function (c) { l[c.getAttribute("data-col")] = c.value.trim(); });
        return l;
      }).filter(function (l) { return Object.keys(l).some(function (k) { return l[k]; }); });
      F.ecrireChemin(v, t.getAttribute("data-tableau"), lignes);
    });
    edition.valeur = v;
    return v;
  }

  function problemes(v) {
    if (page === "composants") return R.verifierComposant(v);
    var autres = (document.getElementById("pageProf")._liste || []).map(function (x) { return x.valeur; });
    var p = R.verifierMecanique(v, autres);
    (v.liens || []).forEach(function (l) { if (l.url && !O.lienValide(l.url)) p.push("Le lien « " + l.titre + " » doit commencer par https:// ou http://."); });
    return p;
  }

  function afficherFormulaire(zone) {
    var g = GENRES[page];
    zone.innerHTML = '<section class="carte formulaire" id="formulaireProf"><h2>' + (edition.nouveau ? "Nouvelle fiche" : "Modifier : " + e(edition.valeur.nom)) + "</h2>" +
      CHAMPS[page].map(function (c) { return champHtml(c, edition.valeur); }).join("") +
      "<fieldset><legend>Enregistrer dans les dossiers</legend>" + dossiers.map(function (d, i) {
        return '<label class="case"><input type="checkbox" data-cible="' + i + '" checked> ' + e(d.depot) + "</label>";
      }).join("") + "</fieldset>" +
      '<div id="problemes">' + (message ? "<p>" + message + "</p>" : "") + '</div><div class="boutons"><button class="principal" data-action="enregistrer">Enregistrer la fiche</button>' +
      '<button data-action="annuler">Annuler</button></div></section>';
    void g;
  }

  async function enregistrer() {
    var v = collecter();
    var p = problemes(v);
    if (p.length) { $("problemes").innerHTML = p.map(function (x) { return '<p class="ecart">' + e(x) + "</p>"; }).join(""); return false; }
    var cibles = [].filter.call(document.querySelectorAll("[data-cible]"), function (c) { return c.checked; }).map(function (c) { return dossiers[Number(c.getAttribute("data-cible"))]; });
    if (!cibles.length) { $("problemes").innerHTML = '<p class="ecart">Coche au moins un dossier.</p>'; return false; }
    // Ressources ajoutées : copiées dans chaque dossier, avec le même nom.
    var nouvelles = enAttente.map(function (f) {
      return { fichier: f, info: { titre: f.name.replace(/\.[^.]+$/, ""), nom: O.nomFichierStocke(v.id + "-" + Date.now().toString(36) + Math.floor(Math.random() * 1e4), f.name), nomOrigine: f.name, type: f.type, taille: f.size } };
    });
    for (var i = 0; i < cibles.length; i++) {
      var st = cibles[i].stockage;
      for (var k = 0; k < nouvelles.length; k++) await st.ecrireFichier(page, nouvelles[k].info.nom, nouvelles[k].fichier);
      var valeur = Object.assign({}, v, { ressources: (v.ressources || []).concat(nouvelles.map(function (n) { return n.info; })) });
      for (var essai = 0; essai < 3; essai++) {
        var actuel = await st.lire(page, v.id);
        if (actuel && actuel.valeur.active === false) valeur.active = false;
        if ((await st.enregistrer(page, v.id, valeur, actuel ? actuel.vid : null, AUTEUR)).ok) break;
      }
    }
    message = "« " + e(v.nom) + " » enregistrée dans : " + cibles.map(function (c) { return e(c.depot); }).join(", ") + ".";
    edition = null; enAttente = [];
    return true;
  }

  function telecharger(nom, texte) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([texte], { type: "application/json" }));
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  async function afficherPage() {
    var zone = $("pageProf");
    document.querySelectorAll("#ongletsProf [data-page]").forEach(function (b) { if (b.getAttribute("data-page") === page) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
    $("titrePage").textContent = { mecaniques: "Fiches mécaniques", composants: "Bibliothèque de composants", synchro: "Synchronisation 3C2D1" }[page];
    if (!dossiers.length) { zone.innerHTML = '<p class="bandeau">Ouvre d\x27abord un dossier de classe (ou la classe fictive) pour voir et modifier les fiches.</p>'; return; }
    if (page === "synchro") return afficherSynchro(zone);
    if (edition) return afficherFormulaire(zone);
    try { await afficherListe(zone); }
    catch (err) { zone.innerHTML = '<p class="bandeau ecart">Un dossier n\'a pas pu être lu (' + e(err.message) + "). Ferme-le et ouvre-le de nouveau.</p>"; }
  }

  // --- Synchronisation des deux dossiers d'une équipe (brief §10.1) ---

  var rapportSynchro = null;
  async function afficherSynchro(zone) {
    var equipes = (REGLAGES.equipes || []).filter(function (eq) { return eq.depots.length > 1; });
    var html = '<section class="carte"><h2>Synchronisation</h2><p class="petit">Pour une équipe à deux dossiers : ouvre les deux dossiers ci-dessus, regarde l\x27aperçu, puis synchronise. ' +
      "Après, les deux dossiers sont identiques ; une section modifiée des deux côtés garde les deux textes (le professeur choisit dans la page de l\x27équipe).</p>";
    for (var i = 0; i < equipes.length; i++) {
      var eq = equipes[i], a = dossiers.filter(function (d) { return d.depot === eq.depots[0]; })[0], b = dossiers.filter(function (d) { return d.depot === eq.depots[1]; })[0];
      html += "<h3>Équipe " + e(eq.nom) + " (" + e(eq.depots.join(" + ")) + ")</h3>";
      if (!a || !b) { html += '<p class="ecart">Ouvre d\x27abord le dossier de ' + e(eq.depots.filter(function (d) { return !dossiers.some(function (x) { return x.depot === d; }); }).join(" et de ")) + ".</p>"; continue; }
      var journal = await a.adaptateur.lister("synchronisation/journal"), derniere = 0;
      for (var k = 0; k < journal.length; k++) { try { derniere = Math.max(derniere, JSON.parse(await a.adaptateur.lireTexte("synchronisation/journal/" + journal[k].nom)).le || 0); } catch (err) { /* illisible */ } }
      html += "<p>" + (derniere ? "Dernière synchronisation : " + dateCourte(derniere) : "Jamais synchronisée.") + "</p>" +
        '<div class="boutons"><button data-synchro="' + i + '" data-simuler="1">Aperçu</button><button class="principal" data-synchro="' + i + '">Synchroniser</button></div>';
      if (rapportSynchro && rapportSynchro.equipe === eq.nom) html += rapportHtml(rapportSynchro, eq);
    }
    if (!equipes.length) html += '<p class="petit">Aucune équipe à deux dossiers dans donnees/equipes.js.</p>';
    zone.innerHTML = (message ? '<p class="bandeau" role="status">' + message + "</p>" : "") + html + "</section>";
    zone._equipes = equipes;
  }

  function rapportHtml(r, eq) {
    function listeChemins(t) { return t.length ? "<ul>" + t.slice(0, 40).map(function (c) { return "<li>" + e(c) + "</li>"; }).join("") + (t.length > 40 ? "<li>… et " + (t.length - 40) + " autres</li>" : "") + "</ul>" : '<p class="petit">Rien.</p>'; }
    var utiles = function (t) { return t.filter(function (c) { return c.indexOf("/historique/") === -1 && c.indexOf("presence/") !== 0; }); };
    return '<div class="carte-groupe"><h4>' + (r.rapport.simulation ? "Aperçu (rien n\x27est encore copié)" : "Synchronisation faite") + "</h4>" +
      "<p>Vers " + e(eq.depots[1]) + " : " + r.rapport.versB.length + " fichier(s) · vers " + e(eq.depots[0]) + " : " + r.rapport.versA.length + " fichier(s) · conflits : " + r.rapport.conflits.length + "</p>" +
      (r.rapport.conflits.length ? '<p class="ecart">Modifié des deux côtés (les deux textes sont gardés, à trancher) :</p>' + listeChemins(r.rapport.conflits) : "") +
      "<details><summary>Éléments copiés vers " + e(eq.depots[1]) + "</summary>" + listeChemins(utiles(r.rapport.versB)) + "</details>" +
      "<details><summary>Éléments copiés vers " + e(eq.depots[0]) + "</summary>" + listeChemins(utiles(r.rapport.versA)) + "</details></div>";
  }

  // --- Événements ---

  document.addEventListener("DOMContentLoaded", function () {
    var LB = racine.LaboBlocs || {};
    if (LB.chargerCollegeEnLigne) LB.chargerCollegeEnLigne();
    $("choixDepot").innerHTML = '<option value="">Choisir…</option>' + tousLesDepots().map(function (d) { return "<option>" + e(d) + "</option>"; }).join("");
    $("choixDepot").addEventListener("change", function () { $("aideDepot").textContent = this.value ? "Dossier à choisir : " + cheminAttendu(this.value) : ""; });
    $("btnOuvrirDossier").addEventListener("click", ouvrirDossier);
    $("btnVerrouiller").addEventListener("click", function () { if (racine.EscapeLabPorte) racine.EscapeLabPorte.verrouiller(); });
    $("btnDemoProf").addEventListener("click", ouvrirDemo);
    $("listeDossiers").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-fermer]");
      if (b) { dossiers.splice(Number(b.getAttribute("data-fermer")), 1); afficherDossiers(); }
    });
    $("ongletsProf").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-page]");
      if (!b) return;
      ev.preventDefault();
      if (edition && !confirm("Quitter la fiche sans l'enregistrer ?")) return;
      page = b.getAttribute("data-page"); edition = null; enAttente = []; message = "";
      afficherPage();
    });

    var zone = $("pageProf");
    zone.addEventListener("click", async function (ev) {
      var bs = ev.target.closest("button[data-synchro]");
      if (bs) {
        var eq = zone._equipes[Number(bs.getAttribute("data-synchro"))];
        var da = dossiers.filter(function (d) { return d.depot === eq.depots[0]; })[0], db = dossiers.filter(function (d) { return d.depot === eq.depots[1]; })[0];
        bs.disabled = true; bs.textContent = "…";
        try { rapportSynchro = { equipe: eq.nom, rapport: await S.synchroniser(da.adaptateur, db.adaptateur, { simuler: bs.hasAttribute("data-simuler") }) }; }
        catch (err) { rapportSynchro = null; message = '<span class="ecart">La synchronisation n\x27a pas pu se faire (' + e(err.message) + "). Rien n\x27est perdu : relance-la.</span>"; }
        return afficherPage();
      }
      var b = ev.target.closest("button[data-action]");
      if (!b) return;
      var a = b.getAttribute("data-action"), id = b.getAttribute("data-id");
      var x = (zone._liste || []).filter(function (y) { return y.id === id; })[0];
      message = "";
      if (a === "nouveau") { edition = { nouveau: true, valeur: page === "mecaniques" ? { couleur: "#c9c4bb" } : { cartes: { uno: true } } }; enAttente = []; }
      else if (a === "modifier") { edition = { nouveau: false, valeur: JSON.parse(JSON.stringify(x.valeur)) }; enAttente = []; }
      else if (a === "exporter") { telecharger(x.id + ".json", R.exporter(GENRES[page].genre, x.valeur)); return; }
      else if (a === "annuler") { edition = null; enAttente = []; }
      else if (a === "enregistrer") { b.disabled = true; var ok = await enregistrer(); b.disabled = false; if (!ok) return; }
      else if (a === "retirerRessource") { collecter(); edition.valeur.ressources.splice(Number(b.getAttribute("data-index")), 1); }
      else if (a === "retirerAttente") { collecter(); enAttente.splice(Number(b.getAttribute("data-index")), 1); }
      else return;
      afficherPage();
      racine.scrollTo(0, zone.offsetTop - 10);
    });
    zone.addEventListener("change", async function (ev) {
      var t = ev.target;
      if (t.id === "ajoutRessource") {
        collecter();
        var refuses = [];
        [].forEach.call(t.files, function (f) {
          if (O.genreDeFichier(f.type) && f.size <= 50 * 1024 * 1024) enAttente.push(f); else refuses.push(f.name);
        });
        if (refuses.length) message = '<span class="ecart">Non ajouté (image, PDF, audio ou vidéo de 50 Mo au plus) : ' + e(refuses.join(", ")) + "</span>";
        afficherPage();
      } else if (t.id === "importer" && t.files[0]) {
        var r = R.importer(await t.files[0].text(), GENRES[page].genre);
        if (r.erreur) { message = '<span class="ecart">' + e(r.erreur) + "</span>"; return afficherPage(); }
        var existe = (zone._liste || []).some(function (y) { return y.id === r.fiche.id; });
        edition = { nouveau: !existe, valeur: r.fiche }; enAttente = [];
        message = "";
        afficherPage();
      } else if (t.getAttribute("data-activer")) {
        var d = dossiers[Number(t.getAttribute("data-dossier"))], idA = t.getAttribute("data-activer");
        var item = (zone._liste || []).filter(function (y) { return y.id === idA; })[0];
        var actuel = await d.stockage.lire(page, idA);
        var valeur = Object.assign({}, actuel ? actuel.valeur : item.ebauche, { active: t.checked });
        await d.stockage.enregistrer(page, idA, valeur, actuel ? actuel.vid : null, AUTEUR);
        message = "« " + e(valeur.nom) + " » " + (t.checked ? "activée" : "désactivée") + " pour " + e(d.depot) + ".";
        afficherPage();
      }
    });
    afficherDossiers();
  });
})(this);
