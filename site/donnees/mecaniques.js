// Mécaniques d'énigme (brief §5.2) : ébauches rédigées avec ChatGPT (tâche C1), à corriger par le professeur.
// Pistes facultatives ; les mentions « ⚠️ à confirmer » attendent la relecture des ressources du Drive.
definirMecaniques({
  "format": "escape-lab/mecaniques",
  "version": 1,
  "mecaniques": [
    {
      "id": "damier",
      "nom": "Placer-pion-damier",
      "couleur": "#8ac7ff",
      "lettre": "D",
      "resume": "Un document donne des coordonnées sur une grille. Les pions placés sur ces cases dessinent une lettre.",
      "etapesJoueur": [
        "Repérez les coordonnées utiles dans le document.",
        "Placez un pion sur chaque case indiquée.",
        "Observez la lettre formée par les pions."
      ],
      "aConcevoir": [
        "Une grille avec des repères clairs.",
        "Un document qui donne les coordonnées.",
        "Une lettre reconnaissable et sa place dans la suite du jeu."
      ],
      "formatReponse": "Une lettre. Le passage à un cadenas reste à concevoir.",
      "materiel": {
        "aCreer": [
          "Rapport ou feuille de formules et grille.",
          "Plateau et pions."
        ],
        "aTrouver": [
          "Cadenas adapté à la réponse."
        ],
        "fourni": [
          "⚠️ à confirmer : attribution du matériel par Thomas."
        ]
      },
      "pistesManuelles": {
        "M1": "Créer un rapport illustré et une grille dans Canva.",
        "M2": "Fabriquer un plateau et des pions en carton, PVC ou impression 3D.",
        "M3": "Fabriquer une boîte qui contient un élément pour la suite."
      },
      "pistesElectroniques": [
        "Piste proposée : un bouton valide la fin du placement et déclenche une révélation. Le contrôle des bonnes positions reste à concevoir et à valider."
      ],
      "pieges": [
        "Confondre ligne et colonne.",
        "Dessiner une lettre difficile à reconnaître.",
        "Prévoir une lettre sans expliquer comment elle sert ensuite."
      ],
      "indicesExemple": {
        "niveau1": "Regardez les repères au bord de la grille.",
        "niveau2": "Pour chaque coordonnée, cherchez la colonne puis la ligne. Placez les pions.",
        "niveau3": "Tous les pions sont placés : lisez la silhouette comme une lettre."
      }
    },
    {
      "id": "calques",
      "nom": "Superposition de calques",
      "couleur": "#bca7ff",
      "lettre": "C",
      "resume": "Des feuilles transparentes portent chacune une partie du message. Superposées dans le bon sens, elles révèlent un code.",
      "etapesJoueur": [
        "Rassemblez les calques.",
        "Cherchez les repères et alignez les feuilles.",
        "Lisez le code révélé."
      ],
      "aConcevoir": [
        "Les calques et leurs repères.",
        "Le sens et l’ordre de superposition, si nécessaire.",
        "Le code révélé. ⚠️ à confirmer : fonctionnement exact des exemples du Drive."
      ],
      "formatReponse": "⚠️ à confirmer : code révélé, type et longueur à choisir.",
      "materiel": {
        "aCreer": [
          "Calques imprimés.",
          "Cadre ou gabarit pour les aligner."
        ],
        "aTrouver": [
          "Feuilles transparentes et cadenas adaptés."
        ],
        "fourni": [
          "⚠️ à confirmer : attribution du matériel par Thomas."
        ]
      },
      "pistesManuelles": {
        "M1": "Dessiner les parties du message à imprimer sur transparent.",
        "M2": "Fabriquer un cadre qui aide à aligner les calques.",
        "M3": "Prévoir une boîte à cadenas contenant la suite."
      },
      "pistesElectroniques": [
        "Piste proposée : un bouton ou un capteur magnétique déclenche une révélation après manipulation.",
        "Piste du brief : lumière intégrée à la micro:bit ; choix de carte et usage du capteur à valider."
      ],
      "pieges": [
        "Alignement trop imprécis.",
        "Impression trop sombre ou trop petite.",
        "Compter sur un capteur de lumière externe dont la disponibilité reste à confirmer."
      ],
      "indicesExemple": {
        "niveau1": "Cherchez les feuilles qui laissent passer la lumière.",
        "niveau2": "Superposez-les en faisant coïncider les repères.",
        "niveau3": "Les repères sont alignés : lisez uniquement les caractères devenus complets."
      }
    },
    {
      "id": "relier-points",
      "nom": "Relier les points",
      "couleur": "#7edbc5",
      "lettre": "R",
      "resume": "Quatre passeports donnent des listes de pays à retrouver sur une carte. Les trajets tracés font apparaître des formes dont le sens reste à confirmer.",
      "etapesJoueur": [
        "Choisissez un passeport.",
        "Repérez ses pays sur la carte.",
        "Reliez-les dans l’ordre indiqué, puis observez le tracé."
      ],
      "aConcevoir": [
        "Une carte et quatre passeports A à D.",
        "Des listes de pays et un ordre de parcours clair.",
        "Une forme lisible. ⚠️ à confirmer : forme finale et principe exact du Drive."
      ],
      "formatReponse": "⚠️ à confirmer : forme obtenue, peut-être une lettre.",
      "materiel": {
        "aCreer": [
          "Carte et passeports.",
          "Panneau à points et fils ou pinces."
        ],
        "aTrouver": [
          "Cadenas adapté à la réponse."
        ],
        "fourni": [
          "⚠️ à confirmer : attribution du matériel par Thomas."
        ]
      },
      "pistesManuelles": {
        "M1": "Créer une carte lisible et les passeports dans Canva.",
        "M2": "Fabriquer un panneau avec des points et des fils.",
        "M3": "Fabriquer une boîte qui transmet un élément à la suite."
      },
      "pistesElectroniques": [
        "Piste proposée : des contacts détectent un parcours et déclenchent une révélation. Faisabilité, contacts et câblage à valider."
      ],
      "pieges": [
        "Pays difficiles à repérer sur une carte trop petite.",
        "Mélanger les trajets de plusieurs passeports.",
        "Présenter comme certaine la lettre finale des exemples non vérifiés."
      ],
      "indicesExemple": {
        "niveau1": "Comparez un passeport avec la carte.",
        "niveau2": "Retrouvez les pays du même passeport et reliez-les dans leur ordre.",
        "niveau3": "Le trajet est terminé : observez sa forme avant de passer au passeport suivant."
      }
    },
    {
      "id": "morse",
      "nom": "Morse",
      "couleur": "#ffd37f",
      "lettre": "M",
      "resume": "Une devinette donne un mot à transmettre en morse. Le joueur utilise un bouton pour les signaux courts et un autre pour les longs.",
      "etapesJoueur": [
        "Résolvez la devinette.",
        "Codez le mot avec l’alphabet fourni.",
        "Envoyez les signaux avec les deux boutons."
      ],
      "aConcevoir": [
        "Une devinette et sa réponse.",
        "Un alphabet lisible et une machine à deux boutons.",
        "Les séparations entre lettres et la réaction attendue. ⚠️ à confirmer : sens de « A vaut K » dans la ressource."
      ],
      "formatReponse": "Un mot saisi en morse. La longueur est choisie par le groupe.",
      "materiel": {
        "aCreer": [
          "Devinette et alphabet.",
          "Boîtier à deux boutons."
        ],
        "aTrouver": [
          "Boutons, LED ou buzzer et servomoteur : disponibilité à valider."
        ],
        "fourni": [
          "⚠️ à confirmer : attribution du matériel par Thomas."
        ]
      },
      "pistesManuelles": {
        "M1": "Mettre en page la devinette et l’alphabet.",
        "M2": "Fabriquer un boîtier où les deux boutons sont faciles à distinguer.",
        "M3": "Fabriquer une boîte à cadenas avec un élément de liaison."
      },
      "pistesElectroniques": [
        "Piste du brief : deux boutons, LED ou buzzer et servomoteur.",
        "Le programme reconnaît la suite court/long et déclenche une action utile au jeu. Broches et alimentation à valider."
      ],
      "pieges": [
        "Ne pas expliquer la séparation entre les lettres.",
        "Rendre la saisie trop rapide ou trop précise.",
        "Ne pas prévoir de reprise après une erreur."
      ],
      "indicesExemple": {
        "niveau1": "La devinette donne le mot ; la feuille explique comment le transmettre.",
        "niveau2": "Remplacez chaque lettre par ses points et ses traits, puis utilisez les deux boutons.",
        "niveau3": "Votre suite est prête : envoyez-la lettre par lettre, avec les séparations prévues."
      }
    },
    {
      "id": "langue-signes",
      "nom": "Langue des signes",
      "couleur": "#ffa8d5",
      "lettre": "S",
      "resume": "Un message présenté en signes doit être décodé avec une fiche de référence. Le contenu exact des documents et de la vidéo du Drive reste à confirmer.",
      "etapesJoueur": [
        "Observez les images ou la vidéo.",
        "Comparez chaque signe avec la fiche de référence.",
        "Reconstituez le message et utilisez-le."
      ],
      "aConcevoir": [
        "Un message court et une référence vérifiée.",
        "Des images ou une vidéo bien lisibles.",
        "La façon d’utiliser ou de saisir le message. ⚠️ à confirmer : ressources du Drive à relire."
      ],
      "formatReponse": "⚠️ à confirmer : lettre, mot ou message selon la ressource validée.",
      "materiel": {
        "aCreer": [
          "Cartes et fiche de référence.",
          "Support ou chevalet."
        ],
        "aTrouver": [
          "Ressources de signes validées par Thomas : ⚠️ à confirmer."
        ],
        "fourni": [
          "⚠️ à confirmer : attribution du matériel par Thomas."
        ]
      },
      "pistesManuelles": {
        "M1": "Créer des cartes et une fiche lisibles avec des signes vérifiés.",
        "M2": "Fabriquer un support qui laisse les mains visibles sur les images.",
        "M3": "Fabriquer une boîte à cadenas contenant la suite."
      },
      "pistesElectroniques": [
        "Piste proposée : un dispositif de saisie et un actionneur révèlent la suite après décodage. Modèle et programme à valider."
      ],
      "pieges": [
        "Utiliser un signe sans l’avoir vérifié.",
        "Images inversées ou doigts masqués.",
        "Diffuser des images de personnes sans validation des conditions d’utilisation."
      ],
      "indicesExemple": {
        "niveau1": "Cherchez la fiche qui permet de comparer les gestes.",
        "niveau2": "Comparez les signes un par un et notez le message dans leur ordre.",
        "niveau3": "Le message est reconstitué : utilisez-le sur le dispositif indiqué."
      }
    },
    {
      "id": "cesar",
      "nom": "Code César — secours",
      "couleur": "#d5dc8a",
      "lettre": "Z",
      "resume": "Une lettre de consigne explique un décalage dans l’alphabet. Le joueur utilise cette clé pour lire les mots chiffrés d’une seconde lettre.",
      "etapesJoueur": [
        "Lisez la consigne pour trouver le décalage.",
        "Repérez les mots chiffrés.",
        "Décalez les lettres dans le sens du décodage."
      ],
      "aConcevoir": [
        "Une lettre de consigne et une lettre avec des mots chiffrés.",
        "Un disque ou une règle de correspondance.",
        "Le message final et son usage dans le jeu."
      ],
      "formatReponse": "Des mots décodés. Le code final et son format restent à concevoir.",
      "materiel": {
        "aCreer": [
          "Deux lettres et alphabets.",
          "Disque de chiffrement."
        ],
        "aTrouver": [
          "Cadenas adapté à la réponse."
        ],
        "fourni": [
          "⚠️ à confirmer : attribution du matériel par Thomas."
        ]
      },
      "pistesManuelles": {
        "M1": "Mettre en page les deux lettres dans Canva.",
        "M2": "Fabriquer un disque de chiffrement avec deux alphabets mobiles.",
        "M3": "Fabriquer une boîte à cadenas contenant la suite."
      },
      "pistesElectroniques": [
        "Piste proposée : un dispositif de saisie vérifie le message et déclenche un actionneur. Matériel et prise en charge Labo Blocs à valider."
      ],
      "pieges": [
        "Décaler dans le sens du chiffrement au lieu de décoder.",
        "Oublier le retour au début de l’alphabet.",
        "Ne pas fixer la règle pour les accents et les espaces."
      ],
      "indicesExemple": {
        "niveau1": "La première lettre contient la clé de lecture.",
        "niveau2": "Alignez les deux alphabets selon la consigne ; remplacez chaque lettre chiffrée.",
        "niveau3": "Pour l’exemple du brief, reculez de cinq lettres. Il reste à lire les mots décodés."
      }
    }
  ]
});
