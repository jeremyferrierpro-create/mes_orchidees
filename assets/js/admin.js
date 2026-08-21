// admin.js — Gestion de la page Administration
// ===========================================

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // --- 1. INITIALISATION DES DONNÉES (MOCKS) ---
        initMockData();

        const orchids = window.orchidsDatabase || [];
        const users = JSON.parse(localStorage.getItem('mo_users_list')) || [];
        const notifications = JSON.parse(localStorage.getItem('mo_notifications')) || [];

        // --- 2. PEUPLEMENT DU DASHBOARD ---
        populateDashboard(users, orchids, notifications);

        // --- 3. PEUPLEMENT DES TABLEAUX ---
        populateEncyclopediaTable(orchids);
        populateNotificationsTable(notifications);

        // --- 4. GESTION DES MODALES ---
        setupModals();
    });

    /**
     * Initialise les données fictives pour le fonctionnement sans backend.
     */
    function initMockData() {
        // Utilisateurs (Personas)
        if (!localStorage.getItem('mo_users_list')) {
            const mockUsers = [
                { id: 1, nom: "Dupont", prenom: "Jean-Marc", email: "jeanmarc.expert@orchids.fr", role: "admin", created: "15/01/2026", modified: "01/04/2026" },
                { id: 2, nom: "Martin", prenom: "Jessica", email: "jessica.amateur@gmail.com", role: "user", created: "03/02/2026", modified: "10/05/2026" }
            ];
            localStorage.setItem('mo_users_list', JSON.stringify(mockUsers));
        }

        // Notifications
        if (!localStorage.getItem('mo_notifications')) {
            const mockNotifs = [
                { id: 1, date: "06/08/2026", text: "Nouvelle proposition d'orchidée : Vanilla planifolia" },
                { id: 2, date: "07/08/2026", text: "Nouvel utilisateur inscrit (Jessica)" },
                { id: 3, date: "07/08/2026", text: "Nouvelle proposition d'orchidée : Bletilla" },
                { id: 4, date: "07/08/2026", text: "Nouvel utilisateur inscrit (Jean-Marc)" }
            ];
            localStorage.setItem('mo_notifications', JSON.stringify(mockNotifs));
        }
    }

    /**
     * Met à jour les compteurs du tableau de bord.
     */
    function populateDashboard(users, orchids, notifications) {
        // Utilisateurs
        document.getElementById('stat-users-total').textContent = users.length;
        document.getElementById('stat-users-monthly').textContent = "1";
        document.getElementById('stat-users-weekly').textContent = "0";
        document.getElementById('stat-users-active').textContent = users.length;

        // Plantes
        document.getElementById('stat-plants-total').textContent = orchids.length;
        document.getElementById('stat-plants-phare').textContent = "ACACALIS";
        document.getElementById('stat-plants-owned').textContent = "2";
        document.getElementById('stat-plants-rare').textContent = "BARLIA";

        // Activités
        document.getElementById('stat-act-pending').textContent = "1";
        document.getElementById('stat-act-advices').textContent = (window.conseilsDatabase ? window.conseilsDatabase.length : 0);
        document.getElementById('stat-act-approved').textContent = "15";
        document.getElementById('stat-act-rejected').textContent = "2";
    }

    /**
     * Remplit la table de gestion de l'encyclopédie.
     */
    function populateEncyclopediaTable(orchids) {
        const container = document.getElementById('admin-encyclopedia-list');
        if (!container) return;

        container.innerHTML = '';

        orchids.forEach(function (orchid) {
            const row = document.createElement('div');
            row.className = 'admin-table-row';
            
            row.innerHTML = `
                <div class="col-nom" title="${orchid.name}">${orchid.name}</div>
                <div class="col-etat">${orchid.behavior || 'N/A'}</div>
                <div class="col-origines" title="${orchid.origin}">${orchid.origin || 'N/A'}</div>
                <div class="col-decouverte" title="${orchid.discovered}">${orchid.discovered || 'N/A'}</div>
                <div class="col-actions">
                    <button type="button" class="action-btn view-btn" aria-label="Voir ${orchid.name}" data-id="${orchid.id}"><i class="fa-solid fa-eye"></i></button>
                    <button type="button" class="action-btn edit-btn" aria-label="Editer ${orchid.name}" data-id="${orchid.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button type="button" class="action-btn delete-btn" aria-label="Supprimer ${orchid.name}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            container.appendChild(row);

            // Evénements d'actions
            const viewBtn = row.querySelector('.view-btn');
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');

            viewBtn.addEventListener('click', function() {
                openModerateModal(orchid, 'view');
            });
            editBtn.addEventListener('click', function() {
                openModerateModal(orchid, 'moderate');
            });
            deleteBtn.addEventListener('click', function() {
                if(confirm("Confirmez-vous la suppression de " + orchid.name + " ?")) {
                    if(window.AppToast) window.AppToast.success("Orchidée supprimée avec succès.");
                }
            });
        });
    }

    /**
     * Remplit la table des notifications.
     */
    function populateNotificationsTable(notifications) {
        const container = document.getElementById('admin-notifications-list');
        if (!container) return;

        container.innerHTML = '';
        
        notifications.forEach(function (notif) {
            const row = document.createElement('div');
            row.className = 'admin-table-row';
            
            row.innerHTML = `
                <div class="col-date">${notif.date}</div>
                <div class="col-notif" title="${notif.text}">${notif.text}</div>
                <div class="col-actions">
                    <button type="button" class="action-btn view-btn" aria-label="Voir"><i class="fa-solid fa-eye"></i></button>
                    <button type="button" class="action-btn delete-btn" aria-label="Supprimer"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.appendChild(row);

            row.querySelector('.delete-btn').addEventListener('click', function() {
                row.remove();
                if(window.AppToast) window.AppToast.success("Notification supprimée.");
            });
        });
    }

    /**
     * Configuration globale des modales.
     */
    function setupModals() {
        // --- 1. MODALE UTILISATEUR ---
        const modalUser = document.getElementById('modal-user-form');
        const btnManageUsers = document.getElementById('btn-manage-users');
        const btnCancelUser = document.getElementById('btn-cancel-user');
        const userForm = document.getElementById('admin-user-form');

        if (btnManageUsers) {
            btnManageUsers.addEventListener('click', function() {
                // Pour la démo, on ouvre la modale avec le premier utilisateur
                const users = JSON.parse(localStorage.getItem('mo_users_list')) || [];
                if(users.length > 0) openUserModal(users[0]);
            });
        }
        
        if (btnCancelUser) btnCancelUser.addEventListener('click', () => closeModal(modalUser));
        if (modalUser) {
            modalUser.querySelector('.modal-close').addEventListener('click', () => closeModal(modalUser));
            modalUser.addEventListener('click', (e) => { if(e.target === modalUser) closeModal(modalUser); });
            userForm.addEventListener('submit', function(e) {
                e.preventDefault();
                closeModal(modalUser);
                if(window.AppToast) window.AppToast.success("Utilisateur mis à jour avec succès.");
            });
        }

        // --- 2. MODALE MODERATION ---
        const modalMod = document.getElementById('modal-moderate-orchid');
        const btnModerate = document.getElementById('btn-moderate-orchid');
        if (btnModerate) {
            btnModerate.addEventListener('click', function() {
                // Simule l'ouverture d'une orchidée en attente (Vanilla)
                const dummyOrchid = {
                    name: "VANILLA PLANIFOLIA", vernacular: "VANILLIER", behavior: "Grimpante", origin: "Mexique",
                    discovered: "Charles Plumier (1703)", img: "./assets/images/site/hero-bg.jpg",
                    shortDesc: "Liane produisant la gousse de vanille.", longDesc: "Nécessite beaucoup de chaleur...",
                    order: "Asparagales", species: "Planifolia", genre: "Vanilla", family: "Orchidaceae", subfamily: "Vanilloideae", tribu: "Vanilleae", subtribu: "Vanillinae"
                };
                openModerateModal(dummyOrchid, 'moderate');
            });
        }
        if (modalMod) {
            modalMod.querySelector('.modal-close').addEventListener('click', () => closeModal(modalMod));
            modalMod.addEventListener('click', (e) => { if(e.target === modalMod) closeModal(modalMod); });
            document.getElementById('btn-approve-orchid').addEventListener('click', () => {
                closeModal(modalMod);
                if(window.AppToast) window.AppToast.success("Fiche approuvée !");
            });
            document.getElementById('btn-reject-orchid').addEventListener('click', () => {
                closeModal(modalMod);
                if(window.AppToast) window.AppToast.warning("Fiche rejetée.");
            });
        }

        // --- 3. MODALE AJOUT CONSEIL ---
        const modalAdvice = document.getElementById('modal-add-advice');
        const btnAddAdvice = document.getElementById('btn-add-advice');
        const adviceForm = document.getElementById('admin-advice-form');
        const btnCancelAdvice = document.getElementById('btn-cancel-advice');
        
        if (btnAddAdvice) {
            btnAddAdvice.addEventListener('click', () => openAdviceModal());
        }
        if (btnCancelAdvice) btnCancelAdvice.addEventListener('click', () => closeModal(modalAdvice));
        if (modalAdvice) {
            modalAdvice.querySelector('.modal-close').addEventListener('click', () => closeModal(modalAdvice));
            modalAdvice.addEventListener('click', (e) => { if(e.target === modalAdvice) closeModal(modalAdvice); });
            adviceForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Simulation d'ajout dans conseilsDatabase (ne sera persistant que si on stocke dans localStorage, ici on simule pour l'UI)
                closeModal(modalAdvice);
                if(window.AppToast) window.AppToast.success("Conseil ajouté à l'encyclopédie.");
                adviceForm.reset();
            });
        }
        
        // Echap pour fermer
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
            }
        });
    }

    let lastFocusedElement = null;

    function openUserModal(user) {
        const modal = document.getElementById('modal-user-form');
        if (!modal) return;
        lastFocusedElement = document.activeElement;

        document.getElementById('user-nom').value = user.nom;
        document.getElementById('user-prenom').value = user.prenom;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-created-date').textContent = "Créé le : " + user.created;
        document.getElementById('user-modified-date').textContent = "Modifié le : " + user.modified;

        openModal(modal);
    }

    function openModerateModal(orchid, mode) {
        const modal = document.getElementById('modal-moderate-orchid');
        if (!modal) return;
        lastFocusedElement = document.activeElement;

        document.getElementById('modal-mod-title').textContent = orchid.name;
        document.getElementById('mod-orchid-scientific').textContent = orchid.name;
        document.getElementById('mod-orchid-vernacular').textContent = orchid.vernacular || '';
        document.getElementById('mod-orchid-short').textContent = orchid.shortDesc || '';
        document.getElementById('mod-orchid-long').textContent = orchid.longDesc || '';
        document.getElementById('mod-orchid-img').src = orchid.img || '';

        document.getElementById('mod-spec-ordre').textContent = orchid.order || '-';
        document.getElementById('mod-spec-espece').textContent = orchid.species || '-';
        document.getElementById('mod-spec-genre').textContent = orchid.genre || '-';
        document.getElementById('mod-spec-famille').textContent = orchid.family || '-';
        document.getElementById('mod-spec-subfamily').textContent = orchid.subfamily || '-';
        document.getElementById('mod-spec-tribu').textContent = orchid.tribu || '-';
        document.getElementById('mod-spec-subtribu').textContent = orchid.subtribu || '-';
        document.getElementById('mod-spec-behavior').textContent = orchid.behavior || '-';
        document.getElementById('mod-spec-discovered').textContent = orchid.discovered || '-';
        document.getElementById('mod-spec-origin').textContent = orchid.origin || '-';

        const actionsContainer = modal.querySelector('.admin-mod-actions');
        if (mode === 'view') {
            actionsContainer.style.display = 'none';
        } else {
            actionsContainer.style.display = 'flex';
        }

        openModal(modal);
    }

    function openAdviceModal() {
        const modal = document.getElementById('modal-add-advice');
        if (!modal) return;
        lastFocusedElement = document.activeElement;
        document.getElementById('admin-advice-form').reset();
        openModal(modal);
    }

    function openModal(modal) {
        if (window.ModalManager) {
            window.ModalManager.open(modal, lastFocusedElement);
        }
    }

    function closeModal(modal) {
        if (window.ModalManager) {
            window.ModalManager.close(modal);
        }
    }

})();
