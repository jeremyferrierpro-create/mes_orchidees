# Mes Orchidées — Encyclopédie & Gestion de Collection

> *Le monde fascinant des orchidées, enfin centralisé.*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()
[![DWWM](https://img.shields.io/badge/DWWM-Projet%20Fil%20Rouge%20--%202026%2F2027-blue)]()

**Projet fil rouge DWWM — Jeremy Ferrier, 45 ans, Pamiers (09)**
Ancien producteur floral, fleuriste et gérant de jardinerie. Aujourd'hui en reconversion développeur web.
> *« If I want to, I can, I do ! »*

📂 Dépôt : `jeremyferrierpro-create/mes_orchidees` · Branches : `dev` (travail) → `main` (stable)

---

## Pourquoi ce projet ?

90% des sites sur les orchidées sont vieux, pas sécurisés et illisibles sur mobile. L'info existe mais elle est éparpillée.

**Mes Orchidées** fait simple :

1. **Centraliser** — une encyclopédie qui répond vite, avec les vrais noms (ordre, genre, origine...)
2. **Archiver** — une collection perso où j'enregistre mes plantes et leurs soins
3. **Accompagner** — des conseils clairs et des rappels pour ne pas oublier un arrosage

> Pour l'instant tout tourne en **JavaScript vanilla + localStorage** (pas besoin de base de données). On passera en **PHP + Supabase** plus tard, quand j'aurai vu le SQL en formation. C'est assumé et expliqué au jury.

---

## Ce qui marche aujourd'hui (MVP)

- [x] **Accueil** — recherche instantanée + mots latins qui flottent (ambiance serre)
- [x] **Encyclopédie** — 21 orchidées complètes, recherche à partir de 3 lettres, fiche modale détaillée + bouton `+ Collection`
- [x] **Ma Collection** — dashboard (total / épiphytes / terrestres / hémi), climat moyen, grille de vignettes, historique des soins, conseils liés à la plante
- [x] **Conseils** — 6 rubriques (base, épiphytes, terrestres...) + 21 fiches espèces, recherche et modale qui s'ouvre au clic
- [x] **Authentification locale** — inscription / connexion sans PHP, juste `localStorage` (prêt pour bcrypt + Supabase ensuite)
- [x] **Administration** — fidèle au mockup Figma : 3 cartes chiffrées, 2 tableaux en pilules, 3 gros boutons dont `Gérer les utilisateurs`
- [x] **Responsive + Accessibilité** — RGAA/WCAG, clavier 100%, `focus-trap` dans les modales, `aria-*` partout
- [x] **PWA** — `sw.js` + `manifest.json`, consultable hors-ligne

---

## Lancer le projet en 30 secondes

Pas besoin de XAMPP pour l'instant. C'est du front pur.

```bash
# 1. Cloner
git clone https://github.com/jeremyferrierpro-create/mes_orchidees.git
cd mes_orchidees

# 2. Lancer (au choix)
# - double-clic sur index.html
# - ou avec VS Code : clic droit -> Open with Live Server
# - ou : npx serve .
```

Ouvre `http://localhost:3000` ou `http://localhost:8765` selon l'outil.

**Comptes de test (présents dans `assets/js/data/users-data.js`) :**
- `jeremy.ferrierpro@gmail.com` / `demoadmin` (admin)
- `admin@mesorchidees.fr` / `demouser` (user)

> Les mots de passe sont en clair **uniquement** pour la démo locale. En prod ils seront hachés avec `bcrypt`.

---

## Stack — Honnête et assumée

| Aujourd'hui (ce que je maîtrise) | Demain (quand je serai formé) |
|---|---|
| HTML5 sémantique | PHP 8 |
| SCSS (7-1) → CSS compilé | PostgreSQL via Supabase + RLS |
| JavaScript vanilla (modules ES) | `fetch()` vers `api/*.php` |
| `localStorage` + `STORAGE_KEYS` centralisées | `bcrypt`, CSRF, sessions PHP |
| Figma / Canva (maquettes) | Hébergement Ionos / LWS |

**Choix expliqués à l'oral :**
- `STORAGE_KEYS` = un seul endroit pour tous les noms de tiroirs (`mo_orchids`, `mo_conseils`...). Si je change un nom, je ne casse rien.
- `core/modal.js` = une seule fonction `open/close` + `trapFocus` pour le clavier.
- `services/*` = chaque service parle à `storage.js`, pas direct à `localStorage`. Plus tard je remplace par un `fetch`.

---

## Arborescence réelle

```
mes_orchidees/
├── index.html / encyclopedie.html / macollection.html / conseils.html
├── administration.html / authentification.html / mentions.html ...
├── assets/
│   ├── scss/  (abstracts, base, components, layout, pages)
│   ├── css/   (style.css + style.min.css compilés)
│   ├── js/
│   │   ├── app.js + pwa.js
│   │   ├── core/      (dom, modal, storage, router, notifications, focus, loader, security)
│   │   ├── data/      (orchids-data.js 21 fiches, conseils-data.js 27 fiches, users-data.js)
│   │   ├── services/  (orchid-service, conseil-service, collection-service, auth-service)
│   │   └── features/  (navigation, search, collection, conseils, administration, authentication, background-animation, add-button)
│   └── images/
│       ├── orchids/ (21 png + vanilla_planifolia.jpg en minuscule pour Linux)
│       └── site/    (hero, background.webp, icônes)
├── sw.js + manifest.json
└── docs/      (mes notes perso, hors GitHub)
```

> Chaque fichier `*.js` est commenté ligne par ligne en français débutant, pour que je puisse l'expliquer mot à mot devant le jury.

---

## Feuille de route — Simple et lisible

- [x] Maquettes Figma + HTML/CSS/JS vanilla
- [x] Audit + corrections (auth sans PHP, conseils fonctionnels, admin fidèle au mockup, STORAGE_KEYS)
- [x] 100% des scripts commentés pour l'oral
- [ ] SQL / Modélisation BDD (M4)
- [ ] PHP + Supabase (M5-M6)
- [ ] Tests + recette (M7) → **MVP février 2027**

Branche `dev` = je bricole. Quand c'est propre, je fais `git checkout main && git merge dev && git push`.

---

## Accessibilité

- Contrastes ≥ 4.5:1, palette testée daltonisme (Adobe Color)
- Navigation clavier complète, `skip-link`, `focus-trap` dans les modales
- Sémantique `role="dialog" aria-modal`, `aria-expanded`, `alt` descriptifs
- Testé : RGAA Checker + W3C Validator

---

## Auteur

**Jeremy Ferrier — 45 ans — Pamiers**
Parcours végétal → code. J'aime les plantes qui respirent et le code qui s'explique.

- GitHub : [@jeremyferrierpro-create](https://github.com/jeremyferrierpro-create)
- Formation : DWWM `DEV_FAD_2026` — Projet fil rouge 2026/2027

> Ce README est écrit comme je parle : simple, direct, sans jargon inutile. Si un passage fait trop “IA”, dis-le et je le réécris.

---

## Licence

Projet étudiant DWWM, usage pédagogique. Pas de licence commerciale pour l'instant.

<div align="center">

*Mes Orchidées — le monde fascinant des orchidées.*

</div>
