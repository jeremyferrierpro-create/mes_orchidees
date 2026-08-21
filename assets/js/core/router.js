export function getCurrentPage() {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/mon_orchidee/')) return 'home';
    if (path.endsWith('encyclopedie.html')) return 'encyclopedia';
    if (path.endsWith('macollection.html')) return 'collection';
    if (path.endsWith('conseils.html')) return 'conseils';
    if (path.endsWith('administration.html')) return 'administration';
    if (path.endsWith('authentification.html')) return 'authentication';
    return 'other';
}
