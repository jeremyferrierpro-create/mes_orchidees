# User Stories — Mes Orchidées (100% — 88 stories prêtes à copier-coller)

> Format : `En tant que [rôle] je veux [action] afin de [bénéfice]`
> Critères : `Étant donné / Quand / Alors` + checklist testable à cocher pour le jury
> Source : backlog complet 46 Done + 8 In progress + 34 Todo

---

## DONE — 46 stories déjà réalisées (à coller en Done avec preuve)

### DONE-01 — [Conception] Définir la problématique Mes Orchidées
**Story:** En tant que porteur de projet je veux formuler la problématique "centraliser, archiver, accompagner" afin de cadrer tout le MVP.
**Critères:** - Étant donné la présentation, quand on lit la slide problématique, alors on comprend les 3 piliers - Preuve : slide problématique

### DONE-02 — [Conception] Analyser le besoin des collectionneurs et débutants
**Story:** En tant que concepteur je veux distinguer les attentes expert vs débutant afin de ne pas faire un site trop ludique ni trop technique.
**Critères:** - Besoin expert (rigueur taxonomique) et débutant (fiches claires) décrits - Preuve : analyse besoin/cible

### DONE-03 — [Conception] Réaliser une analyse concurrentielle et SWOT
**Story:** En tant que concepteur je veux lister forces/faiblesses de 12 sites concurrents afin de justifier le positionnement.
**Critères:** - Tableau forces/faiblesses/opportunités/menaces présent - Preuve : slides concurrence

### DONE-04 — [Conception] Créer les personas Jean-Marc et Jessica
**Story:** En tant que designer je veux 2 personas (58 ans expert, 35 ans amatrice) afin de tester mes parcours avec de vrais profils.
**Critères:** - 2 fiches avec âge, ville, collection, frustrations - Preuve : personas

### DONE-05 — [Conception] Définir le périmètre MVP
**Story:** En tant que chef de projet je veux dire ce qui est dans le MVP et ce qui attendra afin de ne pas promettre le PHP trop tôt.
**Critères:** - Périmètre 8 pages listé, hors MVP marqué "plus tard" - Preuve : slide périmètre + README

### DONE-06 — [Planification] Produire le diagramme de Gantt à huit mois
**Story:** En tant que planificateur je veux un Gantt 8 mois (M1-M8) afin de montrer l'ordre conception → front → BDD → PHP → tests → oral.
**Critères:** - Gantt avec phases M1-M8 visible - Preuve : slide Gantt

### DONE-07 — [Planification] Créer le GitHub Project initial
**Story:** En tant que gestionnaire je veux un Kanban Todo/In progress/Done afin de suivre le projet au quotidien.
**Critères:** - 3 colonnes existent avec au moins 1 carte - Preuve : capture Project

### DONE-08 — [UML] Modéliser les cas d'utilisation Visiteur
**Story:** En tant que visiteur je veux voir ce que je peux faire sans me connecter (rechercher, consulter) afin de comprendre mes droits.
**Critères:** - Diagramme Visiteur avec rechercher/consulter - Preuve : slide UML Visiteur

### DONE-09 — [UML] Modéliser les cas d'utilisation Utilisateur connecté
**Story:** En tant qu'utilisateur connecté je veux voir mes droits (proposer, collection, soin) afin de savoir pourquoi me connecter.
**Critères:** - Diagramme Utilisateur + extend "enregistrer un soin → rappel" - Preuve : slide UML Utilisateur

### DONE-10 — [UML] Modéliser les cas d'utilisation Administrateur
**Story:** En tant qu'admin je veux voir mes droits (CRUD orchidées/conseils, modération) afin de justifier la page Administration.
**Critères:** - Diagramme Admin + include "modération → notification" - Preuve : slide UML Admin

### DONE-11 — [UX] Concevoir l'arborescence de l'application
**Story:** En tant que visiteur je veux comprendre l'arborescence (Accueil → 7 pages) afin de naviguer sans me perdre.
**Critères:** - Arborescence avec 10 pages listées - Preuve : slide arborescence + 10 HTML

### DONE-12 — [UX] Créer le style tile et l'identité visuelle
**Story:** En tant que designer je veux une palette vert forêt #0e2018 + doré #c4a47c + Cinzel/Inter afin d'avoir une cohérence visuelle.
**Critères:** - Palette + typos + iconographie documentées - Preuve : style tile

