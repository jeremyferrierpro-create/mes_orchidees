import * as authService from '../services/auth-service.js';
import * as notifications from '../core/notifications.js';
import { STORAGE_KEYS, readString, remove, writeJson } from '../core/storage.js';

// =====================================================
// AUTHENTIFICATION 100% LOCALE (sans PHP, sans base de données)
// =====================================================
// Ce fichier gère les 2 formulaires de la page authentification.html
// Tout est gardé dans le navigateur avec localStorage
// Plus tard on remplacera par PHP + Supabase

export function initAuthentication() {
    // Je récupère les 2 boutons qui permettent de basculer entre Connexion / Inscription
    const btnLogin = document.getElementById('btn-show-login');
    const btnRegister = document.getElementById('btn-show-register');
    // Je récupère les 2 formulaires
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    // Je récupère les petites zones de messages sous chaque formulaire (pour afficher erreur ou succès)
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // Si je ne suis pas sur la page authentification, j'arrête tout
    if (!btnLogin || !btnRegister || !loginForm || !registerForm) return;

    // Fonction pour afficher le formulaire de connexion
    const showLogin = () => {
        // J'affiche le formulaire de connexion et je cache celui d'inscription
        loginForm.removeAttribute('hidden');
        registerForm.setAttribute('hidden', 'true');

        // Je change la couleur des boutons pour montrer lequel est actif
        btnLogin.classList.replace('btn-outline', 'btn-primary');
        btnLogin.setAttribute('aria-pressed', 'true');

        btnRegister.classList.replace('btn-primary', 'btn-outline');
        btnRegister.setAttribute('aria-pressed', 'false');
    };

    // Fonction pour afficher le formulaire d'inscription
    const showRegister = () => {
        // J'affiche l'inscription et je cache la connexion
        registerForm.removeAttribute('hidden');
        loginForm.setAttribute('hidden', 'true');

        // Je change la couleur des boutons
        btnRegister.classList.replace('btn-outline', 'btn-primary');
        btnRegister.setAttribute('aria-pressed', 'true');

        btnLogin.classList.replace('btn-primary', 'btn-outline');
        btnLogin.setAttribute('aria-pressed', 'false');
    };

    // Quand on clique sur les boutons, j'appelle la bonne fonction
    btnLogin.addEventListener('click', showLogin);
    btnRegister.addEventListener('click', showRegister);

    // --- Formulaire d'inscription ---
    registerForm.addEventListener('submit', function (event) {
        // J'empêche le navigateur de recharger la page ou d'aller vers un fichier PHP
        event.preventDefault();

        // Je récupère ce que l'utilisateur a tapé
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        const errors = []; // Je prépare une liste d'erreurs vide

        // Je vérifie chaque règle une par une (en français simple)
        if (!email || !email.includes('@')) errors.push('Email invalide.');
        if (password.length < 8) errors.push('Le mot de passe doit contenir au moins 8 caractères.');
        if (password !== passwordConfirm) errors.push('Les mots de passe ne correspondent pas.');

        // Je regarde si cet email existe déjà dans la fausse base de données
        const currentDb = authService.checkUsersDb();
        if (currentDb.find(function(u) { return u.email === email; })) {
            errors.push('Cette adresse email est déjà utilisée.');
        }

        // S'il y a des erreurs, je les affiche et je m'arrête
        if (errors.length > 0) {
            const errorMsg = errors.join(' ');
            if (registerMessage) registerMessage.textContent = errorMsg;
            if (registerMessage) registerMessage.className = 'auth-message error';
            notifications.error(errorMsg);
        } else {
            // Sinon je crée une vraie fiche utilisateur complète (comme dans /data/users-data.js)
            // Je mets un nom/prénom par défaut à partir de l'email, et la date d'aujourd'hui
            const now = new Date().toLocaleDateString('fr-FR');
            const prefix = email.split('@')[0];
            const parts = prefix.split(/[._-]/);
            const newUser = {
                id: Date.now(), // id unique avec l'heure
                nom: (parts[0] || "Utilisateur").charAt(0).toUpperCase() + (parts[0] || "Utilisateur").slice(1), // premier morceau de l'email
                prenom: (parts[1] || "Nouveau").charAt(0).toUpperCase() + (parts[1] || "Nouveau").slice(1), // deuxième morceau ou Nouveau
                email: email,
                password: password,
                role: 'user',
                created: now,
                modified: now
            };
            // J'enregistre via le service (qui écrit dans STORAGE_KEYS.users = /data/users-data.js en local)
            authService.saveUser(newUser);
            const successMsg = 'Inscription réussie ! Connexion en cours...';
            if (registerMessage) registerMessage.textContent = successMsg;
            if (registerMessage) registerMessage.className = 'auth-message success';
            notifications.success(successMsg);
            
            // Je connecte directement l'utilisateur (je crée une session avec son rôle)
            authService.login(newUser.email, { role: newUser.role, id: newUser.id });
            // S'il voulait ajouter une orchidée avant de se connecter, je le renvoie à l'encyclopédie
            const pending = readString(STORAGE_KEYS.pendingOrchid);
            if (pending) {
                remove(STORAGE_KEYS.pendingOrchid);
                window.location.href = 'encyclopedie.html';
            } else {
                window.location.href = 'macollection.html';
            }

        }
    });

    // --- Formulaire de connexion ---
    loginForm.addEventListener('submit', function (event) {
        // J'empêche le navigateur d'aller vers un fichier PHP
        event.preventDefault();

        // Je récupère email et mot de passe tapés
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errors = [];

        // Vérification simple : les champs ne doivent pas être vides
        if (!email || !password) errors.push('Veuillez remplir tous les champs.');

        // Je cherche l'utilisateur dans la fausse base
        const currentDb = authService.checkUsersDb();
        const user = currentDb.find(function(u) { return u.email === email && u.password === password; });

        // Si je ne le trouve pas, c'est que les identifiants sont faux
        if (!user) {
            errors.push('Identifiants incorrects.');
        }

        // J'affiche les erreurs s'il y en a
        if (errors.length > 0) {
            const errorMsg = errors.join(' ');
            if (loginMessage) loginMessage.textContent = errorMsg;
            if (loginMessage) loginMessage.className = 'auth-message error';
            notifications.error(errorMsg);
        } else {
            // Sinon connexion réussie
            const successMsg = 'Connexion réussie !';
            if (loginMessage) loginMessage.textContent = successMsg;
            if (loginMessage) loginMessage.className = 'auth-message success';
            notifications.success(successMsg);
            
            // Je crée la session (je dis au site : "cette personne est connectée")
            authService.login(user.email, { role: user.role });
            const pending = readString(STORAGE_KEYS.pendingOrchid);
            if (pending) {
                remove(STORAGE_KEYS.pendingOrchid);
                window.location.href = 'encyclopedie.html';
            } else {
                window.location.href = 'macollection.html';
            }

        }
    });

}
