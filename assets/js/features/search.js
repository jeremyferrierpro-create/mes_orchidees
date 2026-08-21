// J'importe mes outils : chercher/créer/vide un élément + services orchidées + modale + notifs
import { getElement, createElement, replaceChildren } from '../core/dom.js';
import { getAllOrchids, searchOrchids, getOrchidById } from '../services/orchid-service.js';
import * as modalManager from '../core/modal.js';
import * as notifications from '../core/notifications.js';

// Je garde en mémoire où sont la grille, la barre, la modale
let gridContainer; // la grille où s'affichent les cartes
let searchInput; // la barre de recherche
let searchForm; // le formulaire autour de la barre
let modal; // la petite fenêtre qui montre le détail
let closeModalBtn; // le bouton × pour fermer

// Elle démarre toute la recherche (appelée depuis app.js)
export function initSearch() {
    gridContainer = getElement('#orchid-grid-container'); // je cherche la grille
    searchInput = getElement('#search-input'); // je cherche la barre
    searchForm = getElement('#encyclopedia-search-form') || getElement('#landing-search-form'); // je cherche le formulaire (encyclo ou accueil)
    modal = getElement('#orchid-modal'); // je cherche la modale
    closeModalBtn = modal ? getElement('.modal-close', modal) : null; // je cherche le × dedans

    // Si je suis sur l'encyclopédie SANS recherche dans labarre, j'affiche toutes les orchidées
    if (gridContainer) {
        const urlParams = new URLSearchParams(window.location.search); // je lis ?search=...
        const hasSearch = urlParams.get('search'); // y a-t-il une recherche ?
        const onEncyclopedie = window.location.pathname.toLowerCase().includes('encyclopedie'); // suis-je sur encyclopédie ?
        if (onEncyclopedie && !hasSearch) { // si encyclo et pas de recherche
            renderOrchidGrid(getAllOrchids()); // j'affiche tout
        }
    }

    setupRealtimeSearch(); // je prépare la recherche en direct quand on tape
    setupEvents(); // je prépare les clics
}

// Elle vide la grille et la remplit avec une liste
function renderOrchidGrid(list) {
    if (!gridContainer) return; // si pas de grille (accueil), j'arrête

    replaceChildren(gridContainer); // je vide la grille

    // Si aucune orchidée trouvée
    if (list.length === 0) {
        const noResult = createElement('p', { // je crée un message
            className: 'no-results',
            text: 'Aucune orchidée ne correspond à votre recherche.'
        });
        noResult.style.gridColumn = '1 / -1'; // je centre sur toute la largeur
        noResult.style.textAlign = 'center';
        gridContainer.appendChild(noResult); // je l'affiche
        return;
    }

    // Sinon je crée une carte pour chaque orchidée
    const fragment = document.createDocumentFragment(); // bac temporaire pour aller plus vite
    for (const orchid of list) {
        fragment.appendChild(createOrchidCard(orchid)); // je crée la carte et je la mets dans le bac
    }
    gridContainer.appendChild(fragment); // je vide le bac dans la grille d'un coup
}

// Elle crée UNE carte d'orchidée
function createOrchidCard(orchid) {
    // Je crée la carte <article>
    const article = createElement('article', {
        className: 'orchid-card',
        attributes: { 'data-orchid-name': orchid.name } // je note le nom pour le retrouver au clic
    });

    // Je crée l'image
    const img = createElement('img', {
        className: 'card-img',
        attributes: { src: orchid.img, alt: 'Photographie de ' + orchid.name, loading: 'lazy' } // lazy = charge quand on scroll
    });
    article.appendChild(img); // je mets l'image dans la carte

    const infoDiv = createElement('div', { className: 'card-info' }); // zone texte
    
    infoDiv.appendChild(createElement('h3', { text: orchid.name })); // nom en grand
    infoDiv.appendChild(createElement('p', { className: 'vernacular-name', text: orchid.vernacular })); // petit nom courant
    infoDiv.appendChild(createElement('p', { className: 'short-desc', text: orchid.shortDesc })); // description courte
    
    // Bouton SÉLECTIONNER
    const btn = createElement('button', {
        className: 'card-btn',
        text: 'SÉLECTIONNER',
        attributes: { type: 'button', 'data-orchid-name': orchid.name }
    });
    infoDiv.appendChild(btn); // je mets le bouton

    article.appendChild(infoDiv); // je mets la zone texte dans la carte
    return article; // je rends la carte
}

