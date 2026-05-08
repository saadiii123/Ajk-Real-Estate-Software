// ============================================================
// AJK Real Estate — Page Navigation
// assets/js/navigation.js
// ============================================================

const NAV_MAP = {
  dashboard:    0,
  register:     1,
  listings:     2,
  search:       3,
  match:        4,
  appointments: 5,
  leads:        6,
  calculator:   7,
  compare:      8,
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name)?.classList.add('active');
  const idx = NAV_MAP[name];
  if (idx !== undefined) document.querySelectorAll('.nav-btn')[idx]?.classList.add('active');

  if (name === 'dashboard')    renderCharts();
  if (name === 'listings')     renderListings();
  if (name === 'appointments') renderAppointments();
  if (name === 'leads')        renderLeads();
  if (name === 'compare')      renderCompare();
}
