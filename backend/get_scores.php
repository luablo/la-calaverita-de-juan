<?php
require_once 'db_config.php';

try {
    // Obtener los mejores puntajes (top 10)
    $stmt = $pdo->prepare("
        SELECT nombre, puntos, fecha 
        FROM puntajes 
        ORDER BY puntos DESC, fecha DESC 
        LIMIT 10
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
