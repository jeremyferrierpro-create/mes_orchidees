// J'importe les clés et outils pour ranger dans le navigateur
import { STORAGE_KEYS, readJson, writeJson } from '../core/storage.js';

// Chaque plante dans la collection a un collectionId (unique pour l'exemplaire)
// C'est différent de orchidId (l'espèce) car on peut avoir 2 fois la même espèce

// Elle lit la collection et garantit de toujours rendre un tableau (même vide)
export function getCollection() {
    const collection = readJson(STORAGE_KEYS.userCollection, []); // je lis le tiroir, ou [] si vide
    return Array.isArray(collection) ? collection : []; // si c'est bien un tableau je le rends, sinon []
}

// Elle enregistre toute la collection d'un coup
export function saveCollection(collection) {
    // Sécurité : si ce n'est pas un tableau, j'arrête
    if (!Array.isArray(collection)) {
        console.warn('La collection doit être un tableau.'); // j'avertis dans la console
        return false;
    }

    return writeJson(STORAGE_KEYS.userCollection, collection); // je range
}

// Elle ajoute une orchidée à la collection
export function addOrchid(orchid) {
    const collection = getCollection(); // je récupère
    collection.push(orchid); // j'ajoute à la fin
    return saveCollection(collection); // je re-range
}

// Elle met à jour une orchidée grâce à son collectionId
export function updateOrchid(collectionId, updatedData) {
    const collection = getCollection(); // je récupère
    const index = collection.findIndex((item) => item.collectionId === collectionId); // je cherche sa place

    if (index === -1) { // si pas trouvé
        return false;
    }

    // Je garde l'ancien + j'écrase avec les nouvelles données (ex: nouvel emplacement)
    collection[index] = { ...collection[index], ...updatedData };
    return saveCollection(collection); // je re-range
}

// Elle supprime une orchidée grâce à son collectionId
export function deleteOrchid(collectionId) {
    const collection = getCollection(); // je récupère
    // Je garde tout sauf celle qui a ce collectionId
    const newCollection = collection.filter((item) => item.collectionId !== collectionId);

    if (newCollection.length === collection.length) { // si rien n'a été supprimé
        return false;
    }

    return saveCollection(newCollection); // je range la nouvelle liste
}

// Elle rend l'historique des soins d'une plante
export function getCareHistory(collectionId) {
    const orchid = getCollection().find((item) => item.collectionId === collectionId); // je cherche la plante
    // Si elle existe et a un careHistory qui est un tableau, je le rends, sinon []
    return orchid && Array.isArray(orchid.careHistory) ? orchid.careHistory : [];
}

// Elle ajoute un soin puis trie par date (le plus récent en premier)
export function addCareEntry(collectionId, date, type, notes = '') {
    const collection = getCollection(); // je récupère
    const index = collection.findIndex((item) => item.collectionId === collectionId); // je cherche la plante

    if (index === -1) { // si pas trouvée
        return false;
    }

    // Je récupère son historique ou [] si pas encore
    const careHistory = Array.isArray(collection[index].careHistory)
        ? collection[index].careHistory
        : [];

    // J'ajoute le nouveau soin
    careHistory.push({
        id: `care-${Date.now()}`, // id unique avec l'heure
        date, // date du soin
        type, // type (arrosage...)
        notes // notes
    });

    // Je trie : le plus récent d'abord
    careHistory.sort((firstCare, secondCare) => {
        return new Date(secondCare.date) - new Date(firstCare.date);
    });

    collection[index].careHistory = careHistory; // je remets l'historique trié
    return saveCollection(collection); // je re-range
}
