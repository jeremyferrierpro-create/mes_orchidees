import { getElement } from '../core/dom.js';
import * as authService from '../services/auth-service.js';
import * as collectionService from '../services/collection-service.js';
import { getAllOrchids } from '../services/orchid-service.js';
import * as notifications from '../core/notifications.js';
import { STORAGE_KEYS, writeString } from '../core/storage.js';

export function initAddButton() {
    const modalTitle = getElement('#modal-orchid-title');
    const modal = getElement('#orchid-modal');
    const addButton = getElement('.btn-add-collection');

    if (!addButton) return;

    function updateCollectionButtonVisibility() {
        addButton.hidden = !authService.isAuthenticated();
    }

    if (modal) {
        modal.addEventListener('orchidModalOpened', updateCollectionButtonVisibility);
    }
    updateCollectionButtonVisibility();

    function ajouterAMaCollection(orchidName) {
        if (!orchidName || orchidName === '...') return;

        if (!authService.isAuthenticated()) {
            const choix = confirm(
                'Vous devez être connecté pour ajouter une orchidée à votre collection.\n\n' +
                'Souhaitez-vous vous connecter ou créer un compte dès maintenant ?'
            );
            if (choix) {
                writeString(STORAGE_KEYS.pendingOrchid, orchidName);
                window.location.href = 'authentification.html';
            }
            return;
        }

        const orchid = getAllOrchids().find(o => o.name.toLowerCase() === orchidName.toLowerCase());

        if (!orchid) {
            notifications.error('Impossible d\'ajouter cette orchidée : elle n\'est pas référencée.');
            return;
        }

        const maCollection = collectionService.getCollection();
        const dejaPresente = maCollection.some(item => item.orchidId === orchid.id);

        if (dejaPresente) {
            notifications.warning('L\'orchidée "' + orchid.name + '" est déjà présente dans votre collection.');
            return;
        }

        collectionService.addOrchid({
            collectionId: 'col-' + Date.now(),
            orchidId: orchid.id,
            addedAt: new Date().toISOString(),
            location: '',
            notes: '',
            careHistory: []
        });
        
        notifications.success('L\'orchidée "' + orchid.name + '" a été ajoutée à votre collection.');
    }

    addButton.addEventListener('click', function () {
        const orchidName = modalTitle ? modalTitle.textContent.trim() : null;
        if (orchidName) {
            ajouterAMaCollection(orchidName);
        }
    });
}
