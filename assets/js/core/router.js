// Ce fichier me dit sur quelle page je suis, juste en lisant l'adresse du navigateur
export function getCurrentPage() {
    const path = window.location.pathname; // je récupère l'adresse (ex: "/encyclopedie.html")
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/mon_orchidee/')) return 'home'; // si c'est l'accueil
    if (path.endsWith('encyclopedie.html')) return 'encyclopedia'; // si c'est l'encyclopédie
    if (path.endsWith('macollection.html')) return 'collection'; // si c'est Ma Collection
    if (path.endsWith('conseils.html')) return 'conseils'; // si c'est Conseils
    if (path.endsWith('administration.html')) return 'administration'; // si c'est Admin
    if (path.endsWith('authentification.html')) return 'authentication'; // si c'est Auth
    return 'other'; // sinon c'est une autre page (mentions, etc.)
}
