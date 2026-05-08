// ============================================================
// AJK Real Estate — Search, Buyer Match, Appointments, Calculator, Leads
// assets/js/features.js
// ============================================================

// ── Search ────────────────────────────────────────────────────
async function runSearch() {
  const params = new URLSearchParams();
  const q = document.getElementById('search-input').value;
  ['search','type','purpose','city','owner_type','status','min_price','max_price'].forEach(k => {
    const id  = { search:'search-input', type:'f-type-filter', purpose:'f-purpose-filter',
                  city:'f-city-filter', owner_type:'f-ownertype-filter', status:'f-status-filter',
                  min_price:'f-minprice', max_price:'f-maxprice-custom' }[k];
    const val = document.getElementById(id)?.value;
    if (val) params.append(k, val);
  });
  const el = document.getElementById('search-results');
  el.innerHTML = '<div style="padding:1rem;color:var(--text3)"><span class="spinner"></span> Searching...</div>';
  try {
    const res     = await fetch(`${API_BASE}?${params}`);
    if (!res.ok)  throw new Error(`HTTP ${res.status}`);
    const results = await res.json();
    if (!results.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">🔍</div>No properties found.</div>'; return; }
    el.innerHTML = `<div class="section-sep">${results.length} result${results.length!==1?'s':''} found</div>`
                 + results.map(p=>propCard(p,false)).join('');
  } catch(err) { el.innerHTML=`<div class="empty-state">Error: ${err.message}</div>`; }
}

// ── Buyer Match ───────────────────────────────────────────────
async function findMatches() {
  const purpose = document.getElementById('b-purpose').value;
  const type    = document.getElementById('b-type').value;
  const city    = document.getElementById('b-city').value;
  const budget  = Number(document.getElementById('b-budget').value)||Infinity;
  const beds    = Number(document.getElementById('b-beds').value)||0;
  const name    = document.getElementById('b-name').value.trim()||'Buyer';
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json();
    const scored = all.map(p => {
      let s=0;
      if(!purpose||p.purpose===purpose) s+=30;
      if(!type   ||p.type===type)       s+=25;
      if(!city   ||p.city===city)       s+=20;
      if(p.price<=budget)               s+=15;
      if(!beds   ||Number(p.beds)>=beds)s+=10;
      return {p,s};
    }).filter(x=>x.s>=30).sort((a,b)=>b.s-a.s);
    const el = document.getElementById('match-results');
    if (!scored.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">🎯</div>No matching properties.</div>'; return; }
    el.innerHTML = `<div class="section-sep">${scored.length} match${scored.length>1?'es':''} for ${escapeHtml(name)}</div>`
      + scored.map(({p,s})=>`
        <div class="match-card">
          <div class="match-header">
            <div><h3 style="font-size:14px;font-weight:500;color:var(--text)">${escapeHtml(p.title)}</h3>
            <div style="display:flex;gap:5px;margin-top:4px">${typeBadge(p.type)}${purposeBadge(p.purpose)}</div></div>
            <span class="match-score">${s}% Match</span>
          </div>
          <div class="match-details">
            <span>📍 ${escapeHtml(p.city)}</span><span>💰 ${fmtPrice(p.price)}</span>
            <span>📐 ${p.size||'N/A'}</span><span>🛏 ${p.beds||'N/A'} Beds</span>
            <span>👤 ${escapeHtml(p.owner_name||'—')}</span><span>📞 ${escapeHtml(p.owner_phone||'—')}</span>
          </div>
        </div>`).join('');
  } catch(err) { document.getElementById('match-results').innerHTML=`<div class="empty-state">Error: ${err.message}</div>`; }
}

// ── Appointments ──────────────────────────────────────────────
async function loadAppointments() {
  try {
    const res  = await fetch(`${API_BASE}/appointments`);
    if (!res.ok) return;
    State.appointments = await res.json();
    renderAppointments();
  } catch(e) {}
}

function toggleApptForm() {
  const w = document.getElementById('appt-form-wrap');
  w.style.display = w.style.display==='none' ? 'block' : 'none';
}

async function saveAppointment() {
  const name = document.getElementById('ap-name').value.trim();
  const date = document.getElementById('ap-date').value;
  if (!name||!date) { alert('Visitor name and date are required.'); return; }
  const appt = {
    visitor_name: name,
    phone:        document.getElementById('ap-phone').value,
    property_ref: document.getElementById('ap-prop').value,
    appt_date:    date,
    appt_time:    document.getElementById('ap-time').value,
    status:       document.getElementById('ap-status').value,
    notes:        document.getElementById('ap-notes').value,
  };
  const isEdit = State.editApptId;
  const url    = isEdit ? `${API_BASE}/appointments/${isEdit}` : `${API_BASE}/appointments`;
  const method = isEdit ? 'PUT' : 'POST';
  try {
    const res = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(appt)});
    if (!res.ok) throw new Error((await res.json()).error||'Failed');
    ['ap-name','ap-phone','ap-prop','ap-date','ap-notes'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('appt-form-wrap').style.display='none';
    State.editApptId = null;
    document.getElementById('appt-save-btn').textContent = 'Save Appointment';
    loadAppointments();
  } catch(err) { alert('Save failed: '+err.message); }
}

