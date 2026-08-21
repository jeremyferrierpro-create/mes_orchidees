import { orchidsDatabase as seedOrchids } from '../data/orchids-data.js';

export function getAllOrchids() {
    let orchids = JSON.parse(localStorage.getItem('mo_orchids'));
    if (!orchids) {
        orchids = seedOrchids;
        localStorage.setItem('mo_orchids', JSON.stringify(orchids));
    }
    return orchids;
}

export function getOrchidById(id) {
    return getAllOrchids().find(o => o.id === id);
}

export function saveOrchid(orchid) {
    let orchids = getAllOrchids();
    const index = orchids.findIndex(o => o.id === orchid.id);
    if (index >= 0) {
        orchids[index] = orchid;
    } else {
        if (!orchid.id) orchid.id = Date.now();
        orchids.push(orchid);
    }
    localStorage.setItem('mo_orchids', JSON.stringify(orchids));
}

export function deleteOrchid(id) {
    let orchids = getAllOrchids();
    orchids = orchids.filter(o => o.id !== id);
    localStorage.setItem('mo_orchids', JSON.stringify(orchids));
}

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
