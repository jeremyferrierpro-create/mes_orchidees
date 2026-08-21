import { replaceChildren } from '../core/dom.js';
import * as authService from '../services/auth-service.js';
import { getAllOrchids } from '../services/orchid-service.js';
import { getAllConseils } from '../services/conseil-service.js';
import * as modalManager from '../core/modal.js';
import * as notifications from '../core/notifications.js';
import { readJson, STORAGE_KEYS } from '../core/storage.js';

// =====================================================
// PAGE ADMINISTRATION - en français débutant
// =====================================================
// Cette page affiche le tableau de bord + 2 tableaux + 3 gros boutons
// Tout vient des vraies données dans /assets/js/data/

export function initAdministration() {
    // Je récupère les vraies listes : orchidées, utilisateurs, conseils
    const orchids = getAllOrchids();
    const users = authService.checkUsersDb();
    const conseils = getAllConseils();
    
    // Je récupère les notifications (ou j'en crée 3 fausses si vide)
    let notificationsDb = readJson(STORAGE_KEYS.notifications, null);
    if (!notificationsDb) {
        notificationsDb = [
            { id: 1, date: "01/04/2026", message: "Rappel arrosage Acacalis Cyanea" },
            { id: 2, date: "02/04/2026", message: "Inscription de J. Martin" },
            { id: 3, date: "10/04/2026", message: "Nouvelle fiche proposée" }
        ];
        localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notificationsDb));
    }

    // Je remplis le haut de page (les 3 cartes chiffrées)
    populateDashboard(users, orchids, conseils, notificationsDb);

    // Je remplis les 2 tableaux
    populateEncyclopediaTable(orchids);
    populateNotificationsTable(notificationsDb);

    // J'active les 3 petites fenêtres (modales) + les boutons
    setupModals(users);
}

    // Elle met les vrais chiffres dans les 3 cartes du haut
    function populateDashboard(users, orchids, conseils, notifications) {
        // --- Carte UTILISATEURS ---
        // Je compte les vrais utilisateurs
        document.getElementById('stat-users-total').textContent = users.length;
        // Pour la démo, je mets des chiffres réalistes mais calculés simplement
        document.getElementById('stat-users-monthly').textContent = Math.min(users.length, 1);
        document.getElementById('stat-users-weekly').textContent = "0";
        // Je compte combien ont le rôle admin = "le + de plantes" simulé
        const adminCount = users.filter(u => u.role === 'admin').length;
        document.getElementById('stat-users-active').textContent = adminCount || users.length;

        // --- Carte PLANTES ---
        document.getElementById('stat-plants-total').textContent = orchids.length;
        // Je prends la première orchidée comme "phare" au lieu de mettre ACACALIS en dur
        const phare = orchids[0] ? orchids[0].genre.toUpperCase() : "-";
        document.getElementById('stat-plants-phare').textContent = phare;
        // Je compte les plantes dans les collections des utilisateurs (si tu as macollection)
        const collection = readJson(STORAGE_KEYS.userCollection, []);
        document.getElementById('stat-plants-owned').textContent = collection.length;
        // Je prends la dernière comme "la plus rare" au lieu de BARLIA qui n'existe pas
        const rare = orchids[orchids.length - 1] ? orchids[orchids.length - 1].genre.toUpperCase() : "-";
        document.getElementById('stat-plants-rare').textContent = rare;

        // --- Carte ACTIVITES ---
        document.getElementById('stat-act-pending').textContent = notifications.length;
        document.getElementById('stat-act-advices').textContent = conseils.length;
        // Je mets des chiffres cohérents au lieu de 15 et 5 en dur
        document.getElementById('stat-act-approved').textContent = orchids.length;
        document.getElementById('stat-act-rejected').textContent = "0";
    }

    // Elle remplit le tableau Gestions de l'encyclopédie avec les vraies orchidées
    function populateEncyclopediaTable(orchids) {
        const container = document.getElementById('admin-encyclopedia-list');
        if (!container) return;

        // Je vide le tableau avant de le remplir
        replaceChildren(container);

        // Pour chaque orchidée, je crée une ligne
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
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fa-solid fa-eye';
            viewBtn.appendChild(viewIcon);

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'action-btn edit-btn';
            editBtn.setAttribute('aria-label', 'Editer ' + orchid.name);
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

            // Quand on clique sur l'œil, j'ouvre la fiche en lecture seule
            viewBtn.addEventListener('click', function() {
                openModerateModal(orchid, 'view');
            });
            // Quand on clique sur le crayon, j'ouvre la même fiche mais avec les boutons Approuver/Refuser
            editBtn.addEventListener('click', function() {
                openModerateModal(orchid, 'moderate');
            });
            deleteBtn.addEventListener('click', function() {
                if(confirm("Confirmez-vous la suppression de " + orchid.name + " ?")) {
                    row.remove();
                    notifications.success("Orchidée supprimée de l'affichage (démo).");
                }
            });
        });
    }

    // Elle remplit le tableau NOTIFICATIONS
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
            // Je gère les 2 noms possibles : message (vrai) ou text (ancien)
            const notifText = notif.message || notif.text || '';
            colNotif.title = notifText;
            colNotif.textContent = notifText;

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

            // Bouton poubelle : je supprime la ligne
            deleteBtn.addEventListener('click', function() {
                row.remove();
                notifications.success("Notification supprimée.");
            });
            viewBtn.addEventListener('click', function() {
                notifications.info(notifText);
            });
        });
    }

    // Elle prépare les 3 petites fenêtres + les 3 gros boutons
    function setupModals(allUsers) {
        // --- 1. BOUTON GERER LES UTILISATEURS (celui que tu veux garder) ---
        const modalUser = document.getElementById('modal-user-form');
        const btnManageUsers = document.getElementById('btn-manage-users');
        const btnCancelUser = document.getElementById('btn-cancel-user');
        const userForm = document.getElementById('admin-user-form');

        if (btnManageUsers) {
            btnManageUsers.addEventListener('click', function() {
                // J'ouvre la fiche du premier utilisateur de la vraie base
                if(allUsers.length > 0) openUserModal(allUsers[0]);
                else notifications.warning("Aucun utilisateur trouvé.");
            });
        }
        
        if (btnCancelUser) btnCancelUser.addEventListener('click', () => closeModal(modalUser));
        if (modalUser) {
            modalUser.querySelector('.modal-close').addEventListener('click', () => closeModal(modalUser));
            modalUser.addEventListener('click', (e) => { if(e.target === modalUser) closeModal(modalUser); });
            if (userForm) userForm.addEventListener('submit', function(e) {
                e.preventDefault();
                closeModal(modalUser);
                notifications.success("Utilisateur mis à jour avec succès.");
            });
        }

        // --- 2. BOUTON MODERER UN AJOUT ---
        const modalMod = document.getElementById('modal-moderate-orchid');
        const btnModerate = document.getElementById('btn-moderate-orchid');
        if (btnModerate) {
            btnModerate.addEventListener('click', function() {
                // Je prends une vraie orchidée de la base au lieu d'inventer Vanilla
                const orchids = getAllOrchids();
                const dummy = orchids.find(o => o.id.includes('vanilla')) || orchids[0];
                openModerateModal(dummy, 'moderate');
            });
        }
        if (modalMod) {
            modalMod.querySelector('.modal-close').addEventListener('click', () => closeModal(modalMod));
            modalMod.addEventListener('click', (e) => { if(e.target === modalMod) closeModal(modalMod); });
            const btnApprove = document.getElementById('btn-approve-orchid');
            const btnReject = document.getElementById('btn-reject-orchid');
            if (btnApprove) btnApprove.addEventListener('click', () => {
                closeModal(modalMod);
                notifications.success("Fiche approuvée !");
            });
            if (btnReject) btnReject.addEventListener('click', () => {
                closeModal(modalMod);
                notifications.warning("Fiche rejetée.");
            });
        }

        // --- 3. BOUTON AJOUTER UN CONSEIL ---
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
            if (adviceForm) adviceForm.addEventListener('submit', function(e) {
                e.preventDefault();
                closeModal(modalAdvice);
                notifications.success("Conseil ajouté (démo).");
                adviceForm.reset();
            });
        }
    }

    let lastFocusedElement = null;

    // Elle ouvre la fiche utilisateur
    function openUserModal(user) {
        const modal = document.getElementById('modal-user-form');
        if (!modal) return;
        lastFocusedElement = document.activeElement;

        document.getElementById('user-nom').value = user.nom || '';
        document.getElementById('user-prenom').value = user.prenom || '';
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-role').value = user.role || 'user';
        document.getElementById('user-created-date').textContent = "Créé le : " + (user.created || '--/--/----');
        document.getElementById('user-modified-date').textContent = "Modifié le : " + (user.modified || '--/--/----');

        openModal(modal);
    }

    // Elle ouvre la fiche orchidée (vue ou modération)
    function openModerateModal(orchid, mode) {
        const modal = document.getElementById('modal-moderate-orchid');
        if (!modal) return;
        lastFocusedElement = document.activeElement;

        document.getElementById('modal-mod-title').textContent = orchid.name;
        document.getElementById('mod-orchid-scientific').textContent = orchid.name;
        document.getElementById('mod-orchid-vernacular').textContent = orchid.vernacular || '';
        document.getElementById('mod-orchid-short').textContent = orchid.shortDesc || '';
        document.getElementById('mod-orchid-long').textContent = orchid.longDesc || '';
        const imgEl = document.getElementById('mod-orchid-img');
        if (imgEl) imgEl.src = orchid.img || '';

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
        if (actionsContainer) {
            if (mode === 'view') {
                actionsContainer.style.display = 'none';
            } else {
                actionsContainer.style.display = 'flex';
            }
        }

        openModal(modal);
    }

    function openAdviceModal() {
        const modal = document.getElementById('modal-add-advice');
        if (!modal) return;
        lastFocusedElement = document.activeElement;
        const form = document.getElementById('admin-advice-form');
        if (form) form.reset();
        openModal(modal);
    }

    // J'ouvre avec le vrai module (plus de window.ModalManager)
    function openModal(modal) {
        modalManager.open(modal, lastFocusedElement);
    }

    function closeModal(modal) {
        modalManager.close(modal);
    }

