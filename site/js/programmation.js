// Page Programmation (brief §7.8, §11) : partie libre de Labo Blocs. Quatre emplacements de programme nommables par
// groupe, chacun sur l'Arduino Uno (par défaut) ou la micro:bit (si l'énigme le justifie, à valider par le
// professeur). Les autres groupes voient les programmes en lecture seule. Labo Blocs fait toute la programmation :
// cette page pose seulement son écran d'exercice (LaboBlocs.monterExercice) et range son fichier dans le dossier.
//
// Stockage : programmation/<groupe>-uno et programmation/<groupe>-microbit (le fichier d'équipe de Labo Blocs, avec
// sa rubrique « programmation », un par carte) ; fiches/<groupe>-programmation (noms et cartes des emplacements).
(function (racine) {
  "use strict";

  var O = racine.EscapeLabOutils, F = racine.EscapeLabFiche, e = O.echapper;
  var EMPLACEMENTS = 4;
  var PARCOURS = { uno: "escape-lab", microbit: "escape-lab-microbit" };
  var NOMS_CARTES = { uno: "Arduino Uno", microbit: "micro:bit V2" };

  function LB() { return racine.LaboBlocs; }

  function paquetDe(carte) {
    var brut = (LB().parcoursDefinis || []).filter(function (p) { return p.id === PARCOURS[carte]; })[0];
    if (!brut || LB().controler(brut).length) return null;
    return LB().preparer(brut);
  }

  // Programme enregistré d'un exercice, quelle que soit la forme de la rubrique (lu pour le contrôle E1).
  function programmeDe(donnees, exerciceId) {
    var ex = donnees && donnees.programmation && donnees.programmation.exercices && donnees.programmation.exercices[exerciceId];
    return ex ? (ex.programme || ex) : null;
  }

  // Session Labo Blocs qui enregistre dans le dossier de la classe (même interface que LaboBlocs.creerSession).
  function creerSessionDossier(st, cle, element, donnees, lecture, auteur, hote) {
    var s = { donnees: donnees, lecture: !!lecture, nonEnregistre: false, dernierEnregistrement: null };
    var avant = [], vid = element ? element.vid : null, minuteur = null, enCours = null, minuteurMessage = null;
    var dernierTexte = element ? JSON.stringify(element.valeur) : null;   // pour ne pas créer de version identique
    function preparer() { avant.forEach(function (f) { f(); }); }
    function majEtat(texte) {
      hote.querySelectorAll(".etat-enregistrement").forEach(function (el) {
        if (texte) el.textContent = "Enregistrement" + texte;
        else if (!s.nonEnregistre && s.dernierEnregistrement) el.textContent = "Enregistré à " + s.dernierEnregistrement.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        else el.textContent = s.nonEnregistre ? "Pas encore enregistré" : "";
      });
    }
    function message(texte, duree) {
      var t = hote.querySelector(".message-bref");
      if (!t) return;
      t.textContent = texte; t.hidden = false;
      clearTimeout(minuteurMessage);
      minuteurMessage = setTimeout(function () { t.hidden = true; }, duree || 2600);
    }
    async function enregistrer(mode) {
      if (s.lecture) return null;
      if (enCours) return enCours;
      preparer();
      if (mode === "auto" && JSON.stringify(s.donnees) === dernierTexte) { s.nonEnregistre = false; majEtat(); return null; }
      majEtat("…");
      enCours = (async function () {
        try {
          var r = await st.enregistrer("programmation", cle, s.donnees, vid, auteur);
          if (!r.ok) {
            // Un autre poste a enregistré ce programme entre-temps : la version ouverte ici est gardée, l'autre
            // reste dans l'historique du dossier (rien n'est perdu), et l'élève est prévenu.
            r = await st.enregistrer("programmation", cle, s.donnees, r.actuel ? r.actuel.vid : null, auteur);
            message("Un autre poste avait aussi enregistré ce programme : sa version reste dans l'historique du dossier.", 6000);
          } else if (mode === "bouton") message("C'est enregistré dans le dossier de la classe.");
          if (r.ok) { vid = r.element.vid; dernierTexte = JSON.stringify(r.element.valeur); s.nonEnregistre = false; s.dernierEnregistrement = new Date(); }
        } catch (err) {
          message("L'enregistrement n'a pas marché : vérifie la connexion au réseau du collège, puis clique sur « Enregistrer ».", 6000);
        } finally { enCours = null; majEtat(); }
      })();
      return enCours;
    }
    function aEnregistrer(maintenant, geste) {
      if (s.lecture) return;
      preparer();
      s.nonEnregistre = true;
      majEtat();
      clearTimeout(minuteur);
      minuteur = setTimeout(function () { enregistrer("auto"); }, maintenant || geste ? 0 : 5000);
    }
    Object.assign(s, { aEnregistrer: aEnregistrer, enregistrer: enregistrer, majEtat: majEtat, message: message,
      surAvantEcriture: function (f) { avant.push(f); }, // En quittant, Labo Blocs a rangé le programme affiché dans les données : on l'enregistre s'il a changé.
      fermer: function () { clearTimeout(minuteur); return s.lecture ? null : enregistrer("auto"); } });
    return s;
  }

  racine.EscapeLab.pages.programmation = async function (zone) {
    var app = racine.EscapeLab, et = app.etat, st = et.stockage;
    if (!LB() || !LB().monterExercice) {
      zone.innerHTML = '<p class="bandeau ecart">Labo Blocs n\'est pas chargé dans cette copie d\'Escape Lab : demande au professeur.</p>';
      return null;
    }
    var hoteLabo = null, sessionOuverte = null;
    var groupeVu = et.groupe, message = "";

    async function lireReglages(groupe) {
      var el = await st.lire("fiches", groupe + "-programmation");
      var v = el ? el.valeur : {};
      var liste = [];
      for (var i = 0; i < EMPLACEMENTS; i++) liste.push(Object.assign({ nom: "Programme " + (i + 1), carte: "uno" }, (v.emplacements || [])[i] || {}));
      return { element: el, emplacements: liste };
    }

    async function afficher() {
      var monGroupe = groupeVu === et.groupe;
      var reglages = await lireReglages(groupeVu);
      var fichiers = { uno: await st.lire("programmation", groupeVu + "-uno"), microbit: await st.lire("programmation", groupeVu + "-microbit") };
      var groupes = app.lettresGroupes(app.nombreGroupes());
      var html = '<p class="bandeau">Programmation libre avec Labo Blocs : jusqu\'à ' + EMPLACEMENTS + " programmes par groupe. " +
        "La carte est l'Arduino Uno ; la micro:bit seulement si l'énigme le justifie, avec l'accord du professeur.</p>" +
        '<section class="carte"><label for="groupeVu">Programmes du groupe</label><select id="groupeVu">' + groupes.map(function (g) {
          return '<option value="' + g + '"' + (g === groupeVu ? " selected" : "") + ">Groupe " + g + (g === et.groupe ? " (ton groupe)" : " · lecture seule") + "</option>";
        }).join("") + "</select></section>" + (message ? '<p class="bandeau" role="status">' + message + "</p>" : "") + '<div class="grille">';
      reglages.emplacements.forEach(function (emp, i) {
        var paquet = paquetDe(emp.carte), exercice = paquet && paquet.exercices[i];
        var donnees = fichiers[emp.carte] && fichiers[emp.carte].valeur;
        var programme = exercice && programmeDe(donnees, exercice.id);
        var analyse = F.analyserProgramme(programme);
        html += '<article class="carte groupe emplacement" data-index="' + i + '">' +
          (monGroupe ? '<label for="nom-' + i + '">Nom du programme</label><input id="nom-' + i + '" data-nom="' + i + '" maxlength="40" value="' + e(emp.nom) + '">' +
            '<label for="carte-' + i + '">Carte</label><select id="carte-' + i + '" data-carte="' + i + '">' + Object.keys(NOMS_CARTES).map(function (c) {
              return '<option value="' + c + '"' + (c === emp.carte ? " selected" : "") + ">" + NOMS_CARTES[c] + "</option>"; }).join("") + "</select>"
            : "<h3>" + e(emp.nom) + '</h3><p class="petit">' + NOMS_CARTES[emp.carte] + "</p>") +
          (emp.carte === "microbit" ? '<p class="petit">micro:bit : à valider par le professeur pour cette énigme.</p>' : "") +
          (!paquet ? '<p class="ecart">Les exercices de cette carte manquent dans cette copie d\'Escape Lab : demande au professeur.</p>'
            : analyse.vide ? '<p class="petit">Programme vide.</p>'
            : analyse.e1 ? "<p>✓ Le programme lit au moins un capteur et commande au moins un actionneur.</p>"
            : '<p class="ecart">' + e(app.message(analyse.entrees.length ? "actionneurManquant" : "capteurManquant")) + "</p>") +
          '<div class="boutons">' + (paquet ? '<button class="principal" data-ouvrir="' + i + '">' + (monGroupe ? "Ouvrir dans Labo Blocs" : "Voir le programme") + "</button>" : "") + "</div></article>";
      });
      html += "</div>";
      if (monGroupe) html += '<p class="petit">Le programme s\'enregistre tout seul dans le dossier de la classe. Les autres groupes peuvent le voir, sans le modifier.</p>';
      zone.innerHTML = html;
    }

    async function enregistrerReglages(index, champ, valeur) {
      for (var essai = 0; essai < 3; essai++) {
        var r = await lireReglages(et.groupe);
        r.emplacements[index][champ] = valeur;
        var ok = await st.enregistrer("fiches", et.groupe + "-programmation", { emplacements: r.emplacements }, r.element ? r.element.vid : null, app.auteur());
        if (ok.ok) return;
      }
    }

    async function ouvrir(index) {
      var reglages = await lireReglages(groupeVu), emp = reglages.emplacements[index];
      var paquet = paquetDe(emp.carte), exercice = paquet.exercices[index];
      var cle = groupeVu + "-" + emp.carte, lecture = groupeVu !== et.groupe;
      var element = await st.lire("programmation", cle);
      var donnees = element ? element.valeur : LB().creerSauvegarde({ eleves: [et.prenom], classe: et.depot }, { parcours: paquet, application: "escape-lab", projet: "escape-lab" });
      if (element) LB().relierParcours(donnees, paquet);
      hoteLabo = document.createElement("div");
      hoteLabo.className = "hote-labo-blocs";
      document.body.appendChild(hoteLabo);
      document.body.classList.add("labo-ouvert");
      sessionOuverte = creerSessionDossier(st, cle, element, donnees, lecture, app.auteur(), hoteLabo);
      var ecran = LB().monterExercice(hoteLabo, {
        session: sessionOuverte, paquet: paquet,
        projet: { id: "escape-lab", titre: "Escape Lab · " + emp.nom + (lecture ? " (groupe " + groupeVu + ")" : ""), accent: "#c9a227" },
        media: "vendor/labo-blocs/blockly/media/",
        toutDebloquer: true,
        retour: { texte: "Escape Lab", action: function () { fermer(); } }
      });
      ecran.ouvrir(exercice);
      hoteLabo._ecran = ecran;
    }

    async function fermer() {
      if (!hoteLabo) return;
      var s = sessionOuverte, h = hoteLabo;
      hoteLabo = null; sessionOuverte = null;
      if (s && s.fermer) await s.fermer();
      h.remove();
      document.body.classList.remove("labo-ouvert");
      document.title = "Programmation — Escape Lab";
      if (zone.isConnected) afficher();
    }

    zone.addEventListener("change", async function (ev) {
      var t = ev.target;
      if (t.id === "groupeVu") { groupeVu = t.value; message = ""; return afficher(); }
      if (t.hasAttribute("data-carte")) {
        await enregistrerReglages(Number(t.getAttribute("data-carte")), "carte", t.value);
        message = "Carte changée. Le programme fait sur l'autre carte est gardé : il revient si tu choisis de nouveau cette carte.";
        return afficher();
      }
      if (t.hasAttribute("data-nom")) {
        await enregistrerReglages(Number(t.getAttribute("data-nom")), "nom", t.value.trim() || "Programme " + (Number(t.getAttribute("data-nom")) + 1));
      }
    });
    zone.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-ouvrir]");
      if (b) ouvrir(Number(b.getAttribute("data-ouvrir")));
    });

    await afficher();
    return function () {
      if (hoteLabo) { if (hoteLabo._ecran) hoteLabo._ecran.quitter(); fermer(); }
    };
  };
})(this);
