import { STORAGE_KEYS, readJson, writeJson, remove } from '../core/storage.js';
import { usersDatabase } from '../data/users-data.js';

export function isAuthenticated() {
    return readJson(STORAGE_KEYS.session) !== null;
}

export function getCurrentUser() {
    return readJson(STORAGE_KEYS.session);
}

export function login(email, userObj) {
    writeJson(STORAGE_KEYS.session, {
        email: email,
        ...userObj,
        timestamp: Date.now()
    });
}

export function logout() {
    remove(STORAGE_KEYS.session);
}

export function checkUsersDb() {
    // Si la base n'existe pas dans le localStorage, on l'initialise avec les données mockées
    let db = readJson(STORAGE_KEYS.users, null);
    if (!db) {
        db = usersDatabase;
        writeJson(STORAGE_KEYS.users, db);
    }
    return db;
}

export function saveUser(userObj) {
    let users = checkUsersDb();
    const index = users.findIndex(u => u.email === userObj.email);
    if (index >= 0) {
        users[index] = userObj;
    } else {
        users.push(userObj);
    }
    writeJson(STORAGE_KEYS.users, users);
}

export function deleteUser(email) {
    let users = checkUsersDb();
    users = users.filter(u => u.email !== email);
    writeJson(STORAGE_KEYS.users, users);
}
