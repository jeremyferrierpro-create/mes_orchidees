import { getElement } from '../core/dom.js';
import * as authService from '../services/auth-service.js';
import * as notifications from '../core/notifications.js';
import { STORAGE_KEYS, readString, remove } from '../core/storage.js';

// ==========================================================================
// GESTION DE L'AUTHENTIFICATION (BASCULE CONNEXION / INSCRIPTION)
// ==========================================================================

export function initAuthentication() {
    const btnLogin = document.getElementById('btn-show-login');
    const btnRegister = document.getElementById('btn-show-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (!btnLogin || !btnRegister || !loginForm || !registerForm) return;

    // Fonction pour afficher le formulaire de connexion
    const showLogin = () => {
        // Gestion de l'affichage des formulaires
        loginForm.removeAttribute('hidden');
        registerForm.setAttribute('hidden', 'true');

        // Mise à jour de l'apparence des boutons (classes et accessibilité)
        btnLogin.classList.replace('btn-outline', 'btn-primary');
        btnLogin.setAttribute('aria-pressed', 'true');

        btnRegister.classList.replace('btn-primary', 'btn-outline');
        btnRegister.setAttribute('aria-pressed', 'false');
    };

    // Fonction pour afficher le formulaire d'inscription
    const showRegister = () => {
        // Gestion de l'affichage des formulaires
        registerForm.removeAttribute('hidden');
        loginForm.setAttribute('hidden', 'true');

        // Mise à jour de l'apparence des boutons (classes et accessibilité)
        btnRegister.classList.replace('btn-outline', 'btn-primary');
        btnRegister.setAttribute('aria-pressed', 'true');

        btnLogin.classList.replace('btn-primary', 'btn-outline');
        btnLogin.setAttribute('aria-pressed', 'false');
    };

    // Écouteurs d'événements
    btnLogin.addEventListener('click', showLogin);
    btnRegister.addEventListener('click', showRegister);

// --- Formulaire d'inscription ---
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        const errors = [];

        if (!email || !email.includes('@')) errors.push('Email invalide.');
        if (password.length < 8) errors.push('Le mot de passe doit contenir au moins 8 caractères.');
        if (password !== passwordConfirm) errors.push('Les mots de passe ne correspondent pas.');

        const currentDb = authService.checkUsersDb();
        if (currentDb.find(function(u) { return u.email === email; })) {
            errors.push('Cette adresse email est déjà utilisée.');
        }

        if (errors.length > 0) {
            const errorMsg = errors.join(' ');
            if (registerMessage) registerMessage.textContent = errorMsg;
            if (registerMessage) registerMessage.className = 'auth-message error';
            notifications.error(errorMsg);
        } else {
            currentDb.push({ email: email, password: password, role: 'user' });
            localStorage.setItem('mo_users_db', JSON.stringify(currentDb));
            const successMsg = 'Inscription réussie ! Connexion en cours...';
            if (registerMessage) registerMessage.textContent = successMsg;
            if (registerMessage) registerMessage.className = 'auth-message success';
            notifications.success(successMsg);
            
            
            authService.login(email, { role: 'user' });
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
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errors = [];

        if (!email || !password) errors.push('Veuillez remplir tous les champs.');

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
