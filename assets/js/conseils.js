// conseils.js — Affichage et filtrage du catalogue de conseils détaillés
// ======================================================================
// Ce fichier gère les 6 rubriques cliquables du design Figma.
// Il permet d'afficher les conseils d'une rubrique, ou de filtrer
// par type d'orchidée, niveau d'expertise et mot-clé.

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
    const conseilCards = document.querySelectorAll('.conseil-card');
    const catalog = document.getElementById('advice-catalog');

    // Si le conteneur de résultats n'existe pas, on arrête
    if (!resultsContainer) {
        return;
    }

    // On mémorise la rubrique actuellement sélectionnée par un clic sur une carte
    let selectedCategory = null;

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

        // On crée la ligne de métadonnées (rubrique, type, niveau)
        const meta = document.createElement('div');
        meta.className = 'advice-result-meta';
        meta.innerHTML = '<span class="advice-result-tag">' + escapeHtml(conseil.category) + '</span>'
            + '<span class="advice-result-tag">' + escapeHtml(conseil.plantType) + '</span>'
            + '<span class="advice-result-tag">' + escapeHtml(conseil.level) + '</span>';
        article.appendChild(meta);

        // On crée le paragraphe de contenu
        const content = document.createElement('p');
        content.textContent = conseil.content;
        article.appendChild(content);

        // On affiche la source scientifique / professionnelle
        const source = document.createElement('p');
        source.className = 'advice-source';
        source.textContent = 'Source : ' + escapeHtml(conseil.source);
        article.appendChild(source);

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

    // Fonction qui retourne true si le conseil correspond aux critères actifs
    function matchConseil(conseil) {
        // On lit les valeurs des filtres
        const selectedPlantType = plantTypeFilter ? plantTypeFilter.value : 'all';
        const selectedLevel = levelFilter ? levelFilter.value : 'all';
        const typedText = textSearch ? textSearch.value.trim().toLowerCase() : '';

        // Vérification de la rubrique cliquée
        if (selectedCategory && conseil.category !== selectedCategory) {
            return false;
        }

        // Vérification du type de plante
        // Si le conseil est générique (plantType = "Toutes"), il passe pour tout type
        if (selectedPlantType !== 'all' && conseil.plantType !== 'Toutes' && conseil.plantType !== selectedPlantType) {
            return false;
        }

        // Vérification du niveau d'expertise
        if (selectedLevel !== 'all' && conseil.level !== selectedLevel) {
            return false;
        }

        // Vérification du texte libre
        if (typedText.length > 0) {
            const haystack = (
                conseil.title + ' ' + conseil.theme + ' ' + conseil.plantType + ' ' + conseil.content
            ).toLowerCase();
            if (!haystack.includes(typedText)) {
                return false;
            }
        }

        // Tous les critères sont satisfaits
        return true;
    }

    // Fonction principale de filtrage
    function filterConseils() {
        const typedText = textSearch ? textSearch.value.trim().toLowerCase() : '';

        // On n'affiche aucun résultat tant que l'utilisateur n'a pas :
        // - cliqué sur une rubrique, OU
        // - saisi au moins 3 caractères dans la recherche
        if (!selectedCategory && typedText.length < 3) {
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
            }
            return;
        }

        // On filtre la base de données avec matchConseil
        const filtered = conseilsDatabase.filter(matchConseil);
        // On affiche le résultat
        renderConseils(filtered);
    }

    // Fonction appelée quand on clique sur une des 6 cartes maquette
    function onConseilCardClick(event) {
        // On empêche tout comportement par défaut
        event.preventDefault();

        // On récupère la catégorie stockée dans l'attribut data-category
        const card = event.currentTarget;
        const category = card.getAttribute('data-category');

        // On met à jour la rubrique sélectionnée
        selectedCategory = category;

        // On lance le filtrage
        filterConseils();

        // On défile jusqu'au catalogue pour voir les résultats
        if (catalog) {
            catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // On place le focus sur le titre du catalogue pour l'accessibilité
        const sectionTitle = catalog ? catalog.querySelector('.section-title') : null;
        if (sectionTitle) {
            sectionTitle.setAttribute('tabindex', '-1');
            sectionTitle.focus();
        }
    }

    // On rend chaque carte cliquable et accessible au clavier
    for (const card of conseilCards) {
        card.addEventListener('click', onConseilCardClick);
        card.addEventListener('keydown', function (event) {
            // Si la touche pressée est Espace ou Entrée
            if (event.key === ' ' || event.key === 'Enter') {
                // On empêche le défilement de la page
                event.preventDefault();
                // On simule le clic
                onConseilCardClick({ currentTarget: card, preventDefault: function () {} });
            }
        });
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

    // La zone de conseils est vide au chargement ; elle se remplit quand on clique sur une rubrique
    // ou quand l'utilisateur tape au moins 3 caractères dans la recherche
});