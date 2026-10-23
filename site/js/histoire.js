// Page Histoire (brief §7.3) en storyboard : le titre, puis six moments comme les cases d'une bande dessinée, chacun
// avec son image et son texte. Toute la classe modifie ; chaque enregistrement est gardé dans l'historique.
// Texte : histoire/<section> (carte modifiable). Image : histoire-images/<section> (à part, pour ne jamais gêner
// quelqu'un qui écrit le texte), fichier dans histoire/fichiers/ ou repris de la bibliothèque commune.
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, Ed = racine.EscapeLabEditeur, e = O.echapper;
  var TAILLE_MAX = 8 * 1024 * 1024;

  var TITRE = { id: "titre", titre: "Titre de l'escape game", lignes: 1, aide: "Le nom de votre escape game." };
  var CASES = [
    { id: "theme", titre: "Le thème", lignes: 2, aide: "L'univers en une phrase : où, quand, quelle ambiance ?" },
    { id: "pitch", titre: "La mission", lignes: 3, aide: "Ce qu'on raconte aux joueurs au début : la mission et le temps." },
    { id: "personnages", titre: "Les personnages", lignes: 3, aide: "Qui sont les joueurs ? Qui les aide ou les gêne ?" },
    { id: "lieu", titre: "Le lieu", lignes: 2, aide: "Ce que représente le foyer dans l'histoire." },
    { id: "deroulement", titre: "Le déroulement", lignes: 4, aide: "Les grandes étapes, dans l'ordre de la frise." },
    { id: "fin", titre: "La fin", lignes: 3, aide: "Comment l'histoire se termine quand les joueurs réussissent." }
  ];

  racine.EscapeLab.pages.histoire = async function (zone) {
    var app = racine.EscapeLab, st = app.etat.stockage, adresses = [];
    zone.innerHTML = '<p class="petit">Lecture du dossier…</p>';

    function carteTexte(s) {
      return Ed.creerCarte({ collection: "histoire", id: s.id, titre: s.titre,
        champs: [{ cle: "texte", libelle: s.titre, aide: s.aide, idAide: "histoire." + s.id, lignes: s.lignes }] });
    }
    var titre = carteTexte(TITRE), cartes = [titre].concat(CASES.map(carteTexte));
    var imagesBiblio = (await st.lister("bibliotheque")).filter(function (b) {
      return !b.valeur.corbeille && b.valeur.fichier && O.genreDeFichier(b.valeur.fichier.type) === "image";
    });
    var groupes = await st.lister("groupes");
    var roles = groupes.filter(function (g) { return g.valeur.enigme && g.valeur.enigme.roleHistoire; });

    zone.innerHTML = '<p class="bandeau">L\'histoire est écrite par toute la classe, en six moments. Ajoute une image à chaque case : un dessin, une photo du décor, une image de la bibliothèque. Tout est gardé dans l\'historique.</p>';
    titre.noeud.classList.add("titre-histoire");
    zone.appendChild(titre.noeud);

    var grille = document.createElement("div");
    grille.className = "storyboard";
    zone.appendChild(grille);
    var zonesImages = {};
    CASES.forEach(function (s, i) {
      var article = document.createElement("article");
      article.className = "case-histoire";
      article.innerHTML = '<div class="image-case" data-image="' + s.id + '"><span class="numero-case">' + (i + 1) + "</span></div>";
      article.appendChild(cartes[i + 1].noeud);
      grille.appendChild(article);
      zonesImages[s.id] = article.querySelector(".image-case");
    });

    // --- Images des cases ---

    async function adresse(fichier) {
      var contenu = await st.lireFichier(fichier.collection || "histoire", fichier.nom);
      if (!contenu) return null;
      var a = URL.createObjectURL(contenu instanceof Blob ? contenu : new Blob([contenu], { type: fichier.type || "image/png" }));
      adresses.push(a);
      return a;
    }

    async function afficherImage(id, message) {
      var boite = zonesImages[id], el = await st.lire("histoire-images", id), v = el ? el.valeur : {};
      var numero = boite.querySelector(".numero-case").outerHTML, a = v.fichier ? await adresse(v.fichier) : null;
      var choix = imagesBiblio.length ? '<select data-depuis-biblio="' + id + '" aria-label="Image de la bibliothèque"><option value="">Depuis la bibliothèque…</option>' +
        imagesBiblio.map(function (b) { return '<option value="' + e(b.id) + '">' + e(b.valeur.titre || b.valeur.fichier.nomOrigine) + "</option>"; }).join("") + "</select>" : "";
      boite.classList.toggle("avec-image", !!a);
      boite.innerHTML = numero + (a
        ? '<img src="' + a + '" alt="' + e(v.legende || "Illustration") + '"><div class="actions-image">' +
          '<label class="bouton petit-bouton">Changer<input type="file" accept="image/*" data-envoyer="' + id + '" hidden></label>' +
          '<button class="petit-bouton" data-retirer="' + id + '">Retirer</button></div>'
        : '<div class="ajout-image"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 9v6M9 12h6"/></svg>' +
          '<label class="bouton petit-bouton">Ajouter une image<input type="file" accept="image/*" data-envoyer="' + id + '" hidden></label>' + choix + "</div>") +
        (v.fichier && !a ? '<p class="petit ecart">Image pas encore dans ce dossier.</p>' : "") +
        (message ? '<p class="petit message-image" role="status">' + message + "</p>" : "");
    }

    async function enregistrerImage(id, valeur) {
      for (var essai = 0; essai < 3; essai++) {
        var actuel = await st.lire("histoire-images", id);
        if ((await st.enregistrer("histoire-images", id, valeur, actuel ? actuel.vid : null, app.auteur())).ok) return;
      }
      throw new Error("l'image change trop souvent, réessaie");
    }

    zone.addEventListener("change", async function (ev) {
      var t = ev.target, id = t.getAttribute("data-envoyer") || t.getAttribute("data-depuis-biblio");
      if (!id) return;
      try {
        if (t.hasAttribute("data-envoyer")) {
          var f = t.files[0];
          if (!f) return;
          if (!/^image\//.test(f.type)) return afficherImage(id, '<span class="ecart">Choisis une image (photo ou dessin).</span>');
          if (f.size > TAILLE_MAX) return afficherImage(id, '<span class="ecart">Cette image fait ' + O.tailleLisible(f.size) + " : 8 Mo au plus. Réduis-la.</span>");
          var nom = O.nomFichierStocke(id + "-" + Date.now().toString(36), f.name);
          await st.ecrireFichier("histoire", nom, f);
          await enregistrerImage(id, { fichier: { collection: "histoire", nom: nom, type: f.type, nomOrigine: f.name }, legende: f.name.replace(/\.[^.]+$/, "") });
        } else {
          var b = imagesBiblio.filter(function (x) { return x.id === t.value; })[0];
          if (!b) return;
          await enregistrerImage(id, { fichier: { collection: "bibliotheque", nom: b.valeur.fichier.nom, type: b.valeur.fichier.type, nomOrigine: b.valeur.fichier.nomOrigine }, legende: b.valeur.titre });
        }
        await afficherImage(id, "Image enregistrée.");
      } catch (err) {
        afficherImage(id, '<span class="ecart">L\'image n\'a pas pu être enregistrée (' + e(err.message) + ").</span>");
      }
    });
    zone.addEventListener("click", async function (ev) {
      var b = ev.target.closest("[data-retirer]");
      if (!b) return;
      var id = b.getAttribute("data-retirer");
      await enregistrerImage(id, {});   // l'ancienne image reste dans l'historique
      afficherImage(id, "Image retirée (elle reste dans l'historique).");
    });

    for (var i = 0; i < CASES.length; i++) await afficherImage(CASES[i].id);

    var blocRoles = document.createElement("section");
    blocRoles.className = "carte";
    blocRoles.innerHTML = "<h2>Le rôle de chaque énigme dans l'histoire</h2>" + (roles.length ? "<ul>" + roles.map(function (g) {
      return "<li>" + app.pastille(g.valeur.mecanique) + " <strong>" + e(g.valeur.nom || "Groupe " + g.id) + "</strong> : " + e(g.valeur.enigme.roleHistoire) + "</li>";
    }).join("") + "</ul>" : '<p class="petit">Chaque groupe l\'écrira dans sa fiche « Mon énigme ».</p>');
    zone.appendChild(blocRoles);

    var arreter = Ed.suivreCartes(cartes);
    return function () { arreter(); adresses.forEach(function (a) { URL.revokeObjectURL(a); }); };
  };
})(this);
