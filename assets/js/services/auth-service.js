// J'importe les clés centralisées et les outils de rangement du navigateur
import { STORAGE_KEYS, readJson, writeJson, remove } from '../core/storage.js';
// J'importe la fausse liste d'utilisateurs de départ (qui sera copiée dans le navigateur)
import { usersDatabase } from '../data/users-data.js';

// Elle dit si quelqu'un est connecté (vrai/faux)
export function isAuthenticated() {
    // Je regarde dans le tiroir "session" : s'il y a quelque chose, c'est connecté
    return readJson(STORAGE_KEYS.session) !== null;
}

// Elle dit qui est connecté (email, rôle...)
export function getCurrentUser() {
    // Je rends ce qu'il y a dans le tiroir session
    return readJson(STORAGE_KEYS.session);
}

// Elle connecte quelqu'un (appelé après inscription ou connexion réussie)
export function login(email, userObj) {
    // Je range dans le tiroir session : email + infos + heure de connexion
    writeJson(STORAGE_KEYS.session, {
        email: email, // l'adresse mail
        ...userObj, // le reste (ex: rôle)
        timestamp: Date.now() // l'heure actuelle
    });
}

// Elle déconnecte (appelé sur deconnexion.html)
export function logout() {
    // Je vide le tiroir session
    remove(STORAGE_KEYS.session);
}

// Elle récupère la liste de tous les utilisateurs (ou la crée si vide)
export function checkUsersDb() {
    // Si la base n'existe pas dans le navigateur, je l'initialise avec les données de départ
    let db = readJson(STORAGE_KEYS.users, null); // je cherche dans le tiroir users
    if (!db) { // si vide
        db = usersDatabase; // je prends la fausse base de data/users-data.js
        writeJson(STORAGE_KEYS.users, db); // je la range pour la prochaine fois
    }
    return db; // je rends la liste
}

// Elle enregistre un utilisateur (nouveau ou modifié)
export function saveUser(userObj) {
    let users = checkUsersDb(); // je récupère la liste
    const index = users.findIndex(u => u.email === userObj.email); // je cherche si cet email existe déjà
    if (index >= 0) { // si oui
        users[index] = userObj; // je remplace
    } else { // si non
        users.push(userObj); // j'ajoute
    }
    writeJson(STORAGE_KEYS.users, users); // je re-range
}

// Elle supprime un utilisateur par son email
export function deleteUser(email) {
    let users = checkUsersDb(); // je récupère
    users = users.filter(u => u.email !== email); // je garde tout sauf celui à supprimer
    writeJson(STORAGE_KEYS.users, users); // je re-range
}
