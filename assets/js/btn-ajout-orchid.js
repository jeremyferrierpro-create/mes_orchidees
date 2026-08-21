// btn-ajout-orchid.js — Ajout d'une orchidée à la collection
// =============================================================
// Stocke désormais un objet référencé (orchidId) au lieu d'une simple
// chaîne, afin d'alimenter le dashboard Ma Collection.
// À terme, appel à l'API PHP / Supabase.

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const modalTitle = document.getElementById('modal-orchid-title');
        const modal = document.getElementById('orchid-modal');
        const addButton = document.querySelector('.btn-add-collection');

        if (!addButton) return;

        function isUserAuthenticated() {
            if (window.AppUtils) return window.AppUtils.isAuthenticated();
            try {
                const sessionStr = localStorage.getItem('mo_user_session');
                if (sessionStr) {
                    return JSON.parse(sessionStr).isAuthenticated === true;
                }
            } catch(e) {}
            return localStorage.getItem('isAuthenticated') === 'true';
        }

        function updateCollectionButtonVisibility() {
            addButton.hidden = !isUserAuthenticated();
        }

        if (modal) {
            modal.addEventListener('orchidModalOpened', updateCollectionButtonVisibility);
        }
        updateCollectionButtonVisibility();

        /**
         * Normalise un tableau de collection contenant encore
         * d'anciennes chaînes de caractères.
         */
        function normalizeCollection(items) {
            return items.map(function (item, index) {
                if (typeof item === 'string') {
                    const match = (window.orchidsDatabase || []).find(function (o) {
                        return o.name.toLowerCase() === item.toLowerCase();
                    });
                    return {
                        collectionId: 'legacy-' + index + '-' + Date.now(),
                        orchidId: match ? match.id : item.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        addedAt: new Date().toISOString(),
                        location: '',
                        notes: '',
                        careHistory: []
                    };
                }
                return item;
            });
        }

        function ajouterAMaCollection(orchidName) {
            if (!orchidName || orchidName === '...') {
                console.warn('Impossible de récupérer le nom de l\'orchidée cible.');
                return;
            }

            if (!isUserAuthenticated()) {
                const choix = confirm(
                    'Vous devez être connecté pour ajouter une orchidée à votre collection.\n\n' +
                    'Souhaitez-vous vous connecter ou créer un compte dès maintenant ?'
                );
                if (choix) {
                    localStorage.setItem('pendingOrchidToAdd', orchidName);
                    window.location.href = 'authentification.html';
                }
                return;
            }

            const orchid = (window.orchidsDatabase || []).find(function (o) {
                return o.name.toLowerCase() === orchidName.toLowerCase();
            });

            if (!orchid) {
                console.warn('Orchidée non trouvée dans la base :', orchidName);
                if (window.AppToast) {
                    window.AppToast.error('Impossible d\'ajouter cette orchidée : elle n\'est pas référencée.');
                } else {
                    alert('Impossible d\'ajouter cette orchidée : elle n\'est pas référencée.');
                }
                return;
            }

            let maCollection = JSON.parse(localStorage.getItem('userCollection')) || [];
            maCollection = normalizeCollection(maCollection);

            const dejaPresente = maCollection.some(function (item) {
                return item.orchidId === orchid.id;
            });

            if (dejaPresente) {
                if (window.AppToast) {
                    window.AppToast.warning('L\'orchidée "' + orchid.name + '" est déjà présente dans votre collection.');
                } else {
                    alert('L\'orchidée "' + orchid.name + '" est déjà présente dans votre collection.');
                }
                return;
            }

            maCollection.push({
                collectionId: 'col-' + Date.now(),
                orchidId: orchid.id,
                addedAt: new Date().toISOString(),
                location: '',
                notes: '',
                careHistory: []
            });

            localStorage.setItem('userCollection', JSON.stringify(maCollection));
            
            if (window.AppToast) {
                window.AppToast.success('L\'orchidée "' + orchid.name + '" a été ajoutée à votre collection.');
            } else {
                alert('L\'orchidée "' + orchid.name + '" a été ajoutée à votre collection.');
            }
        }

        addButton.addEventListener('click', function () {
            const orchidName = modalTitle ? modalTitle.textContent.trim() : null;
            if (orchidName) {
                ajouterAMaCollection(orchidName);
            } else {
                console.warn('Aucun nom d\'orchidée trouvé dans la modale.');
            }
        });
    });
})();
