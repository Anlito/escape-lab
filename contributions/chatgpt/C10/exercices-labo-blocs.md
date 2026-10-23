# Escape Lab — prise en main de Labo Blocs

Proposition de contenus pour un parcours Arduino Uno : trois exercices guidés, puis « Mon programme ».
Les étapes donnent une démarche ; elles ne donnent ni assemblage de blocs ni numéro de broche à recopier.

## 1. Allumer une LED

**Objectif :** commander une LED avec un programme.

**Comportement attendu :** au démarrage du programme, la LED s’allume et reste allumée.

| Étape | Consigne | Aide à ouvrir si nécessaire |
| :--- | :--- | :--- |
| 1 | Repère la LED dans le simulateur et lis le comportement attendu. | Observe ce qui doit changer entre le départ et la fin de l’essai. |
| 2 | Explore les blocs disponibles et choisis ceux qui peuvent commander cette LED. | Lis les mots des blocs et repère l’objet qu’ils commandent. |
| 3 | Construis une première proposition, puis essaie-la dans le simulateur. | Observe la LED ; compare son état avec l’objectif. |
| 4 | Utilise « Vérifier », puis ajuste un seul écart à la fois. | Relis le message : il décrit le comportement observé. |

**Erreur fréquente :** le programme commande un autre composant que la LED observée.

**Message proposé, à afficher seulement si cet écart est observé :** « La LED observée reste éteinte ; vérifie quel composant ton programme commande. »

## 2. Un bouton commande la LED

**Objectif :** faire réagir la LED à l’état d’un bouton.

**Comportement attendu :** la LED reste allumée pendant l’appui et s’éteint au relâchement.

| Étape | Consigne | Aide à ouvrir si nécessaire |
| :--- | :--- | :--- |
| 1 | Observe le bouton et la LED dans le simulateur. | Essaie un appui, puis un relâchement ; ce sont deux situations à distinguer. |
| 2 | Décris l’état attendu de la LED dans chacune des deux situations. | Compare « pendant l’appui » et « après le relâchement ». |
| 3 | Explore les blocs disponibles et construis une proposition qui tient compte du bouton. | Cherche comment le programme peut utiliser l’état d’une entrée. |
| 4 | Essaie plusieurs appuis et relâchements, puis utilise « Vérifier ». | Regarde aussi ce qui se passe après le premier appui. |
| 5 | Ajuste un écart, puis refais les deux essais. | Chaque modification doit garder le comportement attendu dans les deux situations. |

**Erreur fréquente :** le programme allume la LED mais ne traite pas le relâchement.

**Message proposé, à afficher seulement si cet écart est observé :** « Après le relâchement, la LED reste allumée ; examine cette situation dans ton programme. »

## 3. Un bouton commande le servomoteur

**Objectif :** faire changer la position d’un servomoteur avec un bouton.

**Comportement attendu :** l’appui amène le servomoteur à la position d’action ; le relâchement le ramène au repos.
Les positions de repos et d’action sont représentées et nommées dans l’exercice préparé par le professeur.

| Étape | Consigne | Aide à ouvrir si nécessaire |
| :--- | :--- | :--- |
| 1 | Repère le bouton et les deux positions attendues dans le simulateur. | Observe la différence entre repos et action. |
| 2 | Décris ce qui doit arriver pendant l’appui et après le relâchement. | Associe chaque situation à une position attendue, sans chercher les blocs tout de suite. |
| 3 | Explore les blocs disponibles et construis ta proposition. | Distingue l’entrée qui donne une information et la sortie qui réalise une action. |
| 4 | Essaie plusieurs appuis et relâchements, puis utilise « Vérifier ». | Compare la position observée avec celle attendue dans chaque situation. |
| 5 | Ajuste un écart et recommence les essais. | Vérifie que le retour au repos reste possible après plusieurs appuis. |

**Erreur fréquente :** le programme fait agir le servomoteur mais ne prévoit pas son retour.

**Message proposé, à afficher seulement si cet écart est observé :** « Au relâchement, le servomoteur reste en position d’action ; examine le retour au repos. »

## 4. Mon programme — exercice libre

**Objectif :** programmer une action nécessaire au déroulement de ton énigme.

**Comportement attendu :** un capteur permet de valider, déclencher ou révéler un élément grâce à un actionneur.
Ton groupe précise ce qui doit arriver avant et après l’action du joueur.

| Étape | Consigne | Aide à ouvrir si nécessaire |
| :--- | :--- | :--- |
| 1 | Décris l’action du joueur et l’effet utile dans ton énigme. | Complète : « Quand le joueur…, notre dispositif… ». |
| 2 | Fais valider le choix du capteur et de l’actionneur par le professeur. | Explique pourquoi l’électronique est nécessaire à la suite du jeu. |
| 3 | Construis une première version et essaie-la dans le simulateur. | Commence par le comportement essentiel, puis ajoute les autres besoins. |
| 4 | Essaie une réussite, une autre action et un retour à l’état initial. | Note ce que tu attends et ce que tu observes. |
| 5 | Présente tes essais au professeur avant tout essai sur le matériel réel. | Garde les résultats et indique ce qui reste à vérifier. |

**Erreur fréquente :** le dispositif fonctionne une fois mais ne peut pas recommencer.

**Message proposé après observation :** « Le dispositif ne revient pas à son état initial ; précise comment préparer une nouvelle tentative. »

L’exercice libre n’a pas de solution imposée ni de scénario de validation automatique.
Le professeur apprécie le programme à partir du besoin et des essais du groupe.

## Notes de préparation pour Claude et le professeur

- Créer le parcours dans l’éditeur de Labo Blocs ; ce document n’est pas un fichier de parcours importable.
- Préparer Arduino Uno, LED, bouton et servomoteur avec les composants réellement pris en charge.
- Garder la valeur initiale D2 prévue par Labo Blocs dans les blocs concernés ; elle n’est ni un indice ni une solution de câblage.
- Ne pas attribuer D2 à tous les composants ; le modèle du simulateur et le matériel réel doivent être cohérents.
- Laisser l’élève choisir les réglages à partir de la situation représentée ; ne pas montrer le programme solution.
- Les blocs proposés dans la palette ne doivent pas donner la réponse par leurs valeurs préréglées.
- Ne pas préassembler le comportement attendu dans le programme initial de l’élève.
- Définir les deux positions du servomoteur dans le modèle pédagogique avant de publier l’exercice.
- N’inventer ni angle réel, ni alimentation, ni câblage ; faire valider le montage réel par le professeur.
- Les trois exercices guidés utilisent le simulateur et « Vérifier » ; le libre est configuré sans solution imposée.
- En matériel réel, l’envoi dans l’Uno vient seulement après validation du câblage et de l’alimentation.
- Ces exercices ne fournissent pas la solution d’une énigme de classe.
- Les erreurs décrites sont des cas d’essai ; ne pas les afficher sans observation du comportement correspondant.
