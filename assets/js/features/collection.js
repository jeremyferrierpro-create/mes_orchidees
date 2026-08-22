import { getElement, createElement, replaceChildren } from '../core/dom.js';
import * as authService from '../services/auth-service.js';
import * as collectionService from '../services/collection-service.js';
import { getAllOrchids, getOrchidById } from '../services/orchid-service.js';
import { getConseilById } from '../services/conseil-service.js';
import * as modalManager from '../core/modal.js';
import * as notifications from '../core/notifications.js';
import { STORAGE_KEYS, readJson, writeJson } from '../core/storage.js';
import { db } from '../core/db.js'; // pour les notifications (table notifications via db)

// MA COLLECTION - Le tableau de bord de l'utilisateur (en français débutant)
// ======================================================
// Ce fichier fait TOUT pour la page macollection.html :
// 1. Il lit la collection dans le navigateur (localStorage)
// 2. Il calcule les chiffres du haut (Total, Épiphytes, Terrestres, Hémi - et Climat)
// 3. Il affiche la grille de vignettes + le tableau des soins + l'aperçu conseil
// 4. Il gère les 3 petites fenêtres : voir/éditer une plante, ajouter une plante, ajouter un soin
// Chaque ligne est commentée pour que tu puisses l'expliquer à l'oral mot à mot
// Plus tard, tous les readJson/writeJson seront remplacés par fetch() vers PHP/Supabase

