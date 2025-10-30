<?php
// Configuración de la base de datos para XAMPP
$host = 'localhost';
$dbname = 'calaverita_db';
$username = 'root';
$password = ''; // Por defecto XAMPP no tiene contraseña

// Configurar headers para CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Intentar conexión
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    // Log del error
    error_log("Error de conexión DB: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos. Verifica que MySQL esté corriendo y que la base de datos "calaverita_db" exista.',
        'error' => $e->getMessage(),
        'hint' => 'Ejecuta test_db.php para diagnosticar el problema'
    ]);
    exit();
}
?>
