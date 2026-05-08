// ============================================================
// AJK Real Estate — Register / Edit Property Form
// assets/js/register.js
// ============================================================

function selectPurpose(p) {
  State.currentPurpose = p;
  document.getElementById('pc-sale').classList.toggle('sel', p === 'sale');
  document.getElementById('pc-rent').classList.toggle('sel', p === 'rent');
}
function toggleType(btn, type) {
  State.currentType = type;
  document.querySelectorAll('.pill').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}
function selectOwnerType(t) {
  State.currentOwnerType = t;
  ['agent','owner','vendor'].forEach(x =>
    document.getElementById('box-' + x).classList.toggle('active', x === t)
  );
  const wrap = document.getElementById('owner-form-wrap');
  if (t === 'agent')      wrap.innerHTML = agentForm();
  else if (t === 'owner') wrap.innerHTML = ownerForm();
  else                    wrap.innerHTML = vendorForm();
}
function selectStatus(s) {
  State.currentStatus = s;
  document.getElementById('f-status').value = s;
  const cls = { Available:'active-avail', Sold:'active-sold', Rented:'active-rented', Reserved:'active-reserved' };
  ['sp-available','sp-reserved','sp-sold','sp-rented'].forEach(id => {
    const el = document.getElementById(id);
    const cap = id.replace('sp-','').charAt(0).toUpperCase() + id.replace('sp-','').slice(1);
    el.className = 'status-pill';
    if (cap === s) el.classList.add(cls[s]);
  });
}
function updateLocalityDropdown() {
  const city = document.getElementById('f-city').value;
  const sel  = document.getElementById('f-locality');
  sel.innerHTML = '<option value="">— Select Locality —</option>';
  (LOCALITIES[city] || []).forEach(l => {
    const o = document.createElement('option'); o.value = o.textContent = l; sel.appendChild(o);
  });
}
function updatePricePreview() {
  const v = Number(document.getElementById('f-price').value);
  document.getElementById('price-preview').textContent = v ? '≈ ' + fmtPrice(v) : '';
}

// ── Owner Form Builders ───────────────────────────────────────
function agentForm() { return `
  <div class="section-sep">Agent Information</div>
  <div class="form-grid">
    <div class="fg"><label>Full Name <span class="req">*</span></label><input id="a-name" placeholder="Agent full name"></div>
    <div class="fg"><label>Phone <span class="req">*</span></label><input id="a-phone" placeholder="0300-0000000"></div>
    <div class="fg"><label>CNIC</label><input id="a-cnic" placeholder="00000-0000000-0"></div>
    <div class="fg"><label>Father's Name</label><input id="a-fname" placeholder="Father's full name"></div>
    <div class="fg"><label>WhatsApp</label><input id="a-wa" placeholder="0300-0000000"></div>
    <div class="fg"><label>Date of Birth</label><input id="a-dob" type="date"></div>
    <div class="fg full"><label>Home Address</label><input id="a-addr" placeholder="Residential address"></div>
    <div class="fg"><label>Agency / Firm Name</label><input id="a-agency" placeholder="Agency name"></div>
    <div class="fg"><label>License Number</label><input id="a-lic" placeholder="License no."></div>
    <div class="fg full"><label>Office Address</label><input id="a-offaddr" placeholder="Office address"></div>
    <div class="fg"><label>Experience (Years)</label><input id="a-exp" type="number" placeholder="e.g. 5"></div>
    <div class="fg"><label>Email</label><input id="a-email" type="email" placeholder="email@example.com"></div>
    <div class="fg full"><label>Notes</label><textarea id="a-notes" placeholder="Additional notes..."></textarea></div>
  </div>`; }

