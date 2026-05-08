<?php
// ============================================================
// AJK Real Estate — Environment + Database Configuration
// backend/config/database.php
// ============================================================

/**
 * Parse a .env file into key-value pairs.
 * Searches from project root upward.
 */
function loadEnv(): void {
    // Look for .env in project root (2 levels up from backend/config/)
    $envPath = dirname(__DIR__, 2) . '/.env';

    if (!file_exists($envPath)) {
        // .env not found — use defaults (XAMPP local defaults)
        return;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        // Skip comments and blank lines
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (!str_contains($line, '=')) continue;

        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value);

        // Strip surrounding quotes if present
        if (preg_match('/^(["\']).*\1$/', $value)) {
            $value = substr($value, 1, -1);
        }

        // Set as environment variable and $_ENV
        if (!array_key_exists($key, $_ENV)) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

// Load .env on every request
loadEnv();

// ── Pull config (with sensible XAMPP defaults) ───────────────
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_NAME', getenv('DB_NAME') ?: 'ajkrealstate');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('APP_ENV', getenv('APP_ENV') ?: 'development');

/**
 * Returns a connected, charset-configured MySQLi instance.
 * Sends a JSON 500 error and exits on failure.
 */
function getDBConnection(): mysqli {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    $conn->set_charset('utf8mb4');

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Database connection failed.',
            'hint'  => APP_ENV === 'development'
                       ? 'Check DB_HOST / DB_USER / DB_PASS / DB_NAME in your .env file.'
                       : 'Please contact the administrator.',
        ]);
        exit();
    }

    return $conn;
}
