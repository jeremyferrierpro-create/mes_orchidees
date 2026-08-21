// J'importe l'outil qui cherche un élément
import { getElement } from '../core/dom.js';

// Elle fait marcher le menu hamburger (le bouton qui ouvre/ferme la barre de droite)
export function initNavigation() {
    const sidebar = getElement('#main-sidebar'); // je récupère la barre de menu de droite
    const toggleBtn = getElement('#menu-toggle-btn'); // je récupère le bouton hamburger

    // Si pas de menu ou pas de bouton (page sans menu), j'arrête
    if (!sidebar || !toggleBtn) {
        return;
    }

    // Elle ouvre/ferme la barre
    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-open'); // j'ajoute ou j'enlève la classe qui l'affiche
        const isOpen = sidebar.classList.contains('sidebar-open'); // je regarde si elle est ouverte
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false'); // je dis aux lecteurs d'écran si ouvert
        sidebar.setAttribute('aria-hidden', isOpen ? 'false' : 'true'); // je dis si cachée
    }

    // Quand on clique sur le hamburger, j'ouvre/ferme
    toggleBtn.addEventListener('click', toggleSidebar);

    // Si on appuie sur Espace ou Entrée sur le bouton, pareil
    toggleBtn.addEventListener('keydown', function (event) {
        if (event.key === ' ' || event.key === 'Enter') { // espace ou entrée
            event.preventDefault(); // j'empêche le scroll
            toggleSidebar(); // j'ouvre/ferme
        }
    });

    // Si on appuie sur Échap et que le menu est ouvert, je le ferme
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && sidebar.classList.contains('sidebar-open')) { // échap + ouvert
            sidebar.classList.remove('sidebar-open'); // je ferme
            toggleBtn.setAttribute('aria-expanded', 'false'); // je dis fermé
            sidebar.setAttribute('aria-hidden', 'true'); // je dis caché
            toggleBtn.focus(); // je remets le focus sur le bouton
        }
    });

    // Si on clique en dehors du menu, je le ferme
    document.addEventListener('click', function (event) {
        if (sidebar.classList.contains('sidebar-open')) { // si ouvert
            const clickInsideSidebar = sidebar.contains(event.target); // est-ce qu'on a cliqué dedans ?
            const clickOnButton = toggleBtn.contains(event.target); // ou sur le bouton ?

            if (!clickInsideSidebar && !clickOnButton) { // si dehors des deux
                sidebar.classList.remove('sidebar-open'); // je ferme
                toggleBtn.setAttribute('aria-expanded', 'false');
                sidebar.setAttribute('aria-hidden', 'true');
            }
        }
    });
}
