import { getElement } from '../core/dom.js';

export function initNavigation() {
    const sidebar = getElement('#main-sidebar');
    const toggleBtn = getElement('#menu-toggle-btn');

    if (!sidebar || !toggleBtn) {
        return;
    }

    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-open');
        const isOpen = sidebar.classList.contains('sidebar-open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        sidebar.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }

    toggleBtn.addEventListener('click', toggleSidebar);

    toggleBtn.addEventListener('keydown', function (event) {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            toggleSidebar();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
            sidebar.classList.remove('sidebar-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
            toggleBtn.focus();
        }
    });

    document.addEventListener('click', function (event) {
        if (sidebar.classList.contains('sidebar-open')) {
            const clickInsideSidebar = sidebar.contains(event.target);
            const clickOnButton = toggleBtn.contains(event.target);

            if (!clickInsideSidebar && !clickOnButton) {
                sidebar.classList.remove('sidebar-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                sidebar.setAttribute('aria-hidden', 'true');
            }
        }
    });
}
