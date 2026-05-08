// ============================================================
// AJK Real Estate — Print: Receipt & Property Card
// assets/js/print.js
// ============================================================

function viewReceipt(id) {
  const p = State.properties.find(x=>x.id==id); if (!p) return;
  const w = window.open('','_blank','width=560,height=720');
  w.document.write(`<!DOCTYPE html><html><head><title>Receipt — AJK Real Estate</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Outfit',sans-serif;background:#f8f5f0;color:#1a1a1a}
  .receipt{max-width:500px;margin:0 auto;background:#fff;min-height:100vh}
  .header{background:linear-gradient(135deg,#0D4A35,#16694E);padding:30px 32px;color:#fff}
  .logo-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
  .logo-box{width:44px;height:44px;background:rgba(201,168,76,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px}
  .brand-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#F0D98A}
  .brand-sub{font-size:11px;color:rgba(255,255,255,0.6);margin-top:1px}
  .receipt-title{font-size:13px;color:rgba(255,255,255,0.7);margin-bottom:4px;letter-spacing:0.5px;text-transform:uppercase}
  .receipt-id{font-family:'Cormorant Garamond',serif;font-size:28px;color:#F0D98A;font-weight:600}
  .body{padding:28px 32px}
  .price-hero{background:linear-gradient(135deg,#0D4A35,#16694E);border-radius:12px;padding:18px 22px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center}
  .price-hero .label{font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.5px}
  .price-hero .val{font-family:'Cormorant Garamond',serif;font-size:26px;color:#F0D98A;font-weight:600}
  .section{margin-bottom:20px}
  .section-title{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#16694E;margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid #E8F4EF}
  table{width:100%;border-collapse:collapse}td{padding:7px 0;border-bottom:1px solid #f0ede6;font-size:13px;vertical-align:top}
  td:first-child{color:#666;width:42%;font-size:12px}td:last-child{color:#1a1a1a;font-weight:500;text-align:right}
  .status-chip{display:inline-block;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:600;background:#E8F4EF;color:#0D4A35}
  .footer{background:#f8f5f0;padding:20px 32px;text-align:center;border-top:1px solid #e8e4dc;font-size:11.5px;color:#888}
  .print-btn{background:linear-gradient(135deg,#0D4A35,#16694E);color:#F0D98A;border:none;padding:10px 28px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;margin-top:18px}
  @media print{.print-btn{display:none}}</style></head>
  <body><div class="receipt">
    <div class="header">
      <div class="logo-row"><div class="logo-box">🏠</div><div><div class="brand-name">AJK Real Estate</div><div class="brand-sub">Azad Jammu &amp; Kashmir</div></div></div>
      <div class="receipt-title">Property Registration Receipt</div>
      <div class="receipt-id">Ref # ${String(p.id).padStart(4,'0')}</div>
    </div>
    <div class="body">
      <div class="price-hero"><div><div class="label">Listed Price</div></div><div class="val">${fmtPrice(p.price)}</div></div>
      <div class="section"><div class="section-title">🏡 Property Details</div>
        <table>
          <tr><td>Title</td><td>${p.title||'—'}</td></tr>
          <tr><td>City / Locality</td><td>${p.city||'—'}${p.locality?', '+p.locality:''}</td></tr>
          <tr><td>Type</td><td>${p.type||'—'}</td></tr>
          <tr><td>Purpose</td><td>For ${p.purpose==='sale'?'Sale':'Rent'}</td></tr>
          <tr><td>Size</td><td>${p.size||'—'}</td></tr>
          <tr><td>Beds / Baths</td><td>${p.beds||'—'} / ${p.baths||'—'}</td></tr>
          <tr><td>Condition</td><td>${p.condition||'—'}</td></tr>
          <tr><td>Status</td><td><span class="status-chip">${p.status||'Available'}</span></td></tr>
        </table>
      </div>
      <div class="section"><div class="section-title">👤 Contact Information</div>
        <table>
          <tr><td>Name</td><td>${p.owner_name||'—'}</td></tr>
          <tr><td>Phone</td><td>${p.owner_phone||'—'}</td></tr>
          <tr><td>Type</td><td>${p.owner_type||'—'}</td></tr>
          ${p.agency_name?`<tr><td>Agency</td><td>${p.agency_name}</td></tr>`:''}
          ${p.company_name?`<tr><td>Company</td><td>${p.company_name}</td></tr>`:''}
          ${p.email?`<tr><td>Email</td><td>${p.email}</td></tr>`:''}
        </table>
      </div>
      <div class="section"><div class="section-title">📋 Registration Info</div>
        <table>
          <tr><td>Registered On</td><td>${p.date_registered?new Date(p.date_registered).toLocaleDateString('en-PK',{year:'numeric',month:'long',day:'numeric'}):'—'}</td></tr>
          <tr><td>Property ID</td><td>#${p.id}</td></tr>
          <tr><td>Views</td><td>${p.views||0}</td></tr>
        </table>
      </div>
      ${p.description?`<div class="section"><div class="section-title">📝 Description</div><p style="font-size:13px;color:#555;line-height:1.7">${p.description}</p></div>`:''}
      <div style="text-align:center"><button class="print-btn" onclick="window.print()">🖨 Print Receipt</button></div>
    </div>
    <div class="footer">Computer-generated receipt — AJK Real Estate Management System<br>Azad Jammu &amp; Kashmir, Pakistan</div>
  </div></body></html>`);
  w.document.close();
}

function printCard(id) {
  const p = State.properties.find(x=>x.id==id); if (!p) return;
  const w = window.open('','_blank','width=480,height=360');
  w.document.write(`<!DOCTYPE html><html><head><title>Property Card</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500&display=swap" rel="stylesheet">
  <style>body{font-family:'Outfit',sans-serif;padding:20px;background:#f8f5f0}
  .card{border:1.5px solid #0D4A35;border-radius:14px;padding:20px;background:#fff;max-width:400px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
  h2{font-family:'Cormorant Garamond',serif;font-size:18px;color:#0D4A35;max-width:260px}
  .price{font-family:'Cormorant Garamond',serif;font-size:22px;color:#0D4A35;font-weight:700}
  .row{font-size:12.5px;color:#555;margin-top:5px}
  .badge{padding:2px 10px;border-radius:99px;font-size:10px;background:#E8F4EF;color:#0D4A35;font-weight:600}
  .footer{margin-top:14px;padding-top:10px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-size:11px;color:#888}
  .btn{background:#0D4A35;color:#F0D98A;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-size:12px;margin-top:14px}
  @media print{.btn{display:none}}</style></head>
  <body><div class="card">
    <div class="header"><h2>${p.title}</h2><span class="badge">For ${p.purpose==='sale'?'Sale':'Rent'}</span></div>
    <div class="price">${fmtPrice(p.price)}</div>
    <div class="row">📍 ${p.city}${p.locality?', '+p.locality:''}</div>
    <div class="row">🏠 ${p.type} · ${p.size||'—'} · ${p.beds||'—'} Beds · ${p.baths||'—'} Baths</div>
    <div class="row">👤 ${p.owner_name||'—'} · 📞 ${p.owner_phone||'—'}</div>
    <div class="footer"><span>AJK Real Estate · ID #${p.id}</span><span>${p.status||'Available'}</span></div>
  </div><button class="btn" onclick="window.print()">🖨 Print Card</button></body></html>`);
  w.document.close();
}
