// ============================================================
// AJK Real Estate — App Config & Global State
// assets/js/app.js
// ============================================================
'use strict';

const API_BASE = './api.php';

const State = {
  properties:       [],
  appointments:     [],
  leads:            [],
  editModeId:       null,
  editApptId:       null,
  currentPurpose:   'sale',
  currentType:      'Residential',
  currentOwnerType: '',
  currentStatus:    'Available',
  imageUrls:        [],
  compareList:      [],
  charts: { type: null, purpose: null, city: null, status: null },
};

const LOCALITIES = {
  Muzaffarabad:    ['City Centre','Chattar','F-Block','Chehla Bandi','Nela','Hari Chowk','Domail','Chattar Kalas'],
  Rawalakot:       ['New Town','Pahalgam','Khai Gala','Trar','Chatri','Tehsil Road','Sarsawa'],
  Mirpur:          ['Sector F-7','Sector F-10','New Mirpur','Old Mirpur','Dadyal','Chakswari','Mangla'],
  Bagh:            ['Bagh City','Dhirkot','Sudhan Gali','Pir Chinasi','Chamankot'],
  Kotli:           ['Kotli City','Sehnsa','Fatehpur','Charhoi'],
  Bhimber:         ['Bhimber City','Samahni','Dewal'],
  Haveli:          ['Forward Kahuta','Tarar Khal','Sahotra'],
  Sudhnoti:        ['Pallandri','Chikar','Trar Khal'],
  'Neelum Valley': ['Athmuqam','Kel','Sharda','Arang Kel','Taobat'],
  'Hattian Bala':  ['Hattian City','Sarsawa','Sehri'],
  Chakothi:        ['Chakothi Town'],
  Athmuqam:        ['Athmuqam Town','Kel Road'],
  Pallandri:       ['Pallandri City','Chikar'],
  Hajira:          ['Hajira Town'],
  Barnala:         ['Barnala Town'],
};

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, m =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])
  );
}
function fmtPrice(n) {
  n = Number(n);
  if (isNaN(n)) return '—';
  if (n >= 10_000_000) return 'PKR ' + (n / 10_000_000).toFixed(2) + ' Cr';
  if (n >= 100_000)    return 'PKR ' + (n / 100_000).toFixed(1) + ' Lac';
  return 'PKR ' + n.toLocaleString('en-PK');
}
function typeBadge(t) {
  const m = { Residential:'res', Commercial:'com', Agricultural:'agr', 'Plot / Land':'plot' };
  return `<span class="badge badge-${m[t]||'res'}">${escapeHtml(t)||'—'}</span>`;
}
function purposeBadge(p) {
  return `<span class="badge badge-${p}">For ${p==='sale'?'Sale':'Rent'}</span>`;
}
function ownerBadge(t) {
  if (!t) return '';
  return `<span class="badge badge-${t}">${t.charAt(0).toUpperCase()+t.slice(1)}</span>`;
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGallery(); });
