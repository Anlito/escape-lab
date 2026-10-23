// Règles de l'évaluation (brief §8.5), sans accès aux fichiers (testées avec node:test). Barème de la proposition C6,
// à confirmer par le professeur : niveaux A à D = 0 à 3 points, coefficients par critère,
// note = 20 × Σ(points × coefficient) / (3 × Σ coefficients des critères observés). Un critère non observé reste
// absent : jamais compté comme A ni comme zéro. Les notes restent dans le dossier personnel du professeur (§10.3).
(function (racine) {
  "use strict";

  function pointsDe(niveaux, idNiveau) {
    var n = niveaux.filter(function (x) { return x.id === idNiveau; })[0];
    return n ? n.points : null;
  }
  function maxPoints(niveaux) { return Math.max.apply(null, niveaux.map(function (n) { return n.points; })); }

  // Saisies d'un élève : celles de son groupe pour les critères de groupe (sauf ajustement individuel explicite),
  // les siennes pour les critères individuels.
  function saisiesEleve(criteres, deGroupe, deLEleve) {
    var r = {};
    criteres.forEach(function (c) {
      var propre = (deLEleve || {})[c.id], groupe = (deGroupe || {})[c.id];
      if (c.portee === "groupe") { if (propre) r[c.id] = propre; else if (groupe) r[c.id] = groupe; }
      else if (propre) r[c.id] = propre;
    });
    return r;
  }

  // { note (arrondie au dixième) ou null, couverture: observés / total, observes, total }
  function noteSur20(criteres, niveaux, saisies) {
    var somme = 0, coefficients = 0, observes = 0, max = maxPoints(niveaux);
    criteres.forEach(function (c) {
      var p = pointsDe(niveaux, (saisies || {})[c.id]);
      if (p == null) return;
      somme += p * (c.coefficient || 1);
      coefficients += c.coefficient || 1;
      observes++;
    });
    var note = coefficients ? Math.round(200 * somme / (max * coefficients)) / 10 : null;
    return { note: note, observes: observes, total: criteres.length, complete: observes === criteres.length };
  }

  // Observations répétées (comportement par séance) : moyenne des points, ramenée au niveau le plus proche.
  function niveauMoyen(niveaux, idsNiveaux) {
    var points = idsNiveaux.map(function (id) { return pointsDe(niveaux, id); }).filter(function (p) { return p != null; });
    if (!points.length) return null;
    var moyenne = points.reduce(function (a, b) { return a + b; }, 0) / points.length;
    var proche = niveaux.slice().sort(function (a, b) { return Math.abs(a.points - moyenne) - Math.abs(b.points - moyenne); })[0];
    return proche.id;
  }

  // Brouillon d'appréciation (à relire par le professeur) : la phrase de la tranche de note, puis pour chaque bloc
  // observé une phrase « point fort » (moyenne au-dessus du milieu du barème) ou « à travailler ».
  function appreciation(criteres, niveaux, saisies, modeles) {
    var n = noteSur20(criteres, niveaux, saisies);
    if (n.note == null) return "";
    var tranche = (modeles.parNote || []).filter(function (t) { return n.note >= t.min && (n.note < t.max || (t.max === 20 && n.note === 20)); })[0];
    var phrases = tranche ? [tranche.texte] : [];
    var parBloc = {};
    criteres.forEach(function (c) {
      var p = pointsDe(niveaux, (saisies || {})[c.id]);
      if (p != null) (parBloc[c.bloc] = parBloc[c.bloc] || []).push(p);
    });
    var milieu = maxPoints(niveaux) / 2;
    Object.keys(parBloc).forEach(function (bloc) {
      var m = (modeles.parBloc || {})[bloc];
      if (!m) return;
      var moyenne = parBloc[bloc].reduce(function (a, b) { return a + b; }, 0) / parBloc[bloc].length;
      phrases.push(moyenne > milieu ? m.fort : m.aTravailler);
    });
    return phrases.filter(Boolean).join(" ");
  }

  // CSV pour le tableur (Pronote) : séparateur « ; », guillemets si besoin, marque UTF-8 pour Excel.
  function csv(lignes) {
    return "﻿" + lignes.map(function (l) {
      return l.map(function (x) {
        var t = typeof x === "number" ? String(x).replace(".", ",") : x == null ? "" : String(x);
        return /[;"\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
      }).join(";");
    }).join("\r\n") + "\r\n";
  }

  var EscapeLabEvaluation = { saisiesEleve: saisiesEleve, noteSur20: noteSur20, niveauMoyen: niveauMoyen, appreciation: appreciation, csv: csv };
  if (typeof module !== "undefined" && module.exports) module.exports = EscapeLabEvaluation;
  else racine.EscapeLabEvaluation = EscapeLabEvaluation;
})(this);
