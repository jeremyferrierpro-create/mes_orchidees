// Petite fonction qui protège contre les injections (quelqu'un qui taperait <script> dans un champ)
export function escapeHtml(text) {
    // Si ce n'est pas du texte, je rends tel quel
    if (typeof text !== 'string') return text;
    // Je prépare le dictionnaire de remplacement : chaque caractère dangereux → sa version sûre
    const map = {
        '&': '&amp;', // & devient &amp;
        '<': '&lt;', // < devient &lt;
        '>': '&gt;', // > devient &gt;
        '"': '&quot;', // " devient &quot;
        "'": '&#039;' // ' devient &#039;
    };
    // Je remplace chaque caractère dangereux dans le texte
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}