### DONE-13 — [UX] Réaliser les zonings des pages clés
**Story:** En tant que designer je veux des zonings (blocs gris) afin de placer header/menu/grille avant les couleurs.
**Critères:** - Zonings des pages clés présents - Preuve : annexes zoning

### DONE-14 — [UX] Réaliser les wireframes des parcours clés
**Story:** En tant que designer je veux des wireframes (filaires) afin de valider le parcours sans design final.
**Critères:** - Wireframes avec modales présents - Preuve : annexes wireframes

### DONE-15 — [UX] Réaliser les mockups de l'interface
**Story:** En tant que designer je veux des mockups fidèles (couleurs, photos) afin de donner la cible au front.
**Critères:** - Mockups des parcours principaux - Preuve : annexes mockups

### DONE-16 — [Front] Créer les 10 pages HTML du MVP
**Story:** En tant que visiteur je veux 10 pages avec un h1, un lang et un main afin d'avoir une base navigable.
**Critères:** - 10 fichiers HTML existent, chacun avec lang, main, h1 - Preuve : inventaire

### DONE-17 — [Front] Mettre en place la structure partagée header, menu et footer
**Story:** En tant que visiteur je veux le même header/menu/footer partout afin de ne pas réapprendre la navigation.
**Critères:** - Header + sidebar + footer présents sur 10 pages + menu s'ouvre avec aria-expanded - Preuve : test runtime

### DONE-18 — [Front] Créer le lien d'évitement vers le contenu principal
**Story:** En tant qu'utilisateur clavier je veux un skip-link "Aller au contenu" afin de sauter le menu.
**Critères:** - skip-link présent, focusable, amène à #main-content - Preuve : contrôle skip-link

### DONE-19 — [Front] Intégrer le design responsive CSS/SCSS
**Story:** En tant que visiteur mobile je veux que le site s'adapte sans scroll horizontal afin d'utiliser le site en serre.
**Critères:** - 45 media queries, test 320px/768px sans débordement - Preuve : CSS + rendu mobile

### DONE-20 — [Front] Mettre en place le focus visible et la réduction des mouvements
**Story:** En tant qu'utilisateur clavier je veux voir où je suis et pouvoir couper les animations afin d'être à l'aise.
**Critères:** - 14 règles :focus-visible, prefers-reduced-motion présent - Preuve : CSS

### DONE-21 — [Front] Créer le menu latéral mobile
**Story:** En tant que visiteur mobile je veux ouvrir le menu avec le hamburger afin d'accéder aux 7 rubriques.
**Critères:** - Clic hamburger ouvre sidebar, aria-expanded passe à true - Preuve : runtime

### DONE-22 — [Front] Ajouter l'animation décorative des noms latins
**Story:** En tant que visiteur sur l'accueil je veux voir des noms latins flotter en fond afin d'avoir une ambiance serre sans gêner la lecture.
**Critères:** - background-animation.js actif, mots en aria-hidden - Preuve : module

### DONE-23 — [Front] Créer la landing page et son formulaire de recherche
**Story:** En tant que visiteur je veux taper "Acacalis" sur l'accueil afin d'aller à l'encyclopédie filtrée.
**Critères:** - index.html avec #landing-search-form, envoi ?search=Acacalis - Preuve : Lighthouse accueil

### DONE-24 — [Données] Constituer le catalogue local des orchidées
**Story:** En tant que développeur je veux 21 fiches orchidées en JS afin de faire tourner la recherche sans BDD.
**Critères:** - orchids-data.js avec 21 objets complets (id, behavior, img en minuscule) - Preuve : fichier

### DONE-25 — [Encyclopédie] Afficher les fiches orchidées
**Story:** En tant que visiteur je veux voir une grille de cartes orchidées afin de parcourir l'encyclopédie.
**Critères:** - Grille avec orchid-card, search.js branché - Preuve : module actif

### DONE-26 — [Recherche] Rechercher une orchidée depuis l'accueil
**Story:** En tant que visiteur je veux que "Acacalis" depuis l'accueil m'affiche sa fiche afin de ne pas chercher à la main.
**Critères:** - Étant donné "Acacalis", quand je valide, alors modale s'ouvre ou encyclopédie filtrée à 1 résultat - Preuve : test navigateur

