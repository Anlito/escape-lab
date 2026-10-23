# Escape-Lab — contenus C1 à C3

Livraison éditoriale du 23/10/2026. Claude conserve l’architecture, le code, le stockage, les tests et l’intégration. Thomas valide les contenus et le matériel. Aucun fichier du dépôt EscapeLab n’a été modifié.

- C1 : mecaniques.js, six fiches au format demandé par SUIVI.md. Les couleurs sont proposées ; les lettres et noms doivent rester affichés. Les pistes électroniques ajoutées sont explicitement des propositions. Les ressources du Drive non consultées restent à confirmer. Les indices sont des exemples génériques à adapter à chaque énigme.
- C2 : composants.js, onze fiches (relais et électro-aimant séparés). Le wrapper suit l’arborescence proposée dans SUIVI.md. Seul le clavier Grove dispose ici d’une documentation fabricant identifiée. Les dix autres fiches sont des gabarits à compléter : aucune tension, broche ou résistance n’est déduite d’un modèle ressemblant. La référence Semageek 473 n’a pas pu être documentée pendant cette recherche. Les contraintes 12 V viennent du brief et sont indiquées comme telles. Ces fiches ne permettent pas encore un câblage autonome.
- C3 : demonstration-3Z9.json, une équipe fictive, cinq groupes de quatre personnages inventés, histoire et frise, cinq fiches partiellement remplies. Pas de code de cadenas, pas de note, pas de programme Labo Blocs inventé, pas de pièce jointe inexistante.

## Intégration par Claude

Copier C1 et C2 dans site/donnees/ après validation. Les fonctions definirMecaniques et definirComposants sont fournies par l’application. Adapter la démonstration au schéma de stockage définitif : l’annexe B est une proposition, pas un contrat d’import existant. La démonstration regroupe les objets dans un seul fichier de contenu ; ne pas la présenter comme une sauvegarde déjà compatible. Les rubriques de programmation restent à créer via Labo Blocs.

Les champs vides de la démonstration sont intentionnels. Aucun jalon physique n’est validé ; la matière proposée doit encore être confirmée comme vue en cours. L’étape 9 reste à faire côté éditeur et intégration, même quand les contenus seront validés. Ne pas marquer C2 comme achevée tant que les références manquantes ne sont pas documentées.

## Sources

- C1 : SUIVI.md, brief §§4–5, 7.6 et annexe A fournis par Thomas ; pas d’accès aux originaux du Drive.
- C2 Grove : [documentation du fabricant](https://wiki.seeedstudio.com/Grove-12-Channel-Capacitive-Touch-Keypad-ATtiny1616-/), consultée le 23/10/2026. Elle confirme l’interface UART, RX/TX et les alimentations 3,3 V / 5 V. L’ordre physique du connecteur reste à vérifier sur le schéma et le module réels.
- Les précautions 12 V et le point de compatibilité Uno viennent du brief §§11.1–11.2.

## Entrée proposée pour SUIVI.md

23/10/2026 — ChatGPT : six fiches mécaniques et démonstration fictive 3Z9 préparées pour relecture. Onze fiches composants préparées ; seule la documentation du clavier Grove est identifiée, autres références à fournir. Livraison séparée, non intégrée au dépôt. Thomas valide ; Claude adapte au schéma définitif et intègre.
