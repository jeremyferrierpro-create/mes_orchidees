// collection.js — Dashboard de gestion de la collection
// ======================================================
// Lit la collection dans localStorage, calcule les stats,
// affiche les fiches, les soins et les conseils.
// À terme : appels fetch() à une API PHP / Supabase.

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const orchidsDatabase = window.orchidsDatabase || [];
        const conseilsDatabase = window.conseilsDatabase || [];
        const userIsAuth = localStorage.getItem('isAuthenticated') === 'true';

        // Éléments du DOM
        const app = document.getElementById('collection-app');
        const guestMessage = document.getElementById('collection-guest-message');
        const grid = document.getElementById('collection-grid');
        const careTableBody = document.getElementById('care-table-body');
        const conseilPreview = document.getElementById('conseil-preview');

        const statTotal = document.getElementById('stat-total');
        const statEpiphytes = document.getElementById('stat-epiphytes');
        const statTerrestres = document.getElementById('stat-terrestres');
        const statHemi = document.getElementById('stat-hemi');

        const climateTemp = document.getElementById('climate-temp');
        const climateHumidity = document.getElementById('climate-humidity');
        const climateLight = document.getElementById('climate-light');

        const dashNotifications = document.getElementById('dash-notifications');

        const editModal = document.getElementById('edit-collection-modal');
        const editModalClose = document.getElementById('edit-modal-close');
        const editModalImg = document.getElementById('edit-modal-img');
        const editModalTitle = document.getElementById('edit-modal-title');
        const editModalShort = document.getElementById('edit-modal-short');
        const editModalFields = document.getElementById('edit-modal-fields');
        const editModalLong = document.getElementById('edit-modal-long');
        const editLocation = document.getElementById('edit-location');
        const editNotes = document.getElementById('edit-notes');
        const editSave = document.getElementById('edit-modal-save');
        const editCancel = document.getElementById('edit-modal-cancel');

        const careModal = document.getElementById('care-modal');
        const careModalClose = document.getElementById('care-modal-close');
        const careModalCancel = document.getElementById('care-modal-cancel');
        const careForm = document.getElementById('care-form');
        const careOrchid = document.getElementById('care-orchid');
        const careDate = document.getElementById('care-date');
        const careEngrais = document.getElementById('care-engrais');
        const careSubstrat = document.getElementById('care-substrat');
        const careRavageurs = document.getElementById('care-ravageurs');
        const careModalHistory = document.getElementById('care-modal-history');

        let userCollection = [];
        let selectedCollectionId = null;
        let editCollectionId = null;

        // ------------------------------------------------------------------
        // Utilitaires
        // ------------------------------------------------------------------

        function escapeHtml(text) {
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function formatDate(dateStr) {
            if (!dateStr) return '—';
            const d = new Date(dateStr);
            if (isNaN(d)) return '—';
            return d.toLocaleDateString('fr-FR');
        }

        function getOrchid(orchidId) {
            return orchidsDatabase.find(function (o) { return o.id === orchidId; });
        }

        function getConseil(orchidId) {
            return conseilsDatabase.find(function (c) { return c.id === 'fiche-' + orchidId; });
        }

        function getCollectionItem(collectionId) {
            return userCollection.find(function (item) { return item.collectionId === collectionId; });
        }

        function normalizeCollection(items) {
            return items.map(function (item, index) {
                if (typeof item === 'string') {
                    const match = getOrchidByName(item);
                    return buildCollectionItem(match || { id: item.toLowerCase().replace(/[^a-z0-9]+/g, '-') }, item);
                }
                if (!item.orchidId) return item;

                const match = getOrchid(item.orchidId);
                if (!match) return item;

                return buildCollectionItem(match, match.name, item);
            });
        }

        function getOrchidByName(name) {
            return orchidsDatabase.find(function (o) {
                return o.name.toLowerCase() === name.toLowerCase();
            });
        }

        function buildCollectionItem(orchid, name, existing) {
            return {
                collectionId: (existing && existing.collectionId) ? existing.collectionId : ('col-' + Date.now() + Math.random().toString(36).slice(2, 9)),
                orchidId: orchid.id,
                name: orchid.name || name,
                img: orchid.img || '',
                behavior: orchid.behavior || 'Inconnu',
                addedAt: (existing && existing.addedAt) || new Date().toISOString(),
                location: (existing && existing.location) || '',
                notes: (existing && existing.notes) || '',
                careHistory: (existing && existing.careHistory) || []
            };
        }

        function saveCollection() {
            localStorage.setItem('userCollection', JSON.stringify(userCollection));
        }

        // ------------------------------------------------------------------
        // Rendu global
        // ------------------------------------------------------------------

        function renderAll() {
            renderStats();
            renderClimate();
            renderNotifications();
            renderGrid();
            renderCareTable();
            renderConseil();
        }

        function renderStats() {
            let epiphytes = 0, terrestres = 0, hemi = 0;

            for (const item of userCollection) {
                const behavior = (item.behavior || '').toLowerCase();
                if (behavior.includes('hémi') || behavior.includes('hemi')) {
                    hemi += 1;
                } else if (behavior.includes('terrestre')) {
                    terrestres += 1;
                } else if (behavior.includes('épiphyte') || behavior.includes('epiphyte')) {
                    epiphytes += 1;
                }
            }

            statTotal.textContent = userCollection.length;
            statEpiphytes.textContent = epiphytes;
            statTerrestres.textContent = terrestres;
            statHemi.textContent = hemi;
        }

        function renderClimate() {
            const item = selectedCollectionId ? getCollectionItem(selectedCollectionId) : null;
            const orchid = item ? getOrchid(item.orchidId) : null;
            const conseil = item ? getConseil(item.orchidId) : null;

            if (!item || !conseil) {
                climateTemp.textContent = '—';
                climateHumidity.textContent = '—';
                climateLight.textContent = '—';
                return;
            }

            climateTemp.textContent = conseil.careCards.temperature || '—';
            climateHumidity.textContent = conseil.careCards.hygrometrie || '—';

            const behavior = (item.behavior || '').toLowerCase();
            if (behavior.includes('hémi') || behavior.includes('hemi')) {
                climateLight.textContent = 'Moyenne';
            } else if (behavior.includes('terrestre')) {
                climateLight.textContent = 'Moyenne';
            } else {
                climateLight.textContent = 'Forte';
            }
        }

        function renderNotifications() {
            const now = new Date();
            let soinsDue = 0;
            let alertes = 0;
            let mauvaisBilan = 0;

            for (const item of userCollection) {
                const history = item.careHistory || [];
                if (history.length === 0) {
                    soinsDue += 1;
                    alertes += 1;
                    mauvaisBilan += 1;
                    continue;
                }

                const last = history[history.length - 1];
                const lastDate = new Date(last.date);
                const daysSince = (now - lastDate) / (1000 * 60 * 60 * 24);

                if (daysSince > 7) soinsDue += 1;
                if (daysSince > 14) alertes += 1;
                if (daysSince > 30) mauvaisBilan += 1;
            }

            dashNotifications.innerHTML = '';

            function addNotif(icon, label, color) {
                const li = document.createElement('li');
                li.innerHTML = '<i class="fa-solid ' + icon + '" aria-hidden="true"></i>'
                    + '<span class="notif-dot notif-' + color + '" aria-hidden="true"></span>'
                    + '<span>' + escapeHtml(label) + '</span>';
                dashNotifications.appendChild(li);
            }

            addNotif('fa-bell', soinsDue > 0 ? soinsDue + ' soins à prévoir' : 'Soins à jour', soinsDue > 0 ? 'orange' : 'green');
            addNotif('fa-triangle-exclamation', alertes > 0 ? alertes + ' alertes' : 'Aucune alerte', alertes > 0 ? 'orange' : 'green');
            addNotif('fa-clipboard-check', mauvaisBilan > 0 ? mauvaisBilan + ' soins en retard' : 'Bilan santé OK', mauvaisBilan > 0 ? 'orange' : 'green');
        }

        function renderGrid() {
            grid.innerHTML = '';

            if (userCollection.length === 0) {
                grid.innerHTML = '<p class="empty-collection">Votre collection est vide. Ajoutez des orchidées depuis l\'encyclopédie.</p>';
                return;
            }

            for (const item of userCollection) {
                const card = document.createElement('article');
                card.className = 'collection-thumb';
                if (item.collectionId === selectedCollectionId) card.classList.add('is-selected');
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-label', 'Ouvrir la fiche de ' + item.name);

                const img = document.createElement('img');
                img.src = item.img || './assets/images/site/logotransparent.png';
                img.alt = item.name;
                img.loading = 'lazy';
                card.appendChild(img);

                const title = document.createElement('h3');
                title.textContent = item.name;
                card.appendChild(title);

                const remove = document.createElement('button');
                remove.type = 'button';
                remove.className = 'btn-remove-collection';
                remove.setAttribute('data-collection-id', item.collectionId);
                remove.setAttribute('aria-label', 'Retirer ' + item.name);
                remove.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i>';
                card.appendChild(remove);

                card.addEventListener('click', function (event) {
                    if (event.target.closest('.btn-remove-collection')) return;
                    selectedCollectionId = item.collectionId;
                    openEditModal(item.collectionId);
                    renderAll();
                });

                card.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectedCollectionId = item.collectionId;
                        openEditModal(item.collectionId);
                        renderAll();
                    }
                });

                grid.appendChild(card);
            }

            const addCard = document.createElement('a');
            addCard.href = 'encyclopedie.html';
            addCard.className = 'collection-thumb collection-thumb-add';
            addCard.setAttribute('aria-label', 'Ajouter une orchidée à la collection');
            addCard.innerHTML = '<span class="add-plus">+</span>';
            grid.appendChild(addCard);
        }

        function renderCareTable() {
            careTableBody.innerHTML = '';

            const item = selectedCollectionId ? getCollectionItem(selectedCollectionId) : null;
            if (!item) {
                careTableBody.innerHTML = '<tr><td colspan="4">Sélectionnez une orchidée pour voir ses soins.</td></tr>';
                return;
            }

            const history = item.careHistory || [];
            if (history.length === 0) {
                careTableBody.innerHTML = '<tr><td colspan="4">Aucun soin enregistré pour ' + escapeHtml(item.name) + '.</td></tr>';
                return;
            }

            for (const care of history.slice().reverse()) {
                const tr = document.createElement('tr');

                const tdDate = document.createElement('td');
                tdDate.textContent = formatDate(care.date);
                tr.appendChild(tdDate);

                const tdSoin = document.createElement('td');
                tdSoin.textContent = (care.types || []).join(', ');
                tr.appendChild(tdSoin);

                const tdRappel = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = !!care.reminderDate;
                checkbox.disabled = true;
                tdRappel.appendChild(checkbox);
                tr.appendChild(tdRappel);

                const tdDateRappel = document.createElement('td');
                tdDateRappel.textContent = care.reminderDate ? formatDate(care.reminderDate) : '—';
                tr.appendChild(tdDateRappel);

                careTableBody.appendChild(tr);
            }
        }

        function renderConseil() {
            conseilPreview.innerHTML = '';

            const item = selectedCollectionId ? getCollectionItem(selectedCollectionId) : null;
            if (!item) {
                conseilPreview.innerHTML = '<p class="conseil-empty">Sélectionnez une orchidée pour afficher ses conseils de culture.</p>';
                return;
            }

            const conseil = getConseil(item.orchidId);
            const container = document.createElement('article');
            container.className = 'conseil-preview-card';

            const title = document.createElement('h3');
            title.textContent = item.name;
            container.appendChild(title);

            const text = document.createElement('p');
            text.className = 'conseil-preview-text';
            text.textContent = conseil ? conseil.content : (getOrchid(item.orchidId).longDesc || 'Aucun conseil disponible.');
            container.appendChild(text);

            if (conseil) {
                const careMini = document.createElement('div');
                careMini.className = 'conseil-care-mini';
                careMini.innerHTML =
                    '<div><i class="fa-solid fa-thermometer-half"></i><span>' + escapeHtml(conseil.careCards.temperature) + '</span></div>' +
                    '<div><i class="fa-solid fa-droplet"></i><span>' + escapeHtml(conseil.careCards.arrosage) + '</span></div>' +
                    '<div><i class="fa-solid fa-percent"></i><span>' + escapeHtml(conseil.careCards.hygrometrie) + '</span></div>' +
                    '<div><i class="fa-solid fa-flask"></i><span>' + escapeHtml(conseil.careCards.engrais) + '</span></div>';
                container.appendChild(careMini);
            }

            conseilPreview.appendChild(container);
        }

        // ------------------------------------------------------------------
        // Modale édition / fiche
        // ------------------------------------------------------------------

        function openEditModal(collectionId) {
            editCollectionId = collectionId;
            const item = getCollectionItem(collectionId);
            if (!item) return;

            const orchid = getOrchid(item.orchidId);
            if (!orchid) return;

            editModalImg.src = item.img;
            editModalImg.alt = item.name;
            editModalTitle.textContent = item.name.toUpperCase();
            editModalShort.textContent = (orchid.shortDesc || orchid.longDesc || '').slice(0, 120) + '…';

            editModalLong.textContent = orchid.longDesc || '';

            const fields = [
                { label: 'Ordre', value: orchid.order },
                { label: 'Espèce', value: orchid.species },
                { label: 'Genre', value: orchid.genus },
                { label: 'Famille', value: orchid.family },
                { label: 'Sous-famille', value: orchid.subFamily },
                { label: 'Tribu', value: orchid.tribe },
                { label: 'Sous-tribu', value: orchid.subTribe },
                { label: 'Comportement', value: orchid.behavior },
                { label: 'Découverte par', value: orchid.discovered },
                { label: 'Origines', value: orchid.origin }
            ];

            editModalFields.innerHTML = '';
            for (const field of fields) {
                if (!field.value) continue;
                const div = document.createElement('div');
                div.className = 'collection-field';
                div.innerHTML = '<label>' + escapeHtml(field.label) + '</label>'
                    + '<span>' + escapeHtml(field.value) + '</span>';
                editModalFields.appendChild(div);
            }

            editLocation.value = item.location || '';
            editNotes.value = item.notes || '';

            editModal.classList.add('active');
            editModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setTimeout(function () { editModalClose.focus(); }, 0);
        }

        function closeEditModal() {
            editModal.classList.remove('active');
            editModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            editCollectionId = null;
        }

        function saveEdit() {
            const item = editCollectionId ? getCollectionItem(editCollectionId) : null;
            if (!item) return;
            item.location = editLocation.value.trim();
            item.notes = editNotes.value.trim();
            saveCollection();
            closeEditModal();
            renderAll();
        }

        // ------------------------------------------------------------------
        // Modale nouveau soin
        // ------------------------------------------------------------------

        function openCareModal(collectionId) {
            careOrchid.innerHTML = '';
            for (const item of userCollection) {
                const option = document.createElement('option');
                option.value = item.collectionId;
                option.textContent = item.name;
                if (item.collectionId === (collectionId || selectedCollectionId)) {
                    option.selected = true;
                }
                careOrchid.appendChild(option);
            }

            careDate.value = new Date().toISOString().slice(0, 10);
            careEngrais.value = '';
            careSubstrat.value = '';
            careRavageurs.value = '';

            const checkboxes = careForm.querySelectorAll('input[type="checkbox"]');
            for (const cb of checkboxes) cb.checked = false;

            renderCareModalHistory();
            careModal.classList.add('active');
            careModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setTimeout(function () { careModalClose.focus(); }, 0);
        }

        function closeCareModal() {
            careModal.classList.remove('active');
            careModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function renderCareModalHistory() {
            const id = careOrchid.value;
            const item = id ? getCollectionItem(id) : null;

            if (!item || !item.careHistory || item.careHistory.length === 0) {
                careModalHistory.innerHTML = '<p class="care-empty">Aucun soin enregistré pour le moment.</p>';
                return;
            }

            const table = document.createElement('table');
            table.className = 'care-history-table';
            table.innerHTML = '<thead><tr><th>Date</th><th>Soins</th></tr></thead>';
            const tbody = document.createElement('tbody');

            for (const care of item.careHistory.slice().reverse()) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td>' + escapeHtml(formatDate(care.date)) + '</td>'
                    + '<td>' + escapeHtml((care.types || []).join(', ')) + '</td>';
                tbody.appendChild(tr);
            }

            table.appendChild(tbody);
            careModalHistory.innerHTML = '';
            careModalHistory.appendChild(table);
        }

        function saveCare(event) {
            event.preventDefault();

            const item = getCollectionItem(careOrchid.value);
            if (!item) return;

            const types = [];
            const typeBoxes = careForm.querySelectorAll('input[name="careType"]:checked');
            for (const cb of typeBoxes) types.push(cb.value);

            const cycles = [];
            const cycleBoxes = careForm.querySelectorAll('input[name="careCycle"]:checked');
            for (const cb of cycleBoxes) cycles.push(cb.value);

            const date = careDate.value;
            if (!date) return;

            const care = {
                id: 'care-' + Date.now(),
                date: date,
                types: types,
                engrais: careEngrais.value.trim(),
                substrat: careSubstrat.value.trim(),
                ravageurs: careRavageurs.value.trim(),
                cycles: cycles,
                reminderDate: computeReminderDate(date, types)
            };

            item.careHistory = item.careHistory || [];
            item.careHistory.push(care);
            saveCollection();

            closeCareModal();
            renderAll();
        }

        function computeReminderDate(dateStr, types) {
            const date = new Date(dateStr);
            if (isNaN(date)) return null;

            let days = 0;
            if (types.includes('arrosage')) days = 7;
            else if (types.includes('nutrition')) days = 14;
            else if (types.includes('rempotage')) days = 365;
            else if (types.includes('traitement')) days = 30;

            if (days === 0) return null;
            const reminder = new Date(date);
            reminder.setDate(reminder.getDate() + days);
            return reminder.toISOString().slice(0, 10);
        }

        // ------------------------------------------------------------------
        // Suppression
        // ------------------------------------------------------------------

        function removeCollectionItem(event) {
            const btn = event.target.closest('.btn-remove-collection');
            if (!btn) return;

            event.stopPropagation();
            const id = btn.getAttribute('data-collection-id');
            const item = getCollectionItem(id);
            if (!item) return;

            if (!confirm('Retirer "' + item.name + '" de votre collection ?')) return;

            userCollection = userCollection.filter(function (i) { return i.collectionId !== id; });
            saveCollection();

            if (selectedCollectionId === id) {
                selectedCollectionId = userCollection.length ? userCollection[0].collectionId : null;
            }
            renderAll();
        }

        // ------------------------------------------------------------------
        // Événements
        // ------------------------------------------------------------------

        function closeActiveModal(event) {
            if (event.key === 'Escape') {
                if (editModal.classList.contains('active')) closeEditModal();
                if (careModal.classList.contains('active')) closeCareModal();
            }
        }

        function bindEvents() {
            grid.addEventListener('click', removeCollectionItem);

            document.getElementById('btn-new-care').addEventListener('click', function () {
                openCareModal();
            });

            editModalClose.addEventListener('click', closeEditModal);
            editCancel.addEventListener('click', closeEditModal);
            editSave.addEventListener('click', saveEdit);

            editModal.addEventListener('click', function (event) {
                if (event.target === editModal) closeEditModal();
            });

            careModalClose.addEventListener('click', closeCareModal);
            careModalCancel.addEventListener('click', closeCareModal);
            careForm.addEventListener('submit', saveCare);

            careOrchid.addEventListener('change', renderCareModalHistory);

            careModal.addEventListener('click', function (event) {
                if (event.target === careModal) closeCareModal();
            });

            document.addEventListener('keydown', closeActiveModal);
        }

        // ------------------------------------------------------------------
        // Démarrage
        // ------------------------------------------------------------------

        if (!userIsAuth) {
            guestMessage.hidden = false;
            return;
        }

        app.hidden = false;
        userCollection = normalizeCollection(JSON.parse(localStorage.getItem('userCollection')) || []);
        saveCollection();

        if (userCollection.length) {
            selectedCollectionId = userCollection[0].collectionId;
        }

        bindEvents();
        renderAll();
    });
})();
