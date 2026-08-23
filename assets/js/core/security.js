// ===========================================================================
// FICHIER : core/security.js — Protection contre la faille XSS
// ===========================================================================
// J'ai créé cette petite librairie de sécurité pour me prémunir contre la faille
// XSS (Cross-Site Scripting). Pourquoi c'est crucial ? Parce que si j'injecte
// du contenu utilisateur (ex: nom d'orchidée, commentaire) avec innerHTML sans
// l'échapper, un attaquant pourrait y glisser <script>alert('hack')</script> et
// exécuter du code malveillant dans le navigateur de mes visiteurs.

// J'échappe les 5 caractères HTML critiques. Pourquoi ces 5 précisément ?
// Parce que ce sont eux qui permettent de "casser" la structure HTML :
// & < > " ' . En les remplaçant par leurs entités (&amp;, &lt;...), je
// m'assure que le navigateur les affichera comme du texte inerte.
export function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    // J'utilise une RegExp globale pour remplacer d'un seul coup toutes les
    // occurrences. C'est plus performant que 5 replace() successifs.
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}
