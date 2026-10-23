# Recette manuelle d'Escape Lab

Tests automatiques : `npm test` (stockage, synchronisation, fonctions communes). Essai sans dossier : `npm start`,
ouvrir http://localhost:8080, bouton **Classe fictive** (rien n'est enregistré).

## Étape 0 — dossier partagé (à la rentrée, sur les postes du collège)
- [ ] `site/test-dossier.html` sur un poste élève, un second poste et le poste du professeur (voir la page).

## Étape 4 — accueil et tableau de bord
- [ ] Sans classe, groupe ou prénom : un message en ambre dit ce qui manque.
- [ ] Le chemin du dossier à choisir s'affiche sous la classe.
- [ ] Après ouverture : prénom, groupe et équipe en haut ; « Reprendre » au retour sur l'accueil.
- [ ] Un dossier qui ne porte pas le nom de la classe : avertissement en ambre, non bloquant.

## Étape 5 — histoire et frise
Avec deux postes (ou deux onglets) sur le même dossier :
- [ ] A clique sur « Modifier » d'une section : en moins de 15 s, B voit « ✎ A (groupe …) modifie cette section ».
- [ ] A et B modifient la même section, A enregistre puis B : B voit les deux textes et peut les garder tous les deux.
- [ ] B voit que quelqu'un a enregistré pendant qu'il écrivait, sans perdre son texte en cours.
- [ ] Historique d'une section : chaque enregistrement est listé ; restaurer une ancienne version en crée une nouvelle.
- [ ] Frise : début, énigmes, liaisons et fin dans l'ordre ; en vertical sur tablette en portrait.
- [ ] Liaison vide : « ce que l'énigme d'avant donne » est prérempli avec le contenu de sa boîte.
- [ ] Durée totale au-delà de 60 min : message en ambre.
- [ ] Classe fictive, « Essayer les commandes du professeur » : déplacer (glisser ou flèches), retirer, ajouter,
      note ; l'historique de l'ordre affiche l'ancien et le nouvel ordre, l'auteur et la note.

## Étape 6 — bibliothèque commune
- [ ] Ajouter une note, un lien Canva, une image, un PDF, un son et une courte vidéo : chacun s'affiche avec son aperçu.
- [ ] Un fichier trop lourd (plus de 20 Mo) ou d'un autre type : message en ambre qui dit quoi faire.
- [ ] Un lien qui ne commence pas par https:// est refusé.
- [ ] Recherche (sans accents), filtres par type, étiquette et groupe.
- [ ] Mettre à la corbeille, cocher « Corbeille », sortir de la corbeille.
- [ ] Deux postes modifient le même élément : les deux textes sont réunis, rien n'est perdu.
- [ ] Le fichier ajouté sur un poste s'ouvre sur l'autre poste (et, pour 3C2D1, après synchronisation).
- [ ] Délai de copie d'une vidéo de 20 Mo sur le réseau du collège (question 13).
