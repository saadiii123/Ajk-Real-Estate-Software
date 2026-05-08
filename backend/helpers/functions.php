<?php
// ============================================================
// AJK Real Estate — Shared Helper Functions
// backend/helpers/functions.php
// ============================================================

/** Send a JSON response and exit. */
function sendJSON(mixed $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

/** Cast to int or return null for empty/missing values. */
function nullableInt(mixed $val): ?int {
    return ($val !== null && $val !== '') ? (int)$val : null;
}

/** Return a valid date string or null for empty/zero dates. */
function nullableDate(mixed $val): ?string {
    return (!empty($val) && $val !== '0000-00-00') ? $val : null;
}

/**
 * Parse route URI to extract optional {id} and {action}.
 * Returns ['id' => int|null, 'action' => string|null]
 */
function parseRoute(string $uri): array {
    $id     = null;
    $action = null;
    if (preg_match('#/api\.php/(\d+)(?:/([a-z]+))?#', $uri, $m)) {
        $id     = (int)$m[1];
        $action = $m[2] ?? null;
    }
    return compact('id', 'action');
}

/**
 * Decode request body as JSON.
 * Sends 400 and exits if invalid or empty.
 */
function getJSONBody(): array {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) sendJSON(['error' => 'Invalid or empty JSON body'], 400);
    return $data;
}

/**
 * Build the 36-field property bind data array from request payload.
 * Centralised here so POST and PUT both use identical logic.
 */
function buildPropertyBindData(array $data): array {
    $owner = $data['owner'] ?? [];
    return [
        'purpose'           => $data['purpose']           ?? '',
        'type'              => $data['type']              ?? '',
        'title'             => $data['title']             ?? '',
        'city'              => $data['city']              ?? '',
        'locality'          => $data['locality']          ?? '',
        'size'              => $data['size']              ?? '',
        'price'             => (int)($data['price']       ?? 0),
        'beds'              => $data['beds']              ?? '',
        'baths'             => $data['baths']             ?? '',
        'condition'         => $data['condition']         ?? '',
        'description'       => $data['desc']              ?? '',
        'image_url'         => $data['imageUrl']          ?? '',
        'owner_type'        => $owner['ownerType']        ?? '',
        'owner_name'        => $owner['name']             ?? '',
        'owner_phone'       => $owner['phone']            ?? '',
        'owner_cnic'        => $owner['cnic']             ?? '',
        'owner_fname'       => $owner['fname']            ?? '',
        'owner_wa'          => $owner['wa']               ?? '',
        'owner_dob'         => nullableDate($owner['dob'] ?? null),
        'owner_addr'        => $owner['addr']             ?? '',
        'agency_name'       => $owner['agency']           ?? '',
        'license_no'        => $owner['lic']              ?? '',
        'office_addr'       => $owner['offaddr']          ?? '',
        'experience_years'  => nullableInt($owner['exp']  ?? null),
        'email'             => $owner['email']            ?? '',
        'fard_number'       => $owner['fard']             ?? '',
        'ownership_since'   => $owner['since']            ?? '',
        'mutation_no'       => $owner['mut']              ?? '',
        'company_name'      => $owner['company']          ?? '',
        'ntn'               => $owner['ntn']              ?? '',
        'secp_no'           => $owner['secp']             ?? '',
        'years_in_business' => nullableInt($owner['yrs']  ?? null),
        'website'           => $owner['web']              ?? '',
        'notes'             => $owner['notes']            ?? '',
        'status'            => $data['status']            ?? 'Available',
        'images'            => isset($data['images']) ? json_encode($data['images']) : '[]',
    ];
}
