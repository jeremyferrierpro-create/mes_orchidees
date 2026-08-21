// ===========================================================
// search-modal.js — Moteur de recherche et modale de fiche orchidée
// ===========================================================
// Ce fichier fait le lien entre la page et les données.
// Les données sont chargées depuis le fichier orchids-data.js
// Lors de la migration vers PHP + Supabase, le bloc ci-dessous sera remplacé
// par un appel fetch vers un endpoint PHP qui retournera du JSON.

// -----------------------------------------------------------
// 1. CONSTANTES DE L'APPLICATION
// -----------------------------------------------------------

// URL future de l'API PHP / Supabase (préparée pour la migration)
const API_ORCHIDS_URL = './api/orchids.php';

// On récupère les données déjà chargées par orchids-data.js
let orchidsDatabase = window.orchidsDatabase || [];

// -----------------------------------------------------------
// 2. RÉCUPÉRATION DES ÉLÉMENTS DU DOM
// -----------------------------------------------------------

// Conteneur de la grille des orchidées (page encyclopédie)
const gridContainer = document.getElementById('orchid-grid-container');

// Champ de saisie du moteur de recherche
const searchInput = document.getElementById('search-input');

// Formulaire de recherche (pour empêcher son envoi par défaut)
const searchForm = document.getElementById('encyclopedia-search-form') || document.getElementById('landing-search-form');

// La modale complète
const modal = document.getElementById('orchid-modal');

// Bouton de fermeture de la modale
const closeModalBtn = modal ? modal.querySelector('.modal-close') : null;

// Élément actif avant l'ouverture de la modale (pour restaurer le focus)
let previousActiveElement = null;

// -----------------------------------------------------------
// 3. CHARGEMENT DES DONNÉES (prêt pour PHP / Supabase)
// -----------------------------------------------------------

// Fonction qui retourne la base de données actuellement utilisée
function loadOrchids() {
    // Aujourd'hui, on utilise le fichier JS local.
    // Plus tard, cette fonction pourra être remplacée par :
    // return fetch(API_ORCHIDS_URL).then(r => r.json());
    return orchidsDatabase;
}

// -----------------------------------------------------------
// 4. CRÉATION DE LA GRILLE DE CARTES
// -----------------------------------------------------------

// Cette fonction affiche une liste d'orchidées sous forme de cartes
function renderOrchidGrid(list) {
    // Si le conteneur n'existe pas, on quitte (ex: page d'accueil sans grille)
    if (!gridContainer) {
        return;
    }

    // On vide le conteneur avant de le remplir
    gridContainer.innerHTML = '';

    // Si la liste est vide, on affiche un message
    if (list.length === 0) {
        // On crée un paragraphe de message
        const noResult = document.createElement('p');
        // On lui ajoute une classe CSS
        noResult.className = 'no-results';
        // On place le message en pleine largeur
        noResult.style.gridColumn = '1 / -1';
        // On centre le texte
        noResult.style.textAlign = 'center';
        // On écrit le message
        noResult.textContent = 'Aucune orchidée ne correspond à votre recherche.';
        // On ajoute le message au conteneur
        gridContainer.appendChild(noResult);
        // On quitte la fonction
        return;
    }

    // On parcourt chaque orchidée de la liste
    for (const orchid of list) {
        // On génère la carte et on l'ajoute au conteneur
        const card = createOrchidCard(orchid);
        gridContainer.appendChild(card);
    }
}

// Cette fonction crée une carte HTML à partir d'un objet orchidée
function createOrchidCard(orchid) {
    // On crée un élément <article> sémantique
    const article = document.createElement('article');
    // On applique la classe CSS des cartes
    article.className = 'orchid-card';
    // On ajoute un attribut data pour stocker le nom latin (utile pour le clic)
    article.setAttribute('data-orchid-name', orchid.name);

    // On remplit l'intérieur de la carte avec un modèle de chaîne
    article.innerHTML = ''
        + '<img src="' + orchid.img + '" alt="Photographie de ' + orchid.name + '" class="card-img" loading="lazy">'
        + '<div class="card-info">'
        + '<h3>' + escapeHtml(orchid.name) + '</h3>'
        + '<p class="vernacular-name">' + escapeHtml(orchid.vernacular) + '</p>'
        + '<p class="short-desc">' + escapeHtml(orchid.shortDesc) + '</p>'
        + '<button type="button" class="card-btn" data-orchid-name="' + escapeHtml(orchid.name) + '">SÉLECTIONNER</button>'
        + '</div>';

    // On retourne l'article créé
    return article;
}

