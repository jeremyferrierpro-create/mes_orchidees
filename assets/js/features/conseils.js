import { replaceChildren } from '../core/dom.js';
import { getAllConseils, getConseilById, searchConseils } from '../services/conseil-service.js';
import * as modalManager from '../core/modal.js';

// =====================================================
// PAGE CONSEILS
// =====================================================
// Ce fichier gère les cartes, la recherche et la fenêtre modale.

export function initConseils() {
    // Éléments de la recherche.
    const searchForm = document.getElementById('conseil-search-form');
    const searchInput = document.getElementById('conseil-search-input');
    const resultsContainer = document.getElementById('advice-results');
    const conseilCards = document.querySelectorAll('.conseil-card');

    // Éléments de la modale.
    const modal = document.getElementById('conseil-modal');
    const closeButton = document.getElementById('conseil-modal-close');
    const modalImage = document.getElementById('conseil-modal-img');
    const modalTitle = document.getElementById('conseil-modal-title');
    const modalMeta = document.getElementById('conseil-modal-meta');
    const modalText = document.getElementById('conseil-modal-text');

    const careElements = {
        temperature: document.getElementById('care-temperature'),
        arrosage: document.getElementById('care-arrosage'),
        hygrometrie: document.getElementById('care-hygrometrie'),
        rempotage: document.getElementById('care-rempotage'),
        engrais: document.getElementById('care-engrais'),
        substrats: document.getElementById('care-substrats')
    };

    // Si cette page n'a pas la modale, on ne lance pas les événements.
    if (!modal || !modalTitle || !modalMeta || !modalText) {
        return;
    }

    /**
     * Écrit du texte dans un élément seulement si l'élément existe.
     */
    function setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * Remplit puis ouvre la modale d'une fiche conseil.
     */
    function openConseilModal(conseil, triggerElement = null) {
        if (!conseil) {
            return;
        }

        setText(modalTitle, conseil.name || 'Conseil de culture');
        setText(
            modalMeta,
            conseil.type === 'species'
                ? `Fiche de culture — ${conseil.category || 'Orchidée'}`
                : 'Rubrique de conseils'
        );
        setText(modalText, conseil.content || conseil.description || 'Aucun conseil disponible.');

        if (modalImage) {
            if (conseil.img) {
                modalImage.src = conseil.img;
                modalImage.alt = `Illustration de ${conseil.name}`;
                modalImage.hidden = false;
            } else {
                modalImage.removeAttribute('src');
                modalImage.alt = '';
                modalImage.hidden = true;
            }
        }

        const careCards = conseil.careCards || {};
        for (const key in careElements) {
            setText(careElements[key], careCards[key] || '-');
        }

        // On utilise le module importé, et non une variable globale incertaine.
        modalManager.open(modal, triggerElement || document.activeElement);
    }

    /**
     * Ferme la fiche ouverte.
     */
    function closeConseilModal() {
        modalManager.close(modal);
    }

    /**
     * Fabrique une carte de résultat de recherche.
     */
    function createResultCard(conseil) {
        const card = document.createElement('article');
        card.className = 'advice-result-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-controls', 'conseil-modal');
        card.setAttribute('aria-label', `Ouvrir la fiche ${conseil.name}`);

        const title = document.createElement('h3');
        title.textContent = conseil.name;
        card.appendChild(title);

        const meta = document.createElement('p');
        meta.className = 'advice-result-meta';
        meta.textContent = conseil.type === 'species'
            ? `Fiche de culture — ${conseil.category || 'Orchidée'}`
            : 'Rubrique de conseils';
        card.appendChild(meta);

        if (conseil.img) {
            const image = document.createElement('img');
            image.src = conseil.img;
            image.alt = '';
            image.className = 'advice-result-thumb';
            image.loading = 'lazy';
            card.appendChild(image);
        }

        card.addEventListener('click', () => openConseilModal(conseil, card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openConseilModal(conseil, card);
            }
        });

        return card;
    }

    /**
     * Affiche les résultats sous le formulaire.
     */
    function renderResults(results, query) {
        if (!resultsContainer) {
            return;
        }

        replaceChildren(resultsContainer);

        if (results.length === 0) {
            const message = document.createElement('p');
            message.className = 'advice-no-results';
            message.textContent = `Aucune fiche ne correspond à « ${query} ».`;
            resultsContainer.appendChild(message);
            return;
        }

        const fragment = document.createDocumentFragment();
        for (const conseil of results) {
            fragment.appendChild(createResultCard(conseil));
        }
        resultsContainer.appendChild(fragment);
    }

    /**
     * Lance une recherche après au moins trois caractères.
     */
    function filterAndRender() {
        if (!searchInput || !resultsContainer) {
            return [];
        }

        const query = searchInput.value.trim();

        if (query.length === 0) {
            replaceChildren(resultsContainer);
            return [];
        }

        if (query.length < 3) {
            replaceChildren(resultsContainer);
            const message = document.createElement('p');
            message.className = 'advice-search-help';
            message.textContent = 'Veuillez saisir au moins 3 caractères pour lancer la recherche.';
            resultsContainer.appendChild(message);
            return [];
        }

        const results = searchConseils(query);
        renderResults(results, query);
        return results;
    }

    /**
     * Ouvre la rubrique liée à une grande carte de la page.
     */
    function openCardAdvice(card) {
        const conseilId = card.dataset.conseilId;
        const conseil = conseilId
            ? getConseilById(conseilId)
            : getAllConseils().find((item) => item.type === 'category' && item.name === card.dataset.category);

        if (conseil) {
            openConseilModal(conseil, card);
        }
    }

    // Les grandes cartes fonctionnent au clic et au clavier.
    for (const card of conseilCards) {
        card.addEventListener('click', () => openCardAdvice(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCardAdvice(card);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterAndRender);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            filterAndRender();
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeConseilModal);
    }

    // Un clic sur le fond sombre ferme la modale.
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeConseilModal();
        }
    });

    // Une image manquante ne doit pas empêcher l'ouverture de la fiche.
    if (modalImage) {
        modalImage.addEventListener('error', () => {
            modalImage.hidden = true;
            modalImage.alt = '';
        });
    }
}
