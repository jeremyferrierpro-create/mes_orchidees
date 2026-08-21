import { replaceChildren } from './dom.js';

const activeLoaders = {
    overlay: null,
    inline: new Map()
};

function createSpinnerDOM(text = '', isSmall = false) {
    const group = document.createElement('div');
    group.className = 'loader-group';

    const spinner = document.createElement('div');
    spinner.className = 'loader-spinner';
    if (isSmall) {
        spinner.classList.add('loader-spinner--sm');
    }
    group.appendChild(spinner);

    if (text) {
        const textEl = document.createElement('div');
        textEl.className = 'loader-text';
        textEl.setAttribute('aria-live', 'polite');
        textEl.textContent = text;
        group.appendChild(textEl);
    }

    return group;
}

export function showGlobalLoader(text = 'Chargement...') {
    if (activeLoaders.overlay) {
        const textEl = activeLoaders.overlay.querySelector('.loader-text');
        if (textEl && text) {
            textEl.textContent = text;
        }
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'loader-overlay';
    overlay.id = 'global-loader';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Veuillez patienter');

    const spinnerDom = createSpinnerDOM(text);
    overlay.appendChild(spinnerDom);

    document.body.appendChild(overlay);

    void overlay.offsetWidth; 
    
    overlay.classList.add('loader-active');
    
    document.body.style.overflow = 'hidden';

    activeLoaders.overlay = overlay;
}

export function hideGlobalLoader() {
    const overlay = activeLoaders.overlay;
    if (!overlay) return;

    overlay.classList.remove('loader-active');
    document.body.style.overflow = '';

    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 300);

    activeLoaders.overlay = null;
}

export function showInlineLoader(target, text = '', clearTarget = true) {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return;

    if (activeLoaders.inline.has(container)) return;

    if (clearTarget) {
        replaceChildren(container);
    }

    const loaderWrapper = document.createElement('div');
    loaderWrapper.className = 'loader-inline';
    loaderWrapper.appendChild(createSpinnerDOM(text));

    container.appendChild(loaderWrapper);
    activeLoaders.inline.set(container, loaderWrapper);
}

export function hideInlineLoader(target) {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return;

    const loaderWrapper = activeLoaders.inline.get(container);
    if (loaderWrapper && loaderWrapper.parentNode === container) {
        container.removeChild(loaderWrapper);
        activeLoaders.inline.delete(container);
    }
}

window.AppLoader = {
    show: showGlobalLoader,
    hide: hideGlobalLoader,
    showInline: showInlineLoader,
    hideInline: hideInlineLoader
};
