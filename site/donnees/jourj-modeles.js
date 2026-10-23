// C8 — Modèles facultatifs à personnaliser ; aucune personne ni aucun horaire attribués.
// Le rôle régie caméras reste exclu par défaut ; phase 2 après décision de Thomas.
definirModelesJourJ({
  "format": "escape-lab/jourj-modeles",
  "version": 1,
  "roles": [
    {
      "id": "game-master",
      "nom": "Game Master (maître du jeu)",
      "description": "Suis la frise, donne les indices prévus et coordonne les interventions.",
      "texteExemple": "Équipe de maintenance, je vous écoute. Décrivez ce que vous voyez au poste."
    },
    {
      "id": "comedien",
      "nom": "Personnage / comédien",
      "description": "Incarne un personnage et présente sa mission sans révéler les solutions.",
      "texteExemple": "Je suis le gardien de la station Aurore. Retrouvez les cinq fragments du protocole."
    },
    {
      "id": "accueil",
      "nom": "Accueil des joueurs",
      "description": "Accueille les joueurs et présente les consignes validées par le professeur.",
      "texteExemple": "Bienvenue à la station Aurore. Une mission vous attend dans les cinq postes."
    },
    {
      "id": "regie-cameras",
      "nom": "Régie caméras — phase 2 seulement",
      "description": "Seulement après accord, regarde les images sur ce poste, sans enregistrer ni envoyer.",
      "texteExemple": "Game Master, décris le poste à observer. Je regarde seulement les images autorisées."
    },
    {
      "id": "responsable-enigme",
      "nom": "Responsable d’énigme",
      "description": "Prépare ton poste et sa remise à zéro selon les consignes validées.",
      "texteExemple": "Mon poste est prêt. Le fragment du protocole est à sa place."
    },
    {
      "id": "rangement",
      "nom": "Responsable du rangement",
      "description": "Coordonne le rangement et signale les éléments manquants au professeur.",
      "texteExemple": "Rassemblons les supports et les documents des cinq postes de la station."
    },
    {
      "id": "installation",
      "nom": "Responsable de la mise en place",
      "description": "Coordonne les emplacements et vérifie que chaque poste dispose de sa fiche.",
      "texteExemple": "Installons les cinq postes dans l’ordre de la frise de la station."
    }
  ],
  "logistique": [
    {
      "tache": "Proposer une date et des horaires avec le professeur.",
      "quand": "Avant toute invitation."
    },
    {
      "tache": "Obtenir l’accord de la direction avec le professeur.",
      "quand": "Avant de confirmer la date et les invitations."
    },
    {
      "tache": "Préciser le nombre de joueurs invités et leur rôle, sans noms.",
      "quand": "Lors de la préparation des invitations."
    },
    {
      "tache": "Faire confirmer les cours déplacés ou annulés par les adultes concernés.",
      "quand": "Avant de confirmer le planning."
    },
    {
      "tache": "Réserver le foyer et vérifier ses horaires d’accès.",
      "quand": "Avant de fixer la mise en place."
    },
    {
      "tache": "Réserver le matériel réellement disponible avec le professeur.",
      "quand": "Avant la répétition générale."
    },
    {
      "tache": "Répartir au moins un rôle par élève ; chacun écrit son texte.",
      "quand": "Avant la répétition générale."
    },
    {
      "tache": "Prévoir les déplacements et l’accueil avec le professeur.",
      "quand": "Avant l’envoi des consignes pratiques."
    },
    {
      "tache": "Préparer les fiches d’installation et le livret du Game Master.",
      "quand": "Avant la répétition générale."
    },
    {
      "tache": "Fixer une répétition et noter les corrections nécessaires.",
      "quand": "Avant le jour J."
    },
    {
      "tache": "Si la phase caméras est autorisée, confirmer les accords et informer les joueurs.",
      "quand": "Uniquement en phase 2, avant tout usage des caméras."
    }
  ],
  "miseEnPlace": [
    "Pour chaque tâche, précise qui agit, à quelle heure et avec quel matériel.",
    "Installe les postes dans l’ordre validé de la frise.",
    "Utilise la fiche d’installation propre à chaque énigme.",
    "Place les documents, les objets et les éléments prévus dans les boîtes.",
    "Demande au professeur de vérifier les montages avant toute mise sous tension.",
    "Vérifie les liaisons entre postes et le moyen de communication prévu.",
    "Annonce au Game Master quand ton poste est prêt."
  ],
  "deroule": [
    "Accueille les joueurs à l’heure prévue et présente les consignes validées.",
    "Le gardien présente la mission de la station Aurore.",
    "Le Game Master suit la progression dans l’ordre de la frise.",
    "Chaque responsable reste disponible pour la mission qui lui a été confiée.",
    "Le Game Master choisit un indice adapté et utilise la phrase prévue.",
    "En cas de difficulté technique, demande au professeur avant toute intervention.",
    "À la fin, applique le déroulé final validé et accompagne la sortie."
  ],
  "rangement": [
    "Pour chaque tâche, précise qui range et où remettre le matériel.",
    "Demande au professeur les consignes d’arrêt avant de déplacer les montages.",
    "Rassemble les documents et les supports de chaque poste.",
    "Effectue la remise à zéro prévue sur chaque fiche.",
    "Range les éléments aux emplacements convenus.",
    "Signale au professeur les éléments manquants ou abîmés.",
    "Vérifie le foyer avec le professeur avant de partir."
  ],
  "verifications": [
    "La date, les horaires et l’accord de la direction sont confirmés.",
    "Le nombre et la fonction des invités sont indiqués, sans noms.",
    "Les changements de cours et les déplacements sont confirmés par les adultes concernés.",
    "Le lieu et le matériel nécessaire sont disponibles.",
    "Chaque élève a au moins un rôle et un texte personnel.",
    "Chaque texte a été répété ; les corrections utiles sont notées.",
    "Chaque tâche indique une personne responsable et un horaire.",
    "Les postes suivent l’ordre validé de la frise.",
    "Les contenus des boîtes et les liaisons sont vérifiés.",
    "Chaque énigme dispose de trois indices et de trois phrases pour le talkie-walkie.",
    "Les fiches d’installation et le livret sont disponibles pour les responsables.",
    "Les montages ont reçu la validation du professeur avant leur mise sous tension.",
    "Les consignes de remise à zéro et de rangement sont prêtes.",
    "Si les caméras sont autorisées, les joueurs sont informés et aucun flux n’est enregistré."
  ]
});
