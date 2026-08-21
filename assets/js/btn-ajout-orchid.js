// btn-ajout-orchid.js — Gestion du bouton "+ COLLECTION"
// ========================================================
// Ce fichier gère l'ajout d'une orchidée à la collection personnelle.
// Aujourd'hui, il utilise le localStorage du navigateur.
// Demain, il enverra les données à une API PHP / Supabase.

// On attend que le DOM soit complètement chargé avant de manipuler les éléments
document.addEventListener('DOMContentLoaded', function () {

    // On récupère le titre de la modale pour connaître l'orchidée affichée
    const modalTitle = document.getElementById('modal-orchid-title');

    // On récupère le bouton "+ COLLECTION" dans la modale
    const addButton = document.querySelector('.btn-add-collection');

    // Si le bouton n'existe pas, on arrête le script (autres pages)
    if (!addButton) {
        return;
    }

    // Fonction qui simule la vérification de l'état de connexion
    function isUserAuthenticated() {
        // On lit la valeur stockée dans le localStorage sous la clé 'isAuthenticated'
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    // Fonction qui ajoute une orchidée à la collection
    function ajouterAMaCollection(orchidName) {
        // On vérifie que le nom est valide (pas vide ni placeholder "...")
        if (!orchidName || orchidName === '...') {
            // On affiche un avertissement dans la console du navigateur
            console.warn('Impossible de récupérer le nom de l\'orchidée cible.');
            return;
        }

        // Si l'utilisateur est connecté
        if (isUserAuthenticated()) {
            // On récupère la collection actuelle, ou un tableau vide si elle n'existe pas
            let maCollection = JSON.parse(localStorage.getItem('userCollection')) || [];

            // On vérifie si l'orchidée est déjà dans la collection
            const dejaPresente = maCollection.some(function (item) {
                // On gère les cas où l'item est une chaîne ou un objet
                const nom = typeof item === 'string' ? item : item.name;
                // On compare en minuscule pour éviter les différences de casse
                return nom.toLowerCase() === orchidName.toLowerCase();
            });

            if (dejaPresente) {
                // Message à l'utilisateur si l'orchidée est déjà présente
                alert('L\'orchidée "' + orchidName + '" est déjà présente dans votre collection !');
            } else {
                // On ajoute le nom de l'orchidée au tableau
                maCollection.push(orchidName);
                // On enregistre la collection mise à jour dans le localStorage
                localStorage.setItem('userCollection', JSON.stringify(maCollection));
                // On confirme l'ajout à l'utilisateur
                alert('L\'orchidée "' + orchidName + '" a été ajoutée avec succès à votre collection !');
            }
        } else {
            // Si l'utilisateur n'est pas connecté, on lui propose de le faire
            const choix = confirm(
                'Vous devez être connecté pour ajouter une orchidée à votre collection.\n\n' +
                'Souhaitez-vous vous connecter ou créer un compte dès maintenant ?'
            );

            if (choix) {
                // On mémorise l'orchidée choisie en attendant la connexion
                localStorage.setItem('pendingOrchidToAdd', orchidName);
                // On redirige vers la page d'authentification
                window.location.href = 'authentification.html';
            }
        }
    }

    // Quand on clique sur le bouton "+ COLLECTION"
    addButton.addEventListener('click', function () {
        // On récupère le texte du titre de la modale et on enlève les espaces
        const orchidName = modalTitle ? modalTitle.textContent.trim() : null;

        // Si on a bien un nom, on lance l'ajout
        if (orchidName) {
            ajouterAMaCollection(orchidName);
        } else {
            // Sinon, on affiche un avertissement dans la console
            console.warn('Aucun nom d\'orchidée trouvé dans la modale.');
        }
    });
});
