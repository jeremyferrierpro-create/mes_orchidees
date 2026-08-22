// J'importe ma fausse BDD Supabase locale
import { db } from '../core/db.js';

// Je veux tous les conseils : SELECT * FROM conseils
export function getAllConseils() {
  // Je demande à la table conseils
  const res = db.from('conseils').select().execute();
  if (res.error) {
    console.error('Erreur conseils', res.error);
    return [];
  }
  return res.data; // 27 fiches (6 catégories + 21 espèces)
}

// Je veux un conseil par son id : SELECT * FROM conseils WHERE id = 'conseils-base'
export function getConseilById(id) {
  const res = db.from('conseils').select().eq('id', id).single();
  if (res.error) return null;
  return res.data;
}

// J'enregistre un conseil (INSERT ou UPDATE)
export function saveConseil(conseil) {
  const existing = db.from('conseils').select().eq('id', conseil.id).execute();
  if (existing.data && existing.data.length > 0) {
    // UPDATE
    db.from('conseils').update(conseil).eq('id', conseil.id).execute();
  } else {
    // INSERT
    if (!conseil.id) conseil.id = 'conseils-' + Date.now();
    db.from('conseils').insert(conseil).execute();
  }
}

// Je supprime un conseil : DELETE FROM conseils WHERE id = ...
export function deleteConseil(id) {
  db.from('conseils').delete().eq('id', id).execute();
}

// Je cherche avec un mot-clé : je filtre en JS comme un LIKE
export function searchConseils(query) {
  const all = getAllConseils();
  if (!query) return all;
  const q = query.toLowerCase();
  // Je cherche dans le nom, le contenu et la catégorie
  return all.filter(c =>
    (c.name && c.name.toLowerCase().includes(q)) ||
    (c.content && c.content.toLowerCase().includes(q)) ||
    (c.category && c.category.toLowerCase().includes(q))
  );
}
