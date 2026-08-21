// conseils.js — Affichage et filtrage du catalogue de conseils détaillés
// ======================================================================
// Cette partie est complémentaire aux 6 rubriques de la page maquette.
// Elle permet à l'utilisateur de consulter de vrais conseils professionnels
// en filtrant par type d'orchidée, niveau d'expertise et mot-clé.

// On attend que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {

    // On récupère les données de conseils injectées par conseils-data.js
    const conseilsDatabase = window.conseilsDatabase || [];

    // On récupère les éléments de la page
    const resultsContainer = document.getElementById('advice-results');
    const plantTypeFilter = document.getElementById('advice-plant-type');
    const levelFilter = document.getElementById('advice-level');
    const textSearch = document.getElementById('advice-text-search');
    const filterForm = document.getElementById('advice-filter-form');

    // Si le conteneur de résultats n'existe pas, on arrête
    if (!resultsContainer) {
        return;
    }

    // Fonction qui crée le HTML d'une carte conseil détaillée
    function createAdviceCard(conseil) {
        // On crée un article sémantique
        const article = document.createElement('article');
        // On applique la classe CSS du résultat
        article.className = 'advice-result-card';

        // On crée le titre du conseil
        const title = document.createElement('h3');
        title.textContent = conseil.title;
        article.appendChild(title);

        // On crée la ligne de métadonnées (thème, type, niveau)
        const meta = document.createElement('div');
        meta.className = 'advice-result-meta';
        meta.innerHTML = '<span class="advice-result-tag">' + escapeHtml(conseil.theme) + '</span>'
            + '<span class="advice-result-tag">' + escapeHtml(conseil.plantType) + '</span>'
            + '<span class="advice-result-tag">' + escapeHtml(conseil.level) + '</span>';
        article.appendChild(meta);

        // On crée le paragraphe de contenu
        const content = document.createElement('p');
        content.textContent = conseil.content;
        article.appendChild(content);

        // On retourne l'article
        return article;
    }

    // Fonction qui affiche les conseils dans le catalogue
    function renderConseils(list) {
        // On vide le conteneur
        resultsContainer.innerHTML = '';

        // Si aucun résultat
        if (list.length === 0) {
            const message = document.createElement('p');
            message.className = 'advice-no-results';
            message.textContent = 'Aucun conseil ne correspond aux critères sélectionnés.';
            resultsContainer.appendChild(message);
            return;
        }

        // On parcourt chaque conseil de la liste
        for (const conseil of list) {
            // On crée la carte et on l'ajoute au conteneur
            resultsContainer.appendChild(createAdviceCard(conseil));
        }
    }

    // Fonction qui vérifie si un conseil correspond aux filtres choisis
    function matchesFilters(conseil) {
        // On lit les valeurs des listes déroulantes
        const selectedPlantType = plantTypeFilter ? plantTypeFilter.value : 'all';
        const selectedLevel = levelFilter ? levelFilter.value : 'all';
        const searchText = textSearch ? textSearch.value.toLowerCase().trim() : '';

        // Vérification du type de plante
        if (selectedPlantType !== 'all' && conseil.plantType !== selectedPlantType) {
            return false;
        }

        // Vérification du niveau d'expertise
        if (selectedLevel !== 'all' && conseil.level !== selectedLevel) {
            return false;
        }

        // Vérification du texte libre (recherche dans titre, thème et contenu)
        if (searchText) {
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
    if (plantTypeFilter) {
        plantTypeFilter.addEventListener('change', filterConseils);
    }
    if (levelFilter) {
        levelFilter.addEventListener('change', filterConseils);
    }
    if (textSearch) {
        textSearch.addEventListener('input', filterConseils);
    }

    // On empêche le rechargement de la page si l'utilisateur clique sur Filtrer
    if (filterForm) {
        filterForm.addEventListener('submit', function (event) {
            event.preventDefault();
            filterConseils();
        });
    }

    // Affichage initial : on montre tous les conseils du catalogue
    renderConseils(conseilsDatabase);
});
