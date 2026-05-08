// ============================================================
// AJK Real Estate — Listings, Load, Edit, Delete, Stats, Export
// assets/js/listings.js
// ============================================================

async function loadProperties() {
  try {
    const res  = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    State.properties = Array.isArray(data) ? data : [];
    renderListings(); updateStats();
    if (document.getElementById('page-dashboard').classList.contains('active')) renderCharts();
  } catch(err) {
    document.getElementById('listings-container').innerHTML = `
      <div class="empty-state"><div class="empty-icon">⚠️</div>
      Cannot connect to backend. Make sure XAMPP Apache &amp; MySQL are running
      and files are in <strong>htdocs/ajkrealstate/</strong></div>`;
  }
}

function renderListings() {
  updateStats();
  const el       = document.getElementById('listings-container');
  const statusF  = document.getElementById('lst-status-filter')?.value  || '';
  const purposeF = document.getElementById('lst-purpose-filter')?.value || '';
  const typeF    = document.getElementById('lst-type-filter')?.value    || '';
  const sortF    = document.getElementById('lst-sort')?.value           || 'newest';

  let list = [...State.properties];
  if (statusF)  list = list.filter(p => (p.status||'Available') === statusF);
  if (purposeF) list = list.filter(p => p.purpose === purposeF);
  if (typeF)    list = list.filter(p => p.type === typeF);

  if (sortF === 'newest')   list.sort((a,b) => b.id - a.id);
  if (sortF === 'oldest')   list.sort((a,b) => a.id - b.id);
  if (sortF === 'price_hi') list.sort((a,b) => Number(b.price) - Number(a.price));
  if (sortF === 'price_lo') list.sort((a,b) => Number(a.price) - Number(b.price));
  if (sortF === 'views')    list.sort((a,b) => Number(b.views||0) - Number(a.views||0));

  document.getElementById('listings-count').textContent =
    list.length + ' propert' + (list.length !== 1 ? 'ies' : 'y');

  if (!list.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">🏚</div>No properties found.</div>'; return; }
  el.innerHTML = list.map(p => propCard(p, true)).join('');
}

// ── Property Card ─────────────────────────────────────────────
function propCard(p, withDelete) {
  const status = p.status || 'Available';
  const meta   = [p.city, p.locality, p.size, p.beds?p.beds+' Beds':'', p.condition].filter(Boolean);
  let imgs = [];
  try { imgs = JSON.parse(p.images||'[]'); } catch(e) {}
  if (!imgs.length && p.image_url) imgs = [p.image_url];

  const thumb = imgs.length
    ? `<img src="${imgs[0]}" alt="img" onclick="openGallery('${imgs[0].replace(/'/g,'')}')"
          style="width:100%;height:100%;object-fit:cover;cursor:pointer">
       ${imgs.length>1?`<div class="gallery-count">+${imgs.length-1}</div>`:''}`
    : `<div class="prop-thumb-placeholder">🏠</div>`;

  const statusMap = { Available:'status-available', Sold:'status-sold', Rented:'status-rented', Reserved:'status-reserved' };
  const waNum  = (p.owner_wa||p.owner_phone||'').replace(/[^0-9]/g,'');
  const waMsg  = encodeURIComponent(`Hello, I'm interested in: ${p.title} (${fmtPrice(p.price)}) — AJK Real Estate`);
  const inCmp  = State.compareList.includes(p.id);
  const featStar = p.featured=='1'||p.featured===1 ? '<span title="Featured" style="color:var(--gold);font-size:13px">★</span> ' : '';

  const quickStatus = `
    <select class="filter-select" style="font-size:11px;padding:4px 7px;width:auto"
      onchange="quickStatusChange(${p.id},this.value)">
      ${['Available','Reserved','Sold','Rented'].map(s=>
        `<option ${s===status?'selected':''}>${s}</option>`).join('')}
    </select>`;

  const actions = `
    <div class="prop-actions">
      <button class="mini-btn" onclick="printCard(${p.id})">🖨 Card</button>
      <button class="mini-btn" onclick="viewReceipt(${p.id})">📄 Receipt</button>
      ${waNum?`<button class="mini-btn wa" onclick="window.open('https://wa.me/${waNum}?text=${waMsg}','_blank')">💬 WA</button>`:''}
      <button class="mini-btn ${inCmp?'active-compare':''}" onclick="toggleCompare(${p.id})"
        title="${inCmp?'Remove from compare':'Add to compare'}">⚖ Compare</button>
      <button class="mini-btn" onclick="addLeadFromProp(${p.id})" title="Add buyer lead">👤 Lead</button>
      <button class="mini-btn green" onclick="editProp(${p.id})">✏ Edit</button>
      ${withDelete?`<button class="mini-btn btn-danger" onclick="deleteProp(${p.id})">🗑</button>`:''}
    </div>`;

  return `
    <div class="prop-card" id="prop-${p.id}">
      <div class="prop-card-inner">
        <div class="prop-thumb">${thumb}</div>
        <div class="prop-body">
          <h3>${featStar}${escapeHtml(p.title)}</h3>
          <div class="prop-badges">${typeBadge(p.type)}${purposeBadge(p.purpose)}${ownerBadge(p.owner_type)}
            <span class="status-badge ${statusMap[status]||'status-available'}">${status}</span>
          </div>
          <div class="prop-meta">${meta.map(m=>`<span>${escapeHtml(String(m))}</span>`).join('')}</div>
          <div class="prop-meta" style="margin-top:2px">
            <span>👤 ${escapeHtml(p.owner_name||'—')}</span>
            <span>📞 ${escapeHtml(p.owner_phone||'—')}</span>
            <span>👁 ${p.views||0} views</span>
            <span>📅 ${p.date_registered?new Date(p.date_registered).toLocaleDateString('en-PK'):''}</span>
          </div>
          ${actions}
        </div>
        <div class="prop-right">
          <div class="prop-price">${fmtPrice(p.price)}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:2px">#${p.id}</div>
          <div style="margin-top:8px">${quickStatus}</div>
          <button class="mini-btn" style="margin-top:6px;font-size:10px" onclick="toggleFeatured(${p.id},${p.featured})">
            ${p.featured=='1'||p.featured===1?'★ Unfeature':'☆ Feature'}
          </button>
        </div>
      </div>
    </div>`;
}

// ── Quick status / featured ───────────────────────────────────
async function quickStatusChange(id, status) {
  try {
    const res = await fetch(`${API_BASE}/${id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
    if (!res.ok) throw new Error((await res.json()).error||'Failed');
    const idx = State.properties.findIndex(p=>p.id==id);
    if (idx>-1) State.properties[idx].status = status;
    updateStats();
  } catch(err) { alert('Status update failed: '+err.message); loadProperties(); }
}

async function toggleFeatured(id, current) {
  const featured = (current=='1'||current===1) ? 0 : 1;
  try {
    await fetch(`${API_BASE}/${id}/featured`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({featured})});
    loadProperties();
  } catch(err) { alert('Failed: '+err.message); }
}

// ── Compare ───────────────────────────────────────────────────
function toggleCompare(id) {
  const idx = State.compareList.indexOf(id);
  if (idx > -1) {
    State.compareList.splice(idx, 1);
  } else {
    if (State.compareList.length >= 2) { alert('You can compare up to 2 properties at a time.'); return; }
    State.compareList.push(id);
  }
  const bar = document.getElementById('compare-bar');
  if (State.compareList.length) {
    bar.style.display = 'flex';
    bar.querySelector('#compare-count').textContent = State.compareList.length + ' selected';
  } else {
    bar.style.display = 'none';
  }
  renderListings();
}

function clearCompare() {
  State.compareList = [];
  document.getElementById('compare-bar').style.display = 'none';
  renderListings();
}

function renderCompare() {
  const el = document.getElementById('compare-content');
  if (State.compareList.length < 2) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">⚖</div>Select 2 properties from Listings to compare them here.</div>';
    return;
  }
  const [a, b] = State.compareList.map(id => State.properties.find(p=>p.id==id)).filter(Boolean);
  if (!a || !b) { el.innerHTML='<div class="empty-state">Properties not found.</div>'; return; }
  const row = (label, va, vb) => `
    <tr>
      <td class="cmp-label">${label}</td>
      <td class="${va===vb?'':'cmp-diff'}">${escapeHtml(String(va||'—'))}</td>
      <td class="${va===vb?'':'cmp-diff'}">${escapeHtml(String(vb||'—'))}</td>
    </tr>`;
  el.innerHTML = `
    <div class="cmp-table-wrap">
      <table class="cmp-table">
        <thead><tr><th>Feature</th><th>${escapeHtml(a.title)}</th><th>${escapeHtml(b.title)}</th></tr></thead>
        <tbody>
          ${row('Price', fmtPrice(a.price), fmtPrice(b.price))}
          ${row('City', a.city, b.city)}
          ${row('Locality', a.locality, b.locality)}
          ${row('Type', a.type, b.type)}
          ${row('Purpose', a.purpose==='sale'?'For Sale':'For Rent', b.purpose==='sale'?'For Sale':'For Rent')}
          ${row('Size', a.size, b.size)}
          ${row('Bedrooms', a.beds, b.beds)}
          ${row('Bathrooms', a.baths, b.baths)}
          ${row('Condition', a.condition, b.condition)}
          ${row('Status', a.status, b.status)}
          ${row('Owner', a.owner_name, b.owner_name)}
          ${row('Phone', a.owner_phone, b.owner_phone)}
          ${row('Owner Type', a.owner_type, b.owner_type)}
          ${row('Views', a.views||0, b.views||0)}
          ${row('Registered', a.date_registered?new Date(a.date_registered).toLocaleDateString('en-PK'):'—', b.date_registered?new Date(b.date_registered).toLocaleDateString('en-PK'):'—')}
        </tbody>
      </table>
    </div>`;
}

// ── Delete & Edit ─────────────────────────────────────────────
async function deleteProp(id) {
  if (!confirm('Permanently delete this property?')) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`,{method:'DELETE'});
    if (!res.ok) throw new Error((await res.json()).error);
    loadProperties();
  } catch(err) { alert('Delete failed: '+err.message); }
}

async function editProp(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Property not found');
    const p = await res.json();
    State.editModeId = p.id;
    const set = (id,v) => { const el=document.getElementById(id); if(el) el.value=v||''; };
    set('f-title',p.title); set('f-city',p.city); updateLocalityDropdown();
    set('f-locality',p.locality); set('f-size',p.size); set('f-price',p.price);
    set('f-beds',p.beds); set('f-baths',p.baths); set('f-condition',p.condition);
    set('f-desc',p.description); updatePricePreview();
    selectPurpose(p.purpose||'sale');
    State.currentType = p.type||'Residential';
    document.querySelectorAll('.pill').forEach(b=>b.classList.toggle('sel',b.textContent.trim().includes(p.type)));
    selectStatus(p.status||'Available');
    try { State.imageUrls=JSON.parse(p.images||'[]'); } catch(e){ State.imageUrls=p.image_url?[p.image_url]:[]; }
    set('f-images',JSON.stringify(State.imageUrls));
    renderImagePreviews();
    selectOwnerType(p.owner_type||'owner');
    setTimeout(() => {
      const fill=(id,val)=>{const el=document.getElementById(id);if(el)el.value=val||'';};
      if(p.owner_type==='agent'){fill('a-name',p.owner_name);fill('a-phone',p.owner_phone);fill('a-cnic',p.owner_cnic);fill('a-fname',p.owner_fname);fill('a-wa',p.owner_wa);fill('a-dob',p.owner_dob);fill('a-addr',p.owner_addr);fill('a-agency',p.agency_name);fill('a-lic',p.license_no);fill('a-offaddr',p.office_addr);fill('a-exp',p.experience_years);fill('a-email',p.email);fill('a-notes',p.notes);}
      else if(p.owner_type==='owner'){fill('o-name',p.owner_name);fill('o-phone',p.owner_phone);fill('o-cnic',p.owner_cnic);fill('o-fname',p.owner_fname);fill('o-wa',p.owner_wa);fill('o-dob',p.owner_dob);fill('o-addr',p.owner_addr);fill('o-fard',p.fard_number);fill('o-since',p.ownership_since);fill('o-mut',p.mutation_no);fill('o-notes',p.notes);}
      else{fill('v-name',p.owner_name);fill('v-phone',p.owner_phone);fill('v-cnic',p.owner_cnic);fill('v-wa',p.owner_wa);fill('v-email',p.email);fill('v-company',p.company_name);fill('v-ntn',p.ntn);fill('v-secp',p.secp_no);fill('v-yrs',p.years_in_business);fill('v-web',p.website);fill('v-offaddr',p.office_addr);fill('v-notes',p.notes);}
      document.getElementById('save-btn').innerHTML = '✏ Update Property';
    }, 120);
    showPage('register');
    window.scrollTo({top:0,behavior:'smooth'});
  } catch(err) { alert('Failed to load: '+err.message); }
}

