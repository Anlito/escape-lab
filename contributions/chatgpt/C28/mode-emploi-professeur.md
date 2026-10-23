# Escape Lab — mode d’emploi du professeur

Référence : nouvelle navigation du 23/10/2026, étapes 1 à 12 réalisées ; essais au collège encore nécessaires.

## Page 1 — ouvrir, accompagner et piloter

### Préparer et tester les dossiers

Préparez **ESCAPE GAME › <classe>** : un dossier pour 3C1, un pour 3D2 ; deux pour l’équipe 3C2D1, ceux de 3C2 et 3D1.
Chaque groupe travaille dans son dossier d’origine ; votre poste doit accéder aux deux dossiers de l’équipe fusionnée.
Ouvrez **site/test-dossier.html** sur deux postes élèves puis sur votre poste : écriture, lecture croisée, délai et copie entre deux dossiers.
Utilisez d’abord des copies de recette et des données fictives ; ne testez pas une panne sur les sauvegardes réelles.

### Choisir le bon espace

Ouvrez **site/index.html** pour l’espace élève ; **Classe fictive** permet de découvrir 3Z9 sans enregistrer dans les dossiers réels.
Ouvrez **site/index.html?prof** pour le suivi, le pilotage, l’évaluation et les exports.
Ouvrez **site/prof.html** pour les fiches mécaniques, les composants et la synchronisation.
Les deux espaces professeur demandent le même code que Labo Blocs ; ne l’écrivez pas dans un document partagé.
Ce code est une barrière d’interface, pas une protection des fichiers auxquels les utilisateurs ont déjà accès.

### Accueil et menu des élèves

À l’accueil, les élèves choisissent leur classe et leur groupe avec les grandes touches, puis saisissent leur prénom.
Ils ouvrent le dossier indiqué ; « Reprendre » permet de retrouver leur dernier accès.
Le menu se trouve à gauche sur ordinateur, en haut sur tablette.

| Rubrique | Pages accessibles |
| :--- | :--- |
| Ma classe | Tableau de bord, Histoire, Frise, Bibliothèque, Jour J |
| Mon groupe | Mon énigme, Programmation |
| Les autres | Énigmes des autres |

Au bas du menu, l’élève retrouve son prénom, son groupe et l’état « ● Enregistré à … ».
Dans le tableau de bord, la carte **Ton groupe** indique la prochaine étape ; **Y aller** ouvre la fiche.
La fiche présente une colonne d’étapes : **● fait**, **◐ en cours**, **○ à faire**, **! à rattraper**.
Une partie s’affiche à la fois ; **Enregistrer et continuer** enregistre avant de passer à la suivante.
Un message d’écart est présenté à la fois ; le groupe le traite puis vérifie l’état d’enregistrement.
Les états d’avancement ne remplacent pas la validation physique du professeur.

Les élèves modifient les contenus communs et la fiche de leur groupe ; les autres fiches restent en lecture seule.
Les solutions et codes des autres groupes sont masqués avant « Afficher » ; leur journal et les remarques n’y figurent pas.
En conflit, relire les contributions conservées ; après un échec, garder le brouillon et vérifier le résultat réel.
L’historique restaure une version en en créant une nouvelle ; il ne remplace pas une copie de secours indépendante.

<!-- C27 : trois lignes ajoutées sur la frise et l’histoire. -->
La frise relie Début → cartes d’énigmes avec cadenas → Sortie ; chaque carte présente « Dans la boîte », sa durée et son état (● prête, ◐ en préparation, ! en retard) ; cliquer une énigme ouvre sa liaison modifiable en dessous. Si la frise déborde, les flèches dorées ‹ ›, à gauche et à droite, avancent d’une énigme sans modifier l’ordre. Sur tablette, la frise peut aussi défiler par glissement au doigt.
L’histoire se construit en six cases (thème, mission, personnages, lieu, déroulement, fin), chacune avec une image de 8 Mo maximum, ajoutée par « Ajouter une image » ou « Depuis la bibliothèque ».
Utilisez uniquement une photo d’objet ou un dessin, sans élève reconnaissable ; « Retirer » conserve l’ancienne image dans l’historique.

