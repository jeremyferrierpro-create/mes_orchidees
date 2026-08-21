import { replaceChildren } from '../core/dom.js';
import { getAllConseils, getConseilById, searchConseils } from '../services/conseil-service.js';
import * as modalManager from '../core/modal.js';

// =====================================================
// PAGE CONSEILS - toute la logique en français débutant
// =====================================================
// Ce fichier gère : les 6 grosses cartes, la barre de recherche, la petite fenêtre (modale)

export function initConseils() {
    // Je récupère la barre de recherche et la zone où afficher les résultats
    const searchForm = document.getElementById('conseil-search-form');
    const searchInput = document.getElementById('conseil-search-input');
    const searchHelp = document.getElementById('conseil-search-help');
    const resultsContainer = document.getElementById('advice-results');
    const conseilCards = document.querySelectorAll('.conseil-card');

    // Je récupère la petite fenêtre qui s'ouvre quand on clique sur une fiche
    const modal = document.getElementById('conseil-modal');
    const closeButton = document.getElementById('conseil-modal-close');
    const modalImage = document.getElementById('conseil-modal-img');
    const modalTitle = document.getElementById('conseil-modal-title');
    const modalMeta = document.getElementById('conseil-modal-meta');
    const modalText = document.getElementById('conseil-modal-text');

    // Je récupère les 6 petites cases (température, arrosage...)
    const careElements = {
        temperature: document.getElementById('care-temperature'),
        arrosage: document.getElementById('care-arrosage'),
        hygrometrie: document.getElementById('care-hygrometrie'),
        rempotage: document.getElementById('care-rempotage'),
        engrais: document.getElementById('care-engrais'),
        substrats: document.getElementById('care-substrats')
    };

    // Si je ne suis pas sur la page conseils, j'arrête
    if (!modal || !modalTitle || !modalMeta || !modalText) {
        return;
    }

    // Petite fonction aide : elle écrit du texte seulement si l'élément existe
    function setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }

    // Elle remplit la petite fenêtre avec les infos d'une fiche puis l'ouvre
    function openConseilModal(conseil, triggerElement = null) {
        if (!conseil) {
            return;
        }

        // Je mets le titre
        setText(modalTitle, conseil.name || 'Conseil de culture');
        // Je mets la petite ligne sous le titre (catégorie)
        setText(
            modalMeta,
            conseil.type === 'species'
                ? `Fiche de culture — ${conseil.category || 'Orchidée'}`
                : 'Rubrique de conseils'
        );
        // Je mets le long texte
        setText(modalText, conseil.content || conseil.description || 'Aucun conseil disponible.');

        // Je mets l'image si elle existe
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

        // Je remplis les 6 petites cases du bas
        const careCards = conseil.careCards || {};
        for (const key in careElements) {
            setText(careElements[key], careCards[key] || '-');
        }

        // J'ouvre la fenêtre avec le module officiel (pas une variable globale)
        modalManager.open(modal, triggerElement || document.activeElement);
    }

    // Elle ferme la petite fenêtre
    function closeConseilModal() {
        modalManager.close(modal);
    }

    // Elle fabrique une petite carte de résultat (quand on tape dans la recherche)
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

        // Quand on clique, j'ouvre la fiche
        card.addEventListener('click', () => openConseilModal(conseil, card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openConseilModal(conseil, card);
            }
        });

        return card;
    }

    // Elle affiche les résultats sous la barre de recherche
    function renderResults(results, query) {
        if (!resultsContainer) {
            return;
        }

        // Je vide l'ancienne liste
        replaceChildren(resultsContainer);

        // Si aucun résultat, j'affiche un message clair
        if (results.length === 0) {
            const message = document.createElement('p');
            message.className = 'advice-no-results';
            message.textContent = `Aucune fiche ne correspond à « ${query} ».`;
            resultsContainer.appendChild(message);
            if (searchHelp) searchHelp.textContent = `0 résultat pour « ${query} »`;
            return;
        }

        // Sinon je crée une carte pour chaque fiche trouvée
        const fragment = document.createDocumentFragment();
        for (const conseil of results) {
            fragment.appendChild(createResultCard(conseil));
        }
        resultsContainer.appendChild(fragment);
        if (searchHelp) searchHelp.textContent = `${results.length} fiche(s) trouvée(s) pour « ${query} »`;
    }

    // Elle lance la recherche seulement si on a tapé au moins 3 lettres
    function filterAndRender() {
        if (!searchInput || !resultsContainer) {
            return [];
        }

        const query = searchInput.value.trim();

        // Si la barre est vide, j'efface tout
        if (query.length === 0) {
            replaceChildren(resultsContainer);
            if (searchHelp) searchHelp.textContent = '';
            return [];
        }

        // Si moins de 3 lettres, j'explique qu'il faut taper plus
        if (query.length < 3) {
            replaceChildren(resultsContainer);
            const message = document.createElement('p');
            message.className = 'advice-search-help';
            message.textContent = 'Veuillez saisir au moins 3 caractères pour lancer la recherche.';
            resultsContainer.appendChild(message);
            if (searchHelp) searchHelp.textContent = 'Tape au moins 3 lettres...';
            return [];
        }

        // Sinon je cherche dans la vraie base avec le service
        const results = searchConseils(query);
        renderResults(results, query);
        return results;
    }

    // Elle ouvre la fiche liée à une des 6 grosses cartes du haut
    function openCardAdvice(card) {
        // Je récupère l'id que j'ai mis dans le HTML (ex: "conseils-base")
        const conseilId = card.dataset.conseilId;
        // Je cherche directement avec cet id, c'est le plus fiable
        let conseil = conseilId ? getConseilById(conseilId) : null;
        // Si pas d'id (ancien code), je cherche par le nom en plan B
        if (!conseil) {
            conseil = getAllConseils().find((item) => item.type === 'category' && item.name === card.dataset.category);
        }

        if (conseil) {
            openConseilModal(conseil, card);
        }
    }

    // Je rends les 6 grosses cartes cliquables (souris + clavier)
    for (const card of conseilCards) {
        card.addEventListener('click', () => openCardAdvice(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCardAdvice(card);
            }
        });
    }

    // Quand on tape dans la barre, je lance la recherche en direct
    if (searchInput) {
        searchInput.addEventListener('input', filterAndRender);
    }

    // Quand on appuie sur Entrée dans le formulaire, je lance aussi la recherche
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            filterAndRender();
        });
    }

    // Bouton fermer de la petite fenêtre
    if (closeButton) {
        closeButton.addEventListener('click', closeConseilModal);
    }

    // Si on clique sur le fond sombre, je ferme aussi
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeConseilModal();
        }
    });

    // Si l'image est cassée, je la cache pour ne pas afficher une icône moche
    if (modalImage) {
        modalImage.addEventListener('error', () => {
            modalImage.hidden = true;
            modalImage.alt = '';
        });
    }
}
