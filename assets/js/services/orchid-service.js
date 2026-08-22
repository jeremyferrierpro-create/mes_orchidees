// J'importe ma fausse BDD Supabase locale
import { db } from '../core/db.js';

// Je veux toutes les orchidées : SELECT * FROM orchids
export function getAllOrchids() {
  // Je demande à la table orchids : donne-moi tout
  const res = db.from('orchids').select().execute();
  // Si erreur, je rends un tableau vide
  if (res.error) {
    console.error('Erreur orchids', res.error);
    return [];
  }
  return res.data; // c'est le tableau des 21 orchidées
}

// Je veux une orchidée par son id : SELECT * FROM orchids WHERE id = 'acacalis_cyanea'
export function getOrchidById(id) {
  // Je filtre sur id
  const res = db.from('orchids').select().eq('id', id).single();
  // single() me rend soit l'objet, soit une erreur si pas trouvé
  if (res.error) return null;
  return res.data;
}

// J'enregistre une orchidée (INSERT ou UPDATE)
export function saveOrchid(orchid) {
  // Je regarde si elle existe déjà
  const existing = db.from('orchids').select().eq('id', orchid.id).execute();
  if (existing.data && existing.data.length > 0) {
    // Elle existe : UPDATE
    db.from('orchids').update(orchid).eq('id', orchid.id).execute();
  } else {
    // Elle n'existe pas : INSERT (je donne un id si besoin)
    if (!orchid.id) orchid.id = 'orchid-' + Date.now();
    db.from('orchids').insert(orchid).execute();
  }
}

// Je supprime une orchidée : DELETE FROM orchids WHERE id = ...
export function deleteOrchid(id) {
  db.from('orchids').delete().eq('id', id).execute();
}

// Je cherche avec un mot-clé : je fais SELECT * puis je filtre en JS (comme un LIKE en SQL)
export function searchOrchids(query) {
  // Je prends tout d'abord
  const all = getAllOrchids();
  if (!query) return all; // si pas de mot, je rends tout
  const q = query.toLowerCase(); // je mets en minuscule
  // Je garde celles où le nom, vernaculaire ou description contient le mot
  return all.filter(o =>
    o.name.toLowerCase().includes(q) ||
    o.vernacular.toLowerCase().includes(q) ||
    o.shortDesc.toLowerCase().includes(q)
  );
}
