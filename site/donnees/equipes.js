// Équipes d'Escape Lab (brief §3, §10.1) : une équipe = un nom + un ou deux dépôts (dossiers de classe).
// Les noms de classe sont ceux de college.js (Réglages du collège). Aucune donnée d'élève ici.
// cheminProjet : fin du chemin après le dossier TECHNOLOGIE de la classe (question 7 du brief, réglable).
definirEquipes({
  format: "escape-lab/equipes",
  version: 1,
  cheminProjet: ["ESCAPE GAME", "{depot}"],
  nombreGroupes: 5,
  equipes: [
    { id: "3C1", nom: "3C1", depots: ["3C1"] },
    { id: "3D2", nom: "3D2", depots: ["3D2"] },
    { id: "3C2D1", nom: "3C2D1", depots: ["3C2", "3D1"] }
  ]
});