### DONE-27 — [Modale] Afficher la fiche détaillée d'une orchidée
**Story:** En tant que visiteur je veux voir ordre/famille/origine/description dans une modale afin d'apprendre.
**Critères:** - 13 champs taxonomiques visibles, image alt rempli - Preuve : modale

### DONE-28 — [Modale] Fermer la fiche avec Échap et restaurer le parcours
**Story:** En tant qu'utilisateur clavier je veux fermer avec Échap et revenir où j'étais afin de ne pas perdre le focus.
**Critères:** - Échap ferme, focus revient sur le bouton qui a ouvert - Preuve : runtime

### DONE-29 — [Conseils] Créer le contenu et la recherche de conseils
**Story:** En tant que débutant je veux 6 rubriques + 21 fiches espèces + recherche afin de trouver un conseil adapté.
**Critères:** - conseils-data.js 27 fiches, recherche + modale fonctionnelles - Preuve : modules

### DONE-30 — [Authentification] Créer les formulaires connexion et inscription locale
**Story:** En tant que visiteur je veux m'inscrire/se connecter avec email/mdp afin d'accéder à Ma Collection.
**Critères:** - 2 formulaires, action="#", messages d'erreur/succès visibles - Preuve : formulaires testés

### DONE-31 — [Authentification] Gérer la session locale et la redirection collection
**Story:** En tant qu'utilisateur je veux rester connecté et être redirigé vers Ma Collection après login afin de ne pas repasser par l'accueil.
**Critères:** - STORAGE_KEYS.session créé, redirection vers macollection.html observée - Preuve : démo connexion

### DONE-32 — [Collection] Ajouter une orchidée depuis l'encyclopédie
**Story:** En tant qu'utilisateur connecté je veux cliquer "+ COLLECTION" afin d'archiver la plante chez moi.
**Critères:** - Bouton visible si connecté, ajout + toast vert, doublon = toast orange - Preuve : test

### DONE-33 — [Collection] Afficher le tableau de bord et les cartes de collection
**Story:** En tant que collectionneur je veux voir mon total/épiphytes/terrestres/hémi + mes vignettes afin de suivre l'évolution.
**Critères:** - Compteurs recalculés, vignettes + conseils liés affichés - Preuve : dashboard

### DONE-34 — [Soins] Créer le formulaire d'enregistrement d'un soin
**Story:** En tant que collectionneur je veux saisir date/type/engrais/substrat/ravageurs afin de tracer l'entretien.
**Critères:** - Modale soin avec 4 check types + 3 cycles + champs rendus - Preuve : modale

### DONE-35 — [Soins] Enregistrer l'historique d'un soin localement
**Story:** En tant que collectionneur je veux que mon arrosage reste enregistré afin de ne pas l'oublier.
**Critères:** - Après validation, ligne visible dans tableau soins - Preuve : test

### DONE-36 — [Rappels] Calculer la date de rappel après un soin
**Story:** En tant que collectionneur je veux un rappel J+7 après un arrosage afin de penser au suivant.
**Critères:** - Arrosage le 10/08 → rappel 17/08 visible - Preuve : tableau

### DONE-37 — [Architecture] Modulariser le JavaScript avec ES modules
**Story:** En tant que développeur je veux app.js qui importe 23 modules afin de ne pas avoir un JS géant.
**Critères:** - 23 imports locaux résolus sans erreur - Preuve : app.js

### DONE-38 — [Architecture] Séparer core, data, services et features
**Story:** En tant que développeur je veux core/data/services/features séparés afin de m'y retrouver.
**Critères:** - Arborescence documentée dans README, imports actifs - Preuve : dossier

### DONE-39 — [Architecture] Centraliser le stockage et les services locaux
**Story:** En tant que développeur je veux STORAGE_KEYS unique afin de ne pas me tromper de clé localStorage.
**Critères:** - storage.js avec 7 clés, services utilisent readJson/writeJson - Preuve : services

### DONE-40 — [Administration] Créer le tableau de bord et les modales d'administration
**Story:** En tant qu'admin je veux voir les chiffres + tableaux + 3 boutons afin de modérer.
**Critères:** - Page admin fidèle mockup, modales qui s'ouvrent - Preuve : page active

### DONE-41 — [PWA] Ajouter le manifest et l'enregistrement du service worker
**Story:** En tant que visiteur je veux que le site s'installe comme une app afin de le voir hors-ligne.
**Critères:** - manifest.json + pwa.js + sw.js présents + enregistrement OK - Preuve : fichiers

