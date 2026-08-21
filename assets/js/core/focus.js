// Ce fichier empêche que la touche Tab sorte de la petite fenêtre (modale)
// Quand une modale est ouverte, on doit rester piégé dedans pour les personnes qui naviguent au clavier

export function trapFocus(modal, event) {
    // Je liste tous les éléments où on peut cliquer/taper : liens, boutons, champs, etc.
    const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    let focusableElements = modal.querySelectorAll(focusableElementsString); // je les cherche dans la modale
    
    // Je ne garde que ceux qui sont vraiment visibles (pas cachés)
    focusableElements = Array.from(focusableElements).filter(el => {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
    });

    // Si rien n'est cliquable, j'arrête
    if (focusableElements.length === 0) return;

    // Je note le premier et le dernier élément cliquable
    const firstTabStop = focusableElements[0]; // le premier
    const lastTabStop = focusableElements[focusableElements.length - 1]; // le dernier

    // Si on fait Shift+Tab (reculer) et qu'on est sur le premier, je saute au dernier
    if (event.shiftKey) {
        if (document.activeElement === firstTabStop) {
            event.preventDefault(); // j'empêche de sortir
            lastTabStop.focus(); // je vais au dernier
        }
    } else {
        // Si on fait Tab (avancer) et qu'on est sur le dernier, je reviens au premier
        if (document.activeElement === lastTabStop) {
            event.preventDefault(); // j'empêche de sortir
            firstTabStop.focus(); // je reviens au premier
        }
    }
}
