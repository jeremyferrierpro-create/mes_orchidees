// J'importe l'outil qui vide/remplit vite
import { replaceChildren } from './dom.js';

// Je garde en mémoire quels chargements sont affichés
const activeLoaders = {
    overlay: null, // le gros voile sur toute la page
    inline: new Map() // les petits chargements dans une zone précise
};

// Je crée le petit rond qui tourne (spinner) + son texte
function createSpinnerDOM(text = '', isSmall = false) {
    const group = document.createElement('div'); // le conteneur du tout
    group.className = 'loader-group'; // classe pour le style

    const spinner = document.createElement('div'); // le rond qui tourne
    spinner.className = 'loader-spinner'; // classe pour l'animation
    if (isSmall) { // si on veut un petit rond
        spinner.classList.add('loader-spinner--sm'); // j'ajoute la classe petite taille
    }
    group.appendChild(spinner); // je mets le rond dans le groupe

    if (text) { // si on a donné un texte (ex: "Chargement...")
        const textEl = document.createElement('div'); // je crée la zone de texte
        textEl.className = 'loader-text'; // classe pour le style
        textEl.setAttribute('aria-live', 'polite'); // pour les lecteurs d'écran
        textEl.textContent = text; // je mets le texte
        group.appendChild(textEl); // je l'ajoute sous le rond
    }

    return group; // je rends le groupe complet
}

// Je montre le GROS chargement qui bloque toute la page
export function showGlobalLoader(text = 'Chargement...') {
    // Si déjà affiché, je mets juste à jour le texte
    if (activeLoaders.overlay) {
        const textEl = activeLoaders.overlay.querySelector('.loader-text');
        if (textEl && text) {
            textEl.textContent = text;
        }
        return;
    }

    const overlay = document.createElement('div'); // je crée le voile gris
    overlay.className = 'loader-overlay'; // classe pour le style plein écran
    overlay.id = 'global-loader'; // id unique
    overlay.setAttribute('role', 'dialog'); // pour accessibilité
    overlay.setAttribute('aria-modal', 'true'); // dit que c'est bloquant
    overlay.setAttribute('aria-label', 'Veuillez patienter'); // texte pour aveugles

    const spinnerDom = createSpinnerDOM(text); // je crée le rond + texte
    overlay.appendChild(spinnerDom); // je le mets dans le voile

    document.body.appendChild(overlay); // j'ajoute le voile à la page

    void overlay.offsetWidth; // petite astuce pour forcer l'animation
    
    overlay.classList.add('loader-active'); // je lance l'animation d'apparition
    
    document.body.style.overflow = 'hidden'; // j'empêche de scroller derrière

    activeLoaders.overlay = overlay; // je note que le voile est ouvert
}

// Je cache le GROS chargement
export function hideGlobalLoader() {
    const overlay = activeLoaders.overlay; // je récupère le voile
    if (!overlay) return; // s'il n'y en a pas, j'arrête

    overlay.classList.remove('loader-active'); // je lance l'animation de disparition
    document.body.style.overflow = ''; // je remets le scroll

    // Après 300ms (temps de l'animation), je supprime le voile du HTML
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 300);

    activeLoaders.overlay = null; // je note qu'il n'y a plus de voile
}

// Je montre un PETIT chargement à l'intérieur d'une zone précise (ex: grille d'orchidées)
export function showInlineLoader(target, text = '', clearTarget = true) {
    // target peut être "#ma-zone" ou directement l'élément
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return; // si la zone n'existe pas, j'arrête

    if (activeLoaders.inline.has(container)) return; // si déjà un chargement dedans, j'arrête

    if (clearTarget) { // si on veut vider la zone avant
        replaceChildren(container); // je vide
    }

    const loaderWrapper = document.createElement('div'); // je crée le conteneur du petit chargement
    loaderWrapper.className = 'loader-inline'; // classe pour le style
    loaderWrapper.appendChild(createSpinnerDOM(text)); // je mets le rond dedans

    container.appendChild(loaderWrapper); // je l'ajoute dans la zone
    activeLoaders.inline.set(container, loaderWrapper); // je note qu'il y a un chargement dans cette zone
}

// Je cache le PETIT chargement d'une zone
export function hideInlineLoader(target) {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return;

    const loaderWrapper = activeLoaders.inline.get(container); // je récupère le chargement de cette zone
    if (loaderWrapper && loaderWrapper.parentNode === container) { // s'il existe et est bien dedans
        container.removeChild(loaderWrapper); // je l'enlève
        activeLoaders.inline.delete(container); // j'oublie cette zone
    }
}

// Je l'expose aussi en global pour les anciens scripts (compatibilité)
window.AppLoader = {
    show: showGlobalLoader,
    hide: hideGlobalLoader,
    showInline: showInlineLoader,
    hideInline: hideInlineLoader
};
