# Analyse du projet "Mes Orchidées"

## 1. Architecture du projet et structure Frontend

Le projet "Mes Orchidées" est une application web/mobile (WebApp) développée dans le cadre d'un projet de certification. Il se présente comme un outil encyclopédique et de suivi pour les cultivateurs d'orchidées.

*   **Structure des fichiers:**
    *   Les pages principales HTML sont à la racine (`index.html`, `encyclopedie.html`).
    *   Le dossier `assets/` contient toutes les ressources :
        *   `images/` : Images des orchidées (au format optimisé .webp d'après le README, bien que des `.png` soient présents dans le repo) et du site (logo, fond).
        *   `css/` et `scss/` : Les feuilles de style. Le projet utilise SCSS avec une architecture modulaire solide (fichiers séparés pour les variables, mixins, reset, typographie, composants, layouts, et pages spécifiques). Les fichiers SCSS sont compilés en `style.css` et minifiés dans le dossier `css/`.
    *   Le fichier `.vscode/settings.json` montre une configuration spécifique pour l'éditeur, notamment pour l'utilisation d'Emmet, la désactivation de l'IA générative et la gestion de la complétion.

*   **Technologies apparentes:**
    *   HTML5 (utilisation de balises sémantiques comme `<article>`, `<section>`, `<main>`).
    *   CSS/SCSS (Architecture type "7-1" simplifiée).
    *   JavaScript natif (Vanilla JS) intégré dans les fichiers HTML pour la logique d'interface (ex: moteur de recherche, gestion des modales).
    *   Le backend (selon le README) est prévu en PHP 8+ avec une base de données MySQL 8+ ou PostgreSQL via Supabase, bien qu'aucun fichier PHP ne soit présent dans le dépôt actuel.


## 2. Modèle de Données (Base de données relationnelle)

D'après le `README.md`, le projet s'appuie sur un schéma de base de données relationnelle complexe comprenant au moins 13 tables principales, conçues pour gérer des données allant de la taxonomie botanique stricte au suivi d'entretien des plantes par les utilisateurs.

*   **Entités de base:**
    *   `users`: Gestion des comptes utilisateurs avec rôles (admin, user).
    *   `botanistes`: Référentiel des auteurs scientifiques, lié aux découvertes d'orchidées.
    *   `orchids`: L'encyclopédie botanique elle-même (nom latin, classification taxonomique, origine, etc.).
*   **Données de l'utilisateur (Collection):**
    *   `user_locations`: Coordonnées géographiques de l'utilisateur.
    *   `collection_sites`: Environnements de culture spécifiques de l'utilisateur (serre, maison, extérieur) avec relevés de température et d'humidité.
    *   `collection_items`: L'inventaire personnel, liant un utilisateur, une espèce (`orchid_id`), un emplacement physique (`site_id`) et l'état de la plante.
*   **Suivi et Culture:**
    *   `care_cycles`: Phases métaboliques de l'orchidée (croissance, repos, floraison...).
    *   `care_tasks`: Actions d'entretien possibles (arrosage, rempotage...).
    *   `soins`: Historique des actions effectuées sur les plantes, lié à des conditions environnementales spécifiques au moment du soin.
    *   `rappels_soins`: Moteur d'agenda pour planifier les futurs entretiens.
*   **Contenus et Interactions:**
    *   `conseils`: Base de connaissances modulaire selon le type de plante et le niveau technique.
    *   `propositions_orchidees`: Système de proposition collaborative d'espèces, nécessitant l'approbation d'un administrateur.
    *   `notifications`: Système d'alertes asynchrones pour l'utilisateur.

L'intégrité de la base est assurée par de fortes contraintes (`FOREIGN KEY`, `ON DELETE CASCADE`) et des mesures de sécurité pour le RGPD.


## 3. Composants UI/UX (Architecture CSS/SCSS)

Le code explore des aspects intéressants de l'UI et de l'UX, s'appuyant sur l'organisation des fichiers SCSS trouvée :

*   **Modularité CSS :** L'utilisation de SCSS et son architecture (définie dans `style.scss`) démontre une volonté de code maintenable et réutilisable. Le découpage comprend :
    *   `base/` (reset CSS, typographie).
    *   `abstracts/` (variables pour les couleurs et espacements, mixins).
    *   `layout/` (fichiers distincts pour le Header, le Footer et la Sidebar).
    *   `components/` (boutons, barres de recherche, cartes pour afficher les plantes, fenêtres modales).
    *   `pages/` (styles spécifiques pour l'accueil, l'encyclopédie, la page de collection, l'administration, etc.).
*   **Interactivité JS intégrée :** Les fichiers HTML intègrent des scripts JS directement pour gérer le comportement de la page.
    *   Un moteur de recherche simulé est présent dans `index.html` via un tableau d'objets JS (`orchidsDatabase`).
    *   **Gestion de Modales :** Un système d'ouverture et de fermeture de fenêtres modales est implémenté, gérant l'injection de données (`injectModalData`).
    *   **Accessibilité (Focus Trap) :** Il est notable de souligner l'implémentation manuelle, directement en JS, d'un "Focus Trap" dans la modale d'affichage des orchidées. Ce script retient la navigation au clavier (Touche Tab) à l'intérieur de la fenêtre modale lorsqu'elle est ouverte, ce qui est une excellente pratique d'accessibilité (A11y). De plus, les attributs `aria-hidden` sont modifiés de façon dynamique lors de l'ouverture et de la fermeture pour informer les lecteurs d'écran.
