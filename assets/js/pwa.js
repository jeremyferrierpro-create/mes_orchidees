// Fonction qui installe le petit programme qui permet de voir le site même sans internet (PWA)
export function initPWA() {
    // Je vérifie si le navigateur sait faire du hors-ligne (serviceWorker)
    if ('serviceWorker' in navigator) {
        // Je lui dis d'installer le fichier sw.js qui est à la racine
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                // Si ça marche, j'affiche le nom du dossier où il est installé
                console.log('Service Worker enregistré avec succès :', registration.scope);
            })
            .catch(error => {
                // Si ça rate, j'affiche l'erreur
                console.error('Échec de l\'enregistrement du Service Worker :', error);
            });
    }
}