// -----------------------------------------------------------
// 5. RECHERCHE EN TEMPS RÉEL
// -----------------------------------------------------------

// Cette fonction filtre les orchidées selon le texte tapé
function filterOrchids(query) {
    // On nettoie la requête : on enlève les espaces et on met en minuscule
    const cleanQuery = query.toLowerCase().trim();

    // On filtre la base de données
    const filtered = orchidsDatabase.filter(function (orchid) {
        // On cherche dans le nom latin
        const nameMatch = orchid.name.toLowerCase().includes(cleanQuery);
        // On cherche dans le nom vernaculaire
        const vernacularMatch = orchid.vernacular.toLowerCase().includes(cleanQuery);
        // On retourne vrai si l'un des deux correspond
        return nameMatch || vernacularMatch;
    });

    // On affiche le résultat du filtre
    renderOrchidGrid(filtered);
}

// Cette fonction met en place la recherche au clavier
function setupRealtimeSearch() {
    // Si le champ de recherche n'existe pas, on quitte
    if (!searchInput) {
        return;
    }

    // On écoute l'événement "input" (chaque touche relâchée)
    searchInput.addEventListener('input', function (event) {
        // On récupère la valeur actuelle du champ
        const value = event.target.value;
        // On filtre et on affiche
        filterOrchids(value);
    });

    // Si l'URL contient un paramètre ?search=..., on pré-remplit le champ
    const urlParams = new URLSearchParams(window.location.search);
    // On récupère la valeur du paramètre "search"
    const searchFromUrl = urlParams.get('search');
    // Si un paramètre est présent
    if (searchFromUrl) {
        // On met la valeur dans le champ
        searchInput.value = searchFromUrl;
        // On filtre immédiatement
        filterOrchids(searchFromUrl);
    }
}

// -----------------------------------------------------------
// 6. OUVERTURE DE LA MODALE
// -----------------------------------------------------------

// Cette fonction affiche les données d'une orchidée dans la modale
function selectOrchidByName(orchidName) {
    // On cherche l'orchidée qui correspond exactement au nom
    const matchedOrchid = orchidsDatabase.find(function (orchid) {
        // On compare les noms en minuscule pour être insensible à la casse
        return orchid.name.toLowerCase() === orchidName.toLowerCase();
    });

    // Si on a trouvé une orchidée
    if (matchedOrchid) {
        // On injecte ses données dans la modale
        injectModalData(matchedOrchid);
        // On ouvre la modale
        openModal();
    }
}

// Cette fonction remplit les champs de la modale
function injectModalData(orchid) {
    // Petite fonction utilitaire pour éviter de répéter document.getElementById
    function setText(id, text) {
        // On récupère l'élément
        const element = document.getElementById(id);
        // S'il existe, on change son contenu texte
        if (element) {
            element.textContent = text;
        }
    }

    // On remplit les textes de la modale
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

    // On met à jour l'image de la modale
    const modalImg = document.getElementById('modal-orchid-img');
    if (modalImg) {
        // On change l'attribut src
        modalImg.src = orchid.img;
        // On améliore l'accessibilité avec un alt explicite
        modalImg.alt = 'Photographie de ' + orchid.name;
    }
}

// -----------------------------------------------------------
// 7. GESTION DE L'OUVERTURE ET DE LA FERMETURE DE LA MODALE
// -----------------------------------------------------------

function openModal() {
    // Si la modale n'existe pas, on quitte
    if (!modal) {
        return;
    }

    // On mémorise l'élément qui avait le focus avant
    previousActiveElement = document.activeElement;

    // On ajoute la classe CSS qui affiche la modale
    modal.classList.add('active');
    // On indique aux lecteurs d'écran que la modale est visible
    modal.setAttribute('aria-hidden', 'false');

    // On place le focus sur le bouton de fermeture pour l'accessibilité
    if (closeModalBtn) {
        // On attend un petit instant pour laisser l'affichage se faire
        setTimeout(function () {
            closeModalBtn.focus();
        }, 100);
    }

    // On ajoute l'écouteur de clavier pour le piège du focus
    modal.addEventListener('keydown', trapFocus);
    // On ajoute l'écouteur pour fermer avec la touche Échap
    document.addEventListener('keydown', handleEscape);
}

