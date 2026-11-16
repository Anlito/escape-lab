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
      "nom": "Relais",
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
        "electroaimant"
      ],
      "source": "⚠️ à vérifier : fiche technique du modèle réel non identifiée."
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
      "fils": [{ "nom": "GND", "role": "gnd" }, { "nom": "VCC", "role": "vcc" }, { "nom": "RX", "role": "signal" }, { "nom": "TX", "role": "signal" }],
      "type": "saisie",
      "broches": [
        {
          "nom": "RX",
          "role": "Réception de la liaison série UART."
        },
        {
          "nom": "TX",
          "role": "Émission de la liaison série UART."
        },
        {
          "nom": "⚠️ à vérifier",
          "role": "⚠️ à vérifier : repérage physique des contacts d’alimentation et de masse sur le module réel."
        }
      ],
      "tension": "3,3 V / 5 V (fabricant).",
      "cablageType": [
        "Utiliser l’interface UART du connecteur Grove à quatre contacts.",
        "⚠️ à vérifier : ordre physique des quatre contacts et affectation des broches de la carte."
      ],
      "precautions": [
        "⚠️ à vérifier : compatibilité de la liaison série avec le micrologiciel Uno de Labo Blocs.",
        "La documentation du fabricant ne vaut pas validation du câblage réel par le professeur."
      ],
      "lies": [],
      "source": "https://wiki.seeedstudio.com/Grove-12-Channel-Capacitive-Touch-Keypad-ATtiny1616-/"
    },
    {
      "id": "afficheur-4-chiffres",
      "nom": "Afficheur 4 chiffres (CLK, DIO)",
      "type": "afficheur",
      "broches": [
        {
          "nom": "CLK",
          "role": "Horloge de la liaison avec la carte."
        },
        {
          "nom": "DIO",
          "role": "Données de la liaison avec la carte."
        },
        {
          "nom": "VCC",
          "role": "Alimentation du module."
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
      "tension": "⚠️ à vérifier : à relever sur le module réel.",
      "cablageType": [
        "Brancher chaque fil indiqué dans l’ordre du tableau, sans autre broche.",
        "⚠️ à vérifier : broches de la carte à choisir avec le professeur."
      ],
      "precautions": [
        "⚠️ à vérifier : bloc correspondant dans Labo Blocs et micrologiciel Uno.",
        "La documentation du fabricant ne vaut pas validation du câblage réel par le professeur."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : référence exacte du module réel."
    },
    {
      "id": "ultrason",
      "nom": "Ultrason — capteur de distance",
      "type": "capteur",
      "broches": [
        {
          "nom": "GND",
          "role": "Masse, reliée au GND de la carte."
        },
        {
          "nom": "OUT",
          "role": "⚠️ à vérifier : rôle de cette broche sur le module réel."
        },
        {
          "nom": "TRIG",
          "role": "Déclenche l’envoi de l’onde ultrason."
        },
        {
          "nom": "ECHO",
          "role": "Renvoie la durée de l’aller-retour de l’onde."
        },
        {
          "nom": "VCC",
          "role": "Alimentation du module."
        }
      ],
      "fils": [
        {
          "nom": "GND",
          "role": "gnd"
        },
        {
          "nom": "OUT",
          "role": "signal"
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
      "tension": "⚠️ à vérifier : à relever sur le module réel.",
      "cablageType": [
        "Brancher chaque fil indiqué dans l’ordre du tableau, sans autre broche.",
        "⚠️ à vérifier : broches de la carte à choisir avec le professeur."
      ],
      "precautions": [
        "⚠️ à vérifier : bloc correspondant dans Labo Blocs et micrologiciel Uno.",
        "⚠️ à vérifier : la broche OUT est-elle à brancher sur ce module ?",
        "La documentation du fabricant ne vaut pas validation du câblage réel par le professeur."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : référence exacte du module réel."
    },
    {
      "id": "ecran-i2c",
      "nom": "Écran I2C (SDA, SCL)",
      "type": "afficheur",
      "broches": [
        {
          "nom": "GND",
          "role": "Masse, reliée au GND de la carte."
        },
        {
          "nom": "VCC",
          "role": "Alimentation du module."
        },
        {
          "nom": "SDA",
          "role": "Données de la liaison I2C."
        },
        {
          "nom": "SCL",
          "role": "Horloge de la liaison I2C."
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
      "tension": "⚠️ à vérifier : à relever sur le module réel.",
      "cablageType": [
        "Brancher chaque fil indiqué dans l’ordre du tableau, sans autre broche.",
        "⚠️ à vérifier : broches de la carte à choisir avec le professeur."
      ],
      "precautions": [
        "⚠️ à vérifier : bloc correspondant dans Labo Blocs et micrologiciel Uno.",
        "⚠️ à vérifier : adresse I2C de l’écran réel.",
        "La documentation du fabricant ne vaut pas validation du câblage réel par le professeur."
      ],
      "lies": [],
      "source": "⚠️ à vérifier : référence exacte du module réel."
    }
  ]
});
