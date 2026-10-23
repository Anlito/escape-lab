// Page Bibliothèque commune (brief §7.5) : notes, documents (image, PDF, audio, vidéo) et liens, modifiables par toute
// la classe. Un élément du stockage par entrée (collection « bibliotheque »), le fichier dans bibliotheque/fichiers/.
// Supprimer = mettre à la corbeille (restaurable) ; chaque modification reste dans l'historique.
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, e = O.echapper;
  var TYPES = { note: "Note", document: "Document", lien: "Lien" };
  var GENRES = { image: "Image", pdf: "PDF", audio: "Audio", video: "Vidéo" };
  var ACCEPTES = "image/*,application/pdf,audio/*,video/*";
  var TAILLE_MAX_MO = 20;   // par défaut (question 13 du brief), réglable dans equipe/reglages.tailleMaxMo

  racine.EscapeLab.pages.bibliotheque = async function (zone) {
    var app = racine.EscapeLab, et = app.etat, st = et.stockage;
    var elements = [], filtres = { recherche: "", type: "", etiquette: "", groupe: "", corbeille: false };
    var formulaire = null;           // { type, element? } quand on ajoute ou modifie
    var ouverts = {};                // id -> "apercu" | "historique"
    var adresses = [];               // adresses d'aperçu à libérer en quittant la page
    var reglages = await st.lire("equipe", "reglages");
    var tailleMax = ((reglages && reglages.valeur.tailleMaxMo) || TAILLE_MAX_MO) * 1024 * 1024;
    var groupes = app.lettresGroupes(app.nombreGroupes());

    function nouvelId() { return "b" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }

    async function relire() { elements = await st.lister("bibliotheque"); }

    function message(texte, ecart) {
      var m = zone.querySelector("#messageBiblio");
      m.textContent = texte;
      m.className = ecart ? "bandeau ecart" : "bandeau";
      m.hidden = !texte;
    }

    // --- Affichage ---

    function barre() {
      var etiquettes = O.etiquettesDe(elements);
      var nbCorbeille = elements.filter(function (el) { return el.valeur.corbeille; }).length;
      return '<section class="carte"><div class="boutons">' +
        '<button class="principal" data-action="ajouter" data-type="note">+ Note</button>' +
        '<button class="principal" data-action="ajouter" data-type="document">+ Document</button>' +
        '<button class="principal" data-action="ajouter" data-type="lien">+ Lien</button></div>' +
        '<div class="filtres">' +
        '<label>Chercher<input id="fRecherche" type="search" value="' + e(filtres.recherche) + '" placeholder="Titre, texte, étiquette…"></label>' +
        '<label>Type<select id="fType"><option value="">Tous</option>' + Object.keys(TYPES).map(function (t) {
          return '<option value="' + t + '"' + (filtres.type === t ? " selected" : "") + ">" + TYPES[t] + "</option>"; }).join("") + "</select></label>" +
        '<label>Étiquette<select id="fEtiquette"><option value="">Toutes</option>' + etiquettes.map(function (t) {
          return '<option' + (filtres.etiquette === t ? " selected" : "") + ">" + e(t) + "</option>"; }).join("") + "</select></label>" +
        '<label>Groupe<select id="fGroupe"><option value="">Tous</option>' + groupes.map(function (g) {
          return '<option value="' + g + '"' + (filtres.groupe === g ? " selected" : "") + ">Groupe " + g + "</option>"; }).join("") + "</select></label>" +
        '<label class="case"><input type="checkbox" id="fCorbeille"' + (filtres.corbeille ? " checked" : "") + "> Corbeille (" + nbCorbeille + ")</label>" +
        "</div></section>";
    }

    function champsFormulaire() {
      var type = formulaire.type, v = formulaire.element ? formulaire.element.valeur : {};
      var etiquettes = v.etiquettes || [];
      var autres = etiquettes.filter(function (t) { return O.ETIQUETTES_SUGGEREES.indexOf(t) === -1; });
      var html = '<section class="carte formulaire"><h3>' + (formulaire.element ? "Modifier : " : "Ajouter : ") + TYPES[type].toLowerCase() + "</h3>" +
        '<label for="bTitre">Titre</label><input id="bTitre" maxlength="80" value="' + e(v.titre || "") + '">';
      if (type === "note") html += '<label for="bTexte">Texte</label><textarea id="bTexte" rows="5">' + e(v.texte || "") + "</textarea>";
      if (type === "lien") html += '<label for="bUrl">Adresse du lien</label><input id="bUrl" type="url" placeholder="https://www.canva.com/…" value="' + e(v.url || "") + '">' +
        '<label for="bTexte">À quoi il sert (facultatif)</label><textarea id="bTexte" rows="2">' + e(v.texte || "") + "</textarea>";
      if (type === "document") {
        if (formulaire.element) html += '<p class="petit">Fichier : ' + e(v.fichier.nomOrigine) + " (" + O.tailleLisible(v.fichier.taille) + "). Pour un autre fichier, ajoute un nouveau document.</p>";
        else html += '<label for="bFichier">Fichier (image, PDF, audio, vidéo courte ; ' + Math.round(tailleMax / 1024 / 1024) + ' Mo au plus)</label><input id="bFichier" type="file" accept="' + ACCEPTES + '">';
        html += '<label for="bTexte">Description (facultative)</label><textarea id="bTexte" rows="2">' + e(v.texte || "") + "</textarea>";
      }
      html += "<fieldset><legend>Étiquettes</legend>" + O.ETIQUETTES_SUGGEREES.map(function (t) {
          return '<label class="case"><input type="checkbox" name="bEtiq" value="' + e(t) + '"' + (etiquettes.indexOf(t) !== -1 ? " checked" : "") + "> " + e(t) + "</label>";
        }).join("") +
        '<label for="bAutres">Autres étiquettes, séparées par des virgules</label><input id="bAutres" value="' + e(autres.join(", ")) + '"></fieldset>' +
        '<label for="bGroupe">Groupe concerné (facultatif)</label><select id="bGroupe"><option value="">Toute la classe</option>' +
        groupes.map(function (g) { return '<option value="' + g + '"' + (v.groupe === g ? " selected" : "") + ">Groupe " + g + "</option>"; }).join("") + "</select>" +
        '<p id="erreurForm" class="ecart" role="alert" hidden></p>' +
        '<div class="boutons"><button class="principal" data-action="valider">Enregistrer</button><button data-action="fermerForm">Annuler</button></div></section>';
      return html;
    }

    function carte(el) {
      var v = el.valeur, genre = v.fichier ? O.genreDeFichier(v.fichier.type) : "";
      var nature = v.type === "document" ? (GENRES[genre] || "Document") : TYPES[v.type];
      var html = '<article class="carte element-biblio" data-id="' + e(el.id) + '">' +
        '<p class="nature">' + e(nature) + (v.groupe ? " · groupe " + e(v.groupe) : "") + "</p>" +
        "<h3>" + e(v.titre || "Sans titre") + "</h3>";
      if (v.type === "note") html += O.miseEnForme(v.texte);
      else if (v.texte) html += '<p class="petit">' + e(v.texte) + "</p>";
      if (v.type === "lien" && O.lienValide(v.url)) html += '<p><a href="' + e(v.url) + '" target="_blank" rel="noopener noreferrer">Ouvrir le lien ↗</a> <span class="petit">' + e(v.url.replace(/^https?:\/\//, "").slice(0, 40)) + "</span></p>";
      if (v.fichier) html += '<p class="petit">' + e(v.fichier.nomOrigine) + " · " + O.tailleLisible(v.fichier.taille) + "</p>";
      if ((v.etiquettes || []).length) html += "<p>" + v.etiquettes.map(function (t) { return '<span class="etiquette">' + e(t) + "</span>"; }).join(" ") + "</p>";
      html += '<p class="petit">Ajouté ou modifié par ' + e(O.nomAuteur(el.auteur)) + " le " + app.dateCourte(el.le) + "</p>";
      if (ouverts[el.id] === "apercu") html += '<div class="apercu" data-apercu="' + e(el.id) + '"><p class="petit">Ouverture du fichier…</p></div>';
      if (ouverts[el.id] === "historique") html += '<div class="historique-biblio" data-historique="' + e(el.id) + '"><p class="petit">Lecture de l\'historique…</p></div>';
      html += '<div class="boutons">' +
        (v.fichier && genre ? '<button data-action="apercu">' + (ouverts[el.id] === "apercu" ? "Fermer l'aperçu" : "Aperçu") + "</button>" : "") +
        (v.fichier ? '<button data-action="telecharger">Ouvrir</button>' : "") +
        (v.corbeille ? '<button data-action="restaurerCorbeille">Sortir de la corbeille</button>'
          : '<button data-action="modifier">Modifier</button><button data-action="corbeille">Mettre à la corbeille</button>') +
        '<button data-action="historique">' + (ouverts[el.id] === "historique" ? "Fermer l'historique" : "Historique") + "</button></div></article>";
      return html;
    }

    function afficher() {
      var liste = O.filtrerBibliotheque(elements, filtres);
      var focus = document.activeElement && document.activeElement.id;
      zone.innerHTML = '<p class="bandeau">La bibliothèque est commune à toute la classe : sons, images, idées, liens Canva ou Tinkercad… Rien n\'est supprimé : la corbeille se restaure.</p>' +
        '<p id="messageBiblio" role="status" hidden></p>' + barre() + (formulaire ? champsFormulaire() : "") +
        (liste.length ? '<div class="grille">' + liste.map(carte).join("") + "</div>"
          : '<p class="petit">' + (filtres.corbeille ? "La corbeille est vide." : elements.length ? "Rien ne correspond à ta recherche." : "La bibliothèque est encore vide : ajoute la première note, le premier document ou le premier lien.") + "</p>");
      if (focus === "fRecherche") { var r = zone.querySelector("#fRecherche"); r.focus(); r.selectionStart = r.selectionEnd = r.value.length; }
      Object.keys(ouverts).forEach(function (id) {
        if (ouverts[id] === "apercu") remplirApercu(id);
        if (ouverts[id] === "historique") remplirHistorique(id);
      });
    }

    async function adresseFichier(el) {
      var contenu = await st.lireFichier("bibliotheque", el.valeur.fichier.nom);
      if (!contenu) return null;
      var blob = contenu instanceof Blob ? contenu : new Blob([contenu], { type: el.valeur.fichier.type });
      var adresse = URL.createObjectURL(blob);
      adresses.push(adresse);
      return adresse;
    }

    async function remplirApercu(id) {
      var el = trouver(id), boite = zone.querySelector('[data-apercu="' + id + '"]');
      if (!el || !boite) return;
      var adresse = await adresseFichier(el);
      if (!adresse) { boite.innerHTML = '<p class="ecart">Le fichier n\'est pas (encore) dans ce dossier. Pour l\'équipe 3C2D1, il arrive après la synchronisation.</p>'; return; }
      var genre = O.genreDeFichier(el.valeur.fichier.type), titre = e(el.valeur.titre || "");
      boite.innerHTML = genre === "image" ? '<img src="' + adresse + '" alt="' + titre + '">'
        : genre === "pdf" ? '<iframe src="' + adresse + '" title="' + titre + '"></iframe>'
        : genre === "audio" ? '<audio controls src="' + adresse + '"></audio>'
        : '<video controls src="' + adresse + '"></video>';
    }

    async function remplirHistorique(id) {
      var boite = zone.querySelector('[data-historique="' + id + '"]'), el = trouver(id);
      if (!boite) return;
      var versions = await st.historique("bibliotheque", id);
      boite.innerHTML = versions.slice().reverse().map(function (v) {
        var actuelle = el && v.vid === el.vid;
        return '<p class="petit">' + app.dateCourte(v.le) + " · " + e(O.nomAuteur(v.auteur)) + " · « " + e(v.valeur.titre || "") + " »" +
          (v.valeur.corbeille ? " (corbeille)" : "") + (actuelle ? " · version actuelle" : ' <button data-action="restaurerVersion" data-vid="' + e(v.vid) + '">Restaurer</button>') + "</p>";
      }).join("");
    }

    function trouver(id) { return elements.filter(function (el) { return el.id === id; })[0]; }

    // --- Enregistrement : en cas de modification simultanée, les deux versions sont réunies ---

    async function enregistrer(id, valeur, vid) {
      var r = await st.enregistrer("bibliotheque", id, valeur, vid, app.auteur()), reunies = false;
      if (!r.ok && r.actuel) {
        r = await st.enregistrer("bibliotheque", id, O.fusionnerElementBiblio(r.actuel.valeur, valeur), r.actuel.vid, app.auteur());
        reunies = true;
      }
      if (!r.ok) throw new Error("l'élément a encore changé, réessaie");
      return reunies;
    }
    var REUNIES = " Quelqu'un l'avait modifié en même temps : les deux versions sont réunies.";

    async function valider() {
      var f = zone.querySelector(".formulaire"), erreur = f.querySelector("#erreurForm");
      function refuser(t) { erreur.textContent = t; erreur.hidden = false; }
      var type = formulaire.type, ancien = formulaire.element;
      var valeur = Object.assign({}, ancien ? ancien.valeur : { type: type });
      valeur.titre = f.querySelector("#bTitre").value.trim();
      var texte = f.querySelector("#bTexte"); valeur.texte = texte ? texte.value.trim() : "";
      var coches = [].map.call(f.querySelectorAll('input[name="bEtiq"]:checked'), function (c) { return c.value; });
      valeur.etiquettes = O.lireEtiquettes(coches.concat(O.lireEtiquettes(f.querySelector("#bAutres").value)).join(","));
      valeur.groupe = f.querySelector("#bGroupe").value;
      if (type === "lien") {
        valeur.url = f.querySelector("#bUrl").value.trim();
        if (!O.lienValide(valeur.url)) return refuser("L'adresse doit commencer par https:// (copie-la depuis la barre d'adresse).");
      }
      var fichier = null;
      if (type === "document" && !ancien) {
        fichier = f.querySelector("#bFichier").files[0];
        if (!fichier) return refuser("Choisis le fichier à ajouter.");
        if (!O.genreDeFichier(fichier.type)) return refuser("Ce type de fichier ne s'affiche pas ici : image, PDF, audio ou vidéo seulement.");
        if (fichier.size > tailleMax) return refuser("Ce fichier fait " + O.tailleLisible(fichier.size) + " : " + Math.round(tailleMax / 1024 / 1024) + " Mo au plus. Raccourcis la vidéo ou réduis l'image.");
        if (!valeur.titre) valeur.titre = fichier.name.replace(/\.[^.]+$/, "");
      }
      if (type === "note" && !valeur.texte && !valeur.titre) return refuser("Écris au moins un titre ou un texte.");
      if (!valeur.titre) return refuser("Donne un titre pour qu'on retrouve l'élément.");
      var id = ancien ? ancien.id : nouvelId();
      if (fichier) {
        var nom = O.nomFichierStocke(id, fichier.name);
        message("Copie du fichier dans le dossier de la classe…");
        await st.ecrireFichier("bibliotheque", nom, fichier);
        valeur.fichier = { nom: nom, nomOrigine: fichier.name, taille: fichier.size, type: fichier.type };
      }
      var reunies = await enregistrer(id, valeur, ancien ? ancien.vid : null);
      formulaire = null;
      await relire();
      afficher();
      message((ancien ? "Modification enregistrée." : "Ajouté à la bibliothèque.") + (reunies ? REUNIES : ""));
    }

    // --- Actions ---

    zone.addEventListener("click", async function (ev) {
      var b = ev.target.closest("button[data-action]");
      if (!b) return;
      var action = b.getAttribute("data-action"), article = b.closest("[data-id]"), id = article && article.getAttribute("data-id");
      var el = id && trouver(id);
      b.disabled = true;
      try {
        if (action === "ajouter") { formulaire = { type: b.getAttribute("data-type") }; afficher(); zone.querySelector("#bTitre").focus(); return; }
        if (action === "fermerForm") { formulaire = null; afficher(); return; }
        if (action === "valider") return await valider();
        if (action === "modifier") { formulaire = { type: el.valeur.type, element: el }; afficher(); zone.querySelector(".formulaire").scrollIntoView(); return; }
        if (action === "apercu" || action === "historique") {
          ouverts[id] = ouverts[id] === action ? undefined : action; afficher(); return;
        }
        if (action === "telecharger") {
          var adresse = await adresseFichier(el);
          if (adresse) racine.open(adresse, "_blank", "noopener");
          else message("Le fichier n'est pas (encore) dans ce dossier.", true);
          return;
        }
        if (action === "corbeille" || action === "restaurerCorbeille") {
          var fusion = await enregistrer(id, Object.assign({}, el.valeur, { corbeille: action === "corbeille" }), el.vid);
          await relire(); afficher();
          message((action === "corbeille" ? "« " + el.valeur.titre + " » est dans la corbeille. Coche « Corbeille » pour le retrouver." : "« " + el.valeur.titre + " » est de retour dans la bibliothèque.") + (fusion ? REUNIES : ""));
          return;
        }
        if (action === "restaurerVersion") {
          await st.restaurer("bibliotheque", id, b.getAttribute("data-vid"), app.auteur());
          await relire(); afficher(); message("Ancienne version restaurée (une nouvelle version a été créée).");
        }
      } catch (err) {
        message("L'opération n'a pas pu se faire (" + err.message + "). Vérifie la connexion au réseau du collège, puis réessaie.", true);
      } finally {
        if (b.isConnected) b.disabled = false;
      }
    });

    zone.addEventListener("input", function (ev) {
      if (ev.target.id === "fRecherche") { filtres.recherche = ev.target.value; afficher(); }
    });
    zone.addEventListener("change", function (ev) {
      var t = ev.target;
      if (t.id === "fType") filtres.type = t.value;
      else if (t.id === "fEtiquette") filtres.etiquette = t.value;
      else if (t.id === "fGroupe") filtres.groupe = t.value;
      else if (t.id === "fCorbeille") filtres.corbeille = t.checked;
      else return;
      afficher();
    });

    await relire();
    afficher();

    // Relecture régulière du dossier, sauf pendant une saisie ou un aperçu ouvert.
    var minuterie = setInterval(async function () {
      if (formulaire || Object.keys(ouverts).some(function (id) { return ouverts[id]; }) || document.activeElement && document.activeElement.id === "fRecherche") return;
      var avant = elements.map(function (el) { return el.vid; }).join();
      try { await relire(); } catch (err) { return; }
      if (elements.map(function (el) { return el.vid; }).join() !== avant) afficher();
    }, 20000);

    return function () {
      clearInterval(minuterie);
      adresses.forEach(function (a) { URL.revokeObjectURL(a); });
    };
  };
})(this);