function ownerForm() { return `
  <div class="section-sep">Owner Information</div>
  <div class="form-grid">
    <div class="fg"><label>Full Name <span class="req">*</span></label><input id="o-name" placeholder="Owner full name"></div>
    <div class="fg"><label>Phone <span class="req">*</span></label><input id="o-phone" placeholder="0300-0000000"></div>
    <div class="fg"><label>CNIC</label><input id="o-cnic" placeholder="00000-0000000-0"></div>
    <div class="fg"><label>Father's Name</label><input id="o-fname" placeholder="Father's full name"></div>
    <div class="fg"><label>WhatsApp</label><input id="o-wa" placeholder="0300-0000000"></div>
    <div class="fg"><label>Date of Birth</label><input id="o-dob" type="date"></div>
    <div class="fg full"><label>Home Address</label><input id="o-addr" placeholder="Residential address"></div>
    <div class="fg"><label>Fard Number</label><input id="o-fard" placeholder="Fard / Registry no."></div>
    <div class="fg"><label>Owner Since</label><input id="o-since" placeholder="e.g. 2010"></div>
    <div class="fg"><label>Mutation No.</label><input id="o-mut" placeholder="Intiqal no."></div>
    <div class="fg full"><label>Notes</label><textarea id="o-notes" placeholder="Additional notes..."></textarea></div>
  </div>`; }

function vendorForm() { return `
  <div class="section-sep">Vendor / Builder Information</div>
  <div class="form-grid">
    <div class="fg"><label>Contact Name <span class="req">*</span></label><input id="v-name" placeholder="Contact person name"></div>
    <div class="fg"><label>Phone <span class="req">*</span></label><input id="v-phone" placeholder="0300-0000000"></div>
    <div class="fg"><label>CNIC</label><input id="v-cnic" placeholder="00000-0000000-0"></div>
    <div class="fg"><label>Designation</label><input id="v-desig" placeholder="e.g. Sales Manager"></div>
    <div class="fg"><label>WhatsApp</label><input id="v-wa" placeholder="0300-0000000"></div>
    <div class="fg"><label>Email</label><input id="v-email" type="email" placeholder="email@company.com"></div>
    <div class="fg"><label>Company Name</label><input id="v-company" placeholder="Company / builder name"></div>
    <div class="fg"><label>NTN Number</label><input id="v-ntn" placeholder="NTN no."></div>
    <div class="fg"><label>SECP Number</label><input id="v-secp" placeholder="SECP reg. no."></div>
    <div class="fg"><label>Years in Business</label><input id="v-yrs" type="number" placeholder="e.g. 10"></div>
    <div class="fg"><label>Website</label><input id="v-web" placeholder="https://company.com"></div>
    <div class="fg full"><label>Office Address</label><input id="v-offaddr" placeholder="Office address"></div>
    <div class="fg full"><label>Notes</label><textarea id="v-notes" placeholder="Additional notes..."></textarea></div>
  </div>`; }

function collectOwner() {
  if (!State.currentOwnerType) return {};
  const g = id => document.getElementById(id)?.value || '';
  const d = { ownerType: State.currentOwnerType };
  if (State.currentOwnerType === 'agent') {
    Object.assign(d, { name:g('a-name'),phone:g('a-phone'),cnic:g('a-cnic'),fname:g('a-fname'),wa:g('a-wa'),dob:g('a-dob'),addr:g('a-addr'),agency:g('a-agency'),lic:g('a-lic'),offaddr:g('a-offaddr'),exp:g('a-exp'),email:g('a-email'),notes:g('a-notes') });
  } else if (State.currentOwnerType === 'owner') {
    Object.assign(d, { name:g('o-name'),phone:g('o-phone'),cnic:g('o-cnic'),fname:g('o-fname'),wa:g('o-wa'),dob:g('o-dob'),addr:g('o-addr'),fard:g('o-fard'),since:g('o-since'),mut:g('o-mut'),notes:g('o-notes') });
  } else {
    Object.assign(d, { name:g('v-name'),phone:g('v-phone'),cnic:g('v-cnic'),desig:g('v-desig'),wa:g('v-wa'),email:g('v-email'),company:g('v-company'),ntn:g('v-ntn'),secp:g('v-secp'),yrs:g('v-yrs'),web:g('v-web'),offaddr:g('v-offaddr'),notes:g('v-notes') });
  }
  return d;
}

