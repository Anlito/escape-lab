# Brief — Escape Lab : outil collaboratif de conception d'escape game (3e, Pont Rousseau)

Ce document est à donner à **Claude Code** pour construire l'outil que les élèves de trois classes de 3e utiliseront pour **concevoir, documenter et assembler un escape game**, et que le professeur utilisera pour le piloter.

À lire en premier (même famille d'outils, mêmes contraintes) :

| Document | Dépôt | Couvre |
| :---- | :---- | :---- |
| `docs/BRIEF-LABO-BLOCS-POUR-UN-PROJET.md` | `Anlito/labo-blocs` | relier un projet à Labo Blocs : module, écran d'exercice, sauvegarde, contraintes |
| `docs/BRIEF-NOUVEAU-PROJET.md` | `Anlito/atelier-cereales` | accueil, carnet, outil professeur, recette |
| `BRIEF-CLAUDE-CODE-simon-labo-blocs.md` | (projet Claude) | exemple de brief « propre à un projet » |

Ce brief-ci ne contient que ce qui est **propre à Escape Lab**. Les points marqués ⚠️ sont des hypothèses à valider ; les décisions de Thomas et les questions encore ouvertes sont en §14. **Proposer un plan court (§15) avant de coder.**

**Version du 23/10/2026** : intègre les retours de Thomas (carte **micro:bit** possible en plus de l'Arduino, sauvegarde en deux dossiers pour la classe fusionnée 3C2D1, évaluation, jour J, caméras, atelier de câblage, nouveaux composants Labo Blocs, matière obligatoire).

---

## 1. Contexte

Thomas, professeur de technologie, fait créer un escape game par ses trois classes de 3e du collège Pont Rousseau. Il l'a déjà fait l'an dernier (présentation « Escape LAB » + « Carnet de route Escape Game 3e », fournis) et en retient un manque : **pas assez de cadrage ni d'éléments imposés** — des groupes avançaient sans pression, d'autres ne faisaient rien pendant des séances. Cette année :

- une **mécanique d'énigme imposée** à chaque groupe, choisie dans une base de mécaniques de Thomas ;
- des **livrables imposés** (création manuelle ×3, création électronique) ;
- une **fiche énigme structurée** (fonctionnement, matériel, installation, 3 niveaux d'indices) ;
- un **outil unique** qui centralise le travail, le rend visible à toute la classe et donne au professeur une vue d'ensemble.

## 2. Ce qui change par rapport à l'an dernier

| 2025-2026 | Cette année |
| :---- | :---- |
| Chaque groupe invente sa mécanique | Mécanique **imposée** (Thomas l'attribue) |
| Carnet de route Word/papier, un par équipe | Outil partagé : histoire, frise, bibliothèque commune, fiches énigme |
| mBlock / Vittascience / Arduino IDE | **Labo Blocs** (aucune mention des anciens outils) |
| Matière hors techno obligatoire | Une matière **vue en cours** autre que la technologie, avec le **lien expliqué** par le groupe dans sa fiche (§7.6) |
| Ordre des énigmes décidé en classe, non tracé | Frise tenue par le professeur, avec historique des décisions (et visible par l'équipe) |
| Rien entre deux énigmes | **Note de liaison** entre chaque énigme + **note de fin de partie** (visible par l’équipe et prof) |

## 3. Vocabulaire et organisation

- **Équipe = une classe** (3 classes, donc 3 escape games indépendants). Une équipe a **une histoire, une frise, une bibliothèque**.
- **Groupe = une énigme** : 5 groupes par équipe, **20 élèves par classe, groupes de 4 au maximum** (confirmé) ; le nombre reste **réglable** (3 à 8). Rôles repris du carnet : chef de projet, programmeur, designer/constructeur, rédacteur/reporter.
- Le **professeur** voit les trois équipes.
- **Les trois équipes ne sont pas toutes « une classe entière »** : 3C1 et 3D2 sont des classes (un dossier chacune), mais la troisième, **3C2D1, regroupe des élèves de 3C (groupe 3C2) et de 3D (groupe 3D1)**. Ces élèves n'ont pas accès au dossier de l'autre classe : l'équipe a donc **deux dossiers** que le professeur **synchronise** (§10.1). Une équipe se décrit par un nom et une liste d'un ou deux dossiers.
- Le jeu final est joué par une équipe externe (4 à 6 personnes) avec talkies-walkies et un Game Master (version précédente du projet ; à confirmer). Un seul lieu : le foyer. Un système de **caméras** pour suivre les joueurs dans la salle est demandé : voir la régie (§7.10, phase 2).
- Les **classes** viennent du fichier commun `college.js` de Labo Blocs (« Réglages du collège »), avec copie de secours locale.

## 4. Ce que chaque groupe doit livrer (le « cadrage »)

| # | Livrable imposé | Précisions |
| :---- | :---- | :---- |
| M1 | **Documents à imprimer et personnaliser** | Fabriqués dans Canva (compte e-lyco des élèves) ; l'outil garde un lien + l'export PDF/PNG |
| M2 | **Un objet pour résoudre l'énigme** | Ex. disque de chiffrement, grille, gabarit, plateau ; carton, PVC, impression 3D (Tinkercad), découpe CNC |
| M3 | **Un système qui se ferme avec un cadenas** et contient un élément | Boîte, tiroir, coffret ; l'élément contenu est ce qui passe à l'énigme suivante |
| E1 | **Création électronique** : une carte + **≥ 1 capteur + ≥ 1 actionneur** | **Arduino Uno par défaut ; micro:bit V2 possible pour certaines énigmes** (choix du groupe, validé par le professeur selon l'énigme). Programmée avec Labo Blocs ; doit être **nécessaire** au déroulé (elle valide, déclenche ou révèle), pas décorative |
| F1 | **Fiche énigme complète** | fonctionnement, matériel (à créer / à trouver), installation + remise à zéro, **3 niveaux d'indices** |
| F2 | **Test croisé** | Un autre groupe joue l'énigme, laisse un avis |
| F3 | **Lien avec une autre matière** | **Obligatoire** : une matière vue en cours (autre que la technologie) et l'explication du lien, écrite par le groupe dans sa fiche |
| J1 | **Préparation et tenue du jour J** | Rôle de chaque élève, texte de chaque personne, mise en place, déroulé, rangement (§7.9) ; noté (§8.5) |

Le tableau est la **liste de jalons** de chaque groupe (§7.6, annexe C) : état *à faire / en cours / fait*, **validation par le professeur** pour ce qui est physique (le logiciel ne peut pas le vérifier ; le groupe coche et joint une photo, Thomas valide).

Matériel et machines à disposition (donné par Thomas) : pistolet à colle chaude, cutter, carton, imprimante 3D, découpe CNC, découpeuse de plaques PVC, plieuse PVC, petite perceuse. Logiciels : Canva, Tinkercad, Labo Blocs.

**Électronique disponible (confirmé par Thomas le 23/10)** : kit de base (Arduino Uno, boutons, LED, buzzer, câbles Dupont, platine) + **servomoteurs, capteur magnétique, potentiomètres, afficheurs, écran LCD, électro-aimant (commandé par un relais, alimentation 12 V), digicodes (2 modèles)**. **Ce sont les élèves qui câblent** : l'outil doit donc leur donner l'information de câblage de chaque composant (§11.1). Les quantités et références exactes ne sont pas connues : **ne rien supposer** (question 9). Les composants à ajouter dans Labo Blocs sont listés en §11.2.

## 5. Les mécaniques d'énigme

### 5.1 Sélection recommandée

Thomas veut garder : placer-pion-damier, code César, langue des signes, morse, superposition de calques, relier les points — **6 mécaniques pour 5 groupes**. Lecture du dossier Drive (noms de fichiers et `explication.txt` ; les PDF, images et vidéos n'ont pas été ouverts) :

| Mécanique | Principe (d'après le Drive) |
| :---- | :---- |
| Placer-pion-damier | De fausses formules ou un rapport (ex. « Rapport de batailles » : « escorteur allié en G4, G5, G6 ») donnent des coordonnées ; les pions placés sur la grille dessinent une lettre |
| Superposition de calques | Des calques superposés révèlent un code |
| Relier les points | Quatre passeports (A à D) listent des pays visités ; sur la carte du monde, relier les pays de chaque passeport fait apparaître une forme (⚠️ lettre ? à confirmer) |
| Morse | Résoudre une devinette, coder la réponse en morse, l'envoyer avec un bouton court et un bouton long |
| Langue des signes | Décoder un message signé (vidéo, fiches) |
| Code César | Une lettre de consigne explique le décalage (+5) ; une seconde lettre contient des mots chiffrés à décoder |

**Recommandations : retenir Placer-pion-damier, Calques, Relier les points, Morse, Langue des signes** ; garder le **César en mécanique de secours** (classe à 6 groupes, groupe en difficulté). Raison : le César et le morse sont tous deux « décoder puis saisir » ; la langue des signes apporte un autre canal (visuel, geste) et une ouverture pédagogique. À valider (question 4). Les autres dossiers du Drive (écoute et tracer, objets cachés, mélange colorant-couleur, lettre-miroir, lire sur les lèvres, image rouge/code bleu, classer les informations…) restent disponibles comme **mécaniques supplémentaires** : l'outil doit permettre d'en ajouter sans coder (§8.3).

**Décidé : les mêmes 5 mécaniques dans les 3 classes** (chacune existe en 3 exemplaires, avec des histoires différentes). Le choix des 5 (César en secours) reste à confirmer d'un mot (question 1).

### 5.2 Fiche mécanique (rédigée par Thomas, **lecture seule** pour les élèves)

Chaque mécanique est une fiche que Thomas remplit dans son espace (§8.3), **préremplie à partir du Drive** (annexe A) ; l'élève la voit dans l'onglet « Ma mécanique ». Champs :

1. nom, vignette, **résumé en 2 phrases** ;
2. **comment ça marche** : étapes de jeu côté joueur (liste numérotée courte) ;
3. **ce que le groupe doit concevoir** (le message, la grille, la clé, le code…) ;
4. **format de la réponse** (lettre, mot, 4 chiffres, couleurs…) → aide à choisir le type de cadenas ;
5. **matériel type** : à créer / à trouver / fourni ;
6. **pistes manuelles** (M1, M2, M3) et **pistes électroniques** (capteurs, actionneurs possibles) — des pistes, pas des obligations : les groupes gardent la liberté de conception à l'intérieur du cadre ;
7. **exemples** (images, PDF), **ressources** (documents, vidéos, audio), liens externes ;
8. **pièges fréquents** ;
9. **exemple d'indices** aux 3 niveaux, pour montrer la différence (§7.6).

Une ébauche de contenu pour les 5 mécaniques est en **annexe A** (à corriger par Thomas).

## 6. Les espaces de l'outil — vue d'ensemble

Côté élève (une fois la classe et le groupe choisis) :

1. **Tableau de bord de l'équipe** : avancement de chaque groupe, annonces du professeur, accès rapide.
2. **Histoire** (partagée, modifiable par tous, avec historique).
3. **Frise** (ordre des énigmes, notes de liaison, note de fin ; lecture pour les élèves, notes modifiables).
4. **Bibliothèque commune** (notes, documents, liens, images, audio, vidéos).
5. **Mon énigme** (fiche du groupe : seuls ses membres la modifient).
6. **Énigmes des autres** (lecture, avis de test croisé).
7. **Programmation** (partie libre Labo Blocs du groupe).
8. **Jour J** (organisation, rôles et textes, planning ; §7.9).

Côté professeur : voir §8. La **régie** (caméras du jour J) est une page à part : §7.10.

## 7. Espace élève — détail

### 7.1 Accueil et identification

- Choisir **sa classe** (liste de `college.js`) : pour l'équipe fusionnée, l'élève choisit sa classe d'origine (**3C2** ou **3D1**), ce qui détermine le dossier où il écrit (§10.1) ; puis **son groupe**, puis saisir **son prénom** (prénom seul).
- Boutons : *Reprendre* (dernier groupe, mémorisé dans le navigateur, sans donnée sensible) · *Nouveau groupe* · *Ouvrir mon groupe* (sélection du dossier, comme les autres projets).
- Pas de compte. Un **code de classe** donné à l'oral par Thomas peut limiter l'accès (⚠️ barrière légère, §10).
- Toujours afficher **qui est connecté** (groupe + prénom) : chaque modification est signée (groupe, prénom, heure).

### 7.2 Tableau de bord de l'équipe

- Une carte par groupe : nom de l'énigme, mécanique, % de jalons faits, jalons **en retard** (ambre) selon les échéances de Thomas, dernière activité.
- Annonces du professeur (texte court, datées), épinglables.
- Aperçu de la frise.

### 7.3 Histoire

- Page unique par classe : titre, thème, résumé (pitch), personnages, lieu (foyer), déroulement, fin. Sections **prédéfinies mais libres** (texte enrichi léger : titres, gras, listes, images).
- **Modifiable par tous** les membres de la classe.
- **Historique** : chaque enregistrement crée une version (auteur, heure). On peut **voir une ancienne version et la restaurer** ; restaurer crée une nouvelle version, **rien n'est jamais supprimé**. Filet de sécurité contre les fausses manœuvres.
- **Éditions simultanées** : édition **par section** avec indication « Léa (groupe B) modifie cette section » ; si deux personnes enregistrent la même section, l'outil détecte le conflit et propose de garder les deux textes (jamais d'écrasement silencieux).
- Lien « rôle dans l'histoire » vers chaque énigme.

### 7.4 Frise (ordre des énigmes)

- Suite horizontale (ou verticale sur petit écran) : **Début de partie** (facultatif) → Énigme 1 → *liaison* → Énigme 2 → *liaison* → … → Énigme N → **Fin de partie**.
- **Seul le professeur place et réordonne** les énigmes (glisser-déposer) d'après le choix de la classe. Chaque changement d'ordre est **tracé** (date, ancien/nouvel ordre, note facultative « décidé en classe le … »).
- **Notes de liaison** entre deux énigmes : ce qui circule (objet, indice, code, mot de passe) — **modifiables par tous** (élèves et professeur), avec historique comme l'histoire. Champs guidés : *ce que l'énigme A donne* · *ce que l'énigme B en fait* · *où ça se trouve*. Pré-rempli depuis l'élément contenu dans la boîte M3 de la fiche A.
- **Note de fin de partie** après la dernière énigme : comment se termine le jeu (dernière révélation, sortie, message final, remise à zéro).
- Chaque carte d'énigme affiche : nom, mécanique, groupe, état, type de cadenas, durée estimée.
- ⚠️ Alerte (ambre) si la **durée totale** dépasse le temps de jeu prévu (60 min de jeu, 12 min par énigme : confirmé).

### 7.5 Bibliothèque commune

- Ajouter : **note** (texte), **document** (PDF, image, audio, vidéo courte), **lien** (Canva, Tinkercad, site).
- Chaque élément : titre, type, étiquettes libres + suggérées (*décor, son, image, indice, règle, technique*), auteur, date, groupe concerné (facultatif).
- Recherche et filtre par étiquette, type, groupe.
- Modifiable par tous ; **suppression = corbeille** (restaurable). Taille maximale par fichier à fixer selon le stockage (§10).
- Aperçu intégré pour images, PDF, audio, vidéo ; ouverture dans un nouvel onglet pour les liens.

### 7.6 Mon énigme (fiche du groupe)

**Seuls les membres du groupe modifient ; tous les autres lisent.** Une page à onglets ; chaque onglet a un voyant d'état (à faire / en cours / fait) et des **champs guidés courts** (phrases à compléter, listes, cases à cocher, exemples pré-remplis) plutôt qu'un grand texte libre : les élèves lisent et écrivent peu.

| Onglet | Contenu |
| :---- | :---- |
| **Ma mécanique** | Fiche mécanique de Thomas (§5.2), lecture seule : documents, vidéos, audio. Mécanique **verrouillée** (attribuée par le professeur). |
| **Mon énigme** | nom · membres et rôles · place dans l'histoire · scénario : ce que voit le joueur, ce qu'il doit faire (pas à pas) · **solution** (masquée par défaut pour les autres : « Afficher ») · **type de cadenas** (attribué) et code · **ce qui est dans la boîte** (objet/information transmis à l'énigme suivante) · durée estimée · difficulté ★ · **matière associée (obligatoire)** : choix de la matière vue en cours et **explication du lien** en 2-3 phrases, avec un exemple d'usage dans l'énigme |
| **Fonctionnement** | La mécanique appliquée à **cette** énigme : comment le message, la grille, la clé… sont construits ; schéma ou photo |
| **Matériel** | Tableau : élément · quantité · **À créer / À trouver / Fourni par le prof** · comment (machine) · responsable · état |
| **Fabrication** | Trois cartes **M1 / M2 / M3** : description, croquis/photos, machines et matériaux, fichiers (Canva, `.stl`, découpe), dimensions (M3), case « prêt » + **validation professeur** |
| **Électronique et programmation** | **E1** : capteur(s) et actionneur(s) (≥1 de chaque, contrôlé) · rôle dans l'énigme · **atelier de câblage** : composants glissés sur l'Arduino et la platine, tableau des branchements, consignes de câblage et de sécurité par composant (§11.1) · **programme(s) Labo Blocs** (§11) · tests · boîtier |
| **Indices** | **3 niveaux** obligatoires, voir ci-dessous |
| **Installation** | Étapes numérotées pour poser l'énigme dans le foyer : où, quoi poser, branchements, tests de contrôle · **Remise à zéro** (comment la remettre dans son état de départ après chaque partie) · liste « à vérifier avant l'arrivée des joueurs » |
| **Tests et avis** | Retours du test croisé (groupe testeur, ce qui a bloqué, durée réelle, modifications faites) |
| **Journal** | Une ligne par séance : ce qui a été fait, ce qui bloque (aide au suivi par le professeur) |
| **Remarques du professeur** | Visibles du groupe, saisies par Thomas |

**Indices — trois niveaux, définis dans l'outil** (consigne affichée à côté des champs) :

1. **Niveau 1 : orienter** — où regarder, quel objet utiliser, sans dire comment.
2. **Niveau 2 : méthode** — comment s'y prendre, étape par étape, sans donner la réponse.
3. **Niveau 3 : presque la solution** — il ne reste que la dernière action à faire.

L'indice ne doit pas dire « c'est faux » ; il aide. Chaque niveau a un champ obligatoire, plus une phrase à dire par talkie-walkie (courte). Le jalon « indices » n'est « fait » que si les trois sont remplis.

**Jalons** (annexe C) : cases cochables par le groupe ; l'état « fait » vient du contenu quand il est vérifiable (champ rempli, programme enregistré) ; la **validation** des éléments physiques vient du professeur.

### 7.7 Énigmes des autres

- Liste des énigmes de la classe ; ouverture en **lecture seule** de leur fiche (sans « Journal » ni « Remarques du professeur » ; solution masquée jusqu'au clic).
- **Avis de test croisé** : un groupe laisse un avis sur l'énigme d'un autre (ce qui a marché, ce qui a bloqué, durée, suggestion) ; visible du groupe concerné et du professeur.

### 7.8 Programmation (partie libre)

Voir §11. Pas de parcours imposé : un espace de programmation **libre** par groupe, branché sur Labo Blocs, enregistré dans le fichier du groupe, consultable en lecture seule par les autres groupes.
**Choix de la carte** : les élèves programment l'**Arduino Uno** et, **si l'énigme le justifie, une micro:bit V2** (demande de Thomas). La carte est choisie par emplacement de programme (Uno par défaut), avec validation du professeur ; Labo Blocs gère déjà les deux profils (§11).
**Plusieurs programmes par groupe** (demande de Thomas) : ⚠️ proposition de **4 emplacements nommables** (« Programme 1 à 4 »), car Labo Blocs définit les exercices dans le parcours (un nombre fixe). Ajouter des emplacements à la demande demanderait une évolution de Labo Blocs (question 12).

### 7.9 Jour J et organisation

Page partagée par équipe, **modifiable par tous**, avec le même système de sections et d'historique que l'histoire (§7.3). C'est la classe qui organise le jour J (date, accord de la direction, qui joue, déplacements ou cours à annuler) ; le professeur voit et complète. Sections :

- **Date et logistique** : date et horaires (à fixer), lieu (foyer), joueurs invités (nombre et fonction, **pas de noms d'élèves**), accord de la direction, cours déplacés ou annulés, matériel à réserver. Liste de tâches avec responsable et état.
- **Rôles et textes** : tableau *rôle* (Game Master, personnages/comédiens, accueil des joueurs, régie caméras, responsable de chaque énigme, responsable rangement…) · *élève* · **texte à dire** (chaque personne écrit le sien) · accessoires/costume · état (écrit / répété). Règle : **chaque élève a au moins un rôle** (contrôle affiché).
- **Planning du jour** : **mise en place** (qui, quoi, heure), **déroulé** du jeu, **rangement** (qui, quoi), liste « tout est à sa place » et **remise à zéro** de chaque énigme.
- **Répétition** : cases « répétition faite », remarques.

Cette page alimente l'évaluation de la préparation (§8.5) ; elle apparaît dans le tableau de bord de l'équipe.

### 7.10 Régie : caméras pour suivre les joueurs (phase 2)

Demande de Thomas : un système de caméras (éventuellement **plusieurs webcams**) pour suivre les joueurs dans la salle. À construire **après le cœur de l'outil**, et seulement après les réponses à la question 11. Cadrage proposé :

- Page `regie.html`, ouverte sur un seul poste (celui du Game Master) : liste des caméras branchées, **grille de 1 à 4 vignettes**, plein écran sur une caméra, nom de chaque caméra (ex. « Énigme 3 »), liaison avec la frise (caméra associée à une énigme).
- **Aucun enregistrement, aucun envoi sur le réseau ou sur Internet** ; indicateur « caméras actives » visible ; bouton d'arrêt immédiat. Information des joueurs et accord de la direction avant usage (joueurs extérieurs, élèves mineurs).
- Technique : webcams USB sur le poste de régie (flux local du navigateur). Des caméras sur **d'autres postes** demandent une liaison poste à poste sans serveur : à tester d'abord, à écarter si elle est fragile sur le réseau du collège.
- Non demandé mais utile : minuteur de la partie visible dans la régie, bouton « envoyer l'indice n° 1/2/3 » qui affiche la phrase à dire par talkie-walkie (§7.6).

## 8. Espace professeur

Page `prof.html`, protégée (§10). Mêmes pratiques que les outils professeur existants (`atelier-cereales/prof.html`).

### 8.1 Vue d'ensemble

- Sélecteur de classe (ou « 3 classes »). Tableau : groupes × jalons (couleurs + lettre, jamais la couleur seule), tri, filtre « **groupes bloqués / en retard** », dernière activité, **séances sans activité** (reproche majeur de l'an dernier).
- Fiche détaillée d'un groupe : tout ce que voit l'élève + journal + remarques + historique des modifications.

### 8.2 Piloter

- **Régler l'équipe** : nombre de groupes, noms, mécanique et **type de cadenas** attribués à chaque groupe ; pour l'équipe fusionnée, les deux dossiers (§10.1).
- **Synchroniser** les deux dossiers de l'équipe fusionnée (bouton, aperçu des changements, journal : §10.1).
- **Frise** : placer et ordonner les énigmes, notes de liaison et de fin, historique de l'ordre.
- **Échéances** : date ou n° de séance par jalon et par classe (⚠️ calendrier réglable, §15 annexe C).
- **Valider** les jalons physiques (boîte, objet, câblage…) ; **remarques** visibles du groupe ; **notes privées** (jamais visibles des élèves).
- **Annonces** à l'équipe ; **ajouter des documents** à la bibliothèque commune en son nom.
- **Historique** : voir et restaurer toute version (histoire, frise, fiche d'un groupe, bibliothèque).

### 8.3 Bibliothèque de mécaniques

- Créer/modifier une **fiche mécanique** (§5.2) avec éditeur et dépôt de ressources, sans toucher au code ; importer/ exporter une fiche (`.json`) ; activer/désactiver une mécanique pour une classe.
- Les 5 mécaniques de §5.1 + le César sont préchargés (annexe A, ébauches).

### 8.4 Exports (noir et blanc à l'impression, par défaut)

- **Livret du Game Master** : dans l'ordre de la frise, pour chaque énigme : mécanique, solution/code, cadenas, contenu de la boîte, **3 indices**, phrase talkie-walkie, **installation et remise à zéro**, matériel ; liaisons ; fin.
- **Fiche d'installation** par énigme (une page A4).
- **CSV d'avancement** (groupes × jalons) pour la grille d'évaluation existante.
- Sauvegarde complète d'une classe (`.json`).

### 8.5 Évaluation

Demande de Thomas : **un système de notation dans l'outil**. Principes :

- Réservé au professeur : **jamais visible des élèves, jamais écrit dans un dossier de classe** (§10.3).
- Échelle à **4 niveaux** (rouge / jaune / vert clair / vert foncé, avec chiffre ou lettre : jamais la couleur seule) et **points associés**, coefficients réglables par critère, **note /20 calculée automatiquement**, appréciation générée, commentaire libre. Même logique que les grilles Excel existantes.
- Critères **de groupe** (une note pour le groupe, avec possibilité d'ajuster pour un élève) et critères **individuels** (une note par élève).
- Compétences : reprendre les intitulés **du programme officiel** (BO n° 9 du 29/02/2024, compétences C1 à C9), jamais en inventer ; la correspondance ci-dessous est une **proposition à valider**.

| Bloc | Critères proposés | Portée | Compétence (⚠️ à valider) |
|---|---|---|---|
| **Livrables** | Fiche énigme (F1) dont indices et installation · M1 documents · M2 objet · M3 système à cadenas · E1 câblage · E1 programme · lien avec la matière (F3) · test croisé (F2) | groupe | C7 (concevoir, réaliser) ; C4 et C5 (câblage, sécurité) ; C9 (programme) ; C8 (test) |
| **Comportement** | Attitude et autonomie · respect du matériel et des règles de sécurité · travail en équipe, noté **par séance** (saisie rapide) | individuel | transversal (pas de C1-C9) |
| **Réflexion sur les éléments communs** | Contribution à l'histoire · préparation de son rôle · **texte de chaque personne** pour le jour J · organisation (page jour J, §7.9) | individuel et classe | transversal / C7 (projet) |
| **Jour J** | **Mise en place** · **pendant le jeu** · **rangement** | groupe et individuel | transversal / C7 |

- **Fiche d'observation du jour J** : écran adapté à la **tablette** pour noter en direct, par phase (mise en place, jeu, rangement), par groupe ou par élève, en un geste (niveau 1 à 4 + remarque courte, horodatée). Jamais de photo d'élève.
- **Vues** : tableau groupes/élèves × critères, moyennes, élèves sans note, comparaison entre les trois équipes.
- **Exports** : CSV (élèves × critères, libellés utilisables pour Pronote) et, ⚠️ si souhaité (question 10), fichier Excel au gabarit existant (4 couleurs, formules, onglet « Mode d'emploi », correspondance Pronote).
- Le programme Labo Blocs d'un groupe est lu en lecture seule pour l'évaluer : un exercice libre ne compte dans aucune compétence automatique, **c'est le professeur qui juge** (comportement de Labo Blocs inchangé).

## 9. Droits d'accès

| Action | Élève (groupe G) | Professeur |
| :---- | :---- | :---- |
| Lire histoire, frise, bibliothèque, fiches des autres groupes (sa classe) | ✅ | ✅ (3 classes) |
| Modifier l'histoire, les notes de liaison et de fin | ✅ | ✅ |
| Ajouter/modifier/supprimer (corbeille) dans la bibliothèque | ✅ | ✅ |
| Modifier la fiche de son groupe | ✅ (G seulement) | ✅ |
| Modifier la fiche d'un autre groupe | ❌ | ✅ |
| Laisser un avis de test sur un autre groupe | ✅ | ✅ |
| Placer/réordonner les énigmes dans la frise | ❌ | ✅ |
| Attribuer mécanique, cadenas, échéances ; valider ; notes privées | ❌ | ✅ |
| Fiches mécaniques | lecture | écriture |
| Voir une autre classe | ❌ | ✅ |
| Restaurer une version | ✅ (histoire, notes, bibliothèque, **sa** fiche) | ✅ (tout) |
| Page Jour J (date, rôles, textes, planning) | ✅ (modifier ; son texte et son rôle en priorité) | ✅ |
| Évaluation, observations du jour J | ❌ | ✅ (poste du professeur uniquement) |
| Synchroniser les deux dossiers d'une équipe fusionnée | ❌ | ✅ |
| Régie (caméras) | ❌ | ✅ (poste de régie, code professeur) |

## 10. Architecture et stockage

Les autres projets de la famille sont des sites statiques (GitHub Pages / `file://`), **sans serveur, sans compte**, avec un fichier `.json` par équipe sur le réseau du collège. Cet outil est le premier à avoir besoin de **données partagées entre plusieurs élèves** (histoire, frise, bibliothèque modifiables par tous). Deux familles de solution :

|  | A. Dossier partagé du collège (dans l'esprit des autres projets) | B. Petit service en ligne (base de données + stockage de fichiers hébergés) |
| :---- | :---- | :---- |
| Principe | Site statique ; lecture/écriture de fichiers dans un dossier commun (API « sélection de dossier » de Chrome/Edge) ; **1 fichier par groupe**, fichiers de classe versionnés | Le site parle à un service (type Supabase / Firebase) ; droits par ligne, temps réel, historique en base |
| Données élèves | **Restent au collège** | Prénoms sur un serveur externe → question RGPD, à valider avec le collège (pseudonymes ?) |
| Cohérence avec Labo Blocs | Totale (même sauvegarde, même dossier) | Rompt « aucun compte, aucune donnée envoyée ailleurs » |
| Édition simultanée | Pas de temps réel : relecture périodique du dossier, détection de conflit à l'enregistrement, historique par fichiers | Temps réel natif |
| Droits (« seul G modifie G ») | **Par convention** : l'interface bloque, mais un élève motivé peut éditer un fichier à la main | Appliqués côté serveur |
| Risques | Chrome/Edge seulement ; droit d'écriture du dossier commun depuis les postes élèves **à vérifier** ; permission de dossier à re-donner à chaque session ; fichiers lourds (vidéo) sur le réseau | Compte et clés à gérer, quotas, blocage éventuel du réseau scolaire, maintenance |

**Décision de Thomas (23/10) : option A (dossier partagé du collège).** Les données sensibles restent au collège ; l'option B n'est gardée que si cette décision change. Un dossier commun par classe est déjà utilisé et fonctionne (« une classe a un dossier commun partagé »). Le point à résoudre est la classe fusionnée : voir §10.1.

### 10.1 Équipes à un dossier (3C1, 3D2) et à deux dossiers (3C2D1)

**Situation.** Les trois équipes sont : **3C1**, **3D2** et **3C2D1** (élèves du groupe 3C2 de la classe 3C + élèves du groupe 3D1 de la classe 3D). Un élève de 3C2 ne peut ni lire ni écrire dans le dossier commun de 3D1, et inversement. Le poste du professeur voit les deux.

**Principe : une équipe = un nom + un ou deux « dépôts ».** Un dépôt est un dossier de classe, selon la convention de Thomas : `… › COMMUN › TECHNOLOGIE › ESCAPE GAME › 3C1` (⚠️ l'ordre des dossiers est configurable, question 7).

| Équipe | Dépôts | Synchronisation |
|---|---|---|
| 3C1 | 1 : dossier de 3C1 | aucune |
| 3D2 | 1 : dossier de 3D2 | aucune |
| 3C2D1 | 2 : dossier de 3C2 (dans 3C) et dossier de 3D1 (dans 3D) | **bouton « Synchroniser » côté professeur** |

**Fonctionnement pour l'équipe fusionnée.**

1. Chaque élève choisit sa classe d'origine (3C2 ou 3D1) : il **écrit uniquement dans son dossier**. Il voit tout le contenu de l'équipe tel qu'il est dans ce dossier, et un bandeau **« Dernière synchronisation : jj/mm à hh:mm : le travail de l'autre moitié apparaît après synchronisation »**.
2. Le professeur, sur son poste (qui voit les deux dossiers), choisit une fois les deux dossiers, puis clique sur **Synchroniser** à la demande des élèves. L'outil affiche **d'abord un aperçu** (ce qui sera copié, les conflits), puis exécute.
3. Résultat : **deux dossiers identiques** (copie complète des fichiers dans les deux sens), avec un **journal de synchronisation** (date, éléments copiés, conflits).
4. **Fiches de groupe** : chaque groupe appartient à un dossier d'origine (celui de ses élèves). Dans l'autre dossier, sa fiche est un **miroir en lecture seule**. ⚠️ **Un groupe ne mélange pas les deux moitiés** : sinon deux élèves du même groupe écriraient dans deux dossiers différents (question 5).
5. **Éléments partagés** (histoire, notes de liaison et de fin, bibliothèque, page jour J) : modifiés dans les deux dossiers entre deux synchronisations, ils sont **fusionnés par section ou par élément**, avec la version d'origine connue :
   - modifié d'un seul côté : la modification est reprise ;
   - modifié des deux côtés : **conflit**, les deux textes sont conservés l'un sous l'autre, le professeur choisit ou fusionne ; **jamais de perte** ;
   - bibliothèque : réunion des éléments par identifiant, fichiers copiés des deux côtés, corbeille fusionnée ;
   - historique : réunion des versions des deux dossiers, triées par date, avec le dossier d'origine indiqué ;
   - frise, annonces, fiches mécaniques : écrites par le professeur, propagées dans les deux dossiers.
6. Pour les équipes à un seul dépôt, le bouton n'apparaît pas.

**À tester dès l'étape 0** : le poste du professeur peut-il choisir **deux dossiers en même temps** (lecture et écriture) avec le navigateur du collège ? Délai de copie d'un fichier lourd (vidéo) ?

### 10.2 Ce qui est fait, quelle que soit l'option


- **Étape 0 de travail** : écrire une **page de test d'une trentaine de lignes** (Thomas la lance sur un poste élève, sur un second poste et sur son poste) qui vérifie : (1) choix d'un dossier commun du réseau et écriture d'un fichier, (2) lecture du même fichier depuis un autre poste, (3) délai de visibilité, (4) navigateur utilisé, (5) **sur le poste du professeur : choix de deux dossiers en même temps et copie d'un fichier de l'un à l'autre** (§10.1). Si le résultat contredit la décision, revoir avec Thomas.
- Quelle que soit l'option, **isoler le stockage derrière une couche unique** (lister, lire, écrire avec numéro de version, historique, fichiers) pour pouvoir changer d'option sans réécrire l'interface.
- **Option A — arborescence proposée** (dans le dossier du projet de la classe, comme les autres projets) : `… › ESCAPE GAME › <dossier de classe> › histoire.json` (+ `historique/`) · `frise.json` · `bibliotheque/` (`index.json` + fichiers) · `groupes/<Groupe>.json` (rubriques `enigme` et `programmation`) · `annonces.json`. Les **notes privées du professeur, les évaluations (§8.5) et les clés** ne vont **jamais** dans un dossier de classe : voir §10.3.
- **Toute écriture** : jamais d'écrasement silencieux (numéro de version attendu ; en cas de conflit, garder les deux), instantané conservé, anciens fichiers toujours lisibles (migration).
- **Protection du mode professeur** : code saisi à l'ouverture. Dépôt public et pas de serveur : c'est une **barrière pour les élèves, pas une sécurité** (même limite que Labo Blocs) ; ne jamais mettre le code dans le dépôt.

**Réponse à « chaque groupe peut-il modifier sa propre énigme (et seulement elle) ? »** Oui dans l'interface ; avec l'option A retenue, c'est une règle de l'interface et non une sécurité technique (un élève motivé pourrait modifier un fichier à la main : à dire clairement à Thomas, la fiche gardant son historique).

### 10.3 Données du professeur

Notes privées, évaluations, observations du jour J, code professeur : **un fichier dans un emplacement personnel du professeur** (son dossier, pas un dossier de classe), jamais lisible par les élèves. L'outil propose à chaque ouverture de le relire ; sauvegarde automatique avec copie de secours dans le navigateur du poste.

## 11. Intégration de Labo Blocs

Vérifié dans `Anlito/labo-blocs` (clone du 22/10/2026) :

| Besoin | Statut |
| :---- | :---- |
| Écran d'exercice posé dans les pages du projet (`LB.monterExercice`) ; sauvegarde `programmation` dans le fichier du groupe | ✅ (voir `BRIEF-LABO-BLOCS-POUR-UN-PROJET.md`) |
| **Exercice libre** (`libre: true`, sans solution ni scénario) sur Arduino Uno : composants LED, bouton, servomoteur, buzzer, joystick | ✅ → base de la « partie libre » |
| Envoi dans la carte (Uno), simulateur | ✅ |
| **Carte micro:bit V2** : profil existant (LED, bouton, servo, joystick sur P0 à P2), **capteurs intégrés** (lumière, température, gestes), écran 5×5, parcours « Découverte de la micro:bit » ; envoi par **fichier** et non par liaison série | ✅ → partie libre possible sur micro:bit (⚠️ à vérifier : exercice libre sur micro:bit, et si les capteurs intégrés comptent pour E1, question 14) |
| Capteur de lumière **intégré à la micro:bit** | ✅ piste pour les calques (§5.1, question 8) |
| Boutons vers la masse (résistance interne) : idéal pour « relier les points » et les contacts de pions | ✅ |
| Servomoteur (D5/D6) : actionneur pour ouvrir un tiroir/loquet | ✅ |
| Capteur magnétique (interrupteur à lame) | ✅ utilisable comme un **bouton** (entrée numérique vers la masse) ; à confirmer sur le composant réel |
| **Potentiomètre** (entrée analogique) | ⚠️ lecture analogique existante seulement pour le **joystick** (A0–A5) |
| **Relais** (électro-aimant, charge 12 V) | ⚠️ non pris en charge |
| **Digicode matriciel 3×4** (7 broches) | ⚠️ non pris en charge |
| **Digicode tactile Grove 12 touches** (liaison série UART) | ⚠️ non pris en charge |
| **Écran LCD et afficheur(s)** | ⚠️ non pris en charge (modèles à préciser, question 9) |
| Capteur de lumière (utile aux calques) | ⚠️ ni pris en charge, ni dans le matériel confirmé (question 8) |
| Plusieurs capteurs/actionneurs mélangés dans un même exercice libre | à vérifier dans `PLAN.md` (§ « Exercice libre ») |

À faire :

1. **Parcours « Escape Lab » minimal** créé avec l'éditeur de Labo Blocs : un **exercice libre** « Mon programme » (+ éventuellement 2 à 3 exercices guidés de prise en main : LED, bouton, servo). Aucune réécriture de la programmation dans ce projet.
2. **Inventaire écrit** des composants nécessaires aux 5 mécaniques (§5.1) face à ce que Labo Blocs gère, puis le **plan court des ajouts** (§11.2), validé par Thomas avant de coder. Tout composant ajouté l'est **dans `Anlito/labo-blocs`** (profite à tous les projets).
3. Un **contrôle simple** de E1 : le programme du groupe contient au moins une entrée (capteur) et une sortie (actionneur) — signalé, jamais bloquant.
4. Le programme d'un groupe est **consultable en lecture seule** par les autres (`creerSession({ lecture: true })`).
5. Câblage : **ne rien supposer** (broches, résistances) ; voir l'atelier de câblage ci-dessous.

### 11.1 Atelier de câblage (dans l'onglet « Électronique et programmation »)

Idée de Thomas : une **bibliothèque de capteurs et d'actionneurs** que l'élève **glisse** sur une zone représentant l'**Arduino et la platine**, de façon à voir les composants, avec **en dessous un tableau des branchements** de chaque élément. Comme les élèves câblent eux-mêmes, l'outil doit leur **expliquer** le câblage. Spécification :

- **Bibliothèque de composants**, rédigée par Thomas dans son espace comme les fiches mécaniques : nom, image, type (capteur / actionneur / afficheur / saisie), **broches du composant** et leur rôle, tension, **câblage type** en phrases courtes, **précautions**, composants liés (ex. relais + électro-aimant). Préchargée à partir du matériel confirmé (§4) ; **chaque valeur de câblage est vérifiée dans la fiche technique du composant et validée par Thomas**, jamais devinée.
- **Zone de câblage** : schéma simple (pas un simulateur physique) d'un **Arduino Uno** et d'une **platine**, ou d'une **micro:bit** (broches P0 à P2, capteurs intégrés affichés comme « déjà sur la carte », pas de câblage nécessaire pour eux). La carte choisie par le groupe détermine la zone et les composants proposés. Glisser-déposer des composants ; chaque composant glissé ajoute ses lignes au tableau.
- **Tableau des branchements** : *composant · broche du composant · → broche de l'Arduino ou rail de la platine · couleur du fil · vérifié ✓*. Pré-rempli par une **proposition de câblage**, modifiable. Si possible, **pré-rempli depuis le programme Labo Blocs** du groupe (composants et broches utilisés) : le programme et le câblage doivent concorder.
- **Contrôles bienveillants** (jamais bloquants) : deux composants sur la même broche ; broche non disponible sur l'Uno ; au moins **un capteur et un actionneur** (E1) ; masse commune oubliée.
- **Sécurité 12 V** : tout composant alimenté en 12 V (électro-aimant) passe par un **relais** et une **alimentation séparée**, **jamais** sur l'Arduino ni sur la platine ; la page affiche la règle et exige la **validation du professeur avant toute mise sous tension**. Les détails (diode de roue libre, courant du relais) viennent de la fiche du relais et de l'électro-aimant réels, à confirmer.
- **Sorties** : image du schéma et tableau, intégrés à la fiche du groupe, au livret du Game Master et à la fiche d'installation.
- Livraison en deux temps : **v1 = tableau de branchements guidé** (composant → consignes → broches) ; **v2 = glisser-déposer** sur le schéma.

### 11.2 Composants à ajouter à Labo Blocs (lot séparé, dans `Anlito/labo-blocs`)

Demande de Thomas : relais (ouverture de l'électro-aimant ou de toute charge en 12 V) et **digicodes**. Il en a **deux modèles** (vérifiés sur les pages produit) :

| Composant | Fiche produit | Interface | À prévoir dans Labo Blocs |
|---|---|---|---|
| Clavier à membrane souple 3×4 | Semageek (réf. 473) | **matrice 3 colonnes × 4 lignes, 7 broches** | bloc « touche appuyée / dernière touche », lecture par balayage, simulateur avec clavier cliquable |
| Clavier tactile 12 touches Grove | Gotronic (réf. 101020636) | **UART** (microcontrôleur ATtiny1616), alimentation 3,3 à 5 V | idem, via liaison série : **vérifier la compatibilité avec le micrologiciel de l'Uno** (liaison série déjà utilisée pour l'envoi du programme) |
| Relais | à préciser | sortie numérique (signal 5 V) | bloc « activer / désactiver le relais », simulateur (voyant) |
| Potentiomètre | à préciser | entrée analogique | bloc « valeur du potentiomètre (0 à 1023) » |
| Écran LCD / afficheur | à préciser | à préciser | à préciser |

Règle : **un plan court par composant, validé par Thomas**, avant tout code ; les broches ne sont jamais supposées. Ce lot peut être mené **en parallèle** : l'outil Escape Lab ne l'attend pas (la partie libre fonctionne avec les composants existants).

## 12. Identité visuelle et ergonomie

- **Marque : Escape LAB — « Créer. Coder. Jouer. »** (présentation de l'an dernier : fond anthracite `#2f2f2f`, texte clair `#f7f4ef`, accent **or/bronze** à relever dans le logo, cadenas-ampoule). Thomas fournira le logo.
- Écrans : fond sombre, texte clair, **or** comme accent ; **une couleur par mécanique** (pastille + lettre) ; écarts en **ambre** (jamais rouge), jamais la couleur seule, texte ≥ 13 px.
- Public de 14-15 ans : **phrases courtes, peu de lecture**, champs guidés, exemples pré-remplis, vocabulaire simple.
- Messages bienveillants : décrire, ne pas sanctionner (« il manque encore l'indice de niveau 2 »).
- **Tablette et ordinateur** ; navigation claire et constante (Histoire · Frise · Bibliothèque · Mon énigme · Autres · Programmation).
- **Impression** : noir et blanc par défaut, bordures et lettres plutôt que couleurs ; pas de remplissage artificiel.

## 13. Contraintes non négociables (communes à la famille)

- Tout en **français** (interface, commentaires, noms de fichiers et de fonctions).
- `file://` possible et hors ligne pour tout ce qui ne demande pas le partage ; **aucun CDN**, polices en local, scripts classiques (pas de modules ES au chargement).
- **Jamais de vraies données** (prénoms d'élèves, codes de classe, sauvegardes) dans un dépôt public ; données de démonstration fictives.
- Prénoms seuls ; pas de photos d'élèves reconnaissables dans les ressources de démonstration.
- Anciennes sauvegardes toujours lisibles ; jamais d'écrasement.
- Ne rien supposer sur le matériel.
- **Notes, évaluations et observations** : uniquement dans l'emplacement personnel du professeur (§10.3).
- **Caméras** : aucun enregistrement, aucune donnée envoyée ailleurs (§7.10).

## 14. Décisions de Thomas et questions encore ouvertes

### Décisions (retours du 23/10/2026)

- **Stockage** : option A (dossiers du collège). Un dossier commun par classe fonctionne ; la classe fusionnée 3C2D1 a deux dossiers synchronisés par le professeur (§10.1).
- **Effectifs** : 20 élèves par classe, **groupes de 4 au maximum**, donc 5 groupes par équipe.
- **Électronique** : servos, capteur magnétique, potentiomètres, afficheurs, LCD, électro-aimant (relais 12 V), 2 digicodes ; **les élèves câblent** (§4, §11.1).
- **Mécaniques** : **les mêmes dans les 3 équipes**.
- **Cartes** : **Arduino Uno** pour tous ; **micro:bit** possible pour certaines énigmes quand c'est intéressant (§4, §7.8, §11).
- **Calendrier** : **10 séances**, jeu de **60 min** (≈ 12 min par énigme) ; **date du jeu réel à trouver par la classe** avec la direction (qui joue, déplacements, cours annulés) → page jour J (§7.9).
- **Évaluation** : dans l'outil (§8.5).
- **Matière associée** : **obligatoire**, expliquée dans la fiche (§7.6).
- **Fichiers** : l'outil peut utiliser le dossier réseau pour les fichiers (bibliothèque, vidéos).
- **Suggestions de la première version** (début de partie, avis de test croisé, remise à zéro, livret du Game Master) : conservées, faute d'objection de Thomas.

### Questions encore ouvertes

Aucune de ces questions ne bloque le début du travail (étapes 1 à 3 de §15) : **poser les questions à Thomas au fil de l'eau, avec la valeur par défaut indiquée dans le brief** (tout dans les dossiers de classe, 4 emplacements de programme, groupes non mixtes, CSV seul pour l'export, aucune caméra avant la phase 2).

1. **Mécaniques** : les 5 recommandées (damier, calques, relier les points, morse, langue des signes ; César en secours) : d'accord ? « Relier les points » : le principe lu dans le Drive (4 passeports, carte du monde) est-il le bon ?
2. **Cadenas** : types disponibles et nombre (cinq à six dans la version précédente) ; attribués par Thomas à chaque groupe ?
3. **Dépôt** : nom (`Anlito/escape-lab` ?) et accès en écriture pour Claude Code.
4. **Données non sensibles** : Thomas écrit que « les autres on peut les mettre en ligne ou sur mon Drive ». De quoi parle-t-on : les deux autres équipes (3C1, 3D2) ou des contenus non sensibles (fiches mécaniques, ressources) ? Par défaut, **tout reste dans les dossiers de classe**.
5. **Groupes de l'équipe fusionnée** : un groupe ne doit pas mélanger des élèves de 3C2 et de 3D1 (sinon deux dossiers pour un même fichier). Acceptable ?
6. **Fréquence de synchronisation** : à la demande (bouton) suffit-il, ou faut-il un rappel (« dernière synchro il y a plus de X jours ») ?
7. **Ordre des dossiers** : `ESCAPE GAME › 3C1` (donné par Thomas) ou la convention de Labo Blocs (dossier du groupe avant le projet) ? Les deux sont possibles par réglage.
8. **Calques** : capteur de lumière absent du matériel confirmé. L'acheter, utiliser le **capteur de lumière intégré à la micro:bit**, ou laisser le groupe choisir un autre capteur (capteur magnétique, bouton, potentiomètre) ?
9. **Références du matériel** : servos, relais (nombre de canaux), alimentation 12 V, électro-aimant, écran LCD (type de liaison), afficheurs, potentiomètres, quantités disponibles.
10. **Évaluation** : critères et coefficients par défaut (§8.5), note de groupe + ajustement individuel, export : CSV seul, ou aussi Excel au gabarit existant (Pronote) ?
11. **Caméras (§7.10)** : combien de webcams, où (foyer à côté de la salle), quelle distance au poste de régie, qui regarde (Game Master élève depuis la salle de classe ?), accord de la direction, aucun enregistrement : d'accord ?
12. **Programmes libres** : 4 emplacements par groupe suffisent-ils ?
13. **Taille maximale des fichiers** déposés (vidéos courtes) selon la vitesse du réseau.
14. **micro:bit** : combien de cartes (V2 ?), avec quels accessoires (connecteur d'extension, pinces crocodile) ? Les capteurs intégrés (lumière, gestes) comptent-ils comme « capteur » pour E1 ? Le professeur valide-t-il le choix de la micro:bit énigme par énigme ?

## 15. Ordre de travail conseillé

1. **Lire** les trois briefs en tête et les outils modèles. **Plan court** (arborescence, découpage, réutilisé tel quel) à valider.
2. **Étape 0 : page de test du dossier partagé**, y compris deux dossiers à la fois sur le poste du professeur (§10).
3. **Couche de stockage** (lire / écrire / versions / conflits / historique / fichiers) **avec dépôts multiples et synchronisation** (§10.1) + tests `node:test` : deux dossiers simulés, modifications des deux côtés, conflit volontaire, aucune perte.
4. **Squelette** : accueil, identification (dont classe d'origine), tableau de bord, navigation, charte.
5. **Histoire** (sections, édition simultanée, historique) puis **Frise** (ordre par le professeur, liaisons, fin).
6. **Bibliothèque commune**.
7. **Fiche énigme** (onglets, jalons, indices, installation, matière associée), **énigmes des autres + avis**, **atelier de câblage v1** (§11.1).
8. **Page jour J** (§7.9).
9. **Fiches mécaniques et bibliothèque de composants** : modèle, éditeur professeur, 5 + 1 ébauches préchargées (annexe A), composants du matériel confirmé.
10. **Labo Blocs** : parcours Escape Lab, partie libre (plusieurs emplacements), lecture seule ; plans courts pour les nouveaux composants (§11.2), menés en parallèle.
11. **Espace professeur** : vue d'ensemble, pilotage, validations, **évaluation et fiche d'observation du jour J** (§8.5), exports (livret du Game Master).
12. **Atelier de câblage v2** (glisser-déposer) et **régie caméras** (§7.10), phase 2, après décision de Thomas.
13. **Recette** (`npm test`, contrôle sur deux postes en même temps, perte de connexion, conflit volontaire, restauration d'une version, **synchronisation 3C2D1 sans perte**, aucune donnée réelle dans le dépôt, impression noir et blanc).

S'arrêter après les étapes 2, 3, 5, 7 et 11 pour une recette avec Thomas.

## 16. Critères de réussite

- Un groupe retrouve, **sans autre document**, sa mécanique, ses livrables imposés, ses échéances et sa fiche à compléter.
- Chacun voit le travail des autres de sa classe ; **seul le groupe** (ou le professeur) modifie sa fiche (garanti ou explicitement signalé selon l'option retenue).
- Deux élèves qui modifient l'histoire en même temps **ne perdent rien** ; une version précédente se restaure.
- Thomas voit en une page **qui est en retard et sur quoi**, et imprime le **livret du Game Master** dans l'ordre de la frise.
- La partie libre ouvre Labo Blocs dans le fichier du groupe, et le programme se simule puis se téléverse dans l'Uno.
- Après une synchronisation, les **deux dossiers de l'équipe 3C2D1 sont identiques** et rien n'a été perdu, même en cas de modifications des deux côtés.
- Un élève qui câble trouve, dans l'outil, **les consignes de câblage et de sécurité** de chaque composant (dont le 12 V).
- Thomas évalue **livrables, comportement, éléments communs et jour J** dans l'outil, sans que les élèves voient les notes, et exporte les résultats.

---

## Annexe A — Fiches mécaniques préremplies depuis le Drive (à corriger par Thomas)

*Sources : `explication.txt`, textes lisibles des PDF et images du Drive. Certaines images (calques, molécule, alphabet morse) et les vidéos/PDF de la langue des signes n'ont pas pu être lues automatiquement : ces points sont marqués « à compléter ». Le reste est une proposition. Les lignes sur l'électronique ont été retirées par Thomas dans sa relecture, sauf pour le morse.*

**A1. Placer-pion-damier** (Drive : `Ex1` avec `molecule.jpg` et `explication.txt` ; `Ex2` avec « Bataille navale : Rapport de batailles » et « Tableau »)

- *Principe* : de **fausses formules** (Ex1) ou un **rapport de batailles** (Ex2, ex. « Bataille 2 : le porte-avions allié se trouve en D4, D5, D6, D7 ») donnent des **coordonnées** ; on place un pion sur chaque case indiquée ; une fois tous les pions placés, la grille **dessine une lettre**.
- *Conçoit* : la grille, le texte qui donne les coordonnées (avec des informations inutiles), la lettre obtenue.
- *Format de la réponse* : une lettre (partie d'un code).
- *Manuelles* : M1 feuille de formules ou rapport + grille à imprimer · M2 plateau et pions (carton/PVC/3D) · M3 boîte à cadenas.

**A2. Superposition de calques** (Drive : `ex1` « Plan usine » et « Plan usine transparent » ; `ex2` calques « A-C », « B-D » et « patron »)

- *Principe* : un plan ou des calques transparents, superposés dans le bon ordre et le bon sens, **révèlent un code**. (À compléter : fonctionnement exact des exemples, images à relire.)
- *Conçoit* : les calques (impression sur transparent), leur ordre, le code révélé.
- *Manuelles* : M1 calques imprimés · M2 cadre d'alignement ou support (le « patron » sert de gabarit) · M3 boîte à cadenas.

**A3. Relier les points** (Drive : `Carte-Monde.jpg`, `LU - Passeports.jpg`)

- *Principe* : **quatre passeports (A à D)** portent chacun une liste de **pays visités** (ex. A : Tunisie, Nigeria, Somalie, Iran, Madagascar ; C : Ukraine, France, Algérie, Égypte, Soudan, Ghana ; D : Portugal, Groenland, Canada, Colombie, Maroc, Angola, Argentine, Panama ; lecture automatique, à vérifier). Sur la **carte du monde**, relier les pays de chaque passeport fait apparaître une forme (⚠️ une lettre ? à confirmer).
- *Conçoit* : la carte, les passeports, les listes de pays, la forme obtenue.
- *Manuelles* : M1 carte et passeports à imprimer · M2 panneau à points (carton/PVC) et fils ou pinces · M3 boîte à cadenas.

**A4. Morse** (Drive : `alphabet.png`, `Morses-enigme.jpg`, `explication.txt`)

- *Principe* : le joueur résout une **devinette** (« Je suis plus puissant que Dieu, plus méchant que le diable… Qui suis-je ? »), puis **code la réponse en morse** et **l'envoie avec une machine** : un bouton pour le court, un bouton pour le long. La carte donne aussi une indication « A vaut K » (⚠️ sens à confirmer : décalage ?).
- *Conçoit* : la devinette et sa réponse, la machine à boutons, le feedback (LED/buzzer).
- *Manuelles* : M1 alphabet morse et devinette à imprimer · M2 boîtier à 2 boutons · M3 boîte à cadenas.
- *Électronique* : 2 boutons + buzzer/LED ; le programme décode la suite court/long → servo.
- *Pièges* : durée « court/long » à régler, tolérance.

**A5. Langue des signes** (Drive : `signe-cam.mp4`, `Langue-Signe-fiche.pdf`, `langue des signes.pdf`)

- *Principe* : un message est donné en signes (images/vidéo) ; le joueur le **décode** avec une fiche alphabet. (À compléter : contenu des PDF et de la vidéo, non lisibles automatiquement.)
- *Conçoit* : le message, les cartes de signes, la façon de saisir la réponse.
- *Manuelles* : M1 cartes et fiche à imprimer · M2 support/chevalet de cartes · M3 boîte à cadenas.
- *Points d'attention* : exactitude des signes ; droit à l'image si des élèves sont filmés ou photographiés.

**A6. Code César (secours)** (Drive : « LU - Cesar Consigne », « LU - Cesar Lettre »)

- *Principe* : une **lettre de consigne** (Nantes, 1897, d'Émile César à François Bourgelais) explique le **chiffrement par décalage de 5 lettres** (ex. BONJOUR + 5 = GTSOTZW). Une **seconde lettre** contient quelques mots chiffrés au milieu du texte (ex. « WJUTSXJ ») : en reculant de 5 lettres, on lit les mots cachés (ici « RÉPONSE »).
- *Conçoit* : la lettre, les mots chiffrés, le code obtenu.
- *Manuelles* : M1 lettres à imprimer · M2 **disque de chiffrement** · M3 boîte à cadenas.

## Annexe B — Modèle de données proposé

```text
equipe : { id, nom, depots[{ id, classe, chemin }], groupes[], ordre[] (ids d'énigmes), reglages }
         (1 dépôt : 3C1, 3D2 ; 2 dépôts : 3C2D1)
histoire : { sections[{id, titre, texte, version, parent, auteur, depot, date}] }  + historique[]
frise : { debut?, liaisons[{avant, apres, donne, utilise, lieu}], fin, journalOrdre[] }
bibliotheque : [{ id, type(note|doc|lien), titre, etiquettes[], auteur, groupe?, date, fichier?, corbeille? }]
jourJ : { date?, horaires?, logistique[{tache, responsable, etat}],
          roles[{role, eleve, texte, accessoires, etat}], planning{miseEnPlace[], deroule[], rangement[]},
          repetition{faite, remarques} }
groupe : { id, nom, depotOrigine, miroir?(lecture seule), membres[{prenom, role}], mecanique, cadenas{type, code},
           enigme{ titre, roleHistoire, scenario, solution, contenuBoite, duree, difficulte,
                   matiere, lienMatiere },
           fonctionnement, materiel[{element, quantite, origine(creer|trouver|fourni), machine, responsable, etat}],
           fabrication{ M1, M2, M3 : { description, fichiers[], etat, valideProf } },
           electronique{ carte(uno|microbit), capteurs[], actionneurs[], role,
                         cablage{ composants[{idComposant, position}], branchements[{composant, brocheComposant, brocheCarte, fil, verifie}] },
                         etat },
           indices{ n1{texte, talkie}, n2{...}, n3{...} },
           installation{ etapes[], remiseAZero[], verifs[] },
           avis[{groupeTesteur, texte, duree, date}], journal[{seance, texte}], jalons{ id : {etat, valide} } }
programmation : [ emplacements[{nom, carte(uno|microbit), rubrique Labo Blocs}] ]  (rubrique Labo Blocs versionnée, ne pas toucher)
mecanique : { id, nom, resume, fonctionnement[], aConcevoir, formatReponse, materielType, pistesManuelles, pistesElectro, ressources[], pieges, indicesExemple }
composant : { id, nom, image, type, cartes[uno|microbit], broches[{nom, role}], tension, cablageType[], precautions[], liens[], valideParProf }
synchronisation : { date, depots[], copies[], conflits[{element, choix}] }   (journal, côté professeur)

# Hors dossiers de classe (poste du professeur, §10.3)
prof : { notesPrivees[], evaluation{ criteres[{id, bloc, portee, coefficient, competence}],
         notes[{groupe|eleve, critere, niveau, remarque, date}] }, observationsJourJ[], codeProf }
```

## Annexe C — Jalons par défaut (10 séances confirmées ; répartition à ajuster)

| Séance | Objectif de séance | Jalons à atteindre |
| :---- | :---- | :---- |
| S1 | Lancement, mécaniques attribuées, histoire collective | Mécanique comprise · histoire : première version |
| S2 | Concevoir l'énigme | Scénario + **solution** + type de cadenas · liste du matériel · **matière associée et lien expliqué** |
| S3 | Prise en main du kit | Capteur et actionneur choisis · premier programme simulé |
| S4–S5 | Électronique et programmation | E1 câblé et testé · programme qui fonctionne |
| S6–S8 | Fabrication | **M1 prêt · M2 prêt · M3 prêt** (validation professeur) |
| S9 | Test croisé | **3 indices** · installation + remise à zéro · avis reçus · **rôles du jour J répartis** |
| S10 | Corrections et répétition générale | Tout validé ; frise et liaisons relues · **texte de chaque personne écrit** · répétition faite |

Les échéances sont réglables par Thomas. Un jalon **en retard** passe en ambre dans le tableau de bord (jamais en rouge, jamais en reproche).