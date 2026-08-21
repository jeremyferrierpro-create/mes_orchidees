# Mes Orchidées

**Encyclopédie & Gestion de Collections d'orchidées**
*Le monde fascinant des orchidées*

![Statut](https://img.shields.io/badge/statut-en%20développement-orange)
![MVP](https://img.shields.io/badge/MVP-Février%202027-blue)
![Licence](https://img.shields.io/badge/licence-projet%20étudiant-lightgrey)

Projet fil rouge — Formation Développeur Web & Web Mobile (DWWM)
Auteur : **Jeremy Ferrier** — `DEV_FAD_2026`

---

## Sommaire

- [Who am I ?](#who-am-i-)
- [Présentation du projet](#présentation-du-projet)
- [Contexte](#contexte)
- [Objectifs & périmètre](#objectifs--périmètre)
- [Contraintes techniques](#contraintes-techniques)
- [Diagramme d'utilisation](#diagramme-dutilisation)
- [Maquettage — UX/UI](#maquettage--uxui)
- [Installation & utilisation](#installation--utilisation)
- [Arborescence du projet](#arborescence-du-projet)
- [Annexes](#annexes)

---

## Who am I ?

**Prénom & Nom :** Jeremy Ferrier
**Âge :** 45 ans
**Ville :** Pamiers

Passionné de voyage (Antibes, La Réunion, Madagascar, Lyon, Paris, Nîmes, Marrakech...), j'ai d'abord évolué dans le monde végétal en tant que producteur floral, fleuriste, gérant de jardinerie, jardinier puis chef d'entreprise, avant de me reconvertir en étudiant développeur web.

Mon objectif : construire des solutions numériques solides et gagner en liberté professionnelle, financière et géographique.

> *« If I want to, I can, I do ! »*

---

## Présentation du projet

Aujourd'hui, 90 % des sites dédiés aux orchidées sont anciens, peu sécurisés et mal adaptés aux mobiles. L'information existe, mais elle est éparpillée sur de nombreux sites différents.

**Mes Orchidées** est une application web qui centralise cette information et accompagne aussi bien les collectionneurs experts que les débutants passionnés, autour de deux grandes fonctionnalités :

1. Une **encyclopédie** avec moteur de recherche rapide.
2. Un outil de **gestion de collection personnelle** avec système de rappels intelligents.

Le projet repose sur trois piliers :

| Pilier | Description |
|---|---|
| **Centraliser** | Une encyclopédie pour trouver facilement des informations fiables sur les orchidées. |
| **Archiver** | Une collection personnelle pour enregistrer ses plantes et suivre leur évolution. |
| **Accompagner** | Un système de rappels pour aider l'utilisateur à penser aux soins de ses plantes. |

Une première version (MVP) se concentrera sur la recherche et la gestion de collection ; les autres fonctionnalités seront ajoutées ultérieurement.

---

## Contexte

### Analyse du besoin

| | |
|---|---|
| **Cible** | Collectionneurs privés, passionnés & amateurs |
| **Produit** | Site web responsive, utilisable sur tablette ou mobile |
| **Planning** | Phase 1 (MVP) — Février 2027 |
| **Ambition** | Esthétisme, justesse scientifique & facilité d'utilisation |

### Analyse de la concurrence (SWOT)

Douze sites concurrents ont été analysés.

| | Positif | Négatif |
|---|---|---|
| **Interne** | Forte autorité SEO, contenu scientifique riche | Sites abandonnés (2006), non sécurisés, non *mobile-friendly* |
| **Externe** | Captation d'audience, partenariats e-commerce | Refonte des sites associatifs, montée des IA génériques |

Constat : un sentiment de « site abandonné » chez la plupart des concurrents, d'où l'opportunité de proposer une application moderne, simple et responsive.

### Personas

**Jean-Marc — l'expert collectionneur** (58 ans, Paris, médecin à la retraite)
> *« La précision scientifique au service d'un patrimoine vivant »*
Collection de 150+ spécimens, exige une rigueur taxonomique absolue et un archivage patrimonial fiable. Frustré par les IA génériques qui commettent des erreurs d'identification et par les interfaces trop « ludiques ».

**Jessica — l'amatrice passionnée** (35 ans, Lyon, architecte d'intérieur freelance)
> *« Je veux comprendre mes plantes et leur offrir les conditions parfaites chez moi. »*
~15 orchidées, cherche des fiches de culture claires, des rappels d'entretien et un ton bienveillant, jamais culpabilisant.

---

## Objectifs & périmètre

Objectifs fixés selon la méthode **S.M.A.R.T.** :

- **Périmètre épuré (MVP) :** 8 pages principales, intégrant un moteur de recherche prédictif et un espace utilisateur.
- **CRUD complet :** permettre à l'utilisateur de Créer, Lire, Modifier et Supprimer des données.
- **Qualité des données :** validation et enrichissement de l'encyclopédie via une modération collaborative.
- **Cible à 1 an :** atteindre 100 utilisateurs passionnés et modérateurs actifs.

### Règles techniques

1. Site **100 % responsive**, fluide sur mobile (usage possible en serre).
2. **Affichage rapide** (< 3 secondes) pour une navigation agréable.

### Planning (diagramme de Gantt — 8 mois)

| Phase | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Spécifications & maquettes (CDC) | ■ | | | | | | | |
| Développement Frontend (HTML/CSS/JS) | | ■ | ■ | | | | | |
| Modélisation & BDD (SQL) | | | | ■ | | | | |
| Logique Backend (PHP) | | | | | ■ | ■ | | |
| Tests unitaires & recette | | | | | | | ■ | |
| Corrections & préparation orale | | | | | | | | ■ |

Le suivi est complété par un tableau **Kanban sur GitHub Projects**, où les *User Stories* sont priorisées depuis le *Backlog* jusqu'à la mise en production.

---

## Contraintes techniques

### Architecture & performance

- **Frontend :** HTML5 / CSS3 / JavaScript natif
- **Backend :** PHP / PostgreSQL (via Supabase)
- **Hébergement (cible) :** mutualisé type Ionos, LWS
- Cible de performance : chargement de l'interface en moins de 3 secondes, 100 % responsive

### Sécurisation des accès

- Chiffrement des mots de passe via l'algorithme **bcrypt**
- Gestion rigoureuse des sessions PHP
- Jetons de protection contre les failles **CSRF/XSS**
- Politiques de sécurité **RLS** (Row Level Security) côté Supabase

### Traitement des données (CRUD)

- Automatisation des fiches au format **WebP**
- Système de **modération collaborative** pour l'administrateur

---

## Diagramme d'utilisation

Trois acteurs interagissent avec l'application :

- **Visiteur (non connecté)** — créer un compte, se connecter, rechercher une orchidée dans l'encyclopédie, consulter les conseils de culture et les fiches descriptives.
- **Utilisateur connecté (passionné/collectionneur)** — proposer une orchidée à l'encyclopédie, ajouter une orchidée à sa collection, la consulter/éditer, enregistrer un soin, consulter l'historique des soins.
  - Relation `<extend>` : l'enregistrement d'un soin peut déclencher automatiquement l'émission d'un rappel d'entretien.
- **Administrateur (Back-Office)** — créer/supprimer un conseil de culture, ajouter/éditer/supprimer une orchidée dans l'encyclopédie, valider ou refuser une orchidée proposée, consulter les détails d'une proposition.
  - Relation `<include>` : toute validation ou refus d'une proposition déclenche obligatoirement l'émission d'une notification de décision à l'utilisateur.

Les diagrammes UML *use case* détaillés sont disponibles en [Annexe A](#annexes).

---

## Maquettage — UX/UI

Le processus de conception a suivi les étapes classiques : **Arborescence → Style Tile → Accessibilité → Zoning → Wireframe → Mockup**.

### Arborescence (8 pages)

```
Accueil
├── Encyclopédie
├── Ma Collection
├── Conseils
├── Administration
├── Authentification
├── Confidentialité
└── Mentions légales
```

### Style Tile

| Élément | Choix |
|---|---|
| **Couleurs** | Vert forêt profond `#0e2018` (fond), doré/bronze `#c4a47c` (boutons/liens), vert accent `#29825B`, blanc `#ffffff` |
| **Typographie titres** | Cinzel — esprit « livre de botanique » |
| **Typographie texte** | Inter — moderne et lisible, même sur petit écran |
| **Visuels** | Photos naturelles d'orchidées « en situation réelle », sans retouche studio excessive |

### Accessibilité (RGAA / WCAG 2.1)

L'application respecte les critères du **RGAA** et les normes **WCAG 2.1**, obligatoires légalement pour le secteur public sous peine d'amende.

4 piliers d'intégration :

- **Contrastes** : ratio ≥ 4.5:1 (texte courant) et ≥ 3:1 (composants d'interface)
- **Indépendance à la couleur** : palette testée pour le daltonisme
- **Navigation clavier & modale** : site 100 % pilotable au clavier, *focus trap* dans les fenêtres modales
- **Sémantique & ARIA** : `alt`, `aria-expanded`, `aria-hidden`, `role="dialog"`, `aria-modal="true"`, classe utilitaire `.sr-only`

Outils de test utilisés : [Adobe Color](https://color.adobe.com/), [RGAA Checker](https://rgaa-checker.com/), [W3C Validator](https://validator.w3.org/nu).

Le maquettage complet des 7 pages principales (zonings, wireframes, mockups) est disponible en [Annexe B](#annexes).

---

## Installation & utilisation

### Prérequis

- Un serveur local type **XAMPP** ou **Laragon** (Apache + PHP)
- **PostgreSQL** ou un projet **Supabase**
- **VS Code** (ou tout éditeur de code)
- **Git**

### Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/jeremyferrierpro-create/mes_orchidees.git

# 2. Se placer dans le dossier du projet
cd mes_orchidees

# 3. Démarrer le serveur local (Laragon / XAMPP)
#    puis ouvrir dans le navigateur :
http://localhost/mes_orchidees/index.html
```

### Utilisation

1. Sur la page d'accueil, utiliser la barre de recherche pour trouver une orchidée par son nom courant ou son nom scientifique — une fenêtre modale affiche alors sa fiche complète.
2. Créer un compte ou se connecter pour accéder à l'espace **Ma Collection**.
3. Ajouter ses propres orchidées, enregistrer des soins (arrosage, rempotage...) et consulter l'historique.
4. Consulter la rubrique **Conseils** pour des fiches de culture générales.
5. (Administrateur) Gérer l'encyclopédie, les conseils et modérer les propositions des utilisateurs depuis l'espace **Administration**.

---

## Arborescence du projet

```
C:.
├───.vscode
└───assets
    ├───css
    ├───images
    │   ├───orchids
    │   └───site
    ├───js
    └───scss
        ├───abstracts
        ├───base
        ├───components
        ├───layout
        └───pages
```

---

## Annexes

| Annexe | Contenu |
|---|---|
| **A** | Spécifications fonctionnelles — diagramme UML *use case* complet, architecture |
| **B** | Dossier de conception UX/UI & accessibilité — zonings, wireframes, mockups des 7 pages, rapports de tests d'accessibilité, audit RGAA Checker, validation W3C |
| **C** | Environnement technique & outillage (tooling) |
| **D** | Qualité du code source — extraits HTML / CSS / JavaScript commentés |

### Environnement technique & outillage

| Phase du projet | Outils & technologies utilisés |
|---|---|
| Conception & design | Figma, Canva, Gloomap |
| Environnement de dev | VS Code, XAMPP / Laragon, Git & GitHub |
| Stack technique (MVP) | HTML5 / CSS3 / JavaScript, PHP / SQL, PostgreSQL / Supabase |
| Bibliothèques & libs | Ajoutées au fur et à mesure du développement |
| Rédaction | Google Docs, LibreOffice, Gemini |
| Recherche | Google, Gemini, [MDN Web Docs](https://developer.mozilla.org/fr/docs/) |
| Tests & accessibilité | [Adobe Color](https://color.adobe.com/), [RGAA Checker](https://rgaa-checker.com/), [W3C Validator](https://validator.w3.org/nu) |

---

## Dépôt GitHub

🔗 [github.com/jeremyferrierpro-create/mes_orchidees](https://github.com/jeremyferrierpro-create/mes_orchidees.git)

---

<p align="center"> Merci pour votre lecture — <em>Mes Orchidées, le monde fascinant des orchidées.</em> </p>