// Elle filtre avec ce que l'utilisateur tape
function filterOrchids(query) {
    const cleanQuery = query.toLowerCase().trim(); // je mets en minuscule et j'enlève les espaces

    // Si moins de 3 lettres, je vide la grille (évite d'afficher 21 cartes pour "a")
    if (cleanQuery.length < 3) {
        if (gridContainer) replaceChildren(gridContainer);
        return;
    }

    const filtered = searchOrchids(cleanQuery); // je cherche dans la vraie base
    renderOrchidGrid(filtered); // j'affiche le résultat
}

// Elle prépare la recherche quand on tape lettre par lettre
function setupRealtimeSearch() {
    if (!searchInput || !gridContainer) return; // si pas de barre ou pas de grille (accueil), j'arrête

    // Quand on tape, je filtre direct
    searchInput.addEventListener('input', (event) => filterOrchids(event.target.value));

    // Si on arrive depuis l'accueil avec ?search=Acacalis, je remplis la barre et je filtre
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get('search');
    if (searchFromUrl) {
        searchInput.value = searchFromUrl; // je mets le mot dans la barre
        filterOrchids(searchFromUrl); // je filtre
    }
}

// Elle cherche une orchidée par son nom exact et ouvre la modale
function selectOrchidByName(orchidName) {
    // Je cherche celle dont le nom correspond (sans tenir compte de la casse)
    const matchedOrchid = getAllOrchids().find(orchid => orchid.name.toLowerCase() === orchidName.toLowerCase());
    if (matchedOrchid) { // si trouvée
        injectModalData(matchedOrchid); // je remplis la modale
        openModal(); // je l'ouvre
    }
}

// Elle remplit la petite fenêtre avec les infos de l'orchidée
function injectModalData(orchid) {
    // Petite aide pour écrire dans un champ par son id
    const setText = (id, text) => {
        const el = getElement('#' + id);
        if (el) el.textContent = text;
    };

    setText('modal-orchid-title', orchid.name); // titre
    setText('modal-orchid-scientific', orchid.name); // nom scientifique
    setText('modal-orchid-vernacular', orchid.vernacular); // nom courant
    setText('modal-orchid-short', orchid.shortDesc); // courte
    setText('modal-orchid-long', orchid.longDesc); // longue
    setText('spec-ordre', orchid.order); // ordre
    setText('spec-espece', orchid.species); // espèce
    setText('spec-genre', orchid.genre); // genre
    setText('spec-famille', orchid.family); // famille
    setText('spec-subfamily', orchid.subfamily); // sous-famille
    setText('spec-tribu', orchid.tribu); // tribu
    setText('spec-subtribu', orchid.subtribu); // sous-tribu
    setText('spec-behavior', orchid.behavior); // comportement
    setText('spec-discovered', orchid.discovered); // découvert par
    setText('spec-origin', orchid.origin); // origine

    const modalImg = getElement('#modal-orchid-img'); // image
    if (modalImg) {
        modalImg.src = orchid.img; // je mets la photo
        modalImg.alt = 'Photographie de ' + orchid.name; // texte pour aveugles
    }
}

// Elle ouvre la modale
function openModal() {
    if (!modal) return;
    modal.dispatchEvent(new CustomEvent('orchidModalOpened')); // je préviens les autres scripts
    modalManager.open(modal); // j'ouvre avec le module modale
}

// Elle ferme la modale
function closeModal() {
    modalManager.close(modal);
}

// Elle branche tous les clics
function setupEvents() {
    // Clic sur × → ferme
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Clic sur le fond sombre → ferme
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    // Clic sur une carte (ou son bouton) → ouvre la bonne orchidée
    if (gridContainer) {
        gridContainer.addEventListener('click', (event) => {
            const button = event.target.closest('[data-orchid-name]'); // je trouve le bouton cliqué
            if (button) {
                selectOrchidByName(button.getAttribute('data-orchid-name'));
            }
        });
    }

    // Quand on valide le formulaire (Entrée ou bouton RECHERCHER)
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // j'empêche de recharger la page
            
            // Sur l'accueil : je cherche la première qui correspond et j'ouvre sa modale
            if (searchInput && searchForm.id === 'landing-search-form') {
                const query = searchInput.value.toLowerCase().trim();
                if (query.length === 0) return;

                const matchedOrchid = searchOrchids(query)[0]; // la première trouvée

                if (matchedOrchid) {
                    selectOrchidByName(matchedOrchid.name);
                    searchInput.value = ''; // je vide la barre
                    searchInput.blur(); // j'enlève le focus
                } else {
                    notifications.warning("Aucune orchidée trouvée pour cette recherche."); // message
                }
            } else if (searchInput && gridContainer) { // sur l'encyclopédie : je filtre la grille
                filterOrchids(searchInput.value);
            }
        });
    }
}
