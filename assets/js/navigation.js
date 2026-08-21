// navigation.js — Gestion du menu latéral (sidebar)
// =====================================================
// Ce fichier remplace les onclick="" inline du HTML.
// Il ouvre et ferme la sidebar au clic, au clavier et en cliquant à l'extérieur.

// On attend que le DOM (la structure HTML) soit complètement chargé
// pour être sûr que les éléments existent avant de les manipuler
document.addEventListener('DOMContentLoaded', function () {

    // On récupère la barre latérale via son identifiant
    const sidebar = document.getElementById('main-sidebar');

    // On récupère le bouton hamburger (icône avec les trois barres)
    const toggleBtn = document.getElementById('menu-toggle-btn');

    // Si un des deux éléments est absent, on arrête le script
    if (!sidebar || !toggleBtn) {
        return;
    }

    // Fonction qui ouvre ou ferme la sidebar
    function toggleSidebar() {
        // On inverse la classe "sidebar-open" (ajoute si absente, retire si présente)
        sidebar.classList.toggle('sidebar-open');

        // On vérifie l'état après le basculement
        const isOpen = sidebar.classList.contains('sidebar-open');

        // On met à jour l'attribut ARIA pour indiquer l'état aux lecteurs d'écran
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    // Quand on clique sur le bouton hamburger, on ouvre/ferme le menu
    toggleBtn.addEventListener('click', toggleSidebar);

    // Quand l'utilisateur utilise le clavier sur le bouton
    toggleBtn.addEventListener('keydown', function (event) {
        // Si la touche pressée est Espace ou Entrée
        if (event.key === ' ' || event.key === 'Enter') {
            // On empêche le défilement par défaut de la page
            event.preventDefault();
            // On appelle la fonction d'ouverture/fermeture
            toggleSidebar();
        }
    });

    // Quand on appuie sur Échap, on ferme la sidebar si elle est ouverte
    document.addEventListener('keydown', function (event) {
        // On vérifie que la touche est Échap et que le menu est ouvert
        if (event.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
            // On retire la classe qui affiche la sidebar
            sidebar.classList.remove('sidebar-open');
            // On met à jour l'attribut ARIA
            toggleBtn.setAttribute('aria-expanded', 'false');
            // On remet le focus sur le bouton pour ne pas le perdre
            toggleBtn.focus();
        }
    });

    // Quand on clique n'importe où dans le document
    document.addEventListener('click', function (event) {
        // Si la sidebar est ouverte
        if (sidebar.classList.contains('sidebar-open')) {
            // On vérifie que le clic ne provient pas de la sidebar ni du bouton
            const clickInsideSidebar = sidebar.contains(event.target);
            const clickOnButton = toggleBtn.contains(event.target);

            // Si on clique en dehors, on ferme le menu
            if (!clickInsideSidebar && !clickOnButton) {
                sidebar.classList.remove('sidebar-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});
