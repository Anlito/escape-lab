// Messages des jalons et des contrôles (brief §7.6, §11.1, §12) : rédigés avec ChatGPT (tâche C7), à relire par le professeur.
// memeBroche et brocheIndisponible nomment la broche ({broche}) : un seul écart, décrit précisément.
definirMessages({
  "format": "escape-lab/messages",
  "version": 1,
  "jalons": {
    "mecanique": {
      "aFaire": "Lis ta fiche mécanique et explique le principe avec tes mots.",
      "enCours": "Tu explores la mécanique ; reformule ce que feront les joueurs.",
      "fait": "Tu as expliqué la mécanique ; utilise cette base pour concevoir ton énigme.",
      "enRetard": "L’échéance est passée ; reprends la fiche et demande de l’aide au professeur."
    },
    "scenario": {
      "aFaire": "Décris le parcours des joueurs, la solution et le cadenas prévu.",
      "enCours": "Ton scénario avance ; complète la solution et précise le cadenas avec le professeur.",
      "fait": "Ton scénario, ta solution et ton cadenas sont renseignés ; prépare le prototype.",
      "enRetard": "L’échéance est passée ; complète le scénario, la solution et le cadenas avec le professeur."
    },
    "materiel": {
      "aFaire": "Liste le matériel nécessaire et indique comment l’obtenir.",
      "enCours": "Ta liste avance ; complète les quantités et l’origine du matériel.",
      "fait": "Ta liste est renseignée ; vérifie sa disponibilité avant la fabrication.",
      "enRetard": "L’échéance est passée ; termine la liste du matériel avec ton groupe."
    },
    "matiere": {
      "aFaire": "Choisis une autre matière étudiée et explique son lien avec ton énigme.",
      "enCours": "Ta matière est choisie ; précise la notion utilisée et son rôle dans l’énigme.",
      "fait": "Tu as expliqué le lien avec une autre matière ; vérifie-le avec le professeur.",
      "enRetard": "L’échéance est passée ; précise la matière et son lien avec ton énigme."
    },
    "choixE1": {
      "aFaire": "Choisis un capteur et un actionneur ; explique leur utilité dans le jeu.",
      "enCours": "Tes choix avancent ; fais vérifier leur disponibilité et leur utilité par le professeur.",
      "fait": "Ton capteur et ton actionneur sont choisis ; prépare leur usage avec le professeur.",
      "enRetard": "L’échéance est passée ; choisis le capteur et l’actionneur avec le professeur."
    },
    "cablage": {
      "aFaire": "Prépare ton tableau de branchements et demande au professeur de vérifier le montage.",
      "enCours": "Ton montage avance ; demande au professeur les vérifications nécessaires avant les essais.",
      "fait": "Ton câblage testé est validé par le professeur ; conserve le tableau correspondant.",
      "enRetard": "L’échéance est passée ; fais le point sur le câblage avec le professeur."
    },
    "programme": {
      "aFaire": "Décris l’action attendue, puis commence ton programme dans Labo Blocs.",
      "enCours": "Ton programme avance ; teste chaque action et note ce qui reste à ajuster.",
      "fait": "Ton programme réalise l’action attendue ; conserve les résultats de tes essais.",
      "enRetard": "L’échéance est passée ; teste le programme et demande une aide ciblée au professeur."
    },
    "M1": {
      "aFaire": "Crée les documents à imprimer et personnalise-les pour ton histoire.",
      "enCours": "Tes documents avancent ; vérifie leur lisibilité avant de demander la validation.",
      "fait": "Tes documents sont prêts et validés par le professeur ; conserve les fichiers.",
      "enRetard": "L’échéance est passée ; termine les documents et demande la validation du professeur."
    },
    "M2": {
      "aFaire": "Prépare un croquis de l’objet qui aidera les joueurs à résoudre l’énigme.",
      "enCours": "Ton objet prend forme ; teste sa manipulation et prépare sa présentation au professeur.",
      "fait": "Ton objet est prêt et validé par le professeur ; prépare son installation.",
      "enRetard": "L’échéance est passée ; présente ton objet au professeur pour choisir la prochaine action."
    },
    "M3": {
      "aFaire": "Conçois un système fermé par cadenas et précise ce qu’il contiendra.",
      "enCours": "Ton système avance ; vérifie la fermeture et prépare le contenu prévu.",
      "fait": "Ton système à cadenas est validé par le professeur ; prépare sa remise à zéro.",
      "enRetard": "L’échéance est passée ; vérifie le système à cadenas avec le professeur."
    },
    "indices": {
      "aFaire": "Prépare trois indices progressifs et leurs phrases pour le talkie-walkie.",
      "enCours": "Tes indices avancent ; complète chaque niveau et sa phrase pour le talkie-walkie.",
      "fait": "Tes trois indices et leurs phrases sont renseignés ; vérifie leur progression pendant un test.",
      "enRetard": "L’échéance est passée ; complète les indices et leurs phrases pour le talkie-walkie."
    },
    "installation": {
      "aFaire": "Décris l’installation, la remise à zéro et les vérifications avant chaque partie.",
      "enCours": "Tes consignes avancent ; vérifie qu’un autre groupe peut les suivre.",
      "fait": "Tes consignes sont renseignées ; essaie l’installation et la remise à zéro.",
      "enRetard": "L’échéance est passée ; complète les consignes d’installation et de remise à zéro."
    },
    "test": {
      "aFaire": "Invite un autre groupe à jouer et prévois de recueillir ses remarques.",
      "enCours": "Le test avance ; note la durée, les blocages et les améliorations utiles.",
      "fait": "Tu as reçu un avis de test ; utilise-le pour améliorer ton énigme.",
      "enRetard": "L’échéance est passée ; organise un test avec un autre groupe et recueille son avis."
    },
    "jourJ": {
      "aFaire": "Répartis les rôles du jour J ; chaque personne prépare son texte.",
      "enCours": "Les rôles sont répartis ; complète les textes et prépare une répétition.",
      "fait": "Les rôles et les textes sont renseignés ; vérifie que chaque personne a répété.",
      "enRetard": "L’échéance est passée ; complète les rôles et les textes avec ton groupe."
    }
  },
  "controles": {
    "indiceManquant1": "Il manque encore le premier indice ; indique où regarder, sans expliquer la méthode.",
    "indiceManquant2": "Il manque encore le deuxième indice ; explique la méthode sans donner la réponse.",
    "indiceManquant3": "Il manque encore le troisième indice ; indique la dernière action sans donner la réponse.",
    "talkieManquant": "Il manque encore une phrase pour le talkie-walkie ; prépare une consigne courte.",
    "solutionManquante": "Il manque encore la solution ; écris la réponse attendue pour permettre sa vérification.",
    "matiereManquante": "Il manque encore une matière ; choisis une matière étudiée, autre que la technologie.",
    "lienMatiereTropCourt": "Le lien avec la matière reste à préciser ; explique la notion et son utilisation.",
    "contenuBoiteManquant": "Le contenu de la boîte manque encore ; précise ce qui passe à l’énigme suivante.",
    "capteurManquant": "Il manque encore un capteur ; demande au professeur de vérifier ton choix.",
    "actionneurManquant": "Il manque encore un actionneur ; demande au professeur de vérifier ton choix.",
    "memeBroche": "La broche {broche} est utilisée deux fois ; choisis-en une autre ou demande au professeur.",
    "brocheIndisponible": "La broche « {broche} » n’existe pas sur cette carte ; vérifie son nom avec le professeur.",
    "masseCommune": "La masse commune reste à vérifier selon le montage ; demande au professeur.",
    "douzeVoltsSansRelais": "Relais et alimentation séparée sont nécessaires ; demande au professeur avant tout branchement.",
    "validationProfAvantTension": "Avant toute mise sous tension, demande au professeur de vérifier et valider le montage.",
    "photoManquante": "Il manque encore une photo de ta réalisation ; ajoute-la avant de demander sa validation.",
    "dureeTropLongue": "La durée totale dépasse le temps prévu ; ajuste le déroulé avec les autres groupes."
  }
});
