// ============================================================
// AJK Real Estate — Authentication & Theme Switcher
// assets/js/auth.js
// ============================================================

function doLogin() {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  const VALID_USER = 'admin';
  const VALID_PASS = 'ajk2025';
  if (username === VALID_USER && password === VALID_PASS) {
    document.getElementById('login-overlay').style.display = 'none';
    loadProperties();
    loadAppointments();
    loadLeads();
  } else {
    const errEl = document.getElementById('login-error');
    errEl.style.display = 'block';
    setTimeout(() => (errEl.style.display = 'none'), 3000);
  }
}

function doLogout() {
  if (confirm('Sign out of AJK Real Estate?')) location.reload();
}

// ══════════════════════════════════════════════════════════════
// THEME SWITCHER
// ══════════════════════════════════════════════════════════════

const THEMES = {
  dark:   { icon: '🌙', label: 'Dark Mode'   },
  normal: { icon: '🌿', label: 'Normal Mode' },
  light:  { icon: '☀️', label: 'Light Mode'  },
};

function setTheme(theme) {
  // Apply CSS attribute
  document.documentElement.removeAttribute('data-theme');
  if (theme !== 'dark') document.documentElement.setAttribute('data-theme', theme);

  // Update trigger button text
  const t = THEMES[theme];
  const iconEl  = document.getElementById('theme-trigger-icon');
  const labelEl = document.getElementById('theme-trigger-label');
  if (iconEl)  iconEl.textContent  = t.icon;
  if (labelEl) labelEl.textContent = t.label;

  // Update option selected states
  document.querySelectorAll('.theme-option').forEach(btn => {
    const active = btn.dataset.mode === theme;
    btn.classList.toggle('selected', active);
  });

  // Close the panel
  const sw = document.getElementById('theme-switcher');
  if (sw) sw.classList.remove('open');

  // Persist
  localStorage.setItem('ajk_theme', theme);
}

function toggleThemePanel() {
  const sw = document.getElementById('theme-switcher');
  if (sw) sw.classList.toggle('open');
}

// Close panel when clicking outside
document.addEventListener('click', function(e) {
  const sw = document.getElementById('theme-switcher');
  if (sw && sw.classList.contains('open') && !sw.contains(e.target)) {
    sw.classList.remove('open');
  }
});

// Restore theme on load (no flash)
(function restoreTheme() {
  const saved = localStorage.getItem('ajk_theme') || 'dark';
  setTheme(saved);
})();

// ══════════════════════════════════════════════════════════════
// STAT CARD NAVIGATION
// Navigate to Listings and pre-filter by purpose
// ══════════════════════════════════════════════════════════════
function statFilter(purpose) {
  showPage('listings');
  // Set the purpose filter dropdown and re-render
  const el = document.getElementById('lst-purpose-filter');
  if (el) { el.value = purpose; renderListings(); }
}
