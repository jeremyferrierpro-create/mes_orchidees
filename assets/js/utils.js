/**
 * MES ORCHIDÉES - UTILITAIRES PARTAGÉS (utils.js)
 * ===============================================
 * Ce fichier regroupe les fonctions communes utilisées par plusieurs pages.
 * - Sécurisation (échappement HTML pour éviter les failles XSS)
 * - Formatage des dates
 * - Gestion du focus (accessibilité)
 * - Gestion de la collection (normalisation)
 * - Vérification de l'authentification locale
 */

(function () {
    'use strict';

    window.AppUtils = {
        /**
         * Échappe les caractères spéciaux pour éviter les failles XSS.
         * À utiliser OBLIGATOIREMENT avant d'insérer du texte utilisateur dans le DOM.
         * @param {string} text - Le texte à sécuriser.
         * @returns {string} - Le texte sécurisé.
         */
        escapeHtml: function (text) {
            if (typeof text !== 'string') return text;
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function (m) { return map[m]; });
        },

        /**
         * Formate une date YYYY-MM-DD en texte français (ex: "12 janv. 2026").
         * @param {string} dateString - La date au format YYYY-MM-DD.
         * @returns {string} - La date formatée.
         */
        formatDate: function (dateString) {
            if (!dateString) return 'Inconnue';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;

                return date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            } catch (e) {
                return dateString;
            }
        },

        /**
         * Vérifie si un utilisateur est actuellement connecté dans le localStorage.
         * @returns {boolean} - true si connecté, false sinon.
         */
        isAuthenticated: function () {
            try {
                const sessionStr = localStorage.getItem('mo_user_session');
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    return session && session.isAuthenticated === true;
                }
            } catch (e) {
                console.error("Erreur de parsing mo_user_session", e);
            }
            // Fallback old keys
            return localStorage.getItem('isAuthenticated') === 'true';
        },

        /**
         * Assure que les données de la collection stockées dans le localStorage
         * ont un format cohérent, notamment pour l'état de santé et la date d'ajout.
         */
        normalizeCollection: function () {
            let collection = [];
            try {
                const stored = localStorage.getItem('mo_user_collection');
                if (stored) {
                    collection = JSON.parse(stored);
                    if (!Array.isArray(collection)) {
                        collection = [];
                    }
                }
            } catch (e) {
                console.error('Erreur lors de la lecture de la collection, réinitialisation.', e);
                collection = [];
            }

            // Normalisation de chaque plante
            let modified = false;
            for (const item of collection) {
                if (!item.addedAt) {
                    item.addedAt = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
                    modified = true;
                }
                if (!item.healthStatus) {
                    item.healthStatus = 'good'; // État par défaut
                    modified = true;
                }
                if (!item.location) {
                    item.location = 'none'; // Emplacement par défaut
                    modified = true;
                }
            }

            if (modified) {
                localStorage.setItem('mo_user_collection', JSON.stringify(collection));
            }

            return collection;
        },

        /**
         * Piège le focus clavier (Tab) à l'intérieur d'une modale ouverte.
         * Indispensable pour la conformité WCAG 2.1 (Critère 2.4.3).
         * @param {HTMLElement} modal - L'élément de la modale.
         * @param {KeyboardEvent} e - L'événement clavier 'keydown'.
         */
        trapFocus: function (modal, e) {
            // Sélectionne tous les éléments potentiellement focalisables
            const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
            let focusableElements = modal.querySelectorAll(focusableElementsString);
            
            // Convertit NodeList en Array et filtre les éléments vraiment visibles
            focusableElements = Array.prototype.slice.call(focusableElements).filter(function (el) {
                return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
            });

            if (focusableElements.length === 0) return;

            const firstTabStop = focusableElements[0];
            const lastTabStop = focusableElements[focusableElements.length - 1];

            // Tabulation + Shift (retour arrière)
            if (e.shiftKey) {
                if (document.activeElement === firstTabStop) {
                    e.preventDefault();
                    lastTabStop.focus();
                }
            } 
            // Tabulation classique (vers l'avant)
            else {
                if (document.activeElement === lastTabStop) {
                    e.preventDefault();
                    firstTabStop.focus();
                }
            }
        },
        
        /**
         * Déconnecte l'utilisateur et redirige vers la page de déconnexion.
         */
        logout: function () {
            localStorage.removeItem('mo_user_session');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('mo_user_role');
            localStorage.removeItem('mo_user_email');
            window.location.href = './deconnexion.html';
        }
    };

    // Rend l'escapeHtml disponible globalement pour la compatibilité avec l'existant
    window.escapeHtml = window.AppUtils.escapeHtml;

    /**
     * GESTIONNAIRE DE MODALES (Accessibilité & Focus Trap)
     * Centralise l'ouverture, la fermeture, le piège du focus et la touche Échap.
     */
    window.ModalManager = {
        activeModal: null,
        lastFocusedElement: null,

        handleKeyDown: function (e) {
            if (!window.ModalManager.activeModal) return;
            
            if (e.key === 'Escape') {
                window.ModalManager.close(window.ModalManager.activeModal);
            } else if (e.key === 'Tab') {
                window.AppUtils.trapFocus(window.ModalManager.activeModal, e);
            }
        },

        open: function (modalElement, triggerElement = null) {
            if (!modalElement) return;
            this.lastFocusedElement = triggerElement || document.activeElement;
            this.activeModal = modalElement;
            
            modalElement.classList.add('active');
            modalElement.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Fix: remove before adding to prevent duplicates
            document.removeEventListener('keydown', window.ModalManager.handleKeyDown);
            document.addEventListener('keydown', window.ModalManager.handleKeyDown);
            
            // Placer le focus sur le premier élément focusable ou sur le bouton de fermeture
            setTimeout(() => {
                const closeBtn = modalElement.querySelector('.modal-close');
                if (closeBtn) closeBtn.focus();
                else modalElement.focus();
            }, 50);
        },

        close: function (modalElement) {
            if (!modalElement) return;
            modalElement.classList.remove('active');
            modalElement.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            document.removeEventListener('keydown', window.ModalManager.handleKeyDown);
            this.activeModal = null;
            
            if (this.lastFocusedElement) {
                this.lastFocusedElement.focus();
                this.lastFocusedElement = null;
            }
        }
    };

})();