// ── Stats ─────────────────────────────────────────────────────
function updateStats() {
  const props = State.properties;
  document.getElementById('s-total').textContent  = props.length;
  document.getElementById('s-sale').textContent   = props.filter(p=>p.purpose==='sale').length;
  document.getElementById('s-rent').textContent   = props.filter(p=>p.purpose==='rent').length;
  document.getElementById('s-cities').textContent = new Set(props.map(p=>p.city)).size;

  const totalVal = props.filter(p=>p.purpose==='sale'&&p.status==='Available').reduce((a,b)=>a+Number(b.price),0);
  const avail=props.filter(p=>p.status==='Available').length;
  const sold=props.filter(p=>p.status==='Sold').length;
  const rented=props.filter(p=>p.status==='Rented').length;
  const recent30=props.filter(p=>p.date_registered&&(Date.now()-new Date(p.date_registered))<30*86400000).length;

  document.getElementById('dash-stats-row').innerHTML = `
    <div class="stat" onclick="statFilter('');document.getElementById('lst-status-filter').value='Available';renderListings();showPage('listings');" title="View available">
      <div class="stat-icon">✅</div><div class="stat-label">Available</div><div class="stat-val">${avail}</div><div class="stat-sub">Click to view ›</div>
    </div>
    <div class="stat" onclick="statFilter('');document.getElementById('lst-status-filter').value='Sold';renderListings();showPage('listings');" title="View sold">
      <div class="stat-icon">🏷</div><div class="stat-label">Sold</div><div class="stat-val">${sold}</div><div class="stat-sub">Click to view ›</div>
    </div>
    <div class="stat" onclick="statFilter('');document.getElementById('lst-status-filter').value='Rented';renderListings();showPage('listings');" title="View rented">
      <div class="stat-icon">🔑</div><div class="stat-label">Rented</div><div class="stat-val">${rented}</div><div class="stat-sub">Click to view ›</div>
    </div>
    <div class="stat" onclick="showPage('leads')" title="View leads">
      <div class="stat-icon">👤</div><div class="stat-label">Buyer Leads</div><div class="stat-val">${State.leads.length}</div><div class="stat-sub">Click to view ›</div>
    </div>
    <div class="stat" title="Available-for-sale portfolio value">
      <div class="stat-icon">💰</div><div class="stat-label">Portfolio Value</div><div class="stat-val" style="font-size:15px;padding-top:5px">${fmtPrice(totalVal)}</div><div class="stat-sub">${recent30} new this month</div>
    </div>`;

  const recent = [...props].slice(0,5);
  document.getElementById('recent-list').innerHTML = recent.length
    ? recent.map(p=>`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light);font-size:13px">
          <div>
            <div style="font-weight:500;color:var(--text)">${escapeHtml(p.title)}</div>
            <div style="font-size:11px;color:var(--text3)">📍 ${p.city} · ${p.date_registered?new Date(p.date_registered).toLocaleDateString('en-PK'):''}</div>
          </div>
          <div style="text-align:right">
            <div style="color:var(--gold-light);font-family:'Cormorant Garamond',serif">${fmtPrice(p.price)}</div>
            ${typeBadge(p.type)}
          </div>
        </div>`).join('')
    : '<div style="color:var(--text3);font-size:13px;padding:1rem 0">No properties yet.</div>';
}

