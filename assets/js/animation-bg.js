// animation-bg.js — Animation des noms latins en arrière-plan
// ===============================================================
// Ce fichier affiche des noms d'orchidées en latin qui flottent en fond.

// Tableau contenant plusieurs noms d'orchidées en latin
const orchidNames = [
    'Phalaenopsis amabilis', 'Cattleya labiata', 'Dendrobium nobile',
    'Vanda coerulea', 'Oncidium flexuosum', 'Paphiopedilum insigne',
    'Odontoglossum crispum', 'Cymbidium eberhardtii', 'Laelia purpurata',
    'Miltonia spectabilis', 'Masdevallia coccinea', 'Lycaste deppei',
    'Stanhopea tigrina', 'Brassia verrucosa', 'Acacalis cyanea',
    'Acineta superba', 'Aerangis citrata', 'Angraecum sesquipedale',
    'Barkeria spectabilis', 'Bletilla striata', 'Coelogyne cristata',
    'Encyclia cochleata', 'Epidendrum radicans', 'Gongora galeata',
    'Zygopetalum maculatum', 'Maxillaria tenui-folia', 'Phragmipedium besseae',
    'Psychopsis papilio', 'Rhynchostylis gigantea', 'Sobralia macrantha',
    'Vanilla planifolia', 'Bulbophyllum fletcherianum', 'Catasetum pileatum',
    'Chysis laevis', 'Dracula simia', 'Eria coronaria', 'Ludisia discolor',
    'Renanthera coccinea', 'Sophronitis coccinea', 'Thunia alba'
];

// On récupère le conteneur HTML qui accueillera les mots animés
const container = document.getElementById('latin-bg-layer');

// On définit des zones de la page où les mots peuvent apparaître
const gridZones = [
    { xMin: 5,  xMax: 25, yMin: 5,  yMax: 25 },
    { xMin: 35, xMax: 55, yMin: 5,  yMax: 25 },
    { xMin: 65, xMax: 85, yMin: 5,  yMax: 25 },
    { xMin: 5,  xMax: 25, yMin: 35, yMax: 55 },
    { xMin: 35, xMax: 55, yMin: 35, yMax: 55 },
    { xMin: 65, xMax: 85, yMin: 35, yMax: 55 },
    { xMin: 5,  xMax: 25, yMin: 65, yMax: 85 },
    { xMin: 35, xMax: 55, yMin: 65, yMax: 85 },
    { xMin: 65, xMax: 85, yMin: 65, yMax: 85 }
];

// Index qui permet de parcourir les zones les unes après les autres
let zoneIndex = 0;

// Fonction qui crée un mot flottant
function createFloatingWord() {
    // Si le conteneur n'existe pas, on arrête la fonction
    if (!container) {
        return;
    }

    // On crée un élément <span> pour le mot
    const span = document.createElement('span');
    // On applique la classe CSS qui définit le style du mot
    span.classList.add('latin-word');

    // On choisit un nom au hasard dans le tableau
    const randomIndex = Math.floor(Math.random() * orchidNames.length);
    // On place le texte choisi dans le span
    span.textContent = orchidNames[randomIndex];

    // On sélectionne la zone actuelle
    const zone = gridZones[zoneIndex];
    // On passe à la zone suivante (modulo le nombre de zones)
    zoneIndex = (zoneIndex + 1) % gridZones.length;

    // On calcule une position X aléatoire à l'intérieur de la zone
    const randomX = Math.floor(Math.random() * (zone.xMax - zone.xMin)) + zone.xMin;
    // On calcule une position Y aléatoire à l'intérieur de la zone
    const randomY = Math.floor(Math.random() * (zone.yMax - zone.yMin)) + zone.yMin;

    // On positionne le span en pourcentage
    span.style.left = randomX + '%';
    span.style.top = randomY + '%';

    // On ajoute le span au conteneur
    container.appendChild(span);

    // On ajoute la classe qui rend le mot visible après un court délai
    setTimeout(function () {
        span.classList.add('word-visible');
    }, 50);

    // On programme la disparition du mot au bout de 6 secondes
    setTimeout(function () {
        // On enlève la classe visible pour démarrer le fondu de sortie
        span.classList.remove('word-visible');
        // Au bout de 2,5 secondes supplémentaires, on supprime l'élément du DOM
        setTimeout(function () {
            span.remove();
        }, 2500);
    }, 6000);
}

// Si le conteneur existe au chargement de la page
if (container) {
    // On crée un nouveau mot toutes les 1,5 secondes
    setInterval(createFloatingWord, 1500);
    // On crée le premier mot immédiatement
    createFloatingWord();
    // On crée deux mots supplémentaires avec des délais pour remplir le fond
    setTimeout(createFloatingWord, 500);
    setTimeout(createFloatingWord, 1000);
}
