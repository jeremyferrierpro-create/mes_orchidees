// form-validation.js — Validation du formulaire d'authentification
// ================================================================
// Ce fichier vérifie les champs du formulaire de connexion côté client.
// Plus tard, les données seront envoyées à un script PHP via fetch().

// On attend que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {

    // On récupère le formulaire d'authentification
    const loginForm = document.getElementById('login-form');

    // On récupère la zone où afficher les messages
    const messageBox = document.getElementById('auth-message');

    // Si le formulaire n'existe pas, on arrête
    if (!loginForm) {
        return;
    }

    // Quand l'utilisateur soumet le formulaire
    loginForm.addEventListener('submit', function (event) {
        // On empêche l'envoi réel du formulaire (pour le moment)
        // Plus tard, cette ligne sera remplacée par un appel fetch()
        event.preventDefault();

        // On récupère et on nettoie la valeur du champ email
        const email = document.getElementById('email').value.trim();
        // On récupère la valeur du champ mot de passe
        const password = document.getElementById('password').value;

        // On crée un tableau pour stocker les messages d'erreur
        const errors = [];

        // Vérification de l'email
        if (!email) {
            // Si l'email est vide
            errors.push('Veuillez saisir votre adresse email.');
        } else if (!email.includes('@')) {
            // Si l'email ne contient pas le caractère @
            errors.push('L\'adresse email semble invalide.');
        }

        // Vérification du mot de passe
        if (!password) {
            // Si le mot de passe est vide
            errors.push('Veuillez saisir votre mot de passe.');
        } else if (password.length < 8) {
            // Si le mot de passe est trop court
            errors.push('Le mot de passe doit contenir au moins 8 caractères.');
        }

        // On affiche le résultat à l'utilisateur
        if (messageBox) {
            if (errors.length > 0) {
                // S'il y a des erreurs, on les affiche
                messageBox.textContent = errors.join(' ');
                messageBox.className = 'auth-message error';
            } else {
                // Sinon, on affiche un message de validation
                messageBox.textContent = 'Identifiants valides. Connexion à un Back-End PHP/Supabase à venir.';
                messageBox.className = 'auth-message success';
                // On simule une connexion en stockant l'état
                localStorage.setItem('isAuthenticated', 'true');
            }
        }
    });
});
