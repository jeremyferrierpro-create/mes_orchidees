export function trapFocus(modal, event) {
    const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    let focusableElements = modal.querySelectorAll(focusableElementsString);
    
    focusableElements = Array.from(focusableElements).filter(el => {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
    });

    if (focusableElements.length === 0) return;

    const firstTabStop = focusableElements[0];
    const lastTabStop = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
        if (document.activeElement === firstTabStop) {
            event.preventDefault();
            lastTabStop.focus();
        }
    } else {
        if (document.activeElement === lastTabStop) {
            event.preventDefault();
            firstTabStop.focus();
        }
    }
}
