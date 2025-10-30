<?php
/**
 * Instalador automático de base de datos
 * La Calaverita de Juan
 * 
 * Ejecuta este archivo UNA VEZ para crear la base de datos y tabla
 * URL: http://localhost/la_calaverita_de_juan/install_db.php
 */

$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'calaverita_db';

echo "<!DOCTYPE html>";
echo "<html lang='es'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<title>Instalador - La Calaverita de Juan</title>";
echo "<style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    h1 { color: #8B4789; }
    .success { color: green; padding: 10px; background: #d4edda; border: 1px solid green; margin: 10px 0; }
    .error { color: red; padding: 10px; background: #f8d7da; border: 1px solid red; margin: 10px 0; }
    .info { color: blue; padding: 10px; background: #d1ecf1; border: 1px solid blue; margin: 10px 0; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    .btn { display: inline-block; padding: 10px 20px; background: #FF6B35; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
</style>";
echo "</head>";
echo "<body>";

echo "<h1>🎃 Instalador de Base de Datos - La Calaverita de Juan</h1>";

try {
    // Paso 1: Conectar a MySQL
    echo "<h2>Paso 1: Conectando a MySQL...</h2>";
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<div class='success'>✅ Conexión a MySQL exitosa</div>";
    
    // Paso 2: Crear base de datos
    echo "<h2>Paso 2: Creando base de datos...</h2>";
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    $pdo->exec($sql);
    echo "<div class='success'>✅ Base de datos '$dbname' creada (o ya existía)</div>";
    
    // Paso 3: Seleccionar base de datos
    $pdo->exec("USE $dbname");
    echo "<div class='success'>✅ Base de datos seleccionada</div>";
    
    // Paso 4: Crear tabla
    echo "<h2>Paso 3: Creando tabla 'puntajes'...</h2>";
    $sql = "CREATE TABLE IF NOT EXISTS puntajes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        puntos INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_puntos (puntos DESC),
        INDEX idx_fecha (fecha DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($sql);
    echo "<div class='success'>✅ Tabla 'puntajes' creada (o ya existía)</div>";
    
    // Paso 5: Insertar datos de prueba
    echo "<h2>Paso 4: Insertando datos de prueba...</h2>";
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM puntajes");
    $result = $stmt->fetch();
    
    if ($result['total'] == 0) {
        $sql = "INSERT INTO puntajes (nombre, puntos) VALUES 
            ('Juan Pérez', 150),
            ('María García', 180),
            ('Carlos López', 120),
            ('Ana Martínez', 200),
            ('Luis Rodríguez', 90)";
        $pdo->exec($sql);
        echo "<div class='success'>✅ Datos de prueba insertados (5 registros)</div>";
    } else {
        echo "<div class='info'>ℹ️ Ya existen {$result['total']} registros en la tabla</div>";
    }
    
    // Paso 6: Verificar instalación
    echo "<h2>Paso 5: Verificando instalación...</h2>";
    $stmt = $pdo->query("SELECT nombre, puntos, fecha FROM puntajes ORDER BY puntos DESC LIMIT 5");
    $scores = $stmt->fetchAll();
    
    echo "<div class='success'>✅ Top 5 puntajes actuales:</div>";
    echo "<table border='1' cellpadding='10' style='width: 100%; border-collapse: collapse;'>";
    echo "<tr style='background: #8B4789; color: white;'><th>Posición</th><th>Nombre</th><th>Puntos</th><th>Fecha</th></tr>";
    
    foreach ($scores as $index => $score) {
        echo "<tr>";
        echo "<td>#" . ($index + 1) . "</td>";
        echo "<td>" . htmlspecialchars($score['nombre']) . "</td>";
        echo "<td><strong>" . $score['puntos'] . "</strong></td>";
        echo "<td>" . $score['fecha'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<h2>🎉 ¡Instalación Completada Exitosamente!</h2>";
    echo "<div class='success'>";
    echo "<p><strong>La base de datos está lista para usar.</strong></p>";
    echo "<p>Ahora puedes:</p>";
    echo "<ul>";
    echo "<li>Jugar: <a href='public/index.html' class='btn'>🎮 Ir al Juego</a></li>";
    echo "<li>Probar conexión: <a href='test_db.php' class='btn'>🔍 Test de Conexión</a></li>";
    echo "<li>Ver backend: <a href='backend/get_scores.php' class='btn'>📊 Ver Puntajes (JSON)</a></li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<div class='info'>";
    echo "<h3>⚠️ Importante:</h3>";
    echo "<p>Por seguridad, considera eliminar este archivo (install_db.php) después de la instalación.</p>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Error durante la instalación</h2>";
    echo "<p><strong>Mensaje:</strong> " . $e->getMessage() . "</p>";
    echo "<h3>Posibles soluciones:</h3>";
    echo "<ul>";
    echo "<li>Verifica que MySQL esté corriendo en XAMPP</li>";
    echo "<li>Verifica que el usuario sea 'root' sin contraseña</li>";
    echo "<li>Asegúrate de que el puerto 3306 esté disponible</li>";
    echo "<li>Revisa los logs de MySQL en XAMPP</li>";
    echo "</ul>";
    echo "</div>";
}

echo "<hr>";
echo "<p style='text-align: center; color: #666;'>La Calaverita de Juan - Instalador de Base de Datos v1.0</p>";
echo "</body>";
echo "</html>";
?>
