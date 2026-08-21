<div align="center">

#  Mes Orchidées

**Encyclopédie & Gestion de Collections d'orchidées**

*Le monde fascinant des orchidées*

[![Statut](https://img.shields.io/badge/statut-en%20d%C3%A9veloppement-orange)]()
[![MVP](https://img.shields.io/badge/MVP-F%C3%A9vrier%202027-blue)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()
[![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)]()
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)]()
[![Licence](https://img.shields.io/badge/licence-projet%20%C3%A9tudiant-lightgrey)]()

Projet fil rouge — Formation Développeur Web & Web Mobile (DWWM)
Auteur : **Jeremy Ferrier** · `DEV_FAD_2026`

[Signaler un bug](#annexes) · [Documentation](#annexes) · [Dépôt GitHub](https://github.com/jeremyferrierpro-create/mes_orchidees.git)

</div>

---

##  Table des matières

1. [À propos du projet](#-à-propos-du-projet)
   - [Who am I ?](#who-am-i-)
   - [Contexte](#contexte)
   - [Objectifs & périmètre](#objectifs--périmètre)
2. [Stack technique](#-stack-technique)
   - [Contraintes techniques](#contraintes-techniques)
3. [Démarrage rapide](#-démarrage-rapide)
   - [Prérequis](#prérequis)
   - [Installation](#installation)
   - [Utilisation](#utilisation)
4. [Conception](#-conception)
   - [Diagramme d'utilisation](#diagramme-dutilisation)
   - [Maquettage — UX/UI](#maquettage--uxui)
5. [Structure du projet](#-structure-du-projet)
6. [Feuille de route](#-feuille-de-route)
7. [Accessibilité](#-accessibilité)
8. [Annexes](#-annexes)
9. [Auteur & contact](#-auteur--contact)
10. [Licence](#-licence)

---

##  À propos du projet

Aujourd'hui, 90 % des sites dédiés aux orchidées sont anciens, peu sécurisés et mal adaptés aux mobiles. L'information existe, mais elle est éparpillée sur de nombreux sites différents.

**Mes Orchidées** centralise cette information dans une application web moderne, destinée aussi bien aux collectionneurs experts qu'aux débutants passionnés, autour de deux fonctionnalités majeures :

1. Une **encyclopédie** avec moteur de recherche rapide.
2. Un outil de **gestion de collection personnelle** avec système de rappels intelligents.

| Pilier | Description |
|---|---|
| **Centraliser** | Une encyclopédie pour trouver facilement des informations fiables sur les orchidées. |
| **Archiver** | Une collection personnelle pour enregistrer ses plantes et suivre leur évolution. |
| **Accompagner** | Un système de rappels pour aider l'utilisateur à penser aux soins de ses plantes. |

Une première version (**MVP**) se concentre sur la recherche et la gestion de collection ; les autres fonctionnalités seront ajoutées ultérieurement.

### Who am I ?

| | |
|---|---|
| **Nom** | Jeremy Ferrier |
| **Âge** | 45 ans |
| **Ville** | Pamiers |

Passionné de voyage (Antibes, La Réunion, Madagascar, Lyon, Paris, Nîmes, Marrakech...), j'ai d'abord évolué dans le monde végétal — producteur floral, fleuriste, gérant de jardinerie, jardinier, chef d'entreprise — avant de me reconvertir en étudiant développeur web.

Mon objectif : construire des solutions numériques solides et gagner en liberté professionnelle, financière et géographique.

> *« If I want to, I can, I do ! »*

### Contexte

**Analyse du besoin**

| | |
|---|---|
| **Cible** | Collectionneurs privés, passionnés & amateurs |
| **Produit** | Site web responsive, utilisable sur tablette ou mobile |
| **Planning** | Phase 1 (MVP) — Février 2027 |
| **Ambition** | Esthétisme, justesse scientifique & facilité d'utilisation |

**Analyse de la concurrence** — 12 sites concurrents analysés :

| | Points positifs | Points négatifs |
|---|---|---|
| **Interne** | Forte autorité SEO, contenu scientifique riche | Sites abandonnés (2006), non sécurisés, non *mobile-friendly* |
| **Externe** | Captation d'audience, partenariats e-commerce | Refonte des sites associatifs, montée des IA génériques |

**Personas**

<details>
<summary><strong>Jean-Marc — l'expert collectionneur</strong> (58 ans, Paris, médecin à la retraite)</summary>

> *« La précision scientifique au service d'un patrimoine vivant »*

Collection de 150+ spécimens. Exige une rigueur taxonomique absolue et un archivage patrimonial fiable. Frustré par les IA génériques qui commettent des erreurs d'identification et par les interfaces trop « ludiques ».
</details>

<details>
<summary><strong>Jessica — l'amatrice passionnée</strong> (35 ans, Lyon, architecte d'intérieur freelance)</summary>

> *« Je veux comprendre mes plantes et leur offrir les conditions parfaites chez moi. »*

~15 orchidées. Cherche des fiches de culture claires, des rappels d'entretien et un ton bienveillant, jamais culpabilisant.
</details>

### Objectifs & périmètre

Objectifs fixés selon la méthode **S.M.A.R.T.** :

-  **Périmètre MVP :** 8 pages principales, moteur de recherche prédictif, espace utilisateur.
-  **CRUD complet :** Créer, Lire, Modifier, Supprimer les données.
-  **Qualité des données :** validation et enrichissement de l'encyclopédie via modération collaborative.
-  **Cible à 1 an :** 100 utilisateurs passionnés et modérateurs actifs.

**Planning (diagramme de Gantt — 8 mois)**

| Phase | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Spécifications & maquettes (CDC) | ■ | | | | | | | |
| Développement Frontend (HTML/CSS/JS) | | ■ | ■ | | | | | |
| Modélisation & BDD (SQL) | | | | ■ | | | | |
| Logique Backend (PHP) | | | | | ■ | ■ | | |
| Tests unitaires & recette | | | | | | | ■ | |
| Corrections & préparation orale | | | | | | | | ■ |

> Le suivi est complété par un tableau **Kanban sur GitHub Projects**, avec les *User Stories* priorisées du *Backlog* jusqu'à la mise en production.

---

## 🛠 Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | HTML5 · CSS3 · JavaScript (natif) |
| **Backend** | PHP |
| **Base de données** | PostgreSQL via Supabase |
| **Sécurité** | bcrypt · protections CSRF/XSS · Row Level Security (RLS) |
| **Hébergement cible** | Mutualisé type Ionos, LWS |
| **Design** | Figma · Canva · Gloomap |
| **Environnement de dev** | VS Code · XAMPP / Laragon · Git & GitHub |

### Contraintes techniques

- **Performance :** chargement de l'interface en moins de 3 secondes.
- **Responsive :** interface 100 % adaptative, du smartphone à l'ordinateur (usage possible en serre).
- **Sécurité des accès :** mots de passe hachés avec **bcrypt**, sessions PHP maîtrisées, jetons anti-CSRF/XSS, politiques **RLS** Supabase.
- **Traitement des données :** automatisation des fiches au format **WebP**, modération collaborative pour l'administrateur.

---

##  Démarrage rapide

### Prérequis

- Un serveur local type **XAMPP** ou **Laragon** (Apache + PHP)
- **PostgreSQL** ou un projet **Supabase**
- **Git**
- Un éditeur de code, par exemple **VS Code**

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/jeremyferrierpro-create/mes_orchidees.git

# 2. Se placer dans le dossier du projet
cd mes_orchidees

# 3. Démarrer le serveur local (Laragon / XAMPP)

# 4. Ouvrir le projet dans le navigateur
http://localhost/mes_orchidees/index.html
```

### Utilisation

| Étape | Action |
|---|---|
| 1 | Depuis la page d'accueil, rechercher une orchidée par nom courant ou nom scientifique — une fenêtre modale affiche la fiche complète. |
| 2 | Créer un compte ou se connecter pour accéder à l'espace **Ma Collection**. |
| 3 | Ajouter ses orchidées, enregistrer des soins (arrosage, rempotage...) et consulter l'historique. |
| 4 | Consulter la rubrique **Conseils** pour des fiches de culture générales. |
| 5 | *(Administrateur)* Gérer l'encyclopédie et les conseils, modérer les propositions des utilisateurs depuis **Administration**. |

---

##  Conception

### Diagramme d'utilisation

Trois acteurs interagissent avec l'application :

- **Visiteur (non connecté)** — créer un compte, se connecter, rechercher une orchidée, consulter les conseils de culture et les fiches descriptives.
- **Utilisateur connecté** — proposer une orchidée à l'encyclopédie, gérer sa collection, enregistrer un soin, consulter l'historique des soins.
  *Relation `<extend>` : l'enregistrement d'un soin peut déclencher automatiquement l'émission d'un rappel d'entretien.*
- **Administrateur (Back-Office)** — créer/éditer/supprimer des orchidées et des conseils, valider ou refuser une proposition.
  *Relation `<include>` : toute décision de modération déclenche obligatoirement l'envoi d'une notification à l'utilisateur.*

Diagrammes UML complets → [Annexe A](#-annexes).

### Maquettage — UX/UI

Méthode en trois étapes : **Zoning → Wireframe → Mockup**, précédée d'une arborescence et d'un Style Tile.

**Style Tile**

| Élément | Choix |
|---|---|
| Couleurs | Vert forêt `#0e2018` (fond) · doré/bronze `#c4a47c` (actions) · vert accent `#29825B` · blanc `#ffffff` |
| Typographie titres | Cinzel |
| Typographie texte | Inter |
| Visuels | Photos naturelles d'orchidées, non retouchées |

Maquettes complètes (zonings, wireframes, mockups des 7 pages) → [Annexe B](#-annexes).

---

##  Structure du projet

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

**Arborescence des pages (8 pages) :**

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

---

## 🗺 Feuille de route

- [x] Spécifications fonctionnelles & maquettes
- [x] Développement Frontend (HTML/CSS/JS)
- [ ] Modélisation de la base de données (SQL)
- [ ] Développement Backend (PHP)
- [ ] Tests unitaires & recette
- [ ] Mise en production (MVP — février 2027)

---

## ♿ Accessibilité

L'application respecte les critères du **RGAA** et les normes **WCAG 2.1**.

| Pilier | Mise en œuvre |
|---|---|
| **Contrastes** | Ratio ≥ 4.5:1 (texte courant), ≥ 3:1 (composants) |
| **Indépendance à la couleur** | Palette testée pour le daltonisme |
| **Navigation clavier & modale** | Site pilotable au clavier, *focus trap* dans les modales |
| **Sémantique & ARIA** | `alt`, `aria-expanded`, `aria-hidden`, `role="dialog"`, `aria-modal="true"`, `.sr-only` |

Outils de test : [Adobe Color](https://color.adobe.com/) · [RGAA Checker](https://rgaa-checker.com/) · [W3C Validator](https://validator.w3.org/nu)

---

##  Annexes

| Annexe | Contenu |
|---|---|
| **A** | Spécifications fonctionnelles — diagramme UML *use case* complet, architecture |
| **B** | Dossier de conception UX/UI & accessibilité — zonings, wireframes, mockups, rapports de tests |
| **C** | Environnement technique & outillage (tooling) |
| **D** | Qualité du code source — extraits HTML / CSS / JavaScript commentés |

---

##  Auteur & contact

**Jeremy Ferrier**
 Pamiers, France
 [GitHub — mes_orchidees](https://github.com/jeremyferrierpro-create/mes_orchidees.git)

---

##  Licence

Projet réalisé dans le cadre d'une formation Développeur Web & Web Mobile (DWWM). Usage pédagogique.

<div align="center">

 *Mes Orchidées — le monde fascinant des orchidées.*

</div>