/**
 * MES ORCHIDÉES - SYSTÈME DE LOADER (loader.js)
 * =============================================
 * Gère l'affichage d'un indicateur de chargement pour les opérations longues
 * (recherche, sauvegarde, appels API futurs).
 * Permet un affichage en plein écran (overlay) ou à l'intérieur d'un élément spécifique.
 */

(function () {
    'use strict';

    // Stockage des références des loaders actifs
    const activeLoaders = {
        overlay: null, // Loader plein écran
        inline: new Map() // Loaders locaux attachés à des conteneurs spécifiques
    };

    /**
     * Crée le code HTML sécurisé (via DOM API) pour l'animation du spinner.
     * @param {string} text - Texte optionnel à afficher sous le spinner.
     * @param {boolean} isSmall - Si true, crée un spinner de taille réduite.
     * @returns {HTMLElement} Le conteneur du spinner complet.
     */
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

    /**
     * Affiche le loader plein écran (overlay).
     * S'il est déjà affiché, met à jour le texte si fourni.
     * @param {string} text - Texte optionnel.
     */
    function showGlobalLoader(text = 'Chargement...') {
        if (activeLoaders.overlay) {
            // Le loader existe déjà, on met juste à jour le texte si besoin
            const textEl = activeLoaders.overlay.querySelector('.loader-text');
            if (textEl && text) {
                textEl.textContent = text;
            }
            return;
        }

        // Création du conteneur overlay
        const overlay = document.createElement('div');
        overlay.className = 'loader-overlay';
        overlay.id = 'global-loader';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Veuillez patienter');

        // Ajout du spinner
        const spinnerDom = createSpinnerDOM(text);
        overlay.appendChild(spinnerDom);

        document.body.appendChild(overlay);

        // Force le rendu (reflow) pour que la transition CSS fonctionne
        void overlay.offsetWidth; 
        
        // Active l'animation d'apparition
        overlay.classList.add('loader-active');
        
        // Bloque le défilement de la page
        document.body.style.overflow = 'hidden';

        activeLoaders.overlay = overlay;
    }

    /**
     * Masque et détruit le loader plein écran.
     */
    function hideGlobalLoader() {
        const overlay = activeLoaders.overlay;
        if (!overlay) return;

        // Déclenche l'animation de disparition
        overlay.classList.remove('loader-active');
        
        // Restaure le défilement
        document.body.style.overflow = '';

        // Attend la fin de la transition CSS (0.3s) avant de retirer du DOM
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);

        activeLoaders.overlay = null;
    }

    /**
     * Affiche un loader à l'intérieur d'un conteneur spécifique.
     * Utile pour charger juste une section de la page.
     * 
     * @param {HTMLElement|string} target - L'élément DOM ou le sélecteur CSS du conteneur.
     * @param {string} text - Texte optionnel.
     * @param {boolean} clearTarget - Si true, vide le conteneur avant d'ajouter le loader.
     */
    function showInlineLoader(target, text = '', clearTarget = true) {
        const container = typeof target === 'string' ? document.querySelector(target) : target;
        if (!container) return;

        // Si ce conteneur a déjà un loader, on ne fait rien
        if (activeLoaders.inline.has(container)) return;

        if (clearTarget) {
            // Sécurité : au lieu de innerHTML = '', on utilise removeChild
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }

        const loaderWrapper = document.createElement('div');
        loaderWrapper.className = 'loader-inline';
        loaderWrapper.appendChild(createSpinnerDOM(text));

        container.appendChild(loaderWrapper);
        activeLoaders.inline.set(container, loaderWrapper);
    }

    /**
     * Masque un loader spécifique lié à un conteneur.
     * @param {HTMLElement|string} target - Le conteneur cible.
     */
    function hideInlineLoader(target) {
        const container = typeof target === 'string' ? document.querySelector(target) : target;
        if (!container) return;

        const loaderWrapper = activeLoaders.inline.get(container);
        if (loaderWrapper && loaderWrapper.parentNode === container) {
            container.removeChild(loaderWrapper);
            activeLoaders.inline.delete(container);
        }
    }

    // Exposer l'API globale
    window.AppLoader = {
        show: showGlobalLoader,
        hide: hideGlobalLoader,
        showInline: showInlineLoader,
        hideInline: hideInlineLoader
    };

})();
