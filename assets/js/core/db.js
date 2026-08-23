// ===========================================================================
// FICHIER : core/db.js — Ma couche d'abstraction BDD (Pattern Repository)
// ===========================================================================
// J'ai conçu ce fichier comme une couche d'abstraction, c'est-à-dire un
// intermédiaire entre mes services et le stockage réel. J'applique ici le
// Pattern Repository : mes composants graphiques ne savent pas OÙ sont les
// données, ils savent juste demander db.from('users').select().eq(...).
// Aujourd'hui, pour mon MVP en local, je lis et j'écris dans le localStorage
// du navigateur. C'est instantané et ne nécessite pas de serveur.
// Demain, en Phase 3, j'ai prévu de remplacer ce localStorage par des appels
// fetch() asynchrones vers mon API Supabase/PostgreSQL
// (ex: fetch('https://xxx.supabase.co/rest/v1/users')). Grâce à cette
// abstraction, je n'aurai à modifier AUCUN composant graphique : seul ce
// fichier changera, car l'interface db.from().select().eq() restera identique.
// C'est exactement comme cela que fonctionne l'ORM officiel de Supabase.

// J'importe ici mes 6 tables de départ au format JSON depuis /assets/js/data/.
// Ces fichiers sont les prémices de mes futures tables SQL. En local, ils me
// servent de "seed" pour peupler la base au premier lancement.
import usersSeed from '../data/users.json' with { type: 'json' };
import orchidsSeed from '../data/orchids.json' with { type: 'json' };
import conseilsSeed from '../data/conseils.json' with { type: 'json' };
import collectionsSeed from '../data/collections.json' with { type: 'json' };
import soinsSeed from '../data/soins.json' with { type: 'json' };
import notificationsSeed from '../data/notifications.json' with { type: 'json' };

// Je construis une table de correspondance SEEDS : "nom logique -> contenu JSON".
// Pourquoi un objet ? Pour pouvoir faire SEEDS[table] dynamiquement et éviter un
// énorme switch/case. C'est plus lisible et extensible.
const SEEDS = {
  users: usersSeed,
  orchids: orchidsSeed,
  conseils: conseilsSeed,
  collections: collectionsSeed,
  soins: soinsSeed,
  notifications: notificationsSeed
};

// J'ai choisi un préfixe unique "db_" pour toutes mes clés localStorage.
// Pourquoi ? Pour ne pas polluer le storage global et pour pouvoir retrouver
// facilement mes tables dans les DevTools (Application > Local Storage).
// Chaque table sera rangée sous "db_users", "db_orchids", etc.
const PREFIX = 'db_';

// Je lis une table depuis le navigateur. Si elle n'existe pas encore, je la crée
// à partir du JSON de départ et je la stocke pour les prochains lancements.
// Pourquoi cette logique ? Pour que le premier visiteur ait déjà des données de
// démo sans avoir besoin d'un script d'installation séparé.
function readTable(table) {
  // Je cherche d'abord dans le localStorage la clé correspondante (ex: "db_users").
  const raw = localStorage.getItem(PREFIX + table);
  // Si je trouve une valeur, je tente de la parser en JSON. J'encadre avec try/catch
  // pour éviter que des données corrompues ne fassent planter toute l'application.
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { console.error('Table cassée', table, e); return []; }
  }
  // Si rien n'est trouvé, c'est le premier lancement : je prends le seed JSON.
  const seed = SEEDS[table] || [];
  // Je clone profondément le seed avec JSON.parse(JSON.stringify(...)) pour ne pas
  // muter l'objet importé original par référence. C'est une précaution importante.
  const copy = JSON.parse(JSON.stringify(seed));
  localStorage.setItem(PREFIX + table, JSON.stringify(copy));
  return copy;
}

// J'écris une table entière dans le localStorage. C'est mon équivalent d'un COMMIT SQL.
// Pourquoi une fonction dédiée ? Pour centraliser la sérialisation et éviter les oublis.
function writeTable(table, data) {
  localStorage.setItem(PREFIX + table, JSON.stringify(data));
}

