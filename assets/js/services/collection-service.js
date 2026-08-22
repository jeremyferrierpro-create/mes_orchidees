// J'importe ma fausse BDD Supabase locale
import { db } from '../core/db.js';
// Pour filtrer par utilisateur connecté (comme le futur RLS)
import { getCurrentUser } from './auth-service.js';

// Chaque plante dans collections a un collectionId (exemplaire) différent de orchidId (espèce)

// Elle lit la collection : SELECT * FROM collections (filtrée par user si connecté)
export function getCollection() {
  // Je prends tout dans la table collections
  const res = db.from('collections').select().execute();
  if (res.error) {
    console.error('Erreur collections', res.error);
    return [];
  }
  let data = res.data;
  // Si je suis connecté, je ne rends que MES plantes (comme le futur RLS Supabase)
  const user = getCurrentUser();
  if (user && user.id) {
    // Je filtre où user_id === mon id (si la colonne existe)
    const filtered = data.filter(item => !item.user_id || String(item.user_id) === String(user.id));
    // Si au moins une a un user_id, je rends le filtré, sinon je rends tout (pour compatibilité avec anciennes données)
    if (data.some(item => item.user_id)) {
      return filtered;
    }
  }
  // Si pas de user_id dans les données, je rends tout
  return Array.isArray(data) ? data : [];
}

// Elle enregistre toute la collection d'un coup : je vide puis je réinsère tout (simple pour le MVP)
export function saveCollection(collection) {
  if (!Array.isArray(collection)) {
    console.warn('La collection doit être un tableau.');
    return false;
  }
  // Je vide la table collections
  const existing = db.from('collections').select().execute();
  // Je supprime tout ce qui existe
  for (const row of existing.data) {
    db.from('collections').delete().eq('collectionId', row.collectionId).execute();
  }
  // Je réinsère tout
  for (const item of collection) {
    db.from('collections').insert(item).execute();
  }
  return true;
}

// Elle ajoute une orchidée : INSERT INTO collections
export function addOrchid(orchid) {
  // J'ajoute le user_id si connecté (pour le futur RLS)
  const user = getCurrentUser();
  if (user && user.id && !orchid.user_id) {
    orchid.user_id = user.id;
  }
  const res = db.from('collections').insert(orchid).execute();
  return !res.error;
}

// Elle met à jour une orchidée : UPDATE collections SET ... WHERE collectionId = ...
export function updateOrchid(collectionId, updatedData) {
  const res = db.from('collections').update(updatedData).eq('collectionId', collectionId).execute();
  return !res.error && res.data && res.data.length > 0;
}

// Elle supprime une orchidée : DELETE FROM collections WHERE collectionId = ...
export function deleteOrchid(collectionId) {
  const before = db.from('collections').select().execute().data.length;
  db.from('collections').delete().eq('collectionId', collectionId).execute();
  const after = db.from('collections').select().execute().data.length;
  return after < before;
}

// Elle rend l'historique des soins d'une plante : SELECT * FROM soins WHERE collectionId = ...
export function getCareHistory(collectionId) {
  // Je cherche dans la table soins (si elle existe) ou dans collections.careHistory (ancien)
  const res = db.from('soins').select().eq('collectionId', collectionId).execute();
  if (!res.error && res.data && res.data.length > 0) {
    return res.data;
  }
  // Fallback : ancien système où careHistory est dans collections
  const orchid = db.from('collections').select().eq('collectionId', collectionId).single();
  if (!orchid.error && orchid.data && Array.isArray(orchid.data.careHistory)) {
    return orchid.data.careHistory;
  }
  return [];
}

// Elle ajoute un soin : INSERT INTO soins + trie par date
export function addCareEntry(collectionId, date, type, notes = '') {
  const newCare = {
    id: `care-${Date.now()}`,
    collectionId: collectionId,
    date,
    type,
    notes
  };
  // J'insère dans la table soins
  db.from('soins').insert(newCare).execute();
  // Je trie côté lecture, pas besoin de trier ici
  return true;
}
