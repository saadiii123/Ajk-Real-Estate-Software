<?php
// ============================================================
// AJK Real Estate — Main API Entry Point
// api.php  (project root, next to index.html)
// ============================================================

error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once __DIR__ . '/backend/config/database.php';
require_once __DIR__ . '/backend/helpers/functions.php';
require_once __DIR__ . '/backend/routes/properties.php';
require_once __DIR__ . '/backend/routes/appointments.php';
require_once __DIR__ . '/backend/routes/stats.php';

$conn   = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$uri    = $_SERVER['REQUEST_URI'];
$route  = parseRoute($uri);
$id     = $route['id'];
$action = $route['action'];

// ── /api.php/appointments ─────────────────────────────────────
if (preg_match('#/api\.php/appointments#', $uri)) {
    if ($method === 'GET')    handleGetAppointments($conn);
    if ($method === 'POST')   handleCreateAppointment($conn);
    if ($method === 'PUT'  && preg_match('#/appointments/(\d+)#', $uri, $m)) handleUpdateAppointment($conn, (int)$m[1]);
    if ($method === 'DELETE' && preg_match('#/appointments/(\d+)#', $uri, $m)) handleDeleteAppointment($conn, (int)$m[1]);
    sendJSON(['error' => 'Invalid appointments request'], 400);
}

// ── /api.php/leads ────────────────────────────────────────────
if (preg_match('#/api\.php/leads#', $uri)) {
    if ($method === 'GET')    handleGetLeads($conn);
    if ($method === 'POST')   handleCreateLead($conn);
    if ($method === 'PUT'  && preg_match('#/leads/(\d+)#', $uri, $m)) handleUpdateLead($conn, (int)$m[1]);
    if ($method === 'DELETE' && preg_match('#/leads/(\d+)#', $uri, $m)) handleDeleteLead($conn, (int)$m[1]);
    sendJSON(['error' => 'Invalid leads request'], 400);
}

// ── GET ?action=stats ─────────────────────────────────────────
if ($method === 'GET' && ($_GET['action'] ?? '') === 'stats') {
    handleGetStats($conn);
}

// ── Properties CRUD ───────────────────────────────────────────
match (true) {
    $method === 'GET'
        => handleGetProperties($conn, $id),

    $method === 'POST'
        => handleCreateProperty($conn),

    $method === 'PUT' && $id !== null
        => handleUpdateProperty($conn, $id),

    $method === 'PATCH' && $id !== null && $action === 'status'
        => handlePatchStatus($conn, $id),

    $method === 'PATCH' && $id !== null && $action === 'featured'
        => handlePatchFeatured($conn, $id),

    $method === 'DELETE' && $id !== null
        => handleDeleteProperty($conn, $id),

    default => sendJSON(['error' => 'Invalid request'], 400),
};
