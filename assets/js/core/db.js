// Ce fichier est ma fausse base de données qui imite Supabase
// Aujourd'hui il lit/écrit dans le navigateur (localStorage)
// Demain il fera fetch('https://xxx.supabase.co/rest/v1/...')
// Comme ça, mes services n'ont pas besoin de changer : ils font toujours db.from('users').select()

// J'importe les 5 tables JSON qui sont dans /assets/data/ (ce sont mes vraies tables)
import usersSeed from '../../data/users.json' with { type: 'json' };
import orchidsSeed from '../../data/orchids.json' with { type: 'json' };
import conseilsSeed from '../../data/conseils.json' with { type: 'json' };
import collectionsSeed from '../../data/collections.json' with { type: 'json' };
import soinsSeed from '../../data/soins.json' with { type: 'json' };
import notificationsSeed from '../../data/notifications.json' with { type: 'json' };

// Je fais une petite liste qui dit : "table users = fichier users.json, etc."
const SEEDS = {
  users: usersSeed, // table users
  orchids: orchidsSeed, // table orchids
  conseils: conseilsSeed, // table conseils
  collections: collectionsSeed, // table collections (qui possède quelle plante)
  soins: soinsSeed, // table soins (historique)
  notifications: notificationsSeed // table notifications
};

// Je choisis le préfixe pour ranger dans le navigateur (comme un tiroir)
const PREFIX = 'db_'; // chaque table sera rangée sous "db_users", "db_orchids", etc.

// Elle lit une table dans le navigateur, ou la crée à partir du JSON si vide
function readTable(table) {
  // Je cherche dans le navigateur le tiroir "db_users" par exemple
  const raw = localStorage.getItem(PREFIX + table);
  // Si je trouve, je transforme le texte en tableau et je le rends
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { console.error('Table cassée', table, e); return []; }
  }
  // Si rien, je prends la table de départ dans /assets/data/ et je la range pour la prochaine fois
  const seed = SEEDS[table] || [];
  // Je copie le tableau (pour ne pas modifier l'original)
  const copy = JSON.parse(JSON.stringify(seed));
  localStorage.setItem(PREFIX + table, JSON.stringify(copy));
  return copy;
}

// Elle écrit une table entière dans le navigateur
function writeTable(table, data) {
  localStorage.setItem(PREFIX + table, JSON.stringify(data));
}

// Le faux Supabase : db.from('users').select().eq('email', 'test@test.fr')
export const db = {
  // Je choisis une table : db.from('users')
  from(table) {
    // Je vérifie que la table existe
    if (!SEEDS.hasOwnProperty(table) && table !== 'users' && table !== 'orchids' && table !== 'conseils' && table !== 'collections' && table !== 'soins' && table !== 'notifications') {
      console.warn('Table inconnue :', table);
    }
    // Je prépare l'état de la requête (comme Supabase)
    let _filters = []; // liste des filtres eq
    let _operation = 'select'; // par défaut on lit
    let _payload = null; // pour insert/update

    // L'objet qui permet de chaîner : .select().eq().single()
    const builder = {
      // Je veux lire : .select('*') ou .select('email, role')
      select(columns = '*') {
        _operation = 'select';
        return builder; // je rends le même objet pour chaîner
      },
      // Je veux ajouter : .insert({email: 'a@b.com'})
      insert(data) {
        _operation = 'insert';
        _payload = data;
        return builder;
      },
      // Je veux modifier : .update({role: 'admin'}).eq('email', 'a@b.com')
      update(data) {
        _operation = 'update';
        _payload = data;
        return builder;
      },
      // Je veux supprimer : .delete().eq('id', 1)
      delete() {
        _operation = 'delete';
        return builder;
      },
      // Je filtre : .eq('email', 'test@test.fr')
      eq(field, value) {
        _filters.push({ field, value });
        return builder;
      },
      // Je veux un seul résultat : .single() (au lieu d'un tableau)
      async single() {
        const res = await builder.execute();
        // Si tableau avec 1 élément, je rends l'élément, sinon erreur comme Supabase
        if (res.data && Array.isArray(res.data) && res.data.length === 1) {
          return { data: res.data[0], error: null };
        }
        if (res.data && res.data.length === 0) {
          return { data: null, error: { message: 'No rows found' } };
        }
        return res;
      },
      // J'exécute vraiment la requête (c'est ce qui se passe quand tu fais await)
      async execute() {
        let rows = readTable(table); // je lis la table

        // Si c'est un SELECT, je filtre
        if (_operation === 'select') {
          let filtered = rows;
          // J'applique chaque filtre eq
          for (const f of _filters) {
            filtered = filtered.filter(r => String(r[f.field]) === String(f.value));
          }
          return { data: filtered, error: null };
        }

        // Si c'est un INSERT, j'ajoute
        if (_operation === 'insert') {
          const toInsert = Array.isArray(_payload) ? _payload : [_payload];
          // Je donne un id si pas présent
          for (const row of toInsert) {
            if (row.id == null) row.id = Date.now() + Math.floor(Math.random() * 1000);
            // Je mets created/modified si c'est une table qui en a besoin
            if (table === 'users' && !row.created) row.created = new Date().toLocaleDateString('fr-FR');
            rows.push(row);
          }
          writeTable(table, rows);
          return { data: toInsert, error: null };
        }

        // Si c'est un UPDATE, je modifie les lignes filtrées
        if (_operation === 'update') {
          let updated = [];
          rows = rows.map(r => {
            // Est-ce que cette ligne correspond à tous les filtres ?
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

        // Si c'est un DELETE, je supprime les lignes filtrées
        if (_operation === 'delete') {
          const before = rows.length;
          // Je garde tout sauf ce qui correspond aux filtres
          let filtered = rows;
          for (const f of _filters) {
            filtered = filtered.filter(r => String(r[f.field]) !== String(f.value));
          }
          // Si plusieurs filtres, je dois vérifier qu'on supprime seulement si TOUS les filtres correspondent
          // Pour simplifier, si un seul filtre, ça marche. Si plusieurs, je refais plus strict :
          if (_filters.length > 1) {
            filtered = rows.filter(r => !_filters.every(f => String(r[f.field]) === String(f.value)));
          }
          writeTable(table, filtered);
          return { data: rows.filter(r => !filtered.includes(r)), error: null };
        }

        return { data: null, error: { message: 'Opération inconnue' } };
      },
      // Pour que await marche direct (ex: await db.from('users').select().eq(...))
      then(onFulfilled, onRejected) {
        return builder.execute().then(onFulfilled, onRejected);
      }
    };
    return builder;
  },
  // Petit utilitaire pour vider une table (pour les tests)
  _clear(table) {
    localStorage.removeItem(PREFIX + table);
  },
  // Petit utilitaire pour voir ce qu'il y a dans une table
  _dump(table) {
    return readTable(table);
  }
};

// Pour les anciens scripts qui utilisent window.db
window.db = db;