// J'expose mon faux client Supabase. Son API imite volontairement la vraie :
// db.from('users').select().eq('email', 'test@test.fr').single() ou .execute()
// Pourquoi je mime cette API ? Pour que mes services puissent déjà s'écrire comme
// s'ils parlaient à Supabase, ce qui rendra la migration future transparente.
export const db = {
  // Je choisis une table, comme on ferait "FROM users" en SQL.
  from(table) {
    // Je vérifie que la table demandée existe dans mes seeds pour aider au debug.
    if (!SEEDS.hasOwnProperty(table) && table !== 'users' && table !== 'orchids' && table !== 'conseils' && table !== 'collections' && table !== 'soins' && table !== 'notifications') {
      console.warn('Table inconnue :', table);
    }
    // J'initialise l'état interne de ma requête, exactement comme le fait le
    // Query Builder de Supabase : filtres, type d'opération et données à envoyer.
    let _filters = [];
    let _operation = 'select';
    let _payload = null;

    // Je construis un "builder" chaînable. Chaque méthode renvoie le même objet
    // pour permettre le chaînage fluide : .select().eq().single().execute()
    const builder = {
      // Je prépare une lecture. Le paramètre columns est conservé pour la compatibilité
      // avec la vraie API Supabase, même si en local je renvoie toujours toutes les colonnes.
      select(columns = '*') {
        _operation = 'select';
        return builder;
      },
      // Je prépare une insertion. Je stocke la donnée à insérer pour l'exécuter plus tard.
      insert(data) {
        _operation = 'insert';
        _payload = data;
        return builder;
      },
      // Je prépare une mise à jour. Le .eq() qui suivra précisera quelles lignes modifier.
      update(data) {
        _operation = 'update';
        _payload = data;
        return builder;
      },
      // Je prépare une suppression. Là aussi, le filtre .eq() est indispensable.
      delete() {
        _operation = 'delete';
        return builder;
      },
      // J'ajoute un filtre d'égalité, comme un WHERE email = '...' en SQL.
      // J'accumule les filtres pour pouvoir en chaîner plusieurs.
      eq(field, value) {
        _filters.push({ field, value });
        return builder;
      },
      // Je veux un seul objet au lieu d'un tableau. Je réutilise execute() puis je
      // formate la réponse comme le ferait Supabase : { data: objet, error: null } ou erreur.
      single() {
        const res = builder.execute();
        if (res.data && Array.isArray(res.data) && res.data.length === 1) {
          return { data: res.data[0], error: null };
        }
        if (res.data && res.data.length === 0) {
          return { data: null, error: { message: 'No rows found' } };
        }
        return res;
      },
      // J'exécute réellement la requête. C'est ici que je simule le moteur SQL en
      // manipulant des tableaux JavaScript. Tout est synchrone pour le MVP local,
      // mais je prévois déjà le passage en asynchrone.
      execute() {
        let rows = readTable(table);

        // Cas SELECT : j'applique successivement chaque filtre eq comme des WHERE.
        // Je compare en String pour éviter les pièges de type (ex: id numérique vs string).
        if (_operation === 'select') {
          let filtered = rows;
          for (const f of _filters) {
            filtered = filtered.filter(r => String(r[f.field]) === String(f.value));
          }
          return { data: filtered, error: null };
        }

        // Cas INSERT : j'ajoute une ou plusieurs lignes. J'auto-génère un id si besoin
        // et j'ajoute les dates created/modified pour la table users.
        if (_operation === 'insert') {
          const toInsert = Array.isArray(_payload) ? _payload : [_payload];
          for (const row of toInsert) {
            if (row.id == null) row.id = Date.now() + Math.floor(Math.random() * 1000);
            if (table === 'users' && !row.created) row.created = new Date().toLocaleDateString('fr-FR');
            rows.push(row);
          }
          writeTable(table, rows);
          return { data: toInsert, error: null };
        }

        // Cas UPDATE : je parcours toutes les lignes et je fusionne les nouvelles données
        // uniquement sur celles qui correspondent à TOUS les filtres (every).
        if (_operation === 'update') {
          let updated = [];
          rows = rows.map(r => {
            const match = _filters.every(f => String(r[f.field]) === String(f.value));
            if (match) {
              const newRow = { ...r, ..._payload, modified: new Date().toLocaleDateString('fr-FR') };
              updated.push(newRow);
              return newRow;
            }
            return r;
          });
          writeTable(table, rows);
          return { data: updated, error: null };
        }

        // Cas DELETE : je conserve tout SAUF les lignes qui correspondent aux filtres.
        // Si plusieurs filtres sont présents, je m'assure que seule la combinaison exacte est supprimée.
        if (_operation === 'delete') {
          const before = rows.length;
          let filtered = rows;
          for (const f of _filters) {
            filtered = filtered.filter(r => String(r[f.field]) !== String(f.value));
          }
          if (_filters.length > 1) {
            filtered = rows.filter(r => !_filters.every(f => String(r[f.field]) === String(f.value)));
          }
          writeTable(table, filtered);
          return { data: rows.filter(r => !filtered.includes(r)), error: null };
        }

        return { data: null, error: { message: 'Opération inconnue' } };
      },
      // Je rends le builder "thenable" pour que "await db.from(...).select()" fonctionne
      // même en synchrone. Je wrappe le résultat dans une Promise résolue : c'est une
      // astuce pour préparer la future version async sans casser le code actuel.
      then(onFulfilled, onRejected) {
        try {
          const res = builder.execute();
          return Promise.resolve(res).then(onFulfilled, onRejected);
        } catch (e) {
          return Promise.reject(e).then(null, onRejected);
        }
      }
    };
    return builder;
  },
  // Petit utilitaire que j'utilise en développement pour vider une table et repartir du seed.
  _clear(table) {
    localStorage.removeItem(PREFIX + table);
  },
  // Petit utilitaire pour inspecter rapidement le contenu d'une table dans la console.
  _dump(table) {
    return readTable(table);
  }
};

// J'expose aussi db sur window pour pouvoir le tester rapidement dans la console
// du navigateur avec window.db.from('users').select() sans importer de module.
window.db = db;