### DONE-42 — [Qualité] Vérifier la syntaxe de tous les scripts JavaScript
**Story:** En tant que développeur je veux 0 erreur de syntaxe sur 25 fichiers JS afin de ne pas planter à l'oral.
**Critères:** - node --check sur 25 fichiers = OK - Preuve : logs

### DONE-43 — [Qualité] Tester les parcours principaux dans le navigateur
**Story:** En tant que testeur je veux avoir rejoué recherche/modale/auth/collection/soins afin d'être sûr que ça marche.
**Critères:** - 5 parcours rejoués avec succès - Preuve : test humain

### DONE-44 — [Performance] Réaliser un audit Lighthouse sur index.html
**Story:** En tant que PO je veux un Lighthouse 100/100 afin de prouver la perf.
**Critères:** - Rapport 13.4 avec 100/100 sur 4 catégories (contexte test fourni) - Preuve : rapport

### DONE-45 — [Accessibilité] Réaliser un audit RGAA interne des 106 critères
**Story:** En tant que PO je veux une matrice RGAA 106 critères afin d'être honnête sur l'état.
**Critères:** - Matrice avec 44 C / 3 NC / 40 NA / 19 NM - Preuve : matrice

### DONE-46 — [Documentation] Rédiger le README et documenter la roadmap
**Story:** En tant que visiteur GitHub je veux un README qui explique l'install en 30s et la roadmap afin de comprendre sans te déranger.
**Critères:** - README avec install, structure réelle, limites localStorage, roadmap - Preuve : README

---

## In progress — 8 stories en cours (à finir pour passer en Done)

### PROG-01 — [Accessibilité] Corriger les rôles ARIA invalides de la page Conseils
**Story:** En tant qu'utilisateur lecteur d'écran je veux 0 rôle ARIA invalide sur Conseils afin de ne pas être bloqué.
**Critères:** - Aucune erreur aria-allowed-role / aria-prohibited-attr au validateur - Preuve : rapport Axe

### PROG-02 — [Accessibilité] Corriger la hiérarchie des titres Encyclopédie et Administration
**Story:** En tant qu'utilisateur clavier je veux une hiérarchie h1→h2→h3 sans saut afin de naviguer logiquement.
**Critères:** - heading-order OK sur les 2 pages - Preuve : validateur titres

### PROG-03 — [Accessibilité] Finaliser les preuves de contraste, zoom et lecteur d'écran
**Story:** En tant que malvoyant je veux un contraste ≥4.5:1 + zoom 200% sans perte afin de lire.
**Critères:** - Rapport avec captures zoom 200% + espacement + lecteur d'écran - Preuve : rapport

### PROG-04 — [Administration] Mettre en cohérence les actions affichées et les effets réels
**Story:** En tant qu'admin je veux que chaque bouton fasse vraiment ce qu'il dit (ou soit marqué maquette) afin de ne pas mentir.
**Critères:** - Chaque action persistante testée ou badge "maquette" visible - Preuve : test

### PROG-05 — [Droits] Appliquer le rôle administrateur dans le MVP local
**Story:** En tant que visiteur non admin je veux être bloqué sur administration.html afin de ne pas voir le back-office.
**Critères:** - Utilisateur simple redirigé, admin autorisé - Preuve : test 2 rôles

### PROG-06 — [Qualité] Nettoyer ou archiver les scripts historiques non actifs
**Story:** En tant que développeur je veux 0 script mort dans assets/js afin d'avoir une arborescence propre.
**Critères:** - 0 doublon non justifié, README mis à jour - Preuve : arborescence

### PROG-07 — [PWA] Tester réellement le parcours hors ligne
**Story:** En tant que visiteur sans réseau je veux que l'index s'affiche quand même afin de prouver la PWA.
**Critères:** - Test offline avec cache, PV + correction si besoin - Preuve : PV

### PROG-08 — [Documentation] Mettre à jour la présentation et la page Accessibilité
**Story:** En tant que jury je veux que tes slides ne promettent pas plus que le MVP livré afin de te croire.
**Critères:** - Support + README + page Accessibilité alignés avec preuves datées - Preuve : docs

---

## Todo — 34 stories à faire (copie en Todo, ne démarre que 2-3 à la fois)

