// J'importe la fonction qui bloque la touche Tab dans la modale
import { trapFocus } from './focus.js';

// Je garde en mémoire quelle modale est ouverte et où on était avant
let activeModal = null; // la modale actuellement ouverte (une seule à la fois)
let lastFocusedElement = null; // le bouton qui a ouvert la modale (pour y revenir après)
let previousBodyOverflow = ''; // pour remettre le scroll comme avant

// Elle gère les touches quand une modale est ouverte
function handleKeyDown(event) {
    if (!activeModal) { // si aucune modale ouverte, je ne fais rien
        return;
    }

    // Si on appuie sur Échap, je ferme la modale
    if (event.key === 'Escape') {
        close(activeModal);
    }

    // Si on appuie sur Tab, je bloque pour rester dans la modale
    if (event.key === 'Tab') {
        trapFocus(activeModal, event);
    }
}

// Elle ouvre une petite fenêtre (modale)
export function open(modalElement, triggerElement = null) {
    if (!modalElement) { // si pas de modale donnée, j'arrête
        return;
    }

    // Si une autre modale est déjà ouverte, je la ferme d'abord
    if (activeModal && activeModal !== modalElement) {
        close(activeModal);
    }

    activeModal = modalElement; // je note que cette modale est ouverte
    lastFocusedElement = triggerElement || document.activeElement; // je me souviens d'où on vient
    previousBodyOverflow = document.body.style.overflow; // je me souviens si on pouvait scroller

    modalElement.classList.add('active'); // j'ajoute la classe qui l'affiche (CSS)
    modalElement.setAttribute('aria-hidden', 'false'); // je dis aux lecteurs d'écran qu'elle est visible
    document.body.style.overflow = 'hidden'; // j'empêche de scroller la page derrière

    // J'enlève l'ancien écouteur clavier puis j'en mets un nouveau (évite les doublons)
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);

    // Après 50ms, je mets le focus sur le bouton fermer (pour le clavier)
    window.setTimeout(() => {
        const closeButton = modalElement.querySelector('.modal-close, .close-modal'); // je cherche le bouton ×

        if (closeButton) { // si trouvé
            closeButton.focus(); // je mets le curseur clavier dessus
        } else if (typeof modalElement.focus === 'function') { // sinon je mets sur la modale elle-même
            modalElement.focus();
        }
    }, 50);
}

// Elle ferme la modale et remet le focus où on était
export function close(modalElement) {
    // Si pas de modale ou pas la bonne, j'arrête
    if (!modalElement || modalElement !== activeModal) {
        return;
    }

    modalElement.classList.remove('active'); // j'enlève la classe qui l'affiche
    modalElement.setAttribute('aria-hidden', 'true'); // je dis qu'elle est cachée
    document.body.style.overflow = previousBodyOverflow; // je remets le scroll comme avant

    document.removeEventListener('keydown', handleKeyDown); // j'enlève l'écouteur clavier
    activeModal = null; // plus de modale ouverte

    // Je remets le focus sur le bouton qui avait ouvert (pour revenir où on était)
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }

    lastFocusedElement = null; // j'oublie
}

// Pour les anciens fichiers qui utilisent window.ModalManager
window.ModalManager = { open, close };
