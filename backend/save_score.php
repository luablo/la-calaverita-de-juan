<?php
require_once 'db_config.php';

// Obtener datos del POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar datos
if (!isset($data['nombre']) || !isset($data['puntos'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Datos incompletos'
    ]);
    exit();
}

$nombre = trim($data['nombre']);
$puntos = intval($data['puntos']);

// Validar nombre
if (empty($nombre) || strlen($nombre) > 50) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Nombre inválido'
    ]);
    exit();
}

// Validar puntos
if ($puntos < 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Puntos inválidos'
    ]);
    exit();
}

// Obtener avatar (opcional)
$avatar = isset($data['avatar']) ? $data['avatar'] : null;

try {
    // Insertar puntaje en la base de datos
    $stmt = $pdo->prepare("INSERT INTO puntajes (nombre, puntos, avatar) VALUES (:nombre, :puntos, :avatar)");
    $stmt->execute([
        ':nombre' => $nombre,
        ':puntos' => $puntos,
        ':avatar' => $avatar
    ]);
    
    $id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Puntaje guardado exitosamente',
        'id' => $id,
        'nombre' => $nombre,
        'puntos' => $puntos,
        'avatar' => $avatar ? 'guardado' : 'sin avatar'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar el puntaje',
        'error' => $e->getMessage()
    ]);
}
?>
