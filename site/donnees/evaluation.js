// C6 — Proposition éditoriale à valider par Thomas ; aucun enregistrement de notes.
// Intitulés officiels : BO n° 9 du 29 février 2024, annexe, pages imprimées 10 et 15.
// https://www.education.gouv.fr/media/160767/download
// C4/C7/C8/C9 : repères de correspondance du brief, pas une numérotation citée du BO.
// Correspondances et coefficients proposés : ils ne sont pas prescrits par le programme.
(function () {
  const competences = {
  "C4": "Décrire et caractériser l’organisation interne d’un objet ou d’un système technique et ses échanges avec son environnement (énergies, données)",
  "C7": "Imaginer, concevoir et réaliser une ou des solutions en réponse à un besoin, à des exigences (de développement durable, par exemple) ou à la nécessité d’améliorations dans une démarche de créativité",
  "C8": "Valider les solutions techniques par des simulations ou par des protocoles de tests",
  "C9": "Concevoir, écrire, tester et mettre au point un programme",
  "transversal": "Transversal — sans rattachement à une compétence de fin de cycle"
};
  definirEvaluation({
  "format": "escape-lab/evaluation",
  "version": 1,
  "niveaux": [
    {
      "id": "n1",
      "lettre": "A",
      "libelle": "Premiers éléments",
      "points": 0
    },
    {
      "id": "n2",
      "lettre": "B",
      "libelle": "En progression",
      "points": 1
    },
    {
      "id": "n3",
      "lettre": "C",
      "libelle": "Attendus atteints",
      "points": 2
    },
    {
      "id": "n4",
      "lettre": "D",
      "libelle": "Attendus approfondis",
      "points": 3
    }
  ],
  "criteres": [
    {
      "id": "fiche-enigme",
      "bloc": "Livrables",
      "intitule": "F1 — Fiche énigme, indices et installation",
      "portee": "groupe",
      "coefficient": 2,
      "competence": competences.C7,
      "descripteurs": {
        "n1": "La fiche est commencée ; les étapes, indices et consignes d’installation restent à préciser.",
        "n2": "Le déroulement est compréhensible ; certains indices ou gestes de remise à zéro restent à compléter.",
        "n3": "La fiche décrit le déroulement, trois indices progressifs, l’installation et la remise à zéro.",
        "n4": "Un autre groupe utilise la fiche sans explication supplémentaire ; les ambiguïtés repérées sont corrigées."
      }
    },
    {
      "id": "documents",
      "bloc": "Livrables",
      "intitule": "M1 — Documents imprimés et personnalisés",
      "portee": "groupe",
      "coefficient": 1,
      "competence": competences.C7,
      "descripteurs": {
        "n1": "Les documents sont esquissés ; leur contenu et leur usage restent à définir.",
        "n2": "Les documents sont créés ; la lisibilité ou la cohérence avec l’histoire reste à améliorer.",
        "n3": "Les documents sont lisibles, personnalisés, exportés et utilisables dans l’énigme.",
        "n4": "Les documents sont essayés par un autre groupe puis améliorés ; leurs fichiers restent faciles à retrouver."
      }
    },
    {
      "id": "objet",
      "bloc": "Livrables",
      "intitule": "M2 — Objet utile à la résolution",
      "portee": "groupe",
      "coefficient": 1,
      "competence": competences.C7,
      "descripteurs": {
        "n1": "Une idée d’objet est présentée ; sa fabrication reste à engager.",
        "n2": "Un prototype existe ; son usage demande encore une aide ou des ajustements.",
        "n3": "L’objet fabriqué permet l’action attendue et respecte les contraintes validées.",
        "n4": "L’objet est testé avec des joueurs ; des ajustements documentés rendent sa manipulation plus claire."
      }
    },
    {
      "id": "systeme-cadenas",
      "bloc": "Livrables",
      "intitule": "M3 — Système à cadenas et élément transmis",
      "portee": "groupe",
      "coefficient": 1,
      "competence": competences.C7,
      "descripteurs": {
        "n1": "Le système est imaginé ; fermeture et contenu restent à préciser.",
        "n2": "Le système est fabriqué ; fermeture, accès au contenu ou remise à zéro restent à ajuster.",
        "n3": "Le système se ferme avec le cadenas attribué et contient l’élément prévu pour la suite.",
        "n4": "Ouverture et remise à zéro sont testées plusieurs fois ; l’élément transmis reste accessible comme prévu."
      }
    },
    {
      "id": "cablage",
      "bloc": "Livrables",
      "intitule": "E1 — Câblage et rôle des composants",
      "portee": "groupe",
      "coefficient": 2,
      "competence": competences.C4,
      "descripteurs": {
        "n1": "Les composants sont repérés ; leurs fonctions et leurs connexions restent à expliquer.",
        "n2": "Le groupe explique une partie des connexions ; le tableau demande encore des corrections guidées.",
        "n3": "Le tableau correspond au montage validé ; le groupe explique les rôles du capteur et de l’actionneur.",
        "n4": "Le groupe explique les échanges d’énergie et d’information et justifie les connexions avec les documents techniques."
      }
    },
    {
      "id": "programme",
      "bloc": "Livrables",
      "intitule": "E1 — Programme nécessaire au jeu",
      "portee": "groupe",
      "coefficient": 2,
      "competence": competences.C9,
      "descripteurs": {
        "n1": "Le comportement attendu est évoqué ; le programme reste à construire.",
        "n2": "Le programme réalise une partie du comportement ; des cas prévus restent à traiter.",
        "n3": "Le programme utilise un capteur et un actionneur pour valider, déclencher ou révéler un élément nécessaire.",
        "n4": "Le programme est expliqué et testé dans plusieurs situations ; les corrections et résultats sont conservés."
      }
    },
    {
      "id": "lien-matiere",
      "bloc": "Livrables",
      "intitule": "F3 — Lien expliqué avec une autre matière",
      "portee": "groupe",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "Une matière est envisagée ; la notion utilisée reste à préciser.",
        "n2": "Une notion étudiée est nommée ; son utilisation dans l’énigme reste peu expliquée.",
        "n3": "Le groupe explique une notion vue dans une autre matière et donne son usage concret dans l’énigme.",
        "n4": "Le lien est exact, expliqué clairement et réutilisé dans les documents ou manipulations proposés aux joueurs."
      }
    },
    {
      "id": "test-croise",
      "bloc": "Livrables",
      "intitule": "F2 — Test croisé et améliorations",
      "portee": "groupe",
      "coefficient": 2,
      "competence": competences.C8,
      "descripteurs": {
        "n1": "Le test reste à organiser ; les éléments à observer sont encore à choisir.",
        "n2": "Un autre groupe joue ; les observations sont partielles ou les améliorations restent à décider.",
        "n3": "Le test mesure la durée et repère les blocages ; le groupe utilise les retours pour corriger.",
        "n4": "Les résultats sont comparés aux attentes ; les corrections sont vérifiées lors d’un nouvel essai."
      }
    },
    {
      "id": "autonomie",
      "bloc": "Comportement",
      "intitule": "Attitude et autonomie pendant la séance",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "L’élève engage une tâche avec un accompagnement fréquent et une prochaine action explicitée.",
        "n2": "L’élève avance sur une tâche définie ; des rappels aident à poursuivre ou demander une aide ciblée.",
        "n3": "L’élève s’organise, avance et demande une aide précise quand cela devient nécessaire.",
        "n4": "L’élève anticipe ses besoins, explique ses choix et ajuste son travail après un obstacle."
      }
    },
    {
      "id": "securite",
      "bloc": "Comportement",
      "intitule": "Respect du matériel et des règles de sécurité",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "Les règles et l’utilisation du matériel doivent encore être reprises avec le professeur.",
        "n2": "L’élève applique les règles avec des rappels et demande une vérification avant les actions sensibles.",
        "n3": "L’élève applique les règles, prend soin du matériel et attend les validations nécessaires.",
        "n4": "L’élève prépare son poste avec soin, repère une situation à vérifier et sollicite le professeur avant d’agir."
      }
    },
    {
      "id": "cooperation",
      "bloc": "Comportement",
      "intitule": "Travail en équipe pendant la séance",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "La participation nécessite un accompagnement pour trouver une tâche et écouter les échanges.",
        "n2": "L’élève contribue à une tâche ; le partage des informations demande encore des rappels.",
        "n3": "L’élève tient son rôle, écoute les propositions et partage les informations utiles.",
        "n4": "L’élève aide à répartir les tâches, explique son travail et soutient les autres sans agir à leur place."
      }
    },
    {
      "id": "histoire",
      "bloc": "Réflexion sur les éléments communs",
      "intitule": "Contribution à l’histoire commune",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "Une contribution reste à formuler avec une aide pour choisir une section.",
        "n2": "L’élève propose une idée ; son lien avec l’histoire commune reste à travailler.",
        "n3": "L’élève apporte une contribution cohérente et prend en compte les décisions de l’équipe.",
        "n4": "L’élève améliore sa contribution après discussion et aide à relier plusieurs idées de l’équipe."
      }
    },
    {
      "id": "preparation-role",
      "bloc": "Réflexion sur les éléments communs",
      "intitule": "Préparation de son rôle pour le jour J",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "Le rôle reste à choisir et les actions à préparer restent à définir.",
        "n2": "Le rôle est choisi ; les actions et accessoires sont partiellement préparés.",
        "n3": "L’élève connaît ses actions, prépare ses accessoires et participe à une répétition.",
        "n4": "Après répétition, l’élève ajuste ses actions et sait comment réagir à une difficulté prévue."
      }
    },
    {
      "id": "texte-personnel",
      "bloc": "Réflexion sur les éléments communs",
      "intitule": "Texte de chaque personne pour le jour J",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "Le texte reste à commencer avec une aide pour identifier le message à transmettre.",
        "n2": "Un texte est écrit ; certaines consignes ou répliques restent à clarifier.",
        "n3": "Le texte est complet, compréhensible et adapté au rôle ; l’élève l’a répété.",
        "n4": "Le texte est amélioré après répétition ; il reste clair et cohérent avec les autres interventions."
      }
    },
    {
      "id": "organisation",
      "bloc": "Réflexion sur les éléments communs",
      "intitule": "Contribution à l’organisation du jour J",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.C7,
      "descripteurs": {
        "n1": "La contribution au planning ou à la logistique reste à définir.",
        "n2": "Une tâche est renseignée ; responsable, matériel ou horaire restent à préciser.",
        "n3": "L’élève renseigne sa tâche, son horaire et ses besoins en accord avec le planning commun.",
        "n4": "L’élève vérifie les dépendances avec les autres tâches et propose un ajustement réalisable."
      }
    },
    {
      "id": "mise-en-place-groupe",
      "bloc": "Jour J",
      "intitule": "Mise en place — résultat collectif",
      "portee": "groupe",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "Le groupe prépare partiellement son poste ; des éléments nécessaires restent à installer.",
        "n2": "Le poste est installé avec aide ; les contrôles ou la coordination restent à compléter.",
        "n3": "Le poste est prêt à l’heure convenue ; les éléments et contrôles prévus sont réalisés.",
        "n4": "Le groupe anticipe les besoins et vérifie les liaisons avec les autres postes avant l’accueil."
      }
    },
    {
      "id": "mise-en-place-individuel",
      "bloc": "Jour J",
      "intitule": "Mise en place — participation personnelle",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "L’élève commence sa tâche avec un accompagnement pour préciser les gestes attendus.",
        "n2": "L’élève installe sa partie avec des rappels sur l’ordre ou les éléments à préparer.",
        "n3": "L’élève réalise sa tâche et signale quand sa partie est prête.",
        "n4": "L’élève vérifie sa tâche et aide à coordonner la mise en place après accord."
      }
    },
    {
      "id": "jeu-groupe",
      "bloc": "Jour J",
      "intitule": "Pendant le jeu — résultat collectif",
      "portee": "groupe",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "Le groupe assure une partie des missions ; un accompagnement fréquent reste nécessaire.",
        "n2": "Le groupe suit le déroulé avec aide ; la coordination ou les indices demandent des rappels.",
        "n3": "Le groupe tient ses missions, utilise les indices prévus et se coordonne avec le Game Master.",
        "n4": "Le groupe adapte son intervention aux joueurs sans donner la réponse et signale les incidents utilement."
      }
    },
    {
      "id": "jeu-individuel",
      "bloc": "Jour J",
      "intitule": "Pendant le jeu — participation personnelle",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "L’élève prend son rôle avec un accompagnement fréquent pour savoir quand intervenir.",
        "n2": "L’élève tient une partie de son rôle ; le moment ou le contenu des interventions reste à ajuster.",
        "n3": "L’élève tient son rôle, respecte le déroulé et transmet les informations utiles.",
        "n4": "L’élève garde des interventions claires, s’adapte aux joueurs et coordonne ses actions avec les autres."
      }
    },
    {
      "id": "rangement-groupe",
      "bloc": "Jour J",
      "intitule": "Rangement — résultat collectif",
      "portee": "groupe",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "Le rangement est engagé ; plusieurs éléments restent à remettre à leur place.",
        "n2": "Le groupe range une partie du poste ; inventaire ou remise à zéro restent à compléter.",
        "n3": "Le groupe range le poste, contrôle le matériel et effectue la remise à zéro prévue.",
        "n4": "Le groupe vérifie les éléments manquants, signale les besoins et laisse le matériel prêt pour une prochaine utilisation."
      }
    },
    {
      "id": "rangement-individuel",
      "bloc": "Jour J",
      "intitule": "Rangement — participation personnelle",
      "portee": "individuel",
      "coefficient": 1,
      "competence": competences.transversal,
      "descripteurs": {
        "n1": "L’élève engage son rangement avec un accompagnement pour identifier le matériel concerné.",
        "n2": "L’élève range sa partie avec des rappels sur les emplacements ou les vérifications.",
        "n3": "L’élève range le matériel confié et signale une pièce manquante ou abîmée.",
        "n4": "L’élève vérifie sa tâche et aide à terminer le rangement commun après accord."
      }
    }
  ]
});
}());