function editAppointment(id) {
  const a = State.appointments.find(x=>x.id==id);
  if (!a) return;
  State.editApptId = id;
  document.getElementById('ap-name').value  = a.visitor_name||'';
  document.getElementById('ap-phone').value = a.phone||'';
  document.getElementById('ap-prop').value  = a.property_ref||'';
  document.getElementById('ap-date').value  = a.appt_date||'';
  document.getElementById('ap-time').value  = a.appt_time||'';
  document.getElementById('ap-status').value= a.status||'Pending';
  document.getElementById('ap-notes').value = a.notes||'';
  document.getElementById('appt-save-btn').textContent = 'Update Appointment';
  document.getElementById('appt-form-wrap').style.display='block';
  window.scrollTo({top:0,behavior:'smooth'});
}

async function deleteAppointment(id) {
  if (!confirm('Delete this appointment?')) return;
  try {
    await fetch(`${API_BASE}/appointments/${id}`,{method:'DELETE'});
    loadAppointments();
  } catch(e) { State.appointments=State.appointments.filter(a=>a.id!=id); renderAppointments(); }
}

function renderAppointments() {
  const el = document.getElementById('appointments-list');
  const today = new Date().toISOString().slice(0,10);
  if (!State.appointments.length) {
    el.innerHTML='<div class="empty-state"><div class="empty-icon">📅</div>No appointments yet.</div>'; return;
  }
  el.innerHTML = State.appointments.map(a => {
    const d = new Date(a.appt_date);
    const isPast = a.appt_date < today;
    const statusC = a.status==='Confirmed'?'appt-confirmed':a.status==='Done'?'appt-done':a.status==='Cancelled'?'appt-cancelled':'appt-pending';
    return `
      <div class="appt-card${isPast&&a.status==='Pending'?' appt-overdue':''}">
        <div class="appt-time">
          <div class="day">${d.getDate()}</div>
          <div class="month">${d.toLocaleString('en',{month:'short'})}</div>
        </div>
        <div class="appt-info" style="flex:1">
          <h4>${escapeHtml(a.visitor_name||'—')} ${a.phone?'· '+a.phone:''}</h4>
          <p>${a.property_ref?'🏠 '+escapeHtml(a.property_ref)+' · ':''} ⏰ ${a.appt_time||'TBD'}</p>
          ${a.notes?`<p style="margin-top:3px;opacity:0.7">${escapeHtml(a.notes)}</p>`:''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
          <span class="appt-status ${statusC}">${a.status}</span>
          <div style="display:flex;gap:4px">
            <button class="mini-btn green" onclick="editAppointment(${a.id})">✏</button>
            <button class="mini-btn btn-danger" onclick="deleteAppointment(${a.id})">🗑</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── Leads (Buyer Enquiries) ───────────────────────────────────
async function loadLeads() {
  try {
    const res  = await fetch(`${API_BASE}/leads`);
    if (!res.ok) return;
    State.leads = Array.isArray(await res.json()) ? await fetch(`${API_BASE}/leads`).then(r=>r.json()) : [];
    renderLeads();
  } catch(e) {}
}

function toggleLeadForm() {
  const w = document.getElementById('lead-form-wrap');
  w.style.display = w.style.display==='none' ? 'block' : 'none';
}

async function saveLead() {
  const name  = document.getElementById('ld-name').value.trim();
  const phone = document.getElementById('ld-phone').value.trim();
  if (!name||!phone) { alert('Name and phone are required.'); return; }
  const lead = {
    name, phone,
    email:   document.getElementById('ld-email').value,
    city:    document.getElementById('ld-city').value,
    type:    document.getElementById('ld-type').value,
    purpose: document.getElementById('ld-purpose').value,
    budget:  document.getElementById('ld-budget').value || null,
    message: document.getElementById('ld-message').value,
    status:  document.getElementById('ld-status').value,
  };
  try {
    const res = await fetch(`${API_BASE}/leads`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lead)});
    if (!res.ok) throw new Error((await res.json()).error||'Failed');
    ['ld-name','ld-phone','ld-email','ld-budget','ld-message'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('lead-form-wrap').style.display='none';
    loadLeads();
  } catch(err) { alert('Save failed: '+err.message); }
}

async function updateLeadStatus(id, status) {
  try {
    await fetch(`${API_BASE}/leads/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
    loadLeads();
  } catch(err) { alert('Update failed: '+err.message); }
}

async function deleteLead(id) {
  if (!confirm('Delete this lead?')) return;
  try {
    await fetch(`${API_BASE}/leads/${id}`,{method:'DELETE'});
    loadLeads();
  } catch(e) { State.leads=State.leads.filter(l=>l.id!=id); renderLeads(); }
}

function renderLeads() {
  const el = document.getElementById('leads-list');
  if (!el) return;
  const filterStatus = document.getElementById('ld-status-filter')?.value||'';
  let list = [...State.leads];
  if (filterStatus) list = list.filter(l=>l.status===filterStatus);

  const pipeCounts = {};
  State.leads.forEach(l => { pipeCounts[l.status]=(pipeCounts[l.status]||0)+1; });

  document.getElementById('leads-pipeline').innerHTML = ['New','Called','Visited','Closed','Lost'].map(s=>`
    <div class="pipe-col">
      <div class="pipe-head">${s} <span class="pipe-count">${pipeCounts[s]||0}</span></div>
      ${State.leads.filter(l=>l.status===s).map(l=>`
        <div class="pipe-card" onclick="quickLeadActions(${l.id})">
          <div style="font-weight:500;font-size:13px">${escapeHtml(l.name)}</div>
          <div style="font-size:11px;color:var(--text3)">${l.phone}</div>
          ${l.city?`<div style="font-size:11px;color:var(--text3)">📍 ${escapeHtml(l.city)}</div>`:''}
          ${l.budget?`<div style="font-size:11px;color:var(--gold)">${fmtPrice(l.budget)} budget</div>`:''}
        </div>`).join('')}
    </div>`).join('');

  document.getElementById('leads-count').textContent = list.length + ' lead' + (list.length!==1?'s':'');
  if (!list.length) { el.innerHTML='<div class="empty-state"><div class="empty-icon">👤</div>No leads yet. Add buyer enquiries here.</div>'; return; }
  el.innerHTML = list.map(l => {
    const statusC = {New:'lead-new',Called:'lead-called',Visited:'lead-visited',Closed:'lead-closed',Lost:'lead-lost'}[l.status]||'lead-new';
    return `
      <div class="lead-card">
        <div class="lead-body">
          <h4>${escapeHtml(l.name)}</h4>
          <div class="lead-meta">
            <span>📞 ${escapeHtml(l.phone)}</span>
            ${l.email?`<span>✉ ${escapeHtml(l.email)}</span>`:''}
            ${l.city?`<span>📍 ${escapeHtml(l.city)}</span>`:''}
            ${l.budget?`<span>💰 Budget: ${fmtPrice(l.budget)}</span>`:''}
            ${l.purpose?`<span>🎯 ${l.purpose==='sale'?'Buying':'Renting'}</span>`:''}
            ${l.type?`<span>🏠 ${escapeHtml(l.type)}</span>`:''}
          </div>
          ${l.message?`<div style="font-size:12px;color:var(--text3);margin-top:4px">"${escapeHtml(l.message)}"</div>`:''}
        </div>
        <div class="lead-right">
          <span class="lead-status ${statusC}">${l.status}</span>
          <select class="filter-select" style="font-size:11px;padding:4px 7px;width:auto;margin-top:6px"
            onchange="updateLeadStatus(${l.id},this.value)">
            ${['New','Called','Visited','Closed','Lost'].map(s=>`<option ${s===l.status?'selected':''}>${s}</option>`).join('')}
          </select>
          <div style="display:flex;gap:4px;margin-top:6px">
            ${(l.phone||'').replace(/[^0-9]/g,'')?`<button class="mini-btn wa" onclick="window.open('https://wa.me/${l.phone.replace(/[^0-9]/g,'')}','_blank')">💬</button>`:''}
            <button class="mini-btn btn-danger" onclick="deleteLead(${l.id})">🗑</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── Calculator ────────────────────────────────────────────────
function calcInstallment() {
  const price=Number(document.getElementById('calc-price').value)||0;
  const down =Number(document.getElementById('calc-down').value)||0;
  const years=Number(document.getElementById('calc-years').value)||5;
  const rate =Number(document.getElementById('calc-rate').value)||12;
  const freq =Number(document.getElementById('calc-freq').value)||12;
  const freqLabels={12:'Monthly',4:'Quarterly',2:'Bi-Annually',1:'Annually'};
  if (!price) { document.getElementById('calc-output').style.display='none'; document.getElementById('calc-placeholder').style.display='block'; return; }
  document.getElementById('calc-output').style.display='block';
  document.getElementById('calc-placeholder').style.display='none';
  const loan=price-down, r=(rate/100)/freq, n=years*freq;
  const inst=r===0?loan/n:loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  const total=inst*n+down, interest=total-price;
  document.getElementById('co-price').textContent    = fmtPrice(price);
  document.getElementById('co-down').textContent     = fmtPrice(down);
  document.getElementById('co-loan').textContent     = fmtPrice(loan);
  document.getElementById('co-interest').textContent = fmtPrice(Math.round(interest));
  document.getElementById('co-total').textContent    = fmtPrice(Math.round(total));
  document.getElementById('co-installment').textContent = fmtPrice(Math.round(inst));
  document.getElementById('co-freq-label').textContent  = freqLabels[freq];
  document.getElementById('co-count').textContent       = n + ' installments';
}
