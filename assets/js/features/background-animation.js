import { getElement, createElement } from '../core/dom.js';

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

let zoneIndex = 0;
let animationInterval = null;

export function initBackgroundAnimation() {
    const container = getElement('#latin-bg-layer');
    if (!container) return;

    function createFloatingWord() {
        if (!document.body.contains(container)) {
            clearInterval(animationInterval);
            return;
        }

        const randomIndex = Math.floor(Math.random() * orchidNames.length);
        const zone = gridZones[zoneIndex];
        zoneIndex = (zoneIndex + 1) % gridZones.length;

        const randomX = Math.floor(Math.random() * (zone.xMax - zone.xMin)) + zone.xMin;
        const randomY = Math.floor(Math.random() * (zone.yMax - zone.yMin)) + zone.yMin;

        const span = createElement('span', {
            className: 'latin-word',
            text: orchidNames[randomIndex]
        });

        span.style.left = randomX + '%';
        span.style.top = randomY + '%';

        container.appendChild(span);

        setTimeout(() => {
            span.classList.add('word-visible');
        }, 50);

        setTimeout(() => {
            span.classList.remove('word-visible');
            setTimeout(() => {
                if (span.parentNode) {
                    span.parentNode.removeChild(span);
                }
            }, 2500);
        }, 6000);
    }

    animationInterval = setInterval(createFloatingWord, 1500);
    createFloatingWord();
    setTimeout(createFloatingWord, 500);
    setTimeout(createFloatingWord, 1000);
}
