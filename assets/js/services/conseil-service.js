// Je récupère la vraie base qui est dans conseils-data.js (c'est notre faux fichier de données)
import { conseilsDatabase as seedConseils } from '../data/conseils-data.js';

// Je récupère toutes les fiches (si elles sont déjà dans le navigateur, je les prends, sinon je prends la base de départ)
export function getAllConseils() {
    // Je regarde dans la mémoire du navigateur (localStorage)
    let conseils = JSON.parse(localStorage.getItem('mo_conseils'));
    // Si rien n'est enregistré, je copie la base de départ
    if (!conseils) {
        conseils = seedConseils;
        localStorage.setItem('mo_conseils', JSON.stringify(conseils));
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
    localStorage.setItem('mo_conseils', JSON.stringify(conseils));
}

// Je supprime une fiche
export function deleteConseil(id) {
    let conseils = getAllConseils();
    conseils = conseils.filter(c => c.id !== id);
    localStorage.setItem('mo_conseils', JSON.stringify(conseils));
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
