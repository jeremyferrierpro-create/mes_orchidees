// sw.js — Service Worker de l'application
// =========================================
// Ce fichier permet à l'application de fonctionner hors-ligne
// en mettant en cache les ressources principales.

// Nom du cache : on l'incrémente à chaque mise à jour majeure
const CACHE_NAME = 'mes-orchidees-v5';

// Liste des fichiers à mettre en cache pour le mode hors-ligne
const CACHE_ASSETS = [
    './',
    './index.html',
    './encyclopedie.html',
    './macollection.html',
    './conseils.html',
    './authentification.html',
    './administration.html',
    './mentions.html',
    './confidentialite.html',
    './deconnexion.html',
    './manifest.json',
    './assets/css/style.css',
    './assets/js/pwa.js',
    './assets/js/app.js',
    './assets/js/core/storage.js',
    './assets/js/core/security.js',
    './assets/js/core/dom.js',
    './assets/js/core/focus.js',
    './assets/js/core/modal.js',
    './assets/js/core/notifications.js',
    './assets/js/core/router.js',
    './assets/js/core/loader.js',
    './assets/js/data/orchids-data.js',
    './assets/js/data/conseils-data.js',
    './assets/js/services/auth-service.js',
    './assets/js/services/collection-service.js',
    './assets/js/services/orchid-service.js',
    './assets/js/services/conseil-service.js',
    './assets/js/features/navigation.js',
    './assets/js/features/background-animation.js',
    './assets/js/features/search.js',
    './assets/js/features/add-button.js',
    './assets/js/features/collection.js',
    './assets/js/features/administration.js',
    './assets/js/features/conseils.js',
    './assets/js/features/authentication.js'
];

// Événement "install" : on met en cache les ressources
self.addEventListener('install', function (event) {
    // On attend que le cache soit rempli avant de terminer l'installation
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                // On ajoute les fichiers dans le cache
                return cache.addAll(CACHE_ASSETS);
            })
            .catch(function (error) {
                // En cas d'erreur, on affiche un message
                console.error('Erreur lors du cache initial :', error);
            })
    );
    // On active immédiatement le nouveau Service Worker
    self.skipWaiting();
});

// Événement "activate" : on nettoie les anciennes versions du cache
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            // On parcourt tous les caches existants
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    // Si le cache n'est pas celui actuel, on le supprime
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // On prend le contrôle de toutes les pages immédiatement
    self.clients.claim();
});

// Événement "fetch" : on sert les fichiers depuis le cache si possible
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Si le fichier est dans le cache, on le retourne
                if (response) {
                    return response;
                }
                // Sinon, on fait la requête normale au réseau
                return fetch(event.request);
            })
            .catch(function () {
                // En cas d'erreur réseau, on retourne une réponse de secours
                return new Response('Ressource non disponible hors-ligne.', {
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});
