// Petite boîte à outils pour manipuler le HTML plus facilement
// Au lieu d'écrire document.querySelector partout, j'utilise ces 4 fonctions

// Je cherche UN élément dans la page (ex: "#mon-bouton")
export function getElement(selector, root = document) {
    // selector = le nom CSS ("#id" ou ".classe"), root = où chercher (par défaut toute la page)
    return root.querySelector(selector); // je le cherche et je le rends
}

// Je cherche PLUSIEURS éléments (ex: tous les ".carte")
export function getAllElements(selector, root = document) {
    // Je les cherche tous puis je les transforme en vrai tableau
    return Array.from(root.querySelectorAll(selector));
}

// Je crée un nouvel élément HTML de zéro
export function createElement(tagName, {
    className = '', // classe CSS si on veut
    text = '', // texte dedans si on veut
    html = '', // code HTML dedans (seulement pour icônes)
    attributes = {} // autres attributs comme src, alt, etc.
} = {}) {
    const element = document.createElement(tagName); // je crée la balise (ex: "div")

    if (className) element.className = className; // je mets la classe si donnée
    if (text) element.textContent = text; // je mets le texte si donné
    if (html) element.innerHTML = html; // je mets le HTML si donné (pour icônes)

    // Pour chaque attribut dans la liste, je l'ajoute (ex: src="image.jpg")
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }

    return element; // je rends l'élément créé
}

// Je vide un conteneur et je mets du nouveau contenu (plus propre que innerHTML = "")
export function replaceChildren(container, ...nodes) {
    // Si le navigateur sait faire replaceChildren (moderne), je l'utilise
    if (container.replaceChildren) {
        container.replaceChildren(...nodes);
    } else {
        // Sinon (vieux navigateur), je vide à la main puis j'ajoute
        container.innerHTML = '';
        container.append(...nodes);
    }
}
