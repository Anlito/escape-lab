// Bibliothèque de composants pour l'atelier de câblage (brief §11.1) : gabarits rédigés avec ChatGPT (tâche C2).
// Rien n'est déduit : chaque « ⚠️ à vérifier » attend la fiche technique du composant réel et la validation du professeur.
// Pas encore chargé par l'application (étape 9).
definirComposants({
  "format": "escape-lab/composants",
  "version": 1,
  "composants": [
    {
      "id": "servomoteur",
      "nom": "Servomoteur",
      "type": "actionneur",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "ils",
      "nom": "Capteur magnétique (ILS)",
      "type": "capteur",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "potentiometre",
      "nom": "Potentiomètre",
      "type": "capteur",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "relais",
      "nom": "Relais (module à SRD-05VDC-SL-C)",
      "type": "actionneur",
      "broches": [
        {
          "nom": "VCC",
          "role": "Alimentation 5 V de la bobine du relais."
        },
        {
          "nom": "GND",
          "role": "Masse, reliée au GND de la carte."
        },
        {
          "nom": "IN (ou S)",
          "role": "Ordre de la carte : HAUT = relais enclenché (sens à vérifier à la recette)."
        },
        {
          "nom": "COM",
          "role": "Côté puissance : commun, relié à l’alimentation séparée de l’actionneur."
        },
        {
          "nom": "NO",
          "role": "Côté puissance : relié à COM seulement quand le relais est enclenché."
        },
        {
          "nom": "NC",
          "role": "Côté puissance : relié à COM quand le relais est au repos. Pas utilisé ici."
        }
      ],
      "tension": "Commande en 5 V. Côté puissance : 12 V au plus pour l’électro-aimant ou le bandeau LED, avec leur propre alimentation.",
      "cablageType": [
        "Côté carte : IN sur une broche numérique (D2 à D13), au choix de l’équipe ; VCC et GND sur les rails.",
        "Côté puissance : l’alimentation séparée passe par COM et NO pour aller à l’actionneur (électro-aimant, bandeau LED). Le professeur fait ou vérifie ce câblage.",
        "Dans Labo Blocs : bloc « activer / désactiver le relais … », avec la même broche."
      ],
      "precautions": [
        "Règle de sécurité : alimentation 12 V séparée, commande par relais ; jamais de 12 V sur la carte ni sur la platine. Le professeur valide avant toute mise sous tension.",
        "Débrancher l’alimentation 12 V avant de toucher aux bornes COM, NO et NC.",
        "Électro-aimant : une diode de roue libre est nécessaire à ses bornes ; ⚠️ à vérifier sur le montage réel."
      ],
      "lies": [
        "electroaimant"
      ],
      "source": "Relais confirmé par Thomas le 16/11/2026 (SRD-05VDC-SL-C) ; Labo Blocs (HAUT = enclenché, à vérifier à la recette 29.8)."
    },
    {
      "id": "electroaimant",
      "nom": "Électro-aimant 12 V — référence à confirmer",
      "type": "actionneur",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique.",
        "Règle de sécurité : alimentation 12 V séparée, commande par relais ; jamais de 12 V sur la carte ni sur la platine. Le professeur valide avant toute mise sous tension. Diode, courant et protections : ⚠️ à vérifier sur les références réelles."
      ],
      "lies": [
        "relais"
      ],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "clavier-membrane",
      "nom": "Clavier membrane 3×4 — Semageek 473",
      "type": "saisie",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique.",
        "Référence 473 ; brochage et ordre des contacts non vérifiés."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "led",
      "nom": "LED",
      "type": "actionneur",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "bouton",
      "nom": "Bouton",
      "type": "capteur",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "buzzer-passif",
      "nom": "Buzzer passif",
      "type": "actionneur",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "lcd",
      "nom": "Écran LCD",
      "type": "afficheur",
      "broches": [
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : référence et brochage du composant réel."
        }
      ],
      "tension": "⚠️ à vérifier",
      "cablageType": [
        "⚠️ à vérifier : fiche technique du modèle réel nécessaire avant de renseigner un branchement."
      ],
      "precautions": [
        "⚠️ à vérifier : caractéristiques et conditions d’utilisation à relever sur la fiche technique."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
    },
    {
      "id": "clavier-grove",
      "nom": "Clavier tactile 12 touches (ATtiny1616) V1.0 — Grove 101020636",
      "fils": [
        {
          "nom": "GND",
          "role": "gnd"
        },
        {
          "nom": "VCC",
          "role": "vcc"
        },
        {
          "nom": "RX",
          "role": "signal"
        },
        {
          "nom": "TX",
          "role": "signal"
        }
      ],
      "type": "saisie",
      "broches": [
        {
          "nom": "GND",
          "role": "Masse, reliée au GND de la carte."
        },
        {
          "nom": "VCC",
          "role": "Alimentation."
        },
        {
          "nom": "RX",
          "role": "Réception de la liaison série : à brancher, même si Labo Blocs n’envoie rien au clavier."
        },
        {
          "nom": "TX",
          "role": "Envoie à la carte la touche appuyée (liaison série, 9600 bauds)."
        }
      ],
      "tension": "3,3 V ou 5 V (fabricant).",
      "cablageType": [
        "RX et TX sur deux broches numériques de la carte (D2 à D13), au choix de l’équipe. Pas D0 ni D1 : elles servent au câble USB.",
        "Dans Labo Blocs : blocs du clavier tactile, avec les mêmes broches RX et TX."
      ],
      "precautions": [
        "La carte garde la dernière touche appuyée jusqu’au bloc « oublier la dernière touche ».",
        "⚠️ à vérifier à la recette : les codes envoyés par le clavier réel (0xE1 à 0xEC d’après le fabricant)."
      ],
      "lies": [],
      "source": "https://wiki.seeedstudio.com/Grove-12-Channel-Capacitive-Touch-Keypad-ATtiny1616-/ ; Labo Blocs 0.4 (programme de la carte Uno) ; matériel confirmé par Thomas le 16/11/2026."
    },
    {
      "id": "afficheur-4-chiffres",
      "nom": "Afficheur 4 chiffres (CLK, DIO)",
      "type": "afficheur",
      "broches": [
        {
          "nom": "CLK",
          "role": "Horloge : rythme l’envoi des chiffres par la carte."
        },
        {
          "nom": "DIO",
          "role": "Données : les chiffres à afficher."
        },
        {
          "nom": "VCC",
          "role": "Alimentation 5 V."
        },
        {
          "nom": "GND",
          "role": "Masse, reliée au GND de la carte."
        }
      ],
      "fils": [
        {
          "nom": "CLK",
          "role": "signal"
        },
        {
          "nom": "DIO",
          "role": "signal"
        },
        {
          "nom": "VCC",
          "role": "vcc"
        },
        {
          "nom": "GND",
          "role": "gnd"
        }
      ],
      "tension": "5 V.",
      "cablageType": [
        "CLK et DIO sur deux broches numériques de la carte (D2 à D13), au choix de l’équipe.",
        "Dans Labo Blocs : bloc « afficher le nombre … sur l’afficheur 4 chiffres », avec les mêmes broches CLK et DIO."
      ],
      "precautions": [
        "Affiche les nombres entiers de -999 à 9999. Au-delà, l’afficheur montre « ---- ».",
        "Un nombre à virgule est arrondi."
      ],
      "lies": [],
      "source": "Labo Blocs 0.4 (programme de la carte Uno) ; matériel confirmé par Thomas le 16/11/2026. Afficheurs à puce TM1637."
    },
    {
      "id": "ultrason",
      "nom": "Ultrason HY-SRF05 — capteur de distance",
      "type": "capteur",
      "broches": [
        {
          "nom": "GND",
          "role": "Masse, reliée au GND de la carte."
        },
        {
          "nom": "OUT",
          "role": "Ne pas brancher : le montage utilise seulement TRIG et ECHO."
        },
        {
          "nom": "TRIG",
          "role": "Reçoit l’ordre de la carte : le capteur envoie une onde ultrason."
        },
        {
          "nom": "ECHO",
          "role": "Renvoie à la carte la durée de l’aller-retour de l’onde."
        },
        {
          "nom": "VCC",
          "role": "Alimentation 5 V."
        }
      ],
      "fils": [
        {
          "nom": "GND",
          "role": "gnd"
        },
        {
          "nom": "TRIG",
          "role": "signal"
        },
        {
          "nom": "ECHO",
          "role": "signal"
        },
        {
          "nom": "VCC",
          "role": "vcc"
        }
      ],
      "tension": "5 V.",
      "cablageType": [
        "TRIG et ECHO sur deux broches numériques de la carte (D2 à D13), au choix de l’équipe.",
        "OUT reste libre.",
        "Dans Labo Blocs : bloc « distance mesurée par l’ultrason », avec les mêmes broches TRIG et ECHO."
      ],
      "precautions": [
        "Mesure de 2 cm à 4 m environ. Sans obstacle, le bloc donne 400.",
        "Rien d’autre que l’obstacle à mesurer devant le capteur."
      ],
      "lies": [],
      "source": "Labo Blocs 0.4 (programme de la carte Uno) ; matériel confirmé par Thomas le 16/11/2026."
    },
    {
      "id": "ecran-i2c",
      "nom": "Écran LCD 16×2 I2C (SDA, SCL)",
      "type": "afficheur",
      "broches": [
        {
          "nom": "GND",
          "role": "Masse, reliée au GND de la carte."
        },
        {
          "nom": "VCC",
          "role": "Alimentation 5 V."
        },
        {
          "nom": "SDA",
          "role": "Données de la liaison I2C : toujours sur A4 de l’Uno."
        },
        {
          "nom": "SCL",
          "role": "Horloge de la liaison I2C : toujours sur A5 de l’Uno."
        }
      ],
      "fils": [
        {
          "nom": "GND",
          "role": "gnd"
        },
        {
          "nom": "VCC",
          "role": "vcc"
        },
        {
          "nom": "SDA",
          "role": "signal"
        },
        {
          "nom": "SCL",
          "role": "signal"
        }
      ],
      "tension": "5 V.",
      "cablageType": [
        "SDA sur A4 et SCL sur A5 : ce sont les broches I2C de l’Uno, elles sont imposées.",
        "Dans Labo Blocs : bloc « écrire … sur la ligne … de l’écran ». 2 lignes de 16 caractères."
      ],
      "precautions": [
        "La carte trouve seule l’adresse de l’écran (0x27 ou 0x3F).",
        "Écran allumé mais rien d’écrit : tourner doucement la petite vis du réglage de contraste, au dos.",
        "Les lettres accentuées sont écrites sans accent."
      ],
      "lies": [],
      "source": "Labo Blocs 0.4 (programme de la carte Uno) ; matériel confirmé par Thomas le 16/11/2026."
    },
    {
      "id": "capteur-mouvement",
      "nom": "Capteur de mouvement HC-SR501 (dôme blanc)",
      "type": "capteur",
      "fils": [
        {
          "nom": "VCC",
          "role": "vcc"
        },
        {
          "nom": "OUT",
          "role": "signal"
        },
        {
          "nom": "GND",
          "role": "gnd"
        }
      ],
      "broches": [
        {
          "nom": "VCC",
          "role": "Alimentation 5 V."
        },
        {
          "nom": "OUT",
          "role": "Passe à HAUT quand le capteur voit un mouvement, puis revient à BAS."
        },
        {
          "nom": "GND",
          "role": "Masse, reliée au GND de la carte."
        }
      ],
      "tension": "5 V.",
      "cablageType": [
        "OUT sur une broche numérique de la carte (D2 à D13), au choix de l’équipe.",
        "Dans Labo Blocs : bloc « le capteur de mouvement … détecte un mouvement », avec la même broche."
      ],
      "precautions": [
        "Après la mise sous tension, attendre environ une minute : le capteur se règle et peut se déclencher seul.",
        "Il voit les mouvements de chaleur (une personne, une main), pas un objet froid.",
        "Les deux vis orange règlent la distance et la durée du signal HAUT : les régler avec le professeur."
      ],
      "lies": [],
      "source": "Matériel confirmé par Thomas le 16/11/2026 ; Labo Blocs (entrée sans résistance, HAUT = mouvement)."
    }
  ]
});
