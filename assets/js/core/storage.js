// Je centralise tous les noms de tiroirs (clés) du navigateur ici
// Comme ça, si je change un nom, je le change à un seul endroit
export const STORAGE_KEYS = Object.freeze({
    session: 'mo_user_session', // qui est connecté
    userCollection: 'mo_user_collection', // les orchidées que l'utilisateur possède
    users: 'mo_users_db', // la liste de tous les utilisateurs
    orchids: 'mo_orchids', // la liste de toutes les orchidées de l'encyclopédie
    conseils: 'mo_conseils', // la liste de tous les conseils
    notifications: 'mo_notifications', // les notifications admin
    pendingOrchid: 'pendingOrchidToAdd' // orchidée en attente d'ajout (quand on n'est pas connecté)
});

export function readJson(key, fallback = null) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error(`Invalid JSON in localStorage key: ${key}`, error);
        return fallback;
    }
}

export function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key) {
    localStorage.removeItem(key);
}

export function readString(key, fallback = null) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw;
}

export function writeString(key, value) {
    localStorage.setItem(key, value);
}
