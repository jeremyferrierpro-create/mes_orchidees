// ===========================================================================
// FICHIER : services/collection-service.js — Logique de la collection perso
// ===========================================================================
// J'ai dédié ce service à la collection personnelle de l'utilisateur. Pourquoi
// un service séparé ? Parce que la collection a des règles métier spécifiques
// (filtrage par utilisateur, distinction collectionId/orchidId) que je ne veux
// pas mélanger avec le catalogue général des orchidées.

// J'importe ma fausse BDD pour interroger la table "collections" comme avec Supabase.
import { db } from '../core/db.js';
// J'importe aussi le service d'authentification pour filtrer par utilisateur.
// C'est une préfiguration du futur RLS (Row Level Security) de Supabase.

// Chaque plante dans "collections" possède un collectionId unique (l'exemplaire
// physique de l'utilisateur) distinct de l'orchidId (l'espèce botanique). Pourquoi ?
// Parce qu'un utilisateur peut posséder deux fois la même espèce à des endroits
// différents : il faut les distinguer.

// Je lis la collection. En SQL, ce serait "SELECT * FROM collections" filtré par
// l'utilisateur connecté, comme le fera le RLS côté Supabase.
export function getCollection() {
  const res = db.from('collections').select().execute();
  if (res.error) {
    console.error('Erreur collections', res.error);
    return [];
  }
  let data = res.data;
  // Si un utilisateur est connecté, je ne lui rends que SES plantes.
  // Pourquoi ce filtre ? Pour préparer le RLS : demain, Supabase ne renverra que
  // les lignes où user_id = auth.uid(). En attendant, je le simule en JS.
  const user = getCurrentUser();
  if (user && user.id) {
    const filtered = data.filter(item => !item.user_id || String(item.user_id) === String(user.id));
    // Je vérifie si au moins une ligne possède un user_id : si oui, j'applique
    // le filtre, sinon je reste compatible avec les anciennes données sans user_id.
    if (data.some(item => item.user_id)) {
      return filtered;
    }
  }
  return Array.isArray(data) ? data : [];
}

// J'enregistre toute la collection d'un coup : je vide puis je réinsère.
// Pourquoi cette stratégie simple pour le MVP ? Parce qu'elle m'évite de gérer
// finement les diffs et reste très lisible, quitte à être un peu moins performante.
export function saveCollection(collection) {
  if (!Array.isArray(collection)) {
    console.warn('La collection doit être un tableau.');
    return false;
  }
  // Je supprime toutes les lignes existantes une par une via leur collectionId.
  const existing = db.from('collections').select().execute();
  for (const row of existing.data) {
    db.from('collections').delete().eq('collectionId', row.collectionId).execute();
  }
  // Je réinsère l'intégralité du nouveau tableau.
  for (const item of collection) {
    db.from('collections').insert(item).execute();
  }
  return true;
}

// J'ajoute une seule orchidée à la collection. J'y attache le user_id si
// l'utilisateur est connecté, pour préfigurer le RLS.
export function addOrchid(orchid) {
  const user = getCurrentUser();
  if (user && user.id && !orchid.user_id) {
    orchid.user_id = user.id;
  }
  const res = db.from('collections').insert(orchid).execute();
  return !res.error;
}

// Je mets à jour une plante précise via son collectionId, comme un
// "UPDATE collections SET ... WHERE collectionId = ...".
export function updateOrchid(collectionId, updatedData) {
  const res = db.from('collections').update(updatedData).eq('collectionId', collectionId).execute();
  return !res.error && res.data && res.data.length > 0;
}

// Je supprime une plante via son collectionId. Je vérifie que le nombre de
// lignes a bien diminué pour confirmer la suppression.
export function deleteOrchid(collectionId) {
  const before = db.from('collections').select().execute().data.length;
  db.from('collections').delete().eq('collectionId', collectionId).execute();
  const after = db.from('collections').select().execute().data.length;
  return after < before;
}

// Je récupère l'historique des soins d'une plante. J'interroge d'abord la table
// dédiée "soins", puis je retombe sur l'ancien système où careHistory était
// imbriqué dans collections, pour assurer la compatibilité ascendante.
export function getCareHistory(collectionId) {
  const res = db.from('soins').select().eq('collectionId', collectionId).execute();
  if (!res.error && res.data && res.data.length > 0) {
    return res.data;
  }
  const orchid = db.from('collections').select().eq('collectionId', collectionId).single();
  if (!orchid.error && orchid.data && Array.isArray(orchid.data.careHistory)) {
    return orchid.data.careHistory;
  }
  return [];
}

// J'ajoute une entrée de soin dans la table "soins". Pourquoi une table séparée ?
// Pour normaliser les données comme en SQL : une collection a plusieurs soins
// (relation 1-N), ce qui sera une vraie table PostgreSQL demain.
export function addCareEntry(collectionId, date, type, notes = '') {
  const newCare = {
    id: `care-${Date.now()}`,
    collectionId: collectionId,
    date,
    type,
    notes
  };
  db.from('soins').insert(newCare).execute();
  return true;
}
