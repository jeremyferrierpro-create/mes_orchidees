/**
 * MES ORCHIDÉES - SYSTÈME DE NOTIFICATIONS TOAST (toast.js)
 * =========================================================
 * Gère l'affichage de messages temporaires non-bloquants (succès, erreur, info).
 * Utilise strictement l'API DOM (createElement) pour garantir la sécurité.
 */

(function () {
    'use strict';

    // Durée par défaut d'affichage d'un toast (en millisecondes)
    const DEFAULT_DURATION = 4000;

    // Icônes FontAwesome selon le type de message
    const TOAST_ICONS = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    /**
     * Initialise le conteneur principal des toasts dans le DOM s'il n'existe pas.
     * @returns {HTMLElement} Le conteneur des toasts.
     */
    function getOrCreateToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Affiche une notification toast.
     * 
     * @param {string} message - Le texte à afficher.
     * @param {string} type - Le type de toast ('success', 'error', 'warning', 'info'). Par défaut: 'info'.
     * @param {number} duration - Temps d'affichage en ms avant auto-fermeture.
     */
    function showToast(message, type = 'info', duration = DEFAULT_DURATION) {
        // Validation du type (fallback sur 'info' si invalide)
        if (!TOAST_ICONS[type]) {
            type = 'info';
        }

        const container = getOrCreateToastContainer();

        // 1. Création de l'élément principal du toast
        const toastElement = document.createElement('div');
        toastElement.className = `toast toast-${type}`;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');

        // 2. Création de l'icône
        const iconElement = document.createElement('i');
        iconElement.className = `fa-solid ${TOAST_ICONS[type]} toast-icon`;
        iconElement.setAttribute('aria-hidden', 'true');
        toastElement.appendChild(iconElement);

        // 3. Création du conteneur de texte
        const messageElement = document.createElement('span');
        messageElement.className = 'toast-message';
        // Sécurité maximale : on utilise textContent (jamais innerHTML)
        messageElement.textContent = message; 
        toastElement.appendChild(messageElement);

        // 4. Création du bouton de fermeture
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.setAttribute('aria-label', 'Fermer la notification');
        
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fa-solid fa-times';
        closeIcon.setAttribute('aria-hidden', 'true');
        
        closeBtn.appendChild(closeIcon);
        toastElement.appendChild(closeBtn);

        // Ajout du toast au conteneur (s'affiche grâce à l'animation CSS)
        container.appendChild(toastElement);

        // Fonction pour fermer et détruire le toast avec animation
        const removeToast = () => {
            // Empêche les multiples appels
            if (toastElement.classList.contains('toast-leaving')) return;
            
            toastElement.classList.add('toast-leaving');
            
            // Attendre la fin de l'animation CSS (0.4s) avant de retirer du DOM
            setTimeout(() => {
                if (toastElement.parentNode) {
                    toastElement.parentNode.removeChild(toastElement);
                }
            }, 400); // 400ms correspond à la durée de toast-fade-out
        };

        // Fermeture manuelle au clic
        closeBtn.addEventListener('click', removeToast);

        // Auto-fermeture après le délai
        if (duration > 0) {
            setTimeout(removeToast, duration);
        }
    }

    // Exposer globalement pour être utilisable par les autres scripts
    window.AppToast = {
        show: showToast,
        success: (msg, dur) => showToast(msg, 'success', dur),
        error: (msg, dur) => showToast(msg, 'error', dur),
        warning: (msg, dur) => showToast(msg, 'warning', dur),
        info: (msg, dur) => showToast(msg, 'info', dur)
    };

})();
