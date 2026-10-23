// C18 — Modèles de remarques, aucune observation réelle.
// À sélectionner uniquement après observation et à adapter au contexte.
definirObservations({
  "format": "escape-lab/observations",
  "version": 1,
  "phases": {
    "miseEnPlace": [
      {
        "id": "miseEnPlace-poste-autonome",
        "texte": "Installe son poste sans aide.",
        "sens": "positif",
        "critere": "mise-en-place-individuel"
      },
      {
        "id": "miseEnPlace-controle-elements",
        "texte": "Vérifie les éléments de sa fiche.",
        "sens": "positif",
        "critere": "mise-en-place-individuel"
      },
      {
        "id": "miseEnPlace-signale-manque",
        "texte": "Signale un élément manquant au professeur.",
        "sens": "positif",
        "critere": "mise-en-place-individuel"
      },
      {
        "id": "miseEnPlace-poste-pret",
        "texte": "Poste complet à l’heure prévue.",
        "sens": "positif",
        "critere": "mise-en-place-groupe"
      },
      {
        "id": "miseEnPlace-liaisons-verifiees",
        "texte": "Vérifie les liaisons avec les autres groupes.",
        "sens": "positif",
        "critere": "mise-en-place-groupe"
      },
      {
        "id": "miseEnPlace-aide-installation",
        "texte": "A besoin d’aide pour installer son poste.",
        "sens": "a-ameliorer",
        "critere": "mise-en-place-individuel"
      },
      {
        "id": "miseEnPlace-consignes-reprises",
        "texte": "Demande de préciser la tâche confiée.",
        "sens": "a-ameliorer",
        "critere": "mise-en-place-individuel"
      },
      {
        "id": "miseEnPlace-documents-absents",
        "texte": "Documents absents au contrôle du poste.",
        "sens": "a-ameliorer",
        "critere": "mise-en-place-groupe"
      },
      {
        "id": "miseEnPlace-horaire-depasse",
        "texte": "Installation inachevée à l’heure prévue.",
        "sens": "a-ameliorer",
        "critere": "mise-en-place-groupe"
      },
      {
        "id": "miseEnPlace-controle-oublie",
        "texte": "Commence sans effectuer les contrôles prévus.",
        "sens": "a-ameliorer",
        "critere": "mise-en-place-individuel"
      }
    ],
    "jeu": [
      {
        "id": "jeu-role-tenu",
        "texte": "Intervient au moment prévu pour son rôle.",
        "sens": "positif",
        "critere": "jeu-individuel"
      },
      {
        "id": "jeu-information-transmise",
        "texte": "Transmet une information utile au Game Master.",
        "sens": "positif",
        "critere": "jeu-individuel"
      },
      {
        "id": "jeu-indice-adapte",
        "texte": "Donne l’indice prévu sans révéler la réponse.",
        "sens": "positif",
        "critere": "jeu-individuel"
      },
      {
        "id": "jeu-coordination-jeu",
        "texte": "Coordonne les interventions avec le Game Master.",
        "sens": "positif",
        "critere": "jeu-groupe"
      },
      {
        "id": "jeu-deroule-suivi",
        "texte": "Suit les étapes prévues du jeu.",
        "sens": "positif",
        "critere": "jeu-groupe"
      },
      {
        "id": "jeu-intervention-manquee",
        "texte": "N’intervient pas au moment prévu.",
        "sens": "a-ameliorer",
        "critere": "jeu-individuel"
      },
      {
        "id": "jeu-reponse-revelee",
        "texte": "Donne la réponse avant les indices prévus.",
        "sens": "a-ameliorer",
        "critere": "jeu-individuel"
      },
      {
        "id": "jeu-information-non-transmise",
        "texte": "Ne transmet pas l’incident au Game Master.",
        "sens": "a-ameliorer",
        "critere": "jeu-individuel"
      },
      {
        "id": "jeu-interventions-simultanees",
        "texte": "Plusieurs interventions simultanées interrompent les consignes.",
        "sens": "a-ameliorer",
        "critere": "jeu-groupe"
      },
      {
        "id": "jeu-etape-sautee",
        "texte": "Passe à la suite sans l’étape prévue.",
        "sens": "a-ameliorer",
        "critere": "jeu-groupe"
      }
    ],
    "rangement": [
      {
        "id": "rangement-materiel-range",
        "texte": "Range le matériel à l’emplacement convenu.",
        "sens": "positif",
        "critere": "rangement-individuel"
      },
      {
        "id": "rangement-piece-signalee",
        "texte": "Signale une pièce manquante ou abîmée.",
        "sens": "positif",
        "critere": "rangement-individuel"
      },
      {
        "id": "rangement-tache-verifiee",
        "texte": "Vérifie sa tâche avant de partir.",
        "sens": "positif",
        "critere": "rangement-individuel"
      },
      {
        "id": "rangement-inventaire-termine",
        "texte": "Termine l’inventaire du matériel du groupe.",
        "sens": "positif",
        "critere": "rangement-groupe"
      },
      {
        "id": "rangement-remise-zero-faite",
        "texte": "Effectue la remise à zéro prévue.",
        "sens": "positif",
        "critere": "rangement-groupe"
      },
      {
        "id": "rangement-aide-rangement",
        "texte": "A besoin d’aide pour terminer sa tâche.",
        "sens": "a-ameliorer",
        "critere": "rangement-individuel"
      },
      {
        "id": "rangement-emplacement-repris",
        "texte": "Range hors de l’emplacement convenu.",
        "sens": "a-ameliorer",
        "critere": "rangement-individuel"
      },
      {
        "id": "rangement-controle-non-fait",
        "texte": "Part avant de vérifier sa tâche.",
        "sens": "a-ameliorer",
        "critere": "rangement-individuel"
      },
      {
        "id": "rangement-inventaire-incomplet",
        "texte": "Laisse l’inventaire du groupe incomplet.",
        "sens": "a-ameliorer",
        "critere": "rangement-groupe"
      },
      {
        "id": "rangement-remise-zero-incomplete",
        "texte": "Remise à zéro inachevée au contrôle.",
        "sens": "a-ameliorer",
        "critere": "rangement-groupe"
      }
    ]
  }
});
