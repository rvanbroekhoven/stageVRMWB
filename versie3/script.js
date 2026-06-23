document.addEventListener('DOMContentLoaded', () => {

    const DAYS=['Zo','Ma','Di','Wo','Do','Vr','Za'];
    const MONTHS=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];

    // --- NIEUWE SVG ICONEN ---
    const svgEdit = '<svg viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
    const svgDel = '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
    const svgPhoto = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';

    // --- 1. TOAST ---
    function showToast(m) {
        const t = document.getElementById('toast');
        t.textContent = m; t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2300);
    }

    // --- 2. DARK MODE & LOGO ---
    const darkToggle = document.getElementById('dark-toggle');
    function applyDark(on) {
        document.body.setAttribute('data-theme', on ? 'dark' : 'light');
        if(darkToggle) darkToggle.setAttribute('aria-checked', on ? 'true' : 'false');
        const logo = document.getElementById('tb-logo');
        if(logo) logo.src = on ? 'darklogo.png' : 'logo.png';
    }
    if(darkToggle) {
        darkToggle.addEventListener('click', () => {
            applyDark(document.body.getAttribute('data-theme') !== 'dark');
        });
    }
    applyDark(document.body.getAttribute('data-theme') === 'dark');

    // --- 3. PROFILE PANEL ---
    const PROF_KEY = 'vrmwb_profile';
    function loadProfile() {
        const p = JSON.parse(localStorage.getItem(PROF_KEY) || '{}');
        const naam = p.voornaam || ''; const ach = p.achternaam || ''; const rol = p.rol || '';
        const initials = ((naam[0]||'')+(ach[0]||'')).toUpperCase()||'?';
        const bbAvatar = document.getElementById('bb-avatar'); const ppAvatar = document.getElementById('pp-avatar-large');
        if(bbAvatar) bbAvatar.textContent = initials; if(ppAvatar) ppAvatar.textContent = initials;
        const bbPname = document.getElementById('bb-pname'); const bbProle = document.getElementById('bb-prole');
        if(bbPname) bbPname.textContent = (naam+' '+ach).trim()||'Naam Achternaam';
        if(bbProle) bbProle.textContent = rol||'Rol';
        const ppV = document.getElementById('pp-voornaam'); const ppA = document.getElementById('pp-achternaam'); const ppR = document.getElementById('pp-rol');
        if(ppV) ppV.value = naam; if(ppA) ppA.value = ach; if(ppR) ppR.value = rol;
    }
    function saveProfile() {
        const voornaam = document.getElementById('pp-voornaam').value.trim();
        const achternaam = document.getElementById('pp-achternaam').value.trim();
        const rol = document.getElementById('pp-rol').value.trim();
        localStorage.setItem(PROF_KEY, JSON.stringify({voornaam, achternaam, rol}));
        loadProfile(); document.getElementById('profile-panel').classList.remove('open'); showToast('Profiel opgeslagen');
    }
    const profileBtn = document.getElementById('profile-btn');
    if(profileBtn) profileBtn.addEventListener('click', () => document.getElementById('profile-panel').classList.toggle('open'));
    const btnSaveProfile = document.getElementById('btn-save-profile');
    if(btnSaveProfile) btnSaveProfile.addEventListener('click', saveProfile);
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('profile-panel');
        if(panel && profileBtn && panel.classList.contains('open') && !panel.contains(e.target) && !profileBtn.contains(e.target)) panel.classList.remove('open');
    });
    loadProfile();

    // --- 4. LOCATION DROPDOWN ---
    const LOC_KEY = 'vrmwb_location';
    const locLabel = document.getElementById('loc-label');
    const locWrap = document.getElementById('loc-wrap');
    const locBtn = document.getElementById('loc-btn');
    function initLoc() {
        const saved = localStorage.getItem(LOC_KEY);
        if(saved) setLocActive(saved, false); else if(locLabel) locLabel.textContent = 'Selecteer kazerne';
    }
    function selectLoc(name) { localStorage.setItem(LOC_KEY, name); setLocActive(name, true); }
    function setLocActive(name, close) {
        if(locLabel) locLabel.textContent = name;
        document.querySelectorAll('.loc-item').forEach(el => el.classList.toggle('active', el.getAttribute('data-val') === name));
        if(close && locWrap) locWrap.classList.remove('open');
    }
    if(locBtn) locBtn.addEventListener('click', (e) => { e.stopPropagation(); if(locWrap) locWrap.classList.toggle('open'); });
    document.querySelectorAll('.loc-item').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); selectLoc(btn.getAttribute('data-val')); }));
    document.addEventListener('click', (e) => { if(locWrap && locWrap.classList.contains('open') && !locWrap.contains(e.target)) locWrap.classList.remove('open'); });
    initLoc();

    // --- 5. CLOCK & DATEPICKER ---
    let selectedDate = new Date();
    let _lastDate='', _lastTime='';
    function tick() {
        const d = new Date(), p = n => String(n).padStart(2,'0');
        const dateStr = `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
        const timeStr = `${p(d.getHours())}:${p(d.getMinutes())}`;
        if(dateStr!==_lastDate){const el=document.getElementById('bbdate');if(el)el.textContent=dateStr;_lastDate=dateStr;}
        if(timeStr!==_lastTime){const el=document.getElementById('bbtime');if(el)el.textContent=timeStr;_lastTime=timeStr;}
    }
    setInterval(tick, 1000); tick();

    let fpInstance = null;
    function initDatepicker() {
        if(document.getElementById('btn-today')) {
            fpInstance = flatpickr('#btn-today', { locale:'nl', defaultDate:'today', position:'above center', disableMobile:true,
                onChange: function(dates) { if(dates[0]){ selectedDate = dates[0]; updateCenterNavigation(); } }
            });
        }
    }
    initDatepicker();
    function updateCenterNavigation() {
        const el = document.getElementById('bb-date-display'); if(!el) return;
        const today = new Date();
        const isToday = selectedDate.getDate()===today.getDate() && selectedDate.getMonth()===today.getMonth() && selectedDate.getFullYear()===today.getFullYear();
        el.innerText = isToday ? 'Vandaag' : selectedDate.toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'});
        if(fpInstance) fpInstance.setDate(selectedDate, false);
    }
    const btnPrevDay = document.getElementById('btn-prev-day'); const btnNextDay = document.getElementById('btn-next-day');
    if(btnPrevDay) btnPrevDay.addEventListener('click', () => { selectedDate.setDate(selectedDate.getDate()-1); updateCenterNavigation(); });
    if(btnNextDay) btnNextDay.addEventListener('click', () => { selectedDate.setDate(selectedDate.getDate()+1); updateCenterNavigation(); });
    const dateTrigger = document.querySelector('.bb-date-trigger');
let currentDate = new Date();

const fp = flatpickr(dateTrigger, {
    locale: "nl",
    dateFormat: "d-m-Y",
    defaultDate: currentDate,
    position: "above center",
    onChange: function(selectedDates, dateStr) {
        if(selectedDates[0]) {
            currentDate = selectedDates[0];
            updateDateDisplay();
        }
    },
    onReady: function(selectedDates, dateStr, instance) {
        const customHeader = document.createElement('div');
        customHeader.className = 'custom-header-bg';
        customHeader.innerHTML = `
            <div class="c-month-group">
                <button type="button" class="c-arrow prev-month">&#8249;</button>
                <span class="c-val month-val"></span>
                <button type="button" class="c-arrow next-month">&#8250;</button>
            </div>
            <div class="c-year-group">
                <button type="button" class="c-arrow prev-year">&#8249;</button>
                <span class="c-val year-val"></span>
                <button type="button" class="c-arrow next-year">&#8250;</button>
            </div>
        `;

        const updateCustomHeader = () => {
            const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
            customHeader.querySelector('.month-val').innerText = months[instance.currentMonth];
            customHeader.querySelector('.year-val').innerText = instance.currentYear;
        };

        customHeader.querySelector('.prev-month').addEventListener('click', e => { e.stopPropagation(); instance.changeMonth(-1); updateCustomHeader(); });
        customHeader.querySelector('.next-month').addEventListener('click', e => { e.stopPropagation(); instance.changeMonth(1); updateCustomHeader(); });
        customHeader.querySelector('.prev-year').addEventListener('click', e => { e.stopPropagation(); instance.changeYear(instance.currentYear - 1); updateCustomHeader(); });
        customHeader.querySelector('.next-year').addEventListener('click', e => { e.stopPropagation(); instance.changeYear(instance.currentYear + 1); updateCustomHeader(); });

        instance.calendarContainer.prepend(customHeader);
        instance.config.onMonthChange.push(updateCustomHeader);
        instance.config.onYearChange.push(updateCustomHeader);
        updateCustomHeader();

        const todayBtn = document.createElement('button');
        todayBtn.className = 'flatpickr-today-btn';
        todayBtn.innerText = 'Vandaag';
        todayBtn.addEventListener('click', () => {
            instance.setDate(new Date(), true);
            instance.close();
        });
        instance.calendarContainer.appendChild(todayBtn);
    }
        });

        function updateDateDisplay() {
            const today = new Date();
            const isToday = currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            dateTrigger.innerText = isToday ? "Vandaag" : currentDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        const navArrows = document.querySelectorAll('.bb-nav-arrow');
        if(navArrows.length >= 2) {
            navArrows[0].addEventListener('click', () => { currentDate.setDate(currentDate.getDate() - 1); fp.setDate(currentDate, true); });
            navArrows[1].addEventListener('click', () => { currentDate.setDate(currentDate.getDate() + 1); fp.setDate(currentDate, true); });
        }

    // --- 6. APP STATE & DATA ---
    const appState = {
        'rooster': { members: [
            { name: 'Ron Appeldoorn',   tags: [{text:'TS 1: BV', color:'red'}] },
            { name: 'Bart Savelsberg',  tags: [{text:'TS 1: Ch, Avond/Nacht', color:'red'}] },
            { name: 'Wiebo Razenberg',  tags: [{text:'TS 1: Ch, Dag', color:'red'}] },
            { name: 'Erik Smulders',    tags: [{text:'TS 1: 1', color:'red'},{text:'WO: ass', color:'green'}] },
            { name: 'Dirk Magielse',    tags: [{text:'TS 1: 2, Avond/Nacht', color:'red'},{text:'TS 2: 2, Dag', color:'red'},{text:'WO: duiker 2', color:'green'}] },
            { name: 'Jan Rijvers',      tags: [{text:'TS 2: Ch, Dag', color:'red'}] },
            { name: 'Jasper Meeusen',   tags: [{text:'TS 1: 4', color:'red'}] },
            { name: 'Jochem Verdonk',   tags: [{text:'TS 2: BV', color:'red'},{text:'WO: BV', color:'gold'}] },
            { name: 'Henri Smans',      tags: [{text:'TS 2: Ch', color:'red'},{text:'WO: Ch', color:'gold'},{text:'Kantinist', color:'grey'}] },
            { name: 'Geert Tuerlings',  tags: [{text:'TS 2: 1', color:'red'},{text:'SPEC. voertuig: 1', color:'blue'}] },
            { name: 'Kjell Bastiaansen',tags: [{text:'TS 2: 2, Avond/Nacht', color:'red'}] },
            { name: 'Ronnie van Dongen',tags: [{text:'TS 2: 3', color:'red'},{text:'WO: DPL', color:'gold'}] },
            { name: 'Nick van Melsen',  tags: [{text:'TS 2: BV', color:'red'},{text:'WO: duiker 1', color:'gold'}] },
            { name: 'Christ Joosen',    tags: [{text:'SPEC. voertuig: BV', color:'blue'},{text:'Sleutel ronde', color:'grey'}] },
            { name: 'Richard Broeders', tags: [{text:'SPEC. voertuig: Ch', color:'blue'}] }
        ]},
        'alarmen': { incidents: [
            { id:'al1', date:'28-4-2026', time:'22:31 - 23:13', loc:'Bochtakker Prinsenbeek', type:'P1 Gezondheid', vehicles:'203151', infoText:'' },
            { id:'al2', date:'28-4-2026', time:'21:05 - 21:20', loc:'Winkelcentrum de Barones Breda', type:'P2 Brand - Specifiek - Brandgerucht', vehicles:'203132', infoText:'' },
            { id:'al3', date:'28-4-2026', time:'16:00 - 16:25', loc:'ROFRA Home Kruisvoort Breda', type:'P1 Brand - Buiten - Container', vehicles:'203132', infoText:'' }
        ]},
        'evenementen':{ incidents: [{ id:'ev1', type:'B-Evenement (~300)', loc:'Nieuw-Vossemeer', date:'23-1-2026', time:'Hele dag', vehicles:'Nienke Zwetsloot (Adviseur)', infoTitle:'Carnaval Nieuw-Vossemeer', infoText:'Carnaval Nieuw-Vossemeer (Jan Kellerbal) + 13-02 t/m 17-02 (Carnaval).\nExtra verhoogd risico ivm wegafsluiting.' }] },
        'algemeen':   { tasks: [{id:'aw1',text:'Schoonmaken vuile ruimte en ruimte wasmachine',checked:true,author:'Paul van der Heijden'},{id:'aw2',text:'SVM-rondpompen 20-1561',checked:false,author:'Paul van der Heijden'},{id:'aw3',text:'Papierbakken legen',checked:false,author:'Paul van der Heijden'}] },
        'ademlucht':  { tasks: [{id:'ad1',text:'Na einde werkzaamheden testbanken en vulbalk-pc uitschakelen',checked:false,author:'Paul van der Heijden'}] }
    };
    const textBlocks = ['afspraken','nieuws','arbo','communicatie','iboa','ocb','rbcb','straten','tfl','vkb','waarschuwingen'];
    textBlocks.forEach(id => { appState[id] = { activeTabId:1, tabs:[{id:1,title:'Nieuwe tab',content:''}] }; });

    function ensureWysiwygState(blockId) {
        if(!appState[blockId]) appState[blockId] = { activeTabId:1, tabs:[{id:1,title:'Nieuwe tab',content:''}] };
    }

    function getRoosterKISHTML() {
        let html = `<h1 class="slide-title">Ploeg indeling</h1><div class="kis-rooster-grid">`;
        appState.rooster.members.forEach(m => {
            let tagsHtml = m.tags.map(t => `<span class="func-tag" data-color="${t.color}">${t.text}</span>`).join('');
            html += `<div class="kis-rooster-card"><div class="member-name">${m.name}</div><div class="member-tags">${tagsHtml}</div></div>`;
        });
        html += `</div>`; return html;
    }

    function getTaskEditorHTML(blockId) {
        let html = '';
        appState[blockId].tasks.forEach(t => {
            html += `<div class="editor-check-toggle ${t.checked?'checked':''}" data-block="${blockId}" data-id="${t.id}">
                        <div class="check-box">${t.checked?'✓':''}</div>
                        <div class="check-content"><strong>${t.text}</strong><span>Auteur: ${t.author}</span></div>
                        <button class="icon-btn edit">${svgEdit}</button><button class="icon-btn delete">${svgDel}</button>
                    </div>`;
        });
        html += `<div class="add-item-row"><input type="text" class="text-input" placeholder="Vul hier een item in..."><button class="btn-add">+</button></div>`;
        return html;
    }

    function getTaskKISHTML(blockId, title) {
        let html = `<h1 class="slide-title">${title}</h1><div style="width:100%;">`;
        appState[blockId].tasks.forEach(t => {
            html += `<div class="kis-checklist-card ${t.checked?'checked':''}" data-block="${blockId}" data-id="${t.id}">
                        <div class="kis-check-square">${t.checked?'✓':''}</div>
                        <div class="kis-check-text">${t.text}</div>
                    </div>`;
        });
        html += `</div>`; return html;
    }

    function getModernTableKISHTML(title, incidents) {
        let html = `<h1 class="slide-title">${title}</h1>`;
        html += `<div class="kis-table-wrapper">`;
        html += `<table class="kis-data-table">`;
        html += `<thead><tr><th>Datum</th><th>Adres</th><th>Melding</th><th>Voertuigen</th><th>Toelichting</th></tr></thead><tbody>`;
        incidents.forEach(inc => {
            html += `<tr>
                <td>${inc.date}<br>${inc.time}</td>
                <td>${inc.loc}</td>
                <td>${inc.type}</td>
                <td>${inc.vehicles}</td>
                <td>${inc.infoText ? '...' : ''}</td>
            </tr>`;
        });
        html += `</tbody></table>`;
        html += `<div class="kis-table-footer">Meer incidenten laden</div>`;
        html += `</div>`;
        return html;
    }

    function getWysiwygEditorHTML(blockId) {
        ensureWysiwygState(blockId);
        const data = appState[blockId];
        const activeTab = data.tabs.find(t => t.id === data.activeTabId) || data.tabs[0];
        let tabsHtml = '';
        data.tabs.forEach(tab => {
            const isActive = tab.id === data.activeTabId ? 'active' : '';
            const closeBtn = data.tabs.length > 1 ? `<span class="tab-close" data-id="${tab.id}">&times;</span>` : '';
            tabsHtml += `<div class="tab ${isActive}" data-tab-id="${tab.id}">${tab.title||'Nieuwe tab'} ${closeBtn}</div>`;
        });
        return `<div class="editor-tabs" data-block="${blockId}">${tabsHtml}<button class="add-tab-btn" data-block="${blockId}">+</button></div>
            <div class="form-group"><label>Tab titel:</label><input type="text" class="text-input tab-title-input" value="${activeTab.title}" placeholder="Typ een titel..."></div>
            <div class="wysiwyg-container">
                <div class="wysiwyg-toolbar">
                    <button class="toolbar-btn">P</button><button class="toolbar-btn">H1</button><button class="toolbar-btn">H2</button>
                    <div class="toolbar-divider"></div>
                    <button class="toolbar-btn" style="font-weight:900;">B</button><button class="toolbar-btn" style="font-style:italic;">I</button>
                    <button class="btn-photo" style="margin-left: auto;">${svgPhoto} Bijlages</button>
                </div>
                <textarea class="wysiwyg-area tab-content-input" placeholder="Typ inhoud...">${activeTab.content}</textarea>
            </div>
            <button class="btn-save btn-save-text" data-block="${blockId}">Opslaan</button>`;
    }

    function getWysiwygPreviewHTML(blockId, blockName) {
        ensureWysiwygState(blockId);
        const data = appState[blockId];
        let html = `<h1 class="slide-title">${blockName}</h1>`;
        data.tabs.forEach(tab => {
            const contentToUse = tab.content ? tab.content.replace(/\n/g,'<br>') : 'Geen inhoud opgeslagen.';
            if(tab.title && tab.title.toLowerCase() !== 'nieuwe tab') html += `<h2 style="font-size:32px;font-weight:700;margin-bottom:20px;color:var(--vrmwb-gold);">${tab.title}</h2>`;
            html += `<div style="font-size:24px;line-height:1.6;margin-bottom:40px;" class="kis-text-content">${contentToUse}</div>`;
            
            // Toon mock foto's als er content is op de presentatie
            if(tab.content && tab.content.length > 5) {
                html += `<div class="kis-photo-grid"><div class="kis-photo-thumb">${svgPhoto} &nbsp; Bijlage 1</div><div class="kis-photo-thumb">${svgPhoto} &nbsp; Bijlage 2</div></div>`;
            }
        });
        return html;
    }

    const blockData = {
        'ploeg-indeling': { count:0, editorHTML:`<div class="form-group"><label>Rooster</label><div class="tags-wrapper"><span class="tag">Breda <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML:() => getRoosterKISHTML() },
        
        'alarmen': { 
            count:() => appState.alarmen.incidents.length, 
            editorHTML:`<div class="table-container"><table class="data-table"><thead><tr><th>Datum</th><th>Adres</th><th>Melding</th><th>Voertuigen</th><th>Toelichting</th><th>Acties</th></tr></thead><tbody>
                <tr><td>28-4-2026<br>22:31 - 23:13</td><td>Bochtakker Prinsenbeek</td><td>P1 Gezondheid</td><td>203151</td><td></td><td><button class="icon-btn edit">${svgEdit}</button></td></tr>
                <tr><td>28-4-2026<br>21:05 - 21:20</td><td>Winkelcentrum de Barones Breda</td><td>P2 Brand - Specifiek - Brandgerucht</td><td>203132</td><td></td><td><button class="icon-btn edit">${svgEdit}</button></td></tr>
                <tr><td>28-4-2026<br>16:00 - 16:25</td><td>ROFRA Home Kruisvoort Breda</td><td>P1 Brand - Buiten - Container</td><td>203132</td><td></td><td><button class="icon-btn edit">${svgEdit}</button></td></tr>
                </tbody></table></div>`, 
            previewHTML:() => getModernTableKISHTML('ALARMEN VORIGE DIENST', appState.alarmen.incidents) 
        },
        
        'evenementen':    { count:() => appState.evenementen.incidents.length, editorHTML:`<div class="form-group"><label>Filter</label><div class="tags-wrapper"><span class="tag">Nieuw-Vossemeer <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML:() => getModernTableKISHTML('EVENEMENTEN', appState.evenementen.incidents) },
        'voertuigen':     { count:0, editorHTML:`<div class="form-group"><label>Voertuigen</label><div class="tags-wrapper"><span class="tag">201531 <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML:`<h1 class="slide-title">STATUS VOERTUIGEN</h1><h3 style="font-size:24px;font-weight:700;">Geen defecten gemeld.</h3>` },
        'topdesk':        { count:0, editorHTML:`<div class="form-group"><label>Topdesk</label><div class="tags-wrapper"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML:`<h1 class="slide-title">TOPDESK MELDINGEN</h1><p style="opacity:0.5;font-size:20px;">Geen meldingen.</p>` },
        'mobiliteit':     { count:0, editorHTML:`<div class="form-group"><label>Kaart</label><div class="tags-wrapper"><span class="tag">Weg Info <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML:`<h1 class="slide-title">MOBILITEIT</h1><div style="width:100%;height:400px;background:rgba(0,0,0,0.05);border:1px dashed rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;">Kaart module</div>` },
        'onderhoud':      { count:1, editorHTML:`<div class="table-container"><table class="data-table"><thead><tr><th>Voertuig</th><th>Melding</th><th>Acties</th></tr></thead><tbody><tr><td>20-1571</td><td>Onderhoud</td><td><button class="icon-btn edit">${svgEdit}</button></td></tr></tbody></table></div>`, previewHTML:`<h1 class="slide-title">GEPLAND ONDERHOUD VOERTUIGEN</h1><p style="font-size:20px;">20-1571 in onderhoud.</p>` },
        'algemeen':       { count:() => appState.algemeen.tasks.length, editorHTML:() => getTaskEditorHTML('algemeen'), previewHTML:() => getTaskKISHTML('algemeen','ALG. WERKZAAMHEDEN') },
        'ademlucht':      { count:() => appState.ademlucht.tasks.length, editorHTML:() => getTaskEditorHTML('ademlucht'), previewHTML:() => getTaskKISHTML('ademlucht','ADEMLUCHT WERKZAAMHEDEN') },
        'vakbekwaam':     { count:0, editorHTML:`<div class="form-group"><label>Ploegen</label><div class="dropdown-input placeholder">Selecteer...</div></div><button class="btn-save">Opslaan</button>`, previewHTML:`<h1 class="slide-title">VAKBEKWAAM AG5</h1><p style="opacity:0.5;font-size:20px;">Geen bijzonderheden.</p>` },
        'default':        { count:0, editorHTML:(id) => getWysiwygEditorHTML(id), previewHTML:(id,blockName) => getWysiwygPreviewHTML(id,blockName) }
    };

    function getHTML(id, type, defaultTitle) { const data = blockData[id]||blockData['default']; const content = data[type]; return typeof content==='function' ? content(id, defaultTitle) : content; }
    function getBadgeCount(id) { const data = blockData[id]||blockData['default']; const count = data.count; return typeof count==='function' ? count() : count; }
    function initializeBadges() { document.querySelectorAll('.drag-item').forEach(card => { const count = getBadgeCount(card.getAttribute('data-id')); if(count>0){ let badge=document.createElement('span'); badge.className='badge red-bg'; badge.innerText=count; card.appendChild(badge); } }); }
    initializeBadges();

    // --- 8. DOM EVENTS ---
    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-save-text')) {
            const blockId = e.target.getAttribute('data-block'); ensureWysiwygState(blockId);
            const data = appState[blockId]; const activeTab = data.tabs.find(t => t.id===data.activeTabId);
            activeTab.title = document.querySelector('.tab-title-input').value;
            activeTab.content = document.querySelector('.tab-content-input').value;
            const activeTabEl = document.querySelector('.editor-tabs .tab.active');
            if(activeTabEl) activeTabEl.childNodes[0].nodeValue = (activeTab.title||'Nieuwe tab')+' ';
            const btn = e.target; const orgText = btn.innerText;
            btn.innerText = 'Opgeslagen ✓'; btn.style.backgroundColor = 'var(--vrmwb-gold)'; btn.style.color = '#1E1E1E';
            setTimeout(() => { btn.innerText = orgText; btn.style.backgroundColor=''; btn.style.color=''; }, 1500);
            return;
        }
        const tabEl = e.target.closest('.tab');
        if(tabEl && !e.target.classList.contains('tab-close')) {
            const blockId = tabEl.closest('.editor-tabs').getAttribute('data-block'); ensureWysiwygState(blockId);
            const data = appState[blockId]; const tabId = parseInt(tabEl.getAttribute('data-tab-id'));
            const oldTab = data.tabs.find(t => t.id===data.activeTabId);
            if(oldTab){ oldTab.title=document.querySelector('.tab-title-input').value; oldTab.content=document.querySelector('.tab-content-input').value; }
            data.activeTabId = tabId;
            document.getElementById('editor-content').innerHTML = getHTML(blockId,'editorHTML',document.getElementById('editor-title').innerText);
            return;
        }
        if(e.target.classList.contains('add-tab-btn')) {
            const blockId = e.target.getAttribute('data-block'); ensureWysiwygState(blockId);
            const data = appState[blockId];
            const oldTab = data.tabs.find(t => t.id===data.activeTabId);
            if(oldTab){ oldTab.title=document.querySelector('.tab-title-input').value; oldTab.content=document.querySelector('.tab-content-input').value; }
            const newId = Date.now(); data.tabs.push({id:newId,title:'Nieuwe tab',content:''}); data.activeTabId=newId;
            document.getElementById('editor-content').innerHTML = getHTML(blockId,'editorHTML',document.getElementById('editor-title').innerText);
            return;
        }
        if(e.target.classList.contains('tab-close')) {
            const blockId = e.target.closest('.editor-tabs').getAttribute('data-block'); ensureWysiwygState(blockId);
            const data = appState[blockId]; const tabId = parseInt(e.target.getAttribute('data-id'));
            data.tabs = data.tabs.filter(t => t.id!==tabId);
            if(data.activeTabId===tabId) data.activeTabId = data.tabs[data.tabs.length-1].id;
            document.getElementById('editor-content').innerHTML = getHTML(blockId,'editorHTML',document.getElementById('editor-title').innerText);
            e.stopPropagation(); return;
        }
        const checkToggle = e.target.closest('.editor-check-toggle, .kis-checklist-card');
        if(checkToggle && !e.target.closest('.icon-btn')) {
            const blockId = checkToggle.getAttribute('data-block'); const taskId = checkToggle.getAttribute('data-id');
            const task = appState[blockId].tasks.find(t => t.id===taskId);
            if(task) {
                task.checked = !task.checked;
                document.querySelectorAll(`[data-block="${blockId}"][data-id="${taskId}"]`).forEach(el => {
                    const icon = el.querySelector('.check-box, .kis-check-square');
                    if(task.checked){ el.classList.add('checked'); if(icon) icon.innerText='✓'; }
                    else { el.classList.remove('checked'); if(icon) icon.innerText=''; }
                });
            }
            return;
        }
        const infoTrigger = e.target.closest('.kis-info-trigger');
        const kisModal = document.getElementById('kis-modal');
        if(infoTrigger) {
            document.getElementById('kis-modal-title').innerText = infoTrigger.getAttribute('data-title');
            document.getElementById('kis-modal-text').innerText = infoTrigger.getAttribute('data-text');
            kisModal.classList.add('active'); e.stopPropagation();
        } else if(e.target.closest('#kis-modal-close') || e.target===kisModal) {
            if(kisModal) kisModal.classList.remove('active');
        }
    });

    // --- MAGIC WAND ---
    const btnMagicWand = document.getElementById('btn-magic-wand');
    if(btnMagicWand) {
        btnMagicWand.addEventListener('click', () => {
            const middleList = document.getElementById('dagjournaal-lijst');
            const leftList = document.getElementById('blok-selectie');
            ['ploeg-indeling','alarmen','mobiliteit','onderhoud','algemeen','evenementen'].forEach(id => {
                const card = leftList.querySelector(`[data-id="${id}"]`);
                if(card){ card.classList.remove('theme-card-light'); card.classList.add('sequence-card'); middleList.appendChild(card); }
            });
            document.getElementById('empty-state').style.display = 'none';
            showToast('Dagjournaal automatisch gevuld!');
        });
    }

    // --- DRAG & DROP ---
    const middleList = document.getElementById('dagjournaal-lijst');
    const leftList = document.getElementById('blok-selectie');
    const editorContent = document.getElementById('editor-content');
    const leftColumn = leftList ? leftList.closest('.column') : null;
    const middleColumn = middleList ? middleList.closest('.column') : null;
    let currentSelectedBlockId = null;

    document.querySelectorAll('.drag-item').forEach(draggable => {
        draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            if(middleList.contains(draggable)) draggable.classList.add('sequence-card');
            else draggable.classList.remove('sequence-card','active-card','gold'), draggable.classList.add('theme-card-light');
            document.getElementById('empty-state').style.display = middleList.querySelectorAll('.drag-item').length===0 ? 'block' : 'none';
            if(!middleList.querySelector('.active-card')) {
                document.getElementById('editor-title').innerText = "GEEN BLOK GESELECTEERD";
                editorContent.innerHTML = `<div class="editor-placeholder-text">Selecteer een blok (links of in het midden) om de instellingen te bekijken.</div>`;
                currentSelectedBlockId = null;
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect(); const offset = y - box.top - box.height/2;
            if(offset<0 && offset>closest.offset) return {offset,element:child}; else return closest;
        }, {offset:Number.NEGATIVE_INFINITY}).element;
    }

    if(leftColumn && middleColumn) {
        [leftColumn, middleColumn].forEach(col => {
            col.addEventListener('dragover', e => {
                e.preventDefault(); const draggable = document.querySelector('.dragging'); if(!draggable) return;
                const zone = col.querySelector('.scroll-area'); const afterElement = getDragAfterElement(zone, e.clientY);
                if(afterElement==null) zone.appendChild(draggable); else zone.insertBefore(draggable, afterElement);
            });
        });
    }

    function handleCardSelection(card) {
        if(!card) return;
        document.querySelectorAll('.drag-item').forEach(c => c.classList.remove('active-card','gold'));
        card.classList.add('active-card','gold');
        currentSelectedBlockId = card.getAttribute('data-id');
        let clone = card.cloneNode(true); let badge = clone.querySelector('.badge'); if(badge) badge.remove();
        const title = clone.textContent.trim().toUpperCase();
        document.getElementById('editor-title').innerText = title;
        editorContent.innerHTML = getHTML(currentSelectedBlockId,'editorHTML',title);
    }

    if(middleList) middleList.addEventListener('click', e => handleCardSelection(e.target.closest('.drag-item')));
    if(leftList) leftList.addEventListener('click', e => handleCardSelection(e.target.closest('.drag-item')));

    const previewModal = document.getElementById('preview-modal');
    const btnOpenPreview = document.getElementById('btn-open-preview');
    if(btnOpenPreview) {
        btnOpenPreview.addEventListener('click', () => {
            if(!currentSelectedBlockId){ alert("Selecteer eerst een blok!"); return; }
            const title = document.getElementById('editor-title').innerText;
            document.getElementById('preview-body').innerHTML = getHTML(currentSelectedBlockId,'previewHTML',title);
            previewModal.classList.add('active');
        });
    }
    const closePreviewBtn = document.getElementById('close-preview');
    if(closePreviewBtn) closePreviewBtn.addEventListener('click', () => previewModal.classList.remove('active'));

    // --- PRESENTATION ---
    const presentationOverlay = document.getElementById('presentation-overlay');
    const presContent = document.getElementById('pres-content');
    const presBgImageContainer = document.getElementById('pres-bg-image');
    let presentationSlides = []; let currentSlideIndex = 0;

    function buildPresentation() {
        presentationSlides = []; presBgImageContainer.innerHTML = '';
        let contentImagePool = []; for(let i=1;i<=25;i++) contentImagePool.push(`img/content-${i}.jpg`); contentImagePool.sort(()=>Math.random()-0.5);
        const locText = locLabel && locLabel.innerText !== 'Selecteer kazerne' ? locLabel.innerText : 'KAZERNE';
        const dateTextElement = document.getElementById('bbdate');
        const dateText = dateTextElement ? dateTextElement.innerText : '';
        presentationSlides.push({ bgImage:`img/intro-${Math.floor(Math.random()*5)+1}.jpg`, html:`<div style="text-align:center;width:100%;"><h1 class="slide-title" style="font-size:72px;margin-bottom:20px;border-bottom:none;">OPERATIONEEL DAGJOURNAAL</h1><h2 style="font-size:48px;color:var(--vrmwb-gold);margin-bottom:40px;text-transform:uppercase;">${locText}</h2><p style="font-size:32px;opacity:0.7;font-weight:700;">${dateText}</p></div>`, blockId:null });
        if(middleList) {
            middleList.querySelectorAll('.drag-item').forEach((block, index) => {
                const id = block.getAttribute('data-id'); let clone = block.cloneNode(true); let badge = clone.querySelector('.badge'); if(badge) badge.remove();
                const title = clone.textContent.trim().toUpperCase(); let slideHtml = getHTML(id,'previewHTML',title);
                presentationSlides.push({ bgImage:contentImagePool[index%contentImagePool.length], html:`<div style="width:100%;text-align:left;padding:0 40px;">${slideHtml}</div>`, blockId:id, blockTitle:title });
            });
        }
        presentationSlides.push({ bgImage:`img/outro-${Math.floor(Math.random()*5)+1}.jpg`, html:`<div style="text-align:center;width:100%;"><h1 class="slide-title" style="font-size:64px;margin-bottom:40px;border-bottom:4px solid var(--vrmwb-red);">EINDE DAGJOURNAAL</h1><p style="font-size:36px;opacity:0.8;font-weight:700;">Zijn er nog bijzonderheden of vragen?</p></div>`, blockId:null });
        presentationSlides.forEach((slide, i) => {
            const bgLayer = document.createElement('div'); bgLayer.id = `bg-slide-${i}`;
            bgLayer.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background-size:cover;background-position:center;background-image:url('${slide.bgImage}');opacity:${i===0?'1':'0'};transition:opacity 0.4s ease;`;
            presBgImageContainer.appendChild(bgLayer);
        });
    }

    function showSlide(index) {
        if(index<0) index=0; if(index>=presentationSlides.length) index=presentationSlides.length-1;
        currentSlideIndex = index;
        const currentSlide = presentationSlides[currentSlideIndex];
        if(currentSlide.blockId) { let freshHtml = getHTML(currentSlide.blockId,'previewHTML',currentSlide.blockTitle); currentSlide.html=`<div style="width:100%;text-align:left;padding:0 40px;">${freshHtml}</div>`; }
        presentationSlides.forEach((_,i) => { const layer=document.getElementById(`bg-slide-${i}`); if(layer) layer.style.opacity=(i===currentSlideIndex)?'1':'0'; });
        if(presContent) presContent.innerHTML = currentSlide.html;
        const presCounter = document.getElementById('pres-counter'); if(presCounter) presCounter.innerText=`${currentSlideIndex+1} / ${presentationSlides.length}`;
        const presPrev = document.getElementById('pres-prev'); if(presPrev) presPrev.style.visibility=(currentSlideIndex===0)?'hidden':'visible';
        const presNext = document.getElementById('pres-next'); if(presNext) presNext.style.visibility=(currentSlideIndex===presentationSlides.length-1)?'hidden':'visible';
        const kisModal = document.getElementById('kis-modal'); if(kisModal) kisModal.classList.remove('active');
    }

    const btnStartPres = document.getElementById('btn-start-presentation');
    if(btnStartPres) {
        btnStartPres.addEventListener('click', () => {
            if(locLabel && locLabel.innerText==='Selecteer kazerne'){ alert("Selecteer eerst een Kazerne linksboven."); if(locWrap) locWrap.classList.add('open'); return; }
            if(middleList && middleList.querySelectorAll('.drag-item').length===0){ alert("Voeg blokken toe aan het dagjournaal!"); return; }
            buildPresentation(); currentSlideIndex=0; showSlide(0);
            if(presentationOverlay) presentationOverlay.classList.add('active');
            if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(e=>console.log(e));
        });
    }
    const closePresBtn = document.getElementById('close-presentation');
    if(closePresBtn) {
        closePresBtn.addEventListener('click', () => {
            if(presentationOverlay) presentationOverlay.classList.remove('active');
            if(document.fullscreenElement) document.exitFullscreen().catch(e=>console.log(e));
        });
    }
    const presPrevBtn = document.getElementById('pres-prev'); if(presPrevBtn) presPrevBtn.addEventListener('click', () => showSlide(currentSlideIndex-1));
    const presNextBtn = document.getElementById('pres-next'); if(presNextBtn) presNextBtn.addEventListener('click', () => showSlide(currentSlideIndex+1));

    window.addEventListener('keydown', (e) => {
        const kisModal = document.getElementById('kis-modal');
        if(presentationOverlay && presentationOverlay.classList.contains('active') && !(kisModal && kisModal.classList.contains('active'))) {
            if(e.key==='ArrowRight'||e.key===' ') showSlide(currentSlideIndex+1);
            else if(e.key==='ArrowLeft') showSlide(currentSlideIndex-1);
            else if(e.key==='Escape' && closePresBtn) closePresBtn.click();
        } else if(e.key==='Escape' && kisModal) { kisModal.classList.remove('active'); }
    });

    setTimeout(() => {
        for(let i=1;i<=5;i++){ new Image().src=`img/intro-${i}.jpg`; new Image().src=`img/outro-${i}.jpg`; }
        for(let i=1;i<=25;i++){ new Image().src=`img/content-${i}.jpg`; }
    }, 1000);
});
// Vang pijltoetsen op en stuur ze naar de hoofdpresentatie
document.addEventListener('keydown', (e) => {
    const navKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '];
    if (navKeys.includes(e.key)) {
        e.preventDefault(); // Voorkom dat de iframe zelf gaat scrollen
        window.parent.postMessage({ type: 'iframeNav', key: e.key }, '*');
    }
});