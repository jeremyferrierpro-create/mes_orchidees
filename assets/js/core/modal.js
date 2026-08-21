import { trapFocus } from './focus.js';

// =====================================================
// GESTION DES MODALES
// =====================================================
// Une seule modale peut être ouverte à la fois.

let activeModal = null;
let lastFocusedElement = null;
let previousBodyOverflow = '';

/**
 * Gère les touches utiles pendant l'ouverture d'une modale.
 */
function handleKeyDown(event) {
    if (!activeModal) {
        return;
    }

    if (event.key === 'Escape') {
        close(activeModal);
    }

    if (event.key === 'Tab') {
        trapFocus(activeModal, event);
    }
}

/**
 * Ouvre une modale.
 * triggerElement correspond au bouton ou à la carte qui a ouvert la modale.
 */
export function open(modalElement, triggerElement = null) {
    if (!modalElement) {
        return;
    }

    // On ferme une ancienne modale avant d'en ouvrir une nouvelle.
    if (activeModal && activeModal !== modalElement) {
        close(activeModal);
    }

    activeModal = modalElement;
    lastFocusedElement = triggerElement || document.activeElement;
    previousBodyOverflow = document.body.style.overflow;

    modalElement.classList.add('active');
    modalElement.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // On évite d'ajouter plusieurs fois le même écouteur de clavier.
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);

    // Le délai laisse au navigateur le temps d'afficher la modale.
    window.setTimeout(() => {
        const closeButton = modalElement.querySelector('.modal-close, .close-modal');

        if (closeButton) {
            closeButton.focus();
        } else if (typeof modalElement.focus === 'function') {
            modalElement.focus();
        }
    }, 50);
}

/**
 * Ferme la modale active et remet le focus sur l'élément d'origine.
 */
export function close(modalElement) {
    if (!modalElement || modalElement !== activeModal) {
        return;
    }

    modalElement.classList.remove('active');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;

    document.removeEventListener('keydown', handleKeyDown);
    activeModal = null;

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }

    lastFocusedElement = null;
}

// Cet alias garde les anciens fichiers compatibles avec le nouveau module.
window.ModalManager = { open, close };
