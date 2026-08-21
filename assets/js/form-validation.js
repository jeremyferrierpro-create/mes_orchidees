// form-validation.js — Validation du formulaire d'authentification et gestion DB locale
// =====================================================================================

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const btnLogin = document.getElementById('btn-show-login');
    const btnRegister = document.getElementById('btn-show-register');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    if (!loginForm || !registerForm) return;

    // --- Gestion du Toggle ---
    function showForm(type) {
        if (type === 'login') {
            loginForm.hidden = false;
            registerForm.hidden = true;
            btnLogin.className = 'btn btn-primary';
            btnLogin.setAttribute('aria-pressed', 'true');
            btnRegister.className = 'btn btn-outline';
            btnRegister.setAttribute('aria-pressed', 'false');
        } else {
            loginForm.hidden = true;
            registerForm.hidden = false;
            btnLogin.className = 'btn btn-outline';
            btnLogin.setAttribute('aria-pressed', 'false');
            btnRegister.className = 'btn btn-primary';
            btnRegister.setAttribute('aria-pressed', 'true');
        }
    }

    if (btnLogin) btnLogin.addEventListener('click', function() { showForm('login'); });
    if (btnRegister) btnRegister.addEventListener('click', function() { showForm('register'); });

    // --- Helper DB locale ---
    function getDb() {
        return JSON.parse(localStorage.getItem('mo_users_db')) || [];
    }

    function saveDb(db) {
        localStorage.setItem('mo_users_db', JSON.stringify(db));
    }

    function loginUser(email, role) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('mo_user_email', email);
        localStorage.setItem('mo_user_role', role || 'user');
        
        // Redirection avec historique (pour revenir d'où l'on vient)
        const pending = localStorage.getItem('pendingOrchidToAdd');
        if (pending) {
            window.location.href = 'encyclopedie.html';
        } else {
            window.location.href = 'macollection.html';
        }
    }

    // Création admin par défaut si vide
    const db = getDb();
    if (db.length === 0) {
        db.push({ email: 'admin@mesorchidees.fr', password: 'password123', role: 'admin' });
        saveDb(db);
    }

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

        const currentDb = getDb();
        if (currentDb.find(function(u) { return u.email === email; })) {
            errors.push('Cette adresse email est déjà utilisée.');
        }

        if (errors.length > 0) {
            const errorMsg = errors.join(' ');
            if (registerMessage) registerMessage.textContent = errorMsg;
            if (registerMessage) registerMessage.className = 'auth-message error';
            if (window.AppToast) window.AppToast.error(errorMsg);
        } else {
            currentDb.push({ email: email, password: password, role: 'user' });
            saveDb(currentDb);
            const successMsg = 'Inscription réussie ! Connexion en cours...';
            if (registerMessage) registerMessage.textContent = successMsg;
            if (registerMessage) registerMessage.className = 'auth-message success';
            if (window.AppToast) window.AppToast.success(successMsg);
            
            setTimeout(function() { loginUser(email, 'user'); }, 1500);
        }
    });

    // --- Formulaire de connexion ---
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errors = [];

        if (!email || !password) errors.push('Veuillez remplir tous les champs.');

        const currentDb = getDb();
        const user = currentDb.find(function(u) { return u.email === email && u.password === password; });

        if (!user) {
            errors.push('Identifiants incorrects.');
        }

        if (errors.length > 0) {
            const errorMsg = errors.join(' ');
            if (loginMessage) loginMessage.textContent = errorMsg;
            if (loginMessage) loginMessage.className = 'auth-message error';
            if (window.AppToast) window.AppToast.error(errorMsg);
        } else {
            const successMsg = 'Connexion réussie !';
            if (loginMessage) loginMessage.textContent = successMsg;
            if (loginMessage) loginMessage.className = 'auth-message success';
            if (window.AppToast) window.AppToast.success(successMsg);
            
            setTimeout(function() { loginUser(user.email, user.role); }, 1000);
        }
    });
});
