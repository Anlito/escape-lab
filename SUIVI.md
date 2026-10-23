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
| 4 | Squelette : accueil, identification, tableau de bord, charte | Claude | à faire |
| 5 | Histoire puis Frise | Claude | à faire |
| 6 | Bibliothèque commune | Claude | à faire |
| 7 | Fiche énigme, énigmes des autres, câblage v1 | Claude | à faire |
| 8 | Page jour J | Claude | à faire |
| 9 | Fiches mécaniques + bibliothèque de composants (contenus) | **ChatGPT** (contenu) + Claude (éditeur) | à faire |
| 10 | Labo Blocs : parcours Escape Lab, partie libre | Claude | à faire |
| 11 | Espace professeur, évaluation, exports | Claude | à faire |
| 12 | Câblage v2, régie caméras (phase 2) | Claude | après décision |
| 13 | Recette | Thomas + Claude | à faire |

Recettes avec Thomas après les étapes 2, 3, 5, 7 et 11.

## Plan court (étape 1) — à valider par Thomas
**Dépôt** : `Anlito/escape-lab` (question 3), dossier local `Documents/EscapeLab`.

**Arborescence**
```
site/
  index.html            accueil + identification (classe, groupe, prénom)
  equipe.html           tableau de bord, histoire, frise, bibliothèque, jour J (onglets)
  enigme.html           fiche du groupe (onglets §7.6) + énigmes des autres
  prof.html             espace professeur (code saisi à l'ouverture)
  test-dossier.html     étape 0
  js/stockage.js        couche unique : lister, lire, écrire (version attendue), historique, fichiers
  js/synchro.js         fusion de deux dépôts (3C2D1), aperçu puis exécution, journal
  js/...                un fichier par écran
  donnees/mecaniques.js definirMecaniques({...})   (contenu ChatGPT, validé Thomas)
  donnees/composants.js definirComposants({...})   (contenu ChatGPT, validé Thomas)
  donnees/demo/         données fictives
  labo-blocs/           copie de Labo Blocs (comme les autres projets)
tests/                  node:test (stockage, conflits, synchro sans perte)
docs/                   brief, recette
```
**Réutilisé tel quel** : `college.js` (réglages du collège), Labo Blocs (`LB.monterExercice`, exercice libre,
`creerSession({ lecture: true })`), charte et pratiques de `atelier-cereales/prof.html`.

**Valeurs par défaut retenues tant que Thomas n'a pas répondu** : tout dans les dossiers de classe, 4 emplacements
de programme, groupes non mixtes en 3C2D1, export CSV seul, aucune caméra avant la phase 2, César en secours.

## Travail pour ChatGPT
À copier dans ChatGPT avec ce fichier et le brief. Rendre un fichier par tâche ; Claude l'intègre.

### Tâche C1 — Fiches des 6 mécaniques (brief §5.1, §5.2, annexe A)
Damier, Calques, Relier les points, Morse, Langue des signes, César (secours). Pour chacune, un objet dans
`mecaniques.js` au format :
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

## Journal
- 23/10/2026 — Claude : étape 3, couche de stockage (version attendue, refus sans écrasement, historique,
  restauration, anciens fichiers lisibles) et synchronisation de deux dossiers (aperçu, copie, conflit gardé des
  deux côtés, journal). 10 tests `node:test` verts. Test réel sur les postes reporté à la rentrée (vacances).
- 23/10/2026 — Claude : étape 0, `site/test-dossier.html` (écriture, lecture croisée, délai, navigateur,
  deux dossiers + copie d'un fichier lourd). Testée seulement à la syntaxe : l'accès aux dossiers demande un clic
  sur un vrai poste. Résultats attendus de Thomas (bouton « Copier le résultat »).
- 23/10/2026 — Claude : dossier créé, brief copié, plan court rédigé, tâches C1-C3 préparées pour ChatGPT.
