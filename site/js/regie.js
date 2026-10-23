// Régie du jour J (brief §7.10, phase 2) : webcams branchées sur CE poste, 1 à 4 vignettes nommées, plein écran,
// arrêt immédiat ; minuteur de la partie ; indices de la frise à dire par talkie-walkie.
// Aucun enregistrement (pas de MediaRecorder), rien n'est envoyé sur le réseau : les images ne quittent pas le poste.
// Les caméras d'autres postes (liaison poste à poste) ne sont pas prises en charge : à tester d'abord (brief §7.10).
(function (racine) {
  "use strict";

  var S = racine.EscapeLabStockage, O = racine.EscapeLabOutils, e = O.echapper;
  var DEMO = null;
  racine.definirDemo = function (d) { DEMO = d; };

  var CLE = "escape-lab:regie";   // noms des vignettes, gardés sur ce poste (commodité, sans données d'élèves)
  var flux = [], appareils = [], enigmes = [];
  var minuteur = { duree: 60 * 60, restant: 60 * 60, depart: null, id: null };

  function $(id) { return document.getElementById(id); }
  function lireReglages() { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch (err) { return {}; } }
  function garderReglages(r) { try { localStorage.setItem(CLE, JSON.stringify(r)); } catch (err) { /* navigation privée */ } }
  function message(t) { $("messageRegie").textContent = t; $("messageRegie").hidden = !t; }

  // --- Caméras ---

  function majVoyant() {
    var actives = flux.filter(Boolean).length;
    $("voyant").textContent = actives ? "● " + actives + " caméra" + (actives > 1 ? "s" : "") + " active" + (actives > 1 ? "s" : "") + " · aucun enregistrement" : "○ Caméras éteintes";
    $("voyant").classList.toggle("actif", actives > 0);
    $("toutArreter").disabled = !actives;
  }

  function arreter(i) {
    if (flux[i]) { flux[i].getTracks().forEach(function (t) { t.stop(); }); flux[i] = null; }
    var v = document.querySelector('[data-video="' + i + '"]');
    if (v) v.srcObject = null;
    majVoyant();
  }

  function toutArreter() {
    for (var i = 0; i < flux.length; i++) arreter(i);
    majVoyant();
  }

  async function brancher(i, deviceId) {
    arreter(i);
    if (!deviceId) return;
    try {
      flux[i] = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } }, audio: false });
      document.querySelector('[data-video="' + i + '"]').srcObject = flux[i];
    } catch (err) {
      message("La caméra n'a pas pu s'allumer (" + err.name + "). Vérifie qu'elle est branchée et qu'aucun autre logiciel ne l'utilise.");
    }
    majVoyant();
  }

  function afficherVignettes(n) {
    var r = lireReglages();
    $("cameras").innerHTML = Array.from({ length: n }, function (x, i) {
      var c = (r.cameras || [])[i] || {};
      return '<figure class="carte vignette"><video data-video="' + i + '" autoplay muted playsinline></video>' +
        '<figcaption><input data-nom="' + i + '" maxlength="30" placeholder="ex. Énigme 3 (jamais un nom de personne)" value="' + e(c.nom || "") + '" aria-label="Nom de la caméra ' + (i + 1) + '">' +
        '<select data-appareil="' + i + '" aria-label="Caméra ' + (i + 1) + '"><option value="">— éteinte —</option>' + appareils.map(function (a, k) {
          return '<option value="' + e(a.deviceId) + '"' + (a.deviceId === c.appareil ? " selected" : "") + ">" + e(a.label || "Caméra " + (k + 1)) + "</option>"; }).join("") + "</select>" +
        (enigmes.length ? '<select data-enigme="' + i + '" aria-label="Énigme filmée par la caméra ' + (i + 1) + '"><option value="">énigme…</option>' + enigmes.map(function (en) {
          return '<option value="' + e(en.id) + '"' + (en.id === c.enigme ? " selected" : "") + ">" + e(en.rang + ". " + en.nom) + "</option>"; }).join("") + "</select>" : "") +
        '<span class="boutons"><button data-plein="' + i + '">Plein écran</button><button data-arreter="' + i + '">Arrêter</button></span></figcaption></figure>';
    }).join("");
  }

  async function allumer() {
    message("");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return message("Ce navigateur ne donne pas accès aux caméras : utilise Chrome ou Edge sur ce poste.");
    try {
      // Une première demande ouvre l'autorisation et donne les noms des caméras, puis on la referme.
      var essai = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      essai.getTracks().forEach(function (t) { t.stop(); });
      appareils = (await navigator.mediaDevices.enumerateDevices()).filter(function (d) { return d.kind === "videoinput"; });
    } catch (err) {
      return message("Pas d'accès aux caméras (" + err.name + "). Autorise la caméra pour cette page, ou vérifie qu'une webcam est branchée.");
    }
    if (!appareils.length) return message("Aucune webcam trouvée sur ce poste.");
    var n = Number($("nombre").value), r = lireReglages();
    afficherVignettes(n);
    for (var i = 0; i < n; i++) {
      var c = (r.cameras || [])[i] || {};
      var choix = appareils.some(function (a) { return a.deviceId === c.appareil; }) ? c.appareil : (appareils[i] && appareils[i].deviceId);
      if (choix) { document.querySelector('[data-appareil="' + i + '"]').value = choix; await brancher(i, choix); }
    }
    memoriser();
  }

  function memoriser() {
    var r = lireReglages(), n = document.querySelectorAll("[data-video]").length;
    r.cameras = Array.from({ length: n }, function (x, i) {
      var nom = document.querySelector('[data-nom="' + i + '"]'), ap = document.querySelector('[data-appareil="' + i + '"]'), en = document.querySelector('[data-enigme="' + i + '"]');
      return { nom: nom ? nom.value : "", appareil: ap ? ap.value : "", enigme: en ? en.value : "" };
    });
    garderReglages(r);
  }

  // --- Minuteur ---

  function restant() { return minuteur.depart ? Math.max(0, minuteur.restant - (Date.now() - minuteur.depart) / 1000) : minuteur.restant; }
  function majMinuteur() {
    var s = Math.ceil(restant()), m = Math.floor(s / 60);
    var t = (m < 10 ? "0" : "") + m + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
    $("minuteur").textContent = s === 0 ? "00:00 · temps écoulé" : s <= 300 ? t + " · plus que " + m + " min" : t;
    $("minuteur").classList.toggle("ecart", s <= 300);
    if (s === 0 && minuteur.id) { clearInterval(minuteur.id); minuteur.id = null; minuteur.restant = 0; minuteur.depart = null; }
  }

  // --- Indices ---

  async function chargerClasse(st) {
    var frise = await st.lire("frise", "ordre"), ordre = frise ? frise.valeur.ordre : [];
    enigmes = [];
    for (var i = 0; i < ordre.length; i++) {
      var id = ordre[i], en = await st.lire("fiches", id + "-enigme"), ind = await st.lire("fiches", id + "-indices"), g = await st.lire("groupes", id);
      var ancien = g ? g.valeur : {};
      enigmes.push({ id: id, rang: i + 1, nom: (en && en.valeur.titre) || ancien.nom || "Groupe " + id, indices: ind ? ind.valeur : (ancien.indices || {}) });
    }
    var reglages = await st.lire("equipe", "reglages");
    if (reglages && reglages.valeur.dureeJeu && !minuteur.depart) { $("duree").value = reglages.valeur.dureeJeu; remettreAZero(); }
    afficherIndices(null, null);
    var n = document.querySelectorAll("[data-video]").length;
    if (n) { memoriser(); afficherVignettes(n); rebrancherAffichage(); }
  }

  function rebrancherAffichage() {
    flux.forEach(function (f, i) { var v = document.querySelector('[data-video="' + i + '"]'); if (v && f) v.srcObject = f; });
  }

  function afficherIndices(idEnigme, niveau) {
    if (!enigmes.length) { $("indices").innerHTML = '<p class="petit">La frise de la classe est vide ou pas encore ouverte.</p>'; return; }
    var en = enigmes.filter(function (x) { return x.id === idEnigme; })[0];
    var html = '<div class="boutons">' + enigmes.map(function (x) {
      return '<button data-indice-enigme="' + e(x.id) + '" aria-pressed="' + (x.id === idEnigme) + '">' + e(x.rang + ". " + x.nom) + "</button>"; }).join("") + "</div>";
    if (en) {
      html += '<div class="boutons">' + ["n1", "n2", "n3"].map(function (n, i) {
        return '<button class="principal" data-niveau="' + n + '">Indice ' + (i + 1) + "</button>"; }).join("") + "</div>";
      if (niveau) {
        var t = en.indices[niveau] || {};
        html += '<div class="indice-affiche"><p class="petit">À dire au talkie-walkie :</p><p class="talkie">' + (t.talkie ? "« " + e(t.talkie) + " »" : '<span class="ecart">phrase pas encore écrite</span>') + "</p>" +
          (t.texte ? '<p class="petit">Indice complet : ' + e(t.texte) + "</p>" : "") + "</div>";
      }
    }
    $("indices").innerHTML = html;
    $("indices")._enigme = idEnigme;
  }

  function remettreAZero() {
    if (minuteur.id) clearInterval(minuteur.id);
    minuteur = { duree: (Number($("duree").value) || 60) * 60, restant: (Number($("duree").value) || 60) * 60, depart: null, id: null };
    majMinuteur();
  }

  // --- Événements ---

  document.addEventListener("DOMContentLoaded", function () {
    function majAllumer() { $("allumer").disabled = !($("accord").checked && $("informes").checked); }
    $("accord").addEventListener("change", majAllumer);
    $("informes").addEventListener("change", majAllumer);
    $("allumer").addEventListener("click", allumer);
    $("toutArreter").addEventListener("click", toutArreter);
    $("cameras").addEventListener("change", function (ev) {
      var t = ev.target;
      if (t.hasAttribute("data-appareil")) brancher(Number(t.getAttribute("data-appareil")), t.value);
      memoriser();
    });
    $("cameras").addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-arreter")) { var i = Number(b.getAttribute("data-arreter")); arreter(i); document.querySelector('[data-appareil="' + i + '"]').value = ""; memoriser(); }
      if (b.hasAttribute("data-plein")) { var v = document.querySelector('[data-video="' + b.getAttribute("data-plein") + '"]'); if (v.requestFullscreen) v.requestFullscreen(); }
    });
    $("demarrer").addEventListener("click", function () {
      if (minuteur.depart) return;
      minuteur.depart = Date.now();
      minuteur.id = setInterval(majMinuteur, 500);
      majMinuteur();
    });
    $("pause").addEventListener("click", function () {
      if (!minuteur.depart) return;
      minuteur.restant = restant(); minuteur.depart = null;
      clearInterval(minuteur.id); minuteur.id = null;
      majMinuteur();
    });
    $("zero").addEventListener("click", remettreAZero);
    $("duree").addEventListener("change", function () { if (!minuteur.depart) remettreAZero(); });
    $("ouvrirClasse").addEventListener("click", async function () {
      if (!racine.showDirectoryPicker) return message("Ce navigateur ne sait pas ouvrir un dossier : utilise Chrome ou Edge.");
      try {
        var poignee = await racine.showDirectoryPicker({ id: "escape-lab-regie", mode: "read" });
        await chargerClasse(S.creerStockage(S.creerAdaptateurDossier(poignee), { depot: "regie" }));
      } catch (err) { if (err.name !== "AbortError") message("Le dossier n'a pas pu être lu (" + err.message + ")."); }
    });
    $("demoClasse").addEventListener("click", async function () {
      var st = S.creerStockage(S.creerAdaptateurMemoire(), { depot: "demo" });
      for (var i = 0; i < DEMO.elements.length; i++) await st.enregistrer(DEMO.elements[i].collection, DEMO.elements[i].id, DEMO.elements[i].valeur, null, { prenom: "Démo" });
      await chargerClasse(st);
    });
    $("indices").addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-indice-enigme")) afficherIndices(b.getAttribute("data-indice-enigme"), null);
      if (b.hasAttribute("data-niveau")) afficherIndices($("indices")._enigme, b.getAttribute("data-niveau"));
    });
    racine.addEventListener("beforeunload", toutArreter);
    remettreAZero();
    afficherIndices(null, null);
  });
})(this);
