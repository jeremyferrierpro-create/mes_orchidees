// J'importe l'outil pour créer un élément
import { getElement, createElement } from '../core/dom.js';

// Liste de noms latins qui vont flotter sur l'accueil (comme un fond d'écran qui bouge)
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

// Je découpe l'écran en 9 zones (3x3) pour que les mots ne se chevauchent pas
const gridZones = [
    { xMin: 5,  xMax: 25, yMin: 5,  yMax: 25 }, // en haut à gauche
    { xMin: 35, xMax: 55, yMin: 5,  yMax: 25 }, // en haut au milieu
    { xMin: 65, xMax: 85, yMin: 5,  yMax: 25 }, // en haut à droite
    { xMin: 5,  xMax: 25, yMin: 35, yMax: 55 }, // au centre à gauche
    { xMin: 35, xMax: 55, yMin: 35, yMax: 55 }, // au centre
    { xMin: 65, xMax: 85, yMin: 35, yMax: 55 }, // au centre à droite
    { xMin: 5,  xMax: 25, yMin: 65, yMax: 85 }, // en bas à gauche
    { xMin: 35, xMax: 55, yMin: 65, yMax: 85 }, // en bas au milieu
    { xMin: 65, xMax: 85, yMin: 65, yMax: 85 } // en bas à droite
];

let zoneIndex = 0; // je retiens dans quelle zone je dois mettre le prochain mot (tourne en boucle)
let animationInterval = null; // l'horloge qui lance un mot toutes les 1,5s

// Elle démarre l'animation (appelée depuis app.js)
export function initBackgroundAnimation() {
    const container = getElement('#latin-bg-layer'); // je cherche le calque où mettre les mots (dans index.html)
    if (!container) return; // si pas sur l'accueil (pas de calque), j'arrête

    // Elle crée UN mot qui flotte
    function createFloatingWord() {
        // Si le calque a disparu (on a changé de page), j'arrête l'horloge
        if (!document.body.contains(container)) {
            clearInterval(animationInterval);
            return;
        }

        const randomIndex = Math.floor(Math.random() * orchidNames.length); // je tire un nom au hasard
        const zone = gridZones[zoneIndex]; // je prends la zone suivante
        zoneIndex = (zoneIndex + 1) % gridZones.length; // je passe à la zone d'après (revient à 0 après 8)

        // Je tire une position au hasard DANS la zone
        const randomX = Math.floor(Math.random() * (zone.xMax - zone.xMin)) + zone.xMin;
        const randomY = Math.floor(Math.random() * (zone.yMax - zone.yMin)) + zone.yMin;

        // Je crée le mot
        const span = createElement('span', {
            className: 'latin-word', // classe pour le style (italique, transparent...)
            text: orchidNames[randomIndex] // le nom tiré
        });

        span.style.left = randomX + '%'; // je le place en X
        span.style.top = randomY + '%'; // je le place en Y

        container.appendChild(span); // je l'ajoute au calque

        // Après 50ms, je lance l'animation d'apparition
        setTimeout(() => {
            span.classList.add('word-visible');
        }, 50);

        // Après 6 secondes, je lance l'animation de disparition puis je supprime
        setTimeout(() => {
            span.classList.remove('word-visible');
            // Après 2,5s de disparition, je supprime du HTML
            setTimeout(() => {
                if (span.parentNode) {
                    span.parentNode.removeChild(span);
                }
            }, 2500);
        }, 6000);
    }

    animationInterval = setInterval(createFloatingWord, 1500); // toutes les 1,5s, je crée un mot
    createFloatingWord(); // j'en crée un tout de suite
    setTimeout(createFloatingWord, 500); // un 2e après 0,5s
    setTimeout(createFloatingWord, 1000); // un 3e après 1s
}
