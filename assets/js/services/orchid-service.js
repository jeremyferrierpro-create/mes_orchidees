// J'importe la vraie base d'orchidées (c'est notre faux fichier qui remplace la future base Supabase)
import { orchidsDatabase as seedOrchids } from '../data/orchids-data.js';
// J'importe les clés centralisées et les outils pour lire/écrire dans le navigateur
import { STORAGE_KEYS, readJson, writeJson } from '../core/storage.js';

// Je récupère toutes les orchidées (depuis le navigateur si déjà enregistrées, sinon depuis la base de départ)
export function getAllOrchids() {
    // Je regarde dans le tiroir du navigateur qui s'appelle mo_orchids (défini dans STORAGE_KEYS)
    let orchids = readJson(STORAGE_KEYS.orchids, null);
    // Si le tiroir est vide, je copie la base de départ et je la range
    if (!orchids) {
        orchids = seedOrchids;
        writeJson(STORAGE_KEYS.orchids, orchids);
    }
    return orchids;
}

// Je cherche une orchidée par son id (ex: "acacalis_cyanea")
export function getOrchidById(id) {
    return getAllOrchids().find(o => o.id === id);
}

// J'enregistre une orchidée (nouvelle ou modifiée)
export function saveOrchid(orchid) {
    let orchids = getAllOrchids();
    const index = orchids.findIndex(o => o.id === orchid.id);
    if (index >= 0) {
        orchids[index] = orchid;
    } else {
        if (!orchid.id) orchid.id = Date.now();
        orchids.push(orchid);
    }
    writeJson(STORAGE_KEYS.orchids, orchids);
}

// Je supprime une orchidée
export function deleteOrchid(id) {
    let orchids = getAllOrchids();
    orchids = orchids.filter(o => o.id !== id);
    writeJson(STORAGE_KEYS.orchids, orchids);
}

// Je cherche avec un mot-clé (nom, nom courant, ou petite description)
export function searchOrchids(query) {
    const db = getAllOrchids();
    if (!query) return db;
    const q = query.toLowerCase();
    return db.filter(o => 
        o.name.toLowerCase().includes(q) || 
        o.vernacular.toLowerCase().includes(q) ||
        o.shortDesc.toLowerCase().includes(q)
    );
}
