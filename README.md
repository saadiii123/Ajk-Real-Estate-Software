# AJK Real Estate — Property Management System
> Professional, fully organized PHP + MySQL + Vanilla JS property management for Azad Jammu & Kashmir

---

## 📁 Project Structure

```
ajkrealstate/
├── .env                          ← 🔐 Your private config (DB credentials, etc.)
├── .env.example                  ← Safe template to commit to Git
├── .gitignore                    ← Ignores .env and OS files
├── api.php                       ← Main API router entry point
├── index.html                    ← Frontend SPA
│
├── assets/
│   ├── css/
│   │   ├── base.css              ← CSS variables, resets, utilities
│   │   ├── layout.css            ← Topbar, hero, stats, containers
│   │   ├── components.css        ← Cards, forms, badges, buttons
│   │   └── pages.css             ← Page-specific: charts, calc, appts, leads, compare
│   └── js/
│       ├── app.js                ← Global state, config, utility functions
│       ├── auth.js               ← Login / logout
│       ├── navigation.js         ← Page router (showPage)
│       ├── register.js           ← Property registration form
│       ├── listings.js           ← Load, render, edit, delete, compare, export
│       ├── charts.js             ← Dashboard charts (Chart.js)
│       ├── features.js           ← Search, buyer match, appointments, leads, calculator
│       └── print.js              ← Receipt & property card print windows
│
├── backend/
│   ├── config/
│   │   └── database.php          ← Reads .env → DB connection
│   ├── helpers/
│   │   └── functions.php         ← sendJSON, buildPropertyBindData, helpers
│   └── routes/
│       ├── properties.php        ← CRUD for properties
│       ├── appointments.php      ← CRUD for appointments
│       └── stats.php             ← Dashboard stats + leads CRUD
│
└── database/
    └── database.sql              ← Full schema: properties, appointments, leads
```

---

## 🚀 Setup Guide (XAMPP — Windows/Mac/Linux)

### Step 1 — Place Files
```
C:\xampp\htdocs\ajkrealstate\
```
Copy the entire project folder here.

### Step 2 — Configure `.env`
Open `.env` and set your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ajkrealstate
DB_USER=root
DB_PASS=           # Leave empty for default XAMPP
```

### Step 3 — Create the Database
1. Open **http://localhost/phpmyadmin**
2. Click the **SQL** tab
3. Paste the contents of `database/database.sql`
4. Click **Go**

### Step 4 — Start XAMPP
- Start **Apache** + **MySQL** in XAMPP Control Panel

### Step 5 — Open the App
```
http://localhost/ajkrealstate/index.html
```
**Login:** `admin` / `ajk2025`  
*(Change in `.env` → `ADMIN_USER` / `ADMIN_PASS`, and update `assets/js/auth.js`)*

---

## ✨ Features

| Feature | Description |
|---|---|
| **Register Property** | Full form: purpose, type, owner (agent/owner/vendor), images, status |
| **Listings** | Filter by status/purpose/type, sort by price/date/views, quick status change |
| **Search** | Full-text search with price range, city, type, owner type filters |
| **Buyer Match** | Score-based property matching against buyer requirements |
| **Appointments** | Schedule & manage property visits, edit/update status |
| **Leads** | Buyer enquiry CRM with Kanban pipeline (New→Called→Visited→Closed) |
| **Calculator** | Installment plan: monthly/quarterly/annual, interest breakdown |
| **Compare** | Side-by-side comparison of any 2 properties (highlights differences) |
| **Dashboard** | Charts for type, purpose, city, status + portfolio value + recent listings |
| **Print Receipt** | Professional A4 receipt for any property |
| **Print Card** | Compact property card for in-person sharing |
| **WhatsApp** | Direct WA link to owner from any property card |
| **Featured** | Star/unstar properties as featured |
| **CSV Export** | Export full listings to Excel-compatible CSV |
| **View Counter** | Auto-increments every time a property is opened |

---

## 🔌 API Endpoints

| Method | URL | Description |
|---|---|---|
| `GET` | `/api.php` | List all properties (supports filters: `search`, `type`, `city`, `purpose`, `status`, `min_price`, `max_price`) |
| `GET` | `/api.php/{id}` | Get single property + increment view counter |
| `POST` | `/api.php` | Register new property |
| `PUT` | `/api.php/{id}` | Update property |
| `PATCH` | `/api.php/{id}/status` | Quick status update |
| `PATCH` | `/api.php/{id}/featured` | Toggle featured flag |
| `DELETE` | `/api.php/{id}` | Delete property |
| `GET` | `/api.php?action=stats` | Dashboard statistics |
| `GET` | `/api.php/appointments` | List appointments |
| `POST` | `/api.php/appointments` | Create appointment |
| `PUT` | `/api.php/appointments/{id}` | Update appointment |
| `DELETE` | `/api.php/appointments/{id}` | Delete appointment |
| `GET` | `/api.php/leads` | List leads |
| `POST` | `/api.php/leads` | Create lead |
| `PUT` | `/api.php/leads/{id}` | Update lead status/notes |
| `DELETE` | `/api.php/leads/{id}` | Delete lead |

---

## 🔐 Changing Password

**Quick way** — edit `assets/js/auth.js`:
```js
const VALID_USER = 'admin';
const VALID_PASS = 'your_new_password';
```

**Production way** — replace with a PHP session-based login system.

---

## 🛠 Troubleshooting

| Problem | Solution |
|---|---|
| Registration doesn't save | Check XAMPP MySQL is running. Open browser DevTools → Network → click Save → check the API response |
| "DB connection failed" | Verify `.env` values match your MySQL setup |
| Blank page | Check browser console for JS errors. Ensure all files are in `htdocs/ajkrealstate/` |
| Search not working | Run `database.sql` again — the FULLTEXT index may be missing |

---

*AJK Real Estate Management System — Azad Jammu & Kashmir, Pakistan*
