<?php
// ============================================================
// AJK Real Estate — Appointments Route
// backend/routes/appointments.php
// ============================================================
require_once __DIR__ . '/../helpers/functions.php';

function handleGetAppointments(mysqli $conn): void {
    $result = $conn->query('SELECT * FROM appointments ORDER BY appt_date ASC, appt_time ASC');
    $rows   = [];
    while ($row = $result->fetch_assoc()) $rows[] = $row;
    sendJSON($rows);
}

function handleCreateAppointment(mysqli $conn): void {
    $d = getJSONBody();
    if (empty($d['visitor_name']) || empty($d['appt_date']))
        sendJSON(['error' => 'visitor_name and appt_date are required'], 400);

    $stmt = $conn->prepare("INSERT INTO appointments
        (visitor_name,phone,property_id,property_ref,appt_date,appt_time,status,notes)
        VALUES (?,?,?,?,?,?,?,?)");
    $vname   = $d['visitor_name'];
    $phone   = $d['phone']        ?? '';
    $prop_id = nullableInt($d['property_id'] ?? null);
    $prop_ref= $d['property_ref'] ?? '';
    $date    = $d['appt_date'];
    $time    = $d['appt_time']    ?? '';
    $status  = $d['status']       ?? 'Pending';
    $notes   = $d['notes']        ?? '';
    $stmt->bind_param('ssisssss', $vname, $phone, $prop_id, $prop_ref, $date, $time, $status, $notes);
    if ($stmt->execute()) sendJSON(['id' => $stmt->insert_id, 'message' => 'Appointment saved']);
    else sendJSON(['error' => $stmt->error], 500);
}

function handleUpdateAppointment(mysqli $conn, int $id): void {
    $d      = getJSONBody();
    $status = $d['status'] ?? 'Pending';
    $notes  = $d['notes']  ?? '';
    $stmt   = $conn->prepare('UPDATE appointments SET status=?, notes=? WHERE id=?');
    $stmt->bind_param('ssi', $status, $notes, $id);
    if ($stmt->execute()) sendJSON(['message' => 'Appointment updated']);
    else sendJSON(['error' => $stmt->error], 500);
}

function handleDeleteAppointment(mysqli $conn, int $apptId): void {
    $stmt = $conn->prepare('DELETE FROM appointments WHERE id=?');
    $stmt->bind_param('i', $apptId);
    if ($stmt->execute()) sendJSON(['message' => 'Appointment deleted']);
    else sendJSON(['error' => $stmt->error], 500);
}
