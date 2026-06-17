Modèle de Fichier RDG README --- Général --- Version: 0.1 (2022-11-22) 

Ce fichier README a été généré le 2026-06-17 par Jérémy FERRIER.

Dernière mise-à-jour le : 2026-06-17.

# INFORMATIONS GENERALES

## Titre du jeu de données :
Structure relationnelle, données d'encyclopédie et logs de suivi pour l'application "Mes Orchidées"

## DOI:
Pas de DOI attribué (Projet de certification d'application Web/Web Mobile)

## Adresse de contact :
jeremyferrierpro-create (via GitHub Repository)

---

# INFORMATIONS METHODOLOGIQUES

## Conditions environnementales / experimentales : 
L'application "Mes Orchidées" est conçue sous forme de WebApp responsive. Les données de suivi biologique proviennent d'observations directes au sein de structures de culture variées (serres chaudes, serres tempérées, orchidariums ou rebords de fenêtres en appartements). L'application gère des paramètres physiques réels mesurés sur site tels que la température ambiante, l'hygrométrie relative, l'orientation de l'installation et le type de ventilation.

## Description des sources et méthodes utilisées pour collecter et générer les données :
* **Données taxonomiques et scientifiques (Orchids, Botanistes) :** Compilées à partir d'ouvrages classiques de botanique orchidophilique, d'index taxonomiques officiels et enrichies par une modération collaborative d'experts.
* **Données utilisateurs et suivis (Collection_items, Soins, Rappels) :** Générées en temps réel par les utilisateurs passionnés lors de la saisie d'actions culturales concrètes au sein de leurs serres.
* **Données de configuration (Care_cycles, Care_tasks) :** Initialisées à partir de protocoles de culture horticole standards d'après les genres dominants (Phalaenopsis, Cattleya, Vanda, Dendrobium, Paphiopedilum, Phragmipedium).

## Méthodes de traitement des données :
Les transactions, la persistance des données et les calculs d'asynchronisme pour le calendrier des soins sont pilotés par une couche logique en PHP 8+ effectuant des requêtes SQL strictes.
* **Sécurisation et Anonymisation :** Chiffrement irréversible des mots de passe des utilisateurs via l'algorithme Bcrypt avant insertion en base de données.
* **Intégrité et Filtrage :** Traitement des fiches médias avec automatisation des formats d'images vers le standard WebP pour la haute performance d'affichage mobile en serre. Protection native contre les failles CSRF/XSS et injections SQL via l'utilisation de requêtes préparées PDO et isolation des couches de données par politiques de sécurité au niveau des lignes (RLS) fournies par Supabase.

## Vérifications d’assurance-qualité faites sur les données :
* Contraintes strictes de clés étrangères (`FOREIGN KEY`) assurant l'intégrité référentielle inter-tables.
* Utilisation d'index optimisés (`idx_genre`, `idx_famille`, `idx_status`, etc.) pour garantir des temps de réponse et de filtrage prédictif inférieurs à 3 secondes.
* Validation obligatoire par un profil Administrateur avant le passage des propositions utilisateur de l'état `pending` à `approved` dans le catalogue général de l'encyclopédie.

## Autres informations contextuelles :
* **Environnement requis pour lire et interpréter les données :** Système de Gestion de Base de Données (SGBD) relationnel compatible SQL (MySQL 8+ ou PostgreSQL via le service de backend d'infrastructure Supabase).
* **Moteur de stockage local :** InnoDB avec encodage de caractères étendu `utf8mb4` et collation `utf8mb4_unicode_ci` pour supporter la nomenclature latine, les accents et l'internationalisation.

---

# APERCUS DES DONNEES ET FICHIERS

## Convention de nommage des fichiers :
* Les fichiers sources de la structure applicative suivent une convention modulaire standardisée : `[nom_de_page].html` ou `[nom_de_page].php` à la racine (ex: `index.html`, `encyclopedie.html`).
* Les modules réutilisables sont segmentés dans une architecture de fichiers inclusifs au sein du dossier `includes/`.
* Les fichiers médias d'orchidées suivent la nomenclature standardisée : `orchid_[id_orchidee]_[timestamp].webp`.

## Arborescence/plan de classement des fichiers :
```text
C:.
├── .vscode/
├── assets/
│   ├── css/
│   ├── images/
│   │   ├── orchids/
│   │   └── site/
│   ├── js/
│   └── scss/
│       ├── abstracts/
│       ├── base/
│       ├── components/
│       ├── layout/
│       └── pages/
├── index.html
├── encyclopedie.html
└── README.md

INFORMATIONS SPECIFIQUES AUX DONNEES POUR : DATABASE SCHEMAv1
Liste des variables/entêtes de colonne :
1. Table users (Gestion des comptes utilisateurs)
id : Identifiant unique de l'utilisateur | Type: INT AUTO_INCREMENT | Clé Primaire.

nom : Nom de famille de l'utilisateur | Type: VARCHAR(100).

prenom : Prénom de l'utilisateur | Type: VARCHAR(100).

email : Adresse électronique de connexion | Type: VARCHAR(255) | Contrainte: UNIQUE KEY.

password : Empreinte sécurisée du mot de passe | Type: VARCHAR(255) | Format: Hachage Bcrypt.

role : Niveau de privilèges sur la plateforme | Type: ENUM('user', 'admin') | Valeur par défaut: 'user'.

created_at / updated_at : Horodatages système de création et de modification | Type: TIMESTAMP.

2. Table botanistes (Référentiel des auteurs scientifiques)
id : Identifiant unique du botaniste | Type: INT AUTO_INCREMENT | Clé Primaire.

nom / prenom : Identité de l'auteur | Type: VARCHAR(100) | Contrainte: UNIQUE KEY conjointe.

annees : Années d'expérience ou de pratique active en orchidologie | Type: INT.

pays : Pays d'origine ou d'exercice majeur | Type: VARCHAR(100).

plantes_decouvertes : Nombre de taxons officiellement répertoriés ou décrits | Type: INT | Valeur par défaut: 0.

biographie : Résumé textuel du parcours de l'expert | Type: TEXT.

3. Table orchids (Encyclopédie botanique de référence)
id : Identifiant unique de l'orchidée | Type: INT AUTO_INCREMENT | Clé Primaire.

nom_latin : Nomenclature scientifique binomiale officielle | Type: VARCHAR(255) | Contrainte: UNIQUE KEY.

nom_vernaculaire : Appellation commune de la plante | Type: VARCHAR(255).

ordre / famille / sous_famille / tribu / sous_tribu / genre / espece : Arborescence de classification taxonomique stricte | Type: VARCHAR(100).

etat : Mode de croissance biologique naturel | Type: ENUM('epiphyte', 'emiepiphyte', 'terrestre', 'autre') | Valeur par défaut: 'autre'.

botaniste_id : Référence au découvreur de la plante | Type: INT | Clé Étrangère liée à botanistes(id).

origines : Origine géographique endémique naturelle | Type: TEXT.

description : Caractéristiques morphologiques et notes descriptives | Type: TEXT.

image : Chemin ou URI d'accès au fichier visuel | Type: VARCHAR(255) | Format: .webp.

4. Table care_cycles (Dictionnaires des cycles biologiques de culture)
id : Identifiant unique du cycle | Type: INT AUTO_INCREMENT | Clé Primaire.

code : Identifiant technique de la phase métabolique | Type: ENUM('croissance', 'floraison', 'repos', 'multiplication', 'establishment', 'autre') | Contrainte: UNIQUE KEY.

libelle : Intitulé affiché pour l'utilisateur humain | Type: VARCHAR(100).

duree_mois : Durée standard estimée de la phase | Type: INT | Unité: Mois | Valeur par défaut: 3.

description : Directives globales associées au comportement végétatif | Type: TEXT.

5. Table care_tasks (Nomenclature des actions d'entretien)
id : Identifiant unique de la tâche | Type: INT AUTO_INCREMENT | Clé Primaire.

slug : Identifiant textuel url-friendly unique | Type: VARCHAR(100) | Contrainte: UNIQUE KEY.

nom : Nom de l'action de soin concrète | Type: VARCHAR(100).

description : Guide méthodologique de réalisation du soin | Type: TEXT.

categorie : Regroupement métier de l'action | Type: ENUM('arrosage', 'rempotage', 'bouturage', 'repiquage', 'sortie_de_flask', 'multiplication', 'engraissage', 'traitement', 'autre').

6. Table user_locations (Coordonnées géographiques et climatiques)
id : Identifiant unique | Type: INT AUTO_INCREMENT | Clé Primaire.

user_id : Propriétaire de l'emplacement | Type: INT | Clé Étrangère liée à users(id) | Contrainte: UNIQUE KEY (Profil à localisation unique).

pays / region / ville : Adresse macroscopique | Type: VARCHAR(100).

latitude / longitude : Positionnement GPS exact | Type: DECIMAL(10,8) / DECIMAL(11,8) | Séparateur décimal: Point ..

zone_climatique : Classification climatique (ex: zone USDA, climat océanique, méditerranéen) | Type: VARCHAR(100).

altitude : Hauteur par rapport au niveau de la mer | Type: INT | Unité: Mètres.

7. Table collection_sites (Zones de culture intérieures/extérieures)
id : Identifiant unique de l'espace de culture | Type: INT AUTO_INCREMENT | Clé Primaire.

user_id : Propriétaire du site | Type: INT | Clé Étrangère liée à users(id).

nom_site : Nom personnalisé donné à la zone (ex: "Serre chaude", "Étagère salon") | Type: VARCHAR(255).

type_site : Typologie structurelle de l'environnement | Type: ENUM('serre', 'orchidarium', 'maison', 'piece', 'exterieur', 'autre').

temperature_moyenne : Température nominale mesurée | Type: DECIMAL(5,2) | Unité: Degrés Celsius (180°C) | Séparateur: Point ..

humidite_moyenne : Taux d'humidité relative mesuré | Type: DECIMAL(5,2) | Unité: Pourcentage (10%) | Séparateur: Point ..

luminosite / ventilation / orientation : Paramètres d'exposition physiques | Type: VARCHAR / VARCHAR / VARCHAR(50).

8. Table conseils (Base de connaissances modulaire de culture)
id : Identifiant unique | Type: INT AUTO_INCREMENT | Clé Primaire.

titre / contenu : Intitulé et corps textuel des bonnes pratiques de culture | Type: VARCHAR(255) / TEXT.

categorie : Domaine technique abordé | Type: ENUM('lumiere', 'arrosage', 'rempotage', 'fertilisation', 'maladies', 'multiplication', 'cycle', 'general') | Valeur par défaut: 'general'.

habitat / etat_orchidee : Type biologique ciblé par le conseil | Type: ENUM('epiphyte', 'emiepiphyte', 'terrestre', 'autre').

famille / genre : Filtres taxonomiques applicables au conseil | Type: VARCHAR(100).

botaniste_id : Expert rattaché ou référent pour le conseil | Type: INT | Clé Étrangère liée à botanistes(id).

niveau : Accessibilité technique du contenu | Type: ENUM('debutant', 'intermediaire', 'avance') | Valeur par défaut: 'debutant'.

actif : Indicateur de publication | Type: BOOLEAN | Valeur par défaut: TRUE (1).

9. Table propositions_orchidees (Flux collaboratif de soumission)
id : Identifiant unique de la proposition | Type: INT AUTO_INCREMENT | Clé Primaire.

user_id : Utilisateur initiateur de la proposition | Type: INT | Clé Étrangère liée à users(id).

nom_latin / famille / genre / nom_vernaculaire / description / image : Métadonnées du taxon proposé | Types conformes aux variables de la table orchids.

status : État d'avancement du cycle de modération | Type: ENUM('pending', 'approved', 'rejected') | Valeur par défaut: 'pending'.

admin_notes : Justification ou commentaires de l'administrateur | Type: TEXT.

10. Table collection_items (Inventaire personnel des collectionneurs)
id : Identifiant unique du spécimen possédé | Type: INT AUTO_INCREMENT | Clé Primaire.

user_id : Collectionneur possédant la plante | Type: INT | Clé Étrangère liée à users(id).

orchid_id : Liaison vers la fiche encyclopédique de référence | Type: INT | Clé Étrangère liée à orchids(id).

site_id : Emplacement physique d'affectation de la plante | Type: INT | Clé Étrangère liée à collection_sites(id).

cycle_id : Cycle biologique actuel constaté sur la plante | Type: INT | Clé Étrangère liée à care_cycles(id).

nom_personnalise : Surnom ou code d'identification donné par le cultivateur | Type: VARCHAR(255).

date_acquisition : Date d'entrée dans la collection | Type: DATE | Format: YYYY-MM-DD.

etat_sante : Diagnostic sanitaire actuel | Type: ENUM('sain', 'a_surveiller', 'alerte', 'en_traitement') | Valeur par défaut: 'sain'.

Contrainte d'unicité : unique_user_orchid (user_id, orchid_id) empêchant les doublons stricts d'un même taxon pour une seule instance basique d'utilisateur.

11. Table soins (Registre historique d'exécution des tâches)
id : Identifiant unique du log | Type: INT AUTO_INCREMENT | Clé Primaire.

user_id / collection_item_id / orchid_id / care_task_id : Entités clés concernées par l'acte de soin | Clés Étrangères associées.

conseil_id / cycle_id : Références optionnelles au contexte d'exécution | Clés Étrangères associées.

date_soin : Date d'administration ou de validation | Type: DATE | Format: YYYY-MM-DD.

realise : Statut d'accomplissement de la tâche | Type: BOOLEAN | Valeur par défaut: FALSE (0).

temperature / hygrometrie / luminosite / ventilation : Relevés physiques précis au moment du soin | Types alignés sur collection_sites.

duree_estimee : Temps passé pour effectuer l'action horticole | Type: INT | Unité: Minutes.

resultat : Évaluation post-intervention | Type: ENUM('ok', 'a_surveiller', 'alerte', 'non_realise') | Valeur par défaut: 'ok'.

12. Table rappels_soins (Moteur d'agenda et planification métabolique)
id : Identifiant unique du rappel | Type: INT AUTO_INCREMENT | Clé Primaire.

user_id / care_task_id / collection_item_id / orchid_id / cycle_id : Métadonnées associées à la planification | Clés Étrangères.

date_prochaine : Échéance calculée pour le prochain soin | Type: DATE | Format: YYYY-MM-DD.

frequence_jours : Intervalle d'exécution récurrent | Type: INT | Unité: Jours.

statut : État opérationnel du rappel automatique | Type: ENUM('actif', 'termine', 'suspendu') | Valeur par défaut: 'actif'.

13. Table notifications (Journal d'alertes système et applicatives)
id : Identifiant de notification | Type: INT AUTO_INCREMENT | Clé Primaire.

user_id : Destinataire de l'alerte | Type: INT | Clé Étrangère liée à users(id).

entity_type : Module d'origine de la notification | Type: ENUM('soin', 'conseil', 'orchidee', 'cycle', 'rappel', 'systeme') | Valeur par défaut: 'systeme'.

entity_id : Identifiant de l'enregistrement de l'entité liée | Type: INT.

message : Corps du texte de notification affiché | Type: TEXT.

type : Gravité ou nature de la notification | Type: ENUM('info', 'warning', 'success', 'error') | Valeur par défaut: 'info'.

is_read : Indicateur d'ouverture par l'utilisateur | Type: BOOLEAN | Valeur par défaut: FALSE (0).

meta : Métadonnées additionnelles complexes structurales | Type: JSON.

scheduled_at : Planification de diffusion asynchrone | Type: DATETIME | Format: YYYY-MM-DD HH:MM:SS.

Code des valeurs manquantes :
La valeur standardisée SQL NULL est explicitement utilisée pour définir l'absence d'information, l'inexistence d'une valeur ou la non-applicabilité d'un paramètre (par exemple lorsqu'un botaniste associé est supprimé de la base de données, la clé étrangère passe à NULL grâce à la clause ON DELETE SET NULL).

Informations additionnelles :
L'ensemble de ces tables est structuré de façon relationnelle avec cascade logique (ON DELETE CASCADE) pour l'ensemble des données liées au compte utilisateur, assurant une conformité parfaite avec les directives de suppression de données (RGPD / Droit à l'oubli).