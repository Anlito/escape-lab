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

## Questions à Thomas (grille C6)
1. Barème : A–D = 0, 1, 2, 3 points (tout en C donne 13,3/20). Garder, ou celui des grilles Excel existantes ?
2. Couleurs : le brief dit rouge / jaune / vert clair / vert foncé, la règle commune dit « jamais de rouge ». Remplacer le rouge (par ex. gris) ?
3. Coefficients : 2 pour fiche énigme, câblage, programme, test croisé ; 1 ailleurs. D'accord ?

## Journal
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