<!-- C28 : repères et parties de la page Jour J. -->
En haut de Jour J, cinq repères résument la date du jeu, les tâches faites, les élèves sans rôle, les étapes du planning faites et la répétition. Les pastilles ouvrent une seule partie à la fois : 1 Date et logistique ; 2 Rôles et textes ; 3 Planning du jour, organisé en Avant · Pendant · Après ; 4 Répétition.

### Utiliser Programmation

Chaque groupe dispose de **quatre emplacements nommables**, avec choix Uno ou micro:bit à valider par le professeur.
Labo Blocs s’ouvre en plein écran ; le programme peut être simulé puis envoyé selon la carte et le montage validés.
Le contrôle E1 signale la présence d’au moins une entrée et une sortie ; il ne prouve pas l’utilité de l’électronique dans le jeu.
Les autres groupes consultent les programmes en lecture seule ; ne pas déduire une compétence acquise d’un exercice libre enregistré.
Les trois exercices guidés rédigés pour C10 restent à créer dans l’éditeur ; les quatre exercices libres sont disponibles.

### Se repérer dans le menu professeur

Dans **site/index.html?prof**, le menu est regroupé par usage, à gauche ou en haut sur tablette.

| Rubrique | Pages |
| :--- | :--- |
| Suivre | Suivi des groupes, Fiches des groupes |
| Piloter | Réglages et annonces |
| Évaluer | Évaluation, Observation jour J, Exports et livret |
| La classe | Pages communes de la classe, dont Frise |

### Suivre et modifier les groupes

Dans **Suivre › Suivi des groupes**, lisez les chiffres clés puis utilisez les filtres en pastilles pour cibler les groupes.
Consultez les jalons, triez et filtrez les retards, blocages ou absences de journal ; ouvrez une fiche depuis le suivi.
Ouvrez **Suivre › Fiches des groupes** pour modifier une fiche, ajouter une remarque et valider un jalon physique après contrôle réel.
Un élément déclaré prêt ou un champ rempli ne constitue pas une validation du matériel.
Dans **La classe › Frise**, modifiez l’ordre, les liaisons, le début et la fin ; consultez l’historique des décisions.
Dans **Piloter › Réglages et annonces**, réglez séance, durée, nombre de groupes, tailles des fichiers, mécanique, cadenas, dossier d’origine et échéances.
Préparez les annonces, éventuellement avec **Reprendre** un modèle de séance ; relisez avant publication.
Les notes privées de **Réglages et annonces** exigent l’emplacement personnel, comme l’évaluation.

<div style="break-before: page; page-break-before: always;"></div>

## Page 2 — documenter, synchroniser et évaluer

### Fiches mécaniques et composants : site/prof.html

Ouvrez les dossiers concernés et cochez seulement les destinations voulues avant l’enregistrement d’une fiche.
L’éditeur permet de modifier, activer ou désactiver les mécaniques par classe, exporter et importer des fiches **.json**.
Les ressources image, PDF, audio ou vidéo sont limitées à **50 Mo** par fichier dans cet espace.
Les fiches des dossiers remplacent les ébauches du site côté élève ; les ébauches supplémentaires restent à vérifier avec les ressources.
Un composant comportant « ⚠️ » ne peut pas être validé ; une fiche composant validée ne valide pas un montage réel.

### Synchroniser 3C2D1 : site/prof.html

Ouvrez les deux dossiers de l’équipe puis l’onglet **Synchronisation 3C2D1**.
Choisissez **Aperçu** : aucune copie n’est alors effectuée ; lisez les copies prévues et les conflits.
Lancez ensuite **Synchroniser**, puis examinez le rapport et les conflits conservés.
Les contributions en conflit restent présentes des deux côtés ; relisez-les et organisez leur fusion avant une nouvelle synchronisation si nécessaire.
Vérifiez les pièces jointes, l’historique et le contenu final des deux dossiers ; les groupes miroirs restent en lecture seule.
La recette réelle à deux postes reste nécessaire même si les tests automatiques passent.

### Évaluer dans le dossier personnel

