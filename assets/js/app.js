// ===========================================================================
// FICHIER : app.js — Point d'entrée unique de mon application (Router principal)
// ===========================================================================
// J'ai choisi de centraliser tout le démarrage de mon application dans ce seul
// fichier. Pourquoi ? Pour appliquer le pattern du "point d'entrée unique" :
// au lieu d'avoir un <script> différent par page, j'ai un seul app.js qui
// décide quoi lancer selon la page courante. C'est plus maintenable et
// cela m'oblige à structurer mon code en modules ES6+ (import/export).
// J'ai volontairement travaillé en Vanilla JS moderne (ES6+) sans framework
// lourd comme React ou Vue : je voulais prouver au jury que je maîtrise les
// fondamentaux natifs du langage (modules, arrow functions, destructuring,
// gestion du DOM) avant d'abstraire avec un framework.

// J'importe ici la fonction qui installe le mode hors-ligne PWA (Progressive Web App).
// Pourquoi je l'importe dès le début ? Parce que le Service Worker doit être
// enregistré au plus tôt pour mettre en cache les ressources et permettre
// une consultation hors-ligne, critère important pour la robustesse de l'app.
import { initPWA } from './pwa.js';

// J'importe toutes les fonctions d'initialisation de chaque fonctionnalité.
// J'ai découpé mon code en "features" pour isoler chaque page/fonctionnalité :
// c'est l'application du principe de séparation des responsabilités.
import { initNavigation } from './features/navigation.js';
import { initBackgroundAnimation } from './features/background-animation.js';
import { initSearch } from './features/search.js';
import { initAddButton } from './features/add-button.js';
import { initCollection } from './features/collection.js';
import { initAdministration } from './features/administration.js';
import { initConseils } from './features/conseils.js';
import { initAuthentication } from './features/authentication.js';

// J'importe mon petit routeur maison. Il analyse l'URL courante et me renvoie
// un identifiant simple ("home", "collection", "administration"...).
// Pourquoi un routeur maison plutôt qu'une librairie ? Parce qu'en Vanilla JS
// je peux le coder en quelques lignes et je garde le contrôle total.
import { getCurrentPage } from './core/router.js';

// Je crée ici une table de correspondance (objet littéral) qui associe chaque
// identifiant de page à sa fonction d'initialisation. C'est mon routeur déclaratif.
// Si la page n'a pas besoin de JS spécifique, je mets une fonction vide () => {}.
const featureInitializers = {
    home: () => {},
    encyclopedia: () => {},
    collection: initCollection,
    administration: initAdministration,
    conseils: initConseils,
    authentication: initAuthentication
};

// J'écoute l'événement DOMContentLoaded. Pourquoi cet événement précisément ?
// Parce qu'il garantit que l'arbre DOM est totalement construit et parsé par le
// navigateur avant que je n'exécute le moindre querySelector ou addEventListener.
// Si je lançais mes scripts avant, je risquerais de cibler des éléments qui
// n'existent pas encore et de provoquer des erreurs "null is not an object".
document.addEventListener('DOMContentLoaded', () => {
    // J'initialise d'abord tout ce qui doit fonctionner sur TOUTES les pages,
    // quel que soit le contexte : la navigation et les éléments transverses.
    initNavigation();
    initBackgroundAnimation();
    initSearch();
    initAddButton();
    
    // Ensuite, je ne lance que le module qui correspond à la page actuelle.
    // Pourquoi ce découpage ? Pour éviter de charger inutilement le code de la
    // page "Ma Collection" quand je suis sur l'accueil : j'optimise les performances.
    const page = getCurrentPage();
    const initializer = featureInitializers[page];
    if (initializer) {
        initializer();
    }
    
    // Enfin, j'enregistre le Service Worker pour la conformité PWA.
    // Je le fais en dernier car il met en cache les ressources : je veux d'abord
    // que l'interface soit interactive avant de lancer le travail en arrière-plan.
    initPWA();
});
