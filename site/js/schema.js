// Schéma de câblage (atelier de câblage v2, brief §11.1) : un dessin simple de la carte (Arduino Uno ou micro:bit),
// de la platine et des composants, avec un fil par ligne du tableau des branchements. Ce n'est pas un simulateur :
// le schéma ne fait que montrer le tableau ; le tableau reste la référence. Sans accès à la page (testé avec node:test).
(function (racine) {
  "use strict";

  var LARGEUR = 800, HAUTEUR = 430;
  var CARTE = { x: 30, y: 40, l: 450, h: 190 };
  var PLATINE = { x: 30, y: 280, l: 450, h: 110 };
  var RAILS = { "Rail + de la platine": PLATINE.y + 18, "Rail − de la platine": PLATINE.y + PLATINE.h - 18 };
  var COULEURS_FIL = { rouge: "#d9534f", noir: "#222", jaune: "#e8c547", vert: "#5cb85c", bleu: "#4a90d9", orange: "#f0a030",
    blanc: "#f2f2f2", violet: "#9b6dd6", gris: "#999", marron: "#8b5a2b" };

  // Broches dessinées : nom → position.
  function brochesCarte(carte) {
    var p = {};
    if (carte === "microbit") {
      [["P0", 90], ["P1", 190], ["P2", 290], ["3V", 370], ["GND", 440]].forEach(function (b) { p[b[0]] = { x: b[1], y: CARTE.y + CARTE.h - 12, grande: true }; });
      return p;
    }
    ["D13", "D12", "D11", "D10", "D9", "D8", "D7", "D6", "D5", "D4", "D3", "D2", "D1", "D0"].forEach(function (n, i) { p[n] = { x: 55 + i * 30, y: CARTE.y + 12 }; });
    [["3,3V", 70], ["5V", 100], ["GND", 130], ["VIN", 160]].forEach(function (b) { p[b[0]] = { x: b[1], y: CARTE.y + CARTE.h - 12 }; });
    ["A0", "A1", "A2", "A3", "A4", "A5"].forEach(function (n, i) { p[n] = { x: 270 + i * 30, y: CARTE.y + CARTE.h - 12 }; });
    return p;
  }

  // Point d'arrivée d'un fil : une broche de la carte, ou un rail de la platine (à la hauteur du composant).
  function positionBroche(carte, broche, xDepart) {
    if (RAILS[broche]) return { x: Math.max(PLATINE.x + 20, Math.min(PLATINE.x + PLATINE.l - 20, xDepart || 250)), y: RAILS[broche] };
    var b = brochesCarte(carte)[String(broche || "").trim().toUpperCase().replace("3.3V", "3,3V")];
    return b ? { x: b.x, y: b.y } : null;
  }

  function positionsParDefaut(composants, positions) {
    var r = {}, rang = 0;
    composants.forEach(function (c) {
      r[c.id] = (positions && positions[c.id]) || { x: 540 + (rang % 2) * 130, y: 40 + Math.floor(rang / 2) * 120 };
      rang++;
    });
    return r;
  }

  function hauteurComposant(n) { return 30 + Math.max(1, n) * 18; }

  // Points des broches d'un composant (côté gauche de son dessin), dans l'ordre de ses lignes du tableau.
  function pointsComposant(position, nbLignes) {
    var pts = [];
    for (var i = 0; i < Math.max(1, nbLignes); i++) pts.push({ x: position.x, y: position.y + 30 + i * 18 });
    return pts;
  }

  function abreger(t, n) { t = String(t); return t.length > n ? t.slice(0, n - 1) + "…" : t; }

  function echapper(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function couleurFil(fil) {
    var t = String(fil || "").toLowerCase();
    var cle = Object.keys(COULEURS_FIL).filter(function (k) { return t.indexOf(k) !== -1; })[0];
    return cle ? COULEURS_FIL[cle] : "#c9a227";
  }

  // options : { carte, composants: [{ id, nom, type }], positions, branchements, interactif }
  function schemaSvg(options) {
    var carte = options.carte === "microbit" ? "microbit" : "uno";
    var composants = (options.composants || []).filter(function (c) { return !c.integre; });
    var positions = positionsParDefaut(composants, options.positions);
    var branchements = options.branchements || [];
    var s = '<svg class="schema" viewBox="0 0 ' + LARGEUR + " " + HAUTEUR + '" role="img" aria-label="Schéma de câblage : ' +
      (carte === "microbit" ? "micro:bit" : "Arduino Uno") + ", platine et " + composants.length + ' composant(s)">';
    // Carte
    s += '<rect class="schema-carte" x="' + CARTE.x + '" y="' + CARTE.y + '" width="' + CARTE.l + '" height="' + CARTE.h + '" rx="10"/>' +
      '<text class="schema-titre" x="' + (CARTE.x + CARTE.l / 2) + '" y="' + (CARTE.y + CARTE.h / 2) + '">' + (carte === "microbit" ? "micro:bit V2" : "Arduino Uno") + "</text>";
    if (carte === "microbit") s += '<text class="schema-note" x="' + (CARTE.x + CARTE.l / 2) + '" y="' + (CARTE.y + CARTE.h / 2 + 22) + '">capteurs intégrés : lumière, température, gestes (sans fil)</text>';
    var bc = brochesCarte(carte);
    Object.keys(bc).forEach(function (n) {
      var b = bc[n], haut = b.y < CARTE.y + CARTE.h / 2;
      s += '<g class="schema-broche" data-broche="' + echapper(n) + '"><rect x="' + (b.x - (b.grande ? 16 : 7)) + '" y="' + (b.y - 7) + '" width="' + (b.grande ? 32 : 14) + '" height="14" rx="2"/>' +
        '<text x="' + b.x + '" y="' + (haut ? b.y + 22 : b.y - 12) + '">' + echapper(n) + "</text></g>";
    });
    // Platine et rails
    s += '<rect class="schema-platine" x="' + PLATINE.x + '" y="' + PLATINE.y + '" width="' + PLATINE.l + '" height="' + PLATINE.h + '" rx="6"/>' +
      '<text class="schema-note" x="' + (PLATINE.x + PLATINE.l / 2) + '" y="' + (PLATINE.y + PLATINE.h / 2 + 4) + '">platine</text>';
    Object.keys(RAILS).forEach(function (r) {
      s += '<g class="schema-broche schema-rail" data-broche="' + echapper(r) + '"><line x1="' + (PLATINE.x + 12) + '" y1="' + RAILS[r] + '" x2="' + (PLATINE.x + PLATINE.l - 12) + '" y2="' + RAILS[r] + '"/>' +
        '<text x="' + (PLATINE.x + 120) + '" y="' + (RAILS[r] - 5) + '">' + (r.indexOf("+") !== -1 ? "rail + (relié au " + (carte === "microbit" ? "3V" : "5V") + ")" : "rail − (relié au GND)") + "</text></g>";
    });
    // Liaisons déjà faites : GND de la carte → rail −, 5 V (3 V sur micro:bit) → rail +.
    var gnd = bc.GND, plus = bc[carte === "microbit" ? "3V" : "5V"], cote = gnd.x < LARGEUR / 4 ? PLATINE.x - 14 : PLATINE.x + PLATINE.l + 14;
    var bas = CARTE.y + CARTE.h + 22, bordRail = cote < PLATINE.x ? PLATINE.x + 12 : PLATINE.x + PLATINE.l - 12;
    var fils = '<g class="schema-fixe"><path class="schema-fil schema-fil-fixe fil-clair" d="M' + plus.x + "," + plus.y + " L" + plus.x + "," + RAILS["Rail + de la platine"] +
      '" stroke="' + COULEURS_FIL.blanc + '"><title>Déjà câblé : ' + (carte === "microbit" ? "3V" : "5V") + " de la carte → rail +</title></path>" +
      '<path class="schema-fil schema-fil-fixe" d="M' + gnd.x + "," + gnd.y + " L" + gnd.x + "," + bas + " L" + cote + "," + bas + " L" + cote + "," + RAILS["Rail − de la platine"] + " L" + bordRail + "," + RAILS["Rail − de la platine"] +
      '" stroke="' + COULEURS_FIL.noir + '"><title>Déjà câblé : GND de la carte → rail −</title></path></g>', dessins = "";
    composants.forEach(function (c) {
      var lignes = branchements.map(function (b, i) { return { b: b, i: i }; }).filter(function (x) { return x.b.composant === c.id; });
      var p = positions[c.id], pts = pointsComposant(p, lignes.length), h = hauteurComposant(lignes.length);
      lignes.forEach(function (x, k) {
        var arrivee = positionBroche(carte, x.b.brocheCarte, pts[k].x - 60);
        if (arrivee) {
          var mx = (pts[k].x + arrivee.x) / 2;
          fils += '<path class="schema-fil' + (/f2f2f2/.test(couleurFil(x.b.fil)) ? " fil-clair" : "") + '" d="M' + pts[k].x + "," + pts[k].y + " C" + mx + "," + pts[k].y + " " + mx + "," + arrivee.y + " " + arrivee.x + "," + arrivee.y +
            '" stroke="' + couleurFil(x.b.fil) + '"><title>' + echapper((c.nom || c.id) + " " + (x.b.brocheComposant || "") + " → " + x.b.brocheCarte) + "</title></path>";
        }
      });
      dessins += '<g class="schema-composant" data-composant="' + echapper(c.id) + '" transform="translate(0,0)">' +
        '<rect class="schema-corps" x="' + p.x + '" y="' + p.y + '" width="120" height="' + h + '" rx="6"/>' +
        '<text class="schema-nom" x="' + (p.x + 60) + '" y="' + (p.y + 18) + '">' + echapper(String(c.nom || c.id).split(/[ —(]/)[0].slice(0, 16)) + "</text>" +
        lignes.map(function (x, k) {
          var relie = !!positionBroche(carte, x.b.brocheCarte, 0);
          // Point à la couleur de son fil : plein quand le fil est branché, creux sinon.
          var couleur = couleurFil(x.b.fil), contour = /f2f2f2/.test(couleur) ? "#666" : couleur;
          return '<circle class="schema-point' + (relie ? " relie" : "") + '" data-ligne="' + x.i + '" cx="' + pts[k].x + '" cy="' + pts[k].y + '" r="' + (options.interactif ? 8 : 5) +
            '" style="stroke:' + contour + ";fill:" + (relie ? couleur : "#fff") + '"><title>' + echapper((x.b.brocheComposant || "fil") + (relie ? " → " + x.b.brocheCarte : " : à brancher")) + "</title></circle>" +
            '<text class="schema-etiquette" x="' + (pts[k].x + 12) + '" y="' + (pts[k].y + 4) + '">' + echapper(abreger(x.b.brocheComposant || "broche " + (k + 1), 18)) + "</text>";
        }).join("") + "</g>";
    });
    return s + fils + dessins + "</svg>";
  }

  var EscapeLabSchema = { schemaSvg: schemaSvg, positionBroche: positionBroche, brochesCarte: brochesCarte,
    positionsParDefaut: positionsParDefaut, couleurFil: couleurFil, LARGEUR: LARGEUR, HAUTEUR: HAUTEUR };
  if (typeof module !== "undefined" && module.exports) module.exports = EscapeLabSchema;
  else racine.EscapeLabSchema = EscapeLabSchema;
})(this);
