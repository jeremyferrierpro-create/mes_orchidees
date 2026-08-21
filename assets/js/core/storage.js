export const STORAGE_KEYS = Object.freeze({
    session: 'mo_user_session',
    userCollection: 'mo_user_collection',
    users: 'mo_users_db',
    notifications: 'mo_notifications',
    pendingOrchid: 'pendingOrchidToAdd'
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
