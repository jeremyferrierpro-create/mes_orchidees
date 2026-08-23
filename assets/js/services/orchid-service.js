// ===========================================================================
// FICHIER : services/orchid-service.js — Logique métier des orchidées
// ===========================================================================
// J'ai isolé ici toute la logique métier liée aux orchidées. Pourquoi ?
// Pour respecter la séparation des responsabilités : mes composants visuels
// (features/collection.js, features/search.js) ne savent pas COMMENT les
// données sont stockées, ils appellent simplement getAllOrchids() ou
// searchOrchids(). Si demain je passe de localStorage à Supabase, je ne
// toucherai qu'à ce fichier service, pas à l'interface.

// J'importe ma couche d'abstraction BDD. Grâce à elle, je peux déjà écrire
// comme si je parlais à Supabase : db.from('orchids').select().
import { db } from '../core/db.js';

// Je récupère toutes les orchidées, comme un "SELECT * FROM orchids" en SQL.
// Pourquoi je passe par db.from().select().execute() ? Parce que c'est l'API
// que j'ai choisie pour préparer la migration vers Supabase : le jour où je
// remplacerai localStorage par fetch(), cette ligne deviendra asynchrone mais
// gardera la même signature pour mes composants.
export function getAllOrchids() {
  // J'interroge la table "orchids" sans filtre : je veux tout le catalogue.
  const res = db.from('orchids').select().execute();
  // Je gère le cas d'erreur proprement : je loggue et je renvoie un tableau vide
  // pour éviter que l'interface ne plante avec un "undefined is not iterable".
  if (res.error) {
    console.error('Erreur orchids', res.error);
    return [];
  }
  return res.data;
}

// Je récupère une seule orchidée par son identifiant, comme un
// "SELECT * FROM orchids WHERE id = 'acacalis_cyanea'".
export function getOrchidById(id) {
  // J'utilise .eq('id', id).single() : .eq() est mon WHERE, .single() me
  // garantit que je reçois un objet unique et non un tableau, exactement comme
  // le ferait Supabase. C'est plus sémantique pour l'appelant.
  const res = db.from('orchids').select().eq('id', id).single();
  // Si aucune ligne ne correspond, Supabase renvoie une erreur "No rows found".
  // Je la convertis en null pour que mon composant puisse faire un simple if (!orchid).
  if (res.error) return null;
  return res.data;
}

// J'enregistre une orchidée, que ce soit une création ou une modification.
// Pourquoi une seule fonction pour les deux ? Pour imiter le comportement
// "upsert" et simplifier l'appel côté interface : l'appelant n'a pas à savoir
// s'il fait un INSERT ou un UPDATE.
export function saveOrchid(orchid) {
  // Je vérifie d'abord si une ligne avec cet id existe déjà : c'est mon test
  // d'existence qui me permettra de choisir entre INSERT et UPDATE.
  const existing = db.from('orchids').select().eq('id', orchid.id).execute();
  if (existing.data && existing.data.length > 0) {
    // Elle existe déjà : je fais un UPDATE ciblé sur cet id, comme un
    // "UPDATE orchids SET ... WHERE id = ...".
    db.from('orchids').update(orchid).eq('id', orchid.id).execute();
  } else {
    // Elle n'existe pas : je fais un INSERT. Si aucun id n'a été fourni,
    // j'en génère un unique basé sur le timestamp pour garantir l'unicité.
    if (!orchid.id) orchid.id = 'orchid-' + Date.now();
    db.from('orchids').insert(orchid).execute();
  }
}

// Je supprime une orchidée par son id, comme un "DELETE FROM orchids WHERE id = ...".
// Pourquoi une fonction dédiée ? Pour que le composant visuel n'ait pas à manipuler
// directement db.from().delete() et pour centraliser la logique de suppression.
export function deleteOrchid(id) {
  db.from('orchids').delete().eq('id', id).execute();
}

// Je cherche des orchidées avec un mot-clé. En SQL, j'écrirais
// "WHERE name LIKE '%query%' OR vernacular LIKE '%query%'".
// Ici, comme je suis en local sur un tableau JS, je simule ce LIKE en filtrant
// en mémoire. J'ai choisi de chercher dans trois champs pour maximiser les
// chances de trouver un résultat pertinent pour l'utilisateur.
export function searchOrchids(query) {
  // Je récupère d'abord tout le catalogue, puis je filtre côté client.
  // C'est acceptable en MVP car j'ai seulement 21 orchidées ; en production
  // avec Supabase, cette recherche sera faite côté serveur avec un vrai LIKE.
  const all = getAllOrchids();
  if (!query) return all;
  // Je normalise la requête en minuscules pour rendre la recherche insensible à la casse.
  // Ainsi, "Vanilla" et "vanilla" donneront le même résultat.
  const q = query.toLowerCase();
  // Je garde les orchidées où le nom botanique, le nom vernaculaire OU la
  // description courte contient la requête. J'utilise includes() qui est
  // l'équivalent JS du LIKE '%...%' SQL.
  return all.filter(o =>
    o.name.toLowerCase().includes(q) ||
    o.vernacular.toLowerCase().includes(q) ||
    o.shortDesc.toLowerCase().includes(q)
  );
}