### TODO-01 — [Gestion projet] Créer les User Stories et critères d'acceptation
**Story:** En tant que PO je veux 1 story par fonction (MVP + future) afin que chaque ligne de code ait un test attendu.
**Critères:** - 80+ stories avec priorité et test - Preuve : ce fichier

### TODO-02 — [Gestion projet] Renseigner les preuves sur chaque carte GitHub Project
**Story:** En tant que PO je veux 1 capture/lien par carte Done afin de prouver sans parler.
**Critères:** - Chaque Done a un champ Preuve rempli - Preuve : Project

### TODO-03 — [Git] Montrer le workflow branches, pull requests et merges
**Story:** En tant que développeur je veux 1 feature en branche → PR → merge montrable à l'oral afin de prouver le Git.
**Critères:** - 1 PR avec revue visible - Preuve : GitHub

### TODO-04 — [Responsive] Tester toutes les pages à 320 / 768 / 1440 px
**Story:** En tant que visiteur mobile je veux 0 débordement à 320px afin d'utiliser le site en serre.
**Critères:** - Tableau recette par page OK - Preuve : captures

### TODO-05 — [Formulaires] Ajouter autocomplete et revoir confirmations sensibles
**Story:** En tant qu'utilisateur je veux que mes champs se remplissent seuls et que "Supprimer" demande confirmation afin d'éviter les erreurs.
**Critères:** - autocomplete + confirm testés - Preuve : test

### TODO-06 — [Tests] Établir le plan de recette front-end complet
**Story:** En tant que testeur je veux un plan avec cas positifs/négatifs/clavier/ rôles afin de ne rien oublier.
**Critères:** - Document recette complet - Preuve : doc

### TODO-07 — [Documentation] Créer une matrice fonction annoncée / réelle / roadmap
**Story:** En tant que jury je veux voir clair entre "c'est livré" et "c'est prévu" afin de te faire confiance.
**Critères:** - Matrice sans mensonge - Preuve : matrice

### TODO-08 — [BDD] Recenser les règles de gestion métier
**Story:** En tant que DBA je veux les règles (qui possède quoi, qui modère quoi) afin de faire le MCD.
**Critères:** - Règles formalisées - Preuve : doc

### TODO-09 — [BDD] Réaliser le MCD
**Story:** En tant que DBA je veux un MCD avec utilisateur/orchidée/collection/soin/conseil/proposition/notification afin de valider le modèle.
**Critères:** - Entités + cardinalités validées - Preuve : MCD

### TODO-10 — [BDD] Réaliser le MLD et le dictionnaire de données
**Story:** En tant que DBA je veux tables/clés/types/index afin de créer le SQL.
**Critères:** - MLD + dico documentés - Preuve : doc

### TODO-11 — [BDD] Créer le schéma SQL PostgreSQL
**Story:** En tant que DBA je veux un script SQL qui tourne sans erreur afin de créer la BDD.
**Critères:** - Script exécutable - Preuve : log

### TODO-12 — [BDD] Insérer les données de référence orchidées et conseils
**Story:** En tant que DBA je veux un seed avec 21+27 fiches afin de démarrer avec de vraies données.
**Critères:** - Seed reproductible - Preuve : seed

### TODO-13 — [BDD] Préparer la migration des données localStorage
**Story:** En tant que dev je veux un mapping mo_orchids → tables afin de ne pas perdre les collections.
**Critères:** - Mapping documenté - Preuve : doc

### TODO-14 — [Back-end] Initialiser le projet PHP et la configuration d'environnement
**Story:** En tant que dev je veux un dossier PHP + .env non commité afin de démarrer le back.
**Critères:** - Env documenté, secrets hors dépôt - Preuve : env

### TODO-15 — [Back-end] Créer l'API d'authentification
**Story:** En tant que visiteur je veux m'inscrire/me connecter via PHP afin d'avoir une vraie session serveur.
**Critères:** - Inscription/connexion/déconnexion testées - Preuve : API

### TODO-16 — [Sécurité] Hacher les mots de passe et supprimer les comptes démo en clair
**Story:** En tant que sécu je veux des mots de passe hachés, plus jamais en clair dans le code.
**Critères:** - Aucun mdp en clair, bcrypt OK - Preuve : code

### TODO-17 — [Sécurité] Mettre en place les rôles et autorisations côté serveur
**Story:** En tant qu'admin je veux que le serveur vérifie les droits, pas juste le CSS qui cache un bouton.
**Critères:** - Route admin refusée pour user simple - Preuve : test API

