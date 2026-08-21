// collection.js — Affichage et gestion de "Ma Collection"
// =========================================================
// Ce fichier lit les orchidées stockées dans le localStorage et les affiche.
// À terme, il fera un appel fetch() à une API PHP / Supabase.

// On attend que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {

    // On récupère le conteneur qui affichera la liste
    const listContainer = document.getElementById('collection-list');

    // Si le conteneur n'existe pas, on arrête (autres pages)
    if (!listContainer) {
        return;
    }

    // On lit la collection dans le localStorage, ou un tableau vide
    let maCollection = JSON.parse(localStorage.getItem('userCollection')) || [];

    // Fonction qui affiche la collection
    function renderCollection() {
        // On vide le conteneur
        listContainer.innerHTML = '';

        // Si la collection est vide
        if (maCollection.length === 0) {
            // On affiche un message invitant l'utilisateur à ajouter des orchidées
            listContainer.innerHTML = '<p class="empty-collection">Votre collection est vide. Ajoutez des orchidées depuis l\'encyclopédie.</p>';
            return;
        }

        // On crée une liste non ordonnée
        const ul = document.createElement('ul');
        // On applique la classe CSS de la liste de collection
        ul.className = 'collection-list';

        // On parcourt chaque élément de la collection
        for (const item of maCollection) {
            // On crée un élément de liste
            const li = document.createElement('li');

            // On normalise le nom (chaîne ou objet)
            const name = typeof item === 'string' ? item : (item.name || 'Orchidée inconnue');

            // On crée un paragraphe pour le nom
            const namePara = document.createElement('p');
            namePara.textContent = name;
            li.appendChild(namePara);

            // On crée le bouton de retrait
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.textContent = 'Retirer';
            removeBtn.className = 'btn-remove-collection';
            removeBtn.setAttribute('data-orchid-name', name);
            // On ajoute un label pour les lecteurs d'écran
            removeBtn.setAttribute('aria-label', 'Retirer ' + name + ' de la collection');
            li.appendChild(removeBtn);

            // On ajoute l'élément à la liste
            ul.appendChild(li);
        }

        // On ajoute la liste au conteneur de la page
        listContainer.appendChild(ul);
    }

    // On affiche la collection au chargement
    renderCollection();

    // On écoute les clics sur le conteneur (délégation d'événement)
    listContainer.addEventListener('click', function (event) {
        // On remonte jusqu'au bouton de retrait cliqué
        const removeBtn = event.target.closest('.btn-remove-collection');

        // Si un bouton de retrait a été cliqué
        if (removeBtn) {
            // On récupère le nom de l'orchidée à retirer
            const nameToRemove = removeBtn.getAttribute('data-orchid-name');

            // On filtre la collection pour enlever l'orchidée
            maCollection = maCollection.filter(function (item) {
                const nom = typeof item === 'string' ? item : (item.name || '');
                // On garde les orchidées qui ne correspondent pas à celle à retirer
                return nom !== nameToRemove;
            });

            // On enregistre la nouvelle collection
            localStorage.setItem('userCollection', JSON.stringify(maCollection));

            // On réaffiche la liste mise à jour
            renderCollection();
        }
    });
});
