# Suivi du projet Escape Lab

Fichier **partagé** entre Thomas, Claude (Claude Code) et ChatGPT. Chacun le lit avant de travailler et le met à
jour après. Le brief complet est dans `docs/BRIEF-CLAUDE-CODE-escape-lab.md`.

## Règles pour tous (rappel du brief §13)
- Tout en **français** (interface, commentaires, noms de fichiers et de fonctions).
- Marche en `file://`, hors ligne, aucun CDN, scripts classiques (pas de modules ES).
- **Aucune vraie donnée** (prénoms, codes, sauvegardes) dans le dépôt : données fictives seulement.
- **Ne rien supposer sur le matériel** : broches, tensions, résistances viennent de la fiche technique et sont
  validées par Thomas.
- Messages bienveillants, écarts en **ambre** (jamais rouge), jamais la couleur seule, texte ≥ 13 px.

## Répartition
| Qui | Rôle |
|---|---|
| Thomas | décide, valide les jalons, relaie entre Claude et ChatGPT |
| Claude | architecture, code, stockage, tests `node:test`, intégration Labo Blocs |
| ChatGPT | **contenus rédigés** (fiches mécaniques, fiches composants, exemples d'indices, données de démo) au format donné ci-dessous |

## État des étapes (brief §15)
| # | Étape | Qui | État |
|---|---|---|---|
| 1 | Plan court à valider | Claude | fait (validé le 23/10) |
| 2 | Étape 0 : page de test du dossier partagé (2 dossiers sur le poste prof) | Claude | page prête ; **test sur les postes à la rentrée** (`site/test-dossier.html`) |
| 3 | Couche de stockage + synchronisation 3C2D1 + tests | Claude | fait (10 tests `npm test`) ; recette Thomas |
| 4 | Squelette : accueil, identification, tableau de bord, charte | Claude | fait ; recette Thomas (bouton « Classe fictive ») |
| 5 | Histoire puis Frise | Claude | fait ; **recette Thomas** (`docs/RECETTE.md`) |
| 6 | Bibliothèque commune | Claude | fait ; recette Thomas |
| 7 | Fiche énigme, énigmes des autres, câblage v1 | Claude | fait ; **recette Thomas** |
| 8 | Page jour J | Claude | fait ; **recette Thomas** |
| 9 | Fiches mécaniques + bibliothèque de composants (contenus) | **ChatGPT** (contenu) + Claude (éditeur) | fait (`site/prof.html`) ; **recette Thomas** |
| 10 | Labo Blocs : parcours Escape Lab, partie libre | Claude | fait ; **recette Thomas** (et validation des plans de composants) |
| 11 | Espace professeur, évaluation, exports | Claude | fait ; **recette Thomas** |
| 12 | Câblage v2, régie caméras (phase 2) | Claude | après décision |
| 13 | Recette | Thomas + Claude | à faire |

Recettes avec Thomas après les étapes 2, 3, 5, 7 et 11.

## Plan court (étape 1) — à valider par Thomas
**Dépôt** : `Anlito/escape-lab` (question 3), dossier local `Documents/EscapeLab`.

**Arborescence**
```
site/
  index.html            page unique élève : accueil, identification, puis pages #tableau, #histoire, #frise,
                        #bibliotheque, #enigme, #autres, #programmation, #jourj (le dossier ouvert reste accessible)
  prof.html             espace professeur (code saisi à l'ouverture)
  test-dossier.html     étape 0
  js/stockage.js        couche unique : lister, lire, écrire (version attendue), historique, fichiers
  js/synchro.js         fusion de deux dépôts (3C2D1), aperçu puis exécution, journal
  js/...                un fichier par écran
  donnees/mecaniques.js definirMecaniques({...})   (contenu ChatGPT, validé Thomas)
  donnees/composants.js definirComposants({...})   (contenu ChatGPT, validé Thomas)
  donnees/equipes.js    équipes et dossiers (3C1, 3D2, 3C2D1 = 3C2 + 3D1), chemin ESCAPE GAME › <classe>
  donnees/jalons.js     jalons par défaut (annexe C)
  donnees/demo.js       classe fictive 3Z9 (bouton « Classe fictive », rien enregistré)
  labo-blocs/           copie de Labo Blocs (comme les autres projets)
tests/                  node:test (stockage, conflits, synchro sans perte)
docs/                   brief, recette
```
**Réutilisé tel quel** : `college.js` (réglages du collège), Labo Blocs (`LB.monterExercice`, exercice libre,
`creerSession({ lecture: true })`), charte et pratiques de `atelier-cereales/prof.html`.

**Valeurs par défaut retenues tant que Thomas n'a pas répondu** : tout dans les dossiers de classe, 4 emplacements
de programme, groupes non mixtes en 3C2D1, export CSV seul, aucune caméra avant la phase 2, César en secours.

## Travail pour ChatGPT
**Comment livrer** : ChatGPT lit ce fichier et le brief dans `C:\Users\pc\Documents\EscapeLab`, puis écrit ses
fichiers dans `EscapeLab\contributions\chatgpt\<code de la tâche>\` (jamais dans `site\` ni ailleurs dans le
dépôt), avec un `TRANSMISSION-CLAUDE.md` court (ce qui est fait, ce qui reste à vérifier, sources). Thomas dit à
Claude « C4 livrée » : Claude relit, intègre et met à jour ce tableau.

| Tâche | État |
|---|---|
| C1 Fiches mécaniques | **intégrée** (`site/donnees/mecaniques.js`) ; ids et lettres de ChatGPT retenus ; **relecture de Thomas à faire** |
| C2 Fiches composants | **rangée** (`site/donnees/composants.js`, clé `liés` → `lies`) ; 10 fiches sur 11 attendent les références réelles (C4) |
| C3 Démonstration 3Z9 | **intégrée** (`site/donnees/demo.js`, convertie au format du stockage ; groupes g1–g5 → A–E) |
| C4 Relevé du matériel | **livré** (`docs/releve-materiel.md`) ; **Thomas le remplit au collège**, puis ChatGPT complète `composants.js` |
| C5 Textes d'aide des fiches | **intégrée** (`site/donnees/aides.js`) : histoire et liaisons branchées ; fiche énigme et jour J aux étapes 7-8 ; relecture Thomas |
| C7 Messages des jalons | **intégrée** (`site/donnees/messages.js`) ; memeBroche et brocheIndisponible nomment la broche ; relecture Thomas |
| C8 Modèles du jour J | **rangée** (`site/donnees/jourj-modeles.js`, utilisée à l’étape 8) |
| C9 Rubriques du livret du Game Master | **rangée** (`docs/livret.md`, mise en page à l’étape 11) |
| C10 Exercices guidés Labo Blocs | **rangée** (`docs/exercices-labo-blocs.md`, parcours créé à l’étape 10) |
| C11 Appréciations générées | **rangée** (`site/donnees/appreciations.js`, utilisée à l’étape 11) |
| C12 Fiche de recette finale | **rangée** (`docs/recette-finale.md`) ; liens : http:// et https:// acceptés |
| C13 Mécaniques supplémentaires | **intégrée** (`site/donnees/mecaniques-supplementaires.js`, 7 ébauches marquées « supplémentaire ») ; relecture Thomas avec le Drive |
| C14 Guide « Bien démarrer » élève | **rangée** (`docs/bien-demarrer.md`) ; à imprimer, relecture Thomas |
| C15 Mode d’emploi du professeur | **rangée** (`docs/mode-emploi-professeur.md`) ; **à mettre à jour** : écrit avant l’étape 9 (`prof.html` existe maintenant), à revoir après l’étape 11 |
| C16 Fiche complète de démonstration | **intégrée** (groupe A de la démo : `fiches/A-<onglet>`, jalons recalculés) |
| C17 Décisions à prendre (une page) | **rangée** (`docs/decisions.md`) : **à remplir par Thomas** |
| C18 Remarques rapides de l’observation du jour J | **intégrée** (`site/donnees/observations-modeles.js`) |
| C19 Annonces types par séance | **intégrée** (`site/donnees/annonces-modeles.js`, bouton « Reprendre » dans Pilotage) |
| C20 Régie caméras : information et accord | **à faire** (pour l’étape 12) |
| C21 Mode d’emploi professeur : étapes 10 et 11 | **à faire** |
| C6 Grille d'évaluation | **rangée** (`site/donnees/evaluation.js`, utilisée à l'étape 11) ; **décisions de Thomas attendues** (voir ci-dessous) |

### Tâche C4 — Relevé du matériel à remplir par Thomas au collège (brief §4, question 9)
Un document imprimable (`releve-materiel.md`) : un tableau par composant de `composants.js` avec ce que Thomas
doit relever sur le composant réel ou sa boîte (marque, référence exacte, inscriptions, nombre de broches et leur
nom, tension écrite, quantité disponible, lien vers la page du vendeur si connu). Une ligne « photo de l'étiquette
prise ? ». Rien de prérempli par supposition. Ensuite, dès que Thomas fournit les références : compléter
`composants.js` avec la fiche technique citée dans `source` (même format, même règle « ⚠️ à vérifier »).

### Tâche C5 — Textes d'aide de la fiche énigme (brief §7.6, §7.3, §7.4, §7.9)
`aides.js` au format `definirAides({ format: "escape-lab/aides", version: 1, champs: { "<idChamp>": { consigne,
exemple, phraseACompleter } } })`. Un champ par élément de l'annexe B : histoire (titre, theme, pitch,
personnages, lieu, deroulement, fin), liaison (donne, utilise, lieu), groupe (`enigme.titre`, `enigme.scenario`,
`enigme.solution`, `enigme.contenuBoite`, `enigme.matiere`, `enigme.lienMatiere`, `fonctionnement`,
`indices.n1`/`n2`/`n3` et `.talkie`, `installation.etapes`, `installation.remiseAZero`, `installation.verifs`,
`journal`), jour J (rôles, texte à dire, planning). Règles : phrases de 15 mots maximum, vocabulaire de 3e,
bienveillant (« il manque encore… », jamais « faux »), exemples tirés de la démo 3Z9 et jamais de la solution d'une
vraie mécanique.

### Tâche C6 — Proposition de grille d'évaluation (brief §8.5)
`evaluation.js` au format `definirEvaluation({ format: "escape-lab/evaluation", version: 1, niveaux: [4 niveaux
avec libellé et lettre], criteres: [{ id, bloc, intitule, portee: "groupe"|"individuel", coefficient,
competence, descripteurs: { n1, n2, n3, n4 } }] })`. Blocs et critères du tableau §8.5. Les compétences reprennent
**mot pour mot** les intitulés du programme de technologie du cycle 4 (BO n° 9 du 29/02/2024), avec la source
citée ; si l'intitulé exact n'est pas trouvé : « ⚠️ à vérifier », ne rien inventer. Proposition à valider par
Thomas.

### Tâche C1 — Fiches des 6 mécaniques (brief §5.1, §5.2, annexe A)
Damier, Calques, Relier les points, Morse, Langue des signes, César (secours). `site/donnees/mecaniques.js`
existe déjà avec `id`, `nom`, `lettre`, `couleur` : **garder ces quatre champs tels quels** et compléter chaque
objet au format :
```js
definirMecaniques({ version: 1, mecaniques: [
  { id: "morse", nom: "Morse", couleur: "#…", lettre: "M",
    resume: "2 phrases.",
    etapesJoueur: ["…"], aConcevoir: ["…"], formatReponse: "…",
    materiel: { aCreer: ["…"], aTrouver: ["…"], fourni: ["…"] },
    pistesManuelles: { M1: "…", M2: "…", M3: "…" }, pistesElectroniques: ["…"],
    pieges: ["…"],
    indicesExemple: { niveau1: "…", niveau2: "…", niveau3: "…" } }
]});
```
Contraintes : phrases courtes (élèves de 14-15 ans), pas de solution toute faite, pistes et non obligations,
couleurs distinctes et lisibles sur fond `#2f2f2f`. Ne pas inventer ce qui n'est pas dans le brief : marquer
`"⚠️ à confirmer"`.

### Tâche C2 — Fiches composants pour l'atelier de câblage (brief §4, §11.1, §11.2)
Servomoteur, capteur magnétique (ILS), potentiomètre, relais + électro-aimant 12 V, clavier membrane 3×4
(Semageek 473), clavier tactile Grove 12 touches (Gotronic 101020636), LED, bouton, buzzer passif, LCD.
Format : `{ id, nom, type: "capteur|actionneur|afficheur|saisie", broches: [{ nom, role }], tension,
cablageType: ["phrase courte"], precautions: ["…"], liés: ["id"], source: "lien fiche technique" }`.
**Chaque valeur vient d'une fiche technique citée dans `source`** ; sinon `"⚠️ à vérifier"`. Rien d'inventé.

### Tâche C3 — Données de démonstration fictives
Une équipe fictive « 3Z9 », 5 groupes, prénoms inventés, une histoire courte, 5 énigmes remplies à moitié.

## Format des données dans un dossier de classe (étape 3)
Un dossier par collection (`histoire`, `frise`, `liaisons`, `bibliotheque`, `groupes`, `annonces`, `jourj`), **un
fichier par élément** (`histoire/pitch.json`) : deux élèves sur deux sections différentes ne se gênent jamais.
Chaque version est d'abord copiée dans `<collection>/historique/<id>/<version>.json`. Fichiers déposés :
`<collection>/fichiers/`. Journal de synchronisation : `synchronisation/journal/`. Code : `site/js/stockage.js`
(couche unique + synchronisation), `site/js/stockage-dossier.js` (accès au dossier dans Chrome/Edge).

### Tâche C7 — Messages bienveillants des jalons et des contrôles (brief §7.6, §11.1, §12)
`messages.js` au format `definirMessages({ format: "escape-lab/messages", version: 1, jalons: { "<id>": { aFaire,
enCours, fait, enRetard } }, controles: { "<id>": "message" } })`. Identifiants des jalons : ceux de
`site/donnees/jalons.js` (mecanique, scenario, materiel, matiere, choixE1, cablage, programme, M1, M2, M3, indices,
installation, test, jourJ). Contrôles : `indiceManquant1`, `indiceManquant2`, `indiceManquant3`, `talkieManquant`,
`solutionManquante`, `matiereManquante`, `lienMatiereTropCourt`, `contenuBoiteManquant`, `capteurManquant`,
`actionneurManquant`, `memeBroche`, `brocheIndisponible`, `masseCommune`, `douzeVoltsSansRelais`,
`validationProfAvantTension`, `photoManquante`, `dureeTropLongue`. Règles : décrire ce qui manque et la prochaine
action, jamais « faux » ni reproche ; 15 mots au plus ; tutoiement du groupe (« Il manque encore… »). Pour les
contrôles électriques : aucune valeur de broche ou de tension, seulement la règle et « demande au professeur ».

### Tâche C8 — Modèles pour la page Jour J (brief §7.9)
`jourj-modeles.js` au format `definirModelesJourJ({ format: "escape-lab/jourj-modeles", version: 1, roles: [{ id,
nom, description, texteExemple }], logistique: [{ tache, quand }], miseEnPlace: ["…"], deroule: ["…"],
rangement: ["…"], verifications: ["…"] })`. Rôles du brief (Game Master, comédiens, accueil, régie caméras,
responsable d’énigme, rangement…). Texte d’exemple tiré de la démo 3Z9. Logistique : date, accord de la direction,
joueurs invités (fonction, **jamais de noms**), cours déplacés, matériel à réserver. Phrases courtes.

### Tâche C9 — Rubriques du livret du Game Master et de la fiche d’installation (brief §8.4)
`livret.md` : plan détaillé (titres et ordre des rubriques, une phrase d’explication chacune) du livret dans l’ordre
de la frise, et d’une fiche d’installation A4 par énigme, pensés pour une impression **noir et blanc** (bordures,
lettres, cases à cocher, pas de couleur). Donner un exemple rempli avec la démo 3Z9 (sans solution inventée).

### Règle pour tous les textes lus par les élèves
Ne jamais écrire « Thomas » ni « le brief » dans un texte affiché aux élèves : écrire « le professeur ». (Corrigé
dans `mecaniques.js` et `composants.js`.)

### Tâche C10 — Trois exercices guidés de prise en main pour Labo Blocs (brief §11, point 1)
`exercices-labo-blocs.md` : trois exercices courts sur Arduino Uno (1. allumer une LED, 2. un bouton allume la LED,
3. un bouton fait tourner le servomoteur), puis l’exercice libre « Mon programme ». Pour chacun : titre, objectif en
une phrase, ce que l’élève doit obtenir (comportement observable), étapes guidées (3 à 5), une aide par étape,
une erreur fréquente et le message qui la **décrit** (jamais « tu as faux »). Règles de Labo Blocs : broche par défaut
D2 et **les blocs ne donnent jamais la réponse** ; ne pas écrire de numéro de broche comme solution (le câblage réel
n’est pas connu). Lire `C:UserspcDocumentslabo-blocsdocsBRIEF-LABO-BLOCS-POUR-UN-PROJET.md` pour le vocabulaire.

### Tâche C11 — Appréciations générées de la grille (brief §8.5)
`appreciations.js` au format `definirAppreciations({ format: "escape-lab/appreciations", version: 1,
parNote: [{ min, max, texte }], parBloc: { "<bloc>": { fort, aTravailler } } })` : tranches de note /20 (5 à 6
tranches), et pour chaque bloc de `site/donnees/evaluation.js` une phrase « point fort » et une « à travailler ».
Ton de bulletin, bienveillant, 20 mots au plus, sans prénom, sans comparaison entre élèves.

### Tâche C12 — Fiche de recette finale imprimable (brief §15 point 13, §16)
`recette-finale.md` : une liste de vérifications à faire par Thomas au collège avec deux postes, à partir de
`docs/RECETTE.md` et des critères de réussite du brief §16 : conditions (quels postes, quel dossier), action, résultat
attendu, case « OK / à revoir », remarque. Inclure : deux élèves sur la même section, coupure du réseau pendant un
enregistrement, restauration d’une version, synchronisation 3C2D1 avec modifications des deux côtés, impression noir
et blanc, aucune donnée réelle dans le dépôt.

### Tâche C13 — Fiches des mécaniques supplémentaires (brief §5.1, §8.3)
Compléter `mecaniques-supplementaires.js` au **même format que `site/donnees/mecaniques.js`** (mêmes champs,
`definirMecaniques`) pour les autres dossiers du Drive cités au brief §5.1 : écoute et tracer, objets cachés,
mélange colorant-couleur, lettre-miroir, lire sur les lèvres, image rouge / code bleu, classer les informations.
Identifiants courts en minuscules avec tirets, lettre et couleur **différentes** des six existantes. Seul le nom du
dossier est connu : tout principe deviné est marqué « ⚠️ à confirmer ». Aucun « Thomas » ni « brief » dans les textes.

### Tâche C14 — Fiche « Bien démarrer » pour les élèves (une page A4, noir et blanc)
`bien-demarrer.md` : ouvrir Escape Lab (Chrome ou Edge), choisir sa classe, son groupe, écrire son prénom, ouvrir
le dossier de la classe (le chemin s’affiche à l’écran), « Reprendre » la fois suivante ; où est quoi (8 pages du
menu) ; enregistrer chaque onglet ; ce qui se passe si deux élèves écrivent en même temps (rien n’est perdu) ; la
corbeille ; photos d’objets seulement ; ne jamais brancher de 12 V sans le professeur. Phrases de 12 mots au plus,
pictogrammes texte (☐ ✎ ↺), tutoiement.

### Tâche C15 — Mode d’emploi du professeur (deux pages)
`mode-emploi-professeur.md` : préparer les dossiers de classe (`ESCAPE GAME › <classe>`), lancer la page de test
`site/test-dossier.html`, ouvrir la classe fictive, ce que les élèves voient, où se trouve l’ordre de la frise,
valider un jalon physique, synchroniser 3C2D1 (aperçu puis exécution, conflits gardés des deux côtés), où vont les
notes (jamais dans un dossier de classe), sauvegarde. Décrire seulement ce qui existe dans `SUIVI.md` (étapes
faites) et marquer « (étape 11, à venir) » le reste.

### Tâche C16 — Une fiche énigme entièrement remplie pour la démonstration (brief §7.6, §8.4)
`fiche-demo-A.json` : pour le groupe A de la classe fictive 3Z9 (« Le plan des réserves », damier), tous les onglets
remplis comme le ferait un bon groupe, au format des onglets de `site/js/fiche.js` (un objet par onglet :
`enigme`, `fonctionnement`, `materiel`, `fabrication`, `electronique`, `indices`, `installation`, `tests` ; lire
les `cle` des champs dans la constante `ONGLETS`). Solution et code **inventés pour la démo** et marqués comme tels
dans le texte (« exemple fictif »). Électronique : composants `bouton` et `servomoteur` seulement, **sans aucun numéro
de broche** (laisser `brocheCarte` vide). Sert à tester le livret du Game Master et la fiche d’installation.

Pour C13 : l’espace professeur importe une fiche `.json` ; garder le format `definirMecaniques` demandé, Claude
convertira.

### Tâche C17 — Une page « Décisions à prendre » pour Thomas
`decisions.md` : toutes les questions encore ouvertes, rassemblées depuis le brief §14 (questions 1 à 14) et ce
fichier (grille C6, http/https, taille des fichiers, micro:bit et E1, mécaniques supplémentaires…), **sans celles
déjà tranchées** (lire « Décisions » du brief et le journal ci-dessous). Pour chacune : la question en une phrase, la
valeur par défaut appliquée aujourd’hui dans l’outil, ce que change chaque réponse possible, une case à cocher.
Classer par urgence : avant la rentrée, avant la séance 3, avant le jour J.

Pour C15 : mettre à jour `mode-emploi-professeur.md` avec l’étape 9 (`site/prof.html` : ouvrir plusieurs dossiers,
fiches mécaniques et composants, activer, exporter, importer).

### Tâche C18 — Remarques rapides pour la fiche d’observation du jour J (brief §8.5)
`observations-modeles.js` au format `definirObservations({ format: "escape-lab/observations", version: 1,
phases: { miseEnPlace: [...], jeu: [...], rangement: [...] } })` : pour chaque phase, 8 à 10 remarques courtes que le
professeur touche sur la tablette en un geste (`{ id, texte, sens: "positif" | "a-ameliorer" }`), observables
(« installe son poste sans aide », « attend des consignes »), 8 mots au plus, sans prénom, jamais blessantes. Les
rattacher aux critères Jour J de `site/donnees/evaluation.js` (`critere: "<id>"`).

### Tâche C19 — Annonces types du professeur, séance par séance (annexe C du brief)
`annonces-modeles.js` au format `definirAnnoncesModeles({ format: "escape-lab/annonces-modeles", version: 1,
seances: [{ seance: 1, annonces: ["…"] }, …] })` : pour les séances 1 à 10, deux ou trois annonces courtes (20 mots
au plus) tirées des jalons de `site/donnees/jalons.js` (« Aujourd’hui : scénario, solution et cadenas »), un rappel
de sécurité aux séances d’électronique, ton encourageant, sans reproche.

### Tâche C20 — Régie caméras : textes d’information et d’accord (brief §7.10, phase 2)
`regie-textes.md` : (1) une affiche courte pour les joueurs (caméras pour suivre le jeu, **aucun enregistrement,
rien n’est envoyé**, arrêt possible à tout moment) ; (2) un modèle de demande d’accord à la direction (but, nombre
de webcams, lieu, poste de régie, aucune image gardée, élèves mineurs, joueurs extérieurs) ; (3) une fiche de 10
lignes pour le Game Master (allumer, nommer les caméras, arrêter tout, que faire si un joueur refuse). Rien sur le
matériel réel tant que la question 11 n’est pas tranchée : laisser des blancs « à compléter ».

### Tâche C21 — Mettre à jour `mode-emploi-professeur.md` (étapes 10 et 11)
Ajouter : la page Programmation (4 emplacements, carte, contrôle E1, lecture seule) ; l’espace professeur
`index.html?prof` derrière le code professeur (le même que Labo Blocs) : Suivi des groupes, Fiches des groupes
(modifier, valider un jalon, remarque), Frise (ordre), Pilotage (réglages, mécanique et cadenas, échéances, annonces,
notes privées), Évaluation (dossier personnel, grille, note /20 provisoire, appréciation proposée, CSV),
Observation jour J (tablette), Exports (livret, fiches d’installation, CSV, sauvegarde) ; `prof.html` : onglet
Synchronisation 3C2D1 (aperçu puis synchroniser). Rappeler : notes et observations dans le dossier personnel.

## Questions à Thomas (grille C6)
1. Barème : A–D = 0, 1, 2, 3 points (tout en C donne 13,3/20). Garder, ou celui des grilles Excel existantes ?
2. Couleurs : le brief dit rouge / jaune / vert clair / vert foncé, la règle commune dit « jamais de rouge ». Remplacer le rouge (par ex. gris) ?
3. Coefficients : 2 pour fiche énigme, câblage, programme, test croisé ; 1 ailleurs. D'accord ?

## Journal
- 23/10/2026 — ChatGPT : C18 (30 remarques rapides), C19 (25 annonces types).
- 23/10/2026 — Claude : étape 11. Code professeur (même empreinte que Labo Blocs, `site/code-professeur.js`) devant
  `prof.html` et `index.html?prof`. Espace professeur dans l’application : Suivi des groupes (jalons ○ ◐ ● ✓ !, tri,
  filtre retard/bloqué/sans journal, ouverture de la fiche), Fiches des groupes modifiables (validation des jalons
  physiques, remarques), ordre de la frise, Pilotage (séance, durée, minutes par énigme, nombre de groupes 3 à 8,
  taille des fichiers, mécanique et cadenas par groupe, dossier d’origine, échéances, annonces avec modèles C19,
  notes privées), Évaluation (dossier personnel refusé s’il ressemble à un dossier de classe, grille groupe ×
  élèves, ajustement individuel, observations reprises, note /20 provisoire, appréciation proposée, CSV, comparaison
  des classes), Observation jour J (tablette, remarques C18), Exports (livret du Game Master et fiches
  d’installation imprimables en noir et blanc, CSV d’avancement, sauvegarde complète .json). `prof.html` : onglet
  Synchronisation 3C2D1 (aperçu, synchroniser, conflits listés). Copie de secours des données du professeur dans le
  navigateur. Barème C6 appliqué **en attendant la décision de Thomas**. 53 tests verts.
- 23/10/2026 — ChatGPT : C15 mise à jour (étape 9), C16 (fiche complète du groupe A, solution et code fictifs), C17
  (18 décisions ouvertes, classées par urgence).
- 23/10/2026 — Claude : C16 intégrée dans la démo, C15 et C17 rangées dans `docs/`.
- 23/10/2026 — Claude : étape 10. Dans `labo-blocs` (branche `claude/parcours-escape-lab`, pas encore envoyée) :
  parcours `escape-lab` (Uno) et `escape-lab-microbit`, 4 exercices libres chacun = les 4 emplacements, au format
  de l’éditeur (contrôlés par `controler`) ; `docs/PLANS-COMPOSANTS-ESCAPE-LAB.md` (potentiomètre et relais sans
  toucher au micrologiciel ; clavier 3×4 et LCD avec ; Grove UART en attente) **à valider avant tout code**.
  Dans Escape Lab : module Labo Blocs 0.5.0 copié par `npm run vers-projet` (`site/vendor/labo-blocs/`, jamais
  modifié ici) ; page Programmation : 4 emplacements nommables, carte Uno ou micro:bit (à valider par le
  professeur), écran d’exercice de Labo Blocs en plein écran, enregistrement dans `programmation/<g>-<carte>` (un
  fichier d’équipe Labo Blocs par carte), contrôle E1 (au moins une entrée et une sortie, signalé), autres groupes en
  lecture seule. Les exercices guidés (C10) restent à créer dans l’éditeur. 46 tests verts.
- 23/10/2026 — ChatGPT : C13 (7 mécaniques supplémentaires), C14 (Bien démarrer), C15 (mode d’emploi professeur).
- 23/10/2026 — Claude : C13 chargée dans l’élève et le professeur (13 fiches, les 7 supplémentaires signalées), C14 et
  C15 rangées dans `docs/`. Tâches C16 (en cours), C17, mise à jour de C15.
- 23/10/2026 — Claude : étape 9, `site/prof.html` (première partie de l’espace professeur). Ouvrir un ou plusieurs dossiers
  de classe (ou la classe fictive) ; fiches mécaniques et composants : liste avec l’état par dossier (ébauche du site
  ou modifiée le …), éditeur sans code, liens et ressources déposées (image, PDF, audio, vidéo ≤ 50 Mo), contrôles
  (identifiant, lettre et couleur uniques, pas de validation d’un composant avec « ⚠️ »), enregistrement dans les
  dossiers cochés, activer ou désactiver une mécanique par classe, export et import `.json`. Côté élève : les fiches du
  dossier remplacent les ébauches ; un composant non validé par le professeur garde l’avertissement. 43 tests verts.
  Pas encore de code professeur (étape 11).
- 23/10/2026 — ChatGPT : C10 (3 exercices guidés + libre), C11 (6 tranches, 8 phrases par bloc), C12 (30 contrôles).
- 23/10/2026 — Claude : étape 8, page Jour J (date, invités sans noms, accord, cours, matériel ; tâches ; rôles et
  textes en cartes, une ligne = un élément `jourj-roles/` ; contrôle « chaque élève a au moins un rôle » ; planning
  mise en place / déroulé / rangement / vérifications ; remise à zéro de chaque énigme lue dans les fiches ;
  répétition). Modèles C8 en un clic (régie caméras exclue, phase 2). Jalon J1 calculé par groupe. Résumé dans le
  tableau de bord. 37 tests verts. C10 à C12 rangées ; tâches C13 à C15.
- 23/10/2026 — ChatGPT : C7 (14 jalons × 4 états, 17 contrôles), C8 (7 rôles, 11 tâches, listes du jour J), C9 (plan
  du livret et de la fiche A4, exemple 3Z9).
- 23/10/2026 — Claude : étape 7. Fiche énigme à 11 onglets (champs guidés, voyants ○ ◐ ●, jalons calculés depuis
  le contenu et recopiés dans `groupes/<g>`, validation du professeur affichée), un élément par onglet
  `fiches/<g>-<onglet>` avec fusion si deux membres enregistrent ; atelier de câblage v1 (composants de la
  bibliothèque, tableau des branchements, contrôles : même broche, broche absente, D0/D1, masse, capteur et
  actionneur, 12 V) ; photos ; journal ; énigmes des autres en lecture seule, solution masquée, avis de test.
  Indices « faits » seulement avec les trois phrases talkie (lecture de C7). Correction : chaque page a son
  propre conteneur (les clics n’allaient plus à une page quittée). 34 tests verts. Tâches C10 à C12.
- 23/10/2026 — Claude : étape 6, bibliothèque commune (notes, documents image/PDF/audio/vidéo ≤ 20 Mo par défaut,
  liens http(s) seulement ; étiquettes suggérées + libres ; recherche et filtres ; aperçu intégré ; corbeille
  restaurable ; historique ; modification simultanée réunie sans perte). 25 tests verts. Tâches C7 à C9 pour ChatGPT.
- 23/10/2026 — ChatGPT : C4 (relevé vierge, 11 tableaux), C5 (42 textes d'aide), C6 (21 critères, 4 intitulés du BO
  n° 9 du 29/02/2024 cités mot pour mot d'après ChatGPT).
- 23/10/2026 — Claude : C4 à C6 relues et rangées ; aides branchées sur l'histoire et les liaisons (consigne,
  exemple, phrase à compléter dans le champ vide). Vérifié dans le navigateur.
- 23/10/2026 — Claude : étape 5. Histoire (7 sections, une carte modifiable chacune : présence « X modifie »,
  conflit → garder les deux textes, historique et restauration) et frise (début, énigmes, liaisons `liaisons/A-B`
  préremplies avec le contenu de la boîte, fin, durée totale, ordre par le professeur avec historique). Commandes du
  professeur essayables en démonstration ; elles iront dans `prof.html` (étape 11). 18 tests verts.
  Pour C5 : identifiants des sections d’histoire `titre theme pitch personnages lieu deroulement fin`.
- 23/10/2026 — ChatGPT : six fiches mécaniques et démonstration fictive 3Z9 ; onze fiches composants (seule la
  documentation du clavier Grove est identifiée). Livré dans le dossier Codex de Thomas.
- 23/10/2026 — Claude : C1 à C3 intégrées (voir tableau), démo vérifiée dans le navigateur. Tâches C4 à C6
  préparées pour ChatGPT, livraison dans `contributions/chatgpt/`.
- 23/10/2026 — Claude : étape 4, squelette (accueil : classe, groupe, prénom, ouverture du dossier, Reprendre ;
  en-tête « qui est connecté » ; navigation ; tableau de bord : annonces, groupes et jalons en retard en ambre,
  frise, bandeau de synchronisation pour 3C2D1 ; charte sombre or). Classe fictive pour essayer sans dossier.
  Vérifié dans le navigateur (serveur local `npm start`, port 8080). Les pages suivantes affichent « bientôt ».
- 23/10/2026 — Claude : étape 3, couche de stockage (version attendue, refus sans écrasement, historique,
  restauration, anciens fichiers lisibles) et synchronisation de deux dossiers (aperçu, copie, conflit gardé des
  deux côtés, journal). 10 tests `node:test` verts. Test réel sur les postes reporté à la rentrée (vacances).
- 23/10/2026 — Claude : étape 0, `site/test-dossier.html` (écriture, lecture croisée, délai, navigateur,
  deux dossiers + copie d'un fichier lourd). Testée seulement à la syntaxe : l'accès aux dossiers demande un clic
  sur un vrai poste. Résultats attendus de Thomas (bouton « Copier le résultat »).
- 23/10/2026 — Claude : dossier créé, brief copié, plan court rédigé, tâches C1-C3 préparées pour ChatGPT.
