// Classe fictive pour découvrir l'outil sans dossier (rien n'est enregistré). Personnages inventés.
// Contenu rédigé avec ChatGPT (tâche C3), converti au format du stockage (un élément par fichier).
definirDemo({
  "equipe": {
    "id": "demo",
    "nom": "3Z9 (classe fictive)",
    "depots": [
      "3Z9"
    ]
  },
  "elements": [
    {
      "collection": "equipe",
      "id": "reglages",
      "valeur": {
        "seanceActuelle": 3,
        "dureeJeu": 60,
        "nombreSeances": 10
      }
    },
    {
      "collection": "annonces",
      "id": "a1",
      "valeur": {
        "texte": "Séance 3 : prise en main du kit. Apportez vos croquis.",
        "epinglee": true
      }
    },
    {
      "collection": "annonces",
      "id": "a2",
      "valeur": {
        "texte": "L'histoire a une première version : relisez-la avant mardi."
      }
    },
    {
      "collection": "histoire",
      "id": "titre",
      "valeur": {
        "titre": "Titre",
        "texte": "Le réveil de la station Aurore"
      }
    },
    {
      "collection": "histoire",
      "id": "theme",
      "valeur": {
        "titre": "Thème",
        "texte": "Exploration et coopération dans une station scientifique imaginaire."
      }
    },
    {
      "collection": "histoire",
      "id": "pitch",
      "valeur": {
        "titre": "Résumé",
        "texte": "La station Aurore s’est mise en veille. En 60 minutes, les joueurs doivent retrouver cinq fragments d’un protocole pour rallumer sa balise."
      }
    },
    {
      "collection": "histoire",
      "id": "personnages",
      "valeur": {
        "titre": "Personnages",
        "texte": "Les joueurs sont une équipe de maintenance. Un gardien de la station les guide à distance."
      }
    },
    {
      "collection": "histoire",
      "id": "lieu",
      "valeur": {
        "titre": "Lieu",
        "texte": "Le foyer représente les cinq postes de la station."
      }
    },
    {
      "collection": "histoire",
      "id": "deroulement",
      "valeur": {
        "titre": "Déroulement",
        "texte": "Les cinq postes se visitent dans l’ordre de la frise. Chaque boîte transmet un élément utile au poste suivant."
      }
    },
    {
      "collection": "histoire",
      "id": "fin",
      "valeur": {
        "titre": "Fin",
        "texte": "Les cinq fragments réunis permettent de demander le réveil de la balise. La réalisation du final reste à concevoir."
      }
    },
    {
      "collection": "frise",
      "id": "ordre",
      "valeur": {
        "ordre": [
          "A",
          "B",
          "C",
          "D",
          "E"
        ]
      }
    },
    {
      "collection": "frise",
      "id": "debut",
      "valeur": {
        "texte": "Le gardien confie la mission et présente le premier poste."
      }
    },
    {
      "collection": "frise",
      "id": "fin",
      "valeur": {
        "texte": "Assembler les cinq fragments et lire le protocole. Final à tester."
      }
    },
    {
      "collection": "liaisons",
      "id": "A-B",
      "valeur": {
        "donne": "Fragment 1 et indication vers le poste suivant.",
        "utilise": "À préciser par les deux groupes.",
        "lieu": "Poste 2"
      }
    },
    {
      "collection": "liaisons",
      "id": "B-C",
      "valeur": {
        "donne": "Fragment 2 et indication vers le poste suivant.",
        "utilise": "À préciser par les deux groupes.",
        "lieu": "Poste 3"
      }
    },
    {
      "collection": "liaisons",
      "id": "C-D",
      "valeur": {
        "donne": "Fragment 3 et indication vers le poste suivant.",
        "utilise": "À préciser par les deux groupes.",
        "lieu": "Poste 4"
      }
    },
    {
      "collection": "liaisons",
      "id": "D-E",
      "valeur": {
        "donne": "Fragment 4 et indication vers le poste suivant.",
        "utilise": "À préciser par les deux groupes.",
        "lieu": "Poste 5"
      }
    },
    {
      "collection": "groupes",
      "id": "A",
      "valeur": {
        "nom": "Le plan des réserves",
        "depotOrigine": "3Z9",
        "membres": [
          {
            "prenom": "Zéluno",
            "role": "chef de projet"
          },
          {
            "prenom": "Maérix",
            "role": "programmeur"
          },
          {
            "prenom": "Soléva",
            "role": "designer/constructeur"
          },
          {
            "prenom": "Noryl",
            "role": "rédacteur/reporter"
          }
        ],
        "mecanique": "damier",
        "cadenas": {
          "type": "À attribuer par Thomas",
          "code": ""
        },
        "enigme": {
          "titre": "Le plan des réserves",
          "roleHistoire": "Retrouver le fragment 1 du protocole de réveil.",
          "scenario": "Les joueurs découvrent un poste abandonné et un message incomplet.",
          "solution": "",
          "contenuBoite": "Un fragment du protocole pour la suite.",
          "duree": 12,
          "difficulte": 2,
          "matiere": "Mathématiques",
          "lienMatiere": "Nous utilisons le repérage sur une grille. Les coordonnées permettent de placer les pions."
        },
        "fonctionnement": "Notre piste : Un document donne des coordonnées sur une grille. Les pions placés sur ces cases dessinent une lettre. Les détails restent à tester.",
        "materiel": [
          {
            "element": "Rapport ou feuille de formules et grille.",
            "quantite": 1,
            "origine": "creer",
            "machine": "À choisir avec Thomas",
            "responsable": "Soléva",
            "etat": "en cours"
          }
        ],
        "fabrication": {
          "M1": {
            "description": "Créer un rapport illustré et une grille dans Canva.",
            "fichiers": [],
            "etat": "en cours",
            "valideProf": false
          },
          "M2": {
            "description": "Fabriquer un plateau et des pions en carton, PVC ou impression 3D.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          },
          "M3": {
            "description": "Fabriquer une boîte qui contient un élément pour la suite.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          }
        },
        "electronique": {
          "carte": "uno",
          "capteurs": [],
          "actionneurs": [],
          "role": "À concevoir : valider, déclencher ou révéler un élément nécessaire au jeu.",
          "cablage": {
            "composants": [],
            "branchements": []
          },
          "etat": "à faire"
        },
        "indices": {
          "n1": {
            "texte": "Regardez les repères au bord de la grille.",
            "talkie": "Regardez les repères au bord de la grille."
          },
          "n2": {
            "texte": "",
            "talkie": ""
          },
          "n3": {
            "texte": "",
            "talkie": ""
          }
        },
        "installation": {
          "etapes": [
            "Poser les documents et le support sur le poste prévu."
          ],
          "remiseAZero": [],
          "verifs": []
        },
        "avis": [],
        "journal": [
          {
            "seance": 1,
            "texte": "Nous avons choisi une piste. Il reste à écrire la solution et à tester le prototype."
          }
        ],
        "jalons": {
          "mecanique": {
            "etat": "à faire",
            "valide": false
          },
          "scenario": {
            "etat": "en cours",
            "valide": false
          },
          "materiel": {
            "etat": "fait",
            "valide": false
          },
          "matiere": {
            "etat": "fait",
            "valide": false
          },
          "choixE1": {
            "etat": "à faire",
            "valide": false
          },
          "cablage": {
            "etat": "à faire",
            "valide": false
          },
          "programme": {
            "etat": "à faire",
            "valide": false
          },
          "indices": {
            "etat": "en cours",
            "valide": false
          },
          "installation": {
            "etat": "en cours",
            "valide": false
          },
          "test": {
            "etat": "à faire",
            "valide": false
          },
          "M1": {
            "etat": "en cours",
            "valide": false
          },
          "M2": {
            "etat": "en cours",
            "valide": false
          },
          "M3": {
            "etat": "en cours",
            "valide": false
          }
        }
      }
    },
    {
      "collection": "groupes",
      "id": "B",
      "valeur": {
        "nom": "Les archives transparentes",
        "depotOrigine": "3Z9",
        "membres": [
          {
            "prenom": "Tavilo",
            "role": "chef de projet"
          },
          {
            "prenom": "Luména",
            "role": "programmeur"
          },
          {
            "prenom": "Orévik",
            "role": "designer/constructeur"
          },
          {
            "prenom": "Ysélia",
            "role": "rédacteur/reporter"
          }
        ],
        "mecanique": "calques",
        "cadenas": {
          "type": "À attribuer par Thomas",
          "code": ""
        },
        "enigme": {
          "titre": "Les archives transparentes",
          "roleHistoire": "Retrouver le fragment 2 du protocole de réveil.",
          "scenario": "Les joueurs découvrent un poste abandonné et un message incomplet.",
          "solution": "",
          "contenuBoite": "Un fragment du protocole pour la suite.",
          "duree": 12,
          "difficulte": 2,
          "matiere": "Arts plastiques",
          "lienMatiere": "Nous travaillons la composition d’une image. Chaque transparent contient une partie du message."
        },
        "fonctionnement": "Notre piste : Des feuilles transparentes portent chacune une partie du message. Superposées dans le bon sens, elles révèlent un code. Les détails restent à tester.",
        "materiel": [
          {
            "element": "Calques imprimés.",
            "quantite": 1,
            "origine": "creer",
            "machine": "À choisir avec Thomas",
            "responsable": "Orévik",
            "etat": "en cours"
          }
        ],
        "fabrication": {
          "M1": {
            "description": "Dessiner les parties du message à imprimer sur transparent.",
            "fichiers": [],
            "etat": "en cours",
            "valideProf": false
          },
          "M2": {
            "description": "Fabriquer un cadre qui aide à aligner les calques.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          },
          "M3": {
            "description": "Prévoir une boîte à cadenas contenant la suite.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          }
        },
        "electronique": {
          "carte": "uno",
          "capteurs": [],
          "actionneurs": [],
          "role": "À concevoir : valider, déclencher ou révéler un élément nécessaire au jeu.",
          "cablage": {
            "composants": [],
            "branchements": []
          },
          "etat": "à faire"
        },
        "indices": {
          "n1": {
            "texte": "Cherchez les feuilles qui laissent passer la lumière.",
            "talkie": "Cherchez les feuilles qui laissent passer la lumière."
          },
          "n2": {
            "texte": "",
            "talkie": ""
          },
          "n3": {
            "texte": "",
            "talkie": ""
          }
        },
        "installation": {
          "etapes": [
            "Poser les documents et le support sur le poste prévu."
          ],
          "remiseAZero": [],
          "verifs": []
        },
        "avis": [],
        "journal": [
          {
            "seance": 1,
            "texte": "Nous avons choisi une piste. Il reste à écrire la solution et à tester le prototype."
          }
        ],
        "jalons": {
          "mecanique": {
            "etat": "à faire",
            "valide": false
          },
          "scenario": {
            "etat": "en cours",
            "valide": false
          },
          "materiel": {
            "etat": "fait",
            "valide": false
          },
          "matiere": {
            "etat": "fait",
            "valide": false
          },
          "choixE1": {
            "etat": "à faire",
            "valide": false
          },
          "cablage": {
            "etat": "à faire",
            "valide": false
          },
          "programme": {
            "etat": "à faire",
            "valide": false
          },
          "indices": {
            "etat": "en cours",
            "valide": false
          },
          "installation": {
            "etat": "en cours",
            "valide": false
          },
          "test": {
            "etat": "à faire",
            "valide": false
          },
          "M1": {
            "etat": "en cours",
            "valide": false
          },
          "M2": {
            "etat": "en cours",
            "valide": false
          },
          "M3": {
            "etat": "en cours",
            "valide": false
          }
        }
      }
    },
    {
      "collection": "groupes",
      "id": "C",
      "valeur": {
        "nom": "Le carnet des expéditions",
        "depotOrigine": "3Z9",
        "membres": [
          {
            "prenom": "Pavélo",
            "role": "chef de projet"
          },
          {
            "prenom": "Ryméa",
            "role": "programmeur"
          },
          {
            "prenom": "Névilo",
            "role": "designer/constructeur"
          },
          {
            "prenom": "Azélis",
            "role": "rédacteur/reporter"
          }
        ],
        "mecanique": "relier-points",
        "cadenas": {
          "type": "À attribuer par Thomas",
          "code": ""
        },
        "enigme": {
          "titre": "Le carnet des expéditions",
          "roleHistoire": "Retrouver le fragment 3 du protocole de réveil.",
          "scenario": "Les joueurs découvrent un poste abandonné et un message incomplet.",
          "solution": "",
          "contenuBoite": "Un fragment du protocole pour la suite.",
          "duree": 12,
          "difficulte": 2,
          "matiere": "Géographie",
          "lienMatiere": "Nous repérons des pays sur une carte. Leur position permet de construire un trajet."
        },
        "fonctionnement": "Notre piste : Quatre passeports donnent des listes de pays à retrouver sur une carte. Les trajets tracés font apparaître des formes dont le sens reste à confirmer. Les détails restent à tester.",
        "materiel": [
          {
            "element": "Carte et passeports.",
            "quantite": 1,
            "origine": "creer",
            "machine": "À choisir avec Thomas",
            "responsable": "Névilo",
            "etat": "en cours"
          }
        ],
        "fabrication": {
          "M1": {
            "description": "Créer une carte lisible et les passeports dans Canva.",
            "fichiers": [],
            "etat": "en cours",
            "valideProf": false
          },
          "M2": {
            "description": "Fabriquer un panneau avec des points et des fils.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          },
          "M3": {
            "description": "Fabriquer une boîte qui transmet un élément à la suite.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          }
        },
        "electronique": {
          "carte": "uno",
          "capteurs": [],
          "actionneurs": [],
          "role": "À concevoir : valider, déclencher ou révéler un élément nécessaire au jeu.",
          "cablage": {
            "composants": [],
            "branchements": []
          },
          "etat": "à faire"
        },
        "indices": {
          "n1": {
            "texte": "Comparez un passeport avec la carte.",
            "talkie": "Comparez un passeport avec la carte."
          },
          "n2": {
            "texte": "",
            "talkie": ""
          },
          "n3": {
            "texte": "",
            "talkie": ""
          }
        },
        "installation": {
          "etapes": [
            "Poser les documents et le support sur le poste prévu."
          ],
          "remiseAZero": [],
          "verifs": []
        },
        "avis": [],
        "journal": [
          {
            "seance": 1,
            "texte": "Nous avons choisi une piste. Il reste à écrire la solution et à tester le prototype."
          }
        ],
        "jalons": {
          "mecanique": {
            "etat": "à faire",
            "valide": false
          },
          "scenario": {
            "etat": "en cours",
            "valide": false
          },
          "materiel": {
            "etat": "fait",
            "valide": false
          },
          "matiere": {
            "etat": "fait",
            "valide": false
          },
          "choixE1": {
            "etat": "à faire",
            "valide": false
          },
          "cablage": {
            "etat": "à faire",
            "valide": false
          },
          "programme": {
            "etat": "à faire",
            "valide": false
          },
          "indices": {
            "etat": "en cours",
            "valide": false
          },
          "installation": {
            "etat": "en cours",
            "valide": false
          },
          "test": {
            "etat": "à faire",
            "valide": false
          },
          "M1": {
            "etat": "en cours",
            "valide": false
          },
          "M2": {
            "etat": "en cours",
            "valide": false
          },
          "M3": {
            "etat": "en cours",
            "valide": false
          }
        }
      }
    },
    {
      "collection": "groupes",
      "id": "D",
      "valeur": {
        "nom": "Le signal du phare",
        "depotOrigine": "3Z9",
        "membres": [
          {
            "prenom": "Coréno",
            "role": "chef de projet"
          },
          {
            "prenom": "Vélya",
            "role": "programmeur"
          },
          {
            "prenom": "Daxilo",
            "role": "designer/constructeur"
          },
          {
            "prenom": "Myréva",
            "role": "rédacteur/reporter"
          }
        ],
        "mecanique": "morse",
        "cadenas": {
          "type": "À attribuer par Thomas",
          "code": ""
        },
        "enigme": {
          "titre": "Le signal du phare",
          "roleHistoire": "Retrouver le fragment 4 du protocole de réveil.",
          "scenario": "Les joueurs découvrent un poste abandonné et un message incomplet.",
          "solution": "",
          "contenuBoite": "Un fragment du protocole pour la suite.",
          "duree": 12,
          "difficulte": 2,
          "matiere": "Français",
          "lienMatiere": "Nous écrivons une devinette. Ses indices doivent conduire à un mot précis."
        },
        "fonctionnement": "Notre piste : Une devinette donne un mot à transmettre en morse. Le joueur utilise un bouton pour les signaux courts et un autre pour les longs. Les détails restent à tester.",
        "materiel": [
          {
            "element": "Devinette et alphabet.",
            "quantite": 1,
            "origine": "creer",
            "machine": "À choisir avec Thomas",
            "responsable": "Daxilo",
            "etat": "en cours"
          }
        ],
        "fabrication": {
          "M1": {
            "description": "Mettre en page la devinette et l’alphabet.",
            "fichiers": [],
            "etat": "en cours",
            "valideProf": false
          },
          "M2": {
            "description": "Fabriquer un boîtier où les deux boutons sont faciles à distinguer.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          },
          "M3": {
            "description": "Fabriquer une boîte à cadenas avec un élément de liaison.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          }
        },
        "electronique": {
          "carte": "uno",
          "capteurs": [],
          "actionneurs": [],
          "role": "À concevoir : valider, déclencher ou révéler un élément nécessaire au jeu.",
          "cablage": {
            "composants": [],
            "branchements": []
          },
          "etat": "à faire"
        },
        "indices": {
          "n1": {
            "texte": "La devinette donne le mot ; la feuille explique comment le transmettre.",
            "talkie": "La devinette donne le mot ; la feuille explique comment le transmettre."
          },
          "n2": {
            "texte": "",
            "talkie": ""
          },
          "n3": {
            "texte": "",
            "talkie": ""
          }
        },
        "installation": {
          "etapes": [
            "Poser les documents et le support sur le poste prévu."
          ],
          "remiseAZero": [],
          "verifs": []
        },
        "avis": [],
        "journal": [
          {
            "seance": 1,
            "texte": "Nous avons choisi une piste. Il reste à écrire la solution et à tester le prototype."
          }
        ],
        "jalons": {
          "mecanique": {
            "etat": "à faire",
            "valide": false
          },
          "scenario": {
            "etat": "en cours",
            "valide": false
          },
          "materiel": {
            "etat": "fait",
            "valide": false
          },
          "matiere": {
            "etat": "fait",
            "valide": false
          },
          "choixE1": {
            "etat": "à faire",
            "valide": false
          },
          "cablage": {
            "etat": "à faire",
            "valide": false
          },
          "programme": {
            "etat": "à faire",
            "valide": false
          },
          "indices": {
            "etat": "en cours",
            "valide": false
          },
          "installation": {
            "etat": "en cours",
            "valide": false
          },
          "test": {
            "etat": "à faire",
            "valide": false
          },
          "M1": {
            "etat": "en cours",
            "valide": false
          },
          "M2": {
            "etat": "en cours",
            "valide": false
          },
          "M3": {
            "etat": "en cours",
            "valide": false
          }
        }
      }
    },
    {
      "collection": "groupes",
      "id": "E",
      "valeur": {
        "nom": "Le message des gardiens",
        "depotOrigine": "3Z9",
        "membres": [
          {
            "prenom": "Taléno",
            "role": "chef de projet"
          },
          {
            "prenom": "Osélia",
            "role": "programmeur"
          },
          {
            "prenom": "Zavilo",
            "role": "designer/constructeur"
          },
          {
            "prenom": "Nuréa",
            "role": "rédacteur/reporter"
          }
        ],
        "mecanique": "langue-signes",
        "cadenas": {
          "type": "À attribuer par Thomas",
          "code": ""
        },
        "enigme": {
          "titre": "Le message des gardiens",
          "roleHistoire": "Retrouver le fragment 5 du protocole de réveil.",
          "scenario": "Les joueurs découvrent un poste abandonné et un message incomplet.",
          "solution": "",
          "contenuBoite": "Un fragment du protocole pour la suite.",
          "duree": 12,
          "difficulte": 2,
          "matiere": "Français",
          "lienMatiere": "Nous comparons plusieurs façons de transmettre un message. Nous distinguons le texte et la référence en signes, à vérifier."
        },
        "fonctionnement": "Notre piste : Un message présenté en signes doit être décodé avec une fiche de référence. Le contenu exact des documents et de la vidéo du Drive reste à confirmer. Les détails restent à tester.",
        "materiel": [
          {
            "element": "Cartes et fiche de référence.",
            "quantite": 1,
            "origine": "creer",
            "machine": "À choisir avec Thomas",
            "responsable": "Zavilo",
            "etat": "en cours"
          }
        ],
        "fabrication": {
          "M1": {
            "description": "Créer des cartes et une fiche lisibles avec des signes vérifiés.",
            "fichiers": [],
            "etat": "en cours",
            "valideProf": false
          },
          "M2": {
            "description": "Fabriquer un support qui laisse les mains visibles sur les images.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          },
          "M3": {
            "description": "Fabriquer une boîte à cadenas contenant la suite.",
            "fichiers": [],
            "etat": "à faire",
            "valideProf": false
          }
        },
        "electronique": {
          "carte": "uno",
          "capteurs": [],
          "actionneurs": [],
          "role": "À concevoir : valider, déclencher ou révéler un élément nécessaire au jeu.",
          "cablage": {
            "composants": [],
            "branchements": []
          },
          "etat": "à faire"
        },
        "indices": {
          "n1": {
            "texte": "Cherchez la fiche qui permet de comparer les gestes.",
            "talkie": "Cherchez la fiche qui permet de comparer les gestes."
          },
          "n2": {
            "texte": "",
            "talkie": ""
          },
          "n3": {
            "texte": "",
            "talkie": ""
          }
        },
        "installation": {
          "etapes": [
            "Poser les documents et le support sur le poste prévu."
          ],
          "remiseAZero": [],
          "verifs": []
        },
        "avis": [],
        "journal": [
          {
            "seance": 1,
            "texte": "Nous avons choisi une piste. Il reste à écrire la solution et à tester le prototype."
          }
        ],
        "jalons": {
          "mecanique": {
            "etat": "à faire",
            "valide": false
          },
          "scenario": {
            "etat": "en cours",
            "valide": false
          },
          "materiel": {
            "etat": "fait",
            "valide": false
          },
          "matiere": {
            "etat": "fait",
            "valide": false
          },
          "choixE1": {
            "etat": "à faire",
            "valide": false
          },
          "cablage": {
            "etat": "à faire",
            "valide": false
          },
          "programme": {
            "etat": "à faire",
            "valide": false
          },
          "indices": {
            "etat": "en cours",
            "valide": false
          },
          "installation": {
            "etat": "en cours",
            "valide": false
          },
          "test": {
            "etat": "à faire",
            "valide": false
          },
          "M1": {
            "etat": "en cours",
            "valide": false
          },
          "M2": {
            "etat": "en cours",
            "valide": false
          },
          "M3": {
            "etat": "en cours",
            "valide": false
          }
        }
      }
    },
    {
      "collection": "jourj-taches",
      "id": "ldemo1",
      "valeur": {
        "tache": "Demander une date et l’accord de la direction.",
        "responsable": "À désigner",
        "etat": "à faire",
        "ordre": 1
      }
    },
    {
      "collection": "bibliotheque",
      "id": "bdemo1",
      "valeur": {
        "type": "note",
        "titre": "Ambiance sonore de la station",
        "texte": "- Bip régulier de la balise\n- Grésillement radio quand un poste se rallume",
        "etiquettes": [
          "son",
          "décor"
        ],
        "groupe": ""
      }
    },
    {
      "collection": "bibliotheque",
      "id": "bdemo2",
      "valeur": {
        "type": "lien",
        "titre": "Modèle d’affiche Canva",
        "url": "https://www.canva.com/",
        "texte": "Modèle commun pour les documents à imprimer.",
        "etiquettes": [
          "image",
          "règle"
        ],
        "groupe": ""
      }
    },
    {
      "collection": "bibliotheque",
      "id": "bdemo3",
      "valeur": {
        "type": "note",
        "titre": "Idée de cadre pour les calques",
        "texte": "Un cadre en carton avec deux encoches pour aligner les feuilles.",
        "etiquettes": [
          "technique"
        ],
        "groupe": "B"
      }
    },
    {
      "collection": "jourj-roles",
      "id": "rdemo1",
      "valeur": {
        "role": "Game Master",
        "eleve": "Zéluno",
        "texte": "Équipe de maintenance, je vous écoute.",
        "etat": "écrit",
        "ordre": 1
      }
    }
  ]
});