Dans **Évaluer › Évaluation**, choisissez votre dossier personnel, distinct des dossiers partagés de classe.
Un dossier reconnu comme dossier de classe est refusé ; vérifiez vous-même l’emplacement et ses accès.
La grille permet de renseigner les critères groupe et individuels, de motiver un ajustement et de reprendre les observations.
La note sur 20 reste provisoire si la grille est incomplète ; une absence d’observation n’est pas un zéro.
L’appréciation proposée se relit et se modifie ; exportez le CSV seulement après contrôle des résultats.
La comparaison des classes se consulte dans cet espace ; n’exportez jamais ses données vers la bibliothèque élève.
Barème validé le 23/10/2026 : A–D = 0, 1, 2, 3 points, sans rouge.
Coefficient 2 pour fiche énigme, câblage, programme et test croisé ; 1 pour les autres critères.

### Observer le jour J sur tablette

Ouvrez **Évaluer › Observation jour J**, choisissez phase et cible, puis saisissez le niveau et la remarque correspondant au fait observé.
Les modèles C18 sont des raccourcis à adapter ; ils ne justifient aucune observation automatique ni attribution collective aux individus.
Notes, ajustements, remarques privées et observations restent dans le dossier personnel du professeur, jamais dans un dossier de classe.
Une copie de secours existe dans le navigateur ; elle ne remplace pas la sauvegarde du dossier personnel.

### Exporter et conserver

Dans **Évaluer › Exports et livret**, préparez le livret du Game Master dans l’ordre de la frise et les fiches d’installation.
Vérifiez l’impression noir et blanc, les champs manquants et la lisibilité avant utilisation.
Le CSV d’avancement et la sauvegarde de classe **.json** sont aussi disponibles ; ils ne remplacent pas la sauvegarde privée des notes.
Les fichiers joints, notamment images et vidéos, restent dans le dossier : copiez aussi ce dossier pour les conserver.
Conservez des copies datées dans les emplacements autorisés, hors dépôt public et hors bibliothèque partagée pour les données privées.
Après un échec réseau, gardez le brouillon et contrôlez le fichier avant de réessayer ; ne restaurez pas par écrasement aveugle.

Effectuez la recette avec **docs/RECETTE.md** et **docs/recette-finale.md**.
Les références matérielles et les plans de nouveaux composants attendent encore validation.
### Utiliser le schéma de câblage

Dans la partie **Électronique et programmation** de la fiche, glissez un composant depuis la palette, puis déplacez-le.
Tirez un fil d’un point du composant vers une broche de carte ou un rail ; la ligne correspondante est renseignée dans le tableau.
La couleur du fil suit le texte saisi dans le tableau ; le tableau reste la référence des branchements.
Le schéma représente le montage, sans le simuler ni valider sa sécurité ; utilisez les fiches des modèles réels.
Le schéma figure aussi dans le livret du Game Master et les fiches d’installation ; contrôlez sa lisibilité imprimée.

### Ouvrir la régie, seulement après accord

Ouvrez **site/regie.html**, derrière le code professeur, sur le poste auquel les webcams sont raccordées.
Avant tout allumage, obtenez l’accord réel de la direction et informez les joueurs ; les cases ne remplacent pas ces démarches.
Cochez l’accord et l’information des joueurs, puis choisissez de une à quatre webcams disponibles sur ce poste.
Utilisez **Allumer les caméras**, nommez-les selon les postes de jeu et associez-les aux énigmes ; le plein écran facilite l’observation.
**Tout arrêter** coupe les flux ; vérifiez le voyant **Caméras éteintes** et l’extinction réelle des webcams.
Si un joueur refuse ou demande l’arrêt, arrêtez immédiatement toutes les caméras et organisez la suite sans caméra.
Le minuteur propose **Démarrer**, **Pause** et **Remettre à zéro** ; il devient ambre sous cinq minutes.
Dans **Indices**, ouvrez le dossier de classe en lecture seule, puis choisissez l’énigme et le niveau : la phrase talkie s’affiche en grand.
Aucun enregistrement, aucune image gardée, rien envoyé sur le réseau ou Internet ; les caméras d’autres postes ne sont pas prises en charge.
La régie est livrée, mais son usage reste conditionné à la décision matérielle et à l’accord de la direction ; les webcams réelles restent à tester.
