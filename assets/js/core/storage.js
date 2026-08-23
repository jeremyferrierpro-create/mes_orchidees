// ===========================================================================
// FICHIER : core/storage.js — Persistance locale centralisée et sécurisée
// ===========================================================================
// J'ai centralisé ici toute la gestion du localStorage. Pourquoi ?
// Pour éviter d'éparpiller des chaînes comme "mo_user_session" dans tout le code.
// Si je dois renommer une clé demain, je ne la change qu'ici, et tout le projet
// suit. C'est un principe de maintenabilité et de robustesse.

// Je déclare un objet unique STORAGE_KEYS qui liste toutes mes clés de stockage.
// Je le fige avec Object.freeze() : ainsi, aucun module ne pourra accidentellement
// le modifier à l'exécution (ex: STORAGE_KEYS.session = "autre"). C'est une
// protection contre les erreurs d'écriture et cela garantit la cohérence des
// données persistées.
export const STORAGE_KEYS = Object.freeze({
    session: 'mo_user_session',
    userCollection: 'mo_user_collection',
    users: 'mo_users_db',
    orchids: 'mo_orchids',
    conseils: 'mo_conseils',
    notifications: 'mo_notifications',
    pendingOrchid: 'pendingOrchidToAdd'
});

// Je lis une valeur JSON depuis le localStorage. Pourquoi une fonction dédiée ?
// Parce que localStorage ne stocke que des chaînes. Je dois donc parser le JSON
// et gérer le cas où la donnée est corrompue. J'encadre avec try/catch pour que
// mon application ne plante jamais à cause d'un JSON invalide.
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

// J'écris une valeur JS (objet, tableau) dans le localStorage en la sérialisant.
// Pourquoi JSON.stringify ? Parce que localStorage.setItem n'accepte que des strings.
export function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Je supprime une clé du localStorage. Pourquoi une fonction ? Pour uniformiser
// l'API et éviter d'avoir à importer directement localStorage dans chaque module.
export function remove(key) {
    localStorage.removeItem(key);
}

// Je lis une simple chaîne (non JSON) avec une valeur de repli si absente.
export function readString(key, fallback = null) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw;
}

// J'écris une simple chaîne. Utile pour des flags ou des IDs temporaires.
export function writeString(key, value) {
    localStorage.setItem(key, value);
}
