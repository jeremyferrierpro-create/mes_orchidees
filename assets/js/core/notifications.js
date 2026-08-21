const DEFAULT_DURATION = 4000;

const TOAST_ICONS = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
};

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

export function showToast(message, type = 'info', duration = DEFAULT_DURATION) {
    if (!TOAST_ICONS[type]) {
        type = 'info';
    }

    const container = getOrCreateToastContainer();

    const toastElement = document.createElement('div');
    toastElement.className = `toast toast-${type}`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');

    const iconElement = document.createElement('i');
    iconElement.className = `fa-solid ${TOAST_ICONS[type]} toast-icon`;
    iconElement.setAttribute('aria-hidden', 'true');
    toastElement.appendChild(iconElement);

    const messageElement = document.createElement('span');
    messageElement.className = 'toast-message';
    messageElement.textContent = message; 
    toastElement.appendChild(messageElement);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Fermer la notification');
    
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-times';
    closeIcon.setAttribute('aria-hidden', 'true');
    
    closeBtn.appendChild(closeIcon);
    toastElement.appendChild(closeBtn);

    container.appendChild(toastElement);

    const removeToast = () => {
        if (toastElement.classList.contains('toast-leaving')) return;
        
        toastElement.classList.add('toast-leaving');
        
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 400); 
    };

    closeBtn.addEventListener('click', removeToast);

    if (duration > 0) {
        setTimeout(removeToast, duration);
    }
}

export const success = (msg, dur) => showToast(msg, 'success', dur);
export const error = (msg, dur) => showToast(msg, 'error', dur);
export const warning = (msg, dur) => showToast(msg, 'warning', dur);
export const info = (msg, dur) => showToast(msg, 'info', dur);

// Alias temporaire pour la rétrocompatibilité
window.AppToast = {
    show: showToast,
    success,
    error,
    warning,
    info
};
