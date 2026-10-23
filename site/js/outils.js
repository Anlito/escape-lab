// Fonctions communes sans accès aux fichiers ni à la page (testées avec node:test) : mise en forme légère,
// textes en conflit, frise (ordre, liaisons, durée).
(function (racine) {
  "use strict";

  function echapper(texte) {
    return String(texte == null ? "" : texte).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Mise en forme légère (brief §7.3) : « ## titre », « - élément de liste », « **gras** », ligne vide = paragraphe.
  // Le texte est toujours échappé d'abord : aucune balise écrite par un élève n'est interprétée.
  function miseEnForme(texte) {
    var html = [], paragraphe = [], dansListe = false;
    function gras(t) { return echapper(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
    function finirParagraphe() { if (paragraphe.length) { html.push("<p>" + paragraphe.join("<br>") + "</p>"); paragraphe = []; } }
    function finirListe() { if (dansListe) { html.push("</ul>"); dansListe = false; } }
    String(texte == null ? "" : texte).split(/\r?\n/).forEach(function (ligne) {
      var m;
      if (/^\s*$/.test(ligne)) { finirParagraphe(); finirListe(); return; }
      if ((m = ligne.match(/^\s*##\s+(.*)$/))) { finirParagraphe(); finirListe(); html.push("<h4>" + gras(m[1]) + "</h4>"); return; }
      if ((m = ligne.match(/^\s*[-•]\s+(.*)$/))) {
        finirParagraphe();
        if (!dansListe) { html.push("<ul>"); dansListe = true; }
        html.push("<li>" + gras(m[1]) + "</li>");
        return;
      }
      finirListe();
      paragraphe.push(gras(ligne));
    });
    finirParagraphe();
    finirListe();
    return html.join("");
  }

  // Deux personnes ont enregistré le même élément : on garde les deux textes, champ par champ.
  function combinerTextes(leurValeur, maValeur, champs) {
    var resultat = {};
    champs.forEach(function (cle) {
      var leur = String((leurValeur || {})[cle] || "").trim(), mien = String((maValeur || {})[cle] || "").trim();
      if (!mien || leur === mien || leur.indexOf(mien) !== -1) resultat[cle] = leur;
      else if (!leur) resultat[cle] = mien;
      else resultat[cle] = leur + "\n\n" + mien;
    });
    return resultat;
  }

  function nomAuteur(auteur) {
    if (!auteur) return "quelqu'un";
    if (auteur.prof) return "le professeur";
    if (auteur.synchronisation) return "la synchronisation";
    return (auteur.prenom || "quelqu'un") + (auteur.groupe ? " (groupe " + auteur.groupe + ")" : "");
  }

  // --- Frise ---

  function liaisonsDeLOrdre(ordre) {
    var paires = [];
    for (var i = 0; i + 1 < ordre.length; i++) paires.push(ordre[i] + "-" + ordre[i + 1]);
    return paires;
  }

  function deplacer(ordre, index, decalage) {
    var cible = index + decalage, copie = ordre.slice();
    if (cible < 0 || cible >= copie.length) return copie;
    var element = copie.splice(index, 1)[0];
    copie.splice(cible, 0, element);
    return copie;
  }

  // Durée de la partie : durée estimée de chaque énigme, sinon la durée par défaut (12 min, brief §7.4).
  function dureeTotale(ordre, dureesParGroupe, dureeParDefaut) {
    var total = 0, estimees = 0;
    ordre.forEach(function (id) {
      var d = Number(dureesParGroupe[id]);
      if (d > 0) total += d;
      else { total += dureeParDefaut; estimees++; }
    });
    return { total: total, parDefaut: estimees };
  }

  function decrireChangementOrdre(ancien, nouveau, nomDe) {
    nomDe = nomDe || function (id) { return id; };
    var ajoutes = nouveau.filter(function (id) { return ancien.indexOf(id) === -1; });
    var retires = ancien.filter(function (id) { return nouveau.indexOf(id) === -1; });
    var morceaux = [];
    if (!ancien.length) morceaux.push("Premier ordre : " + nouveau.map(nomDe).join(" → "));
    else {
      morceaux.push(ancien.map(nomDe).join(" → ") + "  devient  " + nouveau.map(nomDe).join(" → "));
      if (ajoutes.length) morceaux.push("ajouté : " + ajoutes.map(nomDe).join(", "));
      if (retires.length) morceaux.push("retiré : " + retires.map(nomDe).join(", "));
    }
    return morceaux.join(" · ");
  }

  var EscapeLabOutils = {
    echapper: echapper, miseEnForme: miseEnForme, combinerTextes: combinerTextes, nomAuteur: nomAuteur,
    liaisonsDeLOrdre: liaisonsDeLOrdre, deplacer: deplacer, dureeTotale: dureeTotale,
    decrireChangementOrdre: decrireChangementOrdre
  };
  if (typeof module !== "undefined" && module.exports) module.exports = EscapeLabOutils;
  else racine.EscapeLabOutils = EscapeLabOutils;
})(this);
