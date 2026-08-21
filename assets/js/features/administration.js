import { getElement, createElement, replaceChildren } from '../core/dom.js';
import * as authService from '../services/auth-service.js';
import { getAllOrchids } from '../services/orchid-service.js';
import { getAllConseils } from '../services/conseil-service.js';
import * as modalManager from '../core/modal.js';
import * as notifications from '../core/notifications.js';

// admin.js — Gestion de la page Administration
// ===========================================

export function initAdministration() {
    const orchids = getAllOrchids();
    const users = authService.checkUsersDb();
    
    // Notifications simulées (à déplacer dans un service plus tard)
    let notificationsDb = JSON.parse(localStorage.getItem('mo_notifications'));
    if (!notificationsDb) {
        notificationsDb = [
            { id: 1, date: "01/04/2026", message: "Rappel arrosage Acacalis Cynea" },
            { id: 2, date: "02/04/2026", message: "Inscription de J. Martin" },
            { id: 3, date: "10/04/2026", message: "Nouvelle fiche proposée" }
        ];
        localStorage.setItem('mo_notifications', JSON.stringify(notificationsDb));
    }

    // --- 2. PEUPLEMENT DU DASHBOARD ---
    populateDashboard(users, orchids, notificationsDb);

    // --- 3. PEUPLEMENT DES TABLEAUX ---
    populateEncyclopediaTable(orchids);
    populateNotificationsTable(notificationsDb);

    // --- 4. GESTION DES MODALES ---
    setupModals();
}

    /**
     * Met à jour les compteurs du tableau de bord.
     */
    function populateDashboard(users, orchids, notifications) {
        // Utilisateurs
        document.getElementById('stat-users-total').textContent = users.length;
        document.getElementById('stat-users-monthly').textContent = "1";
        document.getElementById('stat-users-weekly').textContent = "0";
        document.getElementById('stat-users-active').textContent = "453";

        // Plantes
        document.getElementById('stat-plants-total').textContent = orchids.length;
        document.getElementById('stat-plants-phare').textContent = "ACACALIS";
        document.getElementById('stat-plants-owned').textContent = "10";
        document.getElementById('stat-plants-rare').textContent = "BARLIA";

        // Activités
        document.getElementById('stat-act-pending').textContent = "20";
        document.getElementById('stat-act-advices').textContent = getAllConseils().length;
        document.getElementById('stat-act-approved').textContent = "15";
        document.getElementById('stat-act-rejected').textContent = "5";
    }

    /**
     * Remplit la table de gestion de l'encyclopédie.
     */
    function populateEncyclopediaTable(orchids) {
        const container = document.getElementById('admin-encyclopedia-list');
        if (!container) return;

        replaceChildren(container);

        orchids.forEach(function (orchid) {
            const row = document.createElement('div');
            row.className = 'admin-table-row';
            
            const colNom = document.createElement('div');
            colNom.className = 'col-nom';
            colNom.title = orchid.name;
            colNom.textContent = orchid.name;

            const colEtat = document.createElement('div');
            colEtat.className = 'col-etat';
            colEtat.textContent = orchid.behavior || 'N/A';

            const colOrigines = document.createElement('div');
            colOrigines.className = 'col-origines';
            colOrigines.title = orchid.origin || '';
            colOrigines.textContent = orchid.origin || 'N/A';

            const colDecouverte = document.createElement('div');
            colDecouverte.className = 'col-decouverte';
            colDecouverte.title = orchid.discovered || '';
            colDecouverte.textContent = orchid.discovered || 'N/A';

            const colActions = document.createElement('div');
            colActions.className = 'col-actions';

            const viewBtn = document.createElement('button');
            viewBtn.type = 'button';
            viewBtn.className = 'action-btn view-btn';
            viewBtn.setAttribute('aria-label', 'Voir ' + orchid.name);
            viewBtn.setAttribute('data-id', orchid.id);
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fa-solid fa-eye';
            viewBtn.appendChild(viewIcon);

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'action-btn edit-btn';
            editBtn.setAttribute('aria-label', 'Editer ' + orchid.name);
            editBtn.setAttribute('data-id', orchid.id);
            const editIcon = document.createElement('i');
            editIcon.className = 'fa-solid fa-pen-to-square';
            editBtn.appendChild(editIcon);

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.setAttribute('aria-label', 'Supprimer ' + orchid.name);
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fa-solid fa-trash';
            deleteBtn.appendChild(deleteIcon);

            colActions.appendChild(viewBtn);
            colActions.appendChild(editBtn);
            colActions.appendChild(deleteBtn);

            row.appendChild(colNom);
            row.appendChild(colEtat);
            row.appendChild(colOrigines);
            row.appendChild(colDecouverte);
            row.appendChild(colActions);

            container.appendChild(row);

            // Evénements d'actions

            viewBtn.addEventListener('click', function() {
                openModerateModal(orchid, 'view');
            });
            editBtn.addEventListener('click', function() {
                openModerateModal(orchid, 'moderate');
            });
            deleteBtn.addEventListener('click', function() {
                if(confirm("Confirmez-vous la suppression de " + orchid.name + " ?")) {
                    notifications.success("Orchidée supprimée avec succès.");
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

        replaceChildren(container);
        
        notifications.forEach(function (notif) {
            const row = document.createElement('div');
            row.className = 'admin-table-row';
            
            const colDate = document.createElement('div');
            colDate.className = 'col-date';
            colDate.textContent = notif.date;

            const colNotif = document.createElement('div');
            colNotif.className = 'col-notif';
            colNotif.title = notif.text;
            colNotif.textContent = notif.text;

            const colActions = document.createElement('div');
            colActions.className = 'col-actions';

            const viewBtn = document.createElement('button');
            viewBtn.type = 'button';
            viewBtn.className = 'action-btn view-btn';
            viewBtn.setAttribute('aria-label', 'Voir');
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fa-solid fa-eye';
            viewBtn.appendChild(viewIcon);

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.setAttribute('aria-label', 'Supprimer');
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fa-solid fa-trash';
            deleteBtn.appendChild(deleteIcon);

            colActions.appendChild(viewBtn);
            colActions.appendChild(deleteBtn);

            row.appendChild(colDate);
            row.appendChild(colNotif);
            row.appendChild(colActions);
            container.appendChild(row);

            deleteBtn.addEventListener('click', function() {
                row.remove();
                notifications.success("Notification supprimée.");
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
                if(window.AppToast) notifications.success("Utilisateur mis à jour avec succès.");
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
                if(window.AppToast) notifications.success("Fiche approuvée !");
            });
            document.getElementById('btn-reject-orchid').addEventListener('click', () => {
                closeModal(modalMod);
                if(window.AppToast) notifications.warning("Fiche rejetée.");
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
                if(window.AppToast) notifications.success("Conseil ajouté à l'encyclopédie.");
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