// ── Images ───────────────────────────────────────────────────
function addImageUrl() {
  const inp = document.getElementById('img-url-input');
  const url = inp.value.trim();
  if (!url) return;
  State.imageUrls.push(url);
  inp.value = '';
  renderImagePreviews();
}
function removeImage(idx) {
  State.imageUrls.splice(idx, 1);
  renderImagePreviews();
}
function renderImagePreviews() {
  document.getElementById('f-images').value = JSON.stringify(State.imageUrls);
  document.getElementById('image-preview-list').innerHTML = State.imageUrls.map((url, i) => `
    <div class="img-thumb-wrap">
      <img class="img-thumb" src="${escapeHtml(url)}"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2272%22 height=%2272%22><rect width=%2272%22 height=%2272%22 fill=%22%231C2320%22/><text x=%2236%22 y=%2244%22 font-size=%2224%22 text-anchor=%22middle%22 fill=%22%237A8C82%22>🖼</text></svg>'"
        onclick="openGallery('${url.replace(/'/g,'')}')">
      <button class="img-remove" onclick="removeImage(${i})">✕</button>
    </div>`).join('');
}
function openGallery(url) {
  document.getElementById('gallery-modal-img').src = url;
  document.getElementById('gallery-modal').classList.add('open');
}
function closeGallery() {
  document.getElementById('gallery-modal').classList.remove('open');
}

// ── Save / Update ─────────────────────────────────────────────
async function registerProperty() {
  if (!State.currentOwnerType) { showAlert('error','❌ Please select owner type in Step 2.'); return; }
  const owner = collectOwner();
  if (!owner.name)  { showAlert('error','❌ Please enter owner/contact full name.'); return; }
  if (!owner.phone) { showAlert('error','❌ Please enter owner/contact phone.'); return; }
  const title = document.getElementById('f-title').value.trim();
  const city  = document.getElementById('f-city').value;
  const price = document.getElementById('f-price').value;
  if (!title)               { showAlert('error','❌ Please enter property title.'); return; }
  if (!city)                { showAlert('error','❌ Please select a city.'); return; }
  if (!price||Number(price)<=0) { showAlert('error','❌ Please enter a valid price.'); return; }

  const payload = {
    purpose:  State.currentPurpose, type: State.currentType, owner, title, city,
    locality: document.getElementById('f-locality').value,
    size:     document.getElementById('f-size').value,
    price:    Number(price),
    beds:     document.getElementById('f-beds').value,
    baths:    document.getElementById('f-baths').value,
    condition:document.getElementById('f-condition').value,
    desc:     document.getElementById('f-desc').value,
    imageUrl: State.imageUrls[0] || '',
    images:   State.imageUrls,
    status:   document.getElementById('f-status').value,
  };

  const btn    = document.getElementById('save-btn');
  const method = State.editModeId ? 'PUT' : 'POST';
  const url    = State.editModeId ? `${API_BASE}/${State.editModeId}` : API_BASE;
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Saving...';

  try {
    const res  = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    showAlert('success', State.editModeId ? '✅ Property updated!' : `✅ Property registered! ID #${data.id}`);
    clearRegForm();
    State.editModeId = null;
    loadProperties();
    setTimeout(() => showPage('listings'), 1200);
  } catch(err) {
    showAlert('error','❌ ' + err.message + ' — Check XAMPP Apache & MySQL are running.');
  } finally {
    btn.disabled = false; btn.innerHTML = '💾 Register Property';
  }
}

function showAlert(type, msg) {
  const bar = document.getElementById(type==='success' ? 'reg-success' : 'reg-error');
  bar.innerHTML = msg; bar.classList.add('show');
  window.scrollTo({ top:0, behavior:'smooth' });
  setTimeout(() => bar.classList.remove('show'), 5000);
}

function clearRegForm() {
  document.querySelectorAll('#page-register input,#page-register select,#page-register textarea')
    .forEach(el => { if (el.type !== 'hidden') el.value = ''; });
  document.getElementById('f-city').selectedIndex = 0;
  document.getElementById('f-locality').innerHTML = '<option value="">— Select Locality —</option>';
  State.imageUrls = [];
  document.getElementById('f-images').value = '[]';
  document.getElementById('image-preview-list').innerHTML = '';
  document.getElementById('price-preview').textContent = '';
  selectStatus('Available');
  State.currentOwnerType = '';
  ['agent','owner','vendor'].forEach(x => document.getElementById('box-'+x).classList.remove('active'));
  document.getElementById('owner-form-wrap').innerHTML = '';
  State.editModeId = null;
  document.getElementById('save-btn').innerHTML = '💾 Register Property';
}
