<?php
// ============================================================
// AJK Real Estate — Properties Route
// backend/routes/properties.php
// ============================================================

require_once __DIR__ . '/../helpers/functions.php';

// ── GET single or all properties ─────────────────────────────
function handleGetProperties(mysqli $conn, ?int $id): void {
    if ($id) {
        $upd = $conn->prepare('UPDATE properties SET views = views + 1 WHERE id = ?');
        $upd->bind_param('i', $id); $upd->execute();
        $stmt = $conn->prepare('SELECT * FROM properties WHERE id = ?');
        $stmt->bind_param('i', $id); $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        sendJSON($row ?: ['error' => 'Not found'], $row ? 200 : 404);
    }

    $where  = ['1=1']; $params = []; $types = '';
    if (!empty($_GET['search'])) {
        $where[]  = 'MATCH(title, description, owner_name, city, locality) AGAINST(? IN BOOLEAN MODE)';
        $params[] = $_GET['search'] . '*'; $types .= 's';
    }
    foreach (['purpose','type','city','status','owner_type'] as $col) {
        if (!empty($_GET[$col])) { $where[] = "`$col` = ?"; $params[] = $_GET[$col]; $types .= 's'; }
    }
    if (!empty($_GET['min_price'])) { $where[] = 'price >= ?'; $params[] = (int)$_GET['min_price']; $types .= 'i'; }
    if (!empty($_GET['max_price'])) { $where[] = 'price <= ?'; $params[] = (int)$_GET['max_price']; $types .= 'i'; }
    if (!empty($_GET['featured']))  { $where[] = 'featured = 1'; }

    $sql  = 'SELECT * FROM properties WHERE ' . implode(' AND ', $where) . ' ORDER BY featured DESC, date_registered DESC';
    $stmt = $conn->prepare($sql);
    if ($types) $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows   = [];
    while ($row = $result->fetch_assoc()) $rows[] = $row;
    sendJSON($rows);
}

// ── POST — create ─────────────────────────────────────────────
function handleCreateProperty(mysqli $conn): void {
    $data  = getJSONBody();
    $owner = $data['owner'] ?? [];
    if (empty($data['purpose']) || empty($data['type']) || empty($data['title']) || empty($data['city']) || !isset($data['price']))
        sendJSON(['error' => 'Missing required fields: purpose, type, title, city, price'], 400);
    if (empty($owner['name']) || empty($owner['phone']))
        sendJSON(['error' => 'Owner name and phone are required'], 400);

    $f   = buildPropertyBindData($data);
    $sql = "INSERT INTO properties (
        purpose,type,title,city,locality,size,price,beds,baths,`condition`,description,image_url,
        owner_type,owner_name,owner_phone,owner_cnic,owner_fname,owner_wa,owner_dob,owner_addr,
        agency_name,license_no,office_addr,experience_years,email,
        fard_number,ownership_since,mutation_no,
        company_name,ntn,secp_no,years_in_business,website,
        notes,status,images
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) sendJSON(['error' => 'Prepare failed: ' . $conn->error], 500);

    // 36 params: s s s s s s i s s s s s | s s s s s s s s | s s s i s | s s s | s s s i s | s s s
    $stmt->bind_param('ssssssissssssssssssssssisssssssissss',
        $f['purpose'],$f['type'],$f['title'],$f['city'],$f['locality'],$f['size'],
        $f['price'],$f['beds'],$f['baths'],$f['condition'],$f['description'],$f['image_url'],
        $f['owner_type'],$f['owner_name'],$f['owner_phone'],$f['owner_cnic'],
        $f['owner_fname'],$f['owner_wa'],$f['owner_dob'],$f['owner_addr'],
        $f['agency_name'],$f['license_no'],$f['office_addr'],$f['experience_years'],$f['email'],
        $f['fard_number'],$f['ownership_since'],$f['mutation_no'],
        $f['company_name'],$f['ntn'],$f['secp_no'],$f['years_in_business'],$f['website'],
        $f['notes'],$f['status'],$f['images']
    );
    if ($stmt->execute()) sendJSON(['id' => $stmt->insert_id, 'message' => 'Property registered successfully']);
    else sendJSON(['error' => 'Insert failed: ' . $stmt->error], 500);
}

