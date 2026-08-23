// ===========================================================================
// FICHIER : core/router.js — Mon routeur ultra-léger maison
// ===========================================================================
// J'ai choisi de coder moi-même ce routeur plutôt que d'importer une librairie
// externe. Pourquoi ? Parce que mon besoin est très simple : savoir sur quelle
// page je me trouve pour lancer le bon module. En Vanilla JS, quelques
// vérifications sur window.location.pathname suffisent et m'évitent une
// dépendance inutile. C'est aussi une preuve de maîtrise des fondamentaux.

// J'analyse l'URL courante du navigateur et je renvoie un identifiant normalisé.
// Pourquoi un identifiant et non l'URL brute ? Pour que app.js puisse faire un
// simple objet de correspondance featureInitializers[page] sans se soucier des
// variantes d'URL.
export function getCurrentPage() {
    // Je récupère le chemin complet (ex: "/mon_orchidee/encyclopedie.html" ou "/").
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/mon_orchidee/')) return 'home';
    if (path.endsWith('encyclopedie.html')) return 'encyclopedia';
    if (path.endsWith('macollection.html')) return 'collection';
    if (path.endsWith('conseils.html')) return 'conseils';
    if (path.endsWith('administration.html')) return 'administration';
    if (path.endsWith('authentification.html')) return 'authentication';
    return 'other';
}
