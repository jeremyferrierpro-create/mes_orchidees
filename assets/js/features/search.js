import { getElement, createElement, replaceChildren } from '../core/dom.js';
import { getAllOrchids, searchOrchids, getOrchidById } from '../services/orchid-service.js';
import * as modalManager from '../core/modal.js';
import * as notifications from '../core/notifications.js';

let gridContainer;
let searchInput;
let searchForm;
let modal;
let closeModalBtn;

export function initSearch() {
    gridContainer = getElement('#orchid-grid-container');
    searchInput = getElement('#search-input');
    searchForm = getElement('#encyclopedia-search-form') || getElement('#landing-search-form');
    modal = getElement('#orchid-modal');
    closeModalBtn = modal ? getElement('.modal-close', modal) : null;

    if (gridContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const hasSearch = urlParams.get('search');
        const onEncyclopedie = window.location.pathname.toLowerCase().includes('encyclopedie');
        if (onEncyclopedie && !hasSearch) {
            renderOrchidGrid(getAllOrchids());
        }
    }

    setupRealtimeSearch();
    setupEvents();
}

function renderOrchidGrid(list) {
    if (!gridContainer) return;

    replaceChildren(gridContainer);

    if (list.length === 0) {
        const noResult = createElement('p', {
            className: 'no-results',
            text: 'Aucune orchidée ne correspond à votre recherche.'
        });
        noResult.style.gridColumn = '1 / -1';
        noResult.style.textAlign = 'center';
        gridContainer.appendChild(noResult);
        return;
    }

    const fragment = document.createDocumentFragment();
    for (const orchid of list) {
        fragment.appendChild(createOrchidCard(orchid));
    }
    gridContainer.appendChild(fragment);
}

function createOrchidCard(orchid) {
    const article = createElement('article', {
        className: 'orchid-card',
        attributes: { 'data-orchid-name': orchid.name }
    });

    const img = createElement('img', {
        className: 'card-img',
        attributes: { src: orchid.img, alt: 'Photographie de ' + orchid.name, loading: 'lazy' }
    });
    article.appendChild(img);

    const infoDiv = createElement('div', { className: 'card-info' });
    
    infoDiv.appendChild(createElement('h3', { text: orchid.name }));
    infoDiv.appendChild(createElement('p', { className: 'vernacular-name', text: orchid.vernacular }));
    infoDiv.appendChild(createElement('p', { className: 'short-desc', text: orchid.shortDesc }));
    
    const btn = createElement('button', {
        className: 'card-btn',
        text: 'SÉLECTIONNER',
        attributes: { type: 'button', 'data-orchid-name': orchid.name }
    });
    infoDiv.appendChild(btn);

    article.appendChild(infoDiv);
    return article;
}

function filterOrchids(query) {
    const cleanQuery = query.toLowerCase().trim();

    if (cleanQuery.length < 3) {
        if (gridContainer) replaceChildren(gridContainer);
        return;
    }

    const filtered = searchOrchids(cleanQuery);
    renderOrchidGrid(filtered);
}

function setupRealtimeSearch() {
    if (!searchInput || !gridContainer) return;

    searchInput.addEventListener('input', (event) => filterOrchids(event.target.value));

    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get('search');
    if (searchFromUrl) {
        searchInput.value = searchFromUrl;
        filterOrchids(searchFromUrl);
    }
}

function selectOrchidByName(orchidName) {
    const matchedOrchid = getAllOrchids().find(orchid => orchid.name.toLowerCase() === orchidName.toLowerCase());
    if (matchedOrchid) {
        injectModalData(matchedOrchid);
        openModal();
    }
}

function injectModalData(orchid) {
    const setText = (id, text) => {
        const el = getElement('#' + id);
        if (el) el.textContent = text;
    };

    setText('modal-orchid-title', orchid.name);
    setText('modal-orchid-scientific', orchid.name);
    setText('modal-orchid-vernacular', orchid.vernacular);
    setText('modal-orchid-short', orchid.shortDesc);
    setText('modal-orchid-long', orchid.longDesc);
    setText('spec-ordre', orchid.order);
    setText('spec-espece', orchid.species);
    setText('spec-genre', orchid.genre);
    setText('spec-famille', orchid.family);
    setText('spec-subfamily', orchid.subfamily);
    setText('spec-tribu', orchid.tribu);
    setText('spec-subtribu', orchid.subtribu);
    setText('spec-behavior', orchid.behavior);
    setText('spec-discovered', orchid.discovered);
    setText('spec-origin', orchid.origin);

    const modalImg = getElement('#modal-orchid-img');
    if (modalImg) {
        modalImg.src = orchid.img;
        modalImg.alt = 'Photographie de ' + orchid.name;
    }
}

function openModal() {
    if (!modal) return;
    modal.dispatchEvent(new CustomEvent('orchidModalOpened'));
    modalManager.open(modal);
}

function closeModal() {
    modalManager.close(modal);
}

function setupEvents() {
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    if (gridContainer) {
        gridContainer.addEventListener('click', (event) => {
            const button = event.target.closest('[data-orchid-name]');
            if (button) {
                selectOrchidByName(button.getAttribute('data-orchid-name'));
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            if (searchInput && searchForm.id === 'landing-search-form') {
                const query = searchInput.value.toLowerCase().trim();
                if (query.length === 0) return;

                const matchedOrchid = searchOrchids(query)[0];

                if (matchedOrchid) {
                    selectOrchidByName(matchedOrchid.name);
                    searchInput.value = '';
                    searchInput.blur();
                } else {
                    notifications.warning("Aucune orchidée trouvée pour cette recherche.");
                }
            } else if (searchInput && gridContainer) {
                filterOrchids(searchInput.value);
            }
        });
    }
}
