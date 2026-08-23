// ===========================================================================
// FICHIER : services/conseil-service.js — Logique métier des conseils
// ===========================================================================
// J'ai isolé la logique des conseils dans ce service pour les mêmes raisons
// que pour les orchidées : séparation des responsabilités et préparation à la
// migration Supabase. Mes composants visuels n'ont jamais à manipuler
// directement le localStorage.

// J'importe ma couche d'abstraction BDD pour parler comme avec Supabase.
import { db } from '../core/db.js';

// Je récupère l'intégralité des conseils, comme un "SELECT * FROM conseils".
// Pourquoi passer par db.from().select().execute() ? Pour garder une API
// identique à Supabase et faciliter la future bascule vers fetch().
export function getAllConseils() {
  const res = db.from('conseils').select().execute();
  if (res.error) {
    console.error('Erreur conseils', res.error);
    return [];
  }
  return res.data;
}

// Je récupère un seul conseil par son id, avec .single() pour recevoir un objet
// et non un tableau. C'est plus sémantique pour l'appelant qui attend une fiche unique.
export function getConseilById(id) {
  const res = db.from('conseils').select().eq('id', id).single();
  if (res.error) return null;
  return res.data;
}

// J'enregistre un conseil : je choisis entre INSERT et UPDATE selon l'existence.
// Pourquoi ce test préalable ? Pour imiter le comportement "upsert" de Supabase
// tout en restant explicite et pédagogique.
export function saveConseil(conseil) {
  const existing = db.from('conseils').select().eq('id', conseil.id).execute();
  if (existing.data && existing.data.length > 0) {
    db.from('conseils').update(conseil).eq('id', conseil.id).execute();
  } else {
    if (!conseil.id) conseil.id = 'conseils-' + Date.now();
    db.from('conseils').insert(conseil).execute();
  }
}

// Je supprime un conseil par son id, comme un "DELETE FROM conseils WHERE id = ...".
export function deleteConseil(id) {
  db.from('conseils').delete().eq('id', id).execute();
}

// Je cherche des conseils avec un mot-clé en simulant un LIKE SQL côté client.
// Pourquoi trois champs ? Pour maximiser la pertinence : nom, contenu et catégorie
// sont les trois axes où l'utilisateur est susceptible de taper.
export function searchConseils(query) {
  const all = getAllConseils();
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter(c =>
    (c.name && c.name.toLowerCase().includes(q)) ||
    (c.content && c.content.toLowerCase().includes(q)) ||
    (c.category && c.category.toLowerCase().includes(q))
  );
}