// ── CSV Export ────────────────────────────────────────────────
function exportCSV() {
  if (!State.properties.length) { alert('No properties to export.'); return; }
  const hdr = ['ID','Title','City','Locality','Type','Purpose','Size','Price','Beds','Baths','Condition','Status','Owner Name','Owner Phone','Owner Type','Agency/Company','Email','Views','Date Registered'];
  const rows = State.properties.map(p => [
    p.id, `"${(p.title||'').replace(/"/g,'""')}"`, p.city, p.locality, p.type, p.purpose,
    p.size, p.price, p.beds, p.baths, p.condition, p.status,
    `"${(p.owner_name||'').replace(/"/g,'""')}"`, p.owner_phone, p.owner_type,
    p.agency_name||p.company_name||'', p.email||'', p.views||0,
    p.date_registered ? new Date(p.date_registered).toLocaleDateString('en-PK') : '',
  ]);
  const csv  = [hdr.join(','), ...rows.map(r=>r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF'+csv,],{type:'text/csv;charset=utf-8;'});
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'AJK_Properties_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
}

// helper: add lead directly from a property card
function addLeadFromProp(propId) {
  const p = State.properties.find(x=>x.id==propId);
  if (!p) return;
  showPage('leads');
  document.getElementById('lead-form-wrap').style.display = 'block';
  setTimeout(() => {
    document.getElementById('ld-prop-ref').value = p.title;
    document.getElementById('ld-purpose').value  = p.purpose;
    document.getElementById('ld-type').value     = p.type;
    document.getElementById('ld-city').value     = p.city;
  }, 80);
}
