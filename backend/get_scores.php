<?php
require_once 'db_config.php';

try {
    // Obtener los mejores puntajes (top 50 para mostrar más en ranking)
    $stmt = $pdo->prepare("
        SELECT nombre, puntos, avatar, fecha 
        FROM puntajes 
        ORDER BY puntos DESC, fecha DESC 
        LIMIT 50
    ");
    $stmt->execute();
    
    $scores = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'scores' => $scores,
        'total' => count($scores)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener los puntajes',
        'error' => $e->getMessage()
    ]);
}
?>
