// Fiche énigme d'un groupe (brief §7.6, §7.7, §11.1) : onglets à champs guidés, voyants d'état, jalons, atelier de
// câblage v1, journal, avis de test croisé. Pages « Mon énigme » (modifiable par le groupe) et « Énigmes des autres »
// (lecture seule, solution masquée, avis de test).
//
// Stockage : un élément par onglet, fiches/<groupe>-<onglet> ; groupes/<groupe> garde le nom, la mécanique et le
// cadenas attribués et l'état des jalons (lu par le tableau de bord). Journal, avis et remarques : un élément par
// entrée (journal/, avis/, remarques/), jamais modifié ensuite. Photos : fiches/fichiers/.
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, F = racine.EscapeLabFiche, e = O.echapper;
  var ROLES = ["chef de projet", "programmeur", "designer/constructeur", "rédacteur/reporter"];
  var MATIERES = ["Mathématiques", "Français", "Histoire-géographie", "Physique-chimie", "SVT", "Anglais", "Espagnol",
                  "Allemand", "Arts plastiques", "Éducation musicale", "EPS", "EMC", "Autre"];
  var ETATS = ["à faire", "en cours", "fait"];
  var SYMBOLES = { "à faire": "○", "en cours": "◐", "fait": "●" };
  var NIVEAUX = [
    { n: "n1", titre: "Niveau 1 : orienter", consigne: "Où regarder, quel objet utiliser, sans dire comment." },
    { n: "n2", titre: "Niveau 2 : méthode", consigne: "Comment s'y prendre, étape par étape, sans donner la réponse." },
    { n: "n3", titre: "Niveau 3 : presque la solution", consigne: "Il ne reste que la dernière action à faire." }
  ];
  // Capteurs déjà sur la micro:bit : pas de câblage (brief §11.1). Compter pour E1 : question 14, à confirmer.
  var INTEGRES_MICROBIT = [
    { id: "microbit-lumiere", nom: "Capteur de lumière (intégré à la micro:bit)", type: "capteur", integre: true },
    { id: "microbit-temperature", nom: "Capteur de température (intégré à la micro:bit)", type: "capteur", integre: true },
    { id: "microbit-gestes", nom: "Capteur de gestes (intégré à la micro:bit)", type: "capteur", integre: true }
  ];

  // --- Description des onglets (champs guidés) ---

  var ONGLETS = [
    { id: "mecanique", nom: "Ma mécanique", jalons: ["mecanique"] },
    { id: "enigme", nom: "Mon énigme", jalons: ["scenario", "matiere"], champs: [
      { cle: "titre", type: "texte", libelle: "Nom de l'énigme", aide: "enigme.titre" },
      { cle: "membres", type: "tableau", libelle: "Membres et rôles", colonnes: [
        { cle: "prenom", libelle: "Prénom", type: "texte" }, { cle: "role", libelle: "Rôle", type: "choix", options: ROLES }] },
      { cle: "roleHistoire", type: "zone", libelle: "Place dans l'histoire", aide: "enigme.roleHistoire", lignes: 2 },
      { cle: "scenario", type: "zone", libelle: "Ce que voit le joueur, ce qu'il doit faire (pas à pas)", aide: "enigme.scenario", lignes: 5 },
      { cle: "solution", type: "zone", libelle: "Solution", aide: "enigme.solution", lignes: 3, masque: true },
      { cle: "cadenas", type: "cadenas", libelle: "Type de cadenas (attribué par le professeur)" },
      { cle: "codeCadenas", type: "texte", libelle: "Code du cadenas", masque: true },
      { cle: "contenuBoite", type: "zone", libelle: "Ce qui est dans la boîte (passe à l'énigme suivante)", aide: "enigme.contenuBoite", lignes: 2 },
      { cle: "duree", type: "nombre", libelle: "Durée estimée (minutes)", aide: "enigme.duree", min: 1, max: 30 },
      { cle: "difficulte", type: "choix", libelle: "Difficulté", options: ["★", "★★", "★★★"], aide: "enigme.difficulte" },
      { cle: "matiere", type: "choix", libelle: "Matière vue en cours (obligatoire)", options: MATIERES, aide: "enigme.matiere" },
      { cle: "lienMatiere", type: "zone", libelle: "Le lien avec cette matière, en 2 ou 3 phrases, avec un exemple dans l'énigme", aide: "enigme.lienMatiere", lignes: 3 }
    ] },
    { id: "fonctionnement", nom: "Fonctionnement", jalons: [], champs: [
      { cle: "texte", type: "zone", libelle: "La mécanique appliquée à notre énigme : comment le message, la grille, la clé… sont construits", aide: "fonctionnement", lignes: 7 },
      { cle: "photos", type: "photos", libelle: "Schéma ou photo (de l'objet, jamais des personnes)" }
    ] },
    { id: "materiel", nom: "Matériel", jalons: ["materiel"], champs: [
      { cle: "lignes", type: "tableau", libelle: "Matériel", colonnes: [
        { cle: "element", libelle: "Élément", type: "texte" }, { cle: "quantite", libelle: "Quantité", type: "nombre" },
        { cle: "origine", libelle: "Origine", type: "choix", options: [["creer", "À créer"], ["trouver", "À trouver"], ["fourni", "Fourni par le prof"]] },
        { cle: "machine", libelle: "Comment (machine)", type: "texte" }, { cle: "responsable", libelle: "Responsable", type: "texte" },
        { cle: "etat", libelle: "État", type: "choix", options: ETATS }] }
    ] },
    { id: "fabrication", nom: "Fabrication", jalons: ["M1", "M2", "M3"], champs: ["M1", "M2", "M3"].map(function (m) {
      var noms = { M1: "M1 · Documents à imprimer et personnaliser", M2: "M2 · Objet pour résoudre l'énigme", M3: "M3 · Système fermé par un cadenas" };
      return { cle: m, type: "groupe", libelle: noms[m], champs: [
        { cle: "description", type: "zone", libelle: "Description", lignes: 3 },
        { cle: "machines", type: "texte", libelle: "Machines et matériaux" },
        m === "M3" ? { cle: "dimensions", type: "texte", libelle: "Dimensions" } : null,
        { cle: "fichiers", type: "zone", libelle: "Fichiers (lien Canva, nom du fichier .stl ou de découpe)", lignes: 2 },
        { cle: "photos", type: "photos", libelle: "Photos (de l'objet, jamais des personnes)" },
        { cle: "pret", type: "case", libelle: "Prêt : le professeur peut valider" },
        { cle: "validation", type: "validation", jalon: m }
      ].filter(Boolean) };
    }) },
    { id: "electronique", nom: "Électronique et programmation", jalons: ["choixE1", "cablage", "programme"] },
    { id: "indices", nom: "Indices", jalons: ["indices"] },
    { id: "installation", nom: "Installation", jalons: ["installation"], champs: [
      { cle: "etapes", type: "liste", libelle: "Étapes pour poser l'énigme dans le foyer (une par ligne : où, quoi, branchements, tests)", aide: "installation.etapes", lignes: 5 },
      { cle: "remiseAZero", type: "liste", libelle: "Remise à zéro après chaque partie (une étape par ligne)", aide: "installation.remiseAZero", lignes: 4 },
      { cle: "verifs", type: "liste", libelle: "À vérifier avant l'arrivée des joueurs (une vérification par ligne)", aide: "installation.verifs", lignes: 4 }
    ] },
    { id: "tests", nom: "Tests et avis", jalons: ["test"], champs: [
      { cle: "dureeReelle", type: "nombre", libelle: "Durée réelle pendant le test (minutes)", min: 1, max: 60 },
      { cle: "modifications", type: "zone", libelle: "Modifications faites après les tests", lignes: 3 }
    ] },
    { id: "journal", nom: "Journal", prive: true },
    { id: "remarques", nom: "Remarques du professeur", prive: true }
  ];

  // Anciennes données rangées dans groupes/<id> (démonstration, annexe B) : relues comme onglets.
  function depuisAncienFormat(g, onglet) {
    if (!g) return {};
    if (onglet === "enigme") return Object.assign({ titre: g.nom, membres: g.membres || [] }, g.enigme || {}, g.cadenas && g.cadenas.code ? { codeCadenas: g.cadenas.code } : {});
    if (onglet === "fonctionnement") return typeof g.fonctionnement === "string" ? { texte: g.fonctionnement } : {};
    if (onglet === "materiel") return { lignes: g.materiel || [] };
    if (onglet === "fabrication") {
      var r = {};
      Object.keys(g.fabrication || {}).forEach(function (m) {
        var c = g.fabrication[m];
        r[m] = { description: c.description, fichiers: (c.fichiers || []).join("\n"), pret: c.etat === "fait" };
      });
      return r;
    }
    if (onglet === "electronique") return g.electronique ? { carte: g.electronique.carte, role: g.electronique.role } : {};
    if (onglet === "indices") return g.indices || {};
    if (onglet === "installation") return g.installation || {};
    return {};
  }

  function idsGroupes() { return racine.EscapeLab.lettresGroupes(racine.EscapeLab.nombreGroupes()); }

  // --- Affichage d'une fiche ---
  // options : { lecture: bool (fiche d'un autre groupe ou miroir), autres: bool (cacher journal et remarques) }

  async function afficherFiche(zone, groupeId, options) {
    var app = racine.EscapeLab, et = app.etat, st = et.stockage;
    var lecture = !!options.lecture;
    var onglets = ONGLETS.filter(function (o) { return !(options.autres && o.prive); });
    var courant = options.onglet || "enigme";
    var elementGroupe = await st.lire("groupes", groupeId);
    var g = elementGroupe ? elementGroupe.valeur : {};
    var reglages = await st.lire("equipe", "reglages");
    var seance = reglages && reglages.valeur.seanceActuelle;
    var parEnigme = (reglages && reglages.valeur.minutesParEnigme) || 12;

    // Miroir en lecture seule pour l'équipe à deux dossiers (brief §10.1).
    var miroir = !lecture && g.depotOrigine && et.equipe.depots.length > 1 && g.depotOrigine !== et.depot;
    if (miroir) lecture = true;

    var fiche = {}, elements = {}, bases = {}, travail = {}, modifies = {};
    for (var i = 0; i < ONGLETS.length; i++) {
      var o = ONGLETS[i];
      if (o.prive) continue;
      var el = await st.lire("fiches", groupeId + "-" + o.id);
      elements[o.id] = el;
      fiche[o.id] = el ? el.valeur : depuisAncienFormat(g, o.id);
      bases[o.id] = JSON.parse(JSON.stringify(fiche[o.id]));
    }
    var avisRecus = (await st.lister("avis")).filter(function (a) { return a.valeur.cible === groupeId; });
    var montrerSolution = false, message = "";
    var adresses = [];

    function composantsConnus() {
      var c = Object.assign({}, app.composants);
      INTEGRES_MICROBIT.forEach(function (x) { c[x.id] = x; });
      return c;
    }
    function jalonsCalcules() { return F.calculerJalons(fiche, { avisRecus: avisRecus.length, composants: composantsConnus() }); }

    function etatJalon(id) {
      var calc = jalonsCalcules();
      return calc[id] || ((g.jalons || {})[id] && (g.jalons[id].etat || g.jalons[id])) || "à faire";
    }
    function etatOnglet(o) {
      if (!o.jalons || !o.jalons.length) return null;
      var etats = o.jalons.map(etatJalon);
      if (etats.every(function (x) { return x === "fait"; })) return "fait";
      return etats.some(function (x) { return x !== "à faire"; }) ? "en cours" : "à faire";
    }

    // --- Champs ---

    function valeurDe(onglet) { return lecture ? fiche[onglet] : (travail[onglet] || fiche[onglet]); }

    function champHtml(champ, valeur, prefixe) {
      var chemin = prefixe ? prefixe + "." + champ.cle : champ.cle;
      var v = F.lireChemin(valeur, chemin);
      var aide = champ.aide ? app.aide(champ.aide) : {};
      var id = "f-" + chemin.replace(/\./g, "-");
      if (champ.type === "groupe") {
        return '<fieldset class="carte-groupe"><legend>' + e(champ.libelle) + "</legend>" +
          champ.champs.map(function (c) { return champHtml(c, valeur, chemin); }).join("") + "</fieldset>";
      }
      if (champ.type === "cadenas") {
        return '<p><strong>' + e(champ.libelle) + " :</strong> " + e((g.cadenas && g.cadenas.type) || "pas encore attribué") + "</p>";
      }
      if (champ.type === "validation") {
        var j = (g.jalons || {})[champ.jalon] || {};
        return '<p class="' + (j.valide ? "valide" : "petit") + '">' + (j.valide ? "✓ Validé par le professeur" : "Pas encore validé par le professeur") + "</p>";
      }
      if (champ.masque && (lecture || options.autres) && !montrerSolution) {
        return '<p><strong>' + e(champ.libelle) + " :</strong> " + (rempliTexte(v) ? '<button data-action="montrerSolution">Afficher</button>' : '<span class="petit">pas encore écrite</span>') + "</p>";
      }
      if (lecture) return lectureHtml(champ, v);
      var entete = '<label for="' + id + '">' + e(champ.libelle) + "</label>" +
        (aide.consigne ? '<p class="petit">' + e(aide.consigne) + "</p>" : "") +
        (aide.exemple ? '<p class="petit exemple">Exemple : ' + e(aide.exemple) + "</p>" : "");
      var indication = aide.phraseACompleter ? ' placeholder="' + e(aide.phraseACompleter) + '"' : "";
      if (champ.type === "texte") return entete + '<input id="' + id + '" data-chemin="' + chemin + '" value="' + e(v || "") + '"' + indication + ">";
      if (champ.type === "nombre") return entete + '<input id="' + id + '" type="number" data-chemin="' + chemin + '" data-nombre="1"' +
        (champ.min ? ' min="' + champ.min + '"' : "") + (champ.max ? ' max="' + champ.max + '"' : "") + ' value="' + e(v == null ? "" : v) + '">';
      if (champ.type === "zone") return entete + '<textarea id="' + id + '" data-chemin="' + chemin + '" rows="' + (champ.lignes || 3) + '"' + indication + ">" + e(v || "") + "</textarea>";
      if (champ.type === "liste") return entete + '<textarea id="' + id + '" data-chemin="' + chemin + '" data-liste="1" rows="' + (champ.lignes || 3) + '"' + indication + ">" + e((v || []).join("\n")) + "</textarea>";
      if (champ.type === "case") return '<label class="case"><input type="checkbox" data-chemin="' + chemin + '" data-case="1"' + (v ? " checked" : "") + "> " + e(champ.libelle) + "</label>";
      if (champ.type === "choix") return entete + '<select id="' + id + '" data-chemin="' + chemin + '">' + optionsHtml(champ.options, v) + "</select>";
      if (champ.type === "tableau") return entete + tableauHtml(champ, v || [], chemin);
      if (champ.type === "photos") return entete + photosHtml(v || [], chemin, false) +
        '<input type="file" accept="image/*" data-photo="' + chemin + '" aria-label="Ajouter une photo">';
      return "";
    }

    function rempliTexte(v) { return v != null && String(v).trim() !== ""; }

    function optionsHtml(options, v) {
      return '<option value="">Choisir…</option>' + options.map(function (op) {
        var val = Array.isArray(op) ? op[0] : op, lib = Array.isArray(op) ? op[1] : op;
        return '<option value="' + e(val) + '"' + (String(v) === String(val) ? " selected" : "") + ">" + e(lib) + "</option>";
      }).join("");
    }

    function libelleOption(options, v) {
      var op = (options || []).filter(function (x) { return (Array.isArray(x) ? x[0] : x) === v; })[0];
      return op ? (Array.isArray(op) ? op[1] : op) : v;
    }

    function lectureHtml(champ, v) {
      var titre = '<h4 class="libelle">' + e(champ.libelle) + "</h4>";
      if (champ.type === "case") return "<p>" + (v ? "☑ " : "☐ ") + e(champ.libelle) + "</p>";
      if (champ.type === "photos") return titre + photosHtml(v || [], "", true);
      var vide = '<p class="petit vide">Pas encore rempli.</p>';
      if (champ.type === "tableau") {
        if (!v || !v.length) return titre + vide;
        return titre + '<div class="defile"><table><thead><tr>' + champ.colonnes.map(function (c) { return "<th>" + e(c.libelle) + "</th>"; }).join("") +
          "</tr></thead><tbody>" + v.map(function (ligne) {
            return "<tr>" + champ.colonnes.map(function (c) {
              var x = ligne[c.cle];
              return "<td>" + (c.type === "case" ? (x ? "☑" : "☐") : e(c.type === "choix" ? libelleOption(c.options, x) : x == null ? "" : x)) + "</td>";
            }).join("") + "</tr>";
          }).join("") + "</tbody></table></div>";
      }
      if (champ.type === "liste") return titre + ((v || []).length ? "<ol>" + v.map(function (x) { return "<li>" + e(x) + "</li>"; }).join("") + "</ol>" : vide);
      if (!rempliTexte(v)) return titre + vide;
      if (champ.type === "zone") return titre + O.miseEnForme(v);
      return titre + "<p>" + e(champ.type === "choix" ? libelleOption(champ.options, v) : v) + "</p>";
    }

    function tableauHtml(champ, lignes, chemin) {
      return '<div class="defile"><table class="tableau-saisie" data-tableau="' + chemin + '"><thead><tr>' +
        champ.colonnes.map(function (c) { return "<th>" + e(c.libelle) + "</th>"; }).join("") + "<th></th></tr></thead><tbody>" +
        lignes.map(function (ligne, i) {
          return '<tr data-ligne="' + i + '">' + champ.colonnes.map(function (c) {
            var x = ligne[c.cle], nom = e(c.libelle) + " ligne " + (i + 1);
            if (c.type === "case") return '<td><input type="checkbox" data-col="' + c.cle + '" aria-label="' + nom + '"' + (x ? " checked" : "") + "></td>";
            if (c.type === "choix") return '<td><select data-col="' + c.cle + '" aria-label="' + nom + '">' + optionsHtml(typeof c.options === "function" ? c.options() : c.options, x) + "</select></td>";
            return '<td><input data-col="' + c.cle + '"' + (c.type === "nombre" ? ' type="number" min="0" data-nombre="1"' : "") + ' aria-label="' + nom + '" value="' + e(x == null ? "" : x) + '"></td>';
          }).join("") + '<td><button data-action="retirerLigne" data-tableau="' + chemin + '" data-ligne="' + i + '" aria-label="Retirer la ligne ' + (i + 1) + '">✕</button></td></tr>';
        }).join("") + "</tbody></table></div>" +
        '<button data-action="ajouterLigne" data-tableau="' + chemin + '">+ Ajouter une ligne</button>';
    }

    function photosHtml(photos, chemin, enLecture) {
      if (!photos.length) return enLecture ? '<p class="petit vide">Pas encore de photo.</p>' : "";
      return '<div class="photos">' + photos.map(function (p, i) {
        return '<figure><img data-photo-nom="' + e(p.nom) + '" alt="' + e(p.nomOrigine || "Photo") + '"><figcaption class="petit">' + e(p.nomOrigine || "") +
          (enLecture ? "" : ' <button data-action="retirerPhoto" data-chemin="' + chemin + '" data-index="' + i + '">Retirer</button>') + "</figcaption></figure>";
      }).join("") + "</div>";
    }

    // Lit le formulaire de l'onglet courant dans « travail ».
    function collecter() {
      if (lecture || !zone.querySelector(".fiche-onglet")) return;
      var v = JSON.parse(JSON.stringify(travail[courant] || fiche[courant] || {}));
      zone.querySelectorAll(".fiche-onglet [data-chemin]").forEach(function (champ) {
        var x = champ.getAttribute("data-case") ? champ.checked
          : champ.getAttribute("data-liste") ? champ.value.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean)
          : champ.getAttribute("data-nombre") ? (champ.value === "" ? null : Number(champ.value))
          : champ.value;
        F.ecrireChemin(v, champ.getAttribute("data-chemin"), x);
      });
      zone.querySelectorAll(".fiche-onglet [data-tableau]").forEach(function (table) {
        if (table.tagName !== "TABLE") return;
        var lignes = [].map.call(table.querySelectorAll("tbody tr"), function (tr) {
          var ligne = {};
          tr.querySelectorAll("[data-col]").forEach(function (c) {
            ligne[c.getAttribute("data-col")] = c.type === "checkbox" ? c.checked : c.getAttribute("data-nombre") ? (c.value === "" ? null : Number(c.value)) : c.value;
          });
          return ligne;
        });
        F.ecrireChemin(v, table.getAttribute("data-tableau"), lignes);
      });
      travail[courant] = v;
      modifies[courant] = JSON.stringify(v) !== JSON.stringify(fiche[courant]);
    }

    // --- Onglets particuliers ---

    function ongletMecanique() {
      var m = app.mecaniques[g.mecanique];
      var v = valeurDe("mecanique");
      if (!m) return '<p class="bandeau">Le professeur va attribuer une mécanique à ton groupe. Elle s\'affichera ici.</p>';
      function liste(x) { return x && x.length ? "<ul>" + x.map(function (t) { return "<li>" + avertir(t) + "</li>"; }).join("") + "</ul>" : ""; }
      var mat = m.materiel || {};
      var html = '<p class="petit">Mécanique attribuée par le professeur (elle ne se change pas ici).</p>' +
        "<h3>" + app.pastille(g.mecanique) + " " + e(m.nom) + "</h3>" + (m.resume ? "<p>" + avertir(m.resume) + "</p>" : "") +
        (m.etapesJoueur ? "<h4>Comment ça marche pour le joueur</h4><ol>" + m.etapesJoueur.map(function (t) { return "<li>" + avertir(t) + "</li>"; }).join("") + "</ol>" : "") +
        (m.aConcevoir ? "<h4>Ce que votre groupe doit concevoir</h4>" + liste(m.aConcevoir) : "") +
        (m.formatReponse ? "<h4>Format de la réponse</h4><p>" + avertir(m.formatReponse) + "</p>" : "") +
        ((mat.aCreer || mat.aTrouver || mat.fourni) ? "<h4>Matériel type</h4>" +
          (mat.aCreer ? "<p><strong>À créer :</strong></p>" + liste(mat.aCreer) : "") + (mat.aTrouver ? "<p><strong>À trouver :</strong></p>" + liste(mat.aTrouver) : "") +
          (mat.fourni ? "<p><strong>Fourni :</strong></p>" + liste(mat.fourni) : "") : "") +
        (m.pistesManuelles ? "<h4>Pistes manuelles (des idées, pas des obligations)</h4><ul>" + Object.keys(m.pistesManuelles).map(function (k) {
          return "<li><strong>" + e(k) + "</strong> : " + avertir(m.pistesManuelles[k]) + "</li>"; }).join("") + "</ul>" : "") +
        (m.pistesElectroniques ? "<h4>Pistes électroniques</h4>" + liste(m.pistesElectroniques) : "") +
        (m.pieges ? "<h4>Pièges fréquents</h4>" + liste(m.pieges) : "") +
        (m.indicesExemple ? "<h4>Exemple d'indices aux trois niveaux</h4><ol>" + ["niveau1", "niveau2", "niveau3"].map(function (n) {
          return "<li>" + avertir(m.indicesExemple[n] || "") + "</li>"; }).join("") + "</ol>" : "");
      if (lecture) return html;
      return html + '<label class="case"><input type="checkbox" data-chemin="compris" data-case="1"' + (v.compris ? " checked" : "") +
        "> Nous avons compris la mécanique</label>";
    }

    function avertir(texte) {
      var t = String(texte || "");
      return t.indexOf("⚠️") !== -1 ? '<span class="ecart">' + e(t.replace(/⚠️\s*/g, "")) + "</span>" : e(t);
    }

    function ongletIndices() {
      var v = valeurDe("indices");
      var html = '<p class="bandeau">Un indice aide, il ne dit jamais « c\'est faux ». Chaque niveau a une phrase courte à dire au talkie-walkie.</p>';
      NIVEAUX.forEach(function (niv) {
        html += '<fieldset class="carte-groupe"><legend>' + e(niv.titre) + '</legend><p class="petit">' + e(niv.consigne) + "</p>" +
          champHtml({ cle: "texte", type: "zone", libelle: "Indice", aide: "indices." + niv.n, lignes: 2 }, v, niv.n) +
          champHtml({ cle: "talkie", type: "texte", libelle: "Phrase à dire au talkie-walkie", aide: "indices." + niv.n + ".talkie" }, v, niv.n) + "</fieldset>";
      });
      var manques = F.manquesIndices(v);
      if (manques.length && !lecture) html += manques.map(function (m) { return '<p class="ecart">' + e(app.message(m.id, { niveau: m.niveau })) + "</p>"; }).join("");
      return html;
    }

    function ongletElectronique() {
      var v = valeurDe("electronique"), carte = v.carte || "uno", connus = composantsConnus();
      var choisis = (v.composants || []).map(function (id) { return connus[id]; }).filter(Boolean);
      var html = '<p class="bandeau">E1 : une carte, au moins un capteur et au moins un actionneur. L\'électronique doit être nécessaire au jeu : elle valide, déclenche ou révèle.</p>';
      if (lecture) {
        html += "<p><strong>Carte :</strong> " + (carte === "microbit" ? "micro:bit V2" : "Arduino Uno") + "</p>" +
          lectureHtml({ type: "zone", libelle: "Rôle dans l'énigme" }, v.role) +
          "<h4>Composants</h4>" + (choisis.length ? "<ul>" + choisis.map(function (c) { return "<li>" + e(c.nom) + " (" + e(c.type) + ")</li>"; }).join("") + "</ul>" : '<p class="petit vide">Pas encore choisis.</p>') +
          lectureHtml(colonnesBranchements(choisis), v.branchements) +
          "<p>" + (v.cableTeste ? "☑" : "☐") + " Câblé et testé · " + (v.programmeOk ? "☑" : "☐") + " Le programme fonctionne</p>";
        return html;
      }
      html += '<label for="f-carte">Carte</label><select id="f-carte" data-chemin="carte" data-recharger="1">' +
        optionsHtml([["uno", "Arduino Uno"], ["microbit", "micro:bit V2 (si l'énigme le justifie, à valider par le professeur)"]], carte) + "</select>" +
        champHtml({ cle: "role", type: "zone", libelle: "Rôle dans l'énigme : que valide, déclenche ou révèle-t-elle ?", lignes: 2 }, v);
      var proposes = Object.keys(connus).filter(function (id) {
        var c = connus[id];
        return (v.composants || []).indexOf(id) === -1 && (!c.integre || carte === "microbit");
      });
      html += "<h4>Atelier de câblage</h4>" +
        '<div class="ajout-composant"><label for="f-composant">Ajouter un composant</label><select id="f-composant">' +
        optionsHtml(proposes.map(function (id) { return [id, connus[id].nom + " (" + connus[id].type + ")"]; }), "") +
        '</select><button data-action="ajouterComposant">Ajouter</button></div>';
      html += choisis.map(function (c) {
        if (c.integre) return '<div class="composant"><h4>' + e(c.nom) + '</h4><p class="petit">Déjà sur la carte : pas de câblage. Compte-t-il pour E1 ? Le professeur le confirmera.</p>' +
          '<button data-action="retirerComposant" data-id="' + e(c.id) + '">Retirer</button></div>';
        // Une seule mention « à vérifier » par composant : les lignes encore vides de la fiche ne s'affichent pas.
        var aVerifier = JSON.stringify(c).indexOf("⚠️") !== -1;
        function connu(t) { return t && !/^\s*⚠️/.test(t); }
        var broches = (c.broches || []).filter(function (b) { return connu(b.nom); });
        var cablage = (c.cablageType || []).filter(connu), precautions = (c.precautions || []).filter(connu);
        return '<div class="composant"><h4>' + e(c.nom) + ' <span class="petit">· ' + e(c.type) + "</span></h4>" +
          (aVerifier ? '<p class="ecart">' + e(app.message("aVerifier")) + "</p>" : "") +
          (connu(c.tension) ? "<p><strong>Tension :</strong> " + avertir(c.tension) + "</p>" : "") +
          (broches.length ? "<p><strong>Broches :</strong></p><ul>" + broches.map(function (b) { return "<li>" + avertir(b.nom) + " : " + avertir(b.role) + "</li>"; }).join("") + "</ul>" : "") +
          (cablage.length ? "<p><strong>Câblage type :</strong></p><ul>" + cablage.map(function (t) { return "<li>" + avertir(t) + "</li>"; }).join("") + "</ul>" : "") +
          (precautions.length ? "<p><strong>Précautions :</strong></p><ul>" + precautions.map(function (t) { return "<li>" + avertir(t) + "</li>"; }).join("") + "</ul>" : "") +
          (c.source && /^https?:/.test(c.source) ? '<p class="petit"><a href="' + e(c.source) + '" target="_blank" rel="noopener noreferrer">Fiche du fabricant ↗</a></p>' : "") +
          '<button data-action="retirerComposant" data-id="' + e(c.id) + '">Retirer ce composant et ses fils</button></div>';
      }).join("");
      html += champHtml(colonnesBranchements(choisis), v);
      var controles = F.controlesCablage(carte, choisis, v.branchements || []);
      html += controles.map(function (x) {
        return '<p class="ecart' + (/^douzeVolts|^validationProf/.test(x.id) ? " securite" : "") + '">' + e(app.message(x.id, { broche: x.broche })) + "</p>";
      }).join("");
      html += champHtml({ cle: "tests", type: "zone", libelle: "Tests faits (ce qui marche, ce qui reste à régler)", lignes: 2 }, v) +
        champHtml({ cle: "boitier", type: "zone", libelle: "Boîtier : où va la carte, comment elle est protégée", lignes: 2 }, v) +
        champHtml({ cle: "cableTeste", type: "case", libelle: "Câblé et testé : le professeur peut valider" }, v) +
        champHtml({ cle: "validation", type: "validation", jalon: "cablage" }, v) +
        champHtml({ cle: "programmeOk", type: "case", libelle: "Le programme fonctionne" }, v) +
        '<p class="petit">Le programme Labo Blocs du groupe s\'ouvrira ici (étape 10 du projet).</p>';
      return html;
    }

    function colonnesBranchements(choisis) {
      var carte = (valeurDe("electronique").carte) || "uno";
      return { cle: "branchements", type: "tableau", libelle: "Tableau des branchements", colonnes: [
        { cle: "composant", libelle: "Composant", type: "choix", options: choisis.filter(function (c) { return !c.integre; }).map(function (c) { return [c.id, c.nom]; }) },
        { cle: "brocheComposant", libelle: "Broche du composant", type: "texte" },
        { cle: "brocheCarte", libelle: "→ Broche de la carte ou rail", type: "choix", options: F.BROCHES[carte].concat(["Rail + de la platine", "Rail − de la platine"]) },
        { cle: "fil", libelle: "Couleur du fil", type: "texte" },
        { cle: "verifie", libelle: "Vérifié", type: "case" }] };
    }

    async function ongletJournal() {
      var entrees = (await st.lister("journal")).filter(function (j) { return j.valeur.groupe === groupeId; })
        .sort(function (a, b) { return b.le - a.le; });
      var html = lecture ? "" : '<div class="carte-groupe"><h4>Nouvelle ligne</h4>' +
        '<label for="j-seance">Séance n°</label><input id="j-seance" type="number" min="1" max="20" value="' + e(seance || "") + '">' +
        '<label for="j-fait">Ce que nous avons fait</label><textarea id="j-fait" rows="2"></textarea>' +
        '<label for="j-bloque">Ce qui bloque (facultatif)</label><textarea id="j-bloque" rows="2"></textarea>' +
        '<div class="boutons"><button class="principal" data-action="ajouterJournal">Ajouter au journal</button></div></div>';
      html += entrees.length ? "<ul class=\"journal\">" + entrees.map(function (j) {
        return "<li><strong>Séance " + e(j.valeur.seance || "?") + "</strong> · " + e(O.nomAuteur(j.auteur)) + ", " + app.dateCourte(j.le) +
          "<br>" + e(j.valeur.fait) + (j.valeur.bloque ? '<br><span class="ecart">Bloque : ' + e(j.valeur.bloque) + "</span>" : "") + "</li>";
      }).join("") + "</ul>" : '<p class="petit">Pas encore de ligne dans le journal.</p>';
      return html;
    }

    async function ongletRemarques() {
      var r = (await st.lister("remarques")).filter(function (x) { return x.valeur.groupe === groupeId; }).sort(function (a, b) { return b.le - a.le; });
      return r.length ? r.map(function (x) { return '<div class="carte-groupe">' + O.miseEnForme(x.valeur.texte) + '<p class="petit">' + app.dateCourte(x.le) + "</p></div>"; }).join("")
        : '<p class="petit">Le professeur n\'a pas encore laissé de remarque.</p>';
    }

    // Avis visibles du groupe concerné et du professeur ; un autre groupe ne voit que les siens (brief §7.7).
    function avisHtml() {
      var visibles = options.autres && !et.prof ? avisRecus.filter(function (a) { return a.valeur.testeur === et.groupe; }) : avisRecus;
      if (!visibles.length) return '<p class="petit">Pas encore d\'avis de test croisé' + (options.autres ? " de ton groupe" : "") + ".</p>";
      return visibles.slice().sort(function (a, b) { return b.le - a.le; }).map(function (a) {
        var v = a.valeur;
        return '<div class="carte-groupe"><p><strong>Testé par le groupe ' + e(v.testeur) + "</strong> · " + app.dateCourte(a.le) +
          (v.duree ? " · " + e(v.duree) + " min" : "") + "</p>" +
          (v.marche ? "<p><strong>Ce qui a marché :</strong> " + e(v.marche) + "</p>" : "") +
          (v.bloque ? "<p><strong>Ce qui a bloqué :</strong> " + e(v.bloque) + "</p>" : "") +
          (v.suggestion ? "<p><strong>Suggestion :</strong> " + e(v.suggestion) + "</p>" : "") + "</div>";
      }).join("");
    }

    // --- Page ---

    async function contenuOnglet() {
      var o = ONGLETS.filter(function (x) { return x.id === courant; })[0];
      if (o.id === "mecanique") return ongletMecanique();
      if (o.id === "indices") return ongletIndices();
      if (o.id === "electronique") return ongletElectronique();
      if (o.id === "journal") return ongletJournal();
      if (o.id === "remarques") return ongletRemarques();
      var html = o.champs.map(function (c) { return champHtml(c, valeurDe(o.id)); }).join("");
      if (o.id === "tests") html = "<h4>Avis reçus</h4>" + avisHtml() + html;
      if (o.id === "enigme" && !lecture) {
        var en = valeurDe("enigme");
        if (!rempliTexte(en.solution)) html += '<p class="ecart">' + e(app.message("solutionManquante")) + "</p>";
        if (!rempliTexte(en.matiere)) html += '<p class="ecart">' + e(app.message("matiereManquante")) + "</p>";
        else if (String(en.lienMatiere || "").trim().length < 40) html += '<p class="ecart">' + e(app.message("lienMatiereTropCourt")) + "</p>";
        if (!rempliTexte(en.contenuBoite)) html += '<p class="ecart">' + e(app.message("contenuBoiteManquant")) + "</p>";
        if (en.duree > parEnigme + 3) html += '<p class="ecart">' + e(app.message("dureeEnigmeLongue", { minutes: parEnigme })) + "</p>";
      }
      return html;
    }

    function enteteJalons() {
      return '<div class="jalons" aria-label="Jalons du groupe">' + app.jalons().map(function (j) {
        var et2 = etatJalon(j.id), info = (g.jalons || {})[j.id] || {};
        var retard = seance && j.seance < seance && et2 !== "fait";
        return '<span class="jalon' + (retard ? " ecart-jalon" : "") + '" title="' + e(app.messageJalon(j.id, retard ? "enRetard" : et2) || j.nom) + '">' + SYMBOLES[et2] + " " + e(j.code || j.nom) +
          ' <span class="petit">' + e(j.code ? j.nom : "") + " · séance " + j.seance + (retard ? " · encore à faire" : "") + (info.valide ? " · ✓ validé" : "") + "</span></span>";
      }).join("") + "</div>";
    }

    async function afficher() {
      var m = app.mecaniques[g.mecanique];
      var html = (options.autres ? '<button data-action="retour">← Toutes les énigmes</button>' : "") +
        '<section class="carte"><h2>' + app.pastille(g.mecanique) + " " + e((fiche.enigme && fiche.enigme.titre) || g.nom || "Groupe " + groupeId) + "</h2>" +
        '<p class="petit">Groupe ' + e(groupeId) + " · " + e(m ? m.nom : "mécanique à attribuer") + "</p>" +
        (miroir ? '<p class="bandeau">Ce groupe travaille dans l\'autre dossier de l\'équipe : sa fiche se lit ici, elle se modifie là-bas.</p>' : "") +
        (options.autres ? '<p class="bandeau">Fiche d\'un autre groupe : lecture seule. Tu peux laisser un avis de test en bas de la page.</p>' : "") +
        enteteJalons() + "</section>";
      html += '<nav class="onglets" role="tablist">' + onglets.map(function (o) {
        var s = etatOnglet(o);
        return '<button role="tab" data-onglet="' + o.id + '" aria-selected="' + (o.id === courant) + '">' + (s ? SYMBOLES[s] + " " : "") + e(o.nom) +
          (modifies[o.id] ? " *" : "") + (s ? '<span class="cache-visuel"> : ' + s + "</span>" : "") + "</button>";
      }).join("") + "</nav>";
      html += '<section class="carte fiche-onglet" role="tabpanel">' + (await contenuOnglet());
      var o = ONGLETS.filter(function (x) { return x.id === courant; })[0];
      if (!lecture && o.id !== "journal" && o.id !== "remarques") {
        var el = elements[courant];
        html += '<div class="boutons enregistrer"><button class="principal" data-action="enregistrer">Enregistrer « ' + e(o.nom) + " »</button>" +
          (el ? '<span class="petit">Dernier enregistrement : ' + e(O.nomAuteur(el.auteur)) + ", " + app.dateCourte(el.le) + "</span>" : "") + "</div>";
      }
      html += '<p class="message-fiche" role="status">' + message + "</p></section>";
      if (options.autres) html += formulaireAvis();
      zone.innerHTML = html;
      chargerPhotos();
    }

    function formulaireAvis() {
      if (groupeId === et.groupe) return "";
      return '<section class="carte formulaire"><h3>Avis de test croisé (groupe ' + e(et.groupe) + ")</h3>" +
        '<label for="a-marche">Ce qui a marché</label><textarea id="a-marche" rows="2"></textarea>' +
        '<label for="a-bloque">Ce qui a bloqué</label><textarea id="a-bloque" rows="2"></textarea>' +
        '<label for="a-duree">Durée pour résoudre (minutes)</label><input id="a-duree" type="number" min="1" max="60">' +
        '<label for="a-suggestion">Une suggestion pour l\'améliorer</label><textarea id="a-suggestion" rows="2"></textarea>' +
        '<div class="boutons"><button class="principal" data-action="envoyerAvis">Laisser l\'avis</button></div>' +
        '<p class="message-avis" role="status"></p></section>';
    }

    async function chargerPhotos() {
      var images = zone.querySelectorAll("img[data-photo-nom]");
      for (var i = 0; i < images.length; i++) {
        var contenu = await st.lireFichier("fiches", images[i].getAttribute("data-photo-nom"));
        if (!contenu) { images[i].replaceWith(Object.assign(document.createElement("span"), { className: "petit", textContent: "Photo pas encore dans ce dossier." })); continue; }
        var a = URL.createObjectURL(contenu instanceof Blob ? contenu : new Blob([contenu]));
        adresses.push(a);
        images[i].src = a;
      }
    }

    // --- Enregistrements ---

    // Écrit un élément en reprenant la version du dossier si elle a changé entre-temps (fusion, rien n'est perdu).
    async function enregistrerFusion(collection, id, base, mien) {
      for (var essai = 0; essai < 3; essai++) {
        var actuel = await st.lire(collection, id);
        var f = actuel ? F.fusionner(base, actuel.valeur, mien) : { valeur: mien, signales: [] };
        var r = await st.enregistrer(collection, id, f.valeur, actuel ? actuel.vid : null, app.auteur());
        if (r.ok) return { element: r.element, signales: f.signales, fusion: !!actuel && actuel.vid !== (elements[courant] || {}).vid };
      }
      throw new Error("la fiche change trop souvent en ce moment, réessaie dans un instant");
    }

    async function majJalonsGroupe() {
      var calc = jalonsCalcules();
      for (var essai = 0; essai < 3; essai++) {
        var actuel = await st.lire("groupes", groupeId), v = Object.assign({}, actuel ? actuel.valeur : {});
        v.jalons = Object.assign({}, v.jalons || {});
        Object.keys(calc).forEach(function (id) {
          var ancien = v.jalons[id];
          v.jalons[id] = { etat: calc[id], valide: !!(ancien && ancien.valide) };
        });
        if (fiche.enigme && rempliTexte(fiche.enigme.titre)) v.nom = fiche.enigme.titre;
        if (!v.depotOrigine && et.equipe.depots.length > 1) v.depotOrigine = et.depot;
        var r = await st.enregistrer("groupes", groupeId, v, actuel ? actuel.vid : null, app.auteur());
        if (r.ok) { g = r.element.valeur; return; }
      }
    }

    async function enregistrerOnglet() {
      collecter();
      var r = await enregistrerFusion("fiches", groupeId + "-" + courant, bases[courant], travail[courant]);
      elements[courant] = r.element;
      fiche[courant] = r.element.valeur;
      bases[courant] = JSON.parse(JSON.stringify(r.element.valeur));
      delete travail[courant];
      modifies[courant] = false;
      await majJalonsGroupe();
      message = "Enregistré." + (r.fusion ? " Un autre membre du groupe avait enregistré entre-temps : ses changements sont gardés." : "") +
        (r.signales.length ? ' <span class="ecart">Cette partie avait aussi été changée par un autre membre : ' + e(r.signales.join(", ")) + ". Son ancienne version reste dans l'historique.</span>" : "");
    }

    zone.addEventListener("click", async function (ev) {
      var b = ev.target.closest("button");
      if (!b) return;
      var onglet = b.getAttribute("data-onglet"), action = b.getAttribute("data-action");
      if (!onglet && !action) return;
      collecter();
      message = "";
      try {
        if (onglet) { courant = onglet; montrerSolution = false; }
        else if (action === "retour") { options.retour(); return; }
        else if (action === "montrerSolution") montrerSolution = true;
        else if (action === "enregistrer") { b.disabled = true; await enregistrerOnglet(); }
        else if (action === "ajouterLigne" || action === "retirerLigne") {
          var chemin = b.getAttribute("data-tableau"), v = travail[courant], lignes = (F.lireChemin(v, chemin) || []).slice();
          if (action === "ajouterLigne") lignes.push({}); else lignes.splice(Number(b.getAttribute("data-ligne")), 1);
          F.ecrireChemin(v, chemin, lignes);
          modifies[courant] = true;
        } else if (action === "ajouterComposant") {
          var id = zone.querySelector("#f-composant").value, connus = composantsConnus();
          if (!id) return;
          var ve = travail.electronique;
          ve.composants = (ve.composants || []).concat(id);
          if (!connus[id].integre) {
            var broches = (connus[id].broches || []).length ? connus[id].broches : [{ nom: "" }];
            ve.branchements = (ve.branchements || []).concat(broches.map(function (br) {
              return { composant: id, brocheComposant: /⚠️/.test(br.nom) ? "" : br.nom, brocheCarte: "", fil: "", verifie: false };
            }));
          }
          modifies.electronique = true;
        } else if (action === "retirerComposant") {
          var idr = b.getAttribute("data-id"), vr = travail.electronique;
          vr.composants = (vr.composants || []).filter(function (x) { return x !== idr; });
          vr.branchements = (vr.branchements || []).filter(function (x) { return x.composant !== idr; });
          modifies.electronique = true;
        } else if (action === "retirerPhoto") {
          var cp = b.getAttribute("data-chemin"), photos = (F.lireChemin(travail[courant], cp) || []).slice();
          photos.splice(Number(b.getAttribute("data-index")), 1);
          F.ecrireChemin(travail[courant], cp, photos);
          modifies[courant] = true;
        } else if (action === "ajouterJournal") {
          var fait = zone.querySelector("#j-fait").value.trim();
          if (!fait) { message = '<span class="ecart">Écris ce que le groupe a fait pendant la séance.</span>'; return afficher(); }
          await st.enregistrer("journal", groupeId + "-" + Date.now().toString(36), { groupe: groupeId, seance: Number(zone.querySelector("#j-seance").value) || null,
            fait: fait, bloque: zone.querySelector("#j-bloque").value.trim() }, null, app.auteur());
          message = "Ajouté au journal.";
        } else if (action === "envoyerAvis") {
          var avis = { cible: groupeId, testeur: et.groupe, marche: zone.querySelector("#a-marche").value.trim(), bloque: zone.querySelector("#a-bloque").value.trim(),
            duree: Number(zone.querySelector("#a-duree").value) || null, suggestion: zone.querySelector("#a-suggestion").value.trim() };
          if (!avis.marche && !avis.bloque && !avis.suggestion) { zone.querySelector(".message-avis").innerHTML = '<span class="ecart">Écris au moins ce qui a marché ou ce qui a bloqué.</span>'; return; }
          var r = await st.enregistrer("avis", groupeId + "-" + et.groupe + "-" + Date.now().toString(36), avis, null, app.auteur());
          avisRecus.push(r.element);
          await afficher();
          zone.querySelector(".message-avis").textContent = "Merci : ton avis est visible par le groupe " + groupeId + " et par le professeur.";
          return;
        } else return;
      } catch (err) {
        message = '<span class="ecart">L\'enregistrement n\'a pas pu se faire (' + e(err.message) + "). Tes changements sont toujours là : vérifie la connexion au réseau du collège, puis réessaie.</span>";
      }
      await afficher();
    });

    zone.addEventListener("change", async function (ev) {
      var t = ev.target;
      if (t.getAttribute("data-recharger")) { collecter(); await afficher(); return; }
      var chemin = t.getAttribute("data-photo");
      if (!chemin || !t.files[0]) return;
      collecter();
      var fichier = t.files[0];
      if (!/^image\//.test(fichier.type)) { message = '<span class="ecart">Choisis une image (photo ou schéma).</span>'; return afficher(); }
      if (fichier.size > 10 * 1024 * 1024) { message = '<span class="ecart">Cette photo fait ' + O.tailleLisible(fichier.size) + " : 10 Mo au plus. Réduis-la.</span>"; return afficher(); }
      var nom = O.nomFichierStocke(groupeId + "-" + Date.now().toString(36), fichier.name);
      try {
        await st.ecrireFichier("fiches", nom, fichier);
        F.ecrireChemin(travail[courant], chemin, (F.lireChemin(travail[courant], chemin) || []).concat({ nom: nom, nomOrigine: fichier.name }));
        modifies[courant] = true;
        message = "Photo ajoutée : pense à enregistrer.";
      } catch (err) {
        message = '<span class="ecart">La photo n\'a pas pu être copiée (' + e(err.message) + ").</span>";
      }
      afficher();
    });
    zone.addEventListener("input", function (ev) {
      if (lecture || !ev.target.closest(".fiche-onglet")) return;
      if (!modifies[courant]) { modifies[courant] = true; var bouton = zone.querySelector('[data-onglet="' + courant + '"]'); if (bouton) bouton.textContent += " *"; }
    });

    function avantDeQuitter(ev) {
      collecter();
      if (Object.keys(modifies).some(function (k) { return modifies[k]; })) { ev.preventDefault(); ev.returnValue = ""; }
    }
    racine.addEventListener("beforeunload", avantDeQuitter);

    await afficher();
    return function () {
      racine.removeEventListener("beforeunload", avantDeQuitter);
      adresses.forEach(function (a) { URL.revokeObjectURL(a); });
    };
  }

  // --- Pages ---

  racine.EscapeLab.pages.enigme = async function (zone) {
    zone.innerHTML = '<p class="petit">Lecture de la fiche…</p>';
    return afficherFiche(zone, racine.EscapeLab.etat.groupe, {});
  };

  racine.EscapeLab.pages.autres = async function (zone) {
    var app = racine.EscapeLab, et = app.etat, arreter = null;
    async function liste() {
      if (arreter) { arreter(); arreter = null; }
      zone.innerHTML = '<p class="petit">Lecture du dossier…</p>';
      var groupes = {};
      (await et.stockage.lister("groupes")).forEach(function (g) { groupes[g.id] = g; });
      var reglages = await et.stockage.lire("equipe", "reglages");
      var seance = reglages && reglages.valeur.seanceActuelle;
      zone.innerHTML = '<p class="bandeau">Les énigmes des autres groupes de la classe, en lecture seule. Après un test croisé, laisse un avis au groupe.</p><div class="grille">' +
        idsGroupes().filter(function (id) { return id !== et.groupe; }).map(function (id) {
          var v = groupes[id] ? groupes[id].valeur : {}, m = app.mecaniques[v.mecanique], av = app.avancement(v, seance);
          return '<article class="carte groupe"><h3>' + app.pastille(v.mecanique) + " " + e(v.nom || "Groupe " + id) + "</h3>" +
            '<p class="petit">Groupe ' + e(id) + " · " + e(m ? m.nom : "mécanique à attribuer") + "</p><p>" + av.pourcent + " % des jalons faits</p>" +
            '<button data-ouvrir="' + e(id) + '">Ouvrir la fiche</button></article>';
        }).join("") + "</div>";
    }
    zone.addEventListener("click", async function (ev) {
      var b = ev.target.closest("button[data-ouvrir]");
      if (!b) return;
      var sousZone = document.createElement("div");
      zone.innerHTML = "";
      zone.appendChild(sousZone);
      arreter = await afficherFiche(sousZone, b.getAttribute("data-ouvrir"), { lecture: true, autres: true, retour: liste });
    });
    await liste();
    return function () { if (arreter) arreter(); };
  };
})(this);
