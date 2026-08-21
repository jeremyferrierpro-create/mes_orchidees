import { conseilsDatabase as seedConseils } from '../data/conseils-data.js';

export function getAllConseils() {
    let conseils = JSON.parse(localStorage.getItem('mo_conseils'));
    if (!conseils) {
        conseils = seedConseils;
        localStorage.setItem('mo_conseils', JSON.stringify(conseils));
    }
    return conseils;
}

export function getConseilById(id) {
    return getAllConseils().find(c => c.id === id);
}

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

export function deleteConseil(id) {
    let conseils = getAllConseils();
    conseils = conseils.filter(c => c.id !== id);
    localStorage.setItem('mo_conseils', JSON.stringify(conseils));
}

export function searchConseils(query) {
    const db = getAllConseils();
    if (!query) return db;
    const q = query.toLowerCase();
    return db.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.content && c.content.toLowerCase().includes(q))
    );
}