### TODO-18 — [Sécurité] Mettre en place CSRF, validation serveur et prévention XSS
**Story:** En tant qu'attaquant je veux que mes requêtes invalides soient bloquées.
**Critères:** - Tests hostile documentés - Preuve : tests

### TODO-19 — [API] Créer le CRUD des orchidées
**Story:** En tant qu'admin je veux créer/lire/modifier/supprimer une orchidée qui persiste en BDD.
**Critères:** - CRUD persistant + autorisé - Preuve : API

### TODO-20 — [API] Créer le CRUD des conseils
**Story:** En tant qu'admin je veux CRUD conseils avec contrôle admin.
**Critères:** - CRUD + rôle admin - Preuve : API

### TODO-21 — [API] Créer le CRUD de la collection et des soins
**Story:** En tant qu'utilisateur je veux que ma collection/soins ne soient visibles que par moi.
**Critères:** - Isolation par utilisateur - Preuve : test 2 users

### TODO-22 — [API] Créer le workflow de proposition et de modération
**Story:** En tant qu'utilisateur je veux proposer une orchidée, l'admin valide/refuse et je reçois une notif.
**Critères:** - Statut/auteur/décision/notification persistés - Preuve : workflow

### TODO-23 — [Rappels] Définir puis implémenter le mécanisme de notification fiable
**Story:** En tant que collectionneur je veux un rappel fiable (pas juste un calcul JS) pour mon arrosage.
**Critères:** - Rappel stocké, échéance, modalité définie - Preuve : mécanisme

### TODO-24 — [Tests] Écrire les tests unitaires des services métier
**Story:** En tant que dev je veux des tests sur auth/rôles/collection/soins afin de ne pas casser en refactorant.
**Critères:** - Cas critiques couverts - Preuve : tests

### TODO-25 — [Tests] Réaliser les tests d'intégration API / BDD
**Story:** En tant que dev je veux des parcours complets avec BDD isolée afin de tester le vrai flux.
**Critères:** - Parcours OK - Preuve : tests

### TODO-26 — [Recette] Réaliser la recette fonctionnelle multi-rôles
**Story:** En tant que PO je veux un PV qui valide visiteur/user/admin.
**Critères:** - PV signé - Preuve : PV

### TODO-27 — [Recette] Réaliser la campagne RGAA finale
**Story:** En tant que PO je veux une matrice RGAA à jour sans mensonge.
**Critères:** - Matrice mise à jour - Preuve : matrice

### TODO-28 — [Performance] Rejouer Lighthouse sur les pages critiques
**Story:** En tant que PO je veux des rapports Lighthouse datés pour 4 pages.
**Critères:** - 4 rapports - Preuve : rapports

### TODO-29 — [Déploiement] Choisir l'hébergement et préparer les variables d'environnement
**Story:** En tant que devops je veux un hébergement + env prod documenté sans secret en clair.
**Critères:** - Env prod décrit - Preuve : doc

### TODO-30 — [Déploiement] Déployer une version de démonstration
**Story:** En tant que visiteur je veux une URL https testable avec procédure de rollback.
**Critères:** - URL + doc déploiement - Preuve : URL

### TODO-31 — [Documentation] Finaliser le README, le guide d'installation et la documentation API
**Story:** En tant que nouveau dev je veux installer en 5 minutes avec le README + doc API.
**Critères:** - Install reproductible - Preuve : docs

### TODO-32 — [Oral] Mettre à jour le pitch à partir du MVP réellement livré
**Story:** En tant que jury je veux que tu distingues présent/futur sans chiffres inventés.
**Critères:** - Pitch honnête - Preuve : pitch

### TODO-33 — [Oral] Répéter la démonstration chronométrée du parcours utilisateur
**Story:** En tant que candidat je veux une démo 3-5 min fluide avec plan B.
**Critères:** - Démo chronométrée - Preuve : vidéo

### TODO-34 — [Oral] Préparer les annexes de preuve
**Story:** En tant que jury je veux les annexes (UML, Gantt, RGAA, Lighthouse) à portée de main.
**Critères:** - Annexes accessibles - Preuve : dossier

---
*Fichier généré pour GitHub Project — chaque titre est copiable tel quel. Colle le titre dans le champ Title, la Story + Critères dans la description, ajoute Phase/Priority/Type.*
