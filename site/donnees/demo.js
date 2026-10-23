// Classe fictive pour découvrir l'outil sans dossier (rien n'est enregistré). Prénoms inventés.
definirDemo({
  equipe: { id: "demo", nom: "3Z9 (classe fictive)", depots: ["3Z9"] },
  elements: [
    { collection: "equipe", id: "reglages", valeur: { seanceActuelle: 3 } },
    { collection: "annonces", id: "a1", valeur: { texte: "Séance 3 : prise en main du kit. Apportez vos croquis.", epinglee: true } },
    { collection: "annonces", id: "a2", valeur: { texte: "L'histoire a une première version : relisez-la avant mardi." } },
    { collection: "groupes", id: "A", valeur: { nom: "Le rapport de bataille", mecanique: "damier",
        jalons: { mecanique: "fait", scenario: "fait", materiel: "fait", matiere: "fait", choixE1: "en cours" } } },
    { collection: "groupes", id: "B", valeur: { nom: "Les calques du labo", mecanique: "calques",
        jalons: { mecanique: "fait", scenario: "en cours" } } },
    { collection: "groupes", id: "C", valeur: { nom: "Les passeports", mecanique: "points",
        jalons: { mecanique: "fait", scenario: "fait", materiel: "en cours", matiere: "fait" } } },
    { collection: "groupes", id: "D", valeur: { nom: "Signal de détresse", mecanique: "morse",
        jalons: { mecanique: "fait", scenario: "fait", materiel: "fait", matiere: "fait", choixE1: "fait" } } },
    { collection: "groupes", id: "E", valeur: { nom: "Le message silencieux", mecanique: "signes", jalons: {} } },
    { collection: "frise", id: "ordre", valeur: { ordre: ["C", "A", "D", "B", "E"] } }
  ]
});
