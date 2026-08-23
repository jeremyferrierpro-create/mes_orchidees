// ===========================================================================
// FICHIER : services/auth-service.js — Authentification et session
// ===========================================================================
// J'ai isolé toute la logique d'authentification dans ce service pour ne pas
// polluer mes composants visuels. Pourquoi ? Pour que mes pages n'aient qu'à
// appeler isAuthenticated() ou getCurrentUser() sans savoir OÙ la session est
// stockée. C'est encore une application du principe de séparation.

// J'importe ma couche d'abstraction BDD : elle me permettra de passer de
// localStorage à Supabase Auth sans toucher aux composants. Aujourd'hui elle
// parle localStorage, demain elle fera fetch() vers Supabase.
import { db } from '../core/db.js';
// J'importe mes clés centralisées et mes helpers de storage pour la session.
// Pourquoi séparer session et table users ? Parce que la session n'est pas
// une table SQL : c'est juste "qui est connecté maintenant", stocké côté client.
import { STORAGE_KEYS, readJson, writeJson, remove } from '../core/storage.js';

// Je vérifie si un utilisateur est connecté en regardant si une session existe.
// Pourquoi un simple test sur localStorage ? Parce qu'en MVP je n'ai pas de
// token JWT à valider : la présence d'un objet session suffit à prouver la connexion.
export function isAuthenticated() {
  return readJson(STORAGE_KEYS.session) !== null;
}

// Je renvoie l'utilisateur actuellement connecté (email, rôle, id, timestamp).
// Pourquoi une fonction dédiée ? Pour que mes pages puissent afficher
// "Bonjour Jeremy" sans avoir à manipuler directement le localStorage.
export function getCurrentUser() {
  return readJson(STORAGE_KEYS.session);
}

// Je connecte un utilisateur après une inscription ou une connexion réussie.
// Pourquoi j'enregistre email + rôle + id + timestamp ? Pour que le reste de
// l'application puisse vérifier les droits (ex: accès admin) sans refaire
// une requête BDD à chaque page.
export function login(email, userObj) {
  writeJson(STORAGE_KEYS.session, {
    email: email,
    ...userObj,
    timestamp: Date.now()
  });
}

// Je déconnecte l'utilisateur en supprimant simplement la clé de session.
// Pourquoi c'est suffisant ? Parce que toute mon application se base sur
// isAuthenticated() : sans session, elle considère l'utilisateur comme invité.
export function logout() {
  remove(STORAGE_KEYS.session);
}

// Je récupère la liste de tous les utilisateurs depuis la table "users" via db.
// En SQL, ce serait "SELECT * FROM users". C'est utile pour l'administration.
export function checkUsersDb() {
  const res = db.from('users').select().execute();
  if (res.error) {
    console.error('Erreur lecture users', res.error);
    return [];
  }
  return res.data;
}

// J'enregistre un utilisateur : je choisis entre INSERT et UPDATE selon que
// l'email existe déjà. Pourquoi ce test ? Pour gérer à la fois la création
// de compte et la modification de profil avec la même fonction.
export function saveUser(userObj) {
  const existing = db.from('users').select().eq('email', userObj.email).execute();
  if (existing.data && existing.data.length > 0) {
    db.from('users').update(userObj).eq('email', userObj.email).execute();
  } else {
    db.from('users').insert(userObj).execute();
  }
}

// Je supprime un utilisateur par son email, comme un "DELETE FROM users WHERE email = ...".
export function deleteUser(email) {
  db.from('users').delete().eq('email', email).execute();
}
