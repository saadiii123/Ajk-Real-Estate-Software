<?php
// ============================================================
// AJK Real Estate — Stats + Leads Routes
// backend/routes/stats.php
// ============================================================
require_once __DIR__ . '/../helpers/functions.php';

function handleGetStats(mysqli $conn): void {
    $stats  = [];
    $fields = [
        'total'       => 'SELECT COUNT(*) FROM properties',
        'for_sale'    => "SELECT COUNT(*) FROM properties WHERE purpose='sale'",
        'for_rent'    => "SELECT COUNT(*) FROM properties WHERE purpose='rent'",
        'cities'      => 'SELECT COUNT(DISTINCT city) FROM properties',
        'available'   => "SELECT COUNT(*) FROM properties WHERE status='Available'",
        'sold'        => "SELECT COUNT(*) FROM properties WHERE status='Sold'",
        'rented'      => "SELECT COUNT(*) FROM properties WHERE status='Rented'",
        'reserved'    => "SELECT COUNT(*) FROM properties WHERE status='Reserved'",
        'total_views' => 'SELECT COALESCE(SUM(views),0) FROM properties',
    ];
    foreach ($fields as $key => $sql) {
        $stats[$key] = (int)$conn->query($sql)->fetch_row()[0];
    }
    $res = $conn->query("SELECT COALESCE(SUM(price),0) FROM properties WHERE purpose='sale' AND status='Available'");
    $stats['total_value'] = (float)$res->fetch_row()[0];

    // Top cities
    $res = $conn->query("SELECT city, COUNT(*) AS cnt FROM properties GROUP BY city ORDER BY cnt DESC LIMIT 5");
    $stats['top_cities'] = [];
    while ($row = $res->fetch_assoc()) $stats['top_cities'][] = $row;

    // Recent (last 30 days)
    $stats['recent_30d'] = (int)$conn->query("SELECT COUNT(*) FROM properties WHERE date_registered >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetch_row()[0];

    sendJSON($stats);
}

// ── Leads (Buyer Enquiries) ───────────────────────────────────
function handleGetLeads(mysqli $conn): void {
    $result = $conn->query('SELECT * FROM leads ORDER BY created_at DESC');
    $rows   = [];
    while ($row = $result->fetch_assoc()) $rows[] = $row;
    sendJSON($rows);
}

function handleCreateLead(mysqli $conn): void {
    $d = getJSONBody();
    if (empty($d['name']) || empty($d['phone']))
        sendJSON(['error' => 'name and phone are required'], 400);
    $stmt = $conn->prepare("INSERT INTO leads (name,phone,email,city,type,purpose,budget,message,property_id,status)
        VALUES (?,?,?,?,?,?,?,?,?,?)");
    $name     = $d['name'];
    $phone    = $d['phone'];
    $email    = $d['email']    ?? '';
    $city     = $d['city']     ?? '';
    $type     = $d['type']     ?? '';
    $purpose  = $d['purpose']  ?? '';
    $budget   = nullableInt($d['budget'] ?? null);
    $message  = $d['message']  ?? '';
    $prop_id  = nullableInt($d['property_id'] ?? null);
    $status   = $d['status']   ?? 'New';
    $stmt->bind_param('ssssssisss', $name, $phone, $email, $city, $type, $purpose, $budget, $message, $prop_id, $status);
    if ($stmt->execute()) sendJSON(['id' => $stmt->insert_id, 'message' => 'Lead saved']);
    else sendJSON(['error' => $stmt->error], 500);
}

function handleUpdateLead(mysqli $conn, int $id): void {
    $d      = getJSONBody();
    $status = $d['status'] ?? 'New';
    $notes  = $d['notes']  ?? '';
    $stmt   = $conn->prepare('UPDATE leads SET status=?, notes=? WHERE id=?');
    $stmt->bind_param('ssi', $status, $notes, $id);
    if ($stmt->execute()) sendJSON(['message' => 'Lead updated']);
    else sendJSON(['error' => $stmt->error], 500);
}

function handleDeleteLead(mysqli $conn, int $id): void {
    $stmt = $conn->prepare('DELETE FROM leads WHERE id=?');
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) sendJSON(['message' => 'Lead deleted']);
    else sendJSON(['error' => $stmt->error], 500);
}
