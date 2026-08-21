// conseils.js — Filtre et affichage des conseils de culture
// ==========================================================
// Ce fichier gère les filtres (thème, type, niveau, recherche texte)
// et affiche dynamiquement les fiches conseils sur la page.

// On attend que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {

    // On récupère les données de conseils injectées par conseils-data.js
    const conseilsDatabase = window.conseilsDatabase || [];

    // On récupère les éléments de la page
    const grid = document.getElementById('advice-grid');
    const themeFilter = document.getElementById('filter-theme');
    const plantTypeFilter = document.getElementById('filter-plant-type');
    const levelFilter = document.getElementById('filter-level');
    const textSearch = document.getElementById('advice-text-search');

    // Si le conteneur de la grille n'existe pas, on arrête (autres pages)
    if (!grid) {
        return;
    }

    // Fonction qui crée le HTML d'une carte conseil
    function createAdviceCard(conseil) {
        // On crée un article sémantique
        const article = document.createElement('article');
        // On applique la classe CSS
        article.className = 'advice-card';

        // On crée le titre avec une icône Font Awesome
        const title = document.createElement('h2');
        title.innerHTML = '<i class="fa-solid ' + conseil.icon + '" aria-hidden="true"></i> ' + escapeHtml(conseil.title);
        article.appendChild(title);

        // On crée la ligne de métadonnées (thème, type, niveau)
        const meta = document.createElement('p');
        meta.className = 'advice-meta';
        meta.innerHTML = '<span class="advice-tag">' + escapeHtml(conseil.theme) + '</span>'
            + '<span class="advice-tag">' + escapeHtml(conseil.plantType) + '</span>'
            + '<span class="advice-tag">' + escapeHtml(conseil.level) + '</span>';
        article.appendChild(meta);

        // On crée le paragraphe de contenu
        const content = document.createElement('p');
        content.className = 'advice-text';
        content.textContent = conseil.content;
        article.appendChild(content);

        // On retourne l'article
        return article;
    }

    // Fonction qui affiche les conseils filtrés
    function renderConseils(list) {
        // On vide le conteneur
        grid.innerHTML = '';

        // Si aucun résultat
        if (list.length === 0) {
            // On affiche un message
            const message = document.createElement('p');
            message.className = 'no-results';
            message.textContent = 'Aucun conseil ne correspond aux critères sélectionnés.';
            grid.appendChild(message);
            return;
        }

        // On parcourt chaque conseil de la liste
        for (const conseil of list) {
            // On crée la carte et on l'ajoute au conteneur
            grid.appendChild(createAdviceCard(conseil));
        }
    }

    // Fonction qui retourne true si le conseil correspond aux filtres
    function matchesFilters(conseil) {
        // On lit les valeurs des trois listes déroulantes
        const selectedTheme = themeFilter.value;
        const selectedPlantType = plantTypeFilter.value;
        const selectedLevel = levelFilter.value;
        const searchText = textSearch.value.toLowerCase().trim();

        // Vérification du thème
        if (selectedTheme !== 'all' && conseil.theme !== selectedTheme) {
            return false;
        }

        // Vérification du type de plante
        if (selectedPlantType !== 'all' && conseil.plantType !== selectedPlantType) {
            return false;
        }

        // Vérification du niveau d'expertise
        if (selectedLevel !== 'all' && conseil.level !== selectedLevel) {
            return false;
        }

        // Vérification du texte libre
        if (searchText) {
            // On regarde dans le titre, le thème, le type et le contenu
            const haystack = (
                conseil.title + ' ' + conseil.theme + ' ' + conseil.plantType + ' ' + conseil.content
            ).toLowerCase();
            if (!haystack.includes(searchText)) {
                return false;
            }
        }

        // Tous les critères sont satisfaits
        return true;
    }

    // Fonction principale de filtrage
    function filterConseils() {
        // On filtre la base de données avec matchesFilters
        const filtered = conseilsDatabase.filter(matchesFilters);
        // On affiche le résultat
        renderConseils(filtered);
    }

    // Fonction utilitaire d'échappement HTML pour éviter les failles XSS
    function escapeHtml(text) {
        const safeText = String(text);
        return safeText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // On branche les écouteurs sur chaque filtre
    if (themeFilter) {
        themeFilter.addEventListener('change', filterConseils);
    }
    if (plantTypeFilter) {
        plantTypeFilter.addEventListener('change', filterConseils);
    }
    if (levelFilter) {
        levelFilter.addEventListener('change', filterConseils);
    }
    if (textSearch) {
        textSearch.addEventListener('input', filterConseils);
    }

    // Affichage initial : on montre tous les conseils
    renderConseils(conseilsDatabase);
});
