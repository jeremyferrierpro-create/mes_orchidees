// ==========================================================================
// GESTION DE L'AUTHENTIFICATION (BASCULE CONNEXION / INSCRIPTION)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
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
});