// ── PUT — full update ─────────────────────────────────────────
function handleUpdateProperty(mysqli $conn, int $id): void {
    $data = getJSONBody();
    $f    = buildPropertyBindData($data);
    $sql  = "UPDATE properties SET
        purpose=?,type=?,title=?,city=?,locality=?,size=?,price=?,beds=?,baths=?,`condition`=?,description=?,image_url=?,
        owner_type=?,owner_name=?,owner_phone=?,owner_cnic=?,owner_fname=?,owner_wa=?,owner_dob=?,owner_addr=?,
        agency_name=?,license_no=?,office_addr=?,experience_years=?,email=?,
        fard_number=?,ownership_since=?,mutation_no=?,
        company_name=?,ntn=?,secp_no=?,years_in_business=?,website=?,
        notes=?,status=?,images=?
        WHERE id=?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) sendJSON(['error' => 'Prepare failed: ' . $conn->error], 500);

    // 36 + 1 id = 37 params
    $stmt->bind_param('ssssssissssssssssssssssisssssssissssi',
        $f['purpose'],$f['type'],$f['title'],$f['city'],$f['locality'],$f['size'],
        $f['price'],$f['beds'],$f['baths'],$f['condition'],$f['description'],$f['image_url'],
        $f['owner_type'],$f['owner_name'],$f['owner_phone'],$f['owner_cnic'],
        $f['owner_fname'],$f['owner_wa'],$f['owner_dob'],$f['owner_addr'],
        $f['agency_name'],$f['license_no'],$f['office_addr'],$f['experience_years'],$f['email'],
        $f['fard_number'],$f['ownership_since'],$f['mutation_no'],
        $f['company_name'],$f['ntn'],$f['secp_no'],$f['years_in_business'],$f['website'],
        $f['notes'],$f['status'],$f['images'],
        $id
    );
    if ($stmt->execute()) sendJSON(['message' => 'Property updated successfully']);
    else sendJSON(['error' => 'Update failed: ' . $stmt->error], 500);
}

// ── PATCH /{id}/status ────────────────────────────────────────
function handlePatchStatus(mysqli $conn, int $id): void {
    $data   = getJSONBody();
    $status = $data['status'] ?? '';
    $valid  = ['Available','Sold','Rented','Reserved'];
    if (!in_array($status, $valid)) sendJSON(['error' => 'Invalid status'], 400);
    $stmt = $conn->prepare('UPDATE properties SET status=? WHERE id=?');
    $stmt->bind_param('si', $status, $id);
    if ($stmt->execute()) sendJSON(['message' => "Status updated to $status"]);
    else sendJSON(['error' => $stmt->error], 500);
}

// ── PATCH /{id}/featured — toggle featured flag ───────────────
function handlePatchFeatured(mysqli $conn, int $id): void {
    $data     = getJSONBody();
    $featured = isset($data['featured']) ? (int)(bool)$data['featured'] : 0;
    $stmt     = $conn->prepare('UPDATE properties SET featured=? WHERE id=?');
    $stmt->bind_param('ii', $featured, $id);
    if ($stmt->execute()) sendJSON(['message' => 'Featured updated']);
    else sendJSON(['error' => $stmt->error], 500);
}

// ── DELETE ────────────────────────────────────────────────────
function handleDeleteProperty(mysqli $conn, int $id): void {
    $stmt = $conn->prepare('DELETE FROM properties WHERE id = ?');
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) sendJSON(['message' => 'Property deleted']);
    else sendJSON(['error' => 'Delete failed: ' . $stmt->error], 500);
}
