// app.js — Enregistrement du Service Worker (PWA)
// ==================================================
// Ce fichier transforme le site en Progressive Web App.
// Il enregistre le Service Worker qui permet le mode hors-ligne.

// On attend que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {

    // On vérifie que le navigateur supporte les Service Workers
    if ('serviceWorker' in navigator) {
        // On enregistre le fichier sw.js à la racine du site
        navigator.serviceWorker.register('sw.js')
            .then(function (registration) {
                // Si l'enregistrement réussit, on affiche un message dans la console
                console.log('Service Worker enregistré avec succès :', registration.scope);
            })
            .catch(function (error) {
                // Sinon on affiche l'erreur
                console.error('Échec de l\'enregistrement du Service Worker :', error);
            });
    }
});
