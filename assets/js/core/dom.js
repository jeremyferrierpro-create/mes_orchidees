export function getElement(selector, root = document) {
    return root.querySelector(selector);
}

export function getAllElements(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

export function createElement(tagName, {
    className = '',
    text = '',
    html = '',
    attributes = {}
} = {}) {
    const element = document.createElement(tagName);

    if (className) element.className = className;
    if (text) element.textContent = text;
    if (html) element.innerHTML = html; // Exception pour icônes statiques

    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }

    return element;
}

export function replaceChildren(container, ...nodes) {
    if (container.replaceChildren) {
        container.replaceChildren(...nodes);
    } else {
        container.innerHTML = '';
        container.append(...nodes);
    }
}
