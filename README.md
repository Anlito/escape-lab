# Escape Lab — Créer. Coder. Jouer.

Outil collaboratif de conception d'un escape game pour trois classes de 3e (technologie) : histoire, frise des
énigmes, bibliothèque commune, fiche énigme de chaque groupe, programmation avec Labo Blocs, jour J, espace
professeur (suivi, pilotage, évaluation, exports) et régie du jour J.

- **Élèves** : `site/index.html` — choisir sa classe, son groupe, son prénom, puis ouvrir le dossier de la classe.
- **Professeur** : `site/index.html?prof` (suivi, pilotage, évaluation, observation, exports), `site/prof.html`
  (fiches mécaniques, composants, synchronisation 3C2D1), `site/regie.html` (régie du jour J). Code professeur :
  le même que Labo Blocs.
- Essai sans dossier : bouton **Classe fictive** (rien n'est enregistré).

Site statique, sans compte et sans serveur. Fonctionne aussi en `file://` depuis le réseau du collège (Chrome ou Edge).
Les données des élèves restent dans les dossiers de classe du collège ; les notes du professeur dans son dossier
personnel. Ce dépôt ne contient que des données fictives.

Développement : `npm test` (tests `node:test`), `npm start` (serveur local, http://localhost:8080). Suivi du projet :
`SUIVI.md` ; recette : `docs/RECETTE.md`. Labo Blocs (`site/vendor/labo-blocs/`) est copié depuis le dépôt
`Anlito/labo-blocs` par `npm run vers-projet` et n'est jamais modifié ici.