export function initCollection() {
    const orchidsDatabase = getAllOrchids();
    let userIsAuth = authService.isAuthenticated();

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
    const editModalLong = document.getElementById('edit-modal-long');
    const editModalFields = document.getElementById('edit-modal-fields');
    const editLocation = document.getElementById('edit-location');
    const editTemp = document.getElementById('edit-temp');
    const editHygro = document.getElementById('edit-hygro');
    const editLight = document.getElementById('edit-light');
    const editVentilation = document.getElementById('edit-ventilation');
    const editNotes = document.getElementById('edit-notes');
    const editSave = document.getElementById('edit-modal-save');
    const editCancel = document.getElementById('edit-modal-cancel');

    const addModal = document.getElementById('add-collection-modal');
    const addModalClose = document.getElementById('add-modal-close');
    const addModalCancel = document.getElementById('add-modal-cancel');
    const addForm = document.getElementById('add-collection-form');
    const addName = document.getElementById('add-orchid-name');
    const addSuggestions = document.getElementById('add-orchid-suggestions');
    const addBehavior = document.getElementById('add-orchid-behavior');
    const addOrigin = document.getElementById('add-orchid-origin');
    const addOrder = document.getElementById('add-orchid-order');
    const addFamily = document.getElementById('add-orchid-family');
    const addGenre = document.getElementById('add-orchid-genre');
    const addSpecies = document.getElementById('add-orchid-species');
    const addProposeContainer = document.getElementById('add-propose-container');
    const addProposeCheckbox = document.getElementById('add-propose-checkbox');

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
    let selectedSuggestionId = null;

    // ------------------------------------------------------------------
    // Utilitaires
    // ------------------------------------------------------------------

    function escapeHtml(text) {
        if (window.AppUtils) return window.AppUtils.escapeHtml(text);
        return String(text).replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

    function formatDate(dateStr) {
        if (window.AppUtils) return window.AppUtils.formatDate(dateStr);
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d)) return '—';
        return d.toLocaleDateString('fr-FR');
    }

    function getOrchid(orchidId) {
        return orchidsDatabase.find(function (o) { return o.id === orchidId; });
    }

    function getConseil(orchidId) {
        // Les fiches conseils utilisent le préfixe "fiche-" devant l'identifiant orchidée.
        return getConseilById('fiche-' + orchidId);
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
            careHistory: (existing && existing.careHistory) || [],
            temp: (existing && existing.temp) || '',
            hygro: (existing && existing.hygro) || '',
            light: (existing && existing.light) || '',
            ventilation: (existing && existing.ventilation) || ''
        };
    }

    function saveCollection() {
        // Le service utilise la même clé partout : mo_user_collection.
        collectionService.saveCollection(userCollection);
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

        climateTemp.textContent = item.temp || conseil.careCards.temperature || '—';
        climateHumidity.textContent = item.hygro || conseil.careCards.hygrometrie || '—';
        climateLight.textContent = item.light || conseil.careCards.luminosite || '—';

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

        replaceChildren(dashNotifications);

        function addNotif(icon, label, color) {
            const li = document.createElement('li');

            const i = document.createElement('i');
            i.className = 'fa-solid ' + icon;
            i.setAttribute('aria-hidden', 'true');
            li.appendChild(i);

            const spanDot = document.createElement('span');
            spanDot.className = 'notif-dot notif-' + color;
            spanDot.setAttribute('aria-hidden', 'true');
            li.appendChild(spanDot);

            const spanLabel = document.createElement('span');
            spanLabel.textContent = label;
            li.appendChild(spanLabel);

            dashNotifications.appendChild(li);
        }

        addNotif('fa-bell', soinsDue > 0 ? soinsDue + ' soins à prévoir' : 'Soins à jour', soinsDue > 0 ? 'orange' : 'green');
        addNotif('fa-triangle-exclamation', alertes > 0 ? alertes + ' alertes' : 'Aucune alerte', alertes > 0 ? 'orange' : 'green');
        addNotif('fa-clipboard-check', mauvaisBilan > 0 ? mauvaisBilan + ' soins en retard' : 'Bilan santé OK', mauvaisBilan > 0 ? 'orange' : 'green');
    }

    function renderGrid() {
        replaceChildren(grid);

        if (userCollection.length === 0) {
            const p = document.createElement('p');
            p.className = 'empty-collection';
            p.textContent = 'Votre collection est vide. Ajoutez des orchidées depuis l\'encyclopédie.';
            grid.appendChild(p);
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
            const rmIcon = document.createElement('i');
            rmIcon.className = 'fa-solid fa-trash';
            rmIcon.setAttribute('aria-hidden', 'true');
            remove.appendChild(rmIcon);
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

        const addCard = document.createElement('button');
        addCard.type = 'button';
        addCard.className = 'collection-thumb collection-thumb-add';
        addCard.setAttribute('aria-label', 'Ajouter une orchidée à la collection');
        const spanPlus = document.createElement('span');
        spanPlus.className = 'add-plus';
        spanPlus.textContent = '+';
        addCard.appendChild(spanPlus);

        addCard.addEventListener('click', openAddModal);

        grid.appendChild(addCard);
    }

    function renderCareTable() {
        replaceChildren(careTableBody);

        const item = selectedCollectionId ? getCollectionItem(selectedCollectionId) : null;
        if (!item) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4;
            td.textContent = 'Sélectionnez une orchidée pour voir ses soins.';
            tr.appendChild(td);
            careTableBody.appendChild(tr);
            return;
        }

        const history = item.careHistory || [];
        if (history.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4;
            td.textContent = 'Aucun soin enregistré pour ' + item.name + '.';
            tr.appendChild(td);
            careTableBody.appendChild(tr);
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
        replaceChildren(conseilPreview);

        const item = selectedCollectionId ? getCollectionItem(selectedCollectionId) : null;
        if (!item) {
            const p = document.createElement('p');
            p.className = 'conseil-empty';
            p.textContent = 'Sélectionnez une orchidée pour afficher ses conseils de culture.';
            conseilPreview.appendChild(p);
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
        const orchid = getOrchid(item.orchidId);
        text.textContent = conseil
            ? conseil.content
            : (orchid?.longDesc || 'Aucun conseil disponible.');
        container.appendChild(text);

        if (conseil) {
            const careMini = document.createElement('div');
            careMini.className = 'conseil-care-mini';

            function createCareMiniItem(iconClass, textValue) {
                const div = document.createElement('div');
                const icon = document.createElement('i');
                icon.className = 'fa-solid ' + iconClass;
                const span = document.createElement('span');
                span.textContent = textValue;
                div.appendChild(icon);
                div.appendChild(span);
                return div;
            }

            careMini.appendChild(createCareMiniItem('fa-thermometer-half', conseil.careCards.temperature));
            careMini.appendChild(createCareMiniItem('fa-droplet', conseil.careCards.arrosage));
            careMini.appendChild(createCareMiniItem('fa-percent', conseil.careCards.hygrometrie));
            careMini.appendChild(createCareMiniItem('fa-flask', conseil.careCards.engrais));

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

        // Une orchidée ajoutée manuellement n'existe pas forcément dans orchids-data.js.
        // Dans ce cas, on utilise les informations déjà enregistrées dans la collection.
        const orchid = getOrchid(item.orchidId) || {
            name: item.name,
            img: item.img,
            behavior: item.behavior,
            shortDesc: '',
            longDesc: ''
        };

        editModalImg.src = item.img;
        editModalImg.alt = item.name;
        editModalTitle.textContent = item.name.toUpperCase();
        editModalShort.textContent = (orchid.shortDesc || orchid.longDesc || '').slice(0, 120) + '…';

        if (editModalLong) {
            editModalLong.textContent = orchid.longDesc || '';
        }

        const fields = [
            { label: 'Ordre', value: orchid.order },
            { label: 'Espèce', value: orchid.species },
            { label: 'Genre', value: orchid.genre },
            { label: 'Famille', value: orchid.family },
            { label: 'Sous-famille', value: orchid.subfamily },
            { label: 'Tribu', value: orchid.tribu },
            { label: 'Sous-tribu', value: orchid.subtribu },
            { label: 'Comportement', value: orchid.behavior },
            { label: 'Découverte par', value: orchid.discovered },
            { label: 'Origines', value: orchid.origin }
        ];

        replaceChildren(editModalFields);
        for (const field of fields) {
            if (!field.value) continue;
            const div = document.createElement('div');
            div.className = 'collection-field';

            const label = document.createElement('label');
            label.textContent = field.label;

            const span = document.createElement('span');
            span.textContent = field.value;

            div.appendChild(label);
            div.appendChild(span);
            editModalFields.appendChild(div);
        }

        editLocation.value = item.location || '';
        if (editTemp) editTemp.value = item.temp || '';
        if (editHygro) editHygro.value = item.hygro || '';
        if (editLight) editLight.value = item.light || '';
        if (editVentilation) editVentilation.value = item.ventilation || '';
        editNotes.value = item.notes || '';

        modalManager.open(editModal, document.activeElement);
    }

    function closeEditModal() {
        modalManager.close(editModal);
        editCollectionId = null;
    }

    function saveEdit() {
        const item = editCollectionId ? getCollectionItem(editCollectionId) : null;
        if (!item) return;
        item.location = editLocation.value.trim();
        if (editTemp) item.temp = editTemp.value.trim();
        if (editHygro) item.hygro = editHygro.value.trim();
        if (editLight) item.light = editLight.value.trim();
        if (editVentilation) item.ventilation = editVentilation.value.trim();
        item.notes = editNotes.value.trim();
        saveCollection();
        closeEditModal();
        renderAll();
    }

    // ------------------------------------------------------------------
    // Modale d'ajout et Autocomplétion
    // ------------------------------------------------------------------

    function openAddModal() {
        addForm.reset();
        selectedSuggestionId = null;
        addSuggestions.style.display = 'none';
        addProposeContainer.style.display = 'flex';
        toggleTaxonomyFields(false);

        modalManager.open(addModal, document.activeElement);
    }

    function closeAddModal() {
        modalManager.close(addModal);
    }

    function toggleTaxonomyFields(readOnly) {
        addOrder.readOnly = readOnly;
        addFamily.readOnly = readOnly;
        addGenre.readOnly = readOnly;
        addSpecies.readOnly = readOnly;
        addBehavior.disabled = readOnly;
        addOrigin.readOnly = readOnly;

        if (readOnly) {
            addOrder.style.opacity = '0.7';
            addFamily.style.opacity = '0.7';
            addGenre.style.opacity = '0.7';
            addSpecies.style.opacity = '0.7';
            addBehavior.style.opacity = '0.7';
            addOrigin.style.opacity = '0.7';
        } else {
            addOrder.style.opacity = '1';
            addFamily.style.opacity = '1';
            addGenre.style.opacity = '1';
            addSpecies.style.opacity = '1';
            addBehavior.style.opacity = '1';
            addOrigin.style.opacity = '1';
        }
    }

    if (addName) {
        addName.addEventListener('input', function (e) {
            const query = e.target.value.toLowerCase().trim();
            replaceChildren(addSuggestions);
            selectedSuggestionId = null;
            addProposeContainer.style.display = 'flex';
            toggleTaxonomyFields(false);

            if (query.length < 2) {
                addSuggestions.style.display = 'none';
                return;
            }

            const matches = orchidsDatabase.filter(o => o.name.toLowerCase().includes(query) || (o.vernacular && o.vernacular.toLowerCase().includes(query)));

            if (matches.length > 0) {
                matches.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.style.padding = '10px';
                    div.style.cursor = 'pointer';
                    div.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                    div.textContent = match.name + (match.vernacular ? ' (' + match.vernacular + ')' : '');

                    div.addEventListener('click', function () {
                        addName.value = match.name;
                        selectedSuggestionId = match.id;
                        addSuggestions.style.display = 'none';
                        addProposeContainer.style.display = 'none';

                        // Auto-remplissage
                        addBehavior.value = match.behavior || '';
                        addOrigin.value = match.origin || '';
                        addOrder.value = match.order || '';
                        addFamily.value = match.family || '';
                        addGenre.value = match.genre || '';
                        addSpecies.value = match.species || '';

                        toggleTaxonomyFields(true);
                    });

                    div.addEventListener('mouseenter', () => div.style.backgroundColor = 'rgba(0, 229, 255, 0.1)');
                    div.addEventListener('mouseleave', () => div.style.backgroundColor = 'transparent');

                    addSuggestions.appendChild(div);
                });
                addSuggestions.style.display = 'block';
                addSuggestions.style.position = 'absolute';
                addSuggestions.style.width = '100%';
                addSuggestions.style.zIndex = '100';
                addSuggestions.style.maxHeight = '200px';
                addSuggestions.style.overflowY = 'auto';
            } else {
                addSuggestions.style.display = 'none';
            }
        });
    }

    if (addForm) {
        addForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let name = addName.value.trim();
            let orchidObj = null;
            let isProposition = false;

            if (selectedSuggestionId) {
                orchidObj = getOrchid(selectedSuggestionId);
            } else {
                // C'est une plante non reconnue
                orchidObj = {
                    id: 'custom-' + Date.now(),
                    name: name,
                    behavior: addBehavior.value,
                    origin: addOrigin.value,
                    order: addOrder.value,
                    family: addFamily.value,
                    genre: addGenre.value,
                    species: addSpecies.value,
                    img: './assets/images/site/logotransparent.png'
                };
                isProposition = addProposeCheckbox.checked;
            }

            const newItem = buildCollectionItem(orchidObj, name, null);
            userCollection.push(newItem);
            saveCollection();

            if (isProposition) {
                // Je crée une notification pour l'admin via la table notifications (comme INSERT INTO notifications)
                db.from('notifications').insert({
                    id: Date.now(),
                    date: new Date().toLocaleDateString('fr-FR'),
                    message: "Nouvelle proposition d'orchidée : " + name
                }).execute();
            }

            closeAddModal();
            selectedCollectionId = newItem.collectionId;

            notifications.success(name + ' a été ajoutée à votre collection.');
            renderAll();
        });
    }

    // ------------------------------------------------------------------
    // Modale nouveau soin
    // ------------------------------------------------------------------

    function openCareModal(collectionId) {
        replaceChildren(careOrchid);
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
        modalManager.open(careModal, document.activeElement);
    }

    function closeCareModal() {
        modalManager.close(careModal);
    }

    function renderCareModalHistory() {
        const id = careOrchid.value;
        const item = id ? getCollectionItem(id) : null;

        if (!item || !item.careHistory || item.careHistory.length === 0) {
            replaceChildren(careModalHistory);
            const p = document.createElement('p');
            p.className = 'care-empty';
            p.textContent = 'Aucun soin enregistré pour le moment.';
            careModalHistory.appendChild(p);
            return;
        }

        const table = document.createElement('table');
        table.className = 'care-history-table';
        const thead = document.createElement('thead');
        const theadTr = document.createElement('tr');
        const thDate = document.createElement('th');
        thDate.textContent = 'Date';
        const thSoins = document.createElement('th');
        thSoins.textContent = 'Soins';
        theadTr.appendChild(thDate);
        theadTr.appendChild(thSoins);
        thead.appendChild(theadTr);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');

        for (const care of item.careHistory.slice().reverse()) {
            const tr = document.createElement('tr');
            const tdDate = document.createElement('td');
            tdDate.textContent = formatDate(care.date);
            const tdTypes = document.createElement('td');
            tdTypes.textContent = (care.types || []).join(', ');
            tr.appendChild(tdDate);
            tr.appendChild(tdTypes);
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        replaceChildren(careModalHistory);
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

        notifications.success(item.name + ' a été retirée de la collection.');

        if (selectedCollectionId === id) {
            selectedCollectionId = userCollection.length ? userCollection[0].collectionId : null;
        }
        renderAll();
    }

    // ------------------------------------------------------------------
    // Événements
    // ------------------------------------------------------------------

    // Logique "Escape" gérée par ModalManager

    function bindEvents() {
        grid.addEventListener('click', removeCollectionItem);

        const newCareButton = document.getElementById('btn-new-care');
        if (newCareButton) {
            newCareButton.addEventListener('click', function () {
                openCareModal();
            });
        }

        if (editModalClose) editModalClose.addEventListener('click', closeEditModal);
        if (editCancel) editCancel.addEventListener('click', closeEditModal);
        if (editSave) editSave.addEventListener('click', saveEdit);

        if (editModal) {
            editModal.addEventListener('click', function (event) {
                if (event.target === editModal) closeEditModal();
            });
        }

        if (addModalClose) addModalClose.addEventListener('click', closeAddModal);
        if (addModalCancel) addModalCancel.addEventListener('click', closeAddModal);
        if (addModal) {
            addModal.addEventListener('click', function (event) {
                if (event.target === addModal) closeAddModal();
            });
        }

        if (careModalClose) careModalClose.addEventListener('click', closeCareModal);
        if (careModalCancel) careModalCancel.addEventListener('click', closeCareModal);
        if (careForm) careForm.addEventListener('submit', saveCare);

        if (careOrchid) careOrchid.addEventListener('change', renderCareModalHistory);

        if (careModal) {
            careModal.addEventListener('click', function (event) {
                if (event.target === careModal) closeCareModal();
            });
        }
    }

    // ------------------------------------------------------------------
    // Démarrage
    // ------------------------------------------------------------------

    if (!userIsAuth) {
        guestMessage.hidden = false;
        return;
    }

    app.hidden = false;
    // getCollection() retourne déjà un tableau : il ne faut surtout pas utiliser JSON.parse ici.
    userCollection = normalizeCollection(collectionService.getCollection());
    saveCollection();

    if (userCollection.length) {
        selectedCollectionId = userCollection[0].collectionId;
    }

    bindEvents();
    renderAll();
}