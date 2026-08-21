// Temps par défaut qu'une notification reste affichée (4 secondes)
const DEFAULT_DURATION = 4000;

// Je prépare les 4 icônes (succès, erreur, attention, info)
const TOAST_ICONS = {
    success: 'fa-check-circle', // coche verte
    error: 'fa-exclamation-circle', // point d'exclamation rouge
    warning: 'fa-exclamation-triangle', // triangle orange
    info: 'fa-info-circle' // i bleu
};

// Elle cherche la boîte à notifications, ou la crée si elle n'existe pas
function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container'); // je cherche la boîte
    if (!container) { // si pas trouvée
        container = document.createElement('div'); // je la crée
        container.id = 'toast-container'; // id
        container.className = 'toast-container'; // classe pour le style (en haut à droite)
        document.body.appendChild(container); // je l'ajoute à la page
    }
    return container; // je la rends
}

// Elle affiche une petite notification (toast) en haut à droite
export function showToast(message, type = 'info', duration = DEFAULT_DURATION) {
    // Si le type n'existe pas, je mets info par défaut
    if (!TOAST_ICONS[type]) {
        type = 'info';
    }

    const container = getOrCreateToastContainer(); // je récupère la boîte

    const toastElement = document.createElement('div'); // je crée la notification
    toastElement.className = `toast toast-${type}`; // classe selon le type (vert/rouge...)
    toastElement.setAttribute('role', 'alert'); // pour les lecteurs d'écran
    toastElement.setAttribute('aria-live', 'assertive'); // dit que c'est important

    const iconElement = document.createElement('i'); // je crée l'icône
    iconElement.className = `fa-solid ${TOAST_ICONS[type]} toast-icon`; // classe Font Awesome
    iconElement.setAttribute('aria-hidden', 'true'); // cachée pour lecteurs d'écran (décorative)
    toastElement.appendChild(iconElement); // je mets l'icône dans la notif

    const messageElement = document.createElement('span'); // je crée le texte
    messageElement.className = 'toast-message'; // classe
    messageElement.textContent = message; // je mets le message (ex: "Ajouté !")
    toastElement.appendChild(messageElement); // je l'ajoute

    const closeBtn = document.createElement('button'); // je crée le bouton fermer ×
    closeBtn.className = 'toast-close'; // classe
    closeBtn.setAttribute('aria-label', 'Fermer la notification'); // texte pour aveugles
    
    const closeIcon = document.createElement('i'); // icône ×
    closeIcon.className = 'fa-solid fa-times';
    closeIcon.setAttribute('aria-hidden', 'true');
    
    closeBtn.appendChild(closeIcon); // je mets l'icône dans le bouton
    toastElement.appendChild(closeBtn); // je mets le bouton dans la notif

    container.appendChild(toastElement); // j'ajoute la notif à la boîte

    // Fonction qui fait disparaître la notif en douceur
    const removeToast = () => {
        if (toastElement.classList.contains('toast-leaving')) return; // si déjà en train de partir, j'arrête
        
        toastElement.classList.add('toast-leaving'); // j'ajoute la classe qui lance l'animation de sortie
        
        // Après 400ms (temps de l'animation), je supprime vraiment du HTML
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 400); 
    };

    closeBtn.addEventListener('click', removeToast); // quand on clique ×, je ferme

    if (duration > 0) { // si on veut qu'elle parte seule
        setTimeout(removeToast, duration); // je la ferme après 4 secondes
    }
}

// Raccourcis pour appeler plus vite
export const success = (msg, dur) => showToast(msg, 'success', dur); // notifications.success("Bravo")
export const error = (msg, dur) => showToast(msg, 'error', dur); // notifications.error("Erreur")
export const warning = (msg, dur) => showToast(msg, 'warning', dur);
export const info = (msg, dur) => showToast(msg, 'info', dur);

// Pour les anciens fichiers
window.AppToast = {
    show: showToast,
    success,
    error,
    warning,
    info
};
