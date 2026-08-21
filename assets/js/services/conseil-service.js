// Je récupère la vraie base qui est dans conseils-data.js (c'est notre faux fichier de données)
import { conseilsDatabase as seedConseils } from '../data/conseils-data.js';
// J'importe les clés centralisées et les outils de stockage
import { STORAGE_KEYS, readJson, writeJson } from '../core/storage.js';

// Je récupère toutes les fiches (si elles sont déjà dans le navigateur, je les prends, sinon je prends la base de départ)
export function getAllConseils() {
    // Je regarde dans le tiroir mo_conseils du navigateur
    let conseils = readJson(STORAGE_KEYS.conseils, null);
    // Si rien n'est enregistré, je copie la base de départ
    if (!conseils) {
        conseils = seedConseils;
        writeJson(STORAGE_KEYS.conseils, conseils);
    }
    return conseils;
}

// Je cherche une fiche par son id (ex: "conseils-base")
export function getConseilById(id) {
    return getAllConseils().find(c => c.id === id);
}

// J'enregistre une fiche (nouvelle ou modifiée)
export function saveConseil(conseil) {
    let conseils = getAllConseils();
    const index = conseils.findIndex(c => c.id === conseil.id);
    if (index >= 0) {
        conseils[index] = conseil;
    } else {
        if (!conseil.id) conseil.id = Date.now();
        conseils.push(conseil);
    }
    writeJson(STORAGE_KEYS.conseils, conseils);
}

// Je supprime une fiche
export function deleteConseil(id) {
    let conseils = getAllConseils();
    conseils = conseils.filter(c => c.id !== id);
    writeJson(STORAGE_KEYS.conseils, conseils);
}

// Je cherche des fiches avec un mot-clé (je cherche dans le nom, le contenu ET la catégorie)
export function searchConseils(query) {
    const db = getAllConseils();
    if (!query) return db;
    // Je mets tout en minuscules pour que "Epiphyte" et "épiphyte" donnent le même résultat
    const q = query.toLowerCase();
    return db.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.content && c.content.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q))
    );
}
