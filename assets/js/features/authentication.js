import * as authService from '../services/auth-service.js';
import * as notifications from '../core/notifications.js';
import { STORAGE_KEYS, readString, remove, writeJson } from '../core/storage.js';

// ===========================================================================
// FICHIER : features/authentication.js — Double formulaire connexion/inscription
// ===========================================================================
// J'ai conçu ce module comme une authentification 100% locale le temps du MVP.
// Pourquoi locale ? Parce que je n'ai pas encore de back-end PHP/Supabase, mais
// je voulais déjà valider le parcours utilisateur complet. Toute la logique
// est donc stockée dans le localStorage via auth-service.js et sera remplacée
// par des appels fetch() en Phase 3 sans toucher à l'interface.

export function initAuthentication() {
    // Je récupère les deux boutons qui permettent de basculer entre les vues.
    // Pourquoi deux boutons et non deux pages ? Pour garder l'utilisateur sur la
    // même URL et offrir une transition fluide, conforme aux attentes UX modernes.
    const btnLogin = document.getElementById('btn-show-login');
    const btnRegister = document.getElementById('btn-show-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    // Ces deux zones m'affichent les messages d'erreur/succès sous chaque formulaire.
    // J'utilise textContent pour éviter le XSS, comme expliqué dans search.js.
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // Si je ne suis pas sur la page authentification (ex: accueil), je sors proprement.
    // C'est une garde-fou indispensable car ce module est chargé globalement via app.js.
    if (!btnLogin || !btnRegister || !loginForm || !registerForm) return;

    // J'affiche le formulaire de connexion et je masque celui d'inscription.
    // Pourquoi j'utilise l'attribut hidden et aria-pressed ? Pour l'accessibilité :
    // hidden retire sémantiquement le formulaire du flux, et aria-pressed="true"
    // indique aux lecteurs d'écran quel onglet est actif (critère RGAA 7.1).
    const showLogin = () => {
        loginForm.removeAttribute('hidden');
        registerForm.setAttribute('hidden', 'true');

        btnLogin.classList.replace('btn-outline', 'btn-primary');
        btnLogin.setAttribute('aria-pressed', 'true');

        btnRegister.classList.replace('btn-primary', 'btn-outline');
        btnRegister.setAttribute('aria-pressed', 'false');
    };

    // Même logique inversée pour l'inscription. J'ai factorisé pour ne pas dupliquer
    // le code de bascule d'état visuel et sémantique.
    const showRegister = () => {
        registerForm.removeAttribute('hidden');
        loginForm.setAttribute('hidden', 'true');

        btnRegister.classList.replace('btn-outline', 'btn-primary');
        btnRegister.setAttribute('aria-pressed', 'true');

        btnLogin.classList.replace('btn-primary', 'btn-outline');
        btnLogin.setAttribute('aria-pressed', 'false');
    };

    btnLogin.addEventListener('click', showLogin);
    btnRegister.addEventListener('click', showRegister);

    // Je gère la soumission du formulaire d'inscription. Pourquoi un addEventListener
    // sur 'submit' et non sur le bouton ? Pour intercepter aussi l'envoi via la
    // touche Entrée, garantissant une accessibilité clavier complète.
    registerForm.addEventListener('submit', function (event) {
        // J'empêche le rechargement natif du navigateur. Sans preventDefault(), la
        // page se rechargerait et je perdrais l'état de ma validation JS.
        event.preventDefault();

        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        const errors = [];

        // Je valide chaque règle métier une par une. Pourquoi en français et avec
        // des messages explicites ? Pour que l'utilisateur comprenne immédiatement
        // ce qu'il doit corriger, critère d'accessibilité et d'UX.
        if (!email || !email.includes('@')) errors.push('Email invalide.');
        if (password.length < 8) errors.push('Le mot de passe doit contenir au moins 8 caractères.');
        if (password !== passwordConfirm) errors.push('Les mots de passe ne correspondent pas.');

        // Je vérifie l'unicité de l'email dans ma fausse table users via le service.
        // C'est l'équivalent d'un SELECT WHERE email = ... avant un INSERT.
        const currentDb = authService.checkUsersDb();
        if (currentDb.find(function(u) { return u.email === email; })) {
            errors.push('Cette adresse email est déjà utilisée.');
        }

        // Si des erreurs existent, je les affiche à deux endroits : dans la zone
        // dédiée du formulaire (textContent sécurisé) et en toast d'alerte.
        if (errors.length > 0) {
            const errorMsg = errors.join(' ');
            if (registerMessage) registerMessage.textContent = errorMsg;
            if (registerMessage) registerMessage.className = 'auth-message error';
            notifications.error(errorMsg);
        } else {
            // Je crée une fiche utilisateur complète. Pourquoi générer nom/prénom
            // à partir de l'email ? Pour fournir une valeur par défaut même si
            // l'utilisateur ne remplit que l'email, tout en restant personnalisé.
            const now = new Date().toLocaleDateString('fr-FR');
            const prefix = email.split('@')[0];
            const parts = prefix.split(/[._-]/);
            const newUser = {
                id: Date.now(),
                nom: (parts[0] || "Utilisateur").charAt(0).toUpperCase() + (parts[0] || "Utilisateur").slice(1),
                prenom: (parts[1] || "Nouveau").charAt(0).toUpperCase() + (parts[1] || "Nouveau").slice(1),
                email: email,
                password: password,
                role: 'user',
                created: now,
                modified: now
            };
            // J'enregistre via le service qui fait un INSERT dans db.from('users').
            authService.saveUser(newUser);
            const successMsg = 'Inscription réussie ! Connexion en cours...';
            if (registerMessage) registerMessage.textContent = successMsg;
            if (registerMessage) registerMessage.className = 'auth-message success';
            notifications.success(successMsg);
            
            // Je connecte directement l'utilisateur après inscription : c'est une
            // bonne UX qui évite de lui redemander ses identifiants.
            authService.login(newUser.email, { role: newUser.role, id: newUser.id });
            // Si l'utilisateur voulait ajouter une orchidée avant de s'inscrire,
            // je le redirige vers l'encyclopédie pour finaliser son intention.
            const pending = readString(STORAGE_KEYS.pendingOrchid);
            if (pending) {
                remove(STORAGE_KEYS.pendingOrchid);
                window.location.href = 'encyclopedie.html';
            } else {
                window.location.href = 'macollection.html';
            }

        }
    });

    // Je gère la connexion. La logique est volontairement miroir de l'inscription
    // pour rester cohérente et prévisible.
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errors = [];

        if (!email || !password) errors.push('Veuillez remplir tous les champs.');

        // Je cherche l'utilisateur avec une correspondance exacte email + password.
        // En production, ce sera un appel Supabase Auth avec hachage, mais ici je
        // simule en clair pour le MVP.
        const currentDb = authService.checkUsersDb();
        const user = currentDb.find(function(u) { return u.email === email && u.password === password; });

        if (!user) {
            errors.push('Identifiants incorrects.');
        }

        if (errors.length > 0) {
            const errorMsg = errors.join(' ');
            if (loginMessage) loginMessage.textContent = errorMsg;
            if (loginMessage) loginMessage.className = 'auth-message error';
            notifications.error(errorMsg);
        } else {
            const successMsg = 'Connexion réussie !';
            if (loginMessage) loginMessage.textContent = successMsg;
            if (loginMessage) loginMessage.className = 'auth-message success';
            notifications.success(successMsg);
            
            // Je crée la session côté client : désormais isAuthenticated() renverra true.
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
