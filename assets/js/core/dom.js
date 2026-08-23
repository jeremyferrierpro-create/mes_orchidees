// ===========================================================================
// FICHIER : core/dom.js — Ma boîte à outils DOM sécurisée
// ===========================================================================
// J'ai créé ce petit module utilitaire pour simplifier et sécuriser toutes mes
// manipulations du DOM (Document Object Model). Pourquoi des wrappers ?
// Parce qu'écrire document.querySelector partout est répétitif et source
// d'erreurs. En centralisant ici, je garantis une écriture propre et je
// pourrai faire évoluer la logique à un seul endroit.

// Je cherche UN seul élément dans la page, comme document.querySelector.
// Pourquoi un wrapper ? Pour pouvoir préciser un "root" (contexte de recherche)
// et pour uniformiser mon code : partout j'utilise getElement().
export function getElement(selector, root = document) {
    return root.querySelector(selector);
}

// Je cherche PLUSIEURS éléments et je les renvoie sous forme de vrai tableau JS.
// Pourquoi Array.from() ? Parce que querySelectorAll renvoie une NodeList qui
// n'a pas les méthodes pratiques comme .filter() ou .map(). En la convertissant,
// je m'offre toute la puissance des tableaux modernes.
export function getAllElements(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

// Je crée un élément HTML de zéro en une seule ligne, sans concaténation de
// chaînes. Pourquoi cette fonction ? Pour éviter innerHTML et me protéger du XSS,
// tout en rendant mon code beaucoup plus lisible que des createElement + appendChild
// répétés.
export function createElement(tagName, {
    className = '',
    text = '',
    html = '',
    attributes = {}
} = {}) {
    const element = document.createElement(tagName);

    if (className) element.className = className;
    // J'utilise textContent pour le texte brut : c'est sécurisé contre le XSS,
    // car le navigateur n'interprétera jamais le contenu comme du HTML.
    if (text) element.textContent = text;
    // J'utilise innerHTML uniquement quand je dois insérer une icône déjà
    // validée par mes soins. C'est un cas d'usage maîtrisé et volontaire.
    if (html) element.innerHTML = html;

    // Je pose tous les attributs supplémentaires (src, alt, aria-*, data-*) en
    // bouclant sur l'objet attributes. C'est plus propre qu'une longue liste de setAttribute.
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }

    return element;
}

// Je vide un conteneur et j'y injecte de nouveaux enfants, de manière propre.
// Pourquoi ne pas faire container.innerHTML = '' ? Parce que innerHTML casse
// potentiellement les écouteurs d'événements et peut être moins performant.
// J'utilise la méthode moderne replaceChildren si elle existe, sinon je
// fournis un fallback manuel pour la compatibilité avec les vieux navigateurs.
export function replaceChildren(container, ...nodes) {
    if (container.replaceChildren) {
        container.replaceChildren(...nodes);
    } else {
        container.innerHTML = '';
        container.append(...nodes);
    }
}
