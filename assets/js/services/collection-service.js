import { STORAGE_KEYS, readJson, writeJson } from '../core/storage.js';

// =====================================================
// SERVICE DE LA COLLECTION
// =====================================================
// Chaque élément possède collectionId. Cet identifiant est différent de orchidId,
// car un utilisateur peut posséder plusieurs exemplaires de la même orchidée.

/**
 * Lit la collection locale et garantit de toujours retourner un tableau.
 */
export function getCollection() {
    const collection = readJson(STORAGE_KEYS.userCollection, []);
    return Array.isArray(collection) ? collection : [];
}

/**
 * Enregistre toute la collection.
 */
export function saveCollection(collection) {
    if (!Array.isArray(collection)) {
        console.warn('La collection doit être un tableau.');
        return false;
    }

    return writeJson(STORAGE_KEYS.userCollection, collection);
}

/**
 * Ajoute une orchidée à la collection.
 */
export function addOrchid(orchid) {
    const collection = getCollection();
    collection.push(orchid);
    return saveCollection(collection);
}

/**
 * Met à jour une orchidée de la collection grâce à collectionId.
 */
export function updateOrchid(collectionId, updatedData) {
    const collection = getCollection();
    const index = collection.findIndex((item) => item.collectionId === collectionId);

    if (index === -1) {
        return false;
    }

    collection[index] = { ...collection[index], ...updatedData };
    return saveCollection(collection);
}

/**
 * Supprime une orchidée de la collection grâce à collectionId.
 */
export function deleteOrchid(collectionId) {
    const collection = getCollection();
    const newCollection = collection.filter((item) => item.collectionId !== collectionId);

    if (newCollection.length === collection.length) {
        return false;
    }

    return saveCollection(newCollection);
}

/**
 * Retourne l'historique des soins d'une orchidée de la collection.
 */
export function getCareHistory(collectionId) {
    const orchid = getCollection().find((item) => item.collectionId === collectionId);
    return orchid && Array.isArray(orchid.careHistory) ? orchid.careHistory : [];
}

/**
 * Ajoute une ligne dans l'historique de soins puis la trie par date décroissante.
 */
export function addCareEntry(collectionId, date, type, notes = '') {
    const collection = getCollection();
    const index = collection.findIndex((item) => item.collectionId === collectionId);

    if (index === -1) {
        return false;
    }

    const careHistory = Array.isArray(collection[index].careHistory)
        ? collection[index].careHistory
        : [];

    careHistory.push({
        id: `care-${Date.now()}`,
        date,
        type,
        notes
    });

    careHistory.sort((firstCare, secondCare) => {
        return new Date(secondCare.date) - new Date(firstCare.date);
    });

    collection[index].careHistory = careHistory;
    return saveCollection(collection);
}
