import { initPWA } from './pwa.js';

import { initNavigation } from './features/navigation.js';
import { initBackgroundAnimation } from './features/background-animation.js';
import { initSearch } from './features/search.js';
import { initAddButton } from './features/add-button.js';
import { initCollection } from './features/collection.js';
import { initAdministration } from './features/administration.js';
import { initConseils } from './features/conseils.js';
import { initAuthentication } from './features/authentication.js';

import { getCurrentPage } from './core/router.js';

const featureInitializers = {
    home: () => {},
    encyclopedia: () => {},
    collection: initCollection,
    administration: initAdministration,
    conseils: initConseils,
    authentication: initAuthentication
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core
    
    // 2. Shared Features
    initNavigation();
    initBackgroundAnimation();
    initSearch();
    initAddButton();
    
    // 3. Route-specific features
    const page = getCurrentPage();
    const initializer = featureInitializers[page];
    if (initializer) {
        initializer();
    }
    
    // 3. PWA
    initPWA();
});
