// ===========================================================================
// Moteur de recherche et affichage des fiches
// ===========================================================================
// J'ai centralisé ici toute la logique de recherche d'orchidées et d'affichage
// des cartes. Pourquoi un module dédié ? Pour isoler la partie "métier" de la
// partie "affichage" et pouvoir justifier mes choix d'accessibilité et de
// sécurité devant le jury.

// J'importe mes wrappers DOM sécurisés : ils m'évitent les erreurs "null is not
// an object" et garantissent que je manipule toujours des éléments existants.
import { getElement, createElement, replaceChildren } from '../core/dom.js';
// J'importe les services métier : ils interrogent ma fausse BDD Supabase via db.js.
// C'est le principe de séparation : ce fichier ne sait pas OÙ sont les données.
import { getAllOrchids, searchOrchids, getOrchidById } from '../services/orchid-service.js';
import * as modalManager from '../core/modal.js';
import * as notifications from '../core/notifications.js';

// Je garde en mémoire les références DOM principales pour éviter de refaire des
// querySelector à chaque frappe. C'est une optimisation de performance.
let gridContainer;
let searchInput;
let searchForm;
let modal;
let closeModalBtn;

// Ma fonction d'initialisation, appelée depuis app.js via le routeur.
// Pourquoi une fonction initSearch() ? Pour que app.js puisse décider QUAND la lancer
// (uniquement si on est sur une page qui a besoin de recherche).
export function initSearch() {
    // Je récupère chaque élément avec mon wrapper getElement qui gère le cas null.
    gridContainer = getElement('#orchid-grid-container');
    searchInput = getElement('#search-input');
    searchForm = getElement('#encyclopedia-search-form') || getElement('#landing-search-form');
    modal = getElement('#orchid-modal');
    closeModalBtn = modal ? getElement('.modal-close', modal) : null;

    // Si je suis sur la page encyclopédie SANS paramètre de recherche dans l'URL,
    // j'affiche l'intégralité du catalogue. Pourquoi ce test ? Pour éviter d'avoir
    // une grille vide au premier chargement, ce qui serait déroutant.
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

// Je vide la grille puis je la repeuple. Pourquoi une fonction dédiée ?
// Pour centraliser le rendu et éviter la duplication entre recherche temps réel
// et soumission de formulaire.
function renderOrchidGrid(list) {
    if (!gridContainer) return;

    // J'utilise mon helper replaceChildren qui vide proprement le conteneur
    // sans utiliser innerHTML = '' (qui peut casser les écouteurs d'événements).
    replaceChildren(gridContainer);

    // Cas particulier : aucun résultat. J'affiche un message accessible et
    // je stylise pour qu'il prenne toute la largeur de la grille.
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

    // Sinon, je crée un DocumentFragment : c'est un conteneur temporaire en
    // mémoire qui me permet d'ajouter 21 cartes sans déclencher 21 reflows du
    // navigateur. Je ne touche au DOM réel qu'une seule fois à la fin.
    const fragment = document.createDocumentFragment();
    for (const orchid of list) {
        fragment.appendChild(createOrchidCard(orchid));
    }
    gridContainer.appendChild(fragment);
}

// Je fabrique une carte d'orchidée en pur JS. Pourquoi ne pas l'avoir en HTML ?
// Parce que mes données sont dynamiques : je ne connais pas à l'avance combien
// d'orchidées je vais afficher.
function createOrchidCard(orchid) {
    // Je crée l'article sémantique <article>. J'ajoute un data-attribute avec le
    // nom pour pouvoir retrouver l'orchidée au clic sans passer par une closure.
    const article = createElement('article', {
        className: 'orchid-card',
        attributes: { 'data-orchid-name': orchid.name }
    });

    // J'ajoute l'image en lazy loading : le navigateur ne la chargera que quand
    // elle entre dans le viewport. C'est crucial pour la performance avec 21 images.
    const img = createElement('img', {
        className: 'card-img',
        attributes: { src: orchid.img, alt: 'Photographie de ' + orchid.name, loading: 'lazy' }
    });
    article.appendChild(img);

    const infoDiv = createElement('div', { className: 'card-info' });
    
    infoDiv.appendChild(createElement('h3', { text: orchid.name }));
    infoDiv.appendChild(createElement('p', { className: 'vernacular-name', text: orchid.vernacular }));
    infoDiv.appendChild(createElement('p', { className: 'short-desc', text: orchid.shortDesc }));
    
    // Mon bouton d'action. J'utilise type="button" pour éviter qu'il ne soumette
    // un formulaire parent par inadvertance.
    const btn = createElement('button', {
        className: 'card-btn',
        text: 'SÉLECTIONNER',
        attributes: { type: 'button', 'data-orchid-name': orchid.name }
    });
    infoDiv.appendChild(btn);

    article.appendChild(infoDiv);
    return article;
}

// Je filtre la grille à partir de la saisie utilisateur.
// J'explique ici mes choix d'ergonomie et de performance.
function filterOrchids(query) {
    // Je normalise l'entrée utilisateur : toLowerCase() pour insensibilité à la casse
    // et trim() pour supprimer les espaces superflus en début/fin. Sans cela,
    // " Vanilla " ne trouverait rien alors que "vanilla" devrait matcher.
    const cleanQuery = query.toLowerCase().trim();

    // J'ai imposé un seuil de 3 caractères minimum avant de filtrer.
    // Pourquoi ? Pour optimiser les performances de rendu : si je filtrais dès
    // 1 lettre, je déclencherais un rendu pour "a", "ac", "aca"... avec 21 cartes
    // à chaque fois, ce qui est coûteux et peu pertinent.
    if (cleanQuery.length < 3) {
        if (gridContainer) replaceChildren(gridContainer);
        return;
    }

    const filtered = searchOrchids(cleanQuery);
    renderOrchidGrid(filtered);
}

// J'écoute la frappe en temps réel et je gère le cas d'arrivée depuis l'accueil
// avec un paramètre ?search=...
function setupRealtimeSearch() {
    if (!searchInput || !gridContainer) return;

    // J'écoute l'événement 'input' : il se déclenche à chaque lettre tapée,
    // contrairement à 'change' qui attend la sortie du champ. C'est ce qui donne
    // l'effet de recherche instantanée.
    searchInput.addEventListener('input', (event) => filterOrchids(event.target.value));

    // Si j'arrive depuis la landing page avec ?search=Acacalis dans l'URL,
    // je pré-remplis la barre et je lance immédiatement le filtre pour que
    // l'utilisateur voie directement le résultat sans retaper.
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get('search');
    if (searchFromUrl) {
        searchInput.value = searchFromUrl;
        filterOrchids(searchFromUrl);
    }
}

// Je cherche une orchidée par son nom exact (insensible à la casse) et j'ouvre la modale.
// Pourquoi find() et non searchOrchids() ? Parce qu'ici je veux une correspondance exacte
// au clic sur une carte, pas une recherche floue.
function selectOrchidByName(orchidName) {
    const matchedOrchid = getAllOrchids().find(orchid => orchid.name.toLowerCase() === orchidName.toLowerCase());
    if (matchedOrchid) {
        injectModalData(matchedOrchid);
        openModal();
    }
}

// J'injecte les données de l'orchidée dans la modale. C'est le point sensible
// pour la sécurité : j'explique mon choix crucial ci-dessous.
function injectModalData(orchid) {
    // Ma petite fonction utilitaire setText utilise textContent et non innerHTML.
    // Pourquoi ce choix est-il vital ? Pour me prémunir des failles XSS
    // (Cross-Site Scripting) : si une donnée contenait "<script>alert('hack')</script>",
    // innerHTML l'exécuterait, tandis que textContent l'affichera comme du texte inerte.
    // C'est une règle de sécurité que je respecte systématiquement.
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

// J'ouvre la modale via mon gestionnaire centralisé. Pourquoi passer par
// modalManager.open() plutôt que modal.style.display = 'block' ? Parce que
// modalManager gère pour moi l'accessibilité (ARIA), le Focus Trap et le
// blocage du scroll, ce que je ne veux pas dupliquer.
function openModal() {
    if (!modal) return;
    modal.dispatchEvent(new CustomEvent('orchidModalOpened'));
    modalManager.open(modal);
}

// Je ferme la modale via le même gestionnaire pour garantir la restitution
// du focus et la réactivation du scroll.
function closeModal() {
    modalManager.close(modal);
}

// Je branche tous les écouteurs d'événements (Event Listeners) de ce module.
// Pourquoi centraliser ici ? Pour avoir une vue d'ensemble des interactions
// et éviter d'éparpiller les addEventListener dans le code.
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

    // J'écoute la soumission du formulaire de recherche. C'est ici que j'applique
    // deux concepts clés demandés par le jury.
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            // J'appelle event.preventDefault() pour neutraliser le comportement par
            // défaut du navigateur qui est de recharger la page lors d'un submit.
            // Sans cela, toute ma SPA en Vanilla JS se rechargerait et je perdrais
            // l'état de la recherche. C'est fondamental en JavaScript moderne.
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
