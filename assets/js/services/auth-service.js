// J'importe la fausse BDD qui imite Supabase (elle parle localStorage aujourd'hui, fetch demain)
import { db } from '../core/db.js';
// Je garde les clés pour la session (qui n'est pas une table, c'est juste "qui est connecté ?")
import { STORAGE_KEYS, readJson, writeJson, remove } from '../core/storage.js';

// Elle dit si quelqu'un est connecté (vrai/faux) - je regarde le tiroir session
export function isAuthenticated() {
  // Je regarde dans le tiroir session : s'il y a quelque chose, c'est connecté
  return readJson(STORAGE_KEYS.session) !== null;
}

// Elle dit qui est connecté (email, rôle...)
export function getCurrentUser() {
  // Je rends ce qu'il y a dans le tiroir session
  return readJson(STORAGE_KEYS.session);
}

// Elle connecte quelqu'un (après inscription ou connexion réussie)
export function login(email, userObj) {
  // Je range dans le tiroir session : email + infos + heure
  writeJson(STORAGE_KEYS.session, {
    email: email, // l'adresse
    ...userObj, // le reste (rôle, id...)
    timestamp: Date.now() // heure actuelle
  });
}

// Elle déconnecte
export function logout() {
  // Je vide le tiroir session
  remove(STORAGE_KEYS.session);
}

// Elle récupère la liste de tous les utilisateurs (depuis la table users via db)
export function checkUsersDb() {
  // Je fais comme Supabase : SELECT * FROM users
  const res = db.from('users').select().execute();
  // res.data est le tableau, res.error est l'erreur si ça rate
  if (res.error) {
    console.error('Erreur lecture users', res.error);
    return [];
  }
  return res.data;
}

// Elle enregistre un utilisateur (nouveau ou modifié) via db
export function saveUser(userObj) {
  // Je cherche d'abord si cet email existe déjà
  const existing = db.from('users').select().eq('email', userObj.email).execute();
  if (existing.data && existing.data.length > 0) {
    // Il existe : je fais UPDATE users SET ... WHERE email = ...
    db.from('users').update(userObj).eq('email', userObj.email).execute();
  } else {
    // Il n'existe pas : je fais INSERT INTO users
    db.from('users').insert(userObj).execute();
  }
}

// Elle supprime un utilisateur par son email via db
export function deleteUser(email) {
  // Je fais DELETE FROM users WHERE email = ...
  db.from('users').delete().eq('email', email).execute();
}
