// Boldron Pinfold Dominoes Club - App v3 (Firebase)
(async function() {
    'use strict';

    // Load all data from Firestore
    await DB.loadAll();
    await seedIfEmpty();
    document.getElementById('loading-screen').style.display = 'none';

    // ===== ADMIN PIN =====
    function getAdminPin() { const s = DB.get('settings'); return s ? s.adminPin : '1875'; }

    // ===== VIEW SWITCHING =====
    const playerView = document.getElementById('player-view');
    const adminView = document.getElementById('admin-view');
    document.getElementById('admin-toggle').addEventListener('click', () => {
        const pin = prompt('Enter admin PIN:');
        if (pin !== getAdminPin()) { if (pin !== null) alert('Incorrect PIN.'); return; }
        playerView.classList.add('hidden');
        adminView.classList.remove('hidden');
        renderAdminTab('fixtures');
    });
    document.getElementById('player-toggle').addEventListener('click', () => {
        adminView.classList.add('hidden');
        playerView.classList.remove('hidden');
        renderPlayerView();
    });
    const adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            adminTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            renderAdminTab(tab.dataset.tab);
        });
    });

    // ===== UTILITIES =====
    function formatDate(ds){const d=new Date(ds+'T00:00:00');return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'});}
    function getDateParts(ds){const d=new Date(ds+'T00:00:00');return{dayName:d.toLocaleDateString('en-GB',{weekday:'short'}),dayNum:d.getDate(),month:d.toLocaleDateString('en-GB',{month:'short'})};}
    function isUpcoming(ds){const n=new Date();n.setHours(0,0,0,0);return new Date(ds+'T00:00:00')>=n;}
    function isPast(ds){const n=new Date();n.setHours(0,0,0,0);return new Date(ds+'T00:00:00')<n;}
    function showMsg(el,text,err){el.textContent=text;el.style.color=err?'var(--danger)':'var(--success)';el.style.display='block';setTimeout(()=>{el.style.display='none';},3000);}
    function genId(){return 'fx'+Date.now()+Math.random().toString(36).substr(2,5);}

    // ===== DATA LAYER (backed by Firestore via DB) =====
    function loadPlayerRegistry(){return DB.getOrDefault('player_registry',CLUB_DATA.playerRegistry);}
    function savePlayerRegistry(r){DB.set('player_registry',r);}
    function getPlayers(){return loadPlayerRegistry().filter(p=>p.active).map(p=>p.name);}
    function renamePlayer(id,newName){
        const reg=loadPlayerRegistry(),player=reg.find(p=>p.id===id);if(!player)return;const old=player.name;if(old===newName)return;
        player.name=newName;savePlayerRegistry(reg);
        const avail=loadAvailability();Object.keys(avail).forEach(k=>{if(avail[k][old]!==undefined){avail[k][newName]=avail[k][old];delete avail[k][old];}});saveAvailability(avail);
        const sel=loadTeamSelections();Object.keys(sel).forEach(k=>{const i=sel[k].indexOf(old);if(i!==-1)sel[k][i]=newName;});saveTeamSelections(sel);
        const res=loadMatchResults();Object.keys(res).forEach(k=>{const m=res[k];if(m.players){const i=m.players.indexOf(old);if(i!==-1)m.players[i]=newName;}if(m.scores&&m.scores[old]!==undefined){m.scores[newName]=m.scores[old];delete m.scores[old];}});saveMatchResults(res);
        const duties=loadDutyOverrides();Object.keys(duties).forEach(k=>{Object.keys(duties[k]).forEach(f=>{if(duties[k][f]===old)duties[k][f]=newName;});});saveDutyOverrides(duties);
    }
    function nextPlayerId(){const r=loadPlayerRegistry();let mx=0;r.forEach(p=>{const n=parseInt(p.id.replace('p',''));if(n>mx)mx=n;});return 'p'+(mx+1);}

    function getActiveSeason(){return DB.getOrDefault('active_season','25-26');}
    function setActiveSeason(id){DB.set('active_season',id);}
    function loadCustomSeasons(){return DB.getOrDefault('custom_seasons',{});}
    function saveCustomSeasons(d){DB.set('custom_seasons',d);}
    function getAllSeasons(){const c=loadCustomSeasons();const s={'24-25':{label:'2024/25',fixtures:CLUB_DATA.fixtures_24_25,stats:CLUB_DATA.stats_24_25},'25-26':{label:'2025/26',fixtures:CLUB_DATA.fixtures_25_26,stats:CLUB_DATA.stats_25_26}};Object.keys(c).forEach(id=>{s[id]=c[id];});return s;}

    function getFixturesOverrides(){return DB.getOrDefault('fixtures_overrides',{});}
    function saveFixturesOverrides(d){DB.set('fixtures_overrides',d);}
    function getCurrentFixtures(){
        const s=getActiveSeason();const overrides=getFixturesOverrides();
        if(overrides[s])return overrides[s];
        const c=loadCustomSeasons();if(c[s])return c[s].fixtures;
        if(s==='24-25')return CLUB_DATA.fixtures_24_25;return CLUB_DATA.fixtures_25_26;
    }
    function getEditableFixtures(sid){
        const overrides=getFixturesOverrides();if(overrides[sid])return JSON.parse(JSON.stringify(overrides[sid]));
        const c=loadCustomSeasons();if(c[sid])return JSON.parse(JSON.stringify(c[sid].fixtures));
        if(sid==='25-26')return JSON.parse(JSON.stringify(CLUB_DATA.fixtures_25_26));
        if(sid==='24-25')return JSON.parse(JSON.stringify(CLUB_DATA.fixtures_24_25));return[];
    }
    function saveEditableFixtures(sid,fx){
        const overrides=getFixturesOverrides();overrides[sid]=fx;saveFixturesOverrides(overrides);
        const c=loadCustomSeasons();if(c[sid]){c[sid].fixtures=fx;saveCustomSeasons(c);}
    }

    function loadAvailability(){return DB.getOrDefault('availability',CLUB_DATA.availability_25_26);}
    function saveAvailability(d){DB.set('availability',d);}
    function loadTeamSelections(){return DB.getOrDefault('team_selections',{});}
    function saveTeamSelections(d){DB.set('team_selections',d);}
    function getPlayingTeam(f){const s=loadTeamSelections();return s[getAvailKey(f)]||[];}
    function loadDutyOverrides(){return DB.getOrDefault('duty_overrides',{});}
    function saveDutyOverrides(d){DB.set('duty_overrides',d);}
    function getDuty(f,field){const o=loadDutyOverrides(),k=getAvailKey(f);if(o[k]&&o[k][field]!==undefined)return o[k][field];return f[field]||'';}
    function loadMatchResults(){return DB.getOrDefault('match_results',{});}
    function saveMatchResults(d){DB.set('match_results',d);}
    function loadExtraFinances(){return DB.getOrDefault('extra_finances',{income:[],expenses:[]});}
    function saveExtraFinances(d){DB.set('extra_finances',d);}
    function getAllFinances(){const b=CLUB_DATA.finances,e=loadExtraFinances();const inc=[...b.income,...e.income].sort((a,c)=>a.date.localeCompare(c.date));const exp=[...b.expenses,...e.expenses].sort((a,c)=>a.date.localeCompare(c.date));const ti=inc.reduce((s,i)=>s+i.value,0),te=exp.reduce((s,i)=>s+i.value,0);return{income:inc,expenses:exp,totalIncome:ti,totalExpenses:te,balance:ti-te};}

    function getAvailKey(f){return f.id||f.date;}
    function computeStats(){
        const results=loadMatchResults(),ps={};
        Object.keys(results).forEach(k=>{const m=results[k];if(!m.scores)return;Object.keys(m.scores).forEach(p=>{const sc=parseFloat(m.scores[p])||0;if(!ps[p])ps[p]={gamesPlayed:0,roundsWon:0};ps[p].gamesPlayed++;ps[p].roundsWon+=sc;});});
        return Object.keys(ps).map(name=>{const s=ps[name];return{name,gamesPlayed:s.gamesPlayed,roundsWon:s.roundsWon,winRate:s.gamesPlayed*3>0?s.roundsWon/(s.gamesPlayed*3):0};});
    }

    // ===== PLAYER VIEW =====
    const playerSelect=document.getElementById('current-player');
    function populatePlayerSelect(){
        const cur=playerSelect.value;playerSelect.innerHTML='<option value="">-- Select your name --</option>';
        getPlayers().forEach(p=>{const o=document.createElement('option');o.value=p;o.textContent=p;playerSelect.appendChild(o);});
        const saved=localStorage.getItem('bp_current_player');
        if(cur&&getPlayers().includes(cur))playerSelect.value=cur;else if(saved&&getPlayers().includes(saved))playerSelect.value=saved;
    }
    populatePlayerSelect();
    playerSelect.addEventListener('change',()=>{localStorage.setItem('bp_current_player',playerSelect.value);renderPlayerView();});

    function renderPlayerView(){renderUpcomingFixtures();renderRecentResults();renderMyStats();}

    function renderUpcomingFixtures(){
        const container=document.getElementById('upcoming-fixtures');const fixtures=getCurrentFixtures();
        const upcoming=fixtures.filter(f=>f.opponent.toLowerCase()!=='bye'&&isUpcoming(f.date));
        if(!upcoming.length){container.innerHTML='<p style="color:var(--text-muted);font-size:1rem;padding:1rem 0;">No upcoming games scheduled.</p>';return;}
        const currentPlayer=playerSelect.value;const avData=loadAvailability();
        container.innerHTML=upcoming.map((f,idx)=>{
            const parts=getDateParts(f.date),vc=f.venue?f.venue.toLowerCase():'',key=getAvailKey(f);
            const avail=avData[key]||avData[f.date]||{};const myStatus=currentPlayer?(avail[currentPlayer]||''):'';
            const playing=getPlayingTeam(f);const amI=currentPlayer&&playing.includes(currentPlayer);const isNext=idx===0;
            let teamHtml='';if(playing.length>0){teamHtml=`<div class="fixture-playing-team"><span class="playing-label">🏆 Playing:</span>${playing.map(p=>`<span class="playing-name${p===currentPlayer?' me':''}">${p}</span>`).join('')}</div>`;}
            return `<div class="fixture-tile${amI?' playing-highlight':''}${isNext?' next-game':''}">
                ${isNext?'<div class="next-game-banner">NEXT GAME</div>':''}
                <div class="fixture-tile-header"><div class="fixture-date-block"><span class="day-name">${parts.dayName}</span><span class="day-num">${parts.dayNum}</span><span class="month">${parts.month}</span></div>
                <div class="fixture-info"><div><div class="fixture-opponent-name">${f.opponent}</div>${f.venue?`<span class="venue-badge ${vc}">${f.venue}</span>`:''}${amI?'<span class="venue-badge home" style="margin-left:0.5rem;">You\'re Playing!</span>':''}</div></div></div>
                ${getDuty(f,'supper')||getDuty(f,'drivers')||getDuty(f,'bar')?`<div class="fixture-duties">${getDuty(f,'supper')?`<div class="duty-chip">🍽️ <strong>${getDuty(f,'supper')}</strong></div>`:''}${getDuty(f,'drivers')?`<div class="duty-chip">🚗 <strong>${getDuty(f,'drivers')}</strong></div>`:''}${getDuty(f,'bar')?`<div class="duty-chip">🍺 <strong>${getDuty(f,'bar')}</strong></div>`:''}</div>`:''}
                ${teamHtml}
                ${currentPlayer?`<div class="fixture-tile-body"><span class="avail-label">Are you available?</span><div class="avail-buttons">
                    <button class="avail-btn ${myStatus==='Available'?'selected-available':''}" data-key="${key}" data-status="Available">✓ Yes</button>
                    <button class="avail-btn ${myStatus==='Reserve'?'selected-reserve':''}" data-key="${key}" data-status="Reserve">⏳ Reserve</button>
                    <button class="avail-btn ${myStatus==='Not Available'?'selected-not-available':''}" data-key="${key}" data-status="Not Available">✗ No</button>
                </div><span class="avail-saved" id="saved-${key}">Saved ✓</span></div>`:`<div class="fixture-tile-body"><span class="avail-label" style="color:var(--text-muted)">👆 Select your name above to mark availability</span></div>`}
            </div>`;
        }).join('');
        container.querySelectorAll('.avail-btn').forEach(btn=>btn.addEventListener('click',handleAvailClick));
    }

    function handleAvailClick(e){
        const btn=e.currentTarget,key=btn.dataset.key,status=btn.dataset.status,player=playerSelect.value;if(!player)return;
        const avail=loadAvailability();if(!avail[key])avail[key]={};avail[key][player]=status;saveAvailability(avail);
        btn.closest('.avail-buttons').querySelectorAll('.avail-btn').forEach(b=>{b.className='avail-btn';});
        btn.classList.add({'Available':'selected-available','Reserve':'selected-reserve','Not Available':'selected-not-available'}[status]);
        const msg=document.getElementById('saved-'+key);if(msg){msg.classList.add('show');setTimeout(()=>msg.classList.remove('show'),1500);}
    }

    function renderRecentResults(){
        const container=document.getElementById('recent-results');const results=loadMatchResults();const fixtures=getCurrentFixtures();
        const played=fixtures.filter(f=>{const k=getAvailKey(f);return(results[k]&&results[k].result)||(f.result&&isPast(f.date));}).reverse().slice(0,6);
        if(!played.length){container.innerHTML='<p style="color:var(--text-muted)">No results yet.</p>';return;}
        container.innerHTML=played.map(f=>{const r=results[getAvailKey(f)];const res=r?r.result:f.result;
            return `<div class="result-item"><span class="result-date">${formatDate(f.date)}</span><span class="result-opponent">${f.opponent}</span><span class="venue-badge ${f.venue.toLowerCase()}">${f.venue}</span><span class="result-badge ${res.toLowerCase()}">${res}</span></div>`;}).join('');
    }

    function renderMyStats(){
        const container=document.getElementById('my-stats');if(!container)return;const player=playerSelect.value;
        if(!player){container.innerHTML='';return;}
        const results=loadMatchResults();let games=0,rounds=0;
        Object.values(results).forEach(m=>{if(m.scores&&m.scores[player]!==undefined){games++;rounds+=parseFloat(m.scores[player])||0;}});
        if(games===0){const s=getAllSeasons()[getActiveSeason()];const hs=s&&s.stats?s.stats.find(x=>x.name===player):null;if(hs){games=hs.gamesPlayed;rounds=hs.roundsWon;}}
        if(games===0){container.innerHTML='';return;}
        const pct=games*3>0?Math.round(rounds/(games*3)*100):0;
        container.innerHTML=`<div class="my-stats-card"><h3>Your Season Stats</h3><div class="my-stats-nums"><div><span class="stat-num">${games}</span><span class="stat-label">Games</span></div><div><span class="stat-num">${rounds}</span><span class="stat-label">Rounds Won</span></div><div><span class="stat-num">${pct}%</span><span class="stat-label">Win Rate</span></div></div></div>`;
    }

    // ===== ADMIN =====
    function renderAdminTab(tab){switch(tab){case 'fixtures':renderFixturesAndTeam();break;case 'results-entry':renderResultsEntry();break;case 'stats':renderStats();break;case 'finances':renderFinances();break;case 'players':renderPlayers();break;case 'season-manager':renderSeasonManager();break;}}

    // ===== FIXTURES & TEAM =====
    function renderFixturesAndTeam(){
        const container=document.getElementById('tab-fixtures');const fixtures=getCurrentFixtures();const activeSeason=getActiveSeason();
        const upcoming=fixtures.filter(f=>f.opponent.toLowerCase()!=='bye'&&isUpcoming(f.date));
        const past=fixtures.filter(f=>f.opponent.toLowerCase()!=='bye'&&isPast(f.date));
        const results=loadMatchResults();const avData=loadAvailability();
        let html='<div class="team-overview-grid">';
        if(upcoming.length>0){
            html+='<h3 style="color:var(--primary);margin-bottom:0.75rem;">Upcoming</h3>';
            upcoming.forEach(f=>{
                const key=getAvailKey(f),avail=avData[key]||avData[f.date]||{},playing=getPlayingTeam(f);
                const available=[];getPlayers().forEach(p=>{if((avail[p]||'')==='Available')available.push(p);});
                const tc=available.length;let st,sc;if(tc>=6){st=`Full (${tc})`;sc='full';}else if(tc>=4){st=`${tc} avail`;sc='ok';}else{st=`Only ${tc}`;sc='short';}
                const supper=getDuty(f,'supper'),drivers=getDuty(f,'drivers'),bar=getDuty(f,'bar');
                const playerRows=getPlayers().map(p=>{const s=avail[p]||'';const isP=playing.includes(p);let dot='unknown';if(s==='Available')dot='available';else if(s==='Reserve')dot='reserve';else if(s==='Not Available')dot='not-available';
                    return `<div class="team-player-row"><input type="checkbox" class="playing-check" data-key="${key}" data-player="${p}" ${isP?'checked':''}><span class="dot ${dot}"></span><span class="player-name">${p}</span><select class="avail-override" data-key="${key}" data-player="${p}"><option value="" ${!s?'selected':''}>-</option><option value="Available" ${s==='Available'?'selected':''}>Available</option><option value="Reserve" ${s==='Reserve'?'selected':''}>Reserve</option><option value="Not Available" ${s==='Not Available'?'selected':''}>Not Avail</option></select></div>`;}).join('');
                html+=`<div class="team-card"><div class="team-card-header collapsible-header" data-key="${key}"><h3>${formatDate(f.date)} — ${f.opponent} (${f.venue||'TBD'})</h3><div class="team-status"><span class="status-pill ${sc}">${st}</span>${playing.length>0?`<span class="status-pill full">🏆 ${playing.length}</span>`:'<span class="status-pill short">No team</span>'}${f.venue==='Away'&&!drivers?'<span class="status-pill short">⚠️ Drivers</span>':''}${!supper&&f.venue==='Home'?'<span class="status-pill short">⚠️ Supper</span>':''}<span class="collapse-arrow">▸</span></div></div>
                <div class="team-card-body collapsed" id="team-body-${key}"><p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;">Tick = Playing. Dropdown = availability.</p><div class="team-players-grid">${playerRows}</div>
                <div class="team-duties-edit"><div class="duty-edit-row"><label>🍽️ Supper:</label><input type="text" class="duty-input" data-key="${key}" data-field="supper" value="${supper}" placeholder="Supper?"></div><div class="duty-edit-row"><label>🚗 Drivers:</label><input type="text" class="duty-input" data-key="${key}" data-field="drivers" value="${drivers}" placeholder="Drivers?"></div><div class="duty-edit-row"><label>🍺 Bar:</label><input type="text" class="duty-input" data-key="${key}" data-field="bar" value="${bar}" placeholder="Bar?"></div></div>
                <div class="fixture-edit-inline"><span style="font-size:0.75rem;color:var(--text-muted);font-weight:600;">Edit:</span><input type="date" class="fx-edit-date" data-id="${f.id}" value="${f.date}"><input type="text" class="fx-edit-opp" data-id="${f.id}" value="${f.opponent}"><select class="fx-edit-venue" data-id="${f.id}"><option value="Home" ${f.venue==='Home'?'selected':''}>Home</option><option value="Away" ${f.venue==='Away'?'selected':''}>Away</option></select><button class="btn-remove-fx-admin" data-id="${f.id}">✕</button></div></div></div>`;
            });
        }
        if(past.length>0){html+='<h3 style="color:var(--primary);margin:1.5rem 0 0.75rem;">Past</h3><div class="fixtures-list-admin">';past.forEach(f=>{const r=results[getAvailKey(f)];const res=r?r.result:f.result;html+=`<div class="fixture-row-admin"><span class="fx-date">${formatDate(f.date)}</span><span class="fx-opp">${f.opponent}</span><span class="venue-badge ${(f.venue||'').toLowerCase()}">${f.venue||'-'}</span>${res?`<span class="result-badge ${res.toLowerCase()}">${res}</span>`:'—'}</div>`;});html+='</div>';}
        html+=`<div class="add-fixture-section" style="margin-top:1.5rem;"><h4 style="margin-bottom:0.5rem;color:var(--primary);">Add Fixture</h4><div class="form-row"><div class="form-group"><label>Date</label><input type="date" id="addfx-date"></div><div class="form-group"><label>Opponent</label><input type="text" id="addfx-opp" placeholder="e.g. Blue Bell"></div><div class="form-group"><label>Venue</label><select id="addfx-venue"><option value="Home">Home</option><option value="Away">Away</option></select></div><div class="form-group form-group-btn"><button id="addfx-btn" class="btn-add-fixture">+ Add</button></div></div><div id="addfx-msg" class="form-msg"></div></div></div>`;
        container.innerHTML=html;
        // Bindings
        container.querySelectorAll('.collapsible-header').forEach(h=>{h.addEventListener('click',e=>{if(e.target.closest('.status-pill'))return;const b=document.getElementById('team-body-'+h.dataset.key);const a=h.querySelector('.collapse-arrow');b.classList.toggle('collapsed');a.textContent=b.classList.contains('collapsed')?'▸':'▾';});});
        container.querySelectorAll('.playing-check').forEach(cb=>{cb.addEventListener('change',e=>{const k=e.target.dataset.key,p=e.target.dataset.player,sel=loadTeamSelections();if(!sel[k])sel[k]=[];if(e.target.checked){if(!sel[k].includes(p))sel[k].push(p);}else{sel[k]=sel[k].filter(x=>x!==p);}saveTeamSelections(sel);});});
        container.querySelectorAll('.avail-override').forEach(s=>{s.addEventListener('change',e=>{const k=e.target.dataset.key,p=e.target.dataset.player,v=e.target.value;const av=loadAvailability();if(!av[k])av[k]={};av[k][p]=v;saveAvailability(av);const dot=e.target.closest('.team-player-row').querySelector('.dot');dot.className='dot '+(v?v.toLowerCase().replace(/\s+/g,'-'):'unknown');});});
        container.querySelectorAll('.duty-input').forEach(i=>{i.addEventListener('change',e=>{const o=loadDutyOverrides();if(!o[e.target.dataset.key])o[e.target.dataset.key]={};o[e.target.dataset.key][e.target.dataset.field]=e.target.value.trim();saveDutyOverrides(o);});});
        container.querySelectorAll('.fx-edit-date,.fx-edit-opp,.fx-edit-venue').forEach(i=>{i.addEventListener('change',()=>{const fid=i.dataset.id;const fx=getEditableFixtures(activeSeason);const f=fx.find(x=>x.id===fid);if(!f)return;if(i.classList.contains('fx-edit-date'))f.date=i.value;else if(i.classList.contains('fx-edit-opp'))f.opponent=i.value.trim();else f.venue=i.value;fx.sort((a,b)=>a.date.localeCompare(b.date));saveEditableFixtures(activeSeason,fx);renderFixturesAndTeam();});});
        container.querySelectorAll('.btn-remove-fx-admin').forEach(btn=>{btn.addEventListener('click',()=>{const fid=btn.dataset.id;const fx=getEditableFixtures(activeSeason);const idx=fx.findIndex(x=>x.id===fid);if(idx===-1)return;if(!confirm(`Remove ${fx[idx].opponent}?`))return;fx.splice(idx,1);saveEditableFixtures(activeSeason,fx);renderFixturesAndTeam();});});
        document.getElementById('addfx-btn').addEventListener('click',()=>{const date=document.getElementById('addfx-date').value,opp=document.getElementById('addfx-opp').value.trim(),venue=document.getElementById('addfx-venue').value,msg=document.getElementById('addfx-msg');if(!date){showMsg(msg,'Date.',true);return;}if(!opp){showMsg(msg,'Opponent.',true);return;}const fx=getEditableFixtures(activeSeason);fx.push({id:genId(),date,opponent:opp,venue,supper:'',drivers:'',bar:'',result:''});fx.sort((a,b)=>a.date.localeCompare(b.date));saveEditableFixtures(activeSeason,fx);document.getElementById('addfx-date').value='';document.getElementById('addfx-opp').value='';showMsg(msg,'✓ Added',false);renderFixturesAndTeam();});
    }

    // ===== RESULTS ENTRY =====
    function renderResultsEntry(){
        const container=document.getElementById('tab-results-entry');const fixtures=getCurrentFixtures();const results=loadMatchResults();
        const withTeam=fixtures.filter(f=>f.opponent.toLowerCase()!=='bye');
        const firstUnplayed=withTeam.find(f=>!results[getAvailKey(f)]||!results[getAvailKey(f)].result);
        container.innerHTML=`<h3 style="margin-bottom:1rem;color:var(--primary);">Enter Match Results</h3>
            <div class="form-group" style="max-width:400px;margin-bottom:1.5rem;"><label>Select Fixture:</label>
            <select id="result-fixture-select" style="font-size:1rem;padding:0.5rem 0.75rem;"><option value="">-- Choose --</option>
            ${withTeam.map(f=>{const k=getAvailKey(f);const hr=results[k]&&results[k].result;return`<option value="${k}" ${firstUnplayed&&getAvailKey(firstUnplayed)===k?'selected':''}>${formatDate(f.date)} - ${f.opponent}${hr?' ✓':''}</option>`;}).join('')}</select></div>
            <div id="result-entry-form"></div>`;
        document.getElementById('result-fixture-select').addEventListener('change',e=>renderResultForm(e.target.value));
        if(firstUnplayed)renderResultForm(getAvailKey(firstUnplayed));
    }
    function renderResultForm(key){
        const fc=document.getElementById('result-entry-form');if(!key){fc.innerHTML='';return;}
        const fixtures=getCurrentFixtures();const fixture=fixtures.find(f=>getAvailKey(f)===key);if(!fixture){fc.innerHTML='';return;}
        const playing=getPlayingTeam(fixture);const results=loadMatchResults();const existing=results[key]||{};
        const avData=loadAvailability();const players=playing.length>0?playing:getPlayers().filter(p=>{const a=avData[key]||avData[fixture.date]||{};return a[p]==='Available';});
        if(!players.length){fc.innerHTML='<p style="color:var(--text-muted)">No players selected. Tick who is playing in Fixtures & Team first.</p>';return;}
        fc.innerHTML=`<div class="result-form-card"><div class="result-form-header"><h4>${formatDate(fixture.date)} — vs ${fixture.opponent} (${fixture.venue})</h4></div>
            <div class="result-form-body"><div class="result-match-outcome"><label>Result:</label><div class="result-outcome-btns">
            <button class="outcome-btn ${existing.result==='WIN'?'selected-win':''}" data-result="WIN">✓ WIN</button>
            <button class="outcome-btn ${existing.result==='DRAW'?'selected-draw':''}" data-result="DRAW">= DRAW</button>
            <button class="outcome-btn ${existing.result==='LOST'?'selected-lost':''}" data-result="LOST">✗ LOST</button></div></div>
            <div class="result-scores-grid"><div class="score-header"><span>Player</span><span>Rounds Won (0-3)</span></div>
            ${players.map(p=>{const sc=existing.scores?(existing.scores[p]??''):'';return`<div class="score-row"><span class="score-player-name">${p}</span><input type="number" class="score-input" data-player="${p}" min="0" max="3" step="0.5" value="${sc}" placeholder="0"></div>`;}).join('')}</div>
            <div style="margin-top:1rem;display:flex;gap:1rem;align-items:center;"><button id="save-result-btn" class="btn-create-season">💾 Save</button><span id="result-save-msg" class="form-msg"></span></div></div></div>`;
        let selectedResult=existing.result||'';
        fc.querySelectorAll('.outcome-btn').forEach(btn=>{btn.addEventListener('click',()=>{fc.querySelectorAll('.outcome-btn').forEach(b=>b.className='outcome-btn');selectedResult=btn.dataset.result;btn.classList.add(selectedResult==='WIN'?'selected-win':selectedResult==='DRAW'?'selected-draw':'selected-lost');});});
        document.getElementById('save-result-btn').addEventListener('click',()=>{const msg=document.getElementById('result-save-msg');if(!selectedResult){showMsg(msg,'Select result.',true);return;}const scores={};let valid=true;fc.querySelectorAll('.score-input').forEach(i=>{const v=i.value.trim(),p=i.dataset.player;if(v==='')scores[p]=0;else{const n=parseFloat(v);if(isNaN(n)||n<0||n>3)valid=false;else scores[p]=n;}});if(!valid){showMsg(msg,'0-3 only.',true);return;}const all=loadMatchResults();all[key]={result:selectedResult,opponent:fixture.opponent,venue:fixture.venue,date:fixture.date,players,scores};saveMatchResults(all);showMsg(msg,'✓ Saved!',false);});
    }

    // ===== STATS =====
    function renderStats(){
        const container=document.getElementById('tab-stats');const seasons=getAllSeasons();const opts=Object.keys(seasons).sort().reverse().map(id=>`<option value="${id}">${seasons[id].label}</option>`).join('');
        container.innerHTML=`<div class="season-picker"><label>Season:</label><select id="admin-stats-season">${opts}</select></div><div id="admin-stats-table" class="stats-wrapper"></div>`;
        const sel=document.getElementById('admin-stats-season'),tbl=document.getElementById('admin-stats-table');
        function render(){const sid=sel.value;let stats;const live=computeStats();if(live.length>0&&sid===getActiveSeason())stats=live;else{const s=getAllSeasons()[sid];stats=s?s.stats:[];}if(!stats||!stats.length){tbl.innerHTML='<p style="color:var(--text-muted)">No stats yet.</p>';return;}const sorted=[...stats].sort((a,b)=>b.winRate-a.winRate);tbl.innerHTML=`<table class="stats-table"><thead><tr><th>#</th><th>Player</th><th>Games</th><th>Rounds</th><th>Win Rate</th><th>Avg</th></tr></thead><tbody>${sorted.map((p,i)=>{const pct=Math.round(p.winRate*100);const avg=p.gamesPlayed>0?(p.roundsWon/p.gamesPlayed).toFixed(1):'0';return`<tr><td>${i+1}</td><td><strong>${p.name}</strong></td><td>${p.gamesPlayed}</td><td>${p.roundsWon}</td><td>${pct}% <div class="win-rate-bar"><div class="win-rate-fill" style="width:${pct}%"></div></div></td><td>${avg}</td></tr>`;}).join('')}</tbody></table>`;}
        sel.addEventListener('change',render);render();
    }

    // ===== FINANCES =====
    function renderFinances(){
        const container=document.getElementById('tab-finances');const fin=getAllFinances();
        container.innerHTML=`<div class="finance-summary-row"><div class="finance-box"><h4>Income</h4><div class="amount in">£${fin.totalIncome.toFixed(2)}</div></div><div class="finance-box"><h4>Expenses</h4><div class="amount out">£${fin.totalExpenses.toFixed(2)}</div></div><div class="finance-box"><h4>Balance</h4><div class="amount bal">£${fin.balance.toFixed(2)}</div></div></div>
        <div class="finance-tbl-wrap" style="margin-bottom:1.5rem;"><h3>Add Entry</h3><div class="finance-add-form"><div class="form-row"><div class="form-group"><label>Type</label><select id="fin-type"><option value="income">Income</option><option value="expense">Expense</option></select></div><div class="form-group"><label>Date</label><input type="date" id="fin-date" value="${new Date().toISOString().split('T')[0]}"></div><div class="form-group"><label>Description</label><input type="text" id="fin-item" placeholder="e.g. Raffle"></div><div class="form-group"><label>Amount (£)</label><input type="number" id="fin-amount" step="0.01" min="0" placeholder="0.00"></div><div class="form-group form-group-btn"><button id="fin-add-btn" class="btn-add">+ Add</button></div></div><div id="fin-add-msg" class="form-msg"></div></div></div>
        <div class="finance-tbl-wrap"><h3>Income</h3><table class="finance-tbl"><thead><tr><th>Date</th><th>Item</th><th>Amount</th><th></th></tr></thead><tbody>${fin.income.map((item,i)=>`<tr><td>${formatDate(item.date)}</td><td>${item.item}</td><td>£${item.value.toFixed(2)}</td><td><button class="btn-del-fin" data-type="income" data-idx="${i}">✕</button></td></tr>`).join('')}</tbody></table></div>
        <div class="finance-tbl-wrap"><h3>Expenses</h3><table class="finance-tbl"><thead><tr><th>Date</th><th>Item</th><th>Amount</th><th></th></tr></thead><tbody>${fin.expenses.map((item,i)=>`<tr><td>${formatDate(item.date)}</td><td>${item.item}</td><td>£${item.value.toFixed(2)}</td><td><button class="btn-del-fin" data-type="expenses" data-idx="${i}">✕</button></td></tr>`).join('')}</tbody></table></div>`;
        document.getElementById('fin-add-btn').addEventListener('click',()=>{const type=document.getElementById('fin-type').value,date=document.getElementById('fin-date').value,item=document.getElementById('fin-item').value.trim(),amount=parseFloat(document.getElementById('fin-amount').value),msg=document.getElementById('fin-add-msg');if(!date){showMsg(msg,'Date.',true);return;}if(!item){showMsg(msg,'Description.',true);return;}if(!amount||amount<=0){showMsg(msg,'Amount.',true);return;}const extra=loadExtraFinances();extra[type==='income'?'income':'expenses'].push({item,date,value:amount});saveExtraFinances(extra);showMsg(msg,'✓ Added',false);document.getElementById('fin-item').value='';document.getElementById('fin-amount').value='';setTimeout(()=>renderFinances(),800);});
        container.querySelectorAll('.btn-del-fin').forEach(btn=>{btn.addEventListener('click',()=>{if(!confirm('Delete?'))return;const type=btn.dataset.type,idx=parseInt(btn.dataset.idx);const baseCount=type==='income'?CLUB_DATA.finances.income.length:CLUB_DATA.finances.expenses.length;if(idx<baseCount){alert('Cannot delete original data.');return;}const extra=loadExtraFinances();extra[type].splice(idx-baseCount,1);saveExtraFinances(extra);renderFinances();});});
    }

    // ===== PLAYERS =====
    function renderPlayers(){
        const container=document.getElementById('tab-players');const reg=loadPlayerRegistry();const active=reg.filter(p=>p.active),inactive=reg.filter(p=>!p.active);
        container.innerHTML=`<div class="season-mgr"><div class="season-mgr-section"><h3>Active Squad</h3><div class="players-list">${active.map(p=>`<div class="player-edit-row"><input type="text" class="player-name-input" data-id="${p.id}" value="${p.name}"><button class="btn-deactivate-player" data-id="${p.id}">⏸️</button><button class="btn-remove-player" data-id="${p.id}" data-name="${p.name}">🗑️</button></div>`).join('')}</div><div class="add-player-row" style="margin-top:1rem;"><input type="text" id="new-player-name" placeholder="New player" class="player-name-input"><button id="add-player-btn" class="btn-add-fixture">+ Add</button></div><div id="players-msg" class="form-msg" style="margin-top:0.75rem;"></div></div>${inactive.length?`<div class="season-mgr-section"><h3>Inactive</h3><div class="players-list">${inactive.map(p=>`<div class="player-edit-row inactive-player"><span class="player-inactive-name">${p.name}</span><button class="btn-reactivate-player" data-id="${p.id}">▶️</button></div>`).join('')}</div></div>`:''}</div>`;
        container.querySelectorAll('.player-name-input[data-id]').forEach(input=>{input.addEventListener('change',e=>{const id=e.target.dataset.id,nn=e.target.value.trim(),msg=document.getElementById('players-msg');if(!nn){showMsg(msg,'Empty.',true);renderPlayers();return;}const r=loadPlayerRegistry();if(r.find(p=>p.name===nn&&p.id!==id)){showMsg(msg,'Exists.',true);renderPlayers();return;}const old=r.find(p=>p.id===id).name;renamePlayer(id,nn);populatePlayerSelect();showMsg(msg,`✓ "${old}" → "${nn}"`,false);});});
        container.querySelectorAll('.btn-deactivate-player').forEach(btn=>{btn.addEventListener('click',()=>{const r=loadPlayerRegistry(),p=r.find(x=>x.id===btn.dataset.id);if(!confirm(`Deactivate "${p.name}"?`))return;p.active=false;savePlayerRegistry(r);populatePlayerSelect();renderPlayers();});});
        container.querySelectorAll('.btn-reactivate-player').forEach(btn=>{btn.addEventListener('click',()=>{const r=loadPlayerRegistry(),p=r.find(x=>x.id===btn.dataset.id);p.active=true;savePlayerRegistry(r);populatePlayerSelect();renderPlayers();});});
        container.querySelectorAll('.btn-remove-player').forEach(btn=>{btn.addEventListener('click',()=>{if(!confirm(`DELETE "${btn.dataset.name}"?`))return;const r=loadPlayerRegistry(),i=r.findIndex(p=>p.id===btn.dataset.id);if(i!==-1)r.splice(i,1);savePlayerRegistry(r);populatePlayerSelect();renderPlayers();});});
        document.getElementById('add-player-btn').addEventListener('click',()=>{const name=document.getElementById('new-player-name').value.trim(),msg=document.getElementById('players-msg');if(!name){showMsg(msg,'Name.',true);return;}const r=loadPlayerRegistry();if(r.find(p=>p.name===name)){showMsg(msg,'Exists.',true);return;}r.push({id:nextPlayerId(),name,active:true});savePlayerRegistry(r);populatePlayerSelect();document.getElementById('new-player-name').value='';showMsg(msg,`✓ "${name}"`,false);renderPlayers();});
    }

    // ===== SEASON MANAGER =====
    function renderSeasonManager(){
        const container=document.getElementById('tab-season-manager');const seasons=getAllSeasons();const activeSeason=getActiveSeason();
        let html=`<div class="season-mgr"><div class="season-mgr-section"><h3>Seasons</h3><div class="season-list">`;
        Object.keys(seasons).sort().reverse().forEach(id=>{const s=seasons[id],isA=id===activeSeason,isB=(id==='24-25'||id==='25-26');html+=`<div class="season-list-item ${isA?'active-season':''}"><div class="season-list-info"><strong>${s.label}</strong><span class="season-fixture-count">${s.fixtures.length} fixtures</span>${isA?'<span class="status-pill full">Active</span>':''}</div><div style="display:flex;gap:0.5rem;">${!isA?`<button class="btn-set-active" data-season="${id}">Set Active</button>`:''}${!isB?`<button class="btn-delete-season" data-season="${id}" data-label="${s.label}">🗑️</button>`:''}</div></div>`;});
        html+=`</div></div><div class="season-mgr-section"><h3>Create New Season</h3><div class="new-season-form"><div class="form-row"><div class="form-group"><label>ID</label><input type="text" id="new-season-name" placeholder="e.g. 26-27"></div><div class="form-group"><label>Label</label><input type="text" id="new-season-label" placeholder="e.g. 2026/27"></div></div><h4 style="margin-top:1rem;">Fixtures</h4><div id="new-fixtures-list" class="new-fixtures-list"></div><div class="form-row" style="margin-top:0.75rem;"><div class="form-group"><label>Date</label><input type="date" id="fx-date"></div><div class="form-group"><label>Opponent</label><input type="text" id="fx-opponent" placeholder="Blue Bell"></div><div class="form-group"><label>Venue</label><select id="fx-venue"><option value="Home">Home</option><option value="Away">Away</option></select></div><div class="form-group form-group-btn"><button id="fx-add-btn" class="btn-add-fixture">+</button></div></div><div id="new-season-msg" class="form-msg" style="margin-top:0.5rem;"></div><div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);"><button id="create-season-btn" class="btn-create-season">🏆 Create Season</button></div></div></div>
        <div class="season-mgr-section"><h3>Data Backup</h3><p class="section-desc">Export or import all club data.</p><div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:0.75rem;"><button id="export-btn" class="btn-add-fixture">📥 Export</button><button id="import-btn" class="btn-add-fixture" style="background:var(--accent-dark);">📤 Import</button><input type="file" id="import-file" accept=".json" style="display:none;"></div><div id="backup-msg" class="form-msg" style="margin-top:0.5rem;"></div></div></div>`;
        container.innerHTML=html;
        container.querySelectorAll('.btn-set-active').forEach(btn=>{btn.addEventListener('click',()=>{setActiveSeason(btn.dataset.season);renderSeasonManager();renderPlayerView();});});
        container.querySelectorAll('.btn-delete-season').forEach(btn=>{btn.addEventListener('click',()=>{if(!confirm(`Delete "${btn.dataset.label}"?`))return;const c=loadCustomSeasons();delete c[btn.dataset.season];saveCustomSeasons(c);const ov=getFixturesOverrides();delete ov[btn.dataset.season];saveFixturesOverrides(ov);if(getActiveSeason()===btn.dataset.season)setActiveSeason('25-26');renderSeasonManager();renderPlayerView();});});
        let pending=[];const fl=document.getElementById('new-fixtures-list');
        function rp(){if(!pending.length){fl.innerHTML='<p style="color:var(--text-muted);font-size:0.85rem;">None yet.</p>';return;}fl.innerHTML=pending.map((f,i)=>`<div class="pending-fixture"><span>${formatDate(f.date)}</span><strong>${f.opponent}</strong><span class="venue-badge ${f.venue.toLowerCase()}">${f.venue}</span><button class="btn-remove-fx" data-idx="${i}">✕</button></div>`).join('');fl.querySelectorAll('.btn-remove-fx').forEach(b=>{b.addEventListener('click',()=>{pending.splice(parseInt(b.dataset.idx),1);rp();});});}rp();
        document.getElementById('fx-add-btn').addEventListener('click',()=>{const d=document.getElementById('fx-date').value,o=document.getElementById('fx-opponent').value.trim(),v=document.getElementById('fx-venue').value,msg=document.getElementById('new-season-msg');if(!d){showMsg(msg,'Date.',true);return;}if(!o){showMsg(msg,'Opponent.',true);return;}pending.push({id:genId(),date:d,opponent:o,venue:v,supper:'',drivers:'',bar:'',result:''});pending.sort((a,b)=>a.date.localeCompare(b.date));rp();document.getElementById('fx-date').value='';document.getElementById('fx-opponent').value='';});
        document.getElementById('create-season-btn').addEventListener('click',()=>{const id=document.getElementById('new-season-name').value.trim(),label=document.getElementById('new-season-label').value.trim(),msg=document.getElementById('new-season-msg');if(!id){showMsg(msg,'ID.',true);return;}if(!label){showMsg(msg,'Label.',true);return;}if(!pending.length){showMsg(msg,'Fixtures.',true);return;}if(getAllSeasons()[id]){showMsg(msg,'Exists.',true);return;}const c=loadCustomSeasons();c[id]={label,fixtures:pending,stats:[]};saveCustomSeasons(c);setActiveSeason(id);DB.set('availability',{});showMsg(msg,'✓ Created!',false);setTimeout(()=>{renderSeasonManager();renderPlayerView();},800);});
        // Export
        document.getElementById('export-btn').addEventListener('click',()=>{const data={};DB._docs.forEach(k=>{const v=DB.get(k);if(v)data[k]=v;});const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='boldron-backup-'+new Date().toISOString().split('T')[0]+'.json';a.click();URL.revokeObjectURL(url);showMsg(document.getElementById('backup-msg'),'✓ Downloaded!',false);});
        // Import
        document.getElementById('import-btn').addEventListener('click',()=>{document.getElementById('import-file').click();});
        document.getElementById('import-file').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const data=JSON.parse(ev.target.result);if(!confirm('Overwrite ALL data?'))return;Object.keys(data).forEach(k=>{DB.set(k,data[k]);});populatePlayerSelect();renderPlayerView();showMsg(document.getElementById('backup-msg'),'✓ Imported!',false);renderSeasonManager();}catch(err){alert('Invalid file.');}};reader.readAsText(file);});
    }

    // ===== SEED TEST 26-27 =====
    (function(){const c=loadCustomSeasons();if(!c['26-27']){c['26-27']={label:'2026/27',fixtures:[
        {id:"fx100",date:"2026-09-07",opponent:"Blue Bell",venue:"Home",supper:"",drivers:"",bar:"",result:""},{id:"fx101",date:"2026-09-14",opponent:"Blue Bell",venue:"Away",supper:"",drivers:"",bar:"",result:""},{id:"fx102",date:"2026-09-21",opponent:"Red Lion B",venue:"Away",supper:"",drivers:"",bar:"",result:""},{id:"fx103",date:"2026-09-28",opponent:"Red Lion B",venue:"Home",supper:"",drivers:"",bar:"",result:""},{id:"fx104",date:"2026-10-05",opponent:"Black Lions",venue:"Home",supper:"",drivers:"",bar:"",result:""},{id:"fx105",date:"2026-10-12",opponent:"Black Lions",venue:"Away",supper:"",drivers:"",bar:"",result:""},{id:"fx106",date:"2026-10-19",opponent:"Bowes Club A",venue:"Away",supper:"",drivers:"",bar:"",result:""},{id:"fx107",date:"2026-10-26",opponent:"Bowes Club A",venue:"Home",supper:"",drivers:"",bar:"",result:""},{id:"fx108",date:"2026-11-02",opponent:"Middleton Club B",venue:"Home",supper:"",drivers:"",bar:"",result:""},{id:"fx109",date:"2026-11-09",opponent:"Middleton Club B",venue:"Away",supper:"",drivers:"",bar:"",result:""},{id:"fx110",date:"2026-11-16",opponent:"Wheatsheaf A",venue:"Away",supper:"",drivers:"",bar:"",result:""},{id:"fx111",date:"2026-11-23",opponent:"Wheatsheaf A",venue:"Home",supper:"",drivers:"",bar:"",result:""},{id:"fx112",date:"2026-12-14",opponent:"Langdon Beck B",venue:"Home",supper:"",drivers:"",bar:"",result:""},{id:"fx113",date:"2027-01-04",opponent:"Langdon Beck B",venue:"Away",supper:"",drivers:"",bar:"",result:""},{id:"fx114",date:"2027-01-11",opponent:"B.C.W.M.C",venue:"Away",supper:"",drivers:"",bar:"",result:""},{id:"fx115",date:"2027-01-18",opponent:"B.C.W.M.C",venue:"Home",supper:"",drivers:"",bar:"",result:""}
    ],stats:[]};saveCustomSeasons(c);}})();

    // ===== INIT =====
    renderPlayerView();
})();