function closeModal() {
    // Si la modale n'existe pas, on quitte
    if (!modal) {
        return;
    }

    // On cache la modale
    modal.classList.remove('active');
    // On indique qu'elle est cachée aux lecteurs d'écran
    modal.setAttribute('aria-hidden', 'true');

    // On supprime l'écouteur de piège de focus
    modal.removeEventListener('keydown', trapFocus);
    // On supprime l'écouteur de la touche Échap
    document.removeEventListener('keydown', handleEscape);

    // On remet le focus sur l'élément qui l'avait avant l'ouverture
    if (previousActiveElement) {
        previousActiveElement.focus();
    }
}

// Cette fonction empêche le focus de sortir de la modale (WCAG 2.1 AA)
function trapFocus(event) {
    // Si la touche n'est pas Tab, on ne fait rien
    if (event.key !== 'Tab') {
        return;
    }

    // On liste tous les éléments focusables de la modale
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
    // Le premier élément focusable
    const firstElement = focusableElements[0];
    // Le dernier élément focusable
    const lastElement = focusableElements[focusableElements.length - 1];

    // Si l'utilisateur appuie sur Maj + Tab
    if (event.shiftKey) {
        // Et qu'il est sur le premier élément
        if (document.activeElement === firstElement) {
            // On renvoie le focus vers le dernier élément
            lastElement.focus();
            // On empêche le comportement par défaut
            event.preventDefault();
        }
    } else {
        // Si l'utilisateur appuie sur Tab et est sur le dernier élément
        if (document.activeElement === lastElement) {
            // On renvoie le focus vers le premier élément
            firstElement.focus();
            // On empêche le comportement par défaut
            event.preventDefault();
        }
    }
}

// Cette fonction ferme la modale avec la touche Échap
function handleEscape(event) {
    // Si la touche pressée est Échap
    if (event.key === 'Escape') {
        // On ferme la modale
        closeModal();
    }
}

// -----------------------------------------------------------
// 8. ÉCOUTEURS D'ÉVÉNEMENTS
// -----------------------------------------------------------

// Cette fonction met en place tous les écouteurs nécessaires
function setupEvents() {
    // Si le bouton de fermeture existe
    if (closeModalBtn) {
        // On lui ajoute un écouteur de clic
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Si la modale existe, on ferme quand on clique sur l'arrière-plan
    if (modal) {
        modal.addEventListener('click', function (event) {
            // Si le clic est directement sur le fond (pas sur le contenu)
            if (event.target === modal) {
                // On ferme la modale
                closeModal();
            }
        });
    }

    // Si le conteneur de la grille existe (page encyclopédie)
    if (gridContainer) {
        // On utilise la délégation d'événement pour capter les clics sur les boutons
        gridContainer.addEventListener('click', function (event) {
            // On remonte jusqu'à trouver un bouton avec data-orchid-name
            const button = event.target.closest('[data-orchid-name]');
            // Si un tel bouton a été cliqué
            if (button) {
                // On récupère le nom de l'orchidée
                const name = button.getAttribute('data-orchid-name');
                // On ouvre la fiche correspondante
                selectOrchidByName(name);
            }
        });
    }

    // Si le formulaire de recherche existe, on empêche son envoi par défaut
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            // On bloque le rechargement de la page
            event.preventDefault();
            // Si on est sur la page encyclopédie, on filtre
            if (searchInput && gridContainer) {
                filterOrchids(searchInput.value);
            }
        });
    }
}

// -----------------------------------------------------------
// 9. FONCTION UTILITAIRE : ÉCHAPPEMENT HTML
// -----------------------------------------------------------

// Cette fonction empêche les failles XSS en remplaçant les caractères spéciaux
function escapeHtml(text) {
    // On convertit la valeur en chaîne de caractères
    const safeText = String(text);
    // On remplace chaque caractère dangereux par son équivalent HTML
    return safeText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// -----------------------------------------------------------
// 10. DÉMARRAGE DE L'APPLICATION
// -----------------------------------------------------------

// On attend que le DOM soit entièrement chargé
// Cela permet d'être sûr que tous les éléments HTML existent
document.addEventListener('DOMContentLoaded', function () {
    // On charge les données (local aujourd'hui, API demain)
    loadOrchids();

    // Si on est sur la page encyclopédie, on affiche toutes les cartes au chargement
    if (gridContainer) {
        renderOrchidGrid(orchidsDatabase);
    }

    // On active la recherche en temps réel
    setupRealtimeSearch();

    // On branche tous les événements
    setupEvents();
});
