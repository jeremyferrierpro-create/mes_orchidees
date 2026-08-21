// conseils.js — Gestion des fiches de culture et modales
// ======================================================
// Les 6 cartes maquette ouvrent une modale de conseil détaillée.
// La recherche en tête de page permet de trouver une rubrique
// ou une fiche d'orchidée par son nom (3 caractères minimum).

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const conseilsDatabase = window.conseilsDatabase || [];

        // Éléments de recherche
        const searchForm = document.getElementById('conseil-search-form');
        const searchInput = document.getElementById('conseil-search-input');
        const searchBtn = document.getElementById('conseil-search-btn');
        const resultsContainer = document.getElementById('advice-results');
        const conseilCards = document.querySelectorAll('.conseil-card');

        // Éléments de la modale
        const modal = document.getElementById('conseil-modal');
        const closeBtn = document.getElementById('conseil-modal-close');
        const modalImg = document.getElementById('conseil-modal-img');
        const modalTitle = document.getElementById('conseil-modal-title');
        const modalMeta = document.getElementById('conseil-modal-meta');
        const modalText = document.getElementById('conseil-modal-text');

        const careEls = {
            temperature: document.getElementById('care-temperature'),
            arrosage: document.getElementById('care-arrosage'),
            hygrometrie: document.getElementById('care-hygrometrie'),
            rempotage: document.getElementById('care-rempotage'),
            engrais: document.getElementById('care-engrais'),
            substrats: document.getElementById('care-substrats')
        };

        /**
         * Ouvre la modale de fiche pour un conseil (catégorie ou espèce)
         */
        function openConseilModal(conseil) {
            if (!modal || !conseil) return;

            // Image : visible seulement pour une fiche d'espèce
            if (conseil.img) {
                modalImg.src = conseil.img;
                modalImg.alt = conseil.name;
                modalImg.hidden = false;
            } else {
                modalImg.hidden = true;
                modalImg.removeAttribute('src');
            }

            modalTitle.textContent = conseil.name.toUpperCase();
            modalMeta.textContent = conseil.type === 'species'
                ? 'Type : ' + conseil.category
                : 'Rubrique';
            modalText.textContent = conseil.content || conseil.description || '';

            // Soins optionnels
            if (conseil.careCards) {
                careEls.temperature.textContent = conseil.careCards.temperature || '-';
                careEls.arrosage.textContent = conseil.careCards.arrosage || '-';
                careEls.hygrometrie.textContent = conseil.careCards.hygrometrie || '-';
                careEls.rempotage.textContent = conseil.careCards.rempotage || '-';
                careEls.engrais.textContent = conseil.careCards.engrais || '-';
                careEls.substrats.textContent = conseil.careCards.substrats || '-';
            } else {
                // Si aucune donnée de soin, on met des tirets
                for (let key in careEls) {
                    careEls[key].textContent = '-';
                }
            }

            if (window.ModalManager) {
                window.ModalManager.open(modal, document.activeElement);
            }
        }

        /**
         * Ferme la modale et restaure le focus
         */
        function closeConseilModal() {
            if (window.ModalManager) {
                window.ModalManager.close(modal);
            }
        }

        /**
         * Filtre la base et affiche les résultats dans la page
         */
        function filterAndRender() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

            if (query.length < 3) {
                if (resultsContainer) {
                    resultsContainer.innerHTML = '';
                }
                return;
            }

            const filtered = conseilsDatabase.filter(function (conseil) {
                const haystack = (
                    (conseil.name || '') + ' ' +
                    (conseil.category || '') + ' ' +
                    (conseil.content || '')
                ).toLowerCase();
                return haystack.includes(query);
            });

            renderResults(filtered);
        }

        /**
         * Construit le DOM des résultats de recherche
         */
        function renderResults(list) {
            if (!resultsContainer) return;
            resultsContainer.innerHTML = '';

            if (list.length === 0) {
                const message = document.createElement('p');
                message.className = 'advice-no-results';
                message.textContent = 'Aucune fiche ne correspond à votre recherche.';
                resultsContainer.appendChild(message);
                return;
            }

            for (const conseil of list) {
                const card = document.createElement('article');
                card.className = 'advice-result-card';
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-label', 'Ouvrir la fiche ' + conseil.name);

                const title = document.createElement('h3');
                title.textContent = conseil.name;
                card.appendChild(title);

                const meta = document.createElement('p');
                meta.className = 'advice-result-meta';
                meta.textContent = conseil.type === 'species'
                    ? 'Fiche de culture — ' + conseil.category
                    : 'Rubrique de conseils';
                card.appendChild(meta);

                if (conseil.img) {
                    const thumb = document.createElement('img');
                    thumb.src = conseil.img;
                    thumb.alt = '';
                    thumb.className = 'advice-result-thumb';
                    card.appendChild(thumb);
                }

                card.addEventListener('click', function () {
                    openConseilModal(conseil);
                });

                card.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openConseilModal(conseil);
                    }
                });

                resultsContainer.appendChild(card);
            }
        }

        /**
         * Gère le clic sur une des 6 cartes maquette
         */
        function onConseilCardClick(event) {
            event.preventDefault();

            const card = event.currentTarget;
            const category = card.getAttribute('data-category');
            const conseil = conseilsDatabase.find(function (c) {
                return c.type === 'category' && c.name === category;
            });

            if (conseil) {
                openConseilModal(conseil);
            }
        }

        // Interaction sur les 6 cartes maquette
        for (const card of conseilCards) {
            card.addEventListener('click', onConseilCardClick);
            card.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onConseilCardClick({ currentTarget: card, preventDefault: function () {} });
                }
            });
        }

        // Recherche en temps réel (règle des 3 caractères)
        if (searchInput) {
            searchInput.addEventListener('input', filterAndRender);
        }

        // Soumettre la recherche : ouvre le premier résultat trouvé
        if (searchForm) {
            searchForm.addEventListener('submit', function (event) {
                event.preventDefault();
                filterAndRender();

                const firstResult = resultsContainer ? resultsContainer.querySelector('.advice-result-card') : null;
                if (firstResult) {
                    firstResult.click();
                }
            });
        }

        // Fermeture de la modale
        if (closeBtn) {
            closeBtn.addEventListener('click', closeConseilModal);
        }

        if (modal) {
            // Clic sur l'overlay
            modal.addEventListener('click', function (event) {
                if (event.target === modal) {
                    closeConseilModal();
                }
            });

            // Touche Échap
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' && modal.classList.contains('active')) {
                    closeConseilModal();
                }
            });
        }
    });
})();
