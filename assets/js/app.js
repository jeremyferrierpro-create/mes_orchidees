// J'importe la fonction qui installe le mode hors-ligne (PWA)
import { initPWA } from './pwa.js';

// J'importe toutes les fonctions qui démarrent chaque partie du site
import { initNavigation } from './features/navigation.js'; // le menu qui s'ouvre/ferme
import { initBackgroundAnimation } from './features/background-animation.js'; // les petits mots latins qui flottent sur l'accueil
import { initSearch } from './features/search.js'; // la recherche d'orchidées
import { initAddButton } from './features/add-button.js'; // le bouton + pour ajouter
import { initCollection } from './features/collection.js'; // la page Ma Collection
import { initAdministration } from './features/administration.js'; // la page Admin
import { initConseils } from './features/conseils.js'; // la page Conseils
import { initAuthentication } from './features/authentication.js'; // la page Connexion/Inscription

// J'importe le petit outil qui me dit sur quelle page je suis
import { getCurrentPage } from './core/router.js';

// Je fais un tableau qui dit : "sur telle page, lance telle fonction"
const featureInitializers = {
    home: () => {}, // sur l'accueil, pas de fonction spéciale (vide)
    encyclopedia: () => {}, // sur l'encyclopédie, la recherche est déjà lancée partout
    collection: initCollection, // sur Ma Collection, lance la collection
    administration: initAdministration, // sur Admin, lance l'admin
    conseils: initConseils, // sur Conseils, lance les conseils
    authentication: initAuthentication // sur Authentification, lance l'auth
};

// Quand la page a fini de se charger (DOMContentLoaded = tout le HTML est prêt)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core (rien à faire ici)
    
    // 2. Je lance tout ce qui doit marcher sur TOUTES les pages
    initNavigation(); // le menu
    initBackgroundAnimation(); // l'animation du fond
    initSearch(); // la recherche
    initAddButton(); // le bouton +
    
    // 3. Je lance seulement ce qui correspond à LA page actuelle
    const page = getCurrentPage(); // je demande : "on est où ?" -> ex: "conseils"
    const initializer = featureInitializers[page]; // je cherche la fonction qui va avec
    if (initializer) { // si elle existe
        initializer(); // je la lance
    }
    
    // 4. J'installe le mode hors-ligne (PWA)
    initPWA();
});
