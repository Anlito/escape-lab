// Jalons par défaut de chaque groupe (brief §4 et annexe C). seance = séance où le jalon doit être fait,
// réglable par le professeur. physique = validé par le professeur (le logiciel ne peut pas le vérifier).
definirJalons({
  format: "escape-lab/jalons",
  version: 1,
  jalons: [
    { id: "mecanique", nom: "Mécanique comprise", seance: 1 },
    { id: "scenario", nom: "Scénario, solution et cadenas", seance: 2 },
    { id: "materiel", nom: "Liste du matériel", seance: 2 },
    { id: "matiere", nom: "Matière associée et lien expliqué", code: "F3", seance: 2 },
    { id: "choixE1", nom: "Capteur et actionneur choisis", seance: 3 },
    { id: "cablage", nom: "Câblage testé", code: "E1", seance: 5, physique: true },
    { id: "programme", nom: "Programme qui fonctionne", code: "E1", seance: 5 },
    { id: "M1", nom: "Documents à imprimer", code: "M1", seance: 8, physique: true },
    { id: "M2", nom: "Objet pour résoudre l'énigme", code: "M2", seance: 8, physique: true },
    { id: "M3", nom: "Système fermé par un cadenas", code: "M3", seance: 8, physique: true },
    { id: "indices", nom: "Trois niveaux d'indices", code: "F1", seance: 9 },
    { id: "installation", nom: "Installation et remise à zéro", code: "F1", seance: 9 },
    { id: "test", nom: "Test croisé", code: "F2", seance: 9 },
    { id: "jourJ", nom: "Rôles et textes du jour J", code: "J1", seance: 10 }
  ]
});
