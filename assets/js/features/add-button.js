// J'importe les outils
import { getElement } from '../core/dom.js'; // pour chercher un élément
import * as authService from '../services/auth-service.js'; // pour savoir si connecté
import * as collectionService from '../services/collection-service.js'; // pour ajouter à la collection
import { getAllOrchids } from '../services/orchid-service.js'; // pour trouver l'orchidée
import * as notifications from '../core/notifications.js'; // pour les petits messages
import { STORAGE_KEYS, writeString } from '../core/storage.js'; // pour la clé pending

// Elle fait marcher le bouton "+ COLLECTION" dans la modale d'orchidée
export function initAddButton() {
    const modalTitle = getElement('#modal-orchid-title'); // je récupère le titre dans la modale (ex: "ACACALIS CYANEA")
    const modal = getElement('#orchid-modal'); // je récupère la modale elle-même
    const addButton = getElement('.btn-add-collection'); // je récupère le bouton +

    if (!addButton) return; // si pas de bouton (page sans modale), j'arrête

    // Elle cache/montr le bouton selon si on est connecté
    function updateCollectionButtonVisibility() {
        addButton.hidden = !authService.isAuthenticated(); // caché si pas connecté, visible si connecté
    }

    // Quand la modale s'ouvre, je vérifie si on doit montrer le bouton
    if (modal) {
        modal.addEventListener('orchidModalOpened', updateCollectionButtonVisibility);
    }
    updateCollectionButtonVisibility(); // je vérifie aussi au démarrage

    // Elle ajoute vraiment l'orchidée à la collection
    function ajouterAMaCollection(orchidName) {
        if (!orchidName || orchidName === '...') return; // si pas de nom, j'arrête

        // Si pas connecté, je propose de se connecter
        if (!authService.isAuthenticated()) {
            const choix = confirm( // petite fenêtre oui/non du navigateur
                'Vous devez être connecté pour ajouter une orchidée à votre collection.\n\n' +
                'Souhaitez-vous vous connecter ou créer un compte dès maintenant ?'
            );
            if (choix) { // si oui
                writeString(STORAGE_KEYS.pendingOrchid, orchidName); // je note quelle orchidée il voulait
                window.location.href = 'authentification.html'; // je l'envoie se connecter
            }
            return; // j'arrête
        }

        // Je cherche l'orchidée par son nom (sans tenir compte de la casse)
        const orchid = getAllOrchids().find(o => o.name.toLowerCase() === orchidName.toLowerCase());

        if (!orchid) { // si pas trouvée (ne devrait pas arriver)
            notifications.error('Impossible d\'ajouter cette orchidée : elle n\'est pas référencée.');
            return;
        }

        const maCollection = collectionService.getCollection(); // je récupère la collection
        const dejaPresente = maCollection.some(item => item.orchidId === orchid.id); // est-elle déjà dedans ?

        if (dejaPresente) { // si oui
            notifications.warning('L\'orchidée "' + orchid.name + '" est déjà présente dans votre collection.');
            return;
        }

        // J'ajoute (id unique avec l'heure + id de l'espèce)
        collectionService.addOrchid({
            collectionId: 'col-' + Date.now(), // id unique pour l'exemplaire
            orchidId: orchid.id, // id de l'espèce
            addedAt: new Date().toISOString(), // date d'ajout
            location: '', // vide pour l'instant
            notes: '', // vide
            careHistory: [] // pas encore de soins
        });
        
        notifications.success('L\'orchidée "' + orchid.name + '" a été ajoutée à votre collection.'); // message vert
    }

    // Quand on clique sur le bouton +, j'appelle la fonction avec le nom affiché dans la modale
    addButton.addEventListener('click', function () {
        const orchidName = modalTitle ? modalTitle.textContent.trim() : null; // je lis le titre
        if (orchidName) {
            ajouterAMaCollection(orchidName);
        }
    });
}
